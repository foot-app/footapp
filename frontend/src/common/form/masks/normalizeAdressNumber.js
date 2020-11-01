const normalizeNumber = (value) => {
    if (!value) {
        return value
    }

    const onlyNums = value.replace(/[^\d]/g, '')

    if(onlyNums.length <= 6) {
        return onlyNums
    }
}

export default normalizeNumber