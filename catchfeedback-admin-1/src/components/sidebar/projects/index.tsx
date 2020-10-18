import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { ROUTES } from "helpers/config";
import { fetchProjects } from "store/projects/actions";
import { projectsSelector } from "store/projects/selectors";
import List from "components/list";
import CustomButton from "components/custom-button";

import styles from "./styles.module.scss";

export default () => {
  const dispatch = useDispatch();
  const projects = useSelector(projectsSelector);

  const { projectId } = useParams<any>();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (!projectId && projects?.length) {
      window.location.hash = `projects/${projects[0]?.id}`;
    }
  }, [projects, projectId]);

  return (
    <div className={styles.container}>
      <List
        items={projects}
        selectedItem={projectId || projects[0]?.id}
        listPath={ROUTES.PROJECTS}
      />
      <CustomButton
        href="#/projects/new"
        className={styles.addProjectButton}
        buttonColor="green"
      >
        Add Project
      </CustomButton>
    </div>
  );
};
