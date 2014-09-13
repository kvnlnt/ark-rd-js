// populate tests
ARK.TEST = function(o){ 
    return o.paths['/testpath'] === '/testpath'; 
};
ARK.test('PATH','add',['/testpath'], ARK.TEST);

// run test
// ARK.test();

