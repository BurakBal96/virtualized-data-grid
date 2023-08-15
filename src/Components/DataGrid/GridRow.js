import React from "react";
import styles from "./DataGrid.module.scss";
import Moment from "moment";
import { CSS_BACKGROUND_VARIABLE } from "./GridBody";
import { inject, observer } from "mobx-react";

export const GridRow = inject("TableStore")(
  observer(
    ({ index, sticky, className = "", TableStore, top: _top, style = {} }) => {
      const {
        list,
        sizeMap,
        topMap,
        columns,
        noDataRow: NoDataRow,
        actions,
        widths,
        sumOfWidths: sum,
      } = TableStore;
      if (!list.length || index > list.length - 1) return null;

      const data = list[index];
      if (!data) return null;

      const background = index % 2 ? "#eaeaea" : "#ffffff";
      const height = sizeMap[index];
      const top = _top || topMap[index];
      const sumOfWidths = sum || 0;

      return (
        <div
          style={{
            [CSS_BACKGROUND_VARIABLE]: background,
            height,
            top,
            width: "auto",
            "--row-height-unit": height,
            ...style,
          }}
          className={`${styles.row} ${className}`}
        >
          {data.noData ? (
            NoDataRow ? (
              <NoDataRow width={sumOfWidths} height={height} data={data} />
            ) : (
              <div style={{ width: sumOfWidths, lineHeight: height }}>
                {data.label ?? ""}
              </div>
            )
          ) : (
            columns.map((column) => {
              const { field } = column;
              const width = widths[field];

              return (
                <GridCellWrapper
                  {...actions}
                  index={index}
                  key={`grid-row-${data.id || index}-${column.field}`}
                  data={data}
                  column={column}
                  sticky={sticky}
                  width={width}
                />
              );
            })
          )}
        </div>
      );
    }
  )
);

export const GridCellWrapper = React.memo((props) => {
  const { type, CustomCell } = props.column;

  if (CustomCell)
    return (
      <CustomCell
        {...props}
        // style={{ '--width': width }}
      />
    );

  switch (type) {
    case "text":
      return <GridTextCell {...props} />;
    case "date":
      return <GridDateCell {...props} />;
    default:
      return <GridTextCell {...props} />;
  }
});

const GridTextCell = React.memo(({ data, column, width }) => {
  const { field } = column;
  const _text = data[field];
  const text = typeof _text === "string" ? _text : JSON.stringify(_text);

  return (
    <div style={{ width }} title={text}>
      {text}
    </div>
  );
});

const GridDateCell = React.memo(({ data, column, width }) => {
  const { field } = column;
  const text = Moment(data[field]).format("lll");

  return (
    <div style={{ width }} title={text}>
      {text}
    </div>
  );
});
