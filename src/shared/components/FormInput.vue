<template>
  <div>
    <label :for="id" class="block text-md font-medium text-[var(--text-subtle-color)]">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      class="w-full mt-1 px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--blue-dark)] outline-none bg-[var(--bg-primary)] text-[var(--text-primary-color)]"
      :placeholder="placeholder"
      :required="required"
      :value="modelValue ?? '' "
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  modelValue?: string;
}>();

defineEmits(["update:modelValue"]);
</script>
