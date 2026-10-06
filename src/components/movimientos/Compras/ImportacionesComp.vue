<template>
  <v-container fluid class="pa-4 bg-grey-lighten-4 min-vh-100">
    <!-- VISTA 1: LISTADO Y FILTROS -->
    <div v-if="currentView === 'list'">
      <!-- PANEL CABECERA COMPACTO CON ACCESOS RÁPIDOS INTEGRADOS -->
      <v-card class="elevation-2 rounded-lg mb-3 bg-gradient text-white">
        <div class="px-3 py-2 d-flex flex-wrap align-center justify-space-between gap-2">
          <!-- TÍTULO E ÍCONO -->
          <div class="d-flex align-center">
            <v-avatar color="white" size="32" class="mr-2 elevation-1">
              <v-icon size="18" color="orange-darken-4">mdi-ship-wheel</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold" style="line-height: 1.2;">Gestión de Expedientes de Importación</div>
              <div class="text-caption opacity-80 d-none d-md-block" style="font-size: 0.75rem;">Control de expedientes logísticos, embarques y aduanas</div>
            </div>
          </div>

          <!-- ACCIONES CABECERA + POPUP FLOTANTE HORIZONTAL DE ENLACES -->
          <div class="d-flex align-center flex-wrap gap-2">
            <!-- BOTÓN / POPUP FLOTANTE DE ENLACES RÁPIDOS -->
            <v-menu
              v-model="showEnlacesMenu"
              location="bottom end"
              offset="6"
              open-on-hover
              transition="slide-y-transition"
              :close-on-content-click="false"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="white"
                  variant="tonal"
                  size="small"
                  rounded="pill"
                  class="text-none font-weight-bold px-3"
                  prepend-icon="mdi-link-variant"
                  append-icon="mdi-chevron-down"
                >
                  Enlaces Rápidos
                  <v-chip
                    size="x-small"
                    color="white"
                    class="ml-1 text-orange-darken-4 font-weight-bold px-1"
                    style="height: 17px; min-width: 17px;"
                  >
                    {{ enlacesVisibles.length }}
                  </v-chip>
                </v-btn>
              </template>

              <!-- CONTENIDO POPUP FLOTANTE HORIZONTAL -->
              <v-card class="elevation-4 rounded-xl pa-2 bg-white border" min-width="320px" max-width="95vw">
                <div class="d-flex align-center justify-space-between px-2 pb-1 border-b mb-1">
                  <div class="d-flex align-center">
                    <v-icon color="orange-darken-4" size="16" class="mr-1">mdi-link-variant</v-icon>
                    <span class="text-caption font-weight-bold text-grey-darken-3 text-uppercase">Accesos Rápidos Logísticos</span>
                  </div>
                  <v-btn
                    variant="text"
                    density="compact"
                    size="x-small"
                    color="grey-darken-1"
                    prepend-icon="mdi-cog-outline"
                    class="text-none"
                    @click="abrirModalEnlaces(); showEnlacesMenu = false"
                  >
                    Gestionar ({{ enlaces.length }})
                  </v-btn>
                </div>

                <!-- DESPLIEGUE HORIZONTAL DE LOS ENLACES (MÁXIMO 4 + 5TO BOTÓN PLUS) -->
                <div class="d-flex align-center flex-wrap gap-2 px-1 py-1">
                  <template v-for="link in enlacesVisibles" :key="link.id">
                    <v-btn
                      size="small"
                      variant="tonal"
                      :color="link.color || 'orange-darken-4'"
                      class="text-none font-weight-bold elevation-0"
                      rounded="lg"
                      :prepend-icon="link.icono || 'mdi-open-in-new'"
                      @click="abrirEnlace(link.url)"
                    >
                      {{ link.titulo }}
                      <v-icon size="12" class="ml-1 opacity-70">mdi-open-in-new</v-icon>
                      <v-tooltip activator="parent" location="top">
                        {{ link.url }}
                      </v-tooltip>
                    </v-btn>
                  </template>

                  <!-- 5to Elemento: Botón Plus para Agregar / Gestionar -->
                  <v-btn
                    size="small"
                    variant="outlined"
                    color="orange-darken-4"
                    class="text-none font-weight-bold border-dashed"
                    rounded="lg"
                    prepend-icon="mdi-plus"
                    @click="abrirModalEnlaces(); showEnlacesMenu = false"
                  >
                    {{ enlacesVisibles.length === 0 ? 'Agregar Enlace' : 'Añadir Más' }}
                  </v-btn>
                </div>
              </v-card>
            </v-menu>

            <!-- BOTÓN NUEVO EXPEDIENTE -->
            <v-btn
              color="white"
              variant="elevated"
              size="small"
              class="text-orange-darken-4 font-weight-bold"
              prepend-icon="mdi-plus"
              @click="openNewExpediente"
            >
              Nuevo Expediente
            </v-btn>

            <!-- BOTÓN REFRESCAR -->
            <v-btn
              color="white"
              variant="outlined"
              size="small"
              icon="mdi-refresh"
              density="compact"
              title="Refrescar datos"
              @click="fetchExpedientes"
            />
          </div>
        </div>
      </v-card>

      <!-- FILTROS Y BÚSQUEDA -->
      <v-card class="elevation-1 rounded-lg mb-3 pa-3 bg-white">
        <!-- BARRA DE BÚSQUEDA GLOBAL -->
        <v-row dense class="align-center mb-3">
          <v-col cols="12" md="6" lg="7">
            <v-text-field
              v-model="search"
              label="Buscar expediente (No. Expediente, BL, DUCA, Proveedor...)"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-end flex-wrap gap-2">
            <span class="text-caption font-weight-bold text-grey-darken-2 mr-2">Filtros Rápidos:</span>
            <v-chip-group v-model="selectedQuickFilter" mandatory color="orange-darken-4" @update:model-value="onQuickFilterChange">
              <v-chip value="all" filter variant="outlined" size="small">Todos</v-chip>
              <v-chip value="etd-mes" filter variant="outlined" size="small" prepend-icon="mdi-calendar-export">Sale este mes</v-chip>
              <v-chip value="etd-semana" filter variant="outlined" size="small" prepend-icon="mdi-calendar-week">Sale esta semana</v-chip>
              <v-chip value="eta-mes" filter variant="outlined" size="small" prepend-icon="mdi-calendar-import">Llega este mes</v-chip>
              <v-chip value="eta-semana" filter variant="outlined" size="small" prepend-icon="mdi-calendar-week-begin">Llega esta semana</v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <v-divider class="my-3" />

        <!-- FILTROS POR SELECTORES DE CATÁLOGO Y ACCIONES DE FILTRADO -->
        <v-row dense class="align-center">
          <v-col cols="12" sm="4" md="3">
            <v-autocomplete
              v-model="filtro.idProveedor"
              :items="proveedores"
              item-title="nombre"
              item-value="idProveedor"
              label="Filtrar por Proveedor"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              prepend-inner-icon="mdi-domain"
              color="orange-darken-4"
              @update:model-value="fetchExpedientes"
            />
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-autocomplete
              v-model="filtro.idNaviera"
              :items="navieras"
              item-title="nombre"
              item-value="idProveedor"
              label="Filtrar por Naviera"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              prepend-inner-icon="mdi-ferry"
              color="orange-darken-4"
              @update:model-value="fetchExpedientes"
            />
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-autocomplete
              v-model="filtro.idAgenciaAduanera"
              :items="agenciasAduaneras"
              item-title="nombre"
              item-value="idProveedor"
              label="Filtrar por Agencia Aduanera"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              prepend-inner-icon="mdi-office-building"
              color="orange-darken-4"
              @update:model-value="fetchExpedientes"
            />
          </v-col>
          <v-col cols="12" md="3" class="d-flex align-center justify-end flex-wrap gap-2">
            <v-btn
              :color="mostrarFiltrosAvanzados ? 'orange-darken-4' : 'grey-darken-2'"
              :variant="mostrarFiltrosAvanzados ? 'tonal' : 'outlined'"
              size="small"
              prepend-icon="mdi-calendar-range"
              class="text-none font-weight-bold"
              @click="mostrarFiltrosAvanzados = !mostrarFiltrosAvanzados"
            >
              {{ mostrarFiltrosAvanzados ? 'Ocultar Rango Fechas' : 'Rango de Fechas' }}
            </v-btn>
            <v-btn
              variant="text"
              color="red-darken-3"
              size="small"
              prepend-icon="mdi-filter-remove-outline"
              @click="resetFilters"
            >
              Limpiar Todo
            </v-btn>
          </v-col>
        </v-row>

        <!-- PANEL DESPLEGABLE: FILTRO AVANZADO POR RANGO DE FECHAS -->
        <v-expand-transition>
          <div v-if="mostrarFiltrosAvanzados" class="mt-3">
            <div class="pa-3 bg-orange-lighten-5 rounded-lg border border-orange-lighten-3">
              <div class="d-flex align-center justify-space-between flex-wrap mb-2">
                <div class="d-flex align-center">
                  <v-icon color="orange-darken-4" size="small" class="mr-2">mdi-calendar-clock</v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-orange-darken-4">
                    Filtro Avanzado por Rango de Fechas
                  </span>
                </div>
                <div class="d-flex align-center gap-1 flex-wrap">
                  <v-btn size="x-small" variant="text" color="orange-darken-4" class="font-weight-bold text-none" @click="setRangoMesActual">
                    Mes Actual
                  </v-btn>
                  <v-btn size="x-small" variant="text" color="orange-darken-4" class="font-weight-bold text-none" @click="setRangoMesAnterior">
                    Mes Anterior
                  </v-btn>
                  <v-btn size="x-small" variant="text" color="orange-darken-4" class="font-weight-bold text-none" @click="setRangoUltimos30Dias">
                    Últimos 30 días
                  </v-btn>
                  <v-btn size="x-small" variant="text" color="grey-darken-2" class="text-none" @click="limpiarSoloFechas">
                    Limpiar Fechas
                  </v-btn>
                </div>
              </div>

              <v-row dense class="align-center">
                <v-col cols="12" sm="4" md="3">
                  <v-select
                    v-model="filtroAvanzado.tipoFecha"
                    :items="opcionesTipoFecha"
                    item-title="title"
                    item-value="value"
                    label="Tipo de Fecha a Filtrar"
                    density="compact"
                    variant="outlined"
                    hide-details
                    bg-color="white"
                    color="orange-darken-4"
                    prepend-inner-icon="mdi-calendar-sync"
                    @update:model-value="aplicarFiltroFechas"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="3">
                  <v-text-field
                    v-model="filtroAvanzado.fechaDesde"
                    label="Fecha Desde"
                    type="date"
                    density="compact"
                    variant="outlined"
                    hide-details
                    bg-color="white"
                    color="orange-darken-4"
                    prepend-inner-icon="mdi-calendar-start"
                    @change="aplicarFiltroFechas"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="3">
                  <v-text-field
                    v-model="filtroAvanzado.fechaHasta"
                    label="Fecha Hasta"
                    type="date"
                    density="compact"
                    variant="outlined"
                    hide-details
                    bg-color="white"
                    color="orange-darken-4"
                    prepend-inner-icon="mdi-calendar-end"
                    @change="aplicarFiltroFechas"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="3" class="d-flex align-center justify-end">
                  <v-btn
                    color="orange-darken-4"
                    variant="elevated"
                    density="comfortable"
                    class="rounded text-none font-weight-bold"
                    prepend-icon="mdi-filter"
                    @click="aplicarFiltroFechas"
                  >
                    Aplicar Rango
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-expand-transition>
      </v-card>

      <!-- TABLA DE EXPEDIENTES -->
      <v-card class="elevation-2 rounded-lg overflow-hidden">
        <v-data-table
          :headers="headers"
          :items="expedientes"
          :search="search"
          :loading="loading"
          hover
          class="elevation-0"
          no-data-text="No se encontraron expedientes de importación."
          loading-text="Cargando expedientes..."
        >
          <!-- No. Expediente + badge -->
          <template #item.noExpediente="{ item }">
            <div class="d-flex align-center">
              <v-icon color="orange-darken-4" class="mr-2">mdi-folder</v-icon>
              <div>
                <span class="font-weight-bold text-primary cursor-pointer" @click="editExpediente(item)">
                  {{ item.noExpediente }}
                </span>
                <div v-if="item.incoterm" class="text-caption text-grey-darken-1">
                  Incoterm: {{ item.incoterm }}
                </div>
              </div>
            </div>
          </template>

          <!-- Proveedor -->
          <template #item.nombreProveedor="{ item }">
            <div class="text-body-2 font-weight-medium">{{ item.nombreProveedor || 'N/A' }}</div>
          </template>

          <!-- BL y Naviera -->
          <template #item.numeroBL="{ item }">
            <div class="text-caption">
              <div><strong>BL:</strong> {{ item.numeroBL || 'Sin BL' }}</div>
              <div class="text-grey-darken-1"><strong>Naviera:</strong> {{ item.nombreNaviera || 'N/A' }}</div>
            </div>
          </template>

          <!-- Fechas ETD y ETA -->
          <template #item.etd="{ item }">
            <div class="text-caption">
              <div><v-icon size="14" color="indigo" class="mr-1">mdi-calendar-export</v-icon> <strong>ETD:</strong> {{ formatDate(item.etd) }}</div>
              <div><v-icon size="14" color="teal" class="mr-1">mdi-calendar-import</v-icon> <strong>ETA:</strong> {{ formatDate(item.eta) }}</div>
            </div>
          </template>

          <!-- DUCA y Agencia Aduanera -->
          <template #item.noDUCA="{ item }">
            <div class="text-caption">
              <div><strong>DUCA:</strong> {{ item.noDUCA || 'N/A' }}</div>
              <div class="text-grey-darken-1">{{ item.nombreAgenciaAduanera || '' }}</div>
            </div>
          </template>

          <!-- Total Documentos Badge -->
          <template #item.totalDocumentos="{ item }">
            <v-chip
              size="small"
              :color="item.totalDocumentos > 0 ? 'orange-darken-4' : 'grey'"
              class="font-weight-bold cursor-pointer"
              @click="openVerDocumentos(item)"
            >
              <v-icon start size="14">mdi-paperclip</v-icon>
              {{ item.totalDocumentos || 0 }} Doc(s)
            </v-chip>
          </template>

          <!-- Acciones -->
          <template #item.acciones="{ item }">
            <div class="d-flex align-center gap-1">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="orange-darken-4"
                size="small"
                title="Editar Expediente"
                @click="editExpediente(item)"
              />
              <v-btn
                icon="mdi-paperclip-plus"
                variant="text"
                color="success"
                size="small"
                title="Adjuntar Documento"
                @click="openSubirDocumento(item)"
              />
              <v-btn
                icon="mdi-folder-eye"
                variant="text"
                color="info"
                size="small"
                title="Ver Documentos"
                @click="openVerDocumentos(item)"
              />
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                color="error"
                size="small"
                title="Eliminar Expediente"
                @click="confirmDeleteExpediente(item)"
              />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- VISTA 2: FORMULARIO CARD COMPLETO EN ESTILO EXPEDIENTE -->
    <div v-else-if="currentView === 'form'">
      <ExpedienteFormCard
        :expediente-data="selectedExpediente"
        :proveedores="proveedores"
        :navieras="navieras"
        :agencias-aduaneras="agenciasAduaneras"
        @saved="onExpedienteSaved"
        @cancel="currentView = 'list'"
      />
    </div>

    <!-- DIÁLOGO SUBIR DOCUMENTO -->
    <SubirDocumentoDialog
      :show="showSubirDialog"
      :expediente="selectedExpediente"
      @close="showSubirDialog = false"
      @uploaded="onDocumentUploaded"
    />

    <!-- DIÁLOGO VER DOCUMENTOS (CARDS GRID) -->
    <VerDocumentosExpedienteDialog
      :show="showVerDocsDialog"
      :expediente="selectedExpediente"
      @close="showVerDocsDialog = false"
      @open-upload="showVerDocsDialog = false; showSubirDialog = true"
      @doc-deleted="fetchExpedientes"
    />

    <!-- DIÁLOGO ELIMINAR EXPEDIENTE -->
    <v-dialog v-model="showDeleteExpDialog" max-width="450px">
      <v-card class="rounded-lg">
        <v-card-title class="bg-error text-white pa-4">Eliminar Expediente</v-card-title>
        <v-card-text class="pa-4">
          ¿Está seguro que desea eliminar el expediente <strong>{{ expedienteToDelete?.noExpediente }}</strong>?
        </v-card-text>
        <v-card-actions class="pa-3 justify-end">
          <v-btn variant="outlined" color="grey" @click="showDeleteExpDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deletingExp" @click="deleteExpediente">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO GESTIÓN DE ENLACES DE UTILIDAD -->
    <v-dialog v-model="showEnlacesDialog" max-width="700px" scrollable>
      <v-card class="rounded-lg">
        <v-card-title class="bg-gradient text-white pa-4 d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon color="white" class="mr-2">mdi-bookmark-multiple</v-icon>
            <div>
              <div class="text-h6 font-weight-bold">Enlaces de Utilidad</div>
              <div class="text-caption opacity-90">Accesos directos guardados en tu navegador (Local Storage)</div>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" color="white" density="compact" @click="showEnlacesDialog = false" />
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- Formulario Agregar / Editar Enlace -->
          <v-card variant="outlined" class="pa-3 mb-4 rounded-lg bg-grey-lighten-5 border-orange-lighten-4">
            <div class="text-subtitle-2 font-weight-bold text-orange-darken-4 mb-2 d-flex align-center">
              <v-icon size="small" class="mr-1">{{ modoEdicion ? 'mdi-pencil' : 'mdi-plus-circle-outline' }}</v-icon>
              {{ modoEdicion ? 'Editar Enlace de Utilidad' : 'Agregar Nuevo Enlace de Utilidad' }}
            </div>

            <v-form ref="enlaceFormRef" @submit.prevent="guardarEnlace">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="enlaceForm.titulo"
                    label="Título / Nombre del Enlace *"
                    placeholder="Ej: Aduanas Honduras, Tracking..."
                    density="compact"
                    variant="outlined"
                    :rules="[v => !!v || 'El título es requerido']"
                    hide-details="auto"
                    color="orange-darken-4"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="enlaceForm.url"
                    label="Dirección URL *"
                    placeholder="https://..."
                    density="compact"
                    variant="outlined"
                    :rules="[v => !!v || 'La URL es requerida', v => validarUrl(v) || 'Ingrese una URL válida']"
                    hide-details="auto"
                    color="orange-darken-4"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="enlaceForm.icono"
                    :items="catalogoIconos"
                    item-title="title"
                    item-value="value"
                    label="Ícono"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="orange-darken-4"
                  >
                    <template #selection="{ item }">
                      <v-icon size="18" class="mr-2" color="orange-darken-4">{{ item.raw.value }}</v-icon>
                      <span>{{ item.raw.title }}</span>
                    </template>
                    <template #item="{ item, props }">
                      <v-list-item v-bind="props" :title="item.raw.title">
                        <template #prepend>
                          <v-icon class="mr-2" color="orange-darken-4">{{ item.raw.value }}</v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="enlaceForm.color"
                    :items="catalogoColores"
                    item-title="title"
                    item-value="value"
                    label="Color del Botón"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="orange-darken-4"
                  >
                    <template #selection="{ item }">
                      <v-chip size="x-small" :color="item.raw.value" variant="flat" class="mr-2"></v-chip>
                      <span>{{ item.raw.title }}</span>
                    </template>
                    <template #item="{ item, props }">
                      <v-list-item v-bind="props" :title="item.raw.title">
                        <template #prepend>
                          <v-chip size="x-small" :color="item.raw.value" variant="flat" class="mr-2"></v-chip>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" class="d-flex align-center justify-space-between flex-wrap gap-2 pt-2">
                  <v-switch
                    v-model="enlaceForm.mostrar"
                    color="orange-darken-4"
                    density="compact"
                    hide-details
                    :disabled="!enlaceForm.mostrar && cantidadEnlacesActivos >= 4"
                  >
                    <template #label>
                      <span class="text-caption">
                        Mostrar en la barra de accesos rápidos
                        <span v-if="!enlaceForm.mostrar && cantidadEnlacesActivos >= 4" class="text-orange-darken-3 font-weight-bold ml-1">
                          (Límite de 4 alcanzado)
                        </span>
                      </span>
                    </template>
                  </v-switch>

                  <div class="d-flex gap-2">
                    <v-btn
                      v-if="modoEdicion"
                      variant="text"
                      size="small"
                      color="grey-darken-2"
                      @click="cancelarEdicion"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      type="submit"
                      color="orange-darken-4"
                      size="small"
                      :prepend-icon="modoEdicion ? 'mdi-check' : 'mdi-plus'"
                    >
                      {{ modoEdicion ? 'Guardar Cambios' : 'Agregar Enlace' }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-card>

          <!-- Listado de Enlaces Guardados -->
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
              Enlaces Guardados ({{ enlaces.length }})
            </div>
            <v-chip size="small" :color="cantidadEnlacesActivos === 4 ? 'success' : 'orange-darken-4'" variant="tonal">
              <v-icon start size="14">mdi-checkbox-marked-circle-outline</v-icon>
              {{ cantidadEnlacesActivos }} de 4 seleccionados para la barra
            </v-chip>
          </div>

          <v-alert
            v-if="enlaces.length === 0"
            type="info"
            variant="tonal"
            density="compact"
            class="text-caption"
          >
            No tienes enlaces de utilidad registrados. Agrega uno nuevo con el formulario superior.
          </v-alert>

          <v-list v-else density="compact" class="bg-transparent pa-0">
            <v-card
              v-for="item in enlaces"
              :key="item.id"
              class="mb-2 rounded-lg border"
              variant="flat"
            >
              <v-list-item class="pa-2">
                <template #prepend>
                  <v-avatar :color="item.color || 'blue-grey'" size="36" class="text-white mr-3">
                    <v-icon size="20">{{ item.icono || 'mdi-link' }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold text-body-2 d-flex align-center">
                  {{ item.titulo }}
                  <v-chip
                    v-if="item.mostrar"
                    size="x-small"
                    color="success"
                    variant="flat"
                    class="ml-2 font-weight-bold"
                  >
                    En Barra
                  </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption text-grey-darken-1 text-truncate" style="max-width: 320px;">
                  {{ item.url }}
                </v-list-item-subtitle>

                <template #append>
                  <div class="d-flex align-center gap-1">
                    <v-btn
                      icon="mdi-open-in-new"
                      size="x-small"
                      variant="text"
                      color="primary"
                      title="Probar enlace"
                      @click="abrirEnlace(item.url)"
                    />
                    <v-switch
                      :model-value="item.mostrar"
                      color="orange-darken-4"
                      density="compact"
                      hide-details
                      title="Mostrar / Ocultar en la barra rápida"
                      @update:model-value="toggleMostrarEnlace(item)"
                    />
                    <v-btn
                      icon="mdi-pencil"
                      size="x-small"
                      variant="text"
                      color="grey-darken-2"
                      title="Editar enlace"
                      @click="iniciarEdicion(item)"
                    />
                    <v-btn
                      icon="mdi-delete"
                      size="x-small"
                      variant="text"
                      color="red-darken-2"
                      title="Eliminar enlace"
                      @click="eliminarEnlace(item.id)"
                    />
                  </div>
                </template>
              </v-list-item>
            </v-card>
          </v-list>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3 justify-space-between">
          <v-btn
            variant="text"
            color="grey-darken-1"
            size="small"
            prepend-icon="mdi-restore"
            @click="restablecerPorDefecto"
          >
            Restablecer Predeterminados
          </v-btn>
          <v-btn
            color="orange-darken-4"
            variant="elevated"
            @click="showEnlacesDialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import { useSnackbar } from '@/composables/use-snackbar.js'
import RequestHttp from '@/services/requestHttp'
import ExpedienteFormCard from './dialogsCompras/ExpedienteFormCard.vue'
import SubirDocumentoDialog from './dialogsCompras/SubirDocumentoDialog.vue'
import VerDocumentosExpedienteDialog from './dialogsCompras/VerDocumentosExpedienteDialog.vue'

export default {
  name: 'ImportacionesComp',
  components: {
    ExpedienteFormCard,
    SubirDocumentoDialog,
    VerDocumentosExpedienteDialog
  },
  setup() {
    const { snackbar } = useSnackbar()
    const requestHttp = new RequestHttp()

    const currentView = ref('list') // 'list' | 'form'
    const loading = ref(false)
    const search = ref('')
    const selectedQuickFilter = ref('all')

    const expedientes = ref([])
    const proveedores = ref([])
    const navieras = ref([])
    const agenciasAduaneras = ref([])

    const selectedExpediente = ref(null)
    const showSubirDialog = ref(false)
    const showVerDocsDialog = ref(false)

    const showDeleteExpDialog = ref(false)
    const deletingExp = ref(false)
    const expedienteToDelete = ref(null)

    const filtro = reactive({
      idProveedor: null,
      idNaviera: null,
      idAgenciaAduanera: null,
      etaDesde: null,
      etaHasta: null,
      etdDesde: null,
      etdHasta: null
    })

    const headers = [
      { title: 'No. Expediente', key: 'noExpediente', align: 'start' },
      { title: 'Proveedor', key: 'nombreProveedor', align: 'start' },
      { title: 'Embarque / Naviera', key: 'numeroBL', align: 'start' },
      { title: 'Fechas (ETD / ETA)', key: 'etd', align: 'start' },
      { title: 'DUCA / Aduana', key: 'noDUCA', align: 'start' },
      { title: 'Documentos', key: 'totalDocumentos', align: 'center' },
      { title: 'Acciones', key: 'acciones', align: 'center', sortable: false }
    ]

    const loadProveedores = async () => {
      try {
        const [resProv, resNav, resAg] = await Promise.all([
          requestHttp.getProveedores({ tipo: 'Proveedor' }),
          requestHttp.getProveedores({ tipo: 'Naviera' }),
          requestHttp.getProveedores({ tipo: 'Agencia' })
        ])

        proveedores.value = Array.isArray(resProv) ? resProv : (resProv?.data && Array.isArray(resProv.data) ? resProv.data : [])
        navieras.value = Array.isArray(resNav) ? resNav : (resNav?.data && Array.isArray(resNav.data) ? resNav.data : [])
        agenciasAduaneras.value = Array.isArray(resAg) ? resAg : (resAg?.data && Array.isArray(resAg.data) ? resAg.data : [])
      } catch (err) {
        console.error(err)
      }
    }

    const fetchExpedientes = async () => {
      loading.value = true
      try {
        const params = {}
        if (filtro.idProveedor) params.idProveedor = filtro.idProveedor
        if (filtro.idNaviera) params.idNaviera = filtro.idNaviera
        if (filtro.idAgenciaAduanera) params.idAgenciaAduanera = filtro.idAgenciaAduanera
        if (filtro.etaDesde) params.etaDesde = filtro.etaDesde
        if (filtro.etaHasta) params.etaHasta = filtro.etaHasta
        if (filtro.etdDesde) params.etdDesde = filtro.etdDesde
        if (filtro.etdHasta) params.etdHasta = filtro.etdHasta

        const res = await requestHttp.getExpedientesImportacion(params)
        if (res.code === 200 && Array.isArray(res.data)) {
          expedientes.value = res.data
        } else {
          expedientes.value = []
        }
      } catch (err) {
        console.error(err)
        expedientes.value = []
      } finally {
        loading.value = false
      }
    }

    const mostrarFiltrosAvanzados = ref(false)
    const opcionesTipoFecha = [
      { title: 'Fecha de Llegada (ETA)', value: 'eta' },
      { title: 'Fecha de Salida (ETD)', value: 'etd' }
    ]

    const filtroAvanzado = reactive({
      tipoFecha: 'eta',
      fechaDesde: '',
      fechaHasta: ''
    })

    const aplicarFiltroFechas = () => {
      filtro.etaDesde = null
      filtro.etaHasta = null
      filtro.etdDesde = null
      filtro.etdHasta = null

      if (filtroAvanzado.fechaDesde || filtroAvanzado.fechaHasta) {
        selectedQuickFilter.value = 'custom'
        if (filtroAvanzado.tipoFecha === 'eta') {
          if (filtroAvanzado.fechaDesde) filtro.etaDesde = filtroAvanzado.fechaDesde
          if (filtroAvanzado.fechaHasta) filtro.etaHasta = filtroAvanzado.fechaHasta
        } else {
          if (filtroAvanzado.fechaDesde) filtro.etdDesde = filtroAvanzado.fechaDesde
          if (filtroAvanzado.fechaHasta) filtro.etdHasta = filtroAvanzado.fechaHasta
        }
      }

      fetchExpedientes()
    }

    const setRangoMesActual = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()
      const firstDay = new Date(year, month, 1).toISOString().split('T')[0]
      const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0]
      filtroAvanzado.fechaDesde = firstDay
      filtroAvanzado.fechaHasta = lastDay
      aplicarFiltroFechas()
    }

    const setRangoMesAnterior = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()
      const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0]
      const lastDay = new Date(year, month, 0).toISOString().split('T')[0]
      filtroAvanzado.fechaDesde = firstDay
      filtroAvanzado.fechaHasta = lastDay
      aplicarFiltroFechas()
    }

    const setRangoUltimos30Dias = () => {
      const now = new Date()
      const end = now.toISOString().split('T')[0]
      const past = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0]
      filtroAvanzado.fechaDesde = past
      filtroAvanzado.fechaHasta = end
      aplicarFiltroFechas()
    }

    const limpiarSoloFechas = () => {
      filtroAvanzado.fechaDesde = ''
      filtroAvanzado.fechaHasta = ''
      filtro.etaDesde = null
      filtro.etaHasta = null
      filtro.etdDesde = null
      filtro.etdHasta = null
      selectedQuickFilter.value = 'all'
      fetchExpedientes()
    }

    const onQuickFilterChange = (val) => {
      filtro.etaDesde = null
      filtro.etaHasta = null
      filtro.etdDesde = null
      filtro.etdHasta = null

      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()

      if (val === 'etd-mes') {
        const firstDay = new Date(year, month, 1).toISOString().split('T')[0]
        const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0]
        filtro.etdDesde = firstDay
        filtro.etdHasta = lastDay
        filtroAvanzado.tipoFecha = 'etd'
        filtroAvanzado.fechaDesde = firstDay
        filtroAvanzado.fechaHasta = lastDay
      } else if (val === 'etd-semana') {
        const curr = new Date()
        const first = curr.getDate() - curr.getDay()
        const last = first + 6
        const firstDay = new Date(curr.setDate(first)).toISOString().split('T')[0]
        const lastDay = new Date(curr.setDate(last)).toISOString().split('T')[0]
        filtro.etdDesde = firstDay
        filtro.etdHasta = lastDay
        filtroAvanzado.tipoFecha = 'etd'
        filtroAvanzado.fechaDesde = firstDay
        filtroAvanzado.fechaHasta = lastDay
      } else if (val === 'eta-mes') {
        const firstDay = new Date(year, month, 1).toISOString().split('T')[0]
        const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0]
        filtro.etaDesde = firstDay
        filtro.etaHasta = lastDay
        filtroAvanzado.tipoFecha = 'eta'
        filtroAvanzado.fechaDesde = firstDay
        filtroAvanzado.fechaHasta = lastDay
      } else if (val === 'eta-semana') {
        const curr = new Date()
        const first = curr.getDate() - curr.getDay()
        const last = first + 6
        const firstDay = new Date(curr.setDate(first)).toISOString().split('T')[0]
        const lastDay = new Date(curr.setDate(last)).toISOString().split('T')[0]
        filtro.etaDesde = firstDay
        filtro.etaHasta = lastDay
        filtroAvanzado.tipoFecha = 'eta'
        filtroAvanzado.fechaDesde = firstDay
        filtroAvanzado.fechaHasta = lastDay
      } else if (val === 'all') {
        filtroAvanzado.fechaDesde = ''
        filtroAvanzado.fechaHasta = ''
      }

      fetchExpedientes()
    }

    const resetFilters = () => {
      search.value = ''
      selectedQuickFilter.value = 'all'
      filtro.idProveedor = null
      filtro.idNaviera = null
      filtro.idAgenciaAduanera = null
      filtro.etaDesde = null
      filtro.etaHasta = null
      filtro.etdDesde = null
      filtro.etdHasta = null
      filtroAvanzado.tipoFecha = 'eta'
      filtroAvanzado.fechaDesde = ''
      filtroAvanzado.fechaHasta = ''
      fetchExpedientes()
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A'
      return dateStr.split('T')[0]
    }

    const openNewExpediente = () => {
      selectedExpediente.value = null
      currentView.value = 'form'
    }

    const editExpediente = (item) => {
      selectedExpediente.value = { ...item }
      currentView.value = 'form'
    }

    const onExpedienteSaved = () => {
      currentView.value = 'list'
      fetchExpedientes()
    }

    const openSubirDocumento = (item) => {
      selectedExpediente.value = item
      showSubirDialog.value = true
    }

    const onDocumentUploaded = () => {
      fetchExpedientes()
    }

    const openVerDocumentos = (item) => {
      selectedExpediente.value = item
      showVerDocsDialog.value = true
    }

    const confirmDeleteExpediente = (item) => {
      expedienteToDelete.value = item
      showDeleteExpDialog.value = true
    }

    const deleteExpediente = async () => {
      if (!expedienteToDelete.value) return
      deletingExp.value = true
      try {
        const res = await requestHttp.deleteExpedienteImportacion(expedienteToDelete.value.idExpedienteImportacion)
        if (res.code === 200) {
          snackbar.value = { show: true, text: 'Expediente eliminado exitosamente', color: 'success' }
          showDeleteExpDialog.value = false
          fetchExpedientes()
        } else {
          snackbar.value = { show: true, text: res.data?.mensaje || 'Error al eliminar expediente', color: 'error' }
        }
      } catch (err) {
        snackbar.value = { show: true, text: 'Error de comunicación con el servidor', color: 'error' }
      } finally {
        deletingExp.value = false
      }
    }

    // ===== GESTIÓN DE ENLACES DE UTILIDAD (LOCAL STORAGE) =====
    const STORAGE_KEY = 'importaciones_enlaces_utilidad_v2'

    const DEFAULT_ENLACES = [
      { id: '1', titulo: 'Maersk Bookings', url: 'https://www.maersk.com/bookings/', icono: 'mdi-ferry', color: 'light-blue-darken-3', mostrar: true },
      { id: '2', titulo: 'MSC Tracking', url: 'https://www.msc.com/en/track-a-shipment', icono: 'mdi-truck-cargo-container', color: 'amber-darken-4', mostrar: true },
      { id: '3', titulo: 'ONE Line Tracking', url: 'https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking', icono: 'mdi-radar', color: 'pink-darken-2', mostrar: true },
      { id: '4', titulo: 'CMA CGM Tracking', url: 'https://www.cma-cgm.com/ebusiness/tracking', icono: 'mdi-ship-wheel', color: 'blue-darken-3', mostrar: true }
    ]

    const catalogoIconos = [
      { title: 'Barco / Naviera', value: 'mdi-ferry' },
      { title: 'Contenedor / Carga', value: 'mdi-truck-cargo-container' },
      { title: 'Radar / Rastreo', value: 'mdi-radar' },
      { title: 'Timón / Barco', value: 'mdi-ship-wheel' },
      { title: 'Edificio / Aduana', value: 'mdi-office-building' },
      { title: 'Tierra / Global', value: 'mdi-earth' },
      { title: 'Web / Internet', value: 'mdi-web' },
      { title: 'Avión / Aéreo', value: 'mdi-airplane' },
      { title: 'Documento / Trámite', value: 'mdi-file-document-check' },
      { title: 'Código de Barra / BL', value: 'mdi-barcode-scan' },
      { title: 'Calculadora / Arancel', value: 'mdi-calculator' },
      { title: 'Banco / Pagos', value: 'mdi-bank' },
      { title: 'Almacén / Bodega', value: 'mdi-warehouse' },
      { title: 'Ancla', value: 'mdi-anchor' },
      { title: 'Enlace General', value: 'mdi-link-variant' }
    ]

    const catalogoColores = [
      { title: 'Azul Claro (Maersk)', value: 'light-blue-darken-3' },
      { title: 'Ámbar (MSC)', value: 'amber-darken-4' },
      { title: 'Magenta / Rosa (ONE)', value: 'pink-darken-2' },
      { title: 'Azul Marino (CMA CGM)', value: 'blue-darken-3' },
      { title: 'Naranja', value: 'orange-darken-4' },
      { title: 'Verde Azulado (Teal)', value: 'teal-darken-2' },
      { title: 'Índigo', value: 'indigo-darken-2' },
      { title: 'Púrpura', value: 'purple-darken-2' },
      { title: 'Rojo', value: 'red-darken-3' },
      { title: 'Gris Azulado', value: 'blue-grey-darken-2' }
    ]

    const enlaces = ref([])
    const showEnlacesMenu = ref(false)
    const showEnlacesDialog = ref(false)
    const modoEdicion = ref(false)
    const enlaceFormRef = ref(null)

    const enlaceForm = reactive({
      id: null,
      titulo: '',
      url: '',
      icono: 'mdi-link-variant',
      color: 'orange-darken-4',
      mostrar: true
    })

    const enlacesVisibles = computed(() => {
      return enlaces.value.filter(e => e.mostrar).slice(0, 4)
    })

    const cantidadEnlacesActivos = computed(() => {
      return enlaces.value.filter(e => e.mostrar).length
    })

    const cargarEnlacesStorage = () => {
      try {
        const data = localStorage.getItem(STORAGE_KEY)
        if (data) {
          const parsed = JSON.parse(data)
          if (Array.isArray(parsed) && parsed.length > 0) {
            enlaces.value = parsed
            return
          }
        }
      } catch (err) {
        console.error('Error cargando enlaces de localStorage:', err)
      }
      enlaces.value = JSON.parse(JSON.stringify(DEFAULT_ENLACES))
      guardarEnlacesStorage()
    }

    const guardarEnlacesStorage = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enlaces.value))
      } catch (err) {
        console.error('Error guardando enlaces en localStorage:', err)
      }
    }

    const abrirEnlace = (url) => {
      if (!url) return
      let finalUrl = url.trim()
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl
      }
      window.open(finalUrl, '_blank', 'noopener,noreferrer')
    }

    const abrirModalEnlaces = () => {
      cancelarEdicion()
      showEnlacesDialog.value = true
    }

    const iniciarEdicion = (item) => {
      modoEdicion.value = true
      enlaceForm.id = item.id
      enlaceForm.titulo = item.titulo
      enlaceForm.url = item.url
      enlaceForm.icono = item.icono || 'mdi-link-variant'
      enlaceForm.color = item.color || 'orange-darken-4'
      enlaceForm.mostrar = !!item.mostrar
    }

    const cancelarEdicion = () => {
      modoEdicion.value = false
      enlaceForm.id = null
      enlaceForm.titulo = ''
      enlaceForm.url = ''
      enlaceForm.icono = 'mdi-link-variant'
      enlaceForm.color = 'orange-darken-4'
      enlaceForm.mostrar = cantidadEnlacesActivos.value < 4
    }

    const validarUrl = (val) => {
      if (!val) return false
      return val.trim().length > 3
    }

    const guardarEnlace = () => {
      if (!enlaceForm.titulo || !enlaceForm.url) {
        snackbar.value = { show: true, text: 'Por favor complete título y URL', color: 'warning' }
        return
      }

      let finalUrl = enlaceForm.url.trim()
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl
      }

      if (modoEdicion.value && enlaceForm.id) {
        const idx = enlaces.value.findIndex(e => e.id === enlaceForm.id)
        if (idx !== -1) {
          if (!enlaces.value[idx].mostrar && enlaceForm.mostrar && cantidadEnlacesActivos.value >= 4) {
            snackbar.value = {
              show: true,
              text: 'Máximo 4 enlaces pueden mostrarse a la vez en la barra rápida. Desactive otro enlace primero.',
              color: 'warning'
            }
            return
          }
          enlaces.value[idx] = {
            ...enlaces.value[idx],
            titulo: enlaceForm.titulo.trim(),
            url: finalUrl,
            icono: enlaceForm.icono,
            color: enlaceForm.color,
            mostrar: enlaceForm.mostrar
          }
          snackbar.value = { show: true, text: 'Enlace actualizado correctamente', color: 'success' }
        }
      } else {
        if (enlaceForm.mostrar && cantidadEnlacesActivos.value >= 4) {
          enlaceForm.mostrar = false
          snackbar.value = {
            show: true,
            text: 'Enlace guardado, pero no se mostró en la barra porque ya hay 4 activos.',
            color: 'info'
          }
        } else {
          snackbar.value = { show: true, text: 'Enlace agregado correctamente', color: 'success' }
        }

        const nuevo = {
          id: Date.now().toString(),
          titulo: enlaceForm.titulo.trim(),
          url: finalUrl,
          icono: enlaceForm.icono,
          color: enlaceForm.color,
          mostrar: enlaceForm.mostrar
        }
        enlaces.value.push(nuevo)
      }

      guardarEnlacesStorage()
      cancelarEdicion()
    }

    const toggleMostrarEnlace = (item) => {
      if (!item.mostrar) {
        if (cantidadEnlacesActivos.value >= 4) {
          snackbar.value = {
            show: true,
            text: 'Solo se pueden mostrar hasta 4 enlaces en la barra rápida. Desactive otro primero.',
            color: 'warning'
          }
          return
        }
        item.mostrar = true
      } else {
        item.mostrar = false
      }
      guardarEnlacesStorage()
    }

    const eliminarEnlace = (id) => {
      enlaces.value = enlaces.value.filter(e => e.id !== id)
      guardarEnlacesStorage()
      if (modoEdicion.value && enlaceForm.id === id) {
        cancelarEdicion()
      }
      snackbar.value = { show: true, text: 'Enlace eliminado', color: 'info' }
    }

    const restablecerPorDefecto = () => {
      enlaces.value = JSON.parse(JSON.stringify(DEFAULT_ENLACES))
      guardarEnlacesStorage()
      cancelarEdicion()
      snackbar.value = { show: true, text: 'Enlaces restablecidos a los valores por defecto', color: 'success' }
    }

    onMounted(() => {
      cargarEnlacesStorage()
    })

    onActivated(() => {
      cargarEnlacesStorage()
      loadProveedores()
      fetchExpedientes()
    })

    return {
      currentView,
      loading,
      search,
      selectedQuickFilter,
      mostrarFiltrosAvanzados,
      opcionesTipoFecha,
      filtroAvanzado,
      aplicarFiltroFechas,
      setRangoMesActual,
      setRangoMesAnterior,
      setRangoUltimos30Dias,
      limpiarSoloFechas,
      expedientes,
      proveedores,
      navieras,
      agenciasAduaneras,
      selectedExpediente,
      showSubirDialog,
      showVerDocsDialog,
      showDeleteExpDialog,
      deletingExp,
      expedienteToDelete,
      filtro,
      headers,
      fetchExpedientes,
      onQuickFilterChange,
      resetFilters,
      formatDate,
      openNewExpediente,
      editExpediente,
      onExpedienteSaved,
      openSubirDocumento,
      onDocumentUploaded,
      openVerDocumentos,
      confirmDeleteExpediente,
      deleteExpediente,
      // Enlaces de utilidad
      enlaces,
      enlacesVisibles,
      cantidadEnlacesActivos,
      showEnlacesMenu,
      showEnlacesDialog,
      modoEdicion,
      enlaceFormRef,
      enlaceForm,
      catalogoIconos,
      catalogoColores,
      abrirEnlace,
      abrirModalEnlaces,
      iniciarEdicion,
      cancelarEdicion,
      validarUrl,
      guardarEnlace,
      toggleMostrarEnlace,
      eliminarEnlace,
      restablecerPorDefecto
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
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
</style>
