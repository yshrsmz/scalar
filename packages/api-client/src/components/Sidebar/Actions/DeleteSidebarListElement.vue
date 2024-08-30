<script setup lang="ts">
import SidebarListElementForm from '@/components/Sidebar/Actions/SidebarListElementForm.vue'

defineProps<{
  variableName: string
  warningMessage?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'delete'): void
}>()

async function deleteEnvironmentVariable() {
  emit('delete')
}
</script>
<template>
  <SidebarListElementForm
    danger
    :label="`Delete ${variableName}`"
    @cancel="emit('close')"
    @submit="deleteEnvironmentVariable">
    <p
      v-if="warningMessage"
      class="leading-normal text-c-2 text-sm text-pretty">
      {{ warningMessage }}
    </p>
  </SidebarListElementForm>
</template>
