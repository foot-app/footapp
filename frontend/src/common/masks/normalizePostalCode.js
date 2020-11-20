const firstValue = (onlyNums) => {
    if (onlyNums.length === 5) {
        return onlyNums + '-'
    }
    if (onlyNums.length === 8) {
        return onlyNums.slice(0, 5) + '-' + onlyNums.slice(5,8)
    }
}

const getNormalizedPostalCode = (normalizedPostalCode, previousValue, value, onlyNums) => {
    if (!previousValue || value.length > previousValue.length) {
        normalizedPostalCode = firstValue(onlyNums)
    }
    else if (onlyNums.length <= 5) {
        normalizedPostalCode = onlyNums
    }
    else if (onlyNums.length <= 8) {
        normalizedPostalCode = onlyNums.slice(0, 5) + '-' + onlyNums.slice(5,8)
    }
}

const normalizePostalCode = (value, previousValue) => {
    let normalizedPostalCode = ""

    if (!value) {
        normalizedPostalCode = value
    }

    const onlyNums = value.replace(/[^\d]/g, '')
    getNormalizedPostalCode(normalizedPostalCode, previousValue, value, onlyNums)

    normalizedPostalCode = normalizedPostalCode ? normalizedPostalCode : onlyNums.slice(0, 5) + '-' + onlyNums.slice(5,8)

    return normalizedPostalCode    
}

export default normalizePostalCode