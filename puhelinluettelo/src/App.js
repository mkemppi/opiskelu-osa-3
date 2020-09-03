import React, { useState,useEffect } from 'react'
import personService from './services/person'

const Filter = (props) => {
  return (
    <div>
      Hae: <input onChange={props.handleSearchChange} />
    </div>
  )
}

const Persons = (props) => {
  const { personsToShow, setPersons, setMessage } = props
  return (
    personsToShow.map(person => 
      <Person 
        key={person.name} 
        persons={personsToShow} 
        person={person} 
        setPersons={setPersons} 
        setMessage={setMessage} />
    )
  )
}

const Person = (props) => {
  const { person, setPersons, persons, setMessage } = props
  const removePerson = (event) => {
    if(window.confirm("Oletko varma että haluat poistaa henkilön "+person.name)) {
      personService
      .remove(person.id)
        .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        setMessage(['error','Tiedot poistettu'])

      })
      .catch(error => {
        setPersons(persons.filter(p => p.id !== person.id))
        setMessage(['error','Tiedot oli jo poistettu ennestään'])
      })
    }
  } 
  return (
    <div>{person.name} {person.phone} <button onClick={removePerson}>Poista</button></div>
  )

}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}> 
      <div>
        Nimi: <input onChange={props.handleChange} />
      </div>
      <div>
        Puhelinnumero: <input onChange={props.handlePhoneChange} />
      </div>
      <div>
        <button type="submit">Lisää</button>
      </div>
    </form>
  )
}

const Notification = ({ message,setMessage }) => {
  if (message === null) {
    return null
  }
  setTimeout(() => {
    setMessage(null)
  }, 5000)

  return (
    <div className={message[0]}>
      {message[1]}
    </div>
  )
}



const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newPhone, setNewPhone ] = useState('')
  const [ search, setSearch ] = useState('')
  const [ message, setMessage ] = useState(null)
  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    let val = newName.toLowerCase();
    //let matches = persons.filter(test => test.name.toLowerCase().includes(val));
    const findPerson = persons.find(p => p.name.toLowerCase() === val)
    if(findPerson) {
      if(window.confirm(`${newName} on jo lisätty puhelinluetteloon, haluatko korvata vanhan numeron uudella?`)) {

        //const findPerson = persons.find(p => p.name === newName)
        const changedPerson = { ...findPerson, phone: newPhone }
        
        personService
        .update(changedPerson.id, changedPerson)
          .then(response => {
          setPersons(persons.map(person => person.name !== newName ? person : response))
        })
        
        setMessage(['success','Tiedot päivitetty'])
      }
    } else {      
      const personObject = {
        name: newName,
        phone: newPhone
      }

      personService
      .create(personObject)
        .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
      })
      .catch(error => {
        // pääset käsiksi palvelimen palauttamaan virheilmoitusolioon näin
        console.log(error.response.data)
        setMessage(['error',error.response.data])
      })

      setMessage(['success','Tiedot lisätty'])
      /*
      axios
      .post('http://localhost:3001/persons', personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
      })
      */
    }
  }

  const handleChange = (event) => {
    setNewName(event.target.value)
  }
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }
  const handleSearchChange = (event) => {
    setSearch(event.target.value) 
  }

  const personsToShow = (search==="")
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Notification message={message} setMessage={setMessage} />
      <PersonForm addPerson={addPerson} handleChange={handleChange} handlePhoneChange={handlePhoneChange} />
      <h2>Numerot</h2>
      <Filter handleSearchChange={handleSearchChange} />
      <Persons personsToShow={personsToShow} setPersons={setPersons} setNewName={setNewName} setMessage={setMessage} />
    </div>
  )

}

export default App