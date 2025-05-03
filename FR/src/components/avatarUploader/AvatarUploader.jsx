import React, { useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";

const AvatarUploader = ({ authorId }) => {
  const [image, setImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [error, setError] = useState(null);

  // Carica avatar corrente all'avvio
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await fetch(`http://localhost:3001/authors/${authorId}/avatar`);
        const data = await res.json();
        if (data.avatar) {
          setAvatarUrl(data.avatar);
        }
      } catch (err) {
        console.error("Errore nel caricamento dell'avatar esistente:", err);
      }
    };

    if (authorId) {
      fetchAvatar();
    }
  }, [authorId]);

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
      setAvatarUrl(data.avatar); // aggiorna anteprima
      setError(null);
    } catch (err) {
      console.error("Errore nel caricamento dell'avatar:", err);
      setError("Errore durante il caricamento dell'avatar");
    }
  };

  return (
    <div>
      {avatarUrl && (
        <div className="mb-3">
          <Image
            src={avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png?text=Avatar"}
            onError={(e) => {
              if (e.target.src !== "https://cdn-icons-png.flaticon.com/512/149/149071.png?text=Avatar") {
              e.target.onerror = null; // previene loop infiniti
              e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png?text=Avatar";
              }
            }}
            roundedCircle
            width={100}
            height={100}
            alt="Avatar autore"
          />

        </div>
      )}
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

