import api from './api'

/** Tipos para el recurso Producto */
export interface Producto {
  idProducto: number
  codigo: string
  nombre: string
  precioCompra: number
  precioVenta: number
  stockActual: number
  stockMinimo: number
  categoria?: { idCategoria: number; nombreCategoria: string } | null
  createdAt?: string
}

export interface CreateProductoDto {
  codigo: string
  nombre: string
  precioCompra: number
  precioVenta: number
  stockActual?: number
  stockMinimo?: number
  categoriaId?: number
}

export type UpdateProductoDto = Partial<CreateProductoDto>

/** Servicio con todas las llamadas a /productos */
export const productosService = {
  /** GET /productos — lista todos los productos */
  getAll: () => api.get<Producto[]>('/productos'),

  /** GET /productos/:id — obtiene un producto por ID */
  getById: (id: number) => api.get<Producto>(`/productos/${id}`),

  /** POST /productos — crea un nuevo producto */
  create: (dto: CreateProductoDto) => api.post<Producto>('/productos', dto),

  /** PATCH /productos/:id — actualización parcial */
  update: (id: number, dto: UpdateProductoDto) =>
    api.patch<Producto>(`/productos/${id}`, dto),

  /** DELETE /productos/:id — elimina un producto */
  remove: (id: number) => api.delete<{ message: string }>(`/productos/${id}`),
}
