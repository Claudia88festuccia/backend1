// src/views/edit/EditBlogPost.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Spinner } from "react-bootstrap";

const EditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`http://localhost:3001/posts/${id}`);
      const data = await res.json();
      setPost(data);
      setTitle(data.title);
      setCategory(data.category);
      setContent(data.content);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { title, category, content };

    await fetch(`http://localhost:3001/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    navigate(`/blog/${id}`); // torna al post
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Modifica Post</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Contenuto</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="success" className="mt-3">
          Salva modifiche
        </Button>
      </Form>
    </Container>
  );
};

export default EditBlogPost;
