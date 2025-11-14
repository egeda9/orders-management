<template>
  <div class="results-section">
    <div class="results-header">
      <h3 class="results-title">
        <i class="fas fa-table"></i>
        Resultados
      </h3>
      <div class="export-buttons">
        <button class="btn btn-success btn-sm me-2" @click="exportToExcel">
          <i class="fas fa-file-excel me-1"></i> Excel
        </button>
        <button class="btn btn-secondary btn-sm" @click="printReport">
          <i class="fas fa-print me-1"></i> Imprimir
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Cargando pedidos...</p>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-5">
      <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
      <p class="text-muted">No se encontraron pedidos con los filtros aplicados</p>
    </div>

    <div v-else class="table-container">
      <table 
        :key="tableKey" 
        ref="tableRef" 
        class="table table-hover table-striped"
      >
        <thead>
          <tr>
            <th>Folio</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Iniciales</th>
            <th>Proveedor</th>
            <th>RFC</th>
            <th>Estado</th>
            <th>Monto Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id_pedido">
            <td>{{ order.folio }}</td>
            <td>{{ formatDate(order.fecha_pedido) }}</td>
            <td>
              <span class="badge bg-secondary">{{ order.tipo_pedido_nombre }}</span>
            </td>
            <td>{{ order.iniciales }}</td>
            <td>{{ order.proveedor_nombre }}</td>
            <td>{{ order.proveedor_rfc }}</td>
            <td>
              <span 
                class="badge" 
                :class="order.estado_pedido_nombre === 'COMPLETO' ? 'bg-success' : 'bg-warning'"
              >
                {{ order.estado_pedido_nombre }}
              </span>
            </td>
            <td>${{ formatCurrency(order.monto_total) }}</td>
            <td>
              <button 
                class="btn btn-info btn-sm" 
                @click="$emit('view-detail', order)"
                title="Ver Detalle"
              >
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount, computed } from 'vue'
import $ from 'jquery'
import 'datatables.net-bs5'
import 'datatables.net-buttons-bs5'
import 'datatables.net-responsive-bs5'

const props = defineProps({
  orders: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['view-detail'])

const tableRef = ref(null)
const tableKey = ref(0)
let dataTable = null

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const destroyDataTable = () => {
  if (dataTable) {
    try {
      dataTable.destroy()
      dataTable = null
    } catch (e) {
      console.error('Error destroying DataTable:', e)
    }
  }
}

const initDataTable = () => {
  // Destruir tabla anterior
  destroyDataTable()

  // Esperar a que Vue actualice el DOM
  nextTick(() => {
    if (!tableRef.value || props.orders.length === 0) {
      return
    }

    try {
      dataTable = $(tableRef.value).DataTable({
        destroy: true,
        responsive: true,
        language: {
          "decimal": "",
          "emptyTable": "No hay datos disponibles en la tabla",
          "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
          "infoEmpty": "Mostrando 0 a 0 de 0 registros",
          "infoFiltered": "(filtrado de _MAX_ registros totales)",
          "infoPostFix": "",
          "thousands": ",",
          "lengthMenu": "Mostrar _MENU_ registros",
          "loadingRecords": "Cargando...",
          "processing": "Procesando...",
          "search": "Buscar:",
          "zeroRecords": "No se encontraron registros coincidentes",
          "paginate": {
            "first": "Primero",
            "last": "Último",
            "next": "Siguiente",
            "previous": "Anterior"
          },
          "aria": {
            "sortAscending": ": activar para ordenar la columna ascendente",
            "sortDescending": ": activar para ordenar la columna descendente"
          }
        },
        pageLength: 25,
        order: [[1, 'desc']],
        columnDefs: [
          { targets: [8], orderable: false }
        ]
      })
    } catch (e) {
      console.error('❌ Error al inicializar DataTable:', e)
    }
  })
}

const exportToExcel = () => {
  let csv = 'Folio,Fecha,Tipo,Iniciales,Proveedor,RFC,Estado,Monto Total\n'
  
  props.orders.forEach(order => {
    csv += `${order.folio},${formatDate(order.fecha_pedido)},${order.tipo_pedido_nombre},${order.iniciales},${order.proveedor_nombre},${order.proveedor_rfc},${order.estado_pedido_nombre},${order.monto_total}\n`
  })
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}

const printReport = () => {
  window.print()
}

// Watch para reinicializar cuando cambien los orders
watch(() => props.orders, (newOrders, oldOrders) => {  
  // Incrementar la clave para forzar recreación del DOM
  tableKey.value++
  
  // Destruir la tabla anterior inmediatamente
  destroyDataTable()
  
  // Esperar a que Vue recree el elemento
  if (!props.loading && newOrders.length > 0) {
    setTimeout(() => {
      initDataTable()
    }, 100)
  }
}, { deep: true })

onMounted(() => {
  if (!props.loading && props.orders.length > 0) {
    setTimeout(() => {
      initDataTable()
    }, 100)
  }
})

onBeforeUnmount(() => {
  destroyDataTable()
})
</script>

<style scoped>
.results-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.results-title {
  color: #0D4B76;
  font-weight: 600;
  font-size: 1.4rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.export-buttons {
  display: flex;
  gap: 10px;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table {
  margin: 0;
  font-size: 0.9rem;
}

.table thead th {
  background: linear-gradient(135deg, #0D4B76 0%, #1A6B9F 100%);
  color: white;
  border: none;
  padding: 15px 10px;
  font-weight: 600;
  white-space: nowrap;
}

.table tbody tr {
  transition: all 0.3s ease;
}

.table tbody tr:hover {
  background-color: rgba(26, 107, 159, 0.1);
  transform: scale(1.01);
}

.badge {
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-info {
  background: linear-gradient(135deg, #3498DB 0%, #2980B9 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-info:hover {
  transform: scale(1.1);
}
</style>