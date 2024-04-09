import { useState } from 'react'
import { useEffect } from 'react'
import numberService from './services/numbers'

const Numbers = ({ handleDelete, persons }) => {
  return (
    <ul>
    {persons.map((person, i) => <li key={i}>{person.name}: <b>{person.number}</b><button onClick={() => handleDelete(person.id)}>Delete</button></li>)}
    </ul>
  )

}

const Filter = (props) => {
  return (
    <>
    Filter: <input value={props.newFilter} onChange={props.handleChangeFilter} />
    </>
  )
}

const Form = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        Name: <input value={props.newName} onChange={props.handleChangeName} />
      </div>
      <div>
        Number: <input value={props.newPhone} onChange={props.handleChangePhone}/>
      </div>
      <div>
        <button type="submit" >add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { }
  ]) 
  const [filteredPersons, setFilteredPersons] = useState([
    { }  
  ])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    numberService.getAll().then( initialNumbers => {
      setPersons(initialNumbers.data)
    })
  }, [])
  const handleDelete = (id) => {
    const personToRemove = persons.find(person=>person.id === id)
    if(window.confirm(`Delete ${personToRemove.name}?`)) { 
      numberService
        .deleteNumber(id)
        .then(initialValue => {
          setPersons(persons.filter(person=>person.id !== id))
        })
      }
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (newName != '' && newPhone != '') {
    const aux_name = {
      name: newName,
      number: newPhone,
    }
    if (persons.some((person) => person.name === aux_name.name)) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      numberService.create(aux_name)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewPhone('')
      })
    }
    }
  }
  const handleChangeName = (event) => {
    setNewName(event.target.value)
  }
  const handleChangePhone = (event) => {
    setNewPhone(event.target.value)
  }
  const handleChangeFilter = (event) => {
    setNewFilter(event.target.value)
    if (newFilter !== '') {
      const aux = persons.filter((person) => {
        return Object.values(person).join('').includes(newFilter)
      })
      setFilteredPersons(aux)
    }
    else {
      setFilteredPersons(persons)
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleChangeFilter={handleChangeFilter} newFilter={newFilter}></Filter>
      <h2>Add contact</h2>
      <Form newName={newName} newPhone={newPhone} handleSubmit={handleSubmit} handleChangeName={handleChangeName} handleChangePhone={handleChangePhone}></Form>
      <h2>Numbers</h2>
      <Numbers handleDelete={handleDelete} persons={newFilter.length >= 1 ? filteredPersons : persons}></Numbers>
    </div>
  )
}

export default App