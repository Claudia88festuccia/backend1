
import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const [authorId, setAuthorId] = useState("");
  return (
    <Container fluid="sm">
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>

      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Cerca per titolo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Form>

      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Cerca per autore (ID)"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        />
      </Form>

      <BlogList search={query} authorId={authorId} />
    </Container>
  );
};

export default Home;


