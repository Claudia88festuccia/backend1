

// import React, { useCallback, useState } from "react";
// import { Button, Container, Form } from "react-bootstrap";
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import "./styles.css";
// import { convertToRaw, EditorState } from "draft-js";  // IMPORTA EditorState
// import draftToHtml from "draftjs-to-html";
// import { useNavigate } from "react-router-dom";

// const navigate = useNavigate();

// const NewBlogPost = (props) => {
//   const [title, setTitle] = useState("");          // Stato per il titolo
//   const [category, setCategory] = useState("");    // Stato per la categoria
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());      // Stato per l'editor

//   const [message, setMessage] = useState("");      // Stato per il messaggio di errore/successo

//   // Funzione per gestire i cambiamenti nell'editor
//   const handleEditorChange = useCallback((state) => {
//     setEditorState(state);  // Salviamo l'EditorState

//   }, 
//   []);



//   // Funzione di submit che invia i dati al backend
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));  // Convertiamo in HTML
//     const postData = {
//       title,
//       category,
//       content,
//       readTime: { value: 5, unit: "min" },  // Personalizza se necessario
//       cover: "https://via.placeholder.com/800x400",  // Aggiungi logica per la cover
//       author: "68091c5a31abbb5362ae1169",  // Inserisci l'ID dell'autore
//     };

//     try {
//       const response = await fetch("http://localhost:3001/posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(postData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage("✅ Post creato con successo!");
//         setTitle("");
//         setCategory("");
//         setEditorState(EditorState.createEmpty());
//         setTimeout(() => {
//           navigate(`/blog/${data._id}`); // Reindirizza al nuovo post
//         }, 1500);
//       }
//     } catch (error) {
//       console.error("Errore durante la creazione del post:", error);
//     }
//   };

//   return (
//     <Container className="new-blog-container">
//       <Form className="mt-5" onSubmit={handleSubmit}>
//         <Form.Group controlId="blog-form" className="mt-3">
//           <Form.Label>Titolo</Form.Label>
//           <Form.Control
//             size="lg"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="blog-category" className="mt-3">
//   <Form.Label>Categoria</Form.Label>
//   <Form.Select
//     size="lg"
//     value={category}
//     onChange={(e) => setCategory(e.target.value)}
//     required
//   >
//     <option value="">Seleziona una categoria</option>
//     <option>Categoria 1</option>
//     <option>Categoria 2</option>
//     <option>Categoria 3</option>
//     <option>Categoria 4</option>
//     <option>Categoria 5</option>
//   </Form.Select>
// </Form.Group>

//         <Form.Group controlId="blog-content" className="mt-3">
//           <Form.Label>Contenuto Blog</Form.Label>
//           <Editor
//             editorState={editorState}  // Passiamo editorState all'Editor
//             onEditorStateChange={handleEditorChange}  // Aggiorniamo editorState
//             wrapperClassName="new-blog-content"
//             editorClassName="editor-class"
//             toolbarClassName="toolbar-class"
//           />
//         </Form.Group>
//         <Form.Group className="d-flex mt-3 justify-content-end">
//           <Button type="reset" size="lg" variant="outline-dark">
//             Reset
//           </Button>
//           <Button
//             type="submit"
//             size="lg"
//             variant="dark"
//             style={{
//               marginLeft: "1em",
//             }}
//           >
//             Invia
//           </Button>
//         </Form.Group>
//       </Form>

//       {message && <div className="mt-3">{message}</div>}
//     </Container>
//   );
// }; 


// export default NewBlogPost; 

import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap"; // Import necessari per il form e gli alert
import { useNavigate } from "react-router-dom"; // Import per la navigazione tra le pagine

const NewBlogPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Funzione per gestire i cambiamenti nei campi del form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Funzione per inviare i dati al server tramite POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Errore nella creazione del post");
      }

      const newPost = await response.json();
      navigate(`/blog/${newPost._id}`); // Redirigi all'articolo appena creato
    } catch (err) {
      console.error("Errore:", err);
      setError("Errore nella creazione del post"); // Mostra un messaggio di errore in caso di problemi
    }
  };

  return (
    <Container className="mt-5">
      <h2>Nuovo Blog Post</h2>

      {/* Se c'è un errore, mostralo */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Form per il nuovo post */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Inserisci il titolo"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Select
            type="text"
            placeholder="Inserisci la categoria"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            >
            <option value="">Seleziona una categoria</option>
            <option>Categoria 1</option>
            <option>Categoria 2</option>
            <option>Categoria 3</option>
            <option>Categoria 4</option>
            <option>Categoria 5</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Contenuto</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="Scrivi il contenuto..."
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Pubblica
        </Button>
      </Form>
    </Container>
  );
};

export default NewBlogPost;

