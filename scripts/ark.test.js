// loop all functions and see if they are not null
ARK.validate = function(print){

    var print = print || false;
    var result = [];

    // test funcs
    ARK.forEach(this.TYPE, function(type, typeK){
        ARK.forEach(type.FUNC, function(func, funcK){
            if(0 === +func.func){
                var warn = typeK + '.' + funcK + ' function is not defined';
                result[result.length] = warn;
            }
        });
    });

    if(print){
        ARK.forEach(result, function(warn){
            ARK.log('%c WARN ', 'background: #FFFF00; color: #000', warn);
        });
    }

    return result;

};

// Helper method to modify type function
ARK.test = function(TYPE, FUNC, args, func){

    var mode = 0 === arguments.length ? 'run' : 'add';

    switch(mode) {

        case 'run':

            // validate first
            this.validate(true);

            // loop types
            ARK.forEach(this.TYPE, function(type, typeK){

                // pre-test object
                var o = ARK.new(typeK);

                // loop funcs
                ARK.forEach(type.FUNC, function(func, funcK){

                    var hasTest = void 0 !== func.test;

                    if(hasTest){

                        var testArgs   = func.test.args;
                        var testFunc   = func.test.func;
                        var testObject = o[funcK].apply(o, testArgs);
                        var testResult = testFunc(testObject) ? 'PASS' : 'FAIL';

                        if('PASS' === testResult){
                            var msg = typeK + '.' + funcK + ' unit test was successful';
                            ARK.log('%c PASS ', 'background: #009900; color: #FFF', msg);
                        } else {
                            var msg = typeK + '.' + funcK + ' test failed';
                            ARK.log('%c FAIL ', 'background: #FF0000; color: #FFF', msg);
                        }
                        
                    } else {

                        var msg = typeK + '.' + funcK + ' has no unit test coverage';
                        ARK.log('%c NOTE ', 'background: #0000FF; color: #FFF', msg);

                    }

                }); // forEach

            }); // forEach

        break;

        case 'add':

            ARK.TYPE[TYPE].FUNC[FUNC].test = {
                args:args,
                func:func
            };

        break;

    }

};