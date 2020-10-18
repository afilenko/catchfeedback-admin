import React from "react";
import { Tabs, Tab } from "@material-ui/core";
import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

type Props = {
  items: any[];
  labelField?: string;
  selectedItem?: any;
  listPath?: string;
};

export default ({
  items = [],
  labelField = "title",
  selectedItem,
  listPath = "",
}: Props) => (
  <Tabs
    orientation="vertical"
    variant="scrollable"
    value={selectedItem}
    className={styles.tabs}
    TabIndicatorProps={{
      style: { background: "#00bcd4", width: "4px" },
    }}
  >
    {items.map((item) => {
      return (
        <Tab
          classes={{ root: styles.tab, wrapper: styles.tabLabel }}
          key={item.id}
          label={item[labelField]}
          component={Link}
          value={item.id}
          to={`${listPath}/${item.id}`}
        />
      );
    })}
  </Tabs>
);
