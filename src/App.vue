<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import ProductosView from './views/ProductosView.vue'
import DashboardView from './views/DashboardView.vue'

/** Vista activa en el sidebar */
const vistaActual = ref<'dashboard' | 'productos'>('dashboard')
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">

    <!-- ── Sidebar ───────────────────────────────────────── -->
    <Sidebar :vista-actual="vistaActual" @navegar="vistaActual = ($event as 'dashboard' | 'productos')" />

    <!-- ── Área de contenido principal ───────────────────── -->
    <main class="flex-1 flex flex-col overflow-hidden">

      <!-- Header de página -->
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">
            {{ vistaActual === 'dashboard' ? 'Dashboard' : 'Gestión de Productos' }}
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">
            {{ vistaActual === 'dashboard' ? 'Resumen general de tu inventario' : 'Consulta, registra y administra tu catálogo' }}
          </p>
        </div>
        <!-- Perfil de usuario (placeholder visual) -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500 hidden sm:block">Admin</span>
          <div class="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-semibold select-none">
            A
          </div>
        </div>
      </header>

      <!-- Vista dinámica -->
      <div class="flex-1 overflow-y-auto p-6 md:p-8">
        <Transition name="fade" mode="out-in">
          <DashboardView v-if="vistaActual === 'dashboard'" />
          <ProductosView v-else-if="vistaActual === 'productos'" />
        </Transition>
      </div>

    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
