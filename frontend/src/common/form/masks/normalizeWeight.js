const sliceAndReplaceOnlyNums = (onlyNums) => {
    if (onlyNums[0] == '0' && onlyNums.length > 2) {
        onlyNums = onlyNums.replace('0', '')
    }

    return onlyNums.slice(0, onlyNums.length - 1) + '.' + onlyNums.slice(onlyNums.length - 1, onlyNums.length)
}

const normalizeWeight = (value) => {
    if (!value) {
        return value
    }

    let onlyNums = value.replace(/[^\d]/g, '')

    if (onlyNums.length <= 1) {
        return '0.' + onlyNums
    }
    else {
        return sliceAndReplaceOnlyNums(onlyNums)    
    }
}

export default normalizeWeight