import React, { useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import AvatarUploader from "../../avatarUploader/AvatarUploader";
import "./styles.css";

const BlogAuthor = (props) => {
  const { name, avatar, authorId: _id } = props;
  const [currentAvatar, setCurrentAvatar] = useState(avatar);

  // Controlla che _id esista prima di passarlo
  if (!_id) {
    console.error("ID dell'autore mancante nel componente BlogAuthor");
  }

  console.log("Autore:", props.author);

  return (
    <Row>
      <Col xs={"auto"} className="pe-0">
        <Image className="blog-author" src={currentAvatar} roundedCircle />
      </Col>
      <Col>
        <div>di</div>
        <h6>{name}</h6>
        {/* Passa _id come authorId */}
        <AvatarUploader authorId={_id} onUpload={setCurrentAvatar} />
      </Col>
    </Row>
  );
};

export default BlogAuthor;

