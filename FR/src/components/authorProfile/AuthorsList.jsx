import { useEffect, useState } from "react"
import { Card, Row, Col, Spinner, Alert, Container, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { authFetch, isLoggedIn } from "../../utils/auth"

const AuthorsList = () => {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_APIURL}/authors`)
        if (!res.ok) throw new Error("Errore nel recupero degli autori")
        const data = await res.json()
        setAuthors(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAuthors()
  }, [])

  const handleDelete = async (id) => {
    const confirm = window.confirm("Sei sicuro di voler eliminare questo autore?")
    if (!confirm) return

    try {
      const res = await authFetch(`${process.env.REACT_APP_APIURL}/authors/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Errore nella cancellazione")

      setAuthors(authors.filter((a) => a._id !== id))
    } catch (err) {
      console.error(err)
      alert("Errore nell'eliminazione.")
    }
  }
  // if (!isLoggedIn()) return <Navigate to="/login" />
  if (loading) return <Spinner animation="border" className="m-5" />
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <Container className="mt-4"style={{ marginTop: "80px" }} >
      <h2>Lista Autori</h2>
      <Row>
        {authors.map((author) => (
          <Col key={author._id} xs={12} md={6} lg={4}>
            <Card className="mb-3">
              <Card.Img
                variant="top"
                src={
                  author.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                style={{ objectFit: "cover", height: "200px" }}
              />
              <Card.Body>
                <Card.Title>{author.nome} {author.cognome}</Card.Title>
                <Card.Text>
                  <strong>Email:</strong> {author.email}
                </Card.Text>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => navigate(`/authors/edit/${author._id}`)}
                >
                  Modifica
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(author._id)}
                >
                  Elimina
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default AuthorsList

