import { useState } from "react"
import { apiFetch } from "../api"

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // "success" | "error" | "warning"

  const submit = async () => {
    try {
      setMessage("")
      if (isRegister) {
        if (!username || !password || !confirmPassword) {
          setMessage("⚠️ Please fill all fields")
          setMessageType("warning")
          return
        }
        if (password !== confirmPassword) {
          setMessage("⚠️ Passwords do not match")
          setMessageType("warning")
          return
        }
        await apiFetch("/auth/register", {
          method: "POST",
          body: { username, password, confirmPassword },
        })
        setMessage("✅ Registered successfully! Now login.")
        setMessageType("success")
        setPassword("")
        setConfirmPassword("")
        setIsRegister(false)
      } else {
        if (!username || !password) {
          setMessage("⚠️ Please fill username and password")
          setMessageType("warning")
          return
        }
        const resp = await apiFetch("/auth/login", {
          method: "POST",
          body: { username, password },
        })
        onLogin(resp.token)
      }
    } catch (err) {
      setMessage("❌ " + err.message)
      setMessageType("error")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">Notes App</h1>
      <input
        className="border p-2 rounded w-64"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-2 rounded w-64"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isRegister && (
        <input
          className="border p-2 rounded w-64"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}

      {message && (
        <p
          className={`text-sm ${
            messageType === "success"
              ? "text-green-600"
              : messageType === "warning"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          onClick={submit}
        >
          {isRegister ? "Register" : "Login"}
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded shadow"
          onClick={() => {
            setIsRegister(!isRegister)
            setMessage("")
          }}
        >
          {isRegister ? "Switch to Login" : "Switch to Register"}
        </button>
      </div>
    </div>
  )
}
