<script setup lang="ts">
import { computed } from 'vue';
import type { Report } from '@/core/types/reportMap';

const props = defineProps<{
    reports: Report[]
}>();

// Estadísticas calculadas
const pending = computed(() => props.reports.filter(r => r.status === 'Pending').length);
const inProgress = computed(() => props.reports.filter(r => r.status === 'InProgress').length);
const resolved = computed(() => props.reports.filter(r => r.status === 'Resolved').length);
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
        <Card>
            <template #content>
                <div class="flex items-center">
                    <div class="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mr-4">
                        <i class="pi pi-map-marker text-blue-500 text-xl"></i>
                    </div>
                    <div>
                        <div class="text-base text-gray-500">Total reportes</div>
                        <div class="text-2xl font-bold">{{ reports.length }}</div>
                    </div>
                </div>
            </template>
        </Card>
        <Card>
            <template #content>
                <div class="flex items-center">
                    <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mr-4">
                        <i class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
                    </div>
                    <div>
                        <div class="text-base text-gray-500">Pendientes</div>
                        <div class="text-2xl font-bold">{{ pending }}</div>
                    </div>
                </div>
            </template>
        </Card>
        <Card>
            <template #content>
                <div class="flex items-center">
                    <div class="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mr-4">
                        <i class="pi pi-clock text-yellow-500 text-xl"></i>
                    </div>
                    <div>
                        <div class="text-base text-gray-500">En progreso</div>
                        <div class="text-2xl font-bold">{{ inProgress }}</div>
                    </div>
                </div>
            </template>
        </Card>
        <Card>
            <template #content>
                <div class="flex items-center">
                    <div class="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mr-4">
                        <i class="pi pi-check-circle text-green-500 text-xl"></i>
                    </div>
                    <div>
                        <div class="text-base text-gray-500">Resueltos</div>
                        <div class="text-2xl font-bold">{{ resolved }}</div>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>