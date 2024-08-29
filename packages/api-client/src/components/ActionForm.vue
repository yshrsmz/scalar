<script setup lang="ts">
import {
  ScalarButton,
  ScalarIcon,
  type useLoadingState,
} from '@scalar/components'

defineProps<{
  danger?: boolean
  loading?: ReturnType<typeof useLoadingState>
}>()

defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()
</script>
<template>
  <form
    class="flex flex-col gap-3"
    @submit.prevent="$emit('submit')">
    <slot />

    <div
      v-if="$slots.error"
      class="flex items-center gap-1 rounded border border-red bg-red p-2 font-medium text-red bg-mix-b-1 bg-mix-amount-95">
      <ScalarIcon
        icon="Error"
        size="sm" />

      <slot name="error" />
    </div>
    <div class="flex gap-3 *:flex-1">
      <ScalarButton
        variant="outlined"
        @click="$emit('cancel')">
        <slot name="cancel">Cancel</slot>
      </ScalarButton>
      <ScalarButton
        :loading="loading"
        type="submit"
        :variant="danger ? 'danger' : 'solid'">
        <slot name="submit">Submit</slot>
      </ScalarButton>
    </div>
  </form>
</template>
