import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"

const BlogItem = ({ _id, title, category, cover, author, createdAt }) => {
  return (
    <Card className="h-100 shadow-sm"style={{ marginTop: "80px" }} >
      {cover && (
        <Card.Img
          variant="top"
          src={cover}
          alt={title}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{category}</Card.Subtitle>

        {/* Autore */}
        {author && (
          <div className="d-flex align-items-center mt-3">
            <img
              src={author.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt={author.nome}
              style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>{author.nome} {author.cognome}</div>
              <div style={{ fontSize: "0.8rem", color: "gray" }}>
                {new Date(createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        <Link to={`/posts/${_id}`} className="btn btn-primary btn-sm mt-3">
          Leggi di più
        </Link>
      </Card.Body>
    </Card>
  )
}

export default BlogItem


