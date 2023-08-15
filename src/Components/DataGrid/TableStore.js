import { computed, makeObservable, observable, action } from "mobx";
import { GridRow } from "./GridRow";

export class TableStore {
    top = 0;
    list = [];
    actions = {};
    columns = [];
    stickyRows = [];
    queryParams = {};
  rowHeight = 20;
    headerHeight = this.rowHeight;
    totalHeight = 0;
    translationDictionary = "common";

    widths = {};

    row = GridRow;
    noDataRow = null;

    constructor() {
        makeObservable(this, {
            top: observable,
            list: observable,
            actions: observable,
            columns: observable,
            stickyRows: observable,
            rowHeight: observable,
            headerHeight: observable,
            totalHeight: observable,
            queryParams: observable,
            widths: observable,

            row: observable,
            noDataRow: observable,

            setTop: action,
            setColumns: action,
            setStickyRows: action,
            setRowData: action,
            setRow: action,
            setNoDataRow: action,
            setTranslationDictionary: action,
            setRowHeight: action,
            setHeaderHeight: action,
            setWidth: action,
            setHeight: action,
            setQueryParams: action,
            sizeMap: computed,
            topMap: computed,
            sumOfWidths: computed,
            currentStickyTop: computed
        });
    }

    setTop = (top) => (this.top = top);
    setHeight = (height) => (this.height = height);
    setTotalHeight = (height) => (this.totalHeight = height);

    setRowData = (data) => {
        const { list = [], ...actions } = data;
        this.list = list;
        this.actions = actions || {};
    };

    setStickyRows = (rows) => (this.stickyRows = rows);
    setColumns = (columns) => {
        this.widths = columns.reduce((acc, curr) => {
            acc[curr.field] = this.widths[curr.field];
            return acc;
        }, {});
        this.columns = columns;
    };
    setRow = (row) => (this.row = row);
    setNoDataRow = (row) => (this.noDataRow = row);

  setTranslationDictionary = (dictionary) =>
    (this.translationDictionary = dictionary);
    setRowHeight = (height) => (this.rowHeight = height);
    setHeaderHeight = (height) => (this.headerHeight = height);
    setWidth = (field, width) => (this.widths[field] = width);
    setQueryParams = (queryParams) => (this.queryParams = queryParams);

    get sizeMap() {
        const sizeMap = [];
        let totalHeight = 0;
        this.list.forEach((i) => {
            sizeMap.push(i.rowHeight || this.rowHeight);
            totalHeight += i.rowHeight || this.rowHeight;
        });
        this.setTotalHeight(totalHeight);
        return sizeMap;
    }

    get topMap() {
        const topMap = [];
        let newTop = 0;
        this.list.forEach((i) => {
            topMap.push(newTop);
            newTop += i.rowHeight || this.rowHeight;
        });
        return topMap;
    }

    get currentStickyTop() {
        if (!this.stickyRows.length) return [];
        // search from last index
    const index = [...this.stickyRows]
      .reverse()
      .find((i) => this.topMap[i] <= this.top);

        return [index, this.list[index], this.sizeMap[index]];
    }

    get sumOfWidths() {
        return Object.values(this.widths).reduce((acc, curr) => acc + curr, 0);
    }
}
