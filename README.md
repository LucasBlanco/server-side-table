# @lblanco/server-side-table

> Adds server side handlers for gregnb/mui-datatables

[![NPM](https://img.shields.io/npm/v/@lblanco/server-side-table.svg)](https://www.npmjs.com/package/@lblanco/server-side-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @lblanco/server-side-table
```

## Example

https://lucasblanco.github.io/server-side-table/

## Usage

```tsx
import React from 'react'

import {
  serverSideFilter,
  serverSideHandler,
  serverSideOrder,
  serverSidePaginator,
  useServerSide,
  localizationOptions
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
  paginator: serverSidePaginator({ label: '_page', firstPageNro: 1 }),
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
```

## License

MIT © [LucasBlanco](https://github.com/LucasBlanco)
