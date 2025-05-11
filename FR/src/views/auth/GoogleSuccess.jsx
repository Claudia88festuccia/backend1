 import { useEffect } from "react"
import { useNavigate ,useLocation} from "react-router-dom"

const GoogleSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    if (token) {
      localStorage.setItem("token", token)
       navigate("/") 
    }else{
      navigate("/login")
    }
  },[location,navigate])

  return <p>Login in corso...</p>
}

export default GoogleSuccess
