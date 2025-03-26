<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, createApp, h } from 'vue';
import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';

//Service
import {
    listMonitoringReports,
    getReport,
    updateReport,
    deleteReport,
    useUpdateReport,
    useDeleteReport
} from '@/core/services/reportMapService';

// Types Report
import type {
    Report,
    ReportStatus,
    ReportSeverity,
    MonitoringReportsRequest,
    UpdateReportRequest
} from '@/core/types/reportMap';

// Components
import ReportStats from '@/shared/components/map/ReportStats.vue';
import ReportFilter from '@/shared/components/map/ReportFilter.vue';
import ConfirmDialog from '@/shared/components/map/ConfirmDialog.vue';
import ReportEditDialog from '@/shared/components/map/ReportEditDialog.vue';
import ReportDetailDialog from '@/shared/components/map/ReportDetailDialog.vue';
import InfoWindowComponent from '@/shared/components/map/InfoWindowComponent.vue';

// Types Google Maps
declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

// Status of the app
const toast = useToast();
const mapContainer = ref<HTMLElement | null>(null);
const map = ref<google.maps.Map | null>(null);
const markers = ref<google.maps.Marker[]>([]);
const reports = ref<Report[]>([]);
const selectedReport = ref<Report | null>(null);
const infoWindow = ref<google.maps.InfoWindow | null>(null);
const loading = ref(false);
const reportDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const mapsLoaded = ref(false);

// Filters
const filters = ref<MonitoringReportsRequest>({
    page: 1,
    pageSize: 100,
    reportStatus: null,
    reportSeverity: null,
    startDate: null,
    endDate: null,
    latitude: null,
    longitude: null,
    radiusKm: null
});

// Edit report
const reportToEdit = ref<UpdateReportRequest>({
    id: '',
    comment: '',
    severity: 'Medium',
    status: 'Pending'
});

// Hooks for mutations
const updateReportMutation = useUpdateReport();
const deleteReportMutation = useDeleteReport();

// Initializing the map
function initMap() {
    if (!mapContainer.value || !window.google) return;

    try {
        // Downtown Cancun mexico
        const center = { lat: 21.1619080, lng: -86.8515279 };

        map.value = new window.google.maps.Map(mapContainer.value, {
            zoom: 12,
            center,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true
        });

        infoWindow.value = new window.google.maps.InfoWindow();
        mapsLoaded.value = true;
        loadReports();
    } catch (error) {
        console.error("Error al inicializar mapa:", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el mapa' });
    }
}

// Cargar reportes
async function loadReports() {
    if (!mapsLoaded.value) return;
    loading.value = true;
    try {
        const response = await listMonitoringReports(filters.value);
        reports.value = response.items;
        updateMapMarkers();
    } catch (error) {
        console.error("Error al cargar reportes:", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar reportes' });
    } finally {
        loading.value = false;
    }
}


// Crear InfoWindow con componente Vue
function createInfoWindowWithVue(report: Report, marker: google.maps.Marker): void {
    if (!map.value || !infoWindow.value) return;

    infoWindow.value.close();

    const container = document.createElement('div');

    // Crear una instancia Vue y montarla en el contenedor
    const infoApp = createApp({
        render() {
            return h(InfoWindowComponent, {
                report: report,
                baseUrl: import.meta.env.VITE_IMAGES_URL,
                onViewDetails: (id: string) => {
                    loadReportDetails(id);
                    if (infoWindow.value) infoWindow.value.close();
                }
            });
        }
    });

    infoApp.mount(container);

    infoWindow.value.setContent(container);

    // Abrir el InfoWindow
    infoWindow.value.open(map.value, marker);

    // Limpiar cuando se cierre el InfoWindow
    google.maps.event.addListenerOnce(infoWindow.value, 'closeclick', () => {
        infoApp.unmount();
    });
}

// Cerrar todos los InfoWindows
function closeAllInfoWindows() {
    if (infoWindow.value) {
        infoWindow.value.close();
    }
}

// Actualizar marcadores
function updateMapMarkers() {
    if (!map.value || !window.google) return;

    // Limpiar marcadores existentes
    markers.value.forEach((marker) => marker.setMap(null));
    markers.value = [];

    // Si no hay reportes, salir
    if (reports.value.length === 0) return;

    // Crear límites para el mapa
    const bounds = new window.google.maps.LatLngBounds();

    // Filtrar reportes basado en todos los criterios
    const filteredReports = reports.value.filter(report => {
        // Filtro por estado
        if (filters.value.reportStatus && report.status !== filters.value.reportStatus) {
            return false;
        }

        // Filtro por severidad
        if (filters.value.reportSeverity && report.severity !== filters.value.reportSeverity) {
            return false;
        }

        // Filtro por fecha de inicio
        if (filters.value.startDate) {
            const startDate = new Date(filters.value.startDate);
            const reportDate = new Date(report.createDate);
            
            // Comparar solo hasta el día, ignorando la hora
            startDate.setHours(0, 0, 0, 0);
            reportDate.setHours(0, 0, 0, 0);

            if (reportDate < startDate) {
                return false;
            }
        }
        return true;
    });

    // Si no hay reportes después del filtrado, salir
    if (filteredReports.length === 0) {
        // Opcional: podrías mostrar un mensaje de que no hay reportes que coincidan
        toast.add({ 
            severity: 'info', 
            summary: 'Filtrado', 
            detail: 'No se encontraron reportes que coincidan con los filtros seleccionados' 
        });
        return;
    }

    // Crear marcadores solo para los reportes filtrados
    filteredReports.forEach(report => {
        // Validar coordenadas
        if (isNaN(report.latitude) || isNaN(report.longitude)) return;

        const position = { lat: report.latitude, lng: report.longitude };

        const marker = new window.google.maps.Marker({
            position,
            map: map.value,
            title: report.location,
            icon: getMarkerIcon(report.status)
        });

        // Añadir evento de clic para InfoWindow
        marker.addListener('click', () => {
            createInfoWindowWithVue(report, marker);
        });

        markers.value.push(marker);
        bounds.extend(position);
    });

    // Ajustar mapa solo a los marcadores filtrados
    if (markers.value.length > 0 && map.value) {
        map.value.fitBounds(bounds);
        
        // Ajustar zoom para no acercarse demasiado
        if (map.value.getZoom() > 10) {
            map.value.setZoom(10);
        }
    }
}

// Función centralizada para refrescar la vista del mapa y componentes
async function refreshMapView() {
    loading.value = true;
    try {
        // Recargar reportes desde el servidor
        const response = await listMonitoringReports(filters.value);
        reports.value = response.items;

        // Cerrar cualquier InfoWindow abierto
        closeAllInfoWindows();

        // Actualizar marcadores
        updateMapMarkers();
    } catch (error) {
        console.error("Error al refrescar la vista:", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al refrescar la vista' });
    } finally {
        loading.value = false;
    }
}

// Cargar detalles de un reporte
async function loadReportDetails(reportId: string) {
    loading.value = true;
    try {
        const report = await getReport(reportId);
        selectedReport.value = report;
        reportDialog.value = true;
    } catch (error) {
        console.error("Error al cargar detalles:", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar detalles' });
    } finally {
        loading.value = false;
    }
}

function getMarkerIcon(status: ReportStatus): string {
    const statusIcons: Record<ReportStatus, string> = {
        Resolved: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        InProgress: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        Pending: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    };
    return statusIcons[status] ?? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
}

// Abrir diálogo de edición
function openEditDialog(report: Report) {
    reportToEdit.value = {
        id: report.id,
        comment: report.comment,
        severity: report.severity,
        status: report.status
    };
    editDialog.value = true;
}

// Actualizar reporte
async function handleUpdateReport() {
    try {
        const updatedReport = await updateReportMutation.mutateAsync(reportToEdit.value);

        // Actualizar estado local con un nuevo array para garantizar reactividad
        const updatedReports = [...reports.value];
        const index = updatedReports.findIndex(r => r.id === updatedReport.id);
        if (index !== -1) {
            updatedReports[index] = updatedReport;
            reports.value = updatedReports; // Asignar un nuevo array
        }

        // Cerrar cualquier InfoWindow abierto
        closeAllInfoWindows();

        // Forzar actualización de marcadores
        updateMapMarkers();
        editDialog.value = false;

        // Refrescar vista completa
        await refreshMapView();
    } catch (error) {
        console.error("Error al actualizar reporte:", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el reporte' });
    }
}

// Confirmar eliminación
function confirmDeleteReport(report: Report) {
    selectedReport.value = report;
    deleteDialog.value = true;
}

// Eliminar reporte
async function handleDeleteReport() {
    if (!selectedReport.value) return;

    try {
        await deleteReportMutation.mutateAsync(selectedReport.value.id);

        // Cerrar diálogo
        deleteDialog.value = false;

        // Cerrar cualquier InfoWindow abierto
        closeAllInfoWindows();

        // Limpiar completamente todos los marcadores
        markers.value.forEach(marker => marker.setMap(null));
        markers.value = [];

        // Forzar reinicio completo del mapa
        if (map.value) {
            const center = map.value.getCenter();
            const zoom = map.value.getZoom();

            // Reiniciar el mapa con la misma configuración
            map.value = new window.google.maps.Map(mapContainer.value, {
                zoom: zoom,
                center: center,
                mapTypeId: window.google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true
            });

            infoWindow.value = new window.google.maps.InfoWindow();
        }

        // Cargar datos frescos
        await loadReports();

    } catch (error) {
        console.error("Error al eliminar reporte:", error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el reporte'
        });
    }
}


// Cargar script de Google Maps
function loadGoogleMapsScript() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'API key de Google Maps no encontrada' });
        return;
    }

    if (window.google && window.google.maps) {
        initMap();
        return;
    }

    window.initMap = initMap;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Watch para filtros
watch(filters, () => {
    if (mapsLoaded.value) loadReports();
}, { deep: true });

// Lifecycle hooks
onMounted(() => {
    loadGoogleMapsScript();
});

onBeforeUnmount(() => {
    markers.value.forEach((marker) => marker.setMap(null));
    markers.value = [];

    // Eliminar función global
    if ('initMap' in window) {
        window.initMap = () => { };
    }
});
</script>

<template>
    <div class="max-w-full mx-auto p-4">
        <!-- Filtros -->
        <ReportFilter v-model="filters" @search="loadReports" />

        <!-- Estadísticas -->
        <ReportStats :reports="reports" />

        <!-- Mapa -->
        <div class="relative">
            <div ref="mapContainer" class="w-full h-[500px] rounded shadow-md"></div>
            <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                <ProgressSpinner strokeWidth="4" class="w-12 h-12" />
            </div>
        </div>

        <!-- Diálogo de detalles -->
        <ReportDetailDialog v-model:visible="reportDialog" :report="selectedReport"
            @edit="(report) => { openEditDialog(report); reportDialog = false; }"
            @delete="(report) => { confirmDeleteReport(report); reportDialog = false; }" />

        <!-- Diálogo de edición -->
        <ReportEditDialog v-model:visible="editDialog" v-model:report="reportToEdit" @save="handleUpdateReport" />

        <!-- Diálogo de confirmación de eliminación -->
        <ConfirmDialog v-model:visible="deleteDialog" title="Confirmar eliminación"
            message="¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer."
            @confirm="handleDeleteReport" />
    </div>
</template>

<style scoped>
.gm-style-iw {
    max-width: 300px !important;
}

@media (max-width: 768px) {
    .h-96 {
        height: 400px;
    }
}
</style>