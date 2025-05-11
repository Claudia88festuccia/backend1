import React, { useState, useEffect } from "react";
import AvatarUploader from "../avatarUploader/AvatarUploader";
import { use } from "react";

const AuthorProfile = ({ authorId }) => {
  const [author, setAuthor] = useState(null);

    const fetchAuthor = async () => {
      try {
         const res = await fetch(`http://localhost:3001/authors/${authorId}`);
    const data = await res.json();
    setAuthor(data);
  } catch (error) {
    console.error("Errore nel recupero dell'autore:", error);
  }
};

useEffect(() => {
  fetchAuthor();
}, [authorId]);

  return (
    <div>
      {author ? (
        <div>
          <h2>Profilo di {author.name} {author.surname}</h2>
          <div>
            <img
              src={author.avatar || "/default-avatar.png"}
              alt="Avatar"
              width="100"
              height="100"
            />
            <p>Email: {author.email}</p>
            {/* Altri dettagli dell'autore */}
            <AvatarUploader authorId={authorId} onUploadSuccess={() => fetchAuthor()} />
          </div>
        </div>
      ) : (
        <p>Caricamento del profilo...</p>
      )}
    </div>
  );
};

export default AuthorProfile;

