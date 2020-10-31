import { storage } from '../firebase/firebaseConfig'
import { toastr } from 'react-redux-toastr'

export const uploadImageToFirebase = (image, userEmailReplaced, callback) => {
    const imageName = userEmailReplaced
    const storageRef = storage.ref(`/images/${imageName}`)
    const uploadTask = storageRef.put(image)
    uploadTask.then(response => {
        if (response) {
            response.ref.getDownloadURL().then(response => {
                callback(response)
            })
        }
    })
}

export const deleteImageFromFirebase = (imageUrl, callback) => {
    const imageRef = storage.refFromURL(imageUrl)
    imageRef.delete().then(() => {
        callback()
    }).catch(error => {
        toastr.error('', 'Erro ao deletar imagem. Tente novamente mais tarde.')
    })
}