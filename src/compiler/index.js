const cname = '[a-zA-Z_][\\w\\-\\.]*'; //标签名   
const qnameCapture = `((?:${cname}\\:)?${cname})`;  //获取标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`);  //匹配开始标签
const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');  //匹配闭合标签
// aa = "xxxx" | 'xxxx' | xxxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;   //标签关闭 > />
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{}}

//  Html字符串解析成对应的脚本 

function parserHTML(html) {
    function advance(len) {
        html = html.substring(len)
    }
    function start(tagName,attr) {

    }
    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            let end, attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push([{ name: attr[1], value: attr[3] || attr[4] || attr[5] }])
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length);
            }
            return match
        }
        return false;//不是开始标签
    }
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd == 0) {
            const startTagMatch = parseStartTag(html)
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }

        }
    }
}

export function compileToFunction(template) {
    console.log(template, 'www');
    parserHTML(template)
}