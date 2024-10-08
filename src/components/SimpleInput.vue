<template>
  <div class="ac-single-input is-small is-information">
    <template v-if="ui.tag === 'input'">
      <template v-if="ui.type === 'checkbox'">
        <div class="ac-single-switch is-small is-flex pb-10">
          <input :id="identifier" v-model="modelData" type="checkbox" name="switchRoundedDefault"
            class="switch ac-switch is-rounded is-primary" />
          <label class="switch-label" :for="identifier">{{ schema.title }}</label>
        </div>
      </template>
      <template v-else>
        <label :class="[labelShow ? 'show-label' : '', 'ac-label']" @click.prevent="focusInput()">{{ schema.title }}</label>
        <div>
          <textarea v-if="isMultilineValue" ref="textareaField" v-model="modelData" class="ac-input"
            style="min-height: 100px" :type="ui.type" :class="{
              'is-success': validationOb.dirty && validationOb.valid,
              'is-danger': validationOb.dirty && !validationOb.valid,
              'bg-white': modelData,
            }" :placeholder="ui.placeholder || ''" @change="modelData = $event.target.value" @focus="triggerInput()"
            @focusout="unTriggerInput()" @paste="onPaste" />
          <input v-else ref="inputField" v-model="modelData" class="ac-input" :type="ui.type" :class="{
            'is-success': validationOb.dirty && validationOb.valid,
            'is-danger': validationOb.dirty && !validationOb.valid,
            'bg-white': modelData,
          }" :placeholder="ui.placeholder || ''" @change="modelData = $event.target.value" @focus="triggerInput()"
            @focusout="unTriggerInput()" @paste="onPaste" />
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { model } from '../mixins/model.js';
import validation from '../mixins/validation.js';
import size from '../mixins/size.js';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SimpleInput',
  mixins: [model, validation, size],
  props: {
    schema: {
      type: Object,
      default: () => ({}),
    },
    modelValue: {
      type: null,
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
      labelShow: false,
      isMultilineValue: false,
    };
  },

  computed: {
    ui() {
      return this.schema.ui || { tag: 'input', type: 'text' };
    },
    identifier() {
      return `id-${this.schema.title.replace(' ', '-')}-${JSON.stringify(
        new Date().valueOf()
      )}`;
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

  mounted() {
    if (this.modelData) this.labelShow = true;
    this.$refs.inputField?.addEventListener('keydown', this.handleKeyDownEvent);
  },

  beforeUnmount() {
    this.$refs.inputField?.removeEventListener('keydown', this.handleKeyDownEvent);
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
      const inputField = this.$refs.inputField;
      inputField.focus();
    },
    onPaste(evt) {
      let pasteData = (evt.clipboardData || window.clipboardData).getData('text');
      const finalData = this.updatedModelDataAfterPasteAndKeyDown(
        evt.target,
        pasteData
      );

      if (pasteData.includes('\n')) {
        this.isMultilineValue = true;
      }

      this.modelData = finalData; 
    },
    handleKeyDownEvent(evt) {
      if (evt.code === 'Enter' && evt.shiftKey) {
        evt.preventDefault();

        const finalData = this.updatedModelDataAfterPasteAndKeyDown(evt.target);

        this.isMultilineValue = true;
        this.modelData = finalData; 
      }
    },

    updatedModelDataAfterPasteAndKeyDown(el, addedData) {
      const { selectionStart, selectionEnd } = el;
      const currentValue = this.modelData || ''; 

      const prefix = currentValue.substring(0, selectionStart);
      const suffix = currentValue.substring(selectionEnd, currentValue.length);

      addedData = addedData ? addedData : '\n';
      return prefix + addedData + suffix;
    },
  },
});
</script>
