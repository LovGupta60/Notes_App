import { useState } from "react"
import LoginPage from "./pages/LoginPage"
import NotesPage from "./pages/NotesPage"

export default function App() {
  const [token, setToken] = useState(null)

  const handleLogout = () => {
    setToken(null) // clear token
  }

  return token ? (
    <NotesPage token={token} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={setToken} />
  )
}
