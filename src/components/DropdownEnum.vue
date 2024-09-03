<template>
    <div>
      <label>{{ label }}</label>
      <select v-model="internalValue">
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        required: true
      },
      label: {
        type: String,
        default: ''
      }
    },
    computed: {
      internalValue: {
        get() {
          return this.modelValue;
        },
        set(value) {
          this.$emit('update:modelValue', value);
        }
      }
    }
  };
  </script>
  