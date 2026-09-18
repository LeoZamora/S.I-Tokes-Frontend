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
            class="d-flex justify-end align-center"
          >
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
                  class="text-left text-white font-weight-bold py-1"
                >
                  Dirección
                </th>
                <th
                  class="text-left text-white font-weight-bold py-1"
                >
                  Contacto
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
                <td
                  class="text-truncate py-1"
                  style="max-width: 180px"
                >
                  {{ item.direccion || '---' }}
                </td>
                <td class="py-1">
                  <div
                    class="text-caption"
                    style="line-height: 1.2"
                  >
                    <div>
                      <v-icon
                        size="x-small"
                        class="mr-1"
                        >mdi-phone</v-icon
                      >
                      {{ item.telefono || '---' }}
                    </div>
                    <div>
                      <v-icon
                        size="x-small"
                        class="mr-1"
                        >mdi-email</v-icon
                      >
                      {{ item.email || '---' }}
                    </div>
                  </div>
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
                    class="d-flex justify-center align-center"
                  >
                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      color="indigo"
                      size="small"
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
                      class="ml-2"
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
                      Camión Distribuidor
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

    <!-- ================= DIÁLOGO INVENTARIO CONSOLIDADO DE CAMIONES ================= -->
    <v-dialog
      v-model="dialogConsolidado.show"
      max-width="1250"
      persistent
      scrollable
    >
      <v-card class="rounded overflow-hidden">
        <!-- Header del Diálogo -->
        <v-card-title
          class="bg-indigo-darken-4 text-white font-weight-bold pa-3 d-flex align-center justify-space-between flex-wrap"
        >
          <div class="d-flex align-center">
            <v-avatar size="36" color="white" class="mr-3" variant="flat">
              <v-icon color="indigo-darken-4" size="22">mdi-truck-cargo-container</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold lh-1">
                Inventario Consolidado de Carga en Camiones
              </div>
              <div class="text-indigo-lighten-4 text-caption">
                Informe de existencias, productos y valorización agrupado por unidad de transporte
              </div>
            </div>
          </div>
          <div class="d-flex align-center ga-2 flex-wrap mt-2 mt-sm-0">
            <v-chip
              v-if="dialogConsolidado.data?.fechaGeneracion"
              size="small"
              color="indigo-lighten-4"
              variant="flat"
              class="text-indigo-darken-4 font-weight-bold"
            >
              <v-icon start size="14">mdi-clock-outline</v-icon>
              {{ formatDateTime(dialogConsolidado.data.fechaGeneracion) }}
            </v-chip>
            <v-btn
              icon
              variant="text"
              size="small"
              color="white"
              @click="toggleExpandAllConsolidado()"
            >
              <v-icon size="20">mdi-arrow-expand-vertical</v-icon>
              <v-tooltip activator="parent" location="top" text="Expandir / Contraer Todo" />
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              color="white"
              :loading="dialogConsolidado.loading"
              @click="fetchInformeConsolidado()"
            >
              <v-icon size="20">mdi-refresh</v-icon>
              <v-tooltip activator="parent" location="top" text="Actualizar Datos" />
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              color="white"
              @click="imprimirInformeConsolidado()"
            >
              <v-icon size="20">mdi-printer</v-icon>
              <v-tooltip activator="parent" location="top" text="Imprimir Informe" />
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              color="white"
              @click="dialogConsolidado.show = false"
            >
              <v-icon size="20">mdi-close</v-icon>
              <v-tooltip activator="parent" location="top" text="Cerrar" />
            </v-btn>
          </div>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-4 bg-grey-lighten-4" style="max-height: 80vh;" id="printable-consolidado-content">
          <!-- Barra de Filtros y Búsqueda -->
          <v-card variant="flat" class="pa-3 mb-3 rounded border bg-white">
            <v-row dense align="center">
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="dialogConsolidado.search"
                  label="Buscar producto, placa o categoría..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  hide-details
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-autocomplete
                  v-model="dialogConsolidado.filterIdCamion"
                  :items="camionesOptionsInforme"
                  item-title="title"
                  item-value="value"
                  label="Filtrar por Camión"
                  prepend-inner-icon="mdi-truck"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  hide-details
                  @update:model-value="fetchInformeConsolidado()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4" sm="12" class="d-flex align-center justify-md-end">
                <v-switch
                  v-model="dialogConsolidado.soloConStock"
                  label="Solo con Stock Activo (> 0)"
                  color="indigo"
                  density="compact"
                  hide-details
                  @update:model-value="fetchInformeConsolidado()"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card>

          <!-- Loader -->
          <div v-if="dialogConsolidado.loading" class="d-flex flex-column align-center justify-center my-10">
            <v-progress-circular indeterminate color="indigo-darken-4" size="50" width="4"></v-progress-circular>
            <span class="text-caption font-weight-bold text-indigo-darken-4 mt-3">Generando informe consolidado...</span>
          </div>

          <!-- Resumen de Métricas Globales (KPI Cards) -->
          <template v-else-if="filteredInformeCamiones.length > 0">
            <v-row dense class="mb-3">
              <v-col cols="6" sm="4" md="2">
                <v-card variant="flat" color="indigo-lighten-5" class="pa-2 rounded border border-indigo-lighten-4 h-100">
                  <div class="text-caption text-grey-darken-2 font-weight-medium">Camiones</div>
                  <div class="text-h6 font-weight-bold text-indigo-darken-4">{{ resumenInformeConsolidado.totalCamiones }}</div>
                  <div class="text-caption text-indigo-darken-2 font-weight-bold" style="font-size: 10px;">Unidades de reparto</div>
                </v-card>
              </v-col>
              <v-col cols="6" sm="4" md="2">
                <v-card variant="flat" color="deep-purple-lighten-5" class="pa-2 rounded border border-deep-purple-lighten-4 h-100">
                  <div class="text-caption text-grey-darken-2 font-weight-medium">Productos Distintos</div>
                  <div class="text-h6 font-weight-bold text-deep-purple-darken-4">{{ resumenInformeConsolidado.totalProductosDistintos }}</div>
                  <div class="text-caption text-deep-purple-darken-2 font-weight-bold" style="font-size: 10px;">Variedad en carga</div>
                </v-card>
              </v-col>
              <v-col cols="6" sm="4" md="2">
                <v-card variant="flat" color="blue-lighten-5" class="pa-2 rounded border border-blue-lighten-4 h-100">
                  <div class="text-caption text-grey-darken-2 font-weight-medium">Total Unidades</div>
                  <div class="text-h6 font-weight-bold text-blue-darken-4">{{ resumenInformeConsolidado.totalUnidades }}</div>
                  <div class="text-caption text-blue-darken-2 font-weight-bold" style="font-size: 10px;">Carga total a bordo</div>
                </v-card>
              </v-col>
              <v-col cols="6" sm="4" md="2">
                <v-card variant="flat" color="teal-lighten-5" class="pa-2 rounded border border-teal-lighten-4 h-100">
                  <div class="text-caption text-grey-darken-2 font-weight-medium">Valor Total Costo</div>
                  <div class="text-subtitle-1 font-weight-bold text-teal-darken-4 text-truncate">{{ formatCurrency(resumenInformeConsolidado.totalCosto) }}</div>
                  <div class="text-caption text-teal-darken-2 font-weight-bold" style="font-size: 10px;">Inversión en carga</div>
                </v-card>
              </v-col>
              <v-col cols="6" sm="4" md="2">
                <v-card variant="flat" color="blue-grey-lighten-5" class="pa-2 rounded border border-blue-grey-lighten-4 h-100">
                  <div class="text-caption text-grey-darken-2 font-weight-medium">Valor Total Venta</div>
                  <div class="text-subtitle-1 font-weight-bold text-blue-grey-darken-4 text-truncate">{{ formatCurrency(resumenInformeConsolidado.totalVenta) }}</div>
                  <div class="text-caption text-blue-grey-darken-2 font-weight-bold" style="font-size: 10px;">Proyección venta</div>
                </v-card>
              </v-col>
              <v-col cols="6" sm="4" md="2">
                <v-card variant="flat" color="green-lighten-5" class="pa-2 rounded border border-green-lighten-4 h-100">
                  <div class="text-caption text-grey-darken-2 font-weight-medium">Ganancia Estimada</div>
                  <div class="text-subtitle-1 font-weight-bold text-green-darken-4 text-truncate">{{ formatCurrency(resumenInformeConsolidado.ganancia) }}</div>
                  <div class="text-caption text-green-darken-3 font-weight-bold" style="font-size: 10px;">
                    Margen: {{ resumenInformeConsolidado.margen }}%
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Agrupación por Camión (Expansion Panels de Informe) -->
            <v-expansion-panels
              v-model="dialogConsolidado.expandedPanels"
              multiple
              variant="popout"
              class="mb-3"
            >
              <v-expansion-panel
                v-for="(camion, idx) in filteredInformeCamiones"
                :key="camion.idCamion || idx"
                class="mb-2 border rounded-lg overflow-hidden bg-white"
                elevation="1"
              >
                <!-- Cabecera del Camión -->
                <v-expansion-panel-title class="py-2 px-3 bg-grey-lighten-4">
                  <div class="d-flex align-center justify-space-between flex-wrap w-100 pr-2 ga-2">
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
                      <div class="mr-3">
                        <div class="text-subtitle-2 font-weight-bold text-grey-darken-4 lh-1">
                          {{ camion.bodegaNombre || ('Camión ' + camion.placa) }}
                        </div>
                        <div class="text-caption text-grey-darken-1" style="font-size: 11px;">
                          {{ camion.codigoBodega ? 'Código: ' + camion.codigoBodega + ' | ' : '' }}
                          <span v-if="camion.fechaUltimaCarga">
                            Última Carga: {{ formatDateTime(camion.fechaUltimaCarga) }}
                            <span v-if="camion.usuarioUltimaCarga">({{ camion.usuarioUltimaCarga }})</span>
                          </span>
                          <span v-else>Sin registro de carga previa</span>
                        </div>
                      </div>
                    </div>

                    <!-- Badges Resumen del Camión (Subtotales) -->
                    <div class="d-flex align-center flex-wrap ga-1">
                      <v-chip size="x-small" color="indigo" variant="tonal" class="font-weight-bold">
                        {{ camion.totalProductos }} ítems
                      </v-chip>
                      <v-chip size="x-small" color="blue-darken-3" variant="tonal" class="font-weight-bold">
                        {{ camion.totalUnidades }} unids.
                      </v-chip>
                      <v-chip size="x-small" color="teal-darken-3" variant="tonal" class="font-weight-bold">
                        Costo: {{ formatCurrency(camion.valorTotalCosto) }}
                      </v-chip>
                      <v-chip size="x-small" color="blue-grey-darken-3" variant="tonal" class="font-weight-bold">
                        Venta: {{ formatCurrency(camion.valorTotalVenta) }}
                      </v-chip>
                      <v-chip size="x-small" color="green-darken-3" variant="flat" class="font-weight-bold text-white">
                        Ganancia: {{ formatCurrency(camion.gananciaEstimada) }} ({{ camion.margenPorcentaje }}%)
                      </v-chip>
                    </div>
                  </div>
                </v-expansion-panel-title>

                <!-- Tabla de Productos del Camión -->
                <v-expansion-panel-text class="pa-0">
                  <v-table density="compact" class="table-consolidado-camion">
                    <thead class="bg-indigo-lighten-5 font-weight-bold">
                      <tr>
                        <th class="text-center py-2" style="width: 40px;">#</th>
                        <th class="text-left py-2" style="width: 90px;">Código</th>
                        <th class="text-left py-2">Producto</th>
                        <th class="text-left py-2">Categoría</th>
                        <th class="text-center py-2">U.M.</th>
                        <th class="text-center py-2" style="width: 80px;">Carga</th>
                        <th class="text-right py-2">Costo Unit.</th>
                        <th class="text-right py-2">Precio Venta</th>
                        <th class="text-right py-2 font-weight-bold text-teal-darken-4">Subtotal Costo</th>
                        <th class="text-right py-2 font-weight-bold text-blue-darken-4">Subtotal Venta</th>
                        <th class="text-right py-2 font-weight-bold text-green-darken-4">Ganancia Est.</th>
                        <th class="text-center py-2" style="width: 70px;">Margen</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(prod, pIdx) in camion.productos"
                        :key="prod.idStockBodega || prod.idProducto || pIdx"
                        class="hover-row"
                      >
                        <td class="text-center text-caption text-grey font-weight-bold">{{ pIdx + 1 }}</td>
                        <td class="text-caption font-weight-medium">
                          <v-chip size="x-small" variant="flat" color="grey-lighten-3" class="font-weight-bold">
                            {{ prod.codigo || '---' }}
                          </v-chip>
                        </td>
                        <td class="text-caption font-weight-bold text-indigo-darken-4">
                          {{ prod.nombre }}
                        </td>
                        <td class="text-caption text-grey-darken-2">
                          {{ prod.categoria || '---' }}
                        </td>
                        <td class="text-center text-caption text-grey-darken-3">
                          {{ prod.unidadMedida || 'Und' }}
                        </td>
                        <td class="text-center font-weight-bold text-caption text-indigo-darken-4">
                          <v-chip size="x-small" color="indigo-lighten-5" class="text-indigo-darken-4 font-weight-bold">
                            {{ prod.cantidad }}
                          </v-chip>
                        </td>
                        <td class="text-right text-caption">
                          {{ formatCurrency(prod.costoUnitario) }}
                        </td>
                        <td class="text-right text-caption">
                          {{ formatCurrency(prod.precioUnitario) }}
                        </td>
                        <td class="text-right font-weight-bold text-caption text-teal-darken-4">
                          {{ formatCurrency(prod.totalCosto) }}
                        </td>
                        <td class="text-right font-weight-bold text-caption text-blue-darken-4">
                          {{ formatCurrency(prod.totalVenta) }}
                        </td>
                        <td class="text-right font-weight-bold text-caption text-green-darken-4">
                          {{ formatCurrency(prod.gananciaEstimada) }}
                        </td>
                        <td class="text-center text-caption">
                          <v-chip
                            size="x-small"
                            :color="prod.margenPorcentaje >= 30 ? 'green-darken-3' : (prod.margenPorcentaje > 0 ? 'amber-darken-4' : 'grey')"
                            variant="tonal"
                            class="font-weight-bold"
                          >
                            {{ prod.margenPorcentaje }}%
                          </v-chip>
                        </td>
                      </tr>
                      <tr v-if="!camion.productos || camion.productos.length === 0">
                        <td colspan="12" class="text-center py-4 text-grey text-caption">
                          No hay productos registrados en la carga de este camión.
                        </td>
                      </tr>
                    </tbody>
                    <!-- Fila de Subtotales del Camión -->
                    <tfoot class="bg-indigo-lighten-5 font-weight-bold">
                      <tr class="border-top-2">
                        <td colspan="5" class="text-right py-2 text-caption text-indigo-darken-4">
                          <strong>Subtotal Camión {{ camion.placa }}:</strong>
                          <span class="text-caption text-grey-darken-2 ml-1">({{ camion.totalProductos }} productos)</span>
                        </td>
                        <td class="text-center py-2 text-caption text-indigo-darken-4">
                          <strong>{{ camion.totalUnidades }}</strong>
                        </td>
                        <td colspan="2" class="text-right py-2 text-caption text-grey-darken-2">
                          Totales Camión:
                        </td>
                        <td class="text-right py-2 text-caption text-teal-darken-4">
                          <strong>{{ formatCurrency(camion.valorTotalCosto) }}</strong>
                        </td>
                        <td class="text-right py-2 text-caption text-blue-darken-4">
                          <strong>{{ formatCurrency(camion.valorTotalVenta) }}</strong>
                        </td>
                        <td class="text-right py-2 text-caption text-green-darken-4">
                          <strong>{{ formatCurrency(camion.gananciaEstimada) }}</strong>
                        </td>
                        <td class="text-center py-2 text-caption font-weight-bold text-indigo-darken-4">
                          <strong>{{ camion.margenPorcentaje }}%</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </v-table>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Card de Gran Total Consolidado Final -->
            <v-card variant="flat" class="pa-3 border rounded-lg bg-indigo-darken-4 text-white">
              <div class="d-flex align-center justify-space-between flex-wrap ga-3">
                <div class="d-flex align-center">
                  <v-icon size="24" class="mr-2" color="white">mdi-sigma</v-icon>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold lh-1 text-white">
                      Gran Total Consolidado (Todos los Camiones)
                    </div>
                    <div class="text-caption text-indigo-lighten-3">
                      Total {{ resumenInformeConsolidado.totalCamiones }} camiones | {{ resumenInformeConsolidado.totalProductosDistintos }} productos distintos | {{ resumenInformeConsolidado.totalUnidades }} unidades en ruta
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center flex-wrap ga-3">
                  <div class="text-right">
                    <div class="text-caption text-indigo-lighten-3" style="font-size: 11px;">Total Costo</div>
                    <div class="text-subtitle-2 font-weight-bold text-white">{{ formatCurrency(resumenInformeConsolidado.totalCosto) }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-caption text-indigo-lighten-3" style="font-size: 11px;">Total Venta Estimada</div>
                    <div class="text-subtitle-2 font-weight-bold text-white">{{ formatCurrency(resumenInformeConsolidado.totalVenta) }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-caption text-green-lighten-3" style="font-size: 11px;">Ganancia Global ({{ resumenInformeConsolidado.margen }}%)</div>
                    <div class="text-subtitle-2 font-weight-bold text-green-accent-2">{{ formatCurrency(resumenInformeConsolidado.ganancia) }}</div>
                  </div>
                </div>
              </div>
            </v-card>
          </template>

          <!-- No Data View -->
          <v-sheet
            v-else
            class="text-center py-10 rounded border bg-white"
          >
            <v-avatar color="indigo-lighten-5" size="64" class="mb-3">
              <v-icon size="36" color="indigo-darken-3">mdi-truck-outline</v-icon>
            </v-avatar>
            <h4 class="text-subtitle-1 font-weight-bold text-grey-darken-3">
              No se encontraron datos para el informe
            </h4>
            <p class="text-caption text-grey-darken-1 mt-1">
              Verifique los filtros seleccionados o asegúrese de que los camiones cuenten con cargas de inventario registradas.
            </p>
          </v-sheet>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-3 bg-grey-lighten-4 d-flex justify-space-between align-center">
          <div class="text-caption text-grey-darken-2 font-weight-medium">
            Mostrando {{ filteredInformeCamiones.length }} de {{ dialogConsolidado.data?.totalCamiones || 0 }} camiones
          </div>
          <div class="d-flex ga-2">
            <v-btn
              color="indigo-darken-4"
              variant="tonal"
              density="comfortable"
              prepend-icon="mdi-printer"
              class="rounded font-weight-bold px-4 text-caption"
              @click="imprimirInformeConsolidado()"
            >
              Imprimir
            </v-btn>
            <v-btn
              color="indigo-darken-4"
              variant="flat"
              density="comfortable"
              class="rounded font-weight-bold px-4 text-caption"
              @click="dialogConsolidado.show = false"
            >
              Cerrar
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp'
import { formatters } from '@/helpers/formatters'

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
          placa: ''
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
        c.placa.toLowerCase().includes(search)
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

      if (this.dialogConsolidado.search) {
        const s = this.dialogConsolidado.search.toLowerCase().trim()
        list = list
          .map((c) => {
            const placaMatch = c.placa?.toLowerCase().includes(s)
            const bodegaMatch =
              c.bodegaNombre?.toLowerCase().includes(s) ||
              c.codigoBodega?.toLowerCase().includes(s)
            const productosFiltrados = (c.productos || []).filter(
              (p) =>
                p.nombre?.toLowerCase().includes(s) ||
                p.codigo?.toLowerCase().includes(s) ||
                p.categoria?.toLowerCase().includes(s)
            )
            if (placaMatch || bodegaMatch) {
              return c
            } else if (productosFiltrados.length > 0) {
              const valorCosto = productosFiltrados.reduce(
                (sum, p) => sum + (Number(p.totalCosto) || 0),
                0
              )
              const valorVenta = productosFiltrados.reduce(
                (sum, p) => sum + (Number(p.totalVenta) || 0),
                0
              )
              const ganancia = valorVenta - valorCosto
              const margen =
                valorCosto > 0
                  ? Math.round((ganancia / valorCosto) * 100 * 100) / 100
                  : valorVenta > 0
                  ? 100
                  : 0
              return {
                ...c,
                productos: productosFiltrados,
                totalProductos: productosFiltrados.length,
                totalUnidades: productosFiltrados.reduce(
                  (sum, p) => sum + (Number(p.cantidad) || 0),
                  0
                ),
                valorTotalCosto: valorCosto,
                valorTotalVenta: valorVenta,
                gananciaEstimada: ganancia,
                margenPorcentaje: margen
              }
            }
            return null
          })
          .filter(Boolean)
      }
      return list
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
      const ganancia = totalVenta - totalCosto
      const margen =
        totalCosto > 0
          ? ((ganancia / totalCosto) * 100).toFixed(2)
          : totalVenta > 0
          ? '100.00'
          : '0.00'

      const allProdIds = new Set()
      camiones.forEach((c) => {
        ;(c.productos || []).forEach((p) => allProdIds.add(p.idProducto))
      })

      return {
        totalCamiones,
        totalProductosDistintos: allProdIds.size,
        totalUnidades,
        totalCosto,
        totalVenta,
        ganancia,
        margen
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
        this.dialogCamion.title = 'Editar Camión'
        this.dialogCamion.item = {
          idCamion: item.idCamion,
          placa: item.placa
        }
      } else {
        this.dialogCamion.editar = false
        this.dialogCamion.title = 'Nuevo Camión'
        this.dialogCamion.item = {
          idCamion: 0,
          placa: ''
        }
      }
      this.dialogCamion.show = true
    },

    async saveCamion() {
      if (!this.formValidCamion) return

      this.dialogCamion.loading = true
      const payload = {
        placa: this.dialogCamion.item.placa,
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
        if (res.code === 200 && Array.isArray(res.data)) {
          this.bodegaOrigenStock = res.data.filter((item) => Number(item.stockDisponible) > 0)
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
      window.print()
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
  #printable-consolidado-content * {
    visibility: visible;
  }
  #printable-consolidado-content {
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
