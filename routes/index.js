var express = require('express');
const { renameSync } = require('fs');
var router = express.Router();
const path = require('path')
var Vault = require(path.join(__dirname + '/../vault.js'))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/insert.html'));
});
router.get('/all', async function(req, res, next) {
  var vault = new Vault();
  cards = await vault.get();
  // console.log(cards)
  res.render('table', {cards: cards})
})
router.get('/detokenize/:token', async function(req, res, next) {
  var vault = new Vault();
  value = await vault.detokenize(req.params.token)
  res.json({value: value})
})
router.post('/insert', async function(req, res, next) {
  var vault = new Vault();
  var cardHolder = req.body.cardholder;
  var cardNumber = req.body.cardnumber;
  var expDate = req.body.expdate;
  console.log('params ' + cardHolder + ' ' + cardNumber)
  await vault.insert(cardHolder, cardNumber, expDate)
  res.json(true)
})
module.exports = router;