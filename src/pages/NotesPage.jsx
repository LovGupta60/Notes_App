import { useEffect, useState } from "react"
import { API_URL } from "../api"

export default function NotesPage({ token, onLogout }) {
  const [notes, setNotes] = useState([])
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [editingNote, setEditingNote] = useState(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") 
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const loadNotes = async () => {
    try {
      const res = await fetch(API_URL + "/api/notes/get", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(await res.text())
      setNotes(await res.json())
    } catch (err) {
      setMessage("Failed to load notes: " + err.message)
      setMessageType("error")
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const saveNote = async () => {
    try {
      if (!newTitle || !newContent) {
        setMessage(" Title and content required")
        setMessageType("error")
        return
      }

      if (editingNote) {
        await fetch(API_URL + `/api/notes/${editingNote.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        })
        setMessage("Note updated successfully!")
        setMessageType("success")
        setEditingNote(null)
      } else {
        await fetch(API_URL + "/api/notes/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        })
        setMessage("Note added successfully!")
        setMessageType("success")
      }

      setNewTitle("")
      setNewContent("")
      loadNotes()
    } catch (err) {
      setMessage("Failed to save note: " + err.message)
      setMessageType("error")
    }
  }

  const deleteNote = async (id) => {
    try {
      await fetch(API_URL + `/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage("Note deleted successfully!")
      setMessageType("error") 
      setConfirmDeleteId(null)
      loadNotes()
    } catch (err) {
      setMessage("Failed to delete note: " + err.message)
      setMessageType("error")
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {message && (
        <p
          className={`mb-4 text-sm ${
            messageType === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          className="border p-2 rounded w-full mb-2"
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded shadow"
          onClick={saveNote}
        >
          {editingNote ? "Update Note" : "Add Note"}
        </button>
      </div>

      <ul className="space-y-3">
        {notes.map((n) => (
          <li key={n.id} className="bg-white shadow p-4 rounded">
            <h4 className="font-bold text-lg">{n.title || "Untitled"}</h4>
            <p className="text-gray-700">{n.content}</p>
            <div className="flex gap-2 mt-2">
              {confirmDeleteId === n.id ? (
                <div className="flex gap-2 items-center">
                  <span className="text-red-600 font-medium">
                    Confirm delete?
                  </span>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteNote(n.id)}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setEditingNote(n)
                      setNewTitle(n.title)
                      setNewContent(n.content)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => setConfirmDeleteId(n.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
