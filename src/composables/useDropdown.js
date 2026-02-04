import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

export function useDropdown() {
  const isOpen = ref(false)
  const dropdownRef = ref(null)

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }

  const closeDropdown = () => {
    isOpen.value = false
  }

  const handleKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleDropdown()
    }
    if (event.key === 'Escape') {
      closeDropdown()
    }
  }

  onClickOutside(dropdownRef, closeDropdown)

  return {
    isOpen,
    dropdownRef,
    toggleDropdown,
    closeDropdown,
    handleKeydown,
  }
}
