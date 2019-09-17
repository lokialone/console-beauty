function styleObject2String(obj) {
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
    constructor(item) {
        this.item = item;
        this.options = item.options; 
    }

    translate(x, y) {
        const { position } = this.options;
        position.x = x;
        position.y = y;
    }

    updateContent(content) {
        this._item.content = content;
    }

}


class ColorConsole {
    constructor(width, height) {
        this.items = [];
        this.width = width;
        this.height = height;
    }
    addItem(content, options = {
        position:null,
        style:null
    }) {
        let item = new ConsoleItem({
            content,
            options
        })
        this.items.push(item);
        return item;
    }
    
    _calcItem(item) {
        let {content, options} = item.item;
        let position, style;
        if (options) {
            position = options.position;
            style = options.style;
        }
        let styleStr = '';
        let col = 0;
        if (position) {
            let {x, y} = position;
            col = y;
            let indent = '';
            for(let i = 0 ; i < x; i ++) {
                indent += ' ';
            }
            content = indent + content;
        }
        if (style) {
            styleStr = styleObject2String(style)
        }
        return { 
            content,
            styleStr,
            y: col
        }
    }
    render() {
        let str = '';
        let items = this.items.map((item) => {
           return this._calcItem(item);
        });
        for(let i = 0 ; i < this.width ; i++) {
            const rowItems = items.filter((item) => item.y === i);
            if (rowItems.length) {
                rowItems.forEach((item) => {
                    str += item.content;
                })
            } else {
                for(let j = 0; j < this.height; j++) {
                    str += ' ';
                }
            }
            str += '\n';
        }
        console.log(`%c ${str}`, 'color: red');
    }

    clear() {

    }

}

let cc = new ColorConsole(20, 50);
let item = cc.addItem('xxxxxx');

cc.render()




