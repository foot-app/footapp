const updateModel = async (Model, modelObj, newModel, modelDescription) => {
    await Model.remove({ _id: modelObj._id }, async (error) => {
        if (error) {
            throw error
          }  
          else {
            await newModel.save(error => {
                if (error) {
                    throw error
                }
                else {
                    console.log(`>> ${modelDescription} ${newModel._id} migrated`)
                }
            })
        }
    })
}

module.exports = { updateModel }