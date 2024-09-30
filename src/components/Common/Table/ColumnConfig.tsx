export type ColumnConfig = {
    field?: string;
    header?: string;
    sortable?: boolean;
    headerStyle?: React.CSSProperties;
    body?: (rowData: any) => JSX.Element;  // For custom cell rendering
};