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


    <div v-else class="photo-preview-container">
      <img :src="photoCaptured" alt="Foto Capturada" class="captured-photo" />

      <ButtonGroup class="action-buttons">
    <Button class="accept-button" @click="acceptPhoto" label="Save" icon="pi pi-check" />
    <Button label="Delete" icon="pi pi-trash" />
    <Button class="retake-button" @click="retakePhoto" label="Tomar otra" icon="pi pi-times" />
</ButtonGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineEmits } from 'vue';

const emit = defineEmits<{
  (e: 'photoCaptured', photo: string): void;
  (e: 'close'): void;
}>();

const video = ref<HTMLVideoElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const stream = ref<MediaStream | null>(null);
const photoCaptured = ref<string | null>(null);

// Inicia la cámara: intenta usar la trasera, si falla, usa la frontal.
const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: 'environment' } },
      audio: false
    });
  } catch (error) {
    console.error("Error usando cámara trasera, intentando frontal:", error);
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
    } catch (err) {
      console.error("Error usando cámara frontal:", err);
    }
  }
  if (video.value && stream.value) {
    video.value.srcObject = stream.value;
  }
};

onMounted(() => {
  startCamera();
});

onBeforeUnmount(() => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
  }
});

// Captura la foto y la guarda en formato base64.
const capturePhoto = () => {
  if (!video.value) return;
  if (!canvas.value) {
    canvas.value = document.createElement('canvas');
  }
  canvas.value.width = video.value.videoWidth || 300;
  canvas.value.height = video.value.videoHeight || 200;
  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
  photoCaptured.value = canvas.value.toDataURL('image/png');
};


const acceptPhoto = () => {
  if (photoCaptured.value) {
    emit('photoCaptured', photoCaptured.value);
  }
};


const retakePhoto = () => {
  photoCaptured.value = null;
  if (stream.value && video.value) {
    video.value.srcObject = stream.value;
  } else {
    startCamera();
  }
};

const handleClose = () => {
  console.log("Cerrando cámara...");
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
  }
  emit('close');
};
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

.action-buttons {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.accept-button,
.retake-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  z-index: 2;
}

.accept-button {
  background-color: #4caf50;
  color: white;
}

.retake-button {
  background-color: #f44336;
  color: white;
}

/* Sección para la vista en vivo */
.preview-section {
  position: relative;
  height: 100%;
  z-index: 1;
}
</style>
