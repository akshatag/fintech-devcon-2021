var express = require('express');
var router = express.Router();
const path = require('path')

var Vault = require(path.join(__dirname + '/../vault.js'))
const vault = new Vault();

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../views/insert.html'));
});

router.post('/insert', async function(req, res, next) {
  var cardHolder = req.body.cardHolder;
  var cardNumber = req.body.cardNumber;
  var expiryDate = req.body.expiryDate;
  var cvv = req.body.cvv

  if(cardHolder.length == 0 || expiryDate.length == 0 || cvv.length == 0) {
    res.render('formError', {message: "Form error: One or more fields were empty"})
  } else if(cardNumber.length != 16) {
    res.render('formError', {message: "Form error: Card number must be 16 digits"})
  } else {
    var insert = await vault.insert(cardHolder, cardNumber, expiryDate)
    res.json(insert)
  }
})

router.get('/all', async function(req, res, next) {
  cards = await vault.get();
  res.render('table', {cards: cards})
})


router.get('/detokenize/:token', async function(req, res, next) {
  var vault = new Vault();
  value = await vault.detokenize(req.params.token)
  res.json({value: value})
})



module.exports = router;