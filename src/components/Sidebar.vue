<script setup lang="ts">
/** Props: qué vista está activa para resaltar el item del menú */
defineProps<{ vistaActual: string }>()

/** Emite el nombre de la vista al hacer clic en un item */
const emit = defineEmits<{ (e: 'navegar', vista: string): void }>()

const items = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
  },
  {
    id: 'productos',
    label: 'Productos',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  },
]
</script>

<template>
  <aside class="w-64 flex-shrink-0 bg-slate-900 flex flex-col h-full">

    <!-- Logo / Brand -->
    <div class="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <div>
        <span class="text-white font-bold text-base tracking-tight">InvenSys</span>
        <span class="text-brand-400 font-bold text-base">2</span>
        <p class="text-slate-500 text-xs font-normal -mt-0.5">Gestión de Inventarios</p>
      </div>
    </div>

    <!-- Navegación principal -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <p class="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Menú</p>

      <button
        v-for="item in items"
        :key="item.id"
        @click="emit('navegar', item.id)"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group"
        :class="vistaActual === item.id
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <!-- Ícono SVG (inline) -->
        <span
          class="w-5 h-5 flex-shrink-0"
          :class="vistaActual === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'"
          v-html="item.icon"
        />
        {{ item.label }}

        <!-- Indicador activo -->
        <span
          v-if="vistaActual === item.id"
          class="ml-auto w-1.5 h-1.5 rounded-full bg-white/70"
        />
      </button>
    </nav>

    <!-- Footer del sidebar -->
    <div class="px-4 py-4 border-t border-slate-800">
      <div class="flex items-center gap-3 px-2">
        <div class="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center text-brand-400 text-xs font-semibold">A</div>
        <div class="min-w-0">
          <p class="text-sm font-medium text-slate-300 truncate">Administrador</p>
          <p class="text-xs text-slate-500 truncate">admin@invensys.com</p>
        </div>
      </div>
    </div>

  </aside>
</template>
