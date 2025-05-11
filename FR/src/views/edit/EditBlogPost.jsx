import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Form, Button, Container, Alert, Spinner, Image } from "react-bootstrap"
import { getToken, authFetch } from "../../utils/auth"
import CoverUploader from "../../components/avatarUploader/CoverUploader"

const EditBlogPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = getToken()

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    readTimeValue: "",
    readTimeUnit: "minuti",
    author: "",
    cover: "", // aggiunto per preview
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_APIURL}/posts/${id}`)
        if (!res.ok) throw new Error("Errore nel caricamento del post")
        const data = await res.json()
        setFormData({
          title: data.title || "",
          category: data.category || "",
          content: data.content || "",
          author: data.author || "",
          cover: data.cover || "",
          readTimeValue: data.readTime?.value || "",
          readTimeUnit: data.readTime?.unit || "minuti",
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await authFetch(`${process.env.REACT_APP_APIURL}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
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

      if (!res.ok) throw new Error("Errore nell'aggiornamento")

      alert("Post aggiornato con successo!")
      navigate(`/blog/${id}`)
    } catch (err) {
      console.error(err)
      setError("Errore durante l'aggiornamento del post")
    }
  }

  if (loading) return <Spinner animation="border" className="m-5" />

  return (
    <Container className="mt-5"style={{ marginTop: "80px" }} >
      <h2>Modifica Blog Post</h2>
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

        {/* Preview della cover attuale */}
        {formData.cover && (
          <Form.Group className="mt-3">
            <Form.Label>Cover attuale</Form.Label>
            <div>
              <Image src={formData.cover} thumbnail style={{ maxHeight: 200 }} />
            </div>
          </Form.Group>
        )}

        {/* Upload nuova cover */}
        <Form.Group className="mt-3">
          <CoverUploader
            postId={id}
            onUploadSuccess={(url) => {
              setFormData((prev) => ({ ...prev, cover: url }))
            }}
          />
        </Form.Group>

        <Button type="submit" className="mt-4">Salva modifiche</Button>
      </Form>
    </Container>
  )
}

export default EditBlogPost

