const Eos = require('eosjs')
require('dotenv').config()

// const EosAPI = require('eosjs-api')

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
// const eosReadOnly = EosAPI(config)

const options = {
  authorization: 'fromUserID@active',
  broadcast: true,
  sign: true
}

eos.transfer('fromUserID', 'toUserID', '0.2500 EOS', 'this is MEMO', options)
