import type { Project } from './useProjectConfig'
import { createProject } from './useProjectConfig'

const STORAGE_KEY = 'flatbuy-projects-v2'

function load(): Project[] {
  if (import.meta.server) return [createProject('My Flat')]
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  }
  catch {}
  return [createProject('My Flat')]
}

export function useProjects() {
  const projects = useState<Project[]>('projects', load)

  watch(projects, (val) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      }
      catch {}
    }
  }, { deep: true })

  const activeId = useState<string>('activeProjectId', () => projects.value[0]?.id ?? '')

  const activeProject = computed(() =>
    projects.value.find(p => p.id === activeId.value) ?? projects.value[0]!,
  )

  function addProject(name: string): Project {
    const p = createProject(name)
    p.baseRatePerSqft = 0
    p.areaSqft = 0
    projects.value.push(p)
    activeId.value = p.id
    return p
  }

  function removeProject(id: string) {
    projects.value = projects.value.filter(p => p.id !== id)
    if (!projects.value.length) {
      projects.value = [createProject('My Flat')]
      activeId.value = projects.value[0]!.id
    }
    else if (activeId.value === id) {
      activeId.value = projects.value[0]!.id
    }
  }

  function duplicateProject(id: string): Project | undefined {
    const src = projects.value.find(p => p.id === id)
    if (!src) return
    const copy: Project = JSON.parse(JSON.stringify(src))
    copy.id = `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    copy.name = `${src.name} (copy)`
    copy.createdAt = Date.now()
    copy.updatedAt = Date.now()
    projects.value.push(copy)
    activeId.value = copy.id
    return copy
  }

  function exportJSON(): string {
    return JSON.stringify(projects.value, null, 2)
  }

  function importJSON(json: string): boolean {
    try {
      const parsed = JSON.parse(json)
      if (!Array.isArray(parsed)) return false
      projects.value = parsed
      if (!projects.value.find(p => p.id === activeId.value)) {
        activeId.value = projects.value[0]?.id ?? ''
      }
      return true
    }
    catch {
      return false
    }
  }

  return {
    projects,
    activeId,
    activeProject,
    addProject,
    removeProject,
    duplicateProject,
    exportJSON,
    importJSON,
  }
}