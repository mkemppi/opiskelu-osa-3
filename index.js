const express = require('express')
const app = express()

let persons = [
  {
    id: 1,
    name: "Mikko Kemppi",
    phone: "0447481114"
  },
  {
    id: 2,
    name: "Teuvo Karjapää",
    phone: "044432432"
  },
  {
    id: 3,
    name: "Teija Tepsukka",
    phone: "05050505050"
  },
  {
    id: 4,
    name: "Kalja Kuuppanen",
    phone: "0934090909"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  var d = new Date();
  res.send('<p>Puhelinluettelossa on '+persons.length+' tietuetta.</p><p>'+d.toString()+'</p>')
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

