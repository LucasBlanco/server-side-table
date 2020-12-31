import * as React from 'react'
import styles from './styles.module.css'
import {
  useServerSide,
  serverSideOrder,
  serverSidePaginator,
  serverSideHandler,
  serverSideFilter
} from './datatable/server-side'
import { localizationOptions } from './datatable/localization'

interface Props {
  text: string
}

export {
  useServerSide,
  serverSideOrder,
  serverSidePaginator,
  serverSideHandler,
  serverSideFilter,
  localizationOptions
}

export const ExampleComponent = ({ text }: Props) => {
  return <div className={styles.test}>Example: {text}</div>
}
