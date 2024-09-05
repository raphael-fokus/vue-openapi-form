<template>
  <v-form ref="v-form" v-slot="{ meta, validate, errors }" as="">
    <ac-form>
      <div class="vue-openapi-form pl-20" :class="{ 'is-medium': size === 'medium' }">
        <!-- Dynamisches Rendering von Feldern basierend auf dem Schema -->
        <v-field
          v-for="(property, key) in extendedSchema.properties"
          :key="key"
          v-slot="{ field, handleChange }"
          v-model="modelData[key]"
          :name="key"
          :label="key"
          :rules="ruleObject(true)"
          as=""
        >
          <!-- Prüfen, ob es sich um ein Enum-Feld handelt -->
          <DropdownEnum
            v-if="property.enum"
            v-model="modelData[key]"
            :label="key"
            :options="property.enum"
          />
          <!-- Standard-Input für andere Felder -->
          <object-form-wrapper
            v-else
            :field-name="key"
            :model-value="modelData[key]"
            :expand-form="true"
            :is-root="true"
            :level="1"
            :is-self-required="true"
            :only-json="onlyJson"
            :schema="property"
            :reference-model="referenceModel || {}"
            :errors="errors"
            :showRootTab="true"
            @update:modelValue="handleChange"
          />
        </v-field>
      </div>

      <template #form-left-controls>
        <form-footer-control>
          <slot
            name="left-controls"
            :validate="validate"
            :form-status="meta"
            :errors="errors"
          />
        </form-footer-control>
      </template>

      <template #form-right-controls>
        <form-footer-control>
          <slot
            name="right-controls"
            :validate="validate"
            :form-status="meta"
            :errors="errors"
          />
        </form-footer-control>
      </template>
    </ac-form>
  </v-form>
</template>

<script>
import ExtendSchema from '../functional-components/extend-schema.js';
import validation from '../mixins/validation.js';
import { model } from '../mixins/model.js';
import { defineAsyncComponent, defineComponent } from 'vue';
import DropdownEnum from './DropdownEnum.vue';  

export default defineComponent({
  name: 'VueOpenapiForm',
  components: {
    AcForm: defineAsyncComponent(() =>
      import('@appscode/design-system/vue-components/v3/form/Form.vue')
    ),
    FormFooterControl: defineAsyncComponent(() =>
      import(
        '@appscode/design-system/vue-components/v3/form/FormFooterControl.vue'
      )
    ),
    DropdownEnum  
  },
  mixins: [model, validation],
  provide() {
    const providedData = {};

    // using defineProperty to make provide data reactive
    // ref : https://stackoverflow.com/a/65720394
    Object.defineProperty(providedData, 'theme', {
      enumerable: true,
      get: () => this.themeMode,
    });
    return {
      providedData,
    };
  },
  props: {
    schema: {
      type: Object,
      default: () => ({}),
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    formTitle: {
      type: String,
      default: '',
    },
    onlyJson: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'small',
    },
    themeMode: {
      type: String,
      default: 'light',
    },
  },
  computed: {
    extendedSchema() {
      return ExtendSchema(this.schema, this.formTitle);
    },
    modelData() {
      return this.modelValue;
    }
  }
});
</script>

<style lang="scss">
@import 'font-awesome/css/font-awesome.min.css';
@import '../assets/scss/main.scss';
</style>
