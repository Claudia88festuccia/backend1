import React, { useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import AvatarUploader from "../../avatarUploader/AvatarUploader";
import "./styles.css";

const BlogAuthor = ({ author }) => {
  const isValidAuthor = author && author._id;
  const { name, avatar, _id } = isValidAuthor ? author : {};
  const [currentAvatar, setCurrentAvatar] = useState(avatar || "");

  if (!isValidAuthor) {
    console.error("Autore non valido o ID mancante");
    return <div>Errore: Autore mancante</div>;
  }

  return (
    <Row style={{ marginTop: "80px" }}>
      <Col xs={"auto"} className="pe-0">
        <Image className="blog-author" src={currentAvatar} roundedCircle />
      </Col>
      <Col>
        <div>di</div>
        <h6>{name}</h6>
        <AvatarUploader authorId={_id} onUpload={setCurrentAvatar} />
      </Col>
    </Row>
  );
};


export default BlogAuthor;



