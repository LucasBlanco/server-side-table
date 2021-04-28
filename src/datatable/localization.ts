export const localizationOptions = {
  textLabels: {
    body: {
      noMatch: 'No se han encontrado registros que coincidan con la busqueda',
      toolTip: 'Ordenar',
      columnHeaderTooltip: (column: any) => `Orden para ${column.label}`
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
}
