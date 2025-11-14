<template>
  <div class="filters-section">
    <h3 class="filters-title">
      <i class="fas fa-filter"></i>
      Filtros de Búsqueda
    </h3>

    <div class="row g-3">
      <div class="col-md-3">
        <label for="folioFilter" class="form-label">Folio</label>
        <input
          type="text"
          class="form-control"
          id="folioFilter"
          v-model="filters.folio"
          placeholder="Buscar por folio..."
          @keyup.enter="applyFilters"
        />
      </div>

      <div class="col-md-3">
        <label for="supplierFilter" class="form-label">Proveedor</label>
        <input
          type="text"
          class="form-control"
          id="supplierFilter"
          v-model="filters.supplier"
          placeholder="Buscar por proveedor..."
          @keyup.enter="applyFilters"
        />
      </div>

      <div class="col-md-3">
        <label for="typeFilter" class="form-label">Tipo</label>
        <select class="form-select" id="typeFilter" v-model="filters.type" @change="applyFilters">
          <option value="">Todos los tipos</option>
          <option value="Material">Material</option>
          <option value="Servicio">Servicio</option>
        </select>
      </div>

      <div class="col-md-3">
        <label for="statusFilter" class="form-label">Estado</label>
        <select class="form-select" id="statusFilter" v-model="filters.status" @change="applyFilters">
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="COMPLETO">Completo</option>
        </select>
      </div>

      <div class="col-md-3">
        <label for="dateFromFilter" class="form-label">Fecha Desde</label>
        <input
          type="date"
          class="form-control"
          id="dateFromFilter"
          v-model="filters.dateFrom"
          @change="applyFilters"
        />
      </div>

      <div class="col-md-3">
        <label for="dateToFilter" class="form-label">Fecha Hasta</label>
        <input
          type="date"
          class="form-control"
          id="dateToFilter"
          v-model="filters.dateTo"
          @change="applyFilters"
        />
      </div>

      <div class="col-md-6 d-flex align-items-end gap-2">
        <button 
          type="button" 
          class="btn btn-primary flex-grow-1" 
          @click="applyFilters"
        >
          <i class="fas fa-search me-2"></i>
          Buscar
        </button>
        <button 
          type="button" 
          class="btn btn-warning" 
          @click="clearFilters"
        >
          <i class="fas fa-eraser me-2"></i>
          Limpiar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['filter'])

const filters = ref({
  folio: '',
  supplier: '',
  type: '',
  status: '',
  dateFrom: '',
  dateTo: ''
})

const applyFilters = () => {
  emit('filter', { ...filters.value })
}

const clearFilters = () => {  
  filters.value = {
    folio: '',
    supplier: '',
    type: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  }

  emit('filter', { ...filters.value })
}
</script>

<style scoped>
.filters-section {
  background: #F8F9FA;
  border: 2px solid #E9ECEF;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
}

.filters-title {
  color: #0D4B76;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-label {
  font-weight: 600;
  color: #0D4B76;
  margin-bottom: 8px;
}

.form-control,
.form-select {
  border: 2px solid #E9ECEF;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
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
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 75, 118, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-warning {
  background: linear-gradient(135deg, #F39C12 0%, #E67E22 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-warning:hover {
  transform: translateY(-2px);
  color: white;
}

.btn-warning:active {
  transform: translateY(0);
}
</style>