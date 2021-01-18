const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()
app.use(cors())

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello Enye!'))


app.get('/api/rates', (req, res) => {
  // return error if queries are not in the request
  if (!req.query.base) {
    return res.status(400).send('<p>Hey you didn\'t input the base value, please enter it and try again</p>')
  }
  if (!req.query.currency) {
    return res.status(400).send('<p>Hey you didn\'t input the currency value, please enter it and try again</p>')
  }
  //
  const base = req.query.base
  const currency = req.query.currency
  const currArray = currency.split(',')

  if (currArray.length === 0) {
    return res.status(400).send('<p>Hey you didn\'t input the currency value, please enter it and try again</p>')
  }
  let exch1 = currArray[0] ? currArray[0] : undefined
  let exch2 = currArray[1] ? currArray[1] : undefined
  let exch3 = currArray[2] ? currArray[2] : undefined

  fetch(`https://api.exchangeratesapi.io/latest?base=${base}`).then(res => res.json()).then(data => {
    return res.status(200).json({
      "results": {
        "base": data.base,
        "date": data.date,
        "rates": {
          [exch1]: data.rates[exch1] ? data.rates[exch1] : `The currency ${exch1} was not found`,
          [exch2]: data.rates[exch2] ? data.rates[exch2] : `The currency ${exch2} was not found`,
          [exch3]: data.rates[exch3] ? data.rates[exch3] : `The currency ${exch3} was not found`,
        }
      }
    });
  }).catch(err => {
    console.log(err)
    return res.status(400).json('The base currency does not exist, please check and try again')
  })

})


app.listen(3000, () => console.log('enye express app listening on port 3000!'))