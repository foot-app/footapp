const normalizeState = (value, previousValue) => {
    if (!value) {
        return value
    }

    const onlyChar = value.replace(/[0-9]/g, '')

    if (onlyChar.length > 2) {
        return onlyChar.slice(0,2)
    }

    return onlyChar
}

export default normalizeState