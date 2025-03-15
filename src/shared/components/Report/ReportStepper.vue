<template>
  <Stepper v-model="activeStep">
    <StepList>
      <Step value="1">Comentario</Step>
      <Step value="2">Ubicación</Step>
      <Step value="3">Severidad</Step>
    </StepList>
    <StepPanels>

      <StepPanel v-slot="{ activateCallback }" value="1">
        <div class="flex flex-col h-48">
          <div class="flex-auto">
            <label class="block mb-2 font-medium">Comentario</label>
            <textarea
              v-model="form.comment"
              class="w-full border p-2 rounded"
              placeholder="Ingrese su comentario"
            ></textarea>
          </div>
        </div>
        <div class="flex pt-6 justify-end">
          <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('2')" />
        </div>
      </StepPanel>

      <StepPanel v-slot="{ activateCallback }" value="2">
        <div class="flex flex-col h-48">
          <div class="flex-auto">
            <label class="block mb-2 font-medium">Ubicación</label>
            <input
              v-model="form.location"
              type="text"
              class="w-full border p-2 rounded"
              placeholder="Ingrese la ubicación"
            />
            <button
              @click="detectLocation"
              class="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Detectar Ubicación
            </button>
            <div v-if="form.latitude && form.longitude" class="mt-2 text-sm text-gray-600">
              Lat: {{ form.latitude }}, Lon: {{ form.longitude }}
            </div>
          </div>
        </div>
        <div class="flex pt-6 justify-between">
          <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
          <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" />
        </div>
      </StepPanel>

      <StepPanel v-slot="{ activateCallback }" value="3">
        <div class="flex flex-col h-48">
          <div class="flex-auto">
            <label class="block mb-2 font-medium">Severidad</label>
            <div class="flex gap-4">
              <label>
                <input type="radio" value="Low" v-model="form.severity" /> Baja
              </label>
              <label>
                <input type="radio" value="Medium" v-model="form.severity" /> Media
              </label>
              <label>
                <input type="radio" value="High" v-model="form.severity" /> Alta
              </label>
            </div>
          </div>
        </div>
        <div class="flex pt-6 justify-between">
          <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
          <Button label="Guardar Reporte" icon="pi pi-check" @click="saveReport" />
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import Step from 'primevue/step';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Button from 'primevue/button';

const emit = defineEmits<{ (e: 'save', report: any): void }>();


const activeStep = ref("1");


const form = ref({
  comment: '',
  location: '',
  latitude: null as number | null,
  longitude: null as number | null,
  severity: ''
});


const detectLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.value.latitude = position.coords.latitude;
        form.value.longitude = position.coords.longitude;

        form.value.location = `Lat: ${position.coords.latitude.toFixed(5)}, Lon: ${position.coords.longitude.toFixed(5)}`;
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
      }
    );
  } else {
    console.error('Geolocalización no soportada.');
  }
};


const saveReport = () => {
  emit('save', { ...form.value });
};
</script>
