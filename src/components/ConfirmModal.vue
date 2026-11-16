<script setup lang="ts">
/** Modal genérico de confirmación para acciones destructivas (eliminar) */
defineProps<{
  abierto:   boolean
  titulo:    string
  mensaje:   string
  cargando?: boolean
}>()

const emit = defineEmits<{
  (e: 'cancelar'): void
  (e: 'confirmar'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="abierto" class="fixed inset-0 z-50 flex items-center justify-center p-4" @mousedown.self="emit('cancelar')">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('cancelar')" />

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <!-- Icono de advertencia -->
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>

          <h3 class="text-center text-base font-semibold text-gray-900 mb-2">{{ titulo }}</h3>
          <p class="text-center text-sm text-gray-500 mb-6" v-html="mensaje" />

          <div class="flex gap-3">
            <button @click="emit('cancelar')" class="btn-secondary flex-1" :disabled="cargando">Cancelar</button>
            <button @click="emit('confirmar')" class="btn-danger flex-1" :disabled="cargando">
              <svg v-if="cargando" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              {{ cargando ? 'Eliminando…' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.18s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
