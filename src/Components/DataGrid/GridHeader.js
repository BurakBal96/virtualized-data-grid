import React, { useLayoutEffect, useState } from "react";
import styles from "./DataGrid.module.scss";
import { useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { qs } from "../../Helpers/QueryString";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// {
//     field: [key],
//     label: 'text',
//     width: 100,
//     type: 'text' | 'date'
// }

export const GridHeader = inject("TableStore")(
  observer(({ children, TableStore }) => {
    const {
      columns: headers,
      translationDictionary,
      setWidth,
      queryParams,
    } = TableStore;
    return (
      <>
        <div className={styles.header}>
          {headers.map((i) => (
            <HeaderCell
              key={"grid-header-" + i.field}
              setWidth={setWidth}
              data={i}
              translationDictionary={translationDictionary}
              queryParams={queryParams}
            />
          ))}
        </div>
        {children}
      </>
    );
  })
);

const HeaderCell = withRouter(
  ({ data, translationDictionary, setWidth, history, queryParams }) => {
    const [element, ref] = useState(null);
    const { t } = useTranslation(translationDictionary);
    const { paramsSortKey, order } = queryParams;
    const dataSortKey = data.sortKey || data.field;
    const isSelectedOrder = dataSortKey === paramsSortKey;
    const orders = data.reverseSort ? ["desc", "asc"] : ["asc", "desc"];

    useLayoutEffect(() => {
      if (!element) return;
      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    }, [element]);

    const observer = React.useMemo(
      () =>
        new window.ResizeObserver(function (entries) {
          if (entries[0]) {
            const width = entries[0].target?.offsetWidth;
            setWidth(data.field, width);
          }
        }),
      []
    );

    const handleSort = () => {
      if (isSelectedOrder) {
        if (order === orders[0])
          history.push(
            "?" + qs.stringify({ sortKey: dataSortKey, order: orders[1] })
          );
        else history.push("?");
      } else {
        history.push(
          "?" + qs.stringify({ sortKey: dataSortKey, order: orders[0] })
        );
      }
    };

    return (
      <div
        ref={ref}
        key={"grid-header-" + data.field}
        className={`${styles.headerCell} ${
          isSelectedOrder ? styles.headerCellSortSelected : ""
        }`}
        style={{ "--width": data.width, cursor: data.sortable && "pointer" }}
        title={t(data.title || data.label)}
        onClick={data.sortable ? handleSort : undefined}
      >
        {data.sortable &&
          (isSelectedOrder ? (
            order === "asc" ? (
              <FaArrowDown className={styles.orderIcon} />
            ) : (
              <FaArrowUp className={styles.orderIcon} />
            )
          ) : orders[0] === "asc" ? (
            <FaArrowDown className={styles.orderIcon} />
          ) : (
            <FaArrowUp className={styles.orderIcon} />
          ))}
        <span>{t(data.label)}</span>
      </div>
    );
  }
);
