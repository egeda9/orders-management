// Mock database - In production, replace with real database
let pedidos = [
  {
    id_pedido: 1,
    folio: "PED-2024-001",
    consecutivo_completo: "001-2024",
    id_tipo_documento_pedido: 1,
    tipo_documento_nombre: "Orden de Compra",
    id_tipo_pedido: 1,
    tipo_pedido_nombre: "Material",
    id_proveedor: 1,
    proveedor_nombre: "Proveedor ABC S.A. de C.V.",
    proveedor_rfc: "PABC123456789",
    proveedor_contacto: "Juan Pérez",
    proveedor_telefono: "555-1234",
    proveedor_email: "contacto@proveedorabc.com",
    id_procedimiento_adquisicion: 1,
    procedimiento_nombre: "Licitación Pública",
    fecha_pedido: "2024-01-15",
    numero_contrato: "CONT-2024-001",
    destinatario_factura: "Departamento de Compras",
    direccion_entrega: "Calle Principal #123, Ciudad",
    fecha_entrega: "2024-02-15",
    tiempo_entrega: "30 días",
    persona_elaboro: "María García",
    persona_autorizo: "José López",
    iniciales: "MG/JL",
    subtotal: 10000.00,
    total_iva: 1600.00,
    total_retenciones: 0.00,
    monto_total: 11600.00,
    id_estado_pedido: 1,
    estado_pedido_nombre: "PENDIENTE",
    id_estado_surtido: 1,
    estado_surtido_nombre: "NO SURTIDO",
    observaciones: "Entrega urgente",
    fecha_registro: "2024-01-10",
    hora_registro: "10:30",
    id_usuario_registro: 1,
    fecha_modifica: "2024-01-10",
    hora_modifica: "10:30",
    id_usuario_modifica: 1,
    fecha_aprueba: "2024-01-11",
    hora_aprueba: "14:00",
    id_usuario_aprueba: 1,
    id_archivo_firma: null,
    partidas: [
      {
        partida: "001",
        clave_presupuestal: "CP-2024-001",
        nombre_partida: "Material de oficina",
        cantidad: 100,
        cantidad_surtida: 50,
        precio: 50.00,
        unidad: "PZA",
        descripcion: "Plumas azules punto fino",
        observaciones: "Color azul"
      },
      {
        partida: "002",
        clave_presupuestal: "CP-2024-002",
        nombre_partida: "Papel",
        cantidad: 50,
        cantidad_surtida: 0,
        precio: 120.00,
        unidad: "PQT",
        descripcion: "Papel bond tamaño carta",
        observaciones: "Blanco"
      }
    ]
  },
  {
    id_pedido: 2,
    folio: "PED-2024-002",
    consecutivo_completo: "002-2024",
    id_tipo_documento_pedido: 1,
    tipo_documento_nombre: "Orden de Compra",
    id_tipo_pedido: 2,
    tipo_pedido_nombre: "Servicio",
    id_proveedor: 2,
    proveedor_nombre: "Servicios XYZ S.A.",
    proveedor_rfc: "SXYZ987654321",
    proveedor_contacto: "Ana Martínez",
    proveedor_telefono: "555-5678",
    proveedor_email: "info@serviciosxyz.com",
    id_procedimiento_adquisicion: 2,
    procedimiento_nombre: "Adjudicación Directa",
    fecha_pedido: "2024-01-20",
    numero_contrato: "CONT-2024-002",
    destinatario_factura: "Departamento de Servicios",
    direccion_entrega: "Oficina Central, Piso 3",
    fecha_entrega: "2024-02-20",
    tiempo_entrega: "1 mes",
    persona_elaboro: "Carlos Rodríguez",
    persona_autorizo: "Laura Sánchez",
    iniciales: "CR/LS",
    subtotal: 25000.00,
    total_iva: 4000.00,
    total_retenciones: 2500.00,
    monto_total: 26500.00,
    id_estado_pedido: 2,
    estado_pedido_nombre: "COMPLETO",
    id_estado_surtido: 2,
    estado_surtido_nombre: "SURTIDO COMPLETO",
    observaciones: "Servicio de mantenimiento anual",
    fecha_registro: "2024-01-15",
    hora_registro: "09:00",
    id_usuario_registro: 1,
    fecha_modifica: "2024-01-16",
    hora_modifica: "11:00",
    id_usuario_modifica: 1,
    fecha_aprueba: "2024-01-17",
    hora_aprueba: "15:00",
    id_usuario_aprueba: 1,
    id_archivo_firma: null,
    partidas: [
      {
        partida: "001",
        clave_presupuestal: "CP-2024-003",
        nombre_partida: "Mantenimiento preventivo",
        cantidad: 12,
        cantidad_surtida: 12,
        precio: 2083.33,
        unidad: "MES",
        descripcion: "Mantenimiento mensual de equipos",
        observaciones: "Incluye refacciones"
      }
    ]
  }
];

let nextId = 3;

// Helper function to apply filters
const applyFilters = (orders, whereClause) => {
  if (!whereClause) return orders;
  
  return orders.filter(order => {
    // Parse simple WHERE clauses like "pedido.id_estado_pedido=1"
    const conditions = whereClause.split(' AND ');
    
    return conditions.every(condition => {
      const [field, value] = condition.split('=').map(s => s.trim());
      const fieldName = field.includes('.') ? field.split('.')[1] : field;
      
      if (fieldName in order) {
        return order[fieldName].toString() === value;
      }
      return true;
    });
  });
};

// Controller methods
const pedidoController = {
  // GET /api/pedido/ListaSelAll
  listaSelAll: (req, res) => {
    try {
      const { 
        startRowIndex = 0, 
        maximumRows = 10, 
        Where = '', 
        OrderBy = 'id_pedido DESC' 
      } = req.query;

      // Apply filters
      let filteredOrders = applyFilters([...pedidos], Where);

      // Apply sorting
      if (OrderBy) {
        const [field, direction] = OrderBy.split(' ');
        const fieldName = field.includes('.') ? field.split('.')[1] : field;
        const isAsc = direction?.toUpperCase() === 'ASC';
        
        filteredOrders.sort((a, b) => {
          if (a[fieldName] < b[fieldName]) return isAsc ? -1 : 1;
          if (a[fieldName] > b[fieldName]) return isAsc ? 1 : -1;
          return 0;
        });
      }

      // Apply pagination
      const start = parseInt(startRowIndex);
      const max = parseInt(maximumRows);
      const paginatedOrders = filteredOrders.slice(start, start + max);

      res.json({
        pedidos: paginatedOrders,
        totalCount: filteredOrders.length,
        startRowIndex: start,
        maximumRows: max
      });

    } catch (error) {
      console.error('Error in listaSelAll:', error);
      res.status(500).json({ 
        error: 'Error retrieving orders',
        message: error.message 
      });
    }
  },

  // GET /api/pedido/Get
  get: (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ 
          error: 'ID is required',
          message: 'Please provide an order ID' 
        });
      }

      const pedido = pedidos.find(p => p.id_pedido === parseInt(id));

      if (!pedido) {
        return res.status(404).json({ 
          error: 'Order not found',
          message: `Order with ID ${id} does not exist` 
        });
      }

      res.json(pedido);

    } catch (error) {
      console.error('Error in get:', error);
      res.status(500).json({ 
        error: 'Error retrieving order',
        message: error.message 
      });
    }
  },

  // POST /api/pedido/Post
  post: (req, res) => {
    try {
      const newPedido = {
        id_pedido: nextId++,
        ...req.body,
        fecha_registro: new Date().toISOString().split('T')[0],
        hora_registro: new Date().toTimeString().split(' ')[0].substring(0, 5),
        id_usuario_registro: req.user.id
      };

      // Add default partidas if not provided
      if (!newPedido.partidas) {
        newPedido.partidas = [];
      }

      // Add default names for foreign keys
      newPedido.tipo_documento_nombre = "Orden de Compra";
      newPedido.tipo_pedido_nombre = "Material";
      newPedido.proveedor_nombre = "Proveedor Temporal";
      newPedido.proveedor_rfc = "TEMP123456789";
      newPedido.proveedor_contacto = "Contacto";
      newPedido.proveedor_telefono = "000-0000";
      newPedido.proveedor_email = "temp@temp.com";
      newPedido.procedimiento_nombre = "Procedimiento Estándar";
      newPedido.estado_pedido_nombre = "PENDIENTE";
      newPedido.estado_surtido_nombre = "NO SURTIDO";

      pedidos.push(newPedido);

      res.status(201).json({
        message: 'Order created successfully',
        pedido: newPedido
      });

    } catch (error) {
      console.error('Error in post:', error);
      res.status(500).json({ 
        error: 'Error creating order',
        message: error.message 
      });
    }
  },

  // PUT /api/pedido/Put
  put: (req, res) => {
    try {
      const { Id } = req.query;
      const updateData = req.body;

      if (!Id) {
        return res.status(400).json({ 
          error: 'ID is required',
          message: 'Please provide an order ID' 
        });
      }

      const index = pedidos.findIndex(p => p.id_pedido === parseInt(Id));

      if (index === -1) {
        return res.status(404).json({ 
          error: 'Order not found',
          message: `Order with ID ${Id} does not exist` 
        });
      }

      // Update the order
      pedidos[index] = {
        ...pedidos[index],
        ...updateData,
        id_pedido: parseInt(Id), // Ensure ID doesn't change
        fecha_modifica: new Date().toISOString().split('T')[0],
        hora_modifica: new Date().toTimeString().split(' ')[0].substring(0, 5),
        id_usuario_modifica: req.user.id
      };

      res.json({
        message: 'Order updated successfully',
        pedido: pedidos[index]
      });

    } catch (error) {
      console.error('Error in put:', error);
      res.status(500).json({ 
        error: 'Error updating order',
        message: error.message 
      });
    }
  },

  // DELETE /api/pedido/Delete
  delete: (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ 
          error: 'ID is required',
          message: 'Please provide an order ID' 
        });
      }

      const index = pedidos.findIndex(p => p.id_pedido === parseInt(id));

      if (index === -1) {
        return res.status(404).json({ 
          error: 'Order not found',
          message: `Order with ID ${id} does not exist` 
        });
      }

      const deletedPedido = pedidos.splice(index, 1)[0];

      res.json({
        message: 'Order deleted successfully',
        pedido: deletedPedido
      });

    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({ 
        error: 'Error deleting order',
        message: error.message 
      });
    }
  }
};

module.exports = pedidoController;