<template>
  <v-container fluid class="pa-6">
    <!-- Snackbar para alertas de éxito/error -->
    <v-snackbar
      v-model="alert.show"
      :color="alert.color"
      timeout="4000"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ alert.icon }}</v-icon>
        <span>{{ alert.text }}</span>
      </div>
    </v-snackbar>

    <!-- Header y Estadísticas Principales -->
    <v-row class="mb-6">
      <v-col cols="12" class="d-flex align-center justify-space-between flex-wrap">
        <div>
          <h1 class="text-h4 font-weight-bold text-indigo-darken-4 mb-1">
            Gestión de Bodegas
          </h1>
          <p class="text-subtitle-1 text-grey-darken-1">
            Administra los almacenes físicos de sucursales y las bodegas móviles de distribuidores.
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- Tarjetas de Estadísticas -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="4">
        <v-card class="elevation-3 bg-gradient-sucursales rounded-xl text-white pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <span class="text-subtitle-2 opacity-80 text-uppercase font-weight-bold">Sucursales</span>
              <h2 class="text-h3 font-weight-bold mt-2">{{ stats.sucursales }}</h2>
            </div>
            <v-icon size="64" class="opacity-30">mdi-storefront</v-icon>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="elevation-3 bg-gradient-camiones rounded-xl text-white pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <span class="text-subtitle-2 opacity-80 text-uppercase font-weight-bold">Camiones</span>
              <h2 class="text-h3 font-weight-bold mt-2">{{ stats.camiones }}</h2>
            </div>
            <v-icon size="64" class="opacity-30">mdi-truck</v-icon>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="elevation-3 bg-gradient-bodegas rounded-xl text-white pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <span class="text-subtitle-2 opacity-80 text-uppercase font-weight-bold">Total Bodegas</span>
              <h2 class="text-h3 font-weight-bold mt-2">{{ stats.bodegas }}</h2>
            </div>
            <v-icon size="64" class="opacity-30">mdi-warehouse</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Menú de Pestañas (Tabs) -->
    <v-card class="rounded-xl elevation-2 overflow-hidden mb-6">
      <v-tabs
        v-model="activeTab"
        bg-color="indigo-darken-4"
        slider-color="amber-darken-2"
        grow
      >
        <v-tab value="sucursales" class="font-weight-bold">
          <v-icon start>mdi-storefront</v-icon>
          Sucursales Físicas
        </v-tab>
        <v-tab value="camiones" class="font-weight-bold">
          <v-icon start>mdi-truck</v-icon>
          Camiones Distribuidores
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- PESTAÑA SUCURSALES -->
        <v-window-item value="sucursales" class="pa-6 bg-grey-lighten-4">
          <!-- Barra de controles de Sucursales -->
          <v-row class="mb-4 align-center" dense>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="searchSucursales"
                placeholder="Buscar sucursal..."
                prepend-inner-icon="mdi-magnify"
                density="compact"
                variant="solo-filled"
                hide-details
                rounded="lg"
                class="elevation-1"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="8" class="d-flex justify-end align-center flex-wrap gap-2 mt-2 mt-sm-0">
              <!-- Alternancia de Vistas -->
              <v-btn-toggle
                v-model="viewModeSucursales"
                mandatory
                variant="outlined"
                color="indigo-darken-4"
                density="comfortable"
                class="mr-4 rounded-lg bg-white"
              >
                <v-btn value="grid" icon="mdi-view-grid" title="Vista Tarjetas" />
                <v-btn value="list" icon="mdi-view-list" title="Vista Lista" />
              </v-btn-toggle>

              <v-btn
                color="indigo-darken-4"
                prepend-icon="mdi-store-plus"
                class="rounded-lg font-weight-bold px-4"
                @click="openDialogSucursal(null)"
              >
                Nueva Sucursal
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="mb-6"></v-divider>

          <!-- Loader -->
          <div v-if="loading" class="d-flex justify-center my-12">
            <v-progress-circular indeterminate color="indigo-darken-4" size="64"></v-progress-circular>
          </div>

          <!-- Vista Grid de Sucursales -->
          <v-row v-else-if="viewModeSucursales === 'grid' && filteredSucursales.length > 0">
            <v-col
              v-for="item in filteredSucursales"
              :key="item.idSucursal"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                class="rounded-xl elevation-2 overflow-hidden hover-card h-100 d-flex flex-column border-top-indigo"
                :class="{'opacity-60': !item.estado}"
              >
                <div class="pa-4 flex-grow-1">
                  <div class="d-flex align-start justify-space-between">
                    <div>
                      <div class="d-flex align-center">
                        <h3 class="text-h6 font-weight-bold text-indigo-darken-4 mb-0">
                          {{ item.nombre }}
                        </h3>
                        <v-icon
                          v-if="item.esPrincipal"
                          color="amber-darken-2"
                          class="ml-2"
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
                        {{ item.codigo || 'S-SIN-COD' }}
                      </v-chip>
                    </div>
                    <v-avatar
                      color="indigo-lighten-5"
                      size="48"
                      class="text-indigo-darken-4 font-weight-bold elevation-1"
                    >
                      <v-icon>mdi-storefront</v-icon>
                    </v-avatar>
                  </div>

                  <v-list class="bg-transparent mt-4 pa-0 density-compact">
                    <v-list-item class="px-0">
                      <template v-slot:prepend>
                        <v-icon color="grey-darken-1" size="small" class="mr-2">mdi-map-marker</v-icon>
                      </template>
                      <span class="text-body-2 text-grey-darken-3 font-weight-medium">
                        {{ item.direccion || 'Sin dirección registrada' }}
                      </span>
                    </v-list-item>
                    <v-list-item class="px-0">
                      <template v-slot:prepend>
                        <v-icon color="grey-darken-1" size="small" class="mr-2">mdi-phone</v-icon>
                      </template>
                      <span class="text-body-2 text-grey-darken-3">
                        {{ item.telefono || 'Sin teléfono' }}
                      </span>
                    </v-list-item>
                    <v-list-item class="px-0">
                      <template v-slot:prepend>
                        <v-icon color="grey-darken-1" size="small" class="mr-2">mdi-email</v-icon>
                      </template>
                      <span class="text-body-2 text-grey-darken-3 text-truncate">
                        {{ item.email || 'Sin correo' }}
                      </span>
                    </v-list-item>
                    <v-list-item class="px-0">
                      <template v-slot:prepend>
                        <v-icon color="grey-darken-1" size="small" class="mr-2">mdi-city</v-icon>
                      </template>
                      <span class="text-body-2 text-grey-darken-3 font-weight-bold text-indigo">
                        {{ item.municipio }}
                      </span>
                    </v-list-item>
                  </v-list>
                </div>

                <v-divider></v-divider>

                <!-- Footer Card Actions -->
                <div class="bg-grey-lighten-5 px-4 py-2 d-flex justify-space-between align-center">
                  <div class="d-flex align-center">
                    <v-switch
                      :model-value="item.estado"
                      @update:model-value="toggleEstadoSucursal(item)"
                      color="success"
                      hide-details
                      density="compact"
                      class="mr-2"
                    ></v-switch>
                    <span class="text-caption font-weight-bold" :class="item.estado ? 'text-success' : 'text-grey'">
                      {{ item.estado ? 'Activa' : 'Inactiva' }}
                    </span>
                  </div>
                  <div>
                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      color="indigo"
                      size="small"
                      @click="openDialogSucursal(item)"
                      title="Editar"
                    ></v-btn>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Vista Lista de Sucursales -->
          <v-card v-else-if="viewModeSucursales === 'list' && filteredSucursales.length > 0" class="rounded-xl overflow-hidden elevation-1">
            <v-table class="w-100">
              <thead class="bg-indigo-darken-4 text-white">
                <tr>
                  <th class="text-left text-white font-weight-bold">Sucursal</th>
                  <th class="text-left text-white font-weight-bold">Código</th>
                  <th class="text-left text-white font-weight-bold">Ubicación</th>
                  <th class="text-left text-white font-weight-bold">Dirección</th>
                  <th class="text-left text-white font-weight-bold">Contacto</th>
                  <th class="text-center text-white font-weight-bold">Principal</th>
                  <th class="text-center text-white font-weight-bold">Estado</th>
                  <th class="text-center text-white font-weight-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredSucursales" :key="item.idSucursal" :class="{'bg-grey-lighten-3 opacity-60': !item.estado}">
                  <td class="font-weight-bold text-indigo-darken-4">{{ item.nombre }}</td>
                  <td>
                    <v-chip size="small" variant="flat" color="indigo-lighten-4" class="text-indigo-darken-4 font-weight-bold">
                      {{ item.codigo || '---' }}
                    </v-chip>
                  </td>
                  <td class="font-weight-medium">{{ item.municipio }}</td>
                  <td class="text-truncate" style="max-width: 200px;">{{ item.direccion || '---' }}</td>
                  <td>
                    <div class="text-caption">
                      <div><v-icon size="x-small" class="mr-1">mdi-phone</v-icon> {{ item.telefono || '---' }}</div>
                      <div><v-icon size="x-small" class="mr-1">mdi-email</v-icon> {{ item.email || '---' }}</div>
                    </div>
                  </td>
                  <td class="text-center">
                    <v-icon v-if="item.esPrincipal" color="amber-darken-2">mdi-star</v-icon>
                    <span v-else class="text-grey-lighten-1">-</span>
                  </td>
                  <td class="text-center">
                    <v-chip
                      size="small"
                      :color="item.estado ? 'success' : 'grey'"
                      variant="flat"
                      class="font-weight-bold"
                    >
                      {{ item.estado ? 'Activo' : 'Inactivo' }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <div class="d-flex justify-center align-center">
                      <v-btn
                        icon="mdi-pencil"
                        variant="text"
                        color="indigo"
                        size="small"
                        @click="openDialogSucursal(item)"
                      ></v-btn>
                      <v-switch
                        :model-value="item.estado"
                        @update:model-value="toggleEstadoSucursal(item)"
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
          <v-sheet v-else class="text-center py-12 rounded-xl" bg-color="white">
            <v-icon size="64" color="grey-lighten-1">mdi-storefront-outline</v-icon>
            <h3 class="text-h6 mt-4 text-grey-darken-1">No se encontraron sucursales</h3>
            <p class="text-body-2 text-grey">Intenta ajustar tu búsqueda o registra una nueva sucursal.</p>
          </v-sheet>
        </v-window-item>

        <!-- PESTAÑA CAMIONES -->
        <v-window-item value="camiones" class="pa-6 bg-grey-lighten-4">
          <!-- Barra de controles de Camiones -->
          <v-row class="mb-4 align-center" dense>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="searchCamiones"
                placeholder="Buscar camión por placa..."
                prepend-inner-icon="mdi-magnify"
                density="compact"
                variant="solo-filled"
                hide-details
                rounded="lg"
                class="elevation-1"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="8" class="d-flex justify-end align-center mt-2 mt-sm-0">
              <v-btn
                color="indigo-darken-4"
                prepend-icon="mdi-truck-plus"
                class="rounded-lg font-weight-bold px-4"
                @click="openDialogCamion(null)"
              >
                Nuevo Camión
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="mb-6"></v-divider>

          <!-- Loader -->
          <div v-if="loading" class="d-flex justify-center my-12">
            <v-progress-circular indeterminate color="indigo-darken-4" size="64"></v-progress-circular>
          </div>

          <!-- Vista Tarjetas de Camiones -->
          <v-row v-else-if="filteredCamiones.length > 0">
            <!-- Tarjeta "+" para agregar uno nuevo -->
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-card
                class="rounded-xl border-dashed h-100 d-flex flex-column align-center justify-center cursor-pointer add-truck-card py-10"
                @click="openDialogCamion(null)"
              >
                <v-avatar color="indigo-lighten-5" size="64" class="mb-4">
                  <v-icon color="indigo-darken-4" size="large">mdi-plus</v-icon>
                </v-avatar>
                <span class="font-weight-bold text-indigo-darken-4">Agregar Camión</span>
                <span class="text-caption text-grey text-center px-4 mt-1">Registra una nueva placa para distribución</span>
              </v-card>
            </v-col>

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
                class="rounded-xl elevation-2 overflow-hidden hover-card h-100 d-flex flex-column"
                :class="{'opacity-60': !item.estado}"
              >
                <div class="pa-4 flex-grow-1 text-center">
                  <v-avatar color="indigo-lighten-5" size="56" class="mb-3 text-indigo-darken-4">
                    <v-icon size="32">mdi-truck</v-icon>
                  </v-avatar>

                  <!-- Placa Estilo Real de Placa Vehicular -->
                  <div class="license-plate mx-auto my-3">
                    <div class="plate-top text-uppercase">Distribuidor</div>
                    <div class="plate-number text-uppercase font-weight-bold">{{ item.placa }}</div>
                    <div class="plate-bottom">Tokes</div>
                  </div>

                  <v-chip
                    size="x-small"
                    color="indigo-darken-2"
                    variant="tonal"
                    class="font-weight-bold mt-2"
                  >
                    Bodega Móvil ID: {{ item.idBodega || 'Sin Bodega' }}
                  </v-chip>
                </div>

                <v-divider></v-divider>

                <!-- Actions Footer -->
                <div class="bg-grey-lighten-5 px-4 py-2 d-flex justify-space-between align-center">
                  <div class="d-flex align-center">
                    <v-switch
                      :model-value="item.estado"
                      @update:model-value="toggleEstadoCamion(item)"
                      color="success"
                      hide-details
                      density="compact"
                      class="mr-2"
                    ></v-switch>
                    <span class="text-caption font-weight-bold" :class="item.estado ? 'text-success' : 'text-grey'">
                      {{ item.estado ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                  <div>
                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      color="indigo"
                      size="small"
                      @click="openDialogCamion(item)"
                    ></v-btn>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- No Data View -->
          <v-sheet v-else class="text-center py-12 rounded-xl" bg-color="white">
            <v-icon size="64" color="grey-lighten-1">mdi-truck-outline</v-icon>
            <h3 class="text-h6 mt-4 text-grey-darken-1">No se encontraron camiones</h3>
            <p class="text-body-2 text-grey">Intenta ajustar tu búsqueda o registra tu primer vehículo.</p>
            <v-btn
              color="indigo-darken-4"
              class="mt-4 font-weight-bold rounded-lg"
              prepend-icon="mdi-plus"
              @click="openDialogCamion(null)"
            >
              Agregar Camión
            </v-btn>
          </v-sheet>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- ================= DIÁLOGO REGISTRO/EDICIÓN SUCURSAL ================= -->
    <v-dialog v-model="dialogSucursal.show" max-width="600" persistent>
      <v-card class="rounded-xl overflow-hidden">
        <v-card-title class="bg-indigo-darken-4 text-white font-weight-bold pa-4 d-flex align-center">
          <v-icon start class="mr-2">{{ dialogSucursal.editar ? 'mdi-store-edit' : 'mdi-store-plus' }}</v-icon>
          <span>{{ dialogSucursal.title }}</span>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-form ref="formSucursal" v-model="formValidSucursal">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="dialogSucursal.item.codigo"
                  label="Código Sucursal"
                  placeholder="Ej: SUC-NORTE"
                  variant="outlined"
                  density="compact"
                  maxLength="25"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="dialogSucursal.item.nombre"
                  label="Nombre de Sucursal*"
                  placeholder="Ej: Sucursal Norte"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'El nombre es requerido.']"
                  maxLength="50"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="dialogSucursal.item.direccion"
                  label="Dirección"
                  placeholder="Ej: Kilómetro 12 Carretera Norte..."
                  variant="outlined"
                  density="compact"
                  maxLength="250"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="dialogSucursal.item.telefono"
                  label="Teléfono"
                  placeholder="Ej: +505 8888-8888"
                  variant="outlined"
                  density="compact"
                  maxLength="25"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="dialogSucursal.item.email"
                  label="Correo Electrónico"
                  placeholder="Ej: sucursal@empresa.com"
                  variant="outlined"
                  density="compact"
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
                  :rules="[v => !!v || 'Debe seleccionar un departamento.']"
                  @update:model-value="onDepartamentoChange"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="dialogSucursal.item.idMunicipio"
                  :items="catalogos.municipios"
                  item-title="nombre"
                  item-value="id"
                  label="Municipio*"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'Debe seleccionar un municipio.']"
                  :disabled="!selectedDepartamento"
                ></v-select>
              </v-col>

              <!-- Sucursal Principal -->
              <v-col cols="12" class="pt-2">
                <v-card variant="tonal" color="amber-darken-4" class="pa-3 rounded-lg d-flex align-center justify-space-between">
                  <div>
                    <div class="font-weight-bold text-subtitle-2 text-brown-darken-3">Designar como Principal</div>
                    <div class="text-caption text-grey-darken-2">Solo puede haber una sucursal principal. Al activar esta, la anterior se desactivará.</div>
                  </div>
                  <v-switch
                    v-model="dialogSucursal.item.esPrincipal"
                    color="amber-darken-3"
                    hide-details
                  ></v-switch>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="grey-darken-1"
            class="rounded-lg font-weight-bold"
            @click="dialogSucursal.show = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            class="rounded-lg font-weight-bold px-4"
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
    <v-dialog v-model="dialogCamion.show" max-width="450" persistent>
      <v-card class="rounded-xl overflow-hidden">
        <v-card-title class="bg-indigo-darken-4 text-white font-weight-bold pa-4 d-flex align-center">
          <v-icon start class="mr-2">{{ dialogCamion.editar ? 'mdi-truck-edit' : 'mdi-truck-plus' }}</v-icon>
          <span>{{ dialogCamion.title }}</span>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-form ref="formCamion" v-model="formValidCamion">
            <v-row dense>
              <v-col cols="12" class="text-center mb-4">
                <v-avatar color="indigo-lighten-5" size="64" class="text-indigo-darken-4">
                  <v-icon size="40">mdi-card-bulleted-outline</v-icon>
                </v-avatar>
                <div class="text-caption text-grey mt-1">Registra la placa vehicular exactamente como figura en el vehículo</div>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="dialogCamion.item.placa"
                  label="Número de Placa*"
                  placeholder="Ej: M 123456"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'La placa es requerida.']"
                  maxLength="50"
                  class="text-uppercase"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="grey-darken-1"
            class="rounded-lg font-weight-bold"
            @click="dialogCamion.show = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            class="rounded-lg font-weight-bold px-4"
            :loading="dialogCamion.loading"
            :disabled="!formValidCamion"
            @click="saveCamion"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import RequestHttp from "@/services/requestHttp";

export default {
  name: "BodegasManagement",

  data() {
    return {
      activeTab: "sucursales",
      loading: false,
      requestHttp: new RequestHttp(),
      
      // Búsquedas y filtros
      searchSucursales: "",
      searchCamiones: "",
      viewModeSucursales: "grid", // 'grid' | 'list'
      
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
        title: "",
        loading: false,
        item: {
          idSucursal: 0,
          idMunicipio: null,
          codigo: "",
          nombre: "",
          direccion: "",
          telefono: "",
          email: "",
          esPrincipal: false
        }
      },

      dialogCamion: {
        show: false,
        editar: false,
        title: "",
        loading: false,
        item: {
          idCamion: 0,
          placa: ""
        }
      },

      // Alertas
      alert: {
        show: false,
        text: "",
        color: "success",
        icon: "mdi-check-circle"
      }
    };
  },

  computed: {
    filteredSucursales() {
      if (!this.searchSucursales) return this.sucursales;
      const search = this.searchSucursales.toLowerCase().trim();
      return this.sucursales.filter(
        s =>
          s.nombre.toLowerCase().includes(search) ||
          (s.codigo && s.codigo.toLowerCase().includes(search)) ||
          s.municipio.toLowerCase().includes(search)
      );
    },

    filteredCamiones() {
      if (!this.searchCamiones) return this.camiones;
      const search = this.searchCamiones.toLowerCase().trim();
      return this.camiones.filter(c => c.placa.toLowerCase().includes(search));
    },

    usuarioLogueado() {
      return localStorage.getItem("name") || "Admin";
    }
  },

  methods: {
    // Alertas
    showSnackbar(text, color = "success") {
      this.alert.text = text;
      this.alert.color = color;
      this.alert.icon = color === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.alert.show = true;
    },

    // Carga inicial de datos
    async loadAllData() {
      this.loading = true;
      try {
        await Promise.all([
          this.fetchSucursales(),
          this.fetchCamiones(),
          this.fetchBodegas(),
          this.fetchDepartamentos()
        ]);
        this.calculateStats();
      } catch (error) {
        this.showSnackbar("Error al conectar con la base de datos.", "error");
      } finally {
        this.loading = false;
      }
    },

    async fetchSucursales() {
      const res = await this.requestHttp.getSucursales();
      if (res.code === 200) {
        this.sucursales = res.data;
      }
    },

    async fetchCamiones() {
      const res = await this.requestHttp.getCamiones();
      if (res.code === 200) {
        this.camiones = res.data;
      }
    },

    async fetchBodegas() {
      const res = await this.requestHttp.getBodegas();
      if (res.code === 200) {
        this.bodegas = res.data;
      }
    },

    async fetchDepartamentos() {
      const res = await this.requestHttp.getDepartamentos();
      if (res.code === 200) {
        this.catalogos.departamentos = res.data;
      }
    },

    // Municipios dependientes de Departamento
    async onDepartamentoChange(idDept) {
      this.catalogos.municipios = [];
      this.dialogSucursal.item.idMunicipio = null;
      if (!idDept) return;

      const res = await this.requestHttp.getMunById(idDept);
      if (res.code === 200) {
        this.catalogos.municipios = res.data;
      }
    },

    calculateStats() {
      this.stats.sucursales = this.sucursales.filter(s => s.estado).length;
      this.stats.camiones = this.camiones.filter(c => c.estado).length;
      this.stats.bodegas = this.bodegas.filter(b => b.estado).length;
    },

    // DIÁLOGOS SUCURSAL
    async openDialogSucursal(item = null) {
      if (item) {
        // Cargar municipios del departamento actual antes de poblar el formulario
        // Para esto necesitamos buscar a qué departamento pertenece el municipio de la sucursal
        // Como el endpoint Get de sucursales devuelve el idMunicipio, buscaremos de qué departamento es ese municipio.
        // Pero para simplificar, en catalogos.departamentos podemos buscar la coincidencia o cargar todos.
        this.selectedDepartamento = null;
        this.catalogos.municipios = [];

        // Buscar el municipio en el backend para saber a qué departamento pertenece
        const resMuni = await this.requestHttp.getDepartamentos(); // Re-utilizamos departamentos
        // Para simplificar, recorremos todos los municipios de ese departamento.
        // En nuestro caso, buscaremos el municipio y su departamento usando la API o asumiendo correspondencia.
        // Busquemos en la lista de departamentos la relación (si la DB lo permite).
        // Si no la tenemos localmente, podemos buscar en el backend. 
        // Para resolverlo rápido y elegante: como no tenemos un endpoint directo de "getMunicipioById", 
        // cargaremos el catálogo de municipios completos o intentamos buscar de forma segura.
        // De hecho, en Nicaragua (donde se ubica Tokes usualmente):
        // Podemos buscar el municipio recorriendo de forma asíncrona o si el backend nos la da.
        // Otra opción práctica: iterar por los departamentos y buscar el municipio de la sucursal.
        // Vamos a cargar los municipios para el departamento de la sucursal. 
        // Como el API del combobox de municipios devuelve todos si no se pasa ID? No, requiere idDepartamento.
        // Buscaremos el departamento correcto. Iteramos sobre departamentos y buscamos en qué lista de municipios está.
        // Para ser más rápidos y evitar bloqueos: consultamos los municipios de cada departamento de forma secuencial
        // o simplemente asumimos que el usuario selecciona el departamento de nuevo si desea editar el municipio,
        // pero para una excelente UX, buscaremos su departamento.
        let deptoEncontrado = null;
        for (let d of this.catalogos.departamentos) {
          const resMun = await this.requestHttp.getMunById(d.id);
          if (resMun.code === 200 && resMun.data.some(m => m.id === item.idMunicipio)) {
            deptoEncontrado = d.id;
            this.catalogos.municipios = resMun.data;
            break;
          }
        }

        this.selectedDepartamento = deptoEncontrado;

        this.dialogSucursal.editar = true;
        this.dialogSucursal.title = "Editar Sucursal";
        this.dialogSucursal.item = {
          idSucursal: item.idSucursal,
          idMunicipio: item.idMunicipio,
          codigo: item.codigo,
          nombre: item.nombre,
          direccion: item.direccion,
          telefono: item.telefono,
          email: item.email,
          esPrincipal: item.esPrincipal
        };
      } else {
        this.selectedDepartamento = null;
        this.catalogos.municipios = [];
        this.dialogSucursal.editar = false;
        this.dialogSucursal.title = "Nueva Sucursal";
        this.dialogSucursal.item = {
          idSucursal: 0,
          idMunicipio: null,
          codigo: "",
          nombre: "",
          direccion: "",
          telefono: "",
          email: "",
          esPrincipal: false
        };
      }
      this.dialogSucursal.show = true;
    },

    async saveSucursal() {
      if (!this.formValidSucursal) return;

      this.dialogSucursal.loading = true;
      const payload = {
        ...this.dialogSucursal.item,
        usuarioRegistro: this.usuarioLogueado
      };

      try {
        let res;
        if (this.dialogSucursal.editar) {
          res = await this.requestHttp.putSucursal(payload, this.dialogSucursal.item.idSucursal);
        } else {
          res = await this.requestHttp.postSucursal(payload);
        }

        if (res.code === 200) {
          this.showSnackbar(
            this.dialogSucursal.editar
              ? "Sucursal actualizada correctamente."
              : "Sucursal y Bodega asociadas creadas correctamente."
          );
          this.dialogSucursal.show = false;
          await this.loadAllData();
        } else {
          this.showSnackbar(res.data?.msg || res.data || "Error al guardar la sucursal.", "error");
        }
      } catch (err) {
        this.showSnackbar("Error de conexión al servidor.", "error");
      } finally {
        this.dialogSucursal.loading = false;
      }
    },

    async toggleEstadoSucursal(item) {
      if (item.esPrincipal && item.estado) {
        this.showSnackbar("No se puede desactivar la sucursal principal activa.", "error");
        return;
      }

      try {
        const res = await this.requestHttp.deleteSucursal(item.idSucursal, this.usuarioLogueado);
        if (res.code === 200) {
          this.showSnackbar(res.data?.msg || "Estado de sucursal actualizado.");
          await this.loadAllData();
        } else {
          this.showSnackbar(res.data?.ex || "No se pudo cambiar el estado.", "error");
        }
      } catch (err) {
        this.showSnackbar("Error al actualizar estado.", "error");
      }
    },

    // DIÁLOGOS CAMIÓN
    openDialogCamion(item = null) {
      if (item) {
        this.dialogCamion.editar = true;
        this.dialogCamion.title = "Editar Camión";
        this.dialogCamion.item = {
          idCamion: item.idCamion,
          placa: item.placa
        };
      } else {
        this.dialogCamion.editar = false;
        this.dialogCamion.title = "Nuevo Camión";
        this.dialogCamion.item = {
          idCamion: 0,
          placa: ""
        };
      }
      this.dialogCamion.show = true;
    },

    async saveCamion() {
      if (!this.formValidCamion) return;

      this.dialogCamion.loading = true;
      const payload = {
        placa: this.dialogCamion.item.placa,
        usuarioRegistro: this.usuarioLogueado
      };

      try {
        let res;
        if (this.dialogCamion.editar) {
          res = await this.requestHttp.putCamion(payload, this.dialogCamion.item.idCamion);
        } else {
          res = await this.requestHttp.postCamion(payload);
        }

        if (res.code === 200) {
          this.showSnackbar(
            this.dialogCamion.editar
              ? "Camión actualizado correctamente."
              : "Camión y Bodega asociada creados correctamente."
          );
          this.dialogCamion.show = false;
          await this.loadAllData();
        } else {
          this.showSnackbar(res.data?.msg || res.data || "Error al registrar el camión.", "error");
        }
      } catch (err) {
        this.showSnackbar("Error de conexión al servidor.", "error");
      } finally {
        this.dialogCamion.loading = false;
      }
    },

    async toggleEstadoCamion(item) {
      try {
        const res = await this.requestHttp.deleteCamion(item.idCamion, this.usuarioLogueado);
        if (res.code === 200) {
          this.showSnackbar(res.data?.msg || "Estado del camión actualizado.");
          await this.loadAllData();
        } else {
          this.showSnackbar(res.data?.ex || "No se pudo cambiar el estado.", "error");
        }
      } catch (err) {
        this.showSnackbar("Error al actualizar el estado.", "error");
      }
    }
  },

  mounted() {
    this.loadAllData();
  }
};
</script>

<style scoped>
/* Colores de gradiente premium */
.bg-gradient-sucursales {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.bg-gradient-camiones {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}

.bg-gradient-bodegas {
  background: linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%);
}

/* Efecto de borde superior */
.border-top-indigo {
  border-top: 4px solid #1a237e !important;
}

/* Micro-animación de hover */
.hover-card {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15) !important;
}

/* Tarjeta especial para agregar camión */
.add-truck-card {
  border: 2px dashed #1a237e !important;
  background-color: #f5f6fa;
  transition: all 0.25s ease;
}
.add-truck-card:hover {
  background-color: #ebedf5;
  border-color: #3f51b5 !important;
  transform: translateY(-3px);
}

/* Placa vehicular estilo real */
.license-plate {
  width: 170px;
  height: 95px;
  background-color: #fdfdfd;
  border: 4px solid #1e272e;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
  font-family: 'Courier New', Courier, monospace;
}
.plate-top {
  font-size: 9px;
  font-weight: 800;
  color: #7f8c8d;
  letter-spacing: 2px;
}
.plate-number {
  font-size: 24px;
  color: #2c3e50;
  letter-spacing: 1px;
  line-height: 1;
}
.plate-bottom {
  font-size: 8px;
  color: #7f8c8d;
  font-weight: bold;
  letter-spacing: 1px;
}

.gap-2 {
  gap: 8px;
}
</style>
