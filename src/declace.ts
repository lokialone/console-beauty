interface ItemPosition {
    x: number;
    y: number
}

interface Options {
    position: ItemPosition;
    style: object
}

interface Item {
    content: string;
    options?: Options
}

interface CalcItem {
    content: string,
    styleStr?: string,
    x: number,
    y: number,
    len: number
}