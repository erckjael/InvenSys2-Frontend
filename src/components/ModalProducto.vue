<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Producto, CreateProductoDto } from '../services/productos.service'

// ── Props y emits ───────────────────────────────────────────────────────────
const props = defineProps<{
  abierto: boolean
  producto: Producto | null   // null = modo crear | Producto = modo editar
}>()

const emit = defineEmits<{
  (e: 'cerrar'): void
  (e: 'guardar', dto: CreateProductoDto): void
}>()

// ── Estado del formulario ───────────────────────────────────────────────────
const form = ref<CreateProductoDto>({
  codigo: '',
  nombre: '',
  precioCompra: 0,
  precioVenta: 0,
  stockActual: 0,
  stockMinimo: 0,
  categoriaId: undefined,
})

const guardando   = ref(false)
const errorMsg    = ref<string | null>(null)
const errores     = ref<Partial<Record<keyof CreateProductoDto, string>>>({})

// ── Cuando se abre el modal, poblar o limpiar el form ──────────────────────
watch(
  () => props.abierto,
  (abierto) => {
    if (!abierto) return
    errorMsg.value = null
    errores.value  = {}

    if (props.producto) {
      // Modo editar: pre-poblar con los valores actuales
      form.value = {
        codigo:      props.producto.codigo,
        nombre:      props.producto.nombre,
        precioCompra: Number(props.producto.precioCompra),
        precioVenta:  Number(props.producto.precioVenta),
        stockActual:  props.producto.stockActual,
        stockMinimo:  props.producto.stockMinimo,
        categoriaId:  props.producto.categoria?.idCategoria,
      }
    } else {
      // Modo crear: limpiar formulario
      form.value = {
        codigo: '', nombre: '', precioCompra: 0,
        precioVenta: 0, stockActual: 0, stockMinimo: 0,
        categoriaId: undefined,
      }
    }
  },
  { immediate: true }
)

// ── Validación simple del formulario ───────────────────────────────────────
const validar = (): boolean => {
  const e: typeof errores.value = {}
  if (!form.value.codigo.trim())       e.codigo      = 'El código es obligatorio.'
  if (!form.value.nombre.trim())       e.nombre      = 'El nombre es obligatorio.'
  if (form.value.precioCompra <= 0)    e.precioCompra = 'Debe ser mayor a 0.'
  if (form.value.precioVenta  <= 0)    e.precioVenta  = 'Debe ser mayor a 0.'
  if ((form.value.stockActual ?? 0) < 0) e.stockActual = 'No puede ser negativo.'
  if ((form.value.stockMinimo ?? 0) < 0) e.stockMinimo = 'No puede ser negativo.'
  errores.value = e
  return Object.keys(e).length === 0
}

// ── Enviar el formulario ───────────────────────────────────────────────────
const enviar = async () => {
  if (!validar()) return
  guardando.value = true
  errorMsg.value  = null
  try {
    emit('guardar', { ...form.value })
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message ?? 'Error al guardar el producto.'
  } finally {
    guardando.value = false
  }
}

const cerrar = () => {
  if (guardando.value) return
  emit('cerrar')
}
</script>

<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="abierto"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @mousedown.self="cerrar"
      >
        <!-- Fondo difuminado -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="cerrar" />

        <!-- Panel del modal -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 class="text-base font-semibold text-gray-900">
                {{ producto ? 'Editar Producto' : 'Nuevo Producto' }}
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ producto ? 'Modifica los campos que necesites.' : 'Completa la información del nuevo producto.' }}
              </p>
            </div>
            <button @click="cerrar" class="btn-ghost rounded-full p-1.5" :disabled="guardando">
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Cuerpo del formulario -->
          <div class="overflow-y-auto px-6 py-5 space-y-4">

            <!-- Error global -->
            <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {{ errorMsg }}
            </div>

            <!-- Fila: Código + Nombre -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label" for="f-codigo">Código <span class="text-red-500">*</span></label>
                <input id="f-codigo" v-model="form.codigo" :class="errores.codigo ? 'input-error' : 'input'" placeholder="Ej: PROD-001" />
                <p v-if="errores.codigo" class="mt-1 text-xs text-red-500">{{ errores.codigo }}</p>
              </div>
              <div>
                <label class="label" for="f-nombre">Nombre <span class="text-red-500">*</span></label>
                <input id="f-nombre" v-model="form.nombre" :class="errores.nombre ? 'input-error' : 'input'" placeholder="Ej: Camiseta Polo M" />
                <p v-if="errores.nombre" class="mt-1 text-xs text-red-500">{{ errores.nombre }}</p>
              </div>
            </div>

            <!-- Fila: Precio Compra + Precio Venta -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label" for="f-compra">Precio Compra <span class="text-red-500">*</span></label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input id="f-compra" v-model.number="form.precioCompra" type="number" min="0" step="0.01" :class="[errores.precioCompra ? 'input-error' : 'input', 'pl-7']" />
                </div>
                <p v-if="errores.precioCompra" class="mt-1 text-xs text-red-500">{{ errores.precioCompra }}</p>
              </div>
              <div>
                <label class="label" for="f-venta">Precio Venta <span class="text-red-500">*</span></label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input id="f-venta" v-model.number="form.precioVenta" type="number" min="0" step="0.01" :class="[errores.precioVenta ? 'input-error' : 'input', 'pl-7']" />
                </div>
                <p v-if="errores.precioVenta" class="mt-1 text-xs text-red-500">{{ errores.precioVenta }}</p>
              </div>
            </div>

            <!-- Fila: Stock Actual + Stock Mínimo -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label" for="f-stock">Stock Actual</label>
                <input id="f-stock" v-model.number="form.stockActual" type="number" min="0" :class="errores.stockActual ? 'input-error' : 'input'" placeholder="0" />
                <p v-if="errores.stockActual" class="mt-1 text-xs text-red-500">{{ errores.stockActual }}</p>
              </div>
              <div>
                <label class="label" for="f-minimo">Stock Mínimo</label>
                <input id="f-minimo" v-model.number="form.stockMinimo" type="number" min="0" :class="errores.stockMinimo ? 'input-error' : 'input'" placeholder="0" />
                <p v-if="errores.stockMinimo" class="mt-1 text-xs text-red-500">{{ errores.stockMinimo }}</p>
              </div>
            </div>

            <!-- Margen de ganancia (calculado automáticamente) -->
            <div
              v-if="form.precioCompra > 0 && form.precioVenta > 0"
              class="bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <span class="text-sm text-brand-700 font-medium">Margen de ganancia</span>
              <span class="text-sm font-bold text-brand-700">
                {{ (((form.precioVenta - form.precioCompra) / form.precioCompra) * 100).toFixed(1) }}%
              </span>
            </div>

          </div>

          <!-- Footer con botones -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button @click="cerrar" class="btn-secondary" :disabled="guardando">Cancelar</button>
            <button @click="enviar" class="btn-primary min-w-[120px]" :disabled="guardando">
              <svg v-if="guardando" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              <svg v-else class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ guardando ? 'Guardando…' : (producto ? 'Actualizar' : 'Crear Producto') }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
