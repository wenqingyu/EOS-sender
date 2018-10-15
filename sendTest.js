// const eosjs = require('eosjs')
// const fetch = require('node-fetch')                            // node only; not needed in browsers
// const { TextDecoder, TextEncoder } = require('text-encoding')  // node, IE11 and IE Edge Browsers

// const defaultPrivateKey = '5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr' // useraaaaaaaa
// const signatureProvider = new eosjs.SignatureProvider([defaultPrivateKey])

// const rpc = new eosjs.Rpc.JsonRpc('https://api1.eosasia.one', { fetch })

// const api = new eosjs.Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

// var sender = async () => {
//   const result = await api.transact({
//     actions: [{
//       account: 'eosio.token',
//       name: 'transfer',
//       authorization: [{
//         actor: 'useraaaaaaaa',
//         permission: 'active'
//       }],
//       data: {
//         from: 'useraaaaaaaa',
//         to: 'useraaaaaaab',
//         quantity: '0.0001 SYS',
//         memo: ''
//       }
//     }]
//   }, {
//     blocksBehind: 3,
//     expireSeconds: 30
//   })
//   console.dir(result)
// }

// sender()

const Eos = require('eosjs')
const EosAPI = require('eosjs-api')

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
const eosReadOnly = EosAPI(config)

const options = {
  authorization: 'wenqingyu222@active',
  broadcast: true,
  sign: true
}

eos.transfer('wenqingyu222', 'dapprofessor', '0.2500 EOS', 'this is a 中文测试', options)
