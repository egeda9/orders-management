import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/pedido'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalCount = ref(0)

  const stats = computed(() => {
    const totalOrders = orders.value.length
    const completedOrders = orders.value.filter(o => o.estado_pedido_nombre === 'COMPLETO').length
    const pendingOrders = orders.value.filter(o => o.estado_pedido_nombre === 'PENDIENTE').length
    const totalAmount = orders.value.reduce((sum, order) => sum + (order.monto_total || 0), 0)

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalAmount
    }
  })

  const fetchOrders = async (filters = {}) => {
    loading.value = true
    error.value = null

    try {
      const params = {
        startRowIndex: filters.startRowIndex || 0,
        maximumRows: filters.maximumRows || 100,
        Where: filters.where || '',
        OrderBy: filters.orderBy || 'id_pedido DESC'
      }

      const response = await axios.get(`${API_URL}/ListaSelAll`, { params })
      
      orders.value = response.data.pedidos
      totalCount.value = response.data.totalCount

      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching orders'
      console.error('Fetch orders error:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const getOrder = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(`${API_URL}/Get`, { params: { id } })
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching order'
      console.error('Get order error:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const createOrder = async (orderData) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post(`${API_URL}/Post`, orderData)
      
      // Refresh orders list
      await fetchOrders()
      
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creating order'
      console.error('Create order error:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateOrder = async (id, orderData) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.put(`${API_URL}/Put`, orderData, { 
        params: { Id: id } 
      })
      
      // Refresh orders list
      await fetchOrders()
      
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error updating order'
      console.error('Update order error:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteOrder = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.delete(`${API_URL}/Delete`, { 
        params: { id } 
      })
      
      // Refresh orders list
      await fetchOrders()
      
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error deleting order'
      console.error('Delete order error:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    loading,
    error,
    totalCount,
    stats,
    fetchOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
  }
})