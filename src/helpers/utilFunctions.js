function objectValidate (obj) {
    return Object.values(obj).every(
        value => 
            value !== undefined &&
            value !== null && 
            !(typeof value === 'string' && value.trim() === '')
    )
}

export const utilsFunctions = {
    objectValidate
}


const tourOptions = {
    nextLabel: 'Siguiente',
    prevLabel: 'Anterior',
    doneLabel: 'Terminar',
    tooltipPosition: 'auto',
    tooltipClass: 'customIntroJS',
    highlightClass: 'customHighlight',
    exitOnEsc: true,
    exitOnOverlayClick: false,
    autoPosition: true,
    scrollToElement: true,
    scrollPadding: 120,
    disableInteraction: true,
    // showProgress: true,
    overlayOpacity: 0.5,
}

export default tourOptions