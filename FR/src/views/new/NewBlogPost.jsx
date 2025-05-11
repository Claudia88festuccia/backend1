import { useState } from "react"
import { Form, Button, Container, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { getToken } from "../../utils/auth"
import { authFetch } from "../../utils/auth" 

const token = getToken()


const NewBlogPost = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    readTimeValue: "",
    readTimeUnit: "minuti",
    author: "",
  })

  const [cover, setCover] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await authFetch(`${process.env.REACT_APP_APIURL}/posts`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // usa il token JWT
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          content: formData.content,
          author: formData.author,
          readTime: {
            value: formData.readTimeValue,
            unit: formData.readTimeUnit,
          },
        }),
      })

      if (!res.ok) throw new Error("Errore nella creazione del post")

      const createdPost = await res.json()

      // Se c'è una cover, fai upload con PATCH
      if (cover) {
        const coverData = new FormData()
        coverData.append("cover", cover)

        await fetch(`${process.env.REACT_APP_APIURL}/posts/${createdPost._id}/cover`, {
          method: "PATCH",
          body: coverData,
        })
      }

      alert("Post creato con successo!")
      navigate(`/blog/${createdPost._id}`)
    } catch (err) {
      console.error(err)
      setError("Errore durante la creazione del post")
    }
  }

  return (
    <Container className="mt-5" style={{ marginTop: "80px" }}>
      <h2>Nuovo Blog Post</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group>
          <Form.Label>Titolo</Form.Label>
          <Form.Control name="title" value={formData.title} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Categoria</Form.Label>
          <Form.Control name="category" value={formData.category} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Contenuto (HTML)</Form.Label>
          <Form.Control as="textarea" name="content" value={formData.content} onChange={handleChange} rows={5} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Tempo di lettura</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              name="readTimeValue"
              value={formData.readTimeValue}
              onChange={handleChange}
              type="number"
              placeholder="Numero"
              style={{ maxWidth: "100px" }}
            />
            <Form.Select name="readTimeUnit" value={formData.readTimeUnit} onChange={handleChange}>
              <option value="minuti">minuti</option>
              <option value="ore">ore</option>
            </Form.Select>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Email Autore</Form.Label>
          <Form.Control type="email" name="author" value={formData.author} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Cover (opzionale)</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} />
        </Form.Group>
        <Button type="submit" className="mt-3">Pubblica</Button>
      </Form>
    </Container>
  )
}

export default NewBlogPost


