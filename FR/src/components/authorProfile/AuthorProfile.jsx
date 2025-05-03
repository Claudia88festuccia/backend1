import React, { useState, useEffect } from "react";
import AvatarUploader from "../avatarUploader/AvatarUploader";

const AuthorProfile = ({ authorId }) => {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await fetch(`http://localhost:3001/authors/${authorId}`);
        const data = await res.json();
        setAuthor(data);
      } catch (error) {
        console.error("Errore nel recupero dell'autore:", error);
      }
    };
    fetchAuthor();
  }, [authorId]);

  return (
    <div>
      {author ? (
        <div>
          <h2>Profilo di {author.name}</h2>
          <div>
            <img
              src={author.avatar || "/default-avatar.png"}
              alt="Avatar"
              width="100"
              height="100"
            />
            <p>Email: {author.email}</p>
            {/* Altri dettagli dell'autore */}
            <AvatarUploader authorId={authorId} />
          </div>
        </div>
      ) : (
        <p>Caricamento del profilo...</p>
      )}
    </div>
  );
};

export default AuthorProfile;

