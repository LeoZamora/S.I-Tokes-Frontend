<template>
  <v-card
    elevation="1"
    class="rounded-lg mb-6 bg-grey-lighten-5 w-100"
  >
    <!-- BARRA SUPERIOR / HEADER DEL CARD DE CLIENTE (IGUAL A GESTION PRODUCTO) -->
    <v-toolbar
      density="comfortable"
      class="px-2 bg-grey-lighten-5 border-b"
    >
      <v-btn
        icon
        variant="text"
        class="mr-2"
        @click="closeDialog()"
      >
        <v-icon color="grey-darken-2"
          >mdi-arrow-left</v-icon
        >
        <v-tooltip
          activator="parent"
          location="bottom"
          >Volver al listado</v-tooltip
        >
      </v-btn>

      <div class="d-flex align-center">
        <v-avatar
          color="white"
          size="36"
          class="mr-3 border"
          variant="flat"
        >
          <v-icon
            color="indigo-darken-4"
            size="22"
            >mdi-account-tie</v-icon
          >
        </v-avatar>
        <div>
          <div
            class="text-subtitle-1 font-weight-bold text-indigo-darken-4"
          >
            {{ localTitle }}
          </div>
          <div
            class="text-caption text-grey-darken-1"
            v-if="
              localEdit && data.dataCliente.nombre
            "
          >
            {{ data.dataCliente.nombre }}
            <span v-if="data.dataCliente.codigo"
              >(Código:
              {{ data.dataCliente.codigo }})</span
            >
          </div>
          <div
            class="text-caption text-grey-darken-1"
            v-else-if="
              localView && data.dataCliente.nombre
            "
          >
            Ficha de Detalle del Cliente -
            {{ data.dataCliente.nombre }}
          </div>
          <div
            class="text-caption text-grey-darken-1"
            v-else
          >
            Complete los campos para registrar un
            nuevo cliente en el sistema
          </div>
        </div>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center ga-2">
        <v-btn
          color="grey-darken-1"
          variant="tonal"
          size="small"
          prepend-icon="mdi-close"
          @click="closeDialog()"
        >
          {{ localView ? 'Volver' : 'Cancelar' }}
        </v-btn>
        <v-btn
          v-if="!localView"
          color="indigo-darken-4"
          variant="elevated"
          size="small"
          prepend-icon="mdi-content-save"
          :disabled="data.disabledBtn"
          @click="handleSave()"
        >
          <template v-if="data.disabledBtn">
            <v-progress-circular
              color="white"
              indeterminate
              :size="18"
              :width="2"
              class="mr-1"
            />
            Guardando...
          </template>
          <template v-else>
            Guardar Cliente
          </template>
        </v-btn>
      </div>
    </v-toolbar>

    <!-- FORMULARIO PRINCIPAL CON ESTRUCTURA EN 2 COLUMNAS (8 COLS / 4 COLS) -->
    <v-card-text class="pa-4 pa-md-6">
      <v-form ref="form" class="w-100">
        <v-row dense>
          <!-- COLUMNA PRINCIPAL IZQUIERDA (8 columnas) -->
          <v-col cols="12" md="8">
            <div class="d-flex flex-column ga-4">
              <!-- 1. CLASIFICACIÓN Y DATOS GENERALES -->
              <v-card
                variant="flat"
                class="border rounded-lg bg-white overflow-hidden"
                elevation="0"
              >
                <div
                  class="bg-indigo-lighten-5 px-4 py-2 border-b d-flex align-center justify-space-between flex-wrap ga-2"
                >
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo-darken-4 d-flex align-center"
                  >
                    <v-icon
                      size="small"
                      class="mr-2"
                      color="indigo"
                      >mdi-card-account-details-outline</v-icon
                    >
                    Clasificación y Datos
                    Generales
                  </div>
                  <v-chip
                    size="x-small"
                    color="indigo"
                    variant="tonal"
                    class="font-weight-medium"
                  >
                    Obligatorio
                  </v-chip>
                </div>

                <div class="pa-4">
                  <v-row dense>
                    <!-- Categoría / Tipo de Cliente -->
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="
                          data.dataCliente
                            .idCategoriaCliente
                        "
                        :items="
                          data.categoriaCliente
                        "
                        label="Tipo de cliente"
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        prepend-inner-icon="mdi-shape-outline"
                        hide-details="auto"
                        persistent-placeholder
                        :rules="[rules.required]"
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>

                    <!-- Código del Cliente -->
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="
                          data.dataCliente.codigo
                        "
                        label="Código de Cliente"
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        hide-details="auto"
                        persistent-placeholder
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>

                    <!-- Nombre Comercial -->
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="
                          data.dataCliente.nombre
                        "
                        label="Nombre Comercial / Cliente"
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        prepend-inner-icon="mdi-account"
                        hide-details="auto"
                        persistent-placeholder
                        :rules="[
                          rules.required,
                          rules.minLength(3)
                        ]"
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>

                    <!-- Razón Social -->
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="
                          data.dataCliente
                            .razonSocial
                        "
                        label="Razón Social"
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        prepend-inner-icon="mdi-office-building"
                        hide-details="auto"
                        persistent-placeholder
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>

                    <!-- Tipo de Documento -->
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="
                          data.dataCliente
                            .idTipoDocumento
                        "
                        :items="
                          cmb.tiposDocumento
                        "
                        label="Tipo de Identificación"
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        prepend-inner-icon="mdi-card-account-details"
                        hide-details="auto"
                        persistent-placeholder
                        clearable
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>

                    <!-- Número de Documento -->
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="
                          data.dataCliente
                            .noDocumento
                        "
                        label="Número de Identificación"
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        prepend-inner-icon="mdi-numeric"
                        hide-details="auto"
                        persistent-placeholder
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>

                    <!-- Teléfono -->
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="
                          data.dataCliente
                            .telefono
                        "
                        label="Teléfono"
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        prepend-inner-icon="mdi-phone"
                        hide-details="auto"
                        persistent-placeholder
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>

                    <!-- Correo Electrónico -->
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="
                          data.dataCliente.email
                        "
                        label="Correo Electrónico"
                        placeholder="cliente@correo.com"
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        prepend-inner-icon="mdi-email-outline"
                        hide-details="auto"
                        persistent-placeholder
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>
                  </v-row>
                </div>
              </v-card>

              <!-- 2. DIRECCIONES Y UBICACIONES DEL CLIENTE -->
              <v-card
                variant="flat"
                class="border rounded-lg bg-white overflow-hidden"
                elevation="0"
              >
                <div
                  class="bg-indigo-lighten-5 px-4 py-2 border-b d-flex align-center justify-space-between flex-wrap ga-2"
                >
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo-darken-4 d-flex align-center"
                  >
                    <v-icon
                      size="small"
                      class="mr-2"
                      color="indigo"
                      >mdi-map-marker-multiple</v-icon
                    >
                    Direcciones y Ubicaciones ({{
                      data.dataCliente.direcciones
                        ? data.dataCliente
                            .direcciones.length
                        : 0
                    }})
                  </div>
                  <v-btn
                    v-if="!localView"
                    size="small"
                    color="indigo"
                    variant="tonal"
                    prepend-icon="mdi-plus"
                    @click="
                      openAddressModal('add')
                    "
                  >
                    Añadir Dirección
                  </v-btn>
                </div>

                <div class="pa-4">
                  <v-table
                    density="compact"
                    class="elevation-0 border rounded-lg overflow-hidden"
                  >
                    <thead>
                      <tr
                        class="bg-indigo-lighten-5"
                      >
                        <th
                          class="text-left font-weight-bold text-caption py-2"
                          style="width: 20%"
                        >
                          Nombre
                        </th>
                        <th
                          class="text-left font-weight-bold text-caption py-2"
                          style="width: 22%"
                        >
                          Ubicación
                        </th>
                        <th
                          class="text-left font-weight-bold text-caption py-2"
                          style="width: 38%"
                        >
                          Dirección Detallada
                        </th>
                        <th
                          class="text-center font-weight-bold text-caption py-2"
                          style="width: 12%"
                        >
                          Facturación
                        </th>
                        <th
                          v-if="!localView"
                          class="text-center font-weight-bold text-caption py-2"
                          style="width: 8%"
                        >
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(dir, idx) in data
                          .dataCliente
                          .direcciones"
                        :key="idx"
                        class="hover-row"
                      >
                        <!-- Nombre / Identificador -->
                        <td
                          class="py-2 text-caption font-weight-bold text-indigo-darken-4"
                        >
                          <div
                            class="d-flex align-center"
                          >
                            <v-icon
                              size="small"
                              color="indigo"
                              class="mr-1"
                              >mdi-map-marker</v-icon
                            >
                            <span>{{
                              dir.nombre ||
                              'Principal'
                            }}</span>
                          </div>
                        </td>

                        <!-- Ubicación Dept / Mun -->
                        <td
                          class="py-2 text-caption"
                        >
                          <div
                            class="font-weight-medium"
                          >
                            {{
                              dir.departamento ||
                              getNombreDept(
                                dir.idDepartamento
                              )
                            }}
                          </div>
                          <div
                            class="text-caption text-grey"
                            v-if="
                              dir.municipio ||
                              dir.idMunicipio
                            "
                          >
                            {{
                              dir.municipio ||
                              getNombreMun(
                                dir.idDepartamento,
                                dir.idMunicipio
                              )
                            }}
                          </div>
                        </td>

                        <!-- Dirección Ingresada & GPS -->
                        <td
                          class="py-2 text-caption text-wrap"
                          style="max-width: 260px"
                        >
                          <div>
                            {{
                              dir.direccionIngresada ||
                              '—'
                            }}
                          </div>
                          <div
                            v-if="
                              dir.googleMapsURL ||
                              (dir.latitude &&
                                dir.longitude)
                            "
                            class="mt-1"
                          >
                            <a
                              :href="
                                getGpsUrl(dir)
                              "
                              target="_blank"
                              class="text-teal font-weight-bold text-decoration-none d-inline-flex align-center"
                              style="
                                font-size: 11px;
                              "
                            >
                              <v-icon
                                size="x-small"
                                color="teal"
                                class="mr-1"
                                >mdi-navigation</v-icon
                              >
                              Ver en Google Maps
                            </a>
                          </div>
                        </td>

                        <!-- Facturación -->
                        <td
                          class="py-2 text-center"
                        >
                          <v-tooltip
                            text="Dirección principal de facturación"
                            location="top"
                          >
                            <template
                              v-slot:activator="{
                                props
                              }"
                            >
                              <v-radio
                                v-if="!localView"
                                v-bind="props"
                                :model-value="
                                  dir.esDirFacturacion
                                "
                                @click="
                                  setBillingAddress(
                                    idx
                                  )
                                "
                                color="amber-darken-3"
                                density="compact"
                                hide-details
                                class="d-inline-flex justify-center"
                              />
                              <v-chip
                                v-else-if="
                                  dir.esDirFacturacion
                                "
                                size="x-small"
                                color="amber-darken-3"
                                variant="flat"
                              >
                                Facturación
                              </v-chip>
                              <span
                                v-else
                                class="text-grey text-caption"
                                >—</span
                              >
                            </template>
                          </v-tooltip>
                        </td>

                        <!-- Acciones -->
                        <td
                          v-if="!localView"
                          class="py-2 text-center"
                        >
                          <div
                            class="d-flex align-center justify-center ga-1"
                          >
                            <v-btn
                              icon
                              size="x-small"
                              variant="text"
                              color="indigo"
                              @click="
                                openAddressModal(
                                  'edit',
                                  dir,
                                  idx
                                )
                              "
                            >
                              <v-icon size="small"
                                >mdi-pencil</v-icon
                              >
                              <v-tooltip
                                activator="parent"
                                location="top"
                                >Editar</v-tooltip
                              >
                            </v-btn>
                            <v-btn
                              icon
                              size="x-small"
                              variant="text"
                              color="error"
                              @click="
                                removeAddress(idx)
                              "
                              :disabled="
                                data.dataCliente
                                  .direcciones
                                  .length <= 1
                              "
                            >
                              <v-icon size="small"
                                >mdi-delete</v-icon
                              >
                              <v-tooltip
                                activator="parent"
                                location="top"
                                >Eliminar</v-tooltip
                              >
                            </v-btn>
                          </div>
                        </td>
                      </tr>

                      <!-- FILA CLICKABLE PARA AGREGAR NUEVA DIRECCIÓN (IGUAL A GESTION PRODUCTO) -->
                      <tr
                        v-if="!localView"
                        class="text-center hover-add-row"
                        style="cursor: pointer"
                        @click="
                          openAddressModal('add')
                        "
                      >
                        <td
                          :colspan="
                            localView ? 4 : 5
                          "
                          class="py-2 text-indigo-darken-4 font-weight-bold text-caption bg-indigo-lighten-5"
                        >
                          <v-icon
                            size="small"
                            class="mr-1"
                            >mdi-plus-circle-outline</v-icon
                          >
                          Agregar nueva dirección
                        </td>
                      </tr>

                      <!-- FILA VACÍA -->
                      <tr
                        v-if="
                          !data.dataCliente
                            .direcciones ||
                          data.dataCliente
                            .direcciones
                            .length === 0
                        "
                      >
                        <td
                          :colspan="
                            localView ? 4 : 5
                          "
                          class="text-center text-grey text-caption py-3"
                        >
                          <v-icon
                            class="mr-1"
                            size="small"
                            >mdi-information-outline</v-icon
                          >
                          No hay direcciones
                          registradas para este
                          cliente.
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>
            </div>
          </v-col>

          <!-- COLUMNA LATERAL DERECHA (4 columnas) -->
          <v-col cols="12" md="4">
            <div class="d-flex flex-column ga-4">
              <!-- 3. RUTA Y LOGÍSTICA -->
              <v-card
                variant="flat"
                class="border rounded-lg bg-white overflow-hidden"
                elevation="0"
              >
                <div
                  class="bg-indigo-lighten-5 px-4 py-2 border-b d-flex align-center justify-space-between"
                >
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo-darken-4 d-flex align-center"
                  >
                    <v-icon
                      size="small"
                      class="mr-2"
                      color="indigo"
                      >mdi-routes</v-icon
                    >
                    Ruta y Logística
                  </div>
                  <v-chip
                    size="x-small"
                    color="indigo"
                    variant="tonal"
                    class="font-weight-medium"
                  >
                    Obligatorio
                  </v-chip>
                </div>

                <div class="pa-4">
                  <v-row dense>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="
                          data.dataCliente
                            .idDepartamento
                        "
                        :items="
                          data.departamentos
                        "
                        label="Departamento"
                        placeholder="Seleccione departamento"
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        prepend-inner-icon="mdi-city-variant-outline"
                        hide-details="auto"
                        persistent-placeholder
                        clearable
                        :readonly="
                          readonlyOption()
                        "
                        @update:model-value="
                          onDeptChange
                        "
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-autocomplete
                        v-model="
                          data.dataCliente
                            .idMunicipio
                        "
                        :items="data.municipios"
                        label="Municipio"
                        placeholder="Seleccione municipio"
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        prepend-inner-icon="mdi-city"
                        hide-details="auto"
                        persistent-placeholder
                        clearable
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        :items="cmb.rutas"
                        v-model="
                          data.dataCliente.idRuta
                        "
                        :rules="[rules.required]"
                        color="indigo"
                        prepend-inner-icon="mdi-map-marker-path"
                        density="compact"
                        variant="outlined"
                        label="Ruta Principal *"
                        placeholder="Seleccione ruta que cubre al cliente"
                        persistent-placeholder
                        hide-details="auto"
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="
                          data.dataCliente
                            .observaciones
                        "
                        label="Observaciones"
                        placeholder="Observaciones sobre el cliente o referencias especiales..."
                        variant="outlined"
                        density="compact"
                        color="indigo"
                        prepend-inner-icon="mdi-text"
                        hide-details="auto"
                        rows="3"
                        persistent-placeholder
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>
                  </v-row>
                </div>
              </v-card>

              <!-- 4. CONTROL DE CRÉDITO -->
              <v-card
                variant="flat"
                class="border rounded-lg bg-white overflow-hidden"
                elevation="0"
              >
                <div
                  class="bg-indigo-lighten-5 px-4 py-2 border-b d-flex align-center justify-space-between"
                >
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo-darken-4 d-flex align-center"
                  >
                    <v-icon
                      size="small"
                      class="mr-2"
                      color="indigo"
                      >mdi-credit-card-outline</v-icon
                    >
                    Control de Crédito
                  </div>
                  <v-chip
                    size="x-small"
                    :color="
                      data.dataCliente.esTieneCredito
                        ? 'green-darken-2'
                        : 'grey-darken-1'
                    "
                    variant="tonal"
                    class="font-weight-bold"
                  >
                    {{
                      data.dataCliente.esTieneCredito
                        ? 'Crédito Habilitado'
                        : 'Sin Crédito'
                    }}
                  </v-chip>
                </div>

                <div class="pa-4">
                  <v-row dense>
                    <!-- Habilitar Crédito Switch -->
                    <v-col cols="12">
                      <v-switch
                        v-model="
                          data.dataCliente.esTieneCredito
                        "
                        label="¿Tiene Crédito Habilitado?"
                        color="indigo"
                        density="compact"
                        hide-details
                        :readonly="
                          readonlyOption()
                        "
                      />
                    </v-col>

                    <template
                      v-if="data.dataCliente.esTieneCredito"
                    >
                      <!-- Tipo de Crédito Mensual Switch -->
                      <v-col cols="12">
                        <v-switch
                          v-model="
                            data.dataCliente.esCreditoMensual
                          "
                          label="Crédito Mensual"
                          color="indigo"
                          density="compact"
                          hide-details
                          :readonly="
                            readonlyOption()
                          "
                        />
                      </v-col>

                      <!-- Límite de Crédito -->
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model.number="
                            data.dataCliente.limiteCredito
                          "
                          label="Límite de Crédito"
                          placeholder="0.00"
                          variant="outlined"
                          density="compact"
                          color="indigo"
                          type="number"
                          min="0"
                          step="0.01"
                          prefix="C$"
                          hide-details="auto"
                          persistent-placeholder
                          :readonly="
                            readonlyOption()
                          "
                        />
                      </v-col>

                      <!-- Días de Crédito -->
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model.number="
                            data.dataCliente.diasCredito
                          "
                          label="Días de Crédito"
                          placeholder="30"
                          variant="outlined"
                          density="compact"
                          color="indigo"
                          type="number"
                          min="0"
                          prepend-inner-icon="mdi-calendar-clock"
                          hide-details="auto"
                          persistent-placeholder
                          :readonly="
                            readonlyOption()
                          "
                        />
                      </v-col>
                    </template>
                  </v-row>
                </div>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <!-- DIÁLOGO SECUNDARIO PARA AGREGAR / EDITAR UNA DIRECCIÓN -->
    <v-dialog
      v-model="addrModal.show"
      max-width="540"
      persistent
    >
      <v-card class="rounded-lg">
        <v-card-title
          class="bg-indigo-darken-4 text-white text-subtitle-1 font-weight-bold d-flex align-center py-2 px-3"
        >
          <v-icon class="mr-2" size="small"
            >mdi-map-marker-plus</v-icon
          >
          {{
            addrModal.isEdit
              ? 'Editar Dirección'
              : 'Agregar Nueva Dirección'
          }}
          <v-spacer />
          <v-btn
            icon
            size="x-small"
            color="white"
            variant="text"
            @click="addrModal.show = false"
          >
            <v-icon size="small"
              >mdi-close</v-icon
            >
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="addrForm">
            <v-row dense>
              <!-- Nombre de Dirección -->
              <v-col cols="12" class="py-1">
                <v-text-field
                  v-model="addrModal.form.nombre"
                  label="Nombre / Identificador de la dirección *"
                  placeholder="Ej: Principal, Sucursal Norte, Bodega"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  prepend-inner-icon="mdi-tag-outline"
                  hide-details="auto"
                  :rules="[rules.required]"
                />
              </v-col>

              <!-- Departamento -->
              <v-col
                cols="12"
                sm="6"
                class="py-1"
              >
                <v-autocomplete
                  v-model="
                    addrModal.form.idDepartamento
                  "
                  :items="data.departamentos"
                  label="Departamento *"
                  placeholder="Seleccione departamento"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  prepend-inner-icon="mdi-city-variant-outline"
                  hide-details="auto"
                  :rules="[rules.required]"
                  @update:model-value="
                    onAddrDeptChange
                  "
                />
              </v-col>

              <!-- Municipio -->
              <v-col
                cols="12"
                sm="6"
                class="py-1"
              >
                <v-autocomplete
                  v-model="
                    addrModal.form.idMunicipio
                  "
                  :items="addrModal.municipios"
                  label="Municipio"
                  placeholder="Seleccione municipio"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  prepend-inner-icon="mdi-city"
                  hide-details="auto"
                />
              </v-col>

              <!-- Dirección Ingresada -->
              <v-col cols="12" class="py-1">
                <v-textarea
                  v-model="
                    addrModal.form
                      .direccionIngresada
                  "
                  label="Dirección Completa *"
                  placeholder="Ingrese el texto exacto de la dirección"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  prepend-inner-icon="mdi-map-marker"
                  rows="3"
                  hide-details="auto"
                  :rules="[rules.required]"
                />
              </v-col>

              <!-- URL Google Maps o Coordenadas -->
              <v-col cols="12" class="py-1">
                <v-text-field
                  v-model="
                    addrModal.form.googleMapsURL
                  "
                  label="Enlace Google Maps / Coordenadas (Opcional)"
                  placeholder="https://maps.google.com/?q=... o Lat, Long"
                  variant="outlined"
                  density="compact"
                  color="indigo"
                  prepend-inner-icon="mdi-crosshairs-gps"
                  hide-details="auto"
                />
              </v-col>

              <!-- Es Dirección de Facturación -->
              <v-col cols="12" class="py-1">
                <v-checkbox
                  v-model="
                    addrModal.form
                      .esDirFacturacion
                  "
                  label="Establecer como dirección principal de facturación"
                  color="amber-darken-3"
                  density="compact"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions
          class="pa-3 bg-grey-lighten-4"
        >
          <v-btn
            color="grey-darken-1"
            variant="text"
            size="small"
            @click="addrModal.show = false"
          >
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn
            color="indigo-darken-4"
            variant="elevated"
            size="small"
            prepend-icon="mdi-check"
            @click="saveAddressFromModal"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <OverlayComp :show="data.overlay.show" />
    <SuccessAlert
      :success="data.alertSuccess.success"
      :msg="data.alertSuccess.msg"
      :show="data.alertSuccess.show"
    />
  </v-card>
</template>

<script>
import { formatters } from '@/helpers/formatters'
import SuccessAlert from '@/components/widgets/SuccessAlert.vue'
import OverlayComp from '@/components/reutilizable/OverlayComp.vue'
import RequestHttp from '@/services/requestHttp'
import { reactive, ref, watch } from 'vue'
import { getItemsCombobox } from '@/scripts/api.js'
import { useStore } from '@/store'

export default {
  async mounted() {
    await Promise.all([
      this.getCategoriaCliente(),
      this.getDepartamentos(),
      this.loadCmbRutas(),
      this.loadCmbTiposDocumento()
    ])
    await this.initData()
  },

  components: {
    OverlayComp,
    SuccessAlert
  },

  props: {
    show: {
      type: Boolean,
      required: true,
      default: true
    },
    editar: {
      type: Boolean,
      required: false
    },
    prov: {
      type: Object,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    ver: {
      type: Boolean,
      required: false
    }
  },

  data() {
    return {
      cmb: {
        rutas: [],
        tiposDocumento: []
      },
      rules: {
        required: (v) =>
          !!v || 'Campo obligatorio.',
        minLength: (len) => (v) =>
          (v && v.length >= len) ||
          `Mínimo ${len} caracteres.`
      }
    }
  },

  setup(props) {
    const store = useStore()
    const localShow = ref(props.show)
    const localEdit = ref(props.editar)
    const localCliente = ref(props.prov)
    const localTitle = ref(props.title)
    const localView = ref(props.ver)

    const data = reactive({
      nowDate: new Date(),
      dataCliente: {
        categoriaCliente: null,
        codigo: null,
        departamento: null,
        direccion: null,
        estado: true,
        fechaRegistro: null,
        idCategoriaCliente: null,
        idCliente: null,
        idDepartamento: null,
        idMunicipio: null,
        idRuta: null,
        idTipoDocumento: null,
        noDocumento: null,
        razonSocial: null,
        municipio: null,
        nombre: null,
        email: null,
        observaciones: null,
        ruta: null,
        telefono: null,
        usuarioRegistro: null,
        esTieneCredito: false,
        esCreditoMensual: false,
        limiteCredito: null,
        diasCredito: null,
        direcciones: []
      },
      overlay: {
        show: false
      },
      alertSuccess: {
        show: false,
        msg: '',
        success: false
      },
      disabledBtn: false,
      departamentos: [],
      municipios: [],
      idCliente: null,
      categoriaCliente: [],
      requestHttp: new RequestHttp()
    })

    const addrModal = reactive({
      show: false,
      isEdit: false,
      editIdx: -1,
      municipios: [],
      form: {
        idDireccion: null,
        nombre: 'Principal',
        idDepartamento: null,
        idMunicipio: null,
        direccionIngresada: '',
        googleMapsURL: '',
        esDirFacturacion: false,
        observaciones: ''
      }
    })

    function assignClientData(src) {
      if (!src) return

      data.idCliente =
        src.idCliente || data.idCliente || null

      data.dataCliente = {
        idCliente:
          src.idCliente || data.idCliente || null,
        codigo: src.codigo || null,
        nombre: src.nombre || null,
        razonSocial: src.razonSocial || null,
        idCategoriaCliente:
          src.idCategoriaCliente ||
          (src.idCategoriaClienteNavigation
            ? src.idCategoriaClienteNavigation
                .idCategoriaCliente
            : null),
        idTipoDocumento:
          src.idTipoDocumento || null,
        noDocumento: src.noDocumento || null,
        telefono: src.telefono || null,
        email: src.email || src.correo || null,
        idRuta: src.idRuta || null,
        idDepartamento:
          src.idDepartamento || null,
        idMunicipio: src.idMunicipio || null,
        direccion: src.direccion || null,
        observaciones: src.observaciones || null,
        estado:
          src.estado !== undefined
            ? src.estado
            : true,
        fechaRegistro:
          src.fechaRegistro ||
          new Date().toISOString(),
        usuarioRegistro:
          src.usuarioRegistro || null,
        esTieneCredito:
          src.esTieneCredito !== undefined
            ? src.esTieneCredito
            : src.EsTieneCredito !== undefined
            ? src.EsTieneCredito
            : false,
        esCreditoMensual:
          src.esCreditoMensual !== undefined
            ? src.esCreditoMensual
            : src.EsCreditoMensual !== undefined
            ? src.EsCreditoMensual
            : false,
        limiteCredito:
          src.limiteCredito !== undefined && src.limiteCredito !== null
            ? src.limiteCredito
            : src.LimiteCredito !== undefined && src.LimiteCredito !== null
            ? src.LimiteCredito
            : null,
        diasCredito:
          src.diasCredito !== undefined && src.diasCredito !== null
            ? src.diasCredito
            : src.DiasCredito !== undefined && src.DiasCredito !== null
            ? src.DiasCredito
            : null,
        direcciones:
          Array.isArray(src.direcciones) &&
          src.direcciones.length > 0
            ? src.direcciones.map((d) => ({
                ...d
              }))
            : []
      }

      // Si es un cliente existente que no tiene lista de direcciones pero tiene dirección base registrada
      if (
        data.dataCliente.direcciones.length ===
          0 &&
        (src.direccion || src.idDepartamento)
      ) {
        data.dataCliente.direcciones.push({
          idDireccion: null,
          nombre: 'Principal',
          idDepartamento:
            data.dataCliente.idDepartamento ||
            null,
          idMunicipio:
            data.dataCliente.idMunicipio || null,
          direccionIngresada:
            data.dataCliente.direccion || '',
          googleMapsURL: src.googleMapsURL || '',
          latitude: src.latitude || null,
          longitude: src.longitude || null,
          esDirFacturacion: true
        })
      }
    }

    function resetForm() {
      data.idCliente = null
      data.dataCliente = {
        idCliente: null,
        codigo: null,
        nombre: null,
        razonSocial: null,
        idCategoriaCliente: null,
        idTipoDocumento: null,
        noDocumento: null,
        telefono: null,
        email: null,
        idRuta: null,
        idDepartamento: null,
        idMunicipio: null,
        direccion: null,
        observaciones: null,
        estado: true,
        fechaRegistro: new Date().toISOString(),
        usuarioRegistro: null,
        esTieneCredito: false,
        esCreditoMensual: false,
        limiteCredito: null,
        diasCredito: null,
        direcciones: []
      }
    }

    async function initData() {
      if (
        props.prov &&
        (props.prov.idCliente ||
          props.prov.nombre)
      ) {
        data.overlay.show = true
        data.idCliente =
          props.prov.idCliente || null

        // 1. Asignación inmediata desde props para respuesta instantánea
        assignClientData(props.prov)

        // 2. Consulta a API para datos detallados si existe idCliente
        if (props.prov.idCliente) {
          try {
            const result =
              await data.requestHttp.getByIdCliente(
                props.prov.idCliente
              )
            if (
              result &&
              result.code === 200 &&
              result.data
            ) {
              const apiData =
                result.data.data || result.data
              assignClientData(apiData)
            }
          } catch (err) {
            console.error(
              'Error fetching client by id:',
              err
            )
          }
        }

        if (data.dataCliente.idDepartamento) {
          await getMunicipios()
        }

        data.overlay.show = false
      } else {
        resetForm()
      }
    }

    watch(
      () => props.show,
      (newValue) => {
        localShow.value = newValue
      }
    )

    watch(
      () => props.ver,
      async (val) => {
        localView.value = val
        if (val === true && props.prov) {
          await initData()
        }
      }
    )

    watch(
      () => props.editar,
      async (val) => {
        localEdit.value = val
        if (val === true && props.prov) {
          await initData()
        }
      }
    )

    watch(
      () => props.prov,
      async (val) => {
        localCliente.value = val
        if (val && Object.keys(val).length > 0) {
          await initData()
        }
      },
      { deep: true }
    )

    watch(
      () => props.title,
      (val) => {
        localTitle.value = val
      }
    )

    async function getMunicipios() {
      data.municipios = []
      if (!data.dataCliente.idDepartamento) return
      const result =
        await data.requestHttp.getMunById(
          data.dataCliente.idDepartamento
        )

      if (result.code === 200) {
        result.data.map((item) => {
          data.municipios.push({
            title: item.nombre,
            value: item.id
          })
        })
      }
    }

    function onDeptChange(val) {
      if (!val) {
        data.dataCliente.idMunicipio = null
        data.municipios = []
      } else {
        data.dataCliente.idMunicipio = null
        getMunicipios()
      }
    }

    watch(
      () => data.dataCliente.idDepartamento,
      (val) => {
        if (val) {
          getMunicipios()
        }
      }
    )

    function showSuccesAlert(
      msg,
      success = true
    ) {
      data.alertSuccess.msg = msg
      data.alertSuccess.show = true
      data.alertSuccess.success = success
      setTimeout(() => {
        data.alertSuccess.show = false
        data.alertSuccess.msg = ''
      }, 1500)
    }

    return {
      localShow,
      localEdit,
      localTitle,
      localCliente,
      localView,
      data,
      addrModal,
      store,
      initData,
      getMunicipios,
      onDeptChange,
      showSuccesAlert
    }
  },

  methods: {
    async loadCmbRutas() {
      try {
        const rutas = await getItemsCombobox(
          'api/rutas/combobox'
        )
        this.cmb.rutas = rutas
      } catch (e) {
        console.error(
          'Error loading rutas combobox:',
          e
        )
      }
    },

    getGpsUrl(dir) {
      if (!dir) return '#'
      if (dir.googleMapsURL)
        return dir.googleMapsURL
      if (dir.latitude && dir.longitude) {
        return (
          'https://www.google.com/maps/dir/?api=1&destination=' +
          dir.latitude +
          ',' +
          dir.longitude
        )
      }
      return '#'
    },

    getNombreDept(idDept) {
      if (!idDept) return '- - -'
      const item = this.data.departamentos.find(
        (d) => d.value === idDept
      )
      return item ? item.title : String(idDept)
    },

    getNombreMun(idDept, idMun) {
      if (!idMun) return ''
      const item = this.data.municipios.find(
        (m) => m.value === idMun
      )
      return item ? item.title : ''
    },

    async loadCmbTiposDocumento() {
      try {
        const result =
          await this.data.requestHttp.getTipoDocumentoCombobox()
        if (result && Array.isArray(result)) {
          this.cmb.tiposDocumento = result.map(
            (t) => ({
              title: t.nombre,
              value: t.id
            })
          )
        }
      } catch (e) {
        console.error(
          'Error loading tipos documento combobox:',
          e
        )
      }
    },

    // --- MÉTODOS DE GESTIÓN DE DIRECCIONES ---
    openAddressModal(
      type,
      item = null,
      idx = -1
    ) {
      if (type === 'edit' && item) {
        this.addrModal.isEdit = true
        this.addrModal.editIdx = idx
        this.addrModal.form = { ...item }
        this.onAddrDeptChange(item.idDepartamento)
      } else {
        this.addrModal.isEdit = false
        this.addrModal.editIdx = -1
        this.addrModal.form = {
          idDireccion: null,
          nombre:
            this.data.dataCliente.direcciones
              .length === 0
              ? 'Principal'
              : 'Sucursal ' +
                (this.data.dataCliente.direcciones
                  .length +
                  1),
          idDepartamento: null,
          idMunicipio: null,
          departamento: '',
          municipio: '',
          direccionIngresada: '',
          googleMapsURL: '',
          esDirFacturacion:
            this.data.dataCliente.direcciones
              .length === 0
        }
      }
      this.addrModal.show = true
    },

    async onAddrDeptChange(idDept) {
      this.addrModal.municipios = []
      if (!idDept) return
      const result =
        await this.data.requestHttp.getMunById(
          idDept
        )
      if (result.code === 200) {
        this.addrModal.municipios =
          result.data.map((item) => ({
            title: item.nombre,
            value: item.id
          }))
      }
    },

    saveAddressFromModal() {
      if (
        !this.addrModal.form.nombre ||
        !this.addrModal.form.idDepartamento ||
        !this.addrModal.form.direccionIngresada
      ) {
        this.showSuccesAlert(
          'Por favor complete los campos obligatorios de la dirección',
          false
        )
        return
      }

      // Obtener nombres para visualización inmediata en tabla
      const deptObj = this.data.departamentos.find(
        (d) => d.value === this.addrModal.form.idDepartamento
      )
      const munObj = this.addrModal.municipios.find(
        (m) => m.value === this.addrModal.form.idMunicipio
      )
      this.addrModal.form.departamento = deptObj ? deptObj.title : ''
      this.addrModal.form.municipio = munObj ? munObj.title : ''

      if (this.addrModal.form.esDirFacturacion) {
        this.data.dataCliente.direcciones.forEach(
          (d) => (d.esDirFacturacion = false)
        )
      }

      if (
        this.addrModal.isEdit &&
        this.addrModal.editIdx >= 0
      ) {
        this.data.dataCliente.direcciones[
          this.addrModal.editIdx
        ] = { ...this.addrModal.form }
      } else {
        this.data.dataCliente.direcciones.push({
          ...this.addrModal.form
        })
      }

      this.addrModal.show = false
    },

    setBillingAddress(idx) {
      this.data.dataCliente.direcciones.forEach(
        (d, i) => {
          d.esDirFacturacion = i === idx
        }
      )
    },

    removeAddress(idx) {
      if (
        this.data.dataCliente.direcciones
          .length <= 1
      ) {
        this.showSuccesAlert(
          'El cliente debe mantener al menos 1 dirección',
          false
        )
        return
      }
      const removedWasBilling =
        this.data.dataCliente.direcciones[idx]
          .esDirFacturacion
      this.data.dataCliente.direcciones.splice(
        idx,
        1
      )
      if (
        removedWasBilling &&
        this.data.dataCliente.direcciones.length >
          0
      ) {
        this.data.dataCliente.direcciones[0].esDirFacturacion = true
      }
    },

    async handleSave() {
      const valid =
        await this.$refs.form.validate()
      if (!valid.valid) return

      if (
        !this.data.dataCliente.direcciones ||
        this.data.dataCliente.direcciones
          .length === 0
      ) {
        this.showSuccesAlert(
          'Debe agregar al menos una dirección para el cliente',
          false
        )
        return
      }

      try {
        const usuario = this.store.getNameUser()
        this.data.dataCliente.usuarioRegistro =
          String(usuario)

        const mainDir =
          this.data.dataCliente.direcciones.find(
            (d) => d.esDirFacturacion
          ) ||
          this.data.dataCliente.direcciones[0]
        if (mainDir && !this.data.dataCliente.direccion) {
          this.data.dataCliente.direccion =
            mainDir.direccionIngresada
        }

        // Sanitizar campos numéricos de crédito antes de enviar al backend
        const esCredito = !!this.data.dataCliente.esTieneCredito
        this.data.dataCliente.esTieneCredito = esCredito

        if (!esCredito) {
          this.data.dataCliente.esCreditoMensual = false
          this.data.dataCliente.limiteCredito = null
          this.data.dataCliente.diasCredito = null
        } else {
          this.data.dataCliente.esCreditoMensual = !!this.data.dataCliente.esCreditoMensual

          const lim = this.data.dataCliente.limiteCredito
          if (lim === '' || lim === null || lim === undefined || isNaN(Number(lim))) {
            this.data.dataCliente.limiteCredito = null
          } else {
            this.data.dataCliente.limiteCredito = Number(lim)
          }

          const dias = this.data.dataCliente.diasCredito
          if (dias === '' || dias === null || dias === undefined || isNaN(Number(dias))) {
            this.data.dataCliente.diasCredito = null
          } else {
            this.data.dataCliente.diasCredito = parseInt(dias, 10)
          }
        }

        if (!this.localEdit) {
          this.data.disabledBtn = true
          this.data.overlay.show = true
          const result =
            await this.data.requestHttp.postCliente(
              this.data.dataCliente
            )
          this.data.disabledBtn = false
          this.data.overlay.show = false

          if (
            result &&
            (result.code === 200 ||
              result.code === 201)
          ) {
            this.showSuccesAlert(
              '¡Registro Guardado!',
              true
            )
            setTimeout(() => {
              this.$emit('closeDialog', false)
              this.localEdit = false
            }, 1500)
          } else {
            this.showSuccesAlert(
              'No se ha podido guardar el registro',
              false
            )
            return
          }
        } else {
          if (this.data.idCliente) {
            this.data.disabledBtn = true
            this.data.overlay.show = true
            const result =
              await this.data.requestHttp.putCliente(
                this.data.dataCliente,
                this.data.idCliente
              )
            this.data.disabledBtn = false
            this.data.overlay.show = false

            if (
              result &&
              (result.code === 200 ||
                result.code === 204)
            ) {
              this.showSuccesAlert(
                '¡Registro Editado!',
                true
              )
              setTimeout(() => {
                this.$emit('closeDialog', false)
                this.localEdit = false
              }, 1500)
            } else {
              this.showSuccesAlert(
                'No se ha podido guardar el registro',
                false
              )
              return
            }
          } else {
            this.showSuccesAlert(
              'Hubo un inconveniente, contáctese con soporte.',
              false
            )
            return
          }
        }
      } catch (error) {
        this.data.disabledBtn = false
        this.data.overlay.show = false
        this.showSuccesAlert(
          'Hubo un inconveniente, contáctese con soporte.',
          false
        )
        return
      }
    },

    async getCategoriaCliente() {
      this.data.categoriaCliente = []
      const result =
        await this.data.requestHttp.getCategoriaClientes()
      if (result && Array.isArray(result)) {
        result.map((item) => {
          this.data.categoriaCliente.push({
            title: item.nombre,
            value: item.idCategoriaCliente
          })
        })
      }
    },

    async getDepartamentos() {
      this.data.departamentos = []
      const result =
        await this.data.requestHttp.getDepartamentos()

      if (
        result &&
        result.code === 200 &&
        Array.isArray(result.data)
      ) {
        result.data.map((item) => {
          this.data.departamentos.push({
            title: item.nombre,
            value: item.id
          })
        })
      }
    },

    formatedDate(dataString) {
      if (!dataString) return '- - -'
      return formatters.formatDate(dataString)
    },

    closeDialog() {
      this.$emit('closeDialog', false)
      this.data.dataCliente = {}
    },

    readonlyOption() {
      if (this.localView) {
        return true
      } else if (this.localEdit) {
        return false
      } else if (
        !this.localEdit &&
        !this.localView
      ) {
        return false
      }
    }
  }
}
</script>

<style scoped>
.hover-row:hover {
  background-color: #f8fafc;
}

.hover-add-row:hover {
  background-color: #e0e7ff !important;
  transition: background-color 0.2s ease;
}
</style>
