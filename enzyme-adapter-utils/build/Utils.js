'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRenderWrapper = exports.createMountWrapper = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.mapNativeEventNames = mapNativeEventNames;
exports.propFromEvent = propFromEvent;
exports.withSetStateAllowed = withSetStateAllowed;
exports.assertDomAvailable = assertDomAvailable;
exports.displayNameOfNode = displayNameOfNode;
exports.nodeTypeFromType = nodeTypeFromType;
exports.isArrayLike = isArrayLike;
exports.flatten = flatten;
exports.ensureKeyOrUndefined = ensureKeyOrUndefined;
exports.elementToTree = elementToTree;
exports.propsWithKeysAndRef = propsWithKeysAndRef;
exports.simulateError = simulateError;

var _object = require('object.assign');

var _object2 = _interopRequireDefault(_object);

var _functionPrototype = require('function.prototype.name');

var _functionPrototype2 = _interopRequireDefault(_functionPrototype);

var _createMountWrapper = require('./createMountWrapper');

var _createMountWrapper2 = _interopRequireDefault(_createMountWrapper);

var _createRenderWrapper = require('./createRenderWrapper');

var _createRenderWrapper2 = _interopRequireDefault(_createRenderWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports.createMountWrapper = _createMountWrapper2['default'];
exports.createRenderWrapper = _createRenderWrapper2['default'];
function mapNativeEventNames(event) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$animation = _ref.animation,
      animation = _ref$animation === undefined ? false : _ref$animation,
      _ref$pointerEvents = _ref.pointerEvents,
      pointerEvents = _ref$pointerEvents === undefined ? false : _ref$pointerEvents,
      _ref$auxClick = _ref.auxClick,
      auxClick = _ref$auxClick === undefined ? false : _ref$auxClick;

  var nativeToReactEventMap = (0, _object2['default'])({
    compositionend: 'compositionEnd',
    compositionstart: 'compositionStart',
    compositionupdate: 'compositionUpdate',
    keydown: 'keyDown',
    keyup: 'keyUp',
    keypress: 'keyPress',
    contextmenu: 'contextMenu',
    dblclick: 'doubleClick',
    doubleclick: 'doubleClick', // kept for legacy. TODO: remove with next major.
    dragend: 'dragEnd',
    dragenter: 'dragEnter',
    dragexist: 'dragExit',
    dragleave: 'dragLeave',
    dragover: 'dragOver',
    dragstart: 'dragStart',
    mousedown: 'mouseDown',
    mousemove: 'mouseMove',
    mouseout: 'mouseOut',
    mouseover: 'mouseOver',
    mouseup: 'mouseUp',
    touchcancel: 'touchCancel',
    touchend: 'touchEnd',
    touchmove: 'touchMove',
    touchstart: 'touchStart',
    canplay: 'canPlay',
    canplaythrough: 'canPlayThrough',
    durationchange: 'durationChange',
    loadeddata: 'loadedData',
    loadedmetadata: 'loadedMetadata',
    loadstart: 'loadStart',
    ratechange: 'rateChange',
    timeupdate: 'timeUpdate',
    volumechange: 'volumeChange',
    beforeinput: 'beforeInput',
    mouseenter: 'mouseEnter',
    mouseleave: 'mouseLeave',
    transitionend: 'transitionEnd'
  }, animation && {
    animationstart: 'animationStart',
    animationiteration: 'animationIteration',
    animationend: 'animationEnd'
  }, pointerEvents && {
    pointerdown: 'pointerDown',
    pointermove: 'pointerMove',
    pointerup: 'pointerUp',
    pointercancel: 'pointerCancel',
    gotpointercapture: 'gotPointerCapture',
    lostpointercapture: 'lostPointerCapture',
    pointerenter: 'pointerEnter',
    pointerleave: 'pointerLeave',
    pointerover: 'pointerOver',
    pointerout: 'pointerOut'
  }, auxClick && {
    auxclick: 'auxClick'
  });

  return nativeToReactEventMap[event] || event;
}

// 'click' => 'onClick'
// 'mouseEnter' => 'onMouseEnter'
function propFromEvent(event) {
  var eventOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var nativeEvent = mapNativeEventNames(event, eventOptions);
  return 'on' + String(nativeEvent[0].toUpperCase()) + String(nativeEvent.slice(1));
}

function withSetStateAllowed(fn) {
  // NOTE(lmr):
  // this is currently here to circumvent a React bug where `setState()` is
  // not allowed without global being defined.
  var cleanup = false;
  if (typeof global.document === 'undefined') {
    cleanup = true;
    global.document = {};
  }
  var result = fn();
  if (cleanup) {
    // This works around a bug in node/jest in that developers aren't able to
    // delete things from global when running in a node vm.
    global.document = undefined;
    delete global.document;
  }
  return result;
}

function assertDomAvailable(feature) {
  if (!global || !global.document || !global.document.createElement) {
    throw new Error('Enzyme\'s ' + String(feature) + ' expects a DOM environment to be loaded, but found none');
  }
}

function displayNameOfNode(node) {
  if (!node) return null;

  var type = node.type;


  if (!type) return null;

  return type.displayName || (typeof type === 'function' ? (0, _functionPrototype2['default'])(type) : type.name || type);
}

function nodeTypeFromType(type) {
  if (typeof type === 'string') {
    return 'host';
  }
  if (type && type.prototype && type.prototype.isReactComponent) {
    return 'class';
  }
  return 'function';
}

function getIteratorFn(obj) {
  var iteratorFn = obj && (typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol' && obj[Symbol.iterator] || obj['@@iterator']);

  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }

  return undefined;
}

function isIterable(obj) {
  return !!getIteratorFn(obj);
}

function isArrayLike(obj) {
  return Array.isArray(obj) || typeof obj !== 'string' && isIterable(obj);
}

function flatten(arrs) {
  // optimize for the most common case
  if (Array.isArray(arrs)) {
    return arrs.reduce(function (flatArrs, item) {
      return flatArrs.concat(isArrayLike(item) ? flatten(item) : item);
    }, []);
  }

  // fallback for arbitrary iterable children
  var flatArrs = [];

  var iteratorFn = getIteratorFn(arrs);
  var iterator = iteratorFn.call(arrs);

  var step = iterator.next();

  while (!step.done) {
    var item = step.value;
    var flatItem = void 0;

    if (isArrayLike(item)) {
      flatItem = flatten(item);
    } else {
      flatItem = item;
    }

    flatArrs = flatArrs.concat(flatItem);

    step = iterator.next();
  }

  return flatArrs;
}

function ensureKeyOrUndefined(key) {
  return key || (key === '' ? '' : undefined);
}

function elementToTree(el) {
  var recurse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : elementToTree;

  if (typeof recurse !== 'function' && arguments.length === 3) {
    // special case for backwards compat for `.map(elementToTree)`
    recurse = elementToTree; // eslint-disable-line no-param-reassign
  }
  if (el === null || (typeof el === 'undefined' ? 'undefined' : _typeof(el)) !== 'object' || !('type' in el)) {
    return el;
  }
  var type = el.type,
      props = el.props,
      key = el.key,
      ref = el.ref;
  var children = props.children;

  var rendered = null;
  if (isArrayLike(children)) {
    rendered = flatten(children).map(function (x) {
      return recurse(x);
    });
  } else if (typeof children !== 'undefined') {
    rendered = recurse(children);
  }

  var nodeType = nodeTypeFromType(type);

  if (nodeType === 'host' && props.dangerouslySetInnerHTML) {
    if (props.children != null) {
      var error = new Error('Can only set one of `children` or `props.dangerouslySetInnerHTML`.');
      error.name = 'Invariant Violation';
      throw error;
    }
  }

  return {
    nodeType: nodeType,
    type: type,
    props: props,
    key: ensureKeyOrUndefined(key),
    ref: ref,
    instance: null,
    rendered: rendered
  };
}

function propsWithKeysAndRef(node) {
  if (node.ref !== null || node.key !== null) {
    return (0, _object2['default'])({}, node.props, {
      key: node.key,
      ref: node.ref
    });
  }
  return node.props;
}

function getComponentStack(hierarchy) {
  var getNodeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nodeTypeFromType;
  var getDisplayName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : displayNameOfNode;

  var tuples = hierarchy.map(function (x) {
    return [getNodeType(x.type), getDisplayName(x)];
  }).concat([['class', 'WrapperComponent']]);

  return tuples.map(function (_ref2, i, arr) {
    var _ref3 = _slicedToArray(_ref2, 2),
        name = _ref3[1];

    var _ref4 = arr.slice(i + 1).find(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 1),
          nodeType = _ref7[0];

      return nodeType !== 'host';
    }) || [],
        _ref5 = _slicedToArray(_ref4, 2),
        closestComponent = _ref5[1];

    return '\n    in ' + String(name) + (closestComponent ? ' (created by ' + String(closestComponent) + ')' : '');
  }).join('');
}

function simulateError(error, catchingInstance, rootNode, hierarchy) {
  var getNodeType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : nodeTypeFromType;
  var getDisplayName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : displayNameOfNode;

  var nodeType = getNodeType(rootNode.type);
  if (nodeType !== 'class') {
    throw new TypeError('simulateError() can only be called on class components with an instance');
  }

  var _ref8 = catchingInstance || {},
      componentDidCatch = _ref8.componentDidCatch;

  if (!componentDidCatch) {
    throw error;
  }

  var componentStack = getComponentStack(hierarchy, getNodeType, getDisplayName);

  componentDidCatch.call(catchingInstance, error, { componentStack: componentStack });
}