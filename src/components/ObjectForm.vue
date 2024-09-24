<!-- object-form.vue -->
<template>
  <div class="mb-15" :class="{ 'is-hidden': isSelfFolded }">
    <template v-for="(key, idx) in Object.keys(properties)" :key="key">
      <!-- If the property is another object -->
      <v-field v-if="properties[key].type === 'object'" :key="key + '-object'" v-slot="{ field, handleChange }"
        v-model="modelData[key]" :name="`${fieldName}/${key}`"
        :rules="ruleObject(propertiesRequired && isRequired(key))" :label="properties[key].title || key" as="">
        <object-form-wrapper :model-value="field.value" :field-name="`${fieldName}/${key}`" :expand-form="level < 2"
          :is-last-child="idx === Object.keys(properties).length - 1" :level="level + 1" :type="properties[key].type"
          :is-self-required="propertiesRequired && isRequired(key)" :schema="properties[key]" :errors="errors"
          :reference-model="referenceModel[key] || {}" :showRootTab="false" @update:modelValue="handleChange" />
      </v-field>

      <!-- If the property is a key-value pair -->
      <v-field v-else-if="properties[key].type === 'key-value-pairs'" :key="key + '-key-value-pairs'"
        v-slot="{ field, handleChange }" v-model="modelData[key]" :name="`${fieldName}/${key}`"
        :rules="ruleObject(propertiesRequired && isRequired(key))" :label="properties[key].title || key" as="">
        <key-value-pairs :model-value="field.value" :field-name="`${fieldName}/${key}`"
          :is-last-child="idx === Object.keys(properties).length - 1" :type="properties[key].type"
          :schema="properties[key]" :errors="errors" :reference-model="referenceModel[key] || {}"
          @update:modelValue="handleChange" />
      </v-field>

      <!-- If the property is an array -->
      <v-field v-else-if="properties[key].type === 'array'" :key="key + '-array'" v-slot="{ field, handleChange }"
        v-model="modelData[key]" :name="`${fieldName}/${key}`" :rules="ruleArray(propertiesRequired && isRequired(key))"
        :label="properties[key].title || key" as="">
        <array-input :model-value="field.value" :field-name="`${fieldName}/${key}`"
          :is-last-child="idx === Object.keys(properties).length - 1" :type="properties[key].type"
          :schema="properties[key]" :errors="errors" :reference-model="referenceModel[key] || []"
          @update:modelValue="handleChange" />
      </v-field>

      <!-- If the property is an enum (handled by SelectInput.vue) -->
      <v-field v-else-if="properties[key].enum" :key="key + '-enum'"
        v-slot="{ field, handleChange, errors: fieldErrors, meta }" v-model="modelData[key]"
        :name="`${fieldName}/${key}`" :rules="ruleString(propertiesRequired && isRequired(key))"
        :label="properties[key].title || key" as="">
        <select-input :model-value="field.value" :schema="properties[key]"
          :validation-ob="{ errors: fieldErrors, ...meta }" :reference-model="referenceModel[key] || ''"
          @update:modelValue="handleChange" />
      </v-field>

      <!-- If the property is a simple string or number -->
      <v-field v-else :key="key + '-simple'" v-slot="{ field, handleChange, errors: fieldErrors, meta }"
        v-model="modelData[key]" :rules="ruleString(propertiesRequired && isRequired(key))"
        :name="`${fieldName}/${key}`" :label="properties[key].title || key" as="">
        <simple-input :key="key" :model-value="field.value" :type="properties[key].type" :schema="properties[key]"
          :validation-ob="{ errors: fieldErrors, ...meta }" :reference-model="referenceModel[key] || ''"
          @update:modelValue="handleChange" />
      </v-field>
    </template>
  </div>
</template>

<script>
import { model } from '../mixins/model.js';
import fold from '../mixins/fold.js';
import validation from '../mixins/validation.js';
import { defineComponent } from 'vue';
import SimpleInput from './SimpleInput.vue';
import SelectInput from './SelectInput.vue';
import ObjectFormWrapper from './ObjectFormWrapper.vue';
import KeyValuePairs from './KeyValuePairs.vue';
import ArrayInput from './ArrayInput.vue';

export default defineComponent({
  name: 'ObjectForm',
  components: {
    SimpleInput,
    SelectInput,
    ObjectFormWrapper,
    KeyValuePairs,
    ArrayInput,
  },
  mixins: [model, fold, validation],
  props: {
    properties: {
      type: Object,
      default: () => ({}),
    },
    fieldName: {
      type: String,
      default: '',
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    required: {
      type: Array,
      default: () => [],
    },
    level: {
      type: Number,
      default: 1,
    },
    referenceModel: {
      type: Object,
      default: () => ({}),
    },
    isSelfRequired: {
      type: Boolean,
      default: false,
    },
    isSelfFolded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    propertiesRequired() {
      return this.isSelfRequired || Object.keys(this.modelData).length > 0;
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
    isRequired(key) {
      return this.required.includes(key);
    },
    ruleEnum(isRequired) {
      // Implement your validation rules for enums here
      return isRequired ? 'required' : '';
    },
    ruleObject(isRequired) {
      // Implement your validation rules for objects here
      return isRequired ? 'required' : '';
    },
    ruleArray(isRequired) {
      // Implement your validation rules for arrays here
      return isRequired ? 'required' : '';
    },
    ruleString(isRequired) {
      // Implement your validation rules for strings here
      return isRequired ? 'required' : '';
    },
  },
});
</script>
