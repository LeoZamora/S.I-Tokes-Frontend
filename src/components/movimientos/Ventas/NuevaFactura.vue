<template>
  <div>
    <v-dialog
      v-model="localShow"
      max-width="1250"
      persistent
      scrollable
    >
      <v-card
        elevation="12"
        rounded="xl"
        class="bg-grey-lighten-4 d-flex flex-column"
        style="max-height: 92vh"
      >
        <!-- Header del Diálogo -->
        <v-card-title
          class="bg-indigo-darken-4 d-flex align-center py-3 px-4 flex-shrink-0"
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

        <v-card-text
          class="pa-4 overflow-y-auto flex-grow-1"
        >
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
                    v-if="
                      !data.sesionCaja.loading &&
                      !data.sesionCaja
                        .tieneAperturaActiva &&
                      !localEdit
                    "
                    type="warning"
                    variant="tonal"
                    density="comfortable"
                    rounded="lg"
                    class="mb-3 border border-warning"
                  >
                    <template v-slot:prepend>
                      <v-avatar
                        color="warning-lighten-4"
                        size="34"
                        class="mr-2"
                      >
                        <v-icon
                          color="warning-darken-3"
                          size="20"
                          >mdi-cash-register</v-icon
                        >
                      </v-avatar>
                    </template>
                    <div
                      class="font-weight-bold text-caption text-warning-darken-4"
                    >
                      Sin Apertura de Caja Activa
                    </div>
                    <div
                      class="text-caption text-grey-darken-3"
                      style="
                        font-size: 11px !important;
                        line-height: 1.3;
                      "
                    >
                      El usuario
                      <strong
                        >@{{
                          data.sesionCaja.usuario
                        }}</strong
                      >
                      no posee una apertura de
                      caja activa. No es posible
                      registrar facturas sin una
                      sesión de caja.
                    </div>
                  </v-alert>

                  <!-- Visualización de Cajero y Bodega en Sesión Activa -->
                  <v-card
                    v-else-if="
                      data.sesionCaja
                        .tieneAperturaActiva
                    "
                    variant="flat"
                    class="pa-3 mb-3 border rounded-lg bg-indigo-lighten-5"
                  >
                    <div
                      class="d-flex align-center justify-space-between mb-2"
                    >
                      <div
                        class="text-caption font-weight-bold text-indigo-darken-4 d-flex align-center"
                      >
                        <v-icon
                          size="16"
                          class="mr-1"
                          color="indigo-darken-3"
                          >mdi-cash-register</v-icon
                        >
                        Sesión:
                        {{
                          data.sesionCaja
                            .cajaNombre ||
                          data.sesionCaja
                            .cajaCodigo ||
                          'Caja'
                        }}
                      </div>
                      <v-chip
                        size="x-small"
                        color="success"
                        variant="flat"
                        class="font-weight-bold"
                      >
                        <v-icon start size="10"
                          >mdi-circle</v-icon
                        >
                        Activa
                      </v-chip>
                    </div>

                    <div
                      class="d-flex align-center justify-space-between flex-wrap ga-2"
                    >
                      <!-- Cajero con Avatar, Nombre y @username -->
                      <div
                        class="d-flex align-center"
                      >
                        <v-avatar
                          size="38"
                          color="indigo-darken-4"
                          class="text-white font-weight-bold mr-2 elevation-1"
                        >
                          <span
                            v-if="
                              data.sesionCaja
                                .nombre
                            "
                            >{{
                              data.sesionCaja.nombre
                                .charAt(0)
                                .toUpperCase()
                            }}</span
                          >
                          <v-icon v-else size="20"
                            >mdi-account</v-icon
                          >
                        </v-avatar>
                        <div>
                          <div
                            class="text-subtitle-2 font-weight-bold text-grey-darken-4 lh-1"
                          >
                            {{
                              data.sesionCaja
                                .nombre ||
                              data.sesionCaja
                                .usuario ||
                              'Cajero'
                            }}
                          </div>
                          <div
                            class="text-caption text-grey-darken-1 font-weight-medium"
                            style="
                              font-size: 11px !important;
                              line-height: 1.2;
                            "
                          >
                            @{{
                              data.sesionCaja
                                .usuario || '—'
                            }}
                          </div>
                        </div>
                      </div>

                      <!-- Bodega Asociada -->
                      <div class="text-right">
                        <div
                          class="text-caption text-grey-darken-2 font-weight-medium"
                          style="font-size: 10px"
                        >
                          Bodega
                        </div>
                        <v-chip
                          size="small"
                          color="blue-grey-darken-3"
                          variant="tonal"
                          class="font-weight-bold"
                        >
                          <v-icon start size="14"
                            >mdi-store-outline</v-icon
                          >
                          {{
                            data.sesionCaja
                              .bodegaNombre ||
                            'Sin Bodega'
                          }}
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
                        :menu-props="{
                          closeOnContentClick: true
                        }"
                        placeholder="Seleccione tipo de venta..."
                        color="indigo"
                        class="fixed-autocomplete"
                      />
                    </v-col>

                    <!-- Cliente -->
                    <v-col cols="12">
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
                        :menu-props="{
                          closeOnContentClick: true
                        }"
                        :items="data.clientes"
                        clearable
                        color="indigo"
                        class="fixed-autocomplete"
                      >
                        <!-- Item en la lista desplegable con indicador de crédito y descuento -->
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
                                class="d-flex align-center justify-space-between flex-wrap ga-1"
                              >
                                <span
                                  class="font-weight-medium text-body-2"
                                >
                                  {{
                                    item.raw
                                      .title ||
                                    (item.raw
                                      .codigo
                                      ? item.raw
                                          .codigo +
                                        ' - '
                                      : '') +
                                      item.raw
                                        .nombre
                                  }}
                                </span>
                                <div
                                  class="d-flex align-center ga-1"
                                >
                                  <v-chip
                                    v-if="
                                      item.raw
                                        .esTieneDescuento ||
                                      item.raw
                                        .EsTieneDescuento
                                    "
                                    size="x-small"
                                    color="purple-darken-3"
                                    variant="flat"
                                    class="font-weight-bold"
                                  >
                                    <v-icon
                                      start
                                      size="11"
                                      >mdi-tag-check</v-icon
                                    >
                                    Desc.
                                    Autorizado
                                  </v-chip>
                                  <v-chip
                                    size="x-small"
                                    :color="
                                      item.raw
                                        .esTieneCredito ||
                                      item.raw
                                        .EsTieneCredito ||
                                      item.raw
                                        .creditoPermitido ||
                                      item.raw
                                        .esCredito ||
                                      item.raw
                                        .tieneCredito ||
                                      item.raw
                                        .credito
                                        ? 'success'
                                        : 'grey-lighten-2'
                                    "
                                    variant="flat"
                                    :class="
                                      item.raw
                                        .esTieneCredito ||
                                      item.raw
                                        .EsTieneCredito ||
                                      item.raw
                                        .creditoPermitido ||
                                      item.raw
                                        .esCredito ||
                                      item.raw
                                        .tieneCredito ||
                                      item.raw
                                        .credito
                                        ? 'font-weight-bold'
                                        : 'text-grey-darken-2 font-weight-medium'
                                    "
                                  >
                                    <v-icon
                                      start
                                      size="12"
                                      :color="
                                        item.raw
                                          .esTieneCredito ||
                                        item.raw
                                          .EsTieneCredito ||
                                        item.raw
                                          .creditoPermitido ||
                                        item.raw
                                          .esCredito ||
                                        item.raw
                                          .tieneCredito ||
                                        item.raw
                                          .credito
                                          ? 'white'
                                          : 'grey-darken-2'
                                      "
                                    >
                                      {{
                                        item.raw
                                          .esTieneCredito ||
                                        item.raw
                                          .EsTieneCredito ||
                                        item.raw
                                          .creditoPermitido ||
                                        item.raw
                                          .esCredito ||
                                        item.raw
                                          .tieneCredito ||
                                        item.raw
                                          .credito
                                          ? 'mdi-check-circle'
                                          : 'mdi-cash'
                                      }}
                                    </v-icon>
                                    {{
                                      item.raw
                                        .esTieneCredito ||
                                      item.raw
                                        .EsTieneCredito ||
                                      item.raw
                                        .creditoPermitido ||
                                      item.raw
                                        .esCredito ||
                                      item.raw
                                        .tieneCredito ||
                                      item.raw
                                        .credito
                                        ? 'Crédito'
                                        : 'Solo Contado'
                                    }}
                                  </v-chip>
                                </div>
                              </div>
                            </template>
                          </v-list-item>
                        </template>

                        <!-- Item seleccionado con truncamiento estricto -->
                        <template
                          v-slot:selection="{
                            item
                          }"
                        >
                          <div
                            class="d-flex align-center overflow-hidden w-100"
                            style="min-width: 0"
                          >
                            <span
                              class="font-weight-medium text-truncate mr-2"
                              style="
                                min-width: 0;
                                flex: 1 1 auto;
                              "
                            >
                              {{
                                item.raw.title ||
                                (item.raw.codigo
                                  ? item.raw
                                      .codigo +
                                    ' - '
                                  : '') +
                                  item.raw.nombre
                              }}
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

                      <!-- Barra rápida de estado de crédito, descuento y acción para ver detalle -->
                      <div
                        v-if="
                          data.venta.idCliente
                        "
                        class="d-flex align-center justify-space-between flex-wrap ga-1"
                      >
                        <div
                          class="d-flex align-center flex-wrap ga-2"
                        >
                          <div
                            class="d-flex align-center text-caption"
                            :class="
                              clienteTieneCredito
                                ? 'text-green-darken-3 font-weight-medium'
                                : 'text-amber-darken-4 font-weight-medium'
                            "
                          >
                            <v-icon size="14">
                              {{
                                clienteTieneCredito
                                  ? 'mdi-check-circle-outline'
                                  : 'mdi-alert-circle-outline'
                              }}
                            </v-icon>
                            <span>{{
                              clienteTieneCredito
                                ? 'Crédito'
                                : 'Sin crédito'
                            }}</span>
                          </div>
                          <span
                            class="text-grey-lighten-1"
                            >|</span
                          >
                          <div
                            class="d-flex align-center text-caption"
                            :class="
                              clienteTieneDescuento
                                ? 'text-purple-darken-3 font-weight-bold'
                                : 'text-grey font-weight-medium'
                            "
                          >
                            <v-icon size="14">
                              {{
                                clienteTieneDescuento
                                  ? 'mdi-tag-check-outline'
                                  : 'mdi-tag-off-outline'
                              }}
                            </v-icon>
                            <span>{{
                              clienteTieneDescuento
                                ? 'Desc. autorizado'
                                : 'Sin descuento'
                            }}</span>
                          </div>
                        </div>

                        <v-btn
                          size="x-small"
                          variant="tonal"
                          color="indigo-darken-3"
                          prepend-icon="mdi-card-account-details-outline"
                          class="text-none font-weight-bold py-0"
                          @click="
                            verDetalleCredito(
                              data.venta.idCliente
                            )
                          "
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
                            disabled:
                              !clienteTieneCredito
                          }"
                          :disabled="
                            !clienteTieneCredito
                          "
                          @click="
                            seleccionarCredito()
                          "
                        >
                          <v-icon
                            size="18"
                            class="mr-1"
                            >mdi-credit-card-clock-outline</v-icon
                          >
                          <span>Crédito</span>
                          <v-tooltip
                            v-if="
                              !clienteTieneCredito
                            "
                            activator="parent"
                            location="top"
                          >
                            El cliente
                            seleccionado no tiene
                            crédito permitido
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

                  <!-- Fila de Selección y Adición Rápida de Producto con Previsualización de Stock y Descuento -->
                  <div
                    class="bg-grey-lighten-4 pa-3 rounded-lg border mb-3"
                  >
                    <v-row dense align="center">
                      <v-col cols="12" sm="7">
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
                          :menu-props="{
                            closeOnContentClick: true
                          }"
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
                              style="min-width: 0"
                            >
                              <span
                                class="font-weight-medium text-truncate"
                                style="
                                  min-width: 0;
                                  flex: 1 1 auto;
                                "
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
                      <v-col cols="6" sm="2">
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
                          min="0.0001"
                          color="indigo"
                          bg-color="white"
                          @keyup.enter="
                            addProducts()
                          "
                        />
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-text-field
                          v-model="
                            data.producto
                              .descuento
                          "
                          :disabled="
                            !clienteTieneDescuento
                          "
                          prefix="C$"
                          prepend-inner-icon="mdi-tag-outline"
                          density="compact"
                          variant="outlined"
                          hide-details
                          label="Descuento"
                          type="number"
                          step="0.01"
                          min="0"
                          color="indigo"
                          bg-color="white"
                          @keyup.enter="
                            addProducts()
                          "
                        >
                          <v-tooltip
                            v-if="
                              !clienteTieneDescuento
                            "
                            activator="parent"
                            location="top"
                          >
                            Cliente sin
                            autorización de
                            descuento
                          </v-tooltip>
                        </v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
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

                  <!-- Tabla de Productos en Factura con Precios Mayoristas, Descuentos e Impuestos -->
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
                        <div
                          class="d-flex align-center justify-center quantity-stepper"
                        >
                          <v-btn
                            icon
                            size="x-small"
                            variant="flat"
                            color="grey-lighten-3"
                            class="quantity-btn"
                            :disabled="
                              Number(
                                item.cantidad
                              ) <= 0.0001
                            "
                            @click.stop="
                              decrementarCantidad(
                                item
                              )
                            "
                          >
                            <v-icon
                              size="10"
                              color="grey-darken-3"
                              >mdi-minus</v-icon
                            >
                            <v-tooltip
                              activator="parent"
                              location="top"
                              >Disminuir</v-tooltip
                            >
                          </v-btn>
                          <input
                            type="number"
                            step="0.0001"
                            min="0.0001"
                            :value="item.cantidad"
                            @change="
                              onCantidadInputChange(
                                item,
                                $event
                              )
                            "
                            @click.stop
                            class="quantity-input mx-1 text-center font-weight-bold"
                          />
                          <v-btn
                            icon
                            size="x-small"
                            variant="flat"
                            color="grey-lighten-3"
                            class="quantity-btn"
                            @click.stop="
                              incrementarCantidad(
                                item
                              )
                            "
                          >
                            <v-icon
                              size="10"
                              color="grey-darken-3"
                              >mdi-plus</v-icon
                            >
                            <v-tooltip
                              activator="parent"
                              location="top"
                              >Aumentar</v-tooltip
                            >
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
                        v-slot:item.descuento="{
                          item
                        }"
                      >
                        <div
                          class="d-flex align-center justify-end"
                        >
                          <template
                            v-if="
                              clienteTieneDescuento
                            "
                          >
                            <span
                              class="text-caption text-purple-darken-3 font-weight-bold mr-1"
                              >C$</span
                            >
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              :max="
                                item.costoUnitario *
                                item.cantidad
                              "
                              :value="
                                item.descuento ||
                                0
                              "
                              @change="
                                onDescuentoInputChange(
                                  item,
                                  $event
                                )
                              "
                              @click.stop
                              class="discount-input text-right font-weight-bold"
                            />
                          </template>
                          <span
                            v-else
                            class="text-caption text-grey"
                          >
                            C$ 0.00
                          </span>
                        </div>
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

                  <!-- Resumen Financiero Completo: Subtotal, Descuentos, Impuestos y Total -->
                  <div
                    class="bg-indigo-lighten-5 pa-3 rounded-lg border border-indigo-lighten-4 mt-auto"
                  >
                    <div
                      class="d-flex justify-space-between align-center mb-1"
                    >
                      <span
                        class="text-caption text-grey-darken-2 font-weight-medium"
                        >Sub Total (Bruto):</span
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
                      class="d-flex justify-space-between align-center mb-1 text-orange-darken-4"
                      v-if="
                        data.factura
                          .totalDescuento > 0
                      "
                    >
                      <span
                        class="text-caption font-weight-medium"
                        >Descuento Total:</span
                      >
                      <span
                        class="text-body-2 font-weight-bold"
                      >
                        -
                        {{
                          formatedCurrency(
                            data.factura
                              .totalDescuento,
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
          class="px-4 py-3 bg-white justify-end flex-shrink-0"
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
            :disabled="
              data.contDisableBtn ||
              (!localEdit &&
                !data.sesionCaja
                  .tieneAperturaActiva)
            "
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
        <v-card
          class="rounded-xl overflow-hidden shadow-2xl border"
        >
          <!-- Header -->
          <v-card-title
            class="bg-indigo-darken-3 text-white px-4 py-3 d-flex align-center justify-space-between"
          >
            <div class="d-flex align-center">
              <v-icon size="22" class="mr-2"
                >mdi-card-account-details-outline</v-icon
              >
              <div>
                <div
                  class="text-subtitle-1 font-weight-bold leading-tight"
                >
                  Estado y Detalle de Crédito
                </div>
                <div
                  class="text-caption text-indigo-lighten-4"
                >
                  Consulta en tiempo real del
                  cliente
                </div>
              </div>
            </div>
            <v-btn
              icon
              variant="text"
              color="white"
              size="small"
              @click="
                data.dialogCredito.show = false
              "
            >
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <!-- Content -->
          <v-card-text
            class="pa-4 bg-grey-lighten-5"
          >
            <!-- Loading -->
            <div
              v-if="data.dialogCredito.loading"
              class="text-center py-8"
            >
              <v-progress-circular
                indeterminate
                color="indigo-darken-3"
                size="48"
                class="mb-3"
              />
              <div
                class="text-body-2 font-weight-medium text-grey-darken-2"
              >
                Consultando detalle de crédito...
              </div>
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
            <div
              v-else-if="data.dialogCredito.data"
              class="d-flex flex-column gap-3"
            >
              <!-- Nombre del Cliente -->
              <v-card
                class="pa-3 bg-white border rounded-lg"
                elevation="0"
              >
                <div
                  class="text-caption text-grey font-weight-bold text-uppercase"
                >
                  Cliente
                </div>
                <div
                  class="text-body-1 font-weight-bold text-indigo-darken-4"
                >
                  {{
                    data.dialogCredito.data
                      .nombre ||
                    (clienteSeleccionado
                      ? clienteSeleccionado.title
                      : 'Cliente')
                  }}
                </div>
                <div
                  v-if="
                    data.dialogCredito.data
                      .codigo ||
                    (clienteSeleccionado &&
                      clienteSeleccionado.codigo)
                  "
                  class="text-caption text-grey-darken-1"
                >
                  Código:
                  {{
                    data.dialogCredito.data
                      .codigo ||
                    clienteSeleccionado.codigo
                  }}
                </div>
              </v-card>

              <!-- Tarjetas de Métricas de Crédito -->
              <v-row dense class="mt-1">
                <!-- Límite de Crédito -->
                <v-col cols="6">
                  <v-card
                    class="pa-3 bg-white border rounded-lg h-100"
                    elevation="0"
                  >
                    <div
                      class="d-flex align-center text-caption text-grey-darken-1 mb-1"
                    >
                      <v-icon
                        size="16"
                        color="indigo"
                        class="mr-1"
                        >mdi-credit-card-outline</v-icon
                      >
                      <span>Límite Crédito</span>
                    </div>
                    <div
                      class="text-subtitle-1 font-weight-bold text-grey-darken-3"
                    >
                      <span
                        v-if="
                          data.dialogCredito.data
                            .esCreditoIlimitado ||
                          data.dialogCredito.data
                            .EsCreditoIlimitado
                        "
                        class="text-indigo"
                      >
                        Ilimitado
                      </span>
                      <span v-else>
                        {{
                          formatedCurrency(
                            data.dialogCredito
                              .data
                              .limiteCredito ??
                              data.dialogCredito
                                .data
                                .LimiteCredito ??
                              0,
                            data.fornates.nio
                          )
                        }}
                      </span>
                    </div>
                  </v-card>
                </v-col>

                <!-- Saldo Utilizado / Deuda -->
                <v-col cols="6">
                  <v-card
                    class="pa-3 bg-white border rounded-lg h-100"
                    elevation="0"
                  >
                    <div
                      class="d-flex align-center text-caption text-grey-darken-1 mb-1"
                    >
                      <v-icon
                        size="16"
                        color="orange-darken-3"
                        class="mr-1"
                        >mdi-clock-alert-outline</v-icon
                      >
                      <span>Crédito Usado</span>
                    </div>
                    <div
                      class="text-subtitle-1 font-weight-bold text-orange-darken-4"
                    >
                      {{
                        formatedCurrency(
                          data.dialogCredito.data
                            .creditoUsado ??
                            data.dialogCredito
                              .data
                              .CreditoUsado ??
                            data.dialogCredito
                              .data
                              .saldoUtilizado ??
                            data.dialogCredito
                              .data
                              .SaldoUtilizado ??
                            0,
                          data.fornates.nio
                        )
                      }}
                    </div>
                  </v-card>
                </v-col>

                <!-- Saldo Disponible -->
                <v-col cols="12" class="mt-1">
                  <v-card
                    class="pa-3 border rounded-lg"
                    :class="
                      getSaldoDisponibleCredito(
                        data.dialogCredito.data
                      ) > 0
                        ? 'bg-green-lighten-5 border-green'
                        : 'bg-red-lighten-5 border-red'
                    "
                    elevation="0"
                  >
                    <div
                      class="d-flex align-center justify-space-between"
                    >
                      <div>
                        <div
                          class="text-caption font-weight-bold"
                          :class="
                            getSaldoDisponibleCredito(
                              data.dialogCredito
                                .data
                            ) > 0
                              ? 'text-green-darken-4'
                              : 'text-red-darken-4'
                          "
                        >
                          Crédito Disponible
                        </div>
                        <div
                          class="text-h6 font-weight-black"
                          :class="
                            getSaldoDisponibleCredito(
                              data.dialogCredito
                                .data
                            ) > 0
                              ? 'text-green-darken-3'
                              : 'text-red-darken-3'
                          "
                        >
                          <span
                            v-if="
                              data.dialogCredito
                                .data
                                .esCreditoIlimitado ||
                              data.dialogCredito
                                .data
                                .EsCreditoIlimitado
                            "
                          >
                            Ilimitado
                          </span>
                          <span v-else>
                            {{
                              formatedCurrency(
                                getSaldoDisponibleCredito(
                                  data
                                    .dialogCredito
                                    .data
                                ),
                                data.fornates.nio
                              )
                            }}
                          </span>
                        </div>
                      </div>
                      <v-chip
                        size="small"
                        :color="
                          getSaldoDisponibleCredito(
                            data.dialogCredito
                              .data
                          ) > 0
                            ? 'success'
                            : 'error'
                        "
                        variant="flat"
                        class="font-weight-bold"
                      >
                        {{
                          getSaldoDisponibleCredito(
                            data.dialogCredito
                              .data
                          ) > 0
                            ? 'Línea Disponible'
                            : 'Límite Excedido'
                        }}
                      </v-chip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Detalles de Plazo y Facturas Pendientes -->
              <v-card
                class="pa-3 bg-white border rounded-lg mt-1"
                elevation="0"
              >
                <div
                  class="d-flex align-center justify-space-between py-1 border-b"
                >
                  <span
                    class="text-caption text-grey-darken-1"
                    >Tipo de Crédito:</span
                  >
                  <span
                    class="text-caption font-weight-bold text-grey-darken-3"
                  >
                    {{
                      data.dialogCredito.data
                        .esCreditoMensual ||
                      data.dialogCredito.data
                        .EsCreditoMensual
                        ? 'Crédito Mensual'
                        : 'Por Días'
                    }}
                  </span>
                </div>
                <div
                  class="d-flex align-center justify-space-between py-1 border-b"
                >
                  <span
                    class="text-caption text-grey-darken-1"
                    >Días de Crédito
                    Autorizados:</span
                  >
                  <span
                    class="text-caption font-weight-bold text-grey-darken-3"
                  >
                    {{
                      data.dialogCredito.data
                        .diasCredito ??
                      data.dialogCredito.data
                        .DiasCredito ??
                      '—'
                    }}
                    días
                  </span>
                </div>
                <div
                  class="d-flex align-center justify-space-between py-1"
                >
                  <span
                    class="text-caption text-grey-darken-1"
                    >Cuentas por Cobrar
                    Pendientes:</span
                  >
                  <span
                    class="text-caption font-weight-bold text-grey-darken-3"
                  >
                    {{
                      data.dialogCredito.data
                        .cuentasPorCobrarPendientes ??
                      data.dialogCredito.data
                        .CuentasPorCobrarPendientes ??
                      0
                    }}
                    pendientes
                  </span>
                </div>
              </v-card>

              <!-- Alerta de Comparativa y Bloqueo de Sobregiro -->
              <div
                v-if="data.factura.total > 0"
                class="mt-1"
              >
                <v-card
                  v-if="
                    data.factura.total >
                    getSaldoDisponibleCredito(
                      data.dialogCredito.data
                    )
                  "
                  class="pa-3 bg-red-lighten-5 border border-red-lighten-2 rounded-lg"
                  elevation="0"
                >
                  <div
                    class="d-flex align-center text-red-darken-4 font-weight-bold mb-2"
                  >
                    <v-icon
                      color="red-darken-3"
                      size="20"
                      class="mr-1"
                      >mdi-alert-octagon</v-icon
                    >
                    <span
                      >Venta Bloqueada: Límite de
                      Crédito Excedido</span
                    >
                  </div>

                  <div
                    class="d-flex align-center justify-space-between py-1 border-b border-red-lighten-4"
                  >
                    <span
                      class="text-caption text-grey-darken-2"
                      >Total de esta Venta:</span
                    >
                    <span
                      class="text-caption font-weight-bold text-grey-darken-3"
                    >
                      {{
                        formatedCurrency(
                          data.factura.total,
                          data.fornates.nio
                        )
                      }}
                    </span>
                  </div>

                  <div
                    class="d-flex align-center justify-space-between py-1 border-b border-red-lighten-4"
                  >
                    <span
                      class="text-caption text-grey-darken-2"
                      >Crédito Disponible:</span
                    >
                    <span
                      class="text-caption font-weight-bold text-grey-darken-3"
                    >
                      {{
                        formatedCurrency(
                          getSaldoDisponibleCredito(
                            data.dialogCredito
                              .data
                          ),
                          data.fornates.nio
                        )
                      }}
                    </span>
                  </div>

                  <div
                    class="d-flex align-center justify-space-between py-1 pt-2"
                  >
                    <span
                      class="text-caption font-weight-bold text-red-darken-4"
                      >Monto Excedente
                      (Sobregiro):</span
                    >
                    <span
                      class="text-subtitle-2 font-weight-black text-red-darken-4"
                    >
                      +
                      {{
                        formatedCurrency(
                          data.factura.total -
                            getSaldoDisponibleCredito(
                              data.dialogCredito
                                .data
                            ),
                          data.fornates.nio
                        )
                      }}
                    </span>
                  </div>

                  <div
                    class="text-caption text-red-darken-4 mt-2 bg-white pa-2 rounded border border-red-lighten-3"
                  >
                    <v-icon
                      size="14"
                      color="red"
                      class="mr-1"
                      >mdi-information</v-icon
                    >
                    No se puede registrar esta
                    factura a crédito. Debe
                    reducir productos o cambiar la
                    condición de pago a
                    <strong>Contado</strong>.
                  </div>
                </v-card>

                <v-card
                  v-else
                  class="pa-3 bg-green-lighten-5 border border-green-lighten-2 rounded-lg"
                  elevation="0"
                >
                  <div
                    class="d-flex align-center text-green-darken-4 font-weight-bold mb-1"
                  >
                    <v-icon
                      color="green-darken-3"
                      size="20"
                      class="mr-1"
                      >mdi-check-circle</v-icon
                    >
                    <span
                      >Crédito Suficiente para la
                      Venta</span
                    >
                  </div>
                  <div
                    class="d-flex align-center justify-space-between py-1 border-b border-green-lighten-4"
                  >
                    <span
                      class="text-caption text-grey-darken-2"
                      >Total de la Venta:</span
                    >
                    <span
                      class="text-caption font-weight-bold text-grey-darken-3"
                    >
                      {{
                        formatedCurrency(
                          data.factura.total,
                          data.fornates.nio
                        )
                      }}
                    </span>
                  </div>
                  <div
                    class="d-flex align-center justify-space-between py-1"
                  >
                    <span
                      class="text-caption text-grey-darken-2"
                      >Restante tras la
                      Venta:</span
                    >
                    <span
                      class="text-caption font-weight-bold text-green-darken-4"
                    >
                      {{
                        formatedCurrency(
                          getSaldoDisponibleCredito(
                            data.dialogCredito
                              .data
                          ) - data.factura.total,
                          data.fornates.nio
                        )
                      }}
                    </span>
                  </div>
                </v-card>
              </div>
            </div>
          </v-card-text>

          <!-- Footer -->
          <v-card-actions
            class="pa-3 bg-white border-t justify-end"
          >
            <v-btn
              color="indigo-darken-3"
              variant="flat"
              class="text-none font-weight-bold px-4"
              size="small"
              @click="
                data.dialogCredito.show = false
              "
            >
              Entendido
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal de Cobro y Cambio para Cajero (Minimalista) -->
      <v-dialog
        v-model="data.dialogCobro.show"
        max-width="420px"
        persistent
      >
        <v-card
          class="rounded-xl border bg-white"
          elevation="6"
        >
          <!-- Header Minimalista -->
          <div
            class="px-5 pt-4 pb-2 d-flex align-center justify-space-between"
          >
            <div class="d-flex align-center">
              <v-icon
                color="indigo-darken-3"
                size="20"
                class="mr-2"
                >mdi-cash-register</v-icon
              >
              <span
                class="text-subtitle-1 font-weight-bold text-grey-darken-4"
                >Cobro en Efectivo</span
              >
            </div>
            <v-btn
              icon
              size="x-small"
              variant="text"
              color="grey-darken-1"
              @click="cerrarDialogCobro()"
              :disabled="data.contDisableBtn"
            >
              <v-icon size="18">mdi-close</v-icon>
            </v-btn>
          </div>

          <v-card-text class="px-5 py-2">
            <!-- Total a Cobrar -->
            <div
              class="pa-3 rounded-lg bg-grey-lighten-4 border d-flex align-center justify-space-between mb-3"
            >
              <span
                class="text-caption font-weight-bold text-grey-darken-2 text-uppercase"
                >Total Factura:</span
              >
              <span
                class="text-h5 font-weight-black text-indigo-darken-4"
              >
                {{
                  formatedCurrency(
                    data.factura.total,
                    data.fornates.nio
                  )
                }}
              </span>
            </div>

            <!-- Input Efectivo Recibido -->
            <div class="mb-2">
              <div
                class="d-flex align-center justify-space-between mb-1"
              >
                <span
                  class="text-caption font-weight-bold text-grey-darken-2"
                  >Paga con:</span
                >
              </div>

              <v-text-field
                v-model="
                  data.dialogCobro.montoRecibido
                "
                prefix="C$"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                variant="outlined"
                density="compact"
                color="indigo"
                hide-details
                autofocus
                class="cashier-pago-input-minimal"
                @keyup.enter="
                  confirmarCobroYGuardar()
                "
              />
            </div>

            <!-- Denominaciones Rápidas -->
            <div
              class="d-flex flex-wrap gap-1 mb-3"
            >
              <v-chip
                v-for="billete in [
                  50, 100, 200, 500, 1000
                ]"
                :key="billete"
                size="small"
                variant="tonal"
                color="grey-darken-3"
                class="font-weight-bold cursor-pointer"
                @click="
                  agregarDenominacion(billete)
                "
              >
                +{{ billete }}
              </v-chip>
              <v-chip
                v-if="
                  data.dialogCobro.montoRecibido
                "
                size="small"
                variant="text"
                color="error"
                class="font-weight-bold cursor-pointer"
                @click="
                  data.dialogCobro.montoRecibido =
                    null
                "
              >
                Borrar
              </v-chip>
            </div>

            <!-- Estado del Cambio / Vuelto -->
            <div
              v-if="
                cobroMontoRecibidoNumber >=
                data.factura.total
              "
              class="pa-3 rounded-lg d-flex align-center justify-space-between"
              style="
                background-color: #f0fdf4;
                border: 1px solid #86efac;
              "
            >
              <span
                class="text-caption font-weight-bold text-green-darken-4 text-uppercase"
                >Cambio:</span
              >
              <span
                class="text-h5 font-weight-black text-green-darken-4"
              >
                {{
                  formatedCurrency(
                    cobroCambioCalculado,
                    data.fornates.nio
                  )
                }}
              </span>
            </div>

            <div
              v-else-if="
                cobroMontoRecibidoNumber > 0
              "
              class="pa-3 rounded-lg d-flex align-center justify-space-between"
              style="
                background-color: #fff7ed;
                border: 1px solid #fed7aa;
              "
            >
              <span
                class="text-caption font-weight-bold text-orange-darken-4 text-uppercase"
                >Faltan:</span
              >
              <span
                class="text-subtitle-1 font-weight-bold text-orange-darken-4"
              >
                {{
                  formatedCurrency(
                    cobroMontoFaltante,
                    data.fornates.nio
                  )
                }}
              </span>
            </div>

            <div
              v-else
              class="py-2 text-center text-caption text-grey"
            >
              <v-btn
                size="x-small"
                color="indigo-darken-3"
                class="font-weight-bold"
                @click="setMontoRecibidoExacto()"
              >
                Paga completo
              </v-btn>
            </div>
          </v-card-text>

          <!-- Botones de Acción -->
          <v-divider class="mt-2" />
          <div
            class="px-5 py-3 d-flex align-center justify-end gap-2 bg-grey-lighten-5"
          >
            <v-btn
              color="grey-darken-1"
              variant="text"
              size="small"
              @click="cerrarDialogCobro()"
              :disabled="data.contDisableBtn"
              class="text-none"
            >
              Cancelar
            </v-btn>

            <v-btn
              color="indigo-darken-4"
              variant="flat"
              size="small"
              @click="confirmarCobroYGuardar()"
              :disabled="
                data.contDisableBtn ||
                cobroMontoRecibidoNumber <
                  data.factura.total
              "
              class="text-none px-5 font-weight-bold"
            >
              <template
                v-if="data.contDisableBtn"
              >
                <v-progress-circular
                  color="white"
                  indeterminate
                  size="16"
                  width="2"
                  class="mr-1"
                />
                <span>Guardando...</span>
              </template>
              <template v-else>
                <span>Cobrar y Facturar</span>
              </template>
            </v-btn>
          </div>
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
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'
import {
  getItemsCombobox,
  httpGet
} from '@/scripts/api.js'
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
          width: '85px'
        },
        {
          title: 'Precio Unit.',
          key: 'costoUnitario',
          align: 'end',
          width: '95px'
        },
        {
          title: 'Desc. (C$)',
          key: 'descuento',
          align: 'end',
          width: '110px'
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
        descuento: null,
        observaciones: null
      },
      condicionFactura: [
        { title: 'Contado', value: 'contado' },
        { title: 'Crédito', value: 'credito' }
      ],
      factura: {
        subTotal: 0.0,
        totalDescuento: 0.0,
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

      // Modal de Cobro y Cambio para el Cajero
      dialogCobro: {
        show: false,
        montoRecibido: null,
        loading: false
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
        (c) =>
          c.value === data.venta.idCliente ||
          c.id === data.venta.idCliente ||
          c.idCliente === data.venta.idCliente
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

    const clienteTieneDescuento = computed(() => {
      if (!data.venta.idCliente) return false
      const cli = data.clientes.find(
        (c) =>
          c.value === data.venta.idCliente ||
          c.id === data.venta.idCliente ||
          c.idCliente === data.venta.idCliente
      )
      if (!cli) return false
      return !!(
        cli.esTieneDescuento ||
        cli.EsTieneDescuento
      )
    })

    const clienteSeleccionado = computed(() => {
      if (!data.venta.idCliente) return null
      return (
        data.clientes.find(
          (c) =>
            c.value === data.venta.idCliente ||
            c.id === data.venta.idCliente ||
            c.idCliente === data.venta.idCliente
        ) || null
      )
    })

    const cobroMontoRecibidoNumber = computed(
      () => {
        const val = parseFloat(
          data.dialogCobro.montoRecibido
        )
        return isNaN(val) ? 0 : val
      }
    )

    const cobroCambioCalculado = computed(() => {
      const total =
        Number(data.factura.total) || 0
      const recibido =
        cobroMontoRecibidoNumber.value
      return Math.max(
        0,
        parseFloat((recibido - total).toFixed(2))
      )
    })

    const cobroMontoFaltante = computed(() => {
      const total =
        Number(data.factura.total) || 0
      const recibido =
        cobroMontoRecibidoNumber.value
      return Math.max(
        0,
        parseFloat((total - recibido).toFixed(2))
      )
    })

    const setMontoRecibidoExacto = () => {
      data.dialogCobro.montoRecibido = parseFloat(
        Number(data.factura.total).toFixed(2)
      )
    }

    const agregarDenominacion = (monto) => {
      const actual =
        cobroMontoRecibidoNumber.value
      data.dialogCobro.montoRecibido = parseFloat(
        (actual + monto).toFixed(2)
      )
    }

    const cerrarDialogCobro = () => {
      data.dialogCobro.show = false
      data.dialogCobro.montoRecibido = null
    }

    const calcularFactura = () => {
      let subtotalNeto = 0
      let totalDescuento = 0
      let totalImpuestos = 0
      data.factura.subTotal = 0.0
      data.factura.totalDescuento = 0.0
      data.factura.totalImpuestos = 0.0
      data.factura.total = 0.0
      data.factura.usdTotal = 0.0

      data.items.forEach((item) => {
        const base =
          (Number(item.costoUnitario) || 0) *
          (Number(item.cantidad) || 0)
        const descuento =
          clienteTieneDescuento.value
            ? Math.min(
                base,
                Math.max(
                  0,
                  Number(item.descuento) || 0
                )
              )
            : 0
        item.descuento = descuento
        const baseGravable = Math.max(
          0,
          base - descuento
        )
        const montoImpuesto =
          baseGravable *
          ((Number(item.porcentajeImpuesto) ||
            0) /
            100)
        item.montoImpuesto = montoImpuesto
        item.subTotal =
          baseGravable + montoImpuesto
        subtotalNeto += base
        totalDescuento += descuento
        totalImpuestos += montoImpuesto
      })

      data.factura.subTotal = subtotalNeto
      data.factura.totalDescuento = totalDescuento
      data.factura.totalImpuestos = totalImpuestos
      data.factura.total = Math.max(
        0,
        subtotalNeto -
          totalDescuento +
          totalImpuestos
      )
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

        const idUsuario = parseInt(
          token.idusuario
        )
        data.sesionCaja.idUsuario = idUsuario
        data.sesionCaja.usuario =
          token.usuario || ''
        data.sesionCaja.nombre =
          localStorage.getItem('name') ||
          token.usuario ||
          ''

        // 1. Obtener apertura activa del usuario
        const resApertura = await httpGet(
          `api/usuarios/${idUsuario}/caja-activa`
        )
        if (
          resApertura &&
          resApertura.tieneAperturaActiva ===
            true &&
          resApertura.apertura
        ) {
          const ap = resApertura.apertura
          data.sesionCaja.tieneAperturaActiva = true
          data.sesionCaja.idAperturaCaja =
            ap.idAperturaCaja
          data.sesionCaja.idCaja = ap.idCaja
          data.sesionCaja.cajaCodigo =
            ap.cajaCodigo || ''
          data.sesionCaja.cajaNombre =
            ap.cajaNombre || ''
          if (ap.usuarioAperturaNombre) {
            data.sesionCaja.usuario =
              ap.usuarioAperturaNombre
          }

          // 2. Obtener datos de la caja (bodega y cajero si está disponible)
          const resCajas =
            await httpGet('api/cajas')
          const cajas = Array.isArray(resCajas)
            ? resCajas
            : Array.isArray(resCajas?.data)
              ? resCajas.data
              : []
          if (
            data.sesionCaja.idCaja &&
            cajas.length > 0
          ) {
            const caja = cajas.find(
              (c) =>
                c.idCaja ===
                data.sesionCaja.idCaja
            )
            if (caja) {
              data.sesionCaja.bodegaNombre =
                caja.bodegaNombre || ''
              data.sesionCaja.idBodega =
                caja.idBodega || null
              if (caja.cajeroUltimaSesionNombre) {
                data.sesionCaja.nombre =
                  caja.cajeroUltimaSesionNombre
              }
            }
          }
        } else {
          data.sesionCaja.tieneAperturaActiva = false
        }

        // 3. Obtener nombre completo del usuario si aún no está definido o es igual al username
        if (
          !data.sesionCaja.nombre ||
          data.sesionCaja.nombre ===
            data.sesionCaja.usuario
        ) {
          const resUsuarios = await httpGet(
            'api/usuario/listar'
          )
          const usuarios = Array.isArray(
            resUsuarios
          )
            ? resUsuarios
            : Array.isArray(resUsuarios?.data)
              ? resUsuarios.data
              : []
          if (usuarios.length > 0) {
            const u = usuarios.find(
              (x) =>
                (x.idusuario || x.idUsuario) ===
                  idUsuario ||
                x.username === token.usuario
            )
            if (u && u.nombre) {
              data.sesionCaja.nombre = u.nombre
            }
          }
        }
      } catch (err) {
        console.error(
          'Error cargando sesión activa de caja:',
          err
        )
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
          (c) =>
            c.value === newId ||
            c.id === newId ||
            c.idCliente === newId
        )
        const hasCred = !!(
          cli?.esTieneCredito ||
          cli?.EsTieneCredito ||
          cli?.creditoPermitido ||
          cli?.esCredito ||
          cli?.tieneCredito ||
          cli?.credito
        )
        if (
          !hasCred &&
          data.isCredito === 'credito'
        ) {
          data.isCredito = 'contado'
        }

        const hasDesc = !!(
          cli?.esTieneDescuento ||
          cli?.EsTieneDescuento
        )
        if (!hasDesc) {
          data.items.forEach((it) => {
            it.descuento = 0
          })
          if (data.producto.descuento) {
            data.producto.descuento = null
          }
          calcularFactura()
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
            if (
              !data.productos ||
              data.productos.length === 0
            ) {
              const prodResult =
                await data.requestHttp.getProductosSesionCaja()
              if (
                prodResult.code === 200 &&
                Array.isArray(prodResult.data)
              ) {
                data.productos =
                  prodResult.data.map((item) => ({
                    idProducto: item.idProducto,
                    codigo: item.codigo || '',
                    nombre: item.nombre,
                    title: `${item.codigo ? item.codigo + ' - ' : ''}${item.nombre}`,
                    precio: item.precio,
                    costo: item.costo,
                    cantidadTotal:
                      item.cantidadTotal,
                    cantidadTotalBodega:
                      item.cantidadTotalBodega,
                    cantidadTotalGeneral:
                      item.cantidadTotalGeneral,
                    esMayorista: item.esMayorista,
                    esFacturarSinInventario:
                      item.esFacturarSinInventario,
                    minimoVenta: item.minimoVenta,
                    preciosMayoristas:
                      item.preciosMayoristas ||
                      [],
                    impuestos:
                      item.impuestos || []
                  }))
              }
            }

            const result = await getVenta(
              props.idFact
            )
            if (result.code === 200) {
              data.venta = result.data
              data.editVenta.estado =
                result.data.estado
              data.editVenta.fechaRegistro =
                result.data.fechaRegistro
              data.editVenta.idVenta =
                result.data.idVenta
              data.editVenta.idClienteNavigation =
                result.data.idClienteNavigation
              data.isCredito = result.data.credito
                ? 'credito'
                : 'contado'

              const detalles =
                result.data.detalleVenta || []
              const mappedItems = detalles.map(
                (item) => {
                  const prod =
                    data.productos.find(
                      (p) =>
                        p.idProducto ===
                        item.idProducto
                    )
                  const qty =
                    Number(item.cantidad) || 0
                  const unitPrice =
                    Number(item.precioUnitario) ||
                    0
                  const subtotalBase =
                    qty * unitPrice
                  const desc = Number(
                    item.descuento ||
                      item.Descuento ||
                      0
                  )

                  // Evaluación de Precios Mayoristas
                  let esMayoristaAplicado = false
                  let rangoMayoristaText = ''
                  if (
                    prod?.esMayorista &&
                    prod?.preciosMayoristas &&
                    prod.preciosMayoristas
                      .length > 0
                  ) {
                    const matchingRange =
                      prod.preciosMayoristas.find(
                        (pm) =>
                          qty >= pm.minimo &&
                          (pm.rangoIndefinido ||
                            qty <= pm.maximo)
                      )
                    if (matchingRange) {
                      esMayoristaAplicado = true
                      rangoMayoristaText = `(${matchingRange.minimo}${matchingRange.maximo ? ' - ' + matchingRange.maximo : ' o más'})`
                    }
                  }

                  // Evaluación y Cálculo de Impuestos aplicables a la venta
                  const impuestosVenta = (
                    prod?.impuestos ||
                    item.impuestos ||
                    []
                  ).filter(
                    (i) => i.esAplicadoVenta
                  )
                  const porcentajeImpuestoTotal =
                    impuestosVenta.reduce(
                      (acc, imp) =>
                        acc +
                        (Number(
                          imp.valorPorcentual
                        ) || 0),
                      0
                    )
                  const baseGravable = Math.max(
                    0,
                    subtotalBase - desc
                  )
                  const montoImpuesto =
                    baseGravable *
                    (porcentajeImpuestoTotal /
                      100)

                  return {
                    idDetalleVenta:
                      item.idDetalleVenta,
                    idVenta: item.idVenta,
                    idProducto: item.idProducto,
                    codigo:
                      prod?.codigo ||
                      item.codigo ||
                      '',
                    producto:
                      prod?.nombre ||
                      item.producto ||
                      `Producto #${item.idProducto}`,
                    cantidad: qty,
                    costoUnitario: unitPrice,
                    descuento: desc,
                    precioRegular:
                      prod?.precio || unitPrice,
                    esMayorista:
                      esMayoristaAplicado,
                    rangoMayorista:
                      rangoMayoristaText,
                    impuestos: impuestosVenta,
                    porcentajeImpuesto:
                      porcentajeImpuestoTotal,
                    montoImpuesto: montoImpuesto,
                    subTotal:
                      Math.max(
                        0,
                        subtotalBase - desc
                      ) + montoImpuesto,
                    observaciones:
                      item.observaciones,
                    idProductoNavigation:
                      item.idProductoNavigation,
                    idVentaNavigation:
                      item.idVentaNavigation
                  }
                }
              )

              data.items = mappedItems
              calcularFactura()
            }
            data.overlay.show = false
          } catch (error) {
            data.overlay.show = false
            showAlert(
              1,
              'No se pudo cargar la factura',
              'error'
            )
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

    const NEGOCIO = {
      nombre: 'Migdalia\'s Market',
      direccion: 'Mercado Mayoreo Modulo #4',
      telefono: '2263-2783'
    }

    const ANCHO_TICKET = 48

    function formatedCurrency(key, currency) {
      return formatters.formatCurrency(key, currency || 'NIO')
    }

    function formateDate(dateString) {
      if (!dateString) return 'N/A'
      return formatters.formatDate(dateString)
    }

    function formatQty(qty) {
      const num = Number(qty) || 0
      return num % 1 === 0 ? num.toString() : num.toFixed(4).replace(/0+$/, '')
    }

    function adaptarDatosRegistro(data, respuestaGuardado = {}) {
      const clienteObj = data.clientes.find((c) => c.idCliente === data.venta.idCliente || c.value === data.venta.idCliente)
      const tipoVentaObj = data.tipoVenta.find((t) => t.idTipoVenta === data.venta.idTipoVenta || t.value === data.venta.idTipoVenta)
    
      return {
        venta: {
          noVenta: respuestaGuardado.noVenta ?? data.venta.noVenta ?? 'N/A',
          cliente: clienteObj?.title || clienteObj?.nombre || 'Consumidor Final',
          usuarioRegistro: respuestaGuardado.usuarioRegistro ?? data.sesionCaja?.nombre ?? data.sesionCaja?.usuario ?? 'N/A',
          tipoVenta: tipoVentaObj?.title || tipoVentaObj?.nombre || 'Venta General',
          credito: data.isCredito === 'credito',
          observaciones: data.venta.observaciones
        },
        editVenta: {
          estado: true,
          fechaRegistro: respuestaGuardado.fechaRegistro ?? new Date()
        },
        items: data.items,
        factura: data.factura,
        fomates: data.fornates // ojo: esta pantalla usa "fornates", no "fomates"
      }
    }
 
// ---------------------------------------------------------
// HELPERS DE FORMATO DE LÍNEA
// ---------------------------------------------------------
    function truncarOAjustar(texto, largo) {
      texto = String(texto ?? '')
      return texto.length > largo ? texto.slice(0, largo) : texto.padEnd(largo)
    }
    
    function lineaDosColumnas(izquierda, derecha, ancho = ANCHO_TICKET) {
      const espacio = ancho - izquierda.length - derecha.length
      return espacio > 0
        ? izquierda + ' '.repeat(espacio) + derecha + '\n'
        : izquierda.slice(0, ancho - derecha.length - 1) + ' ' + derecha + '\n'
    }
    
    // Cada ítem puede ocupar 2 líneas: nombre completo arriba,
    // cantidad/precio/subtotal abajo — así no se corta el nombre del producto.
    function lineasItem(item, fomatoNio) {
      const nombre = item.producto || 'Producto'
      const cant = this.formatQty ? this.formatQty(item.cantidad) : item.cantidad
      const precioUnit = this.formatedCurrency ? this.formatedCurrency(item.costoUnitario, fomatoNio) : item.costoUnitario
      const subtotal = this.formatedCurrency ? this.formatedCurrency(item.subTotal, fomatoNio) : item.subTotal
    
      let salida = `${nombre}\n`
      salida += lineaDosColumnas(`  ${cant} x ${precioUnit}`, subtotal)
    
      if (item.esMayorista) {
        salida += `  (Mayorista ${item.rangoMayorista})\n`
      }
      if (item.montoImpuesto > 0) {
        const impuesto = this.formatedCurrency ? this.formatedCurrency(item.montoImpuesto, fomatoNio) : item.montoImpuesto
        salida += `  IVA (${item.porcentajeImpuesto}%): ${impuesto}\n`
      }
    
      return salida
    }
 
// ---------------------------------------------------------
// FUNCIÓN PRINCIPAL DE IMPRESIÓN
// Llamala con el mismo objeto `data` que ya usa tu template:
//   await imprimirFactura(this.data)
// Si tus helpers (formatedCurrency, formatQty, formateDate) son
// métodos del componente, llamala con .call(this, data) para que
// mantengan acceso a `this`. Ver nota al final del archivo.
// ---------------------------------------------------------
    async function imprimirFactura(data) {
      try {
        const qz = window.qz
    
        if (!qz.websocket.isActive()) {
          await qz.websocket.connect()
        }
    
        const nombreImpresora = await qz.printers.find('POS-80C')
        const config = qz.configs.create(nombreImpresora)
    
        const { venta, editVenta, items, factura, fornates, dialogCobro, sesionCaja, clientes } = data
        const separador = '-'.repeat(ANCHO_TICKET) + '\n'
        const separadorBlank = ' '.repeat(ANCHO_TICKET) + '\n'
    
        const cuerpoItems = items.length
          ? items.map((item) => lineasItem.call(this, item, fornates.nio)).join(separador === '\n' ? '' : '')
          : 'Sin productos registrados\n'
    
        const ticket = [
          '\x1B\x40',                                    // init
          '\x1B\x61\x01',                                // centrar
          '\x1B\x21\x10',                                // doble altura
          '\x1B\x45\x01',                                // negrita ON
          `${NEGOCIO.nombre}\n`,
          '\x1B\x45\x00',                                // negrita OFF
          '\x1B\x21\x00',                                // fuente normal
          `${NEGOCIO.direccion}\n`,
          `Tel: ${NEGOCIO.telefono}\n`,
          separador,
    
          '\x1B\x61\x00',                                // alinear izquierda
          `Factura N°: ${venta.noVenta || 'N/A'}\n`,
          `Fecha: ${this.formateDate ? this.formateDate(editVenta.fechaRegistro) : editVenta.fechaRegistro}\n`,
          `Cliente: ${clientes.find((c) => c.id === venta.idCliente)?.nombre || 'Consumidor Final'}\n`,
          `Atendido por: ${sesionCaja.usuario || 'N/A'}\n`,
          `Tipo: ${venta.tipoVenta || 'Venta General'} | ${venta.credito ? 'Crédito' : 'Contado'}\n`,
    
          separadorBlank,

          lineaDosColumnas('PRODUCTOS', ''),
          separador,

          ...items.map((item) => lineasItem.call(this, item, fornates.nio)),
          
          separadorBlank,
          lineaDosColumnas('RESUMEN', ''),
          separador,
    
          lineaDosColumnas('Sub Total:', this.formatedCurrency ? this.formatedCurrency(factura.subTotal, fornates.nio) : factura.subTotal),
          factura.totalImpuestos > 0
            ? lineaDosColumnas('Impuestos:', this.formatedCurrency ? this.formatedCurrency(factura.totalImpuestos, fornates.nio) : factura.totalImpuestos)
            : '',
          '\x1B\x45\x01',                                // negrita ON (Emphasized mode, no descuadra el interlineado)
          lineaDosColumnas('TOTAL:', this.formatedCurrency ? this.formatedCurrency(factura.total, fornates.nio) : factura.total),
          '\x1B\x45\x00',                                // negrita OFF
          `Paga Con: ${this.formatedCurrency ? this.formatedCurrency(dialogCobro.montoRecibido, fornates.nio) : factura.usdTotal}\n`,
          `Cambio: ${this.formatedCurrency ? this.formatedCurrency(cobroCambioCalculado.value, fornates.nio) : cobroCambioCalculado.value}\n`,
    
          venta.observaciones ? `\nObs: ${venta.observaciones}\n` : '',
    
          separadorBlank,
          separadorBlank,
          '\x1B\x61\x01',                                // centrar
          '\n¡Gracias por su compra!\n\n\n',
          separadorBlank,
          separadorBlank,
          '\x1D\x56\x00'                                  // corte de papel
        ]
    
        await qz.print(config, ticket)
        console.log('Factura enviada a imprimir ✅')
      } catch (err) {
        console.error('Error al imprimir:', err)
      }
    }

    return {
      data,
      localShow,
      localEdit,
      localFact,
      localTitle,
      clienteTieneCredito,
      clienteTieneDescuento,
      clienteSeleccionado,
      cobroMontoRecibidoNumber,
      cobroCambioCalculado,
      cobroMontoFaltante,
      setMontoRecibidoExacto,
      agregarDenominacion,
      cerrarDialogCobro,
      showSuccesAlert,
      showAlert,
      getVenta,
      calcularFactura,
      cargarSesionCajaActiva,
      formatedCurrency,
      formateDate,
      formatQty,
      imprimirFactura,
      adaptarDatosRegistro
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
        await this.data.requestHttp.getProductosSesionCaja()
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
            cantidadTotalBodega:
              item.cantidadTotalBodega,
            cantidadTotalGeneral:
              item.cantidadTotalGeneral,
            esMayorista: item.esMayorista,
            esFacturarSinInventario:
              item.esFacturarSinInventario,
            minimoVenta: item.minimoVenta,
            preciosMayoristas:
              item.preciosMayoristas || [],
            impuestos: item.impuestos || []
          })
        )
      } else if (result.data?.msg) {
        this.showAlert(
          1,
          result.data.msg,
          'warning'
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

      const inputQty = parseFloat(
        Number(
          this.data.producto.cantidad
        ).toFixed(4)
      )
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
      let inputDescuento = this
        .clienteTieneDescuento
        ? Math.max(
            0,
            parseFloat(
              Number(
                this.data.producto.descuento || 0
              ).toFixed(2)
            )
          )
        : 0

      if (existingItemIndex !== -1) {
        const existingItem =
          this.data.items[existingItemIndex]
        totalQty = parseFloat(
          (
            totalQty +
            Number(existingItem.cantidad)
          ).toFixed(4)
        )
        inputDescuento = parseFloat(
          (
            inputDescuento +
            Number(existingItem.descuento || 0)
          ).toFixed(2)
        )
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
      const totalDescuentoLinea = this
        .clienteTieneDescuento
        ? Math.min(subtotalBase, inputDescuento)
        : 0
      const baseGravable = Math.max(
        0,
        subtotalBase - totalDescuentoLinea
      )
      const montoImpuesto =
        baseGravable *
        (porcentajeImpuestoTotal / 100)

      const itemData = {
        idProducto: prod.idProducto,
        codigo: prod.codigo,
        producto: prod.nombre,
        cantidad: totalQty,
        costoUnitario: precioUnitario,
        descuento: totalDescuentoLinea,
        precioRegular: prod.precio,
        esMayorista: esMayoristaAplicado,
        rangoMayorista: rangoMayoristaText,
        impuestos: impuestosVenta,
        porcentajeImpuesto:
          porcentajeImpuestoTotal,
        montoImpuesto: montoImpuesto,
        subTotal:
          Math.max(
            0,
            subtotalBase - totalDescuentoLinea
          ) + montoImpuesto,
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
      this.data.producto.descuento = null
      this.data.producto.observaciones = null
    },

    recalcularItem(item, nuevaCantidad) {
      if (!item) return
      let qty = parseFloat(
        Number(nuevaCantidad).toFixed(4)
      )
      if (isNaN(qty) || qty <= 0) {
        qty = 1
      }

      // Buscar producto en la lista en memoria
      const prod = this.data.productos.find(
        (p) => p.idProducto === item.idProducto
      )

      if (prod) {
        // Validar stock si no es facturar sin inventario
        if (
          !prod.esFacturarSinInventario &&
          prod.cantidadTotal < qty
        ) {
          this.showAlert(
            1,
            `Stock insuficiente para ${prod.nombre}. Stock disponible: ${prod.cantidadTotal}`,
            'warning'
          )
          qty = Math.max(
            0.0001,
            parseFloat(
              Number(prod.cantidadTotal).toFixed(
                4
              )
            )
          )
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
                qty >= pm.minimo &&
                (pm.rangoIndefinido ||
                  qty <= pm.maximo)
            )
          if (matchingRange) {
            precioUnitario = matchingRange.precio
            esMayoristaAplicado = true
            rangoMayoristaText = `(${matchingRange.minimo}${matchingRange.maximo ? ' - ' + matchingRange.maximo : ' o más'})`
          }
        }

        // Evaluación de Impuestos aplicables a la venta
        const impuestosVenta = (
          prod.impuestos || []
        ).filter((i) => i.esAplicadoVenta)
        const porcentajeImpuestoTotal =
          impuestosVenta.reduce(
            (acc, imp) =>
              acc + (imp.valorPorcentual || 0),
            0
          )
        const subtotalBase = qty * precioUnitario
        const desc = this.clienteTieneDescuento
          ? Math.min(
              subtotalBase,
              Math.max(
                0,
                Number(item.descuento) || 0
              )
            )
          : 0
        const baseGravable = Math.max(
          0,
          subtotalBase - desc
        )
        const montoImpuesto =
          baseGravable *
          (porcentajeImpuestoTotal / 100)

        item.cantidad = qty
        item.costoUnitario = precioUnitario
        item.descuento = desc
        item.esMayorista = esMayoristaAplicado
        item.rangoMayorista = rangoMayoristaText
        item.porcentajeImpuesto =
          porcentajeImpuestoTotal
        item.montoImpuesto = montoImpuesto
        item.subTotal =
          baseGravable + montoImpuesto
      } else {
        const subtotalBase =
          (Number(item.costoUnitario) || 0) * qty
        const desc = this.clienteTieneDescuento
          ? Math.min(
              subtotalBase,
              Math.max(
                0,
                Number(item.descuento) || 0
              )
            )
          : 0
        const baseGravable = Math.max(
          0,
          subtotalBase - desc
        )
        const montoImpuesto =
          baseGravable *
          ((Number(item.porcentajeImpuesto) ||
            0) /
            100)
        item.cantidad = qty
        item.descuento = desc
        item.montoImpuesto = montoImpuesto
        item.subTotal =
          baseGravable + montoImpuesto
      }

      this.calcularFactura()
    },

    onDescuentoInputChange(item, event) {
      if (!this.clienteTieneDescuento) {
        item.descuento = 0
        this.recalcularItem(item, item.cantidad)
        return
      }
      let val = parseFloat(event.target.value)
      if (isNaN(val) || val < 0) val = 0
      const subtotalBase =
        (Number(item.costoUnitario) || 0) *
        (Number(item.cantidad) || 0)
      if (val > subtotalBase) {
        val = subtotalBase
        this.showAlert(
          1,
          `El descuento no puede superar el subtotal (${this.formatedCurrency(subtotalBase, this.data.fornates.nio)})`,
          'warning'
        )
      }
      item.descuento = parseFloat(val.toFixed(2))
      this.recalcularItem(item, item.cantidad)
    },

    incrementarCantidad(item) {
      const current = Number(item.cantidad) || 0
      this.recalcularItem(
        item,
        parseFloat((current + 1).toFixed(4))
      )
    },

    decrementarCantidad(item) {
      const current = Number(item.cantidad) || 0
      if (current > 1) {
        this.recalcularItem(
          item,
          parseFloat((current - 1).toFixed(4))
        )
      } else if (current > 0.0001) {
        this.recalcularItem(
          item,
          Math.max(
            0.0001,
            parseFloat((current - 0.1).toFixed(4))
          )
        )
      }
    },

    onCantidadInputChange(item, event) {
      const val = parseFloat(event.target.value)
      this.recalcularItem(
        item,
        isNaN(val)
          ? 1
          : parseFloat(val.toFixed(4))
      )
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
          if (
            !this.data.sesionCaja
              .tieneAperturaActiva
          ) {
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
              const resCredito =
                await this.data.requestHttp.getDetalleCreditoCliente(
                  this.data.venta.idCliente
                )
              this.data.overlay.show = false

              if (
                resCredito.code === 200 &&
                resCredito.data
              ) {
                this.data.dialogCredito.data =
                  resCredito.data
                const disponible =
                  this.getSaldoDisponibleCredito(
                    resCredito.data
                  )

                if (
                  this.data.factura.total >
                  disponible
                ) {
                  const excedente =
                    this.data.factura.total -
                    disponible
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

            // Venta a crédito autorizada: proceder a guardar directamente
            await this.ejecutarGuardadoFactura()
          } else {
            // Venta de Contado: abrir diálogo de cobro y cálculo de cambio para el cajero
            this.data.dialogCobro.montoRecibido =
              null
            this.data.dialogCobro.show = true
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
              const resCredito =
                await this.data.requestHttp.getDetalleCreditoCliente(
                  this.data.venta.idCliente
                )
              this.data.overlay.show = false

              if (
                resCredito.code === 200 &&
                resCredito.data
              ) {
                this.data.dialogCredito.data =
                  resCredito.data
                const disponible =
                  this.getSaldoDisponibleCredito(
                    resCredito.data
                  )

                if (
                  this.data.factura.total >
                  disponible
                ) {
                  const excedente =
                    this.data.factura.total -
                    disponible
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

          await this.ejecutarGuardadoFactura()
        }
      } catch (error) {
        console.error(error)
      }
    },

    async confirmarCobroYGuardar() {
      if (
        this.cobroMontoRecibidoNumber <
        this.data.factura.total
      ) {
        this.showAlert(
          2,
          `El monto recibido (${this.formatedCurrency(this.cobroMontoRecibidoNumber, this.data.fornates.nio)}) es insuficiente para cubrir el total (${this.formatedCurrency(this.data.factura.total, this.data.fornates.nio)}).`,
          'warning'
        )
        return
      }
      this.data.dialogCobro.show = false
      await this.ejecutarGuardadoFactura()
    },

    async ejecutarGuardadoFactura() {
      try {
        if (!this.localEdit) {
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
                descuento: this
                  .clienteTieneDescuento
                  ? Number(item.descuento || 0)
                  : 0,
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
            this.imprimirFactura.call(this, this.data)
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

            if (
              result.data?.code === 400.1 ||
              result.data?.code === 400.2 ||
              result.code === 404 ||
              result.code === 401
            ) {
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
          this.data.venta.detalleVenta =
            this.data.items.map((item) => ({
              idVenta: item.idVenta,
              idProducto: item.idProducto,
              cantidad: item.cantidad,
              precioUnitario: item.costoUnitario,
              descuento: this
                .clienteTieneDescuento
                ? Number(item.descuento || 0)
                : 0,
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
        this.data.contDisableBtn = false
        this.data.overlay.show = false
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
      this.data.dialogCredito.idClienteConsultado =
        idCliente

      try {
        const result =
          await this.data.requestHttp.getDetalleCreditoCliente(
            idCliente
          )
        if (result.code === 200 && result.data) {
          this.data.dialogCredito.data =
            result.data
        } else {
          this.data.dialogCredito.error =
            'No se pudo obtener el detalle de crédito del cliente.'
        }
      } catch (e) {
        this.data.dialogCredito.error =
          'Error de conexión al consultar el detalle de crédito.'
      } finally {
        this.data.dialogCredito.loading = false
      }
    },

    getSaldoDisponibleCredito(creditoData) {
      if (!creditoData) return 0
      if (
        creditoData.esCreditoIlimitado ||
        creditoData.EsCreditoIlimitado
      ) {
        return Infinity
      }
      if (
        creditoData.creditoDisponible !==
          undefined &&
        creditoData.creditoDisponible !== null
      ) {
        return Number(
          creditoData.creditoDisponible
        )
      }
      if (
        creditoData.CreditoDisponible !==
          undefined &&
        creditoData.CreditoDisponible !== null
      ) {
        return Number(
          creditoData.CreditoDisponible
        )
      }
      if (
        creditoData.saldoDisponible !==
          undefined &&
        creditoData.saldoDisponible !== null
      ) {
        return Number(creditoData.saldoDisponible)
      }
      if (
        creditoData.SaldoDisponible !==
          undefined &&
        creditoData.SaldoDisponible !== null
      ) {
        return Number(creditoData.SaldoDisponible)
      }
      const lim = Number(
        creditoData.limiteCredito ??
          creditoData.LimiteCredito ??
          0
      )
      const util = Number(
        creditoData.creditoUsado ??
          creditoData.CreditoUsado ??
          creditoData.saldoUtilizado ??
          creditoData.SaldoUtilizado ??
          0
      )
      return Math.max(0, lim - util)
    },

    // formatedCurrency(key, currency) {
    //   return formatters.formatCurrency(
    //     key,
    //     currency
    //   )
    // },

    // formatedDate(dataString) {
    //   return formatters.formatDate(dataString)
    // },

    closeDialog() {
      this.data.dialogCobro.show = false
      this.data.dialogCobro.montoRecibido = null
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

.condition-tab-btn:hover:not(:disabled):not(
    .disabled
  ) {
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
  border-radius: 4px;
  padding: 1px 2px;
  border: 1px solid #e2e8f0;
}

.quantity-btn {
  width: 18px !important;
  height: 18px !important;
  min-width: 18px !important;
  border-radius: 3px;
}

.quantity-input {
  width: 40px;
  height: 20px;
  border: 1px solid transparent;
  background: #ffffff;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e293b;
  outline: none;
  padding: 0 2px;
  transition: all 0.2s ease;
  appearance: textfield;
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

.discount-input {
  width: 64px;
  height: 22px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #7e22ce;
  padding: 0 4px;
  outline: none;
  transition: all 0.2s ease;
  appearance: textfield;
}

.discount-input::-webkit-outer-spin-button,
.discount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.discount-input:focus {
  border-color: #7e22ce;
  box-shadow: 0 0 0 2px rgba(126, 34, 206, 0.15);
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

:deep(.cashier-pago-input-minimal input),
:deep(.cashier-pago-input input) {
  font-size: 1.25rem !important;
  font-weight: 800 !important;
  color: #1e1b4b !important;
  text-align: right !important;
}

:deep(
  .cashier-pago-input-minimal .v-field__prefix
),
:deep(.cashier-pago-input .v-field__prefix) {
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  color: #4338ca !important;
}
</style>