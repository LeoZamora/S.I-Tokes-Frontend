<template>
  <div class="w-100 pa-2">
    <!-- Snackbar para alertas de éxito/error -->
    <v-snackbar
      v-model="alert.show"
      :color="alert.color"
      timeout="4000"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{
          alert.icon
        }}</v-icon>
        <span>{{ alert.text }}</span>
      </div>
    </v-snackbar>

    <!-- Encabezado y Métricas Integradas -->
    <v-card
      class="border-t border-b mb-3"
      elevation="0"
      rounded="0"
    >
      <div
        class="d-flex align-center justify-space-between flex-wrap pa-2"
      >
        <div class="d-flex align-center">
          <v-icon class="me-2" color="indigo"
            >mdi-warehouse</v-icon
          >
          <span class="text-h6 font-weight-bold"
            >Gestión de Bodegas</span
          >
        </div>
        <div>
          <v-btn
            v-if="activeTab === 'sucursales'"
            color="indigo-darken-4"
            prepend-icon="mdi-store-plus"
            variant="tonal"
            density="comfortable"
            class="rounded font-weight-bold"
            @click="openDialogSucursal(null)"
          >
            Nueva Sucursal
          </v-btn>
          <template v-else-if="activeTab === 'camiones'">
            <v-btn
              color="teal-darken-3"
              prepend-icon="mdi-file-chart-outline"
              variant="flat"
              density="comfortable"
              class="rounded font-weight-bold mr-2 text-none"
              @click="openDialogConsolidado()"
            >
              Ver Inventario Consolidado
            </v-btn>
            <v-btn
              color="indigo-darken-4"
              prepend-icon="mdi-truck-plus"
              variant="tonal"
              density="comfortable"
              class="rounded font-weight-bold text-none"
              @click="openDialogCamion(null)"
            >
              Nuevo Camión
            </v-btn>
          </template>
        </div>
      </div>

      <v-divider />

      <!-- Tarjetas de Métricas -->
      <v-row class="pa-2 align-center" dense>
        <v-col cols="12" md="8" sm="8">
          <v-card
            variant="flat"
            color="grey-lighten-4"
            class="px-3 py-1"
          >
            <div
              class="d-flex flex-wrap align-center justify-space-between ga-3"
            >
              <!-- Sucursales -->
              <div
                class="d-flex align-center py-1"
              >
                <v-avatar
                  size="32"
                  color="indigo-lighten-5"
                  class="me-2"
                >
                  <v-icon
                    color="indigo"
                    size="small"
                    >mdi-storefront</v-icon
                  >
                </v-avatar>
                <div>
                  <div
                    class="text-caption text-grey-darken-2"
                    style="line-height: 1.1"
                  >
                    Sucursales
                  </div>
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo-darken-4"
                  >
                    {{ stats.sucursales }}
                    <span
                      class="text-caption text-grey"
                      >/ 12</span
                    >
                  </div>
                </div>
              </div>

              <v-divider vertical class="mx-1" />

              <!-- Camiones -->
              <div
                class="d-flex align-center py-1"
              >
                <v-avatar
                  size="32"
                  color="indigo-lighten-5"
                  class="me-2"
                >
                  <v-icon
                    color="indigo"
                    size="small"
                    >mdi-truck</v-icon
                  >
                </v-avatar>
                <div>
                  <div
                    class="text-caption text-grey-darken-2"
                    style="line-height: 1.1"
                  >
                    Camiones
                  </div>
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo-darken-4"
                  >
                    {{ stats.camiones }}
                    <span
                      class="text-caption text-grey"
                      >/ 12</span
                    >
                  </div>
                </div>
              </div>

              <v-divider vertical class="mx-1" />

              <!-- Total Bodegas -->
              <div
                class="d-flex align-center py-1"
              >
                <v-avatar
                  size="32"
                  color="indigo-lighten-5"
                  class="me-2"
                >
                  <v-icon
                    color="indigo"
                    size="small"
                    >mdi-warehouse</v-icon
                  >
                </v-avatar>
                <div>
                  <div
                    class="text-caption text-grey-darken-2"
                    style="line-height: 1.1"
                  >
                    Total Bodegas
                  </div>
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo-darken-4"
                  >
                    {{ stats.bodegas }}
                    <span
                      class="text-caption text-grey"
                      >/ 24</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="4"
          sm="4"
          class="d-flex justify-end"
        >
          <v-tabs
            v-model="activeTab"
            color="indigo-darken-4"
            density="compact"
          >
            <v-tab
              value="sucursales"
              class="text-caption font-weight-bold px-3"
            >
              <v-icon start size="small"
                >mdi-storefront</v-icon
              >
              Sucursales
            </v-tab>
            <v-tab
              value="camiones"
              class="text-caption font-weight-bold px-3"
            >
              <v-icon start size="small"
                >mdi-truck</v-icon
              >
              Camiones
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </v-card>

    <!-- Contenido según Tab seleccionado -->
    <v-window v-model="activeTab" class="w-100">
      <!-- PESTAÑA SUCURSALES -->
      <v-window-item value="sucursales">
        <!-- Barra de controles de Sucursales -->
        <v-row class="mb-2 align-center" dense>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="searchSucursales"
              label="Buscar sucursal..."
              prepend-inner-icon="mdi-magnify"
              density="compact"
              variant="outlined"
              color="indigo"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="8"
            class="d-flex justify-end align-center ga-2"
          >
            <v-btn
              color="teal-darken-3"
              variant="tonal"
              density="comfortable"
              prepend-icon="mdi-file-chart-outline"
              class="rounded font-weight-bold text-none"
              @click="openDialogConsolidadoSucursales()"
            >
              Ver Inventario Consolidado
            </v-btn>

            <!-- Alternancia de Vistas -->
            <v-btn-toggle
              v-model="viewModeSucursales"
              mandatory
              variant="outlined"
              color="indigo-darken-4"
              density="compact"
              class="rounded bg-white"
            >
              <v-btn
                value="grid"
                icon="mdi-view-grid"
                size="small"
                title="Vista Tarjetas"
              />
              <v-btn
                value="list"
                icon="mdi-view-list"
                size="small"
                title="Vista Lista"
              />
            </v-btn-toggle>
          </v-col>
        </v-row>

        <!-- Loader -->
        <div
          v-if="loading"
          class="d-flex justify-center my-6"
        >
          <v-progress-circular
            indeterminate
            color="indigo-darken-4"
            size="48"
          ></v-progress-circular>
        </div>

        <!-- Vista Grid de Sucursales -->
        <v-row
          v-else-if="
            viewModeSucursales === 'grid' &&
            filteredSucursales.length > 0
          "
          dense
        >
          <v-col
            v-for="item in filteredSucursales"
            :key="item.idSucursal"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              class="rounded elevation-1 overflow-hidden hover-card h-100 d-flex flex-column border-top-indigo"
              :class="{
                'opacity-60': !item.estado
              }"
            >
              <div class="pa-3 flex-grow-1">
                <div
                  class="d-flex align-start justify-space-between"
                >
                  <div>
                    <div
                      class="d-flex align-center flex-wrap"
                    >
                      <h4
                        class="text-subtitle-2 font-weight-bold text-indigo-darken-4 mb-0"
                      >
                        {{ item.nombre }}
                      </h4>
                      <v-icon
                        v-if="item.esPrincipal"
                        color="amber-darken-2"
                        size="small"
                        class="ml-1"
                        title="Sucursal Principal"
                      >
                        mdi-star
                      </v-icon>
                    </div>
                    <v-chip
                      size="x-small"
                      color="indigo"
                      variant="flat"
                      class="mt-1 font-weight-bold"
                    >
                      {{
                        item.codigo || 'S-SIN-COD'
                      }}
                    </v-chip>
                  </div>
                  <v-avatar
                    color="indigo-lighten-5"
                    size="32"
                    class="text-indigo-darken-4 font-weight-bold"
                  >
                    <v-icon size="small"
                      >mdi-storefront</v-icon
                    >
                  </v-avatar>
                </div>

                <v-list
                  class="bg-transparent mt-2 pa-0 density-compact"
                >
                  <v-list-item
                    class="px-0 py-0"
                    min-height="20"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        color="grey-darken-1"
                        size="x-small"
                        class="mr-1"
                        >mdi-map-marker</v-icon
                      >
                    </template>
                    <span
                      class="text-caption text-grey-darken-3"
                    >
                      {{
                        item.direccion ||
                        'Sin dirección registrada'
                      }}
                    </span>
                  </v-list-item>
                  <v-list-item
                    class="px-0 py-0"
                    min-height="20"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        color="grey-darken-1"
                        size="x-small"
                        class="mr-1"
                        >mdi-phone</v-icon
                      >
                    </template>
                    <span
                      class="text-caption text-grey-darken-3"
                    >
                      {{
                        item.telefono ||
                        'Sin teléfono'
                      }}
                    </span>
                  </v-list-item>
                  <v-list-item
                    class="px-0 py-0"
                    min-height="20"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        color="grey-darken-1"
                        size="x-small"
                        class="mr-1"
                        >mdi-email</v-icon
                      >
                    </template>
                    <span
                      class="text-caption text-grey-darken-3 text-truncate d-inline-block"
                      style="max-width: 170px"
                    >
                      {{
                        item.email || 'Sin correo'
                      }}
                    </span>
                  </v-list-item>
                  <v-list-item
                    class="px-0 py-0"
                    min-height="20"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        color="grey-darken-1"
                        size="x-small"
                        class="mr-1"
                        >mdi-city</v-icon
                      >
                    </template>
                    <span
                      class="text-caption text-grey-darken-3 font-weight-bold text-indigo"
                    >
                      {{ item.municipio }}
                    </span>
                  </v-list-item>
                </v-list>

                <!-- Métricas Operativas Clave de Inventario -->
                <v-card
                  variant="flat"
                  color="grey-lighten-4"
                  class="pa-2 rounded mb-2 mt-2"
                >
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="text-caption text-grey-darken-2 font-weight-medium">
                      <v-icon size="x-small" color="indigo" class="mr-1">mdi-package-variant</v-icon>
                      Mercadería en Sucursal:
                    </span>
                    <span class="text-caption font-weight-bold text-indigo-darken-4">
                      {{ formatCurrency(item.valorMercaderiaTotal || 0) }}
                    </span>
                  </div>
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="text-caption text-grey-darken-2 font-weight-medium">
                      <v-icon size="x-small" color="blue-grey" class="mr-1">mdi-counter</v-icon>
                      Inventario Actual:
                    </span>
                    <span class="text-caption font-weight-bold text-grey-darken-4">
                      {{ item.totalUnidades || 0 }} uds ({{ item.totalProductos || 0 }} prod.)
                    </span>
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <span class="text-caption text-grey-darken-2 font-weight-medium">
                      <v-icon size="x-small" color="grey-darken-1" class="mr-1">mdi-clock-outline</v-icon>
                      Última Carga / Traslado:
                    </span>
                    <span class="text-caption font-weight-medium text-grey-darken-3">
                      {{ item.fechaUltimaCarga ? formatDateTime(item.fechaUltimaCarga) : 'Sin registros' }}
                    </span>
                  </div>
                </v-card>

                <!-- Botón Principal: Trasladar Inventario -->
                <v-btn
                  block
                  color="indigo-darken-4"
                  variant="flat"
                  density="comfortable"
                  prepend-icon="mdi-dolly"
                  class="rounded font-weight-bold mb-2 text-caption"
                  :disabled="!item.estado"
                  @click="openDialogTrasladoSucursal(item)"
                >
                  Trasladar Inventario
                </v-btn>

                <!-- Botones Secundarios: Ver Inventario & Historial -->
                <div class="d-flex ga-2">
                  <v-btn
                    variant="tonal"
                    color="indigo"
                    size="small"
                    prepend-icon="mdi-package-variant-closed"
                    class="flex-grow-1 rounded font-weight-bold text-caption"
                    @click="openDialogInventarioSucursal(item)"
                  >
                    Ver Inventario
                  </v-btn>
                  <v-btn
                    variant="tonal"
                    color="blue-grey-darken-2"
                    size="small"
                    prepend-icon="mdi-history"
                    class="flex-grow-1 rounded font-weight-bold text-caption"
                    @click="openDialogHistorialSucursal(item)"
                  >
                    Historial
                  </v-btn>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Footer Card Actions -->
              <div
                class="bg-grey-lighten-5 px-3 py-1 d-flex justify-space-between align-center"
              >
                <div class="d-flex align-center">
                  <v-switch
                    :model-value="item.estado"
                    @update:model-value="
                      toggleEstadoSucursal(item)
                    "
                    color="success"
                    hide-details
                    density="compact"
                    class="mr-2"
                  ></v-switch>
                  <span
                    class="text-caption font-weight-bold"
                    :class="
                      item.estado
                        ? 'text-success'
                        : 'text-grey'
                    "
                  >
                    {{
                      item.estado
                        ? 'Activa'
                        : 'Inactiva'
                    }}
                  </span>
                </div>
                <div>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    color="indigo"
                    size="small"
                    @click="
                      openDialogSucursal(item)
                    "
                    title="Editar"
                  ></v-btn>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Tarjeta "+" para agregar sucursal -->
          <v-col cols="12" sm="6" md="4" lg="3">
            <v-card
              class="rounded border-dashed h-100 d-flex flex-column align-center justify-center cursor-pointer add-new-card py-6"
              @click="openDialogSucursal(null)"
            >
              <v-avatar
                color="indigo-lighten-5"
                size="48"
                class="mb-2"
              >
                <v-icon color="indigo-darken-4"
                  >mdi-plus</v-icon
                >
              </v-avatar>
              <span
                class="font-weight-bold text-subtitle-2 text-indigo-darken-4"
                >Agregar Sucursal</span
              >
              <span
                class="text-caption text-grey text-center px-4 mt-1"
                >Registra una nueva sucursal
                física</span
              >
            </v-card>
          </v-col>
        </v-row>

        <!-- Vista Lista de Sucursales -->
        <v-card
          v-else-if="
            viewModeSucursales === 'list' &&
            filteredSucursales.length > 0
          "
          class="rounded overflow-hidden border"
          elevation="0"
        >
          <v-table
            class="w-100 font"
            density="compact"
          >
            <thead>
              <tr
                class="bg-indigo-darken-4 text-white"
              >
                <th
                  class="text-left text-white font-weight-bold py-1"
                >
                  Sucursal
                </th>
                <th
                  class="text-left text-white font-weight-bold py-1"
                >
                  Código
                </th>
                <th
                  class="text-left text-white font-weight-bold py-1"
                >
                  Ubicación
                </th>
                <th
                  class="text-right text-white font-weight-bold py-1"
                >
                  Mercadería
                </th>
                <th
                  class="text-center text-white font-weight-bold py-1"
                >
                  Última Carga
                </th>
                <th
                  class="text-center text-white font-weight-bold py-1"
                >
                  Principal
                </th>
                <th
                  class="text-center text-white font-weight-bold py-1"
                >
                  Estado
                </th>
                <th
                  class="text-center text-white font-weight-bold py-1"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredSucursales"
                :key="item.idSucursal"
                :class="{
                  'bg-grey-lighten-3 opacity-60':
                    !item.estado
                }"
              >
                <td
                  class="font-weight-bold text-indigo-darken-4 py-1"
                >
                  {{ item.nombre }}
                </td>
                <td class="py-1">
                  <v-chip
                    size="x-small"
                    variant="flat"
                    color="indigo-lighten-4"
                    class="text-indigo-darken-4 font-weight-bold"
                  >
                    {{ item.codigo || '---' }}
                  </v-chip>
                </td>
                <td
                  class="font-weight-medium py-1"
                >
                  {{ item.municipio }}
                </td>
                <td class="text-right py-1">
                  <div class="font-weight-bold text-indigo-darken-4 text-caption">
                    {{ formatCurrency(item.valorMercaderiaTotal || 0) }}
                  </div>
                  <div class="text-caption text-grey-darken-1" style="font-size: 10px;">
                    {{ item.totalUnidades || 0 }} uds ({{ item.totalProductos || 0 }} prod.)
                  </div>
                </td>
                <td class="text-center py-1 text-caption text-grey-darken-2">
                  {{ item.fechaUltimaCarga ? formatDateTime(item.fechaUltimaCarga) : '---' }}
                </td>
                <td class="text-center py-1">
                  <v-icon
                    v-if="item.esPrincipal"
                    color="amber-darken-2"
                    size="small"
                    >mdi-star</v-icon
                  >
                  <span
                    v-else
                    class="text-grey-lighten-1"
                    >-</span
                  >
                </td>
                <td class="text-center py-1">
                  <v-chip
                    size="x-small"
                    :color="
                      item.estado
                        ? 'success'
                        : 'grey'
                    "
                    variant="flat"
                    class="font-weight-bold"
                  >
                    {{
                      item.estado
                        ? 'Activo'
                        : 'Inactivo'
                    }}
                  </v-chip>
                </td>
                <td class="text-center py-1">
                  <div
                    class="d-flex justify-center align-center ga-1"
                  >
                    <v-btn
                      icon="mdi-dolly"
                      variant="text"
                      color="indigo-darken-4"
                      size="small"
                      title="Trasladar Inventario"
                      :disabled="!item.estado"
                      @click="openDialogTrasladoSucursal(item)"
                    ></v-btn>
                    <v-btn
                      icon="mdi-package-variant-closed"
                      variant="text"
                      color="indigo"
                      size="small"
                      title="Ver Inventario"
                      @click="openDialogInventarioSucursal(item)"
                    ></v-btn>
                    <v-btn
                      icon="mdi-history"
                      variant="text"
                      color="blue-grey-darken-2"
                      size="small"
                      title="Historial de Traslados"
                      @click="openDialogHistorialSucursal(item)"
                    ></v-btn>
                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      color="indigo"
                      size="small"
                      title="Editar Sucursal"
                      @click="
                        openDialogSucursal(item)
                      "
                    ></v-btn>
                    <v-switch
                      :model-value="item.estado"
                      @update:model-value="
                        toggleEstadoSucursal(item)
                      "
                      color="success"
                      hide-details
                      density="compact"
                      class="ml-1"
                    ></v-switch>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- No Data View -->
        <v-sheet
          v-else
          class="text-center py-8 rounded border"
          bg-color="white"
        >
          <v-icon size="48" color="grey-lighten-1"
            >mdi-storefront-outline</v-icon
          >
          <h4
            class="text-subtitle-1 mt-2 text-grey-darken-1 font-weight-bold"
          >
            No se encontraron sucursales
          </h4>
          <p class="text-caption text-grey">
            Intenta ajustar tu búsqueda o registra
            una nueva sucursal.
          </p>
          <v-btn
            color="indigo-darken-4"
            variant="tonal"
            class="mt-3 font-weight-bold rounded"
            prepend-icon="mdi-plus"
            density="comfortable"
            @click="openDialogSucursal(null)"
          >
            Agregar Sucursal
          </v-btn>
        </v-sheet>
      </v-window-item>

      <!-- PESTAÑA CAMIONES -->
      <v-window-item value="camiones">
        <!-- Barra de controles de Camiones -->
        <v-row class="mb-2 align-center justify-space-between" dense>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="searchCamiones"
              label="Buscar camión por placa..."
              prepend-inner-icon="mdi-magnify"
              density="compact"
              variant="outlined"
              color="indigo"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="8" class="d-flex justify-end ga-2">
            <v-btn
              color="teal-darken-3"
              variant="tonal"
              density="comfortable"
              prepend-icon="mdi-file-chart-outline"
              class="rounded font-weight-bold text-none"
              @click="openDialogConsolidado()"
            >
              Ver Inventario Consolidado
            </v-btn>
          </v-col>
        </v-row>

        <!-- Loader -->
        <div
          v-if="loading"
          class="d-flex justify-center my-6"
        >
          <v-progress-circular
            indeterminate
            color="indigo-darken-4"
            size="48"
          ></v-progress-circular>
        </div>

        <!-- Vista Tarjetas de Camiones -->
        <v-row
          v-else-if="filteredCamiones.length > 0"
          dense
        >
          <!-- Tarjetas de Camiones Registrados -->
          <v-col
            v-for="item in filteredCamiones"
            :key="item.idCamion"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-card
              class="rounded elevation-1 overflow-hidden hover-card h-100 d-flex flex-column border-top-indigo"
              :class="{
                'opacity-60': !item.estado
              }"
            >
              <div class="pa-3 flex-grow-1">
                <div
                  class="d-flex align-start justify-space-between"
                >
                  <div>
                    <h4
                      class="text-subtitle-2 font-weight-bold text-indigo-darken-4 mb-0"
                    >
                      {{ item.bodegaNombre || item.nombreBodega || ('Bodega Camión ' + item.placa) }}
                    </h4>
                    <v-chip
                      size="x-small"
                      color="indigo"
                      variant="flat"
                      class="mt-1 font-weight-bold"
                    >
                      Placa: {{ item.placa }}
                    </v-chip>
                  </div>
                  <v-avatar
                    color="indigo-lighten-5"
                    size="32"
                    class="text-indigo-darken-4 font-weight-bold"
                  >
                    <v-icon size="small">mdi-truck</v-icon>
                  </v-avatar>
                </div>

                <!-- Placa Vehicular Realista Centrada -->
                <div class="d-flex justify-center my-3">
                  <div class="license-plate">
                    <div class="plate-bolts">
                      <span class="bolt"></span>
                      <span class="bolt"></span>
                    </div>
                    <div class="plate-content">
                      <div class="plate-top text-uppercase">
                        Distribuidor
                      </div>
                      <div class="plate-number text-uppercase font-weight-bold">
                        {{ item.placa }}
                      </div>
                      <div class="plate-bottom">
                        PLACA
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Métricas Operativas Clave para el Encargado de Carga -->
                <v-card
                  variant="flat"
                  color="grey-lighten-4"
                  class="pa-2 rounded mb-2"
                >
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="text-caption text-grey-darken-2 font-weight-medium">
                      <v-icon size="x-small" color="indigo" class="mr-1">mdi-package-variant</v-icon>
                      Mercadería a Bordo:
                    </span>
                    <span class="text-caption font-weight-bold text-indigo-darken-4">
                      {{ formatCurrency(item.valorMercaderiaTotal || 0) }}
                    </span>
                  </div>
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="text-caption text-grey-darken-2 font-weight-medium">
                      <v-icon size="x-small" color="blue-grey" class="mr-1">mdi-counter</v-icon>
                      Carga Actual:
                    </span>
                    <span class="text-caption font-weight-bold text-grey-darken-4">
                      {{ item.totalUnidades || 0 }} uds ({{ item.totalProductos || 0 }} prod.)
                    </span>
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <span class="text-caption text-grey-darken-2 font-weight-medium">
                      <v-icon size="x-small" color="grey-darken-1" class="mr-1">mdi-clock-outline</v-icon>
                      Última Carga:
                    </span>
                    <span class="text-caption font-weight-medium text-grey-darken-3">
                      {{ item.fechaUltimaCarga ? formatDateTime(item.fechaUltimaCarga) : 'Sin registros' }}
                    </span>
                  </div>
                </v-card>

                <!-- Botón Principal: Cargar Inventario -->
                <v-btn
                  block
                  color="indigo-darken-4"
                  variant="flat"
                  density="comfortable"
                  prepend-icon="mdi-dolly"
                  class="rounded font-weight-bold mb-2 text-caption"
                  :disabled="!item.estado"
                  @click="openDialogTraslado(item)"
                >
                  Cargar Inventario
                </v-btn>

                <!-- Botones Secundarios: Ver Carga & Historial -->
                <div class="d-flex ga-2">
                  <v-btn
                    variant="tonal"
                    color="indigo"
                    size="small"
                    prepend-icon="mdi-package-variant-closed"
                    class="flex-grow-1 rounded font-weight-bold text-caption"
                    @click="openDialogInventarioCamion(item)"
                  >
                    Ver Carga
                  </v-btn>
                  <v-btn
                    variant="tonal"
                    color="blue-grey-darken-2"
                    size="small"
                    prepend-icon="mdi-history"
                    class="flex-grow-1 rounded font-weight-bold text-caption"
                    @click="openDialogHistorialCargas(item)"
                  >
                    Historial
                  </v-btn>
                </div>
              </div>

              <v-divider></v-divider>

              <!-- Actions Footer -->
              <div
                class="bg-grey-lighten-5 px-3 py-1 d-flex justify-space-between align-center"
              >
                <div class="d-flex align-center">
                  <v-switch
                    :model-value="item.estado"
                    @update:model-value="
                      toggleEstadoCamion(item)
                    "
                    color="success"
                    hide-details
                    density="compact"
                    class="mr-2"
                  ></v-switch>
                  <span
                    class="text-caption font-weight-bold"
                    :class="
                      item.estado
                        ? 'text-success'
                        : 'text-grey'
                    "
                  >
                    {{
                      item.estado
                        ? 'Activo'
                        : 'Inactivo'
                    }}
                  </span>
                </div>
                <div>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    color="indigo"
                    size="small"
                    @click="
                      openDialogCamion(item)
                    "
                  ></v-btn>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Tarjeta "+" para agregar uno nuevo -->
          <v-col cols="12" sm="6" md="6" lg="4">
            <v-card
              class="rounded border-dashed h-100 d-flex flex-column align-center justify-center cursor-pointer add-new-card py-6"
              @click="openDialogCamion(null)"
            >
              <v-avatar
                color="indigo-lighten-5"
                size="48"
                class="mb-2"
              >
                <v-icon color="indigo-darken-4"
                  >mdi-plus</v-icon
                >
              </v-avatar>
              <span
                class="font-weight-bold text-subtitle-2 text-indigo-darken-4"
                >Agregar Camión</span
              >
              <span
                class="text-caption text-grey text-center px-4 mt-1"
                >Registra una nueva placa para
                distribución</span
              >
            </v-card>
          </v-col>
        </v-row>

        <!-- No Data View -->
        <v-sheet
          v-else
          class="text-center py-8 rounded border"
          bg-color="white"
        >
          <v-icon size="48" color="grey-lighten-1"
            >mdi-truck-outline</v-icon
          >
          <h4
            class="text-subtitle-1 mt-2 text-grey-darken-1 font-weight-bold"
          >
            No se encontraron camiones
          </h4>
          <p class="text-caption text-grey">
            Intenta ajustar tu búsqueda o registra
            tu primer vehículo.
          </p>
          <v-btn
            color="indigo-darken-4"
            variant="tonal"
            class="mt-3 font-weight-bold rounded"
            prepend-icon="mdi-plus"
            density="comfortable"
            @click="openDialogCamion(null)"
          >
            Agregar Camión
          </v-btn>
        </v-sheet>
      </v-window-item>
    </v-window>

    <!-- ================= DIÁLOGO REGISTRO/EDICIÓN SUCURSAL ================= -->
    <v-dialog
      v-model="dialogSucursal.show"
      max-width="550"
      persistent
    >
      <v-card class="rounded overflow-hidden">
        <v-card-title
          class="bg-indigo-darken-4 text-white font-weight-bold pa-3 d-flex align-center"
        >
          <v-icon start class="mr-2">{{
            dialogSucursal.editar
              ? 'mdi-store-edit'
              : 'mdi-store-plus'
          }}</v-icon>
          <span
            class="text-subtitle-1 font-weight-bold"
            >{{ dialogSucursal.title }}</span
          >
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-form
            ref="formSucursal"
            v-model="formValidSucursal"
          >
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="
                    dialogSucursal.item.codigo
                  "
                  label="Código Sucursal"
                  placeholder="Ej: SUC-NORTE"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  maxLength="25"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="
                    dialogSucursal.item.nombre
                  "
                  label="Nombre de Sucursal*"
                  placeholder="Ej: Sucursal Norte"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  :rules="[
                    (v) =>
                      !!v ||
                      'El nombre es requerido.'
                  ]"
                  maxLength="50"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="
                    dialogSucursal.item.direccion
                  "
                  label="Dirección"
                  placeholder="Ej: Kilómetro 12 Carretera Norte..."
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  maxLength="250"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="
                    dialogSucursal.item.telefono
                  "
                  label="Teléfono"
                  placeholder="Ej: +505 8888-8888"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  maxLength="25"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="
                    dialogSucursal.item.email
                  "
                  label="Correo Electrónico"
                  placeholder="Ej: sucursal@empresa.com"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  type="email"
                  maxLength="50"
                ></v-text-field>
              </v-col>

              <!-- Ubicación Geográfica -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedDepartamento"
                  :items="catalogos.departamentos"
                  item-title="nombre"
                  item-value="id"
                  label="Departamento*"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  :rules="[
                    (v) =>
                      !!v ||
                      'Debe seleccionar un departamento.'
                  ]"
                  @update:model-value="
                    onDepartamentoChange
                  "
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="
                    dialogSucursal.item
                      .idMunicipio
                  "
                  :items="catalogos.municipios"
                  item-title="nombre"
                  item-value="id"
                  label="Municipio*"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  :rules="[
                    (v) =>
                      !!v ||
                      'Debe seleccionar un municipio.'
                  ]"
                  :disabled="
                    !selectedDepartamento
                  "
                ></v-select>
              </v-col>

              <!-- Sucursal Principal -->
              <v-col cols="12" class="pt-1">
                <v-card
                  variant="tonal"
                  color="amber-darken-4"
                  class="pa-2 rounded d-flex align-center justify-space-between"
                >
                  <div>
                    <div
                      class="font-weight-bold text-caption text-brown-darken-3"
                    >
                      Designar como Principal
                    </div>
                    <div
                      class="text-caption text-grey-darken-2"
                      style="
                        font-size: 10px !important;
                      "
                    >
                      Solo puede haber una
                      sucursal principal activa.
                    </div>
                  </div>
                  <v-switch
                    v-model="
                      dialogSucursal.item
                        .esPrincipal
                    "
                    color="amber-darken-3"
                    density="compact"
                    hide-details
                  ></v-switch>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions
          class="pa-3 bg-grey-lighten-4"
        >
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="grey"
            density="comfortable"
            class="rounded font-weight-bold text-caption"
            @click="dialogSucursal.show = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            density="comfortable"
            class="rounded font-weight-bold px-4 text-caption"
            :loading="dialogSucursal.loading"
            :disabled="!formValidSucursal"
            @click="saveSucursal"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ================= DIÁLOGO REGISTRO/EDICIÓN CAMIÓN ================= -->
    <v-dialog
      v-model="dialogCamion.show"
      max-width="400"
      persistent
    >
      <v-card class="rounded overflow-hidden">
        <v-card-title
          class="bg-indigo-darken-4 text-white font-weight-bold pa-3 d-flex align-center"
        >
          <v-icon start class="mr-2">{{
            dialogCamion.editar
              ? 'mdi-truck-edit'
              : 'mdi-truck-plus'
          }}</v-icon>
          <span
            class="text-subtitle-1 font-weight-bold"
            >{{ dialogCamion.title }}</span
          >
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-form
            ref="formCamion"
            v-model="formValidCamion"
          >
            <v-row dense>
              <v-col
                cols="12"
                class="text-center mb-2"
              >
                <v-avatar
                  color="indigo-lighten-5"
                  size="48"
                  class="text-indigo-darken-4"
                >
                  <v-icon size="28"
                    >mdi-card-bulleted-outline</v-icon
                  >
                </v-avatar>
                <div
                  class="text-caption text-grey mt-1"
                >
                  Registra la placa vehicular
                  exactamente como figura en el
                  vehículo
                </div>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="
                    dialogCamion.item.placa
                  "
                  label="Número de Placa*"
                  placeholder="Ej: M 123456"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  :rules="[
                    (v) =>
                      !!v ||
                      'La placa es requerida.'
                  ]"
                  maxLength="50"
                  class="text-uppercase"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="
                    dialogCamion.item.nombreBodega
                  "
                  label="Nombre de la Bodega*"
                  placeholder="Ej: Bodega Móvil Central / Bodega Camión M 123456"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  :rules="[
                    (v) =>
                      !!v ||
                      'El nombre de la bodega es requerido.'
                  ]"
                  maxLength="150"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions
          class="pa-3 bg-grey-lighten-4"
        >
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="grey"
            density="comfortable"
            class="rounded font-weight-bold text-caption"
            @click="dialogCamion.show = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            density="comfortable"
            class="rounded font-weight-bold px-4 text-caption"
            :loading="dialogCamion.loading"
            :disabled="!formValidCamion"
            @click="saveCamion"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ================= DIÁLOGO TRASLADAR / CARGAR INVENTARIO A CAMIÓN ================= -->
    <v-dialog
      v-model="dialogTraslado.show"
      max-width="950"
      persistent
      scrollable
    >
      <v-card class="rounded overflow-hidden">
        <v-card-title
          class="bg-indigo-darken-4 text-white font-weight-bold pa-3 d-flex align-center justify-space-between flex-wrap"
        >
          <div class="d-flex align-center">
            <v-icon start class="mr-2">mdi-dolly</v-icon>
            <span class="text-subtitle-1 font-weight-bold">
              Cargar Inventario a Camión: {{ dialogTraslado.camion?.placa }}
            </span>
          </div>
          <v-chip size="small" color="white" variant="outlined" class="font-weight-bold">
            Bodega Destino: {{ dialogTraslado.camion?.bodegaNombre || dialogTraslado.camion?.placa }}
          </v-chip>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4" style="max-height: 75vh;">
          <!-- Selección de Bodega Origen -->
          <v-row dense class="mb-2">
            <v-col cols="12" sm="6">
              <v-select
                v-model="dialogTraslado.idBodegaOrigen"
                :items="bodegasOrigenOptions"
                item-title="nombre"
                item-value="idBodega"
                label="Bodega de Origen (Desde donde se carga)*"
                prepend-inner-icon="mdi-warehouse"
                variant="outlined"
                density="compact"
                color="indigo"
                :loading="dialogTraslado.loadingStock"
                @update:model-value="onBodegaOrigenChange"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :subtitle="item.raw.codigo ? `Código: ${item.raw.codigo}` : ''">
                    <template v-slot:append v-if="item.raw.esPrincipal">
                      <v-chip size="x-small" color="amber-darken-3" variant="flat">Principal</v-chip>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                :model-value="dialogTraslado.camion?.bodegaNombre || `Bodega Camión (${dialogTraslado.camion?.placa})`"
                label="Bodega de Destino (Camión)"
                prepend-inner-icon="mdi-truck"
                variant="outlined"
                density="compact"
                color="indigo"
                readonly
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Sección para Seleccionar y Agregar Producto -->
          <v-card variant="flat" color="indigo-lighten-5" class="pa-3 rounded mb-3 border border-indigo-lighten-4">
            <div class="text-caption font-weight-bold text-indigo-darken-4 mb-2">
              <v-icon size="small" color="indigo-darken-4" class="mr-1">mdi-plus-box</v-icon>
              AGREGAR PRODUCTO A LA CARGA
            </div>
            <v-row dense class="align-center">
              <v-col cols="12" sm="6" md="7">
                <v-autocomplete
                  v-model="dialogTraslado.selectedProducto"
                  :items="bodegaOrigenStock"
                  item-title="nombre"
                  return-object
                  :custom-filter="(itemTitle, queryText, item) => {
                    const q = (queryText || '').toLowerCase().trim()
                    if (!q) return true
                    const nombre = (item.raw?.nombre || '').toLowerCase()
                    const codigo = (item.raw?.codigo || '').toLowerCase()
                    return nombre.includes(q) || codigo.includes(q)
                  }"
                  label="Buscar producto por nombre o código..."
                  placeholder="Escribe para buscar..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  bg-color="white"
                  hide-details
                  :disabled="!dialogTraslado.idBodegaOrigen || dialogTraslado.loadingStock"
                  @update:model-value="onProductoSelected"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:title>
                        <span class="font-weight-bold">[{{ item.raw.codigo }}]</span> {{ item.raw.nombre }}
                      </template>
                      <template v-slot:subtitle>
                        <div class="d-flex ga-2 text-caption">
                          <span>Cat: {{ item.raw.categoria || 'N/A' }}</span>
                          <span>|</span>
                          <span class="text-success font-weight-bold">Disp: {{ item.raw.stockDisponible }}</span>
                          <span>|</span>
                          <span>Costo: {{ formatCurrency(item.raw.costo) }}</span>
                        </div>
                      </template>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="6" sm="3" md="3">
                <v-text-field
                  v-model.number="dialogTraslado.selectedCantidad"
                  type="number"
                  min="1"
                  :max="dialogTraslado.selectedProducto ? dialogTraslado.selectedProducto.stockDisponible : 9999"
                  label="Cantidad"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  bg-color="white"
                  hide-details
                  :disabled="!dialogTraslado.selectedProducto"
                ></v-text-field>
              </v-col>

              <v-col cols="6" sm="3" md="2">
                <v-btn
                  block
                  color="indigo-darken-4"
                  variant="flat"
                  density="comfortable"
                  prepend-icon="mdi-plus"
                  class="rounded font-weight-bold text-caption"
                  :disabled="!dialogTraslado.selectedProducto || !dialogTraslado.selectedCantidad || dialogTraslado.selectedCantidad <= 0"
                  @click="agregarProductoATraslado"
                >
                  Agregar
                </v-btn>
              </v-col>
            </v-row>

            <!-- Resumen del producto seleccionado -->
            <div v-if="dialogTraslado.selectedProducto" class="d-flex flex-wrap ga-3 mt-2 text-caption text-indigo-darken-4 font-weight-medium">
              <span><strong>Código:</strong> {{ dialogTraslado.selectedProducto.codigo }}</span>
              <span><strong>Stock Disponible:</strong> <span class="text-success font-weight-bold">{{ dialogTraslado.selectedProducto.stockDisponible }}</span></span>
              <span><strong>Costo Unit.:</strong> {{ formatCurrency(dialogTraslado.selectedProducto.costo) }}</span>
              <span><strong>Precio Venta:</strong> {{ formatCurrency(dialogTraslado.selectedProducto.precio) }}</span>
            </div>
          </v-card>

          <!-- Tabla de Productos a Cargar -->
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">
              Detalle de Productos para Cargar ({{ dialogTraslado.detalles.length }})
            </span>
          </div>

          <v-table density="compact" class="border rounded mb-3">
            <thead class="bg-grey-lighten-4 font-weight-bold">
              <tr>
                <th class="text-left py-2">Código</th>
                <th class="text-left py-2">Producto</th>
                <th class="text-center py-2" style="width: 140px;">Cantidad</th>
                <th class="text-right py-2">Costo Unit.</th>
                <th class="text-right py-2">Subtotal Costo</th>
                <th class="text-center py-2" style="width: 50px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in dialogTraslado.detalles" :key="item.idProducto">
                <td class="font-weight-medium text-caption">{{ item.codigo }}</td>
                <td class="font-weight-bold text-caption text-indigo-darken-4">{{ item.nombre }}</td>
                <td class="text-center">
                  <v-text-field
                    v-model.number="item.cantidad"
                    type="number"
                    min="1"
                    :max="item.stockDisponible"
                    density="compact"
                    variant="outlined"
                    hide-details
                    style="max-width: 100px; margin: 0 auto;"
                    @update:model-value="item.subtotalCosto = item.cantidad * item.costo"
                  ></v-text-field>
                </td>
                <td class="text-right text-caption">{{ formatCurrency(item.costo) }}</td>
                <td class="text-right font-weight-bold text-caption text-indigo-darken-4">
                  {{ formatCurrency(item.cantidad * item.costo) }}
                </td>
                <td class="text-center">
                  <v-btn
                    icon="mdi-delete-outline"
                    variant="text"
                    color="red-darken-2"
                    size="small"
                    @click="eliminarDetalleTraslado(idx)"
                  ></v-btn>
                </td>
              </tr>
              <tr v-if="dialogTraslado.detalles.length === 0">
                <td colspan="6" class="text-center py-4 text-grey text-caption">
                  No hay productos agregados a la carga. Selecciona y agrega productos arriba.
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Barra de Totales de la Carga -->
          <v-card variant="flat" color="grey-lighten-4" class="pa-3 rounded mb-3">
            <div class="d-flex flex-wrap align-center justify-space-between ga-3">
              <div>
                <span class="text-caption text-grey-darken-2">Total Ítems: </span>
                <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">{{ dialogTraslado.detalles.length }}</span>
              </div>
              <v-divider vertical class="mx-1" />
              <div>
                <span class="text-caption text-grey-darken-2">Total Unidades: </span>
                <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">{{ totalUnidadesTraslado }}</span>
              </div>
              <v-divider vertical class="mx-1" />
              <div>
                <span class="text-caption text-grey-darken-2">Valor Total de la Carga (Costo): </span>
                <span class="text-subtitle-1 font-weight-bold text-success-darken-2">{{ formatCurrency(totalValorTraslado) }}</span>
              </div>
            </div>
          </v-card>

          <!-- Observaciones -->
          <v-textarea
            v-model="dialogTraslado.observaciones"
            label="Observaciones del Traslado / Carga"
            placeholder="Ej: Carga inicial para ruta matutina..."
            variant="outlined"
            density="compact"
            rows="2"
            color="indigo"
            hide-details
          ></v-textarea>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-3 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="grey"
            density="comfortable"
            class="rounded font-weight-bold text-caption"
            @click="dialogTraslado.show = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            density="comfortable"
            prepend-icon="mdi-check"
            class="rounded font-weight-bold px-4 text-caption"
            :loading="dialogTraslado.saving"
            :disabled="dialogTraslado.detalles.length === 0"
            @click="saveTraslado"
          >
            Confirmar y Cargar Camión
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ================= DIÁLOGO INVENTARIO A BORDO DEL CAMIÓN ================= -->
    <v-dialog
      v-model="dialogInventarioCamion.show"
      max-width="950"
      persistent
      scrollable
    >
      <v-card class="rounded overflow-hidden">
        <v-card-title
          class="bg-indigo-darken-4 text-white font-weight-bold pa-3 d-flex align-center justify-space-between flex-wrap"
        >
          <div class="d-flex align-center">
            <v-icon start class="mr-2">mdi-package-variant-closed</v-icon>
            <span class="text-subtitle-1 font-weight-bold">
              Inventario a Bordo: Camión {{ dialogInventarioCamion.camion?.placa }}
            </span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="white" @click="dialogInventarioCamion.show = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4" style="max-height: 75vh;">
          <!-- Tarjetas Resumen de Mercadería a Bordo -->
          <v-row dense class="mb-3">
            <v-col cols="12" sm="4">
              <v-card variant="flat" color="indigo-lighten-5" class="pa-3 rounded border border-indigo-lighten-4">
                <div class="text-caption text-grey-darken-2">Productos Diferentes</div>
                <div class="text-h6 font-weight-bold text-indigo-darken-4">{{ dialogInventarioCamion.items.length }}</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="flat" color="blue-lighten-5" class="pa-3 rounded border border-blue-lighten-4">
                <div class="text-caption text-grey-darken-2">Total Unidades a Bordo</div>
                <div class="text-h6 font-weight-bold text-blue-darken-4">{{ totalUnidadesInventarioCamion }}</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="flat" color="teal-lighten-5" class="pa-3 rounded border border-teal-lighten-4">
                <div class="text-caption text-grey-darken-2">Valor Mercadería (Costo)</div>
                <div class="text-h6 font-weight-bold text-teal-darken-4">{{ formatCurrency(totalCostoInventarioCamion) }}</div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Búsqueda -->
          <v-row dense class="mb-2">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dialogInventarioCamion.search"
                label="Buscar en inventario a bordo..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                color="indigo"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Loader -->
          <div v-if="dialogInventarioCamion.loading" class="d-flex justify-center my-6">
            <v-progress-circular indeterminate color="indigo-darken-4" size="40"></v-progress-circular>
          </div>

          <!-- Tabla de Inventario a Bordo -->
          <v-table v-else density="compact" class="border rounded">
            <thead class="bg-grey-lighten-4 font-weight-bold">
              <tr>
                <th class="text-left py-2">Código</th>
                <th class="text-left py-2">Producto</th>
                <th class="text-left py-2">Categoría</th>
                <th class="text-center py-2">Cantidad a Bordo</th>
                <th class="text-right py-2">Costo Unit.</th>
                <th class="text-right py-2">Precio Venta</th>
                <th class="text-right py-2">Total Costo</th>
                <th class="text-right py-2">Total Venta</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredInventarioCamion" :key="item.idProducto">
                <td class="font-weight-medium text-caption">{{ item.codigo }}</td>
                <td class="font-weight-bold text-caption text-indigo-darken-4">{{ item.nombre }}</td>
                <td class="text-caption text-grey-darken-2">{{ item.categoria || 'N/A' }}</td>
                <td class="text-center font-weight-bold text-caption text-indigo-darken-4">{{ item.cantidadTotal }}</td>
                <td class="text-right text-caption">{{ formatCurrency(item.costoUnitario) }}</td>
                <td class="text-right text-caption">{{ formatCurrency(item.precioUnitario) }}</td>
                <td class="text-right font-weight-bold text-caption text-teal-darken-4">{{ formatCurrency(item.totalCosto) }}</td>
                <td class="text-right font-weight-bold text-caption text-blue-darken-4">{{ formatCurrency(item.totalVenta) }}</td>
              </tr>
              <tr v-if="filteredInventarioCamion.length === 0">
                <td colspan="8" class="text-center py-6 text-grey text-caption">
                  Este camión no tiene mercadería a bordo actualmente.
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-3 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            density="comfortable"
            class="rounded font-weight-bold px-4 text-caption"
            @click="dialogInventarioCamion.show = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ================= DIÁLOGO HISTORIAL DE CARGAS DEL CAMIÓN ================= -->
    <v-dialog
      v-model="dialogHistorialCargas.show"
      max-width="950"
      persistent
      scrollable
    >
      <v-card class="rounded overflow-hidden">
        <v-card-title
          class="bg-indigo-darken-4 text-white font-weight-bold pa-3 d-flex align-center justify-space-between flex-wrap"
        >
          <div class="d-flex align-center">
            <v-icon start class="mr-2">mdi-history</v-icon>
            <span class="text-subtitle-1 font-weight-bold">
              Historial de Cargas / Traslados: Camión {{ dialogHistorialCargas.camion?.placa }}
            </span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="white" @click="dialogHistorialCargas.show = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4" style="max-height: 75vh;">
          <!-- Búsqueda -->
          <v-row dense class="mb-2">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dialogHistorialCargas.search"
                label="Buscar en historial (referencia, bodega, usuario)..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                color="indigo"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Loader -->
          <div v-if="dialogHistorialCargas.loading" class="d-flex justify-center my-6">
            <v-progress-circular indeterminate color="indigo-darken-4" size="40"></v-progress-circular>
          </div>

          <!-- Tabla de Historial -->
          <v-table v-else density="compact" class="border rounded">
            <thead class="bg-grey-lighten-4 font-weight-bold">
              <tr>
                <th class="text-left py-2">Fecha / Hora</th>
                <th class="text-left py-2">Referencia</th>
                <th class="text-left py-2">Bodega Origen</th>
                <th class="text-center py-2">Ítems</th>
                <th class="text-right py-2">Valor Total</th>
                <th class="text-left py-2">Responsable</th>
                <th class="text-left py-2">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredHistorialCargas" :key="item.idMovInventario">
                <td class="font-weight-medium text-caption">{{ formatDateTime(item.fechaRegistro) }}</td>
                <td class="font-weight-bold text-caption text-indigo-darken-4">{{ item.referencia || '---' }}</td>
                <td class="text-caption">{{ item.bodegaOrigenNombre || '---' }}</td>
                <td class="text-center font-weight-bold text-caption">{{ item.totalItems || 0 }}</td>
                <td class="text-right font-weight-bold text-caption text-teal-darken-4">{{ formatCurrency(item.totalValor) }}</td>
                <td class="text-caption text-grey-darken-3">{{ item.usuarioRegistro || 'Sistema' }}</td>
                <td class="text-caption text-grey-darken-2">{{ item.observaciones || '---' }}</td>
              </tr>
              <tr v-if="filteredHistorialCargas.length === 0">
                <td colspan="7" class="text-center py-6 text-grey text-caption">
                  No hay registros de cargas anteriores para este camión.
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-3 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            density="comfortable"
            class="rounded font-weight-bold px-4 text-caption"
            @click="dialogHistorialCargas.show = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ================= DIÁLOGO INVENTARIO CONSOLIDADO DE CAMIONES (MINIMALISTA) ================= -->
    <v-dialog
      v-model="dialogConsolidado.show"
      max-width="1100"
      persistent
      scrollable
    >
      <v-card class="rounded-xl overflow-hidden border bg-white">
        <!-- Header Minimalista y Limpio -->
        <div class="pa-4 bg-white border-b d-flex align-center justify-space-between flex-wrap ga-2">
          <div class="d-flex align-center">
            <v-icon color="indigo-darken-3" size="24" class="mr-2">mdi-truck-cargo-container</v-icon>
            <div>
              <div class="text-subtitle-1 font-weight-bold text-grey-darken-4 lh-1">
                Inventario Consolidado de Camiones
              </div>
              <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">
                Valor del inventario por unidad de transporte y desglose de productos con existencias
              </span>
            </div>
          </div>
          <div class="d-flex align-center ga-2 flex-wrap">
            <v-chip
              v-if="dialogConsolidado.data?.fechaGeneracion"
              size="x-small"
              color="grey-lighten-2"
              variant="flat"
              class="text-grey-darken-3 font-weight-medium"
            >
              <v-icon start size="12">mdi-clock-outline</v-icon>
              {{ formatDateTime(dialogConsolidado.data.fechaGeneracion) }}
            </v-chip>
            <v-btn
              variant="outlined"
              size="small"
              color="grey-darken-2"
              class="text-none rounded-lg font-weight-medium"
              @click="toggleExpandAllConsolidado()"
            >
              <v-icon size="16" class="mr-1">mdi-arrow-expand-vertical</v-icon>
              Expandir / Contraer
            </v-btn>
            <v-btn
              icon="mdi-refresh"
              variant="text"
              size="small"
              color="grey-darken-2"
              :loading="dialogConsolidado.loading"
              title="Actualizar datos"
              @click="fetchInformeConsolidado()"
            />
            <!--<v-btn
              prepend-icon="mdi-file-excel"
              color="green-darken-3"
              variant="flat"
              size="small"
              class="text-white font-weight-bold text-none rounded-lg"
              :disabled="dialogConsolidado.loading || filteredInformeCamiones.length === 0"
              @click="exportarExcelConsolidado()"
            >
              Excel
            </v-btn>
            <v-btn
              prepend-icon="mdi-printer"
              color="indigo-darken-4"
              variant="flat"
              size="small"
              class="text-white font-weight-bold text-none rounded-lg"
              :disabled="dialogConsolidado.loading || filteredInformeCamiones.length === 0"
              @click="imprimirInformeConsolidado()"
            >
              PDF
            </v-btn>-->
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              color="grey-darken-2"
              @click="dialogConsolidado.show = false"
            />
          </div>
        </div>

        <v-card-text class="pa-4 bg-grey-lighten-5" style="max-height: 80vh;" id="printable-consolidado-content">
          <!-- Barra de Filtros y Resumen Minimalista -->
          <v-card variant="flat" class="pa-3 mb-3 rounded-lg border bg-white">
            <v-row dense align="center">
              <v-col cols="12" sm="5" md="4">
                <v-text-field
                  v-model="dialogConsolidado.search"
                  placeholder="Buscar producto, placa o categoría..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <v-autocomplete
                  v-model="dialogConsolidado.filterIdCamion"
                  :items="camionesOptionsInforme"
                  item-title="title"
                  item-value="value"
                  placeholder="Todos los Camiones"
                  prepend-inner-icon="mdi-truck"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  hide-details
                  @update:model-value="fetchInformeConsolidado()"
                />
              </v-col>
              <v-col cols="12" sm="3" md="5" class="d-flex align-center justify-sm-end ga-3 flex-wrap">
                <div class="text-right">
                  <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">Camiones</span>
                  <span class="text-body-2 font-weight-bold text-grey-darken-4">{{ resumenInformeConsolidado.totalCamiones }}</span>
                </div>
                <v-divider vertical class="my-1" />
                <div class="text-right">
                  <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">Stock Total</span>
                  <span class="text-body-2 font-weight-bold text-indigo-darken-3">{{ resumenInformeConsolidado.totalUnidades }} uds</span>
                </div>
                <v-divider vertical class="my-1" />
                <div class="text-right">
                  <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">Valor Inventario</span>
                  <span class="text-subtitle-2 font-weight-bold text-teal-darken-3">{{ formatCurrency(resumenInformeConsolidado.totalCosto) }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Loader -->
          <div v-if="dialogConsolidado.loading" class="d-flex flex-column align-center justify-center my-10">
            <v-progress-circular indeterminate color="indigo-darken-4" size="40" width="3"></v-progress-circular>
            <span class="text-caption font-weight-medium text-grey-darken-2 mt-3">Cargando existencias en camiones...</span>
          </div>

          <!-- Listado de Camiones (Expansion Panels) -->
          <template v-else-if="filteredInformeCamiones.length > 0">
            <v-expansion-panels
              v-model="dialogConsolidado.expandedPanels"
              multiple
              variant="accordion"
              class="mb-3"
            >
              <v-expansion-panel
                v-for="(camion, idx) in filteredInformeCamiones"
                :key="camion.idCamion || idx"
                class="mb-2 border rounded-lg overflow-hidden bg-white"
                elevation="0"
              >
                <!-- Cabecera del Camión -->
                <v-expansion-panel-title class="py-2 px-3 bg-white">
                  <template v-slot:default="{ expanded }">
                    <div class="d-flex align-center justify-space-between w-100 pr-2 flex-wrap ga-2">
                      <div class="d-flex align-center">
                        <v-chip
                          size="small"
                          color="indigo-darken-4"
                          variant="flat"
                          class="font-weight-bold mr-2 text-white"
                        >
                          <v-icon start size="16">mdi-truck</v-icon>
                          {{ camion.placa }}
                        </v-chip>
                        <div>
                          <div class="text-subtitle-2 font-weight-bold text-grey-darken-4 lh-1">
                            {{ camion.bodegaNombre || ('Camión ' + camion.placa) }}
                          </div>
                          <div class="text-caption text-grey-darken-1" style="font-size: 11px;">
                            {{ camion.codigoBodega ? 'Código: ' + camion.codigoBodega : 'Bodega Móvil' }}
                          </div>
                        </div>
                      </div>

                      <div class="d-flex align-center ga-4 flex-wrap">
                        <div class="text-right">
                          <span class="text-caption text-grey-darken-1" style="font-size: 10px;">Stock Positivo</span>
                          <div class="text-caption font-weight-bold text-grey-darken-4">
                            {{ camion.totalUnidades }} uds ({{ camion.productos.length }} prod.)
                          </div>
                        </div>
                        <div class="text-right">
                          <span class="text-caption text-grey-darken-1" style="font-size: 10px;">Valor Inventario</span>
                          <div class="text-caption font-weight-bold text-teal-darken-4" style="font-size: 13px;">
                            {{ formatCurrency(camion.valorTotalCosto) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </v-expansion-panel-title>

                <!-- Tabla de Productos del Camión -->
                <v-expansion-panel-text class="pa-0 border-t">
                  <div class="pa-3">
                    <v-table density="compact" class="border rounded table-consolidado-camion">
                      <thead class="bg-grey-lighten-4">
                        <tr>
                          <th class="text-left py-2 text-grey-darken-3 font-weight-bold">Código</th>
                          <th class="text-left py-2 text-grey-darken-3 font-weight-bold">Producto</th>
                          <th class="text-left py-2 text-grey-darken-3 font-weight-bold">Categoría</th>
                          <th class="text-center py-2 text-grey-darken-3 font-weight-bold">Stock</th>
                          <th class="text-right py-2 text-grey-darken-3 font-weight-bold">Costo Unit.</th>
                          <th class="text-right py-2 text-grey-darken-3 font-weight-bold">Valor Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="prod in camion.productos"
                          :key="prod.idStockBodega || prod.idProducto"
                          class="hover-row"
                        >
                          <td class="text-caption text-grey-darken-2">{{ prod.codigo || '---' }}</td>
                          <td class="font-weight-medium text-caption text-grey-darken-4">
                            {{ prod.nombre }}
                            <span v-if="prod.unidadMedida" class="text-caption text-grey" style="font-size: 10px;">
                              ({{ prod.unidadMedida }})
                            </span>
                          </td>
                          <td class="text-caption text-grey-darken-2">{{ prod.categoria || '---' }}</td>
                          <td class="text-center font-weight-bold text-caption text-indigo-darken-4">
                            {{ prod.cantidad }}
                          </td>
                          <td class="text-right text-caption">{{ formatCurrency(prod.costoUnitario) }}</td>
                          <td class="text-right font-weight-bold text-caption text-teal-darken-4">
                            {{ formatCurrency(prod.totalCosto) }}
                          </td>
                        </tr>
                        <tr v-if="!camion.productos || camion.productos.length === 0">
                          <td colspan="6" class="text-center py-4 text-grey text-caption">
                            No hay productos con stock positivo en este camión.
                          </td>
                        </tr>
                      </tbody>
                      <tfoot class="bg-grey-lighten-4 font-weight-bold border-top">
                        <tr>
                          <td colspan="3" class="text-right py-2 text-grey-darken-4">Total Camión {{ camion.placa }}:</td>
                          <td class="text-center py-2 text-indigo-darken-4">{{ camion.totalUnidades }}</td>
                          <td></td>
                          <td class="text-right py-2 text-teal-darken-4">{{ formatCurrency(camion.valorTotalCosto) }}</td>
                        </tr>
                      </tfoot>
                    </v-table>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Card de Gran Total Consolidado Final Minimalista -->
            <v-card variant="flat" class="pa-3 rounded-lg border bg-white mt-3 d-flex justify-space-between align-center flex-wrap ga-2">
              <div class="d-flex align-center">
                <v-icon color="indigo-darken-3" class="mr-2" size="20">mdi-sigma</v-icon>
                <div>
                  <div class="text-subtitle-2 font-weight-bold text-grey-darken-4">TOTAL INVENTARIO CONSOLIDADO (CAMIONES)</div>
                  <div class="text-caption text-grey-darken-1" style="font-size: 11px;">
                    {{ resumenInformeConsolidado.totalCamiones }} camiones | {{ resumenInformeConsolidado.totalProductosDistintos }} productos | {{ resumenInformeConsolidado.totalUnidades }} unidades en ruta
                  </div>
                </div>
              </div>
              <div class="text-right">
                <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">Valor Total del Inventario</span>
                <span class="text-subtitle-1 font-weight-bold text-teal-darken-4">{{ formatCurrency(resumenInformeConsolidado.totalCosto) }}</span>
              </div>
            </v-card>
          </template>

          <!-- No Data View -->
          <v-sheet
            v-else
            class="text-center py-10 rounded-lg border bg-white"
          >
            <v-avatar color="indigo-lighten-5" size="56" class="mb-3">
              <v-icon size="30" color="indigo-darken-3">mdi-truck-outline</v-icon>
            </v-avatar>
            <h4 class="text-subtitle-2 font-weight-bold text-grey-darken-3">
              No se encontraron datos con existencias activas en camiones
            </h4>
            <p class="text-caption text-grey-darken-1 mt-1">
              Verifique los filtros seleccionados o la existencia de productos con stock en las cargas de los camiones.
            </p>
          </v-sheet>
        </v-card-text>

        <v-divider></v-divider>
        <div class="pa-3 bg-white d-flex justify-space-between align-center flex-wrap ga-2">
          <span class="text-caption text-grey-darken-1">
            Mostrando {{ filteredInformeCamiones.length }} de {{ dialogConsolidado.data?.totalCamiones || 0 }} camiones con existencias
          </span>
          <div class="d-flex ga-2">
            <v-btn
              prepend-icon="mdi-file-excel"
              color="green-darken-3"
              variant="tonal"
              density="comfortable"
              class="rounded-lg font-weight-bold px-3 text-caption text-none"
              :disabled="dialogConsolidado.loading || filteredInformeCamiones.length === 0"
              @click="exportarExcelConsolidado()"
            >
              Exportar Excel
            </v-btn>
            <v-btn
              prepend-icon="mdi-printer"
              color="indigo-darken-4"
              variant="tonal"
              density="comfortable"
              class="rounded-lg font-weight-bold px-3 text-caption text-none"
              :disabled="dialogConsolidado.loading || filteredInformeCamiones.length === 0"
              @click="imprimirInformeConsolidado()"
            >
              Imprimir PDF
            </v-btn>
            <v-btn
              color="grey-darken-2"
              variant="outlined"
              density="comfortable"
              class="rounded-lg font-weight-medium px-4 text-caption text-none"
              @click="dialogConsolidado.show = false"
            >
              Cerrar
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- ================= DIÁLOGO TRASLADAR / CARGAR INVENTARIO A SUCURSAL ================= -->
    <v-dialog
      v-model="dialogTrasladoSucursal.show"
      max-width="950"
      persistent
      scrollable
    >
      <v-card class="rounded overflow-hidden">
        <v-card-title
          class="bg-indigo-darken-4 text-white font-weight-bold pa-3 d-flex align-center justify-space-between flex-wrap"
        >
          <div class="d-flex align-center">
            <v-icon start class="mr-2">mdi-dolly</v-icon>
            <span class="text-subtitle-1 font-weight-bold">
              Trasladar Inventario a Sucursal: {{ dialogTrasladoSucursal.sucursal?.nombre }}
            </span>
          </div>
          <v-chip size="small" color="white" variant="outlined" class="font-weight-bold">
            Bodega Destino: {{ dialogTrasladoSucursal.sucursal?.bodegaNombre || dialogTrasladoSucursal.sucursal?.nombre }}
          </v-chip>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4" style="max-height: 75vh;">
          <!-- Selección de Bodega Origen -->
          <v-row dense class="mb-2">
            <v-col cols="12" sm="6">
              <v-select
                v-model="dialogTrasladoSucursal.idBodegaOrigen"
                :items="bodegasOrigenSucursalOptions"
                item-title="nombre"
                item-value="idBodega"
                label="Bodega / Sucursal de Origen (Desde donde se traslada)*"
                prepend-inner-icon="mdi-warehouse"
                variant="outlined"
                density="compact"
                color="indigo"
                :loading="dialogTrasladoSucursal.loadingStock"
                @update:model-value="onBodegaOrigenSucursalChange"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :subtitle="item.raw.codigo ? `Código: ${item.raw.codigo}` : ''">
                    <template v-slot:append v-if="item.raw.esPrincipal">
                      <v-chip size="x-small" color="amber-darken-3" variant="flat">Principal</v-chip>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                :model-value="dialogTrasladoSucursal.sucursal?.bodegaNombre || dialogTrasladoSucursal.sucursal?.nombre"
                label="Bodega de Destino (Sucursal)"
                prepend-inner-icon="mdi-storefront"
                variant="outlined"
                density="compact"
                color="indigo"
                readonly
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Sección para Seleccionar y Agregar Producto -->
          <v-card variant="flat" color="indigo-lighten-5" class="pa-3 rounded mb-3 border border-indigo-lighten-4">
            <div class="text-caption font-weight-bold text-indigo-darken-4 mb-2">
              <v-icon size="small" color="indigo-darken-4" class="mr-1">mdi-plus-box</v-icon>
              AGREGAR PRODUCTO AL TRASLADO
            </div>
            <v-row dense class="align-center">
              <v-col cols="12" sm="6" md="7">
                <v-autocomplete
                  v-model="dialogTrasladoSucursal.selectedProducto"
                  :items="bodegaOrigenSucursalStock"
                  item-title="nombre"
                  return-object
                  :custom-filter="(itemTitle, queryText, item) => {
                    const q = (queryText || '').toLowerCase().trim()
                    if (!q) return true
                    const nombre = (item.raw?.nombre || '').toLowerCase()
                    const codigo = (item.raw?.codigo || '').toLowerCase()
                    return nombre.includes(q) || codigo.includes(q)
                  }"
                  label="Buscar producto por nombre o código..."
                  placeholder="Escribe para buscar..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  bg-color="white"
                  hide-details
                  :disabled="!dialogTrasladoSucursal.idBodegaOrigen || dialogTrasladoSucursal.loadingStock"
                  @update:model-value="onProductoSelectedSucursal"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:title>
                        <span class="font-weight-bold">[{{ item.raw.codigo }}]</span> {{ item.raw.nombre }}
                      </template>
                      <template v-slot:subtitle>
                        <div class="d-flex ga-2 text-caption">
                          <span>Cat: {{ item.raw.categoria || 'N/A' }}</span>
                          <span>|</span>
                          <span class="text-success font-weight-bold">Disp: {{ item.raw.stockDisponible }}</span>
                          <span>|</span>
                          <span>Costo: {{ formatCurrency(item.raw.costo) }}</span>
                        </div>
                      </template>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="6" sm="3" md="3">
                <v-text-field
                  v-model.number="dialogTrasladoSucursal.selectedCantidad"
                  type="number"
                  min="1"
                  :max="dialogTrasladoSucursal.selectedProducto ? dialogTrasladoSucursal.selectedProducto.stockDisponible : 9999"
                  label="Cantidad"
                  prepend-inner-icon="mdi-counter"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  bg-color="white"
                  hide-details
                  :disabled="!dialogTrasladoSucursal.selectedProducto"
                ></v-text-field>
              </v-col>

              <v-col cols="6" sm="3" md="2">
                <v-btn
                  block
                  color="indigo-darken-4"
                  variant="flat"
                  density="comfortable"
                  prepend-icon="mdi-plus"
                  class="rounded font-weight-bold text-caption"
                  :disabled="!dialogTrasladoSucursal.selectedProducto || !dialogTrasladoSucursal.selectedCantidad || dialogTrasladoSucursal.selectedCantidad <= 0"
                  @click="agregarProductoATrasladoSucursal"
                >
                  Agregar
                </v-btn>
              </v-col>
            </v-row>

            <!-- Info resumen del producto seleccionado -->
            <div v-if="dialogTrasladoSucursal.selectedProducto" class="d-flex flex-wrap ga-3 mt-2 text-caption text-indigo-darken-4 font-weight-medium">
              <span><strong>Código:</strong> {{ dialogTrasladoSucursal.selectedProducto.codigo }}</span>
              <span><strong>Stock Disponible:</strong> <span class="text-success font-weight-bold">{{ dialogTrasladoSucursal.selectedProducto.stockDisponible }}</span></span>
              <span><strong>Costo Unit.:</strong> {{ formatCurrency(dialogTrasladoSucursal.selectedProducto.costo) }}</span>
              <span><strong>Precio Venta:</strong> {{ formatCurrency(dialogTrasladoSucursal.selectedProducto.precio) }}</span>
            </div>
          </v-card>

          <!-- Tabla de Productos a Trasladar -->
          <v-card variant="flat" class="border rounded overflow-hidden mb-3">
            <div class="pa-2 bg-grey-lighten-3 font-weight-bold text-caption text-grey-darken-3 d-flex justify-space-between align-center">
              <span>Detalle de Productos para Trasladar ({{ dialogTrasladoSucursal.detalles.length }})</span>
              <span v-if="dialogTrasladoSucursal.detalles.length > 0" class="text-indigo-darken-4 font-weight-bold">
                Total Unidades: {{ totalUnidadesTrasladoSucursal }} | Inversión: {{ formatCurrency(totalValorTrasladoSucursal) }}
              </span>
            </div>

            <v-table density="compact">
              <thead class="bg-grey-lighten-4">
                <tr>
                  <th class="text-left py-2">Código</th>
                  <th class="text-left py-2">Producto</th>
                  <th class="text-center py-2">Cantidad</th>
                  <th class="text-right py-2">Costo Unit.</th>
                  <th class="text-right py-2">Subtotal Costo</th>
                  <th class="text-center py-2" style="width: 60px;">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in dialogTrasladoSucursal.detalles" :key="item.idProducto">
                  <td class="font-weight-medium text-caption">{{ item.codigo }}</td>
                  <td class="font-weight-bold text-caption text-indigo-darken-4">{{ item.nombre }}</td>
                  <td class="text-center font-weight-bold text-caption">
                    <v-text-field
                      v-model.number="item.cantidad"
                      type="number"
                      min="1"
                      :max="item.stockDisponible"
                      density="compact"
                      variant="plain"
                      hide-details
                      class="text-center font-weight-bold"
                      style="max-width: 80px; margin: 0 auto;"
                    ></v-text-field>
                  </td>
                  <td class="text-right text-caption">{{ formatCurrency(item.costo) }}</td>
                  <td class="text-right font-weight-bold text-caption text-indigo-darken-4">
                    {{ formatCurrency((Number(item.cantidad) || 0) * (Number(item.costo) || 0)) }}
                  </td>
                  <td class="text-center">
                    <v-btn
                      icon="mdi-delete-outline"
                      variant="text"
                      color="error"
                      size="x-small"
                      @click="eliminarDetalleTrasladoSucursal(idx)"
                    ></v-btn>
                  </td>
                </tr>
                <tr v-if="dialogTrasladoSucursal.detalles.length === 0">
                  <td colspan="6" class="text-center py-6 text-grey text-caption">
                    No se han agregado productos a la lista de traslado.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <!-- Resumen y Observaciones -->
          <v-row dense>
            <v-col cols="12" sm="4">
              <v-card variant="flat" color="indigo-lighten-5" class="pa-2 rounded border border-indigo-lighten-4 h-100 d-flex flex-column justify-center">
                <div class="d-flex justify-space-between mb-1">
                  <span class="text-caption text-grey-darken-2">Ítems a trasladar:</span>
                  <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">{{ dialogTrasladoSucursal.detalles.length }}</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span class="text-caption text-grey-darken-2">Total Unidades:</span>
                  <span class="text-subtitle-2 font-weight-bold text-indigo-darken-4">{{ totalUnidadesTrasladoSucursal }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-caption text-grey-darken-2">Total Inversión:</span>
                  <span class="text-subtitle-2 font-weight-bold text-teal-darken-4">{{ formatCurrency(totalValorTrasladoSucursal) }}</span>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="8">
              <v-textarea
                v-model="dialogTrasladoSucursal.observaciones"
                label="Observaciones del Traslado (Opcional)"
                prepend-inner-icon="mdi-comment-text-outline"
                variant="outlined"
                density="compact"
                color="indigo"
                rows="3"
                hide-details
                placeholder="Ej. Reabastecimiento semanal para venta de sucursal..."
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-3 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            density="comfortable"
            class="rounded font-weight-bold px-4 text-caption mr-2"
            @click="dialogTrasladoSucursal.show = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            density="comfortable"
            prepend-icon="mdi-check-circle-outline"
            class="rounded font-weight-bold px-4 text-caption"
            :loading="dialogTrasladoSucursal.saving"
            :disabled="dialogTrasladoSucursal.detalles.length === 0"
            @click="saveTrasladoSucursal"
          >
            Realizar Traslado
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ================= DIÁLOGO INVENTARIO EN SUCURSAL ================= -->
    <v-dialog
      v-model="dialogInventarioSucursal.show"
      max-width="950"
      persistent
      scrollable
    >
      <v-card class="rounded overflow-hidden">
        <v-card-title
          class="bg-indigo-darken-4 text-white font-weight-bold pa-3 d-flex align-center justify-space-between flex-wrap"
        >
          <div class="d-flex align-center">
            <v-icon start class="mr-2">mdi-package-variant-closed</v-icon>
            <span class="text-subtitle-1 font-weight-bold">
              Inventario en Sucursal: {{ dialogInventarioSucursal.sucursal?.nombre }}
            </span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="white" @click="dialogInventarioSucursal.show = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4" style="max-height: 75vh;">
          <!-- Tarjetas Resumen de Mercadería en Sucursal -->
          <v-row dense class="mb-3">
            <v-col cols="12" sm="4">
              <v-card variant="flat" color="indigo-lighten-5" class="pa-3 rounded border border-indigo-lighten-4">
                <div class="text-caption text-grey-darken-2">Productos Diferentes</div>
                <div class="text-h6 font-weight-bold text-indigo-darken-4">{{ dialogInventarioSucursal.items.length }}</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="flat" color="blue-lighten-5" class="pa-3 rounded border border-blue-lighten-4">
                <div class="text-caption text-grey-darken-2">Total Unidades en Sucursal</div>
                <div class="text-h6 font-weight-bold text-blue-darken-4">{{ totalUnidadesInventarioSucursal }}</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="flat" color="teal-lighten-5" class="pa-3 rounded border border-teal-lighten-4">
                <div class="text-caption text-grey-darken-2">Valor Mercadería (Costo)</div>
                <div class="text-h6 font-weight-bold text-teal-darken-4">{{ formatCurrency(totalCostoInventarioSucursal) }}</div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Búsqueda -->
          <v-row dense class="mb-2">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dialogInventarioSucursal.search"
                label="Buscar en inventario de sucursal..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                color="indigo"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Loader -->
          <div v-if="dialogInventarioSucursal.loading" class="d-flex justify-center my-6">
            <v-progress-circular indeterminate color="indigo-darken-4" size="40"></v-progress-circular>
          </div>

          <!-- Tabla de Inventario en Sucursal -->
          <v-table v-else density="compact" class="border rounded">
            <thead class="bg-grey-lighten-4 font-weight-bold">
              <tr>
                <th class="text-left py-2">Código</th>
                <th class="text-left py-2">Producto</th>
                <th class="text-left py-2">Categoría</th>
                <th class="text-center py-2">Cantidad Sucursal</th>
                <th class="text-right py-2">Costo Unit.</th>
                <th class="text-right py-2">Precio Venta</th>
                <th class="text-right py-2">Total Costo</th>
                <th class="text-right py-2">Total Venta</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredInventarioSucursal" :key="item.idProducto">
                <td class="font-weight-medium text-caption">{{ item.codigo }}</td>
                <td class="font-weight-bold text-caption text-indigo-darken-4">{{ item.nombre }}</td>
                <td class="text-caption text-grey-darken-2">{{ item.categoria || 'N/A' }}</td>
                <td class="text-center font-weight-bold text-caption text-indigo-darken-4">{{ item.cantidadTotal }}</td>
                <td class="text-right text-caption">{{ formatCurrency(item.costoUnitario) }}</td>
                <td class="text-right text-caption">{{ formatCurrency(item.precioUnitario) }}</td>
                <td class="text-right font-weight-bold text-caption text-teal-darken-4">{{ formatCurrency(item.totalCosto) }}</td>
                <td class="text-right font-weight-bold text-caption text-blue-darken-4">{{ formatCurrency(item.totalVenta) }}</td>
              </tr>
              <tr v-if="filteredInventarioSucursal.length === 0">
                <td colspan="8" class="text-center py-6 text-grey text-caption">
                  Esta sucursal no tiene mercadería registrada actualmente.
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-3 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            density="comfortable"
            class="rounded font-weight-bold px-4 text-caption"
            @click="dialogInventarioSucursal.show = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ================= DIÁLOGO HISTORIAL DE TRASLADOS / CARGAS SUCURSAL ================= -->
    <v-dialog
      v-model="dialogHistorialSucursal.show"
      max-width="950"
      persistent
      scrollable
    >
      <v-card class="rounded overflow-hidden">
        <v-card-title
          class="bg-indigo-darken-4 text-white font-weight-bold pa-3 d-flex align-center justify-space-between flex-wrap"
        >
          <div class="d-flex align-center">
            <v-icon start class="mr-2">mdi-history</v-icon>
            <span class="text-subtitle-1 font-weight-bold">
              Historial de Traslados: Sucursal {{ dialogHistorialSucursal.sucursal?.nombre }}
            </span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="white" @click="dialogHistorialSucursal.show = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4" style="max-height: 75vh;">
          <!-- Búsqueda -->
          <v-row dense class="mb-2">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dialogHistorialSucursal.search"
                label="Buscar en historial (referencia, bodega origen, usuario)..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                color="indigo"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Loader -->
          <div v-if="dialogHistorialSucursal.loading" class="d-flex justify-center my-6">
            <v-progress-circular indeterminate color="indigo-darken-4" size="40"></v-progress-circular>
          </div>

          <!-- Tabla de Historial -->
          <v-table v-else density="compact" class="border rounded">
            <thead class="bg-grey-lighten-4 font-weight-bold">
              <tr>
                <th class="text-left py-2">Fecha / Hora</th>
                <th class="text-left py-2">Referencia</th>
                <th class="text-left py-2">Bodega Origen</th>
                <th class="text-center py-2">Ítems</th>
                <th class="text-right py-2">Valor Total</th>
                <th class="text-left py-2">Responsable</th>
                <th class="text-left py-2">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredHistorialSucursal" :key="item.idMovInventario">
                <td class="font-weight-medium text-caption">{{ formatDateTime(item.fechaRegistro) }}</td>
                <td class="font-weight-bold text-caption text-indigo-darken-4">{{ item.referencia || '---' }}</td>
                <td class="text-caption">{{ item.bodegaOrigenNombre || '---' }}</td>
                <td class="text-center font-weight-bold text-caption">{{ item.totalItems || 0 }}</td>
                <td class="text-right font-weight-bold text-caption text-teal-darken-4">{{ formatCurrency(item.totalValor) }}</td>
                <td class="text-caption text-grey-darken-3">{{ item.usuarioRegistro || 'Sistema' }}</td>
                <td class="text-caption text-grey-darken-2">{{ item.observaciones || '---' }}</td>
              </tr>
              <tr v-if="filteredHistorialSucursal.length === 0">
                <td colspan="7" class="text-center py-6 text-grey text-caption">
                  No hay registros de traslados anteriores para esta sucursal.
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-3 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            density="comfortable"
            class="rounded font-weight-bold px-4 text-caption"
            @click="dialogHistorialSucursal.show = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ================= DIÁLOGO INVENTARIO CONSOLIDADO DE SUCURSALES (MINIMALISTA) ================= -->
    <v-dialog
      v-model="dialogConsolidadoSucursales.show"
      max-width="1100"
      persistent
      scrollable
    >
      <v-card class="rounded-xl overflow-hidden border bg-white">
        <!-- Header Minimalista y Limpio -->
        <div class="pa-4 bg-white border-b d-flex align-center justify-space-between flex-wrap ga-2">
          <div class="d-flex align-center">
            <v-icon color="indigo-darken-3" size="24" class="mr-2">mdi-storefront</v-icon>
            <div>
              <div class="text-subtitle-1 font-weight-bold text-grey-darken-4 lh-1">
                Inventario Consolidado de Sucursales
              </div>
              <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">
                Valor del inventario por bodega de sucursal y desglose de productos con existencias
              </span>
            </div>
          </div>
          <div class="d-flex align-center ga-2 flex-wrap">
            <v-chip
              v-if="dialogConsolidadoSucursales.data?.fechaGeneracion"
              size="x-small"
              color="grey-lighten-2"
              variant="flat"
              class="text-grey-darken-3 font-weight-medium"
            >
              <v-icon start size="12">mdi-clock-outline</v-icon>
              {{ formatDateTime(dialogConsolidadoSucursales.data.fechaGeneracion) }}
            </v-chip>
            <v-btn
              variant="outlined"
              size="small"
              color="grey-darken-2"
              class="text-none rounded-lg font-weight-medium"
              @click="toggleExpandAllConsolidadoSucursales()"
            >
              <v-icon size="16" class="mr-1">mdi-arrow-expand-vertical</v-icon>
              Expandir / Contraer
            </v-btn>
            <v-btn
              icon="mdi-refresh"
              variant="text"
              size="small"
              color="grey-darken-2"
              :loading="dialogConsolidadoSucursales.loading"
              title="Actualizar datos"
              @click="fetchInformeConsolidadoSucursales()"
            />
            <!--<v-btn
              prepend-icon="mdi-file-excel"
              color="green-darken-3"
              variant="flat"
              size="small"
              class="text-white font-weight-bold text-none rounded-lg"
              :disabled="dialogConsolidadoSucursales.loading || filteredInformeSucursales.length === 0"
              @click="exportarExcelConsolidadoSucursales()"
            >
              Excel
            </v-btn>-->
            <!--<v-btn
              prepend-icon="mdi-printer"
              color="indigo-darken-4"
              variant="flat"
              size="small"
              class="text-white font-weight-bold text-none rounded-lg"
              :disabled="dialogConsolidadoSucursales.loading || filteredInformeSucursales.length === 0"
              @click="imprimirInformeConsolidadoSucursales()"
            >
              PDF
            </v-btn>-->
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              color="grey-darken-2"
              @click="dialogConsolidadoSucursales.show = false"
            />
          </div>
        </div>

        <v-card-text class="pa-4 bg-grey-lighten-5" style="max-height: 80vh;" id="printable-consolidado-sucursales-content">
          <!-- Barra de Filtros y Resumen Minimalista -->
          <v-card variant="flat" class="pa-3 mb-3 rounded-lg border bg-white">
            <v-row dense align="center">
              <v-col cols="12" sm="5" md="4">
                <v-text-field
                  v-model="dialogConsolidadoSucursales.search"
                  placeholder="Buscar producto, código o categoría..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <v-autocomplete
                  v-model="dialogConsolidadoSucursales.filterIdSucursal"
                  :items="sucursalesOptionsInforme"
                  item-title="title"
                  item-value="value"
                  placeholder="Todas las Sucursales"
                  prepend-inner-icon="mdi-storefront"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  hide-details
                  @update:model-value="fetchInformeConsolidadoSucursales()"
                />
              </v-col>
              <v-col cols="12" sm="3" md="5" class="d-flex align-center justify-sm-end ga-3 flex-wrap">
                <div class="text-right">
                  <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">Sucursales</span>
                  <span class="text-body-2 font-weight-bold text-grey-darken-4">{{ resumenInformeConsolidadoSucursales.totalSucursales }}</span>
                </div>
                <v-divider vertical class="my-1" />
                <div class="text-right">
                  <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">Stock Total</span>
                  <span class="text-body-2 font-weight-bold text-indigo-darken-3">{{ resumenInformeConsolidadoSucursales.totalUnidades }} uds</span>
                </div>
                <v-divider vertical class="my-1" />
                <div class="text-right">
                  <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">Valor Inventario</span>
                  <span class="text-subtitle-2 font-weight-bold text-teal-darken-3">{{ formatCurrency(resumenInformeConsolidadoSucursales.totalCosto) }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Loader -->
          <div v-if="dialogConsolidadoSucursales.loading" class="d-flex flex-column align-center justify-center my-10">
            <v-progress-circular indeterminate color="indigo-darken-4" size="40" width="3"></v-progress-circular>
            <span class="text-caption font-weight-medium text-grey-darken-2 mt-3">Cargando existencias consolidadas...</span>
          </div>

          <!-- Listado de Bodegas de Sucursales -->
          <template v-else-if="filteredInformeSucursales.length > 0">
            <v-expansion-panels
              v-model="dialogConsolidadoSucursales.expandedPanels"
              multiple
              variant="accordion"
              class="mb-3"
            >
              <v-expansion-panel
                v-for="(sucursal, idx) in filteredInformeSucursales"
                :key="sucursal.idSucursal || idx"
                class="mb-2 border rounded-lg overflow-hidden bg-white"
                elevation="0"
              >
                <v-expansion-panel-title class="py-2 px-3 bg-white">
                  <template v-slot:default="{ expanded }">
                    <div class="d-flex align-center justify-space-between w-100 pr-2 flex-wrap ga-2">
                      <div class="d-flex align-center">
                        <v-icon color="indigo-darken-3" size="20" class="mr-2">mdi-storefront</v-icon>
                        <div>
                          <div class="text-subtitle-2 font-weight-bold text-grey-darken-4 d-flex align-center">
                            {{ sucursal.nombre }}
                            <v-chip
                              v-if="sucursal.codigo"
                              size="x-small"
                              color="grey-lighten-3"
                              variant="flat"
                              class="ml-2 text-grey-darken-4 font-weight-medium"
                            >
                              {{ sucursal.codigo }}
                            </v-chip>
                            <v-chip
                              v-if="sucursal.esPrincipal"
                              size="x-small"
                              color="amber-darken-4"
                              variant="tonal"
                              class="ml-1 font-weight-bold"
                            >
                              Principal
                            </v-chip>
                          </div>
                          <div class="text-caption text-grey-darken-1" style="font-size: 11px;">
                            Bodega: <strong>{{ sucursal.bodegaNombre || sucursal.codigoBodega || 'Bodega Sucursal' }}</strong>
                          </div>
                        </div>
                      </div>

                      <div class="d-flex align-center ga-4 flex-wrap">
                        <div class="text-right">
                          <span class="text-caption text-grey-darken-1" style="font-size: 10px;">Stock Positivo</span>
                          <div class="text-caption font-weight-bold text-grey-darken-4">
                            {{ sucursal.totalUnidades }} uds ({{ sucursal.productos.length }} prod.)
                          </div>
                        </div>
                        <div class="text-right">
                          <span class="text-caption text-grey-darken-1" style="font-size: 10px;">Valor Inventario</span>
                          <div class="text-caption font-weight-bold text-teal-darken-4" style="font-size: 13px;">
                            {{ formatCurrency(sucursal.valorTotalCosto) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </v-expansion-panel-title>

                <v-expansion-panel-text class="pa-0 border-t">
                  <div class="pa-3">
                    <v-table density="compact" class="border rounded table-consolidado-camion">
                      <thead class="bg-grey-lighten-4">
                        <tr>
                          <th class="text-left py-2 text-grey-darken-3 font-weight-bold">Código</th>
                          <th class="text-left py-2 text-grey-darken-3 font-weight-bold">Producto</th>
                          <th class="text-left py-2 text-grey-darken-3 font-weight-bold">Categoría</th>
                          <th class="text-center py-2 text-grey-darken-3 font-weight-bold">Stock</th>
                          <th class="text-right py-2 text-grey-darken-3 font-weight-bold">Costo Unit.</th>
                          <th class="text-right py-2 text-grey-darken-3 font-weight-bold">Valor Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="prod in sucursal.productos"
                          :key="prod.idProducto"
                          class="hover-row"
                        >
                          <td class="text-caption text-grey-darken-2">{{ prod.codigo || '---' }}</td>
                          <td class="font-weight-medium text-caption text-grey-darken-4">
                            {{ prod.nombre }}
                            <span v-if="prod.unidadMedida" class="text-caption text-grey" style="font-size: 10px;">
                              ({{ prod.unidadMedida }})
                            </span>
                          </td>
                          <td class="text-caption text-grey-darken-2">{{ prod.categoria || '---' }}</td>
                          <td class="text-center font-weight-bold text-caption text-indigo-darken-4">
                            {{ prod.cantidad }}
                          </td>
                          <td class="text-right text-caption">{{ formatCurrency(prod.costoUnitario) }}</td>
                          <td class="text-right font-weight-bold text-caption text-teal-darken-4">
                            {{ formatCurrency(prod.totalCosto) }}
                          </td>
                        </tr>
                        <tr v-if="!sucursal.productos || sucursal.productos.length === 0">
                          <td colspan="6" class="text-center py-4 text-grey text-caption">
                            No hay productos con stock positivo en esta sucursal.
                          </td>
                        </tr>
                      </tbody>
                      <tfoot class="bg-grey-lighten-4 font-weight-bold border-top">
                        <tr>
                          <td colspan="3" class="text-right py-2 text-grey-darken-4">Total {{ sucursal.nombre }}:</td>
                          <td class="text-center py-2 text-indigo-darken-4">{{ sucursal.totalUnidades }}</td>
                          <td></td>
                          <td class="text-right py-2 text-teal-darken-4">{{ formatCurrency(sucursal.valorTotalCosto) }}</td>
                        </tr>
                      </tfoot>
                    </v-table>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Resumen Total al Pie del Informe Minimalista -->
            <v-card variant="flat" class="pa-3 rounded-lg border bg-white mt-3 d-flex justify-space-between align-center flex-wrap ga-2">
              <div class="d-flex align-center">
                <v-icon color="indigo-darken-3" class="mr-2" size="20">mdi-sigma</v-icon>
                <div>
                  <div class="text-subtitle-2 font-weight-bold text-grey-darken-4">TOTAL INVENTARIO CONSOLIDADO</div>
                  <div class="text-caption text-grey-darken-1" style="font-size: 11px;">
                    {{ resumenInformeConsolidadoSucursales.totalSucursales }} sucursales | {{ resumenInformeConsolidadoSucursales.totalProductosDistintos }} productos | {{ resumenInformeConsolidadoSucursales.totalUnidades }} unidades
                  </div>
                </div>
              </div>
              <div class="text-right">
                <span class="text-caption text-grey-darken-1 d-block" style="font-size: 11px;">Valor Total del Inventario</span>
                <span class="text-subtitle-1 font-weight-bold text-teal-darken-4">{{ formatCurrency(resumenInformeConsolidadoSucursales.totalCosto) }}</span>
              </div>
            </v-card>
          </template>

          <!-- No Data View -->
          <v-sheet
            v-else
            class="text-center py-10 rounded-lg border bg-white"
          >
            <v-avatar color="indigo-lighten-5" size="56" class="mb-3">
              <v-icon size="30" color="indigo-darken-3">mdi-storefront-outline</v-icon>
            </v-avatar>
            <h4 class="text-subtitle-2 font-weight-bold text-grey-darken-3">
              No se encontraron datos con existencias activas
            </h4>
            <p class="text-caption text-grey-darken-1 mt-1">
              Verifique los filtros seleccionados o la existencia de productos con stock en las bodegas de sucursal.
            </p>
          </v-sheet>
        </v-card-text>

        <v-divider></v-divider>
        <div class="pa-3 bg-white d-flex justify-space-between align-center flex-wrap ga-2">
          <span class="text-caption text-grey-darken-1">
            Mostrando {{ filteredInformeSucursales.length }} de {{ dialogConsolidadoSucursales.data?.totalSucursales || 0 }} sucursales con existencias
          </span>
          <div class="d-flex ga-2">
            <v-btn
              prepend-icon="mdi-file-excel"
              color="green-darken-3"
              variant="tonal"
              density="comfortable"
              class="rounded-lg font-weight-bold px-3 text-caption text-none"
              :disabled="dialogConsolidadoSucursales.loading || filteredInformeSucursales.length === 0"
              @click="exportarExcelConsolidadoSucursales()"
            >
              Exportar Excel
            </v-btn>
            <v-btn
              prepend-icon="mdi-printer"
              color="indigo-darken-4"
              variant="tonal"
              density="comfortable"
              class="rounded-lg font-weight-bold px-3 text-caption text-none"
              :disabled="dialogConsolidadoSucursales.loading || filteredInformeSucursales.length === 0"
              @click="imprimirInformeConsolidadoSucursales()"
            >
              Imprimir PDF
            </v-btn>
            <v-btn
              color="grey-darken-2"
              variant="outlined"
              density="comfortable"
              class="rounded-lg font-weight-medium px-4 text-caption text-none"
              @click="dialogConsolidadoSucursales.show = false"
            >
              Cerrar
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp'
import { formatters } from '@/helpers/formatters'
import ExcelJS from 'exceljs'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'BodegasManagement',

  data() {
    return {
      activeTab: 'sucursales',
      loading: false,
      requestHttp: new RequestHttp(),

      // Búsquedas y filtros
      searchSucursales: '',
      searchCamiones: '',
      viewModeSucursales: 'grid', // 'grid' | 'list'

      // Listas principales
      sucursales: [],
      camiones: [],
      bodegas: [],

      // Estadísticas
      stats: {
        sucursales: 0,
        camiones: 0,
        bodegas: 0
      },

      // Catálogos auxiliares
      catalogos: {
        departamentos: [],
        municipios: []
      },
      selectedDepartamento: null,

      // Formularios válidos
      formValidSucursal: false,
      formValidCamion: false,

      // Diálogos modales
      dialogSucursal: {
        show: false,
        editar: false,
        title: '',
        loading: false,
        item: {
          idSucursal: 0,
          idMunicipio: null,
          codigo: '',
          nombre: '',
          direccion: '',
          telefono: '',
          email: null,
          esPrincipal: false
        }
      },

      dialogCamion: {
        show: false,
        editar: false,
        title: '',
        loading: false,
        item: {
          idCamion: 0,
          placa: '',
          nombreBodega: ''
        }
      },

      // Diálogo de Traslado / Carga a Camión
      dialogTraslado: {
        show: false,
        loadingStock: false,
        saving: false,
        camion: null,
        idBodegaOrigen: null,
        observaciones: '',
        detalles: [],
        selectedProducto: null,
        selectedCantidad: 1
      },
      bodegaOrigenStock: [],

      // Diálogo de Inventario a Bordo
      dialogInventarioCamion: {
        show: false,
        loading: false,
        camion: null,
        search: '',
        items: []
      },

      // Diálogo de Historial de Cargas
      dialogHistorialCargas: {
        show: false,
        loading: false,
        camion: null,
        search: '',
        items: []
      },

      // Diálogo de Inventario Consolidado de Camiones
      dialogConsolidado: {
        show: false,
        loading: false,
        filterIdCamion: null,
        soloConStock: true,
        search: '',
        data: null,
        expandedPanels: []
      },

      // Diálogo de Traslado a Sucursal
      dialogTrasladoSucursal: {
        show: false,
        loadingStock: false,
        saving: false,
        sucursal: null,
        idBodegaOrigen: null,
        observaciones: '',
        detalles: [],
        selectedProducto: null,
        selectedCantidad: 1
      },
      bodegaOrigenSucursalStock: [],

      // Diálogo de Inventario en Sucursal
      dialogInventarioSucursal: {
        show: false,
        loading: false,
        sucursal: null,
        search: '',
        items: []
      },

      // Diálogo de Historial de Traslados Sucursal
      dialogHistorialSucursal: {
        show: false,
        loading: false,
        sucursal: null,
        search: '',
        items: []
      },

      // Diálogo de Inventario Consolidado de Sucursales
      dialogConsolidadoSucursales: {
        show: false,
        loading: false,
        filterIdSucursal: null,
        soloConStock: true,
        search: '',
        data: null,
        expandedPanels: []
      },

      // Alertas
      alert: {
        show: false,
        text: '',
        color: 'success',
        icon: 'mdi-check-circle'
      }
    }
  },

  computed: {
    filteredSucursales() {
      let list = [...this.sucursales]
      if (this.searchSucursales) {
        const search = this.searchSucursales
          .toLowerCase()
          .trim()
        list = list.filter(
          (s) =>
            s.nombre
              .toLowerCase()
              .includes(search) ||
            (s.codigo &&
              s.codigo
                .toLowerCase()
                .includes(search)) ||
            (s.municipio &&
              s.municipio
                .toLowerCase()
                .includes(search))
        )
      }
      return list.sort((a, b) => {
        const codA = a.codigo || ''
        const codB = b.codigo || ''
        return codB.localeCompare(codA, undefined, { numeric: true, sensitivity: 'base' })
      })
    },

    filteredCamiones() {
      if (!this.searchCamiones)
        return this.camiones
      const search = this.searchCamiones
        .toLowerCase()
        .trim()
      return this.camiones.filter((c) =>
        (c.placa && c.placa.toLowerCase().includes(search)) ||
        (c.bodegaNombre && c.bodegaNombre.toLowerCase().includes(search)) ||
        (c.nombreBodega && c.nombreBodega.toLowerCase().includes(search))
      )
    },

    bodegasOrigenOptions() {
      const destId = this.dialogTraslado.camion?.idBodega
      return this.bodegas.filter((b) => b.estado && b.idBodega !== destId)
    },

    totalUnidadesTraslado() {
      return this.dialogTraslado.detalles.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0)
    },

    totalValorTraslado() {
      return this.dialogTraslado.detalles.reduce((acc, item) => acc + ((Number(item.cantidad) || 0) * (Number(item.costo) || 0)), 0)
    },

    filteredInventarioCamion() {
      let list = [...this.dialogInventarioCamion.items]
      if (this.dialogInventarioCamion.search) {
        const s = this.dialogInventarioCamion.search.toLowerCase().trim()
        list = list.filter((i) =>
          (i.codigo && i.codigo.toLowerCase().includes(s)) ||
          (i.nombre && i.nombre.toLowerCase().includes(s)) ||
          (i.categoria && i.categoria.toLowerCase().includes(s))
        )
      }
      return list
    },

    totalUnidadesInventarioCamion() {
      return this.dialogInventarioCamion.items.reduce((acc, i) => acc + (Number(i.cantidadTotal) || 0), 0)
    },

    totalCostoInventarioCamion() {
      return this.dialogInventarioCamion.items.reduce((acc, i) => acc + (Number(i.totalCosto) || 0), 0)
    },

    totalVentaInventarioCamion() {
      return this.dialogInventarioCamion.items.reduce((acc, i) => acc + (Number(i.totalVenta) || 0), 0)
    },

    filteredHistorialCargas() {
      let list = [...this.dialogHistorialCargas.items]
      if (this.dialogHistorialCargas.search) {
        const s = this.dialogHistorialCargas.search.toLowerCase().trim()
        list = list.filter((h) =>
          (h.referencia && h.referencia.toLowerCase().includes(s)) ||
          (h.bodegaOrigenNombre && h.bodegaOrigenNombre.toLowerCase().includes(s)) ||
          (h.usuarioRegistro && h.usuarioRegistro.toLowerCase().includes(s)) ||
          (h.observaciones && h.observaciones.toLowerCase().includes(s))
        )
      }
      return list
    },

    usuarioLogueado() {
      return (
        localStorage.getItem('name') || 'Admin'
      )
    },

    camionesOptionsInforme() {
      const options = [{ title: 'Todos los Camiones', value: null }]
      if (this.camiones && this.camiones.length > 0) {
        this.camiones.forEach((c) => {
          options.push({
            title: `Camión ${c.placa}${c.bodegaNombre ? ' (' + c.bodegaNombre + ')' : ''}`,
            value: c.idCamion
          })
        })
      }
      return options
    },

    filteredInformeCamiones() {
      if (!this.dialogConsolidado.data?.camiones) return []
      let list = this.dialogConsolidado.data.camiones

      return list
        .map((c) => {
          let productos = (c.productos || []).filter(
            (p) => Number(p.cantidad) > 0
          )

          if (this.dialogConsolidado.search) {
            const s = this.dialogConsolidado.search.toLowerCase().trim()
            const placaMatch = c.placa?.toLowerCase().includes(s)
            const bodegaMatch =
              c.bodegaNombre?.toLowerCase().includes(s) ||
              c.codigoBodega?.toLowerCase().includes(s)

            if (!placaMatch && !bodegaMatch) {
              productos = productos.filter(
                (p) =>
                  p.nombre?.toLowerCase().includes(s) ||
                  p.codigo?.toLowerCase().includes(s) ||
                  p.categoria?.toLowerCase().includes(s)
              )
            }
          }

          if (productos.length === 0) return null

          const valorCosto = productos.reduce(
            (sum, p) => sum + (Number(p.totalCosto) || 0),
            0
          )
          const valorVenta = productos.reduce(
            (sum, p) => sum + (Number(p.totalVenta) || 0),
            0
          )
          const totalUnidades = productos.reduce(
            (sum, p) => sum + (Number(p.cantidad) || 0),
            0
          )

          return {
            ...c,
            productos,
            totalProductos: productos.length,
            totalUnidades,
            valorTotalCosto: valorCosto,
            valorTotalVenta: valorVenta
          }
        })
        .filter(Boolean)
    },

    resumenInformeConsolidado() {
      const camiones = this.filteredInformeCamiones
      const totalCamiones = camiones.length
      const totalUnidades = camiones.reduce(
        (sum, c) => sum + (Number(c.totalUnidades) || 0),
        0
      )
      const totalCosto = camiones.reduce(
        (sum, c) => sum + (Number(c.valorTotalCosto) || 0),
        0
      )
      const totalVenta = camiones.reduce(
        (sum, c) => sum + (Number(c.valorTotalVenta) || 0),
        0
      )

      const allProdIds = new Set()
      camiones.forEach((c) => {
        ;(c.productos || []).forEach((p) => allProdIds.add(p.idProducto))
      })

      return {
        totalCamiones,
        totalProductosDistintos: allProdIds.size,
        totalUnidades,
        totalCosto,
        totalVenta
      }
    },

    // ================= COMPUTED SUCURSALES =================
    bodegasOrigenSucursalOptions() {
      const destId = this.dialogTrasladoSucursal.sucursal?.idBodega
      return this.bodegas.filter((b) => b.estado && b.idBodega !== destId)
    },

    totalUnidadesTrasladoSucursal() {
      return this.dialogTrasladoSucursal.detalles.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0)
    },

    totalValorTrasladoSucursal() {
      return this.dialogTrasladoSucursal.detalles.reduce((acc, item) => acc + ((Number(item.cantidad) || 0) * (Number(item.costo) || 0)), 0)
    },

    filteredInventarioSucursal() {
      let list = [...this.dialogInventarioSucursal.items]
      if (this.dialogInventarioSucursal.search) {
        const s = this.dialogInventarioSucursal.search.toLowerCase().trim()
        list = list.filter((i) =>
          (i.codigo && i.codigo.toLowerCase().includes(s)) ||
          (i.nombre && i.nombre.toLowerCase().includes(s)) ||
          (i.categoria && i.categoria.toLowerCase().includes(s))
        )
      }
      return list
    },

    totalUnidadesInventarioSucursal() {
      return this.dialogInventarioSucursal.items.reduce((acc, i) => acc + (Number(i.cantidadTotal) || 0), 0)
    },

    totalCostoInventarioSucursal() {
      return this.dialogInventarioSucursal.items.reduce((acc, i) => acc + (Number(i.totalCosto) || 0), 0)
    },

    totalVentaInventarioSucursal() {
      return this.dialogInventarioSucursal.items.reduce((acc, i) => acc + (Number(i.totalVenta) || 0), 0)
    },

    filteredHistorialSucursal() {
      let list = [...this.dialogHistorialSucursal.items]
      if (this.dialogHistorialSucursal.search) {
        const s = this.dialogHistorialSucursal.search.toLowerCase().trim()
        list = list.filter((h) =>
          (h.referencia && h.referencia.toLowerCase().includes(s)) ||
          (h.bodegaOrigenNombre && h.bodegaOrigenNombre.toLowerCase().includes(s)) ||
          (h.usuarioRegistro && h.usuarioRegistro.toLowerCase().includes(s)) ||
          (h.observaciones && h.observaciones.toLowerCase().includes(s))
        )
      }
      return list
    },

    sucursalesOptionsInforme() {
      const options = [{ title: 'Todas las Sucursales', value: null }]
      if (this.sucursales && this.sucursales.length > 0) {
        this.sucursales.forEach((s) => {
          options.push({
            title: `Sucursal ${s.nombre}${s.codigo ? ' (' + s.codigo + ')' : ''}`,
            value: s.idSucursal
          })
        })
      }
      return options
    },

    filteredInformeSucursales() {
      if (!this.dialogConsolidadoSucursales.data?.sucursales) return []
      let list = this.dialogConsolidadoSucursales.data.sucursales

      return list
        .map((suc) => {
          let productos = (suc.productos || []).filter(
            (p) => Number(p.cantidad) > 0
          )

          if (this.dialogConsolidadoSucursales.search) {
            const s = this.dialogConsolidadoSucursales.search.toLowerCase().trim()
            const nombreMatch = suc.nombre?.toLowerCase().includes(s)
            const codigoMatch = suc.codigo?.toLowerCase().includes(s)
            const bodegaMatch =
              suc.bodegaNombre?.toLowerCase().includes(s) ||
              suc.codigoBodega?.toLowerCase().includes(s)

            if (!nombreMatch && !codigoMatch && !bodegaMatch) {
              productos = productos.filter(
                (p) =>
                  p.nombre?.toLowerCase().includes(s) ||
                  p.codigo?.toLowerCase().includes(s) ||
                  p.categoria?.toLowerCase().includes(s)
              )
            }
          }

          if (productos.length === 0) return null

          const valorCosto = productos.reduce(
            (sum, p) => sum + (Number(p.totalCosto) || 0),
            0
          )
          const valorVenta = productos.reduce(
            (sum, p) => sum + (Number(p.totalVenta) || 0),
            0
          )
          const totalUnidades = productos.reduce(
            (sum, p) => sum + (Number(p.cantidad) || 0),
            0
          )

          return {
            ...suc,
            productos,
            totalProductos: productos.length,
            totalUnidades,
            valorTotalCosto: valorCosto,
            valorTotalVenta: valorVenta
          }
        })
        .filter(Boolean)
    },

    resumenInformeConsolidadoSucursales() {
      const sucursales = this.filteredInformeSucursales
      const totalSucursales = sucursales.length
      const totalUnidades = sucursales.reduce(
        (sum, c) => sum + (Number(c.totalUnidades) || 0),
        0
      )
      const totalCosto = sucursales.reduce(
        (sum, c) => sum + (Number(c.valorTotalCosto) || 0),
        0
      )
      const totalVenta = sucursales.reduce(
        (sum, c) => sum + (Number(c.valorTotalVenta) || 0),
        0
      )

      const allProdIds = new Set()
      sucursales.forEach((c) => {
        ;(c.productos || []).forEach((p) => allProdIds.add(p.idProducto))
      })

      return {
        totalSucursales,
        totalProductosDistintos: allProdIds.size,
        totalUnidades,
        totalCosto,
        totalVenta
      }
    }
  },

  methods: {
    formatCurrency(val) {
      return formatters.formatCurrency(val || 0, 'NIO')
    },

    formatDate(dateString) {
      if (!dateString) return '---'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    formatDateTime(dateString) {
      if (!dateString) return '---'
      const date = new Date(dateString)
      return date.toLocaleString('es-NI', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    // Alertas
    showSnackbar(text, color = 'success') {
      this.alert.text = text
      this.alert.color = color
      this.alert.icon =
        color === 'success'
          ? 'mdi-check-circle'
          : 'mdi-alert-circle'
      this.alert.show = true
    },

    // Carga inicial de datos
    async loadAllData() {
      this.loading = true
      try {
        await Promise.all([
          this.fetchSucursales(),
          this.fetchCamiones(),
          this.fetchBodegas(),
          this.fetchDepartamentos()
        ])
        this.calculateStats()
      } catch (error) {
        this.showSnackbar(
          'Error al conectar con la base de datos.',
          'error'
        )
      } finally {
        this.loading = false
      }
    },

    async fetchSucursales() {
      const res =
        await this.requestHttp.getSucursales()
      if (res.code === 200 && Array.isArray(res.data)) {
        this.sucursales = res.data.sort((a, b) => {
          const codA = a.codigo || ''
          const codB = b.codigo || ''
          return codB.localeCompare(codA, undefined, { numeric: true, sensitivity: 'base' })
        })
      }
    },

    async fetchCamiones() {
      const res =
        await this.requestHttp.getCamiones()
      if (res.code === 200) {
        this.camiones = res.data
      }
    },

    async fetchBodegas() {
      const res =
        await this.requestHttp.getBodegas()
      if (res.code === 200 && Array.isArray(res.data)) {
        this.bodegas = res.data.sort((a, b) => {
          const codA = a.codigo || ''
          const codB = b.codigo || ''
          return codB.localeCompare(codA, undefined, { numeric: true, sensitivity: 'base' })
        })
      }
    },

    async fetchDepartamentos() {
      const res =
        await this.requestHttp.getDepartamentos()
      if (res.code === 200) {
        this.catalogos.departamentos = res.data
      }
    },

    // Municipios dependientes de Departamento
    async onDepartamentoChange(idDept) {
      this.catalogos.municipios = []
      this.dialogSucursal.item.idMunicipio = null
      if (!idDept) return

      const res =
        await this.requestHttp.getMunById(idDept)
      if (res.code === 200) {
        this.catalogos.municipios = res.data
      }
    },

    calculateStats() {
      this.stats.sucursales =
        this.sucursales.filter(
          (s) => s.estado
        ).length
      this.stats.camiones = this.camiones.filter(
        (c) => c.estado
      ).length
      this.stats.bodegas = this.bodegas.filter(
        (b) => b.estado
      ).length
    },

    // DIÁLOGOS SUCURSAL
    async openDialogSucursal(item = null) {
      if (item) {
        this.selectedDepartamento =
          item.idDepartamento || null
        this.catalogos.municipios = []

        if (this.selectedDepartamento) {
          const resMun =
            await this.requestHttp.getMunById(
              this.selectedDepartamento
            )
          if (resMun.code === 200) {
            this.catalogos.municipios =
              resMun.data
          }
        }

        this.dialogSucursal.editar = true
        this.dialogSucursal.title =
          'Editar Sucursal'
        this.dialogSucursal.item = {
          idSucursal: item.idSucursal,
          idMunicipio: item.idMunicipio,
          codigo: item.codigo,
          nombre: item.nombre,
          direccion: item.direccion,
          telefono: item.telefono,
          email: item.email,
          esPrincipal: item.esPrincipal
        }
      } else {
        this.selectedDepartamento = null
        this.catalogos.municipios = []
        this.dialogSucursal.editar = false
        this.dialogSucursal.title =
          'Nueva Sucursal'
        this.dialogSucursal.item = {
          idSucursal: 0,
          idMunicipio: null,
          codigo: '',
          nombre: '',
          direccion: '',
          telefono: '',
          email: '',
          esPrincipal: false
        }

        const resCod =
          await this.requestHttp.getCodigoRecomendadoSucursal()
        if (resCod.code === 200) {
          this.dialogSucursal.item.codigo =
            resCod.data
        }
      }
      this.dialogSucursal.show = true
    },

    async saveSucursal() {
      if (!this.formValidSucursal) return

      this.dialogSucursal.loading = true
      const payload = {
        ...this.dialogSucursal.item,
        codigo: this.dialogSucursal.item.codigo?.trim() || null,
        direccion: this.dialogSucursal.item.direccion?.trim() || null,
        telefono: this.dialogSucursal.item.telefono?.trim() || null,
        email: this.dialogSucursal.item.email?.trim() || null,
        usuarioRegistro: this.usuarioLogueado
      }

      try {
        let res
        if (this.dialogSucursal.editar) {
          res =
            await this.requestHttp.putSucursal(
              payload,
              this.dialogSucursal.item.idSucursal
            )
        } else {
          res =
            await this.requestHttp.postSucursal(
              payload
            )
        }

        if (res.code === 200) {
          this.showSnackbar(
            this.dialogSucursal.editar
              ? 'Sucursal actualizada correctamente.'
              : 'Sucursal y Bodega asociadas creadas correctamente.'
          )
          this.dialogSucursal.show = false
          await this.loadAllData()
        } else {
          this.showSnackbar(
            res.data?.msg ||
              res.data ||
              'Error al guardar la sucursal.',
            'error'
          )
        }
      } catch (err) {
        this.showSnackbar(
          'Error de conexión al servidor.',
          'error'
        )
      } finally {
        this.dialogSucursal.loading = false
      }
    },

    async toggleEstadoSucursal(item) {
      if (item.esPrincipal && item.estado) {
        this.showSnackbar(
          'No se puede desactivar la sucursal principal activa.',
          'error'
        )
        return
      }

      try {
        const res =
          await this.requestHttp.deleteSucursal(
            item.idSucursal,
            this.usuarioLogueado
          )
        if (res.code === 200) {
          this.showSnackbar(
            res.data?.msg ||
              'Estado de sucursal actualizado.'
          )
          await this.loadAllData()
        } else {
          this.showSnackbar(
            res.data?.ex ||
              'No se pudo cambiar el estado.',
            'error'
          )
        }
      } catch (err) {
        this.showSnackbar(
          'Error al actualizar estado.',
          'error'
        )
      }
    },

    // DIÁLOGOS CAMIÓN
    openDialogCamion(item = null) {
      if (item) {
        this.dialogCamion.editar = true
        this.dialogCamion.title = 'Editar Camión y Bodega'
        this.dialogCamion.item = {
          idCamion: item.idCamion,
          placa: item.placa,
          nombreBodega: item.bodegaNombre || item.nombreBodega || `Bodega Camión ${item.placa}`
        }
      } else {
        this.dialogCamion.editar = false
        this.dialogCamion.title = 'Nuevo Camión y Bodega'
        this.dialogCamion.item = {
          idCamion: 0,
          placa: '',
          nombreBodega: ''
        }
      }
      this.dialogCamion.show = true
    },

    async saveCamion() {
      if (!this.formValidCamion) return

      this.dialogCamion.loading = true
      const payload = {
        placa: this.dialogCamion.item.placa,
        nombreBodega: this.dialogCamion.item.nombreBodega,
        usuarioRegistro: this.usuarioLogueado
      }

      try {
        let res
        if (this.dialogCamion.editar) {
          res = await this.requestHttp.putCamion(
            payload,
            this.dialogCamion.item.idCamion
          )
        } else {
          res =
            await this.requestHttp.postCamion(
              payload
            )
        }

        if (res.code === 200) {
          this.showSnackbar(
            this.dialogCamion.editar
              ? 'Camión actualizado correctamente.'
              : 'Camión y Bodega asociada creadas correctamente.'
          )
          this.dialogCamion.show = false
          await this.loadAllData()
        } else {
          this.showSnackbar(
            res.data?.msg ||
              res.data ||
              'Error al registrar el camión.',
            'error'
          )
        }
      } catch (err) {
        this.showSnackbar(
          'Error de conexión al servidor.',
          'error'
        )
      } finally {
        this.dialogCamion.loading = false
      }
    },

    async toggleEstadoCamion(item) {
      try {
        const res =
          await this.requestHttp.deleteCamion(
            item.idCamion,
            this.usuarioLogueado
          )
        if (res.code === 200) {
          this.showSnackbar(
            res.data?.msg ||
              'Estado del camión actualizado.'
          )
          await this.loadAllData()
        } else {
          this.showSnackbar(
            res.data?.ex ||
              'No se pudo cambiar el estado.',
            'error'
          )
        }
      } catch (err) {
        this.showSnackbar(
          'Error al actualizar el estado.',
          'error'
        )
      }
    },

    // ================= MÉTODOS TRASLADO / CARGA A CAMIÓN =================
    async openDialogTraslado(camion) {
      this.dialogTraslado.camion = camion
      this.dialogTraslado.idBodegaOrigen = null
      this.dialogTraslado.observaciones = ''
      this.dialogTraslado.detalles = []
      this.dialogTraslado.selectedProducto = null
      this.dialogTraslado.selectedCantidad = 1
      this.bodegaOrigenStock = []

      // Auto-seleccionar bodega principal si está disponible o la primera bodega activa diferente al camión
      const principal = this.bodegas.find((b) => b.esPrincipal && b.idBodega !== camion.idBodega)
      if (principal) {
        this.dialogTraslado.idBodegaOrigen = principal.idBodega
        await this.onBodegaOrigenChange(principal.idBodega)
      } else {
        const first = this.bodegas.find((b) => b.estado && b.idBodega !== camion.idBodega)
        if (first) {
          this.dialogTraslado.idBodegaOrigen = first.idBodega
          await this.onBodegaOrigenChange(first.idBodega)
        }
      }

      this.dialogTraslado.show = true
    },

    async onBodegaOrigenChange(idBodega) {
      this.dialogTraslado.detalles = []
      this.dialogTraslado.selectedProducto = null
      this.dialogTraslado.selectedCantidad = 1
      this.bodegaOrigenStock = []

      if (!idBodega) return

      this.dialogTraslado.loadingStock = true
      try {
        const res = await this.requestHttp.getBodegaStock(idBodega)
        if (res && res.code === 200 && Array.isArray(res.data)) {
          this.bodegaOrigenStock = res.data
            .map((item) => ({
              ...item,
              stockDisponible: Number(item.cantidadTotal ?? item.cantidadTotalBodega ?? item.stockDisponible ?? 0)
            }))
            .filter((item) => Number(item.stockDisponible) > 0)
        }
      } catch (err) {
        this.showSnackbar('Error al obtener el stock de la bodega seleccionada.', 'error')
      } finally {
        this.dialogTraslado.loadingStock = false
      }
    },

    onProductoSelected(prod) {
      if (prod) {
        this.dialogTraslado.selectedCantidad = 1
      }
    },

    agregarProductoATraslado() {
      const prod = this.dialogTraslado.selectedProducto
      const cant = Number(this.dialogTraslado.selectedCantidad)

      if (!prod) {
        this.showSnackbar('Por favor selecciona un producto.', 'warning')
        return
      }
      if (!cant || cant <= 0) {
        this.showSnackbar('La cantidad a trasladar debe ser mayor a 0.', 'warning')
        return
      }
      if (cant > prod.stockDisponible) {
        this.showSnackbar(`La cantidad (${cant}) excede el stock disponible (${prod.stockDisponible}).`, 'error')
        return
      }

      const existingIndex = this.dialogTraslado.detalles.findIndex((d) => d.idProducto === prod.idProducto)
      if (existingIndex >= 0) {
        const newTotalCant = Number(this.dialogTraslado.detalles[existingIndex].cantidad) + cant
        if (newTotalCant > prod.stockDisponible) {
          this.showSnackbar(`El acumulado (${newTotalCant}) excede el stock disponible (${prod.stockDisponible}).`, 'error')
          return
        }
        this.dialogTraslado.detalles[existingIndex].cantidad = newTotalCant
        this.dialogTraslado.detalles[existingIndex].subtotalCosto = newTotalCant * Number(prod.costo || 0)
      } else {
        this.dialogTraslado.detalles.push({
          idProducto: prod.idProducto,
          codigo: prod.codigo,
          nombre: prod.nombre,
          categoria: prod.categoria,
          cantidad: cant,
          stockDisponible: prod.stockDisponible,
          costo: Number(prod.costo || 0),
          precio: Number(prod.precio || 0),
          subtotalCosto: cant * Number(prod.costo || 0),
          observaciones: null
        })
      }

      this.dialogTraslado.selectedProducto = null
      this.dialogTraslado.selectedCantidad = 1
    },

    eliminarDetalleTraslado(index) {
      this.dialogTraslado.detalles.splice(index, 1)
    },

    async saveTraslado() {
      if (!this.dialogTraslado.idBodegaOrigen) {
        this.showSnackbar('Debe seleccionar una bodega de origen.', 'warning')
        return
      }
      if (!this.dialogTraslado.camion?.idBodega) {
        this.showSnackbar('El camión no tiene una bodega asignada válida.', 'error')
        return
      }
      if (this.dialogTraslado.detalles.length === 0) {
        this.showSnackbar('Debe agregar al menos un producto a la carga.', 'warning')
        return
      }

      this.dialogTraslado.saving = true
      const payload = {
        idBodegaOrigen: this.dialogTraslado.idBodegaOrigen,
        idBodegaDestino: this.dialogTraslado.camion.idBodega,
        observaciones: this.dialogTraslado.observaciones || null,
        usuarioRegistro: this.usuarioLogueado,
        detalles: this.dialogTraslado.detalles.map((d) => ({
          idProducto: d.idProducto,
          cantidad: Number(d.cantidad),
          observaciones: d.observaciones || null
        }))
      }

      try {
        const res = await this.requestHttp.postTraslado(payload)
        if (res.code === 200) {
          this.showSnackbar('Carga trasladada exitosamente al camión.')
          this.dialogTraslado.show = false
          await this.loadAllData()
        } else {
          this.showSnackbar(res.data?.msg || res.data || 'Error al procesar el traslado.', 'error')
        }
      } catch (err) {
        this.showSnackbar('Error de conexión al procesar el traslado.', 'error')
      } finally {
        this.dialogTraslado.saving = false
      }
    },

    // ================= MÉTODOS INVENTARIO DEL CAMIÓN =================
    async openDialogInventarioCamion(camion) {
      this.dialogInventarioCamion.camion = camion
      this.dialogInventarioCamion.search = ''
      this.dialogInventarioCamion.items = []
      this.dialogInventarioCamion.show = true
      this.dialogInventarioCamion.loading = true

      try {
        const res = await this.requestHttp.getCamionInventario(camion.idCamion)
        if (res.code === 200 && Array.isArray(res.data)) {
          this.dialogInventarioCamion.items = res.data
        }
      } catch (err) {
        this.showSnackbar('Error al cargar inventario del camión.', 'error')
      } finally {
        this.dialogInventarioCamion.loading = false
      }
    },

    // ================= MÉTODOS HISTORIAL DE CARGAS =================
    async openDialogHistorialCargas(camion) {
      this.dialogHistorialCargas.camion = camion
      this.dialogHistorialCargas.search = ''
      this.dialogHistorialCargas.items = []
      this.dialogHistorialCargas.show = true
      this.dialogHistorialCargas.loading = true

      try {
        const res = await this.requestHttp.getCamionHistorialCargas(camion.idCamion)
        if (res.code === 200 && Array.isArray(res.data)) {
          this.dialogHistorialCargas.items = res.data
        }
      } catch (err) {
        this.showSnackbar('Error al cargar historial del camión.', 'error')
      } finally {
        this.dialogHistorialCargas.loading = false
      }
    },

    // ================= MÉTODOS INFORME CONSOLIDADO =================
    async openDialogConsolidado(idCamion = null) {
      this.dialogConsolidado.filterIdCamion = idCamion
      this.dialogConsolidado.search = ''
      this.dialogConsolidado.show = true
      await this.fetchInformeConsolidado()
    },

    async fetchInformeConsolidado() {
      try {
        this.dialogConsolidado.loading = true
        const params = {
          soloConStock: this.dialogConsolidado.soloConStock
        }
        if (this.dialogConsolidado.filterIdCamion) {
          params.idCamion = this.dialogConsolidado.filterIdCamion
        }
        const res = await this.requestHttp.getInformeStockCamiones(params)
        if (res.code === 200 && res.data) {
          this.dialogConsolidado.data = res.data
          this.dialogConsolidado.expandedPanels = (res.data.camiones || []).map(
            (_, i) => i
          )
        } else {
          this.showSnackbar(
            res.data?.msg || 'Error al cargar informe consolidado',
            'error'
          )
        }
      } catch (err) {
        console.error('Error al obtener informe consolidado:', err)
        this.showSnackbar('Error de conexión al cargar el informe', 'error')
      } finally {
        this.dialogConsolidado.loading = false
      }
    },

    toggleExpandAllConsolidado() {
      const total = this.filteredInformeCamiones.length
      if (this.dialogConsolidado.expandedPanels.length === total) {
        this.dialogConsolidado.expandedPanels = []
      } else {
        this.dialogConsolidado.expandedPanels = this.filteredInformeCamiones.map(
          (_, i) => i
        )
      }
    },

    imprimirInformeConsolidado() {
      const camiones = this.filteredInformeCamiones
      if (!camiones || camiones.length === 0) {
        this.showSnackbar('No hay datos disponibles para generar el PDF.', 'warning')
        return
      }

      try {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()

        const primaryColor = [26, 35, 126] // Indigo #1A237E
        const darkColor = [30, 41, 59] // Slate #1E293B
        const tealColor = [0, 105, 92] // Teal #00695C
        const lightBg = [248, 250, 252] // #F8FAFC
        const borderGray = [226, 232, 240] // #E2E8F0

        // Header Top Line
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.rect(0, 0, pageWidth, 4, 'F')

        // Title Header Minimalista
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text('INVENTARIO CONSOLIDADO DE CAMIONES', 14, 13)

        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text('S.I. TOKES — REPORTE DE CARGA Y VALORIZACIÓN POR CAMIÓN', 14, 18)

        // Right Info Header
        doc.setFontSize(8)
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
        const fechaGen = this.dialogConsolidado.data?.fechaGeneracion
          ? this.formatDateTime(this.dialogConsolidado.data.fechaGeneracion)
          : new Date().toLocaleString('es-NI')
        doc.text(`Generado: ${fechaGen}`, pageWidth - 14, 13, { align: 'right' })

        const filtroCamion = this.dialogConsolidado.filterIdCamion
          ? this.camiones.find((c) => c.idCamion === this.dialogConsolidado.filterIdCamion)?.placa || 'Filtrado'
          : 'Todos los camiones'
        doc.text(`Filtro: ${filtroCamion}`, pageWidth - 14, 18, { align: 'right' })

        // Horizontal divider
        doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2])
        doc.setLineWidth(0.4)
        doc.line(14, 21, pageWidth - 14, 21)

        // KPI Summary Box
        let currentY = 24
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2])
        doc.roundedRect(14, currentY, pageWidth - 28, 14, 1.5, 1.5, 'F')
        doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2])
        doc.setLineWidth(0.3)
        doc.roundedRect(14, currentY, pageWidth - 28, 14, 1.5, 1.5, 'S')

        const totalCamiones = this.resumenInformeConsolidado.totalCamiones
        const totalUnidades = this.resumenInformeConsolidado.totalUnidades
        const totalValor = this.formatCurrency(this.resumenInformeConsolidado.totalCosto)

        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text('Camiones con Carga:', 20, currentY + 6)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
        doc.text(`${totalCamiones}`, 20, currentY + 11)

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text('Stock Total en Ruta:', 75, currentY + 6)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text(`${totalUnidades} unidades`, 75, currentY + 11)

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text('VALOR TOTAL INVENTARIO:', pageWidth - 80, currentY + 6)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(tealColor[0], tealColor[1], tealColor[2])
        doc.setFontSize(10)
        doc.text(totalValor, pageWidth - 20, currentY + 11, { align: 'right' })

        currentY += 19

        // Iterar sobre cada camión y crear su tabla
        camiones.forEach((camion) => {
          if (currentY > pageHeight - 35) {
            doc.addPage()
            currentY = 15
          }

          // Camion Header Title Box
          doc.setFillColor(241, 245, 249)
          doc.roundedRect(14, currentY, pageWidth - 28, 7.5, 1, 1, 'F')

          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          const camTitle = `Camión Placa: ${camion.placa} — ${camion.bodegaNombre || camion.codigoBodega || 'Bodega Móvil'}`
          doc.text(camTitle, 17, currentY + 5)

          doc.setFontSize(8)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(tealColor[0], tealColor[1], tealColor[2])
          const camTotalText = `Stock: ${camion.totalUnidades} uds  |  Valor: ${this.formatCurrency(camion.valorTotalCosto)}`
          doc.text(camTotalText, pageWidth - 17, currentY + 5, { align: 'right' })

          currentY += 9

          // Table Rows
          const headers = [['#', 'Código', 'Producto', 'Categoría', 'Stock', 'Costo Unit.', 'Valor Total']]
          const rows = (camion.productos || []).map((p, pIdx) => [
            (pIdx + 1).toString(),
            p.codigo || '—',
            `${p.nombre}${p.unidadMedida ? ' (' + p.unidadMedida + ')' : ''}`,
            p.categoria || '—',
            p.cantidad.toString(),
            this.formatCurrency(p.costoUnitario),
            this.formatCurrency(p.totalCosto)
          ])

          const footRows = [[
            '',
            '',
            `Total Camión ${camion.placa}:`,
            '',
            camion.totalUnidades.toString(),
            '',
            this.formatCurrency(camion.valorTotalCosto)
          ]]

          doc.autoTable({
            startY: currentY,
            head: headers,
            body: rows,
            foot: footRows,
            theme: 'plain',
            styles: {
              fontSize: 7.5,
              cellPadding: 1.8,
              textColor: darkColor,
              lineColor: borderGray,
              lineWidth: 0.2
            },
            headStyles: {
              fillColor: [241, 245, 249],
              textColor: [15, 23, 42],
              fontStyle: 'bold',
              fontSize: 7.5
            },
            footStyles: {
              fillColor: [248, 250, 252],
              textColor: primaryColor,
              fontStyle: 'bold',
              fontSize: 7.5
            },
            columnStyles: {
              0: { halign: 'center', cellWidth: 8 },
              1: { halign: 'left', cellWidth: 22 },
              2: { halign: 'left' },
              3: { halign: 'left', cellWidth: 32 },
              4: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
              5: { halign: 'right', cellWidth: 22 },
              6: { halign: 'right', cellWidth: 26, fontStyle: 'bold', textColor: tealColor }
            },
            margin: { left: 14, right: 14 }
          })

          currentY = doc.lastAutoTable.finalY + 7
        })

        // Global Summary Box at the end
        if (currentY > pageHeight - 30) {
          doc.addPage()
          currentY = 15
        }

        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.roundedRect(14, currentY, pageWidth - 28, 10, 1, 1, 'F')
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text('TOTAL GENERAL CONSOLIDADO CAMIONES', 18, currentY + 6.5)
        doc.text(
          `Unidades: ${totalUnidades}   |   Valor Total: ${totalValor}`,
          pageWidth - 18,
          currentY + 6.5,
          { align: 'right' }
        )

        // Number pages
        const totalPages = doc.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i)
          doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2])
          doc.setLineWidth(0.3)
          doc.line(14, pageHeight - 10, pageWidth - 14, pageHeight - 10)

          doc.setFontSize(7)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(140, 150, 165)
          doc.text('Inventario Consolidado de Camiones — S.I. Tokes', 14, pageHeight - 6)
          doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 6, { align: 'right' })
        }

        const blobUrl = doc.output('bloburl')
        window.open(blobUrl, '_blank')
        this.showSnackbar('PDF de inventario consolidado de camiones generado con éxito', 'success')
      } catch (err) {
        console.error('Error generando PDF de inventario consolidado de camiones:', err)
        this.showSnackbar('Error al generar el PDF del inventario', 'error')
      }
    },

    async exportarExcelConsolidado() {
      const camiones = this.filteredInformeCamiones
      if (!camiones || camiones.length === 0) {
        this.showSnackbar('No hay datos disponibles para exportar a Excel.', 'warning')
        return
      }

      try {
        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'S.I. Tokes'
        workbook.created = new Date()

        // ----------------------------------------------------
        // HOJA 1: RESUMEN POR CAMIÓN
        // ----------------------------------------------------
        const wsResumen = workbook.addWorksheet('Resumen Camiones')
        wsResumen.columns = [
          { header: 'Placa Camión', key: 'placa', width: 16 },
          { header: 'Bodega Móvil', key: 'bodega', width: 25 },
          { header: 'Total Productos', key: 'totalProductos', width: 18 },
          { header: 'Stock Total (Uds)', key: 'totalUnidades', width: 18 },
          { header: 'Valor Inventario (C$)', key: 'valorTotalCosto', width: 22 }
        ]

        // Header style Hoja 1
        wsResumen.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
        wsResumen.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1A237E' } // Indigo
        }
        wsResumen.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

        camiones.forEach((c) => {
          const row = wsResumen.addRow({
            placa: c.placa,
            bodega: c.bodegaNombre || c.codigoBodega || 'Bodega Móvil',
            totalProductos: c.totalProductos,
            totalUnidades: c.totalUnidades,
            valorTotalCosto: c.valorTotalCosto
          })
          row.getCell('placa').alignment = { horizontal: 'center' }
          row.getCell('totalProductos').alignment = { horizontal: 'center' }
          row.getCell('totalUnidades').alignment = { horizontal: 'center' }
          row.getCell('valorTotalCosto').numFmt = '"C$"#,##0.00'
        })

        // Fila de Total Consolidado Hoja 1
        const totalUnidades = this.resumenInformeConsolidado.totalUnidades
        const totalCosto = this.resumenInformeConsolidado.totalCosto
        const totalProdDistintos = this.resumenInformeConsolidado.totalProductosDistintos

        const totalRow1 = wsResumen.addRow({
          placa: 'TOTAL GENERAL',
          bodega: `${camiones.length} camiones`,
          totalProductos: totalProdDistintos,
          totalUnidades: totalUnidades,
          valorTotalCosto: totalCosto
        })
        totalRow1.font = { bold: true, color: { argb: 'FF1A237E' } }
        totalRow1.getCell('placa').alignment = { horizontal: 'center' }
        totalRow1.getCell('totalProductos').alignment = { horizontal: 'center' }
        totalRow1.getCell('totalUnidades').alignment = { horizontal: 'center' }
        totalRow1.getCell('valorTotalCosto').numFmt = '"C$"#,##0.00'

        // ----------------------------------------------------
        // HOJA 2: DETALLE DE PRODUCTOS EN RUTA
        // ----------------------------------------------------
        const wsDetalle = workbook.addWorksheet('Detalle de Carga')
        wsDetalle.columns = [
          { header: 'Placa', key: 'placa', width: 14 },
          { header: 'Bodega Móvil', key: 'bodega', width: 22 },
          { header: 'Código', key: 'codigo', width: 15 },
          { header: 'Producto', key: 'producto', width: 35 },
          { header: 'Unidad', key: 'unidad', width: 14 },
          { header: 'Categoría', key: 'categoria', width: 20 },
          { header: 'Stock en Ruta', key: 'stock', width: 16 },
          { header: 'Costo Unitario (C$)', key: 'costoUnitario', width: 20 },
          { header: 'Valor Total (C$)', key: 'valorTotal', width: 20 }
        ]

        // Header style Hoja 2
        wsDetalle.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
        wsDetalle.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF00695C' } // Teal
        }
        wsDetalle.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

        camiones.forEach((c) => {
          (c.productos || []).forEach((p) => {
            const row = wsDetalle.addRow({
              placa: c.placa,
              bodega: c.bodegaNombre || c.codigoBodega || 'Bodega Móvil',
              codigo: p.codigo || '—',
              producto: p.nombre,
              unidad: p.unidadMedida || 'Unidad',
              categoria: p.categoria || '—',
              stock: Number(p.cantidad) || 0,
              costoUnitario: Number(p.costoUnitario) || 0,
              valorTotal: Number(p.totalCosto) || 0
            })
            row.getCell('placa').alignment = { horizontal: 'center' }
            row.getCell('stock').alignment = { horizontal: 'center' }
            row.getCell('costoUnitario').numFmt = '"C$"#,##0.00'
            row.getCell('valorTotal').numFmt = '"C$"#,##0.00'
          })
        })

        // Fila de Total Hoja 2
        const totalRow2 = wsDetalle.addRow({
          placa: 'TOTAL CONSOLIDADO',
          bodega: '',
          codigo: '',
          producto: '',
          unidad: '',
          categoria: '',
          stock: totalUnidades,
          costoUnitario: '',
          valorTotal: totalCosto
        })
        totalRow2.font = { bold: true, color: { argb: 'FF00695C' } }
        totalRow2.getCell('stock').alignment = { horizontal: 'center' }
        totalRow2.getCell('valorTotal').numFmt = '"C$"#,##0.00'

        // Generar y descargar archivo
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const fechaStr = new Date().toISOString().slice(0, 10)
        a.download = `Inventario_Consolidado_Camiones_${fechaStr}.xlsx`
        a.click()
        window.URL.revokeObjectURL(url)

        this.showSnackbar('Archivo Excel de camiones generado y descargado con éxito', 'success')
      } catch (err) {
        console.error('Error exportando Excel de consolidado de camiones:', err)
        this.showSnackbar('Error al generar el archivo Excel', 'error')
      }
    },

    // ================= MÉTODOS TRASLADO / CARGA A SUCURSAL =================
    async openDialogTrasladoSucursal(sucursal) {
      this.dialogTrasladoSucursal.sucursal = sucursal
      this.dialogTrasladoSucursal.idBodegaOrigen = null
      this.dialogTrasladoSucursal.observaciones = ''
      this.dialogTrasladoSucursal.detalles = []
      this.dialogTrasladoSucursal.selectedProducto = null
      this.dialogTrasladoSucursal.selectedCantidad = 1
      this.bodegaOrigenSucursalStock = []

      // Auto-seleccionar bodega principal si está disponible o la primera bodega activa diferente a la sucursal
      const principal = this.bodegas.find((b) => b.esPrincipal && b.idBodega !== sucursal.idBodega)
      if (principal) {
        this.dialogTrasladoSucursal.idBodegaOrigen = principal.idBodega
        await this.onBodegaOrigenSucursalChange(principal.idBodega)
      } else {
        const first = this.bodegas.find((b) => b.estado && b.idBodega !== sucursal.idBodega)
        if (first) {
          this.dialogTrasladoSucursal.idBodegaOrigen = first.idBodega
          await this.onBodegaOrigenSucursalChange(first.idBodega)
        }
      }

      this.dialogTrasladoSucursal.show = true
    },

    async onBodegaOrigenSucursalChange(idBodega) {
      this.dialogTrasladoSucursal.detalles = []
      this.dialogTrasladoSucursal.selectedProducto = null
      this.dialogTrasladoSucursal.selectedCantidad = 1
      this.bodegaOrigenSucursalStock = []

      if (!idBodega) return

      this.dialogTrasladoSucursal.loadingStock = true
      try {
        const res = await this.requestHttp.getBodegaStock(idBodega)
        if (res && res.code === 200 && Array.isArray(res.data)) {
          this.bodegaOrigenSucursalStock = res.data
            .map((item) => ({
              ...item,
              stockDisponible: Number(item.cantidadTotal ?? item.cantidadTotalBodega ?? item.stockDisponible ?? 0)
            }))
            .filter((item) => Number(item.stockDisponible) > 0)
        }
      } catch (err) {
        this.showSnackbar('Error al obtener el stock de la bodega seleccionada.', 'error')
      } finally {
        this.dialogTrasladoSucursal.loadingStock = false
      }
    },

    onProductoSelectedSucursal(prod) {
      if (prod) {
        this.dialogTrasladoSucursal.selectedCantidad = 1
      }
    },

    agregarProductoATrasladoSucursal() {
      const prod = this.dialogTrasladoSucursal.selectedProducto
      const cant = Number(this.dialogTrasladoSucursal.selectedCantidad)

      if (!prod) {
        this.showSnackbar('Por favor selecciona un producto.', 'warning')
        return
      }
      if (!cant || cant <= 0) {
        this.showSnackbar('La cantidad a trasladar debe ser mayor a 0.', 'warning')
        return
      }
      if (cant > prod.stockDisponible) {
        this.showSnackbar(`La cantidad (${cant}) excede el stock disponible (${prod.stockDisponible}).`, 'error')
        return
      }

      const existingIndex = this.dialogTrasladoSucursal.detalles.findIndex((d) => d.idProducto === prod.idProducto)
      if (existingIndex >= 0) {
        const newTotalCant = Number(this.dialogTrasladoSucursal.detalles[existingIndex].cantidad) + cant
        if (newTotalCant > prod.stockDisponible) {
          this.showSnackbar(`El acumulado (${newTotalCant}) excede el stock disponible (${prod.stockDisponible}).`, 'error')
          return
        }
        this.dialogTrasladoSucursal.detalles[existingIndex].cantidad = newTotalCant
        this.dialogTrasladoSucursal.detalles[existingIndex].subtotalCosto = newTotalCant * Number(prod.costo || 0)
      } else {
        this.dialogTrasladoSucursal.detalles.push({
          idProducto: prod.idProducto,
          codigo: prod.codigo,
          nombre: prod.nombre,
          categoria: prod.categoria,
          cantidad: cant,
          stockDisponible: prod.stockDisponible,
          costo: Number(prod.costo || 0),
          precio: Number(prod.precio || 0),
          subtotalCosto: cant * Number(prod.costo || 0),
          observaciones: null
        })
      }

      this.dialogTrasladoSucursal.selectedProducto = null
      this.dialogTrasladoSucursal.selectedCantidad = 1
    },

    eliminarDetalleTrasladoSucursal(index) {
      this.dialogTrasladoSucursal.detalles.splice(index, 1)
    },

    async saveTrasladoSucursal() {
      if (!this.dialogTrasladoSucursal.idBodegaOrigen) {
        this.showSnackbar('Debe seleccionar una bodega de origen.', 'warning')
        return
      }
      if (!this.dialogTrasladoSucursal.sucursal?.idBodega && !this.dialogTrasladoSucursal.sucursal?.idSucursal) {
        this.showSnackbar('La sucursal de destino no es válida.', 'error')
        return
      }
      if (this.dialogTrasladoSucursal.detalles.length === 0) {
        this.showSnackbar('Debe agregar al menos un producto al traslado.', 'warning')
        return
      }

      this.dialogTrasladoSucursal.saving = true
      const payload = {
        idBodegaOrigen: this.dialogTrasladoSucursal.idBodegaOrigen,
        idSucursalDestino: this.dialogTrasladoSucursal.sucursal.idSucursal,
        idBodegaDestino: this.dialogTrasladoSucursal.sucursal.idBodega || null,
        observaciones: this.dialogTrasladoSucursal.observaciones || null,
        usuarioRegistro: this.usuarioLogueado,
        detalles: this.dialogTrasladoSucursal.detalles.map((d) => ({
          idProducto: d.idProducto,
          cantidad: Number(d.cantidad),
          observaciones: d.observaciones || null
        }))
      }

      try {
        const res = await this.requestHttp.postTrasladoSucursal(payload)
        if (res.code === 200) {
          this.showSnackbar('Inventario trasladado exitosamente a la sucursal.')
          this.dialogTrasladoSucursal.show = false
          await this.loadAllData()
        } else {
          this.showSnackbar(res.data?.msg || res.data || 'Error al procesar el traslado.', 'error')
        }
      } catch (err) {
        this.showSnackbar('Error de conexión al procesar el traslado.', 'error')
      } finally {
        this.dialogTrasladoSucursal.saving = false
      }
    },

    // ================= MÉTODOS INVENTARIO DE SUCURSAL =================
    async openDialogInventarioSucursal(sucursal) {
      this.dialogInventarioSucursal.sucursal = sucursal
      this.dialogInventarioSucursal.search = ''
      this.dialogInventarioSucursal.items = []
      this.dialogInventarioSucursal.show = true
      this.dialogInventarioSucursal.loading = true

      try {
        const res = await this.requestHttp.getSucursalInventario(sucursal.idSucursal)
        if (res.code === 200 && Array.isArray(res.data)) {
          this.dialogInventarioSucursal.items = res.data
        }
      } catch (err) {
        this.showSnackbar('Error al cargar inventario de la sucursal.', 'error')
      } finally {
        this.dialogInventarioSucursal.loading = false
      }
    },

    // ================= MÉTODOS HISTORIAL DE TRASLADOS SUCURSAL =================
    async openDialogHistorialSucursal(sucursal) {
      this.dialogHistorialSucursal.sucursal = sucursal
      this.dialogHistorialSucursal.search = ''
      this.dialogHistorialSucursal.items = []
      this.dialogHistorialSucursal.show = true
      this.dialogHistorialSucursal.loading = true

      try {
        const res = await this.requestHttp.getSucursalHistorialCargas(sucursal.idSucursal)
        if (res.code === 200 && Array.isArray(res.data)) {
          this.dialogHistorialSucursal.items = res.data
        }
      } catch (err) {
        this.showSnackbar('Error al cargar historial de traslados de la sucursal.', 'error')
      } finally {
        this.dialogHistorialSucursal.loading = false
      }
    },

    // ================= MÉTODOS INFORME CONSOLIDADO SUCURSALES =================
    async openDialogConsolidadoSucursales(idSucursal = null) {
      this.dialogConsolidadoSucursales.filterIdSucursal = idSucursal
      this.dialogConsolidadoSucursales.search = ''
      this.dialogConsolidadoSucursales.show = true
      await this.fetchInformeConsolidadoSucursales()
    },

    async fetchInformeConsolidadoSucursales() {
      try {
        this.dialogConsolidadoSucursales.loading = true
        const params = {
          soloConStock: this.dialogConsolidadoSucursales.soloConStock
        }
        if (this.dialogConsolidadoSucursales.filterIdSucursal) {
          params.idSucursal = this.dialogConsolidadoSucursales.filterIdSucursal
        }
        const res = await this.requestHttp.getInformeStockSucursales(params)
        if (res.code === 200 && res.data) {
          this.dialogConsolidadoSucursales.data = res.data
          this.dialogConsolidadoSucursales.expandedPanels = (res.data.sucursales || []).map(
            (_, i) => i
          )
        } else {
          this.showSnackbar(
            res.data?.msg || 'Error al cargar informe consolidado de sucursales',
            'error'
          )
        }
      } catch (err) {
        console.error('Error al obtener informe consolidado de sucursales:', err)
        this.showSnackbar('Error de conexión al cargar el informe', 'error')
      } finally {
        this.dialogConsolidadoSucursales.loading = false
      }
    },

    toggleExpandAllConsolidadoSucursales() {
      const total = this.filteredInformeSucursales.length
      if (this.dialogConsolidadoSucursales.expandedPanels.length === total) {
        this.dialogConsolidadoSucursales.expandedPanels = []
      } else {
        this.dialogConsolidadoSucursales.expandedPanels = this.filteredInformeSucursales.map(
          (_, i) => i
        )
      }
    },

    imprimirInformeConsolidadoSucursales() {
      const sucursales = this.filteredInformeSucursales
      if (!sucursales || sucursales.length === 0) {
        this.showSnackbar('No hay datos disponibles para generar el PDF.', 'warning')
        return
      }

      try {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()

        const primaryColor = [26, 35, 126] // Indigo #1A237E
        const darkColor = [30, 41, 59] // Slate #1E293B
        const tealColor = [0, 105, 92] // Teal #00695C
        const lightBg = [248, 250, 252] // #F8FAFC
        const borderGray = [226, 232, 240] // #E2E8F0

        // Header Top Line
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.rect(0, 0, pageWidth, 4, 'F')

        // Title Header Minimalista
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text('INVENTARIO CONSOLIDADO DE SUCURSALES', 14, 13)

        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text('S.I. TOKES — REPORTE DE EXISTENCIAS Y VALORIZACIÓN POR BODEGA', 14, 18)

        // Right Info Header
        doc.setFontSize(8)
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
        const fechaGen = this.dialogConsolidadoSucursales.data?.fechaGeneracion
          ? this.formatDateTime(this.dialogConsolidadoSucursales.data.fechaGeneracion)
          : new Date().toLocaleString('es-NI')
        doc.text(`Generado: ${fechaGen}`, pageWidth - 14, 13, { align: 'right' })

        const filtroSucursal = this.dialogConsolidadoSucursales.filterIdSucursal
          ? this.sucursales.find((s) => s.idSucursal === this.dialogConsolidadoSucursales.filterIdSucursal)?.nombre || 'Filtrada'
          : 'Todas las sucursales'
        doc.text(`Filtro: ${filtroSucursal}`, pageWidth - 14, 18, { align: 'right' })

        // Horizontal divider
        doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2])
        doc.setLineWidth(0.4)
        doc.line(14, 21, pageWidth - 14, 21)

        // KPI Summary Box
        let currentY = 24
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2])
        doc.roundedRect(14, currentY, pageWidth - 28, 14, 1.5, 1.5, 'F')
        doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2])
        doc.setLineWidth(0.3)
        doc.roundedRect(14, currentY, pageWidth - 28, 14, 1.5, 1.5, 'S')

        const totalSucursales = this.resumenInformeConsolidadoSucursales.totalSucursales
        const totalUnidades = this.resumenInformeConsolidadoSucursales.totalUnidades
        const totalValor = this.formatCurrency(this.resumenInformeConsolidadoSucursales.totalCosto)

        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text('Sucursales Activas:', 20, currentY + 6)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
        doc.text(`${totalSucursales}`, 20, currentY + 11)

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text('Stock Total Positivo:', 75, currentY + 6)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text(`${totalUnidades} unidades`, 75, currentY + 11)

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text('VALOR TOTAL INVENTARIO:', pageWidth - 80, currentY + 6)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(tealColor[0], tealColor[1], tealColor[2])
        doc.setFontSize(10)
        doc.text(totalValor, pageWidth - 20, currentY + 11, { align: 'right' })

        currentY += 19

        // Iterar sobre cada sucursal y crear su tabla
        sucursales.forEach((suc) => {
          // Si el espacio restante no alcanza para título + cabecera, pasar a nueva página
          if (currentY > pageHeight - 35) {
            doc.addPage()
            currentY = 15
          }

          // Sucursal Header Title Box
          doc.setFillColor(241, 245, 249)
          doc.roundedRect(14, currentY, pageWidth - 28, 7.5, 1, 1, 'F')

          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          const sucTitle = `${suc.nombre}${suc.codigo ? ' (' + suc.codigo + ')' : ''} — ${suc.bodegaNombre || suc.codigoBodega || 'Bodega Sucursal'}`
          doc.text(sucTitle, 17, currentY + 5)

          doc.setFontSize(8)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(tealColor[0], tealColor[1], tealColor[2])
          const sucTotalText = `Stock: ${suc.totalUnidades} uds  |  Valor: ${this.formatCurrency(suc.valorTotalCosto)}`
          doc.text(sucTotalText, pageWidth - 17, currentY + 5, { align: 'right' })

          currentY += 9

          // Table Rows
          const headers = [['#', 'Código', 'Producto', 'Categoría', 'Stock', 'Costo Unit.', 'Valor Total']]
          const rows = (suc.productos || []).map((p, pIdx) => [
            (pIdx + 1).toString(),
            p.codigo || '—',
            `${p.nombre}${p.unidadMedida ? ' (' + p.unidadMedida + ')' : ''}`,
            p.categoria || '—',
            p.cantidad.toString(),
            this.formatCurrency(p.costoUnitario),
            this.formatCurrency(p.totalCosto)
          ])

          const footRows = [[
            '',
            '',
            `Total ${suc.nombre}:`,
            '',
            suc.totalUnidades.toString(),
            '',
            this.formatCurrency(suc.valorTotalCosto)
          ]]

          doc.autoTable({
            startY: currentY,
            head: headers,
            body: rows,
            foot: footRows,
            theme: 'plain',
            styles: {
              fontSize: 7.5,
              cellPadding: 1.8,
              textColor: darkColor,
              lineColor: borderGray,
              lineWidth: 0.2
            },
            headStyles: {
              fillColor: [241, 245, 249],
              textColor: [15, 23, 42],
              fontStyle: 'bold',
              fontSize: 7.5
            },
            footStyles: {
              fillColor: [248, 250, 252],
              textColor: primaryColor,
              fontStyle: 'bold',
              fontSize: 7.5
            },
            columnStyles: {
              0: { halign: 'center', cellWidth: 8 },
              1: { halign: 'left', cellWidth: 22 },
              2: { halign: 'left' },
              3: { halign: 'left', cellWidth: 32 },
              4: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
              5: { halign: 'right', cellWidth: 22 },
              6: { halign: 'right', cellWidth: 26, fontStyle: 'bold', textColor: tealColor }
            },
            margin: { left: 14, right: 14 }
          })

          currentY = doc.lastAutoTable.finalY + 7
        })

        // Global Summary Box at the end
        if (currentY > pageHeight - 30) {
          doc.addPage()
          currentY = 15
        }

        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.roundedRect(14, currentY, pageWidth - 28, 10, 1, 1, 'F')
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text('TOTAL GENERAL CONSOLIDADO SUCURSALES', 18, currentY + 6.5)
        doc.text(
          `Unidades: ${totalUnidades}   |   Valor Total: ${totalValor}`,
          pageWidth - 18,
          currentY + 6.5,
          { align: 'right' }
        )

        // Number pages
        const totalPages = doc.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i)
          doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2])
          doc.setLineWidth(0.3)
          doc.line(14, pageHeight - 10, pageWidth - 14, pageHeight - 10)

          doc.setFontSize(7)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(140, 150, 165)
          doc.text('Inventario Consolidado de Sucursales — S.I. Tokes', 14, pageHeight - 6)
          doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 6, { align: 'right' })
        }

        const blobUrl = doc.output('bloburl')
        window.open(blobUrl, '_blank')
        this.showSnackbar('PDF de inventario consolidado generado con éxito', 'success')
      } catch (err) {
        console.error('Error generando PDF de inventario consolidado de sucursales:', err)
        this.showSnackbar('Error al generar el PDF del inventario', 'error')
      }
    },

    async exportarExcelConsolidadoSucursales() {
      const sucursales = this.filteredInformeSucursales
      if (!sucursales || sucursales.length === 0) {
        this.showSnackbar('No hay datos disponibles para exportar a Excel.', 'warning')
        return
      }

      try {
        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'S.I. Tokes'
        workbook.created = new Date()

        // ----------------------------------------------------
        // HOJA 1: RESUMEN POR BODEGA / SUCURSAL
        // ----------------------------------------------------
        const wsResumen = workbook.addWorksheet('Resumen Sucursales')
        wsResumen.columns = [
          { header: 'Sucursal', key: 'sucursal', width: 25 },
          { header: 'Código', key: 'codigo', width: 12 },
          { header: 'Bodega Asociada', key: 'bodega', width: 25 },
          { header: 'Total Productos', key: 'totalProductos', width: 18 },
          { header: 'Stock Total (Uds)', key: 'totalUnidades', width: 18 },
          { header: 'Valor Inventario (C$)', key: 'valorTotalCosto', width: 22 }
        ]

        // Header style Hoja 1
        wsResumen.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
        wsResumen.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1A237E' } // Indigo
        }
        wsResumen.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

        sucursales.forEach((s) => {
          const row = wsResumen.addRow({
            sucursal: s.nombre,
            codigo: s.codigo || '—',
            bodega: s.bodegaNombre || s.codigoBodega || 'Bodega Sucursal',
            totalProductos: s.totalProductos,
            totalUnidades: s.totalUnidades,
            valorTotalCosto: s.valorTotalCosto
          })
          row.getCell('totalProductos').alignment = { horizontal: 'center' }
          row.getCell('totalUnidades').alignment = { horizontal: 'center' }
          row.getCell('valorTotalCosto').numFmt = '"C$"#,##0.00'
        })

        // Fila de Total Consolidado Hoja 1
        const totalUnidades = this.resumenInformeConsolidadoSucursales.totalUnidades
        const totalCosto = this.resumenInformeConsolidadoSucursales.totalCosto
        const totalProdDistintos = this.resumenInformeConsolidadoSucursales.totalProductosDistintos

        const totalRow1 = wsResumen.addRow({
          sucursal: 'TOTAL GENERAL',
          codigo: '',
          bodega: `${sucursales.length} sucursales`,
          totalProductos: totalProdDistintos,
          totalUnidades: totalUnidades,
          valorTotalCosto: totalCosto
        })
        totalRow1.font = { bold: true, color: { argb: 'FF1A237E' } }
        totalRow1.getCell('totalProductos').alignment = { horizontal: 'center' }
        totalRow1.getCell('totalUnidades').alignment = { horizontal: 'center' }
        totalRow1.getCell('valorTotalCosto').numFmt = '"C$"#,##0.00'

        // ----------------------------------------------------
        // HOJA 2: DETALLE DE PRODUCTOS CON STOCK
        // ----------------------------------------------------
        const wsDetalle = workbook.addWorksheet('Detalle de Productos')
        wsDetalle.columns = [
          { header: 'Sucursal', key: 'sucursal', width: 22 },
          { header: 'Bodega', key: 'bodega', width: 22 },
          { header: 'Código', key: 'codigo', width: 15 },
          { header: 'Producto', key: 'producto', width: 35 },
          { header: 'Unidad', key: 'unidad', width: 14 },
          { header: 'Categoría', key: 'categoria', width: 20 },
          { header: 'Stock Positivo', key: 'stock', width: 16 },
          { header: 'Costo Unitario (C$)', key: 'costoUnitario', width: 20 },
          { header: 'Valor Total (C$)', key: 'valorTotal', width: 20 }
        ]

        // Header style Hoja 2
        wsDetalle.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
        wsDetalle.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF00695C' } // Teal
        }
        wsDetalle.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

        sucursales.forEach((s) => {
          (s.productos || []).forEach((p) => {
            const row = wsDetalle.addRow({
              sucursal: s.nombre,
              bodega: s.bodegaNombre || s.codigoBodega || 'Bodega Sucursal',
              codigo: p.codigo || '—',
              producto: p.nombre,
              unidad: p.unidadMedida || 'Unidad',
              categoria: p.categoria || '—',
              stock: Number(p.cantidad) || 0,
              costoUnitario: Number(p.costoUnitario) || 0,
              valorTotal: Number(p.totalCosto) || 0
            })
            row.getCell('stock').alignment = { horizontal: 'center' }
            row.getCell('costoUnitario').numFmt = '"C$"#,##0.00'
            row.getCell('valorTotal').numFmt = '"C$"#,##0.00'
          })
        })

        // Fila de Total Hoja 2
        const totalRow2 = wsDetalle.addRow({
          sucursal: 'TOTAL CONSOLIDADO',
          bodega: '',
          codigo: '',
          producto: '',
          unidad: '',
          categoria: '',
          stock: totalUnidades,
          costoUnitario: '',
          valorTotal: totalCosto
        })
        totalRow2.font = { bold: true, color: { argb: 'FF00695C' } }
        totalRow2.getCell('stock').alignment = { horizontal: 'center' }
        totalRow2.getCell('valorTotal').numFmt = '"C$"#,##0.00'

        // Generar y descargar archivo
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const fechaStr = new Date().toISOString().slice(0, 10)
        a.download = `Inventario_Consolidado_Sucursales_${fechaStr}.xlsx`
        a.click()
        window.URL.revokeObjectURL(url)

        this.showSnackbar('Archivo Excel generado y descargado con éxito', 'success')
      } catch (err) {
        console.error('Error exportando Excel de consolidado de sucursales:', err)
        this.showSnackbar('Error al generar el archivo Excel', 'error')
      }
    }
  },

  activated() {
    this.loadAllData()
  }
}
</script>

<style scoped>
/* Borde superior para tarjetas */
.border-top-indigo {
  border-top: 3px solid #1e3c72 !important;
}

/* Micro-animación de hover */
.hover-card {
  transition:
    transform 0.2s
      cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

/* Tarjeta estándar para agregar nuevo elemento */
.add-new-card {
  border: 1px dashed #1e3c72 !important;
  background-color: #f8f9fa;
  min-height: 170px;
  transition: all 0.2s ease;
}
.add-new-card:hover {
  background-color: #f1f3f5;
  border-color: #0f52ba !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05) !important;
}

/* Placa vehicular estilo real compacta y detallada */
.license-plate {
  position: relative;
  width: 140px;
  height: 75px;
  background: linear-gradient(
    180deg,
    #fdfdfd 0%,
    #f0f2f5 100%
  );
  border: 3px solid #2c3e50;
  border-radius: 6px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px;
  font-family: 'Courier New', Courier, monospace;
}
.plate-bolts {
  position: absolute;
  top: 4px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
}
.plate-bolts .bolt {
  width: 4px;
  height: 4px;
  background-color: #7f8c8d;
  border-radius: 50%;
  box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.5);
}
.plate-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.plate-top {
  font-size: 7px;
  font-weight: 800;
  color: #7f8c8d;
  letter-spacing: 1px;
  line-height: 1;
}
.plate-number {
  font-size: 16px;
  color: #1e272e;
  letter-spacing: 0.5px;
  line-height: 1.1;
  font-weight: 900 !important;
}
.plate-bottom {
  font-size: 7px;
  color: #e74c3c;
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 1;
}

.ga-3 {
  gap: 12px;
}

/* Tabla de informe consolidado */
.table-consolidado-camion {
  font-size: 12px;
}
.table-consolidado-camion th {
  font-size: 11px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.table-consolidado-camion .hover-row:hover {
  background-color: #f8faff;
}
.border-top-2 {
  border-top: 2px solid #3f51b5 !important;
}

@media print {
  /* Ocultar el resto de la página y modal overlay */
  body * {
    visibility: hidden;
  }
  #printable-consolidado-content,
  #printable-consolidado-content *,
  #printable-consolidado-sucursales-content,
  #printable-consolidado-sucursales-content * {
    visibility: visible;
  }
  #printable-consolidado-content,
  #printable-consolidado-sucursales-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #fff !important;
  }
}
</style>
