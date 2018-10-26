/**
 * Get EOS Account Info
 */

var mysql = require('mysql2/promise')

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
  // A-0: Check DB Connection √
  let dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true
  }
  console.log(dbConfig)
  const dbConn = await mysql.createConnection(dbConfig)
  console.log('DB Connected √')

  let length = await getMaxBlockSeq()
  console.log('length: ', length)
  let pos = 245401
  let offset = 99

  while (1) {
    console.log('in Loop | Pos: ', pos, ' - offset: ', offset)
    if (pos >= length) { break }
    let currentHistory = await eos.getActions('fairdicegame', pos, offset)
    let txs = currentHistory.actions

    // CurrentLoop
    let dbArray = []
    for (let i = 0; i < txs.length; i++) {
      let tx = txs[i]
      let txContent = tx.action_trace.act.data
      // console.log(tx.account_action_seq)
      // console.log(txContent)

      // if receipts

      if (txContent.result !== undefined) {
        let result = txContent.result
        result.account_action_seq = tx.account_action_seq
        result.createdAt = new Date().toLocaleString()
        // console.log(result)
        dbArray.push(result)
      }
    }
    if (dbArray.length < 1) { continue }
    let output = await saveFairDiceDB(dbArray, dbConn)
    console.log('saved')

    pos += offset + 1
  }
}

async function getMaxBlockSeq () {
  let lastHistory = await eos.getActions('fairdicegame', -1, -1) // MAX Offset 100
  let txs = lastHistory.actions

  let tx = txs[0]
  console.log(tx.account_action_seq)
  if (tx.account_action_seq === undefined) { return 0 }
  return tx.account_action_seq
}

var saveFairDiceDB = async (rowData, dbConn) => {
  let formedData = []
  let keysArray
  for (var i = 0; i < rowData.length; i++) {
  // for (var i = 0; i < 3; i++) { // TEST_CODE
      // Mapping values
    let row = rowData[i]

      // prepare key arrays - add createdAt
    keysArray = Object.keys(row)
    // console.log(keysArray)

    formedData.push(Object.values(row))
  }
  let query = 'INSERT INTO `game_fairdice_stats` (' + keysArray.join(', ') + ') VALUES ?;'
  try {
    let output = await dbConn.query(query, [formedData])
  //   console.log(output)
  } catch (e) {
    console.log(e)
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
