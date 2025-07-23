import axios from "axios";

export function httpPut(url, params) {

    return new Promise((resolve, reject) => {

        axios.put(url, params).then(function(response) {

            resolve(response)

        }).catch(err => {
            reject(err.response ? err.response : {
                data: {
                    code: 404,
                    msg: 'Error de conexión.'
                }
            })
        })
    })
}

export function getItemsCombobox(url, concat = true) {

    return new Promise((resolve, reject) => {

        var aux = []
        var items = []
        axios.get(url).then(function(response) {

            aux = response.data

            aux.map(function(x) {
                items.push({
                    title: (x.codigo && concat) ? x.codigo + '-' + x.nombre : x.nombre,
                    value: x.id,
                })
            })

            resolve(items)

        }).catch(err => {
            reject(err.response ? err.response : {
                data: {
                    code: 404,
                    msg: 'Error de conexión.'
                }
            })
        })
    })
}

export function httpGet(url, inject = false, asQuery = false, separator = '?') {

    return new Promise((resolve, reject) => {

        var items = []
        axios.get(url).then(function(response) {

            items = response.data

            resolve(items)

        }).catch(err => {
            reject(err.response ? err.response : {
                data: {
                    code: 404,
                    msg: 'Error de conexión.'
                }
            })
        })
    })
}

export function httpPost(url, params) {
    return new Promise((resolve, reject) => {
        //PETICION
        axios.post(url, params)
            .then(function(response) {
                resolve(response)
            })
            .catch(err => {
                console.log(err)
                reject(err.response ? err.response : {
                    data: {
                        code: 404,
                        msg: 'Error de conexión.'
                    }
                })
            })
    })
}