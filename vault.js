const { MongoClient } = require('mongodb');
const { uuid } = require('uuidv4');
function Vault() {
  this.client = new MongoClient("mongodb+srv://waev-root:secure_db_password@cluster0.wfqnp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
}
Vault.prototype.insert = async function (cardHolder, cardNumber, expDate) {
  var cardHolderToken = uuid()
  var cardNumberToken = uuid()
  await this.client.connect()
  const tokens = this.client.db('myVault').collection('tokens')
  const cards = this.client.db('myVault').collection('cards')
  await tokens.insertMany([
    {
      token: cardHolderToken,
      value: cardHolder
    },
    {
      token: cardNumberToken,
      value: cardNumber
    }
  ])
  await cards.insertOne({
    cardHolder: cardHolderToken,
    cardNumber: cardNumberToken,
    expiryDate: expDate
  })
  return true
}
Vault.prototype.get = async function() {
  await this.client.connect()
  const tokens = this.client.db('myVault').collection('tokens')
  const cards = this.client.db('myVault').collection('cards')
  cursor = await cards.find({})
  results = []
  await cursor.forEach(async (doc) => {
    results.push(doc)
  })
  return results
}
Vault.prototype.detokenize = async function(token) {
  await this.client.connect()
  const tokens = this.client.db('myVault').collection('tokens')
  doc = await tokens.findOne({token: token})
  if(doc) {
    return doc.value
  } else {
    return null
  }
}
// const maskCardNumber = function(cardNumber) {
//   var first4 = cardnumber.substring(0, 4);
//   var last5 = cardnumber.substring(cardnumber.length - 5);
//   mask = cardnumber.substring(4, cardnumber.length - 5).replace(/\d/g,"*");
//   console.log(first4 + mask + last5);
// }
module.exports = Vault;