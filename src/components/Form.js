import { useState, useEffect } from 'react'
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import db from "../firebase/db"
import useValidation from './useValidation'

import Input from './Input'
import Select from './Select'
import Textarea from './Textarea'

export default function Form({ id = null }) {
  const categories = ["múzeum", "étterem", "építmény"]
  const reportFormValidity = useValidation();

  const initalValues = {
    name: '',
    settlement: '',
    address: '',
    category: '',
    price: 0,
    note: ''
  }

  const [formData, setFormData] = useState(initalValues)
  const [errorMessages, setErrorMessages] = useState({})
  const [wasValidated, setWasValidated] = useState(false)
  const [alert, setAlert] = useState({ text: '', type: '' })

  useEffect(() => {
    if (id) {
      const docRef = doc(db, 'attractions', id)
      getDoc(docRef).then(docSnap => {
        setFormData(docSnap.data())
      })
    }
  }, [id])

  function handleSubmit(event) {
    event.preventDefault()
    const formIsValid = reportFormValidity(formData, setErrorMessages)
    setWasValidated(true)

    if (formIsValid) {
      const data = {
        name: formData.name,
        settlement: formData.settlement,
        address: formData.address,
        category: formData.category,
        price: parseInt(formData.price ? formData.price : 0),
        note: formData.note
      }
      if (id) {
        updateDoc(doc(db, 'attractions', id), data)
      } else {
        addDoc(collection(db, 'attractions'), data)
      }

      setFormData(initalValues)
      setErrorMessages({})
      setWasValidated(false)

      setAlert({ text: 'Sikeres mentés', type: 'success' })
    } else {
      setAlert({ text: 'Sikertelen mentés', type: 'danger' })
    }
  }

  const handleChange = ({ target: { name, value } }) => {
    setFormData(data => ({
      ...data,
      [name]: value
    }))
  }

  return (
    <main className='container mt-3'>
      <h1>Új látványosság felvitele</h1>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          name='name'
          label='Megnevezés'
          handleChange={handleChange}
          errorMessages={errorMessages.name}
          wasValidated={wasValidated}
          value={formData.name}
        />

        <Input
          name='settlement'
          label='Település'
          handleChange={handleChange}
          errorMessages={errorMessages.settlement}
          wasValidated={wasValidated}
          value={formData.settlement}
        />

        <Input
          name='address'
          label='Cím'
          handleChange={handleChange}
          errorMessages={errorMessages.address}
          wasValidated={wasValidated}
          value={formData.address}
        />

        <Select
          name='category'
          label='Kategória'
          handleChange={handleChange}
          errorMessages={errorMessages.category}
          wasValidated={wasValidated}
          value={formData.category}
        >
          <option value=''>Válassz!</option>
          {categories.map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>

        <Input
          type='number'
          name='price'
          handleChange={handleChange}
          label='Ár'
          errorMessages={errorMessages.price}
          wasValidated={wasValidated}
          value={formData.price}
        />

        <Textarea
          name='note'
          handleChange={handleChange}
          label='Megjegyzés'
          errorMessages={errorMessages.note}
          wasValidated={wasValidated}
          value={formData.note}
        />

        <button className='btn btn-primary mb-3'>Mentés</button>
        {alert.text && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}
      </form>
    </main>
  )
}
