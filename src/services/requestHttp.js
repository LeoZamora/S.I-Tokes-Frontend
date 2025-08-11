import axios from "axios";
import endPoints from "./endPoints";

class RequestHttp {
    // CATEGORIAS
    async getCategorias() {
        try {
            const result  = await axios.get(endPoints.getCategoria)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdCategorias(id) {
        try {
            const result  = await axios.get(`${endPoints.getCategoria}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postCategorias(data) {
        try {
            const result  = await axios.post(endPoints.postCategoria, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putCategorias(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putCategoria}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }
    async deleteCategorias(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteCategoria}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }


    // SUBCATEGORIAS
    async getSubCategorias() {
        try {
            const result  = await axios.get(endPoints.getSubCategoria)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getCodeSub(id) {
        try {
            const result  = await axios.get(`${endPoints.getCode}?idCategoria=${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async getByIdSubCategorias(id) {
        try {
            const result  = await axios.get(`${endPoints.getSubCategoria}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postSubCategorias(data) {
        try {
            const result  = await axios.post(endPoints.postSubCategoria, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putSubCategorias(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putSubCategoria}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }
    async deleteSubCategorias(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteSubCategoria}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
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
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdProducto(id) {
        try {
            const result  = await axios.get(`${endPoints.getProducto}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postProducto(data) {
        try {
            const result  = await axios.post(endPoints.postProducto, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putProductos(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putProducto}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }
    async deleteProducto(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteProducto}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }

     // PROVEEDORES
    async getProveedores() {
        try {
            const result  = await axios.get(endPoints.getProveedor)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdProveedor(id) {
        try {
            const result  = await axios.get(`${endPoints.getProveedor}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postProveedor(data) {
        try {
            const result  = await axios.post(endPoints.postProveedor, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putProveedor(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putProveedor}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }
    async deleteProveedor(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteProveedor}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }

    // TIPO PROVEEDORES
    async getTipoProveedores() {
        try {
            const result  = await axios.get(endPoints.getTipoProveedor)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdTipoProveedor(id) {
        try {
            const result  = await axios.get(`${endPoints.getTipoProveedor}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postTipoProveedor(data) {
        try {
            const result  = await axios.post(endPoints.postTipoProveedor, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putTipoProveedor(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putTipoProveedor}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }
    async deleteTipoProveedor(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteTipoProveedor}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }

    // PROVEEDOR PRODUCTO
    async getProveedorProductos() {
        try {
            const result  = await axios.get(endPoints.getProveedorProducto)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdProveedorProducto(id) {
        try {
            const result  = await axios.get(`${endPoints.getProveedorProducto}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postProveedorProducto(data) {
        try {
            const result  = await axios.post(endPoints.postProveedorProducto, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putProveedorProducto(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putProveedorProducto}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }
    async deleteProveedorProducto(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteProveedorProducto}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }

    // COMPRAS
    async getCompras() {
        try {
            const result  = await axios.get(endPoints.getCompra)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdCompra(id) {
        try {
            const result  = await axios.get(`${endPoints.getCompra}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postCompra(data) {
        try {
            const result  = await axios.post(endPoints.postCompra, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putCompra(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putCompra}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }
    async deleteCompra(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteCompra}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }

    // VENTAS
    async getVentas() {
        try {
            const result  = await axios.get(endPoints.getVenta)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }

    async getTipoVentas() {
        try {
            const result  = await axios.get(endPoints.getTipoVenta)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }

    async getByIdVenta(id) {
        try {
            const result  = await axios.get(`${endPoints.getVenta}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postVenta(data) {
        try {
            const result  = await axios.post(endPoints.postVenta, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return error.response.data
        }
    }
    async putVenta(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putVenta}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }
    async deleteVenta(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteVenta}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }

    // CLIENTES
    async getClientes() {
        try {
            const result  = await axios.get(endPoints.getCliente)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdCliente(id) {
        try {
            const result  = await axios.get(`${endPoints.getCliente}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postCliente(data) {
        try {
            const result  = await axios.post(endPoints.postCliente, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putCliente(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putCliente}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }
    async deleteCliente(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteCliente}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }

    // CATEGORIA CLIENTES
    async getCategoriaClientes() {
        try {
            const result  = await axios.get(endPoints.getCategoriaCliente)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdCategoriaCliente(id) {
        try {
            const result  = await axios.get(`${endPoints.getCategoriaCliente}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postCategoriaCliente(data) {
        try {
            const result  = await axios.post(endPoints.postCategoriaCliente, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putCategoriaCliente(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putCategoriaCliente}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }
    async deleteCategoriaCliente(id) {
        try {
            const result  = await axios.delete(`${endPoints.deleteCategoriaCliente}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }


    // USUARIOS
    async getUsuarios() {
        try {
            const result  = await axios.get(endPoints.getUsuario)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async postUsuario(data) {
        try {
            const result = await axios.post(endPoints.postUsuario, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
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
            // console.error('Error on request', error.response.data);
            return error.response.data
        }
    }

    // ROLES
    async getRoles() {
        try {
            const result  = await axios.get(endPoints.getRol)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdRol(id) {
        try {
            const result  = await axios.get(`${endPoints.getByIdRol}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postRol(data) {
        try {
            const result  = await axios.post(endPoints.postRol, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putRol(data) {
        try {
            const result  = await axios.put(endPoints.putRol, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }

    async getDepartamentos() {
        try {
            const result  = await axios.get(endPoints.getDepartamentos)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }

    async getMunById(id) {
        try {
            const result  = await axios.get(`${endPoints.getMunicipios}?idDepartamento=${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }

    // RUTAS
    async getRutas() {
        try {
            const result  = await axios.get(endPoints.getRutas)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdRuta(id) {
        try {
            const result  = await axios.get(`${endPoints.getRutas}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postRuta(data) {
        try {
            const result  = await axios.post(endPoints.postRutas, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putRuta(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putRutas}/${id}`, data)
            return result.data
        } catch (error) {
            // console.error('Error on request', error.response.data);
            return null
        }
    }


    // MOVIMIENTOS
    async getMovs() {
        try {
            const result  = await axios.get(endPoints.getMov)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async getByIdMov(id) {
        try {
            const result  = await axios.get(`${endPoints.getMov}/${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async postMov(data) {
        try {
            const result  = await axios.post(endPoints.postMov, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
    async putMov(data, id) {
        try {
            const result  = await axios.put(`${endPoints.putMov}/${id}`, data)
            return result.data
        } catch (error) {
            return null
        }
    }


    // COMBOBOX
    async getCombobox(url) {
        try {
            const result  = await axios.get(url)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }

    async getConceptoMov(id) {
        try {
            const result  = await axios.get(`${endPoints.getConcepto}?idTipoMov=${id}`)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }

    // UNIDADES DE MEDIDA
    async getUnidadMedida() {
        try {
            const result  = await axios.get(endPoints.getUnidadMedida)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
            
        }
    }
    async postUnidadMedida(data) {
        try {
            const result = await axios.post(endPoints.postUnidadMedida, data)
            return result.data
        } catch (error) {
            console.error('Error on request', error.response.data);
            return null
        }
    }
}

export default RequestHttp