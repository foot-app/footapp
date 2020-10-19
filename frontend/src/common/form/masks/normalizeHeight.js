const normalizeHeight = (value, previousValue) => {
    if (!value) {
        return value
    }

    if (value.length > 3) {
        return previousValue
    }

    const onlyNums = value.replace(/[^\d]/g, '')
    
    return onlyNums
}

export default normalizeHeight