<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { productosService, type Producto, type CreateProductoDto } from '../services/productos.service'
import ModalProducto from '../components/ModalProducto.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

// ── Estado principal ────────────────────────────────────────────────────────
const productos       = ref<Producto[]>([])
const cargando        = ref(false)
const error           = ref<string | null>(null)
const busqueda        = ref('')

// ── Estado del modal de crear/editar ───────────────────────────────────────
const modalAbierto    = ref(false)
const productoEditar  = ref<Producto | null>(null)

// ── Estado del modal de confirmación (delete) ──────────────────────────────
const confirmAbierto  = ref(false)
const productoAEliminar = ref<Producto | null>(null)
const eliminando      = ref(false)

// ── Computed: filtrar productos por búsqueda ───────────────────────────────
const productosFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return productos.value
  return productos.value.filter(
    (p) =>
      p.nombre.toLowerCase().includes(q) ||
      p.codigo.toLowerCase().includes(q),
  )
})

// ── Helpers de formato ─────────────────────────────────────────────────────
const formatPrecio = (valor: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor)

const estadoStock = (p: Producto): 'ok' | 'bajo' | 'agotado' => {
  if (p.stockActual === 0)                   return 'agotado'
  if (p.stockActual <= p.stockMinimo)        return 'bajo'
  return 'ok'
}

// ── Cargar productos ───────────────────────────────────────────────────────
const cargarProductos = async () => {
  cargando.value = true
  error.value    = null
  try {
    const { data } = await productosService.getAll()
    productos.value = data
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Error al conectar con el servidor.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarProductos)

// ── Abrir modal para Nuevo ─────────────────────────────────────────────────
const abrirNuevo = () => {
  productoEditar.value = null
  modalAbierto.value   = true
}

// ── Abrir modal para Editar ────────────────────────────────────────────────
const abrirEditar = (p: Producto) => {
  productoEditar.value = p
  modalAbierto.value   = true
}

// ── Guardar (crear o actualizar) ───────────────────────────────────────────
const guardar = async (dto: CreateProductoDto) => {
  if (productoEditar.value) {
    // PATCH — actualizar
    const { data } = await productosService.update(productoEditar.value.idProducto, dto)
    const idx = productos.value.findIndex(p => p.idProducto === data.idProducto)
    if (idx !== -1) productos.value[idx] = data
  } else {
    // POST — crear
    const { data } = await productosService.create(dto)
    productos.value.unshift(data)
  }
  modalAbierto.value = false
}

// ── Confirmar eliminación ──────────────────────────────────────────────────
const pedirEliminar = (p: Producto) => {
  productoAEliminar.value = p
  confirmAbierto.value    = true
}

const confirmarEliminar = async () => {
  if (!productoAEliminar.value) return
  eliminando.value = true
  try {
    await productosService.remove(productoAEliminar.value.idProducto)
    productos.value = productos.value.filter(
      p => p.idProducto !== productoAEliminar.value!.idProducto
    )
    confirmAbierto.value = false
  } catch {
    // el modal muestra el error
  } finally {
    eliminando.value = false
  }
}
</script>

<template>
  <div class="space-y-6">

    <!-- ── Barra de acciones ─────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <!-- Búsqueda -->
      <div class="relative max-w-sm w-full">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre o código…"
          class="input pl-9"
        />
      </div>

      <div class="flex items-center gap-2">
        <!-- Recargar -->
        <button @click="cargarProductos" class="btn-secondary" :disabled="cargando" title="Recargar">
          <svg class="w-4 h-4" :class="{ 'animate-spin': cargando }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Recargar
        </button>
        <!-- Nuevo -->
        <button @click="abrirNuevo" class="btn-primary">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Producto
        </button>
      </div>
    </div>

    <!-- ── Error de conexión ─────────────────────────────── -->
    <div v-if="error" class="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>{{ error }}</span>
    </div>

    <!-- ── Tabla de productos ─────────────────────────────── -->
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Stock</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Skeleton loading -->
          <tr v-if="cargando" v-for="i in 5" :key="i">
            <td colspan="7">
              <div class="h-4 bg-gray-100 rounded animate-pulse w-full" />
            </td>
          </tr>

          <!-- Sin resultados -->
          <tr v-else-if="productosFiltrados.length === 0">
            <td colspan="7" class="text-center py-16 text-gray-400">
              <svg class="w-10 h-10 mx-auto mb-3 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/></svg>
              <p class="font-medium">No hay productos</p>
              <p class="text-sm mt-1">{{ busqueda ? 'No coincide ningún resultado.' : 'Crea tu primer producto con el botón de arriba.' }}</p>
            </td>
          </tr>

          <!-- Filas de datos -->
          <tr v-else v-for="p in productosFiltrados" :key="p.idProducto">
            <td>
              <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{{ p.codigo }}</span>
            </td>
            <td class="font-medium text-gray-900">{{ p.nombre }}</td>
            <td class="text-gray-500">{{ p.categoria?.nombreCategoria ?? '—' }}</td>
            <td>{{ formatPrecio(p.precioCompra) }}</td>
            <td class="font-semibold text-gray-900">{{ formatPrecio(p.precioVenta) }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'badge-green':  estadoStock(p) === 'ok',
                  'badge-yellow': estadoStock(p) === 'bajo',
                  'badge-red':    estadoStock(p) === 'agotado',
                }"
              >
                {{ p.stockActual }}
                <span class="ml-1 opacity-60 font-normal">
                  {{ estadoStock(p) === 'ok' ? '✓' : estadoStock(p) === 'bajo' ? '↓ bajo' : '✕ agotado' }}
                </span>
              </span>
            </td>
            <td class="text-right">
              <div class="flex items-center justify-end gap-1">
                <button @click="abrirEditar(p)" class="btn-ghost p-2 rounded-lg" title="Editar">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button @click="pedirEliminar(p)" class="btn-ghost p-2 rounded-lg text-red-500 hover:bg-red-50" title="Eliminar">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Footer de tabla con conteo -->
      <div v-if="!cargando && productosFiltrados.length > 0" class="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
        Mostrando {{ productosFiltrados.length }} de {{ productos.length }} producto(s)
      </div>
    </div>

  </div>

  <!-- ── Modal: Crear / Editar ──────────────────────────── -->
  <ModalProducto
    :abierto="modalAbierto"
    :producto="productoEditar"
    @cerrar="modalAbierto = false"
    @guardar="guardar"
  />

  <!-- ── Modal: Confirmar Eliminar ─────────────────────── -->
  <ConfirmModal
    :abierto="confirmAbierto"
    :cargando="eliminando"
    :titulo="`¿Eliminar producto?`"
    :mensaje="`Esta acción eliminará permanentemente &quot;${productoAEliminar?.nombre}&quot;. No se puede deshacer.`"
    @cancelar="confirmAbierto = false"
    @confirmar="confirmarEliminar"
  />
</template>
