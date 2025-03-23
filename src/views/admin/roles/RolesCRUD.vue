<!-- RolesCRUD.vue -->
<template>
  <div class="max-w-7xl mx-auto p-4">
    <!-- Toolbar -->
    <Toolbar class="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
      <template #start>
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-3"
          @click="openNew"
        />
        <Button
          label="Eliminar"
          icon="pi pi-trash"
          severity="danger"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          @click="confirmDeleteRole(selectedRoles[0])"
          :disabled="!selectedRoles.length"
        />
      </template>
    </Toolbar>

    <!-- DataTable con selección y filtrado -->
    <DataTable
      :value="roles"
      selectionMode="multiple"
      v-model:selection="selectedRoles"
      dataKey="id"
      :paginator="true"
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :filters="filters"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} roles"
      filterDisplay="menu"
      class="shadow"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0 text-lg font-bold">Gestión de Roles</h4>
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search text-gray-500" />
            </InputIcon>
            <InputText
              v-model="filters.global.value"
              placeholder="Buscar roles"
              class="border border-gray-300 rounded-md p-2"
            />
          </IconField>
        </div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      <Column field="name" header="Nombre" sortable class="py-2 px-4" />
      <Column field="description" header="Descripción" sortable class="py-2 px-4" />

      <!-- Muestra los permisos como una lista con icono, nombre y módulo -->
      <Column header="Permisos" class="py-2 px-4">
        <template #body="slotProps">
          <ul class="space-y-1">
            <li
              v-for="permissionId in slotProps.data.permissions"
              :key="permissionId"
              class="flex items-center gap-2"
            >
              <i :class="permissionMap[permissionId]?.icon"></i>
              <span>
                {{ permissionMap[permissionId]?.displayName }}
                <template v-if="permissionMap[permissionId]?.moduleName">
                  - ({{ permissionMap[permissionId].moduleName }})
                </template>
              </span>
            </li>
          </ul>
        </template>
      </Column>

      <Column header="Acciones" class="py-2 px-4">
        <template #body="slotProps">
          <div class="flex space-x-2">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-outlined bg-green-500 hover:bg-green-600 text-white"
              @click="editRole(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              class="p-button-rounded p-button-outlined bg-red-500 hover:bg-red-600 text-white"
              @click="confirmDeleteRole(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog para Agregar/Editar Rol -->
    <Dialog header="Detalles de Rol" v-model:visible="roleDialog" modal class="w-200">
      <div class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium">
            Nombre <span class="text-red-500">*</span>
          </label>
          <InputText
            id="name"
            v-model="roleForm.name"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            @keypress="(e) => preventInvalidInput(e, 'name')"
          />

          <small
            v-if="submitted && !roleForm.name?.trim()"
            class="p-error text-red-500"
          >
            El nombre es obligatorio.
          </small>
        </div>
        <div>
          <label for="description" class="block text-sm font-medium">
            Descripción
          </label>
          <InputText
            id="description"
            v-model="roleForm.description"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            @keypress="(e) => preventInvalidInput(e, 'description')"
          />

        </div>
        <div>
          <label for="permissions" class="block text-sm font-medium">
            Permisos <span class="text-red-500">*</span>
          </label>
          <!-- MultiSelect modificado: ancho completo y altura de 100px -->
          <MultiSelect
            v-if="allPermissions.length > 0"
            id="permissions"
            v-model="selectedPermissionObjects"
            :options="allPermissions"
            optionLabel="displayName"

            filter
            placeholder="Selecciona permisos"
            display="chip"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 h-[100px]"
          >
            <!-- Slot de opción: muestra icono (si existe), nombre y módulo -->
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <i v-if="slotProps.option.icon" :class="slotProps.option.icon"></i>
                <span>
                  {{ slotProps.option.displayName }}
                  <template v-if="slotProps.option.moduleName">
                    - ({{ slotProps.option.moduleName }})
                  </template>
                </span>
              </div>
            </template>

            <!-- Icono del dropdown -->
            <template #dropdownicon>
              <i class="pi pi-map"></i>
            </template>

            <!-- Icono del filtro -->
            <template #filtericon >
              <span class="pr-2">Selecciona los permisos del Rol</span>
              <i class="pi pi-lock"></i>
            </template>

            <!-- Header del menú desplegable -->
            <template #header>
              <div class="font-medium px-3 py-2">Permisos Disponibles</div>
            </template>

            <!-- Footer del menú desplegable -->
            <template #footer>
              <div class="p-3 flex justify-between">

              </div>
            </template>
          </MultiSelect>
          <small
            v-if="submitted && (!roleForm.permissions || roleForm.permissions.length === 0)"
            class="p-error text-red-500"
          >
            Los permisos son obligatorios.
          </small>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2 mt-4">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            text
            @click="roleDialog = false"
          />
          <Button
            :label="isEditMode ? 'Editar' : 'Crear'"
            icon="pi pi-check"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            @click="saveRole"
          />
        </div>
      </template>
    </Dialog>

    <!-- Dialog para Confirmar Eliminación -->
    <Dialog header="Confirmar" v-model:visible="deleteRoleDialog" modal class="w-120">
      <div class="flex items-center space-x-3">
        <i class="pi pi-exclamation-triangle !text-3xl text-orange-400"></i>
        <span class="text-gray-700">
          ¿Seguro que deseas eliminar el rol <b>{{ roleForm.name }}</b>?
        </span>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2 mt-4">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            text
            @click="deleteRoleDialog = false"
          />
          <Button
            label="Eliminar"
            severity="danger"
            icon="pi pi-check"
            text
            @click="deleteRole"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { listRoles, useAddRole, useEditRole, useDeleteRole } from '@/core/services/rolesService';
import { listPermissions } from '@/core/services/permissionsService';
import type { Role, AddRoleRequest, EditRoleRequest } from '@/core/types/role';
import type { Permission } from '@/core/types/permission';
import { FilterMatchMode } from '@primevue/core/api';

// Variables
const toast = useToast();
const roles = ref<Role[]>([]);
const selectedRoles = ref<Role[]>([]);
const roleDialog = ref(false);
const deleteRoleDialog = ref(false);
const isEditMode = ref(false);
const submitted = ref(false);

// Formulario
const roleForm = ref<Partial<AddRoleRequest & { id?: string }>>({
  name: '',
  permissions: [],
  description: ''
});

// Permisos
const allPermissions = ref<Permission[]>([]);
const permissionMap = computed(() => {
  const map: Record<string, Permission> = {};
  allPermissions.value.forEach((p) => {
    map[p.id] = p;
  });
  return map;
});

const selectedPermissionObjects = computed<Permission[]>({
  get() {
    return (roleForm.value.permissions || []).map((id) =>
      allPermissions.value.find((p) => p.id === id)
    ).filter(Boolean) as Permission[];
  },
  set(newPermissions: Permission[]) {
    roleForm.value.permissions = newPermissions.map(p => p.id);
  }
});

// Filtros
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Sanitización funciones
function sanitizeInput(value: string, type: 'name' | 'description'): string {
  let sanitized = value;

  if (type === 'name') {
    sanitized = sanitized.replace(/[^a-zA-Z0-9À-ÿ\u00f1\u00d1\s]/g, '');
  } else if (type === 'description') {
    sanitized = sanitized.replace(/[^a-zA-Z0-9À-ÿ\u00f1\u00d1\s.,:;!?()\-]/g, '');
  }

  return sanitized;
}

// Carga inicial
onMounted(async () => {
  await loadRoles();
  await loadAllPermissions();
});

async function loadRoles() {
  try {
    const response = await listRoles();
    roles.value = response.items;
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error cargando roles' });
  }
}

async function loadAllPermissions() {
  try {
    const response = await listPermissions();
    allPermissions.value = response.items;
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error cargando permisos' });
  }
}

function openNew() {
  roleForm.value = { name: '', permissions: [], description: '' };
  isEditMode.value = false;
  submitted.value = false;
  roleDialog.value = true;
}

function editRole(role: Role) {
  roleForm.value = { ...role };
  isEditMode.value = true;
  submitted.value = false;
  roleDialog.value = true;
}

// Mutations
const addRoleMutation = useAddRole();
const editRoleMutation = useEditRole();
const deleteRoleMutation = useDeleteRole();

async function saveRole() {
  submitted.value = true;

  // Sanitizamos antes de enviar
  roleForm.value.name = sanitizeInput(roleForm.value.name || '', 'name').trim();
  roleForm.value.description = sanitizeInput(roleForm.value.description || '', 'description').trim();

  // Validaciones
  if (!roleForm.value.name || !roleForm.value.permissions || roleForm.value.permissions.length === 0) {
    return;
  }

  try {
    if (isEditMode.value && roleForm.value.id) {
      await editRoleMutation.mutateAsync(roleForm.value as EditRoleRequest);
    } else {
      await addRoleMutation.mutateAsync(roleForm.value as AddRoleRequest);
    }
    await loadRoles();
    roleDialog.value = false;
    roleForm.value = { name: '', permissions: [], description: '' };
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el rol' });
  }
}

function confirmDeleteRole(role: Role) {
  roleForm.value = { ...role };
  deleteRoleDialog.value = true;
}

async function deleteRole() {
  try {
    await deleteRoleMutation.mutateAsync(roleForm.value.id as string);
    roles.value = roles.value.filter(r => r.id !== roleForm.value.id);
    deleteRoleDialog.value = false;
    roleForm.value = { name: '', permissions: [], description: '' };
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el rol' });
  }
}

// Prevención: bloquea escritura de caracteres peligrosos
function preventInvalidInput(event: KeyboardEvent, type: 'name' | 'description') {
  const char = String.fromCharCode(event.which);
  const regex = type === 'name'
    ? /^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s]$/
    : /^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s.,:;!?()\-]$/;

  if (!regex.test(char)) {
    event.preventDefault();
  }
}
</script>

