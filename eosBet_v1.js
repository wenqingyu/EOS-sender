/**
 * eosBet_v1:
 * This one is simply implementation of JamieScore Pivoting
 * JamieScore start with 0
 * win -> JamieScore ++
 * lost -> JamieScore --
 * If JamieScore become positive -> lost recovered
 * If JamieScore become -N means lost of N time
 * Ground on our assumption, when JamieScore be a relatively big negative, it is time to play big bet (manually), hopefully!
 */

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

let betDiceContract = 'eosbetdice11'
let account = 'wenqingyu222'
let initAmt = 0.1 // Params A: start with this amount to run JamieScore pivoting
let currentAmt = initAmt
let cap = 0.9 // Params B: Not using

// pivot speculation
let pivotScore = 0
let pivotCount = 0
let pivotCap = 6

// Good time prediction
let payoutRate = 1

async function main () {
  let jamieScore = 0
  while (1) {
    let result = await bet()
    console.log('Main result: ', result)

    if (result) { // WINNING
      jamieScore++
      console.log('Winning: ', currentAmt, ' | JamieScore: ', jamieScore)
      currentAmt = initAmt
    } else { // LOST
      console.log('Lost: ', currentAmt, ' | increasing to: ', currentAmt * 2)
      jamieScore--
      console.log('Winning: ', currentAmt, ' | JamieScore: ', jamieScore)
    }
  }
}

async function bet () {
  let betAmt = currentAmt.toFixed(4) + ' EOS'
  let isWin = false
  console.log('\n', betAmt, ' | ', new Date().toLocaleString())
  let betting = await eos.transfer(account, betDiceContract, betAmt, '50-bpdappincome-', options)
  // console.log(betting)
  // let info = betting.processed.action_traces[0]
  // console.log('bet_id: ', info.act.data)
  await sleep(2000)
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
