<script setup lang="ts">
import { computeProject, formatINR } from '~/composables/computeProject'
import { SHEET_PEEK } from '~/composables/sheetPeek'
import type { Project } from '~/composables/useProjectConfig'

const props = defineProps<{ project: Project }>()

/** px of the sheet that stay on screen when it is collapsed. */
const PEEK = SHEET_PEEK
/** travel distance used to decide which way a flick settles. */
const FLICK = 0.35
const PROJECTION = 200

const isDesktop = useMediaQuery('(min-width: 1024px)')

const sheetEl = ref<HTMLElement | null>(null)
const bodyEl = ref<HTMLElement | null>(null)

const open = ref(false)
/** distance in px from fully expanded; 0 = open, maxOffset = collapsed. */
const offset = ref(0)
const maxOffset = ref(0)
const dragging = ref(false)

const result = computed(() => computeProject(props.project))

const clamped = (v: number) => Math.min(maxOffset.value, Math.max(0, v))

function measure() {
  if (isDesktop.value || !sheetEl.value) {
    maxOffset.value = 0
    offset.value = 0
    return
  }
  maxOffset.value = Math.max(0, sheetEl.value.offsetHeight - PEEK)
  if (!dragging.value) offset.value = open.value ? 0 : maxOffset.value
}

function setOpen(next: boolean) {
  open.value = next
  offset.value = next ? 0 : maxOffset.value
}

const sheetStyle = computed(() => ({
  transform: isDesktop.value ? 'none' : `translateY(${offset.value}px)`,
}))

watch(isDesktop, () => {
  if (isDesktop.value) open.value = false
  measure()
})

let pointerId: number | undefined
let engaged = false
let fromBody = false
let moved = false
let startY = 0
let startOffset = 0
let lastY = 0
let lastT = 0
let velocity = 0

function beginDrag(e: PointerEvent, body = false) {
  if (isDesktop.value || (e.pointerType === 'mouse' && e.button !== 0)) return
  // Let the body scroll natively unless it is already parked at the top.
  if (body && (bodyEl.value?.scrollTop ?? 0) > 0) return

  pointerId = e.pointerId
  fromBody = body
  engaged = false
  moved = false
  startY = lastY = e.clientY
  startOffset = offset.value
  lastT = e.timeStamp
  velocity = 0
  dragging.value = true

  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
  window.addEventListener('touchmove', blockTouchScroll, { passive: false })
}

function onDragMove(e: PointerEvent) {
  if (pointerId !== e.pointerId) return
  const dy = e.clientY - startY

  if (!engaged) {
    if (fromBody) {
      // dragging the body upward is a scroll, not a sheet gesture
      if (dy < -6) return teardown()
      if (dy <= 6) return
    } else if (Math.abs(dy) <= 6) {
      return
    }
    engaged = true
    moved = true
  }

  const now = e.timeStamp
  const dt = now - lastT
  if (dt > 0) velocity = (e.clientY - lastY) / dt
  lastY = e.clientY
  lastT = now

  offset.value = clamped(startOffset + dy)
}

function endDrag(e: PointerEvent) {
  if (pointerId !== undefined && e.pointerId !== pointerId) return
  const projected = offset.value + velocity * PROJECTION
  const flickUp = velocity < -FLICK
  const flickDown = velocity > FLICK
  const settledOpen = flickUp ? true : flickDown ? false : projected < maxOffset.value / 2
  teardown()
  setOpen(settledOpen)
}

function teardown() {
  dragging.value = false
  engaged = false
  fromBody = false
  pointerId = undefined
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
  window.removeEventListener('touchmove', blockTouchScroll)
}

/** Stops the page from scrolling underneath once the gesture takes over. */
function blockTouchScroll(e: TouchEvent) {
  if (engaged) e.preventDefault()
}

function onBarClick() {
  // a drag that ends over the bar must not also toggle it
  if (moved) {
    moved = false
    return
  }
  setOpen(!open.value)
}

function onBodyPointerDown(e: PointerEvent) {
  if (open.value) beginDrag(e, true)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value && !isDesktop.value) setOpen(false)
}

onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measure)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- Tap outside to dismiss. Sits behind the sheet, never in the document flow. -->
  <div
    v-if="!isDesktop && open"
    class="fixed inset-0 z-40 bg-black/40 print:hidden"
    @click="setOpen(false)"
  />

  <section
    ref="sheetEl"
    class="print-pane fixed inset-x-0 bottom-0 z-50 flex h-[88svh] flex-col overflow-hidden rounded-t-2xl border-t border-default bg-default shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none will-change-transform lg:static lg:z-auto lg:h-full lg:min-w-0 lg:flex-1 lg:overflow-y-auto lg:rounded-none lg:border-t-0 lg:bg-black/20 lg:shadow-none lg:transition-none"
    :class="dragging ? '!transition-none' : ''"
    :style="sheetStyle"
  >
    <!-- Grabber / collapsed summary readout -->
    <div
      v-if="!isDesktop"
      class="sheet-bar shrink-0 cursor-grab touch-none select-none px-4 pt-2.5 pb-3 active:cursor-grabbing"
      @pointerdown="beginDrag($event)"
      @click="onBarClick"
    >
      <div class="mx-auto mb-2 h-1 w-9 rounded-full bg-accented" />
      <div class="flex items-center gap-3">
        <div class="min-w-0 flex-1 text-left">
          <div class="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">
            All-inclusive
          </div>
          <div class="truncate text-lg font-bold tabular-num text-primary">
            {{ formatINR(result.grandTotal) }}
          </div>
        </div>
        <UIcon
          :name="open ? 'i-ph-caret-down' : 'i-ph-caret-up'"
          class="size-5 shrink-0 text-muted"
        />
      </div>
    </div>

    <div
      ref="bodyEl"
      class="sheet-body min-h-0 flex-1 overflow-y-auto overscroll-contain"
      :class="isDesktop ? 'px-4 sm:px-6 py-6' : 'px-3 pt-1 pb-6'"
      :inert="!isDesktop && !open"
      @pointerdown="onBodyPointerDown"
    >
      <div class="mx-auto w-full max-w-[210mm]">
        <SummaryCard :project="project" />
      </div>
    </div>
  </section>
</template>
