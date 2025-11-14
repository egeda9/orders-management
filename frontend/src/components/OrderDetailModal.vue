<template>
  <div 
    class="modal fade" 
    :class="{ show: show }" 
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-file-invoice me-2"></i>
            Detalle del Pedido
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        
        <div class="modal-body" v-if="order">
          <div class="row">
            <!-- Información General -->
            <div class="col-md-12">
              <h6 class="section-title">
                <i class="fas fa-info-circle me-2"></i>
                Información General
              </h6>
            </div>

            <div class="col-md-3">
              <div class="detail-item">
                <strong>Folio:</strong>
                <span>{{ order.folio }}</span>
              </div>
            </div>

            <div class="col-md-3">
              <div class="detail-item">
                <strong>Fecha:</strong>
                <span>{{ formatDate(order.fecha_pedido) }}</span>
              </div>
            </div>

            <div class="col-md-3">
              <div class="detail-item">
                <strong>Tipo:</strong>
                <span class="badge bg-secondary">{{ order.tipo_pedido_nombre }}</span>
              </div>
            </div>

            <div class="col-md-3">
              <div class="detail-item">
                <strong>Iniciales:</strong>
                <span>{{ order.iniciales }}</span>
              </div>
            </div>

            <div class="col-md-4">
              <div class="detail-item">
                <strong>Estado del Pedido:</strong>
                <span 
                  class="badge" 
                  :class="order.estado_pedido_nombre === 'COMPLETO' ? 'bg-success' : 'bg-warning'"
                >
                  {{ order.estado_pedido_nombre }}
                </span>
              </div>
            </div>

            <div class="col-md-4">
              <div class="detail-item">
                <strong>Estado de Surtido:</strong>
                <span class="badge bg-info">{{ order.estado_surtido_nombre }}</span>
              </div>
            </div>

            <div class="col-md-4">
              <div class="detail-item">
                <strong>Número de Contrato:</strong>
                <span>{{ order.numero_contrato }}</span>
              </div>
            </div>

            <!-- Información del Proveedor -->
            <div class="col-md-12 mt-4">
              <h6 class="section-title">
                <i class="fas fa-truck me-2"></i>
                Información del Proveedor
              </h6>
            </div>

            <div class="col-md-6">
              <div class="detail-item">
                <strong>Proveedor:</strong>
                <span>{{ order.proveedor_nombre }}</span>
              </div>
            </div>

            <div class="col-md-6">
              <div class="detail-item">
                <strong>RFC:</strong>
                <span>{{ order.proveedor_rfc }}</span>
              </div>
            </div>

            <div class="col-md-4">
              <div class="detail-item">
                <strong>Contacto:</strong>
                <span>{{ order.proveedor_contacto }}</span>
              </div>
            </div>

            <div class="col-md-4">
              <div class="detail-item">
                <strong>Teléfono:</strong>
                <span>{{ order.proveedor_telefono }}</span>
              </div>
            </div>

            <div class="col-md-4">
              <div class="detail-item">
                <strong>Email:</strong>
                <span>{{ order.proveedor_email }}</span>
              </div>
            </div>

            <!-- Información de Entrega -->
            <div class="col-md-12 mt-4">
              <h6 class="section-title">
                <i class="fas fa-shipping-fast me-2"></i>
                Información de Entrega
              </h6>
            </div>

            <div class="col-md-6">
              <div class="detail-item">
                <strong>Dirección de Entrega:</strong>
                <span>{{ order.direccion_entrega }}</span>
              </div>
            </div>

            <div class="col-md-3">
              <div class="detail-item">
                <strong>Fecha de Entrega:</strong>
                <span>{{ formatDate(order.fecha_entrega) }}</span>
              </div>
            </div>

            <div class="col-md-3">
              <div class="detail-item">
                <strong>Tiempo de Entrega:</strong>
                <span>{{ order.tiempo_entrega }}</span>
              </div>
            </div>

            <!-- Partidas -->
            <div class="col-md-12 mt-4" v-if="order.partidas && order.partidas.length > 0">
              <h6 class="section-title">
                <i class="fas fa-list me-2"></i>
                Partidas del Pedido
              </h6>
              <div class="table-responsive">
                <table class="table table-sm table-bordered">
                  <thead>
                    <tr>
                      <th>Partida</th>
                      <th>Clave</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Surtida</th>
                      <th>Precio</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(partida, index) in order.partidas" :key="index">
                      <td>{{ partida.partida }}</td>
                      <td>{{ partida.clave_presupuestal }}</td>
                      <td>{{ partida.nombre_partida }}</td>
                      <td>{{ partida.cantidad }} {{ partida.unidad }}</td>
                      <td>{{ partida.cantidad_surtida }} {{ partida.unidad }}</td>
                      <td>${{ formatCurrency(partida.precio) }}</td>
                      <td>${{ formatCurrency(partida.cantidad * partida.precio) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Montos -->
            <div class="col-md-12 mt-4">
              <h6 class="section-title">
                <i class="fas fa-calculator me-2"></i>
                Resumen de Montos
              </h6>
            </div>

            <div class="col-md-3">
              <div class="detail-item">
                <strong>Subtotal:</strong>
                <span>${{ formatCurrency(order.subtotal) }}</span>
              </div>
            </div>

            <div class="col-md-3">
              <div class="detail-item">
                <strong>IVA:</strong>
                <span>${{ formatCurrency(order.total_iva) }}</span>
              </div>
            </div>

            <div class="col-md-3">
              <div class="detail-item">
                <strong>Retenciones:</strong>
                <span>${{ formatCurrency(order.total_retenciones) }}</span>
              </div>
            </div>

            <div class="col-md-3">
              <div class="detail-item total-amount">
                <strong>Total:</strong>
                <span>${{ formatCurrency(order.monto_total) }}</span>
              </div>
            </div>

            <!-- Observaciones -->
            <div class="col-md-12 mt-4" v-if="order.observaciones">
              <h6 class="section-title">
                <i class="fas fa-comment me-2"></i>
                Observaciones
              </h6>
              <p class="observaciones-text">{{ order.observaciones }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            <i class="fas fa-times me-2"></i>
            Cerrar
          </button>
          <button type="button" class="btn btn-primary" @click="printDetail">
            <i class="fas fa-print me-2"></i>
            Imprimir
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade" :class="{ show: show }" v-if="show"></div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

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

const printDetail = () => {
  window.print()
}
</script>

<style scoped>
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop.show {
  opacity: 0.5;
}

.modal-header {
  background: linear-gradient(135deg, #0D4B76 0%, #1A6B9F 100%);
  color: white;
  border-bottom: none;
}

.modal-title {
  font-weight: 600;
}

.btn-close {
  filter: brightness(0) invert(1);
}

.section-title {
  color: #0D4B76;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #E9ECEF;
}

.detail-item {
  margin-bottom: 15px;
  padding: 10px;
  background: #F8F9FA;
  border-radius: 8px;
}

.detail-item strong {
  display: block;
  color: #0D4B76;
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.detail-item span {
  font-size: 0.95rem;
  color: #2C3E50;
}

.total-amount {
  background: linear-gradient(135deg, #0D4B76 0%, #1A6B9F 100%);
  color: white;
}

.total-amount strong,
.total-amount span {
  color: white;
}

.observaciones-text {
  background: #F8F9FA;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #1A6B9F;
}

.table {
  font-size: 0.85rem;
}

.table thead th {
  background: #0D4B76;
  color: white;
  font-weight: 600;
}

.badge {
  padding: 6px 12px;
  font-size: 0.85rem;
}
</style>