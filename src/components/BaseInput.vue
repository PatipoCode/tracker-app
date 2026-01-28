<script lang="js" setup>
import { computed } from 'vue'
import { MAX_DECIMAL_PLACES } from '@/constants'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'number', 'email', 'password'].includes(value),
  },
  step: {
    type: String,
    default: 'any',
  },
  id: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const inputMode = computed(() => (props.type === 'number' ? 'decimal' : null))
const inputType = computed(() => (props.type === 'number' ? 'text' : props.type))

const cleanNumericInput = (value) => {
  let cleaned = value.replace(/[^0-9.,]/g, '')
  cleaned = cleaned.replace(/,/g, '.')

  const firstDotIndex = cleaned.indexOf('.')
  if (firstDotIndex !== -1) {
    const beforeDot = cleaned.substring(0, firstDotIndex + 1)
    const afterDot = cleaned.substring(firstDotIndex + 1).replace(/\./g, '')
    cleaned = beforeDot + afterDot
  }

  const [integerPart, decimalPart] = cleaned.split('.')
  if (decimalPart && decimalPart.length > MAX_DECIMAL_PLACES) {
    cleaned = `${integerPart}.${decimalPart.substring(0, MAX_DECIMAL_PLACES)}`
  }

  return cleaned
}

const handleInput = (event) => {
  let value = event.target.value

  if (props.type === 'number') {
    value = cleanNumericInput(value)
    event.target.value = value
  }

  emit('update:modelValue', value)
}

const handleBlur = (event) => {
  if (props.type === 'number') {
    const hasValue =
      props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''

    if (hasValue) {
      const num = parseFloat(String(props.modelValue))
      const isValidNumber = !isNaN(num) && num > 0

      if (isValidNumber) {
        const formatted = num.toFixed(MAX_DECIMAL_PLACES)
        event.target.value = formatted
        emit('update:modelValue', formatted)
      }
    }
  }

  emit('blur', event)
}
</script>
<template>
  <input
    :id="id"
    :value="modelValue"
    :type="inputType"
    :placeholder="placeholder"
    :step="step"
    :inputmode="inputMode"
    class="form-control"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>
