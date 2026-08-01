<template>
  <div class="w-100 pa-4">
    <v-card
      class="border-t border-b"
      elevation="0"
      rounded="0"
    >
      <!-- Encabezado -->
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <div
            class="text-h6 font-weight-bold d-flex align-center"
          >
            <v-icon class="me-2" color="primary">
              mdi-cart-arrow-down
            </v-icon>
            Pedidos de Venta
          </div>
        </div>
      </template>
      <template v-slot:append>
        <v-btn
          class="rounded"
          @click="openCreateDialog()"
          color="indigo-darken-4"
          prepend-icon="mdi-plus"
          variant="tonal"
        >
          Nuevo Pedido
        </v-btn>
      </template>
      <v-divider />

      <!-- FILTROS PRINCIPALES -->
      <v-card class="pa-4 mb-2" elevation="0">
        <div class="d-flex align-center mb-3">
          <v-icon color="primary" class="mr-2"
            >mdi-filter</v-icon
          >
          <span
            class="text-subtitle-2 font-weight-medium"
            >Filtros de búsqueda</span
          >
        </div>

        <v-row dense align="center">
          <v-col cols="12" md="2" sm="4">
            <v-text-field
              v-model="search.desde"
              label="Fecha inicial"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              prepend-inner-icon="mdi-calendar-arrow-left"
            />
          </v-col>
          <v-col cols="12" md="2" sm="4">
            <v-text-field
              v-model="search.hasta"
              label="Fecha final"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              prepend-inner-icon="mdi-calendar-arrow-right"
            />
          </v-col>
          <v-col cols="12" md="3" sm="4">
            <v-autocomplete
              v-model="search.idCliente"
              label="Cliente"
              :items="cmb.clientes"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              prepend-inner-icon="mdi-account"
            />
          </v-col>
          <v-col cols="12" md="2" sm="6">
            <v-autocomplete
              v-model="search.idEstadoActual"
              label="Estado"
              :items="cmb.estados"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              prepend-inner-icon="mdi-list-status"
            />
          </v-col>
          <v-col cols="12" md="2" sm="6">
            <v-text-field
              v-model="search.noPedido"
              label="Nº Pedido"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              prepend-inner-icon="mdi-pound"
              placeholder="PE-XXXX"
            />
          </v-col>
          <v-col
            cols="12"
            md="1"
            sm="12"
            class="d-flex justify-end ga-2"
          >
            <v-btn
              color="primary"
              variant="flat"
              density="compact"
              icon="mdi-magnify"
              @click="getPedidos()"
            >
              <v-icon>mdi-magnify</v-icon>
              <v-tooltip
                activator="parent"
                location="top"
                >Buscar</v-tooltip
              >
            </v-btn>
            <v-btn
              color="grey"
              variant="outlined"
              density="compact"
              icon="mdi-broom"
              @click="clearFilters()"
            >
              <v-icon>mdi-broom</v-icon>
              <v-tooltip
                activator="parent"
                location="top"
                >Limpiar</v-tooltip
              >
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- MÉTRICAS -->
      <v-row dense class="px-4 mb-2">
        <v-col cols="12" md="6" sm="6">
          <v-card
            variant="flat"
            color="indigo-lighten-5"
            class="pa-3 rounded-lg"
          >
            <div class="d-flex align-center">
              <v-avatar
                color="indigo"
                class="mr-3 text-white"
              >
                <v-icon
                  >mdi-receipt-text-clock</v-icon
                >
              </v-avatar>
              <div>
                <div
                  class="text-caption text-indigo-darken-3 font-weight-medium"
                >
                  Pedidos Registrados
                </div>
                <div
                  class="text-h6 font-weight-bold text-indigo-darken-4"
                >
                  {{ data.pedidos.length }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-card
            variant="flat"
            color="green-lighten-5"
            class="pa-3 rounded-lg"
          >
            <div class="d-flex align-center">
              <v-avatar
                color="green"
                class="mr-3 text-white"
              >
                <v-icon>mdi-cash-multiple</v-icon>
              </v-avatar>
              <div>
                <div
                  class="text-caption text-green-darken-3 font-weight-medium"
                >
                  Monto Total de Pedidos
                </div>
                <div
                  class="text-h6 font-weight-bold text-green-darken-4"
                >
                  {{
                    formatCurrency(
                      totalPedidosMonto
                    )
                  }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- TABLA DE PEDIDOS -->
      <v-card
        class="mx-4 mb-6 border"
        rounded="lg"
        elevation="0"
      >
        <v-data-table
          :headers="headers"
          :items="data.pedidos"
          :loading="loading"
          density="compact"
          class="rounded"
          :items-per-page="15"
        >
          <template
            v-slot:item.noPedido="{ item }"
          >
            <span
              class="font-weight-bold text-indigo"
              >{{ item.noPedido }}</span
            >
          </template>
          <template
            v-slot:item.fechaRegistro="{ item }"
          >
            {{ formatDate(item.fechaRegistro) }}
          </template>
          <template
            v-slot:item.fechaEntregaSolicitada="{
              item
            }"
          >
            {{
              formatDate(
                item.fechaEntregaSolicitada
              )
            }}
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip
              :color="
                getEstadoColor(
                  item.idEstadoActual
                )
              "
              size="small"
              variant="flat"
              class="font-weight-bold"
            >
              {{ item.estado }}
            </v-chip>
          </template>
          <template
            v-slot:item.totalAfecha="{ item }"
          >
            <span
              class="font-weight-bold text-success"
              >{{
                formatCurrency(item.totalAfecha)
              }}</span
            >
          </template>
          <template v-slot:item.opc="{ item }">
            <v-btn
              icon
              size="small"
              color="primary"
              variant="text"
              @click="viewPedidoDetail(item)"
            >
              <v-icon size="20">mdi-eye</v-icon>
              <v-tooltip
                activator="parent"
                location="top"
                >Ver detalle</v-tooltip
              >
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-card>

    <!-- DIÁLOGO DE DETALLE DEL PEDIDO -->
    <v-dialog
      v-model="dialogs.view"
      max-width="800"
      persistent
    >
      <v-card
        v-if="selectedPedido"
        class="rounded-lg elevation-12"
      >
        <v-card-title
          class="bg-indigo-darken-4 text-white d-flex align-center py-2 px-3"
        >
          <v-avatar
            size="36"
            color="white"
            class="mr-3"
            variant="flat"
          >
            <v-icon color="indigo" size="20"
              >mdi-text-box-search-outline</v-icon
            >
          </v-avatar>
          <h5
            class="text-h6 font-weight-bold text-white"
          >
            Detalles de Pedido:
            {{ selectedPedido.noPedido }}
          </h5>
          <v-spacer />
          <v-btn
            icon
            size="small"
            color="white"
            variant="text"
            @click="dialogs.view = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          class="pa-4 bg-grey-lighten-4"
          style="
            max-height: 70vh;
            overflow-y: auto;
          "
        >
          <v-row dense>
            <v-col cols="12" md="6">
              <v-card
                class="pa-3 mb-2"
                variant="outlined"
              >
                <div
                  class="text-subtitle-2 font-weight-bold text-indigo mb-2"
                >
                  Información General
                </div>
                <div
                  class="d-flex justify-space-between py-1 border-bottom"
                >
                  <span
                    class="text-caption text-grey"
                    >Cliente:</span
                  >
                  <span
                    class="text-body-2 font-weight-medium"
                    >{{
                      selectedPedido.cliente
                    }}</span
                  >
                </div>
                <div
                  class="d-flex justify-space-between py-1 border-bottom"
                >
                  <span
                    class="text-caption text-grey"
                    >Ruta Cliente:</span
                  >
                  <span
                    class="text-body-2 font-weight-medium"
                    >{{
                      selectedPedido.rutaCliente ||
                      '—'
                    }}</span
                  >
                </div>
                <div
                  class="d-flex justify-space-between py-1 border-bottom"
                >
                  <span
                    class="text-caption text-grey"
                    >Fecha Registro:</span
                  >
                  <span class="text-body-2">{{
                    formatDate(
                      selectedPedido.fechaRegistro
                    )
                  }}</span>
                </div>
                <div
                  class="d-flex justify-space-between py-1 border-bottom"
                >
                  <span
                    class="text-caption text-grey"
                    >Registrado por:</span
                  >
                  <span
                    class="text-body-2 font-weight-medium"
                    >{{
                      selectedPedido.usuarioRegistro ||
                      '—'
                    }}</span
                  >
                </div>
                <div
                  class="d-flex justify-space-between py-1 border-bottom"
                >
                  <span
                    class="text-caption text-grey"
                    >Fecha Entrega
                    Solicitada:</span
                  >
                  <span
                    class="text-body-2 font-weight-bold"
                    >{{
                      formatDate(
                        selectedPedido.fechaEntregaSolicitada
                      )
                    }}</span
                  >
                </div>
                <div
                  class="d-flex justify-space-between py-1"
                >
                  <span
                    class="text-caption text-grey"
                    >Solicitud de Crédito:</span
                  >
                  <v-chip
                    size="x-small"
                    :color="
                      selectedPedido.isSolicitudCredito
                        ? 'success'
                        : 'grey'
                    "
                    variant="flat"
                  >
                    {{
                      selectedPedido.isSolicitudCredito
                        ? 'Sí'
                        : 'No'
                    }}
                  </v-chip>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card
                class="pa-3 mb-2"
                variant="outlined"
              >
                <div
                  class="text-subtitle-2 font-weight-bold text-indigo mb-2"
                >
                  Datos de Entrega
                </div>
                <div class="py-1">
                  <span
                    class="text-caption text-grey d-block"
                    >Enviar A:</span
                  >
                  <span
                    class="text-body-2 font-weight-medium"
                    >{{
                      selectedPedido.enviarA ||
                      '—'
                    }}</span
                  >
                </div>
                <div class="py-1">
                  <span
                    class="text-caption text-grey d-block"
                    >Ubicación:</span
                  >
                  <span
                    class="text-body-2 font-weight-medium"
                    >{{
                      selectedPedido.ubicacion ||
                      '—'
                    }}</span
                  >
                </div>
                <div class="py-1">
                  <span
                    class="text-caption text-grey d-block"
                    >Observaciones:</span
                  >
                  <span
                    class="text-body-2 italic"
                    >{{
                      selectedPedido.observaciones ||
                      'Sin observaciones'
                    }}</span
                  >
                </div>
              </v-card>
            </v-col>

            <!-- Apertura de Caja Info -->
            <v-col cols="12" class="mt-1">
              <v-card
                class="pa-3 mb-2"
                variant="outlined"
              >
                <div
                  class="text-subtitle-2 font-weight-bold text-indigo mb-2"
                >
                  Sesión de Caja Asociada
                </div>
                <div
                  v-if="
                    selectedPedido.idAperturaCaja
                  "
                  class="d-flex justify-space-between flex-wrap"
                >
                  <div>
                    <span
                      class="text-caption text-grey"
                      >Caja:</span
                    >
                    <span
                      class="text-body-2 font-weight-medium"
                      >{{
                        selectedPedido.aperturaCajaCaja ||
                        '—'
                      }}</span
                    >
                  </div>
                  <div>
                    <span
                      class="text-caption text-grey"
                      >Código Apertura:</span
                    >
                    <span
                      class="text-body-2 font-weight-medium"
                      >{{
                        selectedPedido.aperturaCajaCodigo ||
                        '—'
                      }}</span
                    >
                  </div>
                  <div>
                    <span
                      class="text-caption text-grey"
                      >Abierto por:</span
                    >
                    <span
                      class="text-body-2 font-weight-medium"
                      >{{
                        selectedPedido.aperturaCajaUsuario ||
                        '—'
                      }}</span
                    >
                  </div>
                </div>
                <div
                  v-else
                  class="text-caption text-grey-darken-1 italic"
                >
                  Este pedido no fue registrado
                  bajo una sesión de caja
                  específica.
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-card
            class="border mt-3"
            rounded="lg"
            elevation="0"
          >
            <v-card-title
              class="text-subtitle-2 font-weight-bold py-2 bg-indigo-lighten-5 text-indigo"
            >
              Detalle de Productos
            </v-card-title>
            <v-table
              density="compact"
              class="elevation-0"
            >
              <thead>
                <tr class="bg-grey-lighten-3">
                  <th
                    class="font-weight-bold text-caption"
                  >
                    Código
                  </th>
                  <th
                    class="font-weight-bold text-caption"
                  >
                    Producto
                  </th>
                  <th
                    class="text-center font-weight-bold text-caption"
                  >
                    Cantidad
                  </th>
                  <th
                    class="text-right font-weight-bold text-caption"
                  >
                    Precio Unit. (C$)
                  </th>
                  <th
                    class="text-right font-weight-bold text-caption"
                  >
                    Subtotal (C$)
                  </th>
                  <th
                    class="font-weight-bold text-caption"
                  >
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in selectedPedido.detallePedido"
                  :key="item.idDetallePedido"
                >
                  <td
                    class="text-caption font-weight-bold"
                  >
                    {{
                      item.codigoProducto || '—'
                    }}
                  </td>
                  <td class="text-caption">
                    {{ item.producto }}
                  </td>
                  <td
                    class="text-center text-caption font-weight-medium"
                  >
                    {{ item.cantidad }}
                  </td>
                  <td
                    class="text-right text-caption"
                  >
                    {{
                      formatCurrency(
                        item.precioUnitarioAfecha
                      )
                    }}
                  </td>
                  <td
                    class="text-right text-caption font-weight-bold text-success"
                  >
                    {{
                      formatCurrency(
                        item.cantidad *
                          item.precioUnitarioAfecha
                      )
                    }}
                  </td>
                  <td
                    class="text-caption text-grey italic"
                  >
                    {{
                      item.observaciones || '—'
                    }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <div
            class="d-flex justify-end align-center mt-4 pa-2 bg-white border rounded-lg"
          >
            <div
              class="text-subtitle-1 font-weight-bold mr-4 text-indigo"
            >
              Total General:
            </div>
            <div
              class="text-h6 font-weight-bold text-success"
            >
              {{
                formatCurrency(
                  selectedPedido.totalAfecha
                )
              }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="bg-grey-lighten-4">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            @click="dialogs.view = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIÁLOGO DE CREACIÓN DE NUEVO PEDIDO -->
    <v-dialog
      v-model="dialogs.create"
      max-width="950"
      persistent
    >
      <v-card
        class="rounded-lg elevation-12 bg-grey-lighten-4"
      >
        <v-card-title
          class="bg-indigo-darken-4 text-white d-flex align-center py-2 px-3"
        >
          <v-avatar
            size="36"
            color="white"
            class="mr-3"
            variant="flat"
          >
            <v-icon color="indigo" size="20"
              >mdi-cart-plus</v-icon
            >
          </v-avatar>
          <h5
            class="text-h6 font-weight-bold text-white"
          >
            Nuevo Pedido de Venta
          </h5>
          <v-spacer />
          <v-btn
            icon
            size="small"
            color="white"
            variant="text"
            @click="closeCreateDialog()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          class="pa-4"
          style="
            max-height: 75vh;
            overflow-y: auto;
          "
        >
          <v-form ref="form" v-model="formValid">
            <v-row dense>
              <!-- DATOS PRINCIPALES DEL PEDIDO -->
              <v-col cols="12" md="6">
                <v-card
                  class="pa-4 h-100 border rounded-lg bg-white"
                  elevation="0"
                >
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo mb-3"
                  >
                    Información del Pedido
                  </div>

                  <v-autocomplete
                    v-model="newPedido.idCliente"
                    label="Cliente *"
                    :items="cmb.clientes"
                    density="compact"
                    variant="outlined"
                    :rules="[
                      (v) =>
                        !!v ||
                        'El cliente es requerido'
                    ]"
                    class="mb-3"
                    color="indigo"
                  />

                  <v-text-field
                    v-model="
                      newPedido.fechaEntregaSolicitada
                    "
                    label="Fecha Entrega Solicitada *"
                    type="date"
                    density="compact"
                    variant="outlined"
                    :rules="[
                      (v) =>
                        !!v ||
                        'La fecha de entrega es requerida'
                    ]"
                    class="mb-3"
                    color="indigo"
                  />

                  <v-checkbox
                    v-model="
                      newPedido.isSolicitudCredito
                    "
                    label="¿Solicita Crédito?"
                    color="indigo"
                    density="compact"
                    hide-details
                    class="mb-3"
                  />

                  <v-textarea
                    v-model="
                      newPedido.observaciones
                    "
                    label="Observaciones"
                    density="compact"
                    variant="outlined"
                    rows="2"
                    color="indigo"
                    class="mb-3"
                  />
                </v-card>
              </v-col>

              <!-- DATOS DE DESPACHO / UBICACIÓN -->
              <v-col cols="12" md="6">
                <v-card
                  class="pa-4 h-100 border rounded-lg bg-white"
                  elevation="0"
                >
                  <div
                    class="text-subtitle-2 font-weight-bold text-indigo mb-3"
                  >
                    Datos de Entrega y Despacho
                  </div>

                  <v-text-field
                    v-model="newPedido.enviarA"
                    label="Enviar A (Dirección de Despacho)"
                    density="compact"
                    variant="outlined"
                    prepend-inner-icon="mdi-map-marker"
                    class="mb-3"
                    color="indigo"
                  />

                  <v-text-field
                    v-model="newPedido.ubicacion"
                    label="Ubicación / Coordenadas"
                    density="compact"
                    variant="outlined"
                    prepend-inner-icon="mdi-crosshairs-gps"
                    class="mb-3"
                    color="indigo"
                  />

                  <div
                    class="text-caption text-grey-darken-1 italic"
                  >
                    <v-icon
                      size="x-small"
                      class="mr-1"
                      >mdi-information-outline</v-icon
                    >
                    Complete la información de
                    envío si requiere entrega a
                    domicilio o ruta.
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <!-- SECCIÓN AGREGAR PRODUCTOS -->
            <v-card
              class="pa-4 border rounded-lg bg-white mb-4"
            >
              <div
                class="text-subtitle-2 font-weight-bold text-indigo mb-3 d-flex align-center"
              >
                <v-icon size="small" class="mr-1"
                  >mdi-plus-box-outline</v-icon
                >
                Agregar Productos al Pedido
              </div>
              <v-row dense align="center">
                <v-col cols="12" md="5">
                  <v-autocomplete
                    v-model="
                      productForm.idProducto
                    "
                    label="Buscar Producto"
                    :items="cmb.productos"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="indigo"
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model.number="
                      productForm.cantidad
                    "
                    label="Cantidad"
                    type="number"
                    min="1"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="indigo"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="
                      productForm.observaciones
                    "
                    label="Observación (Item)"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="indigo"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="1"
                  class="d-flex justify-end"
                >
                  <v-btn
                    color="indigo"
                    @click="addProductToPedido"
                    variant="flat"
                    size="small"
                    prepend-icon="mdi-plus"
                  >
                    Agregar
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>

            <!-- TABLA DE ITEMS AGREGADOS -->
            <v-card
              class="border"
              rounded="lg"
              elevation="0"
            >
              <v-card-title
                class="text-subtitle-2 font-weight-bold py-2 bg-indigo-lighten-5 text-indigo d-flex justify-space-between align-center"
              >
                <span>Items del Pedido</span>
                <v-chip
                  size="x-small"
                  color="indigo"
                  variant="flat"
                  >{{
                    newPedido.detallePedido.length
                  }}
                  items</v-chip
                >
              </v-card-title>
              <v-table
                density="compact"
                class="elevation-0"
              >
                <thead>
                  <tr class="bg-grey-lighten-3">
                    <th
                      class="font-weight-bold text-caption"
                    >
                      Producto
                    </th>
                    <th
                      class="text-center font-weight-bold text-caption"
                    >
                      Cantidad
                    </th>
                    <th
                      class="text-right font-weight-bold text-caption"
                    >
                      Precio Unit. Estimado
                    </th>
                    <th
                      class="text-right font-weight-bold text-caption"
                    >
                      Importe Subtotal
                    </th>
                    <th
                      class="font-weight-bold text-caption"
                    >
                      Observaciones
                    </th>
                    <th
                      class="text-center font-weight-bold text-caption"
                      style="width: 80px"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(
                      item, idx
                    ) in newPedido.detallePedido"
                    :key="idx"
                  >
                    <td
                      class="text-caption font-weight-bold"
                    >
                      {{ item.nombre }}
                    </td>
                    <td
                      class="text-center text-caption font-weight-medium"
                    >
                      {{ item.cantidad }}
                    </td>
                    <td
                      class="text-right text-caption"
                    >
                      {{
                        formatCurrency(
                          item.precio
                        )
                      }}
                    </td>
                    <td
                      class="text-right text-caption font-weight-bold text-success"
                    >
                      {{
                        formatCurrency(
                          item.cantidad *
                            item.precio
                        )
                      }}
                    </td>
                    <td
                      class="text-caption text-grey italic"
                    >
                      {{
                        item.observaciones || '—'
                      }}
                    </td>
                    <td class="text-center">
                      <v-btn
                        icon
                        size="x-small"
                        color="error"
                        variant="text"
                        @click="
                          removeProductFromPedido(
                            idx
                          )
                        "
                      >
                        <v-icon
                          >mdi-trash-can-outline</v-icon
                        >
                      </v-btn>
                    </td>
                  </tr>
                  <tr
                    v-if="
                      newPedido.detallePedido
                        .length === 0
                    "
                  >
                    <td
                      colspan="6"
                      class="text-center text-grey text-caption py-4 italic"
                    >
                      Agregue productos desde el
                      panel de arriba para iniciar
                      su pedido.
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

            <!-- RESUMEN DE TOTAL -->
            <div
              class="d-flex justify-end align-center mt-4 pa-3 bg-white border rounded-lg"
            >
              <div
                class="text-subtitle-1 font-weight-bold mr-4 text-indigo"
              >
                Total Estimado del Pedido:
              </div>
              <div
                class="text-h6 font-weight-bold text-success"
              >
                {{
                  formatCurrency(totalNuevoPedido)
                }}
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions
          class="bg-grey-lighten-4 pa-3"
        >
          <v-spacer />
          <v-btn
            color="grey"
            variant="outlined"
            @click="closeCreateDialog()"
            :disabled="saving"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo"
            class="text-white"
            variant="flat"
            @click="savePedido()"
            :disabled="saving"
            :loading="saving"
          >
            Guardar Pedido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Alertas -->
    <v-snackbar
      v-model="alert.show"
      :color="alert.type"
      timeout="3000"
      location="top right"
    >
      {{ alert.message }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="alert.show = false"
          >Cerrar</v-btn
        >
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import RequestHttp from '@/services/requestHttp'
import { useStore } from '@/store'

export default {
  name: 'PedidosComp',

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getPedidos()
      vm.loadClientes()
      vm.loadEstados()
      vm.loadProductos()
    })
  },

  data() {
    return {
      requestHttp: new RequestHttp(),
      store: useStore(),
      loading: false,
      saving: false,
      formValid: false,

      search: {
        desde: null,
        hasta: null,
        idCliente: null,
        idEstadoActual: null,
        noPedido: null
      },

      cmb: {
        clientes: [],
        estados: [],
        productos: []
      },

      headers: [
        {
          title: 'Opciones',
          key: 'opc',
          align: 'center',
          sortable: false
        },
        {
          title: 'Nº Pedido',
          key: 'noPedido',
          align: 'center',
          sortable: true
        },
        {
          title: 'Ruta',
          key: 'rutaCliente',
          align: 'start',
          sortable: true
        },
        {
          title: 'Cliente',
          key: 'cliente',
          align: 'start',
          sortable: true
        },
        {
          title: 'Entrega Solicitada',
          key: 'fechaEntregaSolicitada',
          align: 'center',
          sortable: true
        },
        {
          title: 'Total',
          key: 'totalAfecha',
          align: 'end',
          sortable: true
        },
        {
          title: 'Fecha Registro',
          key: 'fechaRegistro',
          align: 'center',
          sortable: true
        },

        {
          title: 'Usuario Registro',
          key: 'usuarioRegistro',
          align: 'center',
          sortable: true
        },
        {
          title: 'Estado',
          key: 'estado',
          align: 'center',
          sortable: true
        },
      ],

      data: {
        pedidos: [],
        allProductsRaw: []
      },

      selectedPedido: null,

      newPedido: {
        idCliente: null,
        isSolicitudCredito: false,
        observaciones: '',
        enviarA: '',
        ubicacion: '',
        fechaEntregaSolicitada: null,
        detallePedido: []
      },

      productForm: {
        idProducto: null,
        cantidad: 1,
        observaciones: ''
      },

      dialogs: {
        view: false,
        create: false
      },

      alert: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },

  computed: {
    totalPedidosMonto() {
      return this.data.pedidos.reduce(
        (acc, item) =>
          acc + (item.totalAfecha || 0),
        0
      )
    },
    totalNuevoPedido() {
      return this.newPedido.detallePedido.reduce(
        (acc, item) =>
          acc + item.cantidad * item.precio,
        0
      )
    }
  },

  methods: {
    showAlert(msg, type = 'success') {
      this.alert.message = msg
      this.alert.type = type
      this.alert.show = true
    },

    clearFilters() {
      this.search = {
        desde: null,
        hasta: null,
        idCliente: null,
        idEstadoActual: null,
        noPedido: null
      }
      this.getPedidos()
    },

    async getPedidos() {
      this.loading = true
      const filterReq = {
        desde: this.search.desde
          ? new Date(this.search.desde)
          : null,
        hasta: this.search.hasta
          ? new Date(this.search.hasta)
          : null,
        idCliente: this.search.idCliente || null,
        idEstadoActual:
          this.search.idEstadoActual || null,
        noPedido: this.search.noPedido || null
      }

      try {
        const res =
          await this.requestHttp.getPedidos(
            filterReq
          )
        if (res.code === 200) {
          this.data.pedidos = res.data
        } else {
          this.showAlert(
            'No se pudieron cargar los pedidos',
            'error'
          )
        }
      } catch (e) {
        console.error(e)
        this.showAlert(
          'Ocurrió un error al obtener listado de pedidos',
          'error'
        )
      } finally {
        this.loading = false
      }
    },

    async loadClientes() {
      try {
        const clientsList =
          await this.requestHttp.getClientes()
        this.cmb.clientes = clientsList.map(
          (c) => ({
            title: c.nombre,
            value: c.idCliente
          })
        )
      } catch (e) {
        console.error('Error loading clients:', e)
      }
    },

    async loadEstados() {
      try {
        const res =
          await this.requestHttp.getPedidosEstados()
        if (res.code === 200) {
          this.cmb.estados = res.data.map(
            (e) => ({
              title: e.title,
              value: e.value
            })
          )
        }
      } catch (e) {
        console.error(
          'Error loading order states:',
          e
        )
      }
    },

    async loadProductos() {
      try {
        const res =
          await this.requestHttp.getProductos(
            null
          )
        if (res.code === 200) {
          this.data.allProductsRaw = res.data
          this.cmb.productos = res.data.map(
            (p) => ({
              title: p.nombre,
              value: p.idProducto
            })
          )
        }
      } catch (e) {
        console.error(
          'Error loading products:',
          e
        )
      }
    },

    getEstadoColor(idEstado) {
      const colors = {
        1: 'warning', // Pendiente
        2: 'info', // Atendido
        3: 'success', // Entregado
        4: 'error' // Cancelado
      }
      return colors[idEstado] || 'grey'
    },

    formatCurrency(val) {
      if (val === null || val === undefined)
        return 'C$ 0.00'
      return new Intl.NumberFormat('es-NI', {
        style: 'currency',
        currency: 'NIO'
      }).format(val)
    },

    formatDate(dateString) {
      if (!dateString) return '—'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    async viewPedidoDetail(item) {
      this.loading = true
      try {
        const res =
          await this.requestHttp.getPedidoById(
            item.idPedido
          )
        if (res.code === 200) {
          this.selectedPedido = res.data
          this.dialogs.view = true
        } else {
          this.showAlert(
            'No se pudieron obtener los detalles del pedido',
            'error'
          )
        }
      } catch (e) {
        console.error(e)
        this.showAlert(
          'Error al abrir detalle del pedido',
          'error'
        )
      } finally {
        this.loading = false
      }
    },

    openCreateDialog() {
      this.newPedido = {
        idCliente: null,
        isSolicitudCredito: false,
        observaciones: '',
        enviarA: '',
        ubicacion: '',
        fechaEntregaSolicitada: new Date(
          Date.now() + 86400000
        )
          .toISOString()
          .substr(0, 10), // default to tomorrow
        detallePedido: []
      }
      this.productForm = {
        idProducto: null,
        cantidad: 1,
        observaciones: ''
      }
      this.dialogs.create = true
    },

    closeCreateDialog() {
      this.dialogs.create = false
    },

    async addProductToPedido() {
      const formProdId =
        this.productForm.idProducto
      const formQty = Number(
        this.productForm.cantidad
      )

      if (!formProdId || formQty <= 0) {
        this.showAlert(
          'Seleccione un producto y cantidad válida',
          'warning'
        )
        return
      }

      let fullProduct = null
      try {
        // Fetch product to evaluate price
        const res =
          await this.requestHttp.getByIdProducto(
            formProdId
          )
        if (res) {
          fullProduct = res
        }
      } catch (e) {
        console.error(e)
        this.showAlert(
          'Error al obtener información del producto',
          'error'
        )
        return
      }

      if (!fullProduct) {
        this.showAlert(
          'No se encontró el producto',
          'error'
        )
        return
      }

      const existingItemIndex =
        this.newPedido.detallePedido.findIndex(
          (item) => item.idProducto === formProdId
        )
      let totalQty = formQty
      let mergedObservaciones =
        this.productForm.observaciones

      if (existingItemIndex !== -1) {
        const existingItem =
          this.newPedido.detallePedido[
            existingItemIndex
          ]
        totalQty += Number(existingItem.cantidad)
        mergedObservaciones = [
          existingItem.observaciones,
          this.productForm.observaciones
        ]
          .filter(Boolean)
          .join(', ')
      }

      let precioUnitario = fullProduct.precio
      if (
        fullProduct.esMayorista &&
        fullProduct.precioMayorista &&
        fullProduct.precioMayorista.length > 0
      ) {
        const matchingRange =
          fullProduct.precioMayorista.find(
            (pm) =>
              totalQty >= pm.minimo &&
              totalQty <= pm.maximo
          )
        if (matchingRange) {
          precioUnitario = matchingRange.precio
        } else {
          precioUnitario = fullProduct.precio
        }
      }

      if (existingItemIndex !== -1) {
        this.newPedido.detallePedido[
          existingItemIndex
        ].cantidad = totalQty
        this.newPedido.detallePedido[
          existingItemIndex
        ].precio = precioUnitario
        this.newPedido.detallePedido[
          existingItemIndex
        ].observaciones = mergedObservaciones
      } else {
        this.newPedido.detallePedido.push({
          idProducto: formProdId,
          nombre: fullProduct.nombre,
          cantidad: formQty,
          precio: precioUnitario,
          observaciones:
            this.productForm.observaciones
        })
      }

      this.productForm = {
        idProducto: null,
        cantidad: 1,
        observaciones: ''
      }
    },

    removeProductFromPedido(index) {
      this.newPedido.detallePedido.splice(
        index,
        1
      )
    },

    async savePedido() {
      const validate =
        await this.$refs.form.validate()
      if (!validate.valid) {
        this.showAlert(
          'Complete los campos obligatorios del pedido',
          'warning'
        )
        return
      }

      if (
        this.newPedido.detallePedido.length === 0
      ) {
        this.showAlert(
          'El pedido debe tener al menos un producto',
          'warning'
        )
        return
      }

      this.saving = true

      const reqData = {
        idAperturaCaja: null,
        idCliente: this.newPedido.idCliente,
        isSolicitudCredito:
          this.newPedido.isSolicitudCredito,
        observaciones:
          this.newPedido.observaciones || null,
        enviarA: this.newPedido.enviarA || null,
        usuarioRegistro:
          this.store.getNameUser() || 'Sistema',
        ubicacion:
          this.newPedido.ubicacion || null,
        fechaEntregaSolicitada: new Date(
          this.newPedido.fechaEntregaSolicitada
        ),
        detallePedido:
          this.newPedido.detallePedido.map(
            (item) => ({
              idProducto: item.idProducto,
              cantidad: item.cantidad,
              observaciones:
                item.observaciones || null
            })
          )
      }

      try {
        const res =
          await this.requestHttp.postPedido(
            reqData
          )
        if (res.code === 200) {
          this.showAlert(
            'Pedido guardado correctamente',
            'success'
          )
          this.closeCreateDialog()
          this.getPedidos()
        } else {
          this.showAlert(
            res.data?.msg ||
              'Error al guardar el pedido',
            'error'
          )
        }
      } catch (e) {
        console.error(e)
        this.showAlert(
          'Error al procesar la solicitud de guardado',
          'error'
        )
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.italic {
  font-style: italic;
}
</style>
