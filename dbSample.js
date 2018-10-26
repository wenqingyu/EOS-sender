require('dotenv').config()
const Datastore = require('nedb')

let db = {}
db.distribution = new Datastore('db/eosbetDistribution.db')
db.distribution.loadDatabase()

async function main () {
  let content = {
    time: new Date().toLocaleString(),
    currentAmt: 10

  }
  let output = await db.distribution.insert(content, () => {

  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
