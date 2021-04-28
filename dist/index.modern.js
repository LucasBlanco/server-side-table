import { useState, useEffect, createElement } from 'react';
import { debounceSearchRender } from 'mui-datatables';

var styles = {"test":"_styles-module__test__3ybTi"};

const localizationOptions = {
  textLabels: {
    body: {
      noMatch: 'No se han encontrado registros que coincidan con la busqueda',
      toolTip: 'Ordenar',
      columnHeaderTooltip: column => `Orden para ${column.label}`
    },
    pagination: {
      next: 'Proxima',
      previous: 'Anterior',
      rowsPerPage: 'Registros por pagina:',
      displayRows: 'de',
      jumpToPage: 'Ir a la pagina'
    },
    toolbar: {
      search: 'Buscar',
      downloadCsv: 'Descargar CSV',
      print: 'Imprimir',
      viewColumns: 'Ver columnas',
      filterTable: 'Filtrar tabla'
    },
    filter: {
      all: 'Todos',
      title: 'FILTROS',
      reset: 'LIMPIAR'
    },
    viewColumns: {
      title: 'Ver columnas',
      titleAria: 'Ver/Ocultar columnas'
    },
    selectedRows: {
      text: 'registro(s) seleccionado',
      delete: 'Borrar',
      deleteAria: 'Borrar columnas seleccionadas'
    }
  }
};

const serverSidePaginator = (props = {
  label: 'page',
  firstPageNro: 1,
  itemsPerPageLabel: 'limit'
}) => {
  const paginatorInfo = {
    total: 0,
    page: props.firstPageNro,
    itemsPerPage: 10
  };

  const isPageValid = page => {
    const {
      itemsPerPage,
      total
    } = paginatorInfo;
    const noUnderflow = page >= props.firstPageNro;
    const noOverflow = total > 0 && itemsPerPage > 0 ? Math.ceil(total / itemsPerPage) >= page : true;
    return noUnderflow && noOverflow;
  };

  const getPage = page => {
    if (!isPageValid(page)) {
      throw new Error(`page ${page} is invalid`);
    }

    paginatorInfo.page = page;
    return `${props.label}=${page}&${props.itemsPerPageLabel}=${paginatorInfo.itemsPerPage}`;
  };

  const nextPage = () => getPage(paginatorInfo.page + 1);

  const previousPage = () => getPage(paginatorInfo.page - 1);

  const firstPage = () => getPage(props.firstPageNro);

  const lastPage = () => getPage(Math.ceil(paginatorInfo.total / paginatorInfo.itemsPerPage));

  const setTotal = total => {
    paginatorInfo.total = total;
  };

  const setItemsPerPage = amount => {
    paginatorInfo.itemsPerPage = amount;
  };

  return {
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    getPage,
    setTotal,
    setItemsPerPage,
    firstPageNro: props.firstPageNro,
    ...paginatorInfo
  };
};
const serverSideFilter = queryName => search => `${queryName}=${search}`;
const serverSideOrder = orderAdapter => orderCriteria => orderAdapter(orderCriteria);
const serverSideHandler = params => {
  let filterCache = '';
  let orderCache = '';
  let pageCache = '';

  const createQuery = () => [pageCache, filterCache, orderCache].filter(x => !!x).join('&');

  const nextPage = () => {
    pageCache = params.paginator.nextPage();
    return createQuery();
  };

  const previousPage = () => {
    pageCache = params.paginator.previousPage();
    return createQuery();
  };

  const firstPage = () => {
    pageCache = params.paginator.firstPage();
    return createQuery();
  };

  const loadData = firstPage;

  const lastPage = () => {
    pageCache = params.paginator.previousPage();
    return createQuery();
  };

  const getPage = nro => {
    pageCache = params.paginator.getPage(nro);
    return createQuery();
  };

  const filter = search => {
    filterCache = params.filter ? params.filter(search) : '';
    return createQuery();
  };

  const order = orderCriteria => {
    orderCache = params.order ? params.order(orderCriteria) : '';
    return createQuery();
  };

  const reset = () => {
    filterCache = '';
    orderCache = '';
    pageCache = '';
  };

  return {
    paginator: { ...params.paginator,
      nextPage,
      previousPage,
      firstPage,
      lastPage,
      getPage
    },
    loadData,
    filter,
    order,
    reset
  };
};
const useServerSide = function (props) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const {
    requestFn,
    tableHandler
  } = props;

  const loadData = params => {
    const promise = requestFn(params);

    const updateFn = res => {
      tableHandler.paginator.setTotal(res.total);
      setData(res.data);
      setTotal(res.total);
    };

    promise.then(updateFn);
  };

  const reload = () => {
    const {
      getPage,
      page
    } = tableHandler.paginator;
    loadData(getPage(page));
  };

  const serverSideOptions = {
    serverSide: true,
    filter: false,
    count: total,
    jumpToPage: true,
    rowsPerPageOptions: [10, 20, 50, 100],
    customSearchRender: debounceSearchRender(500),
    onTableChange: (action, tableState) => {
      if (action !== 'sort' && action !== 'search' && action !== 'changePage' && action !== 'changeRowsPerPage') {
        return;
      }

      tableHandler.reset();

      if (Object.keys(tableState.sortOrder).length > 0) {
        const {
          name,
          direction
        } = tableState.sortOrder;
        tableHandler.order({
          name,
          direction
        });
      }

      if (tableState.searchText) {
        tableHandler.filter(tableState.searchText);
      }

      tableHandler.paginator.setItemsPerPage(tableState.rowsPerPage);
      loadData(tableHandler.paginator.getPage(tableHandler.paginator.firstPageNro + tableState.page));
    }
  };
  useEffect(() => loadData(tableHandler.paginator.firstPage()), []);
  const customOptions = { ...serverSideOptions,
    ...localizationOptions
  };
  return {
    data,
    serverSideProps: {
      options: customOptions
    },
    reload
  };
};

const ExampleComponent = ({
  text
}) => {
  return createElement("div", {
    className: styles.test
  }, "Example: ", text);
};

export { ExampleComponent, localizationOptions, serverSideFilter, serverSideHandler, serverSideOrder, serverSidePaginator, useServerSide };
//# sourceMappingURL=index.modern.js.map
