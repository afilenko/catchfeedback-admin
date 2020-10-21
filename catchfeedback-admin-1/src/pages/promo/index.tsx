/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import { Switch } from '@material-ui/core'

import { promotionsSelector, isPendingPromotionsSelector } from 'store/promotions/selectors'
import { projectsSelector } from 'store/projects/selectors'
import { createPromotion, updatePromotion, deletePromotion } from 'store/promotions/actions'
import FormInput from 'components/form-input'
import ImageUpload from 'components/image-upload'
import CustomButton from 'components/custom-button'
import Form from 'components/form'
import SubEntityTitle from 'components/sub-entity-title'
import { ROUTES } from 'helpers/config'
import { fetchProject } from 'store/projects/actions'

import styles from './styles.module.scss'

const VALIDATION_SCHEMA = object({
  title: string().required('This field is required'),
  shareButtonText: string().required('This field is required'),

  shareLink: string().matches(
    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
    'Incorrect url',
  ),
})

const INITIAL_VALUES = {
  title: '',
  description: '',
  shareButtonText: 'Share',
  isActive: false,
}

export default () => {
  const { promoId, projectId } = useParams<any>()
  const promos = useSelector(promotionsSelector)
  const pending = useSelector(isPendingPromotionsSelector)
  const dispatch = useDispatch()
  const selectedPromoId = promoId || promos[0]?.id
  const projects = useSelector(projectsSelector)
  const project = useMemo(() => projects.find(({ id }) => id === projectId), [projectId, projects])

  useEffect(() => {
    dispatch(fetchProject(projectId))
  }, [dispatch, projectId])

  const handleSave = async () => {
    if (promoId === 'new') {
      dispatch(createPromotion({ ...formik.values, projectId }))
    } else {
      dispatch(updatePromotion({ ...formik.values, id: selectedPromoId }))
    }
  }

  const handleDelete = () => {
    dispatch(deletePromotion({ id: selectedPromoId, projectId }))
  }

  const promo = useMemo(() => promos.find(({ id }) => id === selectedPromoId), [
    selectedPromoId,
    promos,
  ])

  const isCreateMode = promoId === 'new'

  const formik = useFormik({
    initialValues: promo ? { ...promo } : INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    enableReinitialize: true,
    onSubmit: handleSave,
  })

  if (!promo && !isCreateMode) {
    return null
  }

  return (
    <Form
      title={
        <SubEntityTitle
          title={isCreateMode ? 'New promo' : promo?.title}
          projectTitle={project?.title}
        />
      }
      onSubmit={formik.handleSubmit}
      onCancel={formik.resetForm}
      onDelete={handleDelete}
      isUpdateDisabled={!formik.dirty || pending}
      isDeleteDisabled={isCreateMode}
      additionalControls={
        <CustomButton href={`/#${ROUTES.PROJECTS}/${projectId}`}>Go to Project</CustomButton>
      }
    >
      <div className={styles.inputsColumn}>
        <FormInput label="Title" name="title" formProps={formik} />
        <FormInput multiline label="Description" name="description" formProps={formik} />
        <div className={styles.statusRow}>
          Active
          <Switch
            checked={formik.values.isActive}
            name="isActive"
            onChange={formik.handleChange}
            color="default"
            classes={{
              checked: styles.statusSchecked,
              track: styles.statusTrack,
            }}
          />
        </div>
        <FormInput label="Share button text" name="shareButtonText" formProps={formik} />
        <FormInput multiline label="Share message" name="shareMessage" formProps={formik} />
        <FormInput label="Share link" name="shareLink" formProps={formik} />
        {!isCreateMode && (
          <div className={styles.images}>
            <ImageUpload
              label="Image"
              image={promo?.image}
              imagePath={`promos/${selectedPromoId}`}
              imageName="image"
              onComplete={(url) => dispatch(updatePromotion({ image: url, id: selectedPromoId }))}
            />
            <ImageUpload
              label="Share image"
              image={promo?.shareImage}
              imagePath={`promos/${selectedPromoId}`}
              imageName="shareImage"
              onComplete={(url) =>
                dispatch(updatePromotion({ shareImage: url, id: selectedPromoId }))
              }
            />
          </div>
        )}
      </div>
    </Form>
  )
}
