const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.yjffb.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  phone: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Mikko Tuomas',
  phone: '0404040040440',
})
//console.log(name)
if(!name) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(response => {
    console.log('Person '+name+' '+phone+' saved to phonebook!')
    mongoose.connection.close()
  })
      
}


