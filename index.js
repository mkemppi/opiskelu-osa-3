require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.json()) 
app.use(express.static('build'))
//app.use(morgan('tiny'))
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors())

const Person = require('./models/person')


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

//app.get('/', (req, res) => {
//  res.send('<h1>Puhelinluettelo!</h1>')
//})
/*
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
*/

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.get('/api/persons', (req, res) => {
  //res.json(persons)
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  var d = new Date();
  res.send('<p>Puhelinluettelossa on '+persons.length+' tietuetta.</p><p>'+d.toString()+'</p>')
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})
/*
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log("req",body)
  if (body.name==="" || body.phone==="") {
    if(body.name==="") {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if(body.phone==="") {
      return response.status(400).json({ 
        error: 'phone missing' 
      })
    }
  }
*/
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (body.phone === undefined) {
    return response.status(400).json({ error: 'phone number missing' })
  }
  const person = new Person({
    name: body.name,
    phone: body.phone,
  })
  
  const check = persons.find(p => p.name === body.name) 
  if(check) {
    return response.status(400).json({ 
      error: 'name already in phonebook' 
    })
  }

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

