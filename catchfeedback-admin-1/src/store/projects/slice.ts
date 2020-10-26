import { createSlice } from '@reduxjs/toolkit'

import { Project } from 'typings/entities'
import { fetchProject, fetchProjects, createProject, updateProject, deleteProject } from './actions'

export type ArgumentsOfSaveOrderItemAction = {
  orderId: number
  productId: number
  checked: boolean
}

type ProjectsState = {
  entities: Project[]
  error: any
  pending: boolean
}

type NewProjectResponse = {
  payload: Project
  meta: { arg: Project }
}

const projects = createSlice({
  name: 'projects',
  initialState: { entities: [], error: null, pending: false } as ProjectsState,
  reducers: {
    clearProjectsState() {
      return { entities: [], pending: false, error: null }
    },
  },
  extraReducers: (builder) => {
    const pendingReducer = (state: ProjectsState) => {
      state.pending = true
      state.error = null
    }
    const errorReducer = (state: ProjectsState) => {
      state.pending = false
      // TODO: add specific details from the args/payload if needed
      state.error = 'Something went wrong'
    }

    // fetch
    builder.addCase(fetchProjects.fulfilled, (state, { payload }) => {
      if (payload) {
        state.entities = payload
      }
      state.pending = false
      state.error = null
    })
    builder.addCase(fetchProjects.pending, pendingReducer)
    builder.addCase(fetchProjects.rejected, errorReducer)

    builder.addCase(fetchProject.fulfilled, (state, { payload, meta: { arg: projectId } }) => {
      if (payload) {
        const project = { ...payload, id: projectId }
        const entityIndex = state.entities.findIndex(({ id }) => id === project.id)
        if (entityIndex >= 0) {
          state.entities.splice(entityIndex, 1, project)
        } else {
          state.entities.push(project)
        }
      }
      state.pending = false
      state.error = null
    })
    builder.addCase(fetchProject.pending, pendingReducer)
    builder.addCase(fetchProject.rejected, errorReducer)

    // update
    builder.addCase(updateProject.fulfilled, (state, { meta }: { meta: { arg: Project } }) => {
      const { arg } = meta

      state.pending = false

      if (!arg) {
        return
      }

      const updatedEntity = state.entities.find(({ id }) => id === arg.id)

      if (!updatedEntity) {
        return
      }

      for (const [key, value] of Object.entries(arg)) {
        if (updatedEntity[key as keyof Project] !== value) {
          updatedEntity[key as keyof Project] = value as any
        }
      }
    })
    builder.addCase(updateProject.pending, pendingReducer)
    builder.addCase(updateProject.rejected, errorReducer)

    // create
    builder.addCase(createProject.fulfilled, (state, { payload: project }: NewProjectResponse) => {
      state.pending = false
      state.entities.splice(0, 0, project)
      window.location.hash = `projects/${project.id}`
    })
    builder.addCase(createProject.pending, pendingReducer)
    builder.addCase(createProject.rejected, errorReducer)

    // delete
    builder.addCase(
      deleteProject.fulfilled,
      (state, { meta: { arg: project } }: { meta: { arg: Project } }) => {
        state.pending = false
        const projectIds = state.entities.map(({ id }) => id)
        const removedProjectIndex = projectIds.indexOf(project.id)

        state.entities.splice(removedProjectIndex, 1)
        window.location.hash = 'projects'
      },
    )
    builder.addCase(deleteProject.pending, pendingReducer)
    builder.addCase(deleteProject.rejected, errorReducer)
  },
})

export const { clearProjectsState } = projects.actions
export default projects
