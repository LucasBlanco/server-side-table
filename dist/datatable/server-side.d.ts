/// <reference types="react" />
import { MUIDataTableState } from 'mui-datatables';
interface OrderCriteria {
    name: string;
    direction: 'asc' | 'desc';
}
declare type ServerSideOrderFn = (x: OrderCriteria) => string;
interface RequestFnResponse<T> {
    data: T[];
    total: number;
}
declare type ServerRequestFn<T> = (params: string) => Promise<RequestFnResponse<T>>;
interface ServerSidePaginationProps {
    label: string;
    firstPageNro: number;
    itemsPerPageLabel: string;
}
export declare const serverSidePaginator: (props?: ServerSidePaginationProps) => {
    total: number;
    page: number;
    itemsPerPage: number;
    nextPage: () => string;
    previousPage: () => string;
    firstPage: () => string;
    lastPage: () => string;
    getPage: (page: number) => string;
    setTotal: (total: number) => void;
    setItemsPerPage: (amount: number) => void;
    firstPageNro: number;
};
export declare const serverSideFilter: (queryName: string) => (search: string) => string;
export declare const serverSideOrder: (orderAdapter: ServerSideOrderFn) => (orderCriteria: OrderCriteria) => string;
export declare const serverSideHandler: (params: {
    paginator: ReturnType<typeof serverSidePaginator>;
    filter?: ((search: string) => string) | undefined;
    order?: ((x: OrderCriteria) => string) | undefined;
}) => {
    paginator: {
        nextPage: () => string;
        previousPage: () => string;
        firstPage: () => string;
        lastPage: () => string;
        getPage: (nro: number) => string;
        total: number;
        page: number;
        itemsPerPage: number;
        setTotal: (total: number) => void;
        setItemsPerPage: (amount: number) => void;
        firstPageNro: number;
    };
    loadData: () => string;
    filter: (search: string) => string;
    order: (orderCriteria: OrderCriteria) => string;
    reset: () => void;
};
export declare const baseTableHandler: {
    paginator: {
        nextPage: () => string;
        previousPage: () => string;
        firstPage: () => string;
        lastPage: () => string;
        getPage: (nro: number) => string;
        total: number;
        page: number;
        itemsPerPage: number;
        setTotal: (total: number) => void;
        setItemsPerPage: (amount: number) => void;
        firstPageNro: number;
    };
    loadData: () => string;
    filter: (search: string) => string;
    order: (orderCriteria: OrderCriteria) => string;
    reset: () => void;
};
export declare const useServerSide: <T>(props: {
    requestFn: ServerRequestFn<T>;
    tableHandler: ReturnType<typeof serverSideHandler>;
}) => {
    data: T[];
    serverSideProps: {
        options: Partial<{
            caseSensitive: boolean;
            confirmFilters: boolean;
            columnOrder: number[];
            count: number;
            customFilterDialogFooter: (filterList: string[][], applyNewFilters?: ((...args: any[]) => any) | undefined) => import("react").ReactNode;
            customFooter: (rowCount: number, page: number, rowsPerPage: number, changeRowsPerPage: (page: import("react").ReactText) => void, changePage: (newPage: number) => void, textLabels: Partial<import("mui-datatables").MUIDataTableTextLabels>) => import("react").ReactNode;
            customRowRender: (data: any[], dataIndex: number, rowIndex: number) => import("react").ReactNode;
            customSearch: (searchQuery: string, currentRow: any[], columns: any[]) => boolean;
            customSearchRender: (searchText: string, handleSearch: (text: string) => void, hideSearch: () => void, options: any) => import("react").Component<{}, {}, any> | JSX.Element;
            customSort: (data: any[], colIndex: number, order: string) => any[];
            customTableBodyFooterRender: (options: {
                data: any[];
                selectableRows: import("mui-datatables").SelectableRows;
                columns: any[];
            }) => any;
            customToolbar: (data: {
                displayData: import("mui-datatables").DisplayData;
            }) => import("react").ReactNode;
            customToolbarSelect: (selectedRows: {
                data: {
                    index: number;
                    dataIndex: number;
                }[];
                lookup: {
                    [key: number]: boolean;
                };
            }, displayData: import("mui-datatables").DisplayData, setSelectedRows: (rows: number[]) => void) => import("react").ReactNode;
            disableToolbarSelect: boolean;
            download: import("mui-datatables").ToolbarButton;
            downloadOptions: Partial<{
                filename: string;
                separator: string;
                filterOptions: Partial<{
                    useDisplayedColumnsOnly: boolean;
                    useDisplayedRowsOnly: boolean;
                }>;
            }>;
            draggableColumns: import("mui-datatables").MUIDataTableDraggableColumns;
            elevation: number;
            enableNestedDataAccess: string;
            expandableRows: boolean;
            expandableRowsHeader: boolean;
            expandableRowsOnClick: boolean;
            filter: import("mui-datatables").ToolbarButton;
            filterArrayFullMatch: boolean;
            filterType: import("mui-datatables").FilterType;
            fixedHeader: boolean;
            fixedHeaderOptions: {
                xAxis: boolean;
                yAxis: boolean;
            };
            fixedSelectColumn: boolean;
            isRowExpandable: (dataIndex: number, expandedRows?: import("mui-datatables").MUIDataTableIsRowCheck | undefined) => boolean;
            isRowSelectable: (dataIndex: number, selectedRows?: import("mui-datatables").MUIDataTableIsRowCheck | undefined) => boolean;
            jumpToPage: boolean;
            onCellClick: (colData: any, cellMeta: {
                colIndex: number;
                rowIndex: number;
                dataIndex: number;
                event: import("react").MouseEvent<Element, MouseEvent>;
            }) => void;
            onChangePage: (currentPage: number) => void;
            onChangeRowsPerPage: (numberOfRows: number) => void;
            onColumnOrderChange: (newColumnOrder: number[], columnIndex: number, newPosition: number) => void;
            onColumnSortChange: (changedColumn: string, direction: "asc" | "desc") => void;
            onColumnViewChange?: ((changedColumn: string, action: string) => void) | undefined;
            onDownload: (buildHead: (columns: any) => string, buildBody: (data: any) => string, columns: any, data: any) => string | boolean;
            onFilterChange: (changedColumn: string | import("mui-datatables").MUIDataTableColumn | null, filterList: string[][], type: "dropdown" | "checkbox" | "multiselect" | "textField" | "custom" | "reset" | "chip", changedColumnIndex: number, displayData: import("mui-datatables").DisplayData) => void;
            onFilterChipClose: (index: number, removedFilter: string, filterList: string[][]) => void;
            onFilterConfirm: (filterList: string[][]) => void;
            onFilterDialogClose: () => void;
            onFilterDialogOpen: () => void;
            onRowClick: (rowData: string[], rowMeta: {
                dataIndex: number;
                rowIndex: number;
            }) => void;
            onRowExpansionChange: (currentRowsExpanded: any[], allRowsExpanded: any[], rowsExpanded?: any[] | undefined) => void;
            onRowsDelete: (rowsDeleted: {
                lookup: {
                    [dataIndex: number]: boolean;
                };
                data: {
                    index: number;
                    dataIndex: number;
                }[];
            }, newTableData: any[]) => false | void;
            onRowSelectionChange: (currentRowsSelected: any[], allRowsSelected: any[], rowsSelected?: any[] | undefined) => void;
            onSearchChange: (searchText: string | null) => void;
            onSearchClose: () => void;
            onSearchOpen: () => void;
            onTableChange: (action: string, tableState: MUIDataTableState) => void;
            onTableInit: (action: string, tableState: MUIDataTableState) => void;
            onViewColumnsChange: (changedColumn: string, action: string) => void;
            page: number;
            pagination: boolean;
            print: import("mui-datatables").ToolbarButton;
            renderExpandableRow: (rowData: string[], rowMeta: {
                dataIndex: number;
                rowIndex: number;
            }) => import("react").ReactNode;
            resizableColumns: boolean;
            responsive: import("mui-datatables").Responsive;
            rowHover: boolean;
            rowsExpanded: any[];
            rowsPerPage: number;
            rowsPerPageOptions: number[];
            rowsSelected: any[];
            search: import("mui-datatables").ToolbarButton;
            searchOpen: boolean;
            searchProps: import("react").HTMLAttributes<HTMLInputElement>;
            searchPlaceholder: string;
            searchText: string;
            selectableRows: import("mui-datatables").SelectableRows;
            selectableRowsHeader: boolean;
            selectableRowsHideCheckboxes: boolean;
            selectableRowsOnClick: boolean;
            selectToolbarPlacement: "none" | "replace" | "above";
            serverSide: boolean;
            setFilterChipProps: (colIndex: number, colName: string, data: readonly any[][]) => import("mui-datatables").MUIDataTableChip;
            setRowProps: (row: any[], dataIndex: number, rowIndex: number) => object;
            setTableProps: () => object;
            sort: boolean;
            sortFilterList: boolean;
            sortOrder: import("mui-datatables").MUISortOptions;
            tableId: string;
            tableBodyHeight: string;
            tableBodyMaxHeight: string;
            textLabels: Partial<import("mui-datatables").MUIDataTableTextLabels>;
            viewColumns: import("mui-datatables").ToolbarButton;
        }>;
    };
    reload: () => void;
};
export {};
