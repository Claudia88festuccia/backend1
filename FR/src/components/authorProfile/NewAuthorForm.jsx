import { useState } from "react"
import { Form, Button, Container, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const NewAuthorForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    birthDate: "",
  })
  const [avatar, setAvatar] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => data.append(key, value))
    if (avatar) data.append("avatar", avatar)

    try {
      const res = await fetch(`${process.env.REACT_APP_APIURL}/authors`, {
        method: "POST",
        body: data,
      })

      if (!res.ok) throw new Error("Errore nella creazione dell'autore")
      const created = await res.json()
      alert("Autore creato con successo!")
      navigate("/authors")
    } catch (err) {
      console.error(err)
      setError("Errore durante la creazione dell'autore.")
    }
  }

  return (
    <Container className="mt-5"style={{ marginTop: "80px" }} >
      <h2>Nuovo Autore</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control name="nome" value={formData.nome} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Cognome</Form.Label>
          <Form.Control name="cognome" value={formData.cognome} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Data di nascita</Form.Label>
          <Form.Control type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Avatar (opzionale)</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} />
        </Form.Group>
        <Button type="submit" className="mt-3">Crea Autore</Button>
      </Form>
    </Container>
  )
}

export default NewAuthorForm
