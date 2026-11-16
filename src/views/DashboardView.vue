<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productosService } from '../services/productos.service'

// ── Métricas del dashboard ──────────────────────────────────────────────────
const totalProductos  = ref(0)
const totalStock      = ref(0)
const alertasStock    = ref(0)
const agotados        = ref(0)
const cargando        = ref(true)

onMounted(async () => {
  try {
    const { data } = await productosService.getAll()
    totalProductos.value = data.length
    totalStock.value     = data.reduce((s, p) => s + p.stockActual, 0)
    alertasStock.value   = data.filter(p => p.stockActual > 0 && p.stockActual <= p.stockMinimo).length
    agotados.value       = data.filter(p => p.stockActual === 0).length
  } finally {
    cargando.value = false
  }
})

const stats = [
  {
    label: 'Total Productos',
    key: 'totalProductos',
    color: 'brand',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
  },
  {
    label: 'Unidades en Stock',
    key: 'totalStock',
    color: 'emerald',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  },
  {
    label: 'Stock Bajo',
    key: 'alertasStock',
    color: 'amber',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  {
    label: 'Productos Agotados',
    key: 'agotados',
    color: 'red',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
  },
]

const valoresStats: Record<string, typeof totalProductos> = {
  totalProductos,
  totalStock,
  alertasStock,
  agotados,
}

const colorMap: Record<string, string> = {
  brand:   'bg-brand-100 text-brand-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber:   'bg-amber-100 text-amber-600',
  red:     'bg-red-100 text-red-600',
}
</script>

<template>
  <div class="space-y-6">

    <!-- Bienvenida -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">¡Bienvenido a InvenSys2! 👋</h2>
      <p class="text-gray-500 mt-1">Aquí tienes un resumen del estado actual de tu inventario.</p>
    </div>

    <!-- Tarjetas de estadísticas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.key"
        class="card flex items-center gap-4"
      >
        <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" :class="colorMap[stat.color]">
          <span class="w-6 h-6" v-html="stat.icon" />
        </div>
        <div>
          <p class="text-xs text-gray-500 font-medium">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-0.5">
            <span v-if="cargando" class="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse" />
            <span v-else>{{ valoresStats[stat.key].value }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Panel informativo -->
    <div class="card bg-gradient-to-br from-brand-50 to-white border-brand-200">
      <h3 class="font-semibold text-brand-900 mb-1">🚀 PMV — Fase 1 Completada</h3>
      <p class="text-sm text-brand-700">
        El backend NestJS y este frontend Vue 3 están conectados y funcionando.
        Navega a <strong>Productos</strong> para gestionar tu catálogo.
      </p>
    </div>

  </div>
</template>
