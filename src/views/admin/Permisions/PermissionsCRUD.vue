<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { listPermissions, useEditPermission } from '@/core/services/permissionsService';
import type { Permission, UpdatePermissionRequest } from '@/core/types/permission';
import { FilterMatchMode } from '@primevue/core/api';

const toast = useToast();
const permissions = ref<Permission[]>([]);
const permissionDialog = ref(false);
const submitted = ref(false);

// Formulario para actualizar el permiso
const updateForm = ref<Partial<UpdatePermissionRequest>>({
  id: '',
  displayName: '',
  icon: ''
});

// Filtro global para DataTable
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Íconos disponibles
const iconOptions = [
  { label: 'Actualizar', value: 'pi pi-pencil' },
  { label: 'Crear', value: 'pi pi-plus' },
  { label: 'Eliminar', value: 'pi pi-trash' },
  { label: 'Monitorear', value: 'pi pi-chart-line' },
  { label: 'Resolver', value: 'pi pi-check' },
  { label: 'Ver', value: 'pi pi-eye' },
];

// Cargar permisos
onMounted(async () => {
  await loadPermissions();
});

async function loadPermissions() {
  try {
    const response = await listPermissions();
    permissions.value = response.items;
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error cargando permisos' });
  }
}

// Abrir diálogo y cargar datos
function editPermission(permission: Permission) {
  updateForm.value = {
    id: permission.id,
    displayName: permission.displayName,
    icon: permission.icon
  };
  submitted.value = false;
  permissionDialog.value = true;
}

// Sanitización
function sanitizeInput(value: string): string {
  return value.replace(/[^a-zA-Z0-9À-ÿ\u00f1\u00d1\s.,:;!?()\-]/g, '');
}

// Prevenir caracteres no válidos en tiempo real
function preventInvalidInput(event: KeyboardEvent) {
  const char = String.fromCharCode(event.which);
  const regex = /^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s.,:;!?()\-]$/;
  if (!regex.test(char)) {
    event.preventDefault();
  }
}

// Mutación
const editPermissionMutation = useEditPermission();

// Guardar permiso
async function savePermission() {
  submitted.value = true;

  // Sanitizar antes de enviar
  updateForm.value.displayName = sanitizeInput(updateForm.value.displayName || '').trim();

  if (updateForm.value.displayName && updateForm.value.icon?.trim()) {
    try {
      await editPermissionMutation.mutateAsync(updateForm.value as UpdatePermissionRequest);
      const index = permissions.value.findIndex(p => p.id === updateForm.value?.id);
      if (index !== -1) {
        permissions.value[index].displayName = updateForm.value.displayName!;
        permissions.value[index].icon = updateForm.value.icon!;
      }
      permissionDialog.value = false;
    } catch {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el permiso' });
    }
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 gap">

    <!-- DataTable -->
    <DataTable
      :value="permissions"
      dataKey="id"
      :filters="filters"
      filterDisplay="menu"
      class="shadow"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25]"
    >
      <!-- Toolbar y filtro -->
      <Toolbar class="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <template #start>
          <h4 class="m-0 text-lg font-bold">Gestión de Permisos</h4>
        </template>
        <template #end>
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search text-gray-500" />
            </InputIcon>
            <InputText v-model="filters.global.value" placeholder="Buscar permisos" class="border border-gray-300 rounded-md p-2" />
          </IconField>
        </template>
      </Toolbar>

      <Column field="displayName" header="Nombre" sortable class="py-2 px-4" />
      <Column header="Ícono" class="py-2 px-4">
        <template #body="slotProps">
          <i :class="slotProps.data.icon" style="font-size: 1.2rem;"></i>
        </template>
      </Column>
      <Column field="moduleName" header="Módulo" sortable class="py-2 px-4" />
      <Column header="Acciones" class="py-2 px-4">
        <template #body="slotProps">
          <div class="flex space-x-2">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-outlined bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              @click="editPermission(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Diálogo para editar -->
    <Dialog header="Detalles del Permiso" v-model:visible="permissionDialog" modal class="w-96">
      <div class="space-y-4">
        <div>
          <label for="displayName" class="block text-sm font-medium primary">
            Nombre <span class="text-red-500">*</span>
          </label>
          <InputText
            id="displayName"
            v-model="updateForm.displayName"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            @keypress="preventInvalidInput"
          />
          <small v-if="submitted && !updateForm.displayName?.trim()" class="p-error text-red-500">
            El nombre es obligatorio.
          </small>
        </div>

        <div>
          <label for="icon" class="block text-sm font-medium primary">
            Ícono <span class="text-red-500">*</span>
          </label>

          <Select
            id="icon"
            v-model="updateForm.icon"
            :options="iconOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecciona un ícono"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <template #value="slotProps">
              <span v-if="slotProps.value">
                <i :class="slotProps.value" style="margin-right: 0.5rem;"></i>
                {{ iconOptions.find(o => o.value === slotProps.value)?.label }}
              </span>
              <span v-else>Selecciona un ícono</span>
            </template>
            <template #option="slotProps">
              <i :class="slotProps.option.value" style="margin-right: 0.5rem;"></i>
              {{ slotProps.option.label }}
            </template>
          </Select>
          <small v-if="submitted && !updateForm.icon?.trim()" class="p-error text-red-500">
            El ícono es obligatorio.
          </small>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2 mt-4">
          <Button label="Cancelar" icon="pi pi-times" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" text @click="permissionDialog = false" />
          <Button label="Guardar" icon="pi pi-check" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" @click="savePermission" />
        </div>
      </template>
    </Dialog>
  </div>
</template>
