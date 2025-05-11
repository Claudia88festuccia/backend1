import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Button, Container, Alert } from "react-bootstrap"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/")
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch(`${process.env.REACT_APP_APIURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error("Credenziali non valide")
      const data = await res.json()

      // Salva token e user info
      localStorage.setItem("token", data.accessToken)
      localStorage.setItem("user", JSON.stringify(data.user))

      navigate("/")
    } catch (err) {
      console.error("Errore login:", err)
      setError(err.message)
    }
  }

  return (
    <Container className="mt-5" > style={{ marginTop: "80px" }}
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="dark">
          Accedi
        </Button>
        
        <Button
          href="http://localhost:3001/auth/google"
          variant="outline-danger"
          className="mt-3 w-100"
        >
          Accedi con Google
        </Button>

      </Form>
    </Container>
  )
}

export default Login
