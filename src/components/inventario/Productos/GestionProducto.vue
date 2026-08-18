<template>
  <div class="w-100">
    <!-- VISTA TABLA Y LISTADO DE PRODUCTOS (cuando !data.dialog) -->
    <div v-if="!data.dialog">
      <!-- Encabezado y botón de agregar -->
      <v-card
        class="border-t border-b"
        elevation="0"
        rounded="0"
      >
        <!-- Encabezado -->
        <template v-slot:prepend>
          <div class="d-flex align-center">
            <!-- Título -->
            <div
              class="text-h6 font-weight-bold d-flex align-center"
            >
              <v-icon class="me-2" color="indigo">
                mdi-package-variant
              </v-icon>
              Productos
            </div>
          </div>
        </template>
        <template v-slot:append>
          <v-btn
            v-if="hasAccessToFunct('122')"
            color="indigo-darken-4"
            @click="openDialog('create')"
            variant="tonal"
            prepend-icon="mdi-plus"
          >
            Nuevo Producto
          </v-btn>
        </template>
        <v-divider />

        <v-row class="pa-2" dense>
          <v-col cols="6" md="6" sm="6">
            <v-text-field
              color="indigo"
              density="compact"
              variant="outlined"
              append-inner-icon="mdi-magnify"
              label="Buscar productos"
              v-model="search"
              hide-details
              placeholder="Ingrese un texto a buscar..."
              persistent-placeholder
            />
          </v-col>
          <v-col
            cols="6"
            md="6"
            sm="6"
            class="d-flex justify-end align-center"
          >
            <v-btn
              v-if="hasAccessToFunct('126')"
              class="mr-4"
              variant="text"
              color="error"
              @click="exportToExcel"
              icon
              size="small"
            >
              <v-icon>
                mdi-download-multiple
              </v-icon>
              <v-tooltip
                location="top center"
                activator="parent"
              >
                Descargar Inventario
              </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- Tabla de productos -->
      <v-data-table
        class="font"
        density="compact"
        :headers="data.headers"
        :items="data.products"
        :items-per-page="10"
        :search="search"
        :loading="data.loading"
        :row-props="setStyle"
        :header-props="{
          class: 'font-weight-bold'
        }"
        hover
      >
        <template v-slot:loader>
          <v-progress-linear
            color="indigo"
            indeterminate
            height="2"
          />
        </template>
        <template v-slot:loading>
          <v-skeleton-loader
            type="table-row@10"
          ></v-skeleton-loader>
        </template>
        <template v-slot:item.costo="{ item }">
          {{ formatCurrency(item.costo) }}
        </template>
        <template v-slot:item.precio="{ item }">
          <v-menu
            v-if="item.esMayorista"
            location="bottom end"
            transition="scale-transition"
            :close-on-content-click="false"
            @update:model-value="
              (val) =>
                handlePopoverOpen(val, item)
            "
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-chip
                color="indigo-darken-3"
                size="small"
                variant="outlined"
                class="font-weight-bold"
                v-bind="props"
                style="cursor: pointer"
              >
                {{
                  item.preciosMayoristasCount || 0
                }}
                rangos
                <v-icon
                  size="x-small"
                  class="ml-1"
                  >mdi-eye</v-icon
                >
              </v-chip>
            </template>

            <v-card
              width="380"
              class="elevation-4 border rounded-lg"
            >
              <v-card-item
                class="bg-indigo-lighten-5 py-2"
              >
                <v-card-title
                  class="text-subtitle-2 font-weight-bold text-indigo d-flex align-center justify-space-between"
                >
                  <span>
                    <v-icon
                      size="small"
                      class="mr-1"
                      >mdi-format-list-bulleted-type</v-icon
                    >
                    Precios Mayoristas
                  </span>
                  <v-chip
                    size="x-small"
                    color="indigo"
                    variant="flat"
                    max-width="150"
                    class="text-truncate"
                    >{{ item.nombre }}</v-chip
                  >
                </v-card-title>
              </v-card-item>
              <v-divider></v-divider>

              <div
                v-if="data.popoverLoading"
                class="d-flex justify-center align-center py-4"
              >
                <v-progress-circular
                  indeterminate
                  size="24"
                  color="indigo"
                />
                <span
                  class="text-caption text-grey ml-2"
                  >Cargando rangos...</span
                >
              </div>

              <v-table
                v-else
                density="compact"
                class="elevation-0"
              >
                <thead>
                  <tr class="bg-grey-lighten-4">
                    <th
                      class="text-center font-weight-bold text-caption py-1"
                    >
                      Cantidades
                    </th>
                    <th
                      class="text-center font-weight-bold text-caption py-1"
                    >
                      Precio Unit.
                    </th>
                    <th
                      class="text-center font-weight-bold text-caption py-1"
                    >
                      Utilidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(
                      pm, idx
                    ) in data.popoverPrices"
                    :key="idx"
                  >
                    <td
                      class="text-center text-caption py-1 font-weight-medium"
                    >
                      {{
                        pm.rangoIndefinido ||
                        !pm.maximo ||
                        pm.maximo === 0
                          ? `${pm.minimo} a más`
                          : `${pm.minimo} a ${pm.maximo}`
                      }}
                    </td>
                    <td
                      class="text-center text-caption py-1 text-success font-weight-bold"
                    >
                      {{
                        formatCurrency(pm.precio)
                      }}
                    </td>
                    <td
                      class="text-center text-caption py-1 text-indigo font-weight-medium"
                    >
                      {{
                        calculatePopoverUtilidad(
                          pm.precio,
                          data.popoverProductCosto
                        )
                      }}
                    </td>
                  </tr>
                  <tr
                    v-if="
                      !data.popoverPrices ||
                      data.popoverPrices
                        .length === 0
                    "
                  >
                    <td
                      colspan="3"
                      class="text-center text-grey text-caption py-2"
                    >
                      Sin rangos registrados
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-menu>
          <span v-else class="font-weight-medium">
            {{ formatCurrency(item.precio) }}
          </span>
        </template>

        <template
          v-slot:item.impuestosCount="{ item }"
        >
          <v-menu
            v-if="
              item.impuestos &&
              item.impuestos.length > 0
            "
            location="bottom end"
            transition="scale-transition"
            :close-on-content-click="false"
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-chip
                color="teal-darken-3"
                size="small"
                variant="outlined"
                class="font-weight-bold"
                v-bind="props"
                style="cursor: pointer"
              >
                {{
                  item.impuestosCount ||
                  item.impuestos.length
                }}
                {{
                  (item.impuestosCount ||
                    item.impuestos.length) === 1
                    ? 'impuesto'
                    : 'impuestos'
                }}
                <v-icon
                  size="x-small"
                  class="ml-1"
                  >mdi-eye</v-icon
                >
              </v-chip>
            </template>

            <v-card
              width="400"
              class="elevation-4 border rounded-lg"
            >
              <v-card-item
                class="bg-teal-lighten-5 py-2"
              >
                <v-card-title
                  class="text-subtitle-2 font-weight-bold text-teal-darken-4 d-flex align-center justify-space-between"
                >
                  <span
                    class="d-flex align-center"
                  >
                    <v-icon
                      size="small"
                      class="mr-1"
                      color="teal"
                      >mdi-receipt-text-outline</v-icon
                    >
                    Impuestos Aplicados
                  </span>
                  <v-chip
                    size="x-small"
                    color="teal"
                    variant="flat"
                    max-width="150"
                    class="text-truncate"
                    >{{ item.nombre }}</v-chip
                  >
                </v-card-title>
              </v-card-item>
              <v-divider></v-divider>

              <v-table
                density="compact"
                class="elevation-0"
              >
                <thead>
                  <tr class="bg-grey-lighten-4">
                    <th
                      class="text-left font-weight-bold text-caption py-1"
                    >
                      Impuesto
                    </th>
                    <th
                      class="text-center font-weight-bold text-caption py-1"
                    >
                      Tasa
                    </th>
                    <th
                      class="text-center font-weight-bold text-caption py-1"
                    >
                      Compra
                    </th>
                    <th
                      class="text-center font-weight-bold text-caption py-1"
                    >
                      Venta
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(
                      imp, idx
                    ) in item.impuestos"
                    :key="idx"
                  >
                    <td
                      class="text-left text-caption py-1 font-weight-medium"
                    >
                      {{ imp.impuesto }}
                    </td>
                    <td
                      class="text-center text-caption py-1 font-weight-bold text-teal"
                    >
                      {{ imp.valorPorcentual }}%
                    </td>
                    <td
                      class="text-center text-caption py-1"
                    >
                      <v-chip
                        :color="
                          imp.esAplicadoCompra
                            ? 'teal'
                            : 'grey-lighten-1'
                        "
                        size="x-small"
                        variant="flat"
                      >
                        {{
                          imp.esAplicadoCompra
                            ? 'Sí'
                            : 'No'
                        }}
                      </v-chip>
                    </td>
                    <td
                      class="text-center text-caption py-1"
                    >
                      <v-chip
                        :color="
                          imp.esAplicadoVenta
                            ? 'teal'
                            : 'grey-lighten-1'
                        "
                        size="x-small"
                        variant="flat"
                      >
                        {{
                          imp.esAplicadoVenta
                            ? 'Sí'
                            : 'No'
                        }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-menu>
          <span v-else class="text-grey">—</span>
        </template>

        <template
          v-slot:item.fechaRegistro="{ item }"
        >
          {{ formatDate(item.fechaRegistro) }}
        </template>

        <template v-slot:item.estado="{ item }">
          <v-chip
            :color="
              item.estado ? 'green' : 'error'
            "
            small
          >
            {{
              item.estado ? 'Activo' : 'Inactivo'
            }}
          </v-chip>
        </template>

        <template
          v-slot:item.minimoVenta="{ item }"
        >
          <span class="font-weight-medium">{{
            item.minimoVenta != null
              ? item.minimoVenta
              : '—'
          }}</span>
        </template>

        <template
          v-slot:item.esFacturarSinInventario="{
            item
          }"
        >
          <v-chip
            :color="
              item.esFacturarSinInventario
                ? 'teal'
                : 'grey'
            "
            size="small"
            variant="flat"
          >
            {{
              item.esFacturarSinInventario
                ? 'Sí'
                : 'No'
            }}
          </v-chip>
        </template>

        <template
          v-slot:item.cantidadTotal="{ item }"
        >
          <v-tooltip
            v-if="
              !setStockMinimo(
                item.cantidadMinima,
                item.cantidadTotal
              )
            "
            location="top"
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-chip
                v-bind="props"
                color="error"
                size="small"
                variant="flat"
                class="font-weight-bold shadow-sm"
                prepend-icon="mdi-alert"
              >
                {{ item.cantidadTotal }}
              </v-chip>
            </template>
            <span
              >¡Stock bajo! Mínimo requerido:
              {{ item.cantidadMinima }}</span
            >
          </v-tooltip>

          <v-chip
            v-else
            color="green-darken-3"
            size="small"
            variant="tonal"
            class="font-weight-medium"
          >
            {{ item.cantidadTotal }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-menu
            :close-on-content-click="false"
            location="right center"
            origin="auto"
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-tooltip
                text="Opciones"
                location="top"
              >
                <template
                  v-slot:activator="{
                    props: tooltipProps
                  }"
                >
                  <v-btn
                    size="small"
                    icon
                    variant="text"
                    color="grey-darken-1"
                    v-bind="{
                      ...props,
                      ...tooltipProps
                    }"
                    class="hover-scale"
                  >
                    <v-icon
                      >mdi-dots-vertical</v-icon
                    >
                  </v-btn>
                </template>
              </v-tooltip>
            </template>

            <v-list nav rounded="lg">
              <v-list-item-subtitle class="pa-1">
                Opciones
              </v-list-item-subtitle>
              <v-list-item
                v-if="hasAccessToFunct('123')"
                rounded
                density="compact"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="openDialog('edit', item)"
              >
                <template v-slot:title>
                  <v-divider vertical />
                  Editar Producto
                </template>
              </v-list-item>

              <v-list-item
                rounded
                density="compact"
                prepend-icon="mdi-eye"
                color="indigo"
                @click="openDialogDet(item)"
              >
                <template v-slot:title>
                  <v-divider vertical />
                  Ver Producto
                </template>
              </v-list-item>

              <v-list-item
                v-if="hasAccessToFunct('124')"
                rounded
                density="compact"
                prepend-icon="mdi-delete"
                color="indigo"
                @click="showAlert(item)"
              >
                <template v-slot:title>
                  <v-divider vertical />
                  Eliminar Producto
                </template>
              </v-list-item>

              <v-divider />

              <v-list-item
                rounded
                density="compact"
                prepend-icon="mdi-history"
                color="indigo"
                @click="
                  loadVerAjustesStockDisplay(item)
                "
              >
                <template v-slot:title>
                  <v-divider vertical />
                  Ajustes de Stock
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </div>

    <!-- VISTA 2: FORMULARIO EN CARD DE REGISTRO / EDICIÓN (cuando data.dialog es true) -->
    <v-card
      v-else
      elevation="1"
      class="rounded-lg mb-6 bg-grey-lighten-5"
    >
      <!-- Barra superior / Header del Card -->
      <v-toolbar
        density="comfortable"
        class="px-2 bg-grey-lighten-5 border-b"
      >
        <v-btn
          icon
          variant="text"
          class="mr-2"
          @click="closeDialog"
        >
          <v-icon>mdi-arrow-left</v-icon>
          <v-tooltip
            activator="parent"
            location="bottom"
          >
            Volver al listado
          </v-tooltip>
        </v-btn>

        <div class="d-flex align-center">
          <v-avatar
            color="white"
            size="36"
            class="mr-3"
            variant="flat"
          >
            <v-icon
              color="indigo-darken-4"
              size="22"
              >mdi-package-variant</v-icon
            >
          </v-avatar>
          <div>
            <div
              class="text-subtitle-1 font-weight-bold"
            >
              {{ dialogTitle }}
            </div>
            <div
              class="text-caption"
              v-if="
                dialogMode === 'edit' &&
                data.form.nombre
              "
            >
              {{ data.form.nombre }} (Código:
              {{ data.form.codigo || 'S/C' }})
            </div>
            <div class="text-caption" v-else>
              Complete los campos para registrar
              un nuevo producto en inventario
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
            @click="closeDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            variant="elevated"
            size="small"
            prepend-icon="mdi-content-save"
            @click="guardarRegistro"
          >
            Guardar Producto
          </v-btn>
        </div>
      </v-toolbar>

      <!-- Formulario principal con estructura en 2 columnas (8 cols / 4 cols) -->
      <v-card-text class="pa-4 pa-md-6">
        <v-form ref="form" class="w-100">
          <v-row dense>
            <!-- COLUMNA PRINCIPAL (8 columnas) -->
            <v-col cols="12" md="8">
              <div
                class="d-flex flex-column ga-4"
              >
                <!-- 1. CLASIFICACIÓN Y DATOS BÁSICOS -->
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
                        >mdi-shape-outline</v-icon
                      >
                      Clasificación y Datos
                      Básicos
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
                      <!-- Categoría -->
                      <v-col cols="12" sm="12">
                        <v-select
                          v-model="
                            data.form.idCategoria
                          "
                          label="Categoría *"
                          :items="cmb.categorias"
                          :rules="[
                            rules.required
                          ]"
                          variant="outlined"
                          density="compact"
                          color="indigo"
                          prepend-inner-icon="mdi-shape-outline"
                          hide-details="auto"
                          clearable
                          @update:model-value="
                            loadCmbSubCategoria(
                              data.form
                                .idCategoria
                            )
                          "
                        >
                          <template
                            v-slot:prepend
                          >
                            <v-tooltip
                              text="Nueva Categoría"
                              location="top"
                            >
                              <template
                                v-slot:activator="{
                                  props
                                }"
                              >
                                <v-btn
                                  v-bind="props"
                                  @click="
                                    openNuevaCategoriaDisplay
                                  "
                                  color="indigo-darken-3"
                                  variant="tonal"
                                  size="36"
                                  rounded
                                  icon="mdi-plus"
                                />
                              </template>
                            </v-tooltip>
                          </template>
                        </v-select>
                      </v-col>

                      <!-- Subcategoría -->
                      <v-col cols="12" sm="12">
                        <v-select
                          v-model="
                            data.form.idSubCatProd
                          "
                          label="Subcategoría *"
                          :items="
                            cmb.subCategorias
                          "
                          :rules="[
                            rules.required
                          ]"
                          variant="outlined"
                          density="compact"
                          color="indigo"
                          hide-details="auto"
                          clearable
                          prepend-inner-icon="mdi-format-list-bulleted-type"
                          @update:model-value="
                            loadCodigoRecomendado(
                              data.form
                                .idSubCatProd
                            )
                          "
                        >
                          <template
                            v-slot:prepend
                          >
                            <v-tooltip
                              text="Nueva Subcategoría"
                              location="top"
                            >
                              <template
                                v-slot:activator="{
                                  props
                                }"
                              >
                                <v-btn
                                  v-bind="props"
                                  @click="
                                    openNuevaSubCatDisplay
                                  "
                                  rounded
                                  color="indigo-darken-3"
                                  variant="tonal"
                                  size="36"
                                  icon="mdi-plus"
                                />
                              </template>
                            </v-tooltip>
                          </template>
                        </v-select>
                      </v-col>

                      <!-- Código -->
                      <v-col cols="12" sm="4">
                        <v-text-field
                          color="indigo"
                          v-model="
                            data.form.codigo
                          "
                          label="Código del Producto *"
                          :rules="[
                            rules.required
                          ]"
                          variant="outlined"
                          hide-details="auto"
                          clearable
                          density="compact"
                          prepend-inner-icon="mdi-barcode"
                        />
                      </v-col>

                      <!-- Nombre -->
                      <v-col cols="12" sm="8">
                        <v-text-field
                          color="indigo"
                          v-model="
                            data.form.nombre
                          "
                          label="Nombre del Producto *"
                          :rules="[
                            rules.required,
                            rules.minLength(3)
                          ]"
                          variant="outlined"
                          hide-details="auto"
                          density="compact"
                          clearable
                          prepend-inner-icon="mdi-package-variant-closed"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-card>

                <!-- 3. UNIDADES DE MEDIDA Y FACTORES DE CONVERSIÓN -->
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
                        >mdi-scale-balance</v-icon
                      >
                      Unidades de Medida y
                      Conversión
                    </div>
                    <v-btn
                      @click="
                        data.showDiagUM = true
                      "
                      color="indigo"
                      size="small"
                      variant="tonal"
                      prepend-icon="mdi-plus"
                    >
                      Nueva U/M
                    </v-btn>
                  </div>

                  <div class="pa-4">
                    <v-row dense>
                      <v-col cols="12" sm="6">
                        <v-autocomplete
                          v-model="
                            data.form
                              .idUnidadMedidaCompra
                          "
                          :items="
                            cmb.unidadesMedida
                              .length
                              ? cmb.unidadesMedida
                              : data.unidadesMedidas
                          "
                          label="Se compra por:"
                          :rules="[
                            rules.required
                          ]"
                          variant="outlined"
                          density="compact"
                          color="indigo"
                          hide-details="auto"
                          prepend-inner-icon="mdi-cart-arrow-down"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          color="indigo"
                          v-model="
                            data.form
                              .cantidadUMCompra
                          "
                          label="Y contiene:"
                          :rules="[
                            rules.required,
                            rules.numeric
                          ]"
                          variant="outlined"
                          hide-details="auto"
                          density="compact"
                          type="number"
                          suffix="(unds)"
                          prepend-inner-icon="mdi-numeric"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-autocomplete
                          v-model="
                            data.form
                              .idUnidadMedidaVenta
                          "
                          :items="
                            cmb.unidadesMedida
                              .length
                              ? cmb.unidadesMedida
                              : data.unidadesMedidas
                          "
                          label="Se vende por:"
                          :rules="[
                            rules.required
                          ]"
                          variant="outlined"
                          density="compact"
                          color="indigo"
                          hide-details="auto"
                          prepend-inner-icon="mdi-cash-register"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          color="indigo"
                          v-model="
                            data.form
                              .cantidadUMVenta
                          "
                          label="Y contiene:"
                          :rules="[
                            rules.required,
                            rules.numeric
                          ]"
                          variant="outlined"
                          hide-details="auto"
                          density="compact"
                          type="number"
                          suffix="(unds)"
                          prepend-inner-icon="mdi-numeric"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-card>

                <!-- 2. COSTOS, PRECIOS Y ESQUEMA DE VENTA -->
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
                        >mdi-cash-multiple</v-icon
                      >
                      Costos, Precios y Esquema de
                      Venta
                    </div>
                    <div
                      class="d-flex align-center"
                    >
                      <v-checkbox
                        v-model="
                          data.form.esMayorista
                        "
                        color="indigo"
                        density="compact"
                        hide-details
                        label="¿Es Producto Mayorista?"
                        class="font-weight-medium"
                      />
                    </div>
                  </div>

                  <div class="pa-4">
                    <!-- Fila de Costos -->
                    <v-row dense class="mb-2">
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="
                            data.form.costo
                          "
                          :rules="[
                            rules.required,
                            rules.numeric
                          ]"
                          prefix="C$"
                          label="Costo Unitario (C$) *"
                          variant="outlined"
                          hide-details="auto"
                          density="compact"
                          color="indigo"
                          type="number"
                          step="0.01"
                          @input="
                            handleChangeCosto
                          "
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="
                            data.form.costoDolar
                          "
                          :rules="[
                            rules.required,
                            rules.numeric
                          ]"
                          prefix="US$"
                          label="Costo en Dólares (US$) *"
                          variant="outlined"
                          hide-details="auto"
                          density="compact"
                          color="indigo"
                          type="number"
                          step="0.01"
                          @input="
                            handleChangeCostoDolar
                          "
                        />
                      </v-col>
                    </v-row>

                    <!-- Si NO es mayorista: Precio Venta y Utilidad -->
                    <div
                      v-if="
                        !data.form.esMayorista
                      "
                      class="bg-grey-lighten-5 pa-3 rounded-lg border"
                    >
                      <div
                        class="text-caption font-weight-bold text-grey-darken-2 mb-2 d-flex align-center"
                      >
                        <v-icon
                          size="small"
                          class="mr-1"
                          color="indigo"
                          >mdi-tag-outline</v-icon
                        >
                        PRECIO DE VENTA Y MARGEN
                        DE UTILIDAD UNITARIO
                      </div>
                      <v-row dense>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="
                              data.form.precio
                            "
                            :rules="[
                              rules.required,
                              rules.numeric
                            ]"
                            prefix="C$"
                            label="Precio de Venta (C$) *"
                            variant="outlined"
                            hide-details="auto"
                            density="compact"
                            color="indigo"
                            type="number"
                            @input="
                              handleChangePrecio
                            "
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="
                              data.form.utilidad
                            "
                            :rules="[
                              rules.required,
                              rules.numeric
                            ]"
                            prefix="%"
                            label="% Margen de Utilidad *"
                            variant="outlined"
                            hide-details="auto"
                            density="compact"
                            color="indigo"
                            type="number"
                            step="0.01"
                            @input="
                              handleChangeUtilidad
                            "
                          />
                        </v-col>
                      </v-row>
                    </div>

                    <!-- Si ES mayorista: Tabla de Rangos -->
                    <div v-else class="mt-2">
                      <div
                        class="d-flex align-center justify-space-between mb-2"
                      >
                        <span
                          class="text-caption font-weight-bold text-indigo-darken-3 d-flex align-center"
                        >
                          <v-icon
                            size="small"
                            class="mr-1"
                            >mdi-table-plus</v-icon
                          >
                          ESCALA DE PRECIOS
                          MAYORISTAS POR RANGO DE
                          CANTIDAD
                        </span>
                        <v-btn
                          color="indigo"
                          size="small"
                          prepend-icon="mdi-plus"
                          variant="tonal"
                          @click="
                            addPrecioMayoristaRow
                          "
                        >
                          Añadir Rango
                        </v-btn>
                      </div>

                      <v-table
                        density="compact"
                        class="elevation-0 border rounded-lg overflow-hidden"
                      >
                        <thead>
                          <tr
                            class="bg-indigo-lighten-5"
                          >
                            <th
                              class="text-center font-weight-bold text-caption"
                              style="width: 16%"
                            >
                              Cant. Mínima
                            </th>
                            <th
                              class="text-center font-weight-bold text-caption"
                              style="width: 16%"
                            >
                              Cant. Máxima
                            </th>
                            <th
                              class="text-center font-weight-bold text-caption"
                              style="width: 20%"
                            >
                              Precio Venta (C$)
                            </th>
                            <th
                              class="text-center font-weight-bold text-caption"
                              style="width: 18%"
                            >
                              Utilidad (%)
                            </th>
                            <th
                              class="text-center font-weight-bold text-caption"
                            >
                              Observaciones
                            </th>
                            <th
                              class="text-center font-weight-bold text-caption"
                              style="width: 50px"
                            ></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(
                              row, index
                            ) in data.form
                              .preciosMayoristas"
                            :key="index"
                          >
                            <td class="pa-1">
                              <v-text-field
                                v-model="
                                  row.minimo
                                "
                                type="number"
                                density="compact"
                                variant="outlined"
                                hide-details="auto"
                                class="text-center"
                                color="indigo"
                                :rules="[
                                  rules.required,
                                  rules.numeric
                                ]"
                              />
                            </td>
                            <td class="pa-1">
                              <v-text-field
                                v-model="
                                  row.maximo
                                "
                                type="number"
                                density="compact"
                                variant="outlined"
                                hide-details="auto"
                                class="text-center"
                                color="indigo"
                                :placeholder="
                                  index ===
                                  data.form
                                    .preciosMayoristas
                                    .length -
                                    1
                                    ? 'A más'
                                    : ''
                                "
                                :rules="
                                  index ===
                                  data.form
                                    .preciosMayoristas
                                    .length -
                                    1
                                    ? row.maximo
                                      ? [
                                          rules.numeric
                                        ]
                                      : []
                                    : [
                                        rules.required,
                                        rules.numeric
                                      ]
                                "
                              />
                            </td>
                            <td class="pa-1">
                              <v-text-field
                                v-model="
                                  row.precio
                                "
                                type="number"
                                step="0.01"
                                density="compact"
                                variant="outlined"
                                hide-details="auto"
                                prefix="C$"
                                class="text-center"
                                color="indigo"
                                :rules="[
                                  rules.required,
                                  rules.numeric
                                ]"
                                @input="
                                  handleWholesalePrecioChange(
                                    row
                                  )
                                "
                              />
                            </td>
                            <td class="pa-1">
                              <v-text-field
                                v-model="
                                  row.utilidad
                                "
                                type="number"
                                step="0.01"
                                density="compact"
                                variant="outlined"
                                hide-details="auto"
                                prefix="%"
                                class="text-center"
                                color="indigo"
                                :rules="[
                                  rules.required,
                                  rules.numeric
                                ]"
                                @input="
                                  handleWholesaleUtilidadChange(
                                    row
                                  )
                                "
                              />
                            </td>
                            <td class="pa-1">
                              <v-textarea
                                v-model="
                                  row.observaciones
                                "
                                density="compact"
                                variant="outlined"
                                hide-details="auto"
                                placeholder="Opcional..."
                                rows="1"
                                auto-grow
                              />
                            </td>
                            <td
                              class="text-center pa-1"
                            >
                              <v-btn
                                icon
                                variant="text"
                                color="error"
                                size="small"
                                @click="
                                  removePrecioMayoristaRow(
                                    index
                                  )
                                "
                              >
                                <v-icon
                                  size="small"
                                  >mdi-delete</v-icon
                                >
                              </v-btn>
                            </td>
                          </tr>
                          <tr
                            class="text-center hover-add-row"
                            style="
                              cursor: pointer;
                            "
                            @click="
                              addPrecioMayoristaRow
                            "
                          >
                            <td
                              colspan="6"
                              class="py-2 text-indigo-darken-4 font-weight-bold text-caption bg-indigo-lighten-5"
                            >
                              <v-icon
                                size="small"
                                class="mr-1"
                                >mdi-plus-circle-outline</v-icon
                              >
                              Agregar nuevo precio
                              mayorista
                            </td>
                          </tr>
                          <tr
                            v-if="
                              !data.form
                                .preciosMayoristas ||
                              data.form
                                .preciosMayoristas
                                .length === 0
                            "
                          >
                            <td
                              colspan="6"
                              class="text-center text-grey text-caption py-4"
                            >
                              <v-icon
                                class="mr-1"
                                color="warning"
                                >mdi-alert-circle-outline</v-icon
                              >
                              Debe registrar al
                              menos un rango de
                              precio mayorista.
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </div>
                </v-card>

                <!-- 4. IMPUESTOS APLICABLES -->
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
                        >mdi-receipt-text-outline</v-icon
                      >
                      Impuestos Aplicables
                    </div>
                    <v-btn
                      color="indigo"
                      size="small"
                      prepend-icon="mdi-plus"
                      variant="tonal"
                      @click="addImpuestoRow"
                    >
                      Añadir Impuesto
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
                            class="text-left font-weight-bold text-caption"
                            style="width: 50%"
                          >
                            Impuesto
                          </th>
                          <th
                            class="text-center font-weight-bold text-caption"
                            style="width: 22%"
                          >
                            ¿Aplica en Compra?
                          </th>
                          <th
                            class="text-center font-weight-bold text-caption"
                            style="width: 22%"
                          >
                            ¿Aplica en Venta?
                          </th>
                          <th
                            class="text-center font-weight-bold text-caption"
                            style="width: 50px"
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(
                            row, index
                          ) in data.form
                            .impuestos"
                          :key="index"
                        >
                          <td class="pa-1">
                            <v-select
                              v-model="
                                row.idImpuesto
                              "
                              :items="
                                cmb.impuestos
                              "
                              density="compact"
                              variant="outlined"
                              hide-details="auto"
                              placeholder="Seleccionar Impuesto..."
                              :rules="[
                                rules.required
                              ]"
                              color="indigo"
                            />
                          </td>
                          <td
                            class="text-center pa-1"
                          >
                            <div
                              class="d-flex justify-center"
                            >
                              <v-checkbox
                                v-model="
                                  row.esAplicadoCompra
                                "
                                color="indigo"
                                hide-details
                                density="compact"
                              />
                            </div>
                          </td>
                          <td
                            class="text-center pa-1"
                          >
                            <div
                              class="d-flex justify-center"
                            >
                              <v-checkbox
                                v-model="
                                  row.esAplicadoVenta
                                "
                                color="indigo"
                                hide-details
                                density="compact"
                              />
                            </div>
                          </td>
                          <td
                            class="text-center pa-1"
                          >
                            <v-btn
                              icon
                              variant="text"
                              color="error"
                              size="small"
                              @click="
                                removeImpuestoRow(
                                  index
                                )
                              "
                            >
                              <v-icon size="small"
                                >mdi-delete</v-icon
                              >
                            </v-btn>
                          </td>
                        </tr>
                        <tr
                          class="text-center hover-add-row"
                          style="cursor: pointer"
                          @click="addImpuestoRow"
                        >
                          <td
                            colspan="4"
                            class="py-2 text-indigo-darken-4 font-weight-bold text-caption bg-indigo-lighten-5"
                          >
                            <v-icon
                              size="small"
                              class="mr-1"
                              >mdi-plus-circle-outline</v-icon
                            >
                            Agregar nuevo impuesto
                          </td>
                        </tr>
                        <tr
                          v-if="
                            !data.form
                              .impuestos ||
                            data.form.impuestos
                              .length === 0
                          "
                        >
                          <td
                            colspan="4"
                            class="text-center text-grey text-caption py-3"
                          >
                            <v-icon
                              class="mr-1"
                              size="small"
                              >mdi-information-outline</v-icon
                            >
                            No hay impuestos
                            asociados a este
                            producto (Opcional).
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>
                </v-card>
              </div>
            </v-col>

            <!-- COLUMNA LATERAL (4 columnas) -->
            <v-col cols="12" md="4">
              <div
                class="d-flex flex-column ga-4"
              >
                <!-- A. IMAGEN DEL PRODUCTO -->
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
                        >mdi-image-outline</v-icon
                      >
                      Imagen del Producto
                    </div>
                    <v-chip
                      size="x-small"
                      color="grey-darken-1"
                      variant="tonal"
                    >
                      Máx. 1MB
                    </v-chip>
                  </div>

                  <div class="pa-4 text-center">
                    <!-- Preview / Estado de la imagen -->
                    <div
                      class="product-image-container border rounded-lg mb-3 bg-grey-lighten-4 position-relative overflow-hidden d-flex align-center justify-center"
                      style="
                        min-height: 220px;
                        max-height: 260px;
                      "
                    >
                      <div
                        v-if="
                          registroDisplay.imagen
                            .url
                        "
                        class="w-100 h-100 position-relative"
                      >
                        <v-img
                          :src="
                            registroDisplay.imagen
                              .url
                          "
                          height="220px"
                          cover
                          class="rounded-lg"
                        >
                          <template
                            v-slot:placeholder
                          >
                            <div
                              class="d-flex align-center justify-center fill-height"
                            >
                              <v-progress-circular
                                indeterminate
                                color="indigo"
                                size="24"
                              ></v-progress-circular>
                            </div>
                          </template>
                        </v-img>
                        <v-btn
                          icon="mdi-delete"
                          color="error"
                          size="small"
                          variant="elevated"
                          class="position-absolute"
                          style="
                            top: 8px;
                            right: 8px;
                            z-index: 2;
                          "
                          @click="
                            handleEliminarImagen
                          "
                        >
                          <v-icon size="small"
                            >mdi-delete</v-icon
                          >
                          <v-tooltip
                            activator="parent"
                            location="left"
                            >Eliminar
                            imagen</v-tooltip
                          >
                        </v-btn>
                      </div>
                      <div
                        v-else
                        class="d-flex flex-column align-center justify-center pa-4 text-grey"
                      >
                        <v-icon
                          size="48"
                          color="grey-lighten-1"
                          class="mb-2"
                          >mdi-image-plus</v-icon
                        >
                        <span
                          class="text-caption font-weight-medium"
                          >Sin imagen
                          cargada</span
                        >
                        <span
                          class="text-caption text-grey-darken-1"
                          >JPG, JPEG o PNG</span
                        >
                      </div>
                    </div>

                    <v-file-input
                      v-model="
                        registroDisplay.imagen
                          .archivo
                      "
                      :accept="
                        registroDisplay.formatosImagen
                      "
                      label="Seleccionar o cambiar imagen"
                      variant="outlined"
                      density="compact"
                      color="indigo"
                      prepend-icon=""
                      prepend-inner-icon="mdi-camera"
                      show-size
                      hide-details
                      @change="handleInputImagen"
                    />
                  </div>
                </v-card>

                <!-- B. CONTROL DE INVENTARIO Y STOCK -->
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
                        >mdi-warehouse</v-icon
                      >
                      Control de Stock
                    </div>
                    <v-chip
                      v-if="dialogMode === 'edit'"
                      size="x-small"
                      :color="
                        data.form.cantidadTotal <
                        data.form.cantidadMinima
                          ? 'error'
                          : 'success'
                      "
                      variant="flat"
                    >
                      {{
                        data.form.cantidadTotal <
                        data.form.cantidadMinima
                          ? 'Bajo Stock'
                          : 'Stock Normal'
                      }}
                    </v-chip>
                  </div>

                  <div class="pa-4">
                    <v-row dense>
                      <v-col cols="12">
                        <v-text-field
                          color="indigo"
                          v-model="
                            data.form
                              .cantidadMinima
                          "
                          label="Stock Mínimo (Alerta) *"
                          :rules="[
                            rules.required,
                            rules.numeric
                          ]"
                          variant="outlined"
                          hide-details="auto"
                          density="compact"
                          type="number"
                          prepend-inner-icon="mdi-alert-octagon-outline"
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        v-if="
                          this.dialogMode ===
                          'edit'
                        "
                      >
                        <v-text-field
                          color="indigo"
                          v-model="
                            data.form
                              .cantidadTotal
                          "
                          label="Stock Actual en Almacén"
                          :rules="[
                            rules.required,
                            rules.numeric
                          ]"
                          variant="outlined"
                          hide-details="auto"
                          density="compact"
                          type="number"
                          prepend-inner-icon="mdi-counter"
                          readonly
                        >
                          <template v-slot:append>
                            <v-tooltip
                              text="Ajustar Stock"
                              location="top"
                            >
                              <template
                                v-slot:activator="{
                                  props
                                }"
                              >
                                <v-btn
                                  v-bind="props"
                                  @click="
                                    loadAjusteStockDisplay
                                  "
                                  color="indigo-darken-3"
                                  variant="tonal"
                                  size="36"
                                  icon="mdi-pencil-box-outline"
                                />
                              </template>
                            </v-tooltip>
                          </template>
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12">
                        <v-text-field
                          v-model="
                            data.form.minimoVenta
                          "
                          label="Mínimo de Venta"
                          placeholder="Opcional"
                          variant="outlined"
                          hide-details="auto"
                          density="compact"
                          color="indigo"
                          type="number"
                          prepend-inner-icon="mdi-cart-arrow-down"
                          clearable
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        sm="12"
                        class="d-flex align-center"
                      >
                        <v-checkbox
                          color="indigo"
                          v-model="
                            data.form
                              .esFacturarSinInventario
                          "
                          label="¿Permitir facturar sin inventario?"
                          density="compact"
                          hide-details="auto"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-card>

                <!-- 5. OBSERVACIONES -->
                <v-card
                  variant="flat"
                  class="border rounded-lg bg-white overflow-hidden"
                  elevation="0"
                >
                  <div
                    class="bg-indigo-lighten-5 px-4 py-2 border-b"
                  >
                    <div
                      class="text-subtitle-2 font-weight-bold text-indigo-darken-4 d-flex align-center"
                    >
                      <v-icon
                        size="small"
                        class="mr-2"
                        color="indigo"
                        >mdi-note-text-outline</v-icon
                      >
                      Observaciones y Notas
                    </div>
                  </div>
                  <div class="pa-4">
                    <v-textarea
                      v-model="
                        data.form.observaciones
                      "
                      density="compact"
                      variant="outlined"
                      label="Notas u observaciones adicionales del producto"
                      prepend-inner-icon="mdi-text"
                      rows="2"
                      auto-grow
                      color="indigo"
                      hide-details
                    />
                  </div>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <!-- Footer Actions -->
      <v-divider />
      <v-card-actions
        class="pa-4 bg-grey-lighten-5 d-flex justify-end ga-3"
      >
        <v-btn
          color="grey-darken-1"
          variant="tonal"
          size="default"
          prepend-icon="mdi-close"
          @click="closeDialog"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="indigo-darken-4"
          variant="elevated"
          size="default"
          prepend-icon="mdi-content-save"
          @click="guardarRegistro"
        >
          Guardar Producto
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- VER AJUSTES DE STOCK -->
    <v-dialog
      v-model="display.verAjusteStock"
      width="650"
    >
      <v-card class="rounded" elevation="8">
        <!-- Header con información del producto -->
        <v-card-item class="bg-indigo-darken-4">
          <div
            class="d-flex align-start justify-space-between w-100"
          >
            <div>
              <div
                class="d-flex align-center mb-2"
              >
                <v-avatar
                  color="white"
                  class="mr-3"
                  variant="flat"
                >
                  <v-icon
                    color="#1976d2"
                    size="22"
                    >mdi-package-variant</v-icon
                  >
                </v-avatar>
                <div>
                  <v-card-title
                    class="text-h6 font-weight-bold pa-0 text-white"
                  >
                    HISTORIAL DE AJUSTES DE STOCK
                  </v-card-title>
                  <v-card-subtitle
                    class="text-caption text-white pa-0 mt-1 opacity-85"
                  >
                    {{ verAjusteStock.producto }}
                  </v-card-subtitle>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div
                class="text-caption text-white mb-1"
              >
                STOCK ACTUAL
              </div>
              <v-chip
                color="white"
                variant="flat"
                size="small"
                class="font-weight-bold text-primary"
              >
                {{ verAjusteStock.cantidadTotal }}
                unidades
              </v-chip>
            </div>
          </div>
        </v-card-item>

        <!-- Resumen de ajustes -->
        <v-card-text
          class="pa-4 bg-grey-lighten-4"
        >
          <v-card
            variant="flat"
            color="white"
            class="mb-4 pa-3 rounded border"
            elevation="0"
          >
            <v-row dense>
              <v-col cols="6">
                <div class="d-flex align-center">
                  <v-icon
                    color="green"
                    size="small"
                    class="mr-2"
                    >mdi-arrow-up</v-icon
                  >
                  <div>
                    <div
                      class="text-caption text-grey-darken-2"
                    >
                      AJUSTES POSITIVOS
                    </div>
                    <div
                      class="text-h6 font-weight-bold text-green-darken-2"
                    >
                      +{{
                        verAjusteStock.tbl.items.filter(
                          (item) =>
                            item.cantidad > 0
                        ).length || 0
                      }}
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex align-center">
                  <v-icon
                    color="red"
                    size="small"
                    class="mr-2"
                    >mdi-arrow-down</v-icon
                  >
                  <div>
                    <div
                      class="text-caption text-grey-darken-2"
                    >
                      AJUSTES NEGATIVOS
                    </div>
                    <div
                      class="text-h6 font-weight-bold text-red-darken-2"
                    >
                      {{
                        verAjusteStock.tbl.items.filter(
                          (item) =>
                            item.cantidad <= 0
                        ).length || 0
                      }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Tabla de ajustes -->
          <v-card
            variant="flat"
            class="rounded-lg border"
            elevation="0"
          >
            <v-card-title
              class="pa-3"
              style="background-color: #e3f2fd"
            >
              <div
                class="d-flex align-center justify-space-between w-100"
              >
                <div class="d-flex align-center">
                  <v-icon
                    color="primary"
                    size="small"
                    class="mr-2"
                    >mdi-history</v-icon
                  >
                  <span
                    class="text-subtitle-2 font-weight-bold"
                    >REGISTRO DE AJUSTES</span
                  >
                </div>
                <v-chip
                  size="small"
                  color="primary"
                  variant="flat"
                >
                  {{
                    verAjusteStock.tbl.items
                      .length || 0
                  }}
                  registros
                </v-chip>
              </div>
            </v-card-title>
            <v-data-table
              :headers="
                verAjusteStock.tbl.headers
              "
              :items="verAjusteStock.tbl.items"
              class="elevation-1"
              height="250"
              items-per-page="50"
              density="compact"
              fixed-header
              :header-props="{
                class:
                  'text-uppercase font-weight-bold bg-blue-lighten-5'
              }"
            >
              <template
                v-slot:item.fechaRegistro="{
                  item
                }"
              >
                <div class="d-flex align-center">
                  <v-icon
                    size="small"
                    color="grey"
                    class="mr-2"
                    >mdi-calendar</v-icon
                  >
                  <span
                    class="font-weight-medium"
                  >
                    {{
                      this.formatDate(
                        item.fechaRegistro
                      )
                    }}
                  </span>
                </div>
              </template>
              <template
                v-slot:item.cantidad="{ item }"
              >
                <v-chip
                  :color="
                    item.cantidad > 0
                      ? 'green-lighten-5'
                      : 'red-lighten-5'
                  "
                  :variant="
                    item.cantidad > 0
                      ? 'outlined'
                      : 'outlined'
                  "
                  size="small"
                  class="font-weight-bold"
                >
                  <v-icon
                    size="small"
                    :color="
                      item.cantidad > 0
                        ? 'green'
                        : 'red'
                    "
                    class="mr-1"
                  >
                    {{
                      item.cantidad > 0
                        ? 'mdi-plus'
                        : 'mdi-minus'
                    }}
                  </v-icon>
                  {{ item.cantidad > 0 ? '+' : ''
                  }}{{ item.cantidad }}
                </v-chip>
              </template>
              <template v-slot:no-data>
                <div class="pa-6 text-center">
                  <v-icon
                    size="large"
                    color="grey-lighten-2"
                    class="mb-3"
                    >mdi-information-outline</v-icon
                  >
                  <div
                    class="text-body-1 text-grey mb-1"
                  >
                    No hay ajustes registrados
                  </div>
                  <div
                    class="text-caption text-grey"
                  >
                    Este producto no tiene
                    historial de ajustes
                  </div>
                </div>
                <v-tooltip
                  text="Ajustes Stock"
                  location="top"
                >
                  <template
                    v-slot:activator="{ props }"
                  >
                    <v-icon
                      v-bind="props"
                      size="small"
                      color="grey"
                      class="mr-1"
                      @click="
                        loadVerAjustesStockDisplay(
                          item
                        )
                      "
                    >
                      mdi-history
                    </v-icon>
                  </template>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card>

          <!-- Resumen final -->
          <v-card
            variant="flat"
            color="blue-lighten-5"
            class="mt-4 pa-4 rounded-lg border"
          >
            <div
              class="d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center">
                <v-icon
                  color="primary"
                  class="mr-2"
                  >mdi-chart-timeline</v-icon
                >
                <div>
                  <div
                    class="text-caption text-grey-darken-2"
                  >
                    TOTAL DE MOVIMIENTOS
                  </div>
                  <div
                    class="text-body-1 font-weight-bold"
                  >
                    {{
                      verAjusteStock.tbl.items
                        .length
                    }}
                    ajustes registrados
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div
                  class="text-caption text-grey-darken-2"
                >
                  SALDO FINAL
                </div>
                <div
                  class="text-h6 font-weight-bold text-primary"
                >
                  {{
                    verAjusteStock.cantidadTotal
                  }}
                  unidades
                </div>
              </div>
            </div>
          </v-card>
        </v-card-text>

        <!-- Footer -->
        <v-divider thickness="2" />
        <v-card-actions class="pa-4 bg-white">
          <v-btn
            color="grey-darken-2"
            variant="tonal"
            @click="
              display.verAjusteStock = false
            "
            prepend-icon="mdi-close"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="display.ajusteStock"
      width="300"
    >
      <v-card>
        <v-card-item>
          <v-card-title
            >Ajustar stock</v-card-title
          >
          <v-card-subtitle>
            {{ ajusteStock.producto }}
          </v-card-subtitle>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="formAjusteStock">
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="
                    ajusteStock.data.cantidadTotal
                  "
                  label="Nuevo stock:"
                  color="indigo"
                  variant="outlined"
                  density="compact"
                  type="number"
                  prepend-inner-icon="mdi-numeric"
                  :rules="[
                    (v) => !!v || 'Requerido.'
                  ]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="
                    ajusteStock.data.observaciones
                  "
                  label="Motivo del ajuste:"
                  color="indigo"
                  variant="outlined"
                  density="compact"
                  rows="2"
                  auto-grow
                  :rules="[
                    (v) => !!v || 'Requerido.'
                  ]"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end">
          <v-btn
            color="secondary"
            variant="outlined"
            @click="closeAjusteStockDisplay"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="saveAjusteStockDisplay"
          >
            Ajustar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <new-categoria
      :title="nuevaCategoriaDisplay.title"
      :show="nuevaCategoriaDisplay.show"
      :editar="nuevaCategoriaDisplay.editar"
      :cat="nuevaCategoriaDisplay.item"
      :ver="nuevaCategoriaDisplay.ver"
      @closeDialog="closeNuevaCategoriaDisplay"
    ></new-categoria>

    <new-sub-categoria
      :title="nuevaSubCatDisplay.title"
      :show="nuevaSubCatDisplay.show"
      :editar="nuevaSubCatDisplay.editar"
      :sub-cat="nuevaSubCatDisplay.item"
      :ver="nuevaSubCatDisplay.ver"
      @closeDialog="closeNuevaSubCatDisplay"
    ></new-sub-categoria>

    <DetallesProducto
      :show="data.showDialog"
      :producto="data.productDialog"
      @cerrarDialog="closeDialogDet"
    />
    <AlertComp
      :show="data.viewAlert"
      @deleteItem="deleteAction"
    />

    <v-dialog
      v-model="data.showDiagUM"
      max-width="400"
      persistent
    >
      <v-card id="diag-fact">
        <v-card-title
          class="bg-indigo d-flex align-center"
        >
          <h5>
            <v-icon>mdi-scale-balance</v-icon>
            Nueva Unidad de Medida
          </h5>
          <v-spacer />
          <v-btn
            icon
            size="small"
            color="white"
            variant="tonal"
            @click="closeDialogUM()"
          >
            <v-icon>mdi-close</v-icon>
            <v-tooltip
              activator="parent"
              location="top"
              text="Cerrar"
            />
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="umForm">
            <v-row dense>
              <v-col
                cols="12"
                md="12"
                sm="12"
                class="py-2"
              >
                <v-text-field
                  v-model="
                    data.unidadMedida.abreviatura
                  "
                  prepend-inner-icon="mdi-barcode"
                  density="compact"
                  variant="outlined"
                  hide-details
                  label="Abreviatura"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col
                cols="12"
                md="12"
                sm="12"
                class="py-2"
              >
                <v-text-field
                  v-model="
                    data.unidadMedida.nombre
                  "
                  prepend-inner-icon="mdi-ruler"
                  density="compact"
                  variant="outlined"
                  hide-details
                  label="Nombre"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="grey"
            variant="outlined"
            @click="closeDialogUM()"
          >
            Cerrar
          </v-btn>
          <v-btn
            class="bg-indigo"
            @click="guardarUnidadMedida"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="data.descarga.show"
      width="400"
    >
      <v-card>
        <template v-slot:prepend>
          <h3>Descargar inventario</h3>
        </template>
        <template v-slot:append>
          <v-btn
            icon
            variant="tonal"
            size="small"
            @click="data.descarga.show = false"
          >
            <v-icon size="small">
              mdi-close
            </v-icon>
          </v-btn>
        </template>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-select
                v-model="data.form.idCategoria"
                label="Categoría:"
                :items="cmb.categorias"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-shape-outline"
                hide-details
                @update:model-value="
                  loadCmbSubCategoria(
                    data.form.idCategoria
                  )
                "
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="data.form.idSubCatProd"
                label="Sub categoría"
                :items="cmb.subCategorias"
                variant="outlined"
                hide-details
                density="compact"
                prepend-inner-icon="mdi-shape-outline"
                @update:model-value="
                  loadCodigoRecomendado(
                    data.form.idSubCatProd
                  )
                "
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="data.form.idSubCatProd"
                label="Producto"
                :items="cmb.subCategorias"
                variant="outlined"
                hide-details
                density="compact"
                prepend-inner-icon="mdi-shape-outline"
                @update:model-value="
                  loadCodigoRecomendado(
                    data.form.idSubCatProd
                  )
                "
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-checkbox
                label="Descargar todo el inventario"
                color="indigo"
                hide-details
                density="compact"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            variant="elevated"
            class="bg-indigo-darken-4"
            @click="exportToExcel"
          >
            <template v-slot:prepend>
              <v-icon> mdi-download </v-icon>
            </template>
            Descargar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  watch
} from 'vue'
import { utilsFunctions } from '@/helpers/utilFunctions'
import DetallesProducto from './modalsProductos/DetallesProducto.vue'
import RequestHttp from '@/services/requestHttp'
import AlertComp from '@/components/widgets/AlertaAction.vue'
import {
  getItemsCombobox,
  httpGet,
  httpPost,
  httpPut
} from '@/scripts/api.js'
import { saveAs } from 'file-saver'
import ExcelJS from 'exceljs'
import axios from 'axios'
import NewCategoria from '@/components/inventario/Categorias/modalsCategorias/NewCategoria.vue'
import NewSubCategoria from '@/components/inventario/Categorias/modalsCategorias/NewSubCat.vue'
import { time } from 'echarts'
import { hasAccessToFunct } from '@/scripts/Seguridad.js'
import { useSnackbar } from '@/composables/use-snackbar.js'

export default {
  // mounted() {
  //   this.getProductos()
  //   this.loadCmbCategoria()
  // },

  components: {
    NewCategoria,
    NewSubCategoria,
    DetallesProducto,
    AlertComp
  },

  setup() {
    const token = ref(
      JSON.parse(localStorage.getItem('token'))
    )
    const screenWidth = ref(window.innerWidth)
    const isMobile = computed(
      () => screenWidth.key < 600
    )
    const updateScreen = () => {
      screenWidth.key = window.innerWidth
    }
    onMounted(() => {
      window.addEventListener(
        'resize',
        updateScreen
      )
    })
    onUnmounted(() => {
      window.addEventListener(
        'resize',
        updateScreen
      )
    })

    const data = reactive({
      popoverLoading: false,
      popoverPrices: [],
      popoverProductCosto: 0,
      products: [],
      tipos: [
        {
          title: 'Herramientas',
          value: 'Herramientas'
        }
      ],
      headers: [
        {
          title: '',
          key: 'actions',
          sortable: false,
          align: 'center',
          headerProps: {
            class: 'pa-0'
          },
          cellProps: {
            class: 'pa-0'
          }
        },
        {
          title: 'Categoría',
          key: 'categoria',
          align: 'center'
        },
        {
          title: 'Sub categoría',
          key: 'subCategoria',
          align: 'center'
        },
        {
          title: 'Código',
          key: 'codigo',
          align: 'center'
        },
        {
          title: 'Nombre',
          key: 'nombre',
          align: 'center',
          width: 200
        },
        {
          title: 'Stock',
          key: 'cantidadTotal',
          align: 'center'
        },
        {
          title: 'U/M',
          key: 'unidadMedida',
          align: 'center'
        },
        {
          title: 'Costo U.',
          key: 'costo',
          align: 'center'
        },
        {
          title: 'Precio Venta U.',
          key: 'precio',
          align: 'center'
        },
        {
          title: 'Mínimo Venta',
          key: 'minimoVenta',
          align: 'center'
        },
        /*{
          title: '¿Es Mayorista?',
          key: 'esMayorista',
          align: 'center'
        },*/
        {
          title: 'Impuestos',
          key: 'impuestosCount',
          align: 'center'
        },
        {
          title: 'Fact. sin Inv.',
          key: 'esFacturarSinInventario',
          align: 'center'
        },
        /*{
          title: 'Fecha Registro',
          key: 'fechaRegistro',
          align: 'center'
        },
        {
          title: 'Usuario Registro',
          key: 'usuarioRegistro',
          align: 'center'
        },*/
        {
          title: 'Estado',
          key: 'estado',
          align: 'center'
        }
      ],
      subCategorias: [],
      unidadesMedidas: [],
      unidadMedida: {
        abreviatura: null,
        nombre: null,
        usuarioRegistro: null
      },
      descarga: {
        show: false
      },

      form: {
        idProducto: 0,
        codigo: null,
        nombre: null,
        precio: null,
        utilidad: null,
        costo: null,
        esFacturarSinInventario: false,
        minimoVenta: null,
        costoDolar: null,
        idCategoria: null,
        idUnidadMedidaCompra: 1,
        cantidadUMCompra: 1,
        idUnidadMedidaVenta: 1,
        cantidadUMVenta: 1,
        idUnidadMedida: 1,
        cantidadTotal: 0,
        cantidadMinima: 0,
        usuarioRegistro: null,
        observaciones: '',
        esMayorista: false,
        preciosMayoristas: [],
        impuestos: []
      },
      showDiagUM: false,
      imagen: null,
      observaciones: null,
      selectedProduct: null,
      loading: false,
      showDialog: false,
      dialog: false,
      viewAlert: false,
      requestHttp: new RequestHttp()
    })

    async function getSubCategorias() {
      data.subCategorias = []
      const result =
        await data.requestHttp.getSubCategorias()
      if (result.code === 200) {
        result.data.map((item) => {
          data.subCategorias.push({
            title: item.nombre,
            value: item.idSubCatProd
          })
        })
      } else {
        throw new Error('Error en la solicitud')
      }
    }

    async function getUnidadMedida() {
      data.unidadesMedidas = []
      const result =
        await data.requestHttp.getUnidadMedida()
      if (result !== null) {
        result.map((item) => {
          data.unidadesMedidas.push({
            title: item.nombre,
            value: item.id
          })
        })
      } else {
        throw new Error('Error en la solicitud')
      }
    }

    watch(
      () => data.dialog,
      (val) => {
        if (val) {
          getSubCategorias()
          getUnidadMedida()
        }
      }
    )

    return {
      data,
      isMobile,
      getSubCategorias,
      getUnidadMedida,
      token,
      snackbar: useSnackbar()
    }
  },

  data() {
    return {
      display: {
        ajusteStock: false,
        verAjusteStock: false
      },

      verAjusteStock: {
        producto: '',
        cantidadTotal: 0,
        tbl: {
          items: [],
          headers: [
            {
              title: 'Stock Anterior',
              key: 'stockAnterior',
              align: 'center',
              width: 1,
              headerProps: {
                class: 'pa-1'
              },
              cellProps: {
                class: 'pa-1 border-e'
              }
            },
            {
              title: 'Stock Ajustado',
              key: 'stockActual',
              align: 'center',
              width: 1,
              headerProps: {
                class: 'pa-1'
              },
              cellProps: {
                class: 'pa-1 border-e'
              }
            },
            {
              title: 'Motivo',
              key: 'observaciones',
              align: 'center',
              //width: 1,
              headerProps: {
                class: 'pa-1'
              },
              cellProps: {
                class: 'pa-1 border-e'
              }
            },
            {
              title: 'Fecha Registro',
              key: 'fechaRegistro',
              align: 'center',
              width: 1,
              headerProps: {
                class: 'pa-1'
              },
              cellProps: {
                class: 'pa-1 border-e'
              }
            },
            {
              title: 'Usuario Registro',
              key: 'usuarioRegistro',
              align: 'center',
              width: 1,
              headerProps: {
                class: 'pa-1'
              },
              cellProps: {
                class: 'pa-1'
              }
            }
          ]
        }
      },

      ajusteStock: {
        data: {
          idProducto: 0,
          cantidadTotal: 0,
          observaciones: '',
          usuarioRegistro: ''
        },
        producto: '',
        loading: false
      },

      cmb: {
        unidadesMedida: [],
        categorias: [],
        subCategorias: [],
        impuestos: []
      },

      nuevaCategoriaDisplay: {
        show: false,
        editar: false,
        ver: false,
        title: '',
        item: {}
      },

      nuevaSubCatDisplay: {
        show: false,
        editar: false,
        ver: false,
        title: '',
        item: {}
      },

      registroDisplay: {
        tab: null,
        imagen: {
          archivo: null,
          url: null
        },
        formatosImagen: [
          'image/jpeg',
          'image/jpg',
          'image/png'
        ],
        eliminarImagen: false,
        maxFileSize: 1024 * 1024,
        actualizandoCosto: false
      },

      search: '',
      dialog: false,
      deleteDialog: false,
      dialogMode: 'create',
      selectedProduct: null,
      productToDelete: null,
      rules: {
        required: (key) =>
          (key !== null &&
            key !== undefined &&
            key !== '') ||
          'Campo requerido',
        minLength: (min) => (key) =>
          (key && key.length >= min) ||
          `Mínimo ${min} caracteres`,
        numeric: (key) =>
          !isNaN(parseFloat(key)) ||
          'Debe ser un número válido'
      }
    }
  },

  computed: {
    dialogTitle() {
      return this.dialogMode === 'create'
        ? 'Nuevo Producto'
        : 'Editar Producto'
    }
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getProductos()
      vm.loadCmbCategoria()
    })
  },

  methods: {
    hasAccessToFunct,

    loadAjusteStockDisplay() {
      this.display.ajusteStock = true
      this.ajusteStock.data.idProducto =
        this.data.form.idProducto
      this.ajusteStock.producto =
        this.data.form.nombre
    },

    closeAjusteStockDisplay() {
      this.display.ajusteStock = false
      this.ajusteStock.data.cantidadTotal = 0
      this.ajusteStock.data.observaciones = ''
      this.ajusteStock.data.idProducto = 0
    },

    async saveAjusteStockDisplay() {
      const validation =
        await this.$refs.formAjusteStock.validate()

      if (!validation.valid) {
        this.snackbar.notify(
          'error',
          'Rellene los campos requeridos.'
        )
        return
      }

      this.ajusteStock.loading = true
      try {
        this.ajusteStock.data.usuarioRegistro =
          this.token.usuario
        const targetId =
          this.ajusteStock.data.idProducto
        const nuevoStock = Number(
          this.ajusteStock.data.cantidadTotal
        )

        await httpPut(
          `api/producto/${targetId}/cantidad-total`,
          this.ajusteStock.data
        )

        this.snackbar.notify(
          'success',
          'Ajuste de stock realizado correctamente.'
        )

        this.data.form.cantidadTotal = nuevoStock

        const productInTable =
          this.data.products.find(
            (p) => p.idProducto === targetId
          )
        if (productInTable) {
          productInTable.cantidadTotal =
            nuevoStock
          productInTable.stockMin =
            productInTable.cantidadMinima >
            nuevoStock
              ? 'SI'
              : 'NO'
        }

        this.closeAjusteStockDisplay()
        await this.getProductos()
      } catch (err) {
        console.error(err)
        this.snackbar.notify(
          'error',
          'Ocurrió un error al realizar el ajuste de stock, contacte al administrador.'
        )
      } finally {
        this.ajusteStock.loading = false
      }
    },

    async loadVerAjustesStockDisplay(item) {
      try {
        this.verAjusteStock.producto = item.nombre
        this.verAjusteStock.cantidadTotal =
          item.cantidadTotal
        this.verAjusteStock.tbl.items = []
        const items = await httpGet(
          `api/producto/${item.idProducto}/ajustes-stock`
        )
        this.verAjusteStock.tbl.items = items
        this.display.verAjusteStock = true
      } catch (e) {
        console.error(e)
      }
    },

    openNuevaCategoriaDisplay() {
      this.nuevaCategoriaDisplay.show = true
    },

    setStockMinimo(cantMin, cant) {
      if (cantMin <= cant) {
        return true
      } else {
        return false
      }
    },

    async closeNuevaCategoriaDisplay() {
      await this.loadCmbCategoria()
      this.nuevaCategoriaDisplay.show = false
    },

    openNuevaSubCatDisplay() {
      this.nuevaSubCatDisplay.show = true
      this.nuevaSubCatDisplay.title =
        'Nueva SubCategoria'
    },

    async closeNuevaSubCatDisplay() {
      this.nuevaSubCatDisplay.show = false
      this.nuevaSubCatDisplay.item = {}
      this.loadCmbSubCategoria(
        this.data.form.idCategoria
      )
      this.getSubCategorias()
    },

    async loadCodigoRecomendado(idSubCat) {
      var codigoRecomendado = await httpGet(
        `api/producto/codigo-recomendado?idSubCat=${idSubCat}`
      )
      this.data.form.codigo = String(
        codigoRecomendado
      )
    },

    handleChangeCosto() {
      if (!this.data.form.costo) {
        this.data.form.costoDolar = null
        return
      }
      this.data.form.costoDolar = (
        this.data.form.costo / 36.6243
      ).toFixed(4)

      if (
        this.data.form.esMayorista &&
        this.data.form.preciosMayoristas
      ) {
        this.data.form.preciosMayoristas.forEach(
          (row) => {
            this.handleWholesalePrecioChange(row)
          }
        )
      } else {
        this.handleChangePrecio()
      }
    },

    handleChangeCostoDolar() {
      if (!this.data.form.costoDolar) {
        this.data.form.costo = null
        return
      }
      this.data.form.costo = (
        this.data.form.costoDolar * 36.6243
      ).toFixed(4)

      if (
        this.data.form.esMayorista &&
        this.data.form.preciosMayoristas
      ) {
        this.data.form.preciosMayoristas.forEach(
          (row) => {
            this.handleWholesalePrecioChange(row)
          }
        )
      } else {
        this.handleChangePrecio()
      }
    },

    handleWholesalePrecioChange(row) {
      if (!row.precio || !this.data.form.costo) {
        row.utilidad = null
        return
      }
      const precio = Number(row.precio)
      const costo = Number(this.data.form.costo)
      if (costo === 0) {
        row.utilidad = 0
        return
      }
      row.utilidad = (
        ((precio - costo) / costo) *
        100
      ).toFixed(4)
    },

    handleWholesaleUtilidadChange(row) {
      if (
        !row.utilidad ||
        !this.data.form.costo
      ) {
        row.precio = this.data.form.costo
        return
      }
      const utilidad = Number(row.utilidad)
      const costo = Number(this.data.form.costo)
      row.precio = (
        (utilidad / 100) * costo +
        costo
      ).toFixed(4)
    },

    handleChangePrecio() {
      if (!this.data.form.precio) {
        this.data.form.utilidad = null
        return
      }
      var precio = Number(this.data.form.precio)
      var costo = Number(this.data.form.costo)
      this.data.form.utilidad = (
        ((precio - costo) / costo) *
        100
      ).toFixed(4)
    },

    handleChangeUtilidad() {
      if (!this.data.form.utilidad) {
        this.data.form.precio =
          this.data.form.costo
        return
      }
      var utilidad = Number(
        this.data.form.utilidad
      )
      var costo = Number(this.data.form.costo)
      this.data.form.precio =
        (utilidad / 100) * costo + costo
    },

    handleInputImagen() {
      let me = this
      const file =
        me.registroDisplay.imagen.archivo
      if (
        file &&
        file.size > me.registroDisplay.maxFileSize
      ) {
        me.registroDisplay.imagen.archivo = ''
        alert(
          'El archivo excede el tamaño máximo de 1MB.'
        )
      } else {
        if (file) {
          me.registroDisplay.imagen.url =
            URL.createObjectURL(file)
        } else {
          me.registroDisplay.imagen.url = null
        }
      }
    },

    handleEliminarImagen() {
      this.registroDisplay.imagen.url = ''
      this.registroDisplay.imagen.archivo = null
      this.registroDisplay.eliminarImagen = true
    },

    setStyle({ index }) {
      return {
        class:
          index % 2 === 0
            ? 'bg-white'
            : 'bg-indigo-lighten-5'
      }
    },

    async getProductos() {
      this.data.products = []
      this.data.loading = true
      const result =
        await this.data.requestHttp.getProductos()

      if (result.code === 200) {
        this.data.products = result.data.map(
          (item) => ({
            ...item,
            stockMin:
              item.cantidadMinima >
              item.cantidadTotal
                ? 'SI'
                : 'NO'
          })
        )
      }
      this.data.loading = false
    },

    async loadCmbUnidadMedida() {
      var unidades = await getItemsCombobox(
        'api/unidades-medida/combobox',
        false
      )
      this.cmb.unidadesMedida = unidades
    },

    async loadCmbCategoria() {
      var categorias = await getItemsCombobox(
        'api/categoriaproducto/combobox',
        true
      )
      this.cmb.categorias = categorias
    },

    async loadCmbSubCategoria(id) {
      var subCategorias = await getItemsCombobox(
        `api/subcatproducto/combobox?idCategoria=${id}`
      )
      this.cmb.subCategorias = subCategorias
    },

    async loadCmbImpuestos() {
      var impuestos = await getItemsCombobox(
        'api/impuestos/combobox',
        true
      )
      this.cmb.impuestos = impuestos
    },

    async guardarRegistro() {
      const validation =
        await this.$refs.form.validate()
      if (!validation.valid) {
        this.snackbar.notify(
          'error',
          'Por favor, rellene los campos requeridos y corrija los errores.'
        )
        return
      }

      if (this.data.form.esMayorista) {
        if (
          !this.data.form.preciosMayoristas ||
          this.data.form.preciosMayoristas
            .length === 0
        ) {
          this.snackbar.notify(
            'error',
            'Debe agregar al menos un rango de precio mayorista.'
          )
          return
        }

        // Validate each row
        for (
          let i = 0;
          i <
          this.data.form.preciosMayoristas.length;
          i++
        ) {
          const row =
            this.data.form.preciosMayoristas[i]
          const isLastRow =
            i ===
            this.data.form.preciosMayoristas
              .length -
              1
          const label = `rango ${i + 1}`

          if (
            row.minimo === null ||
            row.minimo === undefined ||
            row.minimo === ''
          ) {
            this.snackbar.notify(
              'error',
              `Cantidad mínima requerida en el ${label}.`
            )
            return
          }

          const isIndefinido =
            isLastRow &&
            (row.maximo === null ||
              row.maximo === undefined ||
              row.maximo === '')

          if (!isIndefinido) {
            if (
              row.maximo === null ||
              row.maximo === undefined ||
              row.maximo === ''
            ) {
              this.snackbar.notify(
                'error',
                `Cantidad máxima requerida en el ${label}.`
              )
              return
            }
          }

          if (
            row.precio === null ||
            row.precio === undefined ||
            row.precio === ''
          ) {
            this.snackbar.notify(
              'error',
              `Precio requerido en el ${label}.`
            )
            return
          }

          const minimo = Number(row.minimo)
          const precio = Number(row.precio)

          if (minimo <= 0) {
            this.snackbar.notify(
              'error',
              `La cantidad mínima del ${label} debe ser mayor a 0.`
            )
            return
          }

          if (!isIndefinido) {
            const maximo = Number(row.maximo)
            if (maximo <= 0) {
              this.snackbar.notify(
                'error',
                `La cantidad máxima del ${label} debe ser mayor a 0.`
              )
              return
            }
            if (maximo < minimo) {
              this.snackbar.notify(
                'error',
                `La cantidad máxima del ${label} no puede ser menor que la cantidad mínima (${minimo}).`
              )
              return
            }
          }

          if (precio <= 0) {
            this.snackbar.notify(
              'error',
              `El precio del ${label} debe ser mayor a 0.`
            )
            return
          }

          // Validate relation to previous row
          if (i > 0) {
            const prevRow =
              this.data.form.preciosMayoristas[
                i - 1
              ]
            const prevMaximo = Number(
              prevRow.maximo
            )
            if (minimo <= prevMaximo) {
              this.snackbar.notify(
                'error',
                `La cantidad mínima del ${label} (${minimo}) debe ser mayor que la cantidad máxima del rango anterior (${prevMaximo}).`
              )
              return
            }
          }
        }

        // Convert to payload
        this.data.form.preciosMayoristas =
          this.data.form.preciosMayoristas.map(
            (item, i) => {
              const isLast =
                i ===
                this.data.form.preciosMayoristas
                  .length -
                  1
              const isIndefinido =
                isLast &&
                (item.maximo === null ||
                  item.maximo === undefined ||
                  item.maximo === '')
              return {
                precio: Number(item.precio),
                minimo: Number(item.minimo),
                maximo: isIndefinido
                  ? null
                  : Number(item.maximo),
                rangoIndefinido: isIndefinido,
                observaciones: item.observaciones
              }
            }
          )
        this.data.form.precio = Number(
          this.data.form.preciosMayoristas[0]
            ?.precio || 0
        )
      } else {
        this.data.form.preciosMayoristas = []
      }

      // Validar impuestos si existen
      if (
        this.data.form.impuestos &&
        this.data.form.impuestos.length > 0
      ) {
        for (
          let i = 0;
          i < this.data.form.impuestos.length;
          i++
        ) {
          const imp = this.data.form.impuestos[i]
          if (!imp.idImpuesto) {
            this.snackbar.notify(
              'error',
              `Por favor seleccione el impuesto en la fila ${i + 1}.`
            )
            return
          }
        }
      }

      this.data.form.cantidadUMCompra = Number(
        this.data.form.cantidadUMCompra || 1
      )
      this.data.form.cantidadUMVenta = Number(
        this.data.form.cantidadUMVenta || 1
      )
      this.data.form.idUnidadMedidaCompra =
        Number(
          this.data.form.idUnidadMedidaCompra || 1
        )
      this.data.form.idUnidadMedidaVenta = Number(
        this.data.form.idUnidadMedidaVenta || 1
      )
      this.data.form.idUnidadMedida =
        this.data.form.idUnidadMedidaCompra

      this.data.form.costo = Number(
        this.data.form.costo
      )
      this.data.form.precio = Number(
        this.data.form.precio
      )
      this.data.form.cantidadMinima = Number(
        this.data.form.cantidadMinima
      )
      this.data.form.cantidadTotal = Number(
        this.data.form.cantidadTotal
      )
      this.data.form.minimoVenta =
        this.data.form.minimoVenta !== null &&
        this.data.form.minimoVenta !==
          undefined &&
        this.data.form.minimoVenta !== ''
          ? Number(this.data.form.minimoVenta)
          : null
      this.data.form.esFacturarSinInventario =
        Boolean(
          this.data.form.esFacturarSinInventario
        )

      this.data.form.usuarioRegistro =
        this.token.usuario
      try {
        if (this.dialogMode === 'edit') {
          await httpPut(
            `api/producto/${this.data.form.idProducto}`,
            this.data.form
          )
          await this.actActualizarImagen()
          await this.getProductos()
          this.closeDialog()
          this.snackbar.notify(
            'success',
            'Producto actualizado correctamente.'
          )
        } else {
          var response = await httpPost(
            'api/producto',
            this.data.form
          )
          this.data.form.idProducto =
            response.data
          await this.actActualizarImagen()
          await this.getProductos()
          this.closeDialog()
          this.snackbar.notify(
            'success',
            'Producto registrado correctamente.'
          )
        }
      } catch (error) {
        console.error(error)
        const errMsg =
          error?.response?.data?.msg ||
          error?.response?.data ||
          error?.message ||
          'Ocurrió un error al guardar el producto.'
        this.snackbar.notify(
          'error',
          typeof errMsg === 'string'
            ? errMsg
            : 'Error al guardar el producto.'
        )
      }
    },

    addPrecioMayoristaRow() {
      if (!this.data.form.preciosMayoristas) {
        this.data.form.preciosMayoristas = []
      }

      const count =
        this.data.form.preciosMayoristas.length
      if (count === 0) {
        this.data.form.preciosMayoristas.push({
          minimo: 1,
          maximo: 2,
          precio: this.data.form.precio || 0,
          utilidad: this.data.form.utilidad || 0,
          observaciones: ''
        })
      } else {
        const prevRow =
          this.data.form.preciosMayoristas[
            count - 1
          ]
        if (
          prevRow.maximo === null ||
          prevRow.maximo === undefined ||
          prevRow.maximo === ''
        ) {
          this.snackbar.notify(
            'warning',
            'Debe especificar la cantidad máxima en el rango anterior antes de añadir un nuevo rango.'
          )
          return
        }
        const nextMinimo =
          Number(prevRow.maximo) + 1
        this.data.form.preciosMayoristas.push({
          minimo: nextMinimo,
          maximo: '',
          precio: '',
          utilidad: '',
          observaciones: ''
        })
      }
    },

    removePrecioMayoristaRow(index) {
      this.data.form.preciosMayoristas.splice(
        index,
        1
      )
    },

    addImpuestoRow() {
      if (!this.data.form.impuestos) {
        this.data.form.impuestos = []
      }
      this.data.form.impuestos.push({
        idImpuesto: null,
        esAplicadoCompra: true,
        esAplicadoVenta: true
      })
    },

    removeImpuestoRow(index) {
      this.data.form.impuestos.splice(index, 1)
    },

    async guardarUnidadMedida() {
      this.$refs.umForm.validate()
      this.data.unidadMedida.usuarioRegistro =
        this.token.usuario
      const valid = utilsFunctions.objectValidate(
        this.data.unidadMedida
      )

      if (valid) {
        const result =
          await this.data.requestHttp.postUnidadMedida(
            this.data.unidadMedida
          )
        await this.loadCmbUnidadMedida()
        alert(result)
      } else {
        alert('Complete la información.')
        return
      }
      this.closeDialogUM()
    },

    async actActualizarImagen() {
      const file =
        this.registroDisplay.imagen.archivo
      var id = this.data.form.idProducto
      if (
        file ||
        this.registroDisplay.eliminarImagen
      ) {
        const formData = new FormData()
        formData.append('imagen', file)
        try {
          await httpPut(
            `api/producto/${id}/imagen`,
            formData
          )
        } catch (err) {
          console.log(err)
        }
      } else {
        //alert('no se eliminar imagen')
      }
      this.registroDisplay.eliminarImagen = false
    },

    async openDialog(mode, product = null) {
      this.registroDisplay.tab = 0
      this.registroDisplay.imagen.url = null
      this.registroDisplay.imagen.archivo = null
      await this.loadCmbUnidadMedida()
      await this.loadCmbCategoria()
      await this.loadCmbImpuestos()
      if (mode !== 'edit') {
        this.data.form = {
          idProducto: 0,
          codigo: null,
          nombre: null,
          precio: null,
          utilidad: null,
          costo: null,
          costoDolar: null,
          idCategoria: null,
          idSubCatProd: null,
          idUnidadMedidaCompra: 1,
          cantidadUMCompra: 1,
          idUnidadMedidaVenta: 1,
          cantidadUMVenta: 1,
          idUnidadMedida: 1,
          cantidadTotal: 0,
          cantidadMinima: 0,
          minimoVenta: null,
          esFacturarSinInventario: false,
          usuarioRegistro: null,
          observaciones: '',
          esMayorista: false,
          preciosMayoristas: [],
          impuestos: []
        }
      } else {
        await this.loadCmbSubCategoria(
          product.idCategoriaProducto
        )
      }
      this.dialogMode = mode
      if (product) {
        let fullProduct = product
        try {
          fullProduct = await httpGet(
            `api/producto/${product.idProducto}`
          )
        } catch (e) {
          console.error(
            'No se pudo cargar el detalle completo del producto.',
            e
          )
        }

        this.selectedProduct =
          fullProduct.idProducto
        this.data.form.idProducto =
          fullProduct.idProducto
        this.data.form.observaciones =
          fullProduct.observaciones
        this.data.form.idUnidadMedidaCompra =
          fullProduct.idUnidadMedidaCompra ||
          product.idUnidadMedidaCompra ||
          1
        this.data.form.cantidadUMCompra =
          fullProduct.cantidadUMCompra ||
          product.cantidadUMCompra ||
          1
        this.data.form.idUnidadMedidaVenta =
          fullProduct.idUnidadMedidaVenta ||
          product.idUnidadMedidaVenta ||
          1
        this.data.form.cantidadUMVenta =
          fullProduct.cantidadUMVenta ||
          product.cantidadUMVenta ||
          1
        this.data.form.idUnidadMedida =
          fullProduct.idUnidadMedidaCompra ||
          fullProduct.idUnidadMedida ||
          1
        this.data.form.codigo = fullProduct.codigo
        this.data.form.idCategoria =
          product.idCategoriaProducto
        this.data.form.costo = fullProduct.costo
        this.data.form.categoria =
          fullProduct.categoria ||
          product.categoria
        this.data.form.nombre = fullProduct.nombre
        this.data.form.precio = fullProduct.precio
        this.data.form.idSubCatProd =
          fullProduct.idSubCatProd
        this.data.form.tipoProducto =
          fullProduct.tipoProducto
        this.data.form.cantidadTotal =
          fullProduct.cantidadTotal
        this.data.form.cantidadMinima =
          fullProduct.cantidadMinima
        this.data.form.minimoVenta =
          fullProduct.minimoVenta ??
          product.minimoVenta ??
          null
        this.data.form.esFacturarSinInventario =
          fullProduct.esFacturarSinInventario ??
          product.esFacturarSinInventario ??
          false
        this.data.form.usuarioRegistro =
          fullProduct.usuarioRegistro
        this.data.form.esMayorista =
          fullProduct.esMayorista || false
        this.data.form.preciosMayoristas =
          fullProduct.precioMayorista
            ? fullProduct.precioMayorista.map(
                (pm) => {
                  const row = {
                    precio: pm.precio,
                    minimo: pm.minimo,
                    maximo:
                      pm.rangoIndefinido ||
                      pm.maximo === null ||
                      pm.maximo === undefined ||
                      pm.maximo === 0
                        ? ''
                        : pm.maximo,
                    observaciones:
                      pm.observaciones,
                    utilidad: 0
                  }
                  const precio = Number(pm.precio)
                  const costo = Number(
                    fullProduct.costo
                  )
                  if (costo > 0) {
                    row.utilidad = (
                      ((precio - costo) / costo) *
                      100
                    ).toFixed(4)
                  }
                  return row
                }
              )
            : []

        const impSource =
          fullProduct.productoImpuestos ||
          fullProduct.impuestos ||
          product.impuestos ||
          []
        this.data.form.impuestos = impSource.map(
          (imp) => ({
            idImpuesto: imp.idImpuesto,
            esAplicadoCompra:
              imp.esAplicadoCompra !== false,
            esAplicadoVenta:
              imp.esAplicadoVenta !== false
          })
        )

        this.loadImagenProducto(
          fullProduct.idProducto
        )
      }
      this.dialog = true
      this.data.dialog = true
      this.handleChangeCosto()
    },

    async loadImagenProducto(id) {
      try {
        const response = await axios.get(
          `api/producto/${id}/imagen`,
          {
            responseType: 'arraybuffer'
          }
        )

        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) =>
              data + String.fromCharCode(byte),
            ''
          )
        )
        this.registroDisplay.imagen.url =
          'data:image/jpeg;base64,' + base64Image
      } catch (err) {}
    },

    openDialogDet(obj) {
      ;(this.data.showDialog =
        !this.data.showDialog),
        (this.data.productDialog = obj)
    },

    closeDialogDet(key) {
      this.data.showDialog = key
    },

    closeDialogUM() {
      this.data.showDiagUM = false
      this.data.unidadMedida = {}
      this.getUnidadMedida()
    },

    closeDialog() {
      this.dialog = false
      this.data.dialog = false
      this.selectedProduct = null
      this.data.form.idSubCatProd = null
      this.data.form = {
        idProducto: 0,
        codigo: null,
        nombre: null,
        precio: null,
        utilidad: null,
        costo: null,
        costoDolar: null,
        idCategoria: null,
        idSubCatProd: null,
        idUnidadMedidaCompra: 1,
        cantidadUMCompra: 1,
        idUnidadMedidaVenta: 1,
        cantidadUMVenta: 1,
        idUnidadMedida: 1,
        cantidadTotal: 0,
        cantidadMinima: 0,
        minimoVenta: null,
        esFacturarSinInventario: false,
        usuarioRegistro: null,
        observaciones: '',
        esMayorista: false,
        preciosMayoristas: [],
        impuestos: []
      }
    },

    async handleSave(productData) {
      this.data.form.costo = Number(
        this.data.form.costo
      )
      this.data.form.precio = Number(
        this.data.form.precio
      )
      this.data.form.cantidadMinima = Number(
        this.data.form.cantidadMinima
      )
      this.data.form.cantidadTotal = Number(
        this.data.form.cantidadTotal
      )
      const valid =
        utilsFunctions.objectValidate(productData)

      if (this.dialogMode === 'create') {
        if (!valid) {
          alert('Complete toda la informacion')
          return
        }

        try {
          productData.idUnidadMedida = 1
          const result =
            await this.data.requestHttp.postProducto(
              productData
            )
          if (result !== null) {
            alert('Registro Guardado')
            this.getProductos()
          } else {
            alert('Error al guardar el producto')
          }
        } catch (error) {
          throw new Error(
            'Error en la solicitud',
            error
          )
        }
      } else {
        if (!valid) {
          alert('Complete toda la informacion')
          return
        }
        try {
          if (productData.imagen === null) {
            productData.imagen === 'NO IMAGE'
          }
          productData.idUnidadMedida = 1
          const result =
            await this.data.requestHttp.putProductos(
              productData,
              this.selectedProduct
            )
          if (result !== null) {
            alert('Registro Editado')
            this.getProductos()
          } else {
            alert('Error al guardar el producto')
          }
        } catch (error) {
          throw new Error(
            'Error en la solicitud',
            error
          )
        }
      }
      this.closeDialog()
    },

    // DESCARGA DE INVENTARIO
    exportToExcel() {
      const go = this
      if (
        go.data.headers.length === 0 ||
        go.data.products.length === 0
      ) {
        alert('No hay datos a exportar')
        return
      }

      const filteredHeaders =
        this.data.headers.filter(
          (header) => header.key !== 'actions'
        )
      const header = [
        '',
        ...filteredHeaders.map(
          (header) => header.title
        )
      ]

      const productos = []
      this.data.products.map((item) => {
        productos.push(item)
      })

      let totalInv = 0
      let totalVentaInv = 0
      let totalUtilidad = 0

      productos.map((item) => {
        totalInv +=
          item.cantidadTotal * item.costo
        totalVentaInv +=
          item.cantidadTotal * item.precio

        item.utilidad =
          item.cantidadTotal *
          (item.precio - item.costo)
        // item.precio = this.formatCurrency(item.precio)
        // item.costo = this.formatCurrency(item.costo)
      })

      productos.map((item) => {
        totalUtilidad += item.utilidad
      })

      const rows = this.data.products.map(
        (item) => [
          '',
          ...filteredHeaders.map(
            (header) => item[header.key] || 0
          )
        ]
      )

      const today = new Date()
      const dateNow = `${('0' + today.getDate()).slice(-2)}/${('0' + (today.getMonth() + 1)).slice(-2)}/${today.getFullYear().toString().slice(-2)}`
      const timeNow = `${('0' + today.getHours()).slice(-2)}:${('0' + today.getMinutes()).slice(-2)}:${('0' + today.getSeconds()).slice(-2)}`

      // const clienteR = go.data.clientes.find(item => item.value === go.data.clienteObj.cliente)
      // const objetivoR = go.data.objetivos.find(item => item.value === go.data.clienteObj.objetivo)

      const exporData = [
        // [],
        [
          '',
          '',
          '',
          '',
          '',
          'FECHA-HORA',
          `${dateNow} - ${timeNow}`
        ],
        [
          '',
          '',
          '',
          'TOTAL INVENTARIO',
          this.formatCurrency(totalInv) || '',
          'TOTAL INV VENTA',
          this.formatCurrency(totalVentaInv) ||
            '',
          'TOTAL UTILIDAD',
          this.formatCurrency(totalUtilidad)
        ]
      ]

      exporData.push([])
      exporData.push(header)
      exporData.push(...rows)

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet(
        `Inventario - IZ`
      )

      worksheet.mergeCells('E1:H1')
      worksheet.getCell('E1').value =
        'REPORTE DE INVENTARIO INVERSIONES Z.'
      const titleCell = worksheet.getCell('E1')
      titleCell.font = {
        bold: true,
        size: 16
      }

      // Insertar los datos
      worksheet.addRows(exporData)

      const titlesRowIndices = [2, 3]
      const columns = [5, 7, 9]
      titlesRowIndices.forEach((rowIndex) => {
        const row = worksheet.getRow(rowIndex)
        row.eachCell((cell, colNumber) => {
          if (columns.includes(colNumber)) {
            cell.font = { bold: true }
          }
        })
      })

      const headerRowIndex =
        exporData.length - rows.length // Índice de la fila de encabezados
      const tableSize = exporData.length + 1
      const fechasFormatted = [12]
      for (
        let i = headerRowIndex + 2;
        i <= tableSize;
        i++
      ) {
        // Desde la fila de datos hasta el final
        const row = worksheet.getRow(i)
        if (i % 2 === 0) {
          row.eachCell((cell, col) => {
            if (col !== 1) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'e8eaf6' }
              }
            }
          })
        }

        row.eachCell((cell, col) => {
          if (fechasFormatted.includes(col)) {
            const fechaISO = cell.value
            const fechaObj = new Date(fechaISO)

            cell.value = fechaObj
            cell.numFmt = 'dd/mm/yyyy'
          }

          if (col === 7) {
            // Tota   l
            cell.numFmt = '"C$"#,##0.00'
          }

          if (col === 8) {
            // Total
            cell.numFmt = '"C$"#,##0.00'
          }

          if (1 !== col) {
            cell.border = {
              top: {
                style: 'thin',
                color: { argb: '000000' }
              },
              left: {
                style: 'thin',
                color: { argb: '000000' }
              },
              bottom: {
                style: 'thin',
                color: { argb: '000000' }
              },
              right: {
                style: 'thin',
                color: { argb: '000000' }
              }
            }
          }
        })
      }

      const headerRow = worksheet.getRow(
        headerRowIndex + 1
      )
      headerRow.eachCell((cell, col) => {
        if (1 !== col) {
          cell.font = {
            bold: true,
            color: { argb: 'ffffff' }
          }
          ;(cell.style.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '0a008c' }
          }),
            (cell.border = {
              top: {
                style: 'thin',
                color: { argb: '000000' }
              },
              left: {
                style: 'thin',
                color: { argb: '000000' }
              },
              bottom: {
                style: 'thin',
                color: { argb: '000000' }
              },
              right: {
                style: 'thin',
                color: { argb: '000000' }
              }
            })
        }
      })
      headerRow.commit()

      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true
          }
        })
      })

      // // Agregar una imagen (ejemplo con imagen en Base64)
      // const logoBase64 = imgsBase64.emprovisa;  // Tu imagen en Base64 aquí
      // // Agregar la imagen en la celda A1
      // const imageId = workbook.addImage({
      //     base64: logoBase64,
      //     extension: 'svg',  // o 'jpeg' dependiendo del tipo de imagen
      // });
      // worksheet.getRow(1).height = 70
      // worksheet.getColumn(2).width = 250
      // // Colocar la imagen en la posición deseada (en A1)
      // worksheet.addImage(imageId, {
      //     tl: { col: 1, row: 0 }, // Esquina superior izquierda (A1)
      //     ext: { width: 200, height: 80, align: 'center' } // Tamaño de la imagen
      // });

      // Configurar el ancho de las columnas
      worksheet.columns = [
        { width: 10 },
        { width: 30 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 18 }
      ]

      // Crear y descargar el archivo
      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          const data = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
          })
          saveAs(
            data,
            `Reporte - Inventario ${dateNow}.xlsx`
          )
        })
    },

    deleteAction(val) {
      if (val === true) {
        this.deleteItem()
      }
      this.data.viewAlert = false
    },

    showAlert(item) {
      this.data.viewAlert = true
      this.data.selectedProduct = item.idProducto
    },

    async deleteItem() {
      try {
        const result =
          await this.data.requestHttp.deleteProducto(
            this.data.selectedProduct
          )
        if (result !== null) {
          this.snackbar.notify(
            'success',
            'Producto eliminado correctamente.'
          )
          this.getProductos()
        } else {
          this.snackbar.notify(
            'error',
            'No se pudo eliminar el producto.'
          )
        }
      } catch (err) {
        console.error(err)
        this.snackbar.notify(
          'error',
          'Ocurrió un error al eliminar el producto.'
        )
      }
    },

    formatCurrency(key) {
      return new Intl.NumberFormat('es-NI', {
        style: 'currency',
        currency: 'NIO'
      }).format(key)
    },

    async handlePopoverOpen(isOpen, item) {
      if (isOpen) {
        this.data.popoverLoading = true
        this.data.popoverPrices = []
        this.data.popoverProductCosto =
          item.costo || 0
        try {
          const res = await httpGet(
            `api/producto/${item.idProducto}`
          )
          if (res && res.precioMayorista) {
            this.data.popoverPrices =
              res.precioMayorista
          }
        } catch (e) {
          console.error(
            'Error al cargar precios mayoristas en popover:',
            e
          )
        } finally {
          this.data.popoverLoading = false
        }
      }
    },

    calculatePopoverUtilidad(precio, costo) {
      if (!precio || !costo) return '0.0%'
      const p = Number(precio)
      const c = Number(costo)
      if (c === 0) return '0.0%'
      return (
        (((p - c) / c) * 100).toFixed(1) + '%'
      )
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    getStatusColor(status) {
      const statusColors = {
        Activo: 'success',
        Inactivo: 'warning',
        Descontinuado: 'error'
      }
      return statusColors[status] || 'grey'
    },

    convertirImagen(archivo) {
      if (!archivo) return
      // Si es múltiple, toma el primero
      const file = Array.isArray(archivo)
        ? archivo[0]
        : archivo

      const lector = new FileReader()
      lector.onload = () => {
        this.data.imagen = lector.result
      }

      lector.readAsDataURL(file)
    }
  }
}
</script>

<style scoped>
.border-custom {
  border: #e0e0e0 1px solid;
  border-radius: 4px;
}

.v-card-title {
  border-radius: 4px 4px 0 0;
}

.font {
  font-size: 12px !important;
}

.hover-add-row:hover {
  background-color: #e8eaf6 !important;
}
.hover-add-row:hover td {
  color: #1a237e !important;
}

.product-image-container {
  border: 2px dashed #c5cae9 !important;
  transition: all 0.2s ease-in-out;
}

.product-image-container:hover {
  border-color: #3f51b5 !important;
}
</style>
