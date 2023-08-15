import React from "react";
import styles from "./DataGrid.module.scss";

export const CSS_BACKGROUND_VARIABLE = "--row-background";

export const GridBody = React.memo(({ children }) => {
  return <div className={styles.body}>{children}</div>;
});
