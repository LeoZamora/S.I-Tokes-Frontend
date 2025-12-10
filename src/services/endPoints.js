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
    postProducto: 'api/Producto',
    putProducto: 'api/Producto',
    deleteProducto: 'api/Producto',

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

    getCompra: 'api/Compra',
    postCompra: 'api/Compra',
    putCompra: 'api/Compra',
    deleteCompra: 'api/Compra',
    geCodeCompra: 'api/Compra/codigo-recomendado',

    getCliente: 'api/Cliente',
    postCliente: 'api/Cliente',
    putCliente: 'api/Cliente',
    deleteCliente: 'api/Cliente',

    getRutas: 'api/rutas',
    postRutas: 'api/rutas',
    putRutas: 'api/rutas',

    getCategoriaCliente: 'api/CategoriaCliente',
    postCategoriaCliente: 'api/CategoriaCliente',
    putCategoriaCliente: 'api/CategoriaCliente',
    deleteCategoriaCliente: 'api/CategoriaCliente',

    getVenta: 'api/Venta',
    postVenta: 'api/Venta',
    putVenta: 'api/Venta',
    deleteVenta: 'api/Venta',
    getTipoVenta: 'api/tipos-venta/combobox',
    anularVenta: 'api/Venta',

    getUsuario: 'api/Usuario',
    postUsuario: 'api/Usuario/Crear',
    postUsuarioLogin: 'api/Usuario/Login',

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

    //getTipoMov: 'api/tipos-movimiento/combobox',
    getTipoMovById: 'api/tipos-movimiento/',
    putTipoMov: 'api/tipos-movimiento/',
    postTipoMov: 'api/tipos-movimiento',

    //getTipoVenta: 'api/tipos-ventas/combobox',
    getTipoVentaById: 'api/tipos-ventas/',
    putTipoVenta: 'api/tipos-ventas/',
    postTipoVenta: 'api/tipos-ventas',
}

export default endPoints