const normalizePostalCode = (value, previousValue) => {
    if (!value) {
        return value
    }

    const onlyNums = value.replace(/[^\d]/g, '')
    if (!previousValue || value.length > previousValue.length) {
        if (onlyNums.length === 5) {
            return onlyNums + '-'
        }
        if (onlyNums.length === 8) {
            return onlyNums.slice(0, 5) + '-' + onlyNums.slice(5,8)
        }
    }
    if (onlyNums.length <= 5) {
        return onlyNums
    }
    if (onlyNums.length <= 8) {
        return onlyNums.slice(0, 5) + '-' + onlyNums.slice(5,8)
    }
    return onlyNums.slice(0, 5) + '-' + onlyNums.slice(5,8)
}

export default normalizePostalCode