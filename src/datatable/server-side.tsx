import {
  debounceSearchRender,
  MUIDataTableOptions,
  MUIDataTableState
} from 'mui-datatables'
import { useEffect, useState } from 'react'
import { localizationOptions } from './localization'

interface ServerSidePaginatorInterface {
  total: number
  page: number
  itemsPerPage: number
}
interface OrderCriteria {
  name: string
  direction: 'asc' | 'desc'
}
type ServerSideOrderFn = (x: OrderCriteria) => string
interface RequestFnResponse<T> {
  data: T[]
  total: number
}
type ServerRequestFn<T> = (params: string) => Promise<RequestFnResponse<T>>

interface ServerSidePaginationProps {
  label: string
  firstPageNro: number
  itemsPerPageLabel: string
}

export const serverSidePaginator = (
  props: ServerSidePaginationProps = {
    label: 'page',
    firstPageNro: 1,
    itemsPerPageLabel: 'limit'
  }
) => {
  const paginatorInfo: ServerSidePaginatorInterface = {
    total: 0,
    page: props.firstPageNro,
    itemsPerPage: 10
  }

  const isPageValid = (page: number) => {
    const { itemsPerPage, total } = paginatorInfo
    const noUnderflow = page >= props.firstPageNro
    const noOverflow =
      total > 0 && itemsPerPage > 0
        ? Math.ceil(total / itemsPerPage) >= page
        : true
    return noUnderflow && noOverflow
  }

  const getPage = (page: number) => {
    if (!isPageValid(page)) {
      throw new Error(`page ${page} is invalid`)
    }
    paginatorInfo.page = page
    return `${props.label}=${page}&${props.itemsPerPageLabel}=${paginatorInfo.itemsPerPage}`
  }

  const nextPage = () => getPage(paginatorInfo.page + 1)

  const previousPage = () => getPage(paginatorInfo.page - 1)

  const firstPage = () => getPage(props.firstPageNro)

  const lastPage = () =>
    getPage(Math.ceil(paginatorInfo.total / paginatorInfo.itemsPerPage))

  const setTotal = (total: number) => {
    paginatorInfo.total = total
  }

  const setItemsPerPage = (amount: number) => {
    paginatorInfo.itemsPerPage = amount
  }

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
  }
}

export const serverSideFilter = (queryName: string) => (search: string) =>
  `${queryName}=${search}`

export const serverSideOrder = (orderAdapter: ServerSideOrderFn) => (
  orderCriteria: OrderCriteria
) => orderAdapter(orderCriteria)

export const serverSideHandler = (params: {
  paginator: ReturnType<typeof serverSidePaginator>
  filter?: ReturnType<typeof serverSideFilter>
  order?: (x: OrderCriteria) => string
}) => {
  let filterCache = ''
  let orderCache = ''
  let pageCache = ''

  const createQuery = () =>
    [pageCache, filterCache, orderCache].filter((x) => !!x).join('&')

  const nextPage = () => {
    pageCache = params.paginator.nextPage()
    return createQuery()
  }

  const previousPage = () => {
    pageCache = params.paginator.previousPage()
    return createQuery()
  }

  const firstPage = () => {
    pageCache = params.paginator.firstPage()
    return createQuery()
  }

  const loadData = firstPage

  const lastPage = () => {
    pageCache = params.paginator.previousPage()
    return createQuery()
  }
  const getPage = (nro: number) => {
    pageCache = params.paginator.getPage(nro)
    return createQuery()
  }
  const filter = (search: string) => {
    filterCache = params.filter ? params.filter(search) : ''
    return createQuery()
  }
  const order = (orderCriteria: OrderCriteria) => {
    orderCache = params.order ? params.order(orderCriteria) : ''
    return createQuery()
  }
  const reset = () => {
    filterCache = ''
    orderCache = ''
    pageCache = ''
  }

  return {
    paginator: {
      ...params.paginator,
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
  }
}

export const baseTableHandler = serverSideHandler({
  paginator: serverSidePaginator(),
  filter: serverSideFilter('filter'),
  order: serverSideOrder(
    ({ name, direction }) => `sortBy=${name}&orderBy=${direction}`
  )
})

export const useServerSide = function <T>(props: {
  requestFn: ServerRequestFn<T>
  tableHandler: ReturnType<typeof serverSideHandler>
}) {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const { requestFn, tableHandler } = props

  const loadData = (params: string) => {
    const promise = requestFn(params)
    const updateFn = (res: RequestFnResponse<T>) => {
      tableHandler.paginator.setTotal(res.total)
      setData(res.data)
      setTotal(res.total)
    }
    promise.then(updateFn)
  }

  const reload = () => {
    const { getPage, page } = tableHandler.paginator
    loadData(getPage(page))
  }

  const serverSideOptions: MUIDataTableOptions = {
    serverSide: true,
    filter: false,
    count: total,
    jumpToPage: true,
    rowsPerPageOptions: [10, 20, 50, 100],
    customSearchRender: debounceSearchRender(500),
    onTableChange: (action: string, tableState: MUIDataTableState) => {
      if (
        action !== 'sort' &&
        action !== 'search' &&
        action !== 'changePage' &&
        action !== 'changeRowsPerPage'
      ) {
        return
      }
      tableHandler.reset()
      if (Object.keys(tableState.sortOrder).length > 0) {
        const { name, direction } = tableState.sortOrder
        tableHandler.order({ name, direction })
      }
      if (tableState.searchText) {
        tableHandler.filter(tableState.searchText)
      }
      tableHandler.paginator.setItemsPerPage(tableState.rowsPerPage)
      loadData(
        tableHandler.paginator.getPage(
          tableHandler.paginator.firstPageNro + tableState.page
        )
      )
    }
  }

  useEffect(() => loadData(tableHandler.paginator.firstPage()), []) // First Load

  const customOptions: MUIDataTableOptions = {
    ...serverSideOptions,
    ...localizationOptions
  }

  return {
    data,
    serverSideProps: { options: customOptions },
    reload
  }
}

export const useServerSidePagination = useServerSide
