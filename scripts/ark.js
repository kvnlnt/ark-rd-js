// FP
// * Referential transparency
// * immutable state

// Main Ark object
var ARK = {};

// Create new object
ARK.new = function(arkType, props, funcs){

    // construct type by ark type
    var type = function(){

        var that  = this;
        var props = props || null;
        var funcs = funcs || null;

        // assign it's type
        this.TYPE = arkType;

        // attach props
        ARK.forEach(ARK.TYPE[arkType].PROP, function(v,k){
            that[k] = v.prop;
        });

        // attach funcs
        ARK.forEach(ARK.TYPE[arkType].FUNC, function(v,k){
            that[k] = v.func;
        });

        // override props with argument props
        if(null !== props){
            ARK.forEach(props, function(v,k){
                that[k] = v;
            });
        }
        
        // override funcs with argument funcs
        if(null !== funcs){
            ARK.forEach(funcs, function(v,k){
                that[k] = v;
            });
        }

    };

    // instantiate type into object
    var type = new type();

    // return it
    return type;

};

// Logger
ARK.log = function() {

    if(console){
        console.log.apply(console, arguments);
    }

};

// Display as console table
ARK.table = function(a,b) {

    if(console){
        console.table.apply(console, arguments);
    }

}

// Type checker
ARK.check = function(signature, args, TYPE, FUNC, scope){

    var diff = ARK.diff(signature, args);

    // Detect length
    if(diff.length){
        var warn = TYPE+'.' + FUNC +' argument mismatch. Expected (' + signature.toString() + ') but received ('+ args.toString() + ')';
        ARK.log('%c WARN ', 'background: #FFFF00; color: #000', warn);
    }

};

// Helper method to modify type function
ARK.func = function(TYPE, FUNC, func){

    var _func = function(){

        var signature = ARK.TYPE[TYPE].FUNC[FUNC].signature;
        var args      = ARK.map(arguments, function(arg){ return typeof arg; });
        ARK.check(signature, args, TYPE, FUNC, this);
        return func.apply(this, arguments);

    };

    ARK.TYPE[TYPE].FUNC[FUNC].func = _func;    

};

// FP looper
ARK.forEach = function (obj, iterator, thisArg) {

    // test for native forEach support
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
        obj.forEach(iterator, thisArg);

    // arrays (+ returns numeric representation of object)
    } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i += 1) {
            iterator.call(thisArg, obj[i]);
        }

    // objects
    } else {
        for (var key in obj) {
            if(obj.hasOwnProperty(key)) {
                iterator.call(thisArg, obj[key], key);
            }
        }
    }
};

// FP filter
ARK.filter = function (obj, iterator, thisArg) {

    // prepare the result variable
    var isObject = Object.prototype.toString.call( obj ) === '[object object]';
    var result   = isObject ? {} : [];

    // pass control to the native filter if it's available
    if (Array.prototype.filter && obj.filter === Array.prototype.filter) {
        return obj.filter(iterator, thisArg);
    }

    // otherwise use our own filter
    ARK.forEach(obj, function (value, key, list) {

        // if the result of passing a value through the function
        // is true, then add that value you to the new list
        if (iterator.call(thisArg, value, key, list)) {
            if(isObject){
                result[key] = value;
            } else {
                result[result.length] = value;
            }
        }

    });

    // return the new list
    return result;
};

// FP mapper
ARK.map = function (obj, iterator, thisArg) {

    // prepare the result variable
    var isObject = Object.prototype.toString.call( obj ) === '[object object]';
    var result   = isObject ? {} : [];

    // pass control to native map if it's available
    if (Array.prototype.map && obj.map === Array.prototype.map) {
        return obj.map(iterator, thisArg);
    }

    // otherwise, use our version of map
    ARK.forEach(obj, function (value, key, list) {
        if(isObject){
            // push the value returned from the iterator onto result
            result[key] = iterator.call(thisArg, value, key, list);
        } else {
            // push the value returned from the iterator onto result
            result[result.length] = iterator.call(thisArg, value, key, list);
        }
    });

    // return the new updated array
    return result;
};

// FP reducer
ARK.foldl = function (obj, iterator, accu, thisArg) {

    // set a variable that tells us if an accumulator was set
    var hasAccu = arguments.length > 2;
    
    // pass control to the native foldl if it's available
    if (Array.prototype.reduce && obj.reduce === Array.prototype.reduce) {
        // if accumulator present, pass it
        return hasAccu ? obj.reduce(iterator, accu) : obj.reduce(iterator);
    }

    // otherwise use our own definition of foldl
    ARK.forEach(obj, function (value, key, list) {

        // set the accu to the first value, if accu wasn't 
        // supplied as an argument
        if (!hasAccu) {
            accu    = value;
            hasAccu = true;
        } else {
            accu = iterator.call(thisArg, accu, value, key, list);
        }
    });

    // return the final value of our accumulator
    return accu;
};

// Symmetric difference
ARK.diff = function(objA, objB){

    var aDiff = ARK.filter(objA, function(i){ return objB.indexOf(i) < 0; });
    var bDiff = ARK.filter(objB, function(i){ return objA.indexOf(i) < 0; });
    var diff  = aDiff.concat(bDiff);

    return diff;

};




