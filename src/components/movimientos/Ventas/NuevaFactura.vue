<template>
  <div>
    <v-dialog
      v-model="localShow"
      max-width="1150"
      persistent
    >
      <v-card
        elevation="12"
        rounded="xl"
        class="bg-grey-lighten-4 overflow-hidden"
      >
        <!-- Header del Diálogo -->
        <v-card-title
          class="bg-indigo-darken-4 d-flex align-center py-3 px-4"
        >
          <v-avatar
            size="36"
            color="white"
            class="mr-3"
            variant="flat"
          >
            <v-icon
              color="indigo-darken-4"
              size="22"
              >mdi-receipt-text-outline</v-icon
            >
          </v-avatar>
          <div>
            <div
              class="text-white font-weight-bold text-subtitle-1 lh-1"
            >
              {{ localTitle }}
            </div>
            <div
              class="text-indigo-lighten-4 text-caption"
            >
              {{
                localEdit
                  ? 'Modificación de factura registrada'
                  : 'Registro de nueva venta y facturación'
              }}
            </div>
          </div>
          <v-spacer />
          <v-chip
            v-if="localEdit && data.venta.noVenta"
            size="small"
            color="indigo-lighten-4"
            variant="flat"
            class="text-indigo-darken-4 font-weight-bold mr-2"
          >
            Nº Factura: {{ data.venta.noVenta }}
          </v-chip>
          <v-btn
            icon
            size="small"
            color="white"
            variant="text"
            @click="closeDialog()"
          >
            <v-icon size="22">mdi-close</v-icon>
            <v-tooltip
              activator="parent"
              location="top"
              text="Cerrar"
            />
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form
            validate-on="invalid-input"
            ref="form"
          >
            <v-row dense>
              <!-- Panel Izquierdo: Datos Generales de la Venta -->
              <v-col cols="12" md="4">
                <v-card
                  class="pa-4 bg-white border"
                  rounded="lg"
                  elevation="0"
                >
                  <div
                    class="d-flex align-center mb-3"
                  >
                    <v-icon
                      color="indigo-darken-3"
                      size="20"
                      class="mr-2"
                      >mdi-clipboard-text-outline</v-icon
                    >
                    <span
                      class="text-subtitle-2 font-weight-bold text-grey-darken-3"
                    >
                      Datos Generales
                    </span>
                  </div>

                  <!-- Alerta si NO tiene caja activa -->
                  <v-alert
                    v-if="!data.sesionCaja.loading && !data.sesionCaja.tieneAperturaActiva && !localEdit"
                    type="warning"
                    variant="tonal"
                    density="comfortable"
                    rounded="lg"
                    class="mb-3 border border-warning"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="warning-lighten-4" size="34" class="mr-2">
                        <v-icon color="warning-darken-3" size="20">mdi-cash-register</v-icon>
                      </v-avatar>
                    </template>
                    <div class="font-weight-bold text-caption text-warning-darken-4">
                      Sin Apertura de Caja Activa
                    </div>
                    <div class="text-caption text-grey-darken-3" style="font-size: 11px !important; line-height: 1.3;">
                      El usuario <strong>@{{ data.sesionCaja.usuario }}</strong> no posee una apertura de caja activa. No es posible registrar facturas sin una sesión de caja.
                    </div>
                  </v-alert>

                  <!-- Visualización de Cajero y Bodega en Sesión Activa -->
                  <v-card
                    v-else-if="data.sesionCaja.tieneAperturaActiva"
                    variant="flat"
                    class="pa-3 mb-3 border rounded-lg bg-indigo-lighten-5"
                  >
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="text-caption font-weight-bold text-indigo-darken-4 d-flex align-center">
                        <v-icon size="16" class="mr-1" color="indigo-darken-3">mdi-cash-register</v-icon>
                        Sesión: {{ data.sesionCaja.cajaNombre || data.sesionCaja.cajaCodigo || 'Caja' }}
                      </div>
                      <v-chip
                        size="x-small"
                        color="success"
                        variant="flat"
                        class="font-weight-bold"
                      >
                        <v-icon start size="10">mdi-circle</v-icon>
                        Activa
                      </v-chip>
                    </div>

                    <div class="d-flex align-center justify-space-between flex-wrap ga-2">
                      <!-- Cajero con Avatar, Nombre y @username -->
                      <div class="d-flex align-center">
                        <v-avatar
                          size="38"
                          color="indigo-darken-4"
                          class="text-white font-weight-bold mr-2 elevation-1"
                        >
                          <span v-if="data.sesionCaja.nombre">{{ data.sesionCaja.nombre.charAt(0).toUpperCase() }}</span>
                          <v-icon v-else size="20">mdi-account</v-icon>
                        </v-avatar>
                        <div>
                          <div class="text-subtitle-2 font-weight-bold text-grey-darken-4 lh-1">
                            {{ data.sesionCaja.nombre || data.sesionCaja.usuario || 'Cajero' }}
                          </div>
                          <div
                            class="text-caption text-grey-darken-1 font-weight-medium"
                            style="font-size: 11px !important; line-height: 1.2;"
                          >
                            @{{ data.sesionCaja.usuario || '—' }}
                          </div>
                        </div>
                      </div>

                      <!-- Bodega Asociada -->
                      <div class="text-right">
                        <div class="text-caption text-grey-darken-2 font-weight-medium" style="font-size: 10px;">
                          Bodega
                        </div>
                        <v-chip
                          size="small"
                          color="blue-grey-darken-3"
                          variant="tonal"
                          class="font-weight-bold"
                        >
                          <v-icon start size="14">mdi-store-outline</v-icon>
                          {{ data.sesionCaja.bodegaNombre || 'Sin Bodega' }}
                        </v-chip>
                      </div>
                    </div>
                  </v-card>

                  <v-row dense>
                    <!-- No. Factura (solo en modo edición) -->
                    <v-col
                      cols="12"
                      v-if="localEdit"
                    >
                      <v-text-field
                        v-model="
                          data.venta.noVenta
                        "
                        prepend-inner-icon="mdi-tag-outline"
                        density="compact"
                        variant="outlined"
                        hide-details
                        label="Nº Factura"
                        readonly
                        bg-color="grey-lighten-4"
                      />
                    </v-col>

                    <!-- Tipo de Venta -->
                    <v-col cols="12">
                      <label
                        class="text-caption font-weight-bold text-grey-darken-2 d-block mb-1"
                      >
                        Tipo de Venta *
                      </label>
                      <v-autocomplete
                        :rules="data.rules.rule"
                        v-model="
                          data.venta.idTipoVenta
                        "
                        :items="data.tipoVenta"
                        prepend-inner-icon="mdi-format-list-bulleted"
                        density="compact"
                        variant="outlined"
                        hide-details
                        single-line
                        :menu-props="{ closeOnContentClick: true }"
                        placeholder="Seleccione tipo de venta..."
                        color="indigo"
                        class="fixed-autocomplete"
                      />
                    </v-col>

                    <!-- Cliente -->
                    <v-col cols="12" class="mt-2">
                      <label
                        class="text-caption font-weight-bold text-grey-darken-2 d-block mb-1"
                      >
                        Cliente *
                      </label>
                      <v-autocomplete
                        :rules="data.rules.rule"
                        v-model="
                          data.venta.idCliente
                        "
                        density="compact"
                        variant="outlined"
                        hide-details
                        single-line
                        :menu-props="{ closeOnContentClick: true }"
                        :items="data.clientes"
                        clearable
                        color="indigo"
                        class="fixed-autocomplete"
                      >
                        <!-- Item en la lista desplegable con indicador de crédito -->
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props" class="py-2">
                            <template v-slot:title>
                              <div class="d-flex align-center justify-space-between">
                                <span class="font-weight-medium text-body-2">
                                  {{ item.raw.title || ((item.raw.codigo ? item.raw.codigo + ' - ' : '') + item.raw.nombre) }}
                                </span>
                                <v-chip
                                  size="x-small"
                                  :color="(item.raw.esTieneCredito || item.raw.EsTieneCredito || item.raw.creditoPermitido || item.raw.esCredito || item.raw.tieneCredito || item.raw.credito) ? 'success' : 'grey-lighten-2'"
                                  variant="flat"
                                  :class="(item.raw.esTieneCredito || item.raw.EsTieneCredito || item.raw.creditoPermitido || item.raw.esCredito || item.raw.tieneCredito || item.raw.credito) ? 'font-weight-bold ml-2' : 'text-grey-darken-2 font-weight-medium ml-2'"
                                >
                                  <v-icon start size="12" :color="(item.raw.esTieneCredito || item.raw.EsTieneCredito || item.raw.creditoPermitido || item.raw.esCredito || item.raw.tieneCredito || item.raw.credito) ? 'white' : 'grey-darken-2'">
                                    {{ (item.raw.esTieneCredito || item.raw.EsTieneCredito || item.raw.creditoPermitido || item.raw.esCredito || item.raw.tieneCredito || item.raw.credito) ? 'mdi-check-circle' : 'mdi-cash' }}
                                  </v-icon>
                                  {{ (item.raw.esTieneCredito || item.raw.EsTieneCredito || item.raw.creditoPermitido || item.raw.esCredito || item.raw.tieneCredito || item.raw.credito) ? 'Crédito Autorizado' : 'Solo Contado' }}
                                </v-chip>
                              </div>
                            </template>
                          </v-list-item>
                        </template>

                        <!-- Item seleccionado con truncamiento estricto -->
                        <template v-slot:selection="{ item }">
                          <div class="d-flex align-center overflow-hidden w-100" style="min-width: 0;">
                            <span class="font-weight-medium text-truncate mr-2" style="min-width: 0; flex: 1 1 auto;">
                              {{ item.raw.title || ((item.raw.codigo ? item.raw.codigo + ' - ' : '') + item.raw.nombre) }}
                            </span>
                          </div>
                        </template>

                        <template
                          v-slot:prepend-inner
                        >
                          <v-btn
                            icon
                            variant="text"
                            size="x-small"
                            @click="getClientes"
                            class="refresh-btn"
                          >
                            <v-icon
                              color="indigo"
                              size="18"
                              >mdi-refresh</v-icon
                            >
                            <v-tooltip
                              activator="parent"
                              location="top"
                              >Actualizar lista de
                              clientes</v-tooltip
                            >
                          </v-btn>
                        </template>
                      </v-autocomplete>

                      <!-- Barra rápida de estado de crédito y acción para ver detalle -->
                      <div v-if="data.venta.idCliente" class="d-flex align-center justify-space-between mt-1 px-1">
                        <div class="d-flex align-center text-caption" :class="clienteTieneCredito ? 'text-green-darken-3 font-weight-medium' : 'text-amber-darken-4 font-weight-medium'">
                          <v-icon size="14" class="mr-1">
                            {{ clienteTieneCredito ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
                          </v-icon>
                          <span>{{ clienteTieneCredito ? 'Crédito habilitado' : 'Cliente sin crédito' }}</span>
                        </div>
                        
                        <v-btn
                          size="x-small"
                          variant="tonal"
                          color="indigo-darken-3"
                          prepend-icon="mdi-card-account-details-outline"
                          class="text-none font-weight-bold px-2 py-0"
                          @click="verDetalleCredito(data.venta.idCliente)"
                        >
                          Ver detalle crédito
                        </v-btn>
                      </div>
                    </v-col>

                    <!-- Condición de Pago: Tabs de selección rápida y 100% responsivas con validación de crédito -->
                    <v-col cols="12" class="mt-2">
                      <label
                        class="text-caption font-weight-bold text-grey-darken-2 d-block mb-1"
                      >
                        Condición de Pago *
                      </label>
                      <div
                        class="condition-selector-container"
                      >
                        <button
                          type="button"
                          class="condition-tab-btn"
                          :class="{
                            active:
                              data.isCredito ===
                              'contado'
                          }"
                          @click="
                            data.isCredito =
                              'contado'
                          "
                        >
                          <v-icon
                            size="18"
                            class="mr-1"
                            >mdi-cash</v-icon
                          >
                          <span>Contado</span>
                        </button>
                        <button
                          type="button"
                          class="condition-tab-btn"
                          :class="{
                            active:
                              data.isCredito ===
                              'credito',
                            disabled: !clienteTieneCredito
                          }"
                          :disabled="!clienteTieneCredito"
                          @click="seleccionarCredito()"
                        >
                          <v-icon
                            size="18"
                            class="mr-1"
                            >mdi-credit-card-clock-outline</v-icon
                          >
                          <span>Crédito</span>
                          <v-tooltip v-if="!clienteTieneCredito" activator="parent" location="top">
                            El cliente seleccionado no tiene crédito permitido
                          </v-tooltip>
                        </button>
                      </div>
                    </v-col>

                    <!-- Observaciones -->
                    <v-col cols="12" class="mt-2">
                      <label
                        class="text-caption font-weight-bold text-grey-darken-2 d-block mb-1"
                      >
                        Observaciones
                      </label>
                      <v-textarea
                        v-model="
                          data.venta.observaciones
                        "
                        density="compact"
                        variant="outlined"
                        placeholder="Notas o detalles adicionales..."
                        rows="3"
                        auto-grow
                        hide-details
                        color="indigo"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- Panel Derecho: Detalle de Productos y Resumen -->
              <v-col cols="12" md="8">
                <v-card
                  class="pa-4 bg-white border d-flex flex-column h-100"
                  rounded="lg"
                  elevation="0"
                >
                  <div
                    class="d-flex align-center justify-space-between mb-3"
                  >
                    <div
                      class="d-flex align-center"
                    >
                      <v-icon
                        color="indigo-darken-3"
                        size="20"
                        class="mr-2"
                        >mdi-cart-outline</v-icon
                      >
                      <span
                        class="text-subtitle-2 font-weight-bold text-grey-darken-3"
                      >
                        Detalle de Productos
                      </span>
                    </div>
                    <span
                      class="text-caption text-grey"
                    >
                      {{ data.items.length }}
                      {{
                        data.items.length === 1
                          ? 'producto'
                          : 'productos'
                      }}
                    </span>
                  </div>

                  <!-- Fila de Selección y Adición Rápida de Producto con Previsualización de Stock -->
                  <div
                    class="bg-grey-lighten-4 pa-3 rounded-lg border mb-3"
                  >
                    <v-row dense align="center">
                      <v-col cols="12" sm="8">
                        <v-autocomplete
                          v-model="
                            data.producto
                              .idProducto
                          "
                          :items="data.productos"
                          item-title="title"
                          item-value="idProducto"
                          prepend-inner-icon="mdi-magnify"
                          density="compact"
                          variant="outlined"
                          hide-details
                          single-line
                          :menu-props="{ closeOnContentClick: true }"
                          clearable
                          label="Producto"
                          placeholder="Buscar por código o nombre..."
                          color="indigo"
                          bg-color="white"
                          class="fixed-autocomplete"
                        >
                          <!-- Slot de Item en el Dropdown con Stock visible -->
                          <template
                            v-slot:item="{
                              props,
                              item
                            }"
                          >
                            <v-list-item
                              v-bind="props"
                              class="py-2"
                            >
                              <template
                                v-slot:title
                              >
                                <div
                                  class="d-flex align-center justify-space-between"
                                >
                                  <span
                                    class="font-weight-medium text-body-2"
                                  >
                                    {{
                                      item.raw
                                        .codigo
                                        ? item.raw
                                            .codigo +
                                          ' - '
                                        : ''
                                    }}{{
                                      item.raw
                                        .nombre
                                    }}
                                  </span>
                                  <v-chip
                                    size="x-small"
                                    :color="
                                      item.raw
                                        .cantidadTotal >
                                      10
                                        ? 'success'
                                        : item.raw
                                              .cantidadTotal >
                                            0
                                          ? 'orange-darken-3'
                                          : 'error'
                                    "
                                    variant="flat"
                                    class="font-weight-bold ml-2"
                                  >
                                    Stock:
                                    {{
                                      item.raw
                                        .cantidadTotal
                                    }}
                                  </v-chip>
                                </div>
                              </template>
                              <template
                                v-slot:subtitle
                              >
                                <div
                                  class="d-flex align-center text-caption text-grey-darken-1 mt-1"
                                >
                                  <span
                                    class="mr-3"
                                    >Precio:
                                    <strong>{{
                                      formatedCurrency(
                                        item.raw
                                          .precio,
                                        data
                                          .fornates
                                          .nio
                                      )
                                    }}</strong></span
                                  >
                                  <v-chip
                                    v-if="
                                      item.raw
                                        .esMayorista
                                    "
                                    size="x-small"
                                    color="indigo-lighten-4"
                                    variant="flat"
                                    class="text-indigo-darken-4 font-weight-bold"
                                  >
                                    Mayorista
                                    Disp.
                                  </v-chip>
                                </div>
                              </template>
                            </v-list-item>
                          </template>

                          <!-- Slot de Selección -->
                          <template
                            v-slot:selection="{
                              item
                            }"
                          >
                            <div
                              class="d-flex align-center overflow-hidden w-100"
                              style="min-width: 0;"
                            >
                              <span
                                class="font-weight-medium text-truncate"
                                style="min-width: 0; flex: 1 1 auto;"
                              >
                                {{
                                  item.raw.codigo
                                    ? item.raw
                                        .codigo +
                                      ' - '
                                    : ''
                                }}{{
                                  item.raw.nombre
                                }}
                              </span>
                            </div>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="7" sm="2">
                        <v-text-field
                          v-model="
                            data.producto.cantidad
                          "
                          prepend-inner-icon="mdi-numeric"
                          density="compact"
                          variant="outlined"
                          hide-details
                          label="Cant."
                          type="number"
                          step="0.0001"
                          min="0.0001"
                          color="indigo"
                          bg-color="white"
                          @keyup.enter="
                            addProducts()
                          "
                        />
                      </v-col>
                      <v-col
                        cols="5"
                        sm="2"
                        class="d-flex align-center justify-end"
                      >
                        <v-btn
                          color="indigo-darken-3"
                          variant="flat"
                          block
                          size="small"
                          @click="addProducts()"
                          prepend-icon="mdi-plus"
                          class="font-weight-bold text-none py-4"
                        >
                          Agregar
                        </v-btn>
                      </v-col>
                    </v-row>
                    <transition
                      name="slide-y-transition"
                    >
                      <AlertComp
                        :show="data.alert.show"
                        :type="data.alert.type"
                        :message="
                          data.alert.message
                        "
                        class="mt-2"
                      />
                    </transition>
                  </div>

                  <!-- Tabla de Productos en Factura con Precios Mayoristas e Impuestos -->
                  <div
                    class="table-container mb-3 flex-grow-1 border rounded-lg overflow-hidden"
                  >
                    <v-data-table
                      density="compact"
                      :headers="data.headers"
                      :items="data.items"
                      hide-default-footer
                      :items-per-page="100"
                      height="200px"
                      fixed-header
                      class="product-table"
                    >
                      <template
                        v-slot:item.opc="{ item }"
                      >
                        <v-btn
                          icon
                          size="x-small"
                          color="error"
                          variant="text"
                          @click="
                            deleteProduct(item)
                          "
                        >
                          <v-icon size="18"
                            >mdi-trash-can-outline</v-icon
                          >
                          <v-tooltip
                            activator="parent"
                            location="top"
                            >Eliminar</v-tooltip
                          >
                        </v-btn>
                      </template>
                      <template
                        v-slot:item.producto="{
                          item
                        }"
                      >
                        <div>
                          <div
                            class="font-weight-medium text-body-2 text-grey-darken-3"
                          >
                            {{
                              item.codigo
                                ? item.codigo +
                                  ' - '
                                : ''
                            }}{{ item.producto }}
                          </div>
                          <!-- Badge de Precio Mayorista si fue aplicado -->
                          <div
                            v-if="
                              item.esMayorista
                            "
                            class="mt-1"
                          >
                            <v-chip
                              size="x-small"
                              color="orange-darken-4"
                              variant="flat"
                              class="font-weight-bold"
                            >
                              <v-icon
                                size="12"
                                class="mr-1"
                                >mdi-tag-outline</v-icon
                              >
                              Mayorista
                              {{
                                item.rangoMayorista
                              }}
                            </v-chip>
                          </div>
                        </div>
                      </template>
                      <template
                        v-slot:item.cantidad="{
                          item
                        }"
                      >
                        <div class="d-flex align-center justify-center quantity-stepper">
                          <v-btn
                            icon
                            size="x-small"
                            variant="flat"
                            color="grey-lighten-3"
                            class="quantity-btn"
                            :disabled="Number(item.cantidad) <= 0.0001"
                            @click.stop="decrementarCantidad(item)"
                          >
                            <v-icon size="12" color="grey-darken-3">mdi-minus</v-icon>
                            <v-tooltip activator="parent" location="top">Disminuir</v-tooltip>
                          </v-btn>
                          <input
                            type="number"
                            step="0.0001"
                            min="0.0001"
                            :value="item.cantidad"
                            @change="onCantidadInputChange(item, $event)"
                            @click.stop
                            class="quantity-input mx-1 text-center font-weight-bold"
                          />
                          <v-btn
                            icon
                            size="x-small"
                            variant="flat"
                            color="grey-lighten-3"
                            class="quantity-btn"
                            @click.stop="incrementarCantidad(item)"
                          >
                            <v-icon size="12" color="grey-darken-3">mdi-plus</v-icon>
                            <v-tooltip activator="parent" location="top">Aumentar</v-tooltip>
                          </v-btn>
                        </div>
                      </template>
                      <template
                        v-slot:item.costoUnitario="{
                          item
                        }"
                      >
                        <span
                          class="text-body-2 font-weight-medium"
                        >
                          {{
                            formatedCurrency(
                              item.costoUnitario,
                              data.fornates.nio
                            )
                          }}
                        </span>
                      </template>
                      <template
                        v-slot:item.impuesto="{
                          item
                        }"
                      >
                        <div
                          class="text-caption text-right"
                        >
                          <span
                            v-if="
                              item.montoImpuesto >
                              0
                            "
                            class="text-indigo-darken-3 font-weight-medium"
                          >
                            {{
                              formatedCurrency(
                                item.montoImpuesto,
                                data.fornates.nio
                              )
                            }}
                            <small
                              class="text-grey"
                              >({{
                                item.porcentajeImpuesto
                              }}%)</small
                            >
                          </span>
                          <span
                            v-else
                            class="text-grey"
                            >Exento</span
                          >
                        </div>
                      </template>
                      <template
                        v-slot:item.subTotal="{
                          item
                        }"
                      >
                        <span
                          class="font-weight-bold text-body-2 text-indigo-darken-3"
                        >
                          {{
                            formatedCurrency(
                              item.subTotal,
                              data.fornates.nio
                            )
                          }}
                        </span>
                      </template>
                      <template v-slot:no-data>
                        <div
                          class="py-6 text-center text-grey"
                        >
                          <v-icon
                            size="32"
                            color="grey-lighten-1"
                            class="mb-1"
                            >mdi-cart-off</v-icon
                          >
                          <div
                            class="text-caption"
                          >
                            No se han agregado
                            productos a la venta
                          </div>
                        </div>
                      </template>
                    </v-data-table>
                  </div>

                  <!-- Resumen Financiero Completo: Subtotal, Impuestos y Total -->
                  <div
                    class="bg-indigo-lighten-5 pa-3 rounded-lg border border-indigo-lighten-4 mt-auto"
                  >
                    <div
                      class="d-flex justify-space-between align-center mb-1"
                    >
                      <span
                        class="text-caption text-grey-darken-2 font-weight-medium"
                        >Sub Total (Neto):</span
                      >
                      <span
                        class="text-body-2 font-weight-bold text-grey-darken-3"
                      >
                        {{
                          formatedCurrency(
                            data.factura.subTotal,
                            data.fornates.nio
                          )
                        }}
                      </span>
                    </div>
                    <div
                      class="d-flex justify-space-between align-center mb-1"
                      v-if="
                        data.factura
                          .totalImpuestos > 0
                      "
                    >
                      <span
                        class="text-caption text-indigo-darken-3 font-weight-medium"
                        >Impuestos (IVA):</span
                      >
                      <span
                        class="text-body-2 font-weight-bold text-indigo-darken-3"
                      >
                        {{
                          formatedCurrency(
                            data.factura
                              .totalImpuestos,
                            data.fornates.nio
                          )
                        }}
                      </span>
                    </div>
                    <v-divider
                      class="my-1 border-indigo-lighten-3"
                    />
                    <div
                      class="d-flex justify-space-between align-center"
                    >
                      <span
                        class="text-subtitle-2 font-weight-bold text-indigo-darken-4"
                        >TOTAL FACTURA:</span
                      >
                      <span
                        class="text-h6 font-weight-black text-indigo-darken-4"
                      >
                        {{
                          formatedCurrency(
                            data.factura.total,
                            data.fornates.nio
                          )
                        }}
                      </span>
                    </div>
                  </div>
                  <transition
                    name="slide-y-transition"
                  >
                    <AlertComp
                      :show="data.alert.show2"
                      :type="data.alert.type"
                      :message="
                        data.alert.message
                      "
                      class="mt-2"
                    />
                  </transition>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <!-- Footer de Acciones -->
        <v-divider />
        <v-card-actions
          class="px-4 py-3 bg-white justify-end"
        >
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            size="small"
            @click="closeDialog()"
            class="text-none px-4 mr-2"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="indigo-darken-4"
            variant="flat"
            size="small"
            @click="guardarFactura()"
            :disabled="data.contDisableBtn || (!localEdit && !data.sesionCaja.tieneAperturaActiva)"
            prepend-icon="mdi-content-save-outline"
            class="text-none px-6 font-weight-bold"
            elevation="2"
          >
            <template v-if="data.contDisableBtn">
              <v-progress-circular
                color="white"
                indeterminate
                :size="18"
                :width="2"
                class="mr-2"
              />
              <span>Guardando...</span>
            </template>
            <template v-else>
              <span>{{
                localEdit
                  ? 'Actualizar Factura'
                  : 'Registrar Venta'
              }}</span>
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Modal Rápido: Detalle de Crédito del Cliente -->
      <v-dialog
        v-model="data.dialogCredito.show"
        max-width="500px"
        persistent
        scrollable
      >
        <v-card class="rounded-xl overflow-hidden shadow-2xl border">
          <!-- Header -->
          <v-card-title class="bg-indigo-darken-3 text-white px-4 py-3 d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon size="22" class="mr-2">mdi-card-account-details-outline</v-icon>
              <div>
                <div class="text-subtitle-1 font-weight-bold leading-tight">Estado y Detalle de Crédito</div>
                <div class="text-caption text-indigo-lighten-4">Consulta en tiempo real del cliente</div>
              </div>
            </div>
            <v-btn
              icon
              variant="text"
              color="white"
              size="small"
              @click="data.dialogCredito.show = false"
            >
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <!-- Content -->
          <v-card-text class="pa-4 bg-grey-lighten-5">
            <!-- Loading -->
            <div v-if="data.dialogCredito.loading" class="text-center py-8">
              <v-progress-circular indeterminate color="indigo-darken-3" size="48" class="mb-3" />
              <div class="text-body-2 font-weight-medium text-grey-darken-2">Consultando detalle de crédito...</div>
            </div>

            <!-- Error -->
            <v-alert
              v-else-if="data.dialogCredito.error"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-3 rounded-lg"
            >
              {{ data.dialogCredito.error }}
            </v-alert>

            <!-- Datos de Crédito -->
            <div v-else-if="data.dialogCredito.data" class="d-flex flex-column gap-3">
              <!-- Nombre del Cliente -->
              <v-card class="pa-3 bg-white border rounded-lg" elevation="0">
                <div class="text-caption text-grey font-weight-bold text-uppercase">Cliente</div>
                <div class="text-body-1 font-weight-bold text-indigo-darken-4">
                  {{ data.dialogCredito.data.nombre || (clienteSeleccionado ? clienteSeleccionado.title : 'Cliente') }}
                </div>
                <div v-if="data.dialogCredito.data.codigo || (clienteSeleccionado && clienteSeleccionado.codigo)" class="text-caption text-grey-darken-1">
                  Código: {{ data.dialogCredito.data.codigo || clienteSeleccionado.codigo }}
                </div>
              </v-card>

              <!-- Tarjetas de Métricas de Crédito -->
              <v-row dense class="mt-1">
                <!-- Límite de Crédito -->
                <v-col cols="6">
                  <v-card class="pa-3 bg-white border rounded-lg h-100" elevation="0">
                    <div class="d-flex align-center text-caption text-grey-darken-1 mb-1">
                      <v-icon size="16" color="indigo" class="mr-1">mdi-credit-card-outline</v-icon>
                      <span>Límite Crédito</span>
                    </div>
                    <div class="text-subtitle-1 font-weight-bold text-grey-darken-3">
                      <span v-if="data.dialogCredito.data.esCreditoIlimitado || data.dialogCredito.data.EsCreditoIlimitado" class="text-indigo">
                        Ilimitado
                      </span>
                      <span v-else>
                        {{ formatedCurrency(data.dialogCredito.data.limiteCredito ?? data.dialogCredito.data.LimiteCredito ?? 0, data.fornates.nio) }}
                      </span>
                    </div>
                  </v-card>
                </v-col>

                <!-- Saldo Utilizado / Deuda -->
                <v-col cols="6">
                  <v-card class="pa-3 bg-white border rounded-lg h-100" elevation="0">
                    <div class="d-flex align-center text-caption text-grey-darken-1 mb-1">
                      <v-icon size="16" color="orange-darken-3" class="mr-1">mdi-clock-alert-outline</v-icon>
                      <span>Crédito Usado</span>
                    </div>
                    <div class="text-subtitle-1 font-weight-bold text-orange-darken-4">
                      {{ formatedCurrency(data.dialogCredito.data.creditoUsado ?? data.dialogCredito.data.CreditoUsado ?? data.dialogCredito.data.saldoUtilizado ?? data.dialogCredito.data.SaldoUtilizado ?? 0, data.fornates.nio) }}
                    </div>
                  </v-card>
                </v-col>

                <!-- Saldo Disponible -->
                <v-col cols="12" class="mt-1">
                  <v-card 
                    class="pa-3 border rounded-lg" 
                    :class="(getSaldoDisponibleCredito(data.dialogCredito.data) > 0) ? 'bg-green-lighten-5 border-green' : 'bg-red-lighten-5 border-red'"
                    elevation="0"
                  >
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-caption font-weight-bold" :class="(getSaldoDisponibleCredito(data.dialogCredito.data) > 0) ? 'text-green-darken-4' : 'text-red-darken-4'">
                          Crédito Disponible
                        </div>
                        <div class="text-h6 font-weight-black" :class="(getSaldoDisponibleCredito(data.dialogCredito.data) > 0) ? 'text-green-darken-3' : 'text-red-darken-3'">
                          <span v-if="data.dialogCredito.data.esCreditoIlimitado || data.dialogCredito.data.EsCreditoIlimitado">
                            Ilimitado
                          </span>
                          <span v-else>
                            {{ formatedCurrency(getSaldoDisponibleCredito(data.dialogCredito.data), data.fornates.nio) }}
                          </span>
                        </div>
                      </div>
                      <v-chip 
                        size="small" 
                        :color="(getSaldoDisponibleCredito(data.dialogCredito.data) > 0) ? 'success' : 'error'"
                        variant="flat"
                        class="font-weight-bold"
                      >
                        {{ (getSaldoDisponibleCredito(data.dialogCredito.data) > 0) ? 'Línea Disponible' : 'Límite Excedido' }}
                      </v-chip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Detalles de Plazo y Facturas Pendientes -->
              <v-card class="pa-3 bg-white border rounded-lg mt-1" elevation="0">
                <div class="d-flex align-center justify-space-between py-1 border-b">
                  <span class="text-caption text-grey-darken-1">Tipo de Crédito:</span>
                  <span class="text-caption font-weight-bold text-grey-darken-3">
                    {{ (data.dialogCredito.data.esCreditoMensual || data.dialogCredito.data.EsCreditoMensual) ? 'Crédito Mensual' : 'Por Días' }}
                  </span>
                </div>
                <div class="d-flex align-center justify-space-between py-1 border-b">
                  <span class="text-caption text-grey-darken-1">Días de Crédito Autorizados:</span>
                  <span class="text-caption font-weight-bold text-grey-darken-3">
                    {{ data.dialogCredito.data.diasCredito ?? data.dialogCredito.data.DiasCredito ?? '—' }} días
                  </span>
                </div>
                <div class="d-flex align-center justify-space-between py-1">
                  <span class="text-caption text-grey-darken-1">Cuentas por Cobrar Pendientes:</span>
                  <span class="text-caption font-weight-bold text-grey-darken-3">
                    {{ data.dialogCredito.data.cuentasPorCobrarPendientes ?? data.dialogCredito.data.CuentasPorCobrarPendientes ?? 0 }} pendientes
                  </span>
                </div>
              </v-card>

              <!-- Alerta de Comparativa y Bloqueo de Sobregiro -->
              <div v-if="data.factura.total > 0" class="mt-1">
                <v-card
                  v-if="data.factura.total > getSaldoDisponibleCredito(data.dialogCredito.data)"
                  class="pa-3 bg-red-lighten-5 border border-red-lighten-2 rounded-lg"
                  elevation="0"
                >
                  <div class="d-flex align-center text-red-darken-4 font-weight-bold mb-2">
                    <v-icon color="red-darken-3" size="20" class="mr-1">mdi-alert-octagon</v-icon>
                    <span>Venta Bloqueada: Límite de Crédito Excedido</span>
                  </div>

                  <div class="d-flex align-center justify-space-between py-1 border-b border-red-lighten-4">
                    <span class="text-caption text-grey-darken-2">Total de esta Venta:</span>
                    <span class="text-caption font-weight-bold text-grey-darken-3">
                      {{ formatedCurrency(data.factura.total, data.fornates.nio) }}
                    </span>
                  </div>

                  <div class="d-flex align-center justify-space-between py-1 border-b border-red-lighten-4">
                    <span class="text-caption text-grey-darken-2">Crédito Disponible:</span>
                    <span class="text-caption font-weight-bold text-grey-darken-3">
                      {{ formatedCurrency(getSaldoDisponibleCredito(data.dialogCredito.data), data.fornates.nio) }}
                    </span>
                  </div>

                  <div class="d-flex align-center justify-space-between py-1 pt-2">
                    <span class="text-caption font-weight-bold text-red-darken-4">Monto Excedente (Sobregiro):</span>
                    <span class="text-subtitle-2 font-weight-black text-red-darken-4">
                      + {{ formatedCurrency(data.factura.total - getSaldoDisponibleCredito(data.dialogCredito.data), data.fornates.nio) }}
                    </span>
                  </div>

                  <div class="text-caption text-red-darken-4 mt-2 bg-white pa-2 rounded border border-red-lighten-3">
                    <v-icon size="14" color="red" class="mr-1">mdi-information</v-icon>
                    No se puede registrar esta factura a crédito. Debe reducir productos o cambiar la condición de pago a <strong>Contado</strong>.
                  </div>
                </v-card>

                <v-card
                  v-else
                  class="pa-3 bg-green-lighten-5 border border-green-lighten-2 rounded-lg"
                  elevation="0"
                >
                  <div class="d-flex align-center text-green-darken-4 font-weight-bold mb-1">
                    <v-icon color="green-darken-3" size="20" class="mr-1">mdi-check-circle</v-icon>
                    <span>Crédito Suficiente para la Venta</span>
                  </div>
                  <div class="d-flex align-center justify-space-between py-1 border-b border-green-lighten-4">
                    <span class="text-caption text-grey-darken-2">Total de la Venta:</span>
                    <span class="text-caption font-weight-bold text-grey-darken-3">
                      {{ formatedCurrency(data.factura.total, data.fornates.nio) }}
                    </span>
                  </div>
                  <div class="d-flex align-center justify-space-between py-1">
                    <span class="text-caption text-grey-darken-2">Restante tras la Venta:</span>
                    <span class="text-caption font-weight-bold text-green-darken-4">
                      {{ formatedCurrency(getSaldoDisponibleCredito(data.dialogCredito.data) - data.factura.total, data.fornates.nio) }}
                    </span>
                  </div>
                </v-card>
              </div>
            </div>
          </v-card-text>

          <!-- Footer -->
          <v-card-actions class="pa-3 bg-white border-t justify-end">
            <v-btn
              color="indigo-darken-3"
              variant="flat"
              class="text-none font-weight-bold px-4"
              size="small"
              @click="data.dialogCredito.show = false"
            >
              Entendido
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
    </v-dialog>
  </div>
</template>

<script>
import { formatters } from '@/helpers/formatters'
import RequestHttp from '@/services/requestHttp'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { getItemsCombobox, httpGet } from '@/scripts/api.js'
import { useStore } from '@/store'
import AlertComp from '@/components/reutilizable/AlertComp.vue'
import SuccessAlert from '@/components/widgets/SuccessAlert.vue'
import OverlayComp from '@/components/reutilizable/OverlayComp.vue'

export default {
  mounted() {
    if (
      !this.data.clientes ||
      this.data.clientes.length === 0
    ) {
      this.getClientes()
    }
    this.getProductos()
    this.getTipoVentas()
    this.cargarSesionCajaActiva()
  },

  props: {
    show: {
      type: Boolean,
      required: true
    },
    editar: {
      type: Boolean,
      required: false
    },
    idFact: {
      type: Number,
      required: false
    },
    clientesList: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      required: true,
      default: 'Nueva Factura'
    }
  },

  components: {
    AlertComp,
    SuccessAlert,
    OverlayComp
  },

  setup(props) {
    const store = useStore()

    const data = reactive({
      rules: {
        rule: [
          (v) => !!v || 'El campo es obligatorio'
        ]
      },

      headers: [
        {
          title: '',
          key: 'opc',
          align: 'center',
          sortable: false,
          width: '40px'
        },
        {
          title: 'Producto',
          key: 'producto',
          align: 'start'
        },
        {
          title: 'Cant.',
          key: 'cantidad',
          align: 'center',
          width: '120px'
        },
        {
          title: 'Precio Unit.',
          key: 'costoUnitario',
          align: 'end',
          width: '100px'
        },
        {
          title: 'Impuesto',
          key: 'impuesto',
          align: 'end',
          width: '95px'
        },
        {
          title: 'SubTotal',
          key: 'subTotal',
          align: 'end',
          width: '105px'
        }
      ],

      sesionCaja: {
        idAperturaCaja: null,
        idCaja: null,
        cajaCodigo: '',
        cajaNombre: '',
        idBodega: null,
        bodegaNombre: '',
        idUsuario: null,
        nombre: '',
        usuario: '',
        loading: false
      },

      productos: [],
      tipoVenta: [],
      items: [],
      clientes:
        props.clientesList &&
        props.clientesList.length > 0
          ? [...props.clientesList]
          : [],
      producto: {
        idVenta: 0,
        idProducto: null,
        cantidad: null,
        costoUnitario: null,
        observaciones: null
      },
      condicionFactura: [
        { title: 'Contado', value: 'contado' },
        { title: 'Crédito', value: 'credito' }
      ],
      factura: {
        subTotal: 0.0,
        totalImpuestos: 0.0,
        total: 0.0,
        usdTotal: 0.0
      },
      venta: {
        noVenta: null,
        idTipoVenta: null,
        idCliente: null,
        credito: false,
        observaciones: null,
        enviarA: null,
        ubicacion: null,
        detalleVenta: []
      },
      editVenta: {
        idVenta: null,
        fechaRegistro: null,
        estado: false,
        idClienteNavigation: null,
        detalleCxcs: []
      },

      // Detalle de Crédito Modal
      dialogCredito: {
        show: false,
        loading: false,
        data: null,
        error: null,
        idClienteConsultado: null
      },

      // ALERTS
      alert: {
        show: false,
        show2: false,
        show3: false,
        type: 'success',
        message: '',
        val: 0
      },
      alertSuccess: {
        show: false,
        msg: '',
        success: false
      },
      overlay: {
        show: false
      },

      contDisableBtn: false,
      hide: true,
      isCredito: 'contado',
      idVenta: null,
      fornates: {
        nio: 'NIO',
        usd: 'USD'
      },
      requestHttp: new RequestHttp()
    })

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

    function showAlert(val, message, type) {
      if (val === 1) {
        data.alert.show = true
      } else if (val === 2) {
        data.alert.show2 = true
      } else if (val === 3) {
        data.alert.show3 = true
      }
      data.alert.type = type
      data.alert.message = message

      setTimeout(() => {
        data.alert.show = false
        data.alert.show2 = false
        data.alert.show3 = false
        data.alert.val = 0
      }, 3000)
    }

    const getVenta = async (id) => {
      return await data.requestHttp.getByIdVenta(
        id
      )
    }

    const clienteTieneCredito = computed(() => {
      if (!data.venta.idCliente) return false
      const cli = data.clientes.find(
        (c) => c.value === data.venta.idCliente || c.id === data.venta.idCliente
      )
      if (!cli) return false
      return !!(
        cli.esTieneCredito ||
        cli.EsTieneCredito ||
        cli.creditoPermitido ||
        cli.esCredito ||
        cli.tieneCredito ||
        cli.credito
      )
    })

    const clienteSeleccionado = computed(() => {
      if (!data.venta.idCliente) return null
      return (
        data.clientes.find(
          (c) => c.value === data.venta.idCliente || c.id === data.venta.idCliente
        ) || null
      )
    })

    const calcularFactura = () => {
      let subtotal = 0
      let totalImpuestos = 0
      data.factura.subTotal = 0.0
      data.factura.totalImpuestos = 0.0
      data.factura.total = 0.0
      data.factura.usdTotal = 0.0

      data.items.forEach((item) => {
        item.subTotal =
          item.costoUnitario * item.cantidad
        subtotal += item.subTotal
        if (item.montoImpuesto) {
          totalImpuestos += item.montoImpuesto
        }
      })

      data.factura.subTotal = subtotal
      data.factura.totalImpuestos = totalImpuestos
      data.factura.total =
        subtotal + totalImpuestos
      data.factura.usdTotal =
        data.factura.total / 36.6243
    }

    const cargarSesionCajaActiva = async () => {
      try {
        data.sesionCaja.loading = true
        data.sesionCaja.tieneAperturaActiva = false
        data.sesionCaja.idAperturaCaja = null
        data.sesionCaja.idCaja = null
        data.sesionCaja.cajaCodigo = ''
        data.sesionCaja.cajaNombre = ''
        data.sesionCaja.bodegaNombre = ''
        data.sesionCaja.idBodega = null

        const token = store.getInfoUser()
        if (!token || !token.idusuario) return

        const idUsuario = parseInt(token.idusuario)
        data.sesionCaja.idUsuario = idUsuario
        data.sesionCaja.usuario = token.usuario || ''
        data.sesionCaja.nombre = localStorage.getItem('name') || token.usuario || ''

        // 1. Obtener apertura activa del usuario
        const resApertura = await httpGet(`api/usuarios/${idUsuario}/caja-activa`)
        if (resApertura && resApertura.tieneAperturaActiva === true && resApertura.apertura) {
          const ap = resApertura.apertura
          data.sesionCaja.tieneAperturaActiva = true
          data.sesionCaja.idAperturaCaja = ap.idAperturaCaja
          data.sesionCaja.idCaja = ap.idCaja
          data.sesionCaja.cajaCodigo = ap.cajaCodigo || ''
          data.sesionCaja.cajaNombre = ap.cajaNombre || ''
          if (ap.usuarioAperturaNombre) {
            data.sesionCaja.usuario = ap.usuarioAperturaNombre
          }

          // 2. Obtener datos de la caja (bodega y cajero si está disponible)
          const resCajas = await httpGet('api/cajas')
          const cajas = Array.isArray(resCajas) ? resCajas : (Array.isArray(resCajas?.data) ? resCajas.data : [])
          if (data.sesionCaja.idCaja && cajas.length > 0) {
            const caja = cajas.find((c) => c.idCaja === data.sesionCaja.idCaja)
            if (caja) {
              data.sesionCaja.bodegaNombre = caja.bodegaNombre || ''
              data.sesionCaja.idBodega = caja.idBodega || null
              if (caja.cajeroUltimaSesionNombre) {
                data.sesionCaja.nombre = caja.cajeroUltimaSesionNombre
              }
            }
          }
        } else {
          data.sesionCaja.tieneAperturaActiva = false
        }

        // 3. Obtener nombre completo del usuario si aún no está definido o es igual al username
        if (!data.sesionCaja.nombre || data.sesionCaja.nombre === data.sesionCaja.usuario) {
          const resUsuarios = await httpGet('api/usuario/listar')
          const usuarios = Array.isArray(resUsuarios) ? resUsuarios : (Array.isArray(resUsuarios?.data) ? resUsuarios.data : [])
          if (usuarios.length > 0) {
            const u = usuarios.find((x) => (x.idusuario || x.idUsuario) === idUsuario || x.username === token.usuario)
            if (u && u.nombre) {
              data.sesionCaja.nombre = u.nombre
            }
          }
        }
      } catch (err) {
        console.error('Error cargando sesión activa de caja:', err)
        data.sesionCaja.tieneAperturaActiva = false
      } finally {
        data.sesionCaja.loading = false
      }
    }

    onMounted(() => {
      cargarSesionCajaActiva()
    })

    const localShow = ref(props.show)
    const localEdit = ref(props.editar)
    const localFact = ref(props.idFact)
    const localTitle = ref(props.title)

    watch(
      () => props.show,
      (newValue) => {
        localShow.value = newValue
        if (newValue) {
          cargarSesionCajaActiva()
        }
      }
    )

    watch(
      () => props.idFact,
      (val) => {
        localFact.value = val
      }
    )

    watch(
      () => props.clientesList,
      (newList) => {
        if (newList && newList.length > 0) {
          data.clientes = [...newList]
        }
      }
    )

    watch(
      () => data.venta.idCliente,
      (newId) => {
        if (!newId) {
          if (data.isCredito === 'credito') {
            data.isCredito = 'contado'
          }
          return
        }
        const cli = data.clientes.find(
          (c) => c.value === newId || c.id === newId
        )
        const hasCred = !!(
          cli?.esTieneCredito ||
          cli?.EsTieneCredito ||
          cli?.creditoPermitido ||
          cli?.esCredito ||
          cli?.tieneCredito ||
          cli?.credito
        )
        if (!hasCred && data.isCredito === 'credito') {
          data.isCredito = 'contado'
        }
      }
    )

    watch(
      () => props.editar,
      async (val) => {
        localEdit.value = val
        if (val && props.idFact) {
          try {
            data.overlay.show = true
            data.items = []

            // Asegurar que el catálogo de productos con impuestos y precios mayoristas esté cargado
            if (!data.productos || data.productos.length === 0) {
              const prodResult = await data.requestHttp.getProductosDetalleVenta()
              if (prodResult.code === 200 && Array.isArray(prodResult.data)) {
                data.productos = prodResult.data.map((item) => ({
                  idProducto: item.idProducto,
                  codigo: item.codigo || '',
                  nombre: item.nombre,
                  title: `${item.codigo ? item.codigo + ' - ' : ''}${item.nombre}`,
                  precio: item.precio,
                  costo: item.costo,
                  cantidadTotal: item.cantidadTotal,
                  esMayorista: item.esMayorista,
                  esFacturarSinInventario: item.esFacturarSinInventario,
                  minimoVenta: item.minimoVenta,
                  preciosMayoristas: item.preciosMayoristas || [],
                  impuestos: item.impuestos || []
                }))
              }
            }

            const result = await getVenta(props.idFact)
            if (result.code === 200) {
              data.venta = result.data
              data.editVenta.estado = result.data.estado
              data.editVenta.fechaRegistro = result.data.fechaRegistro
              data.editVenta.idVenta = result.data.idVenta
              data.editVenta.idClienteNavigation = result.data.idClienteNavigation
              data.isCredito = result.data.credito ? 'credito' : 'contado'

              const detalles = result.data.detalleVenta || []
              const mappedItems = detalles.map((item) => {
                const prod = data.productos.find((p) => p.idProducto === item.idProducto)
                const qty = Number(item.cantidad) || 0
                const unitPrice = Number(item.precioUnitario) || 0
                const subtotalBase = qty * unitPrice

                // Evaluación de Precios Mayoristas
                let esMayoristaAplicado = false
                let rangoMayoristaText = ''
                if (prod?.esMayorista && prod?.preciosMayoristas && prod.preciosMayoristas.length > 0) {
                  const matchingRange = prod.preciosMayoristas.find(
                    (pm) => qty >= pm.minimo && (pm.rangoIndefinido || qty <= pm.maximo)
                  )
                  if (matchingRange) {
                    esMayoristaAplicado = true
                    rangoMayoristaText = `(${matchingRange.minimo}${matchingRange.maximo ? ' - ' + matchingRange.maximo : ' o más'})`
                  }
                }

                // Evaluación y Cálculo de Impuestos aplicables a la venta
                const impuestosVenta = (prod?.impuestos || item.impuestos || []).filter((i) => i.esAplicadoVenta)
                const porcentajeImpuestoTotal = impuestosVenta.reduce(
                  (acc, imp) => acc + (Number(imp.valorPorcentual) || 0),
                  0
                )
                const montoImpuesto = subtotalBase * (porcentajeImpuestoTotal / 100)

                return {
                  idDetalleVenta: item.idDetalleVenta,
                  idVenta: item.idVenta,
                  idProducto: item.idProducto,
                  codigo: prod?.codigo || item.codigo || '',
                  producto: prod?.nombre || item.producto || `Producto #${item.idProducto}`,
                  cantidad: qty,
                  costoUnitario: unitPrice,
                  precioRegular: prod?.precio || unitPrice,
                  esMayorista: esMayoristaAplicado,
                  rangoMayorista: rangoMayoristaText,
                  impuestos: impuestosVenta,
                  porcentajeImpuesto: porcentajeImpuestoTotal,
                  montoImpuesto: montoImpuesto,
                  subTotal: subtotalBase,
                  observaciones: item.observaciones,
                  idProductoNavigation: item.idProductoNavigation,
                  idVentaNavigation: item.idVentaNavigation
                }
              })

              data.items = mappedItems
              calcularFactura()
            }
            data.overlay.show = false
          } catch (error) {
            data.overlay.show = false
            showAlert(1, 'No se pudo cargar la factura', 'error')
          }
        }
      },
      { immediate: true }
    )

    watch(
      () => props.title,
      (val) => {
        localTitle.value = val
      }
    )

    watch(
      () => data.isCredito,
      (val) => {
        data.venta.credito = val === 'credito'
      }
    )

    return {
      data,
      localShow,
      localEdit,
      localFact,
      localTitle,
      clienteTieneCredito,
      clienteSeleccionado,
      showSuccesAlert,
      showAlert,
      getVenta,
      calcularFactura,
      cargarSesionCajaActiva
    }
  },

  methods: {
    async getClientes() {
      this.data.clientes = []
      this.data.loading = true
      const clientes = await getItemsCombobox(
        'api/cliente/combobox'
      )
      this.data.clientes = clientes
      this.data.loading = false
    },

    async getTipoVentas() {
      this.data.tipoVenta = []
      this.data.loading = true
      const result =
        await this.data.requestHttp.getTipoVentas()
      this.data.loading = false
      if (result.code === 200) {
        result.data.map((item) => {
          this.data.tipoVenta.push({
            title: item.nombre,
            value: item.id
          })
        })
      }
    },

    async getProductos() {
      this.data.productos = []
      this.data.loading = true
      const result =
        await this.data.requestHttp.getProductosDetalleVenta()
      this.data.loading = false
      if (
        result.code === 200 &&
        Array.isArray(result.data)
      ) {
        this.data.productos = result.data.map(
          (item) => ({
            idProducto: item.idProducto,
            codigo: item.codigo || '',
            nombre: item.nombre,
            title: `${item.codigo ? item.codigo + ' - ' : ''}${item.nombre}`,
            precio: item.precio,
            costo: item.costo,
            cantidadTotal: item.cantidadTotal,
            esMayorista: item.esMayorista,
            esFacturarSinInventario:
              item.esFacturarSinInventario,
            minimoVenta: item.minimoVenta,
            preciosMayoristas:
              item.preciosMayoristas || [],
            impuestos: item.impuestos || []
          })
        )
      }
    },

    async addProducts() {
      if (
        !this.data.producto.idProducto ||
        !this.data.producto.cantidad
      ) {
        this.showAlert(
          1,
          'Seleccione un producto e ingrese la cantidad',
          'warning'
        )
        return
      }

      const inputQty = parseFloat(Number(this.data.producto.cantidad).toFixed(4))
      if (isNaN(inputQty) || inputQty <= 0) {
        this.showAlert(
          1,
          'La cantidad debe ser mayor a 0',
          'warning'
        )
        return
      }

      // Buscar producto en la lista en memoria
      const prod = this.data.productos.find(
        (p) =>
          p.idProducto ===
          this.data.producto.idProducto
      )
      if (!prod) {
        this.showAlert(
          1,
          'Producto no encontrado',
          'warning'
        )
        return
      }

      const existingItemIndex =
        this.data.items.findIndex(
          (item) =>
            item.idProducto === prod.idProducto
        )
      let totalQty = inputQty
      let mergedObservaciones =
        this.data.producto.observaciones

      if (existingItemIndex !== -1) {
        const existingItem =
          this.data.items[existingItemIndex]
        totalQty = parseFloat((totalQty + Number(existingItem.cantidad)).toFixed(4))
        mergedObservaciones = [
          existingItem.observaciones,
          this.data.producto.observaciones
        ]
          .filter(Boolean)
          .join(', ')
      }

      // Validar stock si no es facturar sin inventario
      if (
        !prod.esFacturarSinInventario &&
        prod.cantidadTotal < totalQty
      ) {
        this.showAlert(
          1,
          `Stock insuficiente para ${prod.nombre}. Stock disponible: ${prod.cantidadTotal}`,
          'warning'
        )
        return
      }

      // Evaluación de Precio (Regular vs Mayorista)
      let precioUnitario = prod.precio
      let esMayoristaAplicado = false
      let rangoMayoristaText = ''

      if (
        prod.esMayorista &&
        prod.preciosMayoristas &&
        prod.preciosMayoristas.length > 0
      ) {
        const matchingRange =
          prod.preciosMayoristas.find(
            (pm) =>
              totalQty >= pm.minimo &&
              (pm.rangoIndefinido ||
                totalQty <= pm.maximo)
          )
        if (matchingRange) {
          precioUnitario = matchingRange.precio
          esMayoristaAplicado = true
          rangoMayoristaText = `(${matchingRange.minimo}${matchingRange.maximo ? ' - ' + matchingRange.maximo : ' o más'})`
        }
      }

      // Evaluación y Cálculo de Impuestos aplicables a la venta
      const impuestosVenta = (
        prod.impuestos || []
      ).filter((i) => i.esAplicadoVenta)
      const porcentajeImpuestoTotal =
        impuestosVenta.reduce(
          (acc, imp) =>
            acc + (imp.valorPorcentual || 0),
          0
        )
      const subtotalBase =
        totalQty * precioUnitario
      const montoImpuesto =
        subtotalBase *
        (porcentajeImpuestoTotal / 100)

      const itemData = {
        idProducto: prod.idProducto,
        codigo: prod.codigo,
        producto: prod.nombre,
        cantidad: totalQty,
        costoUnitario: precioUnitario,
        precioRegular: prod.precio,
        esMayorista: esMayoristaAplicado,
        rangoMayorista: rangoMayoristaText,
        impuestos: impuestosVenta,
        porcentajeImpuesto:
          porcentajeImpuestoTotal,
        montoImpuesto: montoImpuesto,
        subTotal: subtotalBase,
        observaciones: mergedObservaciones
      }

      if (existingItemIndex !== -1) {
        this.data.items[existingItemIndex] =
          itemData
      } else {
        this.data.items.push(itemData)
      }

      this.calcularFactura()
      this.data.producto.idProducto = null
      this.data.producto.cantidad = null
      this.data.producto.observaciones = null
    },

    recalcularItem(item, nuevaCantidad) {
      if (!item) return
      let qty = parseFloat(Number(nuevaCantidad).toFixed(4))
      if (isNaN(qty) || qty <= 0) {
        qty = 1
      }

      // Buscar producto en la lista en memoria
      const prod = this.data.productos.find(
        (p) => p.idProducto === item.idProducto
      )

      if (prod) {
        // Validar stock si no es facturar sin inventario
        if (!prod.esFacturarSinInventario && prod.cantidadTotal < qty) {
          this.showAlert(
            1,
            `Stock insuficiente para ${prod.nombre}. Stock disponible: ${prod.cantidadTotal}`,
            'warning'
          )
          qty = Math.max(0.0001, parseFloat(Number(prod.cantidadTotal).toFixed(4)))
        }

        // Evaluación de Precio (Regular vs Mayorista)
        let precioUnitario = prod.precio
        let esMayoristaAplicado = false
        let rangoMayoristaText = ''

        if (
          prod.esMayorista &&
          prod.preciosMayoristas &&
          prod.preciosMayoristas.length > 0
        ) {
          const matchingRange = prod.preciosMayoristas.find(
            (pm) =>
              qty >= pm.minimo &&
              (pm.rangoIndefinido || qty <= pm.maximo)
          )
          if (matchingRange) {
            precioUnitario = matchingRange.precio
            esMayoristaAplicado = true
            rangoMayoristaText = `(${matchingRange.minimo}${matchingRange.maximo ? ' - ' + matchingRange.maximo : ' o más'})`
          }
        }

        // Evaluación de Impuestos aplicables a la venta
        const impuestosVenta = (prod.impuestos || []).filter((i) => i.esAplicadoVenta)
        const porcentajeImpuestoTotal = impuestosVenta.reduce(
          (acc, imp) => acc + (imp.valorPorcentual || 0),
          0
        )
        const subtotalBase = qty * precioUnitario
        const montoImpuesto = subtotalBase * (porcentajeImpuestoTotal / 100)

        item.cantidad = qty
        item.costoUnitario = precioUnitario
        item.esMayorista = esMayoristaAplicado
        item.rangoMayorista = rangoMayoristaText
        item.porcentajeImpuesto = porcentajeImpuestoTotal
        item.montoImpuesto = montoImpuesto
        item.subTotal = subtotalBase
      } else {
        item.cantidad = qty
        item.subTotal = item.costoUnitario * qty
      }

      this.calcularFactura()
    },

    incrementarCantidad(item) {
      const current = Number(item.cantidad) || 0
      this.recalcularItem(item, parseFloat((current + 1).toFixed(4)))
    },

    decrementarCantidad(item) {
      const current = Number(item.cantidad) || 0
      if (current > 1) {
        this.recalcularItem(item, parseFloat((current - 1).toFixed(4)))
      } else if (current > 0.0001) {
        this.recalcularItem(item, Math.max(0.0001, parseFloat((current - 0.1).toFixed(4))))
      }
    },

    onCantidadInputChange(item, event) {
      const val = parseFloat(event.target.value)
      this.recalcularItem(item, isNaN(val) ? 1 : parseFloat(val.toFixed(4)))
    },

    deleteProduct(itemSelected) {
      let i =
        this.data.items.indexOf(itemSelected)
      if (i !== -1) {
        this.data.items.splice(i, 1)
      }
      this.calcularFactura()
    },

    async guardarFactura() {
      const valid =
        await this.$refs.form.validate()

      try {
        if (!this.localEdit) {
          if (!this.data.sesionCaja.tieneAperturaActiva) {
            this.showAlert(
              2,
              'No cuenta con una apertura de caja activa para registrar ventas. Realice una apertura de caja primero.',
              'warning'
            )
            return
          }

          if (!valid.valid) {
            this.showAlert(
              2,
              'Complete los campos obligatorios marcados con *',
              'warning'
            )
            return
          }

          if (
            !this.data.items ||
            this.data.items.length === 0
          ) {
            this.showAlert(
              2,
              'Debe agregar al menos un producto a la factura',
              'warning'
            )
            return
          }

          if (this.data.venta.credito) {
            if (!this.clienteTieneCredito) {
              this.showAlert(
                2,
                'El cliente seleccionado no tiene crédito autorizado. Cambie la condición a Contado.',
                'warning'
              )
              return
            }

            // Consultar detalle de crédito en tiempo real para validar saldo disponible
            this.data.overlay.show = true
            try {
              const resCredito = await this.data.requestHttp.getDetalleCreditoCliente(this.data.venta.idCliente)
              this.data.overlay.show = false

              if (resCredito.code === 200 && resCredito.data) {
                this.data.dialogCredito.data = resCredito.data
                const disponible = this.getSaldoDisponibleCredito(resCredito.data)

                if (this.data.factura.total > disponible) {
                  const excedente = this.data.factura.total - disponible
                  // Abrir modal de detalle mostrando el excedente y bloquear la venta
                  this.data.dialogCredito.show = true
                  this.showAlert(
                    2,
                    `Venta a crédito bloqueada: Excede el crédito disponible por ${this.formatedCurrency(excedente, this.data.fornates.nio)}`,
                    'error'
                  )
                  return
                }
              }
            } catch (err) {
              this.data.overlay.show = false
            }
          }

          const payload = {
            idCliente: this.data.venta.idCliente,
            idTipoVenta:
              this.data.venta.idTipoVenta,
            credito:
              this.data.venta.credito || false,
            observaciones:
              this.data.venta.observaciones,
            enviarA: null,
            ubicacion: this.data.venta.ubicacion,
            detalleVenta: this.data.items.map(
              (item) => ({
                idProducto: item.idProducto,
                cantidad: item.cantidad,
                precioUnitario:
                  item.costoUnitario,
                observaciones: item.observaciones
              })
            )
          }

          this.data.contDisableBtn = true
          this.data.overlay.show = true
          const result =
            await this.data.requestHttp.postVenta(
              payload
            )
          this.data.overlay.show = false

          if (result.code === 200) {
            this.showSuccesAlert(
              '¡Venta registrada con éxito!',
              true
            )
            setTimeout(() => {
              this.data.contDisableBtn = false
              this.closeDialog()
            }, 1500)
          } else {
            this.data.contDisableBtn = false
            // Refrescar lista de productos y stock por posibles ventas en concurrencia
            await this.getProductos()

            let errorMsg =
              result.data?.msg ||
              result.data?.message ||
              '¡Venta no registrada. Verifique los datos!'

            if (result.data?.code === 400.1 || result.data?.code === 400.2 || result.code === 404 || result.code === 401) {
              if (result.data?.msg) {
                errorMsg = result.data.msg
              }
            }

            this.showSuccesAlert(
              `¡${errorMsg}!`,
              false
            )
            return
          }
        } else {
          if (!this.data.venta.idCliente) {
            this.showAlert(
              2,
              'Complete los campos obligatorios',
              'warning'
            )
            return
          }

          if (this.data.venta.credito) {
            if (!this.clienteTieneCredito) {
              this.showAlert(
                2,
                'El cliente seleccionado no tiene crédito autorizado. Cambie la condición a Contado.',
                'warning'
              )
              return
            }

            // Consultar detalle de crédito en tiempo real para validar saldo disponible
            this.data.overlay.show = true
            try {
              const resCredito = await this.data.requestHttp.getDetalleCreditoCliente(this.data.venta.idCliente)
              this.data.overlay.show = false

              if (resCredito.code === 200 && resCredito.data) {
                this.data.dialogCredito.data = resCredito.data
                const disponible = this.getSaldoDisponibleCredito(resCredito.data)

                if (this.data.factura.total > disponible) {
                  const excedente = this.data.factura.total - disponible
                  // Abrir modal de detalle mostrando el excedente y bloquear la venta
                  this.data.dialogCredito.show = true
                  this.showAlert(
                    2,
                    `Venta a crédito bloqueada: Excede el crédito disponible por ${this.formatedCurrency(excedente, this.data.fornates.nio)}`,
                    'error'
                  )
                  return
                }
              }
            } catch (err) {
              this.data.overlay.show = false
            }
          }

          this.data.venta.detalleVenta =
            this.data.items.map((item) => ({
              idVenta: item.idVenta,
              idProducto: item.idProducto,
              cantidad: item.cantidad,
              precioUnitario: item.costoUnitario,
              observaciones: item.observaciones
            }))

          this.data.contDisableBtn = true
          const result =
            await this.data.requestHttp.putVenta(
              this.data.venta,
              this.data.editVenta.idVenta
            )
          this.data.contDisableBtn = false

          if (result.code === 200) {
            this.showSuccesAlert(
              '¡Factura actualizada!',
              true
            )
            setTimeout(() => {
              this.closeDialog()
            }, 1500)
          } else {
            await this.getProductos()
            this.showSuccesAlert(
              '¡No se pudo actualizar la factura!',
              false
            )
            return
          }
        }
      } catch (error) {
        await this.getProductos()
        this.showSuccesAlert(
          'Ha ocurrido un problema al guardar la factura',
          false
        )
      }

      this.$emit('refreshTable')
    },

    seleccionarCredito() {
      if (!this.clienteTieneCredito) {
        this.showAlert(
          1,
          'El cliente seleccionado no tiene crédito permitido',
          'warning'
        )
        this.data.isCredito = 'contado'
        return
      }
      this.data.isCredito = 'credito'
    },

    async verDetalleCredito(idCliente) {
      if (!idCliente) return
      this.data.dialogCredito.show = true
      this.data.dialogCredito.loading = true
      this.data.dialogCredito.error = null
      this.data.dialogCredito.idClienteConsultado = idCliente

      try {
        const result = await this.data.requestHttp.getDetalleCreditoCliente(idCliente)
        if (result.code === 200 && result.data) {
          this.data.dialogCredito.data = result.data
        } else {
          this.data.dialogCredito.error = 'No se pudo obtener el detalle de crédito del cliente.'
        }
      } catch (e) {
        this.data.dialogCredito.error = 'Error de conexión al consultar el detalle de crédito.'
      } finally {
        this.data.dialogCredito.loading = false
      }
    },

    getSaldoDisponibleCredito(creditoData) {
      if (!creditoData) return 0
      if (creditoData.esCreditoIlimitado || creditoData.EsCreditoIlimitado) {
        return Infinity
      }
      if (creditoData.creditoDisponible !== undefined && creditoData.creditoDisponible !== null) {
        return Number(creditoData.creditoDisponible)
      }
      if (creditoData.CreditoDisponible !== undefined && creditoData.CreditoDisponible !== null) {
        return Number(creditoData.CreditoDisponible)
      }
      if (creditoData.saldoDisponible !== undefined && creditoData.saldoDisponible !== null) {
        return Number(creditoData.saldoDisponible)
      }
      if (creditoData.SaldoDisponible !== undefined && creditoData.SaldoDisponible !== null) {
        return Number(creditoData.SaldoDisponible)
      }
      const lim = Number(creditoData.limiteCredito ?? creditoData.LimiteCredito ?? 0)
      const util = Number(
        creditoData.creditoUsado ??
        creditoData.CreditoUsado ??
        creditoData.saldoUtilizado ??
        creditoData.SaldoUtilizado ??
        0
      )
      return Math.max(0, lim - util)
    },

    formatedCurrency(key, currency) {
      return formatters.formatCurrency(
        key,
        currency
      )
    },

    formatedDate(dataString) {
      return formatters.formatDate(dataString)
    },

    closeDialog() {
      this.$emit('closeDialog', false)
    }
  }
}
</script>

<style scoped>
.lh-1 {
  line-height: 1.2;
}

.table-container {
  background-color: #ffffff;
}

.product-table :deep(.v-data-table-header) {
  background-color: #f8fafc;
}

.product-table :deep(th) {
  font-weight: 700 !important;
  color: #475569 !important;
  font-size: 0.75rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.refresh-btn:hover {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.condition-selector-container {
  display: flex;
  gap: 8px;
  width: 100%;
}

.condition-tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #475569;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s
    cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  user-select: none;
}

.condition-tab-btn:hover:not(:disabled):not(.disabled) {
  background-color: #fff3e0;
  border-color: #fb8c00;
  color: #e65100;
}

.condition-tab-btn.active {
  background-color: #e65100;
  border-color: #e65100;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(230, 81, 0, 0.35);
}

.condition-tab-btn.disabled,
.condition-tab-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  background-color: #f1f5f9;
  color: #94a3b8;
  border-color: #e2e8f0;
  box-shadow: none;
}

.quantity-stepper {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 2px 3px;
  border: 1px solid #e2e8f0;
}

.quantity-btn {
  width: 22px !important;
  height: 22px !important;
  min-width: 22px !important;
  border-radius: 4px;
}

.quantity-input {
  width: 72px;
  height: 24px;
  border: 1px solid transparent;
  background: #ffffff;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;
  -moz-appearance: textfield;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input:focus {
  border-color: #e65100;
  box-shadow: 0 0 0 2px rgba(230, 81, 0, 0.15);
}

:deep(.fixed-autocomplete) {
  max-height: 40px !important;
}

:deep(.fixed-autocomplete .v-field) {
  height: 40px !important;
  max-height: 40px !important;
  min-height: 40px !important;
  align-items: center !important;
}

:deep(.fixed-autocomplete .v-field__field) {
  height: 40px !important;
  max-height: 40px !important;
  overflow: hidden !important;
  display: flex !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
}

:deep(.fixed-autocomplete .v-field__input) {
  height: 40px !important;
  max-height: 40px !important;
  min-height: 40px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}

:deep(.fixed-autocomplete .v-field__input input) {
  min-width: 0 !important;
  flex: 0 1 auto !important;
  height: 100% !important;
}
</style>