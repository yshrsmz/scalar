<script setup lang="ts">
import { ScalarPopover } from '@scalar/components'
import { type IconDefinition, libraryIcons } from '@scalar/icon-library'
import { type DeepReadonly, computed } from 'vue'

import IconSelectorGroup from './IconSelectorGroup.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', icon: string): void
}>()

// const modal = useModalState()

type IconGroup = {
  label: string
  icons: DeepReadonly<IconDefinition[]>
  custom?: boolean
}

const groups = computed<IconGroup[]>(() => [
  {
    label: 'Solid Icons',
    icons: libraryIcons.filter(({ group }) => group === 'solid'),
  },
  {
    label: 'Light Icons',
    icons: libraryIcons.filter(({ group }) => group === 'line'),
  },
  {
    label: 'Brand Icons',
    icons: libraryIcons.filter(({ group }) => group === 'brand'),
  },
])

const value = computed<string>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>
<template>
  <ScalarPopover>
    <slot />
    <template #popover>
      <div class="flex flex-col gap-5 px-2.5 icon-list py-2 custom-scroll">
        <IconSelectorGroup
          v-for="{ label, icons } in groups"
          :key="label"
          v-model="value"
          :icons="icons">
          {{ label }}
        </IconSelectorGroup>
      </div>
    </template>
  </ScalarPopover>
</template>
<style scoped>
.icon-list {
  max-width: 420px;
  max-height: 280px;
  width: 100dvh;
}
</style>
