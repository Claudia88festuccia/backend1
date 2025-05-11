 export const getToken = () => localStorage.getItem("token")


export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user")
    if (!user || user === "undefined") return null
    return JSON.parse(user)
  } catch {
    return null
  }
}


export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}


export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token")
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })
}


export const isLoggedIn = () => !!localStorage.getItem("token")
