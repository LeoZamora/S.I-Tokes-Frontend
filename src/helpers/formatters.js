const formatCurrency = (key, currency) => {
    return new Intl.NumberFormat('es-NI', {
        style: 'currency',
        currency: currency == 'USD' ? 'USD' : 'NIO',
    }).format(key)
}

const formatDate = (dataString) => {
    if (!dataString) {
        return 'xx/xx/xxxx xx:xx'
    } else {
        const date = new Date(dataString)
        return date.toLocaleString('es-NI', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit'
        })
    }
}

export const formatters = {
    formatCurrency,
    formatDate
}