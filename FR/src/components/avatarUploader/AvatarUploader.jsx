import React, { useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";


const AvatarUploader = ({ authorId, onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  // Carica avatar corrente all'avvio
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await fetch(`http://localhost:3001/authors/${authorId}`);
        const data = await res.json();
        if (data.avatar) setAvatarUrl(data.avatar);

      } catch (err) {
        console.error("Errore nel caricamento dell'avatar esistente:", err);
        setError("Errore nel caricamento dell'avatar.");
      }
    };


    if (authorId) {
      fetchAvatar();
    }
  }, [authorId]);

  const handleUpload = async () => {
  setError(null);
  setSuccess(false);

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
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Errore durante il caricamento dell'avatar");
    }

    const data = await response.json();
    setAvatarUrl(data.avatar);
    setSuccess(true);
    if (onUploadSuccess) onUploadSuccess();

    // Nascondi messaggio dopo 3 secondi
    setTimeout(() => setSuccess(false), 3000);

  } catch (err) {
    // console.error("Errore nel caricamento dell'avatar:", err);
    setError(err.message || "Errore  caricamento dell'avatar");
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
      {success && <div className="text-success mt-2">Avatar aggiornato con successo!</div>}

    </div>
  );
};

export default AvatarUploader;

