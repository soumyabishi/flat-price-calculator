/**
 * Reactive CSS media query. The app is client-rendered (`ssr: false`), so the
 * match is resolved on mount and kept in sync from there.
 */
export function useMediaQuery(query: string) {
  const matches = ref(false)
  let mql: MediaQueryList | undefined

  const sync = () => {
    matches.value = !!mql?.matches
  }

  onMounted(() => {
    mql = window.matchMedia(query)
    sync()
    mql.addEventListener('change', sync)
  })

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', sync)
  })

  return matches
}
