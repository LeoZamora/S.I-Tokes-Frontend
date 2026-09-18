const endPoints = {
    getCategoria: 'api/CategoriaProducto',
    postCategoria: 'api/CategoriaProducto',
    putCategoria: 'api/CategoriaProducto',
    deleteCategoria: 'api/CategoriaProducto',

    getSubCategoria: 'api/SubCatProducto',
    postSubCategoria: 'api/SubCatProducto',
    putSubCategoria: 'api/SubCatProducto',
    deleteSubCategoria: 'api/SubCatProducto',
    getCode: 'api/SubCatProducto/codigo-recomendado',

    getProducto: 'api/Producto',
    getProductosDetalleVenta: 'api/Producto/detalle-venta',
    postProducto: 'api/Producto',
    putProducto: 'api/Producto',
    deleteProducto: 'api/Producto',
    postAsignarProductoBodegas: 'api/Producto/asignar-bodegas',

    getProveedor: 'api/Proveedor',
    postProveedor: 'api/Proveedor',
    putProveedor: 'api/Proveedor',
    deleteProveedor: 'api/Proveedor',

    getTipoProveedor: 'api/TipoProveedor',
    postTipoProveedor: 'api/TipoProveedor',
    putTipoProveedor: 'api/TipoProveedor',
    deleteTipoProveedor: 'api/TipoProveedor',

    getProveedorProducto: 'api/ProveedorProducto',
    postProveedorProducto: 'api/ProveedorProducto',
    putProveedorProducto: 'api/ProveedorProducto',
    deleteProveedorProducto: 'api/ProveedorProducto',

    getCompra: 'api/compras',
    postCompra: 'api/compras',
    putCompra: 'api/compras',
    deleteCompra: 'api/compras',
    geCodeCompra: 'api/compras/codigo-recomendado',
    getCompraMovimientoInventario: 'api/compras',

    getCliente: 'api/Cliente',
    getClienteDetalleCredito: 'api/Cliente/detalle-credito',
    postCliente: 'api/Cliente',
    putCliente: 'api/Cliente',
    deleteCliente: 'api/Cliente',
    getTipoDocumentoCombobox: 'api/TipoDocumento/combobox',

    getRutas: 'api/rutas',
    postRutas: 'api/rutas',
    putRutas: 'api/rutas',

    getCategoriaCliente: 'api/CategoriaCliente',
    postCategoriaCliente: 'api/CategoriaCliente',
    putCategoriaCliente: 'api/CategoriaCliente',
    deleteCategoriaCliente: 'api/CategoriaCliente',

    getVenta: 'api/Venta',
    postVenta: 'api/v2/venta',
    putVenta: 'api/Venta',
    deleteVenta: 'api/Venta',
    getTipoVenta: 'api/tipos-venta/combobox',
    anularVenta: 'api/Venta',

    getUsuario: 'api/Usuario',
    postUsuario: 'api/Usuario/Crear',
    postUsuarioLogin: 'api/Usuario/Login',
    putEstadoUsuario: 'api/Usuario',

    getRol: 'api/Rol',
    postRol: 'api/Rol',
    getByIdRol: 'api/Rol/Permisos',
    putRol: 'api/Rol/EditarPermisos',

    getDepartamentos: 'api/departamentos/combobox',
    getMunicipios: 'api/municipios/combobox',
    getTipoMov: 'api/tipos-movimiento/combobox',
    getModalidades: 'api/modalidades/combobox',
    getConcepto: 'api/conceptos-tipo-mov/combobox',

    getMov: 'api/movimientos',
    postMov: 'api/movimientos',
    putMov: 'api/movimientos',
    deleteMov: 'api/movimientos',

    getUnidadMedida: 'api/unidades-medida/combobox',
    postUnidadMedida: 'api/unidades-medida',
    getImpuestos: 'api/impuestos/combobox',

    //getTipoMov: 'api/tipos-movimiento/combobox',
    getTipoMovById: 'api/tipos-movimiento/',
    putTipoMov: 'api/tipos-movimiento/',
    postTipoMov: 'api/tipos-movimiento',

    //getTipoVenta: 'api/tipos-ventas/combobox',
    getTipoVentaById: 'api/tipos-ventas/',
    putTipoVenta: 'api/tipos-ventas/',
    postTipoVenta: 'api/tipos-ventas',

    // PEDIDOS
    getPedidosListado: 'api/pedidos/listado',
    postPedido: 'api/pedidos',
    getPedido: 'api/pedidos',
    getPedidosEstados: 'api/pedidos/estados',

    // CAJA
    getCajas: 'api/cajas',
    getAperturasCaja: 'api/aperturas-caja',
    getAperturaCajaById: 'api/aperturas-caja',
    getAperturaPreviewStock: 'api/aperturas-caja/preview-stock',
    postAperturaCaja: 'api/aperturas-caja',
    getArqueosCaja: 'api/arqueos-caja',
    postArqueoCaja: 'api/arqueos-caja',
    postCierreCaja: 'api/cierres-caja',

    // IMPORTACIONES
    getExpedienteImportacion: 'api/ExpedienteImportacion',
    getExpedienteImportacionFiltrar: 'api/ExpedienteImportacion/filtrar',
    postExpedienteImportacion: 'api/ExpedienteImportacion',
    putExpedienteImportacion: 'api/ExpedienteImportacion',
    deleteExpedienteImportacion: 'api/ExpedienteImportacion',

    subirDocumentoImportacion: 'api/DocumentoImportacion/subir',
    getDocumentosPorExpediente: 'api/DocumentoImportacion/expediente',
    getDocumentoImportacion: 'api/DocumentoImportacion',
    getUrlFirmadaDocumento: 'api/DocumentoImportacion',
    descargarDocumentoImportacion: 'api/DocumentoImportacion',
    deleteDocumentoImportacion: 'api/DocumentoImportacion',
    getTipoDocumentoImportacionCombobox: 'api/TipoDocumento/combobox',

    // TRASLADOS
    postTraslado: 'api/traslados',
    getTraslados: 'api/traslados',

    // BODEGAS COMBOBOX
    getBodegasCombobox: 'api/bodegas/combobox',
    getStockBodegas: 'api/bodegas/stock-bodegas'
}

export default endPoints