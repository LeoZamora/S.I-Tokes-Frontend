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