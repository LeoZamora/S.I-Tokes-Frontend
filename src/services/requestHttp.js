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
            console.error('Error on request', error.response.data);
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
            console.error('Error on request', error.response.data);
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
    async getProductos() {
        try {
            const result  = await axios.get(endPoints.getProducto)
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
            console.error('Error on request', error.response.data);
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
            console.error('Error on request', error.response.data);
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
            console.error('Error on request', error.response.data);
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
}

export default RequestHttp