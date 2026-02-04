import { defineStore } from 'pinia'
import { STORAGE_KEY } from '@/constants'

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    expenses: [],
    isInitialized: false,
  }),

  getters: {
    totalExpenses: (state) => {
      return state.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    },

    statsByCategories: (state) => {
      const stats = {}

      state.expenses.forEach((expense) => {
        if (!stats[expense.category]) {
          stats[expense.category] = 0
        }
        stats[expense.category] += expense.amount
      })

      return stats
    },

    availableCategories: (state) => {
      return [...new Set(state.expenses.map((expense) => expense.category))]
    },
  },

  actions: {
    loadFromStorage() {
      const saved = localStorage.getItem(STORAGE_KEY)

      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          this.expenses = parsed.map((expense) => ({
            ...expense,
            date: new Date(expense.date),
          }))
        } catch (error) {
          console.error('Failed to load expenses from localStorage:', error)
          localStorage.removeItem(STORAGE_KEY)
          this.expenses = []
        }
      }

      this.isInitialized = true
    },

    saveToStorage() {
      if (this.isInitialized) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.expenses))
      }
    },

    addExpense(expense) {
      this.expenses.push({
        ...expense,
        id: Date.now(),
      })
      this.saveToStorage()
    },

    deleteExpense(id) {
      this.expenses = this.expenses.filter((expense) => expense.id !== id)
      this.saveToStorage()
    },
  },
})
