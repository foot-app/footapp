import firebase from 'firebase/app'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyAAGL8OQmuT78SrHGuFqBUaQHSl6Jb-o44",
    authDomain: "footapp-frontend.firebaseapp.com",
    databaseURL: "https://footapp-frontend.firebaseio.com",
    projectId: "footapp-frontend",
    storageBucket: "footapp-frontend.appspot.com",
    messagingSenderId: "1058562159305",
    appId: "1:1058562159305:web:ce6fa597a519bf967b5318"
}

firebase.initializeApp(firebaseConfig)
const storage = firebase.storage()

export { storage, firebase as default }