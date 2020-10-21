import React, { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import classNames from 'classnames'

import CustomButton from 'components/custom-button'

import styles from './styles.module.scss'

type Props = {
  children: React.ReactNode
  additionalControls?: React.ReactNode
  title: React.ReactNode | string
  onSubmit: () => void
  onDelete: () => void
  onCancel: () => void
  isUpdateDisabled?: boolean
  isDeleteDisabled?: boolean
  className?: string
}

export default ({
  children,
  className,
  title,
  onSubmit,
  onDelete,
  onCancel,
  isUpdateDisabled,
  isDeleteDisabled,
  additionalControls,
}: Props) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false)
  const openDeleteDialog = () => setIsDeleteDialogOpen(true)
  const handleConfirmDeleteDialog = () => {
    closeDeleteDialog()
    onDelete()
  }

  return (
    <form className={classNames([styles.container, className])} onSubmit={onSubmit}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={styles.formButtons}>
          {additionalControls}
          <CustomButton disabled={isDeleteDisabled} onClick={openDeleteDialog} buttonColor="red">
            Delete
          </CustomButton>
          <CustomButton disabled={isUpdateDisabled} onClick={onCancel}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" disabled={isUpdateDisabled}>
            Save
          </CustomButton>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this entity?</DialogContent>
        <DialogActions>
          <CustomButton onClick={closeDeleteDialog}>Cancel</CustomButton>
          <CustomButton onClick={handleConfirmDeleteDialog} buttonColor="red">
            Delete
          </CustomButton>
        </DialogActions>
      </Dialog>
    </form>
  )
}
