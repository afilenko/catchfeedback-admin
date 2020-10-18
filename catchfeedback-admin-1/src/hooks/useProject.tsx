import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchProject } from "store/projects/actions";
import { projectsSelector } from "store/projects/selectors";

export default () => {
  const { projectId } = useParams<any>();
  const projects = useSelector(projectsSelector);
  const project = useMemo(() => {
    return projects.find(({ id }) => id === projectId);
  }, [projectId, projects]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProject(projectId));
  }, [dispatch, projectId]);

  return project;
};
