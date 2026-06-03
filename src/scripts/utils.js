export function getDate() {

    var fechaActual = new Date()

// Obtener día, mes y año
    var dia = fechaActual.getDate()
    var mes = fechaActual.getMonth() + 1 // Los meses van de 0 a 11, por lo que se suma 1
    var año = fechaActual.getFullYear()

// Formatear el día y el mes a dos dígitos si es necesario
    dia = (dia < 10) ? '0' + dia : dia
    mes = (mes < 10) ? '0' + mes : mes

// Crear la cadena de fecha en el formato "dd-mm-yyyy"
    var fechaFormateada = año + '-' + mes + '-' + dia

    return fechaFormateada

}

export function getIntervaloMesActual() {
    const fechaActual = new Date()
    const año = fechaActual.getFullYear()
    const mes = fechaActual.getMonth() + 1

    // Último día del mes actual
    const ultimoDiaDelMes = new Date(año, mes, 0).getDate()

    
    
    const fechaDesde = `${año}-${String(mes).padStart(2, '0')}-01`
    const fechaHasta = `${año}-${String(mes).padStart(2, '0')}-${ultimoDiaDelMes}`
    
    console.log(fechaDesde, fechaHasta);
    return {
        fechaDesde,
        fechaHasta
    }
}