<template>
  <v-dialog :model-value="show" max-width="1100px" scrollable persistent @update:model-value="val => !val && close()">
    <v-card class="rounded-lg">
      <v-card-title class="bg-gradient text-white pa-4 d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon size="26" class="mr-2">mdi-folder-open-outline</v-icon>
          <div>
            <div class="text-h6 font-weight-bold">
              Documentos del Expediente: {{ expediente?.noExpediente }}
            </div>
            <div class="text-caption opacity-80">
              Proveedor: {{ expediente?.nombreProveedor || 'N/A' }} | Total Documentos: {{ documentos.length }}
            </div>
          </div>
        </div>
        <div>
          <v-btn
            color="white"
            variant="tonal"
            size="small"
            prepend-icon="mdi-plus"
            class="mr-2"
            @click="$emit('open-upload')"
          >
            Adjuntar Documento
          </v-btn>
          <v-btn icon="mdi-close" variant="text" color="white" density="compact" @click="close" />
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6 bg-grey-lighten-4" style="max-height: 75vh;">
        <!-- State Loading -->
        <div v-if="loading" class="d-flex flex-column align-center justify-center py-12">
          <v-progress-circular indeterminate color="orange-darken-4" size="50" class="mb-4" />
          <span class="text-body-1 text-grey-darken-1">Cargando documentos del expediente...</span>
        </div>

        <!-- State Empty -->
        <div v-else-if="documentos.length === 0" class="d-flex flex-column align-center justify-center py-12">
          <v-icon size="64" color="grey-lighten-1" class="mb-2">mdi-file-hidden</v-icon>
          <h3 class="text-h6 text-grey-darken-1 font-weight-medium">Sin Documentos Registrados</h3>
          <p class="text-caption text-grey-darken-1 mb-4">Este expediente aún no cuenta con archivos adjuntos.</p>
          <v-btn color="orange-darken-4" prepend-icon="mdi-upload" @click="$emit('open-upload')">
            Subir Primer Documento
          </v-btn>
        </div>

        <!-- Cards Grid -->
        <v-row v-else dense>
          <v-col v-for="doc in documentos" :key="doc.idDocumentoImportacion" cols="12" sm="6" md="4">
            <v-card class="elevation-2 rounded-lg border h-100 d-flex flex-column card-hover">
              <div class="pa-3 bg-grey-lighten-5 d-flex align-center justify-space-between border-bottom">
                <div class="d-flex align-center overflow-hidden">
                  <v-avatar :color="getFileColor(doc)" size="36" class="mr-2 text-white flex-shrink-0">
                    <v-icon size="20">{{ getFileIcon(doc) }}</v-icon>
                  </v-avatar>
                  <div class="text-truncate">
                    <div class="text-subtitle-2 font-weight-bold text-truncate" :title="doc.nombreTipoDocumento">
                      {{ doc.nombreTipoDocumento || 'Documento' }}
                    </div>
                    <div class="text-caption text-grey-darken-1 text-truncate" :title="doc.noDocumento">
                      No: {{ doc.noDocumento }}
                    </div>
                  </div>
                </div>

                <v-menu location="bottom end">
                  <template #activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" />
                  </template>
                  <v-list density="compact">
                    <v-list-item prepend-icon="mdi-eye" title="Previsualizar" @click="previewDoc(doc)" />
                    <v-list-item prepend-icon="mdi-download" title="Descargar" @click="downloadDoc(doc)" />
                    <v-divider />
                    <v-list-item prepend-icon="mdi-delete" title="Eliminar" color="error" @click="confirmDelete(doc)" />
                  </v-list>
                </v-menu>
              </div>

              <v-card-text class="pa-3 flex-grow-1">
                <div class="text-caption mb-1">
                  <v-icon size="14" class="mr-1 text-grey-darken-1">mdi-account</v-icon>
                  <strong>Emisor:</strong> {{ doc.emisor || 'N/A' }}
                </div>
                <div class="text-caption mb-1">
                  <v-icon size="14" class="mr-1 text-grey-darken-1">mdi-calendar-export</v-icon>
                  <strong>Emisión:</strong> {{ formatDate(doc.fechaEmision) }}
                </div>
                <div class="text-caption mb-1">
                  <v-icon size="14" class="mr-1 text-grey-darken-1">mdi-calendar-clock</v-icon>
                  <strong>Vencimiento:</strong> {{ formatDate(doc.fechaVencimiento) }}
                </div>
                <v-divider class="my-2" />
                <div class="d-flex justify-space-between text-caption text-grey-darken-1">
                  <span>Reg: {{ formatDate(doc.fechaRegistro) }}</span>
                  <span>Por: {{ doc.usuarioRegistro || 'Sistema' }}</span>
                </div>
              </v-card-text>

              <v-card-actions class="pa-2 bg-grey-lighten-5 justify-space-between border-top">
                <v-btn
                  size="small"
                  variant="tonal"
                  color="orange-darken-4"
                  prepend-icon="mdi-eye-outline"
                  @click="previewDoc(doc)"
                >
                  Vista Rápida
                </v-btn>
                <v-btn
                  size="small"
                  variant="text"
                  color="info"
                  icon="mdi-download"
                  title="Descargar"
                  @click="downloadDoc(doc)"
                />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 justify-end bg-white">
        <v-btn variant="outlined" color="grey-darken-1" @click="close">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- MODAL DE PREVISUALIZACIÓN RÁPIDA -->
  <v-dialog v-model="previewDialog" max-width="900px" scrollable>
    <v-card class="rounded-lg overflow-hidden">
      <v-card-title class="bg-grey-darken-4 text-white pa-3 d-flex align-center justify-space-between">
        <div class="d-flex align-center text-truncate">
          <v-icon class="mr-2" color="orange-lighten-2">mdi-eye</v-icon>
          <span class="text-subtitle-1 font-weight-bold text-truncate">
            Previsualización: {{ selectedDoc?.nombreTipoDocumento }} - {{ selectedDoc?.noDocumento }}
          </span>
        </div>
        <div>
          <v-btn
            v-if="previewUrl"
            icon="mdi-open-in-new"
            variant="text"
            color="white"
            density="compact"
            class="mr-1"
            title="Abrir en ventana nueva"
            :href="previewUrl"
            target="_blank"
          />
          <v-btn icon="mdi-close" variant="text" color="white" density="compact" @click="previewDialog = false" />
        </div>
      </v-card-title>

      <v-card-text class="pa-0 bg-grey-darken-3 d-flex align-center justify-center" style="min-height: 500px; max-height: 80vh;">
        <div v-if="loadingPreview" class="text-white text-center pa-6">
          <v-progress-circular indeterminate color="orange-lighten-2" size="48" class="mb-3" />
          <div>Generando enlace seguro de previsualización...</div>
        </div>

        <template v-else-if="previewUrl">
          <!-- Si es imagen -->
          <img
            v-if="isImage(selectedDoc)"
            :src="previewUrl"
            class="max-preview-img pa-2"
            alt="Vista Previa"
          />
          <!-- Si es PDF u otro documento previsualizable -->
          <iframe
            v-else
            :src="previewUrl"
            class="w-100 h-100 border-0"
            style="min-height: 600px;"
          />
        </template>

        <div v-else class="text-white text-center pa-6">
          <v-icon size="48" color="warning" class="mb-2">mdi-alert-circle-outline</v-icon>
          <div>No se pudo generar la vista previa del documento.</div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN -->
  <v-dialog v-model="deleteDialog" max-width="450px">
    <v-card class="rounded-lg">
      <v-card-title class="bg-error text-white pa-4">Confirmar Eliminación</v-card-title>
      <v-card-text class="pa-4 text-body-1">
        ¿Está seguro que desea eliminar el documento <strong>{{ docToDelete?.noDocumento }}</strong>? Esta acción borrará el archivo de almacenamiento.
      </v-card-text>
      <v-card-actions class="pa-3 justify-end">
        <v-btn variant="outlined" color="grey" @click="deleteDialog = false">Cancelar</v-btn>
        <v-btn color="error" :loading="deleting" @click="deleteDoc">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from 'vue'
import { useSnackbar } from '@/composables/use-snackbar.js'
import RequestHttp from '@/services/requestHttp'

export default {
  name: 'VerDocumentosExpedienteDialog',
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
  emits: ['close', 'open-upload', 'doc-deleted'],
  setup(props, { emit }) {
    const { snackbar } = useSnackbar()
    const requestHttp = new RequestHttp()
    const loading = ref(false)
    const documentos = ref([])

    const previewDialog = ref(false)
    const loadingPreview = ref(false)
    const previewUrl = ref('')
    const selectedDoc = ref(null)

    const deleteDialog = ref(false)
    const deleting = ref(false)
    const docToDelete = ref(null)

    const loadDocumentos = async () => {
      if (!props.expediente?.idExpedienteImportacion) return
      loading.value = true
      try {
        const res = await requestHttp.getDocumentosPorExpediente(props.expediente.idExpedienteImportacion)
        if (res.code === 200 && Array.isArray(res.data)) {
          documentos.value = res.data
        } else {
          documentos.value = []
        }
      } catch (err) {
        console.error(err)
        documentos.value = []
      } finally {
        loading.value = false
      }
    }

    watch(() => props.show, (newVal) => {
      if (newVal) {
        loadDocumentos()
      }
    })

    const close = () => {
      emit('close')
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A'
      return dateStr.split('T')[0]
    }

    const getFileIcon = (doc) => {
      const key = (doc.objectKey || doc.noDocumento || '').toLowerCase()
      if (key.endsWith('.pdf')) return 'mdi-file-pdf-box'
      if (key.endsWith('.png') || key.endsWith('.jpg') || key.endsWith('.jpeg') || key.endsWith('.webp')) return 'mdi-file-image'
      if (key.endsWith('.xls') || key.endsWith('.xlsx')) return 'mdi-file-excel'
      if (key.endsWith('.doc') || key.endsWith('.docx')) return 'mdi-file-word'
      return 'mdi-file-document-outline'
    }

    const getFileColor = (doc) => {
      const key = (doc.objectKey || doc.noDocumento || '').toLowerCase()
      if (key.endsWith('.pdf')) return 'red-darken-1'
      if (key.endsWith('.png') || key.endsWith('.jpg') || key.endsWith('.jpeg') || key.endsWith('.webp')) return 'indigo'
      if (key.endsWith('.xls') || key.endsWith('.xlsx')) return 'green-darken-2'
      if (key.endsWith('.doc') || key.endsWith('.docx')) return 'blue-darken-2'
      return 'orange-darken-3'
    }

    const isImage = (doc) => {
      if (!doc) return false
      const key = (doc.objectKey || doc.noDocumento || '').toLowerCase()
      return key.endsWith('.png') || key.endsWith('.jpg') || key.endsWith('.jpeg') || key.endsWith('.webp')
    }

    const previewDoc = async (doc) => {
      selectedDoc.value = doc
      previewDialog.value = true
      loadingPreview.value = true
      previewUrl.value = ''
      try {
        const res = await requestHttp.getUrlFirmadaDocumento(doc.idDocumentoImportacion, 3600)
        if (res.code === 200 && res.data?.urlAcceso) {
          previewUrl.value = res.data.urlAcceso
        } else {
          snackbar.value = { show: true, text: 'No se pudo generar la URL firmada del documento', color: 'error' }
        }
      } catch (err) {
        snackbar.value = { show: true, text: 'Error al obtener la vista previa', color: 'error' }
      } finally {
        loadingPreview.value = false
      }
    }

    const downloadDoc = async (doc) => {
      try {
        const res = await requestHttp.getUrlFirmadaDocumento(doc.idDocumentoImportacion, 600)
        if (res.code === 200 && res.data?.urlAcceso) {
          const a = document.createElement('a')
          a.href = res.data.urlAcceso
          a.download = doc.noDocumento || 'documento'
          a.target = '_blank'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        } else {
          snackbar.value = { show: true, text: 'Error al solicitar el enlace de descarga', color: 'error' }
        }
      } catch (err) {
        snackbar.value = { show: true, text: 'Error al procesar descarga', color: 'error' }
      }
    }

    const confirmDelete = (doc) => {
      docToDelete.value = doc
      deleteDialog.value = true
    }

    const deleteDoc = async () => {
      if (!docToDelete.value) return
      deleting.value = true
      try {
        const res = await requestHttp.deleteDocumentoImportacion(docToDelete.value.idDocumentoImportacion)
        if (res.code === 200) {
          snackbar.value = { show: true, text: 'Documento eliminado exitosamente', color: 'success' }
          deleteDialog.value = false
          loadDocumentos()
          emit('doc-deleted')
        } else {
          snackbar.value = { show: true, text: res.data?.mensaje || 'Error al eliminar el documento', color: 'error' }
        }
      } catch (err) {
        snackbar.value = { show: true, text: 'Error al comunicarse con el servidor', color: 'error' }
      } finally {
        deleting.value = false
      }
    }

    return {
      loading,
      documentos,
      previewDialog,
      loadingPreview,
      previewUrl,
      selectedDoc,
      deleteDialog,
      deleting,
      docToDelete,
      close,
      formatDate,
      getFileIcon,
      getFileColor,
      isImage,
      previewDoc,
      downloadDoc,
      confirmDelete,
      deleteDoc
    }
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #e65100 0%, #ef6c00 100%);
}
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
}
.border-bottom {
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
.border-top {
  border-top: 1px solid rgba(0,0,0,0.08);
}
.max-preview-img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
}
</style>
