
/**
 * 由翠鸟拼图创建 Ver. 20220113 BETA
 * Thu Mar 13 2025 16:32:00 GMT+0800 (中国标准时间)
 * 如果希望自行编辑逻辑代码，请在代码最后的自定义部分内编写，否则可能被拼图覆盖
 */

'use strict';

let puzzle = {};

let initLogic = function(sceneId) {

    // global variables/constants used by puzzles' functions
    let _pGlob = {disposed: false, sceneId};
    let logic = {_pGlob: _pGlob};
    
    _pGlob.intervals = {};
    _pGlob.timeouts = {};
    _pGlob.poiSystems = {};
    _pGlob.heatMaps = {};
    _pGlob.moverOnReceivedCallback = {};
    _pGlob.stateAnimationOnReceivedCallback = {};
    _pGlob.kfAnimationOnReceivedCallback = {};
    _pGlob.cameraOnReceivedCallbackList = [];
    _pGlob.objClickCallbacks = [];
    _pGlob.objInteractionCallbacks = [];
    _pGlob.onSceneLoad = [];
    _pGlob.originMaterial = {};
    _pGlob.eventCallback = {SCENE_LOAD : _pGlob.onSceneLoad};
    
    _pGlob.callbacks = {
        log: function(a, b) {
            console.log(a, b);
        }
    };
    _pGlob.everyFrameCallbacks = [];
    let scene = window.scene;
    _pGlob.scene = scene;
    
    let KINGFISHER = null;
    let context = null;
    let axios = null; 
    let contextPath = "";   
    let fetchService = null;
    let kingfisherService = null;

    function dispose() {
        try {
            _pGlob.disposed = true;
            
            window.removeEventListener('message', messageHandler);
            
            for (let key in _pGlob.intervals) {
                window.clearInterval(_pGlob.intervals[key]);
            }
            _pGlob.intervals = {};
            for (let key in _pGlob.timeouts) {
                window.clearTimeout(_pGlob.timeouts[key]);
            }
            _pGlob.timeouts = {};
            for (let i = 0; i < _pGlob.everyFrameCallbacks.length; i++) {
                _pGlob.scene.onBeforeRenderObservable.remove(_pGlob.everyFrameCallbacks[i]);
            }
            _pGlob.everyFrameCallbacks = [];
            if (_pGlob.kingfisherPickListener) {
                _pGlob.scene.onPointerObservable.removeCallback(_pGlob.kingfisherPickListener);
                _pGlob.kingfisherPickListener = null;
            }
            if (_pGlob.keyboardObservable) {
                _pGlob.scene.onKeyboardObservable.remove(_pGlob.keyboardObservable);
                _pGlob.keyboardObservable = null;
            }
            if (_pGlob.wheelObservable) {
                _pGlob.scene.onPointerObservable.remove(_pGlob.wheelObservable);
                _pGlob.wheelObservable = null;
            }
            if (_pGlob.mouseButtonObservable) {
                _pGlob.scene.onPointerObservable.remove(_pGlob.mouseButtonObservable);
                _pGlob.mouseButtonObservable = null;
            }
            let poiSystemMap = _pGlob.scene.poiSystemMap;
            for (let key in _pGlob.poiSystems) {
                if (poiSystemMap && poiSystemMap[key]) {
                    puzzle.clearPois(_pGlob.scene, key);
                }
            }
            let heatmapMap = _pGlob.scene.heatmapMap;
            for (let key in _pGlob.heatMaps) {
                if (heatmapMap && heatmapMap[key]) {
                    puzzle.clearHeatmap(_pGlob.scene, key);
                }
            }
            for (let key in _pGlob.annotations) {
                puzzle.destroyAnnotationsByPrefix(_pGlob.scene, key);
            }
            
            _pGlob.objInteractionCallbacks.forEach((temp) => {
                if (temp.obj.interaction) {
                    temp.obj.interaction[temp.type + 'Observable'].remove(temp.obs);
                }
            });
            for (let mover in _pGlob.moverOnReceivedCallback) {
                puzzle.removeMoverCallback(_pGlob.scene, mover, _pGlob.moverOnReceivedCallback[mover]);
            }
            for (let anim in _pGlob.stateAnimationOnReceivedCallback) {
                for (let cb of _pGlob.stateAnimationOnReceivedCallback[anim]) {
                    puzzle.removeStateAnimationCallback(_pGlob.scene, anim, cb);
                }
            }
            for (let anim in _pGlob.kfAnimationOnReceivedCallback) {
                for (let cb of _pGlob.kfAnimationOnReceivedCallback[anim]) {
                    puzzle.removeKeyframeAnimationCallback(_pGlob.scene, anim, cb);
                }
            }
            for (let i = 0; i < _pGlob.cameraOnReceivedCallbackList.length; i++) {
                puzzle.removeCameraCallback(_pGlob.scene, _pGlob.cameraOnReceivedCallbackList[i]);
            }
            
            if (_pGlob.userDispose) {
                _pGlob.userDispose();
            }
            console.log('翠鸟拼图已卸载');
        } catch(e) {
            console.log(e);
        }
    }

    // Kingfisher common functions    
    logic.registerContext = function(key, value){
        //console.log("register " + key);
        _pGlob[key] = value;
        if (key == 'kingfisher') {
            KINGFISHER = value.Runtime;
            puzzle = KINGFISHER.Puzzle;
        } else if (key == 'context') {
            context = value;
        } else if (key == 'axios') {
            axios = value;
        } else if (key == 'contextPath') {
            contextPath = value;
        } else if (key == 'fetchService') {
            fetchService = value;
        } else if (key == 'kingfisherService') {
            kingfisherService = value;
        }
    }
    
    // Kingfisher common functions    
    logic.puzzleDispose = function(){
        dispose();
    }
    
    logic.fetchCallback = function() {
        return _pGlob['callbacks'] || {};
    }
    
    logic.loadEvents = function(){
        return Object.keys(_pGlob.eventCallback);
    }
    
    function getContext(){
        return _pGlob['context'];
    }
    
    function getKingfisher(){
        return _pGlob['kingfisher'];
    }
    
    function getCanvas(){
        return _pGlob['canvas'];
    }
    
    function replaceParams(expression) {
        if (typeof(expression) !== 'string') {
            return expression;
        }
        let index = 0;
        let count = 0;
        while (expression.indexOf("{{", index) != -1 && count++ < 1000) {
            let begin = expression.indexOf("{{", index);
            let end = expression.indexOf("}}", begin);
            if (end != -1) {
                let paramName = expression.substring(begin + 2, end);
                expression = expression.substring(0, begin) + fetchParam(paramName) + expression.substring(end + 2);
                index = begin + 1;
            }
            else {
                index = begin + 2;
            }
        }
        
        return expression;
    }
    
    function fetchParam(paramName) {
        let paramParts = paramName.split(".");
        paramParts = paramParts || [];
        let currentObj = _pGlob["params"];

        paramParts.forEach(name => {
            if (currentObj != null) {
                currentObj = currentObj[name];
            }
        });
        
        if (currentObj == null) {
            currentObj = getContext();
            
            paramParts.forEach(name => {
                if (currentObj != null) {
                    currentObj = currentObj[name];
                }
            });
        } 
        
        return currentObj;
    }
    
    function call(functionName, ...params) {
        let functionParts = functionName.split(".");
        functionParts = functionParts || [];
        let currentObj = getContext();

        for (let i=0; i < functionParts.length && currentObj; i++){
            currentObj = currentObj[functionParts[i]];
        }
        
        if (typeof(currentObj) === 'function') {
            currentObj(...params);
        }
        else {
            console.error('can not find function: ' + functionName);
        }
    }
    
    function messageHandler(event) {
        if (_pGlob.disposed) {
            return;
        }
        if (typeof event.data == "object") {
            let message = event.data;
            if (message.action == "puzzleEvent") {
                let callbacks = _pGlob.eventCallback[message.event.name];
                if (callbacks) {
                    let params = message.event.args;
                    if (params && typeof(params) === 'string') {
                        try {
                            params = JSON.parse(params);
                        }
                        catch (err) {
                            console.log('JSON.parse failed!', err);
                        }
                    }
                    if (params !== null && params !== undefined) {
                        if (_pGlob["params"] && typeof _pGlob["params"] === 'object' && typeof params === 'object') {
                            _pGlob["params"] = Object.assign(_pGlob["params"], params);
                        }
                        else {
                            _pGlob["params"] = params;
                        }
                    }
                    _pGlob["loadedData"] = params;
                    let args = {
                        type: 'puzzleEvent',
                        name: message.event.name,
                        event: message.event,
                    }
                    callbacks.forEach(function(callback){
                        callback(args);
                    });
                }
            }
        }
    }
    
    window.addEventListener('message', messageHandler);





    // play stateAnimation
    function playStateAnimation(anim, state, duration) {
        puzzle.playStateAnimation(_pGlob.scene, anim, state, duration);
    }



    // On Receive Event
    function doEvent(event, callback) {
        event = replaceParams(event);
        let callbacks = _pGlob.eventCallback[event] || [];
        _pGlob.eventCallback[event] = callbacks;

        if (callbacks.indexOf(callback) == -1){
            callbacks.push(callback);
        }
    }




    // utility function envoked by almost all Kingfisher-specific puzzles
    // filter off some non-mesh types
    function notIgnoredObj(obj) {
        return true;
    }


    // utility function envoked by almost all V3D-specific puzzles
    // find first occurence of the object by its name
    function getObjectByName(objName) {
        //return Kingfisher.Runtime.PuzzleInterface.getObjectByName(scene, objName);
        return false;
    }


    // utility function envoked by almost all V3D-specific puzzles
    // retrieve all objects on the scene
    function getAllObjectNames() {
        var objNameList = [];
        return objNameList;
    }


    // utility function envoked by almost all V3D-specific puzzles
    // retrieve all objects which belong to the group
    function getObjectNamesByGroupName(targetGroupName) {
        var objNameList = [];
        return objNameList;
    }


    // utility function envoked by almost all Kingfisher-specific puzzles
    // process object input, which can be either single obj or array of objects, or a group
    function retrieveObjectNames(objNames) {
        var acc = [];
        retrieveObjectNamesAcc(objNames, acc);
        return acc;
    }

    function retrieveObjectNamesAcc(currObjNames, acc) {
        if (typeof currObjNames == "string") {
            acc.push(currObjNames);
        } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
            var newObj = getObjectNamesByGroupName(currObjNames[1]);
            for (var i = 0; i < newObj.length; i++)
                acc.push(newObj[i]);
        } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
            var newObj = getAllObjectNames();
            for (var i = 0; i < newObj.length; i++)
                acc.push(newObj[i]);
        } else if (Array.isArray(currObjNames)) {
            for (var i = 0; i < currObjNames.length; i++)
                retrieveObjectNamesAcc(currObjNames[i], acc);
        }
    }




    // setActiveCamera puzzle
    function setActiveCamera(cameraName, duration) {
        puzzle.setActiveCameraArg(_pGlob.scene, cameraName, duration);
    }



    doEvent('放大', function() {
	  if(_pGlob.disposed) return;

      playStateAnimation('PoXcHUxRwsKWl1bGvIRkX', 3, undefined);
      	});
    doEvent('缩小', function() {
	  if(_pGlob.disposed) return;

      playStateAnimation('PoXcHUxRwsKWl1bGvIRkX', 0, undefined);
      	});
    doEvent('默认', function() {
	  if(_pGlob.disposed) return;
  setActiveCamera('侧视图', 1);

      playStateAnimation('PoXcHUxRwsKWl1bGvIRkX', 2, undefined);
      	});
    doEvent('顶视图', function() {
	  if(_pGlob.disposed) return;
  setActiveCamera('顶视图', 1);
	});
    doEvent('侧视图', function() {
	  if(_pGlob.disposed) return;
  setActiveCamera('侧视图', 1);
	});

    doEvent('无', function() {
	  if(_pGlob.disposed) return;

      playStateAnimation('ND-1wMkDxzP1IZeYJyLw0', 0, undefined);
      	});
    doEvent('热力', function() {
	  if(_pGlob.disposed) return;

      playStateAnimation('ND-1wMkDxzP1IZeYJyLw0', 1, undefined);
      	});
    doEvent('点位', function() {
	  if(_pGlob.disposed) return;

      playStateAnimation('ND-1wMkDxzP1IZeYJyLw0', 2, undefined);
      	});
    doEvent('路线', function() {
	  if(_pGlob.disposed) return;

      playStateAnimation('ND-1wMkDxzP1IZeYJyLw0', 3, undefined);
      	});


/* ================================ 自定义代码开始 ============================= */   
    
/* ================================ 自定义代码结束 ============================= */   

    console.log('翠鸟拼图已经加载');
        
    return logic;
};

window.puzzleLogic = initLogic('__sceneId');
