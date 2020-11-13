const populateChangesObj = async (propertiesName, changesObj, propertiesNameToExclude, req) => {
    await propertiesName.forEach(async propertieName => {
        let include = true
        await propertiesNameToExclude.forEach(propertyToExclude => {
            if (propertieName == propertyToExclude) include = false
        })
        if (include) changesObj[propertieName] = req.body[propertieName]
    })
}

module.exports = { populateChangesObj }