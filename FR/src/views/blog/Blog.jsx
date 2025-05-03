import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Button } from "react-bootstrap";
import AvatarUploader from "../../components/avatarUploader/AvatarUploader";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor"; 

const Blog = () => {
  const { id } = useParams(); // ID del post dalla URL
  const navigate = useNavigate(); 

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch del singolo blog post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${id}`);
        const data = await response.json();
        setBlog(data);
        setLoading(false);
      } catch (error) {
        console.error("Errore nel fetch del post:", error);
      }
    };

    fetchPost();
  }, [id]);

  // Debugging: logga i dati del blog per vedere se c'è l'ID dell'autore
  useEffect(() => {
    if (blog) {
      console.log("Dati del blog:", blog);
      if (blog.author) {
        console.log("ID dell'autore:", blog.author._id);
      } else {
        console.warn("Attenzione: l'autore non è presente nel blog");
      }
    }
  }, [blog]);

  // Funzione per eliminare il post
  const handleDelete = async () => {
    const confirm = window.confirm("Vuoi davvero eliminare questo post?");
    if (!confirm) return;

    try {
      await fetch(`http://localhost:3001/posts/${id}`, {
        method: "DELETE",
      });
      navigate("/"); // torna alla home
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="text-center mt-5">
        <p>Post non trovato.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1>{blog.title}</h1>
      <p>
        <strong>Categoria:</strong> {blog.category}
      </p>
      <p>{blog.content}</p>

      {blog.author && blog.author._id && (
  <BlogAuthor author={blog.author} />
)}

      <div className="mt-4 d-flex gap-3">
        <Button variant="warning" onClick={() => navigate(`/edit/${blog._id}`)}>
          Modifica
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Elimina
        </Button>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Torna indietro
        </Button>
      </div>
    </Container>
  );
};

export default Blog;

