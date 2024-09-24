<!-- SelectInput.vue -->
<template>
    <div class="ac-single-input is-small is-information">
      <label
        :class="[labelShow ? 'show-label' : '', 'ac-label']"
        @click.prevent="focusInput()"
      >
        {{ schema.title }}
      </label>
      <div class="select-wrapper">
        <select
          ref="selectField"
          v-model="modelData"
          class="ac-input"
          :class="{
            'is-success': validationOb.dirty && validationOb.valid,
            'is-danger': validationOb.dirty && !validationOb.valid,
            'bg-white': modelData,
          }"
          @focus="triggerInput()"
          @blur="unTriggerInput()"
        >
          <option
            v-for="option in schema.enum"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <!-- Validation icons -->
        <template v-if="validationOb.dirty">
          <span v-if="validationOb.valid" class="validation-icon is-success">
            <i class="fa fa-check"></i>
          </span>
          <span v-if="!validationOb.valid" class="validation-icon is-danger">
            <i class="fa fa-exclamation-triangle"></i>
          </span>
        </template>
        <!-- Error message -->
        <p v-if="validationOb.errors.length > 0" class="help is-danger">
          {{ validationOb.errors[0] }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { model } from '../mixins/model.js';
  import validation from '../mixins/validation.js';
  import size from '../mixins/size.js';
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'SelectInput',
  
    mixins: [model, validation, size],
  
    props: {
      schema: {
        type: Object,
        default: () => ({}),
      },
      modelValue: {
        type: [String, Number, null],
        default: '',
      },
      validationOb: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['update:modelValue'],
  
    data() {
      return {
        labelShow: !!this.modelValue,
      };
    },
  
    computed: {
      identifier() {
        return `id-${this.schema.title.replace(/\s+/g, '-')}-${Date.now()}`;
      },
      modelData: {
        get() {
          return this.modelValue;
        },
        set(value) {
          this.$emit('update:modelValue', value);
        },
      },
    },
  
    methods: {
      triggerInput() {
        this.labelShow = true;
      },
      unTriggerInput() {
        if (!this.modelData) this.labelShow = false;
      },
      focusInput() {
        this.labelShow = true;
        this.$refs.selectField.focus();
      },
    },
  });
  </script>
  
  <style scoped>
  .ac-single-input {
    position: relative;
    margin-bottom: 20px;
  }
  
  .ac-label {
    position: absolute;
    top: 12px;
    left: 12px;
    font-size: 12px;
    color: #aaa;
    transition: all 0.2s;
  }
  
  .ac-input {
    width: 100%;
    padding: 12px;
    padding-left: 12px;
    padding-right: 40px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .ac-input:focus {
    outline: none;
    border-color: #3273dc;
  }
  
  .show-label {
    top: -4px;
    font-size: 12px;
    color: #3273dc;
  }
  
  .validation-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
  }
  
  .validation-icon.is-success {
    color: #23d160;
  }
  
  .validation-icon.is-danger {
    color: #ff3860;
  }
  
  .help.is-danger {
    color: #ff3860;
    margin-top: 5px;
  }
  
  .select-wrapper {
    position: relative;
  }
  
  .select-wrapper select.ac-input {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-color: #fff;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%23999" height="7" viewBox="0 0 10 7" width="10" xmlns="http://www.w3.org/2000/svg"><path d="M0 0l5 7 5-7z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 10px 7px;
  }
  
  .select-wrapper select.ac-input {
    padding-right: 50px;
  }
  
  .select-wrapper .validation-icon {
    right: 30px; 
  }
  
  .select-wrapper select.ac-input.is-success {
    border-color: #23d160;
  }
  
  .select-wrapper select.ac-input.is-danger {
    border-color: #ff3860;
  }
  
  .bg-white {
    background-color: #fff;
  }
  </style>
  