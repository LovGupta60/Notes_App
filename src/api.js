// src/api.js
export const API_URL = "http://localhost:8080"

export async function apiFetch(path, options = {}, token, onLogout) {
  const res = await fetch(API_URL + path, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (res.status === 401) {
    if (onLogout) onLogout() // 🔥 logout when expired
    throw new Error("Session expired. Please login again.")
  }

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}
