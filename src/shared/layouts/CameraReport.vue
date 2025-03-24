<template>
  <div class="camera-container">
    <button class="close-button" @click="handleClose">Cerrar</button>

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
      <div v-if="drawingEnabled" class="flex flex-col items-center gap-2 mt-4">
  <input type="color" v-model="strokeColor" class="w-16 h-8 rounded border" />
  <input type="range" v-model="lineWidth" min="1" max="20" />
  <Button label="Guardar Dibujo" icon="pi pi-save" @click="saveDrawing" />
</div>

<!-- Canvas de dibujo -->
<canvas
  v-if="drawingEnabled"
  ref="drawingCanvas"
  class="absolute top-0 left-0 z-10"
  @mousedown="startDraw"
  @mousemove="draw"
  @mouseup="stopDraw"
  @mouseleave="stopDraw"
/>
      <img :src="photoCaptured" alt="Foto Capturada" class="captured-photo" />

      <!-- SpeedDial para opciones de edición -->
      <SpeedDial
        :model="items"
        direction="up"
        mask
        :style="{ position: 'absolute', right: '1rem', bottom: '1rem' }"
      />

      <!-- Botones de acción centrados -->
      <div class="action-buttons flex justify-center gap-2 mt-4">
        <Button class="accept-button" @click="acceptPhoto" label="Save" icon="pi pi-check" />
        <Button class="retake-button" @click="retakePhoto" label="Tomar otra" icon="pi pi-times" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineEmits,nextTick  } from 'vue'
import Button from 'primevue/button'
import SpeedDial from 'primevue/speeddial'
import ProgressLoader from '@/shared/components/Report/LoaderReport.vue' // Ajusta la ruta
import { useToast } from 'primevue/usetoast'

// Emitir eventos para cerrar y aceptar foto
const emit = defineEmits<{
  (e: 'photoCaptured', payload: { photo: string; lat?: number; lon?: number }): void;
  (e: 'close'): void;
}>()

// Referencias para video, canvas y stream
const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)
const photoCaptured = ref<string | null>(null)
const uploading = ref(false)
const toast = useToast()

const isDrawing = ref(false)
const drawingEnabled = ref(false)
const strokeColor = ref('#ff0000')
const lineWidth = ref(5)
const drawingCanvas = ref<HTMLCanvasElement | null>(null)
let lastX = 0
let lastY = 0
// Modelo para el SpeedDial (opciones de edición)
const items = ref([
  {
    label: 'Rotar',
    icon: 'pi pi-refresh',
    command: () => {
      rotatePhoto()
    }
  },
  {
    label: 'Recortar',
    icon: 'pi pi-crop',
    command: () => {
      cropPhoto()
    }
  },
  {
  label: 'Dibujar',
  icon: 'pi pi-pencil',
  command: () => {
    enableDrawing()
  }
}
])
const enableDrawing = async () => {
  if (!photoCaptured.value) return
  drawingEnabled.value = true

  await nextTick()
  const canvas = drawingCanvas.value
  const ctx = canvas?.getContext('2d')
  const img = new Image()
  img.src = photoCaptured.value
  await new Promise((resolve) => (img.onload = resolve))

  if (canvas && ctx) {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
  }
}
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
const saveDrawing = () => {
  if (!drawingCanvas.value) return
  photoCaptured.value = drawingCanvas.value.toDataURL('image/png')
  drawingEnabled.value = false
}


// Función para iniciar la cámara
const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: 'environment' } },
      audio: false,
    })
  } catch (error) {
    console.error("Error usando cámara trasera, intentando frontal:", error)
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
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
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
})

// Capturar foto y actualizar photoCaptured
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

// Función para rotar la foto 90 grados
const rotatePhoto = async () => {
  console.log("Rotar foto")
  if (!photoCaptured.value) return
  const img = new Image()
  img.src = photoCaptured.value
  await new Promise((resolve) => (img.onload = resolve))

  const offCanvas = document.createElement('canvas')
  offCanvas.width = img.height
  offCanvas.height = img.width
  const ctx = offCanvas.getContext('2d')
  if (ctx) {
    ctx.translate(offCanvas.width / 2, offCanvas.height / 2)
    ctx.rotate(Math.PI / 2)
    ctx.drawImage(img, -img.width / 2, -img.height / 2)
    photoCaptured.value = offCanvas.toDataURL('image/png')
  }
}

// Función para recortar la foto (ejemplo: recorta la zona central al 50%)
const cropPhoto = async () => {
  console.log("Recortar foto")
  if (!photoCaptured.value) return
  const img = new Image()
  img.src = photoCaptured.value
  await new Promise((resolve) => (img.onload = resolve))

  const cropWidth = img.width * 0.5
  const cropHeight = img.height * 0.5
  const startX = (img.width - cropWidth) / 2
  const startY = (img.height - cropHeight) / 2

  const offCanvas = document.createElement('canvas')
  offCanvas.width = cropWidth
  offCanvas.height = cropHeight
  const ctx = offCanvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
    photoCaptured.value = offCanvas.toDataURL('image/png')
  }
}

// Función para editar la foto (ejemplo: dibuja un círculo rojo en el centro)
const editPhoto = async () => {
  console.log("EDIT foto")
  if (!photoCaptured.value) return
  const img = new Image()
  img.src = photoCaptured.value
  await new Promise((resolve) => (img.onload = resolve))

  const offCanvas = document.createElement('canvas')
  offCanvas.width = img.width
  offCanvas.height = img.height
  const ctx = offCanvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(img, 0, 0)
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(img.width / 2, img.height / 2, 50, 0, 2 * Math.PI)
    ctx.stroke()
    photoCaptured.value = offCanvas.toDataURL('image/png')
  }
}

// Función para aceptar la foto: obtiene geolocalización y emite el evento
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
            lon: position.coords.longitude,
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

// Función para reintentar (tomar otra foto)
const retakePhoto = () => {
  photoCaptured.value = null
  if (stream.value && video.value) {
    video.value.srcObject = stream.value
  } else {
    startCamera()
  }
}

// Función para cerrar la cámara
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
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 1000;
}

/* Botón de cerrar */
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 1;
}

/* Botón de captura */
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

/* Texto de instrucción */
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

/* Sección de vista previa */
.photo-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

/* Estilo para el aviso de "Subiendo foto..." */
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

/* Estilo para la barra de herramientas (SpeedDial ya se posiciona inline) */
.toolbar {
  margin-bottom: 1rem;
}

canvas {
  touch-action: none;
}
</style>
