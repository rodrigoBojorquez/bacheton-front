<template>
  <Dialog
    v-model:visible="isDialogOpen"
    header="Perfil de Usuario"
    :modal="true"
    :closable="true"
    style="width: 500px"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <div class="p-4">
      <div class="flex flex-col gap-4">
        <form @submit.prevent="saveProfile">
          <!-- Nombre -->
          <div>
            <label class="mt-2 block font-medium mb-1">Nombre <span class="text-red-500">*</span></label>
            <InputText
              v-model="userForm.name"
              class="w-full"
              :class="{ 'p-invalid': submitted && !userForm.name }"
              @keypress="blockSpecialChars"
            />
            <small v-if="submitted && !userForm.name" class="text-red-500">El nombre es requerido.</small>
          </div>

          <!-- Email -->
          <div>
            <label class="mt-2 block font-medium mb-1">Correo electrónico <span class="text-red-500">*</span></label>
            <InputText
              v-model="userForm.email"
              class="w-full"
              :class="{ 'p-invalid': submitted && !userForm.email }"
              @keypress="blockEmailSpecialChars"
            />
            <small v-if="submitted && !userForm.email" class="text-red-500">El email es requerido.</small>
          </div>

          <!-- Contraseña -->
          <div>
            <label class="mt-2 block font-medium mb-1">Contraseña</label>
            <Password v-model="userForm.password" toggleMask :feedback="false" class="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Contraseña" />
            <small v-if="submitted && userForm.password?.trim() && !validPassword(userForm.password)" class="p-error text-red-500">
              La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
            </small>
          </div>

          <!-- Rol solo lectura -->
          <div>
            <label class="mt-2 block font-medium mb-1">Rol</label>
            <InputText v-model="authStore.userRole" class="w-full bg-gray-100 cursor-not-allowed" readonly />
          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancelar" class="p-button-text" @click="closeDialog" />
            <Button label="Guardar" type="submit" />
          </div>
        </form>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/core/stores/authStore'
import { useEditUser, getUser } from '@/core/services/userService'

const isDialogOpen = ref(false)
const submitted = ref(false)
const toast = useToast()
const authStore = useAuthStore()
const editUserMutation = useEditUser()

const userForm = ref({
  id: '',
  name: '',
  email: '',
  password: '',
  roleId: ''
})

function validPassword(pwd: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
  return regex.test(pwd)
}

// Bloquea caracteres especiales peligrosos en campo nombre
function blockSpecialChars(event: KeyboardEvent) {
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]$/
  if (!regex.test(event.key)) {
    event.preventDefault()
  }
}

// Bloquea caracteres peligrosos en email (permite @ . - _)
function blockEmailSpecialChars(event: KeyboardEvent) {
  const allowedChars = /^[a-zA-Z0-9@._\-]$/
  if (!allowedChars.test(event.key)) {
    event.preventDefault()
  }
}

// Sanitización adicional antes de enviar
function sanitizeInput(input: string): string {
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML.trim()
}

// Expone esta función para AdminTopBar
async function openDialog() {
  submitted.value = false
  try {
    const user = await getUser(authStore.decodedUserId!)
    userForm.value = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      roleId: user.roleId
    }
    isDialogOpen.value = true
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar el perfil',
      life: 3000
    })
  }
}

function closeDialog() {
  isDialogOpen.value = false
  submitted.value = false
}

async function saveProfile() {
  submitted.value = true

  if (!userForm.value.name?.trim() || !userForm.value.email?.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Nombre y email son requeridos',
      life: 3000
    })
    return
  }

  if (userForm.value.password?.trim() && !validPassword(userForm.value.password)) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'La contraseña no cumple los requisitos.',
      life: 3000
    })
    return
  }

  try {
    await editUserMutation.mutateAsync({
      id: userForm.value.id,
      name: sanitizeInput(userForm.value.name),
      email: sanitizeInput(userForm.value.email),
      password: userForm.value.password?.trim() || '',
      roleId: userForm.value.roleId
    })

    await authStore.refreshUserInfo()
    closeDialog()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo actualizar el perfil',
      life: 3000
    })
  }
}

// 👇 Exponemos la función para AdminTopBar
defineExpose({ openDialog })
</script>
