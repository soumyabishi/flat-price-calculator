import type { Project } from '~/composables/useProjectConfig'

export function usePrintSummary() {
  const printing = ref(false)

  function filenameFor(project: Project) {
    const safe = project.name.replace(/[\\/:*?"<>|]+/g, '-').trim()
    return `FlatBuy Estimate${safe ? ` - ${safe}` : ''}`
  }

  /**
   * Hands the summary to the browser's own print pipeline, so "Save as PDF"
   * yields a real text-based PDF that matches the on-screen invoice exactly.
   */
  function printSummary(project: Project) {
    if (import.meta.server) return

    const previousTitle = document.title
    document.title = filenameFor(project)

    let settled = false
    const settle = () => {
      if (settled) return
      settled = true
      printing.value = false
      document.title = previousTitle
      window.removeEventListener('afterprint', settle)
    }

    printing.value = true
    window.addEventListener('afterprint', settle)
    window.print()
    // Safari can dismiss the dialog without firing `afterprint`.
    window.setTimeout(settle, 1500)
  }

  return { printing, printSummary }
}
