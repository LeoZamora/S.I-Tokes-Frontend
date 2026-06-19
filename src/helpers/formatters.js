const formatCurrency = (key, currency) => {
    return new Intl.NumberFormat('es-NI', {
        style: 'currency',
        currency: currency == 'USD' ? 'USD' : 'NIO',
    }).format(key)
}

function formateDate(date, showTime = false) {
    if(!date) return 'xx-xx-xxxx'

    const timeDate = {
        hour: 'numeric',
        minute: '2-digit',
        second: 'numeric',
    }

    const settings = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    }

    if(/^\d{4}-\d{2}-\d{2}/.test(date)) {
        const dateFormat = new Date(date)
        return dateFormat.toLocaleDateString('es-NI',
            showTime ? Object.assign(settings, timeDate)
            : settings
        )
    }
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
            hour: '2-digit',
            minute: '2-digit'
        })
    }
}

export const formatters = {
    formatCurrency,
    formatDate,
    formateDate
}