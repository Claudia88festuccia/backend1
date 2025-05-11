import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import BlogItem from "../blog/blog-item/BlogItem";

const AuthorPosts = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorPosts = async () => {
      try {
        const res = await fetch(`http://localhost:3001/authors/${id}/Posts`);
        if (!res.ok) throw new Error("Errore nel recupero dei post");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorPosts();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5" style={{ marginTop: "80px" }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Post di questo autore</h2>
      <Row>
        {posts.map(post => (
          <Col md={4} key={post._id} className="mb-4">
            <BlogItem {...post} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AuthorPosts;
