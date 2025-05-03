import React, { useState, useEffect } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { Button } from "react-bootstrap";

const yourUserId = "123";

export default function BlogLike({ defaultLikes, onChange }) {
  const [likes, setLikes] = useState(defaultLikes);
  const iLikedThisArticle = likes.includes(yourUserId);

  const toggleLike = () => {
    const updatedLikes = iLikedThisArticle
      ? likes.filter((id) => id !== yourUserId)
      : [...likes, yourUserId];
      
    setLikes(updatedLikes);
    onChange && onChange(updatedLikes);
  };
  

  useEffect(() => {
    // Esegui l'azione ogni volta che 'likes' o 'onChange' cambiano
    onChange && onChange(likes);
  }, [likes, onChange]);  // Aggiungi le dipendenze correttamente

  return (
    <div>
      <Button
        onClick={toggleLike}
        variant={iLikedThisArticle ? "dark" : "dark-outline"}
      >
        <AiOutlineLike /> {`${likes.length} like`}
      </Button>
    </div>
  );
}

