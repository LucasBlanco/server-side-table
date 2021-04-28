import React from 'react'

import {
  serverSideFilter,
  serverSideHandler,
  serverSideOrder,
  serverSidePaginator,
  useServerSide
} from '@lblanco/server-side-table'

import MUIDataTable from 'mui-datatables'
const fetchFn = (params: string) =>
  fetch('https://jsonplaceholder.typicode.com/todos?' + params)
    .then((res) => res.json())
    .then((data) => ({
      data: data as any[],
      total: 200
    }))

const baseTableHandler = serverSideHandler({
  paginator: serverSidePaginator({
    label: '_page',
    itemsPerPageLabel: '_limit',
    firstPageNro: 1
  }),
  filter: serverSideFilter('q'),
  order: serverSideOrder(
    ({ name, direction }) => `_sort=${name}&_order=${direction}`
  )
})

const App = () => {
  const { data, serverSideProps } = useServerSide<any>({
    requestFn: fetchFn,
    tableHandler: baseTableHandler
  })

  const columns = [
    {
      name: 'id',
      label: '#'
    },
    {
      name: 'title',
      label: 'Titulo'
    },
    {
      name: 'completed',
      label: 'Completado'
    }
  ]

  return (
    <MUIDataTable
      title='TODOS'
      data={data}
      columns={columns}
      {...serverSideProps}
    />
  )
}

export default App
