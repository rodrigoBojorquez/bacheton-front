// src/core/stores/userReportStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ReportByUser, PaginatedResponse } from '@/core/types/report'
import { getUserReports } from '@/core/services/reportService'

export const useReportStore = defineStore('report', () => {
  const reports = ref<ReportByUser[]>([])
  const totalItems = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchReports(newPage = page.value, newPageSize = pageSize.value) {
    isLoading.value = true;
    try {
      // Llamada a la API
      const response = await getUserReports(newPage, newPageSize);
      // Asigna los datos
      reports.value = response.items;
      totalItems.value = response.totalItems;
      page.value = newPage;
      pageSize.value = newPageSize;
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  }

  return { reports, totalItems, page, pageSize, isLoading, error, fetchReports }
})

