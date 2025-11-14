import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  const login = async (username, password) => {
  try {    
    // OPTION 1: Convert URLSearchParams to string (RECOMMENDED)
    const params = new URLSearchParams()
    params.append('grant_type', 'password')
    params.append('username', username)
    params.append('password', password)

    const response = await axios.post(
      `${API_URL}/oauth/token`, 
      params.toString(),  // ← Convert to string!
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    token.value = response.data.access_token
    user.value = { username }

    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(user.value))

    // Set default axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

    return { success: true }
  } catch (error) {
    console.error('❌ Login error:', error)
    console.error('❌ Error response:', error.response?.data)
    console.error('❌ Error status:', error.response?.status)
    
    return { 
      success: false, 
      message: error.response?.data?.error_description || 'Login failed. Please check your credentials.' 
    }
  }
}

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  // Initialize axios header if token exists
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout
  }
})