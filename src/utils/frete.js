export function calcularFaltaParaFreteGratis(valor) {
    const numero = Number(valor)

    if (!Number.isFinite(numero)) {
        return null
    }

    return Math.max(0, 200 - numero)
}

export function temFreteGratis(valor) {
    const falta = calcularFaltaParaFreteGratis(valor)
    return falta !== null && falta === 0
}
