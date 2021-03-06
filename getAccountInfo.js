/**
 * Get EOS Account Info
 */

const Eos = require('eosjs')
require('dotenv').config()
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

const eos = Eos(config)
const eosReadOnly = EosAPI(config)

// const options = {
//   authorization: 'fromUserID@active',
//   broadcast: true,
//   sign: true
// }

// eos.transfer('fromUserID', 'toUserID', '0.2500 EOS', 'this is MEMO', options)

async function main () {
  let history = await eos.getActions('wenqingyu222', -1, -4) // MAX Offset 100
  let actions = history.actions
  console.log(history)

  // for (let i = 0; i < actions.length; i++) {
  //   let a = actions[i]
  //   let data = a.action_trace.act.data
  //   console.log(data)
  // }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
