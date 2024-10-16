<template>
  <div
    class="ac-nested-elements key-value-pairs is-flex is-flex-direction-column gap-8"
    :class="{ 'stop-line': isLastChild }"
  >
    <div class="nested-header mb-5">
      <h6 class="is-flex is-semi-normal">
        <div class="collaps-icon is-disabled">
          <i aria-hidden="true" class="fa fa-minus"></i>
        </div>
        {{ schema.title || 'Array Item Description' }}
        <component-errors :errors="calcFormErrors(errors, fieldName)" />
      </h6>
      <!-- Entferne die Tabs-Komponente -->
      <!-- <tabs v-model="activeTab" /> -->
    </div>
    <!-- existing key values -->
    <template v-if="activeTab === 'form'">
      <div
        v-for="(prop, index) in keyValueArray"
        :key="`${index}-${schema.title}-form`"
      >
        <key-value-pair-items
          v-model="keyValueArray[index]"
          :field-name="fieldName"
          :reference-model="referencekeyValueArray[index] || {}"
          :index="index"
          :schema="schema"
          :additional-properties="additionalProperties"
          :errors="errors"
          @delete-key-value="deleteProp"
        />
      </div>
      <!-- key input -->
      <v-form
        :id="`${schema.title.replace(/ /g, '-')}-new-observer`"
        v-slot="{ validate, errors: formErrors }"
        :key="updatePass"
        as="div"
        class="key-value-save"
      >
        <!-- ... Rest des Formulars ... -->
      </v-form>
    </template>
    <!-- declared in tabs component -->
    <yaml-form
      v-if="activeTab === 'yaml'"
      v-model="modelData"
      :reference-model="referenceModel || {}"
      @code::model-data-updated="updateKeyValueArray"
    />
    <json-form
      v-else-if="activeTab === 'json'"
      v-model="modelData"
      :reference-model="referenceModel || {}"
      @code::model-data-updated="updateKeyValueArray"
    />
  </div>
</template>

<script>
import { model } from '../mixins/model.js';
// Entferne den Tabs-Mixin, falls nicht mehr benötigt
// import tabs from '../mixins/tabs.js';
import validation from '../mixins/validation.js';
import size from '../mixins/size.js';
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  name: 'KeyValuePairs',

  components: {
    KeyValuePairItems: defineAsyncComponent(() =>
      import('./sub-components/KeyValuePairItems.vue').then(
        (module) => module.default
      )
    ),
  },

  mixins: [model, validation, size], // Entferne 'tabs' Mixin
  props: {
    schema: {
      type: Object,
      default: () => ({}),
    },
    fieldName: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
    isLastChild: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      activeTab: 'form',
      newData: null,
      updatePass: 0,
      keyValueArray: null,
      referencekeyValueArray: null,
      newKey: '',
      newValue: null,
    };
  },

  computed: {
    additionalProperties() {
      return this.schema.additionalProperties || {};
    },
  },

  watch: {
    keyValueArray: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (oldVal !== null && oldVal !== undefined) {
          const stringNewVal = JSON.stringify(newVal);
          this.modelData = this.reconstructObject(JSON.parse(stringNewVal));
        }
      },
    },

    activeTab() {
      // re-calculate keyValueArray
      this.initKeyValueArray();
      this.initReferenceKeyValueArray();
    },

    modelValue: {
      deep: true,
      immediate: true,
      handler(n, o) {
        const newStringifiedObject = JSON.stringify(n);
        const oldStringifiedObject = JSON.stringify(o);
        if (newStringifiedObject !== oldStringifiedObject)
          this.initKeyValueArray();

        this.initReferenceKeyValueArray();
      },
    },
  },

  methods: {
    initKeyValueArray() {
      this.keyValueArray = Object.keys(this.modelValue).map((key) => ({
        key,
        value: this.modelValue[key] || null,
      }));
    },
    initReferenceKeyValueArray() {
      this.referencekeyValueArray = Object.keys(this.referenceModel).map(
        (key) => ({
          key,
          value: this.referenceModel[key] || null,
        })
      );
    },

    updateKeyValueArray(value) {
      this.keyValueArray = Object.keys(value).map((key) => ({
        key,
        value: value[key],
      }));
    },

    reconstructObject(arr) {
      let result = {};
      arr.forEach((item) => {
        result = Object.assign(
          {},
          { ...result },
          {
            [`${item.key}`]: item.value,
          }
        );
      });
      return result;
    },

    async addProp(validate) {
      const { valid } = await validate();

      if (valid) {
        this.keyValueArray.push({
          key: this.newKey,
          value: this.newValue,
        });

        this.newKey = '';
        this.newValue = null;

        this.updatePass += 1;
      }
    },

    deleteProp(index) {
      this.keyValueArray.splice(index, 1);
      this.updatePass += 1;
    },
  },
});
</script>