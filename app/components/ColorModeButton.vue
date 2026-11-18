<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

function onToggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-ph-sun' : 'i-ph-moon'"
      variant="outline"
      color="neutral"
      size="sm"
      aria-label="Toggle theme"
      :aria-pressed="isDark"
      @click="onToggle"
    />
    <template #fallback>
      <UButton
        icon="i-ph-moon"
        variant="outline"
        color="neutral"
        size="sm"
        aria-label="Toggle theme"
      />
    </template>
  </ClientOnly>
</template>
