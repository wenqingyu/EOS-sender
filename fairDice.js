const Eos = require('eosjs')
require('dotenv').config()
const axios = require('axios')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')
const adapter = new FileSync('db/eosbetDistribution.json')
const db = low(adapter)

const EosAPI = require('eosjs-api')

// Default configuration
const config = {
  chainId: process.env.CHAIN_ID, // 32 byte (64 char) hex string
  keyProvider: [process.env.PRIVATE_KEY], // WIF string or array of keys..
  httpEndpoint: process.env.HTTP_ENDPOINT,
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
}

const readOnlyConfig = {
  chainId: process.env.CHAIN_ID, // 32 byte (64 char) hex string
  keyProvider: [process.env.PRIVATE_KEY], // WIF string or array of keys..
  httpEndpoint: 'https://api1.eosasia.one',
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
}
const eos = Eos(config)
const eosReadOnly = EosAPI(readOnlyConfig)

const options = {
  authorization: 'wenqingyu222@active',
  broadcast: true,
  sign: true
}

let fairContract = 'fairdicegame'
let account = 'wenqingyu222'
let initAmt = 0.1
let currentAmt = 0.1
let cap = 1

// pivot speculation
let pivotScore = 0
let pivotCount = 0
let pivotCap = 2

// Good time prediction
let payoutRate = 1

async function main () {
  while (1) {
    let result = await bet()
    console.log('FairDice - Main result: ', result)

    console.log('Payout Rate: ', payoutRate)
    if (result) { // WINNING
      console.log('Winning: ', currentAmt)
      currentAmt = initAmt
    } else { // LOST
      console.log('Lost: ', currentAmt, ' | increasing to: ', currentAmt * 2)
      currentAmt = currentAmt * 2
      console.log('sleep: ', currentAmt * 1000)
      await sleep(currentAmt * 1000)

      // REACH CAP, PIVOT SPECULATION
      if (currentAmt > cap) { // pivot speculation triggered
        // set pivotScore to 0
        pivotScore = 0
        pivotCount = 0
        console.log('Pivot specutation started . . .')
        await pivotSpeculation()
        console.log('Pivot specutation End . . .', pivotScore)
        console.log('\n--------------------------------')
        if (pivotScore > 0) {
          currentAmt = initAmt // reset
          console.log('pivot success, continue')
          continue
        } else {
          console.log('pivot failed, pivotScore: ', pivotScore, 'pivotCount: ', pivotCount)
          console.log('currentAmt: ', currentAmt, ' | Manual decision needed ! ! !')
          break
        }
      }
    }
  }
}

async function bet () {
  let betAmt = currentAmt.toFixed(4) + ' EOS'
  let isWin = false
  console.log('\n', betAmt, ' | ', new Date().toLocaleString())
  let memo = '50-a30ce269c3f3918c829f3ef392e616f48113fd6550eb6707ccf7d128da653a4c-66d7d1141847d129b439a16d7d163bc8e081bdc6-1540361566-fairdicegame-SIG_K1_K1oXCZipnhVzqC5pfGXb5NegxtA54y56wkDiremWbyvTNRHYEd23J8QWdL3GefqsD7iS29NCdF7hA1GxLjCcueR8x5rGyL'
  let betting = await eos.transfer(account, fairContract, betAmt, memo, options)
  // console.log(betting)
  // let info = betting.processed.action_traces[0]
  // console.log('bet_id: ', info.act.data)
  console.log('Request send!')
  isWin = await isWinningCheck('wenqingyu222')
  // console.log(isWin)
  // await sleep(10000)
  return isWin
}

/**
 *
 */
async function pivotSpeculation () {
  if (pivotScore < (pivotCap) * (-1)) { return false }
  console.log('In speculation - count: ', pivotCount, ' | Score: ', pivotScore)
  if (pivotScore > 0) { // Speculate secceed, return
    return true
  } else {
    let output = await bet()
    pivotCount++ // update Count
    // update score
    if (output) { pivotScore++ } else { pivotScore-- }
    await pivotSpeculation()
    return output
  }
}

async function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// check if last bet is winning
var isWinningCheck = async (account) => {
  let history = await eosReadOnly.getActions('wenqingyu222', -1, -5) // MAX Offset 100
  let actions = history.actions
  // console.log(actions)

  for (let i = 0; i < actions.length; i++) {
    let a = actions[i]
    let data = a.action_trace.act.data
    if (data.bet_id !== undefined) {
      if (data.bet_amt !== (currentAmt.toFixed(4) + ' EOS')) {
        // If not the current bet, continue
        continue
      }

      if (data.random_roll < data.roll_under) { // Check if winning
        console.log('bet_id: ', data.bet_id, ' - Winning √')

        // PAYOUT RATE CALCULATE
        let payout = Number(data.payout.substring(-4))
        payoutRate = data.payout / currentAmt
        console.log('payout: ', payout, payoutRate)
        // if (data.payout < currentAmt * 2) { console.log('Warning: Payout under double, not good time ! ! !') }

        return true
      } else {
        console.log('bet_id: ', data.bet_id, ' - Lost X')
        return false
      }
    }
  }
  console.log('PENDING', new Date().toLocaleString(), ' - currentAmt: ', currentAmt)
  await sleep(2000)
  let output = await isWinningCheck(account)
  return output
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
