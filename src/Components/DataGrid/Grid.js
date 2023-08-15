import React, { useCallback, useRef, useEffect, useMemo } from "react";
import styles from "./DataGrid.module.scss";
import { GridHeader } from "./GridHeader";
import { GridBody, GridRow } from "./index";
import { VariableSizeList } from "react-window";
import { useDeepCompareEffect, useMeasure } from "react-use";
import { TableStore } from "./TableStore";
import { inject, observer, Provider } from "mobx-react";
import { withRouter } from "react-router-dom";
import { qs } from "../../Helpers/QueryString";

const minHeight = 200;
const itemData = {};

export class Store {
  TableStore = new TableStore();
}

export const Grid = (props) => {
  const store = useRef(new Store());

  return (
    <Provider {...store.current}>
      <GridComponent {...props} />
    </Provider>
  );
};

const GridComponent = withRouter(
  inject("TableStore")(
    observer(
      ({
        columns: _columns,
        rowData = {},
        stickyRows,
        rowHeight,
        headerHeight = rowHeight,
        propsHeight,
        row = GridRow,
        noDataRow,
        translationDictionary,
        TableStore,
        className = "",
        history,
        overscanCount = 2,
        width = "100%",
      }) => {
        const { sizeMap } = TableStore;
        const listRef = useRef(null);
        const columns = useMemo(() => {
          return _columns.filter((i) => !i.disabled);
        }, [_columns]);
        const [container, { height: containerHeight }] = useMeasure();
        const height = propsHeight || containerHeight;

        useDeepCompareEffect(() => {
          TableStore.setRowData(rowData);
          listRef.current?.resetAfterIndex(0);
        }, [rowData]);

        useEffect(() => {
          const { sortKey: paramsSortKey, order } = qs.parse(
            history.location.search
          );
          TableStore.setQueryParams({ paramsSortKey, order });
        }, [history.location.search]);

        useEffect(() => {
          TableStore.setTranslationDictionary(translationDictionary);
          TableStore.setRowHeight(rowHeight);
          TableStore.setHeaderHeight(headerHeight);
          TableStore.setRow(row);
          TableStore.setNoDataRow(noDataRow);
          TableStore.setStickyRows(stickyRows || []);
        }, [
          translationDictionary,
          rowHeight,
          headerHeight,
          row,
          noDataRow,
          stickyRows,
        ]);

        useEffect(() => {
          TableStore.setColumns(columns);
        }, [columns]);

        const handleScroll = useCallback(
          ({ scrollOffset }) => {
            TableStore.setTop(scrollOffset);
          },
          [TableStore]
        );
        const getItemSize = useCallback(
          (index) => {
            if (!sizeMap.length) return 0;
            return sizeMap[index] || 0;
          },
          [sizeMap]
        );

        return (
          <div
            ref={container}
            className={`${styles.dataGridWrapper} ${className}`}
            style={{ minHeight, position: "relative" }}
          >
            <VariableSizeList
              ref={listRef}
              outerElementType={Outer}
              innerElementType={Inner}
              itemSize={getItemSize}
              width={width}
              height={height}
              itemData={itemData}
              itemCount={
                (rowData.list?.length || 0) +
                Math.ceil(headerHeight / rowHeight)
              }
              overscanCount={overscanCount}
              onScroll={handleScroll}
            >
              {row}
            </VariableSizeList>
          </div>
        );
      }
    )
  )
);

const Inner = inject("TableStore")(
  observer(({ children, style, TableStore }) => {
    const { headerHeight } = TableStore;
    return (
      <>
        <div
          className={styles.dataGrid}
          style={{
            height: TableStore.totalHeight + headerHeight,
            "--header-height-unit": headerHeight,
          }}
        >
          <HeaderWrapper />
          <GridBody>{children}</GridBody>
        </div>
      </>
    );
  })
);

const Outer = React.forwardRef(({ style: _style, ...props }, ref) => {
  const style = useMemo(() => {
    return { ..._style, overflow: "scroll" };
  }, [_style]);
  return <div style={style} {...props} ref={ref} />;
});

const HeaderWrapper = React.memo(() => {
  return (
    <div className={styles.headerWrapper}>
      <GridHeader>
        <StickyRows />
      </GridHeader>
    </div>
  );
});

const StickyRows = inject("TableStore")(
  observer((props) => {
    const {
      stickyRows,
      row,
      currentStickyTop: [index, data],
      headerHeight,
    } = props.TableStore;

    if (!stickyRows.length) {
      return null;
    }

    return React.createElement(row, {
      key: "sticky-row-" + (data?.id || index),
      index,
      data,
      top: headerHeight,
      sticky: true,
    });
  })
);
