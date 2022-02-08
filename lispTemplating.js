/**
 * If the string starts and ends with quotes, remove them.
 *
 * Example:
 * '"hello"' -> 'hello'
 * `'hello"` -> `'hello"` unchanged since they are different types of quotes
 * @param str input string
 * @returns string with outer quotes stripped
 */
function stripOuterQuotes(str) {
    var first = str.charAt(0), last = str.charAt(str.length - 1);
    if (first.search(/('|")/) !== -1 && first === last) {
        return str.substr(1, str.length - 2);
    }
    else {
        return str;
    }
}
/**
 * Constructs the HTML string given the input tokens
 * @param tokens
 * @returns HTML string
 */
function constructHTML(tokens) {
    var innerContent = [];
    var attributes = [];
    var tag = '';
    var token = tokens.shift();
    while (token && token !== ')') {
        if (token === '(') {
            if (!tag) {
                token = tokens.shift();
                tag = token;
            }
            else {
                tokens.unshift(token);
                innerContent.push(constructHTML(tokens));
            }
        }
        else if (token[0] === ':') {
            var key = token.substring(1);
            var value = stripOuterQuotes(tokens.shift());
            attributes.push({ key: key, value: value });
        }
        else {
            innerContent.push(stripOuterQuotes(token));
        }
        token = tokens.shift();
    }
    return [
        "<" + tag + (attributes.length ? ' ' : '') + attributes
            .map(function (attr) { return attr.key + "=\"" + attr.value + "\""; })
            .join(' ') + ">",
        innerContent.join(''),
        "</" + tag + ">",
    ].join('');
}
/**
 * Throws if open and closing parentheses are unbalanced
 * @param tokens tokenized input to validate
 */
function validateMatchingParentheses(tokens) {
    var openCount = 0;
    for (var _i = 0, _a = tokens.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], index = _b[0], token = _b[1];
        if (token === '(') {
            openCount++;
        }
        else if (token === ')') {
            openCount--;
            if (openCount < 0) {
                throw new Error("Unexpected closing parentheses: " + tokens.slice(0, index).join(' '));
            }
        }
    }
    if (openCount !== 0) {
        throw new Error("Missing closing parentheses: " + tokens.join(' '));
    }
}
/**
 * Throws if expressions have no content
 * @param tokens tokenized input to validate
 */
function validateExpressionsNotEmpty(tokens) {
    for (var _i = 0, _a = tokens.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], index = _b[0], token = _b[1];
        if (index > 0) {
            var previousToken = tokens[index - 1];
            if (previousToken === '(' && token === ')') {
                throw new Error("Expression contains empty content: " + tokens
                    .slice(0, index)
                    .join(' '));
            }
        }
    }
}
/**
 * Converts s-expressions to html
 * @param input input s-expression to convert to html
 * @returns HTML string
 */
function toHTML(input) {
    var tokens = input
        .split(/(\s|\(|\)|'[^']*'|"[^"]*")/)
        .filter(function (el) {
        return el !== '' && el !== ' ';
    });
    validateMatchingParentheses(tokens);
    validateExpressionsNotEmpty(tokens);
    return constructHTML(tokens);
}
var params={dasharray:[25, 35, 40], stroke:["yellow","red","blue"], dashoffset:[0, -25, -60]};
var sum=-1
let a="banana"
//let b=`(div :id 1 bof (h1 ${a})     ${Array(8).fill().map((item, i) => `(p ${a})`).join('')})`
let b=`
(div :id main
  (div :id 1 bof (h1 ${a}) ${Array(8).fill().map((item, i) => `(p (input :type 'text' :value 'test' ${a}))`).join('')})
  (div :class 'pie' 
    (svg :viewbox '0 0 32 32' 
      (g :stroke-width '11.25' 
        ${params.dasharray.map((item,i) => `(circle :cx '16' :cy '16' :r '16' :stroke-dasharray '${item} 100' :stroke-dashoffset '${params.dashoffset[i]}' :stroke '${params.stroke[i]}')`).join('') }
      )
    )
  )
)`
$('body').append(toHTML(b))






