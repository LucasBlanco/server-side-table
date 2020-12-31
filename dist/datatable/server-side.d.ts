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
export declare const serverSidePaginator: ({ label, firstPageNro }?: {
    label: string;
    firstPageNro: number;
}) => {
    total: number;
    page: number;
    itemsPerPage: number;
    nextPage: () => string;
    previousPage: () => string;
    firstPage: () => string;
    lastPage: () => string;
    getPage: (page: number) => string;
    setTotal: (total: number) => void;
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
        options: {
            textLabels: {
                body: {
                    noMatch: string;
                    toolTip: string;
                    columnHeaderTooltip: (column: any) => string;
                };
                pagination: {
                    next: string;
                    previous: string;
                    rowsPerPage: string;
                    displayRows: string;
                };
                toolbar: {
                    search: string;
                    downloadCsv: string;
                    print: string;
                    viewColumns: string;
                    filterTable: string;
                };
                filter: {
                    all: string;
                    title: string;
                    reset: string;
                };
                viewColumns: {
                    title: string;
                    titleAria: string;
                };
                selectedRows: {
                    text: string;
                    delete: string;
                    deleteAria: string;
                };
            };
            serverSide: boolean;
            filter: boolean;
            count: number;
            customSearchRender: ((searchText: string, handleSearch: (text: string) => void, hideSearch: () => void, options: any) => JSX.Element | import("react").Component<{}, {}, any>) | undefined;
            onTableChange: (action: string, tableState: MUIDataTableState) => void;
        };
    };
    reload: () => void;
};
export {};
