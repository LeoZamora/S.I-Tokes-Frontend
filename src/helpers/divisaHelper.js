/**
 * Helper centralizado para manejo de Divisas y Denominaciones en el módulo de Caja
 */

export const DEFAULT_DIVISAS = [
  {
    idDivisa: 1,
    codigo: 'NIO',
    nombre: 'Córdoba',
    simbolo: 'C$',
    tasaCambio: 1,
    esPredeterminada: true
  },
  {
    idDivisa: 2,
    codigo: 'USD',
    nombre: 'Dólar Estadounidense',
    simbolo: '$',
    tasaCambio: 36.8,
    esPredeterminada: false
  }
];

export const DENOMINACIONES_BASE = {
  NIO: [
    { valor: 1000, tipo: 'billete' },
    { valor: 500, tipo: 'billete' },
    { valor: 200, tipo: 'billete' },
    { valor: 100, tipo: 'billete' },
    { valor: 50, tipo: 'billete' },
    { valor: 20, tipo: 'billete' },
    { valor: 10, tipo: 'billete' },
    { valor: 5, tipo: 'moneda' },
    { valor: 1, tipo: 'moneda' },
    { valor: 0.5, tipo: 'moneda' }
  ],
  USD: [
    { valor: 100, tipo: 'billete' },
    { valor: 50, tipo: 'billete' },
    { valor: 20, tipo: 'billete' },
    { valor: 10, tipo: 'billete' },
    { valor: 5, tipo: 'billete' },
    { valor: 2, tipo: 'billete' },
    { valor: 1, tipo: 'billete' },
    { valor: 0.5, tipo: 'moneda' },
    { valor: 0.25, tipo: 'moneda' },
    { valor: 0.1, tipo: 'moneda' }
  ]
};

/**
 * Obtiene el listado de denominaciones con etiquetas para una divisa específica
 * @param {Object} divisa - Objeto de divisa con { codigo, simbolo }
 * @returns {Array} Listado de objetos { valor, label, tipo, simbolo }
 */
export function getDenominacionesPorDivisa(divisa) {
  if (!divisa) return [];
  const codigo = (divisa.codigo || 'NIO').toUpperCase();
  const simbolo = divisa.simbolo || (codigo === 'USD' ? '$' : 'C$');

  const baseList = DENOMINACIONES_BASE[codigo] || [
    { valor: 1000, tipo: 'billete' },
    { valor: 500, tipo: 'billete' },
    { valor: 200, tipo: 'billete' },
    { valor: 100, tipo: 'billete' },
    { valor: 50, tipo: 'billete' },
    { valor: 20, tipo: 'billete' },
    { valor: 10, tipo: 'billete' },
    { valor: 5, tipo: 'moneda' },
    { valor: 1, tipo: 'moneda' },
    { valor: 0.5, tipo: 'moneda' }
  ];

  return baseList.map(item => {
    const valFormateado = item.valor >= 1 ? item.valor.toLocaleString('es-NI') : item.valor.toFixed(2);
    const tipoStr = item.tipo === 'billete' ? 'Billetes' : 'Monedas';
    return {
      valor: item.valor,
      tipo: item.tipo,
      simbolo: simbolo,
      label: `${tipoStr} de ${simbolo} ${valFormateado}`
    };
  });
}

/**
 * Formatea un valor monetario según el símbolo de la divisa
 */
export function formatMontoDivisa(monto, divisa) {
  const num = Number(monto) || 0;
  const simbolo = divisa?.simbolo || (divisa?.codigo === 'USD' ? '$' : 'C$');
  return `${simbolo} ${num.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formatea una etiqueta de denominación individual dado el valor y la divisa
 */
export function formatDenominacionLabel(valor, divisa) {
  const val = Number(valor) || 0;
  const simbolo = divisa?.simbolo || (divisa?.codigo === 'USD' ? '$' : 'C$');
  const tipo = val >= 10 ? 'Billete' : (val >= 1 ? (divisa?.codigo === 'USD' ? 'Billete/Moneda' : 'Moneda') : 'Moneda');
  const valStr = val >= 1 ? val.toLocaleString('es-NI') : val.toFixed(2);
  return `${tipo} ${simbolo} ${valStr}`;
}
