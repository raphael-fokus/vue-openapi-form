<template>
  <div class="home-container">
    <h1>Job Template Generator</h1>
    <div class="home-content">
      <div class="left-content">
        <!-- Formular zur Generierung von Job-Templates -->
        <vue-openapi-form
          ref="vof"
          :key="JSON.stringify(selectedJsonSchema)"
          v-model="model"
          class="ml-10"
          :schema="jsonSchema"
          :reference-model="referenceModel || ''"
          :form-title="formTitle"
        >
          <!-- Links Controls Slot -->
          <template #left-controls>
            <div class="form-controls-left">
              <ac-button
                title="Clear"
                modifier-classes="is-outlined is-danger"
                @click.prevent="clearFormInputs"
              />
            </div>
          </template>

          <!-- Rechts Controls Slot -->
          <template #right-controls="{ validate }">
            <div class="form-controls-right">
              <ac-button
                title="Done"
                :is-loader-active="isLoading"
                icon-class="check"
                @click.prevent="submitFunc(validate)"
              />
              <ac-button
                title="Submit"
                class="ml-10"
                :is-loader-active="isLoading"
                icon-class="send"
                @click.prevent="submitData(validate)"
              />
            </div>
          </template>
        </vue-openapi-form>
      </div>

      <div class="right-content">
        <!-- Header mit Toggle-Button -->
        <div class="schema-header is-flex is-justify-content-space-between is-align-items-center mb-3">
          <h2 class="title is-5">Schema & Model</h2>
          <button
            class="button is-small is-rounded"
            @click="toggleSchemaCollapse"
            aria-label="Toggle Schema & Model"
          >
            <i :class="['fa', isSchemaCollapsed ? 'fa-plus' : 'fa-minus']"></i>
          </button>
        </div>

        <!-- Kollapsible Schema- und Model-Eingabe mit Transition -->
        <transition name="fade">
          <div v-show="!isSchemaCollapsed" class="schema-content">
            <schema-model
              :key="JSON.stringify(selectedJsonSchema)"
              :schema-model="selectedJsonSchema"
              @submit="updateSchema"
            />
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>


<script>
import Schemas from '@/json-schema.js';
import { defineAsyncComponent } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { useStore } from 'vuex';

export default {
  name: 'Home',
  components: {
    VueOpenapiForm: defineAsyncComponent(() =>
      import('@/components/VueOpenapiForm.vue').then((module) => module.default)
    ),
    SchemaModel: defineAsyncComponent(() =>
      import('@/components/SchemaModel.vue').then((module) => module.default)
    ),
    AcButton: defineAsyncComponent(() =>
      import('@appscode/design-system/vue-components/v3/button/Button.vue')
    ),
  },
  data() {
    return {
      jsonSchemas: Schemas,
      selectedJsonSchema: null,
      jsonSchema: {},
      model: {},
      referenceModel: {},
      formTitle: '',
      modifiedSchema: false,
      isLoading: false,
      clearForm: true,
      baseUrl: import.meta.env.VUE_APP_API_URL || 'http://localhost:3003/api',
      initialModel: {},
      isSchemaCollapsed: false, 
    };
  },
  setup() {
    const store = useStore();
    const toast = useToast();

    return {
      toast,
    };
  },
  created() {
    const persistedSchema = this.getPersistedSchema();
    const persistedModel = this.getPersistedModel();


    this.selectedJsonSchema = persistedSchema || this.jsonSchemas[0];

    this.jsonSchema = JSON.parse(JSON.stringify(this.selectedJsonSchema.schema));

    this.model = persistedModel || JSON.parse(JSON.stringify(this.selectedJsonSchema.model));

    this.initialModel = JSON.parse(JSON.stringify(this.model));

    this.formTitle = this.selectedJsonSchema.title;

    this.referenceModel = JSON.parse(JSON.stringify(this.model));
  },
  watch: {
    selectedJsonSchema: {
      deep: true,
      immediate: true,
      async handler(newVal) {
        if (!newVal) return;
        this.jsonSchema = JSON.parse(JSON.stringify(newVal.schema));
        setTimeout(() => {
          this.model = JSON.parse(JSON.stringify(newVal.model));
          this.referenceModel = JSON.parse(JSON.stringify(this.model));
          this.initialModel = JSON.parse(JSON.stringify(this.model));
        }, 2000);
        this.formTitle = newVal.title;
        this.persistSchema(newVal);
      },
    },
    model: {
      handler(newVal) {
        this.persistModel(newVal);
      },
      deep: true,
    },
  },
  methods: {
    toggleSchemaCollapse() {
      this.isSchemaCollapsed = !this.isSchemaCollapsed;
    },
    updateSchema(e) {
      this.modifiedSchema = true;
      this.selectedJsonSchema = e;
    },
    resetForm() {
      this.modifiedSchema = false;
      this.selectedJsonSchema = Schemas[0];
      this.clearFormInputs();
    },
    clearFormInputs() {
      this.model = JSON.parse(JSON.stringify(this.initialModel));
      this.persistModel(this.model); 
      this.$refs.vof.$forceUpdate();  
    },
    cancelFunc() {
      console.log('Form is canceled');
    },
    async submitFunc(validate) {
      this.isLoading = true;
      const { valid } = await validate();
      if (valid) {
        this.toast.success('Form is valid');
      } else {
        this.toast.error('Form is invalid');
      }
      this.isLoading = false;
    },
    async submitData(validate) {
      this.isLoading = true;
      const { valid } = await validate();
      if (valid) {
        try {
          await axios.post(`${this.baseUrl}/v1/measurement`, this.model);
          this.toast.success('Job submitted successfully');

          this.$router.push({ name: 'JobListing' });

          if (this.clearForm) {
            this.clearFormInputs();
          }
        } catch (error) {
          this.toast.error('Error submitting Job');
        }
      } else {
        this.toast.error('Form is invalid');
      }
      this.isLoading = false;
    },

    //Persistence
    persistModel(model) {
      localStorage.setItem('formModel', JSON.stringify(model));
    },
    persistSchema(schema) {
      localStorage.setItem('formSchema', JSON.stringify(schema));
    },
    getPersistedModel() {
      const persistedModel = localStorage.getItem('formModel');
      return persistedModel ? JSON.parse(persistedModel) : null;
    },
    getPersistedSchema() {
      const persistedSchema = localStorage.getItem('formSchema');
      return persistedSchema ? JSON.parse(persistedSchema) : null;
    },
    getPersistedJsonSchema() {
      const persistedSchema = this.getPersistedSchema();
      return persistedSchema ? JSON.parse(JSON.stringify(persistedSchema.schema)) : {};
    },
  },
};
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.home-content {
  display: flex;
  gap: 20px;
}


.left-content {
  flex: 2; 
  display: flex;
  flex-direction: column;
}

.right-content {
  flex: 1; 
  display: flex;
  flex-direction: column;
}

.form-controls-left,
.form-controls-right {
  display: flex;
  align-items: center;
}

.vue-openapi-form__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.clear-button {
  margin-bottom: 10px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.clear-form-toggle {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.clear-form-toggle input {
  margin-right: 10px;
}


.left-content-wrapper {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.select-box-wrapper {
  margin-bottom: 20px;
}

.level {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.level-left {
  font-weight: bold;
}

.button.is-warning {
  background-color: #ffdd57;
  border-color: #ffdd57;
  color: #fff;
}

.button.is-primary {
  background-color: #176bb5;
  border-color: #176bb5;
  color: #fff;
}

.button.is-danger {
  background-color: #ff3860;
  border-color: #ff3860;
  color: #fff;
}

.ml-10 {
  margin-left: 10px;
}

.mt-50 {
  margin-top: 50px;
}

.no-workers {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.worker-legend .icon-warning {
  color: #ff3860;
}

.worker-legend .icon-connected {
  color: #23d160;
}

/* Fade Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
