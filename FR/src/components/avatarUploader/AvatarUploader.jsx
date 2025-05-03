import React, { useState } from "react";
import { Button } from "react-bootstrap";

const AvatarUploader = ({ authorId, onUpload }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!authorId) {
      setError("ID dell'autore mancante.");
      return;
    }

    if (!image) {
      setError("Per favore seleziona un'immagine.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", image);

    try {
      const response = await fetch(`http://localhost:3001/authors/${authorId}/avatar`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Errore durante il caricamento dell'avatar");
      }

      const data = await response.json();
      onUpload(data.authorId.avatar);
      setError(null);
    } catch (err) {
      console.error("Errore nel caricamento dell'avatar:", err);
      setError("Errore durante il caricamento dell'avatar");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      {error && <div className="text-danger">{error}</div>}
      <Button onClick={handleUpload}>Carica Avatar</Button>
    </div>
  );
};


export default AvatarUploader;

