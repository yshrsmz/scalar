<script setup lang="ts">
import HttpMethod from '@/components/HttpMethod/HttpMethod.vue'
import { useWorkspace } from '@/store/workspace'
import { ScalarButton, ScalarIcon, ScalarListbox } from '@scalar/components'
import type { RequestMethod } from '@scalar/oas-utils/helpers'
import { useToasts } from '@scalar/use-toasts'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import CommandActionForm from './CommandActionForm.vue'
import CommandActionInput from './CommandActionInput.vue'

const emits = defineEmits<{
  (event: 'close'): void
}>()

const { push } = useRouter()
const { toast } = useToasts()

const {
  activeCollection,
  activeWorkspace,
  activeWorkspaceCollections,
  requestMutators,
  activeRequest,
  folders: _folders,
} = useWorkspace()

const requestName = ref('')
const requestMethod = ref('GET')
const selectedCollectionId = ref(activeCollection.value?.uid ?? '')

const collections = computed(() =>
  activeWorkspaceCollections.value.map((collection) => ({
    id: collection.uid,
    label: collection.spec.info?.title ?? 'Unititled Collection',
  })),
)

const selectedCollection = computed({
  get: () =>
    collections.value.find(({ id }) => id === selectedCollectionId.value),
  set: (opt) => {
    if (opt?.id) selectedCollectionId.value = opt.id
  },
})

/** All folders in active workspace */
const folders = computed(() =>
  activeWorkspaceCollections.value.flatMap((collection) =>
    collection.uid === selectedCollectionId.value
      ? collection.childUids.flatMap((uid) => {
          // Check if child of collection is folder as it could be a request
          const folder = _folders[uid]
          return folder
            ? [
                {
                  id: folder.uid,
                  label: folder.name,
                },
              ]
            : []
        })
      : [],
  ),
)
const selectedFolderId = ref(
  Object.values(_folders).find((folder) =>
    folder.childUids.includes(activeRequest.value?.uid),
  )?.uid ?? '',
)

const selectedFolder = computed({
  get: () => folders.value.find(({ id }) => id === selectedFolderId.value),
  set: (opt) => {
    if (opt?.id) selectedFolderId.value = opt.id
  },
})

function handleChangeMethod(method: string) {
  requestMethod.value = method
}

const handleSubmit = () => {
  if (!requestName.value.trim()) {
    toast('Please enter a name before creating a request.', 'error')
    return
  }
  if (!selectedCollectionId.value && !selectedFolder.value?.id) return
  const parentUid = selectedFolder.value?.id ?? selectedCollection.value?.id

  const newRequest = requestMutators.add(
    {
      path: '',
      method: requestMethod.value.toUpperCase() as RequestMethod,
      description: requestName.value,
      operationId: requestName.value,
      summary: requestName.value,
      tags: ['default'],
    },
    parentUid,
  )

  push(`/workspace/${activeWorkspace.value.uid}/request/${newRequest.uid}`)
  emits('close')
}
</script>
<template>
  <CommandActionForm
    :disabled="!requestName.trim()"
    @submit="handleSubmit">
    <CommandActionInput
      v-model="requestName"
      label="Request Name"
      placeholder="Request Name" />
    <template #options>
      <div class="flex gap-2">
        <HttpMethod
          :isEditable="true"
          isSquare
          :method="requestMethod"
          @change="handleChangeMethod" />
        <ScalarListbox
          v-model="selectedCollection"
          :options="collections">
          <ScalarButton
            class="justify-between p-2 max-h-8 w-full gap-1 text-xs hover:bg-b-2"
            variant="outlined">
            <span :class="selectedCollection ? 'text-c-1' : 'text-c-3'">{{
              selectedCollection
                ? selectedCollection.label
                : 'Select Collection'
            }}</span>
            <ScalarIcon
              class="text-c-3"
              icon="ChevronDown"
              size="xs" />
          </ScalarButton>
        </ScalarListbox>
        <ScalarListbox
          v-if="folders.length"
          v-model="selectedFolder"
          :options="folders">
          <ScalarButton
            class="justify-between p-2 max-h-8 w-full gap-1 text-xs hover:bg-b-2"
            variant="outlined">
            <span :class="selectedFolder ? 'text-c-1' : 'text-c-3'">{{
              selectedFolder ? selectedFolder.label : 'Select Folder'
            }}</span>
            <ScalarIcon
              class="text-c-3"
              icon="ChevronDown"
              size="xs" />
          </ScalarButton>
        </ScalarListbox>
      </div>
    </template>
    <template #submit>Create Request</template>
  </CommandActionForm>
</template>
