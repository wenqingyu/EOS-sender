const Eos = require('eosjs')
// const EosAPI = require('eosjs-api')

// Default configuration
const config = {
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
  keyProvider: [''], // WIF string or array of keys..
  httpEndpoint: 'https://api1.eosasia.one',
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
}

const eos = Eos(config)
// const eosReadOnly = EosAPI(config)

const options = {
  authorization: 'wenqingyu222@active',
  broadcast: true,
  sign: true
}

eos.transfer('wenqingyu222', 'dapprofessor', '0.2500 EOS', 'this is a 中文测试', options)
