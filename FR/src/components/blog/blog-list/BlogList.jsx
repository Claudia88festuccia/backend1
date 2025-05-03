import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";  
import BlogItem from "../blog-item/BlogItem";  

const BlogList = ({ search,authorId }) => {
  const [posts, setPosts] = useState([]);  // Stato per i post
  const [loading, setLoading] = useState(true);  // Stato per il caricamento
  const [error, setError] = useState(null);  // Stato per gestire errori

  useEffect(() => {
    // Se la search è vuota, recuperiamo tutti i post
    let url = search
      ? `http://localhost:3001/blogPosts?title=${search}`  // Filtra per titolo
      : "http://localhost:3001/blogPosts";  // Recupera tutti i post

      if (authorId) {
        url = `http://localhost:3001/blogPosts/authors/${authorId}/blogPosts`;  
      }
      

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero dei post");
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setPosts(data);
        setLoading(false);  
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false); 
      });
  }, [search, authorId]);  

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <p>Errore: {error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center mt-5">
        <p>Nessun post trovato per il termine di ricerca "{search}"</p>
      </div>
    );
  }

  return (
    <Row>
    {posts.length > 0 ? (
      posts.map((post, i) => (
        <Col key={`item-${i}`} md={4} style={{ marginBottom: 50 }}>
          <BlogItem {...post} />
        </Col>
      ))
    ) : (
      <div>Non ci sono post da visualizzare.</div>
    )}
  </Row>
  );
};

export default BlogList;
