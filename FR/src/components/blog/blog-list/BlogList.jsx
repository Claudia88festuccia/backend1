import React, { useEffect, useState } from "react"
import { Col, Row, Spinner, Alert, Container, Form, Button, Pagination } from "react-bootstrap"
import BlogItem from "../blog-item/BlogItem"

const BlogList = ({ authorId }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("") 
 const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  useEffect(() => {
    let url = `http://localhost:3001/posts?page=${page}&limit=6`

if (query) url += `&title=${query}`
    if (authorId) url = `http://localhost:3001/posts/authors/${authorId}/posts`

    setLoading(true)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero dei post")
        return res.json()
      })
      .then((data) => {
        setPosts(data.posts||data)
        setTotalPages(data.totalPages || 1)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [query, authorId, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setQuery(search.trim())
    setPage(1)
  }

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSearch} className="mb-4 d-flex gap-2">
        <Form.Control
          type="text"
          placeholder="Cerca post per titolo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit">Cerca</Button>
      </Form>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : posts.length === 0 ? (
        <p className="text-center">Nessun post trovato per "{query}"</p>
      ) : (
        <Row>
          {posts.map((post, i) => (
            <Col key={`item-${i}`} md={4} style={{ marginBottom: 50 }}>
              <BlogItem {...post} />
            </Col>
          ))}
        </Row>
      )}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
         <Pagination>
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx}
                  active={page === idx + 1}
                  onClick={() => setPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
            </Pagination>
        </div>
      )}
    </Container>
  )
}

export default BlogList

