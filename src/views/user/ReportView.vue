<template>

  <div class="min-h-screen flex flex-col bg-gray-50">

    <PublicTopBar />


    <div v-if="showStepper">
      <h2 class="text-xl md:text-2xl font-semibold mb-4">Nuevo Reporte</h2>
      <ReportStepper @save="handleStepperSave" />
    </div>

    <div v-else>

      <div class="flex-1 pt-16 p-4 overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Reportes</h2>
          <button
            @click="openCamera"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Incidente
          </button>
        </div>

        <DataView :value="reports" paginator :rows="5" layout="list">
          <template #list="slotProps">
            <div>
              <div
                v-for="report in slotProps.items"
                :key="report.id"
                class="bg-white p-4 rounded-md shadow mb-4"
              >
                <div class="flex items-center justify-between">
                  <div class="font-bold">Reporte #{{ report.id }}</div>
                  <Tag :value="report.status" :severity="getSeverity(report)" />
                </div>
                <div class="flex mt-2">
                  <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mr-4">
                    <img
                      v-if="report.photo"
                      :src="report.photo"
                      alt="Reporte"
                      class="w-full h-full object-cover rounded"
                    />
                    <i v-else class="pi pi-image text-gray-500 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm text-gray-600">
                      {{ report.location }}
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                      {{ report.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>


    <CameraReport
      v-if="showCamera"
      @photoCaptured="handlePhotoCaptured"
      @close="closeCamera"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PublicTopBar from '@/shared/layouts/public/PublicTopBar.vue';
import CameraReport from '@/shared/layouts/CameraReport.vue';
import DataView from 'primevue/dataview';
import Tag from 'primevue/tag';
import ReportStepper from '@/shared/components/Report/ReportStepper.vue';

// Importa el servicio y la función para convertir base64 a File
import { useCreateReport, dataURLToFile } from '@/core/services/reportService.ts';
//servicios de prueba
const reports = ref([
  {
    id: 1,
    photo: 'https://via.placeholder.com/150',
    location: 'Calle 123, colonia Celicio Chi',
    description: 'Bache en la calle 123',
    status: 'Pendiente'
  },
  {
    id: 2,
    photo: '',
    location: 'Avenida 456, Ciudad',
    description: 'Bache grande cerca de la avenida principal',
    status: 'Resuelto'
  },
  {
    id: 3,
    photo: 'https://via.placeholder.com/150',
    location: 'Parque Central, Ciudad',
    description: 'Bache junto al parque',
    status: 'En Proceso'
  }
]);

// Variables para el control de cámara y stepper
const showCamera = ref(false);
const showStepper = ref(false);
const newPhoto = ref(''); // Aquí se almacena la imagen en base64

// Composable para crear reportes
const { mutate: createReport, isLoading } = useCreateReport();

const openCamera = () => {
  showCamera.value = true;
};

const closeCamera = () => {
  showCamera.value = false;
};

const handlePhotoCaptured = (photo: string) => {
  newPhoto.value = photo;
  showCamera.value = false;
  showStepper.value = true;
};


const handleStepperSave = (formData: any) => {
  // Convertir la imagen base64 a File
  const imageFile = dataURLToFile(newPhoto.value, "report.png");

  createReport(
    {

      comment: formData.comment,
      location: formData.location,
      latitude: formData.latitude,
      longitude: formData.longitude,
      severity: formData.severity,
      image: imageFile
    },
    {
      onSuccess: () => {
        const newId = reports.value.length + 1;
        reports.value.push({
          id: newId,
          photo: newPhoto.value, // La imagen en base64 para mostrar en la UI (opcional)
          location: formData.location,
          description: formData.comment,
          status: 'Pendiente',
          severity: formData.severity,
          latitude: formData.latitude,
          longitude: formData.longitude
        });
        showStepper.value = false;
      },
      onError: (error) => {
        console.error("Error al crear reporte:", error);
      }
    }
  );
};

const getSeverity = (report: { status: string }): string => {
  switch (report.status) {
    case 'Resuelto':
      return 'success';
    case 'Pendiente':
      return 'warning';
    case 'En Proceso':
      return 'info';
    default:
      return 'default';
  }
};
</script>
