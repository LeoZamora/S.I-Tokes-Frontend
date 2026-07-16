import axios from "axios";
import endPoints from "./endPoints";

class RequestHttp {
    // CATEGORIAS
    async getCategorias() {
        try {
            const result  = await axios.get(endPoints.getCategoria)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async getByIdCategorias(id) {
        try {
            const result  = await axios.get(`${endPoints.getCategoria}/${id}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async postCategorias(data) {
        try {
            const result  = await axios.post(endPoints.postCategoria, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async putCategorias(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putCategoria}/${id}`, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async deleteCategorias(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteCategoria}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }


    // SUBCATEGORIAS
    async getSubCategorias() {
        try {
            const result  = await axios.get(endPoints.getSubCategoria)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async getCodeSub(id) {
        try {
            const result  = await axios.get(`${endPoints.getCode}?idCategoria=${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async getByIdSubCategorias(id) {
        try {
            const result  = await axios.get(`${endPoints.getSubCategoria}/${id}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async postSubCategorias(data) {
        try {
            const result  = await axios.post(endPoints.postSubCategoria, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async putSubCategorias(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putSubCategoria}/${id}`, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async deleteSubCategorias(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteSubCategoria}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }

    // PRODUCTOS
    async getProductos(type = null) {
        try {
            var url = endPoints.getProducto
            if(type){
                url = `${endPoints.getProducto}?tipoProducto=${type}`
            }
            const result  = await axios.get(url)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async getByIdProducto(id) {
        try {
            const result  = await axios.get(`${endPoints.getProducto}/${id}`)
            return result.data
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async postProducto(data) {
        try {
            const result  = await axios.post(endPoints.postProducto, data)
            return result.data
        } catch (error) {
            return null
        }
    }
    async putProductos(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putProducto}/${id}`, data)
            return result.data
        } catch (error) {

            return null
        }
    }
    async deleteProducto(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteProducto}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }

     // PROVEEDORES
    async getProveedores() {
        try {
            const result  = await axios.get(endPoints.getProveedor)
            return result.data
        } catch (error) {
            return null
            
        }
    }
    async getByIdProveedor(id) {
        try {
            const result  = await axios.get(`${endPoints.getProveedor}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postProveedor(data) {
        try {
            const result  = await axios.post(endPoints.postProveedor, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async putProveedor(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putProveedor}/${id}`, data)
            return result.data
        } catch (error) {

            return null
        }
    }
    async deleteProveedor(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteProveedor}/${id}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    // TIPO PROVEEDORES
    async getTipoProveedores() {
        try {
            const result  = await axios.get(endPoints.getTipoProveedor)
            return result.data
        } catch (error) {
            return null
            
        }
    }
    async getByIdTipoProveedor(id) {
        try {
            const result  = await axios.get(`${endPoints.getTipoProveedor}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postTipoProveedor(data) {
        try {
            const result  = await axios.post(endPoints.postTipoProveedor, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async putTipoProveedor(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putTipoProveedor}/${id}`, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async deleteTipoProveedor(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteTipoProveedor}/${id}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    // PROVEEDOR PRODUCTO
    async getProveedorProductos() {
        try {
            const result  = await axios.get(endPoints.getProveedorProducto)
            return result.data
        } catch (error) {
            return null
            
        }
    }
    async getByIdProveedorProducto(id) {
        try {
            const result  = await axios.get(`${endPoints.getProveedorProducto}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postProveedorProducto(data) {
        try {
            const result  = await axios.post(endPoints.postProveedorProducto, data)
            return result.data
        } catch (error) {
            return null
        }
    }
    async putProveedorProducto(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putProveedorProducto}/${id}`, data)
            return result.data
        } catch (error) {

            return null
        }
    }
    async deleteProveedorProducto(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteProveedorProducto}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }

    // COMPRAS
    async getCompras() {
        try {
            const result  = await axios.get(endPoints.getCompra)
            return result.data
        } catch (error) {
            return null
            
        }
    }
    async getByIdCompra(id) {
        try {
            const result  = await axios.get(`${endPoints.getCompra}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postCompra(data) {
        try {
            const result  = await axios.post(endPoints.postCompra, data)
            return {
                code: result.status,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async putCompra(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putCompra}/${id}`, data)
            return result.data
        } catch (error) {
            return null
        }
    }
    async deleteCompra(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteCompra}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }

    // VENTAS
    async getVentas() {
        try {
            const result  = await axios.get(endPoints.getVenta)
            return result.data
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async getTipoVentas() {
        try {
            const result  = await axios.get(endPoints.getTipoVenta)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async getByIdVenta(id) {
        try {
            const result  = await axios.get(`${endPoints.getVenta}/${id}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async postVenta(data) {
        try {
            const result  = await axios.post(endPoints.postVenta, data)
            return {
                code: result?.data?.code ?? result.status,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async putVenta(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putVenta}/${id}`, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async deleteVenta(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteVenta}/${id}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    // CLIENTES
    async getClientes() {
        try {
            const result  = await axios.get(endPoints.getCliente)
            return result.data
        } catch (error) {
            return null
        }
    }
    async getByIdCliente(id) {
        try {
            const result  = await axios.get(`${endPoints.getCliente}/${id}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async postCliente(data) {
        try {
            const result  = await axios.post(endPoints.postCliente, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async putCliente(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putCliente}/${id}`, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {

            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async deleteCliente(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteCliente}/${id}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    // CATEGORIA CLIENTES
    async getCategoriaClientes() {
        try {
            const result  = await axios.get(endPoints.getCategoriaCliente)
            return result.data
        } catch (error) {
            return null
        }
    }
    async getByIdCategoriaCliente(id) {
        try {
            const result  = await axios.get(`${endPoints.getCategoriaCliente}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postCategoriaCliente(data) {
        try {
            const result  = await axios.post(endPoints.postCategoriaCliente, data)
            return result.data
        } catch (error) {
            return null
        }
    }
    async putCategoriaCliente(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putCategoriaCliente}/${id}`, data)
            return result.data
        } catch (error) {

            return null
        }
    }
    async deleteCategoriaCliente(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteCategoriaCliente}/${id}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }


    // USUARIOS
    async getUsuarios() {
        try {
            const result  = await axios.get(endPoints.getUsuario)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async postUsuario(data) {
        try {
            const result = await axios.post(endPoints.postUsuario, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async postLogin(data) {
        try {
            const result  = await axios.post(endPoints.postUsuarioLogin, {
                "usuario": data.usuario,
                "password": data.password
            })
            return result.data
        } catch (error) {
            return error.response.data
        }
    }

    async putUser(id, estado) {
        try {
            const result  = await axios.put(`${endPoints.putEstadoUsuario}/${id}/estado?estado=${estado}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    // ROLES
    async getRoles() {
        try {
            const result  = await axios.get(endPoints.getRol)
            return result.data
        } catch (error) {
            return null
        }
    }
    async getByIdRol(id) {
        try {
            const result  = await axios.get(`${endPoints.getByIdRol}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postRol(data) {
        try {
            const result  = await axios.post(endPoints.postRol, data)
            return result.data
        } catch (error) {
            return null
        }
    }
    async putRol(data) {
        try {
            const result  = await axios.put(endPoints.putRol, data)
            return result.data
        } catch (error) {
            return null
        }
    }

    // RUTAS
    async getRutas() {
        try {
            const result  = await axios.get(endPoints.getRutas)
            return result.data
        } catch (error) {
            return null
        }
    }
    async getByIdRuta(id) {
        try {
            const result  = await axios.get(`${endPoints.getRutas}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postRuta(data) {
        try {
            const result  = await axios.post(endPoints.postRutas, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async putRuta(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putRutas}/${id}`, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async getDepartamentos() {
        try {
            const result  = await axios.get(endPoints.getDepartamentos)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async getMunById(id) {
        try {
            const result  = await axios.get(`${endPoints.getMunicipios}?idDepartamento=${id}`)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }


    // MOVIMIENTOS
    async getMovs() {
        try {
            const result  = await axios.get(endPoints.getMov)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async getByIdMov(id) {
        try {
            const result  = await axios.get(`${endPoints.getMov}/${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postMov(data) {
        try {
            const result  = await axios.post(endPoints.postMov, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }
    async putMov(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putMov}/${id}`, data)
            return {
                code: 200,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }


    // COMBOBOX
    async getCombobox(url) {
        try {
            const result  = await axios.get(url)
            return {
                data: result.data,
                code: 200
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async getConceptoMov(id) {
        try {
            const result  = await axios.get(`${endPoints.getConcepto}?idTipoMov=${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }

    // UNIDADES DE MEDIDA
    async getUnidadMedida() {
        try {
            const result  = await axios.get(endPoints.getUnidadMedida)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postUnidadMedida(data) {
        try {
            const result = await axios.post(endPoints.postUnidadMedida, data)
            return result.data
        } catch (error) {
            return null
        }
    }


    // TIPO DE MOVIMIENTOS
    async getByIdTipoMov(id) {
        try {
            const result  = await axios.get(`${endPoints.getTipoMovById}${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postTipoMov(data) {
        try {
            const result  = await axios.post(endPoints.postTipoMov, data)
            return result.data
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async putTipoMov(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putTipoMov}${id}`, data)
            return result.data
        } catch (error) {
            return null
        }
    }

    // TIPO DE VENTAS
    async getByIdTipoVen(id) {
        try {
            const result  = await axios.get(`${endPoints.getTipoVentaById}${id}`)
            return result.data
        } catch (error) {
            return null
        }
    }
    async postTipoVenta(data) {
        try {
            const result  = await axios.post(endPoints.postTipoVenta, data)
            return result.data
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async putTipoVenta(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putTipoVenta}${id}`, data)
            return result.data
        } catch (error) {
            return null
        }
    }


    async anularVenta(id) {
        try {
            const result  = await axios.put(`${endPoints.anularVenta}/${id}/anulacion`)
            return {
                data: result.data,
                code: 200
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    // CODIGO RECOMENDADO
    async getCodigo() {
        try {
            const result  = await axios.get('api/Compra/codigo-recomendado')
            return {
                code: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }


    // CONCEPTOS
    async getConceptos(id) {
        try {
            const result  = await axios.get(`api/conceptos-tipo-mov?idTipoMov=${id}`)
            return {
                code: result.status,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async getConceptosById(id) {
        try {
            const result  = await axios.get(`api/conceptos-tipo-mov/${id}`)
            return {
                code: result.status,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async postConceptos(data) {
        try {
            const result  = await axios.post(`api/conceptos-tipo-mov`, data)
            return {
                code: result.status,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async putConceptos(data, id) {
        try {
            const result  = await axios.put(`api/conceptos-tipo-mov/${id}`, data)
            return {
                code: result.status,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    async putEstadoConcepto(estado, id) {
        try {
            const result  = await axios.put(`api/conceptos-tipo-mov/${id}/estado?estado=${estado}`)
            return {
                code: result.status,
                data: result.data
            }
        } catch (error) {
            return {
                code: error.response.status,
                data: error.response.data
            }
        }
    }

    // SUCURSALES
    async getSucursales() {
        try {
            const result = await axios.get('api/sucursales')
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async postSucursal(data) {
        try {
            const result = await axios.post('api/sucursales', data)
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async putSucursal(data, id) {
        try {
            const result = await axios.put(`api/sucursales/${id}`, data)
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async deleteSucursal(id, usuario) {
        try {
            const result = await axios.delete(`api/sucursales/${id}?usuario=${usuario}`)
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async getCodigoRecomendadoSucursal() {
        try {
            const result = await axios.get('api/sucursales/codigo-recomendado')
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }

    // CAMIONES
    async getCamiones() {
        try {
            const result = await axios.get('api/camiones')
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async postCamion(data) {
        try {
            const result = await axios.post('api/camiones', data)
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async putCamion(data, id) {
        try {
            const result = await axios.put(`api/camiones/${id}`, data)
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async deleteCamion(id, usuario) {
        try {
            const result = await axios.delete(`api/camiones/${id}?usuario=${usuario}`)
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }

    // BODEGAS
    async getBodegas() {
        try {
            const result = await axios.get('api/bodegas')
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async getBodegasPorTipo(tipoBodegaId) {
        try {
            const result = await axios.get(`api/bodegas/Tipo/${tipoBodegaId}`)
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async postBodega(data) {
        try {
            const result = await axios.post('api/bodegas', data)
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async putBodega(data, id) {
        try {
            const result = await axios.put(`api/bodegas/${id}`, data)
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
    async deleteBodega(id, usuario) {
        try {
            const result = await axios.delete(`api/bodegas/${id}?usuario=${usuario}`)
            return { code: 200, data: result.data }
        } catch (error) {
            return { code: error.response?.status || 500, data: error.response?.data }
        }
    }
}

export default RequestHttp