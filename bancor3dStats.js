/**
 * Get Bancor3D historical transactions
 * not finished yet
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

async function main () {
  let history = await eos.getActions('bancor3dcode', -1, -4) // MAX Offset 100
  let txs = history.actions
  // console.log(txs)

  for (let i = 0; i < txs.length; i++) {
    let tx = txs[i]
    let data = tx.action_trace
    console.log(data.act.data)
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
