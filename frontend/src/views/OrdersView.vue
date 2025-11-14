<template>
  <div class="orders-view">
    <PageHeader />
    <div class="main-container">
      <FiltersSection @filter="handleFilter" />
      <OrdersTable 
        :orders="filteredOrders" 
        :loading="ordersStore.loading"
        @view-detail="handleViewDetail"
      />
    </div>
    <OrderDetailModal 
      :order="selectedOrder"
      :show="showDetailModal"
      @close="showDetailModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import PageHeader from '@/components/PageHeader.vue'
import FiltersSection from '@/components/FiltersSection.vue'
import OrdersTable from '@/components/OrdersTable.vue'
import OrderDetailModal from '@/components/OrderDetailModal.vue'

const ordersStore = useOrdersStore()
const selectedOrder = ref(null)
const showDetailModal = ref(false)
const currentFilters = ref({})

const filteredOrders = computed(() => {
  let orders = [...ordersStore.orders]
  
  // Filtrar por folio
  if (currentFilters.value.folio && currentFilters.value.folio.trim()) {
    orders = orders.filter(o => 
      o.folio.toLowerCase().includes(currentFilters.value.folio.toLowerCase())
    )
  }
  
  // Filtrar por proveedor
  if (currentFilters.value.supplier && currentFilters.value.supplier.trim()) {
    orders = orders.filter(o => 
      o.proveedor_nombre.toLowerCase().includes(currentFilters.value.supplier.toLowerCase())
    )
  }
  
  // Filtrar por tipo
  if (currentFilters.value.type && currentFilters.value.type.trim()) {
    orders = orders.filter(o => {
      const match = o.tipo_pedido_nombre?.toUpperCase() === currentFilters.value.type.toUpperCase()
      return match
    })
  }
  
  // Filtrar por estado
  if (currentFilters.value.status && currentFilters.value.status.trim()) {
    orders = orders.filter(o => {
      const orderStatus = o.estado_pedido_nombre?.toUpperCase()
      const filterStatus = currentFilters.value.status.toUpperCase()
      const match = orderStatus === filterStatus
      return match
    })
  }
  
  // Filtrar por fecha desde
  if (currentFilters.value.dateFrom && currentFilters.value.dateFrom.trim()) {
    orders = orders.filter(o => 
      new Date(o.fecha_pedido) >= new Date(currentFilters.value.dateFrom)
    )
  }
  
  // Filtrar por fecha hasta
  if (currentFilters.value.dateTo && currentFilters.value.dateTo.trim()) {
    orders = orders.filter(o => 
      new Date(o.fecha_pedido) <= new Date(currentFilters.value.dateTo)
    )
  }
  
  return orders
})

const handleFilter = (filters) => {
  currentFilters.value = filters
}

const handleViewDetail = (order) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

onMounted(async () => {
  await ordersStore.fetchOrders()
})
</script>

<style scoped>
.orders-view {
  padding: 20px;
  min-height: 100vh;
}

.main-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(13, 75, 118, 0.1);
  padding: 30px;
  margin-bottom: 20px;
}
</style>