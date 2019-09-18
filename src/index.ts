import './declace';
function styleObject2String(obj:object): string {
    let str = ''
    Object.keys(obj).forEach((key) => {
        str += `${key}:${obj[key]};`
    });
    return str;
}

function create2Darray(x, y) {
    let a = [];
    for(let i = 0 ; i < x; i ++){
        a.push([]);
        for(let j = 0; j < y; j++) {
            a[i][j] = '';
        }
    }
    return a;
}

function create2DString(x, y) {
    let str = '';
    for(let i = 0 ; i < x; i ++){
        for(let j = 0; j < y; j++) {
            str += ' ';
        }
        str += '\n';
    }
    return str;
}

class ConsoleItem{
    data: Item;
    options: Options;
    constructor(item: Item) {
        this.data = item;
        this.options = item.options; 
    }

    translate(x:number, y:number) {
        const { position } = this.options;
        position.x = x;
        position.y = y;
        // console.log(this.item);
    }

    getPosition() {
        const {x, y} = this.data.options.position
        return {
            x, 
            y
        }
    }

    updateContent(content) {
        this.data.content = content;
    }

}

class ColorConsole {
    items: ConsoleItem[];
    width: number;
    height: number;
    timer: any;
    constructor(width: number, height: number) {
        this.items = [];
        this.width = width;
        this.height = height;
    }
    addItem(content: string, options: Options) {
        let item: ConsoleItem = new ConsoleItem({
            content,
            options: options
        });
        this.items.push(item);
        return item;
    }
    _calcItem(item: ConsoleItem): CalcItem {
        let {content, options} = item.data;
        let position, style;
        if (options) {
            position = options.position;
            style = options.style;
        }
        let styleStr = '';
        let col = 0;
        let row = 0
        if (position) {
            let { x, y } = position;
            col = y;
            row = x;
        }
        if (style) {
            styleStr = styleObject2String(style)
        }
        return { 
            content,
            styleStr,
            x: row,
            len: content.length,
            y: col
        }
    }
    _calcRowItem(rowItems: CalcItem[]) :string {
        let arr = Array.from({length: this.width}, () => ' ');
        rowItems.forEach((item) => {
               let start = item.x;
               for (let i = 0; i < item.len; i++) {
                   arr[start + i] = item.content[i];
               }
        });
        return arr.join('');
    }
    renderItems():void {
        let str = '';
        let items = this.items.map((item) => {
           return this._calcItem(item);
        });
        for(let i = 0 ; i < this.height ; i++) {
            const rowItems = items.filter((item) => item.y === i);
            if (rowItems.length) {
                let rowStr = this._calcRowItem(rowItems);
                str += rowStr;
            } else {
                for(let j = 0; j < this.height; j++) {
                    str += ' ';
                }
            }
            str += '\n';
        }
        console.log(`%c ${str}`, 'color: red; brackground: #222;');
    }
    render(fn):void {
        this.timer =  setInterval(() => {
            console.clear();
            fn();
            this.renderItems();
        }, 1000) 
    }
    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

}

let cc = new ColorConsole(60, 20);
cc.addItem('（づ￣3￣）づ╭❤～', {
    position: { x: 0, y: 0},
    style: null
});
let heart = cc.addItem('❤', {
    position: { x: 11, y: 0 },
    style: { color: 'green'}
});
let end = cc.addItem('o(￣ヘ￣o＃)', {
    position: { x: 30, y: 10 },
    style: { color: 'green'}
});

cc.render(() => {
    let {x, y} = heart.getPosition();
    if (x >= 30) {
        end.updateContent('(ˉ▽￣～) 切~~');
        cc.stop();
    } else {
        x += 4;
        y += 2;
        heart.translate(x, y);
    }
})




