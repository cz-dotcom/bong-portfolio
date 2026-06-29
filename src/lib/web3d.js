window.Kc = window.Kc || {};

// 使用全局 Axios（如果通过 script 标签加载）或 window.axios
var Axios = window.axios || window.Axios;

export class Web3dManager {
  static _idCount = 0;
  /**
   * Initializes a 3D component instance.
   * @param {HTMLElement|string} dom - The DOM element or its ID to attach the 3D view.
   * @param {Object} options - Configuration options including sceneId and listeners.
   */
  constructor(dom, options = {}) {
    if (!window.Kingfisher) {
      console.error('Kingfisher modules not found!');
      return;
    }

    const _self = this;
    let id = 'web3d_' + ++ Web3dManager._idCount;

    console.log('Creating Kf 3D component', id);
    _self.isDisposed = false;
    _self.id = id;
    _self.options = options;
    _self.scenes = [];
    _self.listeners = options.listeners || {};

    _self._createEngine(typeof dom === 'string' ? document.getElementById(dom) : dom);
    if (_self.options.sceneId) {
      _self.loadSceneById(_self.options.sceneId);
    }
  }

  /**
   * Registers event listeners for the 3D component.
   * @param {Object} listeners - Event listeners object.
   */
  registerWeb3dListener(listeners) {
    this.listeners = listeners || {};
  }

  /**
   * Issues an event to be sent via postMessage.
   * @param {string} event - Event name.
   * @param {any} params - Event parameters.
   */
  issueEvent(event, params) {
    window.postMessage({action: 'puzzleEvent', event: {name: event, args: params}, web3d: this.id}, '*');
  }

  /**
   * Retrieves the canvas element of the 3D component.
   * @returns {HTMLCanvasElement} The canvas element.
   */
  getCanvas() {
    return window.Kc[this.id + '_canvas'];
  }

  /**
   * Retrieves the rendering engine instance.
   * @returns {Object} The engine instance.
   */
  getEngine() {
    return window.Kc[this.id + '_engine'];
  }

  /**
   * Retrieves the scene manager instance.
   * @returns {Object} The scene manager.
   */
  getSceneManager() {
    return window.Kc[this.id + '_sceneManager'];
  }

  /**
   * Retrieves the current active scene.
   * @returns {Object} The active scene.
   */
  getScene() {
    return window.Kc[this.id + '_scene'];
  }

  /**
   * Disposes all loaded scenes and cleans up resources.
   */
  disposeAllScene() {
    const _self = this;
    let sceneManager = _self.getSceneManager();
    if (sceneManager) {
      sceneManager.disposeAllScene();
      for (let scene of _self.scenes) {
        if (scene && scene.puzzleLogic) {
          try {
            scene.puzzleLogic.puzzleDispose();
          }
          catch (e) {
            console.error(e);
          }
          delete scene.puzzleLogic;
        }
      }
      if (window.scene === _self.scenes[0]) {
        window.scene = null;
      }
      _self.scenes = [];
      _self.options.sceneId = [];
      delete window.Kc[_self.id + '_scene'];
    }
  }

  /**
   * Loads scenes by their IDs.
   * @param {string|string[]} sceneId - The ID(s) of the scenes to load.
   */
  loadSceneById(sceneId) {
    const _self = this;
    _self.disposeAllScene();

    let sceneManager = _self.getSceneManager();
    let canvas = _self.getCanvas();

    if (typeof sceneId === 'string') {
      sceneId = [sceneId];
    }

    _self.options.sceneId = sceneId;

    clearInterval(_self.loadingTextTimer);
    _self.loadingTextTimer = setInterval(() => {
          _self._showLoadingText();
        },
        1000);
    _self.loadStartTime = new Date().getTime();

    window.updatePuzzleLogicCode = _self._updatePuzzleLogicCode;

    let scenes = [];
    let promises = [];

    for (let i = 0; i < sceneId.length; i++) {
      let uuid = sceneId[i];
      if (!uuid) {
        continue;
      }
      promises.push(new Promise((resolve, reject) => {
        try {
          sceneManager.getOrLoadScene(uuid,
              'root://' + uuid + '/', uuid + '.json', '',
              (res, firstTimeLoaded) => {
                let scene = res.subScene;
                scenes[i] = scene;
                scene.activeCamera.attachControl(canvas, true);

                if (firstTimeLoaded) {
                  scene.onPointerObservable.add((pointerInfo) => {
                    _self._pointHandler(pointerInfo);
                  });
                }

                const onSceneLoadedList = [];
                const evalPuzzleLogic = (containerId) => {
                  let logicOwner = containerId ? scene.getNodeById(containerId) : scene;
                  if (!logicOwner) {
                    return;
                  }

                  if (logicOwner.puzzleLogic && logicOwner.puzzleLogic.puzzleDispose) {
                    logicOwner.puzzleLogic.puzzleDispose();
                    logicOwner.puzzleLogic = null;
                  }

                  let logic = logicOwner.logicJS;
                  if (!logic) {
                    return true;
                  }
                  try {
                    logic = _self._updatePuzzleLogicCode(logic);
                    logic = logic.replace("__sceneId", uuid);
                    if (containerId) {
                      logic = logic.replace("__containerId", containerId);
                    }
                    eval(logic);
                    logicOwner.puzzleLogic = window.puzzleLogic;
                    delete window.puzzleLogic;
                    if (logicOwner.puzzleLogic) {
                      _self._registerContext(logicOwner);

                      if (logicOwner.puzzleLogic.onSceneLoaded) {
                        onSceneLoadedList.push(logicOwner.puzzleLogic.onSceneLoaded);
                      }
                    }
                    return true;
                  } catch (e) {
                    console.error([logic]);
                    console.error(e);
                  }
                }

                window.scene = scene;
                evalPuzzleLogic('');
                for (let c of scene.kContainers) {
                  evalPuzzleLogic(c.id);
                }
                setTimeout(() => {
                  for (let l of onSceneLoadedList) {
                    l(firstTimeLoaded);
                  }
                  resolve(res);
                }, 0);
              }, null, (e) => {
                console.error(e, uuid);
                resolve();
              }, i);
        } catch (e) {
          console.error(e, uuid);
          resolve();
        }
      }).catch(e => console.error(e, uuid)));
    }

    Promise.all(promises).then((allRes) => {
      for (let res of allRes) {
        if (res) {
          res.setRenderEnabled(true, 0.5);
        }
      }
      _self.scenes = scenes;
      if (scenes.length > 0) {
        let scene = scenes[0];
        window.scene = scenes[0]; // for debug;
        window.Kc[_self.id + '_scene'] = scenes[0];
        _self._afterSceneLoaded();
        if (_self.listeners.onLoad) {
          _self.listeners.onLoad(scene);
        }
      }
    }).catch(e => {
      console.error(e);
      _self.scenes = scenes;
      if (scenes.length > 0) {
        let scene = scenes[0];
        window.scene = scene; // for debug;
        _self._afterSceneLoaded();
        if (_self.listeners.onLoad) {
          _self.listeners.onLoad(scene);
        }
      }
    });
  }

  /**
   * Changes the active camera with a transition animation.
   * @param {string} cameraName - Name of the target camera.
   * @param {number} duration - Transition duration in seconds.
   */
  changeCamera(cameraName, duration = 1) {
    let currScene = this.scenes[0];
    if (currScene) {
      currScene.activeCamera.focusOn(cameraName, duration);
    }
  }

  /**
   * Retrieves the list of available cameras in the current scene.
   * @returns {Array} List of camera arguments.
   */
  getCameras() {
    if (this.scenes[0]) {
      return this.scenes[0].cameraArgsArray;
    } else {
      return [];
    }
  }

  /**
   * Retrieves loaded events from the current scene's puzzle logic.
   * @returns {Array} List of loaded events
   */
  loadEvents() {
    let scene = this.scenes[0];
    if (scene && scene.puzzleLogic) {
      return scene.puzzleLogic.loadEvents();
    } else {
      return [];
    }
  }

  /**
   * Registers custom file schemes for asset loading paths.
   * @private
   */
  _registerSchemes() {
    let rootPath;

    if (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) {
      const base = import.meta.env.BASE_URL.startsWith('http')
        ? import.meta.env.BASE_URL
        : new URL(import.meta.env.BASE_URL, window.location.origin).href;
      rootPath = new URL('static/', base).href;
    } else {
      let href = window.location.href;
      if (href.indexOf('#') > 0) {
        href = href.substring(0, href.indexOf('#'));
      }
      href = href.substring(0, href.lastIndexOf('/') + 1);
      rootPath = href + 'static/';
    }

    if (!rootPath.endsWith('/')) {
      rootPath += '/';
    }

    window.Kingfisher.FileTools.RegisterSchemes({
      'root://': rootPath + 'scenes/',
      'lib://': rootPath
    });
  }

  /**
   * Initializes the rendering engine and associates it with the provided canvas element.
   * @private
   * @param {HTMLElement} canvas - The canvas element to attach the engine to
   */
  _createEngine(canvas) {
    const _self = this;
    const id = _self.id;
    let global = window.Kc;

    window.Kingfisher.Runtime.Puzzle = window.Kingfisher.Runtime.PuzzleInterface;
    if (!_self.options.disableIndexDB) { // 默认开启IndexDB缓存
      window.Kingfisher.Database.IDBStorageEnabled = true;
    }

    canvas.oncontextmenu = function(e) {
      e.preventDefault();
      e.stopPropagation();
    };

    const engine = new window.Kingfisher.Engine(canvas, true);
    const sceneManager = new window.Kingfisher.SceneManager(engine);

    global[id + '_canvas'] = canvas;
    global[id + '_engine'] = engine;
    global[id + '_sceneManager'] = sceneManager;
    global[id + '_web3d'] = _self;

    const resizeHandler = () => {
      let scaling = _self._getHardwareScalingLevel(canvas.clientWidth * engine.zoom, canvas.clientHeight * engine.zoom, _self.options.limitWidth, _self.options.limitHeight);
      engine.setHardwareScalingLevel(scaling);
      engine.resize();
    }

    resizeHandler();
    _self.resizeObserver = new ResizeObserver(resizeHandler);
    _self.resizeObserver.observe(canvas);

    _self.handleMessage = _self._handleMessage.bind(_self);
    window.addEventListener('message', _self.handleMessage);

    _self._registerSchemes();
    _self._initLoading();

    // start engine loop
    engine.runRenderLoop(() => {
      try {
        if (_self.listeners.onRender) {
          try {
            _self.listeners.onRender(engine, sceneManager);
          } catch (e) {
            console.error(e, _self.id);
          }
        }
        sceneManager.rootScene.render();
      } catch (e) {
        console.error(e, _self.id);
      }
    });
  }

  /**
   * Handles pointer events (tap, double tap, etc.) for the 3D scene.
   * @private
   * @param {Object} pointerInfo - Pointer event information from Babylon.js
   */
  _pointHandler(pointerInfo) {
    let listeners = this.listeners;
    switch (pointerInfo.type) {
      case window.Kingfisher.PointerEventTypes.POINTERTAP:
        if (listeners.onTap) {
          listeners.onTap(pointerInfo);
        }
        break;
      case window.Kingfisher.PointerEventTypes.POINTERDOUBLETAP:
        if (listeners.onDoubleTap) {
          listeners.onDoubleTap(pointerInfo);
        }
        break;
      case window.Kingfisher.PointerEventTypes.POINTERDOWN:
        if (listeners.onPointerDown) {
          listeners.onPointerDown(pointerInfo);
        }
        break;
      case window.Kingfisher.PointerEventTypes.POINTERUP:
        if (listeners.onPointerUp) {
          listeners.onPointerUp(pointerInfo);
        }
        break;
      case window.Kingfisher.PointerEventTypes.POINTERMOVE:
        if (listeners.onPointerMove) {
          listeners.onPointerMove(pointerInfo);
        }
        break;
    }
  }

  /**
   * Calculates the hardware scaling level based on canvas dimensions and limits.
   * @private
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {number} limitWidth - Maximum allowed width
   * @param {number} limitHeight - Maximum allowed height
   * @returns {number} Calculated scaling level
   */
  _getHardwareScalingLevel(width, height, limitWidth, limitHeight) {
    let r = window.devicePixelRatio;
    width *= r;
    height *= r;
    const w = Math.max(16, Math.min(1920 * 2, limitWidth || width));
    const h = Math.max(16, Math.min(1080 * 2, limitHeight || height));
    if (width <= w && height <= h) {
      return 1 / r;
    }
    if (width / height > w / h) {
      return width / w / r;
    } else {
      return height / h / r;
    }
  }

  /**
   * Updates puzzle logic code to adapt to the current 3D component context.
   * @private
   * @param {string} code - Original puzzle logic code string
   * @returns {string} Modified puzzle logic code
   */
  _updatePuzzleLogicCode(code) {
    if (code.indexOf('let logic = {') == -1) {
      [
        'registerContext',
        'puzzleDispose',
        'fetchCallback',
        'invokeEvent',
        'onSceneLoaded'].forEach((s) => {
        code = code.replace('window.' + s, 'logic.' + s);
      });
      code = code.replace('let _pGlob = {disposed: false};',
          'let _pGlob = {disposed: false};\r\n    let logic = {_pGlob: _pGlob};');
      code = code.replace(/KingfisherPickListener/g,
          '_pGlob.kingfisherPickListener');
      code = code.replace('window.puzzleLogic =', 'let initLogic =');
      code = code.replace('window.scene.onPointerObservable',
          '_pGlob.scene.onPointerObservable');
      code = code.replace('call("registerContext")',
          'call("registerContext", newScene.subScene)');
      code = code.replace('registerContext(\'params\'',
          'logic.registerContext(\'params\'');
      code = code.replace('console.log("翠鸟拼图已经加载");',
          'console.log("翠鸟拼图已经加载");\r\n    window.puzzleLogic = logic;\r\n    return logic;');
      code = code.replace('window.puzzleLogic();',
          'window.puzzleLogic = initLogic(\'__sceneId\');');
      code = code.replace('eval(res);',
          'eval(window.updatePuzzleLogicCode(res));');
    }

    return code;
  }

  /**
   * Updates and displays loading progress text during scene loading.
   * @private
   */
  _showLoadingText() {
    let engine = this.getEngine();
    if (engine && engine.loadingScreen) {
      let loadingTime = new Date().getTime() - this.loadStartTime;
      let percentage = (loadingTime / 10).toFixed(2);
      if (percentage > 0.99) {
        percentage = 0.99;
      }
      engine.loadingScreen.updateProgress(Math.floor(percentage * 100));
    }
  }

  /**
   * Initializes loading screen configuration and appearance.
   * @private
   */
  _initLoading() {
    const _self = this;
    let canvas = _self.getCanvas();
    let engine = _self.getEngine();

    let loadingScreen = new window.Kingfisher.Runtime.LoadingScreenV2(canvas);
    loadingScreen.hideMiniLogo = true;
    if (_self.options.logo) {
      loadingScreen.customLogoSrc = _self.options.logo;
      loadingScreen.style = 'custom';
      if (_self.options.logoSize) {
        let size = _self.options.logoSize.split(',');
        if (size.length === 2) {
          loadingScreen.logoSize = {width: size[0], height: size[1]};
        }
      }
    }
    engine.loadingScreen = loadingScreen;
    loadingScreen.onHide = () => {
      if (_self.listeners.onLoadingHide) {
        _self.listeners.onLoadingHide(_self.scenes[0]);
      }
    };
  }

  /**
   * Executes post-loading operations after scene is fully loaded.
   * @private
   */
  _afterSceneLoaded() {
    const _self = this;
    if (_self.options.camera) {
      _self.changeCamera(_self.options.camera);
    }

    if (_self.options.puzzleEvent) {
      _self.issueEvent(_self.options.puzzleEvent);
    }
  }

  /**
   * Registers context objects for puzzle logic access.
   * @private
   * @param {Object} scene - The current active scene
   */
  _registerContext(scene) {
    let register = scene.puzzleLogic.registerContext;
    if (register) {
      register('contextPath', '');
      register('context', this);
      register('canvas', this.getCanvas());
      register('axios', Axios);
      register('kingfisher', window.Kingfisher);
    }
  }

  /**
   * Handles incoming messages from other window contexts.
   * @private
   * @param {Event} e - Message event object
   */
  _handleMessage(e) {
    if (typeof e.data == 'object') {
      let message = e.data;
      if (message.action === 'puzzleEvent' && message.event &&
          (!message.web3d || message.web3d === this.id)) {
        if (this.listeners.onEvent) {
          this.listeners.onEvent(message.event);
        }
      }
    }
  }

  /**
   * Destroys the 3D component and cleans up all associated resources.
   */
  destroy() {
    try {
      const _self = this;
      let id = _self.id;
      console.log('Destroying Kf 3D component', id);
      _self.isDisposed = true;
      _self.disposeAllScene();
      let engine = _self.getEngine();
      if (engine) {
        if (_self.loadingTextTimer) {
          clearInterval(_self.loadingTextTimer);
        }
        engine.dispose();
        console.log('Kf Engine has been destroyed', id);
        delete window.Kc[id + '_canvas'];
        delete window.Kc[id + '_engine'];
        delete window.Kc[id + '_scene'];
        delete window.Kc[id + '_sceneManager'];
        delete window.Kc[id + '_web3d'];

        window.removeEventListener('message', _self.handleMessage);
        _self.options = {};
        _self.listeners = {};
        _self.resizeObserver.disconnect();
        _self.resizeObserver = null;
        _self.handleMessage = null;
      }
      console.log('Kf 3D Component has been destroyed', id);
    } catch (e) {
      console.error(e);
    }
  }

  // deprecated

  loadSceneFromUrl(sceneId, loadListener) {
    return this.loadSceneById(sceneId, loadListener);
  }
}

// 导出到全局作用域
window.Web3dManager = Web3dManager;
