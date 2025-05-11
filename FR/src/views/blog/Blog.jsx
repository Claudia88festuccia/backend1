import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Button, Form } from "react-bootstrap";
import AvatarUploader from "../../components/avatarUploader/AvatarUploader";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import { getToken, getCurrentUser } from "../../utils/auth";

const Blog = () => {
  const { id } = useParams(); // ID del post dalla URL
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");


  const token = getToken()
  const currentUser = getCurrentUser()

  const handleAddComment = async () => {
    if (!newComment.trim() || !token) return;
    try {
      const res = await fetch(`http://localhost:3001/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });
      if (!res.ok) throw new Error("Errore nel salvataggio commento");
      const created = await res.json();
      setComments([...comments, created]);
      setNewComment("");
    } catch (err) {
      alert("Errore nel salvataggio del commento");
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:3001/posts/${id}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editedCommentText }),
      });
      if (!res.ok) throw new Error("Errore durante la modifica");
      const updated = await res.json();
      setComments(comments.map(c => (c._id === commentId ? updated : c)));
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (err) {
      alert("Errore durante la modifica del commento");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Vuoi davvero eliminare questo commento?")) return;
    try {
      const res = await fetch(`http://localhost:3001/posts/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      alert("Errore durante la cancellazione del commento");
    }
  };




  // Fetch del singolo blog post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${id}`);
        const data = await response.json();
        setBlog(data);
        // Dopo aver caricato il post, carica i commenti
        const fetchComments = async () => {
          try {
            const res = await fetch(`http://localhost:3001/posts/${id}/comments`);
            if (!res.ok) {
              throw new Error(`Errore HTTP: ${res.status}`);
            }
            const data = await res.json();
            setComments(data);
          } catch (err) {
            console.error("Errore nei commenti:", err);
            setErrorComments("Errore nel caricamento commenti");
          } finally {
            setLoadingComments(false);
          }
        };
        fetchComments();
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
        if (!blog.author) {
          console.warn("Attenzione: l'autore non è presente nel blog");
          return <p>Dati autore non disponibili.</p>;
        }

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

      <hr />
      <h4>Commenti</h4>

      {loadingComments ? (
        <Spinner animation="border" />
      ) : errorComments ? (
        <p>{errorComments}</p>
      ) : (
        <>
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c._id} className="mb-3 p-2 border rounded bg-light">
                <strong>{c.user}:</strong><br />

                {editingCommentId === c._id ? (
                  <>
                    <textarea
                      className="form-control mt-2"
                      value={editedCommentText}
                      onChange={(e) => setEditedCommentText(e.target.value)}
                    />
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2"
                        onClick={() => handleUpdateComment(c._id)}
                      >
                        Salva
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingCommentId(null)}
                      >
                        Annulla
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{c.text}</span>
                    <div style={{ fontSize: "0.8rem", color: "gray" }}>
                      {new Date(c.createdAt).toLocaleString()}
                    </div>

                    {currentUser?.id === c.userId && (
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="outline-warning"
                          className="me-2"
                          onClick={() => {
                            setEditingCommentId(c._id);
                            setEditedCommentText(c.text);
                          }}
                        >
                          Modifica
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDeleteComment(c._id)}
                        >
                          Elimina
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <p>Nessun commento ancora.</p>
          )}

        </>
      )}

      {currentUser ? (
        <Form.Group className="mt-4">
          <Form.Label>Lascia un commento:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Scrivi qui..."
          />
          <Button onClick={handleAddComment} className="mt-2">Invia</Button>
        </Form.Group>
      ) : (
        <p className="text-muted mt-3">Devi essere loggato per commentare.</p>
      )}

    </Container>
  );
};

export default Blog;

