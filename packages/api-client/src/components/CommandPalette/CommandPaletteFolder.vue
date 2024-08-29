<script setup lang="ts">
import { useWorkspace } from '@/store/workspace'
import { ScalarButton, ScalarIcon, ScalarListbox } from '@scalar/components'
import { useToasts } from '@scalar/use-toasts'
import { computed, ref } from 'vue'

import CommandActionForm from './CommandActionForm.vue'
import CommandActionInput from './CommandActionInput.vue'

const emits = defineEmits<{
  (event: 'close'): void
}>()

const { activeWorkspaceCollections, folderMutators, activeCollection } =
  useWorkspace()
const folderName = ref('')
const selectedCollectionId = ref(activeCollection.value?.uid ?? '')
const { toast } = useToasts()

const availableCollections = computed(() =>
  activeWorkspaceCollections.value.map((collection) => ({
    id: collection.uid,
    label: collection.spec?.info?.title ?? '',
  })),
)

const selectedCollection = computed({
  get: () =>
    availableCollections.value.find(
      ({ id }) => id === selectedCollectionId.value,
    ),
  set: (opt) => {
    if (opt?.id) selectedCollectionId.value = opt.id
  },
})

const handleSubmit = () => {
  if (!folderName.value) {
    toast('Please enter a name before creating a folder.', 'error')
    return
  }
  if (folderName.value && selectedCollection.value) {
    folderMutators.add(
      {
        name: folderName.value,
      },
      selectedCollectionId.value,
    )
    emits('close')
  }
}
</script>
<template>
  <CommandActionForm
    :disabled="!folderName.trim()"
    @submit="handleSubmit">
    <CommandActionInput
      v-model="folderName"
      label="Folder Name"
      placeholder="Folder Name" />
    <template #options>
      <ScalarListbox
        v-model="selectedCollection"
        :options="availableCollections">
        <ScalarButton
          class="justify-between p-2 max-h-8 w-full gap-1 text-xs hover:bg-b-2"
          variant="outlined">
          <span :class="selectedCollection ? 'text-c-1' : 'text-c-3'">{{
            selectedCollection ? selectedCollection.label : 'Select Collection'
          }}</span>
          <ScalarIcon
            class="text-c-3"
            icon="ChevronDown"
            size="xs" />
        </ScalarButton>
      </ScalarListbox>
    </template>
    <template #submit>Create Folder</template>
  </CommandActionForm>
</template>
