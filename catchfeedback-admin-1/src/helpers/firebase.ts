import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAQa0E_1FDv_4iCcgMScL5mX_f1dGTou-8',
  authDomain: 'catchfeedback-87ccd.firebaseapp.com',
  databaseURL: 'https://catchfeedback-87ccd.firebaseio.com',
  projectId: 'catchfeedback-87ccd',
  storageBucket: 'catchfeedback-87ccd.appspot.com',
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)
export const firebaseDB = firebaseApp.firestore()
export const firebaseStorage = firebaseApp.storage()

export const authenticate = () => {
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
    })
    .catch((error) => {
      console.error(error)
      throw error
    })
}
