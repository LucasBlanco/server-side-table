var React = require('react');
var muiDatatables = require('mui-datatables');

var styles = {"test":"_styles-module__test__3ybTi"};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var localizationOptions = {
  textLabels: {
    body: {
      noMatch: 'No se han encontrado registros que coincidan con la busqueda',
      toolTip: 'Ordenar',
      columnHeaderTooltip: function columnHeaderTooltip(column) {
        return "Orden para " + column.label;
      }
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
      "delete": 'Borrar',
      deleteAria: 'Borrar columnas seleccionadas'
    }
  }
};

var serverSidePaginator = function serverSidePaginator(props) {
  if (props === void 0) {
    props = {
      label: 'page',
      firstPageNro: 1,
      itemsPerPageLabel: 'limit'
    };
  }

  var paginatorInfo = {
    total: 0,
    page: props.firstPageNro,
    itemsPerPage: 10
  };

  var isPageValid = function isPageValid(page) {
    var itemsPerPage = paginatorInfo.itemsPerPage,
        total = paginatorInfo.total;
    var noUnderflow = page >= props.firstPageNro;
    var noOverflow = total > 0 && itemsPerPage > 0 ? Math.ceil(total / itemsPerPage) >= page : true;
    return noUnderflow && noOverflow;
  };

  var getPage = function getPage(page) {
    if (!isPageValid(page)) {
      throw new Error("page " + page + " is invalid");
    }

    paginatorInfo.page = page;
    return props.label + "=" + page + "&" + props.itemsPerPageLabel + "=" + paginatorInfo.itemsPerPage;
  };

  var nextPage = function nextPage() {
    return getPage(paginatorInfo.page + 1);
  };

  var previousPage = function previousPage() {
    return getPage(paginatorInfo.page - 1);
  };

  var firstPage = function firstPage() {
    return getPage(props.firstPageNro);
  };

  var lastPage = function lastPage() {
    return getPage(Math.ceil(paginatorInfo.total / paginatorInfo.itemsPerPage));
  };

  var setTotal = function setTotal(total) {
    paginatorInfo.total = total;
  };

  var setItemsPerPage = function setItemsPerPage(amount) {
    paginatorInfo.itemsPerPage = amount;
  };

  return _extends({
    nextPage: nextPage,
    previousPage: previousPage,
    firstPage: firstPage,
    lastPage: lastPage,
    getPage: getPage,
    setTotal: setTotal,
    setItemsPerPage: setItemsPerPage,
    firstPageNro: props.firstPageNro
  }, paginatorInfo);
};
var serverSideFilter = function serverSideFilter(queryName) {
  return function (search) {
    return queryName + "=" + search;
  };
};
var serverSideOrder = function serverSideOrder(orderAdapter) {
  return function (orderCriteria) {
    return orderAdapter(orderCriteria);
  };
};
var serverSideHandler = function serverSideHandler(params) {
  var filterCache = '';
  var orderCache = '';
  var pageCache = '';

  var createQuery = function createQuery() {
    return [pageCache, filterCache, orderCache].filter(function (x) {
      return !!x;
    }).join('&');
  };

  var nextPage = function nextPage() {
    pageCache = params.paginator.nextPage();
    return createQuery();
  };

  var previousPage = function previousPage() {
    pageCache = params.paginator.previousPage();
    return createQuery();
  };

  var firstPage = function firstPage() {
    pageCache = params.paginator.firstPage();
    return createQuery();
  };

  var loadData = firstPage;

  var lastPage = function lastPage() {
    pageCache = params.paginator.previousPage();
    return createQuery();
  };

  var getPage = function getPage(nro) {
    pageCache = params.paginator.getPage(nro);
    return createQuery();
  };

  var filter = function filter(search) {
    filterCache = params.filter ? params.filter(search) : '';
    return createQuery();
  };

  var order = function order(orderCriteria) {
    orderCache = params.order ? params.order(orderCriteria) : '';
    return createQuery();
  };

  var reset = function reset() {
    filterCache = '';
    orderCache = '';
    pageCache = '';
  };

  return {
    paginator: _extends({}, params.paginator, {
      nextPage: nextPage,
      previousPage: previousPage,
      firstPage: firstPage,
      lastPage: lastPage,
      getPage: getPage
    }),
    loadData: loadData,
    filter: filter,
    order: order,
    reset: reset
  };
};
var baseTableHandler = serverSideHandler({
  paginator: serverSidePaginator(),
  filter: serverSideFilter('filter'),
  order: serverSideOrder(function (_ref) {
    var name = _ref.name,
        direction = _ref.direction;
    return "sortBy=" + name + "&orderBy=" + direction;
  })
});
var useServerSide = function useServerSide(props) {
  var _useState = React.useState([]),
      data = _useState[0],
      setData = _useState[1];

  var _useState2 = React.useState(0),
      total = _useState2[0],
      setTotal = _useState2[1];

  var requestFn = props.requestFn,
      tableHandler = props.tableHandler;

  var loadData = function loadData(params) {
    var promise = requestFn(params);

    var updateFn = function updateFn(res) {
      tableHandler.paginator.setTotal(res.total);
      setData(res.data);
      setTotal(res.total);
    };

    promise.then(updateFn);
  };

  var reload = function reload() {
    var _tableHandler$paginat = tableHandler.paginator,
        getPage = _tableHandler$paginat.getPage,
        page = _tableHandler$paginat.page;
    loadData(getPage(page));
  };

  var serverSideOptions = {
    serverSide: true,
    filter: false,
    count: total,
    jumpToPage: true,
    rowsPerPageOptions: [10, 20, 50, 100],
    customSearchRender: muiDatatables.debounceSearchRender(500),
    onTableChange: function onTableChange(action, tableState) {
      if (action !== 'sort' && action !== 'search' && action !== 'changePage' && action !== 'changeRowsPerPage') {
        return;
      }

      tableHandler.reset();

      if (Object.keys(tableState.sortOrder).length > 0) {
        var _tableState$sortOrder = tableState.sortOrder,
            name = _tableState$sortOrder.name,
            direction = _tableState$sortOrder.direction;
        tableHandler.order({
          name: name,
          direction: direction
        });
      }

      if (tableState.searchText) {
        tableHandler.filter(tableState.searchText);
      }

      tableHandler.paginator.setItemsPerPage(tableState.rowsPerPage);
      loadData(tableHandler.paginator.getPage(tableHandler.paginator.firstPageNro + tableState.page));
    }
  };
  React.useEffect(function () {
    return loadData(tableHandler.paginator.firstPage());
  }, []);

  var customOptions = _extends({}, serverSideOptions, localizationOptions);

  return {
    data: data,
    serverSideProps: {
      options: customOptions
    },
    reload: reload
  };
};

var ExampleComponent = function ExampleComponent(_ref) {
  var text = _ref.text;
  return React.createElement("div", {
    className: styles.test
  }, "Example: ", text);
};

exports.ExampleComponent = ExampleComponent;
exports.localizationOptions = localizationOptions;
exports.serverSideFilter = serverSideFilter;
exports.serverSideHandler = serverSideHandler;
exports.serverSideOrder = serverSideOrder;
exports.serverSidePaginator = serverSidePaginator;
exports.useServerSide = useServerSide;
//# sourceMappingURL=index.js.map
