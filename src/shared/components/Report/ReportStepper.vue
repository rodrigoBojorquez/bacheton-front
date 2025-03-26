<template>
  <div class="card flex justify-center color-primary">
    <!-- Contenedor responsivo -->
    <div class="w-full p-6 rounded shadow-lg sm:max-w-md md:max-w-xl lg:max-w-2xl color-primary">
      <!-- Formulario con vee-validate (solo valida "comment" y "location") -->
      <Form
        :initial-values="initialValues"
        :validation-schema="schema"
        v-slot="{ validate, values }"
      >
        <!-- Comentario -->
        <div class="mb-6">
          <FloatLabel variant="on">
            <Field
              name="comment"
              as="InputText"
              id="comment"
              class="w-full border p-3 rounded text-lg h-40"
            />
            <label for="comment" class="text-lg">Comentario</label>
          </FloatLabel>
          <ErrorMessage name="comment">
            <template #default="{ message }">
              <small class="p-error">{{ message }}</small>
            </template>
          </ErrorMessage>
        </div>

        <!-- Ubicación -->
        <div class="mb-6">
          <FloatLabel variant="on">
            <Field
              name="location"
              as="InputText"
              id="location"
              class="w-full border p-3 rounded text-lg"
            />
            <label for="location" class="text-lg">Referencias</label>
          </FloatLabel>
          <ErrorMessage name="location">
            <template #default="{ message }">
              <small class="p-error">{{ message }}</small>
            </template>
          </ErrorMessage>
        </div>

        <!-- Severidad (Validación manual) -->
        <div class="mb-6">
          <label class="block mb-3 font-medium text-2xl text-center color-primary">
            Severidad
          </label>
          <Select
            v-model="severity"
            :options="severityOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecciona una severidad"
            class="w-full"
            id="severity"
          />
          <div v-if="severityError" class="p-error text-center">
            <small>{{ severityError }}</small>
          </div>
        </div>

        <!-- reCAPTCHA -->
        <div class="mb-6 flex justify-center">
          <VueRecaptcha
            ref="recaptcha"
            sitekey="6LezVfsqAAAAADzSPWMGrrlEINkJ0ublHRx5d9rO"
            @verify="onVerify"
            @expired="onExpired"
          />
        </div>

        <!-- Botón Guardar Reporte -->
        <div class="flex justify-center">
          <!-- Botón de tipo "button" para controlar el flujo -->
          <Button
            type="button"
            label="Guardar Reporte"
            icon="pi pi-check"
            class="text-xl"
            @click="handleSubmit(values, validate)"
          />
        </div>
      </Form>
    </div>

    <!-- ConfirmDialog para confirmar el envío del reporte -->
    <ConfirmDialog group="headless" class="color-primary">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 rounded shadow-lg color-primary">
          <div class="rounded-full bg-primary text-white inline-flex justify-center items-center h-24 w-24 -mt-20">
            <i class="pi pi-question !text-4xl"></i>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-3 mt-6">
            <Button label="Guardar" @click="acceptCallback" />
            <Button label="Cancelar" outlined @click="rejectCallback" />
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Select from 'primevue/select'
import VueRecaptcha from 'vue3-recaptcha2'

const confirm = useConfirm()
const toast = useToast()

const props = defineProps<{
  initialLatitude?: number | null,
  initialLongitude?: number | null,
  initialPhoto?: string
}>()

const emit = defineEmits<{ (e: 'save', report: any): void }>()

// Esquema de validación: solo se validan "comment" y "location"
const schema = yup.object({
  comment: yup.string().required('El comentario es obligatorio'),
  location: yup.string().required('La ubicación es obligatoria')
})

// Opciones para el Select de severidad
const severityOptions = [
  { label: 'Baja', value: 'Low' },
  { label: 'Media', value: 'Medium' },
  { label: 'Alta', value: 'High' }
]

// Valores iniciales del formulario (sin "severity")
const initialValues = {
  comment: '',
  location: '',
  latitude: props.initialLatitude ?? null,
  longitude: props.initialLongitude ?? null
}

// Variable local para "severity" y su mensaje de error
const severity = ref('')
const severityError = ref('')

// Variable para el token del captcha
const captchaToken = ref('')

// Eventos para reCAPTCHA
const onVerify = (token: string) => {
  captchaToken.value = token
}
const onExpired = () => {
  captchaToken.value = ''
}

/**
 * handleSubmit:
 * 1. Valida el formulario (comment y location) con vee-validate.
 * 2. Verifica manualmente que "severity" no esté vacío.
 * 3. Verifica que el captcha esté resuelto.
 * 4. Muestra ConfirmDialog; al aceptar, emite "save" con todos los datos.
 */
const handleSubmit = async (values: any, validate: Function) => {
  console.log('Form values:', values)
  // Validar comment y location
  const isValid = await validate()
  if (!isValid) {
    toast.add({
      severity: 'error',
      summary: 'Validación',
      detail: 'Corrige los errores antes de enviar',
      life: 2000
    })
    return
  }
  // Validar manualmente el Select de severidad
  if (!severity.value) {
    severityError.value = 'La severidad es obligatoria'
    toast.add({
      severity: 'error',
      summary: 'Validación',
      detail: 'Selecciona una severidad',
      life: 2000
    })
    return
  } else {
    severityError.value = ''
  }
  // Verificar captcha
  if (!captchaToken.value) {
    toast.add({
      severity: 'error',
      summary: 'Captcha',
      detail: 'Por favor, resuelve el captcha antes de guardar',
      life: 2000
    })
    return
  }
  // Mostrar ConfirmDialog
  confirm.require({
    group: 'headless',
    header: '¿Está seguro?',
    message: 'Confirma para proceder.',
    accept: () => {
      // Combinar valores del formulario con el valor del select
      const reportData = {
        ...values,
        severity: severity.value,
        latitude: initialValues.latitude,
        longitude: initialValues.longitude
      }
      console.log('Enviando reporte:', reportData)
      emit('save', reportData)
    },
    reject: () => {
      toast.add({
        severity: 'error',
        summary: 'Cancelado',
        detail: 'El envío del reporte fue cancelado ❌',
        life: 1500
      })
    }
  })
}
</script>

<style scoped>
.p-error {
  color: red !important;
}
</style>
