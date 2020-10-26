import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import { ROLES } from 'typings/entities'
import { authUserSelector } from 'store/auth/selectors'
import { setAuthUser } from 'store/auth/actions'
import { firebaseDB } from 'helpers/firebase'
import RootPage from 'pages/root'

type UserEntity = {
  role: string
}

export const AuthPage = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(authUserSelector)
  const signOut = useCallback(() => {
    dispatch(setAuthUser(null))
    firebase.auth().signOut()
    window.location.hash = ''
  }, [dispatch])

  useEffect(() => {
    const unsibscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user && currentUser) {
        signOut()
        return
      }

      // NOTE: is there a way to "explain" to the TypeScript that we already chacked user !== null above?
      // setting "strictNullChecks": false is not an options because then TypeScript won't check for null at all
      if (user) {
        firebaseDB
          .collection('users')
          .doc(user.uid)
          .get()
          .then((dbUserDoc) => {
            if (!dbUserDoc.exists) {
              signOut()
              return
            }

            const dbUser: UserEntity = dbUserDoc.data() as UserEntity

            if (dbUser?.role !== ROLES.ADMIN) {
              signOut()
              return
            }

            const { uid, displayName, email } = user

            if (uid !== currentUser?.uid) {
              dispatch(
                setAuthUser({
                  uid,
                  name: displayName,
                  email,
                }),
              )
            }
          })
      }
    })

    return () => {
      unsibscribe()
    }
  }, [currentUser, dispatch, signOut])

  return <RootPage currentUser={currentUser} />
}

export default AuthPage
