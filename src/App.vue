<template>
  <div id="app">
    <div id="header" class="ac-navbar-area is-full is-fixed ml-0">
      <div class="ac-navbar-inner">
        <!-- navbar start -->
        <nav class="ac-navbar">
          <!-- Navbar brand logo -->
          <div class="ac-navbar-brand">
            <a href="https://byte.builders/">
              <img src="https://cdn.appscode.com/images/products/bytebuilders/bytebuilders.png" />
            </a>
            <strong>(Vue OpenAPI Form)</strong>
          </div>

          <!-- Navigation buttons for Job Listing & Scheduling and Executions -->
          <div class="ac-navbar-menu">
            <button class="button is-primary ml-10" @click="goToJobListing">Jobs & Scheduling</button>
            <button class="button is-primary ml-10" @click="goToExecutionList">Executions</button>

            <!-- GitHub link -->
            <div class="ac-menu-item">
              <a href="https://github.com/raphael-fokus/vue-openapi-form" class="button ac-nav-button">
                <i class="fa fa-github" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </nav>
        <!-- navbar end -->
      </div>
    </div>
    <div class="vue-form-scema-body mt-50">
      <div class="is-flex gap-20">
        <div class="left-content">
          <div class="left-content-wrapper">
            <div v-if="!modifiedSchema" class="select-box-wrapper">
              <h5 class="mb-10 is-block">Select Schema</h5>
              <div class="select is-fullwidth">
                <select id="schema-selection" v-model="selectedJsonSchema">
                  <option v-for="schema in jsonSchemas" :key="schema.title" :value="schema">
                    {{ schema.title }}
                  </option>
                </select>
              </div>
            </div>
            <div v-else class="level">
              <div class="level-left">Schema has been modified</div>
              <div class="level-right">
                <button class="button is-warning" @click.prevent="resetForm">Reset</button>
              </div>
            </div>
            <schema-model :key="JSON.stringify(selectedJsonSchema)" :schema-model="selectedJsonSchema"
              @submit="updateSchema" />
          </div>
        </div>
        <div class="right-content">
          <vue-openapi-form ref="vof" :key="JSON.stringify(selectedJsonSchema)" v-model="model" class="ml-10"
            :schema="jsonSchema" :reference-model="referenceModel || ''" :form-title="formTitle">

            <template #left-controls>
              <div class="form-controls-left">
                <ac-button title="Clear" modifier-classes="is-outlined is-danger" @click.prevent="clearFormInputs" />
              </div>
            </template>
            <template #right-controls="{ validate }">
              <div class="form-controls-right">
                <ac-button title="Done" :is-loader-active="isLoading" icon-class="check"
                  @click.prevent="submitFunc(validate)" />
                <ac-button title="Submit" class="ml-10" :is-loader-active="isLoading" icon-class="send"
                  @click.prevent="submitData(validate)" />

                <!-- Checkbox for optional form clearing after submission
              <div class="clear-form-toggle">
                <input type="checkbox" id="clearFormCheckbox" v-model="clearForm" />
                <label for="clearFormCheckbox">Clear form after submission</label>
              </div>-->
              </div>
            </template>
          </vue-openapi-form>
        </div>
      </div>
      <router-view ref="jobListingPage" />
    </div>
  </div>
</template>

<script>
import Schemas from '@/json-schema.js';
import { defineAsyncComponent, defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'App',
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
      selectedJsonSchema: null, // Will be set in created()
      jsonSchema: {},           // Will be set in created()
      model: {},                // Will be set in created()
      referenceModel: {},
      formTitle: '',
      modifiedSchema: false,
      isLoading: false,
      clearForm: true,
      baseUrl: import.meta.env.VITE_BASE_URL,
      initialModel: {}, // Will store a deep copy of the initial model
    };
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const store = useStore();

    const goToJobListing = () => {
      router.push({ name: 'JobListing' });
    };

    const goToExecutionList = () => {
      router.push({ name: 'ExecutionList' });
    };

    // Dispatch the action to register the admin worker and establish WebSocket connection
    onMounted(() => {
      store.dispatch('registerAdminWorker');
    });

    return {
      goToJobListing,
      goToExecutionList,
      toast,
    };
  },
  created() {
    // Get persisted schema and model from local storage
    const persistedSchema = this.getPersistedSchema();
    const persistedModel = this.getPersistedModel();

    // Set selectedJsonSchema
    this.selectedJsonSchema = persistedSchema || this.jsonSchemas[0];

    // Set jsonSchema based on selectedJsonSchema
    this.jsonSchema = JSON.parse(JSON.stringify(this.selectedJsonSchema.schema));

    // Set model
    this.model = persistedModel || JSON.parse(JSON.stringify(this.selectedJsonSchema.model));

    // Store a deep copy of the initial model
    this.initialModel = JSON.parse(JSON.stringify(this.model));

    // Set formTitle based on selectedJsonSchema
    this.formTitle = this.selectedJsonSchema.title;

    // Initialize referenceModel
    this.referenceModel = JSON.parse(JSON.stringify(this.model));
  },
  watch: {
    selectedJsonSchema: {
      deep: true,
      immediate: true,
      async handler(newVal) {
        if (!newVal) return; // Prevent errors when newVal is null
        this.jsonSchema = JSON.parse(JSON.stringify(newVal.schema));
        setTimeout(() => {
          this.model = JSON.parse(JSON.stringify(newVal.model));
          this.referenceModel = JSON.parse(JSON.stringify(this.model));
          // Update the initial model
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
      // Reset the model to the initial state
      this.model = JSON.parse(JSON.stringify(this.initialModel));
      this.persistModel(this.model); // Update local storage
      this.$refs.vof.$forceUpdate();  // Force update to refresh the form
    },

    cancelFunc() {
      console.log('form is canceled');
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

          const jobListingPage = this.$refs.jobListingPage;
          if (jobListingPage && jobListingPage.refreshJobList) {
            jobListingPage.refreshJobList();
          }

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

    // Persistence 
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
});
</script>

<style lang="scss" scoped>
/* Existing styles remain unchanged */
.ac-navbar-area {
  &.is-full {
    margin-left: 0;

    .ac-navbar {
      grid-template-columns: 500px auto;
      width: 100%;
      gap: 20px;

      .ac-navbar-brand {
        padding-left: 15px;
      }
    }
  }

  .ac-navbar {
    display: inline-grid;
    grid-template-columns: auto auto;
    grid-gap: 20px;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 0 20px;

    .ac-navbar-brand {
      display: flex;
      align-items: center;

      .logo {
        font-size: 20px;
        font-weight: 600;
        color: $white-100;
      }

      img {
        height: 30px;
      }
    }

    .ac-navbar-cluster-switcher {
      max-width: 350px;
    }

    .ac-navbar-menu {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .ac-menu-item {
        position: relative;
        z-index: 1;
      }
    }
  }
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

// Custom styling for form controls
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
</style>
