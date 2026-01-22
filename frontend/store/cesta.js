import { defineStore } from 'pinia'

export const useCestaStore = defineStore('cesta', {

  state: () => ({
    items: []
  }),

  getters: {
    totalItems (state) {
      return state.items.reduce((total, item) => total + item.cantidad, 0)
    },

    totalPrecio (state) {
      return state.items.reduce(
        (total, item) =>
          total + (item.precio_unitario || item.precio) * item.cantidad,
        0
      )
    }
  },

  actions: {

    // 🔹 Cargar cesta UNA SOLA VEZ
    cargarCesta() {
      const saved = localStorage.getItem('cesta')
      this.items = saved ? JSON.parse(saved) : []
    },

    // 🔹 Guardar cuando hay cambios reales
    guardarCesta() {
      localStorage.setItem('cesta', JSON.stringify(this.items))
    },

    addProducto (producto) {
      const existente = this.items.find(item => item.id === producto.id)

      if (existente) {
        existente.cantidad++
      } else {
        this.items.push({
          ...producto,
          cantidad: 1
        })
      }

      this.guardarCesta()
    },

    removeProducto(id) {
      this.items = this.items.filter(item => item.id !== id)
      this.guardarCesta()
    },

    incrementar (id) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.cantidad++
        this.guardarCesta()
      }
    },

    decrementar (id) {
      const item = this.items.find(item => item.id === id)
      if (item && item.cantidad > 1) {
        item.cantidad--
        this.guardarCesta()
      }
    },

    clearCesta() {
      this.items = []
      localStorage.removeItem('cesta')
    }
  }
})
