 import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap"
import { authFetch } from "../../utils/auth"


const EditAuthor = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    birthDate: "",
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const token=localStorage.getItem("token")

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await authFetch(`${process.env.REACT_APP_APIURL}/authors/${id}`)
        if (!res.ok) throw new Error("Errore nel caricamento dell'autore")
        const data = await res.json()
        setFormData({
          nome: data.nome || "",
          cognome: data.cognome || "",
          email: data.email || "",
          password: "", // non lo mostriamo, ma lo permettiamo di aggiornare
          birthDate: data.birthDate || "",
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAuthor()
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await authFetch(`${process.env.REACT_APP_APIURL}/authors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Errore nell'aggiornamento")
      alert("Autore aggiornato con successo!")
      navigate("/authors")
    } catch (err) {
      console.error(err)
      setError("Errore durante l'aggiornamento")
    }
  }

  if (loading) return <Spinner animation="border" className="m-5" />

  return (
    <Container className="mt-5">
      <h2>Modifica Autore</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
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
          <Form.Label>Password (lascia vuoto per non cambiarla)</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Data di nascita</Form.Label>
          <Form.Control type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
        </Form.Group>
        <Button type="submit" className="mt-3">Salva modifiche</Button>
      </Form>
    </Container>
  )
}

export default EditAuthor
