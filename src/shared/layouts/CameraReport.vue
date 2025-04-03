<template>
  <div class="camera-container">
    <button class="close-button" @click="handleClose">Cerrar</button>

    <!-- Vista previa de la cámara -->
    <div v-if="!photoCaptured" class="preview-section">
      <div class="instruction-text">
        Tome la foto del bache que quiere reportar
      </div>
      <video ref="video" class="camera-video" autoplay playsinline></video>
      <button class="capture-button" @click="capturePhoto"></button>
    </div>

    <!-- Mostrar barra de carga cuando uploading es true -->
    <div v-if="uploading" class="uploading-overlay">
      <ProgressLoader />
    </div>

    <!-- Vista de foto capturada -->
    <div v-else-if="photoCaptured" class="photo-preview-container">
      <!-- Opciones de dibujo -->
      <div v-if="drawingEnabled" class="flex flex-col items-center gap-2 mt-4">
        <input type="color" v-model="strokeColor" class="w-16 h-8 rounded border" />
        <input type="range" v-model="lineWidth" min="1" max="20" />
        <Button label="Guardar Dibujo" icon="pi pi-save" @click="saveDrawing" />
      </div>

      <!-- Canvas de dibujo (sobre la foto) -->
      <canvas
        v-if="drawingEnabled"
        ref="drawingCanvas"
        class="absolute top-0 left-0 z-10"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="stopDraw"
        @mouseleave="stopDraw"
      />

      <!-- Foto capturada -->
      <img :src="photoCaptured" alt="Foto Capturada" class="captured-photo" />

      <!-- SpeedDial con opciones de edición -->
      <SpeedDial
        :model="items"
        direction="up"
        mask
        :style="{ position: 'absolute', right: '1rem', bottom: '1rem' }"
      />

      <!-- Botones de acción -->
      <div class="action-buttons flex justify-center gap-2 mt-4">
        <Button class="accept-button" @click="acceptPhoto" label="Save" icon="pi pi-check" />
        <Button class="retake-button" @click="retakePhoto" label="Tomar otra" icon="pi pi-times" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineEmits, nextTick } from 'vue'
import Button from 'primevue/button'
import SpeedDial from 'primevue/speeddial'
import ProgressLoader from '@/shared/components/Report/LoaderReport.vue' // Ajusta la ruta según tu proyecto
import { useToast } from 'primevue/usetoast'

// Emisión de eventos
const emit = defineEmits<{
  (e: 'photoCaptured', payload: { photo: string; lat?: number; lon?: number }): void;
  (e: 'close'): void;
}>()

// Refs para video, canvas, y estado de la cámara
const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)

// Propiedades reactivas para la foto y el estado de carga
const photoCaptured = ref<string | null>(null)
const uploading = ref(false)

// Dibujo en la foto
const isDrawing = ref(false)
const drawingEnabled = ref(false)
const strokeColor = ref('#ff0000')
const lineWidth = ref(5)
const drawingCanvas = ref<HTMLCanvasElement | null>(null)
let lastX = 0
let lastY = 0

const toast = useToast()

// Opciones del SpeedDial (rotar, recortar, dibujar)
const items = ref([
  {
    label: 'Rotar',
    icon: 'pi pi-refresh',
    command: () => rotatePhoto()
  },
  {
    label: 'Recortar',
    icon: 'pi pi-crop',
    command: () => cropPhoto()
  },
  {
    label: 'Dibujar',
    icon: 'pi pi-pencil',
    command: () => enableDrawing()
  }
])

/* ------------------------------------------------------------------
   1) Iniciar cámara
------------------------------------------------------------------ */
const startCamera = async () => {
  try {
    // Intentar usar cámara trasera
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: 'environment' } },
      audio: false
    })
  } catch (error) {
    console.error("Error usando cámara trasera, intentando frontal:", error)
    try {
      // Si falla, usar cámara frontal
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
    } catch (err) {
      console.error("Error usando cámara frontal:", err)
    }
  }
  if (video.value && stream.value) {
    video.value.srcObject = stream.value
  }
}

onMounted(() => {
  startCamera()
})

onBeforeUnmount(() => {
  // Detener tracks al desmontar
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
})

/* ------------------------------------------------------------------
   2) Capturar foto
------------------------------------------------------------------ */
const capturePhoto = () => {
  if (!video.value) return
  if (!canvas.value) {
    canvas.value = document.createElement('canvas')
  }
  canvas.value.width = video.value.videoWidth || 300
  canvas.value.height = video.value.videoHeight || 200
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
  photoCaptured.value = canvas.value.toDataURL('image/png')
}

/* ------------------------------------------------------------------
   3) Editar foto: rotar, recortar, dibujar
------------------------------------------------------------------ */
const rotatePhoto = async () => {
  if (!photoCaptured.value) return
  const img = new Image()
  img.src = photoCaptured.value
  await new Promise(resolve => (img.onload = resolve))

  // Crear un canvas para rotar
  const offCanvas = document.createElement('canvas')
  offCanvas.width = img.height
  offCanvas.height = img.width
  const ctx = offCanvas.getContext('2d')
  if (ctx) {
    // Rotar 90°
    ctx.translate(offCanvas.width / 2, offCanvas.height / 2)
    ctx.rotate(Math.PI / 2)
    ctx.drawImage(img, -img.width / 2, -img.height / 2)
    photoCaptured.value = offCanvas.toDataURL('image/png')
  }
}

const cropPhoto = async () => {
  if (!photoCaptured.value) return
  const img = new Image()
  img.src = photoCaptured.value
  await new Promise(resolve => (img.onload = resolve))

  // Recortar al 50% centrado
  const cropWidth = img.width * 0.5
  const cropHeight = img.height * 0.5
  const startX = (img.width - cropWidth) / 2
  const startY = (img.height - cropHeight) / 2

  const offCanvas = document.createElement('canvas')
  offCanvas.width = cropWidth
  offCanvas.height = cropHeight
  const ctx = offCanvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(
      img,
      startX, startY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    )
    photoCaptured.value = offCanvas.toDataURL('image/png')
  }
}

// Habilitar dibujo sobre la foto
const enableDrawing = async () => {
  if (!photoCaptured.value) return
  drawingEnabled.value = true

  await nextTick()
  const c = drawingCanvas.value
  const ctx = c?.getContext('2d')
  const img = new Image()
  img.src = photoCaptured.value
  await new Promise(resolve => (img.onload = resolve))

  if (c && ctx) {
    c.width = img.width
    c.height = img.height
    ctx.drawImage(img, 0, 0)
  }
}

// Eventos de dibujo
const startDraw = (e: MouseEvent) => {
  if (!drawingEnabled.value || !drawingCanvas.value) return
  isDrawing.value = true
  const rect = drawingCanvas.value.getBoundingClientRect()
  lastX = e.clientX - rect.left
  lastY = e.clientY - rect.top
}

const draw = (e: MouseEvent) => {
  if (!isDrawing.value || !drawingCanvas.value) return
  const ctx = drawingCanvas.value.getContext('2d')
  if (!ctx) return

  const rect = drawingCanvas.value.getBoundingClientRect()
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top

  ctx.strokeStyle = strokeColor.value
  ctx.lineWidth = lineWidth.value
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(currentX, currentY)
  ctx.stroke()

  lastX = currentX
  lastY = currentY
}

const stopDraw = () => {
  isDrawing.value = false
}

// Guardar el dibujo
const saveDrawing = () => {
  if (!drawingCanvas.value) return
  photoCaptured.value = drawingCanvas.value.toDataURL('image/png')
  drawingEnabled.value = false
}

/* ------------------------------------------------------------------
   4) Aceptar la foto (geolocalización) o Repetir
------------------------------------------------------------------ */
const acceptPhoto = () => {
  if (photoCaptured.value) {
    uploading.value = true
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          uploading.value = false
          emit('photoCaptured', {
            photo: photoCaptured.value,
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error)
          uploading.value = false
          emit('photoCaptured', { photo: photoCaptured.value })
        }
      )
    } else {
      console.error('Geolocalización no soportada.')
      uploading.value = false
      emit('photoCaptured', { photo: photoCaptured.value })
    }
  } else {
    console.error("No hay foto capturada.")
  }
}

const retakePhoto = () => {
  photoCaptured.value = null
  if (stream.value && video.value) {
    video.value.srcObject = stream.value
  } else {
    startCamera()
  }
}

/* ------------------------------------------------------------------
   5) Cerrar cámara
------------------------------------------------------------------ */
const handleClose = () => {
  console.log("Cerrando cámara...")
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
  emit('close')
}
</script>

<style scoped>
.camera-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* Ocupar todo el ancho */
  height: 100vh; /* Ocupar todo el alto */
  background-color: #000;
  z-index: 1000;
}

.close-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1100;
}

/* Video a pantalla completa */
.camera-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover; /* Para que se ajuste sin barras negras */
  z-index: 1;
}

.preview-section {
  position: relative;
  width: 100%;
  height: 100%;
}

.capture-button {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  border: none;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.1s ease;
  z-index: 2;
}
.capture-button:active {
  transform: translateX(-50%) scale(0.95);
}

.instruction-text {
  position: absolute;
  top: 3rem;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
  z-index: 2;
}

.photo-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.captured-photo {
  max-width: 100%;
  max-height: 80%;
  border: 2px solid white;
  border-radius: 8px;
}

/* Barra de carga */
.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

/* Canvas para dibujo */
canvas {
  touch-action: none; /* Evita scrolling en móviles al dibujar */
}
</style>
