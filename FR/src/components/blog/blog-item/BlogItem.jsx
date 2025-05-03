import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import BlogAuthor from "../blog-author/BlogAuthor";

import "./styles.css";

const BlogItem = (props) => {
  const { title, cover, author, _id } = props;
  return (
    <Card className="blog-card">
      <Link to={`/blog/${_id}`} className="blog-link">
        <Card.Img
          variant="top"
          src={cover || "https://picsum.photos/1000/300?text=No+Image"}
          onError={(e) => {
            e.target.src = "https://picsum.photos/1000/300?text=No+Image";
          }}
          className="blog-cover"
        />

        <Card.Body>
          <Card.Title>{title}</Card.Title>
        </Card.Body>
      </Link>
      <Card.Footer>
        {author && author._id ? (
          <BlogAuthor author={author} />
        ) : (
          <p>Autore non trovato</p>
        )}
      </Card.Footer>

    </Card>
  );
};

export default BlogItem;
