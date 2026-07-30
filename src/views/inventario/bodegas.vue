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
          <v-btn
            v-else-if="activeTab === 'camiones'"
            color="indigo-darken-4"
            prepend-icon="mdi-truck-plus"
            variant="tonal"
            density="comfortable"
            class="rounded font-weight-bold"
            @click="openDialogCamion(null)"
          >
            Nuevo Camión
          </v-btn>
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
                      >/ 1</span
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
                      >/ 1</span
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
                      >/ 2</span
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
        <v-row class="mb-2 align-center" dense>
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
                    <h4
                      class="text-subtitle-2 font-weight-bold text-indigo-darken-4 mb-0"
                    >
                      Distribuidor
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
                    <v-icon size="small"
                      >mdi-truck</v-icon
                    >
                  </v-avatar>
                </div>

                <!-- Placa Vehicular Realista Centrada -->
                <div
                  class="d-flex justify-center my-3"
                >
                  <div class="license-plate">
                    <div class="plate-bolts">
                      <span class="bolt"></span>
                      <span class="bolt"></span>
                    </div>
                    <div class="plate-content">
                      <div
                        class="plate-top text-uppercase"
                      >
                        Distribuidor
                      </div>
                      <div
                        class="plate-number text-uppercase font-weight-bold"
                      >
                        {{ item.placa }}
                      </div>
                      <div class="plate-bottom">
                        PLACA
                      </div>
                    </div>
                  </div>
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
                        >mdi-calendar-clock</v-icon
                      >
                    </template>
                    <span
                      class="text-caption text-grey-darken-3"
                    >
                      Registrado:
                      {{
                        formatDate(item.createdAt)
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
                        >mdi-account</v-icon
                      >
                    </template>
                    <span
                      class="text-caption text-grey-darken-3"
                    >
                      Por:
                      {{
                        item.createdBy ||
                        'Sistema'
                      }}
                    </span>
                  </v-list-item>
                </v-list>
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
          <v-col cols="12" sm="6" md="4" lg="3">
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
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp'

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
      if (!this.searchSucursales)
        return this.sucursales
      const search = this.searchSucursales
        .toLowerCase()
        .trim()
      return this.sucursales.filter(
        (s) =>
          s.nombre
            .toLowerCase()
            .includes(search) ||
          (s.codigo &&
            s.codigo
              .toLowerCase()
              .includes(search)) ||
          s.municipio
            .toLowerCase()
            .includes(search)
      )
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

    usuarioLogueado() {
      return (
        localStorage.getItem('name') || 'Admin'
      )
    }
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return '---'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
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
      if (res.code === 200) {
        this.sucursales = res.data
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
      if (res.code === 200) {
        this.bodegas = res.data
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
    }
  },

  mounted() {
    this.loadAllData()
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
</style>
