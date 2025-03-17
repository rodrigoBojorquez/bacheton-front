<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { listUsers, useAddUser, useEditUser, useDeleteUser } from '@/core/services/userService';
import { listRoles } from '@/core/services/rolesService';
import type { User, AddUserRequest, EditUserRequest } from '@/core/types/user';
import type { Role } from '@/core/types/role';
import { FilterMatchMode } from '@primevue/core/api';

const toast = useToast();
const users = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const userDialog = ref(false);
const deleteUserDialog = ref(false);
const isEditMode = ref(false);
const submitted = ref(false);

// Formulario para creación/edición (NO incluye id como editable)
const userForm = ref<Partial<AddUserRequest & { id?: string }>>({
  name: '',
  email: '',
  password: '',
  roleId: ''
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const roles = ref<Role[]>([]);

onMounted(async () => {
  await loadUsers();
  await loadRoles();
});

async function loadUsers() {
  try {
    const response = await listUsers();
    users.value = response.items;
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error cargando usuarios' });
  }
}

async function loadRoles() {
  try {
    const response = await listRoles();
    roles.value = response.items;
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error cargando roles' });
  }
}

function openNew() {
  userForm.value = { name: '', email: '', password: '', roleId: '' };
  isEditMode.value = false;
  submitted.value = false;
  userDialog.value = true;
}

function editUser(user: User) {
  userForm.value = { ...user, password: '' }; // No mostramos contraseña actual
  isEditMode.value = true;
  submitted.value = false;
  userDialog.value = true;
}

const addUserMutation = useAddUser();
const editUserMutation = useEditUser();
const deleteUserMutation = useDeleteUser();

function validPassword(pwd: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return regex.test(pwd);
}

async function saveUser() {
  submitted.value = true;

  if (!userForm.value.name?.trim() || !userForm.value.email?.trim() || !userForm.value.roleId?.trim()) {
    return;
  }

  // Contraseña obligatoria SOLO para creación
  if (!isEditMode.value) {
    if (!userForm.value.password?.trim()) {
      return;
    }
    if (!validPassword(userForm.value.password)) {
      return;
    }
  }

  try {
    if (isEditMode.value && userForm.value.id) {
      await editUserMutation.mutateAsync(userForm.value as EditUserRequest);
    } else {
      await addUserMutation.mutateAsync(userForm.value as AddUserRequest);
    }
    await loadUsers();
    userDialog.value = false;
    userForm.value = { name: '', email: '', password: '', roleId: '' };
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el usuario' });
  }
}

function confirmDeleteUser(user: User) {
  userForm.value = { ...user };
  deleteUserDialog.value = true;
}

async function deleteUser() {
  try {
    await deleteUserMutation.mutateAsync(userForm.value.id as string);
    users.value = users.value.filter(u => u.id !== userForm.value.id);
    deleteUserDialog.value = false;
    userForm.value = { name: '', email: '', password: '', roleId: '' };
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el usuario' });
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-4">
    <Toolbar class="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
      <template #start>
        <Button label="Nuevo" icon="pi pi-plus"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-3"
                @click="openNew" />
        <Button label="Eliminar" icon="pi pi-trash"
                severity="danger"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                @click="confirmDeleteUser(selectedUsers[0])"
                :disabled="!selectedUsers.length" />
      </template>
    </Toolbar>

    <DataTable
      :value="users"
      selectionMode="multiple"
      v-model:selection="selectedUsers"
      dataKey="id"
      :paginator="true"
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :filters="filters"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
      filterDisplay="menu"
      class="shadow"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0 text-lg font-bold">Gestión de Usuarios</h4>
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search text-gray-500" />
            </InputIcon>
            <InputText v-model="filters.global.value" placeholder="Buscar usuarios" class="border border-gray-300 rounded-md p-2" />
          </IconField>
        </div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="id" header="ID" sortable class="py-2 px-4" />
      <Column field="name" header="Nombre" sortable class="py-2 px-4" />
      <Column field="email" header="Email" sortable class="py-2 px-4" />
      <Column field="roleName" header="Rol" sortable class="py-2 px-4" />
      <Column header="Acciones" class="py-2 px-4">
        <template #body="slotProps">
          <div class="flex space-x-2">
            <Button icon="pi pi-pencil"
                    class="p-button-rounded p-button-outlined bg-green-500 hover:bg-green-600 text-white"
                    @click="editUser(slotProps.data)" />
            <Button icon="pi pi-trash"
                    severity="danger"
                    class="p-button-rounded p-button-outlined bg-red-500 hover:bg-red-600 text-white"
                    @click="confirmDeleteUser(slotProps.data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog para Agregar/Editar Usuario -->
    <Dialog header="Detalles de Usuario" v-model:visible="userDialog" modal class="w-96">
      <div class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium primary">
            Nombre <span class="text-red-500">*</span>
          </label>
          <InputText id="name" v-model="userForm.name" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          <small v-if="submitted && !userForm.name?.trim()" class="p-error text-red-500">El nombre es obligatorio.</small>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium primary">
            Email <span class="text-red-500">*</span>
          </label>
          <InputText id="email" v-model="userForm.email" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          <small v-if="submitted && !userForm.email?.trim()" class="p-error text-red-500">El email es obligatorio.</small>
        </div>

        <!-- Contraseña editable pero opcional en edición -->
        <div>
          <label for="password" class="block text-sm font-medium primary">
            Contraseña <span v-if="!isEditMode" class="text-red-500">*</span>
          </label>
          <Password id="password" v-model="userForm.password" toggleMask class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          <small v-if="submitted && !userForm.password?.trim() && !isEditMode" class="p-error text-red-500">La contraseña es obligatoria.</small>
          <small v-if="submitted && userForm.password?.trim() && !validPassword(userForm.password)" class="p-error text-red-500">
            La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
          </small>
        </div>

        <div>
          <label for="roleId" class="block text-sm font-medium primary">
            Rol <span class="text-red-500">*</span>
          </label>
          <Select
            id="roleId"
            v-model="userForm.roleId"
            :options="roles"
            optionLabel="name"
            optionValue="id"
            filter
            placeholder="Selecciona un rol"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          <small v-if="submitted && !userForm.roleId?.trim()" class="p-error text-red-500">El rol es obligatorio.</small>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2 mt-4">
          <Button label="Cancelar" icon="pi pi-times"
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  text @click="userDialog = false" />
          <Button :label="isEditMode ? 'Editar' : 'Crear'" icon="pi pi-check"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  @click="saveUser" />
        </div>
      </template>
    </Dialog>

    <!-- Dialog para Confirmar Eliminación -->
    <Dialog header="Confirmar" v-model:visible="deleteUserDialog" modal class="w-120">
      <div class="flex items-center space-x-3">
        <i class="pi pi-exclamation-triangle !text-3xl text-orange-400"></i>
        <span class="text-gray-700">
          ¿Seguro que deseas eliminar a <b>{{ userForm.name }}</b>?
        </span>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2 mt-4">
          <Button label="Cancelar" icon="pi pi-times"
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  text @click="deleteUserDialog = false" />
          <Button label="Eliminar" severity="danger" icon="pi pi-check" text @click="deleteUser"/>
        </div>
      </template>
    </Dialog>
  </div>
</template>
