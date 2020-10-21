import { createAsyncThunk } from '@reduxjs/toolkit'
import * as firebase from 'firebase/app'

import { firebaseDB } from 'helpers/firebase'
import { ProjectSubEntity } from 'typings/entities'

const fetchPromotionsAction = (projectId: string) =>
  firebaseDB
    .collection('promos')
    .where('projectId', '==', projectId)
    .orderBy('updatedAt', 'desc')
    .get()
    .then((querySnapshot) => {
      const promotions: any = []

      querySnapshot.forEach((document) => {
        promotions.push({
          ...document.data(),
          id: document.id,
        })
      })

      return promotions
    })

export const fetchPromotions = createAsyncThunk('fetchPromotions', fetchPromotionsAction)

const updatePromotionAction = (promotion: any) =>
  firebaseDB
    .collection('promos')
    .doc(promotion.id)
    .update({
      ...promotion,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

export const updatePromotion = createAsyncThunk('updatePromotion', updatePromotionAction)

const createPromotionAction = (promotion: any) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp()

  return firebaseDB
    .collection('promos')
    .add({
      ...promotion,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .then((docRef) => docRef.id)
}

export const createPromotion = createAsyncThunk('createPromotion', createPromotionAction)

const deletePromotionAction = ({ id }: ProjectSubEntity) =>
  firebaseDB.collection('promos').doc(id).delete()

export const deletePromotion = createAsyncThunk('deletePromotion', deletePromotionAction)
