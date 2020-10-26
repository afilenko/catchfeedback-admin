import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { object, string } from 'yup'

import { projectsSelector, isPendingProjectsSelector } from 'store/projects/selectors'
import { createProject, updateProject, deleteProject } from 'store/projects/actions'
import FormInput from 'components/form-input'
import CustomButton from 'components/custom-button'
import Form from 'components/form'

import styles from './styles.module.scss'
import { ROUTES } from 'helpers/config'

const VALIDATION_SCHEMA = object({
  title: string().required('This field is required'),
})

const INITIAL_VALUES = { title: '', description: '' }

export default () => {
  const { projectId } = useParams<any>()
  const projects = useSelector(projectsSelector)
  const pending = useSelector(isPendingProjectsSelector)
  const dispatch = useDispatch()
  const selectedProjectId = projectId || projects[0]?.id
  const isCreateMode = projectId === 'new'

  const handleSave = async () => {
    if (isCreateMode) {
      dispatch(createProject(formik.values))
    } else {
      dispatch(updateProject({ ...formik.values, id: selectedProjectId }))
    }
  }

  const project = useMemo(() => {
    return projectId ? projects.find(({ id }) => id === projectId) : projects[0]
  }, [projectId, projects])

  const handleDelete = () => {
    if (project) {
      dispatch(deleteProject(project))
    }
  }

  const formik = useFormik({
    initialValues: project ? { ...project } : INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    enableReinitialize: true,
    onSubmit: handleSave,
  })

  // if (!project && !isCreateMode) {
  //   return null
  // }

  return (
    <Form
      title={project?.title}
      onDelete={handleDelete}
      onSubmit={formik.handleSubmit}
      onCancel={formik.resetForm}
      isUpdateDisabled={!formik.dirty || pending}
      isDeleteDisabled={projectId === 'new'}
    >
      <div className={styles.inputsColumn}>
        <FormInput label="Title" name="title" formProps={formik} />
        <FormInput multiline label="Description" name="description" formProps={formik} />
        <CustomButton
          className={styles.promoButton}
          href={`/#${ROUTES.PROJECTS}/${projectId}/promotions`}
        >
          Promotions
        </CustomButton>

        {!isCreateMode && (
          <CustomButton
            href={`/#${ROUTES.PROJECTS}/${selectedProjectId}/surveys/${project?.surveyId}/content`}
          >
            Edit Survey
          </CustomButton>
        )}
      </div>
    </Form>
  )
}
