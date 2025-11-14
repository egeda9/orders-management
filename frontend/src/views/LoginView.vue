<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <i class="fas fa-clipboard-list fa-3x mb-3"></i>
        <h2>Sistema de Pedidos</h2>
        <p>Inicia sesión para continuar</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="mb-3">
          <label for="username" class="form-label">
            <i class="fas fa-user me-2"></i>Usuario
          </label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="username"
            placeholder="Ingresa tu usuario"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">
            <i class="fas fa-lock me-2"></i>Contraseña
          </label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <div class="alert alert-danger" v-if="errorMessage">
          <i class="fas fa-exclamation-circle me-2"></i>
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Iniciando sesión...
          </span>
          <span v-else>
            <i class="fas fa-sign-in-alt me-2"></i>
            Iniciar Sesión
          </span>
        </button>
      </form>

      <div class="login-footer">
        <small class="text-muted">
          Usuario por defecto: <strong>admin</strong> / Contraseña: <strong>admin</strong>
        </small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('admin')
const password = ref('admin')
const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  const result = await authStore.login(username.value, password.value)

  loading.value = false

  if (result.success) {
    router.push('/orders')
  } else {
    errorMessage.value = result.message
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0D4B76 0%, #1A6B9F 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  color: #0D4B76;
}

.login-header i {
  color: #1A6B9F;
}

.login-header h2 {
  font-weight: 700;
  margin-bottom: 10px;
}

.login-header p {
  color: #6c757d;
  margin-bottom: 0;
}

.form-label {
  font-weight: 600;
  color: #0D4B76;
}

.form-control {
  border: 2px solid #E9ECEF;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #1A6B9F;
  box-shadow: 0 0 0 0.2rem rgba(26, 107, 159, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #0D4B76 0%, #1A6B9F 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(13, 75, 118, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 75, 118, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #E9ECEF;
}

.alert {
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>