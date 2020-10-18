import React from "react";
import { useParams } from "react-router-dom";

import { ROUTES } from "helpers/config";
import List from "components/list";

import styles from "./styles.module.scss";

export default () => {
  const { surveyId, projectId, surveyEditMode } = useParams<any>();

  return (
    <div className={styles.container}>
      <List
        items={[
          { id: "content", title: "CONTENT" },
          { id: "design", title: "DESIGN" },
          { id: "qr", title: "QR CODE" },
        ]}
        selectedItem={surveyEditMode}
        listPath={`${ROUTES.PROJECTS}/${projectId}/surveys/${surveyId}`}
      />
    </div>
  );
};
