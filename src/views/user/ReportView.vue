<template>
  <div class="min-h-screen flex flex-col color-primary">
    <!-- Si se muestra el Stepper para un nuevo reporte -->
    <div v-if="showStepper">
      <h2 class="text-xl md:text-2xl font-semibold mb-4 primary">Nuevo Reporte</h2>
      <ReportStepper
        :initialLatitude="newLat"
        :initialLongitude="newLon"
        @save="handleStepperSave"
      />
    </div>

    <!-- Vista principal con lista de reportes -->
    <div v-else>
      <div class="max-w-7xl mx-auto p-4">

        <Toolbar class="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
      <template #start>
        <Button
          label="Agregar"
          icon="pi pi-plus"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-3"
          @click="openCamera"
        />

      </template>
    </Toolbar>
        <!-- Cargando o mostrando errores -->
        <div v-if="reportStore.isLoading">Cargando reportes...</div>
        <div v-else-if="reportStore.error">
          Error al cargar los reportes: {{ reportStore.error.message }}
        </div>

        <!-- DataTable con filtrado y paginación locales -->
        <div class="card" v-if="!reportStore.isLoading && !reportStore.error">
          <DataTable
            ref="dt"
            v-model:filters="filters"
            :value="reportStore.reports"
            paginator
            :rows="10"
            dataKey="id"
            filterDisplay="row"
            :loading="reportStore.isLoading"
            :globalFilterFields="['status', 'location', 'comment']"
            class="shadow w-full"
          >
            <template #header>
              <div class="flex flex-wrap gap-2 items-center justify-between">
                <h2 class="text-xl font-semibold color-primary">Reportes</h2>
                <div class="relative w-64">
                  <!-- Ícono a la izquierda -->
                  <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search text-gray-500" />
            </InputIcon>
            <InputText v-model="filters.global.value" placeholder="Busqueda Global" class="border border-gray-300 rounded-md p-2" />
          </IconField>
                </div>
              </div>
            </template>

            <template #empty> No se encontraron reportes. </template>

            <!-- Columna: Reporte -->
            <Column header="#" style="min-width: 4rem">
              <template #body="{ index }">
                Reporte # {{ getGlobalIndex(index) }}
              </template>
            </Column>

            <!-- Columna: Estado -->
            <Column
              field="status"
              header="Estado"
              filter
              filterField="status"
              :showFilterMenu="false"
              filterPlaceholder="Buscar estado"
              filterMatchMode="equals"
              style="min-width: 4rem"
            >
              <template #body="{ data }">
                <Tag :value="translateStatus(data.status)" :severity="getSeverity(data)" />
              </template>
              <template #filter="{ filterModel, filterCallback }">
                <Select
                  v-model="filterModel.value"
                  @change="filterCallback()"
                  :options="uniqueStatuses"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Selecciona un estado"
                  showClear
                  class="p-column-filter"
                />
              </template>
            </Column>

            <!-- Columna: Imagen -->
            <Column header="Imagen" style="min-width: 8rem">
              <template #body="{ data }">
                <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <Image
                    v-if="data.imageUrl"
                    :src="`${apiBaseUrl}/${data.imageUrl}`"
                    alt="Reporte"
                    class="w-full h-full object-cover rounded"
                    preview
                  />
                  <i v-else class="pi pi-image text-gray-500 text-xl"></i>
                </div>
              </template>
            </Column>

            <!-- Columna: Ubicación -->
            <Column
              field="location"
              header="Ubicación"
              filter
              filterPlaceholder="Buscar ubicación"
              style="min-width: 10rem"
            >
              <template #body="{ data }">
                {{ data.location }}
              </template>
              <template #filter="{ filterModel, filterCallback }">
                <InputText
                  v-model="filterModel.value"
                  @input="filterCallback()"
                  placeholder="Buscar ubicación"
                />
              </template>
            </Column>

            <!-- Columna: Comentario -->
            <Column
              field="comment"
              header="Comentario"
              filter
              filterPlaceholder="Buscar comentario"
              style="min-width: 10rem"
            >
              <template #body="{ data }">
                {{ data.comment }}
              </template>
              <template #filter="{ filterModel, filterCallback }">
                <InputText
                  v-model="filterModel.value"
                  @input="filterCallback()"
                  placeholder="Buscar comentario"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Modal de la cámara -->
    <CameraReport
      v-if="showCamera"
      @photoCaptured="handlePhotoCaptured"
      @close="closeCamera"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useReportStore } from '@/core/stores/userReportStore'
import { useCreateReport, dataURLToFile } from '@/core/services/reportService'
import CameraReport from '@/shared/layouts/CameraReport.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Image from 'primevue/image'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import ReportStepper from '@/shared/components/Report/ReportStepper.vue'

const apiBaseUrl = "https://api.bacheton.space"

// Store de Reportes
const reportStore = useReportStore()

// Para filtrado local, cargamos TODOS los registros (por ejemplo, 100)
onBeforeMount(() => {
  reportStore.fetchReports(1, 100)
})

// Ref al DataTable para obtener el índice global actual (si es necesario)
const dt = ref(null)

// Variables para controlar la cámara y el stepper
const showCamera = ref(false)
const showStepper = ref(false)
const newPhoto = ref('')
const uniqueFileName = ref('')
const newLat = ref<number | null>(null)
const newLon = ref<number | null>(null)

// Filtros para el DataTable (locales)
const filters = ref({
  global: { value: null, matchMode: 'contains' },
  status: { value: null, matchMode: 'equals' },
  location: { value: null, matchMode: 'contains' },
  comment: { value: null, matchMode: 'contains' },
})

// Función para calcular el índice global basado en la paginación interna del DataTable
const getGlobalIndex = (index: number) => {
  // Si usamos un ref en el DataTable, podemos obtener el primer índice visible
  const first = dt.value && dt.value.first ? dt.value.first : 0
  return first + index + 1
}

// Funciones para controlar la cámara y el stepper
const openCamera = () => {
  showCamera.value = true
}
const closeCamera = () => {
  showCamera.value = false
}
const handlePhotoCaptured = (payload: { photo: string; lat?: number; lon?: number }) => {
  newPhoto.value = payload.photo
  uniqueFileName.value = `report-${Date.now()}.png`
  newLat.value = payload.lat ?? null
  newLon.value = payload.lon ?? null
  showCamera.value = false
  showStepper.value = true
}

// Creación de reportes
const { mutate: createReport } = useCreateReport()
const handleStepperSave = (formData: any) => {
  const imageFile = dataURLToFile(newPhoto.value, uniqueFileName.value)
  createReport(
    {
      comment: formData.comment,
      location: formData.location,
      latitude: formData.latitude,
      longitude: formData.longitude,
      severity: formData.severity,
      image: imageFile,
    },
    {
      onSuccess: () => {
        showStepper.value = false
        // Recargar todos los reportes
        reportStore.fetchReports(1, 100)
      },
      onError: (error) => {
        console.error('Error al crear reporte:', error)
      },
    }
  )
}

// Computed para obtener estados únicos para el filtro (local)
const uniqueStatuses = computed(() => {
  const statusesSet = new Set(reportStore.reports.map(report => report.status))
  return Array.from(statusesSet).map(status => ({
    label: translateStatus(status),
    value: status
  }))
})

// Funciones para traducir estado y obtener severidad
const getSeverity = (report: { status: string }): string => {
  switch (report.status) {
    case 'Pending':
      return 'danger'
    case 'InProgress':
      return 'warn'
    case 'Resolved':
      return 'success'
    default:
      return 'default'
  }
}
const translateStatus = (status: string): string => {
  switch (status) {
    case 'Pending':
      return 'Pendiente'
    case 'InProgress':
      return 'En Proceso'
    case 'Resolved':
      return 'Resuelto'
    default:
      return status
  }
}
</script>
