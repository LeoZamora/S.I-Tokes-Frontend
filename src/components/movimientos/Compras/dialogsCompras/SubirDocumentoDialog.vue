<template>
  <v-dialog :model-value="show" max-width="650px" persistent @update:model-value="val => !val && close()">
    <v-card class="rounded-lg">
      <v-card-title class="bg-gradient text-white pa-4 d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon size="26" class="mr-2">mdi-file-upload-outline</v-icon>
          <span class="text-h6 font-weight-bold">Adjuntar Documento a Expediente</span>
        </div>
        <v-btn icon="mdi-close" variant="text" color="white" density="compact" @click="close" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-alert
          v-if="expediente"
          color="orange-lighten-5"
          border="start"
          border-color="orange-darken-4"
          class="mb-4 text-body-2"
          density="compact"
        >
          <strong>Expediente:</strong> {{ expediente.noExpediente }} | <strong>Proveedor:</strong> {{ expediente.nombreProveedor || 'N/A' }}
        </v-alert>

        <!-- ÁREA INTERACTIVA DRAG & DROP -->
        <div
          class="drop-zone pa-6 rounded-lg text-center cursor-pointer mb-4"
          :class="{ 'drop-zone-active': isDragging, 'drop-zone-has-file': !!selectedFile }"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          @click="triggerFileInput"
        >
          <input
            ref="hiddenFileInputRef"
            type="file"
            class="d-none"
            @change="onFileSelected"
          />

          <template v-if="!selectedFile">
            <v-avatar color="orange-lighten-5" size="56" class="mb-2">
              <v-icon size="32" color="orange-darken-4">mdi-cloud-upload-outline</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-bold text-orange-darken-4">
              Arrastra y suelta tu archivo aquí
            </div>
            <div class="text-caption text-grey-darken-1">
              o haz clic en esta área para examinar tus archivos (PDF, PNG, JPG, DOC, XLS)
            </div>
          </template>

          <template v-else>
            <div class="d-flex align-center justify-space-between text-left pa-2">
              <div class="d-flex align-center overflow-hidden">
                <v-avatar color="orange-darken-4" size="40" class="mr-3 text-white flex-shrink-0">
                  <v-icon size="24">mdi-file-check-outline</v-icon>
                </v-avatar>
                <div class="overflow-hidden">
                  <div class="text-subtitle-2 font-weight-bold text-truncate" :title="selectedFile.name">
                    {{ selectedFile.name }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ formatFileSize(selectedFile.size) }}
                  </div>
                </div>
              </div>
              <v-btn
                icon="mdi-close-circle"
                variant="text"
                color="error"
                density="compact"
                title="Quitar archivo"
                @click.stop="clearFile"
              />
            </div>
          </template>
        </div>

        <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
          <v-row dense>
            <v-col cols="12">
              <v-autocomplete
                v-model="form.idTipoDocumento"
                :items="tiposDocumento"
                item-title="title"
                item-value="value"
                label="Tipo de Documento *"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-file-tree"
                :rules="[v => !!v || 'El tipo de documento es requerido']"
                :loading="loadingTipos"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.noDocumento"
                label="No. de Documento *"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-pound"
                :rules="[v => !!v || 'El número de documento es requerido']"
                placeholder="Ej. FAC-98765 / BL-001"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.emisor"
                label="Emisor"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-account-edit-outline"
                placeholder="Empresa o entidad emisora"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.fechaEmision"
                label="Fecha de Emisión"
                type="date"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-calendar-export-outline"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.fechaVencimiento"
                label="Fecha de Vencimiento"
                type="date"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-calendar-import-outline"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 justify-end bg-grey-lighten-4">
        <v-btn variant="outlined" color="grey-darken-1" class="mr-2" @click="close">
          Cancelar
        </v-btn>
        <v-btn
          color="orange-darken-4"
          elevation="2"
          prepend-icon="mdi-upload"
          :loading="uploading"
          :disabled="!selectedFile"
          @click="submit"
        >
          Subir Documento
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useStore } from '@/store'
import { useSnackbar } from '@/composables/use-snackbar.js'
import RequestHttp from '@/services/requestHttp'

export default {
  name: 'SubirDocumentoDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    expediente: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'uploaded'],
  setup(props, { emit }) {
    const store = useStore()
    const { snackbar } = useSnackbar()
    const requestHttp = new RequestHttp()

    const formRef = ref(null)
    const hiddenFileInputRef = ref(null)
    const valid = ref(false)
    const uploading = ref(false)
    const loadingTipos = ref(false)
    const isDragging = ref(false)
    const tiposDocumento = ref([])
    const fileInput = ref(null)

    const form = reactive({
      idTipoDocumento: null,
      noDocumento: '',
      emisor: '',
      fechaEmision: '',
      fechaVencimiento: ''
    })

    const selectedFile = computed(() => {
      if (!fileInput.value) return null
      return Array.isArray(fileInput.value) ? fileInput.value[0] : fileInput.value
    })

    const formatFileSize = (bytes) => {
      if (!bytes || bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const triggerFileInput = () => {
      if (hiddenFileInputRef.value) {
        hiddenFileInputRef.value.click()
      }
    }

    const onFileSelected = (event) => {
      const files = event.target.files
      if (files && files.length > 0) {
        fileInput.value = files[0]
      }
    }

    const onDragOver = (event) => {
      event.preventDefault()
      isDragging.value = true
    }

    const onDragLeave = (event) => {
      event.preventDefault()
      isDragging.value = false
    }

    const onDrop = (event) => {
      event.preventDefault()
      isDragging.value = false
      if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        fileInput.value = event.dataTransfer.files[0]
      }
    }

    const clearFile = () => {
      fileInput.value = null
      if (hiddenFileInputRef.value) {
        hiddenFileInputRef.value.value = ''
      }
    }

    const loadTiposDocumento = async () => {
      loadingTipos.value = true
      try {
        const res = await requestHttp.getTiposDocumentoCombobox()
        const dataArr = res.code === 200 ? res.data : (Array.isArray(res) ? res : [])
        if (Array.isArray(dataArr)) {
          tiposDocumento.value = dataArr.map(t => ({
            title: t.nombre || t.title || t.codigo,
            value: t.id ?? t.idTipoDocumento ?? t.value
          }))
        }
      } catch (e) {
        console.error(e)
      } finally {
        loadingTipos.value = false
      }
    }

    onMounted(() => {
      loadTiposDocumento()
    })

    watch(() => props.show, (newVal) => {
      if (newVal) {
        form.idTipoDocumento = null
        form.noDocumento = ''
        form.emisor = ''
        form.fechaEmision = ''
        form.fechaVencimiento = ''
        clearFile()
        if (tiposDocumento.value.length === 0) {
          loadTiposDocumento()
        }
      }
    })

    const close = () => {
      emit('close')
    }

    const submit = async () => {
      const { valid: isValid } = await formRef.value.validate()
      if (!isValid) return

      if (!selectedFile.value) {
        snackbar.value = { show: true, text: 'Debe seleccionar o arrastrar un archivo válido.', color: 'warning' }
        return
      }

      uploading.value = true
      try {
        const username = store.getNameUser() || 'Sistema'
        const formData = new FormData()
        formData.append('IdExpedienteImportacion', props.expediente.idExpedienteImportacion)
        formData.append('IdTipoDocumento', form.idTipoDocumento)
        formData.append('NoDocumento', form.noDocumento)
        if (form.emisor) formData.append('Emisor', form.emisor)
        if (form.fechaEmision) formData.append('FechaEmision', new Date(form.fechaEmision).toISOString())
        if (form.fechaVencimiento) formData.append('FechaVencimiento', new Date(form.fechaVencimiento).toISOString())
        formData.append('UsuarioRegistro', username)
        formData.append('Archivo', selectedFile.value)

        const res = await requestHttp.subirDocumentoImportacion(formData)
        if (res.code === 200 || res.code === 201) {
          snackbar.value = { show: true, text: 'Documento subido exitosamente', color: 'success' }
          emit('uploaded')
          close()
        } else {
          snackbar.value = { show: true, text: res.data?.mensaje || 'Error al subir el documento', color: 'error' }
        }
      } catch (err) {
        snackbar.value = { show: true, text: 'Error al procesar la carga del documento', color: 'error' }
      } finally {
        uploading.value = false
      }
    }

    return {
      formRef,
      hiddenFileInputRef,
      valid,
      uploading,
      loadingTipos,
      isDragging,
      tiposDocumento,
      selectedFile,
      form,
      formatFileSize,
      triggerFileInput,
      onFileSelected,
      onDragOver,
      onDragLeave,
      onDrop,
      clearFile,
      close,
      submit
    }
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #e65100 0%, #ef6c00 100%);
}
.cursor-pointer {
  cursor: pointer;
}
.drop-zone {
  border: 2px dashed #e0e0e0;
  background-color: #fafafa;
  transition: all 0.2s ease-in-out;
}
.drop-zone:hover {
  border-color: #ef6c00;
  background-color: #fff8e1;
}
.drop-zone-active {
  border-color: #e65100 !important;
  background-color: #ffe0b2 !important;
  transform: scale(1.01);
}
.drop-zone-has-file {
  border-style: solid;
  border-color: #fb8c00;
  background-color: #fff3e0;
}
</style>
