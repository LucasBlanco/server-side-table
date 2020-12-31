/// <reference types="react" />
import { useServerSide, serverSideOrder, serverSidePaginator, serverSideHandler, serverSideFilter } from './datatable/server-side';
import { localizationOptions } from './datatable/localization';
interface Props {
    text: string;
}
export { useServerSide, serverSideOrder, serverSidePaginator, serverSideHandler, serverSideFilter, localizationOptions };
export declare const ExampleComponent: ({ text }: Props) => JSX.Element;
