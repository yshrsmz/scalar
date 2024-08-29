<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { ScalarPopover } from '@scalar/components'
import { type IconDefinition, libraryIcons } from '@scalar/icon-library'
import { type DeepReadonly, computed } from 'vue'

import IconSelectorGroup from './IconSelectorGroup.vue'

const props = defineProps<{
  modelValue: string
  placement?: AlignedPlacement
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', icon: string): void
}>()

type Side = 'top' | 'bottom'
type Alignment = 'start' | 'end'
type AlignedPlacement = `${Side}-${Alignment}`

// const modal = useModalState()

type IconGroup = {
  label: string
  icons: DeepReadonly<IconDefinition[]>
  custom?: boolean
}

const groups = computed<IconGroup[]>(() => [
  {
    label: 'Light Icons',
    icons: libraryIcons.filter(({ group }) => group === 'line'),
  },
  {
    label: 'Solid Icons',
    icons: libraryIcons.filter(({ group }) => group === 'solid'),
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
  <ScalarPopover
    class="bg-b-2 rounded"
    :placement="placement ?? 'bottom'">
    <slot />
    <template #popover>
      <TabGroup
        as="div"
        class="flex flex-col">
        <div class="flex text-sm">
          <div class="font-medium py-1 px-2">
            <slot name="title">Icon</slot>
          </div>
          <TabList class="flex gap-1 relative z-0">
            <Tab
              v-for="{ label } in groups"
              :key="label"
              class="px-2 py-1 -mb-[0.5px] text-c-2 ui:selected z-1 border border-b-0 ui-selected:bg-b-1 ui-selected:text-c-1 hover:text-c-1 rounded-t">
              {{ label }}
            </Tab>
          </TabList>
        </div>
        <TabPanels
          class="flex flex-col rounded bg-b-1 border gap-5 p-1 max-w-[420px] w-dvw custom-scroll">
          <TabPanel
            v-for="{ label, icons } in groups"
            :key="label"
            as="template">
            <IconSelectorGroup
              v-model="value"
              :icons="icons" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </template>
  </ScalarPopover>
</template>
