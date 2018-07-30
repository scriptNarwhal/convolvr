(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function newProgramASTNode() {
    var p = new Program(Array());
    return p;
}
exports.newProgramASTNode = newProgramASTNode;
var Program = /** @class */function () {
    function Program(Statements, NodeName) {
        if (NodeName === void 0) {
            NodeName = "Program";
        }
        this.Statements = Statements;
        this.NodeName = NodeName;
    }
    Program.prototype.TokenLiteral = function () {
        if (this.Statements.length > 0) {
            return this.Statements[0].TokenLiteral();
        } else {
            return "";
        }
    };
    Program.prototype.String = function () {
        var out = "";
        this.Statements.forEach(function (s) {
            out += s.String();
        });
        return out;
    };
    return Program;
}();
exports.Program = Program;
var PrefixExpression = /** @class */function () {
    function PrefixExpression(Token, // The prefix token, e.g. !
    Operator, Right, NodeName) {
        if (NodeName === void 0) {
            NodeName = "PrefixExpression";
        }
        this.Token = Token;
        this.Operator = Operator;
        this.Right = Right;
        this.NodeName = NodeName;
    }
    PrefixExpression.prototype.expressionNode = function () {};
    PrefixExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    PrefixExpression.prototype.String = function () {
        var out = "(";
        out += this.Operator;
        out += this.Right.String();
        out += ")";
        return out;
    };
    return PrefixExpression;
}();
exports.PrefixExpression = PrefixExpression;
var InfixExpression = /** @class */function () {
    function InfixExpression(Token, // The operator token, e.g. +
    Left, Operator, Right, NodeName) {
        if (NodeName === void 0) {
            NodeName = "InfixExpression";
        }
        this.Token = Token;
        this.Left = Left;
        this.Operator = Operator;
        this.Right = Right;
        this.NodeName = NodeName;
    }
    InfixExpression.prototype.expressionNode = function () {};
    InfixExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    InfixExpression.prototype.String = function () {
        var out = "(";
        out += this.Left.String();
        out += " " + this.Operator + " ";
        out += this.Right.String();
        out += ")";
        return out;
    };
    return InfixExpression;
}();
exports.InfixExpression = InfixExpression;
var IfExpression = /** @class */function () {
    function IfExpression(Token, // The 'if' token
    Condition, Consequence, Alternative, NodeName) {
        if (NodeName === void 0) {
            NodeName = "IfExpression";
        }
        this.Token = Token;
        this.Condition = Condition;
        this.Consequence = Consequence;
        this.Alternative = Alternative;
        this.NodeName = NodeName;
    }
    IfExpression.prototype.expressionNode = function () {};
    IfExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    IfExpression.prototype.String = function () {
        var out = "";
        out += "if";
        out += this.Condition.String();
        out += " ";
        out += this.Consequence.String();
        if (this.Alternative != null) {
            out += "else ";
            out += this.Alternative.String();
        }
        return out;
    };
    return IfExpression;
}();
exports.IfExpression = IfExpression;
var ForExpression = /** @class */function () {
    function ForExpression(Token, // The 'for' token
    Element, Range, Consequence, NodeName) {
        if (NodeName === void 0) {
            NodeName = "ForExpression";
        }
        this.Token = Token;
        this.Element = Element;
        this.Range = Range;
        this.Consequence = Consequence;
        this.NodeName = NodeName;
    }
    ForExpression.prototype.expressionNode = function () {};
    ForExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    ForExpression.prototype.String = function () {
        var out = "";
        out += "for ( " + this.Element.String() + ", " + this.Range.String() + " ) {";
        out += this.Consequence.String();
        out += "}";
        return out;
    };
    return ForExpression;
}();
exports.ForExpression = ForExpression;
var WhileExpression = /** @class */function () {
    function WhileExpression(Token, // The 'while' token
    Condition, Consequence, NodeName) {
        if (NodeName === void 0) {
            NodeName = "WhileExpression";
        }
        this.Token = Token;
        this.Condition = Condition;
        this.Consequence = Consequence;
        this.NodeName = NodeName;
    }
    WhileExpression.prototype.expressionNode = function () {};
    WhileExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    WhileExpression.prototype.String = function () {
        var out = "";
        out += "while (" + this.Condition.String() + ") {";
        out += this.Consequence.String();
        out += "}";
        return out;
    };
    return WhileExpression;
}();
exports.WhileExpression = WhileExpression;
var SleepExpression = /** @class */function () {
    function SleepExpression(Token, // The 'while' token
    Duration, Consequence, NodeName) {
        if (NodeName === void 0) {
            NodeName = "SleepExpression";
        }
        this.Token = Token;
        this.Duration = Duration;
        this.Consequence = Consequence;
        this.NodeName = NodeName;
    }
    SleepExpression.prototype.expressionNode = function () {};
    SleepExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    SleepExpression.prototype.String = function () {
        var out = "";
        out += "sleep (" + this.Duration.String() + ") {";
        out += this.Consequence.String();
        out += "}";
        return out;
    };
    return SleepExpression;
}();
exports.SleepExpression = SleepExpression;
var CallExpression = /** @class */function () {
    function CallExpression(Token, // The '(' token
    Function, // Identifier or FunctionLiteral
    Arguments, NodeName) {
        if (Arguments === void 0) {
            Arguments = [];
        }
        if (NodeName === void 0) {
            NodeName = "CallExpression";
        }
        this.Token = Token;
        this.Function = Function;
        this.Arguments = Arguments;
        this.NodeName = NodeName;
    }
    CallExpression.prototype.expressionNode = function () {};
    CallExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    CallExpression.prototype.String = function () {
        var out = "",
            args = [];
        this.Arguments.forEach(function (a) {
            args.push(a.String());
        });
        out += this.Function.String();
        out += "(";
        out += args.join(", ");
        out += ")";
        return out;
    };
    return CallExpression;
}();
exports.CallExpression = CallExpression;
var NewExpression = /** @class */function () {
    function NewExpression(Token, // the token.NEW token
    Name, NodeName) {
        if (NodeName === void 0) {
            NodeName = "NewExpression";
        }
        this.Token = Token;
        this.Name = Name;
        this.NodeName = NodeName;
    }
    NewExpression.prototype.expressionNode = function () {};
    NewExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    NewExpression.prototype.String = function () {
        var out = this.TokenLiteral() + " " + out + this.Name.String();
        return out;
    };
    return NewExpression;
}();
exports.NewExpression = NewExpression;
var ExecExpression = /** @class */function () {
    function ExecExpression(Token, // the token.NEW token
    Name, NodeName) {
        if (NodeName === void 0) {
            NodeName = "ExecExpression";
        }
        this.Token = Token;
        this.Name = Name;
        this.NodeName = NodeName;
    }
    ExecExpression.prototype.expressionNode = function () {};
    ExecExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    ExecExpression.prototype.String = function () {
        var out = this.TokenLiteral() + " " + out + this.Name.String();
        return out;
    };
    return ExecExpression;
}();
exports.ExecExpression = ExecExpression;
var AssignmentStatement = /** @class */function () {
    function AssignmentStatement(Name, Value, NodeName) {
        if (NodeName === void 0) {
            NodeName = "AssignmentStatement";
        }
        this.Name = Name;
        this.Value = Value;
        this.NodeName = NodeName;
    }
    AssignmentStatement.prototype.statementNode = function () {};
    AssignmentStatement.prototype.TokenLiteral = function () {
        return this.Name.Value;
    };
    AssignmentStatement.prototype.String = function () {
        var out = "";
        out += this.Name.String();
        out += " = ";
        if (this.Value != null) {
            out += this.Value.String();
        }
        out += ";";
        return out;
    };
    return AssignmentStatement;
}();
exports.AssignmentStatement = AssignmentStatement;
var LetStatement = /** @class */function () {
    function LetStatement(Token, // the token.LET token
    Name, Value, NodeName) {
        if (NodeName === void 0) {
            NodeName = "LetStatement";
        }
        this.Token = Token;
        this.Name = Name;
        this.Value = Value;
        this.NodeName = NodeName;
    }
    LetStatement.prototype.statementNode = function () {};
    LetStatement.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    LetStatement.prototype.String = function () {
        var out;
        out += this.TokenLiteral() + " ";
        out += this.Name.String();
        out += " = ";
        if (this.Value != null) {
            out += this.Value.String();
        }
        out += ";";
        return out;
    };
    return LetStatement;
}();
exports.LetStatement = LetStatement;
var ClassStatement = /** @class */function () {
    function ClassStatement(Token, // the token.LET token
    Name, Value, NodeName) {
        if (NodeName === void 0) {
            NodeName = "ClassStatement";
        }
        this.Token = Token;
        this.Name = Name;
        this.Value = Value;
        this.NodeName = NodeName;
    }
    ClassStatement.prototype.statementNode = function () {};
    ClassStatement.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    ClassStatement.prototype.String = function () {
        var out;
        out += this.TokenLiteral() + " ";
        out += this.Name.String();
        out += " = ";
        if (this.Value != null) {
            out += this.Value.String();
        }
        out += ";";
        return out;
    };
    return ClassStatement;
}();
exports.ClassStatement = ClassStatement;
var ReturnStatement = /** @class */function () {
    function ReturnStatement(Token, // the 'return' token
    ReturnValue, NodeName) {
        if (NodeName === void 0) {
            NodeName = "ReturnStatement";
        }
        this.Token = Token;
        this.ReturnValue = ReturnValue;
        this.NodeName = NodeName;
    }
    ReturnStatement.prototype.statementNode = function () {};
    ReturnStatement.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    ReturnStatement.prototype.String = function () {
        var out = "";
        out += this.TokenLiteral() + " ";
        if (this.ReturnValue != null) {
            out += this.ReturnValue.String();
        }
        out += ";";
        return out;
    };
    return ReturnStatement;
}();
exports.ReturnStatement = ReturnStatement;
var ExpressionStatement = /** @class */function () {
    function ExpressionStatement(Token, // the first token of the expression
    Expression, NodeName) {
        if (NodeName === void 0) {
            NodeName = "ExpressionStatement";
        }
        this.Token = Token;
        this.Expression = Expression;
        this.NodeName = NodeName;
    }
    ExpressionStatement.prototype.statementNode = function () {};
    ExpressionStatement.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    ExpressionStatement.prototype.String = function () {
        if (this.Expression != null) {
            return this.Expression.String();
        }
        return "";
    };
    return ExpressionStatement;
}();
exports.ExpressionStatement = ExpressionStatement;
var BlockStatement = /** @class */function () {
    function BlockStatement(Token, // the { token
    Statements, NodeName) {
        if (Statements === void 0) {
            Statements = [];
        }
        if (NodeName === void 0) {
            NodeName = "BlockStatement";
        }
        this.Token = Token;
        this.Statements = Statements;
        this.NodeName = NodeName;
    }
    BlockStatement.prototype.statementNode = function () {};
    BlockStatement.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    BlockStatement.prototype.String = function () {
        var out = "";
        this.Statements.forEach(function (s) {
            out += s.String();
        });
        return out;
    };
    return BlockStatement;
}();
exports.BlockStatement = BlockStatement;
var IndexExpression = /** @class */function () {
    function IndexExpression(Token, // The [ token
    Left, Index, NodeName) {
        if (NodeName === void 0) {
            NodeName = "IndexExpression";
        }
        this.Token = Token;
        this.Left = Left;
        this.Index = Index;
        this.NodeName = NodeName;
    }
    IndexExpression.prototype.expressionNode = function () {};
    IndexExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    IndexExpression.prototype.String = function () {
        var out = "";
        out += this.Left.String();
        out += ".";
        out += this.Index.String();
        return out;
    };
    return IndexExpression;
}();
exports.IndexExpression = IndexExpression;
var IndexAssignmentExpression = /** @class */function () {
    function IndexAssignmentExpression(Token, // The [ token
    Left, Index, Assignment, NodeName) {
        if (NodeName === void 0) {
            NodeName = "IndexAssignmentExpression";
        }
        this.Token = Token;
        this.Left = Left;
        this.Index = Index;
        this.Assignment = Assignment;
        this.NodeName = NodeName;
    }
    IndexAssignmentExpression.prototype.expressionNode = function () {};
    IndexAssignmentExpression.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    IndexAssignmentExpression.prototype.String = function () {
        var out = "";
        out += this.Left.String();
        out += ".";
        out += this.Index.String();
        out += "=";
        out += this.Assignment.String();
        return out;
    };
    return IndexAssignmentExpression;
}();
exports.IndexAssignmentExpression = IndexAssignmentExpression;
var Identifier = /** @class */function () {
    function Identifier(Token, // the token.IDENT token
    Value, NodeName) {
        if (NodeName === void 0) {
            NodeName = "Identifier";
        }
        this.Token = Token;
        this.Value = Value;
        this.NodeName = NodeName;
    }
    Identifier.prototype.String = function () {
        return this.Value;
    };
    Identifier.prototype.expressionNode = function () {};
    Identifier.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    return Identifier;
}();
exports.Identifier = Identifier;
var IntegerLiteral = /** @class */function () {
    function IntegerLiteral(Token, Value, NodeName) {
        if (NodeName === void 0) {
            NodeName = "IntegerLiteral";
        }
        this.Token = Token;
        this.Value = Value;
        this.NodeName = NodeName;
    }
    IntegerLiteral.prototype.expressionNode = function () {};
    IntegerLiteral.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    IntegerLiteral.prototype.String = function () {
        return this.Token.Literal;
    };
    return IntegerLiteral;
}();
exports.IntegerLiteral = IntegerLiteral;
var StringLiteral = /** @class */function () {
    function StringLiteral(Token, Value, NodeName) {
        if (NodeName === void 0) {
            NodeName = "StringLiteral";
        }
        this.Token = Token;
        this.Value = Value;
        this.NodeName = NodeName;
    }
    StringLiteral.prototype.expressionNode = function () {};
    StringLiteral.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    StringLiteral.prototype.String = function () {
        return this.Token.Literal;
    };
    return StringLiteral;
}();
exports.StringLiteral = StringLiteral;
var FunctionLiteral = /** @class */function () {
    function FunctionLiteral(Token, // The 'fn' token
    Parameters, Body, ObjectContext, NodeName) {
        if (Parameters === void 0) {
            Parameters = [];
        }
        if (NodeName === void 0) {
            NodeName = "FunctionLiteral";
        }
        this.Token = Token;
        this.Parameters = Parameters;
        this.Body = Body;
        this.ObjectContext = ObjectContext;
        this.NodeName = NodeName;
    }
    FunctionLiteral.prototype.expressionNode = function () {};
    FunctionLiteral.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    FunctionLiteral.prototype.String = function () {
        var out = "",
            params = [];
        this.Parameters.forEach(function (p) {
            params.push(p.String());
        });
        out += this.TokenLiteral();
        out += "(" + params.join(", ") + ") ";
        out += this.Body.String();
        return out;
    };
    return FunctionLiteral;
}();
exports.FunctionLiteral = FunctionLiteral;
var StreamLiteral = /** @class */function () {
    function StreamLiteral(Token, // The 'stream' token
    Emit, Body, ObjectContext, NodeName) {
        if (NodeName === void 0) {
            NodeName = "StreamLiteral";
        }
        this.Token = Token;
        this.Emit = Emit;
        this.Body = Body;
        this.ObjectContext = ObjectContext;
        this.NodeName = NodeName;
    }
    StreamLiteral.prototype.expressionNode = function () {};
    StreamLiteral.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    StreamLiteral.prototype.String = function () {
        var out = "";
        out += this.TokenLiteral();
        out += "(" + this.Emit.Value + ") ";
        out += this.Body.String();
        return out;
    };
    return StreamLiteral;
}();
exports.StreamLiteral = StreamLiteral;
var Boolean = /** @class */function () {
    function Boolean(Token, Value, NodeName) {
        if (NodeName === void 0) {
            NodeName = "Boolean";
        }
        this.Token = Token;
        this.Value = Value;
        this.NodeName = NodeName;
    }
    Boolean.prototype.expressionNode = function () {};
    Boolean.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    Boolean.prototype.String = function () {
        return this.Token.Literal;
    };
    return Boolean;
}();
exports.Boolean = Boolean;
var ArrayLiteral = /** @class */function () {
    function ArrayLiteral(Token, // the '[' token
    Elements, NodeName) {
        if (Elements === void 0) {
            Elements = [];
        }
        if (NodeName === void 0) {
            NodeName = "ArrayLiteral";
        }
        this.Token = Token;
        this.Elements = Elements;
        this.NodeName = NodeName;
    }
    ArrayLiteral.prototype.expressionNode = function () {};
    ArrayLiteral.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    ArrayLiteral.prototype.String = function () {
        var out = "",
            elements = [];
        this.Elements.forEach(function (el) {
            elements.push(el.String());
        });
        out += "[";
        out += elements.join(", ");
        out += "]";
        return out;
    };
    return ArrayLiteral;
}();
exports.ArrayLiteral = ArrayLiteral;
var HashLiteral = /** @class */function () {
    function HashLiteral(Token, // the '{' token
    Pairs, NodeName) {
        if (NodeName === void 0) {
            NodeName = "HashLiteral";
        }
        this.Token = Token;
        this.Pairs = Pairs;
        this.NodeName = NodeName;
    }
    HashLiteral.prototype.expressionNode = function () {};
    HashLiteral.prototype.TokenLiteral = function () {
        return this.Token.Literal;
    };
    HashLiteral.prototype.String = function () {
        var out = "",
            pairs = [];
        // this.Pairs.forEach( (value, key) =>{
        // 	pairs.push( key.String()+":"+value.String() )
        // })
        out += "{";
        out += pairs.join(", ");
        out += "}";
        return out;
    };
    return HashLiteral;
}();
exports.HashLiteral = HashLiteral;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("./object");
var object_1 = require("./object");
var evaluator_1 = require("./evaluator");
var help_1 = require("./help");
var help_2 = require("./help");
var os_1 = require("./os");
var io_1 = require("./io");
var graphics_1 = require("./graphics");
var terminal_1 = require("./terminal");
var table_1 = require("./terminal/table");
var component_1 = require("./convolvr/component");
var entity_1 = require("./convolvr/entity");
var world_1 = require("./convolvr/world");
var util_1 = require("./util");
var BUILTIN = object.BUILTIN_OBJ,
    NULL = {};
exports.builtins = {
    "graphics": graphics_1.default,
    "io": io_1.default,
    "os": os_1.default,
    "Table": table_1.default,
    "terminal": terminal_1.default,
    "component": component_1.default,
    "entity": entity_1.default,
    "world": world_1.default,
    "PI": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return new object.Integer(Math.PI);
    }),
    "sin": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() != object.INTEGER_OBJ) {
            return evaluator_1.newError("argument to `sin` must be INTEGER, got %s", args[0].Type());
        }
        return new object.Integer(Math.sin(args[0].Value));
    }),
    "cos": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() != object.INTEGER_OBJ) {
            return evaluator_1.newError("argument to `cos` must be INTEGER, got %s", args[0].Type());
        }
        return new object.Integer(Math.cos(args[0].Value));
    }),
    "tan": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() != object.INTEGER_OBJ) {
            return evaluator_1.newError("argument to `cos` must be INTEGER, got %s", args[0].Type());
        }
        return new object.Integer(Math.tan(args[0].Value));
    }),
    "atan2": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 2) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=2", args.length);
        }
        if (args[0].Type() != object.INTEGER_OBJ || args[1].Type() != object.INTEGER_OBJ) {
            return evaluator_1.newError("argument to `atan2` must be INTEGER, got %s %s", args[0].Type(), args[1].Type());
        }
        return new object.Integer(Math.atan2(args[0].Value, args[1].Value));
    }),
    "sqrt": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() != object.INTEGER_OBJ) {
            return evaluator_1.newError("argument to `cos` must be INTEGER, got %s", args[0].Type());
        }
        return new object.Integer(Math.sqrt(args[0].Value));
    }),
    "abs": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() != object.INTEGER_OBJ) {
            return evaluator_1.newError("argument to `abs` must be INTEGER, got %s", args[0].Type());
        }
        return new object.Integer(Math.abs(args[0].Value));
    }),
    "floor": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() != object.INTEGER_OBJ) {
            return evaluator_1.newError("argument to `abs` must be INTEGER, got %s", args[0].Type());
        }
        return new object.Integer(Math.floor(args[0].Value));
    }),
    "ceil": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() != object.INTEGER_OBJ) {
            return evaluator_1.newError("argument to `abs` must be INTEGER, got %s", args[0].Type());
        }
        return new object.Integer(Math.ceil(args[0].Value));
    }),
    "fract": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() != object.INTEGER_OBJ) {
            return evaluator_1.newError("argument to `abs` must be INTEGER, got %s", args[0].Type());
        }
        return new object.Integer(args[0].Value - Math.floor(args[0].Value));
    }),
    "time": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return new object.Integer(Date.now());
    }),
    "print": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        util_1.println(context, scope, args);
        return NULL;
    }),
    "len": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        var arg = args[0],
            argType = arg.Type();
        switch (argType) {
            case object_1.ARRAY_OBJ:
                return new object.Integer(arg.Elements.length);
            case object_1.STRING_OBJ:
                return new object.Integer(arg.Value.length);
            default:
                return evaluator_1.newError("argument to `len` not supported, got %s", args[0].Type());
        }
    }),
    "first": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() != object.ARRAY_OBJ) {
            return evaluator_1.newError("argument to `first` must be ARRAY, got %s", args[0].Type());
        }
        var arr = args[0];
        if (arr.Elements.length > 0) {
            return arr.Elements[0];
        }
        return NULL;
    }),
    "last": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() != object.ARRAY_OBJ) {
            return evaluator_1.newError("argument to `last` must be ARRAY, got %s", args[0].Type());
        }
        var arr = args[0],
            length = arr.Elements.length;
        if (length > 0) {
            return arr.Elements[length - 1];
        }
        return NULL;
    }),
    "push": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 2) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=2", args.length);
        }
        if (args[0].Type() != object.ARRAY_OBJ) {
            return evaluator_1.newError("argument to `push` must be ARRAY, got %s", args[0].Type());
        }
        var arr = args[0],
            newArr = arr.Elements.slice();
        newArr.push(args[1]);
        return new object.Array(newArr);
    }),
    "join": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (args.length != 2) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=2", args.length);
        }
        if (args[0].Type() != object_1.ARRAY_OBJ) {
            return evaluator_1.newError("first argument to `join` must be ARRAY, got %s", args[0].Type());
        }
        if (args[1].Type() != object_1.STRING_OBJ) {
            return evaluator_1.newError("second argument to `join` must be STRING, got %s", args[0].Type());
        }
        var strArray = [],
            arr = args[0];
        arr.Elements.forEach(function (element) {
            var s = "";
            s = element.Inspect();
            strArray.push(s);
        });
        var outStr = strArray.join(args[1].Value);
        return new object.String(outStr);
    }),
    "man": new object.Builtin(function (context, scope) {
        if (context === void 0) {
            context = null;
        }
        if (scope === void 0) {
            scope = null;
        }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var helpKey = "",
            htmlMode = typeof Window != 'undefined';
        if (args.length != 1) {
            return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
        }
        if (args[0].Type() == object.BUILTIN_OBJ) {
            console.log(args[0].Fn.toString());
        } else {
            if (args[0].Type() != object.STRING_OBJ) {
                return evaluator_1.newError("argument to `man` must be STRING, got %s", args[0].Type());
            }
            helpKey = args[0].Value;
            var helpElems = [],
                helpStrs = help_2.getHelp(helpKey);
            var leftBorder_1 = helpKey != "builtins";
            console.log("");
            console.log("╔════════════════════════════════════════════════════════════════════════════════════════════════════════════╗");
            helpStrs.forEach(function (helpStr) {
                console.log((leftBorder_1 ? "║ " : "") + helpStr);
            });
            console.log("╚════════════════════════════════════════════════════════════════════════════════════════════════════════════╝");
        }
        return new object.String("");
    }),
    "help": new object.Builtin(function () {
        var helpElems = [],
            helpStrs = help_1.listAllDocs();
        console.log("");
        console.log("╔═══════════════════════════════════════════════╗");
        console.log("║ Help Topics              💡  man(\"topicName\"); ║");
        console.log("╚═══════════════════════════════════════════════╝");
        helpStrs.forEach(function (helpStr) {
            helpElems.push(new object.String(helpStr));
        });
        return new object.Array(helpElems);
    })
};

},{"./convolvr/component":5,"./convolvr/entity":6,"./convolvr/world":8,"./evaluator":10,"./graphics":11,"./help":12,"./io":14,"./object":16,"./os":17,"./terminal":19,"./terminal/table":20,"./util":22}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("../object");
var evaluator_1 = require("../evaluator");
var util_1 = require("../util");
var NULL = {};
var componentMethods = [];
// get component telemetry
util_1.addMethod(componentMethods, "getPosition", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return util_1.nativeListToArray(scope != null ? scope.position : [0, 0, 0]);
});
util_1.addMethod(componentMethods, "getRotation", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return util_1.nativeListToArray(scope != null ? scope.rotation : [0, 0, 0, 1]);
});
// get data from the component
util_1.addMethod(componentMethods, "getAttrs", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return util_1.nativeObjToMap(scope != null ? scope.attrs : {});
});
util_1.addMethod(componentMethods, "getProps", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return util_1.nativeObjToMap(scope != null ? scope.props : {});
});
util_1.addMethod(componentMethods, "getState", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return util_1.nativeObjToMap(scope != null ? scope.state : {});
});
// update component telemetry
util_1.addMethod(componentMethods, "setPosition", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length != 1) {
        return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
    }
    if (args[0].Type() != object.ARRAY_OBJ) {
        return evaluator_1.newError("argument to `Component.setPosition` must be ARRAY[3], got %s", args[0].Type());
    }
    if (args[0].Elements.length != 3) {
        return evaluator_1.newError("argument to `setPosition` must be ARRAY[3], got %s", args[0].Type() + "[" + args[0].Elements.length + "]");
    }
    var newPosition = args[0].Elements.map(function (e) {
        return e.Inspect();
    });
    scope.position = newPosition;
    context.postMessage("component.setPosition", { position: newPosition, path: scope.path });
    return NULL;
});
util_1.addMethod(componentMethods, "setRotation", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length != 1) {
        return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
    }
    if (args[0].Type() != object.ARRAY_OBJ) {
        return evaluator_1.newError("argument to `Component.setRotation` must be ARRAY[4], got %s", args[0].Type());
    }
    if (args[0].Elements.length != 4) {
        return evaluator_1.newError("argument to `Component.setRotation` must be ARRAY[4], got %s", args[0].Type() + "[" + args[0].Elements.length + "]");
    }
    var newRotation = args[0].Elements.map(function (e) {
        return e.Inspect();
    });
    scope.rotation = newRotation;
    context.postMessage("component.setRotation", { rotation: newRotation, path: scope.path });
    return NULL;
});
// set data in the component
util_1.addMethod(componentMethods, "setAttrs", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
util_1.addMethod(componentMethods, "setProps", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
util_1.addMethod(componentMethods, "setState", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
// methods for child components
util_1.addMethod(componentMethods, "addComponent", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
util_1.addMethod(componentMethods, "removeComponent", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
util_1.addMethod(componentMethods, "getComponent", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var components = scope.components,
        comp = {};
    if (args.length > 2) {
        return evaluator_1.newError("wrong number of arguments. got=%d, want=1-2", args.length);
    }
    if (args[0].Type() != object.INTEGER_OBJ) {
        return evaluator_1.newError("first argument to `Component.getComponent` must be INTEGER, got %s", args[0].Type());
    }
    if (args[1].Type() != object.INTEGER_OBJ) {
        return evaluator_1.newError("second argument to `Component.getComponent` must be STRING, got %s", args[0].Type());
    }
    if (args.length == 1) {
        for (var _a = 0, components_1 = components; _a < components_1.length; _a++) {
            var c = components_1[_a];
            if (c.id == args[0].Inspect()) {
                comp = c;
            }
        }
    } else {
        for (var _b = 0, components_2 = components; _b < components_2.length; _b++) {
            var c = components_2[_b];
            if (c.name == args[1].Inspect()) {
                comp = c;
            }
        }
    }
    return util_1.nativeObjToMap(comp);
});
util_1.addMethod(componentMethods, "listComponents", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return util_1.nativeListToArray(scope.components);
});
util_1.addMethod(componentMethods, "updateComponent", "component", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
exports.addMethods = function (component, methods) {
    for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
        var method = methods_1[_i];
        for (var key in method) {
            component[key] = method[key];
        }
    }
    return component;
};
var makeComponent = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var pairs = {
        "id": {
            Key: new object.String("id"),
            Value: new object.Integer(-1)
        },
        "name": {
            Key: new object.String("name"),
            Value: new object.String("New Component")
        }
    };
    pairs = exports.addMethods(pairs, componentMethods);
    return new object.Hash(pairs);
}, "component");
var getComponent = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var comp = null;
    if (args.length == 0) {
        // return current component
        comp = scope != null ? util_1.nativeObjToMap(scope) : new object.Hash({});
    } else {
        comp = new object.Hash({});
        if (args[0].Type() == object.STRING_OBJ) {// find component by name in current entity
        } else if (args[0].Type() == object.INTEGER_OBJ) {// find component by id
        } else if (args[0].Type() == object.ARRAY_OBJ) {// find component by int array path
        }
    }
    comp = exports.addMethods(comp, componentMethods);
    return comp;
}, "component");
exports.default = util_1.makeBuiltinInterface([["get", getComponent], ["make", makeComponent]]);

},{"../evaluator":10,"../object":16,"../util":22}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("../object");
var evaluator_1 = require("../evaluator");
var component_1 = require("./component");
var util_1 = require("../util");
var NULL = {};
var entityMethods = [];
util_1.addMethod(entityMethods, "getPosition", "entity", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return util_1.nativeListToArray(scope ? scope.position : [0, 0, 0]);
});
util_1.addMethod(entityMethods, "getRotation", "entity", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return util_1.nativeListToArray(scope ? scope.rotation : [0, 0, 0, 1]);
});
// update component telemetry
util_1.addMethod(entityMethods, "setPosition", "entity", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length != 1) {
        return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
    }
    if (args[0].Type() != object.ARRAY_OBJ) {
        return evaluator_1.newError("argument to `Entity[\"setPosition\"]` must be ARRAY[3], got %s", args[0].Type());
    }
    if (args[0].Elements.length != 3) {
        return evaluator_1.newError("argument to `Entity[\"setPosition\"]` must be ARRAY[3], got %s", args[0].Type() + "[" + args[0].Elements.length + "]");
    }
    var newPosition = args[0].Elements.map(function (e) {
        return e.Inspect();
    });
    scope.position = newPosition;
    context.postMessage("entity.setPosition", { position: newPosition, path: scope.path });
    return NULL;
});
util_1.addMethod(entityMethods, "setRotation", "entity", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length != 1) {
        return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
    }
    if (args[0].Type() != object.ARRAY_OBJ) {
        return evaluator_1.newError("argument to `Entity[\"setRotation\"]` must be ARRAY[4], got %s", args[0].Type());
    }
    if (args[0].Elements.length != 4) {
        return evaluator_1.newError("argument to `Entity[\"setRotation\"]` must be ARRAY[4], got %s", args[0].Type() + "[" + args[0].Elements.length + "]");
    }
    var newRotation = args[0].Elements.map(function (e) {
        return e.Inspect();
    });
    scope.rotation = newRotation;
    context.postMessage("entity.setRotation", { rotation: newRotation, path: scope.path });
    return NULL;
});
util_1.addMethod(entityMethods, "addComponent", "entity", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
util_1.addMethod(entityMethods, "removeComponent", "entity", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
util_1.addMethod(entityMethods, "listComponents", "entity", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
util_1.addMethod(entityMethods, "getComponent", "entity", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
util_1.addMethod(entityMethods, "updateComponent", "entity", function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return NULL;
});
var getEntity = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var ent = new object.Hash({});
    if (args.length == 0) {// return current entity
    } else {
        if (args[0].Type() == object.STRING_OBJ) {// find entity by name in current entity
        } else if (args[0].Type() == object.INTEGER_OBJ) {// find entity by id
        } else if (args[0].Type() == object.ARRAY_OBJ) {// find entity by int array path
        }
    }
    ent = component_1.addMethods(ent, entityMethods);
    return ent;
}, "entity");
var makeEntity = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var ent = new object.Hash({
        "id": {
            Key: new object.String("id"),
            Value: new object.Integer(-1)
        },
        "name": {
            Key: new object.String("name"),
            Value: new object.String("New Entity")
        }
    });
    ent = component_1.addMethods(ent, entityMethods);
    return ent;
}, "entity");
exports.default = util_1.makeBuiltinInterface([["get", getEntity], ["make", makeEntity]]);

},{"../evaluator":10,"../object":16,"../util":22,"./component":5}],7:[function(require,module,exports){
"use strict";

var _this = undefined;
Object.defineProperty(exports, "__esModule", { value: true });
var evaluator = require("../evaluator");
var environment = require("../environment");
var util_1 = require("../util");
var workerContext = function workerContext(data) {
    return {
        data: data,
        postMessage: function postMessage(command, data) {
            return worker.postMessage(JSON.stringify({
                command: command,
                data: data
            }));
        }
    };
};
var makeVoxelEnv = function makeVoxelEnv(key, isScope, data) {
    if (isScope === void 0) {
        isScope = false;
    }
    return {
        key: key,
        env: isScope ? new environment.Environment(null, data ? workerContext({ voxel: data }) : null) : null,
        entities: []
    };
},
    makeEntityEnv = function makeEntityEnv(id, isScope, data, path) {
    if (isScope === void 0) {
        isScope = false;
    }
    return {
        id: id,
        data: data,
        path: path,
        env: isScope ? new environment.Environment(null, data ? workerContext({ entity: data }) : null) : null,
        components: []
    };
},
    makeComponentEnv = function makeComponentEnv(id, data, path) {
    return {
        id: id,
        data: data,
        path: path,
        env: new environment.Environment(null, data ? workerContext({ component: data }) : null)
    };
},
    getById = function getById(entities, id) {
    for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
        var e = entities_1[_i];
        if (e.id == id) {
            return e;
        }
    }
    return null;
},
    getEntityEnv = function getEntityEnv(voxel, entityId) {
    for (var _i = 0, _a = voxel.entities; _i < _a.length; _i++) {
        var e = _a[_i];
        if (e.id == entityId) {
            return e;
        }
    }
    return null;
},
    getComponentEnv = function getComponentEnv(entity, componentId) {
    for (var _i = 0, _a = entity.components; _i < _a.length; _i++) {
        var c = _a[_i];
        if (c.id == componentId) {
            return c;
        }
    }
    return null;
};
var worker = self;
worker.interpreter = util_1.makeInterpreter(evaluator.Eval);
worker.getEnv = function (voxelCoords, entityId, componentId) {
    if (entityId === void 0) {
        entityId = null;
    }
    if (componentId === void 0) {
        componentId = null;
    }
    var voxel = worker.environments[voxelCoords],
        entity = null,
        component = null;
    if (voxel == null) {
        voxel = worker.environments[voxelCoords] = makeVoxelEnv(voxelCoords, entityId == null);
    }
    if (entityId) {
        entity = getById(voxel.entities, entityId);
        if (entity == null) {
            entity = makeEntityEnv(entityId, componentId == null, {}, [voxelCoords, entityId]);
            voxel.entities.push(entity);
        }
        if (componentId) {
            component = getById(entity.components, componentId);
            if (component == null) {
                component = makeComponentEnv(componentId, {}, [voxelCoords, entityId, componentId]);
                entity.components.push(component);
            }
            return component.env;
        } else {
            return entity.env;
        }
    } else {
        return voxel.env;
    }
};
worker.onmessage = function (event) {
    var message = JSON.parse(event.data),
        data = message.data;
    switch (message.command) {
        // add environments
        case "add voxel":
            worker.addVoxel(data);
            break;
        case "add entity":
            worker.addEntity(data);
            break;
        case "add component":
            worker.addComponent(message.data);
            break;
        // get environments
        case "get voxel":
            worker.getVoxel(data);
            break;
        case "get entity":
            worker.getEntity(data);
            break;
        case "get component":
            worker.getComponent(data);
            break;
        // update environments
        case "update voxel":
            worker.updateVoxel(data);
            break;
        case "update entity":
            worker.updateEntity(data);
            break;
        case "update component":
            worker.updateComponent(data);
            break;
        // remove environments
        case "remove voxel":
            worker.removeVoxel(data);
            break;
        case "remove entity":
            worker.removeEntity(data);
            break;
        case "remove component":
            worker.removeComponent(data);
            break;
        // remove all environments
        case "clear":
            worker.clear();
            break;
        // evaluate code
        case "eval":
            worker.eval(message.data);
    }
};
worker.addVoxel = function (data) {
    worker.environments[data.voxelCoords] = data.voxel;
};
worker.addEntity = function (data) {
    var voxel = worker.environments[data.voxelCoords];
    if (voxel == null) {
        return null;
    }
    var id = data.entity.id,
        path = [data.voxelCoords, id];
    voxel.entities.push(makeEntityEnv(id, true, data.entity, path));
};
worker.addComponent = function (data) {
    var voxel = worker.environments[data.voxelCoords];
    if (voxel == null) {
        return null;
    }
    var entity = getEntityEnv(voxel, data.entityId);
    if (entity == null) {
        return null;
    }
    var id = data.component.id,
        path = [data.voxelCoords, data.entity.id, id];
    entity.components.push(makeComponentEnv(id, data.component, path));
};
worker.getVoxel = function (data) {
    var voxel;
    worker.postMessage(JSON.stringify({
        command: "get voxel",
        data: voxel
    }));
};
worker.getEntity = function (data) {
    var voxel = worker.environments[data.voxelCoords];
    if (voxel == null) {
        return null;
    }
    var entity = getEntityEnv(voxel, data.entityId);
    worker.postMessage(JSON.stringify({
        command: "get entity",
        data: entity
    }));
};
worker.getComponent = function (data) {
    var voxel = worker.environments[data.voxelCoords];
    if (voxel == null) {
        return null;
    }
    var entity = getEntityEnv(voxel, data.entityId);
    if (entity == null) {
        return null;
    }
    var component = getComponentEnv(entity, data.componentId);
    worker.postMessage(JSON.stringify({
        command: "get component",
        data: component
    }));
};
worker.removeVoxel = function (data) {
    _this.environments[data.voxelCoords] = null;
};
worker.removeEntity = function (data) {
    var voxel = _this.environments[data.voxelCoords];
    if (voxel == null) {
        return null;
    }
    for (var _i = 0, _a = voxel.entities; _i < _a.length; _i++) {
        var e = _a[_i];
        if (e.id == data.entityId) {
            voxel.entities.splice(voxel.entities.indexOf(e), 1);
        }
    }
};
worker.removeComponent = function (data) {
    var voxel = _this.environments[data.voxelCoords],
        entity = null;
    if (voxel == null) {
        return null;
    }
    entity = getEntityEnv(voxel, data.entityId);
    if (entity == null) {
        return null;
    }
    for (var _i = 0, _a = entity.components; _i < _a.length; _i++) {
        var c = _a[_i];
        if (c.id == data.componentId) {
            entity.components.splice(entity.components.indexOf(c), 1);
        }
    }
};
worker.updateVoxel = function (data) {
    _this.environments[data.voxelCoords].data = data.voxelData;
};
worker.updateTelemetry = function (data) {
    var voxel = _this.environments[data.voxelCoords],
        entity = null;
    if (voxel == null) {
        return null;
    }
    entity = getEntityEnv(voxel, data.entityId);
    if (entity == null) {
        return null;
    }
    if (data.componentId) {
        for (var _i = 0, _a = entity.components; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.id == data.componentId) {
                if (data.position) {
                    c.data.position = data.position;
                }
                if (data.rotation) {
                    c.data.rotation = data.rotation;
                }
            }
        }
    } else {
        if (data.position) {
            entity.data.position = data.position;
        }
        if (data.rotation) {
            entity.data.rotation = data.rotation;
        }
    }
};
worker.updateEntity = function (data) {
    var voxel = _this.environments[data.voxelCoords];
    if (voxel == null) {
        return null;
    }
    for (var _i = 0, _a = voxel.entities; _i < _a.length; _i++) {
        var e = _a[_i];
        if (e.id == data.entityId) {
            e.data = data.entityData;
        }
    }
};
worker.updateEntity = function (data) {
    var voxel = _this.environments[data.voxelCoords];
    if (voxel == null) {
        return null;
    }
    for (var _i = 0, _a = voxel.entities; _i < _a.length; _i++) {
        var e = _a[_i];
        if (e.id == data.entityId) {
            e.data = data.entityData;
        }
    }
};
worker.updateComponent = function (data) {
    var voxel = _this.environments[data.voxelCoords],
        entity = null;
    if (voxel == null) {
        return null;
    }
    entity = getEntityEnv(voxel, data.entityId);
    if (entity == null) {
        return null;
    }
    for (var _i = 0, _a = entity.components; _i < _a.length; _i++) {
        var c = _a[_i];
        if (c.id == data.componentId) {
            c.data = data.componentData;
        }
    }
};
worker.stop = function () {
    clearTimeout(worker.updateLoop);
};
worker.clear = function () {
    _this.environments = {};
};
worker.eval = function (data) {
    _this.postMessage(JSON.stringify({
        command: "return value",
        env: data.env.join(","),
        data: worker.interpreter.parseAndEvaluate(data.code, worker.getEnv(data.env[0], data.env[1], data.env[2]))
    }));
};

},{"../environment":9,"../evaluator":10,"../util":22}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("../object");
var NULL = {};
// define world methods here
exports.default = new object.Hash({});

},{"../object":16}],9:[function(require,module,exports){
"use strict";

var __assign = undefined && undefined.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Environment = /** @class */function () {
    function Environment(outer, context, worker) {
        if (outer === void 0) {
            outer = null;
        }
        if (context === void 0) {
            context = null;
        }
        if (worker === void 0) {
            worker = null;
        }
        this.outer = null;
        this.context = null;
        this.store = {}; //new Map<string, any>();
        this.outer = outer;
        if (context) {
            context.data = __assign({}, this.context.data, context.data);
            this.context = context;
        }
    }
    Environment.prototype.get = function (name) {
        var ok = true,
            value = null;
        value = this.store[name];
        ok = value != null;
        if (!ok && this.outer != null) {
            value = this.outer.get(name);
        }
        return value;
    };
    Environment.prototype.set = function (name, value) {
        this.store[name] = value; //.set(name, value);
        return value;
    };
    Environment.prototype.setContext = function (name, value) {
        this.context[name] = value;
    };
    return Environment;
}();
exports.Environment = Environment;
function NewEnclosedEnvironment(outer) {
    return new Environment(outer);
}
exports.NewEnclosedEnvironment = NewEnclosedEnvironment;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("./object");
var environment = require("./environment");
var builtins_1 = require("./builtins");
var util_1 = require("./util");
var file_1 = require("./io/file");
var fs = require("fs");
var TRUE = new object.Boolean(true),
    FALSE = new object.Boolean(false),
    NULL = new object.NULL();
var embeddedInterpreter;
function newError(format) {
    var a = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        a[_i - 1] = arguments[_i];
    }
    return new object.Error(util_1.sprintf.apply(void 0, [format].concat(a, ["\x07"])));
}
exports.newError = newError;
function nativeBoolToBooleanEObject(input) {
    if (input) {
        return TRUE;
    }
    return FALSE;
}
function Eval(node, env, objectContext) {
    if (!!!node) {
        return;
    }
    var left = null,
        right = null,
        index = null,
        val = null;
    switch (node.NodeName) {
        // Statements
        case "Program":
            return evalProgram(node, env);
        case "BlockStatement":
            return evalBlockStatement(node, env, objectContext);
        case "ReturnStatement":
            val = Eval(node.ReturnValue, env, objectContext);
            if (isError(val)) {
                return val;
            }
            return new object.ReturnValue(val);
        case "ClassStatement":
            val = Eval(node.Value, env, objectContext);
            if (isError(val)) {
                return val;
            }
            var pair = val.Pairs[node.Name.Value],
                constructor = pair ? pair.Value : null;
            if (constructor != null) {
                val.Constructor = constructor;
            }
            env.set(node.Name.Value, val);
            break;
        case "LetStatement":
            val = Eval(node.Value, env, objectContext);
            if (isError(val)) {
                return val;
            }
            env.set(node.Name.Value, val);
            break;
        case "AssignmentStatement":
            val = Eval(node.Value, env, objectContext);
            if (isError(val)) {
                return val;
            }
            env.set(node.Name.Value, val);
            break;
        case "ExpressionStatement":
            return Eval(node.Expression, env, objectContext);
        // Expressions
        case "PrefixExpression":
            right = Eval(node.Right, env, objectContext);
            if (isError(right)) {
                return right;
            }
            return evalPrefixExpression(node.Operator, right);
        case "InfixExpression":
            left = Eval(node.Left, env, objectContext);
            if (isError(left)) {
                return left;
            }
            right = Eval(node.Right, env, objectContext);
            if (isError(right)) {
                return right;
            }
            return evalInfixExpression(node.Operator, left, right);
        case "CallExpression":
            var fun = Eval(node.Function, env); //, node.Function.ObjectContext); // objectContext);
            if (isError(fun)) {
                return fun;
            }
            var args = evalExpressions(node.Arguments, env, objectContext);
            if (args.length == 1 && isError(args[0])) {
                return args[0];
            }
            return applyFunction(fun, env, args, objectContext);
        case "IndexExpression":
            left = Eval(node.Left, env, objectContext);
            if (isError(left)) {
                return left;
            }
            index = Eval(node.Index, env, objectContext);
            if (isError(index)) {
                return index;
            }
            return evalIndexExpression(left, index, objectContext);
        case "IndexAssignmentExpression":
            left = Eval(node.Left, env, objectContext);
            if (isError(left)) {
                return left;
            }
            index = Eval(node.Index, env, objectContext);
            if (isError(index)) {
                return index;
            }
            var assignment = Eval(node.Assignment, env, objectContext);
            if (isError(assignment)) {
                return assignment;
            }
            return evalIndexAssignmentExpression(left, index, assignment, objectContext);
        case "Boolean":
            return nativeBoolToBooleanEObject(node.Value);
        case "IntegerLiteral":
            return new object.Integer(node.Value);
        case "FunctionLiteral":
            var params = node.Parameters,
                body = node.Body;
            return new object.Function(params, body, env, null, objectContext); //TODO: probably pass object context here
        case "StringLiteral":
            return new object.String(node.Value);
        case "ArrayLiteral":
            var elements = evalExpressions(node.Elements, env);
            if (elements.length == 1 && isError(elements[0])) {
                return elements[0];
            }
            return new object.Array(elements);
        case "HashLiteral":
            return evalHashLiteral(node, env);
        case "IfExpression":
            return evalIfExpression(node, env, objectContext);
        case "ForExpression":
            return evalForExpression(node, env, objectContext);
        case "WhileExpression":
            return evalWhileExpression(node, env, objectContext);
        case "SleepExpression":
            return evalSleepExpression(node, env, objectContext);
        case "NewExpression":
            return evalNewExpression(node, env, objectContext);
        case "ExecExpression":
            return evalExecExpression(node, env, objectContext);
        case "Identifier":
            return evalIdentifier(node, env, objectContext);
    }
    return null;
}
exports.Eval = Eval;
embeddedInterpreter = util_1.makeInterpreter(Eval);
function evalProgram(program, env) {
    var result;
    //  console.log(JSON.stringify(program, null, 4));
    program.Statements.forEach(function (statement) {
        result = Eval(statement, env);
        if (!!!result) {
            return;
        }
        if (!result.Message) {
            return result.Value;
        } else {
            return result;
        }
    });
    return result;
}
exports.evalProgram = evalProgram;
function evalStatements(stmts, env) {
    var result;
    stmts.forEach(function (statement) {
        result = Eval(statement, env);
        var returnValue = new object.ReturnValue(result),
            ok = returnValue != null;
        if (ok) {
            return returnValue.Value;
        }
    });
    return result;
}
function evalBlockStatement(block, env, objectContext) {
    var result;
    block.Statements.forEach(function (statement) {
        result = Eval(statement, env, objectContext);
        if (result != null && result != undefined) {
            var rt = result && result.Type ? result.Type() : null;
            if (rt == object.RETURN_VALUE_OBJ || rt == object.ERROR_OBJ) {
                return result;
            }
        }
    });
    return result;
}
function evalExpressions(exps, env, objectContext) {
    var result = [];
    exps.forEach(function (e) {
        var evaluated = Eval(e, env, objectContext);
        if (isError(evaluated)) {
            return Array();
        }
        result.push(evaluated);
    });
    return result;
}
function evalPrefixExpression(operator, right) {
    switch (operator) {
        case "!":
            return evalBangOperatorExpression(right);
        case "-":
            return evalMinusPrefixOperatorExpression(right);
        case "typeof":
            return evalTypeofExpression(right);
        default:
            return newError("unknown operator: %s%s", operator, right.Type());
    }
}
function evalInfixExpression(operator, left, right) {
    var leftType = left.Type(),
        rightType = right.Type();
    if (leftType == object.INTEGER_OBJ && rightType == object.INTEGER_OBJ) {
        return evalIntegerInfixExpression(operator, left, right);
    } else if (leftType == object.BOOLEAN_OBJ && rightType == object.BOOLEAN_OBJ) {
        return evalBooleanInfixExpression(operator, left, right);
    } else if (leftType == object.STRING_OBJ && rightType == object.STRING_OBJ) {
        return evalStringInfixExpression(operator, left, right);
    } else if (operator == "==") {
        return nativeBoolToBooleanEObject(left.Value == right.Value);
    } else if (operator == "!=") {
        return nativeBoolToBooleanEObject(left.Value != right.Value);
    } else if (leftType != rightType) {
        if (leftType == object.STRING_OBJ) {
            //&& (rightType == object.INTEGER_OBJ || rightType == object.BOOLEAN_OBJ)) {
            return evalStringConcatExpression(left, right, true);
        } else if (rightType == object.STRING_OBJ) {
            // leftType == object.INTEGER_OBJ &&
            return evalStringConcatExpression(left, right, false);
        }
        return newError("type mismatch: %s %s %s", leftType, operator, rightType);
    } else {
        return newError("unknown operator: %s %s %s", leftType, operator, rightType);
    }
}
function evalTypeofExpression(right) {
    if (right.Type() == object.HASH_OBJ && right.className != null) {
        return new object.String(right.className);
    } else {
        return new object.String(right.Type());
    }
}
function evalStringConcatExpression(left, right, stringFirst) {
    if (stringFirst) {
        return new object.String(left.Value + right.Inspect());
    } else {
        return new object.String(left.Inspect() + right.Value);
    }
}
function evalBooleanInfixExpression(operator, left, right) {
    var leftVal = left.Value,
        rightVal = right.Value;
    switch (operator) {
        case "&&":
            return new object.Boolean(leftVal && rightVal);
        case "||":
            return new object.Boolean(leftVal || rightVal);
        default:
            return newError("unknown operator: %s %s %s", left.Type(), operator, right.Type());
    }
}
function evalIntegerInfixExpression(operator, left, right) {
    var leftVal = left.Value,
        rightVal = right.Value;
    switch (operator) {
        case "+":
            return new object.Integer(leftVal + rightVal);
        case "-":
            return new object.Integer(leftVal - rightVal);
        case "*":
            return new object.Integer(leftVal * rightVal);
        case "/":
            return new object.Integer(leftVal / rightVal);
        case "%":
            return new object.Integer(leftVal % rightVal);
        case "<":
            return nativeBoolToBooleanEObject(leftVal < rightVal);
        case ">":
            return nativeBoolToBooleanEObject(leftVal > rightVal);
        case "==":
            return nativeBoolToBooleanEObject(leftVal == rightVal);
        case "!=":
            return nativeBoolToBooleanEObject(leftVal != rightVal);
        default:
            return newError("unknown operator: %s %s %s", left.Type(), operator, right.Type());
    }
}
function evalStringInfixExpression(operator, left, right) {
    var leftVal = left.Value,
        rightVal = right.Value;
    switch (operator) {
        case "+":
            return new object.String(leftVal + rightVal);
        case "*":
            return new object.String(leftVal.repeat(rightVal.length));
        case "==":
            return nativeBoolToBooleanEObject(leftVal == rightVal);
        case "!=":
            return nativeBoolToBooleanEObject(leftVal != rightVal);
        case "<":
            return nativeBoolToBooleanEObject(leftVal < rightVal);
        case ">":
            return nativeBoolToBooleanEObject(leftVal > rightVal);
        default:
            return newError("unknown operator: %s %s %s", left.Type(), operator, right.Type());
    }
}
function evalNewExpression(ne, env, objectContext) {
    var classData = evalIdentifier(ne.Name, env, objectContext);
    if (classData.Type() != object.HASH_OBJ) {
        return newError("new operator can only be used with Class or Hashmap. Invalid type: " + classData.Type());
    }
    var instance = util_1.copyHashMap(classData);
    if (instance.Constructor == null && instance.Pairs[ne.Name.Value] != null) {
        instance.Constructor = instance.Pairs[ne.Name.Value].Value;
        instance.className = ne.Name.Value;
        if (instance.Pairs.builtin && instance.Pairs.builtin.Value) {
            extendBuiltinEnv(instance);
        }
    }
    return instance;
}
function extendBuiltinEnv(instance) {
    var pairs = instance.Pairs;
    for (var p in pairs) {
        if (pairs[p].Value.Type() == object.BUILTIN_OBJ) {
            pairs[p].Value.ObjectContext = instance;
        }
    }
}
function evalExecExpression(se, env, objectContext) {
    var path = se.Name.String();
    if (path.length == 0) {
        return newError("path can't be empty");
    }
    getSourceFile(path).then(function (data) {
        embeddedInterpreter.parseAndEvaluate(data, env, function (errors) {
            console.log("source errors:", errors);
            console.log(newError("source failed. "));
        });
    }).catch(function (err) {
        console.log(err);
    });
    return TRUE;
}
function getSourceFile(path) {
    var file = "",
        resource = new Promise(function (resolve, reject) {
        if (false) {
            reject();
        }return resolve();
    });
    if (path.indexOf("://") > -1) {} else {
        return file_1.readWholeFile(path, fs);
    }
    return resource;
}
function evalIfExpression(ie, env, objectContext) {
    var condition = Eval(ie.Condition, env, objectContext);
    if (isError(condition)) {
        return condition;
    }
    if (isTruthy(condition)) {
        return Eval(ie.Consequence, env, objectContext);
    } else if (ie.Alternative != null) {
        return Eval(ie.Alternative, env, objectContext);
    } else {
        return NULL;
    }
}
function evalForExpression(fl, env, objectContext) {
    var range = Eval(fl.Range, env, objectContext),
        element = fl.Element.Value,
        rangeType,
        key = "",
        keys,
        index = 0,
        indexObj = new object.Integer(index),
        length = 0;
    if (isError(range)) {
        return range;
    }
    rangeType = range.Type();
    var err, result;
    if (rangeType == object.INTEGER_OBJ) {
        length = range.Value;
        while (index < length) {
            indexObj.Value = index;
            env.set(element, indexObj);
            result = Eval(fl.Consequence, env, objectContext);
            err = err || isError(result) ? result : null;
            index += 1;
        }
    } else if (rangeType == object.ARRAY_OBJ) {
        length = range.Elements.length;
        while (index < length) {
            indexObj.Value = index;
            env.set(element, indexObj);
            result = Eval(fl.Consequence, env, objectContext);
            err = err || isError(result) ? result : null;
            index += 1;
        }
    } else if (rangeType == object.STRING_OBJ) {
        length = range.Value.length;
        while (index < length) {
            indexObj.Value = index;
            env.set(element, indexObj);
            result = Eval(fl.Consequence, env, objectContext);
            err = err || isError(result) ? result : null;
            index += 1;
        }
    } else if (rangeType == object.HASH_OBJ) {
        var keys_1 = Object.keys(range.Pairs);
        length = keys_1.length;
        while (index < length) {
            env.set(element, new object.String(keys_1[index]));
            result = Eval(fl.Consequence, env, objectContext);
            err = err || isError(result) ? result : null;
            index += 1;
        }
        if (err != null) {
            return newError("error in for loop %s", JSON.stringify(err));
        }
    } else {
        return newError("unknown range type in for loop: %s", range.Type());
    }
    return NULL;
}
function evalWhileExpression(ie, env, objectContext) {
    var condition = Eval(ie.Condition, env);
    if (isError(condition)) {
        return condition;
    }
    while (isTruthy(condition)) {
        Eval(ie.Consequence, env, objectContext);
        condition = Eval(ie.Condition, env, objectContext);
    }
    return NULL;
}
function evalSleepExpression(se, env, objectContext) {
    var duration = Eval(se.Duration, env);
    if (isError(duration)) {
        return duration;
    }
    setTimeout(function () {
        Eval(se.Consequence, env, objectContext);
    }, duration.Inspect());
    return NULL;
}
function evalIndexExpression(left, index, objectContext) {
    var indexExpType = left.Type() == object.ARRAY_OBJ && index.Type() == object.INTEGER_OBJ ? "arrayIndex" : "default";
    indexExpType = left.Type() == object.HASH_OBJ ? "hashIndex" : indexExpType;
    indexExpType = left.Type() == object.STRING_OBJ ? "stringIndex" : indexExpType;
    switch (indexExpType) {
        case "arrayIndex":
            return evalArrayIndexExpression(left, index);
        case "hashIndex":
            return evalHashIndexExpression(left, index);
        case "stringIndex":
            return evalStringIndexExpression(left, index);
        default:
            return newError("index operator not supported: %s", left.Type());
    }
}
function evalArrayIndexExpression(array, index) {
    var arrayEObject = array,
        idx = index.Value,
        max = arrayEObject.Elements.length - 1;
    if (idx < 0 || idx > max) {
        return NULL;
    }
    return arrayEObject.Elements[idx];
}
function evalHashIndexExpression(hash, index) {
    var hashObject = hash,
        ok = index.HashKey,
        key = null;
    if (!ok) {
        return newError("unusable as hash key: %s", index.Type());
    } else {
        key = index.HashKey();
    }
    var pair = hashObject.Pairs[key];
    ok = pair != null;
    if (!ok) {
        return NULL;
    }
    return pair.Value;
}
function evalStringIndexExpression(array, index) {
    var stringObject = array,
        idx = index.Value,
        max = stringObject.Value.length - 1;
    if (idx < 0 || idx > max) {
        return NULL;
    }
    return new object.String(stringObject.Value[idx]);
}
function evalIndexAssignmentExpression(left, index, assignment, objectContext) {
    var indexExpType = left.Type() == object.ARRAY_OBJ && index.Type() == object.INTEGER_OBJ ? "arrayIndex" : "default";
    indexExpType = left.Type() == object.HASH_OBJ ? "hashIndex" : indexExpType;
    indexExpType = left.Type() == object.STRING_OBJ ? "stringIndex" : indexExpType;
    switch (indexExpType) {
        case "arrayIndex":
            return evalArrayIndexAssignment(left, index, assignment);
        case "hashIndex":
            return evalHashIndexAssignment(left, index, assignment);
        case "stringIndex":
            return evalStringIndexAssignment(left, index, assignment);
        default:
            return newError("index operator not supported: %s", left.Type());
    }
}
function evalStringIndexAssignment(str, index, assignment) {
    var stringObject = str,
        idx = index.Value,
        max = stringObject.Value.length - 1;
    if (idx < 0 || idx > max) {
        return NULL;
    }
    var oldStr = stringObject.Value,
        left = oldStr.substr(0, idx),
        right = oldStr.substr(idx + 1, oldStr.length - 1);
    stringObject.Value = left + assignment.Inspect() + right;
    return NULL;
}
function evalArrayIndexAssignment(array, index, assignment) {
    var arrayEObject = array,
        idx = index.Value,
        max = arrayEObject.Elements.length - 1;
    if (idx < 0 || idx > max) {
        return NULL;
    }
    arrayEObject.Elements[idx] = assignment;
    return NULL;
}
function evalHashIndexAssignment(hash, index, assignment) {
    var hashObject = hash,
        ok = index.Value,
        key = null;
    if (!ok) {
        return newError("unusable as hash key: %s", index.Type());
    } else {
        key = index.Value;
    }
    var pair = hashObject.Pairs[key];
    ok = pair != null;
    if (!ok) {
        return NULL;
    }
    pair.Value = assignment;
    return NULL;
}
function evalIdentifier(node, env, objectContext) {
    var name = node.Value;
    if (name == "this") {
        if (objectContext != null) {
            return objectContext;
        }
        return newError("statement has no object context");
    } else {
        var ident = env.get(name);
        if (ident != null) {
            return ident;
        }
        var builtin = builtins_1.builtins[name];
        if (builtin != null && builtin != undefined) {
            return builtin;
        }
        return newError("identifier not found: %s", name);
    }
}
function evalHashLiteral(node, env) {
    var hashmap = new object.Hash({}),
        pairs = {};
    node.Pairs.forEach(function (valueNode, keyNode) {
        var key = Eval(keyNode, env); // pass object context here
        if (isError(key)) {
            return key;
        }
        if (!key.HashKey) {
            return newError("unusable as hash key: %s", key.Type());
        }
        var value = Eval(valueNode, env, hashmap);
        if (isError(value)) {
            return value;
        }
        pairs[key.HashKey()] = { Key: key, Value: value };
    });
    hashmap.Pairs = pairs;
    return hashmap;
}
function evalBangOperatorExpression(right) {
    switch (right) {
        case TRUE:
            return FALSE;
        case FALSE:
            return TRUE;
        case NULL:
            return TRUE;
        default:
            return FALSE;
    }
}
function evalMinusPrefixOperatorExpression(right) {
    if (right.Type() != object.INTEGER_OBJ) {
        return newError("unknown operator: -%s", right.Type());
    }
    var value = right.Value;
    return new object.Integer(-value);
}
function applyFunction(fn, env, args, objectContext) {
    var fnType = fn.Type();
    var extendedEnv, evaluated;
    switch (fnType) {
        case "function":
            extendedEnv = extendFunctionEnv(fn, args), evaluated = Eval(fn.Body, extendedEnv, fn.ObjectContext);
            return unwrapReturnValue(evaluated);
        case "hash":
            var constructor = fn.Constructor;
            if (!constructor) {
                return newError("object has no constructor");
            }
            if (constructor.Parameters) {
                // Function Literal constructor
                extendedEnv = extendFunctionEnv(constructor, args);
                evaluated = Eval(constructor.Body, extendedEnv, fn);
            } else {
                //                      Builtin Function Constructor
                evaluated = applyBuiltinFunction(constructor, args, env, fn);
            }
            return fn;
        case "BUILTIN":
            return applyBuiltinFunction(fn, args, env, objectContext);
        default:
            return newError("not a function: %s", fn.Type());
    }
}
exports.applyFunction = applyFunction;
function applyBuiltinFunction(fn, args, env, objectContext) {
    var contextName = fn.Context,
        context = null,
        scope = null;
    if (contextName) {
        context = env.context;
    }
    if (fn.ObjectContext) {
        scope = fn.ObjectContext;
    } else if (context) {
        scope = context.data[contextName];
    }
    return fn.Fn.apply(fn, [context, scope].concat(args));
}
function extendFunctionEnv(fn, args) {
    var env = environment.NewEnclosedEnvironment(fn.Env),
        paramIdx = 0,
        param = null,
        nParams = fn.Parameters.length;
    while (paramIdx < nParams) {
        param = fn.Parameters[paramIdx];
        env.set(param.Value, args[paramIdx]);
        paramIdx += 1;
    }
    return env;
}
function unwrapReturnValue(obj) {
    if (!obj.Type) {
        return NULL;
    }
    var ok = obj && obj.Type() == object.RETURN_VALUE_OBJ;
    if (ok) {
        return obj.Value;
    }
    return obj;
}
function isError(obj) {
    if (obj != null) {
        return !!obj.Message; //obj.Type() == object.ERROR_OBJ
    }
    return false;
}
function isTruthy(obj) {
    return obj && obj.Value != null ? !!obj.Value : true;
}

},{"./builtins":4,"./environment":9,"./io/file":13,"./object":16,"./util":22,"fs":1}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("../object");
var util_1 = require("../util");
var evaluator_1 = require("../evaluator");
var util_2 = require("../util");
var makeCanvas = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length < 1) {
        return evaluator_1.newError("wrong number of arguments. got=%d, want = 1 to 4", args.length);
    }
    if (args[0].Type() != object.ARRAY_OBJ) {
        return evaluator_1.newError("argument `dimensions` of `graphics.makeCanvas` must be Array[2], got %s", args[0].Type());
    }
    if (args.length > 1) {
        console.log("args one type ");
        console.log(args[1].Type());
        if (args[1].Type() != object.ARRAY_OBJ && args[1].Type() != object.NULL_OBJ) {
            return evaluator_1.newError("argument `pixelRatio` of `graphics.makeCanvas` must be ARRAY[number,number] or null, got %s", args[1].Type());
        }
        if (args.length > 2) {
            if (args[2].Type() != object.STRING_OBJ && args[2].Type() != object.NULL_OBJ) {
                return evaluator_1.newError("argument `format` of `graphics.makeCanvas` must be string or null, got %s", args[2].Type());
            }
            if (args.length == 4) {
                if (args[3].Type() != object.ARRAY_OBJ) {
                    return evaluator_1.newError("argument `data` of `graphics.makeCanvas` must be ARRAY[foamat[0]][format[1]], got %s", args[3].Type());
                }
            }
        }
    }
    var dimensions = args[0].Elements.map(function (elem) {
        return elem.Inspect();
    }),
        format = args[2] ? args[2].Inspect() + "" : "text",
        data = args[3],
        imageData = null,
        rows = [];
    if (data == null) {
        var ten = null,
            one = null,
            grey = null,
            darkGrey = null;
        if (format.indexOf("color") > -1) {
            ten = new object.Integer(ten);
            one = new object.Integer(one);
            grey = new object.Array([ten, ten, ten]);
            darkGrey = new object.Array([one, one, one]);
        }
        for (var y = 0; y < dimensions[1]; y++) {
            var elements = [];
            var o = "";
            for (var x = 0; x < dimensions[0]; x++) {
                var initialData = 0,
                    initialRow = null;
                if (data) {
                    initialRow = data.Elements[y];
                    if (initialRow.Type() == object.STRING_OBJ) {
                        initialData = initialRow.Value[x];
                    } else if (initialRow) {
                        initialData = initialRow.Elements[x];
                    }
                }
                switch (format) {
                    case "text":
                        o = o + "+";
                        break;
                    case "monochrome":
                        elements.push(new object.Integer(10));
                    case "monochrome-compressed":
                        elements.push(new object.Integer(1));
                    case "color":
                        elements.push(grey);
                    case "color-compressed":
                        elements.push(darkGrey);
                }
            }
            if (format == "text") {
                rows.push(new object.String(o));
            } else {
                rows.push(new object.Array(elements));
            }
        }
        imageData = new object.Array(rows);
    } else {
        imageData = args[3];
    }
    var pairs = {};
    pairs.data = { Key: new object.String("data"), Value: imageData };
    pairs.format = { Key: new object.String("format"), Value: args[2] || new object.String("text") };
    pairs.dimensions = { Key: new object.String("dimensions"), Value: args[0] };
    pairs.pixelRatio = { Key: new object.String("pixelRatio"), Value: args[1] || new object.NULL() };
    return new object.Hash(pairs);
}, "graphics"),
    draw = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length < 1) {
        return evaluator_1.newError("wrong number of arguments. got=%d, want=1", args.length);
    }
    var formatError = "argument `canvas` of `graphics.draw` must be Hash{format: string, dimensions: [number,number], data: array}, got %s";
    if (args[0].Type() != object.HASH_OBJ) {
        return evaluator_1.newError(formatError, args[0].Type());
    }
    var canvas = args[0],
        data = canvas.Pairs.data ? canvas.Pairs.data.Value.Elements : [],
        format = canvas.Pairs.format ? canvas.Pairs.format.Value.Inspect() + "" : "text",
        pixelRatio = canvas.Pairs.pixelRatio && canvas.Pairs.pixelRatio.Value.Type() != object.NULL_OBJ ? canvas.Pairs.pixelRatio.Value.Elements.map(function (elem) {
        return elem.Inspect();
    }) : null;
    if (format == "text") {
        for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
            var row = data_1[_a];
            if (pixelRatio) {
                var scaled = util_1.scaleString("" + row.Inspect(), pixelRatio),
                    yScale = 0;
                while (yScale < pixelRatio[1]) {
                    util_2.printNativeString(null, null, scaled);
                    yScale += 1;
                }
            } else {
                util_2.println(null, null, [row]);
            }
        }
    } else if (format.indexOf("color") > -1) {
        // let gradient = [" "];
        // for (let row of data) {
        //     let o = 
        // }
        // implement
    } else if (format.indexOf("mono") > -1) {}
    return {};
}, "graphics"),
    fill = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return {};
}, "graphics"),
    dot = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return {};
}, "graphics"),
    line = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return {};
}, "graphics"),
    circle = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return {};
}, "graphics"),
    procedure = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return {};
}, "graphics");
exports.default = util_1.makeBuiltinInterface([["makeCanvas", makeCanvas], ["draw", draw], ["fill", fill], ["dot", dot], ["line", line], ["circle", circle], ["procedure", procedure]]);

},{"../evaluator":10,"../object":16,"../util":22}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var docs = new Map();
docs.set("keywords", ["Keywords: |                                                                                                ║", "fn        | fn(?param1, ?param2...) { ?<statement>; ?<statement>... ?return <expression>; }                ║", "let       | let identifierName = <expression>;                                                             ║", "class     | class ClassName { \"ClassName\": fn(){ }, <HashPair>... }                                        ║", "new       | new ClassName(?param1, ?param2...)                                                             ║", "if        | if (<boolean expression>) { <statement>; <statement>... } else { <statement>; <statement>... } ║", "else      | if (...) { ... } else { <statement>; <statement>... }                                          ║", "for       | for (<identifier>, <number | string | array | hashmap>) { }                                    ║", "while     | while (<boolean expression>) { <statement>; <statement>... }                                   ║", "sleep     | sleep (<integer expression>) { <statement>; <statement>... }                                   ║", "return    | return <expression>;                                                                           ║", "this      | this                                                                                           ║", "true      | true                                                                                           ║", "false     | false                                                                                          ║", "exec      | exec \"other-script.ecs\"                                                                        ║"]);
docs.set("delimiters", ["Delimiters: |", token_1.COMMA + "           | Comma", token_1.SEMICOLON + "           | Semicolon", token_1.COLON + "           | Colon", token_1.LPAREN + "           | Left Parenthesis", token_1.RPAREN + "           | Right Parenthesis", token_1.LBRACE + "           | Left Brace", token_1.RBRACE + "           | Right Brace", token_1.LBRACKET + "           | Left Bracket", token_1.RBRACKET + "           | Right Bracket"]);
docs.set("operators", ["Operators: |", token_1.ASSIGN + "          | Assign", token_1.PLUS + "          | Plus / Addition", token_1.BANG + "          | Bang / Not", token_1.MINUS + "          | Minus", token_1.SLASH + "          | Slash / Divide", token_1.ASTERISK + "          | Asterisk / Multiply", token_1.MOD + "          | Mod / Remainder", token_1.LT + "          | Less Than", token_1.GT + "          | Greater Than", token_1.EQ + "         | Is Equal To", token_1.NOT_EQ + "         | Is Not Equal", "typeof" + "     | Name Of Type", token_1.AND + "         | And", token_1.OR + "         | Or", token_1.SOURCE + "         | Source (coming soon)", token_1.SINK + "         | Sink (coming soon)", token_1.INSERTION + "         | Insert (coming soon)", token_1.EXTRACTION + "         | Extract (coming soon)"]);
docs.set("builtins", ["║ Builtin Functions:  ", "╠═════════════════════════════════════════════════════════════════════", "║ print            │ print( <string> value ): void", "║                  │ prints string to console", "╠══════════════════╩══════════════════════════════════════════════════", "║ push             │ push( array, any ): array", "║                  │ adds item to end of array", "╠══════════════════╩══════════════════════════════════════════════════", "║ len              │ len( array|string ): number", "║                  │ returns length of array or string", "╠══════════════════╩══════════════════════════════════════════════════", "║ join             │ join( string[]|number[], string ): string", "║                  │ joins an array of strings or numbers into one string.", "║                  │ second argument is the string to splice in between", "╠══════════════════╩══════════════════════════════════════════════════", "║ floor            │ floor( number ): number", "║                  │ returns number rounded down", "╠══════════════════╩══════════════════════════════════════════════════", "║ ceil             │ ceil( number ): number", "║                  │ returns number rounded up", "╠══════════════════╩══════════════════════════════════════════════════", "║ fract            │ fract( number ): number", "║                  │ returns fractional portion of number", "╠══════════════════╩══════════════════════════════════════════════════", "║ abs              │ abs( number ): number", "║                  │ returns absolute value of number", "╠══════════════════╩══════════════════════════════════════════════════", "║ sqrt             │ sqrt( number ): number", "║                  │ returns square root of number", "╠══════════════════╩══════════════════════════════════════════════════", "║ PI               │ PI(): number", "║                  │ returns constant pi", "╠══════════════════╩══════════════════════════════════════════════════", "║ sin              │ sin( number ): number", "║                  │ returns sine of number in radians", "╠══════════════════╩══════════════════════════════════════════════════", "║ cos              │ cos( number ): number", "║                  │ returns cosine of number in radians", "╠══════════════════╩══════════════════════════════════════════════════", "║ tan              │ tan( number ): number", "║                  │ returns tangent of number in radians", "╠══════════════════╩══════════════════════════════════════════════════", "║ atan2            │ atan2( number ): number", "║                  │ returns atan2 of number in radians", "╠══════════════════╩══════════════════════════════════════════════════", "║ time             │ time(): number", "║                  │ returns current time in milliseconds"]);
docs.set("print", "builtins");
docs.set("push", "builtins");
docs.set("len", "builtins");
docs.set("join", "builtins");
docs.set("floor", "builtins");
docs.set("ceil", "builtins");
docs.set("fract", "builtins");
docs.set("abs", "builtins");
docs.set("sqrt", "builtins");
docs.set("PI", "builtins");
docs.set("sin", "builtins");
docs.set("cos", "builtins");
docs.set("tan", "builtins");
docs.set("atan2", "builtins");
docs.set("time", "builtins");
docs.set("component", ["component", "{", "   make: builtin", "   get: builtin", "}"]);
docs.set("entity", ["entity", "{", "   make: builtin", "   get: builtin", "}"]);
docs.set("world", ["World", "{", "}"]);
docs.set("os", ["os", "{", "   touch: builtin", "   mkdir: builtin", "   pwd: builtin", "   ls: builtin", "   cat: builtin", "   rm: builtin", "}"]);
docs.set("graphics", ["graphics", "{", "   makeCanvas: builtin(dimensions: number[], format?: string, data?: string[]|number[][]|number[][][])", "   draw: builtin", "   fill: builtin", "   dot: builtin", "   line: builtin", "   circle: builtin", "   procedure: builtin", "}"]);
docs.set("io", ["io", "{", "}"]);
docs.set("terminal", ["Terminal", "{", "   getDimensions: builtin(): number[]", "   hasColorSupport: builtin(): boolean", "   has3dSupport: builtin(): boolean", "   beep: builtin(): void", "}"]);
docs.set("Table", ["Hashmap", "{", "   build: builtin", "   display: builtin", "}"]);
var getHelp = function getHelp(docName) {
    var helpResults = docs.get(docName);
    if (typeof helpResults == "string") {
        helpResults = docs.get(helpResults);
    }
    return helpResults ? helpResults : [];
};
exports.getHelp = getHelp;
var listAllDocs = function listAllDocs() {
    var keys = [],
        key = "";
    var foundDocs = docs.keys();
    while (key = foundDocs.next().value) {
        if (typeof docs.get(key) != "string") {
            keys.push(key);
        }
    }
    return keys;
};
exports.listAllDocs = listAllDocs;

},{"./token":21}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.readWholeFile = function (path, fs) {
    if (fs) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, "utf8", function (err, data) {
                if (err) reject();
                resolve(data);
            });
        });
    } else {
        // browser implementation
    }
};
function writeLineToFile(src, data, fs) {
    fs.appendFile(src, data, function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
}
exports.writeLineToFile = writeLineToFile;
function openFile(src, data, fs) {}
exports.openFile = openFile;
function readLineFromFile(src, data, fs) {}
exports.readLineFromFile = readLineFromFile;
function hasNextLine(src, data, fs) {}
exports.hasNextLine = hasNextLine;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("../object");
var evaluator_1 = require("../evaluator");
var util_1 = require("../util");
var file_1 = require("./file");
var fs = require("fs");
var httpGetErr = "invalind number of parameters: http.get(url:string, callback?:fn(response: string){})",
    httpPostErr = "invalind number of parameters: http.post(url:string, payload?:hash, callback?:fn(response: string){})",
    httpPutErr = "invalind number of parameters: http.put(url:string, payload?:hash, callback?:fn(response: string){})",
    httpDeleteErr = "invalind number of parameters: http.delete(url:string, payload?:hash, callback?:fn(response: string){})",
    httpRequestFailed = "request failed: ";
var httpGet = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length == 0 || args.length > 2) {
        return evaluator_1.newError(httpGetErr);
    }
    return new object.Boolean(false);
}, "http"),
    httpPost = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length == 0 || args.length > 2) {
        return evaluator_1.newError(httpPostErr);
    }
    return new object.Boolean(false);
}, "http"),
    httpPut = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length == 0 || args.length > 2) {
        return evaluator_1.newError(httpPutErr);
    }
    return new object.Boolean(false);
}, "http"),
    httpDelete = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length == 0 || args.length > 2) {
        return evaluator_1.newError(httpDeleteErr);
    }
    return new object.Boolean(false);
}, "http");
var socketConnectError = "",
    socketSendError = "",
    socketOnEventError = "";
var socketConnect = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.Boolean(false);
}, "socket"),
    socketDisconnect = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.Boolean(false);
}, "socket"),
    socketSend = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.Boolean(false);
}, "socket"),
    socketOnEvent = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.Boolean(false);
}, "socket");
var createFileError = "",
    fileReadLineError = "",
    fileWriteLineError = "";
var fileConstructor = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length > 0) {
        scope.Pairs["resource"].Value = args[0];
    }
    return new object.Boolean(true);
}, "object"),
    fileOpen = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.Boolean(false);
}, "file"),
    fileReadAll = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (args.length < 1 || args[0].Type() != object.FUNCTION_OBJ) {
        return evaluator_1.newError("argument to readAll must be callback function");
    }
    file_1.readWholeFile(scope.Pairs.resource.Value.Inspect() + "", fs).then(function (data) {
        evaluator_1.applyFunction(args[0], null, [new object.String(data)], null);
    });
    return new object.NULL();
}, "object"),
    fileWriteLine = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    file_1.writeLineToFile(scope.Pairs.resource.Value.Inspect() + "", args[1].Inspect(), fs);
    return new object.Boolean(true);
}, "file"),
    fileReadLine = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.String("not implemented");
}, "file"),
    fileHasNextLine = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.String("not implemented");
}, "object");
var HTTP = util_1.makeBuiltinInterface([["get", httpGet], ["post", httpPost], ["put", httpPut], ["delete", httpDelete]]),
    Socket = util_1.makeBuiltinInterface([["connect", socketConnect], ["disconnect", socketDisconnect], ["send", socketSend], ["onEvent", socketOnEvent]]),
    File = util_1.makeBuiltinClass("File", [["resource", new object.String("")], ["File", fileConstructor], ["open", fileOpen], ["hasNextLine", fileHasNextLine], ["readLine", fileReadLine], ["writeLine", fileWriteLine], ["readAll", fileReadAll]]);
exports.default = util_1.makeBuiltinInterface([["File", File], ["HTTP", HTTP], ["Socket", Socket]]);

},{"../evaluator":10,"../object":16,"../util":22,"./file":13,"fs":1}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var token = require("./token");
var Lexer = /** @class */function () {
    function Lexer() {
        this.position = 0;
        this.readPosition = 0;
        this.ch = "";
    }
    Lexer.prototype.setText = function (input) {
        this.position = 0;
        this.readPosition = 0;
        this.ch = "";
        this.input = input;
    };
    Lexer.prototype.NextToken = function () {
        var tok = {},
            peek = "";
        this.skipWhitespace();
        switch (this.ch) {
            case '=':
                peek = this.peekChar();
                if (peek == '=') {
                    tok.Literal = this.ch + peek;
                    tok.Type = token.EQ;
                    this.readChar();
                } else {
                    tok = newToken(token.ASSIGN, this.ch);
                }
                break;
            case '&':
                peek = this.peekChar();
                if (peek == '&') {
                    this.readChar();
                }
                tok = newToken(token.AND, this.ch + '&');
                break;
            case '|':
                peek = this.peekChar();
                if (peek == '|') {
                    this.readChar();
                }
                tok = newToken(token.OR, this.ch + '|');
                break;
            case '.':
                tok = newToken(token.DOT, this.ch);
                break;
            case '+':
                tok = newToken(token.PLUS, this.ch);
                break;
            case ',':
                tok = newToken(token.COMMA, this.ch);
                break;
            case ';':
                tok = newToken(token.SEMICOLON, this.ch);
                break;
            case ':':
                tok = newToken(token.COLON, this.ch);
                break;
            case '(':
                tok = newToken(token.LPAREN, this.ch);
                break;
            case ')':
                tok = newToken(token.RPAREN, this.ch);
                break;
            case '{':
                tok = newToken(token.LBRACE, this.ch);
                break;
            case '}':
                tok = newToken(token.RBRACE, this.ch);
                break;
            case '[':
                tok = newToken(token.LBRACKET, this.ch);
                break;
            case ']':
                tok = newToken(token.RBRACKET, this.ch);
                break;
            case '!':
                peek = this.peekChar();
                if (peek == '=') {
                    tok.Literal = this.ch + peek;
                    tok.Type = token.NOT_EQ;
                    this.readChar();
                } else {
                    tok = newToken(token.BANG, this.ch);
                }
                break;
            case '-':
                tok = newToken(token.MINUS, this.ch);
                break;
            case '/':
                tok = newToken(token.SLASH, this.ch);
                break;
            case '*':
                tok = newToken(token.ASTERISK, this.ch);
                break;
            case '%':
                tok = newToken(token.MOD, this.ch);
                break;
            case '<':
                tok = newToken(token.LT, this.ch);
                break;
            case '>':
                tok = newToken(token.GT, this.ch);
                break;
            case '"':
                tok.Type = token.STRING;
                tok.Literal = this.readString();
                break;
            case 'Ω':
                tok.Literal = "Ω";
                tok.Type = token.EOF;
                break;
            default:
                if (isLetter(this.ch)) {
                    tok.Literal = this.readIdentifier();
                    tok.Type = token.LookupIdent(tok.Literal);
                    return tok;
                } else if (isDigit(this.ch)) {
                    tok.Literal = this.readNumber();
                    tok.Type = token.INT;
                    return tok;
                } else {
                    tok = newToken(token.ILLEGAL, this.ch);
                }
        }
        this.readChar();
        return tok;
    };
    Lexer.prototype.getInputLength = function () {
        return this.input.length;
    };
    Lexer.prototype.skipWhitespace = function () {
        while (this.ch == ' ' || this.ch == '\t' || this.ch == '\n' || this.ch == '\r') {
            this.readChar();
        }
    };
    Lexer.prototype.peekChar = function () {
        if (this.readPosition == this.input.length) {
            return 'Ω';
        } else {
            return this.input[this.readPosition];
        }
    };
    Lexer.prototype.readChar = function () {
        this.ch = this.peekChar();
        this.position = this.readPosition;
        this.readPosition += 1;
    };
    Lexer.prototype.readIdentifier = function () {
        var position = this.position;
        if (isLetter(this.ch)) {
            this.readChar();
        }
        while (isLetter(this.ch) || isWholeDigit(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    };
    Lexer.prototype.readNumber = function () {
        var position = this.position;
        // upgrade this to handle decimals
        while (isDigit(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    };
    Lexer.prototype.readString = function () {
        var position = this.position + 1;
        while (true) {
            this.readChar();
            if (this.ch == '"') {
                break;
            }
        }
        return this.input.substring(position, this.position);
    };
    return Lexer;
}();
exports.Lexer = Lexer;
function isWholeDigit(ch) {
    return '0' <= ch && ch <= '9';
}
exports.isWholeDigit = isWholeDigit;
function isDigit(ch) {
    return '0' <= ch && ch <= '9' || ch == '.';
}
exports.isDigit = isDigit;
function isLetter(ch) {
    return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || ch == '_' || ch && ch.charCodeAt(0) > 200;
}
exports.isLetter = isLetter;
function newToken(tokenType, ch) {
    return { Type: tokenType, Literal: ch };
}
exports.newToken = newToken;

},{"./token":21}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var INTEGER_OBJ = "number",
    BOOLEAN_OBJ = "boolean",
    NULL_OBJ = "null",
    RETURN_VALUE_OBJ = "RETURN_VALUE",
    ERROR_OBJ = "error",
    FUNCTION_OBJ = "function",
    STRING_OBJ = "string",
    BUILTIN_OBJ = "BUILTIN",
    ARRAY_OBJ = "array",
    HASH_OBJ = "hash";
exports.INTEGER_OBJ = INTEGER_OBJ;
exports.BOOLEAN_OBJ = BOOLEAN_OBJ;
exports.NULL_OBJ = NULL_OBJ;
exports.RETURN_VALUE_OBJ = RETURN_VALUE_OBJ;
exports.ERROR_OBJ = ERROR_OBJ;
exports.FUNCTION_OBJ = FUNCTION_OBJ;
exports.STRING_OBJ = STRING_OBJ;
exports.BUILTIN_OBJ = BUILTIN_OBJ;
exports.ARRAY_OBJ = ARRAY_OBJ;
exports.HASH_OBJ = HASH_OBJ;
var NULL = /** @class */function () {
    function NULL() {}
    NULL.prototype.Type = function () {
        return NULL_OBJ;
    };
    NULL.prototype.Inspect = function () {
        return null;
    };
    return NULL;
}();
exports.NULL = NULL;
var Integer = /** @class */function () {
    function Integer(Value) {
        this.Value = Value;
    }
    Integer.prototype.Inspect = function () {
        return this.Value;
    };
    Integer.prototype.Type = function () {
        return INTEGER_OBJ;
    };
    Integer.prototype.HashKey = function () {
        return "" + this.Value;
    };
    return Integer;
}();
exports.Integer = Integer;
var Boolean = /** @class */function () {
    function Boolean(Value) {
        this.Value = Value;
    }
    Boolean.prototype.Type = function () {
        return BOOLEAN_OBJ;
    };
    Boolean.prototype.Inspect = function () {
        return this.Value;
    };
    Boolean.prototype.HashKey = function () {
        return "" + (this.Value ? 1 : 0);
    };
    return Boolean;
}();
exports.Boolean = Boolean;
var ReturnValue = /** @class */function () {
    function ReturnValue(Value) {
        this.Value = Value;
    }
    ReturnValue.prototype.Type = function () {
        return RETURN_VALUE_OBJ;
    };
    ReturnValue.prototype.Inspect = function () {
        return this.Value.Inspect();
    };
    return ReturnValue;
}();
exports.ReturnValue = ReturnValue;
var Function = /** @class */function () {
    function Function(Parameters, Body, Env, Fn, ObjectContext) {
        this.Parameters = Parameters;
        this.Body = Body;
        this.Env = Env;
        this.Fn = Fn;
        this.ObjectContext = ObjectContext;
    }
    Function.prototype.Type = function () {
        return FUNCTION_OBJ;
    };
    Function.prototype.Inspect = function () {
        var out = "",
            params = [];
        for (var _i = 0, _a = this.Parameters; _i < _a.length; _i++) {
            var p = _a[_i];
            params.push(p.String());
        }
        if (this.ObjectContext && this.ObjectContext.className) {
            out += "(" + this.ObjectContext.className + ") ";
        }
        out += "fn(" + params.join(", ") + ")\n{";
        out += this.Body.String().split("\n").map(function (v) {
            return "    " + v;
        }).join("");
        out += "\n}";
        return out;
    };
    return Function;
}();
exports.Function = Function;
var String = /** @class */function () {
    function String(Value) {
        this.Value = Value;
    }
    String.prototype.Type = function () {
        return STRING_OBJ;
    };
    String.prototype.Inspect = function () {
        return this.Value;
    };
    String.prototype.HashKey = function () {
        return "" + this.Value.substr(0, 16);
    };
    return String;
}();
exports.String = String;
var Array = /** @class */function () {
    function Array(Elements) {
        this.Elements = Elements;
    }
    Array.prototype.Type = function () {
        return ARRAY_OBJ;
    };
    Array.prototype.Inspect = function () {
        var out = "",
            elements = [];
        this.Elements.forEach(function (e) {
            elements.push(e.Inspect ? e.Inspect() : null);
        });
        var tableMode = this.Elements[0].Type() == STRING_OBJ && this.Elements[0].Value.length > 16;
        out += "[" + (tableMode ? "\n" : "");
        out += (tableMode ? "     " : "") + elements.join(tableMode ? ",\n     " : ", ");
        out += (tableMode ? "\n" : "") + "]";
        return out;
    };
    return Array;
}();
exports.Array = Array;
var Error = /** @class */function () {
    function Error(Message) {
        this.Message = Message;
    }
    Error.prototype.Type = function () {
        return ERROR_OBJ;
    };
    Error.prototype.Inspect = function () {
        return "💀  ERROR: " + this.Message;
    };
    return Error;
}();
exports.Error = Error;
var Builtin = /** @class */function () {
    function Builtin(Fn, Context, ObjectContext) {
        this.Fn = Fn;
        this.Context = Context;
        this.ObjectContext = ObjectContext;
    }
    Builtin.prototype.Type = function () {
        return BUILTIN_OBJ;
    };
    Builtin.prototype.Inspect = function () {
        return "builtin function";
    };
    return Builtin;
}();
exports.Builtin = Builtin;
var Hash = /** @class */function () {
    function Hash(Pairs, Constructor, className) {
        this.Pairs = Pairs;
        this.Constructor = Constructor;
        this.className = className;
    }
    Hash.prototype.Type = function () {
        return HASH_OBJ;
    };
    Hash.prototype.Inspect = function () {
        var _this = this;
        var out = "",
            pairs = [];
        out += this.className ? this.className + " " : "";
        out += "{\n";
        Object.keys(this.Pairs).forEach(function (key) {
            out += "    " + key + ": " + _this.Pairs[key].Value.Inspect() + "\n";
        });
        out += "}";
        return out;
    };
    return Hash;
}();
exports.Hash = Hash;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("../object");
var util_1 = require("../util");
var touch = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.Boolean(scope != null ? scope.hasColorSupport : false);
}, "os"),
    mkdir = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return {};
}, "os"),
    pwd = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return {};
}, "os"),
    ls = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return {};
}, "os"),
    cat = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return {};
}, "os"),
    rm = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return {};
}, "os");
exports.default = util_1.makeBuiltinInterface([["touch", touch], ["mkdir", mkdir], ["pwd", pwd], ["ls", ls], ["cat", cat], ["rm", rm]]);

},{"../object":16,"../util":22}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var token = require("./token");
var ast = require("./ast");
var util_1 = require("./util");
exports.LOWEST = 0, exports.LOGICAL = 1, exports.EQUALS = 2, exports.LESSGREATER = 3, exports.SUM = 4, exports.PRODUCT = 5, exports.PREFIX = 6, exports.CALL = 7, exports.INDEX = 8;
exports.precedences = (_a = {}, _a[token.EQ] = exports.EQUALS, _a[token.NOT_EQ] = exports.EQUALS, _a[token.AND] = exports.LOGICAL, _a[token.OR] = exports.LOGICAL, _a[token.TYPEOF] = exports.LESSGREATER, _a[token.LT] = exports.LESSGREATER, _a[token.GT] = exports.LESSGREATER, _a[token.PLUS] = exports.SUM, _a[token.MINUS] = exports.SUM, _a[token.SLASH] = exports.PRODUCT, _a[token.ASTERISK] = exports.PRODUCT, _a[token.MOD] = exports.PRODUCT, _a[token.DOT] = exports.INDEX, _a[token.LPAREN] = exports.CALL, _a[token.LBRACKET] = exports.INDEX, _a);
var Parser = /** @class */function () {
    function Parser(l) {
        var _this = this;
        this.curToken = null;
        this.peekToken = null;
        this.prefixParseFns = {};
        this.infixParseFns = {};
        this.parseHashLiteral = function () {
            var value = null,
                key = null,
                hash = new ast.HashLiteral(_this.curToken);
            hash.Pairs = new Map();
            while (!_this.peekTokenIs(token.RBRACE)) {
                _this.nextToken();
                key = _this.parseExpression(exports.LOWEST);
                // pass flag to parseExpression to parse identifiers as strings
                if (!_this.expectPeek(token.COLON)) {
                    return null;
                }
                _this.nextToken();
                value = _this.parseExpression(exports.LOWEST);
                hash.Pairs.set(key, value);
                if (!_this.peekTokenIs(token.RBRACE) && !_this.expectPeek(token.COMMA)) {
                    return null;
                }
            }
            if (!_this.expectPeek(token.RBRACE)) {
                return null;
            }
            return hash;
        };
        this.parseExpression = function (precedence) {
            var prefix = _this.prefixParseFns[_this.curToken.Type];
            if (prefix == null) {
                _this.noPrefixParseFnError(_this.curToken.Type);
                return null;
            }
            var leftExp = prefix();
            while (!_this.peekTokenIs(token.SEMICOLON) && precedence < _this.peekPrecedence()) {
                var infix = _this.infixParseFns[_this.peekToken.Type];
                if (infix == null) {
                    return leftExp;
                }
                _this.nextToken();
                leftExp = infix(leftExp);
            }
            return leftExp;
        };
        this.parsePrefixExpression = function () {
            var expression = new ast.PrefixExpression(_this.curToken, _this.curToken.Literal);
            _this.nextToken();
            expression.Right = _this.parseExpression(exports.PREFIX);
            return expression;
        };
        this.parseInfixExpression = function (left) {
            var expression = new ast.InfixExpression(_this.curToken, left, _this.curToken.Literal),
                precedence = _this.curPrecedence();
            _this.nextToken();
            expression.Right = _this.parseExpression(precedence);
            return expression;
        };
        this.parseIfExpression = function () {
            var expression = new ast.IfExpression(_this.curToken);
            if (!_this.expectPeek(token.LPAREN)) {
                return null;
            }
            _this.nextToken();
            expression.Condition = _this.parseExpression(exports.LOWEST);
            if (!_this.expectPeek(token.RPAREN)) {
                return null;
            }
            if (!_this.expectPeek(token.LBRACE)) {
                return null;
            }
            expression.Consequence = _this.parseBlockStatement();
            if (_this.peekTokenIs(token.ELSE)) {
                _this.nextToken();
                if (!_this.expectPeek(token.LBRACE)) {
                    return null;
                }
                expression.Alternative = _this.parseBlockStatement();
            }
            return expression;
        };
        this.parseForExpression = function () {
            var expression = new ast.ForExpression(_this.curToken);
            if (!_this.expectPeek(token.LPAREN)) {
                return null;
            }
            // this.nextToken();
            if (!_this.expectPeek(token.IDENT)) {
                return null;
            }
            expression.Element = new ast.Identifier(_this.curToken, _this.curToken.Literal);
            // this.nextToken();
            if (!_this.expectPeek(token.COMMA)) {
                return null;
            }
            _this.nextToken();
            expression.Range = _this.parseExpression(exports.LOWEST);
            if (!_this.expectPeek(token.RPAREN)) {
                return null;
            }
            if (!_this.expectPeek(token.LBRACE)) {
                return null;
            }
            expression.Consequence = _this.parseBlockStatement();
            return expression;
        };
        this.parseWhileExpression = function () {
            var expression = new ast.WhileExpression(_this.curToken);
            if (!_this.expectPeek(token.LPAREN)) {
                return null;
            }
            _this.nextToken();
            expression.Condition = _this.parseExpression(exports.LOWEST);
            if (!_this.expectPeek(token.RPAREN)) {
                return null;
            }
            if (!_this.expectPeek(token.LBRACE)) {
                return null;
            }
            expression.Consequence = _this.parseBlockStatement();
            return expression;
        };
        this.parseSleepExpression = function () {
            var expression = new ast.SleepExpression(_this.curToken);
            if (!_this.expectPeek(token.LPAREN)) {
                return null;
            }
            _this.nextToken();
            expression.Duration = _this.parseExpression(exports.LOWEST);
            if (!_this.expectPeek(token.RPAREN)) {
                return null;
            }
            if (!_this.expectPeek(token.LBRACE)) {
                return null;
            }
            expression.Consequence = _this.parseBlockStatement();
            return expression;
        };
        this.parseGroupedExpression = function () {
            _this.nextToken();
            var exp = _this.parseExpression(exports.LOWEST);
            if (!_this.expectPeek(token.RPAREN)) {
                return null;
            }
            return exp;
        };
        this.parseCallExpression = function (fun) {
            var curToken = _this.curToken,
                exp = new ast.CallExpression(curToken, fun);
            exp.Arguments = _this.parseExpressionList(token.RPAREN);
            return exp;
        };
        this.parseIndexExpression = function (left) {
            var exp = null;
            var bracketAndLeft = [_this.curToken, left];
            _this.nextToken();
            var Index = _this.parseExpression(exports.LOWEST);
            if (!_this.expectPeek(token.RBRACKET)) {
                return null;
            }
            if (!_this.peekTokenIs(token.ASSIGN)) {
                exp = new ast.IndexExpression(bracketAndLeft[0], bracketAndLeft[1]);
            } else {
                exp = new ast.IndexAssignmentExpression(bracketAndLeft[0], bracketAndLeft[1]);
                _this.nextToken();
                _this.nextToken();
                exp.Assignment = _this.parseExpression(exports.LOWEST);
            }
            exp.Index = Index;
            return exp;
        };
        this.parseDotIndexExpression = function (left) {
            var exp = null,
                Index = null;
            var bracketAndLeft = [_this.curToken, left];
            if (_this.peekTokenIs(token.IDENT)) {
                _this.nextToken();
                var identValue = _this.curToken.Literal;
                Index = new ast.StringLiteral({ Type: token.STRING, Literal: identValue }, identValue);
            } else {
                // this.nextToken()
                Index = _this.parseExpression(exports.LOWEST);
            }
            if (!_this.peekTokenIs(token.ASSIGN)) {
                exp = new ast.IndexExpression(bracketAndLeft[0], bracketAndLeft[1]);
            } else {
                exp = new ast.IndexAssignmentExpression(bracketAndLeft[0], bracketAndLeft[1]);
                _this.nextToken();
                _this.nextToken();
                exp.Assignment = _this.parseExpression(exports.LOWEST);
            }
            exp.Index = Index;
            return exp;
        };
        this.parseCallArguments = function () {
            var args = Array();
            if (_this.peekTokenIs(token.RPAREN)) {
                _this.nextToken();
                return args;
            }
            _this.nextToken();
            args.push(_this.parseExpression(exports.LOWEST));
            while (_this.peekTokenIs(token.COMMA)) {
                _this.nextToken();
                _this.nextToken();
                args.push(_this.parseExpression(exports.LOWEST));
            }
            if (!_this.expectPeek(token.RPAREN)) {
                return null;
            }
            return args;
        };
        this.parseStatement = function () {
            if (_this.curToken.Type == token.IDENT && _this.peekTokenIs(token.ASSIGN)) {
                return _this.parseAssignmentStatement();
            }
            // case token.LBRACE:
            // 	return this.parseIndexAssignmentStatement();
            switch (_this.curToken.Type) {
                case token.LET:
                    return _this.parseLetStatement();
                case token.RETURN:
                    return _this.parseReturnStatement();
                case token.CLASS:
                    return _this.parseClassStatement();
                default:
                    return _this.parseExpressionStatement();
            }
        };
        this.parseExpressionStatement = function () {
            var curToken = _this.curToken;
            var stmt = new ast.ExpressionStatement(curToken);
            stmt.Expression = _this.parseExpression(exports.LOWEST);
            if (_this.peekTokenIs(token.SEMICOLON)) {
                _this.nextToken();
            }
            return stmt;
        };
        this.parseNewExpression = function () {
            var exp = new ast.NewExpression(_this.curToken);
            if (!_this.expectPeek(token.IDENT)) {
                return null;
            }
            exp.Name = new ast.Identifier(_this.curToken, _this.curToken.Literal);
            return exp;
        };
        this.parseExecExpression = function () {
            var exp = new ast.ExecExpression(_this.curToken);
            if (!_this.expectPeek(token.STRING)) {
                return null;
            }
            exp.Name = new ast.StringLiteral(_this.curToken, _this.curToken.Literal);
            return exp;
        };
        this.parseAssignmentStatement = function () {
            var stmt = new ast.AssignmentStatement(new ast.Identifier(_this.curToken, _this.curToken.Literal));
            if (!_this.expectPeek(token.ASSIGN)) {
                return null;
            }
            _this.nextToken();
            stmt.Value = _this.parseExpression(exports.LOWEST);
            if (_this.peekTokenIs(token.SEMICOLON)) {
                _this.nextToken();
            }
            return stmt;
        };
        this.parseLetStatement = function () {
            var stmt = new ast.LetStatement(_this.curToken);
            if (!_this.expectPeek(token.IDENT)) {
                return null;
            }
            stmt.Name = new ast.Identifier(_this.curToken, _this.curToken.Literal);
            if (!_this.expectPeek(token.ASSIGN)) {
                return null;
            }
            _this.nextToken();
            stmt.Value = _this.parseExpression(exports.LOWEST);
            if (_this.peekTokenIs(token.SEMICOLON)) {
                _this.nextToken();
            }
            return stmt;
        };
        this.parseClassStatement = function () {
            var stmt = new ast.ClassStatement(_this.curToken);
            if (!_this.expectPeek(token.IDENT)) {
                return null;
            }
            stmt.Name = new ast.Identifier(_this.curToken, _this.curToken.Literal);
            _this.nextToken();
            stmt.Value = _this.parseHashLiteral();
            if (_this.peekTokenIs(token.SEMICOLON)) {
                _this.nextToken();
            }
            return stmt;
        };
        this.parseReturnStatement = function () {
            var stmt = new ast.ReturnStatement(_this.curToken);
            _this.nextToken();
            stmt.ReturnValue = _this.parseExpression(exports.LOWEST);
            if (_this.peekTokenIs(token.SEMICOLON)) {
                _this.nextToken();
            }
            return stmt;
        };
        this.parseBlockStatement = function () {
            var block = new ast.BlockStatement(_this.curToken);
            block.Statements = [];
            _this.nextToken();
            while (!_this.curTokenIs(token.RBRACE) && !_this.curTokenIs(token.EOF)) {
                var stmt = _this.parseStatement();
                if (stmt != null) {
                    block.Statements.push(stmt);
                }
                _this.nextToken();
            }
            return block;
        };
        this.parseIdentifier = function () {
            return new ast.Identifier(_this.curToken, _this.curToken.Literal);
        };
        this.parseBoolean = function () {
            return new ast.Boolean(_this.curToken, _this.curTokenIs(token.TRUE));
        };
        this.parseIntegerLiteral = function () {
            var curToken = _this.curToken;
            var lit = new ast.IntegerLiteral(curToken);
            var value = parseFloat(_this.curToken.Literal);
            if (value == null || value == NaN) {
                var msg = "could not parse " + _this.curToken.Literal + " as integer";
                _this.errors.push(msg);
                return null;
            }
            lit.Value = value;
            return lit;
        };
        this.parseFunctionLiteral = function () {
            var curToken = _this.curToken,
                lit = new ast.FunctionLiteral(curToken);
            if (!_this.expectPeek(token.LPAREN)) {
                return null;
            }
            lit.Parameters = _this.parseFunctionParameters();
            if (!_this.expectPeek(token.LBRACE)) {
                return null;
            }
            lit.Body = _this.parseBlockStatement();
            return lit;
        };
        this.parseStreamLiteral = function () {
            var curToken = _this.curToken,
                lit = new ast.StreamLiteral(curToken);
            if (!_this.expectPeek(token.LPAREN)) {
                return null;
            }
            lit.Emit = _this.parseIdentifier();
            if (!_this.expectPeek(token.LBRACE)) {
                return null;
            }
            lit.Body = _this.parseBlockStatement();
            return lit;
        };
        this.parseFunctionParameters = function () {
            var identifiers = [];
            if (_this.peekTokenIs(token.RPAREN)) {
                _this.nextToken();
                return identifiers;
            }
            _this.nextToken();
            var ident = new ast.Identifier(_this.curToken, _this.curToken.Literal);
            identifiers.push(ident);
            while (_this.peekTokenIs(token.COMMA)) {
                _this.nextToken();
                _this.nextToken();
                ident = new ast.Identifier(_this.curToken, _this.curToken.Literal);
                identifiers.push(ident);
            }
            if (!_this.expectPeek(token.RPAREN)) {
                return null;
            }
            return identifiers;
        };
        this.parseStringLiteral = function () {
            return new ast.StringLiteral(_this.curToken, _this.curToken.Literal);
        };
        this.parseArrayLiteral = function () {
            var array = new ast.ArrayLiteral(_this.curToken);
            array.Elements = _this.parseExpressionList(token.RBRACKET);
            return array;
        };
        this.parseExpressionList = function (end) {
            var list = [];
            if (_this.peekTokenIs(end)) {
                _this.nextToken();
                return list;
            }
            _this.nextToken();
            list.push(_this.parseExpression(exports.LOWEST));
            while (_this.peekTokenIs(token.COMMA)) {
                _this.nextToken();
                _this.nextToken();
                list.push(_this.parseExpression(exports.LOWEST));
            }
            if (!_this.expectPeek(end)) {
                return null;
            }
            return list;
        };
        this.l = l;
        this.errors = [];
        this.registerInfix(token.PLUS, this.parseInfixExpression);
        this.registerInfix(token.MINUS, this.parseInfixExpression);
        this.registerInfix(token.SLASH, this.parseInfixExpression);
        this.registerInfix(token.ASTERISK, this.parseInfixExpression);
        this.registerInfix(token.MOD, this.parseInfixExpression);
        this.registerInfix(token.EQ, this.parseInfixExpression);
        this.registerInfix(token.NOT_EQ, this.parseInfixExpression);
        this.registerInfix(token.AND, this.parseInfixExpression);
        this.registerInfix(token.OR, this.parseInfixExpression);
        this.registerInfix(token.LT, this.parseInfixExpression);
        this.registerInfix(token.GT, this.parseInfixExpression);
        this.registerInfix(token.LPAREN, this.parseCallExpression);
        this.registerInfix(token.LBRACKET, this.parseIndexExpression);
        this.registerInfix(token.DOT, this.parseDotIndexExpression);
        this.registerPrefix(token.IDENT, this.parseIdentifier);
        this.registerPrefix(token.INT, this.parseIntegerLiteral);
        this.registerPrefix(token.BANG, this.parsePrefixExpression);
        this.registerPrefix(token.MINUS, this.parsePrefixExpression);
        this.registerPrefix(token.TYPEOF, this.parsePrefixExpression);
        this.registerPrefix(token.LPAREN, this.parseGroupedExpression);
        this.registerPrefix(token.TRUE, this.parseBoolean);
        this.registerPrefix(token.FALSE, this.parseBoolean);
        this.registerPrefix(token.IF, this.parseIfExpression);
        this.registerPrefix(token.FOR, this.parseForExpression);
        this.registerPrefix(token.WHILE, this.parseWhileExpression);
        this.registerPrefix(token.SLEEP, this.parseSleepExpression);
        this.registerPrefix(token.FUNCTION, this.parseFunctionLiteral);
        this.registerPrefix(token.STRING, this.parseStringLiteral);
        this.registerPrefix(token.LBRACKET, this.parseArrayLiteral);
        this.registerPrefix(token.LBRACE, this.parseHashLiteral);
        this.registerPrefix(token.NEW, this.parseNewExpression);
        this.registerPrefix(token.EXEC, this.parseExecExpression);
    }
    Parser.prototype.parse = function () {
        this.errors = [];
        this.curToken = null;
        this.peekToken = null;
        this.nextToken();
        this.nextToken();
    };
    Parser.prototype.curTokenIs = function (t) {
        return this.curToken.Type == t;
    };
    Parser.prototype.peekTokenIs = function (t) {
        return this.peekToken.Type == t;
    };
    Parser.prototype.peekPrecedence = function () {
        var p = exports.precedences[this.peekToken.Type];
        if (typeof p == 'number') {
            return p;
        }
        return exports.LOWEST;
    };
    Parser.prototype.curPrecedence = function () {
        var p = exports.precedences[this.curToken.Type];
        if (typeof p == 'number') {
            return p;
        }
        return exports.LOWEST;
    };
    Parser.prototype.nextToken = function () {
        this.curToken = this.peekToken;
        this.peekToken = this.l.NextToken();
    };
    Parser.prototype.registerPrefix = function (tokenType, fn) {
        this.prefixParseFns[tokenType] = fn;
    };
    Parser.prototype.registerInfix = function (tokenType, fn) {
        this.infixParseFns[tokenType] = fn;
    };
    Parser.prototype.parseProgram = function () {
        var Statements = [],
            program = new ast.Program(Statements);
        this.nextToken();
        while (!this.curTokenIs(token.EOF)) {
            var stmt = this.parseStatement();
            if (stmt != null) {
                program.Statements.push(stmt);
            }
            this.nextToken();
        }
        return program;
    };
    Parser.prototype.noPrefixParseFnError = function (t) {
        var msg = "no prefix parse function for " + t + " found";
        this.errors.push(msg);
    };
    Parser.prototype.expectPeek = function (t) {
        if (this.peekTokenIs(t)) {
            this.nextToken();
            return true;
        } else {
            this.peekError(t);
            return false;
        }
    };
    Parser.prototype.Errors = function () {
        return this.errors;
    };
    Parser.prototype.peekError = function (expectedType) {
        var msg = util_1.sprintf("expected next token to be %s, got %s instead", expectedType, this.peekToken.Type);
        this.errors.push(msg);
    };
    return Parser;
}();
exports.Parser = Parser;

},{"./ast":3,"./token":21,"./util":22}],19:[function(require,module,exports){
(function (process){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("../object");
var util_1 = require("../util");
exports.getTerminalSize = function (scope) {
    if (scope === void 0) {
        scope = null;
    }
    var stdout = process ? process.stdout : null;
    return [new object.Integer(stdout != null ? stdout.columns : scope ? scope.width : -2), new object.Integer(stdout != null ? stdout.rows : scope ? scope.height : -2)];
};
var getDimensions = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.Array(exports.getTerminalSize(scope));
}, "terminal"),
    hasColorSupport = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.Boolean(scope != null ? scope.hasColorSupport : false);
}, "terminal"),
    has3dSupport = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new object.Boolean(scope != null ? scope.has3dSupport : false);
}, "terminal"),
    beep = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log("\x07");
    return new object.NULL();
}, "terminal");
exports.default = util_1.makeBuiltinInterface([["getDimensions", getDimensions], ["hasColorSupport", hasColorSupport], ["has3dSupport", has3dSupport], ["beep", beep]]);

}).call(this,require('_process'))

},{"../object":16,"../util":22,"_process":2}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("../object");
var util_1 = require("../util");
var tableConstructor = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var rowData = [],
        colData = [];
    if (args.length > 0) {
        scope.data.Value = args[0];
    }
    if (args.length > 1) {
        scope.columns = args[1];
    }
    if (args.length > 2) {
        scope.config = args[2];
    }
    return new object.NULL();
}, "object"),
    display = new object.Builtin(function (context, scope) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    // this needs objectContext / scope will be undefined otherwise
    for (var _a = 0, _b = scope.data.Elements; _a < _b.length; _a++) {
        var d = _b[_a];
        util_1.printNativeString(null, null, d.Inspect() + "");
    }
    return new object.String("");
}, "object");
exports.default = util_1.makeBuiltinClass("Table", [["Table", tableConstructor], ["display", display]]);

},{"../object":16,"../util":22}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ILLEGAL = "ILEGAL",
    EOF = "EOF",

// Identifiers + literals
IDENT = "IDENT",
    // add, foobar, x, y, ...
INT = "INT",
    // 1234566
// Operators
ASSIGN = "=",
    PLUS = "+",
    BANG = "!",
    MINUS = "-",
    SLASH = "/",
    ASTERISK = "*",
    MOD = "%",
    LT = "<",
    GT = ">",
    EQ = "==",
    NOT_EQ = "!=",
    AND = "&&",
    OR = "||",
    SOURCE = "<-",
    SINK = "->",
    INSERTION = "<<",
    EXTRACTION = ">>",

// Delimiters
COMMA = ",",
    SEMICOLON = ";",
    COLON = ":",
    LPAREN = "(",
    RPAREN = ")",
    LBRACE = "{",
    RBRACE = "}",
    LBRACKET = "[",
    RBRACKET = "]",
    DOT = ".",

// Keywords
FUNCTION = "FUNCTION",
    STRING = "STRING",
    LET = "LET",
    IF = "IF",
    ELSE = "ELSE",
    FOR = "FOR",
    SLEEP = "SLEEP",
    WHILE = "WHILE",
    RETURN = "RETURN",
    TRUE = "TRUE",
    FALSE = "FALSE",
    TYPEOF = "TYPEOF",
    EXEC = "EXEC",
    IMPORT = "IMPORT",
    NEW = "NEW",
    CLASS = "CLASS",
    STREAM = "STREAM";
exports.ILLEGAL = ILLEGAL;
exports.EOF = EOF;
exports.IDENT = IDENT;
exports.INT = INT;
exports.ASSIGN = ASSIGN;
exports.PLUS = PLUS;
exports.BANG = BANG;
exports.MINUS = MINUS;
exports.SLASH = SLASH;
exports.ASTERISK = ASTERISK;
exports.MOD = MOD;
exports.LT = LT;
exports.GT = GT;
exports.EQ = EQ;
exports.NOT_EQ = NOT_EQ;
exports.AND = AND;
exports.OR = OR;
exports.SOURCE = SOURCE;
exports.SINK = SINK;
exports.INSERTION = INSERTION;
exports.EXTRACTION = EXTRACTION;
exports.COMMA = COMMA;
exports.SEMICOLON = SEMICOLON;
exports.COLON = COLON;
exports.LPAREN = LPAREN;
exports.RPAREN = RPAREN;
exports.LBRACE = LBRACE;
exports.RBRACE = RBRACE;
exports.LBRACKET = LBRACKET;
exports.RBRACKET = RBRACKET;
exports.DOT = DOT;
exports.FUNCTION = FUNCTION;
exports.STRING = STRING;
exports.LET = LET;
exports.IF = IF;
exports.ELSE = ELSE;
exports.FOR = FOR;
exports.SLEEP = SLEEP;
exports.WHILE = WHILE;
exports.RETURN = RETURN;
exports.TRUE = TRUE;
exports.FALSE = FALSE;
exports.TYPEOF = TYPEOF;
exports.EXEC = EXEC;
exports.IMPORT = IMPORT;
exports.NEW = NEW;
exports.CLASS = CLASS;
exports.STREAM = STREAM;
exports.keywords = {
    "fn": FUNCTION,
    "let": LET,
    "if": IF,
    "else": ELSE,
    "return": RETURN,
    "true": TRUE,
    "false": FALSE,
    "for": FOR,
    "sleep": SLEEP,
    "exec": EXEC,
    "import": IMPORT,
    "while": WHILE,
    "typeof": TYPEOF,
    "new": NEW,
    "class": CLASS,
    "stream": STREAM
};
function LookupIdent(ident) {
    var tokenType = exports.keywords[ident],
        ok = tokenType != null;
    if (ok) {
        return tokenType;
    }
    return IDENT;
}
exports.LookupIdent = LookupIdent;

},{}],22:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var object = require("./object");
var environment_1 = require("./environment");
var lexer = require("./lexer");
var parser = require("./parser");
var strBuiltin = new object.String("builtin"),
    TRUE = new object.Boolean(true);
exports.sprintf = function (s) {
    var a = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        a[_i - 1] = arguments[_i];
    }
    var strings = [],
        numbers = [];
    for (var _a = 0, a_1 = a; _a < a_1.length; _a++) {
        var e = a_1[_a];
        if (typeof e == "string") {
            strings.push(e);
        } else {
            numbers.push(e);
        }
    }
    for (var _b = 0, numbers_1 = numbers; _b < numbers_1.length; _b++) {
        var n = numbers_1[_b];
        s = s.replace(/\%d/, n);
    }
    for (var _c = 0, strings_1 = strings; _c < strings_1.length; _c++) {
        var str = strings_1[_c];
        s = s.replace(/\%s/, str);
    }
    return s;
};
function copyObject(valueNode) {
    switch (valueNode.Type()) {
        case "boolean":
            return new object.Boolean(valueNode.Value);
        case "number":
            return new object.Integer(valueNode.Value);
        case "string":
            return new object.String(valueNode.Value);
        case "array":
            return new object.Array(valueNode.Elements);
        case "hash":
            return copyHashMap(valueNode);
        case "function":
        case "BUILTIN":
            return valueNode;
        default:
            return new object.NULL();
    }
}
exports.copyObject = copyObject;
function copyHashMap(data) {
    var allKeys = Object.keys(data.Pairs),
        pairData = data.Pairs;
    var pairs = {};
    for (var _i = 0, allKeys_1 = allKeys; _i < allKeys_1.length; _i++) {
        var pairKey = allKeys_1[_i];
        var pair = pairData[pairKey],
            valueNode = pair.Value,
            keyNode = pair.Key;
        var NewValue = copyObject(valueNode);
        pairs[keyNode.Value] = { Key: keyNode, Value: NewValue };
    }
    return new object.Hash(pairs);
}
exports.copyHashMap = copyHashMap;
exports.makeBuiltinClass = function (className, fields) {
    var instance = exports.makeBuiltinInterface(fields);
    instance.Constructor = instance.Pairs[className].Value;
    instance.className = className;
    instance.Pairs.builtin = { Key: strBuiltin, Value: TRUE };
    return instance;
};
exports.makeBuiltinInterface = function (methods) {
    var pairs = {};
    for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
        var m = methods_1[_i];
        pairs[m[0]] = {
            Key: new object.String(m[0]),
            Value: m[1]
        };
    }
    return new object.Hash(pairs);
};
exports.addMethod = function (allMethods, methodName, contextName, builtinFn) {
    var _a;
    allMethods.push((_a = {}, _a[methodName] = {
        Key: new object.String(methodName),
        Value: new object.Builtin(builtinFn, contextName)
    }, _a));
};
exports.nativeListToArray = function (obj) {
    var value = null;
    return new object.Array(obj.map(function (element) {
        switch (typeof element === "undefined" ? "undefined" : _typeof(element)) {
            case "string":
                value = new object.String(element);
                break;
            case "number":
                value = new object.Integer(element);
                break;
            case "object":
                if (typeof element.length == "number") {
                    value = exports.nativeListToArray(element);
                } else {
                    value = exports.nativeObjToMap(element);
                }
                break;
            default:
                return;
        }
        return value;
    }));
};
exports.nativeObjToMap = function (obj) {
    if (obj === void 0) {
        obj = {};
    }
    var map = new object.Hash({});
    for (var objectKey in obj) {
        var value = null,
            data = obj[objectKey];
        switch (typeof data === "undefined" ? "undefined" : _typeof(data)) {
            case "string":
                value = new object.String(data);
                break;
            case "number":
                value = new object.Integer(data);
                break;
            case "object":
                if (typeof data.length == "number") {
                    value = exports.nativeListToArray(data);
                } else {
                    value = exports.nativeObjToMap(data);
                }
                break;
            case "function":
                console.log("native function", data);
                // need to figure this out
                // new object.Builtin(builtinFn, contextName)
                break;
            default:
        }
        map[objectKey] = {
            Key: new object.String(objectKey),
            Value: value
        };
    }
    return map;
};
exports.scaleString = function (input, scale) {
    var l = input.length,
        i = 0,
        o = "";
    while (i < l) {
        o += input[i].repeat(scale[0]);
        i += 1;
    }
    return o;
};
function printToDocument(value) {
    console.log("print to document", value);
    var win = 'window',
        wind = eval(win) != undefined ? eval(win) : undefined,
        document = wind ? wind.document : null;
    document.querySelector("#ecs-output").innerHTML += value + "<br/>\n";
}
exports.printToDocument = printToDocument;
exports.println = function (context, scope, args) {
    if (typeof Window == 'undefined') {
        args.forEach(function (arg) {
            console.log(arg.Inspect());
        });
    } else if (context && context.postMessage) {
        context.postMessage("print", { data: args.map(function (arg) {
                return arg.Inspect();
            }), path: scope.path });
    } else {
        args.forEach(function (arg) {
            printToDocument("" + arg.Inspect());
        });
    }
};
exports.printNativeString = function (context, scope, str) {
    if (typeof Window == 'undefined') {
        console.log(str);
    } else if (context && context.postMessage) {
        context.postMessage("print", { data: str, path: scope.path });
    } else {
        printToDocument(str);
    }
};
// needs either evaluator or evalFn
exports.makeInterpreter = function (evalFn, _evaluator) {
    var tokenizer = new lexer.Lexer(),
        _parser = new parser.Parser(tokenizer);
    return {
        tokenizer: tokenizer,
        parser: _parser,
        evaluator: _evaluator,
        makeEnvironment: function makeEnvironment(outer) {
            return new environment_1.Environment(outer);
        },
        parseAndEvaluate: function parseAndEvaluate(text, env, onErrors, joinNewLines) {
            if (joinNewLines === void 0) {
                joinNewLines = true;
            }
            if (joinNewLines) {
                text = text ? text.indexOf("\n") > -1 ? text.replace(/\n/g, "") : text : "";
                if (text[text.length - 1] != ";") {
                    text = text + ";";
                }
            }
            tokenizer.setText(text);
            _parser.parse();
            var program = _parser.parseProgram();
            if (_parser.Errors().length != 0) {
                onErrors && onErrors(_parser.Errors());
                return;
            }
            var evaluated = (evalFn || _evaluator.Eval)(program, env);
            if (evaluated != null) {
                if (evaluated.Inspect) {
                    return evaluated.Inspect();
                } else {
                    return null;
                }
            }
        }
    };
};

},{"./environment":9,"./lexer":15,"./object":16,"./parser":18}]},{},[7])

//# sourceMappingURL=worker-bundle.js.map
