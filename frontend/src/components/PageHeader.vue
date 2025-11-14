<template>
  <div class="page-header">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <h1 class="page-title">
          <i class="fas fa-clipboard-list"></i>
          Consulta de Pedidos
        </h1>
        <p class="page-subtitle">Gestión y seguimiento de órdenes de compra</p>
      </div>
      <div>
        <button class="btn btn-light me-2" @click="handleLogout" type="button">
          <i class="fas fa-sign-out-alt me-2"></i>
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #0D4B76 0%, #1A6B9F 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(13, 75, 118, 0.3);
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 10px 0 0 0;
}

.btn-light {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-light:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  transform: translateY(-2px);
}
</style>