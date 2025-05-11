 import { useState } from "react"
import { Button, Form, Alert, Spinner, Image } from "react-bootstrap"
import { getToken } from "../../utils/auth"

const CoverUploader = ({ postId, onUploadSuccess }) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState("")

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected)) // preview locale
      setSuccessMsg("")
      setError(null)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !postId) return

    const formData = new FormData()
    formData.append("cover", file)

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${process.env.REACT_APP_APIURL}/posts/${postId}/cover`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error("Errore nell'upload della cover")

      const data = await res.json()
      setSuccessMsg("Cover aggiornata con successo!")
      setFile(null)
      setPreview(null)
      onUploadSuccess?.(data.coverUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleUpload} className="mt-4">
      <Form.Group>
        <Form.Label>Carica immagine di copertina</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
      </Form.Group>

      {preview && (
        <div className="mt-3">
          <strong>Preview:</strong>
          <br />
          <Image src={preview} alt="preview" thumbnail style={{ maxHeight: 200 }} />
        </div>
      )}

      <Button type="submit" disabled={loading || !file} className="mt-3">
        {loading ? <Spinner size="sm" animation="border" /> : "Carica cover"}
      </Button>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {successMsg && <Alert variant="success" className="mt-3">{successMsg}</Alert>}
    </Form>
  )
}

export default CoverUploader
