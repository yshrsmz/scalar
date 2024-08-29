<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { type IconDefinition, LibraryIcon } from '@scalar/icon-library'
import { type DeepReadonly, computed } from 'vue'

const props = defineProps<{
  icons: DeepReadonly<IconDefinition[]>
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', icon: string): void
}>()

const value = computed<string>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>
<template>
  <RadioGroup
    v-if="icons.length"
    v-model="value"
    as="template">
    <div class="flex flex-col gap-1">
      <RadioGroupLabel
        v-if="$slots.default"
        class="text-c-2 text-xs font-medium px-2">
        <slot />
      </RadioGroupLabel>
      <div
        class="grid grid-cols-[repeat(auto-fill,minmax(32px,1fr))] auto-rows-[32px] justify-between content-between">
        <RadioGroupOption
          v-for="icon in icons"
          :key="icon.src"
          v-slot="{ active, checked }"
          as="template"
          :value="icon.src">
          <li
            class="p-2.25 rounded flex items-center justify-center text-c-3 cursor-pointer hover:text-c-2 hover:bg-b-2"
            :class="{
              'bg-b-2': active,
              'bg-b-3': checked,
            }">
            <RadioGroupLabel class="sr-only">
              {{ icon.title }} Icon
            </RadioGroupLabel>
            <LibraryIcon :src="icon.src" />
          </li>
        </RadioGroupOption>
      </div>
    </div>
  </RadioGroup>
</template>
