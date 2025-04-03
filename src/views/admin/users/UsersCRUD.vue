<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { listUsers, useAddUser, useEditUser, useDeleteUser } from '@/core/services/userService';
import { listRoles } from '@/core/services/rolesService';
import type { User, AddUserRequest, EditUserRequest } from '@/core/types/user';
import type { Role } from '@/core/types/role';
import { FilterMatchMode } from '@primevue/core/api';
import { useAuthStore } from '@/core/stores/authStore'

const authStore = useAuthStore()

const users = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const userDialog = ref(false);
const deleteUserDialog = ref(false);
const isEditMode = ref(false);
const submitted = ref(false);

// Agregamos variables para la paginación:
const currentPage = ref(1);           // Página actual (1-indexado)
const rows = ref(10);                 // Cantidad de elementos por página
const totalItems = ref(0);            // Total de registros devueltos por el backend
const firstRecord = computed(() => (currentPage.value - 1) * rows.value);  // Índice del primer registro de la página

// Función para sanitizar el input antes de enviarlo (quita HTML y espacios peligrosos)
function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML.trim();
}

// Bloquea caracteres especiales al escribir (solo letras, números, @, puntos y guiones bajos para email, letras para nombre)
function blockSpecialChars(event: KeyboardEvent, type: 'name' | 'email') {
  let allowedChars;
  if (type === 'name') {
    allowedChars = /^[a-zA-ZÀ-ÿ\u00f1\u00d10-9\s]$/; // Letras, espacios, ñ, acentos, números
  } else {
    allowedChars = /^[a-zA-Z0-9@._\-]$/; // Letras, números, email chars
  }
  if (!allowedChars.test(event.key)) {
    event.preventDefault();
  }
}

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

// Modificamos loadUsers para enviar los parámetros de paginación y actualizar totalItems:
async function loadUsers() {
  try {
    // Se envían currentPage y rows para la paginación, y opcionalmente el filtro global
    const response = await listUsers(currentPage.value, rows.value, filters.value.global.value);
    users.value = response.items;
    totalItems.value = response.totalItems;
  } catch {
    // Manejo de error (opcional)
  }
}

async function loadRoles() {
  try {
    const response = await listRoles();
    roles.value = response.items;
  } catch {
    // Manejo de error (opcional)
  }
}

function openNew() {
  userForm.value = { name: '', email: '', password: '', roleId: '' };
  isEditMode.value = false;
  submitted.value = false;
  userDialog.value = true;
}

function editUser(user: User) {
  userForm.value = { ...user, password: '' };
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

  // Sanitizar los campos antes de enviar
  userForm.value.name = sanitizeInput(userForm.value.name);
  userForm.value.email = sanitizeInput(userForm.value.email);

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
      if (userForm.value.id === authStore.decodedUserId) {
        await authStore.refreshUserInfo(); // Refresca nombre y rol
      }
    } else {
      await addUserMutation.mutateAsync(userForm.value as AddUserRequest);
    }
    await loadUsers();
    userDialog.value = false;
    userForm.value = { name: '', email: '', password: '', roleId: '' };
  } catch {
    // Manejo de error (opcional)
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
    // Manejo de error (opcional)
  }
}

// Implementación de la paginación en modo lazy: se actualizan currentPage y rows, y se recargan los datos.
function onPageChange(event: { page: number; first: number; rows: number; pageCount: number }) {
  currentPage.value = event.page + 1; // event.page es 0-indexado, se ajusta a 1-indexado
  rows.value = event.rows;
  loadUsers();
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
                :disabled="!selectedUsers.length || selectedUsers.some(u => u.id === authStore.decodedUserId)" />
      </template>
    </Toolbar>

    <DataTable
      :value="users"
      selectionMode="multiple"
      v-model:selection="selectedUsers"
      dataKey="id"
      :paginator="true"
      :lazy="true"
      :first="firstRecord"
      :rows="rows"
      :totalRecords="totalItems"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :filters="filters"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
      filterDisplay="menu"
      @page="onPageChange"
      class="shadow"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0 text-lg font-bold">Gestión de Usuarios</h4>
          <!-- <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search text-gray-500" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Buscar usuarios" class="border border-gray-300 rounded-md p-2" />
          </IconField> -->
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
            <Button v-if="slotProps.data.id !== authStore.decodedUserId"
                    icon="pi pi-trash"
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
          <InputText
              id="name"
              v-model="userForm.name"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2"
              @keypress="(e) => blockSpecialChars(e, 'name')"
            />
          <small v-if="submitted && !userForm.name?.trim()" class="p-error text-red-500">El nombre es obligatorio.</small>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium primary">
            Email <span class="text-red-500">*</span>
          </label>
          <InputText
              id="email"
              v-model="userForm.email"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2"
              @keypress="(e) => blockSpecialChars(e, 'email')"
            />
          <small v-if="submitted && !userForm.email?.trim()" class="p-error text-red-500">El email es obligatorio.</small>
        </div>

        <!-- Contraseña editable pero opcional en edición -->
        <div>
          <label for="password" class="block text-sm font-medium primary">
            Contraseña <span v-if="!isEditMode" class="text-red-500">*</span>
          </label>
          <Password id="password" v-model="userForm.password" toggleMask :feedback="false" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
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
