var GraphBuilder = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/@basementuniverse/animation/build/index.js
  var require_build = __commonJS({
    "node_modules/@basementuniverse/animation/build/index.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define([], factory);
        else {
          var a = factory();
          for (var i in a) (typeof exports === "object" ? exports : root)[i] = a[i];
        }
      })(self, () => {
        return (
          /******/
          (() => {
            var __webpack_modules__ = {
              /***/
              "./index.ts": (
                /*!******************!*\
                  !*** ./index.ts ***!
                  \******************/
                /***/
                ((__unused_webpack_module, exports, __webpack_require__) => {
                  "use strict";
                  eval(`{
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.catmullRomPath = exports.bezierPath = exports.EasingFunctions = exports.AnimationTimeline = exports.AnimationTimelineMode = exports.MultiAnimation = exports.Animation = exports.MarkerDirection = exports.RepeatMode = exports.AnimationMode = void 0;
const utils_1 = __webpack_require__(/*! @basementuniverse/utils */ "./node_modules/@basementuniverse/utils/utils.js");
const vec_1 = __webpack_require__(/*! @basementuniverse/vec */ "./node_modules/@basementuniverse/vec/vec.js");
function isNumber(value) {
    return typeof value === 'number';
}
function isVec2(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'x' in value &&
        'y' in value &&
        typeof value.x === 'number' &&
        typeof value.y === 'number');
}
function isVec3(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'x' in value &&
        'y' in value &&
        'z' in value &&
        typeof value.x === 'number' &&
        typeof value.y === 'number' &&
        typeof value.z === 'number');
}
function isColor(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'r' in value &&
        'g' in value &&
        'b' in value &&
        typeof value.r === 'number' &&
        typeof value.g === 'number' &&
        typeof value.b === 'number' &&
        (typeof value.a === 'undefined' || typeof value.a === 'number'));
}
// -----------------------------------------------------------------------------
// Animation options
// -----------------------------------------------------------------------------
var AnimationMode;
(function (AnimationMode) {
    /**
     * Animation starts automatically when created
     */
    AnimationMode["Auto"] = "auto";
    /**
     * Animation starts when triggered manually by calling the \`start\` method
     */
    AnimationMode["Trigger"] = "trigger";
    /**
     * Animation plays while triggered, and reverses when not triggered
     */
    AnimationMode["Hold"] = "hold";
    /**
     * Animation is controlled manually by setting the progress
     */
    AnimationMode["Manual"] = "manual";
})(AnimationMode = exports.AnimationMode || (exports.AnimationMode = {}));
var RepeatMode;
(function (RepeatMode) {
    /**
     * Animation will play once and then stop
     */
    RepeatMode["Once"] = "once";
    /**
     * Animation will loop indefinitely
     */
    RepeatMode["Loop"] = "loop";
    /**
     * Animation will play forward and then reverse, repeating indefinitely
     */
    RepeatMode["PingPong"] = "pingpong";
})(RepeatMode = exports.RepeatMode || (exports.RepeatMode = {}));
var MarkerDirection;
(function (MarkerDirection) {
    /**
     * Marker fires when animation plays forward through it
     */
    MarkerDirection["Forward"] = "forward";
    /**
     * Marker fires when animation plays backward through it
     */
    MarkerDirection["Backward"] = "backward";
    /**
     * Marker fires when animation plays through it in either direction
     */
    MarkerDirection["Both"] = "both";
})(MarkerDirection = exports.MarkerDirection || (exports.MarkerDirection = {}));
// -----------------------------------------------------------------------------
// Animation class
// -----------------------------------------------------------------------------
class Animation {
    constructor(options) {
        this.time = 0;
        this.hasCalledFinishedCallback = false;
        this.previousProgress = 0;
        this.firedMarkersThisLoop = new Set();
        this.firedMarkersGlobal = new Set();
        this.progress = 0;
        this.running = false;
        this.holding = false;
        this.direction = 1; // 1 = forward, -1 = backward
        this.repeatCount = 0; // Number of completed repeats
        this.finished = false;
        this.options = {
            ...Animation.DEFAULT_OPTIONS,
            ...options,
        };
        this.interpolationFunction = this.getInterpolationFunction();
        this.actualValue = options.initialValue;
        this.direction = 1;
        this.repeatCount = 0;
        this.finished = false;
        if (this.options.mode === AnimationMode.Auto) {
            this.start();
        }
    }
    getInterpolationFunction() {
        // A custom interpolation function has been provided, so use this directly
        if (typeof this.options.interpolationFunction === 'function') {
            return this.options.interpolationFunction;
        }
        // Otherwise, look up the easing function by name (defaulting to 'linear')
        const easingFunction = (this.options.interpolationFunction
            ? exports.EasingFunctions[this.options.interpolationFunction]
            : exports.EasingFunctions.linear) || exports.EasingFunctions.linear;
        // Return a new interpolation function that uses the easing function
        return (a, b, i) => {
            const easedProgress = easingFunction(i, ...(this.options.interpolationFunctionParameters || []));
            if (isNumber(a) && isNumber(b)) {
                return (a + (b - a) * easedProgress);
            }
            if (isVec2(a) && isVec2(b)) {
                const vecA = a;
                const vecB = b;
                return {
                    x: vecA.x + (vecB.x - vecA.x) * easedProgress,
                    y: vecA.y + (vecB.y - vecA.y) * easedProgress,
                };
            }
            if (isVec3(a) && isVec3(b)) {
                const vecA = a;
                const vecB = b;
                return {
                    x: vecA.x + (vecB.x - vecA.x) * easedProgress,
                    y: vecA.y + (vecB.y - vecA.y) * easedProgress,
                    z: vecA.z + (vecB.z - vecA.z) * easedProgress,
                };
            }
            if (isColor(a) && isColor(b)) {
                const colorA = a;
                const colorB = b;
                return {
                    r: colorA.r + (colorB.r - colorA.r) * easedProgress,
                    g: colorA.g + (colorB.g - colorA.g) * easedProgress,
                    b: colorA.b + (colorB.b - colorA.b) * easedProgress,
                    a: (colorA.a || 1) +
                        ((colorB.a || 1) - (colorA.a || 1)) * easedProgress,
                };
            }
            throw new Error('Unsupported animatable value type');
        };
    }
    get current() {
        return this.actualValue;
    }
    get markers() {
        return this.options.markers;
    }
    get animationOptions() {
        return this.options;
    }
    checkMarkers() {
        var _a, _b, _c, _d;
        if (!this.options.markers || this.options.markers.length === 0) {
            return;
        }
        const duration = Math.max(1e-8, this.options.duration || 1);
        // Convert marker positions to progress and check for crossings
        for (let i = 0; i < this.options.markers.length; i++) {
            const marker = this.options.markers[i];
            // Calculate marker progress (prefer time over progress)
            let markerProgress;
            if (marker.time !== undefined) {
                markerProgress = (0, utils_1.clamp)(marker.time / duration, 0, 1);
            }
            else if (marker.progress !== undefined) {
                markerProgress = marker.progress;
            }
            else {
                continue; // Skip markers without time or progress
            }
            // Check if marker should fire based on global flag
            if (marker.global && this.firedMarkersGlobal.has(i)) {
                continue;
            }
            // Check if marker should fire based on once flag
            if (marker.once && this.firedMarkersThisLoop.has(i)) {
                continue;
            }
            // Check direction
            const direction = marker.direction || MarkerDirection.Both;
            const crossedForward = this.previousProgress < markerProgress &&
                this.progress >= markerProgress &&
                Math.abs(this.progress - markerProgress) < 1e-6;
            const crossedBackward = this.previousProgress > markerProgress &&
                this.progress <= markerProgress &&
                Math.abs(this.progress - markerProgress) < 1e-6;
            let shouldFire = false;
            if (direction === MarkerDirection.Both) {
                shouldFire = crossedForward || crossedBackward;
            }
            else if (direction === MarkerDirection.Forward) {
                shouldFire = crossedForward && this.direction === 1;
            }
            else if (direction === MarkerDirection.Backward) {
                shouldFire = crossedBackward && this.direction === -1;
            }
            if (shouldFire) {
                // Mark as fired
                if (marker.once) {
                    this.firedMarkersThisLoop.add(i);
                }
                if (marker.global) {
                    this.firedMarkersGlobal.add(i);
                }
                // Fire callback
                marker.callback(marker);
                (_b = (_a = this.options).onMarkerReached) === null || _b === void 0 ? void 0 : _b.call(_a, marker);
            }
        }
        // Also check for any markers we might have skipped over due to large dt
        for (let i = 0; i < this.options.markers.length; i++) {
            const marker = this.options.markers[i];
            // Calculate marker progress
            let markerProgress;
            if (marker.time !== undefined) {
                markerProgress = (0, utils_1.clamp)(marker.time / duration, 0, 1);
            }
            else if (marker.progress !== undefined) {
                markerProgress = marker.progress;
            }
            else {
                continue;
            }
            // Check if we skipped over this marker
            const skippedForward = this.previousProgress < markerProgress &&
                this.progress > markerProgress &&
                Math.abs(this.progress - markerProgress) >= 1e-6;
            const skippedBackward = this.previousProgress > markerProgress &&
                this.progress < markerProgress &&
                Math.abs(this.progress - markerProgress) >= 1e-6;
            // Check if marker should fire based on flags
            if (marker.global && this.firedMarkersGlobal.has(i)) {
                continue;
            }
            if (marker.once && this.firedMarkersThisLoop.has(i)) {
                continue;
            }
            const direction = marker.direction || MarkerDirection.Both;
            let shouldFire = false;
            if (direction === MarkerDirection.Both) {
                shouldFire = skippedForward || skippedBackward;
            }
            else if (direction === MarkerDirection.Forward) {
                shouldFire = skippedForward && this.direction === 1;
            }
            else if (direction === MarkerDirection.Backward) {
                shouldFire = skippedBackward && this.direction === -1;
            }
            if (shouldFire) {
                if (marker.once) {
                    this.firedMarkersThisLoop.add(i);
                }
                if (marker.global) {
                    this.firedMarkersGlobal.add(i);
                }
                marker.callback(marker);
                (_d = (_c = this.options).onMarkerReached) === null || _d === void 0 ? void 0 : _d.call(_c, marker);
            }
        }
    }
    start() {
        this.running = true;
    }
    stop() {
        this.running = false;
    }
    reset() {
        this.time = 0;
        this.progress = 0;
        this.previousProgress = 0;
        this.actualValue = this.options.initialValue;
        this.running = false;
        this.repeatCount = 0;
        this.direction = 1;
        this.finished = false;
        this.hasCalledFinishedCallback = false;
        this.firedMarkersThisLoop.clear();
        this.firedMarkersGlobal.clear();
        if (this.options.mode === AnimationMode.Auto) {
            this.start();
        }
    }
    update(dt) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (![AnimationMode.Hold, AnimationMode.Manual].includes(this.options.mode) &&
            (!this.running || this.finished)) {
            return;
        }
        // Handle delay
        const delay = this.options.delay || 0;
        if (this.time < delay) {
            this.time += dt;
            if (this.time < delay) {
                return;
            }
            // If just passed the delay period, adjust dt to only use the leftover
            dt = this.time - delay;
            this.time = delay;
        }
        // Hold mode: if not running, reverse direction toward 0
        if (this.options.mode === AnimationMode.Hold) {
            this.running = true;
            if (this.holding) {
                this.direction = 1;
            }
            else {
                this.direction = -1;
                // If already at 0, do nothing
                if (this.progress <= 0) {
                    this.reset();
                    return;
                }
                // Always "run" when returning to 0
                // (so update continues until progress=0)
            }
        }
        // Calculate effective duration
        const duration = Math.max(1e-8, this.options.duration || 1);
        let progressDelta = (dt / duration) * this.direction;
        // Update progress
        let newProgress = this.options.mode === AnimationMode.Manual
            ? this.progress
            : this.progress + progressDelta;
        // Handle repeat modes
        const repeat = this.options.mode === AnimationMode.Hold
            ? RepeatMode.Once
            : this.options.repeat || RepeatMode.Once;
        const repeats = this.options.repeats || 0;
        let completed = false;
        if (repeat === RepeatMode.Once) {
            if (this.direction === 1 && newProgress >= 1) {
                newProgress = 1;
                completed = true;
            }
            else if (this.direction === -1 && newProgress <= 0) {
                newProgress = 0;
                completed = true;
            }
        }
        else if (repeat === RepeatMode.Loop) {
            if (this.direction === 1 && newProgress >= 1) {
                this.repeatCount++;
                this.firedMarkersThisLoop.clear(); // Clear loop markers on repeat
                (_b = (_a = this.options).onRepeat) === null || _b === void 0 ? void 0 : _b.call(_a, this.repeatCount);
                if (repeats > 0 && this.repeatCount >= repeats) {
                    newProgress = 1;
                    completed = true;
                }
                else {
                    newProgress = newProgress % 1;
                }
            }
            else if (this.direction === -1 && newProgress <= 0) {
                this.repeatCount++;
                this.firedMarkersThisLoop.clear(); // Clear loop markers on repeat
                (_d = (_c = this.options).onRepeat) === null || _d === void 0 ? void 0 : _d.call(_c, this.repeatCount);
                if (repeats > 0 && this.repeatCount >= repeats) {
                    newProgress = 0;
                    completed = true;
                }
                else {
                    newProgress = 1 + (newProgress % 1);
                }
            }
        }
        else if (repeat === RepeatMode.PingPong) {
            if (this.direction === 1 && newProgress >= 1) {
                this.direction = -1;
                this.repeatCount++;
                this.firedMarkersThisLoop.clear(); // Clear loop markers on repeat
                (_f = (_e = this.options).onRepeat) === null || _f === void 0 ? void 0 : _f.call(_e, this.repeatCount);
                if (repeats > 0 && this.repeatCount >= repeats) {
                    newProgress = 1;
                    completed = true;
                }
                else {
                    newProgress = 2 - newProgress; // reflect over 1
                }
            }
            else if (this.direction === -1 && newProgress <= 0) {
                this.direction = 1;
                this.repeatCount++;
                this.firedMarkersThisLoop.clear(); // Clear loop markers on repeat
                (_h = (_g = this.options).onRepeat) === null || _h === void 0 ? void 0 : _h.call(_g, this.repeatCount);
                if (repeats > 0 && this.repeatCount >= repeats) {
                    newProgress = 0;
                    completed = true;
                }
                else {
                    newProgress = -newProgress; // reflect over 0
                }
            }
        }
        // Clamp progress if needed
        if (this.options.clamp !== false) {
            newProgress = (0, utils_1.clamp)(newProgress, 0, 1);
        }
        // Track if we moved away from progress=1 to reset the finished callback flag
        if (this.progress !== 1 && this.hasCalledFinishedCallback) {
            this.hasCalledFinishedCallback = false;
        }
        this.progress = newProgress;
        // Check markers
        this.checkMarkers();
        // Update previousProgress for next frame
        this.previousProgress = this.progress;
        // Compute value (handle stops/keyframes)
        let value;
        const stops = this.options.stops;
        if (stops && stops.length > 0) {
            // Find the two stops surrounding progress
            let prev = { progress: 0, value: this.options.initialValue };
            let next = { progress: 1, value: this.options.targetValue };
            let reachedStopIndex = -1;
            for (let i = 0; i < stops.length; i++) {
                if (stops[i].progress <= this.progress) {
                    prev = stops[i];
                    if (Math.abs(stops[i].progress - this.progress) < 1e-6) {
                        reachedStopIndex = i;
                    }
                }
                if (stops[i].progress >= this.progress) {
                    next = stops[i];
                    if (Math.abs(stops[i].progress - this.progress) < 1e-6) {
                        reachedStopIndex = i;
                    }
                    break;
                }
            }
            // Check for stops at exact progress values (0 and 1)
            if (Math.abs(this.progress - 0) < 1e-6) {
                const zeroStop = stops.find(s => Math.abs(s.progress - 0) < 1e-6);
                if (zeroStop)
                    reachedStopIndex = stops.indexOf(zeroStop);
            }
            else if (Math.abs(this.progress - 1) < 1e-6) {
                const oneStop = stops.find(s => Math.abs(s.progress - 1) < 1e-6);
                if (oneStop)
                    reachedStopIndex = stops.indexOf(oneStop);
            }
            // Call onStopReached callback if we hit a stop
            if (reachedStopIndex >= 0) {
                (_k = (_j = this.options).onStopReached) === null || _k === void 0 ? void 0 : _k.call(_j, reachedStopIndex);
            }
            // If progress is before first stop
            if (this.progress <= prev.progress) {
                value = prev.value;
            }
            else if (this.progress >= next.progress) {
                value = next.value;
            }
            else {
                // Interpolate between prev and next
                value = this.interpolationFunction(prev.value, next.value, (this.progress - prev.progress) / (next.progress - prev.progress));
            }
        }
        else {
            // Simple interpolation between initial and target
            value = this.interpolationFunction(this.options.initialValue, this.options.targetValue, this.progress);
        }
        // Apply easeAmount (exponential smoothing)
        if (this.options.easeAmount && this.options.easeAmount > 0) {
            const ease = (0, utils_1.clamp)(this.options.easeAmount, 0, 1);
            // Blend previous value and new value
            if (isNumber(value) && isNumber(this.actualValue)) {
                value = ((1 - ease) * value + ease * this.actualValue);
            }
            else if (isVec2(value) && isVec2(this.actualValue)) {
                value = {
                    x: (1 - ease) * value.x + ease * this.actualValue.x,
                    y: (1 - ease) * value.y + ease * this.actualValue.y,
                };
            }
            else if (isVec3(value) && isVec3(this.actualValue)) {
                value = {
                    x: (1 - ease) * value.x + ease * this.actualValue.x,
                    y: (1 - ease) * value.y + ease * this.actualValue.y,
                    z: (1 - ease) * value.z + ease * this.actualValue.z,
                };
            }
            else if (isColor(value) && isColor(this.actualValue)) {
                value = {
                    r: (1 - ease) * value.r + ease * this.actualValue.r,
                    g: (1 - ease) * value.g + ease * this.actualValue.g,
                    b: (1 - ease) * value.b + ease * this.actualValue.b,
                    a: (1 - ease) * ((_l = value.a) !== null && _l !== void 0 ? _l : 1) +
                        ease * ((_m = this.actualValue.a) !== null && _m !== void 0 ? _m : 1),
                };
            }
        }
        // Apply rounding if needed
        if (this.options.round) {
            if (typeof this.options.round === 'function') {
                value = this.options.round(value);
            }
            else if (this.options.round === true) {
                if (isNumber(value)) {
                    value = Math.round(value);
                }
                else if (isVec2(value)) {
                    value = vec_1.vec2.map(value, Math.round);
                }
                else if (isVec3(value)) {
                    value = vec_1.vec3.map(value, Math.round);
                }
                else if (isColor(value)) {
                    value = {
                        r: Math.round(value.r),
                        g: Math.round(value.g),
                        b: Math.round(value.b),
                        a: value.a !== undefined ? Math.round(value.a) : undefined,
                    };
                }
            }
        }
        this.actualValue = value;
        // If animation is completed, stop it
        if (completed) {
            this.running = false;
            this.finished = true;
            if (!this.hasCalledFinishedCallback) {
                (_p = (_o = this.options).onFinished) === null || _p === void 0 ? void 0 : _p.call(_o);
                this.hasCalledFinishedCallback = true;
            }
        }
    }
}
exports.Animation = Animation;
Animation.DEFAULT_OPTIONS = {
    mode: AnimationMode.Auto,
    repeat: RepeatMode.Once,
    repeats: 0,
    duration: 1,
    delay: 0,
    clamp: true,
    round: false,
    easeAmount: 0,
    interpolationFunction: 'linear',
    interpolationFunctionParameters: [],
};
// -----------------------------------------------------------------------------
// MultiAnimation class
// -----------------------------------------------------------------------------
class MultiAnimation {
    get holding() {
        return Object.values(this.animations).some(animation => animation === null || animation === void 0 ? void 0 : animation.holding);
    }
    set holding(value) {
        for (const key in this.animations) {
            if (this.animations[key]) {
                this.animations[key].holding = value;
            }
        }
    }
    set progress(value) {
        for (const key in this.animations) {
            if (this.animations[key]) {
                this.animations[key].progress = value;
            }
        }
        this.updateCurrent();
    }
    constructor(options) {
        this.animations = {};
        this._current = {};
        const { _default, ...rest } = options;
        const restTyped = rest;
        for (const key in restTyped) {
            if (Object.prototype.hasOwnProperty.call(restTyped, key)) {
                this.animations[key] = new Animation({
                    ...(_default || {}),
                    ...restTyped[key],
                });
            }
        }
        this.updateCurrent();
    }
    updateCurrent() {
        for (const key in this.animations) {
            if (this.animations[key]) {
                this._current[key] = this.animations[key].current;
            }
        }
    }
    get current() {
        this.updateCurrent();
        return this._current;
    }
    start() {
        var _a;
        for (const key in this.animations) {
            (_a = this.animations[key]) === null || _a === void 0 ? void 0 : _a.start();
        }
    }
    stop() {
        var _a;
        for (const key in this.animations) {
            (_a = this.animations[key]) === null || _a === void 0 ? void 0 : _a.stop();
        }
    }
    reset() {
        var _a;
        for (const key in this.animations) {
            (_a = this.animations[key]) === null || _a === void 0 ? void 0 : _a.reset();
        }
        this.updateCurrent();
    }
    update(dt) {
        var _a;
        for (const key in this.animations) {
            (_a = this.animations[key]) === null || _a === void 0 ? void 0 : _a.update(dt);
        }
        this.updateCurrent();
    }
}
exports.MultiAnimation = MultiAnimation;
// -----------------------------------------------------------------------------
// AnimationTimeline types & options
// -----------------------------------------------------------------------------
var AnimationTimelineMode;
(function (AnimationTimelineMode) {
    /**
     * Timeline starts automatically when created
     */
    AnimationTimelineMode["Auto"] = "auto";
    /**
     * Timeline starts when triggered manually by calling the \`start\` method
     */
    AnimationTimelineMode["Trigger"] = "trigger";
    /**
     * Timeline is controlled manually by setting the progress or globalTime
     */
    AnimationTimelineMode["Manual"] = "manual";
})(AnimationTimelineMode = exports.AnimationTimelineMode || (exports.AnimationTimelineMode = {}));
// -----------------------------------------------------------------------------
// AnimationTimeline class
// -----------------------------------------------------------------------------
class AnimationTimeline {
    constructor(options = {}) {
        this.tracks = [];
        this.activeTrackIndices = new Set();
        this.hasCalledFinishedCallback = false;
        this.globalTime = 0;
        this.running = false;
        this.finished = false;
        this.options = {
            ...AnimationTimeline.DEFAULT_OPTIONS,
            ...options,
        };
        if (this.options.mode === AnimationTimelineMode.Auto) {
            this.start();
        }
    }
    /**
     * Get the total duration of the timeline
     */
    get duration() {
        var _a, _b, _c;
        if (this.options.durationMode === 'relative' && this.options.duration) {
            return this.options.duration;
        }
        // Calculate duration from tracks in absolute mode
        let maxEnd = 0;
        for (const track of this.tracks) {
            const animDuration = (_b = (_a = track.animation.options) === null || _a === void 0 ? void 0 : _a.duration) !== null && _b !== void 0 ? _b : 0;
            const end = (_c = track.end) !== null && _c !== void 0 ? _c : track.start + animDuration;
            maxEnd = Math.max(maxEnd, end);
        }
        return maxEnd;
    }
    /**
     * Get normalized progress (0-1)
     */
    get progress() {
        const duration = this.duration;
        return duration > 0 ? (0, utils_1.clamp)(this.globalTime / duration, 0, 1) : 0;
    }
    /**
     * Set normalized progress (0-1)
     */
    set progress(value) {
        this.globalTime = value * this.duration;
        this.updateTracksAtTime(0); // Update with dt=0 to recompute values
    }
    /**
     * Add an animation track to the timeline
     */
    addAnimation(animation, start, end, label) {
        this.tracks.push({
            animation,
            label,
            start,
            end,
        });
    }
    /**
     * Add a multi-animation track to the timeline
     */
    addMultiAnimation(animation, start, end, label) {
        this.tracks.push({
            animation,
            label,
            start,
            end,
        });
    }
    /**
     * Get all tracks with a specific label
     */
    getTracksByLabel(label) {
        return this.tracks.filter(track => track.label === label);
    }
    /**
     * Get current values from all active tracks
     */
    get current() {
        const result = {};
        for (const index of this.activeTrackIndices) {
            const track = this.tracks[index];
            if (track.label) {
                result[track.label] = track.animation.current;
            }
        }
        return result;
    }
    start() {
        this.running = true;
    }
    stop() {
        this.running = false;
    }
    reset() {
        this.globalTime = 0;
        this.running = false;
        this.finished = false;
        this.hasCalledFinishedCallback = false;
        this.activeTrackIndices.clear();
        // Reset all tracks
        for (const track of this.tracks) {
            track.animation.reset();
            track.animation.stop();
        }
        if (this.options.mode === AnimationTimelineMode.Auto) {
            this.start();
        }
    }
    /**
     * Seek to a specific time in the timeline
     */
    seek(time) {
        const previousTime = this.globalTime;
        this.globalTime = time;
        // Reset all tracks and replay up to this point
        for (const track of this.tracks) {
            track.animation.reset();
            track.animation.stop();
        }
        this.activeTrackIndices.clear();
        // Update to current time
        this.updateTracksAtTime(time - previousTime);
    }
    /**
     * Seek to a normalized progress value (0-1)
     */
    seekToProgress(progress) {
        this.seek(progress * this.duration);
    }
    updateTracksAtTime(dt) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const duration = this.duration;
        const durationMode = this.options.durationMode || 'absolute';
        for (let i = 0; i < this.tracks.length; i++) {
            const track = this.tracks[i];
            // Convert track times based on mode
            let trackStart;
            let trackEnd;
            if (durationMode === 'relative') {
                trackStart = track.start * duration;
                trackEnd =
                    track.end !== undefined
                        ? track.end * duration
                        : trackStart + ((_b = (_a = track.animation.options) === null || _a === void 0 ? void 0 : _a.duration) !== null && _b !== void 0 ? _b : 0);
            }
            else {
                trackStart = track.start;
                trackEnd =
                    track.end !== undefined
                        ? track.end
                        : trackStart + ((_d = (_c = track.animation.options) === null || _c === void 0 ? void 0 : _c.duration) !== null && _d !== void 0 ? _d : 0);
            }
            const wasActive = this.activeTrackIndices.has(i);
            const isActive = this.globalTime >= trackStart && this.globalTime <= trackEnd;
            // Track started
            if (isActive && !wasActive) {
                this.activeTrackIndices.add(i);
                track.animation.reset();
                // Set up marker callback forwarding if this is an Animation
                if (track.animation instanceof Animation) {
                    const animation = track.animation;
                    const originalOnMarkerReached = animation.animationOptions.onMarkerReached;
                    // Wrap the onMarkerReached callback to also notify timeline
                    animation.animationOptions.onMarkerReached = (marker) => {
                        var _a, _b;
                        originalOnMarkerReached === null || originalOnMarkerReached === void 0 ? void 0 : originalOnMarkerReached(marker);
                        (_b = (_a = this.options).onMarkerReached) === null || _b === void 0 ? void 0 : _b.call(_a, marker, track);
                    };
                }
                track.animation.start();
                (_f = (_e = this.options).onTrackStart) === null || _f === void 0 ? void 0 : _f.call(_e, track);
            }
            // Track ended
            if (!isActive && wasActive) {
                this.activeTrackIndices.delete(i);
                track.animation.stop();
                (_h = (_g = this.options).onTrackEnd) === null || _h === void 0 ? void 0 : _h.call(_g, track);
            }
            // Update active track
            if (isActive) {
                track.animation.update(dt);
            }
        }
    }
    update(dt) {
        var _a, _b;
        if (this.options.mode !== AnimationTimelineMode.Manual && !this.running) {
            return;
        }
        if (this.options.mode === AnimationTimelineMode.Manual) {
            // In manual mode, just update tracks at current time
            this.updateTracksAtTime(0);
            return;
        }
        this.globalTime += dt;
        // Update all active tracks
        this.updateTracksAtTime(dt);
        // Check if timeline finished
        const duration = this.duration;
        if (this.globalTime >= duration && !this.hasCalledFinishedCallback) {
            this.running = false;
            this.finished = true;
            this.hasCalledFinishedCallback = true;
            (_b = (_a = this.options).onFinished) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        // Reset finished flag if we move away from the end
        if (this.globalTime < duration && this.hasCalledFinishedCallback) {
            this.hasCalledFinishedCallback = false;
            this.finished = false;
        }
    }
}
exports.AnimationTimeline = AnimationTimeline;
AnimationTimeline.DEFAULT_OPTIONS = {
    mode: AnimationTimelineMode.Auto,
    durationMode: 'absolute',
};
// -----------------------------------------------------------------------------
// Built-in easing functions
// -----------------------------------------------------------------------------
exports.EasingFunctions = {
    linear: t => t,
    'ease-in-quad': t => t * t,
    'ease-out-quad': t => t * (2 - t),
    'ease-in-out-quad': t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    'ease-in-cubic': t => t * t * t,
    'ease-out-cubic': t => --t * t * t + 1,
    'ease-in-out-cubic': t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    'ease-in-quart': t => t * t * t * t,
    'ease-out-quart': t => 1 - --t * t * t * t,
    'ease-in-out-quart': t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    'ease-in-quint': t => t * t * t * t * t,
    'ease-out-quint': t => 1 + --t * t * t * t * t,
    'ease-in-out-quint': t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
    'ease-in-sine': t => 1 - Math.cos((t * Math.PI) / 2),
    'ease-out-sine': t => Math.sin((t * Math.PI) / 2),
    'ease-in-out-sine': t => -(Math.cos(Math.PI * t) - 1) / 2,
    'ease-in-expo': t => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
    'ease-out-expo': t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    'ease-in-out-expo': t => t === 0
        ? 0
        : t === 1
            ? 1
            : t < 0.5
                ? Math.pow(2, 20 * t - 10) / 2
                : (2 - Math.pow(2, -20 * t + 10)) / 2,
    'ease-in-circ': t => 1 - Math.sqrt(1 - t * t),
    'ease-out-circ': t => Math.sqrt(1 - --t * t),
    'ease-in-out-circ': t => t < 0.5
        ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
        : (Math.sqrt(1 - (2 * t - 2) * (2 * t - 2)) + 1) / 2,
    'ease-in-back': (t, magnitude = 1.70158) => t * t * ((magnitude + 1) * t - magnitude),
    'ease-out-back': (t, magnitude = 1.70158) => --t * t * ((magnitude + 1) * t + magnitude) + 1,
    'ease-in-out-back': (t, magnitude = 1.70158) => {
        const scaledTime = t * 2;
        const scaledTime2 = scaledTime - 2;
        const s = magnitude * 1.525;
        if (scaledTime < 1) {
            return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
        }
        return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
    },
    'ease-in-elastic': (t, magnitude = 1, period = 0.3) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        let s;
        if (magnitude < 1) {
            magnitude = 1;
            s = period / 4;
        }
        else {
            s = (period / (2 * Math.PI)) * Math.asin(1 / magnitude);
        }
        return -(magnitude *
            Math.pow(2, 10 * (t - 1)) *
            Math.sin(((t - 1 - s) * (2 * Math.PI)) / period));
    },
    'ease-out-elastic': (t, magnitude = 1, period = 0.3) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        let s;
        if (magnitude < 1) {
            magnitude = 1;
            s = period / 4;
        }
        else {
            s = (period / (2 * Math.PI)) * Math.asin(1 / magnitude);
        }
        return (magnitude *
            Math.pow(2, -10 * t) *
            Math.sin(((t - s) * (2 * Math.PI)) / period) +
            1);
    },
    'ease-in-out-elastic': (t, magnitude = 1, period = 0.45) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        let s;
        if (magnitude < 1) {
            magnitude = 1;
            s = period / 4;
        }
        else {
            s = (period / (2 * Math.PI)) * Math.asin(1 / magnitude);
        }
        const scaledTime = t * 2;
        if (scaledTime < 1) {
            return (-0.5 *
                (magnitude *
                    Math.pow(2, 10 * (scaledTime - 1)) *
                    Math.sin(((scaledTime - 1 - s) * (2 * Math.PI)) / period)));
        }
        return (magnitude *
            Math.pow(2, -10 * (scaledTime - 1)) *
            Math.sin(((scaledTime - 1 - s) * (2 * Math.PI)) / period) *
            0.5 +
            1);
    },
    'ease-in-bounce': (t, bounces = 4, decay = 2) => 1 - bounceOut(1 - t, bounces, decay),
    'ease-out-bounce': (t, bounces = 4, decay = 2) => bounceOut(t, bounces, decay),
    'ease-in-out-bounce': (t, bounces = 4, decay = 2) => t < 0.5
        ? (1 - bounceOut(1 - 2 * t, bounces, decay)) * 0.5
        : bounceOut(2 * t - 1, bounces, decay) * 0.5 + 0.5,
};
function bounceOut(t, bounces = 4, decay = 2) {
    const pow = Math.pow(1 - t, decay);
    return 1 - Math.abs(Math.cos(t * Math.PI * bounces)) * pow;
}
/**
 * Helper function to transform points based on relative mode
 */
function transformPoints(points, start, end, relative) {
    if (relative === 'none') {
        return points;
    }
    if (relative === 'start') {
        // Points are offsets from start
        const isVec2Type = isVec2(start);
        return points.map(p => {
            if (isVec2Type && isVec2(p)) {
                return { x: start.x + p.x, y: start.y + p.y };
            }
            else if (isVec3(p) && isVec3(start)) {
                return { x: start.x + p.x, y: start.y + p.y, z: start.z + p.z };
            }
            return p;
        });
    }
    if (relative === 'start-end') {
        // Points are in normalized 0-1 space, scaled between start and end
        const isVec2Type = isVec2(start);
        return points.map(p => {
            if (isVec2Type && isVec2(p) && isVec2(end)) {
                return {
                    x: start.x + p.x * (end.x - start.x),
                    y: start.y + p.y * (end.y - start.y),
                };
            }
            else if (isVec3(p) && isVec3(start) && isVec3(end)) {
                return {
                    x: start.x + p.x * (end.x - start.x),
                    y: start.y + p.y * (end.y - start.y),
                    z: start.z + p.z * (end.z - start.z),
                };
            }
            return p;
        });
    }
    return points;
}
/**
 * Evaluate a Bezier curve at parameter t
 */
function evaluateBezier(controlPoints, t, order) {
    if (controlPoints.length !== order + 1) {
        throw new Error(\`Bezier curve of order \${order} requires \${order + 1} control points, but \${controlPoints.length} were provided\`);
    }
    const isVec2Type = isVec2(controlPoints[0]);
    if (order === 1) {
        // Linear Bezier
        const p0 = controlPoints[0];
        const p1 = controlPoints[1];
        if (isVec2Type && isVec2(p0) && isVec2(p1)) {
            return {
                x: (1 - t) * p0.x + t * p1.x,
                y: (1 - t) * p0.y + t * p1.y,
            };
        }
        else if (isVec3(p0) && isVec3(p1)) {
            return {
                x: (1 - t) * p0.x + t * p1.x,
                y: (1 - t) * p0.y + t * p1.y,
                z: (1 - t) * p0.z + t * p1.z,
            };
        }
    }
    if (order === 2) {
        // Quadratic Bezier
        const p0 = controlPoints[0];
        const p1 = controlPoints[1];
        const p2 = controlPoints[2];
        const t2 = t * t;
        const mt = 1 - t;
        const mt2 = mt * mt;
        if (isVec2Type && isVec2(p0) && isVec2(p1) && isVec2(p2)) {
            return {
                x: mt2 * p0.x + 2 * mt * t * p1.x + t2 * p2.x,
                y: mt2 * p0.y + 2 * mt * t * p1.y + t2 * p2.y,
            };
        }
        else if (isVec3(p0) && isVec3(p1) && isVec3(p2)) {
            return {
                x: mt2 * p0.x + 2 * mt * t * p1.x + t2 * p2.x,
                y: mt2 * p0.y + 2 * mt * t * p1.y + t2 * p2.y,
                z: mt2 * p0.z + 2 * mt * t * p1.z + t2 * p2.z,
            };
        }
    }
    if (order === 3) {
        // Cubic Bezier
        const p0 = controlPoints[0];
        const p1 = controlPoints[1];
        const p2 = controlPoints[2];
        const p3 = controlPoints[3];
        const t2 = t * t;
        const t3 = t2 * t;
        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;
        if (isVec2Type && isVec2(p0) && isVec2(p1) && isVec2(p2) && isVec2(p3)) {
            return {
                x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
                y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
            };
        }
        else if (isVec3(p0) && isVec3(p1) && isVec3(p2) && isVec3(p3)) {
            return {
                x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
                y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
                z: mt3 * p0.z + 3 * mt2 * t * p1.z + 3 * mt * t2 * p2.z + t3 * p3.z,
            };
        }
    }
    throw new Error('Unsupported Bezier order or vector type');
}
/**
 * Evaluate Catmull-Rom basis functions
 */
function catmullRomBasis(t, tension) {
    const t2 = t * t;
    const t3 = t2 * t;
    return [
        -tension * t3 + 2 * tension * t2 - tension * t,
        (2 - tension) * t3 + (tension - 3) * t2 + 1,
        (tension - 2) * t3 + (3 - 2 * tension) * t2 + tension * t,
        tension * t3 - tension * t2,
    ];
}
/**
 * Evaluate a Catmull-Rom spline segment at parameter t
 */
function evaluateCatmullRomSegment(p0, p1, p2, p3, t, tension) {
    const basis = catmullRomBasis(t, tension);
    const isVec2Type = isVec2(p0);
    if (isVec2Type && isVec2(p0) && isVec2(p1) && isVec2(p2) && isVec2(p3)) {
        return {
            x: basis[0] * p0.x + basis[1] * p1.x + basis[2] * p2.x + basis[3] * p3.x,
            y: basis[0] * p0.y + basis[1] * p1.y + basis[2] * p2.y + basis[3] * p3.y,
        };
    }
    else if (isVec3(p0) && isVec3(p1) && isVec3(p2) && isVec3(p3)) {
        return {
            x: basis[0] * p0.x + basis[1] * p1.x + basis[2] * p2.x + basis[3] * p3.x,
            y: basis[0] * p0.y + basis[1] * p1.y + basis[2] * p2.y + basis[3] * p3.y,
            z: basis[0] * p0.z + basis[1] * p1.z + basis[2] * p2.z + basis[3] * p3.z,
        };
    }
    throw new Error('Unsupported vector type for Catmull-Rom spline');
}
/**
 * Create a Bezier path interpolation function
 *
 * @param options Bezier path options
 * @returns An interpolation function that evaluates the Bezier curve
 *
 * @example
 * \`\`\`typescript
 * const animation = new Animation({
 *   initialValue: { x: 0, y: 0 },
 *   targetValue: { x: 100, y: 100 },
 *   duration: 2,
 *   interpolationFunction: bezierPath({
 *     points: [
 *       { x: 0.25, y: 0.8 },
 *       { x: 0.75, y: 0.2 }
 *     ],
 *     order: 3,
 *     relative: 'start-end'
 *   })
 * });
 * \`\`\`
 */
function bezierPath(options) {
    const { points, order, relative = 'none', useAnimationEndpoints = true, } = options;
    return (a, b, t) => {
        // Throw error if trying to use with scalar values
        if (isNumber(a) || isNumber(b)) {
            throw new Error('bezierPath interpolation function cannot be used with scalar number values. Use vec2 or vec3 instead.');
        }
        // Transform points based on relative mode
        const transformedPoints = transformPoints(points, a, b, relative);
        // Build control points array
        let controlPoints;
        if (useAnimationEndpoints) {
            // Use animation start/end as first/last control points
            controlPoints = [a, ...transformedPoints, b];
        }
        else {
            // Use all points from the array
            controlPoints = transformedPoints;
        }
        // Evaluate Bezier curve
        return evaluateBezier(controlPoints, t, order);
    };
}
exports.bezierPath = bezierPath;
/**
 * Create a Catmull-Rom spline interpolation function
 *
 * @param options Catmull-Rom spline options
 * @returns An interpolation function that evaluates the Catmull-Rom spline
 *
 * @example
 * \`\`\`typescript
 * const animation = new Animation({
 *   initialValue: { x: 0, y: 0 },
 *   targetValue: { x: 100, y: 100 },
 *   duration: 2,
 *   interpolationFunction: catmullRomPath({
 *     points: [
 *       { x: 25, y: 80 },
 *       { x: 75, y: 20 }
 *     ],
 *     tension: 0.5,
 *     relative: 'none'
 *   })
 * });
 * \`\`\`
 */
function catmullRomPath(options) {
    const { points, tension = 0.5, relative = 'none', useAnimationEndpoints = true, } = options;
    return (a, b, t) => {
        // Throw error if trying to use with scalar values
        if (isNumber(a) || isNumber(b)) {
            throw new Error('catmullRomPath interpolation function cannot be used with scalar number values. Use vec2 or vec3 instead.');
        }
        // Transform points based on relative mode
        const transformedPoints = transformPoints(points, a, b, relative);
        // Build control points array
        let allPoints;
        if (useAnimationEndpoints) {
            allPoints = [a, ...transformedPoints, b];
        }
        else {
            allPoints = transformedPoints;
        }
        // Need at least 2 points for a Catmull-Rom spline
        if (allPoints.length < 2) {
            throw new Error('Catmull-Rom spline requires at least 2 control points');
        }
        // For a single segment (2 points), just do linear interpolation
        if (allPoints.length === 2) {
            const p0 = allPoints[0];
            const p1 = allPoints[1];
            const isVec2Type = isVec2(p0);
            if (isVec2Type && isVec2(p0) && isVec2(p1)) {
                return {
                    x: p0.x + (p1.x - p0.x) * t,
                    y: p0.y + (p1.y - p0.y) * t,
                };
            }
            else if (isVec3(p0) && isVec3(p1)) {
                return {
                    x: p0.x + (p1.x - p0.x) * t,
                    y: p0.y + (p1.y - p0.y) * t,
                    z: p0.z + (p1.z - p0.z) * t,
                };
            }
        }
        // For Catmull-Rom, we need to find which segment we're in
        // The spline passes through all interior points
        const numSegments = allPoints.length - 1;
        const segmentIndex = Math.min(Math.floor(t * numSegments), numSegments - 1);
        const segmentT = t * numSegments - segmentIndex;
        // Get the 4 control points for this segment
        // p0 and p3 are for computing tangents, p1 and p2 are the segment endpoints
        const p1 = allPoints[segmentIndex];
        const p2 = allPoints[segmentIndex + 1];
        // For p0, use previous point or extrapolate
        const p0 = segmentIndex > 0
            ? allPoints[segmentIndex - 1]
            : extrapolatePoint(p1, p2, -1);
        // For p3, use next point or extrapolate
        const p3 = segmentIndex < numSegments - 1
            ? allPoints[segmentIndex + 2]
            : extrapolatePoint(p1, p2, 2);
        return evaluateCatmullRomSegment(p0, p1, p2, p3, segmentT, tension);
    };
}
exports.catmullRomPath = catmullRomPath;
/**
 * Extrapolate a point beyond two given points
 */
function extrapolatePoint(p1, p2, factor) {
    const isVec2Type = isVec2(p1);
    if (isVec2Type && isVec2(p1) && isVec2(p2)) {
        return {
            x: p1.x + (p2.x - p1.x) * factor,
            y: p1.y + (p2.y - p1.y) * factor,
        };
    }
    else if (isVec3(p1) && isVec3(p2)) {
        return {
            x: p1.x + (p2.x - p1.x) * factor,
            y: p1.y + (p2.y - p1.y) * factor,
            z: p1.z + (p2.z - p1.z) * factor,
        };
    }
    throw new Error('Unsupported vector type for extrapolation');
}


//# sourceURL=webpack://@basementuniverse/animation/./index.ts?
}`);
                })
              ),
              /***/
              "./node_modules/@basementuniverse/utils/utils.js": (
                /*!*******************************************************!*\
                  !*** ./node_modules/@basementuniverse/utils/utils.js ***!
                  \*******************************************************/
                /***/
                ((module) => {
                  eval('{/**\n * @overview A library of useful functions\n * @author Gordon Larrigan\n */\n\n/**\n * Memoize a function\n * @param {Function} f The function to memoize\n * @returns {Function} A memoized version of the function\n */\nconst memoize = f => {\n  var cache = {};\n  return function(...args) {\n    return cache[args] ?? (cache[args] = f.apply(this, args));\n  };\n};\n\n/**\n * Check if two numbers are approximately equal\n * @param {number} a Number a\n * @param {number} b Number b\n * @param {number} [p=Number.EPSILON] The precision value\n * @return {boolean} True if numbers a and b are approximately equal\n */\nconst floatEquals = (a, b, p = Number.EPSILON) => Math.abs(a - b) < p;\n\n/**\n * Clamp a number between min and max\n * @param {number} a The number to clamp\n * @param {number} [min=0] The minimum value\n * @param {number} [max=1] The maximum value\n * @return {number} A clamped number\n */\nconst clamp = (a, min = 0, max = 1) => a < min ? min : (a > max ? max : a);\n\n/**\n * Get the fractional part of a number\n * @param {number} a The number from which to get the fractional part\n * @return {number} The fractional part of the number\n */\nconst frac = a => a >= 0 ? a - Math.floor(a) : a - Math.ceil(a);\n\n/**\n * Round n to d decimal places\n * @param {number} n The number to round\n * @param {number} [d=0] The number of decimal places to round to\n * @return {number} A rounded number\n */\nconst round = (n, d = 0) => {\n  const p = Math.pow(10, d);\n  return Math.round(n * p + Number.EPSILON) / p;\n}\n\n/**\n * Do a linear interpolation between a and b\n * @param {number} a The minimum number\n * @param {number} b The maximum number\n * @param {number} i The interpolation value, should be in the interval [0, 1]\n * @return {number} An interpolated value in the interval [a, b]\n */\nconst lerp = (a, b, i) => a + (b - a) * i;\n\n/**\n * Get the position of i between a and b\n * @param {number} a The minimum number\n * @param {number} b The maximum number\n * @param {number} i The interpolated value in the interval [a, b]\n * @return {number} The position of i between a and b\n */\nconst unlerp = (a, b, i) => (i - a) / (b - a);\n\n/**\n * Do a bilinear interpolation\n * @param {number} c00 Top-left value\n * @param {number} c10 Top-right value\n * @param {number} c01 Bottom-left value\n * @param {number} c11 Bottom-right value\n * @param {number} ix Interpolation value along x\n * @param {number} iy Interpolation value along y\n * @return {number} A bilinear interpolated value\n */\nconst blerp = (c00, c10, c01, c11, ix, iy) => lerp(lerp(c00, c10, ix), lerp(c01, c11, ix), iy);\n\n/**\n * Re-map a number i from range a1...a2 to b1...b2\n * @param {number} i The number to re-map\n * @param {number} a1\n * @param {number} a2\n * @param {number} b1\n * @param {number} b2\n * @return {number}\n */\nconst remap = (i, a1, a2, b1, b2) => b1 + (i - a1) * (b2 - b1) / (a2 - a1);\n\n/**\n * Do a smooth interpolation between a and b\n * @param {number} a The minimum number\n * @param {number} b The maximum number\n * @param {number} i The interpolation value\n * @return {number} An interpolated value in the interval [a, b]\n */\nconst smoothstep = (a, b, i) => lerp(a, b, 3 * Math.pow(i, 2) - 2 * Math.pow(i, 3));\n\n/**\n * Get an angle in radians\n * @param {number} degrees The angle in degrees\n * @return {number} The angle in radians\n */\nconst radians = degrees => (Math.PI / 180) * degrees;\n\n/**\n * Get an angle in degrees\n * @param {number} radians The angle in radians\n * @return {number} The angle in degrees\n */\nconst degrees = radians => (180 / Math.PI) * radians;\n\n/**\n * Get a random float in the interval [min, max)\n * @param {number} min Inclusive min\n * @param {number} max Exclusive max\n * @return {number} A random float in the interval [min, max)\n */\nconst randomBetween = (min, max) => Math.random() * (max - min) + min;\n\n/**\n * Get a random integer in the interval [min, max]\n * @param {number} min Inclusive min\n * @param {number} max Inclusive max\n * @return {number} A random integer in the interval [min, max]\n */\nconst randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;\n\n/**\n * Get a normally-distributed random number\n * @param {number} [mu=0.5] The mean value\n * @param {number} [sigma=0.5] The standard deviation\n * @param {number} [samples=2] The number of samples\n * @return {number} A normally-distributed random number\n */\nconst cltRandom = (mu = 0.5, sigma = 0.5, samples = 2) => {\n  let total = 0;\n  for (let i = samples; i--;) {\n    total += Math.random();\n  }\n  return mu + (total - samples / 2) / (samples / 2) * sigma;\n};\n\n/**\n * Get a normally-distributed random integer in the interval [min, max]\n * @param {number} min Inclusive min\n * @param {number} max Inclusive max\n * @return {number} A normally-distributed random integer\n */\nconst cltRandomInt = (min, max) => Math.floor(min + cltRandom(0.5, 0.5, 2) * (max + 1 - min));\n\n/**\n * Return a weighted random integer\n * @param {Array<number>} w An array of weights\n * @return {number} An index from w\n */\nconst weightedRandom = w => {\n  let total = w.reduce((a, i) => a + i, 0), n = 0;\n  const r = Math.random() * total;\n  while (total > r) {\n    total -= w[n++];\n  }\n  return n - 1;\n};\n\n/**\n * An interpolation function\n * @callback InterpolationFunction\n * @param {number} a The minimum number\n * @param {number} b The maximum number\n * @param {number} i The interpolation value, should be in the interval [0, 1]\n * @return {number} The interpolated value in the interval [a, b]\n */\n\n/**\n * Return an interpolated value from an array\n * @param {Array<number>} a An array of values interpolate\n * @param {number} i A number in the interval [0, 1]\n * @param {InterpolationFunction} [f=Math.lerp] The interpolation function to use\n * @return {number} An interpolated value in the interval [min(a), max(a)]\n */\nconst lerpArray = (a, i, f = lerp) => {\n  const s = i * (a.length - 1);\n  const p = clamp(Math.trunc(s), 0, a.length - 1);\n  return f(a[p] || 0, a[p + 1] || 0, frac(s));\n};\n\n/**\n * Get the dot product of two vectors\n * @param {Array<number>} a Vector a\n * @param {Array<number>} b Vector b\n * @return {number} a \u2219 b\n */\nconst dot = (a, b) => a.reduce((n, v, i) => n + v * b[i], 0);\n\n/**\n * Get the factorial of a number\n * @param {number} a\n * @return {number} a!\n */\nconst factorial = a => {\n  let result = 1;\n  for (let i = 2; i <= a; i++) {\n    result *= i;\n  }\n  return result;\n};\n\n/**\n * Get the number of permutations of r elements from a set of n elements\n * @param {number} n\n * @param {number} r\n * @return {number} nPr\n */\nconst npr = (n, r) => factorial(n) / factorial(n - r);\n\n/**\n * Get the number of combinations of r elements from a set of n elements\n * @param {number} n\n * @param {number} r\n * @return {number} nCr\n */\nconst ncr = (n, r) => factorial(n) / (factorial(r) * factorial(n - r));\n\n/**\n * Generate all permutations of r elements from an array\n *\n * @example\n * ```js\n * permutations([1, 2, 3], 2);\n * ```\n *\n * Output:\n * ```json\n * [\n *   [1, 2],\n *   [1, 3],\n *   [2, 1],\n *   [2, 3],\n *   [3, 1],\n *   [3, 2]\n * ]\n * ```\n * @param {Array<*>} a\n * @param {number} r The number of elements to choose in each permutation\n * @return {Array<Array<*>>} An array of permutation arrays\n */\nconst permutations = (a, r) => {\n  if (r === 1) {\n    return a.map(item => [item]);\n  }\n\n  return a.reduce(\n    (acc, item, i) => [\n      ...acc,\n      ...permutations(a.slice(0, i).concat(a.slice(i + 1)), r - 1).map(c => [item, ...c]),\n    ],\n    []\n  );\n}\n\n/**\n * Generate all combinations of r elements from an array\n *\n * @example\n * ```js\n * combinations([1, 2, 3], 2);\n * ```\n *\n * Output:\n * ```json\n * [\n *   [1, 2],\n *   [1, 3],\n *   [2, 3]\n * ]\n * ```\n * @param {Array<*>} a\n * @param {number} r The number of elements to choose in each combination\n * @return {Array<Array<*>>} An array of combination arrays\n */\nconst combinations = (a, r) => {\n  if (r === 1) {\n    return a.map(item => [item]);\n  }\n\n  return a.reduce(\n    (acc, item, i) => [\n      ...acc,\n      ...combinations(a.slice(i + 1), r - 1).map(c => [item, ...c]),\n    ],\n    []\n  );\n};\n\n/**\n * Get a cartesian product of arrays\n *\n * @example\n * ```js\n * cartesian([1, 2, 3], [\'a\', \'b\']);\n * ```\n *\n * Output:\n * ```json\n * [\n *   [1, "a"],\n *   [1, "b"],\n *   [2, "a"],\n *   [2, "b"],\n *   [3, "a"],\n *   [3, "b"]\n * ]\n * ```\n */\nconst cartesian = (...arr) =>\n  arr.reduce(\n    (a, b) => a.flatMap(c => b.map(d => [...c, d])),\n    [[]]\n  );\n\n/**\n * A function for generating array values\n * @callback TimesFunction\n * @param {number} i The array index\n * @return {*} The array value\n */\n\n/**\n * Return a new array with length n by calling function f(i) on each element\n * @param {TimesFunction} f\n * @param {number} n The size of the array\n * @return {Array<*>}\n */\nconst times = (f, n) => Array(n).fill(0).map((_, i) => f(i));\n\n/**\n * Return an array containing numbers 0->(n - 1)\n * @param {number} n The size of the array\n * @return {Array<number>} An array of integers 0->(n - 1)\n */\nconst range = n => times(i => i, n);\n\n/**\n * Zip multiple arrays together, i.e. ([1, 2, 3], [a, b, c]) => [[1, a], [2, b], [3, c]]\n * @param {...Array<*>} a The arrays to zip\n * @return {Array<Array<*>>}\n */\nconst zip = (...a) => times(i => a.map(a => a[i]), Math.max(...a.map(a => a.length)));\n\n/**\n * Return array[i] with positive and negative wrapping\n * @param {Array<*>} a The array to access\n * @param {number} i The positively/negatively wrapped array index\n * @return {*} An element from the array\n */\nconst at = (a, i) => a[i < 0 ? a.length - (Math.abs(i + 1) % a.length) - 1 : i % a.length];\n\n/**\n * Return the last element of an array without removing it\n * @param {Array<*>} a\n * @return {*} The last element from the array\n */\nconst peek = (a) => {\n  if (!a.length) {\n    return undefined;\n  }\n\n  return a[a.length - 1];\n};\n\n/**\n * Return the index for a given position in an unrolled 2d array\n * @param {number} x The x position\n * @param {number} y The y position\n * @param {number} w The width of the 2d array\n * @returns {number} The index in the unrolled array\n */\nconst ind = (x, y, w) => x + y * w;\n\n/**\n * Return the position for a given index in an unrolled 2d array\n * @param {number} i The index\n * @param {number} w The width of the 2d array\n * @returns {Array<number>} The position as a 2-tuple\n */\nconst pos = (i, w) => [i % w, Math.floor(i / w)];\n\n/**\n * Chop an array into chunks of size n\n * @param {Array<*>} a\n * @param {number} n The chunk size\n * @return {Array<Array<*>>} An array of array chunks\n */\nconst chunk = (a, n) => times(i => a.slice(i * n, i * n + n), Math.ceil(a.length / n));\n\n/**\n * Randomly shuffle a shallow copy of an array\n * @param {Array<*>} a\n * @return {Array<*>} The shuffled array\n */\nconst shuffle = a => a.slice().sort(() => Math.random() - 0.5);\n\n/**\n * Flatten an object\n * @param {object} o\n * @param {string} concatenator The string to use for concatenating keys\n * @return {object} A flattened object\n */\nconst flat = (o, concatenator = \'.\') => {\n  return Object.keys(o).reduce((acc, key) => {\n    if (o[key] instanceof Date) {\n      return {\n        ...acc,\n        [key]: o[key].toISOString(),\n      };\n    }\n\n    if (typeof o[key] !== \'object\' || !o[key]) {\n      return {\n        ...acc,\n        [key]: o[key],\n      };\n    }\n    const flattened = flat(o[key], concatenator);\n\n    return {\n      ...acc,\n      ...Object.keys(flattened).reduce(\n        (childAcc, childKey) => ({\n          ...childAcc,\n          [`${key}${concatenator}${childKey}`]: flattened[childKey],\n        }),\n        {}\n      ),\n    };\n  }, {});\n};\n\n/**\n * Unflatten an object\n * @param {object} o\n * @param {string} concatenator The string to check for in concatenated keys\n * @return {object} An un-flattened object\n */\nconst unflat = (o, concatenator = \'.\') => {\n  let result = {}, temp, substrings, property, i;\n\n  for (property in o) {\n    substrings = property.split(concatenator);\n    temp = result;\n    for (i = 0; i < substrings.length - 1; i++) {\n      if (!(substrings[i] in temp)) {\n        if (isFinite(substrings[i + 1])) {\n          temp[substrings[i]] = [];\n        } else {\n          temp[substrings[i]] = {};\n        }\n      }\n      temp = temp[substrings[i]];\n    }\n    temp[substrings[substrings.length - 1]] = o[property];\n  }\n\n  return result;\n};\n\n/**\n * A split predicate\n * @callback SplitPredicate\n * @param {any} value The current value\n * @return {boolean} True if the array should split at this index\n */\n\n/**\n * Split an array into sub-arrays based on a predicate\n * @param {Array<*>} array\n * @param {SplitPredicate} predicate\n * @return {Array<Array<*>>} An array of arrays\n */\nconst split = (array, predicate) => {\n  const result = [];\n  let current = [];\n  for (const value of array) {\n    if (predicate(value)) {\n      if (current.length) {\n        result.push(current);\n      }\n      current = [value];\n    } else {\n      current.push(value);\n    }\n  }\n  result.push(current);\n\n  return result;\n};\n\n/**\n * Pluck keys from an object\n * @param {object} o\n * @param {...string} keys The keys to pluck from the object\n * @return {object} An object containing the plucked keys\n */\nconst pluck = (o, ...keys) => {\n  return keys.reduce(\n    (result, key) => Object.assign(result, { [key]: o[key] }),\n    {}\n  );\n};\n\n/**\n * Exclude keys from an object\n * @param {object} o\n * @param {...string} keys The keys to exclude from the object\n * @return {object} An object containing all keys except excluded keys\n */\nconst exclude = (o, ...keys) => {\n  return Object.fromEntries(\n    Object.entries(o).filter(([key]) => !keys.includes(key))\n  );\n};\n\nif (true) {\n  module.exports = {\n    memoize,\n    floatEquals,\n    clamp,\n    frac,\n    round,\n    lerp,\n    unlerp,\n    blerp,\n    remap,\n    smoothstep,\n    radians,\n    degrees,\n    randomBetween,\n    randomIntBetween,\n    cltRandom,\n    cltRandomInt,\n    weightedRandom,\n    lerpArray,\n    dot,\n    factorial,\n    npr,\n    ncr,\n    permutations,\n    combinations,\n    cartesian,\n    times,\n    range,\n    zip,\n    at,\n    peek,\n    ind,\n    pos,\n    chunk,\n    shuffle,\n    flat,\n    unflat,\n    split,\n    pluck,\n    exclude,\n  };\n}\n\n\n//# sourceURL=webpack://@basementuniverse/animation/./node_modules/@basementuniverse/utils/utils.js?\n}');
                })
              ),
              /***/
              "./node_modules/@basementuniverse/vec/vec.js": (
                /*!***************************************************!*\
                  !*** ./node_modules/@basementuniverse/vec/vec.js ***!
                  \***************************************************/
                /***/
                ((module) => {
                  eval("{/**\n * @overview A small vector and matrix library\n * @author Gordon Larrigan\n */\n\nconst _vec_times = (f, n) => Array(n).fill(0).map((_, i) => f(i));\nconst _vec_chunk = (a, n) => _vec_times(i => a.slice(i * n, i * n + n), Math.ceil(a.length / n));\nconst _vec_dot = (a, b) => a.reduce((n, v, i) => n + v * b[i], 0);\nconst _vec_is_vec2 = a => typeof a === 'object' && 'x' in a && 'y' in a;\nconst _vec_is_vec3 = a => typeof a === 'object' && 'x' in a && 'y' in a && 'z' in a;\n\n/**\n * A 2d vector\n * @typedef {Object} vec2\n * @property {number} x The x component of the vector\n * @property {number} y The y component of the vector\n */\n\n/**\n * Create a new 2d vector\n * @param {number|vec2} [x] The x component of the vector, or a vector to copy\n * @param {number} [y] The y component of the vector\n * @return {vec2} A new 2d vector\n * @example <caption>various ways to initialise a vector</caption>\n * let a = vec2(3, 2); // (3, 2)\n * let b = vec2(4);    // (4, 4)\n * let c = vec2(a);    // (3, 2)\n * let d = vec2();     // (0, 0)\n */\nconst vec2 = (x, y) => {\n  if (!x && !y) {\n    return { x: 0, y: 0 };\n  }\n  if (_vec_is_vec2(x)) {\n    return { x: x.x || 0, y: x.y || 0 };\n  }\n  return { x: x, y: y ?? x };\n};\n\n/**\n * Get the components of a vector as an array\n * @param {vec2} a The vector to get components from\n * @return {Array<number>} The vector components as an array\n */\nvec2.components = a => [a.x, a.y];\n\n/**\n * Create a vector from an array of components\n * @param {Array<number>} components The components of the vector\n * @return {vec2} A new vector\n */\nvec2.fromComponents = components => vec2(...components.slice(0, 2));\n\n/**\n * Return a unit vector (1, 0)\n * @return {vec2} A unit vector (1, 0)\n */\nvec2.ux = () => vec2(1, 0);\n\n/**\n * Return a unit vector (0, 1)\n * @return {vec2} A unit vector (0, 1)\n */\nvec2.uy = () => vec2(0, 1);\n\n/**\n * Add vectors\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a + b\n */\nvec2.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b) });\n\n/**\n * Subtract vectors\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a - b\n */\nvec2.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b) });\n\n/**\n * Scale a vector\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a * b\n */\nvec2.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b) });\n\n/**\n * Scale a vector by a scalar, alias for vec2.mul\n * @param {vec2} a Vector a\n * @param {number} b Scalar b\n * @return {vec2} a * b\n */\nvec2.scale = (a, b) => vec2.mul(a, b);\n\n/**\n * Divide a vector\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a / b\n */\nvec2.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b) });\n\n/**\n * Get the length of a vector\n * @param {vec2} a Vector a\n * @return {number} |a|\n */\nvec2.len = a => Math.sqrt(a.x * a.x + a.y * a.y);\n\n/**\n * Get the length of a vector using taxicab geometry\n * @param {vec2} a Vector a\n * @return {number} |a|\n */\nvec2.manhattan = a => Math.abs(a.x) + Math.abs(a.y);\n\n/**\n * Normalise a vector\n * @param {vec2} a The vector to normalise\n * @return {vec2} ^a\n */\nvec2.nor = a => {\n  let len = vec2.len(a);\n  return len ? { x: a.x / len, y: a.y / len } : vec2();\n};\n\n/**\n * Get a dot product of vectors\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {number} a \u2219 b\n */\nvec2.dot = (a, b) => a.x * b.x + a.y * b.y;\n\n/**\n * Rotate a vector by r radians\n * @param {vec2} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec2} A rotated vector\n */\nvec2.rot = (a, r) => {\n  let s = Math.sin(r),\n    c = Math.cos(r);\n  return { x: c * a.x - s * a.y, y: s * a.x + c * a.y };\n};\n\n/**\n * Fast method to rotate a vector by -90, 90 or 180 degrees\n * @param {vec2} a The vector to rotate\n * @param {number} r 1 for 90 degrees (cw), -1 for -90 degrees (ccw), 2 or -2 for 180 degrees\n * @return {vec2} A rotated vector\n */\nvec2.rotf = (a, r) => {\n  switch (r) {\n    case 1: return vec2(a.y, -a.x);\n    case -1: return vec2(-a.y, a.x);\n    case 2: case -2: return vec2(-a.x, -a.y);\n    default: return a;\n  }\n};\n\n/**\n * Scalar cross product of two vectors\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {number} a \xD7 b\n */\nvec2.cross = (a, b) => {\n  return a.x * b.y - a.y * b.x;\n};\n\n/**\n * Check if two vectors are equal\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {boolean} True if vectors a and b are equal, false otherwise\n */\nvec2.eq = (a, b) => a.x === b.x && a.y === b.y;\n\n/**\n * Get the angle of a vector\n * @param {vec2} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec2.rad = a => Math.atan2(a.y, a.x);\n\n/**\n * Copy a vector\n * @param {vec2} a The vector to copy\n * @return {vec2} A copy of vector a\n */\nvec2.cpy = a => vec2(a);\n\n/**\n * A function to call on each component of a 2d vector\n * @callback vec2MapCallback\n * @param {number} value The component value\n * @param {'x' | 'y'} label The component label (x or y)\n * @return {number} The mapped component\n */\n\n/**\n * Call a function on each component of a vector and build a new vector from the results\n * @param {vec2} a Vector a\n * @param {vec2MapCallback} f The function to call on each component of the vector\n * @return {vec2} Vector a mapped through f\n */\nvec2.map = (a, f) => ({ x: f(a.x, 'x'), y: f(a.y, 'y') });\n\n/**\n * Convert a vector into a string\n * @param {vec2} a The vector to convert\n * @param {string} [s=', '] The separator string\n * @return {string} A string representation of the vector\n */\nvec2.str = (a, s = ', ') => `${a.x}${s}${a.y}`;\n\n/**\n * Swizzle a vector with a string of component labels\n *\n * The string can contain:\n * - `x` or `y`\n * - `u` or `v` (aliases for `x` and `y`, respectively)\n * - `X`, `Y`, `U`, `V` (negated versions of the above)\n * - `0` or `1` (these will be passed through unchanged)\n * - `.` to return the component that would normally be at this position (or 0)\n *\n * Any other characters will default to 0\n * @param {vec2} a The vector to swizzle\n * @param {string} [s='..'] The swizzle string\n * @return {Array<number>} The swizzled components\n * @example <caption>swizzling a vector</caption>\n * let a = vec2(3, -2);\n * vec2.swiz(a, 'x');    // [3]\n * vec2.swiz(a, 'yx');   // [-2, 3]\n * vec2.swiz(a, 'xY');   // [3, 2]\n * vec2.swiz(a, 'Yy');   // [2, -2]\n * vec2.swiz(a, 'x.x');  // [3, -2, 3]\n * vec2.swiz(a, 'y01x'); // [-2, 0, 1, 3]\n */\nvec2.swiz = (a, s = '..') => {\n  const result = [];\n  s.split('').forEach((c, i) => {\n    switch (c) {\n      case 'x': case 'u': result.push(a.x); break;\n      case 'y': case 'v': result.push(a.y); break;\n      case 'X': case 'U': result.push(-a.x); break;\n      case 'Y': case 'V': result.push(-a.y); break;\n      case '0': result.push(0); break;\n      case '1': result.push(1); break;\n      case '.': result.push([a.x, a.y][i] ?? 0); break;\n      default: result.push(0);\n    }\n  });\n  return result;\n};\n\n/**\n * Polar coordinates for a 2d vector\n * @typedef {Object} polarCoordinates2d\n * @property {number} r The magnitude (radius) of the vector\n * @property {number} theta The angle of the vector\n */\n\n/**\n * Convert a vector into polar coordinates\n * @param {vec2} a The vector to convert\n * @return {polarCoordinates2d} The magnitude and angle of the vector\n */\nvec2.polar = a => ({ r: vec2.len(a), theta: Math.atan2(a.y, a.x) });\n\n/**\n * Convert polar coordinates into a vector\n * @param {number} r The magnitude (radius) of the vector\n * @param {number} theta The angle of the vector\n * @return {vec2} A vector with the given angle and magnitude\n */\nvec2.fromPolar = (r, theta) => vec2(r * Math.cos(theta), r * Math.sin(theta));\n\n/**\n * A 3d vector\n * @typedef {Object} vec3\n * @property {number} x The x component of the vector\n * @property {number} y The y component of the vector\n * @property {number} z The z component of the vector\n */\n\n/**\n * Create a new 3d vector\n * @param {number|vec3|vec2} [x] The x component of the vector, or a vector to copy\n * @param {number} [y] The y component of the vector, or the z component if x is a vec2\n * @param {number} [z] The z component of the vector\n * @return {vec3} A new 3d vector\n * @example <caption>various ways to initialise a vector</caption>\n * let a = vec3(3, 2, 1);       // (3, 2, 1)\n * let b = vec3(4, 5);          // (4, 5, 0)\n * let c = vec3(6);             // (6, 6, 6)\n * let d = vec3(a);             // (3, 2, 1)\n * let e = vec3();              // (0, 0, 0)\n * let f = vec3(vec2(1, 2), 3); // (1, 2, 3)\n * let g = vec3(vec2(4, 5));    // (4, 5, 0)\n */\nconst vec3 = (x, y, z) => {\n  if (!x && !y && !z) {\n    return { x: 0, y: 0, z: 0 };\n  }\n  if (_vec_is_vec3(x)) {\n    return { x: x.x || 0, y: x.y || 0, z: x.z || 0 };\n  }\n  if (_vec_is_vec2(x)) {\n    return { x: x.x || 0, y: x.y || 0, z: y || 0 };\n  }\n  return { x: x, y: y ?? x, z: z ?? x };\n};\n\n/**\n * Get the components of a vector as an array\n * @param {vec3} a The vector to get components from\n * @return {Array<number>} The vector components as an array\n */\nvec3.components = a => [a.x, a.y, a.z];\n\n/**\n * Create a vector from an array of components\n * @param {Array<number>} components The components of the vector\n * @return {vec3} A new vector\n */\nvec3.fromComponents = components => vec3(...components.slice(0, 3));\n\n/**\n * Return a unit vector (1, 0, 0)\n * @return {vec3} A unit vector (1, 0, 0)\n */\nvec3.ux = () => vec3(1, 0, 0);\n\n/**\n * Return a unit vector (0, 1, 0)\n * @return {vec3} A unit vector (0, 1, 0)\n */\nvec3.uy = () => vec3(0, 1, 0);\n\n/**\n * Return a unit vector (0, 0, 1)\n * @return {vec3} A unit vector (0, 0, 1)\n */\nvec3.uz = () => vec3(0, 0, 1);\n\n/**\n * Add vectors\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a + b\n */\nvec3.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b), z: a.z + (b.z ?? b) });\n\n/**\n * Subtract vectors\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a - b\n */\nvec3.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b), z: a.z - (b.z ?? b) });\n\n/**\n * Scale a vector\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a * b\n */\nvec3.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b), z: a.z * (b.z ?? b) });\n\n/**\n * Scale a vector by a scalar, alias for vec3.mul\n * @param {vec3} a Vector a\n * @param {number} b Scalar b\n * @return {vec3} a * b\n */\nvec3.scale = (a, b) => vec3.mul(a, b);\n\n/**\n * Divide a vector\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a / b\n */\nvec3.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b), z: a.z / (b.z ?? b) });\n\n/**\n * Get the length of a vector\n * @param {vec3} a Vector a\n * @return {number} |a|\n */\nvec3.len = a => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);\n\n/**\n * Get the length of a vector using taxicab geometry\n * @param {vec3} a Vector a\n * @return {number} |a|\n */\nvec3.manhattan = a => Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);\n\n/**\n * Normalise a vector\n * @param {vec3} a The vector to normalise\n * @return {vec3} ^a\n */\nvec3.nor = a => {\n  let len = vec3.len(a);\n  return len ? { x: a.x / len, y: a.y / len, z: a.z / len } : vec3();\n};\n\n/**\n * Get a dot product of vectors\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {number} a \u2219 b\n */\nvec3.dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;\n\n/**\n * Rotate a vector using a rotation matrix\n * @param {vec3} a The vector to rotate\n * @param {mat} m The rotation matrix\n * @return {vec3} A rotated vector\n */\nvec3.rot = (a, m) => vec3(\n  vec3.dot(vec3.fromComponents(mat.row(m, 1)), a),\n  vec3.dot(vec3.fromComponents(mat.row(m, 2)), a),\n  vec3.dot(vec3.fromComponents(mat.row(m, 3)), a)\n);\n\n/**\n * Rotate a vector by r radians around the x axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.rotx = (a, r) => vec3(\n  a.x,\n  a.y * Math.cos(r) - a.z * Math.sin(r),\n  a.y * Math.sin(r) + a.z * Math.cos(r)\n);\n\n/**\n * Rotate a vector by r radians around the y axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.roty = (a, r) => vec3(\n  a.x * Math.cos(r) + a.z * Math.sin(r),\n  a.y,\n  -a.x * Math.sin(r) + a.z * Math.cos(r)\n);\n\n/**\n * Rotate a vector by r radians around the z axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.rotz = (a, r) => vec3(\n  a.x * Math.cos(r) - a.y * Math.sin(r),\n  a.x * Math.sin(r) + a.y * Math.cos(r),\n  a.z\n);\n\n/**\n * Rotate a vector using a quaternion\n * @param {vec3} a The vector to rotate\n * @param {Array<number>} q The quaternion to rotate by\n * @return {vec3} A rotated vector\n */\nvec3.rotq = (v, q) => {\n  if (q.length !== 4) {\n    return vec3();\n  }\n\n  const d = Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);\n  if (d === 0) {\n    return vec3();\n  }\n\n  const uq = [q[0] / d, q[1] / d, q[2] / d, q[3] / d];\n  const u = vec3(...uq.slice(0, 3));\n  const s = uq[3];\n  return vec3.add(\n    vec3.add(\n      vec3.mul(u, 2 * vec3.dot(u, v)),\n      vec3.mul(v, s * s - vec3.dot(u, u))\n    ),\n    vec3.mul(vec3.cross(u, v), 2 * s)\n  );\n};\n\n/**\n * Rotate a vector using Euler angles\n * @param {vec3} a The vector to rotate\n * @param {vec3} e The Euler angles to rotate by\n * @return {vec3} A rotated vector\n */\nvec3.rota = (a, e) => vec3.rotz(vec3.roty(vec3.rotx(a, e.x), e.y), e.z);\n\n/**\n * Get the cross product of vectors\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {vec3} a \xD7 b\n */\nvec3.cross = (a, b) => vec3(\n  a.y * b.z - a.z * b.y,\n  a.z * b.x - a.x * b.z,\n  a.x * b.y - a.y * b.x\n);\n\n/**\n * Check if two vectors are equal\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {boolean} True if vectors a and b are equal, false otherwise\n */\nvec3.eq = (a, b) => a.x === b.x && a.y === b.y && a.z === b.z;\n\n/**\n * Get the angle of a vector from the x axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.radx = a => Math.atan2(a.z, a.y);\n\n/**\n * Get the angle of a vector from the y axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.rady = a => Math.atan2(a.x, a.y);\n\n/**\n * Get the angle of a vector from the z axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.radz = a => Math.atan2(a.y, a.z);\n\n/**\n * Copy a vector\n * @param {vec3} a The vector to copy\n * @return {vec3} A copy of vector a\n */\nvec3.cpy = a => vec3(a);\n\n/**\n * A function to call on each component of a 3d vector\n * @callback vec3MapCallback\n * @param {number} value The component value\n * @param {'x' | 'y' | 'z'} label The component label (x, y or z)\n * @return {number} The mapped component\n */\n\n/**\n * Call a function on each component of a vector and build a new vector from the results\n * @param {vec3} a Vector a\n * @param {vec3MapCallback} f The function to call on each component of the vector\n * @return {vec3} Vector a mapped through f\n */\nvec3.map = (a, f) => ({ x: f(a.x, 'x'), y: f(a.y, 'y'), z: f(a.z, 'z') });\n\n/**\n * Convert a vector into a string\n * @param {vec3} a The vector to convert\n * @param {string} [s=', '] The separator string\n * @return {string} A string representation of the vector\n */\nvec3.str = (a, s = ', ') => `${a.x}${s}${a.y}${s}${a.z}`;\n\n/**\n * Swizzle a vector with a string of component labels\n *\n * The string can contain:\n * - `x`, `y` or `z`\n * - `u`, `v` or `w` (aliases for `x`, `y` and `z`, respectively)\n * - `r`, `g` or `b` (aliases for `x`, `y` and `z`, respectively)\n * - `X`, `Y`, `Z`, `U`, `V`, `W`, `R`, `G`, `B` (negated versions of the above)\n * - `0` or `1` (these will be passed through unchanged)\n * - `.` to return the component that would normally be at this position (or 0)\n *\n * Any other characters will default to 0\n * @param {vec3} a The vector to swizzle\n * @param {string} [s='...'] The swizzle string\n * @return {Array<number>} The swizzled components\n * @example <caption>swizzling a vector</caption>\n * let a = vec3(3, -2, 1);\n * vec3.swiz(a, 'x');     // [3]\n * vec3.swiz(a, 'zyx');   // [1, -2, 3]\n * vec3.swiz(a, 'xYZ');   // [3, 2, -1]\n * vec3.swiz(a, 'Zzx');   // [-1, 1, 3]\n * vec3.swiz(a, 'x.x');   // [3, -2, 3]\n * vec3.swiz(a, 'y01zx'); // [-2, 0, 1, 1, 3]\n */\nvec3.swiz = (a, s = '...') => {\n  const result = [];\n  s.split('').forEach((c, i) => {\n    switch (c) {\n      case 'x': case 'u': case 'r': result.push(a.x); break;\n      case 'y': case 'v': case 'g': result.push(a.y); break;\n      case 'z': case 'w': case 'b': result.push(a.z); break;\n      case 'X': case 'U': case 'R': result.push(-a.x); break;\n      case 'Y': case 'V': case 'G': result.push(-a.y); break;\n      case 'Z': case 'W': case 'B': result.push(-a.z); break;\n      case '0': result.push(0); break;\n      case '1': result.push(1); break;\n      case '.': result.push([a.x, a.y, a.z][i] ?? 0); break;\n      default: result.push(0);\n    }\n  });\n  return result;\n};\n\n/**\n * Polar coordinates for a 3d vector\n * @typedef {Object} polarCoordinates3d\n * @property {number} r The magnitude (radius) of the vector\n * @property {number} theta The tilt angle of the vector\n * @property {number} phi The pan angle of the vector\n */\n\n/**\n * Convert a vector into polar coordinates\n * @param {vec3} a The vector to convert\n * @return {polarCoordinates3d} The magnitude, tilt and pan of the vector\n */\nvec3.polar = a => {\n  let r = vec3.len(a),\n    theta = Math.acos(a.y / r),\n    phi = Math.atan2(a.z, a.x);\n  return { r, theta, phi };\n};\n\n/**\n * Convert polar coordinates into a vector\n * @param {number} r The magnitude (radius) of the vector\n * @param {number} theta The tilt of the vector\n * @param {number} phi The pan of the vector\n * @return {vec3} A vector with the given angle and magnitude\n */\nvec3.fromPolar = (r, theta, phi) => {\n  const sinTheta = Math.sin(theta);\n  return vec3(\n    r * sinTheta * Math.cos(phi),\n    r * Math.cos(theta),\n    r * sinTheta * Math.sin(phi)\n  );\n};\n\n/**\n * A matrix\n * @typedef {Object} mat\n * @property {number} m The number of rows in the matrix\n * @property {number} n The number of columns in the matrix\n * @property {Array<number>} entries The matrix values\n */\n\n/**\n * Create a new matrix\n * @param {number} [m=4] The number of rows\n * @param {number} [n=4] The number of columns\n * @param {Array<number>} [entries=[]] Matrix values in reading order\n * @return {mat} A new matrix\n */\nconst mat = (m = 4, n = 4, entries = []) => ({\n  m, n,\n  entries: entries.concat(Array(m * n).fill(0)).slice(0, m * n)\n});\n\n/**\n * Get an identity matrix of size n\n * @param {number} n The size of the matrix\n * @return {mat} An identity matrix\n */\nmat.identity = n => mat(n, n, Array(n * n).fill(0).map((v, i) => +(Math.floor(i / n) === i % n)));\n\n/**\n * Get an entry from a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @return {number} The value at position (i, j) in matrix a\n */\nmat.get = (a, i, j) => a.entries[(j - 1) + (i - 1) * a.n];\n\n/**\n * Set an entry of a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @param {number} v The value to set in matrix a\n */\nmat.set = (a, i, j, v) => { a.entries[(j - 1) + (i - 1) * a.n] = v; };\n\n/**\n * Get a row from a matrix as an array\n * @param {mat} a Matrix a\n * @param {number} m The row offset\n * @return {Array<number>} Row m from matrix a\n */\nmat.row = (a, m) => {\n  const s = (m - 1) * a.n;\n  return a.entries.slice(s, s + a.n);\n};\n\n/**\n * Get a column from a matrix as an array\n * @param {mat} a Matrix a\n * @param {number} n The column offset\n * @return {Array<number>} Column n from matrix a\n */\nmat.col = (a, n) => _vec_times(i => mat.get(a, (i + 1), n), a.m);\n\n/**\n * Add matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat} a + b\n */\nmat.add = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v + b.entries[i]);\n\n/**\n * Subtract matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat} a - b\n */\nmat.sub = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v - b.entries[i]);\n\n/**\n * Multiply matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat|false} ab or false if the matrices cannot be multiplied\n */\nmat.mul = (a, b) => {\n  if (a.n !== b.m) { return false; }\n  const result = mat(a.m, b.n);\n  for (let i = 1; i <= a.m; i++) {\n    for (let j = 1; j <= b.n; j++) {\n      mat.set(result, i, j, _vec_dot(mat.row(a, i), mat.col(b, j)));\n    }\n  }\n  return result;\n};\n\n/**\n * Multiply a matrix by a vector\n * @param {mat} a Matrix a\n * @param {vec2|vec3|number[]} b Vector b\n * @return {vec2|vec3|number[]|false} ab or false if the matrix and vector cannot be multiplied\n */\nmat.mulv = (a, b) => {\n  let n, bb, rt;\n  if (_vec_is_vec3(b)) {\n    bb = vec3.components(b);\n    n = 3;\n    rt = vec3.fromComponents;\n  } else if (_vec_is_vec2(b)) {\n    bb = vec2.components(b);\n    n = 2;\n    rt = vec2.fromComponents;\n  } else {\n    bb = b;\n    n = b.length ?? 0;\n    rt = v => v;\n  }\n  if (a.n !== n) { return false; }\n  const result = [];\n  for (let i = 1; i <= a.m; i++) {\n    result.push(_vec_dot(mat.row(a, i), bb));\n  }\n  return rt(result);\n}\n\n/**\n * Scale a matrix\n * @param {mat} a Matrix a\n * @param {number} b Scalar b\n * @return {mat} a * b\n */\nmat.scale = (a, b) => mat.map(a, v => v * b);\n\n/**\n * Transpose a matrix\n * @param {mat} a The matrix to transpose\n * @return {mat} A transposed matrix\n */\nmat.trans = a => mat(a.n, a.m, _vec_times(i => mat.col(a, (i + 1)), a.n).flat());\n\n/**\n * Get the minor of a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @return {mat|false} The (i, j) minor of matrix a or false if the matrix is not square\n */\nmat.minor = (a, i, j) => {\n  if (a.m !== a.n) { return false; }\n  const entries = [];\n  for (let ii = 1; ii <= a.m; ii++) {\n    if (ii === i) { continue; }\n    for (let jj = 1; jj <= a.n; jj++) {\n      if (jj === j) { continue; }\n      entries.push(mat.get(a, ii, jj));\n    }\n  }\n  return mat(a.m - 1, a.n - 1, entries);\n};\n\n/**\n * Get the determinant of a matrix\n * @param {mat} a Matrix a\n * @return {number|false} |a| or false if the matrix is not square\n */\nmat.det = a => {\n  if (a.m !== a.n) { return false; }\n  if (a.m === 1) {\n    return a.entries[0];\n  }\n  if (a.m === 2) {\n    return a.entries[0] * a.entries[3] - a.entries[1] * a.entries[2];\n  }\n  let total = 0, sign = 1;\n  for (let j = 1; j <= a.n; j++) {\n    total += sign * a.entries[j - 1] * mat.det(mat.minor(a, 1, j));\n    sign *= -1;\n  }\n  return total;\n};\n\n/**\n * Normalise a matrix\n * @param {mat} a The matrix to normalise\n * @return {mat|false} ^a or false if the matrix is not square\n */\nmat.nor = a => {\n  if (a.m !== a.n) { return false; }\n  const d = mat.det(a);\n  return mat.map(a, i => i * d);\n};\n\n/**\n * Get the adjugate of a matrix\n * @param {mat} a The matrix from which to get the adjugate\n * @return {mat} The adjugate of a\n */\nmat.adj = a => {\n  const minors = mat(a.m, a.n);\n  for (let i = 1; i <= a.m; i++) {\n    for (let j = 1; j <= a.n; j++) {\n      mat.set(minors, i, j, mat.det(mat.minor(a, i, j)));\n    }\n  }\n  const cofactors = mat.map(minors, (v, i) => v * (i % 2 ? -1 : 1));\n  return mat.trans(cofactors);\n};\n\n/**\n * Get the inverse of a matrix\n * @param {mat} a The matrix to invert\n * @return {mat|false} a^-1 or false if the matrix has no inverse\n */\nmat.inv = a => {\n  if (a.m !== a.n) { return false; }\n  const d = mat.det(a);\n  if (d === 0) { return false; }\n  return mat.scale(mat.adj(a), 1 / d);\n};\n\n/**\n * Check if two matrices are equal\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {boolean} True if matrices a and b are identical, false otherwise\n */\nmat.eq = (a, b) => a.m === b.m && a.n === b.n && mat.str(a) === mat.str(b);\n\n/**\n * Copy a matrix\n * @param {mat} a The matrix to copy\n * @return {mat} A copy of matrix a\n */\nmat.cpy = a => mat(a.m, a.n, [...a.entries]);\n\n/**\n * A function to call on each entry of a matrix\n * @callback matrixMapCallback\n * @param {number} value The entry value\n * @param {number} index The entry index\n * @param {Array<number>} entries The array of matrix entries\n * @return {number} The mapped entry\n */\n\n/**\n * Call a function on each entry of a matrix and build a new matrix from the results\n * @param {mat} a Matrix a\n * @param {matrixMapCallback} f The function to call on each entry of the matrix\n * @return {mat} Matrix a mapped through f\n */\nmat.map = (a, f) => mat(a.m, a.n, a.entries.map(f));\n\n/**\n * Convert a matrix into a string\n * @param {mat} a The matrix to convert\n * @param {string} [ms=', '] The separator string for columns\n * @param {string} [ns='\\n'] The separator string for rows\n * @return {string} A string representation of the matrix\n */\nmat.str = (a, ms = ', ', ns = '\\n') => _vec_chunk(a.entries, a.n).map(r => r.join(ms)).join(ns);\n\nif (true) {\n  module.exports = { vec2, vec3, mat };\n}\n\n\n//# sourceURL=webpack://@basementuniverse/animation/./node_modules/@basementuniverse/vec/vec.js?\n}");
                })
              )
              /******/
            };
            var __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
              var cachedModule = __webpack_module_cache__[moduleId];
              if (cachedModule !== void 0) {
                return cachedModule.exports;
              }
              var module2 = __webpack_module_cache__[moduleId] = {
                /******/
                // no module.id needed
                /******/
                // no module.loaded needed
                /******/
                exports: {}
                /******/
              };
              __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
              return module2.exports;
            }
            var __webpack_exports__ = __webpack_require__("./index.ts");
            return __webpack_exports__;
          })()
        );
      });
    }
  });

  // node_modules/@basementuniverse/camera/build/index.js
  var require_build2 = __commonJS({
    "node_modules/@basementuniverse/camera/build/index.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define([], factory);
        else {
          var a = factory();
          for (var i in a) (typeof exports === "object" ? exports : root)[i] = a[i];
        }
      })(self, () => {
        return (
          /******/
          (() => {
            var __webpack_modules__ = {
              /***/
              "./node_modules/@basementuniverse/vec/vec.js": (
                /*!***************************************************!*\
                  !*** ./node_modules/@basementuniverse/vec/vec.js ***!
                  \***************************************************/
                /***/
                ((module) => {
                  eval("/**\n * @overview A small vector and matrix library\n * @author Gordon Larrigan\n */\n\nconst _vec_times = (f, n) => Array(n).fill(0).map((_, i) => f(i));\nconst _vec_chunk = (a, n) => _vec_times(i => a.slice(i * n, i * n + n), Math.ceil(a.length / n));\nconst _vec_dot = (a, b) => a.reduce((n, v, i) => n + v * b[i], 0);\nconst _vec_is_vec2 = a => typeof a === 'object' && 'x' in a && 'y' in a;\nconst _vec_is_vec3 = a => typeof a === 'object' && 'x' in a && 'y' in a && 'z' in a;\n\n/**\n * A 2d vector\n * @typedef {Object} vec2\n * @property {number} x The x component of the vector\n * @property {number} y The y component of the vector\n */\n\n/**\n * Create a new 2d vector\n * @param {number|vec2} [x] The x component of the vector, or a vector to copy\n * @param {number} [y] The y component of the vector\n * @return {vec2} A new 2d vector\n * @example <caption>various ways to initialise a vector</caption>\n * let a = vec2(3, 2); // (3, 2)\n * let b = vec2(4);    // (4, 4)\n * let c = vec2(a);    // (3, 2)\n * let d = vec2();     // (0, 0)\n */\nconst vec2 = (x, y) => {\n  if (!x && !y) {\n    return { x: 0, y: 0 };\n  }\n  if (_vec_is_vec2(x)) {\n    return { x: x.x || 0, y: x.y || 0 };\n  }\n  return { x: x, y: y ?? x };\n};\n\n/**\n * Get the components of a vector as an array\n * @param {vec2} a The vector to get components from\n * @return {Array<number>} The vector components as an array\n */\nvec2.components = a => [a.x, a.y];\n\n/**\n * Create a vector from an array of components\n * @param {Array<number>} components The components of the vector\n * @return {vec2} A new vector\n */\nvec2.fromComponents = components => vec2(...components.slice(0, 2));\n\n/**\n * Return a unit vector (1, 0)\n * @return {vec2} A unit vector (1, 0)\n */\nvec2.ux = () => vec2(1, 0);\n\n/**\n * Return a unit vector (0, 1)\n * @return {vec2} A unit vector (0, 1)\n */\nvec2.uy = () => vec2(0, 1);\n\n/**\n * Add vectors\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a + b\n */\nvec2.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b) });\n\n/**\n * Subtract vectors\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a - b\n */\nvec2.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b) });\n\n/**\n * Scale a vector\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a * b\n */\nvec2.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b) });\n\n/**\n * Scale a vector by a scalar, alias for vec2.mul\n * @param {vec2} a Vector a\n * @param {number} b Scalar b\n * @return {vec2} a * b\n */\nvec2.scale = (a, b) => vec2.mul(a, b);\n\n/**\n * Divide a vector\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a / b\n */\nvec2.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b) });\n\n/**\n * Get the length of a vector\n * @param {vec2} a Vector a\n * @return {number} |a|\n */\nvec2.len = a => Math.sqrt(a.x * a.x + a.y * a.y);\n\n/**\n * Get the length of a vector using taxicab geometry\n * @param {vec2} a Vector a\n * @return {number} |a|\n */\nvec2.manhattan = a => Math.abs(a.x) + Math.abs(a.y);\n\n/**\n * Normalise a vector\n * @param {vec2} a The vector to normalise\n * @return {vec2} ^a\n */\nvec2.nor = a => {\n  let len = vec2.len(a);\n  return len ? { x: a.x / len, y: a.y / len } : vec2();\n};\n\n/**\n * Get a dot product of vectors\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {number} a \u2219 b\n */\nvec2.dot = (a, b) => a.x * b.x + a.y * b.y;\n\n/**\n * Rotate a vector by r radians\n * @param {vec2} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec2} A rotated vector\n */\nvec2.rot = (a, r) => {\n  let s = Math.sin(r),\n    c = Math.cos(r);\n  return { x: c * a.x - s * a.y, y: s * a.x + c * a.y };\n};\n\n/**\n * Fast method to rotate a vector by -90, 90 or 180 degrees\n * @param {vec2} a The vector to rotate\n * @param {number} r 1 for 90 degrees (cw), -1 for -90 degrees (ccw), 2 or -2 for 180 degrees\n * @return {vec2} A rotated vector\n */\nvec2.rotf = (a, r) => {\n  switch (r) {\n    case 1: return vec2(a.y, -a.x);\n    case -1: return vec2(-a.y, a.x);\n    case 2: case -2: return vec2(-a.x, -a.y);\n    default: return a;\n  }\n};\n\n/**\n * Scalar cross product of two vectors\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {number} a \xD7 b\n */\nvec2.cross = (a, b) => {\n  return a.x * b.y - a.y * b.x;\n};\n\n/**\n * Check if two vectors are equal\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {boolean} True if vectors a and b are equal, false otherwise\n */\nvec2.eq = (a, b) => a.x === b.x && a.y === b.y;\n\n/**\n * Get the angle of a vector\n * @param {vec2} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec2.rad = a => Math.atan2(a.y, a.x);\n\n/**\n * Copy a vector\n * @param {vec2} a The vector to copy\n * @return {vec2} A copy of vector a\n */\nvec2.cpy = a => vec2(a);\n\n/**\n * A function to call on each component of a 2d vector\n * @callback vec2MapCallback\n * @param {number} value The component value\n * @param {'x' | 'y'} label The component label (x or y)\n * @return {number} The mapped component\n */\n\n/**\n * Call a function on each component of a vector and build a new vector from the results\n * @param {vec2} a Vector a\n * @param {vec2MapCallback} f The function to call on each component of the vector\n * @return {vec2} Vector a mapped through f\n */\nvec2.map = (a, f) => ({ x: f(a.x, 'x'), y: f(a.y, 'y') });\n\n/**\n * Convert a vector into a string\n * @param {vec2} a The vector to convert\n * @param {string} [s=', '] The separator string\n * @return {string} A string representation of the vector\n */\nvec2.str = (a, s = ', ') => `${a.x}${s}${a.y}`;\n\n/**\n * Swizzle a vector with a string of component labels\n *\n * The string can contain:\n * - `x` or `y`\n * - `u` or `v` (aliases for `x` and `y`, respectively)\n * - `X`, `Y`, `U`, `V` (negated versions of the above)\n * - `0` or `1` (these will be passed through unchanged)\n * - `.` to return the component that would normally be at this position (or 0)\n *\n * Any other characters will default to 0\n * @param {vec2} a The vector to swizzle\n * @param {string} [s='..'] The swizzle string\n * @return {Array<number>} The swizzled components\n * @example <caption>swizzling a vector</caption>\n * let a = vec2(3, -2);\n * vec2.swiz(a, 'x');    // [3]\n * vec2.swiz(a, 'yx');   // [-2, 3]\n * vec2.swiz(a, 'xY');   // [3, 2]\n * vec2.swiz(a, 'Yy');   // [2, -2]\n * vec2.swiz(a, 'x.x');  // [3, -2, 3]\n * vec2.swiz(a, 'y01x'); // [-2, 0, 1, 3]\n */\nvec2.swiz = (a, s = '..') => {\n  const result = [];\n  s.split('').forEach((c, i) => {\n    switch (c) {\n      case 'x': case 'u': result.push(a.x); break;\n      case 'y': case 'v': result.push(a.y); break;\n      case 'X': case 'U': result.push(-a.x); break;\n      case 'Y': case 'V': result.push(-a.y); break;\n      case '0': result.push(0); break;\n      case '1': result.push(1); break;\n      case '.': result.push([a.x, a.y][i] ?? 0); break;\n      default: result.push(0);\n    }\n  });\n  return result;\n};\n\n/**\n * Polar coordinates for a 2d vector\n * @typedef {Object} polarCoordinates2d\n * @property {number} r The magnitude (radius) of the vector\n * @property {number} theta The angle of the vector\n */\n\n/**\n * Convert a vector into polar coordinates\n * @param {vec2} a The vector to convert\n * @return {polarCoordinates2d} The magnitude and angle of the vector\n */\nvec2.polar = a => ({ r: vec2.len(a), theta: Math.atan2(a.y, a.x) });\n\n/**\n * Convert polar coordinates into a vector\n * @param {number} r The magnitude (radius) of the vector\n * @param {number} theta The angle of the vector\n * @return {vec2} A vector with the given angle and magnitude\n */\nvec2.fromPolar = (r, theta) => vec2(r * Math.cos(theta), r * Math.sin(theta));\n\n/**\n * A 3d vector\n * @typedef {Object} vec3\n * @property {number} x The x component of the vector\n * @property {number} y The y component of the vector\n * @property {number} z The z component of the vector\n */\n\n/**\n * Create a new 3d vector\n * @param {number|vec3|vec2} [x] The x component of the vector, or a vector to copy\n * @param {number} [y] The y component of the vector, or the z component if x is a vec2\n * @param {number} [z] The z component of the vector\n * @return {vec3} A new 3d vector\n * @example <caption>various ways to initialise a vector</caption>\n * let a = vec3(3, 2, 1);       // (3, 2, 1)\n * let b = vec3(4, 5);          // (4, 5, 0)\n * let c = vec3(6);             // (6, 6, 6)\n * let d = vec3(a);             // (3, 2, 1)\n * let e = vec3();              // (0, 0, 0)\n * let f = vec3(vec2(1, 2), 3); // (1, 2, 3)\n * let g = vec3(vec2(4, 5));    // (4, 5, 0)\n */\nconst vec3 = (x, y, z) => {\n  if (!x && !y && !z) {\n    return { x: 0, y: 0, z: 0 };\n  }\n  if (_vec_is_vec3(x)) {\n    return { x: x.x || 0, y: x.y || 0, z: x.z || 0 };\n  }\n  if (_vec_is_vec2(x)) {\n    return { x: x.x || 0, y: x.y || 0, z: y || 0 };\n  }\n  return { x: x, y: y ?? x, z: z ?? x };\n};\n\n/**\n * Get the components of a vector as an array\n * @param {vec3} a The vector to get components from\n * @return {Array<number>} The vector components as an array\n */\nvec3.components = a => [a.x, a.y, a.z];\n\n/**\n * Create a vector from an array of components\n * @param {Array<number>} components The components of the vector\n * @return {vec3} A new vector\n */\nvec3.fromComponents = components => vec3(...components.slice(0, 3));\n\n/**\n * Return a unit vector (1, 0, 0)\n * @return {vec3} A unit vector (1, 0, 0)\n */\nvec3.ux = () => vec3(1, 0, 0);\n\n/**\n * Return a unit vector (0, 1, 0)\n * @return {vec3} A unit vector (0, 1, 0)\n */\nvec3.uy = () => vec3(0, 1, 0);\n\n/**\n * Return a unit vector (0, 0, 1)\n * @return {vec3} A unit vector (0, 0, 1)\n */\nvec3.uz = () => vec3(0, 0, 1);\n\n/**\n * Add vectors\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a + b\n */\nvec3.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b), z: a.z + (b.z ?? b) });\n\n/**\n * Subtract vectors\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a - b\n */\nvec3.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b), z: a.z - (b.z ?? b) });\n\n/**\n * Scale a vector\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a * b\n */\nvec3.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b), z: a.z * (b.z ?? b) });\n\n/**\n * Scale a vector by a scalar, alias for vec3.mul\n * @param {vec3} a Vector a\n * @param {number} b Scalar b\n * @return {vec3} a * b\n */\nvec3.scale = (a, b) => vec3.mul(a, b);\n\n/**\n * Divide a vector\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a / b\n */\nvec3.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b), z: a.z / (b.z ?? b) });\n\n/**\n * Get the length of a vector\n * @param {vec3} a Vector a\n * @return {number} |a|\n */\nvec3.len = a => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);\n\n/**\n * Get the length of a vector using taxicab geometry\n * @param {vec3} a Vector a\n * @return {number} |a|\n */\nvec3.manhattan = a => Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);\n\n/**\n * Normalise a vector\n * @param {vec3} a The vector to normalise\n * @return {vec3} ^a\n */\nvec3.nor = a => {\n  let len = vec3.len(a);\n  return len ? { x: a.x / len, y: a.y / len, z: a.z / len } : vec3();\n};\n\n/**\n * Get a dot product of vectors\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {number} a \u2219 b\n */\nvec3.dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;\n\n/**\n * Rotate a vector using a rotation matrix\n * @param {vec3} a The vector to rotate\n * @param {mat} m The rotation matrix\n * @return {vec3} A rotated vector\n */\nvec3.rot = (a, m) => vec3(\n  vec3.dot(vec3.fromComponents(mat.row(m, 1)), a),\n  vec3.dot(vec3.fromComponents(mat.row(m, 2)), a),\n  vec3.dot(vec3.fromComponents(mat.row(m, 3)), a)\n);\n\n/**\n * Rotate a vector by r radians around the x axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.rotx = (a, r) => vec3(\n  a.x,\n  a.y * Math.cos(r) - a.z * Math.sin(r),\n  a.y * Math.sin(r) + a.z * Math.cos(r)\n);\n\n/**\n * Rotate a vector by r radians around the y axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.roty = (a, r) => vec3(\n  a.x * Math.cos(r) + a.z * Math.sin(r),\n  a.y,\n  -a.x * Math.sin(r) + a.z * Math.cos(r)\n);\n\n/**\n * Rotate a vector by r radians around the z axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.rotz = (a, r) => vec3(\n  a.x * Math.cos(r) - a.y * Math.sin(r),\n  a.x * Math.sin(r) + a.y * Math.cos(r),\n  a.z\n);\n\n/**\n * Rotate a vector using a quaternion\n * @param {vec3} a The vector to rotate\n * @param {Array<number>} q The quaternion to rotate by\n * @return {vec3} A rotated vector\n */\nvec3.rotq = (v, q) => {\n  if (q.length !== 4) {\n    return vec3();\n  }\n\n  const d = Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);\n  if (d === 0) {\n    return vec3();\n  }\n\n  const uq = [q[0] / d, q[1] / d, q[2] / d, q[3] / d];\n  const u = vec3(...uq.slice(0, 3));\n  const s = uq[3];\n  return vec3.add(\n    vec3.add(\n      vec3.mul(u, 2 * vec3.dot(u, v)),\n      vec3.mul(v, s * s - vec3.dot(u, u))\n    ),\n    vec3.mul(vec3.cross(u, v), 2 * s)\n  );\n};\n\n/**\n * Rotate a vector using Euler angles\n * @param {vec3} a The vector to rotate\n * @param {vec3} e The Euler angles to rotate by\n * @return {vec3} A rotated vector\n */\nvec3.rota = (a, e) => vec3.rotz(vec3.roty(vec3.rotx(a, e.x), e.y), e.z);\n\n/**\n * Get the cross product of vectors\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {vec3} a \xD7 b\n */\nvec3.cross = (a, b) => vec3(\n  a.y * b.z - a.z * b.y,\n  a.z * b.x - a.x * b.z,\n  a.x * b.y - a.y * b.x\n);\n\n/**\n * Check if two vectors are equal\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {boolean} True if vectors a and b are equal, false otherwise\n */\nvec3.eq = (a, b) => a.x === b.x && a.y === b.y && a.z === b.z;\n\n/**\n * Get the angle of a vector from the x axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.radx = a => Math.atan2(a.z, a.y);\n\n/**\n * Get the angle of a vector from the y axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.rady = a => Math.atan2(a.x, a.y);\n\n/**\n * Get the angle of a vector from the z axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.radz = a => Math.atan2(a.y, a.z);\n\n/**\n * Copy a vector\n * @param {vec3} a The vector to copy\n * @return {vec3} A copy of vector a\n */\nvec3.cpy = a => vec3(a);\n\n/**\n * A function to call on each component of a 3d vector\n * @callback vec3MapCallback\n * @param {number} value The component value\n * @param {'x' | 'y' | 'z'} label The component label (x, y or z)\n * @return {number} The mapped component\n */\n\n/**\n * Call a function on each component of a vector and build a new vector from the results\n * @param {vec3} a Vector a\n * @param {vec3MapCallback} f The function to call on each component of the vector\n * @return {vec3} Vector a mapped through f\n */\nvec3.map = (a, f) => ({ x: f(a.x, 'x'), y: f(a.y, 'y'), z: f(a.z, 'z') });\n\n/**\n * Convert a vector into a string\n * @param {vec3} a The vector to convert\n * @param {string} [s=', '] The separator string\n * @return {string} A string representation of the vector\n */\nvec3.str = (a, s = ', ') => `${a.x}${s}${a.y}${s}${a.z}`;\n\n/**\n * Swizzle a vector with a string of component labels\n *\n * The string can contain:\n * - `x`, `y` or `z`\n * - `u`, `v` or `w` (aliases for `x`, `y` and `z`, respectively)\n * - `r`, `g` or `b` (aliases for `x`, `y` and `z`, respectively)\n * - `X`, `Y`, `Z`, `U`, `V`, `W`, `R`, `G`, `B` (negated versions of the above)\n * - `0` or `1` (these will be passed through unchanged)\n * - `.` to return the component that would normally be at this position (or 0)\n *\n * Any other characters will default to 0\n * @param {vec3} a The vector to swizzle\n * @param {string} [s='...'] The swizzle string\n * @return {Array<number>} The swizzled components\n * @example <caption>swizzling a vector</caption>\n * let a = vec3(3, -2, 1);\n * vec3.swiz(a, 'x');     // [3]\n * vec3.swiz(a, 'zyx');   // [1, -2, 3]\n * vec3.swiz(a, 'xYZ');   // [3, 2, -1]\n * vec3.swiz(a, 'Zzx');   // [-1, 1, 3]\n * vec3.swiz(a, 'x.x');   // [3, -2, 3]\n * vec3.swiz(a, 'y01zx'); // [-2, 0, 1, 1, 3]\n */\nvec3.swiz = (a, s = '...') => {\n  const result = [];\n  s.split('').forEach((c, i) => {\n    switch (c) {\n      case 'x': case 'u': case 'r': result.push(a.x); break;\n      case 'y': case 'v': case 'g': result.push(a.y); break;\n      case 'z': case 'w': case 'b': result.push(a.z); break;\n      case 'X': case 'U': case 'R': result.push(-a.x); break;\n      case 'Y': case 'V': case 'G': result.push(-a.y); break;\n      case 'Z': case 'W': case 'B': result.push(-a.z); break;\n      case '0': result.push(0); break;\n      case '1': result.push(1); break;\n      case '.': result.push([a.x, a.y, a.z][i] ?? 0); break;\n      default: result.push(0);\n    }\n  });\n  return result;\n};\n\n/**\n * Polar coordinates for a 3d vector\n * @typedef {Object} polarCoordinates3d\n * @property {number} r The magnitude (radius) of the vector\n * @property {number} theta The tilt angle of the vector\n * @property {number} phi The pan angle of the vector\n */\n\n/**\n * Convert a vector into polar coordinates\n * @param {vec3} a The vector to convert\n * @return {polarCoordinates3d} The magnitude, tilt and pan of the vector\n */\nvec3.polar = a => {\n  let r = vec3.len(a),\n    theta = Math.acos(a.y / r),\n    phi = Math.atan2(a.z, a.x);\n  return { r, theta, phi };\n};\n\n/**\n * Convert polar coordinates into a vector\n * @param {number} r The magnitude (radius) of the vector\n * @param {number} theta The tilt of the vector\n * @param {number} phi The pan of the vector\n * @return {vec3} A vector with the given angle and magnitude\n */\nvec3.fromPolar = (r, theta, phi) => {\n  const sinTheta = Math.sin(theta);\n  return vec3(\n    r * sinTheta * Math.cos(phi),\n    r * Math.cos(theta),\n    r * sinTheta * Math.sin(phi)\n  );\n};\n\n/**\n * A matrix\n * @typedef {Object} mat\n * @property {number} m The number of rows in the matrix\n * @property {number} n The number of columns in the matrix\n * @property {Array<number>} entries The matrix values\n */\n\n/**\n * Create a new matrix\n * @param {number} [m=4] The number of rows\n * @param {number} [n=4] The number of columns\n * @param {Array<number>} [entries=[]] Matrix values in reading order\n * @return {mat} A new matrix\n */\nconst mat = (m = 4, n = 4, entries = []) => ({\n  m, n,\n  entries: entries.concat(Array(m * n).fill(0)).slice(0, m * n)\n});\n\n/**\n * Get an identity matrix of size n\n * @param {number} n The size of the matrix\n * @return {mat} An identity matrix\n */\nmat.identity = n => mat(n, n, Array(n * n).fill(0).map((v, i) => +(Math.floor(i / n) === i % n)));\n\n/**\n * Get an entry from a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @return {number} The value at position (i, j) in matrix a\n */\nmat.get = (a, i, j) => a.entries[(j - 1) + (i - 1) * a.n];\n\n/**\n * Set an entry of a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @param {number} v The value to set in matrix a\n */\nmat.set = (a, i, j, v) => { a.entries[(j - 1) + (i - 1) * a.n] = v; };\n\n/**\n * Get a row from a matrix as an array\n * @param {mat} a Matrix a\n * @param {number} m The row offset\n * @return {Array<number>} Row m from matrix a\n */\nmat.row = (a, m) => {\n  const s = (m - 1) * a.n;\n  return a.entries.slice(s, s + a.n);\n};\n\n/**\n * Get a column from a matrix as an array\n * @param {mat} a Matrix a\n * @param {number} n The column offset\n * @return {Array<number>} Column n from matrix a\n */\nmat.col = (a, n) => _vec_times(i => mat.get(a, (i + 1), n), a.m);\n\n/**\n * Add matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat} a + b\n */\nmat.add = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v + b.entries[i]);\n\n/**\n * Subtract matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat} a - b\n */\nmat.sub = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v - b.entries[i]);\n\n/**\n * Multiply matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat|false} ab or false if the matrices cannot be multiplied\n */\nmat.mul = (a, b) => {\n  if (a.n !== b.m) { return false; }\n  const result = mat(a.m, b.n);\n  for (let i = 1; i <= a.m; i++) {\n    for (let j = 1; j <= b.n; j++) {\n      mat.set(result, i, j, _vec_dot(mat.row(a, i), mat.col(b, j)));\n    }\n  }\n  return result;\n};\n\n/**\n * Multiply a matrix by a vector\n * @param {mat} a Matrix a\n * @param {vec2|vec3|number[]} b Vector b\n * @return {vec2|vec3|number[]|false} ab or false if the matrix and vector cannot be multiplied\n */\nmat.mulv = (a, b) => {\n  let n, bb, rt;\n  if (_vec_is_vec3(b)) {\n    bb = vec3.components(b);\n    n = 3;\n    rt = vec3.fromComponents;\n  } else if (_vec_is_vec2(b)) {\n    bb = vec2.components(b);\n    n = 2;\n    rt = vec2.fromComponents;\n  } else {\n    bb = b;\n    n = b.length ?? 0;\n    rt = v => v;\n  }\n  if (a.n !== n) { return false; }\n  const result = [];\n  for (let i = 1; i <= a.m; i++) {\n    result.push(_vec_dot(mat.row(a, i), bb));\n  }\n  return rt(result);\n}\n\n/**\n * Scale a matrix\n * @param {mat} a Matrix a\n * @param {number} b Scalar b\n * @return {mat} a * b\n */\nmat.scale = (a, b) => mat.map(a, v => v * b);\n\n/**\n * Transpose a matrix\n * @param {mat} a The matrix to transpose\n * @return {mat} A transposed matrix\n */\nmat.trans = a => mat(a.n, a.m, _vec_times(i => mat.col(a, (i + 1)), a.n).flat());\n\n/**\n * Get the minor of a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @return {mat|false} The (i, j) minor of matrix a or false if the matrix is not square\n */\nmat.minor = (a, i, j) => {\n  if (a.m !== a.n) { return false; }\n  const entries = [];\n  for (let ii = 1; ii <= a.m; ii++) {\n    if (ii === i) { continue; }\n    for (let jj = 1; jj <= a.n; jj++) {\n      if (jj === j) { continue; }\n      entries.push(mat.get(a, ii, jj));\n    }\n  }\n  return mat(a.m - 1, a.n - 1, entries);\n};\n\n/**\n * Get the determinant of a matrix\n * @param {mat} a Matrix a\n * @return {number|false} |a| or false if the matrix is not square\n */\nmat.det = a => {\n  if (a.m !== a.n) { return false; }\n  if (a.m === 1) {\n    return a.entries[0];\n  }\n  if (a.m === 2) {\n    return a.entries[0] * a.entries[3] - a.entries[1] * a.entries[2];\n  }\n  let total = 0, sign = 1;\n  for (let j = 1; j <= a.n; j++) {\n    total += sign * a.entries[j - 1] * mat.det(mat.minor(a, 1, j));\n    sign *= -1;\n  }\n  return total;\n};\n\n/**\n * Normalise a matrix\n * @param {mat} a The matrix to normalise\n * @return {mat|false} ^a or false if the matrix is not square\n */\nmat.nor = a => {\n  if (a.m !== a.n) { return false; }\n  const d = mat.det(a);\n  return mat.map(a, i => i * d);\n};\n\n/**\n * Get the adjugate of a matrix\n * @param {mat} a The matrix from which to get the adjugate\n * @return {mat} The adjugate of a\n */\nmat.adj = a => {\n  const minors = mat(a.m, a.n);\n  for (let i = 1; i <= a.m; i++) {\n    for (let j = 1; j <= a.n; j++) {\n      mat.set(minors, i, j, mat.det(mat.minor(a, i, j)));\n    }\n  }\n  const cofactors = mat.map(minors, (v, i) => v * (i % 2 ? -1 : 1));\n  return mat.trans(cofactors);\n};\n\n/**\n * Get the inverse of a matrix\n * @param {mat} a The matrix to invert\n * @return {mat|false} a^-1 or false if the matrix has no inverse\n */\nmat.inv = a => {\n  if (a.m !== a.n) { return false; }\n  const d = mat.det(a);\n  if (d === 0) { return false; }\n  return mat.scale(mat.adj(a), 1 / d);\n};\n\n/**\n * Check if two matrices are equal\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {boolean} True if matrices a and b are identical, false otherwise\n */\nmat.eq = (a, b) => a.m === b.m && a.n === b.n && mat.str(a) === mat.str(b);\n\n/**\n * Copy a matrix\n * @param {mat} a The matrix to copy\n * @return {mat} A copy of matrix a\n */\nmat.cpy = a => mat(a.m, a.n, [...a.entries]);\n\n/**\n * A function to call on each entry of a matrix\n * @callback matrixMapCallback\n * @param {number} value The entry value\n * @param {number} index The entry index\n * @param {Array<number>} entries The array of matrix entries\n * @return {number} The mapped entry\n */\n\n/**\n * Call a function on each entry of a matrix and build a new matrix from the results\n * @param {mat} a Matrix a\n * @param {matrixMapCallback} f The function to call on each entry of the matrix\n * @return {mat} Matrix a mapped through f\n */\nmat.map = (a, f) => mat(a.m, a.n, a.entries.map(f));\n\n/**\n * Convert a matrix into a string\n * @param {mat} a The matrix to convert\n * @param {string} [ms=', '] The separator string for columns\n * @param {string} [ns='\\n'] The separator string for rows\n * @return {string} A string representation of the matrix\n */\nmat.str = (a, ms = ', ', ns = '\\n') => _vec_chunk(a.entries, a.n).map(r => r.join(ms)).join(ns);\n\nif (true) {\n  module.exports = { vec2, vec3, mat };\n}\n\n\n//# sourceURL=webpack://@basementuniverse/camera/./node_modules/@basementuniverse/vec/vec.js?");
                })
              ),
              /***/
              "./index.ts": (
                /*!******************!*\
                  !*** ./index.ts ***!
                  \******************/
                /***/
                ((__unused_webpack_module, exports, __webpack_require__) => {
                  "use strict";
                  eval('\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst vec_1 = __webpack_require__(/*! @basementuniverse/vec */ "./node_modules/@basementuniverse/vec/vec.js");\nfunction clamp(a, min = 0, max = 1) {\n    return a < min ? min : a > max ? max : a;\n}\nclass Camera {\n    constructor(position, options) {\n        this.size = (0, vec_1.vec2)();\n        this._actualPosition = (0, vec_1.vec2)();\n        this.targetPosition = (0, vec_1.vec2)();\n        this._actualScale = 1;\n        this.targetScale = 1;\n        this._actualPosition = position;\n        this.targetPosition = position;\n        this.options = Object.assign({}, Camera.DEFAULT_OPTIONS, options !== null && options !== void 0 ? options : {});\n    }\n    get position() {\n        return this.targetPosition;\n    }\n    set position(value) {\n        this.targetPosition = value;\n    }\n    set positionImmediate(value) {\n        this._actualPosition = value;\n        this.targetPosition = value;\n    }\n    get actualPosition() {\n        return this._actualPosition;\n    }\n    get scale() {\n        return this.targetScale;\n    }\n    get actualScale() {\n        return this._actualScale;\n    }\n    set scale(value) {\n        this.targetScale = clamp(value, this.options.minScale, this.options.maxScale);\n    }\n    set scaleImmediate(value) {\n        this._actualScale = clamp(value, this.options.minScale, this.options.maxScale);\n        this.targetScale = this._actualScale;\n    }\n    /**\n     * Get screen bounds based on the current camera position and scale\n     */\n    get bounds() {\n        return {\n            top: this._actualPosition.y - this.size.y / 2 / this._actualScale,\n            bottom: this._actualPosition.y + this.size.y / 2 / this._actualScale,\n            left: this._actualPosition.x - this.size.x / 2 / this._actualScale,\n            right: this._actualPosition.x + this.size.x / 2 / this._actualScale,\n        };\n    }\n    /**\n     * Convert a screen position to a world position\n     */\n    screenToWorld(position) {\n        const bounds = this.bounds;\n        return vec_1.vec2.add({ x: bounds.left, y: bounds.top }, vec_1.vec2.mul(position, 1 / this.actualScale));\n    }\n    /**\n     * Convert a world position to a screen position\n     */\n    worldToScreen(position) {\n        const bounds = this.bounds;\n        return vec_1.vec2.mul(vec_1.vec2.sub(position, { x: bounds.left, y: bounds.top }), this.actualScale);\n    }\n    /**\n     * Update the camera\n     */\n    update(screen) {\n        this.size = (0, vec_1.vec2)(screen);\n        // Maybe clamp position to bounds\n        if (this.options.bounds) {\n            const screenScaled = vec_1.vec2.map(vec_1.vec2.mul(this.size, 1 / this._actualScale), Math.ceil);\n            // If the scaled screen size is larger than allowed bounds, we resize\n            // the bounds to prevent jittering\n            const actualBounds = {\n                ...this.options.bounds,\n            };\n            if (screenScaled.x > actualBounds.right - actualBounds.left) {\n                const boundsWidth = actualBounds.right - actualBounds.left;\n                const halfDiff = (screenScaled.x - boundsWidth) / 2;\n                actualBounds.left -= halfDiff;\n                actualBounds.right += halfDiff;\n            }\n            if (screenScaled.y > actualBounds.bottom - actualBounds.top) {\n                const boundsHeight = actualBounds.bottom - actualBounds.top;\n                const halfDiff = (screenScaled.y - boundsHeight) / 2;\n                actualBounds.top -= halfDiff;\n                actualBounds.bottom += halfDiff;\n            }\n            const halfScreenScaled = vec_1.vec2.map(vec_1.vec2.mul(screenScaled, 1 / 2), Math.ceil);\n            const minPosition = (0, vec_1.vec2)(actualBounds.left + halfScreenScaled.x, actualBounds.top + halfScreenScaled.y);\n            const maxPosition = (0, vec_1.vec2)(actualBounds.right - halfScreenScaled.x, actualBounds.bottom - halfScreenScaled.y);\n            this.targetPosition.x = clamp(this.targetPosition.x, minPosition.x, maxPosition.x);\n            this.targetPosition.y = clamp(this.targetPosition.y, minPosition.y, maxPosition.y);\n        }\n        const d = vec_1.vec2.sub(this._actualPosition, this.targetPosition);\n        this._actualPosition = vec_1.vec2.add(this.position, vec_1.vec2.mul(d, this.options.moveEaseAmount));\n        const s = clamp(this.targetScale, this.options.minScale, this.options.maxScale);\n        this._actualScale =\n            s + (this._actualScale - s) * this.options.scaleEaseAmount;\n    }\n    /**\n     * Set the camera transforms on a canvas context\n     */\n    setTransforms(context) {\n        context.setTransform(1, 0, 0, 1, 0, 0);\n        context.translate(this.size.x / 2 - this._actualPosition.x * this._actualScale, this.size.y / 2 - this._actualPosition.y * this._actualScale);\n        context.scale(this._actualScale, this._actualScale);\n    }\n    /**\n     * Update the camera and then set transforms on a canvas context\n     */\n    draw(context, screen) {\n        this.update(screen);\n        this.setTransforms(context);\n    }\n}\nexports["default"] = Camera;\nCamera.DEFAULT_OPTIONS = {\n    allowScale: true,\n    minScale: 0.5,\n    maxScale: 4,\n    moveEaseAmount: 0.1,\n    scaleEaseAmount: 0.1,\n};\n\n\n//# sourceURL=webpack://@basementuniverse/camera/./index.ts?');
                })
              )
              /******/
            };
            var __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
              var cachedModule = __webpack_module_cache__[moduleId];
              if (cachedModule !== void 0) {
                return cachedModule.exports;
              }
              var module2 = __webpack_module_cache__[moduleId] = {
                /******/
                // no module.id needed
                /******/
                // no module.loaded needed
                /******/
                exports: {}
                /******/
              };
              __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
              return module2.exports;
            }
            var __webpack_exports__ = __webpack_require__("./index.ts");
            return __webpack_exports__;
          })()
        );
      });
    }
  });

  // node_modules/@basementuniverse/debug/build/index.js
  var require_build3 = __commonJS({
    "node_modules/@basementuniverse/debug/build/index.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define([], factory);
        else {
          var a = factory();
          for (var i in a) (typeof exports === "object" ? exports : root)[i] = a[i];
        }
      })(self, () => {
        return (
          /******/
          (() => {
            var __webpack_modules__ = {
              /***/
              "./node_modules/@basementuniverse/vec/vec.js": (
                /*!***************************************************!*\
                  !*** ./node_modules/@basementuniverse/vec/vec.js ***!
                  \***************************************************/
                /***/
                ((module) => {
                  eval("/**\n * @overview A small vector and matrix library\n * @author Gordon Larrigan\n */\n\nconst _vec_times = (f, n) => Array(n).fill(0).map((_, i) => f(i));\nconst _vec_chunk = (a, n) => _vec_times(i => a.slice(i * n, i * n + n), Math.ceil(a.length / n));\nconst _vec_dot = (a, b) => a.reduce((n, v, i) => n + v * b[i], 0);\nconst _vec_is_vec2 = a => typeof a === 'object' && 'x' in a && 'y' in a;\nconst _vec_is_vec3 = a => typeof a === 'object' && 'x' in a && 'y' in a && 'z' in a;\n\n/**\n * A 2d vector\n * @typedef {Object} vec2\n * @property {number} x The x component of the vector\n * @property {number} y The y component of the vector\n */\n\n/**\n * Create a new 2d vector\n * @param {number|vec2} [x] The x component of the vector, or a vector to copy\n * @param {number} [y] The y component of the vector\n * @return {vec2} A new 2d vector\n * @example <caption>various ways to initialise a vector</caption>\n * let a = vec2(3, 2); // (3, 2)\n * let b = vec2(4);    // (4, 4)\n * let c = vec2(a);    // (3, 2)\n * let d = vec2();     // (0, 0)\n */\nconst vec2 = (x, y) => {\n  if (!x && !y) {\n    return { x: 0, y: 0 };\n  }\n  if (_vec_is_vec2(x)) {\n    return { x: x.x || 0, y: x.y || 0 };\n  }\n  return { x: x, y: y ?? x };\n};\n\n/**\n * Get the components of a vector as an array\n * @param {vec2} a The vector to get components from\n * @return {Array<number>} The vector components as an array\n */\nvec2.components = a => [a.x, a.y];\n\n/**\n * Create a vector from an array of components\n * @param {Array<number>} components The components of the vector\n * @return {vec2} A new vector\n */\nvec2.fromComponents = components => vec2(...components.slice(0, 2));\n\n/**\n * Return a unit vector (1, 0)\n * @return {vec2} A unit vector (1, 0)\n */\nvec2.ux = () => vec2(1, 0);\n\n/**\n * Return a unit vector (0, 1)\n * @return {vec2} A unit vector (0, 1)\n */\nvec2.uy = () => vec2(0, 1);\n\n/**\n * Add vectors\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a + b\n */\nvec2.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b) });\n\n/**\n * Subtract vectors\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a - b\n */\nvec2.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b) });\n\n/**\n * Scale a vector\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a * b\n */\nvec2.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b) });\n\n/**\n * Scale a vector by a scalar, alias for vec2.mul\n * @param {vec2} a Vector a\n * @param {number} b Scalar b\n * @return {vec2} a * b\n */\nvec2.scale = (a, b) => vec2.mul(a, b);\n\n/**\n * Divide a vector\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a / b\n */\nvec2.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b) });\n\n/**\n * Get the length of a vector\n * @param {vec2} a Vector a\n * @return {number} |a|\n */\nvec2.len = a => Math.sqrt(a.x * a.x + a.y * a.y);\n\n/**\n * Get the length of a vector using taxicab geometry\n * @param {vec2} a Vector a\n * @return {number} |a|\n */\nvec2.manhattan = a => Math.abs(a.x) + Math.abs(a.y);\n\n/**\n * Normalise a vector\n * @param {vec2} a The vector to normalise\n * @return {vec2} ^a\n */\nvec2.nor = a => {\n  let len = vec2.len(a);\n  return len ? { x: a.x / len, y: a.y / len } : vec2();\n};\n\n/**\n * Get a dot product of vectors\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {number} a \u2219 b\n */\nvec2.dot = (a, b) => a.x * b.x + a.y * b.y;\n\n/**\n * Rotate a vector by r radians\n * @param {vec2} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec2} A rotated vector\n */\nvec2.rot = (a, r) => {\n  let s = Math.sin(r),\n    c = Math.cos(r);\n  return { x: c * a.x - s * a.y, y: s * a.x + c * a.y };\n};\n\n/**\n * Fast method to rotate a vector by -90, 90 or 180 degrees\n * @param {vec2} a The vector to rotate\n * @param {number} r 1 for 90 degrees (cw), -1 for -90 degrees (ccw), 2 or -2 for 180 degrees\n * @return {vec2} A rotated vector\n */\nvec2.rotf = (a, r) => {\n  switch (r) {\n    case 1: return vec2(a.y, -a.x);\n    case -1: return vec2(-a.y, a.x);\n    case 2: case -2: return vec2(-a.x, -a.y);\n    default: return a;\n  }\n};\n\n/**\n * Scalar cross product of two vectors\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {number} a \xD7 b\n */\nvec2.cross = (a, b) => {\n  return a.x * b.y - a.y * b.x;\n};\n\n/**\n * Check if two vectors are equal\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {boolean} True if vectors a and b are equal, false otherwise\n */\nvec2.eq = (a, b) => a.x === b.x && a.y === b.y;\n\n/**\n * Get the angle of a vector\n * @param {vec2} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec2.rad = a => Math.atan2(a.y, a.x);\n\n/**\n * Copy a vector\n * @param {vec2} a The vector to copy\n * @return {vec2} A copy of vector a\n */\nvec2.cpy = a => vec2(a);\n\n/**\n * A function to call on each component of a 2d vector\n * @callback vec2MapCallback\n * @param {number} value The component value\n * @param {'x' | 'y'} label The component label (x or y)\n * @return {number} The mapped component\n */\n\n/**\n * Call a function on each component of a vector and build a new vector from the results\n * @param {vec2} a Vector a\n * @param {vec2MapCallback} f The function to call on each component of the vector\n * @return {vec2} Vector a mapped through f\n */\nvec2.map = (a, f) => ({ x: f(a.x, 'x'), y: f(a.y, 'y') });\n\n/**\n * Convert a vector into a string\n * @param {vec2} a The vector to convert\n * @param {string} [s=', '] The separator string\n * @return {string} A string representation of the vector\n */\nvec2.str = (a, s = ', ') => `${a.x}${s}${a.y}`;\n\n/**\n * Swizzle a vector with a string of component labels\n *\n * The string can contain:\n * - `x` or `y`\n * - `u` or `v` (aliases for `x` and `y`, respectively)\n * - `X`, `Y`, `U`, `V` (negated versions of the above)\n * - `0` or `1` (these will be passed through unchanged)\n * - `.` to return the component that would normally be at this position (or 0)\n *\n * Any other characters will default to 0\n * @param {vec2} a The vector to swizzle\n * @param {string} [s='..'] The swizzle string\n * @return {Array<number>} The swizzled components\n * @example <caption>swizzling a vector</caption>\n * let a = vec2(3, -2);\n * vec2.swiz(a, 'x');    // [3]\n * vec2.swiz(a, 'yx');   // [-2, 3]\n * vec2.swiz(a, 'xY');   // [3, 2]\n * vec2.swiz(a, 'Yy');   // [2, -2]\n * vec2.swiz(a, 'x.x');  // [3, -2, 3]\n * vec2.swiz(a, 'y01x'); // [-2, 0, 1, 3]\n */\nvec2.swiz = (a, s = '..') => {\n  const result = [];\n  s.split('').forEach((c, i) => {\n    switch (c) {\n      case 'x': case 'u': result.push(a.x); break;\n      case 'y': case 'v': result.push(a.y); break;\n      case 'X': case 'U': result.push(-a.x); break;\n      case 'Y': case 'V': result.push(-a.y); break;\n      case '0': result.push(0); break;\n      case '1': result.push(1); break;\n      case '.': result.push([a.x, a.y][i] ?? 0); break;\n      default: result.push(0);\n    }\n  });\n  return result;\n};\n\n/**\n * Polar coordinates for a 2d vector\n * @typedef {Object} polarCoordinates2d\n * @property {number} r The magnitude (radius) of the vector\n * @property {number} theta The angle of the vector\n */\n\n/**\n * Convert a vector into polar coordinates\n * @param {vec2} a The vector to convert\n * @return {polarCoordinates2d} The magnitude and angle of the vector\n */\nvec2.polar = a => ({ r: vec2.len(a), theta: Math.atan2(a.y, a.x) });\n\n/**\n * Convert polar coordinates into a vector\n * @param {number} r The magnitude (radius) of the vector\n * @param {number} theta The angle of the vector\n * @return {vec2} A vector with the given angle and magnitude\n */\nvec2.fromPolar = (r, theta) => vec2(r * Math.cos(theta), r * Math.sin(theta));\n\n/**\n * A 3d vector\n * @typedef {Object} vec3\n * @property {number} x The x component of the vector\n * @property {number} y The y component of the vector\n * @property {number} z The z component of the vector\n */\n\n/**\n * Create a new 3d vector\n * @param {number|vec3|vec2} [x] The x component of the vector, or a vector to copy\n * @param {number} [y] The y component of the vector, or the z component if x is a vec2\n * @param {number} [z] The z component of the vector\n * @return {vec3} A new 3d vector\n * @example <caption>various ways to initialise a vector</caption>\n * let a = vec3(3, 2, 1);       // (3, 2, 1)\n * let b = vec3(4, 5);          // (4, 5, 0)\n * let c = vec3(6);             // (6, 6, 6)\n * let d = vec3(a);             // (3, 2, 1)\n * let e = vec3();              // (0, 0, 0)\n * let f = vec3(vec2(1, 2), 3); // (1, 2, 3)\n * let g = vec3(vec2(4, 5));    // (4, 5, 0)\n */\nconst vec3 = (x, y, z) => {\n  if (!x && !y && !z) {\n    return { x: 0, y: 0, z: 0 };\n  }\n  if (_vec_is_vec3(x)) {\n    return { x: x.x || 0, y: x.y || 0, z: x.z || 0 };\n  }\n  if (_vec_is_vec2(x)) {\n    return { x: x.x || 0, y: x.y || 0, z: y || 0 };\n  }\n  return { x: x, y: y ?? x, z: z ?? x };\n};\n\n/**\n * Get the components of a vector as an array\n * @param {vec3} a The vector to get components from\n * @return {Array<number>} The vector components as an array\n */\nvec3.components = a => [a.x, a.y, a.z];\n\n/**\n * Create a vector from an array of components\n * @param {Array<number>} components The components of the vector\n * @return {vec3} A new vector\n */\nvec3.fromComponents = components => vec3(...components.slice(0, 3));\n\n/**\n * Return a unit vector (1, 0, 0)\n * @return {vec3} A unit vector (1, 0, 0)\n */\nvec3.ux = () => vec3(1, 0, 0);\n\n/**\n * Return a unit vector (0, 1, 0)\n * @return {vec3} A unit vector (0, 1, 0)\n */\nvec3.uy = () => vec3(0, 1, 0);\n\n/**\n * Return a unit vector (0, 0, 1)\n * @return {vec3} A unit vector (0, 0, 1)\n */\nvec3.uz = () => vec3(0, 0, 1);\n\n/**\n * Add vectors\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a + b\n */\nvec3.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b), z: a.z + (b.z ?? b) });\n\n/**\n * Subtract vectors\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a - b\n */\nvec3.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b), z: a.z - (b.z ?? b) });\n\n/**\n * Scale a vector\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a * b\n */\nvec3.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b), z: a.z * (b.z ?? b) });\n\n/**\n * Scale a vector by a scalar, alias for vec3.mul\n * @param {vec3} a Vector a\n * @param {number} b Scalar b\n * @return {vec3} a * b\n */\nvec3.scale = (a, b) => vec3.mul(a, b);\n\n/**\n * Divide a vector\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a / b\n */\nvec3.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b), z: a.z / (b.z ?? b) });\n\n/**\n * Get the length of a vector\n * @param {vec3} a Vector a\n * @return {number} |a|\n */\nvec3.len = a => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);\n\n/**\n * Get the length of a vector using taxicab geometry\n * @param {vec3} a Vector a\n * @return {number} |a|\n */\nvec3.manhattan = a => Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);\n\n/**\n * Normalise a vector\n * @param {vec3} a The vector to normalise\n * @return {vec3} ^a\n */\nvec3.nor = a => {\n  let len = vec3.len(a);\n  return len ? { x: a.x / len, y: a.y / len, z: a.z / len } : vec3();\n};\n\n/**\n * Get a dot product of vectors\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {number} a \u2219 b\n */\nvec3.dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;\n\n/**\n * Rotate a vector using a rotation matrix\n * @param {vec3} a The vector to rotate\n * @param {mat} m The rotation matrix\n * @return {vec3} A rotated vector\n */\nvec3.rot = (a, m) => vec3(\n  vec3.dot(vec3.fromComponents(mat.row(m, 1)), a),\n  vec3.dot(vec3.fromComponents(mat.row(m, 2)), a),\n  vec3.dot(vec3.fromComponents(mat.row(m, 3)), a)\n);\n\n/**\n * Rotate a vector by r radians around the x axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.rotx = (a, r) => vec3(\n  a.x,\n  a.y * Math.cos(r) - a.z * Math.sin(r),\n  a.y * Math.sin(r) + a.z * Math.cos(r)\n);\n\n/**\n * Rotate a vector by r radians around the y axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.roty = (a, r) => vec3(\n  a.x * Math.cos(r) + a.z * Math.sin(r),\n  a.y,\n  -a.x * Math.sin(r) + a.z * Math.cos(r)\n);\n\n/**\n * Rotate a vector by r radians around the z axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.rotz = (a, r) => vec3(\n  a.x * Math.cos(r) - a.y * Math.sin(r),\n  a.x * Math.sin(r) + a.y * Math.cos(r),\n  a.z\n);\n\n/**\n * Rotate a vector using a quaternion\n * @param {vec3} a The vector to rotate\n * @param {Array<number>} q The quaternion to rotate by\n * @return {vec3} A rotated vector\n */\nvec3.rotq = (v, q) => {\n  if (q.length !== 4) {\n    return vec3();\n  }\n\n  const d = Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);\n  if (d === 0) {\n    return vec3();\n  }\n\n  const uq = [q[0] / d, q[1] / d, q[2] / d, q[3] / d];\n  const u = vec3(...uq.slice(0, 3));\n  const s = uq[3];\n  return vec3.add(\n    vec3.add(\n      vec3.mul(u, 2 * vec3.dot(u, v)),\n      vec3.mul(v, s * s - vec3.dot(u, u))\n    ),\n    vec3.mul(vec3.cross(u, v), 2 * s)\n  );\n};\n\n/**\n * Rotate a vector using Euler angles\n * @param {vec3} a The vector to rotate\n * @param {vec3} e The Euler angles to rotate by\n * @return {vec3} A rotated vector\n */\nvec3.rota = (a, e) => vec3.rotz(vec3.roty(vec3.rotx(a, e.x), e.y), e.z);\n\n/**\n * Get the cross product of vectors\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {vec3} a \xD7 b\n */\nvec3.cross = (a, b) => vec3(\n  a.y * b.z - a.z * b.y,\n  a.z * b.x - a.x * b.z,\n  a.x * b.y - a.y * b.x\n);\n\n/**\n * Check if two vectors are equal\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {boolean} True if vectors a and b are equal, false otherwise\n */\nvec3.eq = (a, b) => a.x === b.x && a.y === b.y && a.z === b.z;\n\n/**\n * Get the angle of a vector from the x axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.radx = a => Math.atan2(a.z, a.y);\n\n/**\n * Get the angle of a vector from the y axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.rady = a => Math.atan2(a.x, a.y);\n\n/**\n * Get the angle of a vector from the z axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.radz = a => Math.atan2(a.y, a.z);\n\n/**\n * Copy a vector\n * @param {vec3} a The vector to copy\n * @return {vec3} A copy of vector a\n */\nvec3.cpy = a => vec3(a);\n\n/**\n * A function to call on each component of a 3d vector\n * @callback vec3MapCallback\n * @param {number} value The component value\n * @param {'x' | 'y' | 'z'} label The component label (x, y or z)\n * @return {number} The mapped component\n */\n\n/**\n * Call a function on each component of a vector and build a new vector from the results\n * @param {vec3} a Vector a\n * @param {vec3MapCallback} f The function to call on each component of the vector\n * @return {vec3} Vector a mapped through f\n */\nvec3.map = (a, f) => ({ x: f(a.x, 'x'), y: f(a.y, 'y'), z: f(a.z, 'z') });\n\n/**\n * Convert a vector into a string\n * @param {vec3} a The vector to convert\n * @param {string} [s=', '] The separator string\n * @return {string} A string representation of the vector\n */\nvec3.str = (a, s = ', ') => `${a.x}${s}${a.y}${s}${a.z}`;\n\n/**\n * Swizzle a vector with a string of component labels\n *\n * The string can contain:\n * - `x`, `y` or `z`\n * - `u`, `v` or `w` (aliases for `x`, `y` and `z`, respectively)\n * - `r`, `g` or `b` (aliases for `x`, `y` and `z`, respectively)\n * - `X`, `Y`, `Z`, `U`, `V`, `W`, `R`, `G`, `B` (negated versions of the above)\n * - `0` or `1` (these will be passed through unchanged)\n * - `.` to return the component that would normally be at this position (or 0)\n *\n * Any other characters will default to 0\n * @param {vec3} a The vector to swizzle\n * @param {string} [s='...'] The swizzle string\n * @return {Array<number>} The swizzled components\n * @example <caption>swizzling a vector</caption>\n * let a = vec3(3, -2, 1);\n * vec3.swiz(a, 'x');     // [3]\n * vec3.swiz(a, 'zyx');   // [1, -2, 3]\n * vec3.swiz(a, 'xYZ');   // [3, 2, -1]\n * vec3.swiz(a, 'Zzx');   // [-1, 1, 3]\n * vec3.swiz(a, 'x.x');   // [3, -2, 3]\n * vec3.swiz(a, 'y01zx'); // [-2, 0, 1, 1, 3]\n */\nvec3.swiz = (a, s = '...') => {\n  const result = [];\n  s.split('').forEach((c, i) => {\n    switch (c) {\n      case 'x': case 'u': case 'r': result.push(a.x); break;\n      case 'y': case 'v': case 'g': result.push(a.y); break;\n      case 'z': case 'w': case 'b': result.push(a.z); break;\n      case 'X': case 'U': case 'R': result.push(-a.x); break;\n      case 'Y': case 'V': case 'G': result.push(-a.y); break;\n      case 'Z': case 'W': case 'B': result.push(-a.z); break;\n      case '0': result.push(0); break;\n      case '1': result.push(1); break;\n      case '.': result.push([a.x, a.y, a.z][i] ?? 0); break;\n      default: result.push(0);\n    }\n  });\n  return result;\n};\n\n/**\n * Polar coordinates for a 3d vector\n * @typedef {Object} polarCoordinates3d\n * @property {number} r The magnitude (radius) of the vector\n * @property {number} theta The tilt angle of the vector\n * @property {number} phi The pan angle of the vector\n */\n\n/**\n * Convert a vector into polar coordinates\n * @param {vec3} a The vector to convert\n * @return {polarCoordinates3d} The magnitude, tilt and pan of the vector\n */\nvec3.polar = a => {\n  let r = vec3.len(a),\n    theta = Math.acos(a.y / r),\n    phi = Math.atan2(a.z, a.x);\n  return { r, theta, phi };\n};\n\n/**\n * Convert polar coordinates into a vector\n * @param {number} r The magnitude (radius) of the vector\n * @param {number} theta The tilt of the vector\n * @param {number} phi The pan of the vector\n * @return {vec3} A vector with the given angle and magnitude\n */\nvec3.fromPolar = (r, theta, phi) => {\n  const sinTheta = Math.sin(theta);\n  return vec3(\n    r * sinTheta * Math.cos(phi),\n    r * Math.cos(theta),\n    r * sinTheta * Math.sin(phi)\n  );\n};\n\n/**\n * A matrix\n * @typedef {Object} mat\n * @property {number} m The number of rows in the matrix\n * @property {number} n The number of columns in the matrix\n * @property {Array<number>} entries The matrix values\n */\n\n/**\n * Create a new matrix\n * @param {number} [m=4] The number of rows\n * @param {number} [n=4] The number of columns\n * @param {Array<number>} [entries=[]] Matrix values in reading order\n * @return {mat} A new matrix\n */\nconst mat = (m = 4, n = 4, entries = []) => ({\n  m, n,\n  entries: entries.concat(Array(m * n).fill(0)).slice(0, m * n)\n});\n\n/**\n * Get an identity matrix of size n\n * @param {number} n The size of the matrix\n * @return {mat} An identity matrix\n */\nmat.identity = n => mat(n, n, Array(n * n).fill(0).map((v, i) => +(Math.floor(i / n) === i % n)));\n\n/**\n * Get an entry from a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @return {number} The value at position (i, j) in matrix a\n */\nmat.get = (a, i, j) => a.entries[(j - 1) + (i - 1) * a.n];\n\n/**\n * Set an entry of a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @param {number} v The value to set in matrix a\n */\nmat.set = (a, i, j, v) => { a.entries[(j - 1) + (i - 1) * a.n] = v; };\n\n/**\n * Get a row from a matrix as an array\n * @param {mat} a Matrix a\n * @param {number} m The row offset\n * @return {Array<number>} Row m from matrix a\n */\nmat.row = (a, m) => {\n  const s = (m - 1) * a.n;\n  return a.entries.slice(s, s + a.n);\n};\n\n/**\n * Get a column from a matrix as an array\n * @param {mat} a Matrix a\n * @param {number} n The column offset\n * @return {Array<number>} Column n from matrix a\n */\nmat.col = (a, n) => _vec_times(i => mat.get(a, (i + 1), n), a.m);\n\n/**\n * Add matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat} a + b\n */\nmat.add = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v + b.entries[i]);\n\n/**\n * Subtract matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat} a - b\n */\nmat.sub = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v - b.entries[i]);\n\n/**\n * Multiply matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat|false} ab or false if the matrices cannot be multiplied\n */\nmat.mul = (a, b) => {\n  if (a.n !== b.m) { return false; }\n  const result = mat(a.m, b.n);\n  for (let i = 1; i <= a.m; i++) {\n    for (let j = 1; j <= b.n; j++) {\n      mat.set(result, i, j, _vec_dot(mat.row(a, i), mat.col(b, j)));\n    }\n  }\n  return result;\n};\n\n/**\n * Multiply a matrix by a vector\n * @param {mat} a Matrix a\n * @param {vec2|vec3|number[]} b Vector b\n * @return {vec2|vec3|number[]|false} ab or false if the matrix and vector cannot be multiplied\n */\nmat.mulv = (a, b) => {\n  let n, bb, rt;\n  if (_vec_is_vec3(b)) {\n    bb = vec3.components(b);\n    n = 3;\n    rt = vec3.fromComponents;\n  } else if (_vec_is_vec2(b)) {\n    bb = vec2.components(b);\n    n = 2;\n    rt = vec2.fromComponents;\n  } else {\n    bb = b;\n    n = b.length ?? 0;\n    rt = v => v;\n  }\n  if (a.n !== n) { return false; }\n  const result = [];\n  for (let i = 1; i <= a.m; i++) {\n    result.push(_vec_dot(mat.row(a, i), bb));\n  }\n  return rt(result);\n}\n\n/**\n * Scale a matrix\n * @param {mat} a Matrix a\n * @param {number} b Scalar b\n * @return {mat} a * b\n */\nmat.scale = (a, b) => mat.map(a, v => v * b);\n\n/**\n * Transpose a matrix\n * @param {mat} a The matrix to transpose\n * @return {mat} A transposed matrix\n */\nmat.trans = a => mat(a.n, a.m, _vec_times(i => mat.col(a, (i + 1)), a.n).flat());\n\n/**\n * Get the minor of a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @return {mat|false} The (i, j) minor of matrix a or false if the matrix is not square\n */\nmat.minor = (a, i, j) => {\n  if (a.m !== a.n) { return false; }\n  const entries = [];\n  for (let ii = 1; ii <= a.m; ii++) {\n    if (ii === i) { continue; }\n    for (let jj = 1; jj <= a.n; jj++) {\n      if (jj === j) { continue; }\n      entries.push(mat.get(a, ii, jj));\n    }\n  }\n  return mat(a.m - 1, a.n - 1, entries);\n};\n\n/**\n * Get the determinant of a matrix\n * @param {mat} a Matrix a\n * @return {number|false} |a| or false if the matrix is not square\n */\nmat.det = a => {\n  if (a.m !== a.n) { return false; }\n  if (a.m === 1) {\n    return a.entries[0];\n  }\n  if (a.m === 2) {\n    return a.entries[0] * a.entries[3] - a.entries[1] * a.entries[2];\n  }\n  let total = 0, sign = 1;\n  for (let j = 1; j <= a.n; j++) {\n    total += sign * a.entries[j - 1] * mat.det(mat.minor(a, 1, j));\n    sign *= -1;\n  }\n  return total;\n};\n\n/**\n * Normalise a matrix\n * @param {mat} a The matrix to normalise\n * @return {mat|false} ^a or false if the matrix is not square\n */\nmat.nor = a => {\n  if (a.m !== a.n) { return false; }\n  const d = mat.det(a);\n  return mat.map(a, i => i * d);\n};\n\n/**\n * Get the adjugate of a matrix\n * @param {mat} a The matrix from which to get the adjugate\n * @return {mat} The adjugate of a\n */\nmat.adj = a => {\n  const minors = mat(a.m, a.n);\n  for (let i = 1; i <= a.m; i++) {\n    for (let j = 1; j <= a.n; j++) {\n      mat.set(minors, i, j, mat.det(mat.minor(a, i, j)));\n    }\n  }\n  const cofactors = mat.map(minors, (v, i) => v * (i % 2 ? -1 : 1));\n  return mat.trans(cofactors);\n};\n\n/**\n * Get the inverse of a matrix\n * @param {mat} a The matrix to invert\n * @return {mat|false} a^-1 or false if the matrix has no inverse\n */\nmat.inv = a => {\n  if (a.m !== a.n) { return false; }\n  const d = mat.det(a);\n  if (d === 0) { return false; }\n  return mat.scale(mat.adj(a), 1 / d);\n};\n\n/**\n * Check if two matrices are equal\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {boolean} True if matrices a and b are identical, false otherwise\n */\nmat.eq = (a, b) => a.m === b.m && a.n === b.n && mat.str(a) === mat.str(b);\n\n/**\n * Copy a matrix\n * @param {mat} a The matrix to copy\n * @return {mat} A copy of matrix a\n */\nmat.cpy = a => mat(a.m, a.n, [...a.entries]);\n\n/**\n * A function to call on each entry of a matrix\n * @callback matrixMapCallback\n * @param {number} value The entry value\n * @param {number} index The entry index\n * @param {Array<number>} entries The array of matrix entries\n * @return {number} The mapped entry\n */\n\n/**\n * Call a function on each entry of a matrix and build a new matrix from the results\n * @param {mat} a Matrix a\n * @param {matrixMapCallback} f The function to call on each entry of the matrix\n * @return {mat} Matrix a mapped through f\n */\nmat.map = (a, f) => mat(a.m, a.n, a.entries.map(f));\n\n/**\n * Convert a matrix into a string\n * @param {mat} a The matrix to convert\n * @param {string} [ms=', '] The separator string for columns\n * @param {string} [ns='\\n'] The separator string for rows\n * @return {string} A string representation of the matrix\n */\nmat.str = (a, ms = ', ', ns = '\\n') => _vec_chunk(a.entries, a.n).map(r => r.join(ms)).join(ns);\n\nif (true) {\n  module.exports = { vec2, vec3, mat };\n}\n\n\n//# sourceURL=webpack://@basementuniverse/debug/./node_modules/@basementuniverse/vec/vec.js?");
                })
              ),
              /***/
              "./index.ts": (
                /*!******************!*\
                  !*** ./index.ts ***!
                  \******************/
                /***/
                ((__unused_webpack_module, exports, __webpack_require__) => {
                  "use strict";
                  eval(`
Object.defineProperty(exports, "__esModule", ({ value: true }));
const vec_1 = __webpack_require__(/*! @basementuniverse/vec */ "./node_modules/@basementuniverse/vec/vec.js");
class Debug {
    constructor(options) {
        if (options === null || options === void 0 ? void 0 : options.defaultValue) {
            options.defaultValue = Object.assign({}, Debug.DEFAULT_OPTIONS.defaultValue, options.defaultValue);
        }
        if (options === null || options === void 0 ? void 0 : options.defaultChart) {
            options.defaultChart = Object.assign({}, Debug.DEFAULT_OPTIONS.defaultChart, options.defaultChart);
        }
        if (options === null || options === void 0 ? void 0 : options.defaultMarker) {
            options.defaultMarker = Object.assign({}, Debug.DEFAULT_OPTIONS.defaultMarker, options.defaultMarker);
        }
        if (options === null || options === void 0 ? void 0 : options.defaultBorder) {
            options.defaultBorder = Object.assign({}, Debug.DEFAULT_OPTIONS.defaultBorder, options.defaultBorder);
        }
        this.options = Object.assign({}, Debug.DEFAULT_OPTIONS, options !== null && options !== void 0 ? options : {});
        this.values = new Map();
        this.charts = new Map();
        this.markers = new Map();
        this.borders = new Map();
    }
    /**
     * Initialise the debug renderer for displaying values and markers
     */
    static initialise(options = {}) {
        if (Debug.instance !== undefined) {
            throw new Error('Debug has already been initialised');
        }
        Debug.instance = new Debug(options);
    }
    static getInstance() {
        if (Debug.instance === undefined) {
            throw new Error('Debug not properly initialised');
        }
        return Debug.instance;
    }
    /**
     * Show a debug value
     */
    static value(label, value, options) {
        var _a;
        const instance = Debug.getInstance();
        instance.values.set(label, Object.assign({}, instance.options.defaultValue, (_a = instance.values.get(label)) !== null && _a !== void 0 ? _a : {}, options !== null && options !== void 0 ? options : {}, { label, value }));
    }
    /**
     * Show a debug chart
     */
    static chart(label, value, options) {
        var _a, _b;
        const instance = Debug.getInstance();
        const currentChart = instance.charts.get(label);
        instance.charts.set(label, Object.assign({}, instance.options.defaultChart, currentChart !== null && currentChart !== void 0 ? currentChart : {}, options !== null && options !== void 0 ? options : {}, {
            label,
            values: [...((_a = currentChart === null || currentChart === void 0 ? void 0 : currentChart.values) !== null && _a !== void 0 ? _a : []), value].slice(-((_b = options === null || options === void 0 ? void 0 : options.valueBufferSize) !== null && _b !== void 0 ? _b : instance.options.defaultChart.valueBufferSize)),
        }));
    }
    /**
     * Remove a debug chart
     */
    static removeChart(label) {
        const instance = Debug.getInstance();
        instance.charts.delete(label);
    }
    /**
     * Show a marker in world or screen space
     */
    static marker(label, value, position, options) {
        var _a;
        const instance = Debug.getInstance();
        instance.markers.set(label, Object.assign({}, instance.options.defaultMarker, (_a = instance.markers.get(label)) !== null && _a !== void 0 ? _a : {}, options !== null && options !== void 0 ? options : {}, { label, value, position }));
    }
    /**
     * Show a border in world or screen space
     */
    static border(label, value, position, options) {
        var _a;
        if ((options === null || options === void 0 ? void 0 : options.borderShape) === 'circle' && (options === null || options === void 0 ? void 0 : options.radius) === undefined) {
            // Don't add the border if it's circular but we don't have a radius
            return;
        }
        if ((options === null || options === void 0 ? void 0 : options.borderShape) !== 'circle' && (options === null || options === void 0 ? void 0 : options.size) === undefined) {
            // Don't add the border if it's rectangular (default is rectangular) but
            // we don't have a size
            return;
        }
        const instance = Debug.getInstance();
        instance.borders.set(label, Object.assign({}, instance.options.defaultBorder, (_a = instance.borders.get(label)) !== null && _a !== void 0 ? _a : {}, options !== null && options !== void 0 ? options : {}, { label, value, position }));
    }
    /**
     * Render the debug values and markers onto a canvas
     */
    static draw(context, tags, clear = true) {
        const instance = Debug.getInstance();
        // Draw world-space markers & borders
        context.save();
        instance.markers.forEach(marker => {
            var _a;
            if (tags && !((_a = marker.tags) === null || _a === void 0 ? void 0 : _a.some(tag => tags.includes(tag)))) {
                return;
            }
            if (marker.space === 'world') {
                instance.drawMarker(context, marker);
            }
        });
        instance.borders.forEach(border => {
            var _a;
            if (tags && !((_a = border.tags) === null || _a === void 0 ? void 0 : _a.some(tag => tags.includes(tag)))) {
                return;
            }
            if (border.space === 'world') {
                instance.drawBorder(context, border);
            }
        });
        context.restore();
        // Draw values, charts and screen-space markers & borders
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        let position;
        let leftY = instance.options.margin;
        let rightY = instance.options.margin;
        const lineHeight = instance.options.lineHeight + instance.options.padding * 2;
        instance.values.forEach(value => {
            var _a, _b, _c, _d, _e, _f, _g;
            if (tags && !((_a = value.tags) === null || _a === void 0 ? void 0 : _a.some(tag => tags.includes(tag)))) {
                return;
            }
            switch (value.align) {
                case 'left':
                    position = (0, vec_1.vec2)(instance.options.margin, leftY);
                    leftY += lineHeight + instance.options.lineMargin;
                    break;
                case 'right':
                    position = (0, vec_1.vec2)(context.canvas.clientWidth - instance.options.margin, rightY);
                    rightY += lineHeight + instance.options.lineMargin;
                    break;
            }
            instance.drawLabel(context, Debug.prepareLabel((_b = value.label) !== null && _b !== void 0 ? _b : '', (_c = value.value) !== null && _c !== void 0 ? _c : '', value.showLabel, true), position, value.align, (_d = value.padding) !== null && _d !== void 0 ? _d : instance.options.padding, (_e = value.font) !== null && _e !== void 0 ? _e : instance.options.font, (_f = value.foregroundColour) !== null && _f !== void 0 ? _f : instance.options.foregroundColour, (_g = value.backgroundColour) !== null && _g !== void 0 ? _g : instance.options.backgroundColour);
        });
        instance.charts.forEach(chart => {
            var _a, _b, _c, _d, _e, _f;
            if (tags && !((_a = chart.tags) === null || _a === void 0 ? void 0 : _a.some(tag => tags.includes(tag)))) {
                return;
            }
            switch (chart.align) {
                case 'left':
                    position = (0, vec_1.vec2)(instance.options.margin, leftY);
                    leftY += lineHeight + instance.options.lineMargin;
                    break;
                case 'right':
                    position = (0, vec_1.vec2)(context.canvas.clientWidth - instance.options.margin, rightY);
                    rightY += lineHeight + instance.options.lineMargin;
                    break;
            }
            instance.drawChart(context, Debug.prepareLabel((_b = chart.label) !== null && _b !== void 0 ? _b : '', '', chart.showLabel, false), position, chart.align, (_c = chart.padding) !== null && _c !== void 0 ? _c : instance.options.padding, (_d = chart.font) !== null && _d !== void 0 ? _d : instance.options.font, (_e = chart.foregroundColour) !== null && _e !== void 0 ? _e : instance.options.foregroundColour, (_f = chart.backgroundColour) !== null && _f !== void 0 ? _f : instance.options.backgroundColour, chart.chartBackgroundColour, chart.values, chart.valueBufferSize, chart.valueBufferStride, chart.minValue, chart.maxValue, chart.barWidth, chart.barColours);
        });
        instance.markers.forEach(marker => {
            var _a;
            if (tags && !((_a = marker.tags) === null || _a === void 0 ? void 0 : _a.some(tag => tags.includes(tag)))) {
                return;
            }
            if (marker.space === 'screen') {
                instance.drawMarker(context, marker);
            }
        });
        instance.borders.forEach(border => {
            var _a;
            if (tags && !((_a = border.tags) === null || _a === void 0 ? void 0 : _a.some(tag => tags.includes(tag)))) {
                return;
            }
            if (border.space === 'screen') {
                instance.drawBorder(context, border);
            }
        });
        context.restore();
        // Clear values, markers & borders ready for next frame
        if (clear) {
            instance.values.clear();
            instance.markers.clear();
            instance.borders.clear();
        }
    }
    static clear(clearCharts = false) {
        const instance = Debug.getInstance();
        instance.values.clear();
        instance.markers.clear();
        if (clearCharts) {
            instance.charts.clear();
        }
        instance.borders.clear();
    }
    static prepareLabel(label, value, showLabel, showValue) {
        const actualLabel = showLabel && label ? label : '';
        const actualValue = !!showValue && value !== '' ? value.toString() : '';
        const separator = actualLabel && actualValue ? ': ' : '';
        return \`\${actualLabel}\${separator}\${actualValue}\`;
    }
    drawLabel(context, text, position, align, padding, font, foregroundColour, backgroundColour) {
        context.save();
        context.font = font;
        context.textAlign = 'left';
        context.textBaseline = 'top';
        const backgroundSize = {
            width: context.measureText(text).width + padding * 2,
            height: this.options.lineHeight + padding * 2,
        };
        const x = align === 'right' ? position.x - backgroundSize.width : position.x;
        // Draw background
        context.fillStyle = backgroundColour;
        context.fillRect(x - padding, position.y - padding, backgroundSize.width, backgroundSize.height);
        // Draw text
        context.fillStyle = foregroundColour;
        context.fillText(text, x, position.y);
        context.restore();
    }
    drawChart(context, label, position, align, padding, font, foregroundColour, backgroundColour, chartBackgroundColour, values, valueBufferSize, valueBufferStride, minValue, maxValue, barWidth, barColours) {
        var _a, _b;
        context.save();
        context.font = font;
        context.textBaseline = 'top';
        const chartSize = {
            width: barWidth * Math.ceil(valueBufferSize / Math.max(valueBufferStride, 1)),
            height: this.options.lineHeight + padding * 2,
        };
        const labelSize = {
            width: context.measureText(label).width,
            height: this.options.lineHeight,
        };
        const backgroundSize = {
            width: labelSize.width + padding + chartSize.width + padding * 2,
            height: this.options.lineHeight + padding * 2,
        };
        const x = align === 'right' ? position.x - backgroundSize.width : position.x;
        // Draw background
        context.fillStyle = backgroundColour;
        context.fillRect(x - padding, position.y - padding, backgroundSize.width, backgroundSize.height);
        // Draw label
        if (label) {
            context.fillStyle = foregroundColour;
            context.fillText(label, x, position.y);
        }
        // Draw chart
        if (chartBackgroundColour) {
            context.fillStyle = chartBackgroundColour;
            context.fillRect(x + padding + labelSize.width + padding, position.y - padding, chartSize.width, chartSize.height);
        }
        const range = maxValue - minValue;
        const barOffset = (0, vec_1.vec2)(x + padding + labelSize.width + padding, position.y - padding);
        for (let i = 0; i < Math.ceil(values.length / Math.max(valueBufferStride, 1)); i++) {
            let value;
            if (valueBufferStride <= 1) {
                value = values[i];
            }
            else {
                value =
                    values
                        .slice(i * valueBufferStride, (i + 1) * valueBufferStride)
                        .reduce((a, b) => a + b, 0) / valueBufferStride;
            }
            const barSize = (0, vec_1.vec2)(barWidth, Math.round((chartSize.height * (value - minValue)) / range));
            const barPosition = vec_1.vec2.add(barOffset, (0, vec_1.vec2)((values.length < valueBufferSize
                ? Math.ceil((valueBufferSize - values.length) / valueBufferStride) *
                    barWidth
                : 0) +
                i * barWidth, chartSize.height - barSize.y));
            const barColour = (_b = (barColours
                ? (_a = [...barColours].reverse().find(c => values[i] >= c.offset)) === null || _a === void 0 ? void 0 : _a.colour
                : undefined)) !== null && _b !== void 0 ? _b : foregroundColour;
            context.fillStyle = barColour;
            context.fillRect(barPosition.x, barPosition.y, barSize.x, barSize.y);
        }
        context.restore();
    }
    drawMarker(context, marker) {
        var _a, _b, _c, _d, _e, _f, _g;
        context.save();
        const position = (_a = marker.position) !== null && _a !== void 0 ? _a : (0, vec_1.vec2)();
        if (marker.showLabel || marker.showValue) {
            this.drawLabel(context, Debug.prepareLabel((_b = marker.label) !== null && _b !== void 0 ? _b : '', (_c = marker.value) !== null && _c !== void 0 ? _c : '', marker.showLabel, marker.showValue), vec_1.vec2.add(position !== null && position !== void 0 ? position : (0, vec_1.vec2)(), marker.labelOffset), 'left', (_d = marker.padding) !== null && _d !== void 0 ? _d : this.options.padding, (_e = marker.font) !== null && _e !== void 0 ? _e : this.options.font, (_f = marker.foregroundColour) !== null && _f !== void 0 ? _f : this.options.foregroundColour, (_g = marker.backgroundColour) !== null && _g !== void 0 ? _g : this.options.backgroundColour);
        }
        if (marker.showMarker) {
            if (marker.markerImage) {
                context.drawImage(marker.markerImage, position.x - marker.markerImage.width / 2, position.y - marker.markerImage.height / 2);
            }
            else {
                context.lineWidth = marker.markerLineWidth;
                context.strokeStyle = context.fillStyle = marker.markerColour;
                switch (marker.markerStyle) {
                    case 'x':
                        this.drawCross(context, position, marker.markerSize);
                        break;
                    case '+':
                        this.drawPlus(context, position, marker.markerSize);
                        break;
                    case '.':
                        this.drawDot(context, position, marker.markerSize);
                        break;
                }
            }
        }
        context.restore();
    }
    drawCross(context, position, size) {
        context.beginPath();
        const halfSize = size / 2;
        context.moveTo(position.x - halfSize, position.y - halfSize);
        context.lineTo(position.x + halfSize, position.y + halfSize);
        context.moveTo(position.x - halfSize, position.y + halfSize);
        context.lineTo(position.x + halfSize, position.y - halfSize);
        context.stroke();
    }
    drawPlus(context, position, size) {
        context.beginPath();
        const halfSize = size / 2;
        context.moveTo(position.x, position.y - halfSize);
        context.lineTo(position.x, position.y + halfSize);
        context.moveTo(position.x - halfSize, position.y);
        context.lineTo(position.x + halfSize, position.y);
        context.stroke();
    }
    drawDot(context, position, size) {
        context.beginPath();
        context.arc(position.x, position.y, size / 2, 0, Math.PI * 2);
        context.fill();
    }
    drawBorder(context, border) {
        var _a, _b, _c, _d, _e, _f, _g;
        context.save();
        const position = (_a = border.position) !== null && _a !== void 0 ? _a : (0, vec_1.vec2)();
        if (border.showLabel || border.showValue) {
            this.drawLabel(context, Debug.prepareLabel((_b = border.label) !== null && _b !== void 0 ? _b : '', (_c = border.value) !== null && _c !== void 0 ? _c : '', border.showLabel, border.showValue), vec_1.vec2.add(position !== null && position !== void 0 ? position : (0, vec_1.vec2)(), border.labelOffset), 'left', (_d = border.padding) !== null && _d !== void 0 ? _d : this.options.padding, (_e = border.font) !== null && _e !== void 0 ? _e : this.options.font, (_f = border.foregroundColour) !== null && _f !== void 0 ? _f : this.options.foregroundColour, (_g = border.backgroundColour) !== null && _g !== void 0 ? _g : this.options.backgroundColour);
        }
        if (border.showBorder) {
            context.lineWidth = border.borderWidth;
            context.strokeStyle = context.fillStyle = border.borderColour;
            switch (border.borderStyle) {
                case 'solid':
                    context.setLineDash([]);
                    break;
                case 'dashed':
                    context.setLineDash([border.borderDashSize, border.borderDashSize]);
                    break;
                case 'dotted':
                    context.setLineDash([border.borderWidth, border.borderWidth]);
                    break;
            }
            switch (border.borderShape) {
                case 'rectangle':
                    if (border.size) {
                        this.drawRectangle(context, position, border.size);
                    }
                    break;
                case 'circle':
                    if (border.radius) {
                        this.drawCircle(context, position, border.radius);
                    }
                    break;
            }
        }
        context.restore();
    }
    drawRectangle(context, position, size) {
        context.beginPath();
        context.rect(position.x, position.y, size.x, size.y);
        context.stroke();
    }
    drawCircle(context, position, radius) {
        context.beginPath();
        context.arc(position.x, position.y, radius, 0, Math.PI * 2);
        context.stroke();
    }
}
exports["default"] = Debug;
Debug.DEFAULT_OPTIONS = {
    margin: 10,
    padding: 4,
    font: '10pt Lucida Console, monospace',
    lineHeight: 12,
    lineMargin: 0,
    foregroundColour: '#fff',
    backgroundColour: '#333',
    defaultValue: {
        align: 'left',
        showLabel: true,
    },
    defaultChart: {
        values: [],
        valueBufferSize: 60,
        valueBufferStride: 1,
        minValue: 0,
        maxValue: 100,
        barWidth: 2,
        align: 'left',
        showLabel: true,
        chartBackgroundColour: '#222',
    },
    defaultMarker: {
        showLabel: true,
        showValue: true,
        showMarker: true,
        markerSize: 6,
        markerLineWidth: 2,
        markerStyle: 'x',
        markerColour: '#ccc',
        space: 'world',
        labelOffset: (0, vec_1.vec2)(10),
    },
    defaultBorder: {
        showLabel: true,
        showValue: true,
        showBorder: true,
        borderWidth: 1,
        borderStyle: 'solid',
        borderShape: 'rectangle',
        borderColour: '#ccc',
        borderDashSize: 5,
        space: 'world',
        labelOffset: (0, vec_1.vec2)(10),
    },
};


//# sourceURL=webpack://@basementuniverse/debug/./index.ts?`);
                })
              )
              /******/
            };
            var __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
              var cachedModule = __webpack_module_cache__[moduleId];
              if (cachedModule !== void 0) {
                return cachedModule.exports;
              }
              var module2 = __webpack_module_cache__[moduleId] = {
                /******/
                // no module.id needed
                /******/
                // no module.loaded needed
                /******/
                exports: {}
                /******/
              };
              __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
              return module2.exports;
            }
            var __webpack_exports__ = __webpack_require__("./index.ts");
            return __webpack_exports__;
          })()
        );
      });
    }
  });

  // node_modules/@basementuniverse/frame-timer/build/index.js
  var require_build4 = __commonJS({
    "node_modules/@basementuniverse/frame-timer/build/index.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define([], factory);
        else {
          var a = factory();
          for (var i in a) (typeof exports === "object" ? exports : root)[i] = a[i];
        }
      })(self, () => {
        return (
          /******/
          (() => {
            "use strict";
            var __webpack_modules__ = {
              /***/
              "./index.ts"(__unused_webpack_module, exports) {
                eval('{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nclass FrameTimer {\n    constructor(options) {\n        this._lastFrameElapsedTime = 0;\n        this._frameRate = 0;\n        this._frameCount = 0;\n        this.options = { ...FrameTimer.DEFAULT_OPTIONS, ...(options !== null && options !== void 0 ? options : {}) };\n        this._lastFrameTime = this._lastFrameCountTime = performance.now();\n    }\n    /**\n     * The elapsed time in seconds since the last frame.\n     */\n    get elapsedTime() {\n        return this._lastFrameElapsedTime;\n    }\n    /**\n     * The current framerate in frames per second (FPS). This value is updated\n     * once per second and represents the number of frames rendered in the last\n     * second.\n     */\n    get frameRate() {\n        return this._frameRate;\n    }\n    update() {\n        var _a;\n        const now = performance.now();\n        const elapsedTime = Math.min((now - this._lastFrameTime) / 1000, 1 / ((_a = this.options.minFPS) !== null && _a !== void 0 ? _a : 30));\n        // Calculate framerate\n        if (now - this._lastFrameCountTime >= 1000) {\n            this._lastFrameCountTime = now;\n            this._frameRate = this._frameCount;\n            this._frameCount = 0;\n        }\n        this._frameCount++;\n        this._lastFrameTime = now;\n        this._lastFrameElapsedTime = elapsedTime;\n    }\n}\nexports["default"] = FrameTimer;\nFrameTimer.DEFAULT_OPTIONS = {\n    minFPS: 30,\n};\n\n\n//# sourceURL=webpack://@basementuniverse/frame-timer/./index.ts?\n}');
              }
              /******/
            };
            var __webpack_exports__ = {};
            __webpack_modules__["./index.ts"](0, __webpack_exports__);
            return __webpack_exports__;
          })()
        );
      });
    }
  });

  // node_modules/@basementuniverse/input-manager/build/index.js
  var require_build5 = __commonJS({
    "node_modules/@basementuniverse/input-manager/build/index.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define([], factory);
        else {
          var a = factory();
          for (var i in a) (typeof exports === "object" ? exports : root)[i] = a[i];
        }
      })(self, () => {
        return (
          /******/
          (() => {
            var __webpack_modules__ = {
              /***/
              "./node_modules/@basementuniverse/vec/vec.js": (
                /*!***************************************************!*\
                  !*** ./node_modules/@basementuniverse/vec/vec.js ***!
                  \***************************************************/
                /***/
                ((module) => {
                  eval("/**\n * @overview A small vector and matrix library\n * @author Gordon Larrigan\n */\n\nconst _vec_times = (f, n) => Array(n).fill(0).map((_, i) => f(i));\nconst _vec_chunk = (a, n) => _vec_times(i => a.slice(i * n, i * n + n), Math.ceil(a.length / n));\nconst _vec_dot = (a, b) => a.reduce((n, v, i) => n + v * b[i], 0);\nconst _vec_is_vec2 = a => typeof a === 'object' && 'x' in a && 'y' in a;\nconst _vec_is_vec3 = a => typeof a === 'object' && 'x' in a && 'y' in a && 'z' in a;\n\n/**\n * A 2d vector\n * @typedef {Object} vec2\n * @property {number} x The x component of the vector\n * @property {number} y The y component of the vector\n */\n\n/**\n * Create a new 2d vector\n * @param {number|vec2} [x] The x component of the vector, or a vector to copy\n * @param {number} [y] The y component of the vector\n * @return {vec2} A new 2d vector\n * @example <caption>various ways to initialise a vector</caption>\n * let a = vec2(3, 2); // (3, 2)\n * let b = vec2(4);    // (4, 4)\n * let c = vec2(a);    // (3, 2)\n * let d = vec2();     // (0, 0)\n */\nconst vec2 = (x, y) => {\n  if (!x && !y) {\n    return { x: 0, y: 0 };\n  }\n  if (_vec_is_vec2(x)) {\n    return { x: x.x || 0, y: x.y || 0 };\n  }\n  return { x: x, y: y ?? x };\n};\n\n/**\n * Get the components of a vector as an array\n * @param {vec2} a The vector to get components from\n * @return {Array<number>} The vector components as an array\n */\nvec2.components = a => [a.x, a.y];\n\n/**\n * Create a vector from an array of components\n * @param {Array<number>} components The components of the vector\n * @return {vec2} A new vector\n */\nvec2.fromComponents = components => vec2(...components.slice(0, 2));\n\n/**\n * Return a unit vector (1, 0)\n * @return {vec2} A unit vector (1, 0)\n */\nvec2.ux = () => vec2(1, 0);\n\n/**\n * Return a unit vector (0, 1)\n * @return {vec2} A unit vector (0, 1)\n */\nvec2.uy = () => vec2(0, 1);\n\n/**\n * Add vectors\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a + b\n */\nvec2.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b) });\n\n/**\n * Subtract vectors\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a - b\n */\nvec2.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b) });\n\n/**\n * Scale a vector\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a * b\n */\nvec2.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b) });\n\n/**\n * Scale a vector by a scalar, alias for vec2.mul\n * @param {vec2} a Vector a\n * @param {number} b Scalar b\n * @return {vec2} a * b\n */\nvec2.scale = (a, b) => vec2.mul(a, b);\n\n/**\n * Divide a vector\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a / b\n */\nvec2.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b) });\n\n/**\n * Get the length of a vector\n * @param {vec2} a Vector a\n * @return {number} |a|\n */\nvec2.len = a => Math.sqrt(a.x * a.x + a.y * a.y);\n\n/**\n * Get the length of a vector using taxicab geometry\n * @param {vec2} a Vector a\n * @return {number} |a|\n */\nvec2.manhattan = a => Math.abs(a.x) + Math.abs(a.y);\n\n/**\n * Normalise a vector\n * @param {vec2} a The vector to normalise\n * @return {vec2} ^a\n */\nvec2.nor = a => {\n  let len = vec2.len(a);\n  return len ? { x: a.x / len, y: a.y / len } : vec2();\n};\n\n/**\n * Get a dot product of vectors\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {number} a \u2219 b\n */\nvec2.dot = (a, b) => a.x * b.x + a.y * b.y;\n\n/**\n * Rotate a vector by r radians\n * @param {vec2} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec2} A rotated vector\n */\nvec2.rot = (a, r) => {\n  let s = Math.sin(r),\n    c = Math.cos(r);\n  return { x: c * a.x - s * a.y, y: s * a.x + c * a.y };\n};\n\n/**\n * Fast method to rotate a vector by -90, 90 or 180 degrees\n * @param {vec2} a The vector to rotate\n * @param {number} r 1 for 90 degrees (cw), -1 for -90 degrees (ccw), 2 or -2 for 180 degrees\n * @return {vec2} A rotated vector\n */\nvec2.rotf = (a, r) => {\n  switch (r) {\n    case 1: return vec2(a.y, -a.x);\n    case -1: return vec2(-a.y, a.x);\n    case 2: case -2: return vec2(-a.x, -a.y);\n    default: return a;\n  }\n};\n\n/**\n * Scalar cross product of two vectors\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {number} a \xD7 b\n */\nvec2.cross = (a, b) => {\n  return a.x * b.y - a.y * b.x;\n};\n\n/**\n * Check if two vectors are equal\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {boolean} True if vectors a and b are equal, false otherwise\n */\nvec2.eq = (a, b) => a.x === b.x && a.y === b.y;\n\n/**\n * Get the angle of a vector\n * @param {vec2} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec2.rad = a => Math.atan2(a.y, a.x);\n\n/**\n * Copy a vector\n * @param {vec2} a The vector to copy\n * @return {vec2} A copy of vector a\n */\nvec2.cpy = a => vec2(a);\n\n/**\n * A function to call on each component of a 2d vector\n * @callback vec2MapCallback\n * @param {number} value The component value\n * @param {'x' | 'y'} label The component label (x or y)\n * @return {number} The mapped component\n */\n\n/**\n * Call a function on each component of a vector and build a new vector from the results\n * @param {vec2} a Vector a\n * @param {vec2MapCallback} f The function to call on each component of the vector\n * @return {vec2} Vector a mapped through f\n */\nvec2.map = (a, f) => ({ x: f(a.x, 'x'), y: f(a.y, 'y') });\n\n/**\n * Convert a vector into a string\n * @param {vec2} a The vector to convert\n * @param {string} [s=', '] The separator string\n * @return {string} A string representation of the vector\n */\nvec2.str = (a, s = ', ') => `${a.x}${s}${a.y}`;\n\n/**\n * Swizzle a vector with a string of component labels\n *\n * The string can contain:\n * - `x` or `y`\n * - `u` or `v` (aliases for `x` and `y`, respectively)\n * - `X`, `Y`, `U`, `V` (negated versions of the above)\n * - `0` or `1` (these will be passed through unchanged)\n * - `.` to return the component that would normally be at this position (or 0)\n *\n * Any other characters will default to 0\n * @param {vec2} a The vector to swizzle\n * @param {string} [s='..'] The swizzle string\n * @return {Array<number>} The swizzled components\n * @example <caption>swizzling a vector</caption>\n * let a = vec2(3, -2);\n * vec2.swiz(a, 'x');    // [3]\n * vec2.swiz(a, 'yx');   // [-2, 3]\n * vec2.swiz(a, 'xY');   // [3, 2]\n * vec2.swiz(a, 'Yy');   // [2, -2]\n * vec2.swiz(a, 'x.x');  // [3, -2, 3]\n * vec2.swiz(a, 'y01x'); // [-2, 0, 1, 3]\n */\nvec2.swiz = (a, s = '..') => {\n  const result = [];\n  s.split('').forEach((c, i) => {\n    switch (c) {\n      case 'x': case 'u': result.push(a.x); break;\n      case 'y': case 'v': result.push(a.y); break;\n      case 'X': case 'U': result.push(-a.x); break;\n      case 'Y': case 'V': result.push(-a.y); break;\n      case '0': result.push(0); break;\n      case '1': result.push(1); break;\n      case '.': result.push([a.x, a.y][i] ?? 0); break;\n      default: result.push(0);\n    }\n  });\n  return result;\n};\n\n/**\n * Polar coordinates for a 2d vector\n * @typedef {Object} polarCoordinates2d\n * @property {number} r The magnitude (radius) of the vector\n * @property {number} theta The angle of the vector\n */\n\n/**\n * Convert a vector into polar coordinates\n * @param {vec2} a The vector to convert\n * @return {polarCoordinates2d} The magnitude and angle of the vector\n */\nvec2.polar = a => ({ r: vec2.len(a), theta: Math.atan2(a.y, a.x) });\n\n/**\n * Convert polar coordinates into a vector\n * @param {number} r The magnitude (radius) of the vector\n * @param {number} theta The angle of the vector\n * @return {vec2} A vector with the given angle and magnitude\n */\nvec2.fromPolar = (r, theta) => vec2(r * Math.cos(theta), r * Math.sin(theta));\n\n/**\n * A 3d vector\n * @typedef {Object} vec3\n * @property {number} x The x component of the vector\n * @property {number} y The y component of the vector\n * @property {number} z The z component of the vector\n */\n\n/**\n * Create a new 3d vector\n * @param {number|vec3|vec2} [x] The x component of the vector, or a vector to copy\n * @param {number} [y] The y component of the vector, or the z component if x is a vec2\n * @param {number} [z] The z component of the vector\n * @return {vec3} A new 3d vector\n * @example <caption>various ways to initialise a vector</caption>\n * let a = vec3(3, 2, 1);       // (3, 2, 1)\n * let b = vec3(4, 5);          // (4, 5, 0)\n * let c = vec3(6);             // (6, 6, 6)\n * let d = vec3(a);             // (3, 2, 1)\n * let e = vec3();              // (0, 0, 0)\n * let f = vec3(vec2(1, 2), 3); // (1, 2, 3)\n * let g = vec3(vec2(4, 5));    // (4, 5, 0)\n */\nconst vec3 = (x, y, z) => {\n  if (!x && !y && !z) {\n    return { x: 0, y: 0, z: 0 };\n  }\n  if (_vec_is_vec3(x)) {\n    return { x: x.x || 0, y: x.y || 0, z: x.z || 0 };\n  }\n  if (_vec_is_vec2(x)) {\n    return { x: x.x || 0, y: x.y || 0, z: y || 0 };\n  }\n  return { x: x, y: y ?? x, z: z ?? x };\n};\n\n/**\n * Get the components of a vector as an array\n * @param {vec3} a The vector to get components from\n * @return {Array<number>} The vector components as an array\n */\nvec3.components = a => [a.x, a.y, a.z];\n\n/**\n * Create a vector from an array of components\n * @param {Array<number>} components The components of the vector\n * @return {vec3} A new vector\n */\nvec3.fromComponents = components => vec3(...components.slice(0, 3));\n\n/**\n * Return a unit vector (1, 0, 0)\n * @return {vec3} A unit vector (1, 0, 0)\n */\nvec3.ux = () => vec3(1, 0, 0);\n\n/**\n * Return a unit vector (0, 1, 0)\n * @return {vec3} A unit vector (0, 1, 0)\n */\nvec3.uy = () => vec3(0, 1, 0);\n\n/**\n * Return a unit vector (0, 0, 1)\n * @return {vec3} A unit vector (0, 0, 1)\n */\nvec3.uz = () => vec3(0, 0, 1);\n\n/**\n * Add vectors\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a + b\n */\nvec3.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b), z: a.z + (b.z ?? b) });\n\n/**\n * Subtract vectors\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a - b\n */\nvec3.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b), z: a.z - (b.z ?? b) });\n\n/**\n * Scale a vector\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a * b\n */\nvec3.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b), z: a.z * (b.z ?? b) });\n\n/**\n * Scale a vector by a scalar, alias for vec3.mul\n * @param {vec3} a Vector a\n * @param {number} b Scalar b\n * @return {vec3} a * b\n */\nvec3.scale = (a, b) => vec3.mul(a, b);\n\n/**\n * Divide a vector\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a / b\n */\nvec3.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b), z: a.z / (b.z ?? b) });\n\n/**\n * Get the length of a vector\n * @param {vec3} a Vector a\n * @return {number} |a|\n */\nvec3.len = a => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);\n\n/**\n * Get the length of a vector using taxicab geometry\n * @param {vec3} a Vector a\n * @return {number} |a|\n */\nvec3.manhattan = a => Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);\n\n/**\n * Normalise a vector\n * @param {vec3} a The vector to normalise\n * @return {vec3} ^a\n */\nvec3.nor = a => {\n  let len = vec3.len(a);\n  return len ? { x: a.x / len, y: a.y / len, z: a.z / len } : vec3();\n};\n\n/**\n * Get a dot product of vectors\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {number} a \u2219 b\n */\nvec3.dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;\n\n/**\n * Rotate a vector using a rotation matrix\n * @param {vec3} a The vector to rotate\n * @param {mat} m The rotation matrix\n * @return {vec3} A rotated vector\n */\nvec3.rot = (a, m) => vec3(\n  vec3.dot(vec3.fromComponents(mat.row(m, 1)), a),\n  vec3.dot(vec3.fromComponents(mat.row(m, 2)), a),\n  vec3.dot(vec3.fromComponents(mat.row(m, 3)), a)\n);\n\n/**\n * Rotate a vector by r radians around the x axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.rotx = (a, r) => vec3(\n  a.x,\n  a.y * Math.cos(r) - a.z * Math.sin(r),\n  a.y * Math.sin(r) + a.z * Math.cos(r)\n);\n\n/**\n * Rotate a vector by r radians around the y axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.roty = (a, r) => vec3(\n  a.x * Math.cos(r) + a.z * Math.sin(r),\n  a.y,\n  -a.x * Math.sin(r) + a.z * Math.cos(r)\n);\n\n/**\n * Rotate a vector by r radians around the z axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.rotz = (a, r) => vec3(\n  a.x * Math.cos(r) - a.y * Math.sin(r),\n  a.x * Math.sin(r) + a.y * Math.cos(r),\n  a.z\n);\n\n/**\n * Rotate a vector using a quaternion\n * @param {vec3} a The vector to rotate\n * @param {Array<number>} q The quaternion to rotate by\n * @return {vec3} A rotated vector\n */\nvec3.rotq = (v, q) => {\n  if (q.length !== 4) {\n    return vec3();\n  }\n\n  const d = Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);\n  if (d === 0) {\n    return vec3();\n  }\n\n  const uq = [q[0] / d, q[1] / d, q[2] / d, q[3] / d];\n  const u = vec3(...uq.slice(0, 3));\n  const s = uq[3];\n  return vec3.add(\n    vec3.add(\n      vec3.mul(u, 2 * vec3.dot(u, v)),\n      vec3.mul(v, s * s - vec3.dot(u, u))\n    ),\n    vec3.mul(vec3.cross(u, v), 2 * s)\n  );\n};\n\n/**\n * Rotate a vector using Euler angles\n * @param {vec3} a The vector to rotate\n * @param {vec3} e The Euler angles to rotate by\n * @return {vec3} A rotated vector\n */\nvec3.rota = (a, e) => vec3.rotz(vec3.roty(vec3.rotx(a, e.x), e.y), e.z);\n\n/**\n * Get the cross product of vectors\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {vec3} a \xD7 b\n */\nvec3.cross = (a, b) => vec3(\n  a.y * b.z - a.z * b.y,\n  a.z * b.x - a.x * b.z,\n  a.x * b.y - a.y * b.x\n);\n\n/**\n * Check if two vectors are equal\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {boolean} True if vectors a and b are equal, false otherwise\n */\nvec3.eq = (a, b) => a.x === b.x && a.y === b.y && a.z === b.z;\n\n/**\n * Get the angle of a vector from the x axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.radx = a => Math.atan2(a.z, a.y);\n\n/**\n * Get the angle of a vector from the y axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.rady = a => Math.atan2(a.x, a.y);\n\n/**\n * Get the angle of a vector from the z axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.radz = a => Math.atan2(a.y, a.z);\n\n/**\n * Copy a vector\n * @param {vec3} a The vector to copy\n * @return {vec3} A copy of vector a\n */\nvec3.cpy = a => vec3(a);\n\n/**\n * A function to call on each component of a 3d vector\n * @callback vec3MapCallback\n * @param {number} value The component value\n * @param {'x' | 'y' | 'z'} label The component label (x, y or z)\n * @return {number} The mapped component\n */\n\n/**\n * Call a function on each component of a vector and build a new vector from the results\n * @param {vec3} a Vector a\n * @param {vec3MapCallback} f The function to call on each component of the vector\n * @return {vec3} Vector a mapped through f\n */\nvec3.map = (a, f) => ({ x: f(a.x, 'x'), y: f(a.y, 'y'), z: f(a.z, 'z') });\n\n/**\n * Convert a vector into a string\n * @param {vec3} a The vector to convert\n * @param {string} [s=', '] The separator string\n * @return {string} A string representation of the vector\n */\nvec3.str = (a, s = ', ') => `${a.x}${s}${a.y}${s}${a.z}`;\n\n/**\n * Swizzle a vector with a string of component labels\n *\n * The string can contain:\n * - `x`, `y` or `z`\n * - `u`, `v` or `w` (aliases for `x`, `y` and `z`, respectively)\n * - `r`, `g` or `b` (aliases for `x`, `y` and `z`, respectively)\n * - `X`, `Y`, `Z`, `U`, `V`, `W`, `R`, `G`, `B` (negated versions of the above)\n * - `0` or `1` (these will be passed through unchanged)\n * - `.` to return the component that would normally be at this position (or 0)\n *\n * Any other characters will default to 0\n * @param {vec3} a The vector to swizzle\n * @param {string} [s='...'] The swizzle string\n * @return {Array<number>} The swizzled components\n * @example <caption>swizzling a vector</caption>\n * let a = vec3(3, -2, 1);\n * vec3.swiz(a, 'x');     // [3]\n * vec3.swiz(a, 'zyx');   // [1, -2, 3]\n * vec3.swiz(a, 'xYZ');   // [3, 2, -1]\n * vec3.swiz(a, 'Zzx');   // [-1, 1, 3]\n * vec3.swiz(a, 'x.x');   // [3, -2, 3]\n * vec3.swiz(a, 'y01zx'); // [-2, 0, 1, 1, 3]\n */\nvec3.swiz = (a, s = '...') => {\n  const result = [];\n  s.split('').forEach((c, i) => {\n    switch (c) {\n      case 'x': case 'u': case 'r': result.push(a.x); break;\n      case 'y': case 'v': case 'g': result.push(a.y); break;\n      case 'z': case 'w': case 'b': result.push(a.z); break;\n      case 'X': case 'U': case 'R': result.push(-a.x); break;\n      case 'Y': case 'V': case 'G': result.push(-a.y); break;\n      case 'Z': case 'W': case 'B': result.push(-a.z); break;\n      case '0': result.push(0); break;\n      case '1': result.push(1); break;\n      case '.': result.push([a.x, a.y, a.z][i] ?? 0); break;\n      default: result.push(0);\n    }\n  });\n  return result;\n};\n\n/**\n * Polar coordinates for a 3d vector\n * @typedef {Object} polarCoordinates3d\n * @property {number} r The magnitude (radius) of the vector\n * @property {number} theta The tilt angle of the vector\n * @property {number} phi The pan angle of the vector\n */\n\n/**\n * Convert a vector into polar coordinates\n * @param {vec3} a The vector to convert\n * @return {polarCoordinates3d} The magnitude, tilt and pan of the vector\n */\nvec3.polar = a => {\n  let r = vec3.len(a),\n    theta = Math.acos(a.y / r),\n    phi = Math.atan2(a.z, a.x);\n  return { r, theta, phi };\n};\n\n/**\n * Convert polar coordinates into a vector\n * @param {number} r The magnitude (radius) of the vector\n * @param {number} theta The tilt of the vector\n * @param {number} phi The pan of the vector\n * @return {vec3} A vector with the given angle and magnitude\n */\nvec3.fromPolar = (r, theta, phi) => {\n  const sinTheta = Math.sin(theta);\n  return vec3(\n    r * sinTheta * Math.cos(phi),\n    r * Math.cos(theta),\n    r * sinTheta * Math.sin(phi)\n  );\n};\n\n/**\n * A matrix\n * @typedef {Object} mat\n * @property {number} m The number of rows in the matrix\n * @property {number} n The number of columns in the matrix\n * @property {Array<number>} entries The matrix values\n */\n\n/**\n * Create a new matrix\n * @param {number} [m=4] The number of rows\n * @param {number} [n=4] The number of columns\n * @param {Array<number>} [entries=[]] Matrix values in reading order\n * @return {mat} A new matrix\n */\nconst mat = (m = 4, n = 4, entries = []) => ({\n  m, n,\n  entries: entries.concat(Array(m * n).fill(0)).slice(0, m * n)\n});\n\n/**\n * Get an identity matrix of size n\n * @param {number} n The size of the matrix\n * @return {mat} An identity matrix\n */\nmat.identity = n => mat(n, n, Array(n * n).fill(0).map((v, i) => +(Math.floor(i / n) === i % n)));\n\n/**\n * Get an entry from a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @return {number} The value at position (i, j) in matrix a\n */\nmat.get = (a, i, j) => a.entries[(j - 1) + (i - 1) * a.n];\n\n/**\n * Set an entry of a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @param {number} v The value to set in matrix a\n */\nmat.set = (a, i, j, v) => { a.entries[(j - 1) + (i - 1) * a.n] = v; };\n\n/**\n * Get a row from a matrix as an array\n * @param {mat} a Matrix a\n * @param {number} m The row offset\n * @return {Array<number>} Row m from matrix a\n */\nmat.row = (a, m) => {\n  const s = (m - 1) * a.n;\n  return a.entries.slice(s, s + a.n);\n};\n\n/**\n * Get a column from a matrix as an array\n * @param {mat} a Matrix a\n * @param {number} n The column offset\n * @return {Array<number>} Column n from matrix a\n */\nmat.col = (a, n) => _vec_times(i => mat.get(a, (i + 1), n), a.m);\n\n/**\n * Add matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat} a + b\n */\nmat.add = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v + b.entries[i]);\n\n/**\n * Subtract matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat} a - b\n */\nmat.sub = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v - b.entries[i]);\n\n/**\n * Multiply matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat|false} ab or false if the matrices cannot be multiplied\n */\nmat.mul = (a, b) => {\n  if (a.n !== b.m) { return false; }\n  const result = mat(a.m, b.n);\n  for (let i = 1; i <= a.m; i++) {\n    for (let j = 1; j <= b.n; j++) {\n      mat.set(result, i, j, _vec_dot(mat.row(a, i), mat.col(b, j)));\n    }\n  }\n  return result;\n};\n\n/**\n * Multiply a matrix by a vector\n * @param {mat} a Matrix a\n * @param {vec2|vec3|number[]} b Vector b\n * @return {vec2|vec3|number[]|false} ab or false if the matrix and vector cannot be multiplied\n */\nmat.mulv = (a, b) => {\n  let n, bb, rt;\n  if (_vec_is_vec3(b)) {\n    bb = vec3.components(b);\n    n = 3;\n    rt = vec3.fromComponents;\n  } else if (_vec_is_vec2(b)) {\n    bb = vec2.components(b);\n    n = 2;\n    rt = vec2.fromComponents;\n  } else {\n    bb = b;\n    n = b.length ?? 0;\n    rt = v => v;\n  }\n  if (a.n !== n) { return false; }\n  const result = [];\n  for (let i = 1; i <= a.m; i++) {\n    result.push(_vec_dot(mat.row(a, i), bb));\n  }\n  return rt(result);\n}\n\n/**\n * Scale a matrix\n * @param {mat} a Matrix a\n * @param {number} b Scalar b\n * @return {mat} a * b\n */\nmat.scale = (a, b) => mat.map(a, v => v * b);\n\n/**\n * Transpose a matrix\n * @param {mat} a The matrix to transpose\n * @return {mat} A transposed matrix\n */\nmat.trans = a => mat(a.n, a.m, _vec_times(i => mat.col(a, (i + 1)), a.n).flat());\n\n/**\n * Get the minor of a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @return {mat|false} The (i, j) minor of matrix a or false if the matrix is not square\n */\nmat.minor = (a, i, j) => {\n  if (a.m !== a.n) { return false; }\n  const entries = [];\n  for (let ii = 1; ii <= a.m; ii++) {\n    if (ii === i) { continue; }\n    for (let jj = 1; jj <= a.n; jj++) {\n      if (jj === j) { continue; }\n      entries.push(mat.get(a, ii, jj));\n    }\n  }\n  return mat(a.m - 1, a.n - 1, entries);\n};\n\n/**\n * Get the determinant of a matrix\n * @param {mat} a Matrix a\n * @return {number|false} |a| or false if the matrix is not square\n */\nmat.det = a => {\n  if (a.m !== a.n) { return false; }\n  if (a.m === 1) {\n    return a.entries[0];\n  }\n  if (a.m === 2) {\n    return a.entries[0] * a.entries[3] - a.entries[1] * a.entries[2];\n  }\n  let total = 0, sign = 1;\n  for (let j = 1; j <= a.n; j++) {\n    total += sign * a.entries[j - 1] * mat.det(mat.minor(a, 1, j));\n    sign *= -1;\n  }\n  return total;\n};\n\n/**\n * Normalise a matrix\n * @param {mat} a The matrix to normalise\n * @return {mat|false} ^a or false if the matrix is not square\n */\nmat.nor = a => {\n  if (a.m !== a.n) { return false; }\n  const d = mat.det(a);\n  return mat.map(a, i => i * d);\n};\n\n/**\n * Get the adjugate of a matrix\n * @param {mat} a The matrix from which to get the adjugate\n * @return {mat} The adjugate of a\n */\nmat.adj = a => {\n  const minors = mat(a.m, a.n);\n  for (let i = 1; i <= a.m; i++) {\n    for (let j = 1; j <= a.n; j++) {\n      mat.set(minors, i, j, mat.det(mat.minor(a, i, j)));\n    }\n  }\n  const cofactors = mat.map(minors, (v, i) => v * (i % 2 ? -1 : 1));\n  return mat.trans(cofactors);\n};\n\n/**\n * Get the inverse of a matrix\n * @param {mat} a The matrix to invert\n * @return {mat|false} a^-1 or false if the matrix has no inverse\n */\nmat.inv = a => {\n  if (a.m !== a.n) { return false; }\n  const d = mat.det(a);\n  if (d === 0) { return false; }\n  return mat.scale(mat.adj(a), 1 / d);\n};\n\n/**\n * Check if two matrices are equal\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {boolean} True if matrices a and b are identical, false otherwise\n */\nmat.eq = (a, b) => a.m === b.m && a.n === b.n && mat.str(a) === mat.str(b);\n\n/**\n * Copy a matrix\n * @param {mat} a The matrix to copy\n * @return {mat} A copy of matrix a\n */\nmat.cpy = a => mat(a.m, a.n, [...a.entries]);\n\n/**\n * A function to call on each entry of a matrix\n * @callback matrixMapCallback\n * @param {number} value The entry value\n * @param {number} index The entry index\n * @param {Array<number>} entries The array of matrix entries\n * @return {number} The mapped entry\n */\n\n/**\n * Call a function on each entry of a matrix and build a new matrix from the results\n * @param {mat} a Matrix a\n * @param {matrixMapCallback} f The function to call on each entry of the matrix\n * @return {mat} Matrix a mapped through f\n */\nmat.map = (a, f) => mat(a.m, a.n, a.entries.map(f));\n\n/**\n * Convert a matrix into a string\n * @param {mat} a The matrix to convert\n * @param {string} [ms=', '] The separator string for columns\n * @param {string} [ns='\\n'] The separator string for rows\n * @return {string} A string representation of the matrix\n */\nmat.str = (a, ms = ', ', ns = '\\n') => _vec_chunk(a.entries, a.n).map(r => r.join(ms)).join(ns);\n\nif (true) {\n  module.exports = { vec2, vec3, mat };\n}\n\n\n//# sourceURL=webpack://@basementuniverse/input-manager/./node_modules/@basementuniverse/vec/vec.js?");
                })
              ),
              /***/
              "./index.ts": (
                /*!******************!*\
                  !*** ./index.ts ***!
                  \******************/
                /***/
                ((__unused_webpack_module, exports, __webpack_require__) => {
                  "use strict";
                  eval(`
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MouseButton = void 0;
const vec_1 = __webpack_require__(/*! @basementuniverse/vec */ "./node_modules/@basementuniverse/vec/vec.js");
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Middle"] = 1] = "Middle";
    MouseButton[MouseButton["Right"] = 2] = "Right";
})(MouseButton = exports.MouseButton || (exports.MouseButton = {}));
class InputManager {
    constructor(options) {
        this.keyboardState = InputManager.initialKeyboardState();
        this.previousKeyboardState = InputManager.initialKeyboardState();
        this.mouseState = InputManager.initialMouseState();
        this.previousMouseState = InputManager.initialMouseState();
        this.options = Object.assign({}, InputManager.DEFAULT_OPTIONS, options !== null && options !== void 0 ? options : {});
        // Set up event handlers
        if (this.options.mouse) {
            this.options.element.addEventListener('mousedown', e => {
                this.mouseState.buttons[e.button] = true;
            });
            this.options.element.addEventListener('mouseup', e => {
                this.mouseState.buttons[e.button] =
                    false;
            });
            this.options.element.addEventListener('touchstart', e => {
                const touch = e.touches[0];
                this.mouseState.position.x = touch.clientX;
                this.mouseState.position.y = touch.clientY;
                this.mouseState.buttons[0] = true;
            });
            this.options.element.addEventListener('touchend', e => {
                const touch = e.changedTouches[0];
                this.mouseState.position.x = touch.clientX;
                this.mouseState.position.y = touch.clientY;
                this.mouseState.buttons[0] = false;
            });
            this.options.element.addEventListener('touchmove', e => {
                const touch = e.touches[0];
                this.mouseState.position.x = touch.clientX;
                this.mouseState.position.y = touch.clientY;
            });
            this.options.element.addEventListener('mousemove', e => {
                this.mouseState.position.x = e.offsetX;
                this.mouseState.position.y = e.offsetY;
                this.mouseState.hoveredElement = e.target;
            });
            if (this.options.mouseWheel) {
                window.addEventListener('wheel', e => {
                    this.mouseState.wheel = e.deltaY > 0 ? 1 : -1;
                });
            }
        }
        if (this.options.keyboard) {
            window.addEventListener('keydown', e => {
                this.keyboardState[e.code] = true;
            });
            window.addEventListener('keyup', e => {
                this.keyboardState[e.code] = false;
            });
        }
        // Prevent the context menu from appearing on right-click
        if (this.options.preventContextMenu) {
            this.options.element.addEventListener('contextmenu', e => {
                e.preventDefault();
            });
        }
    }
    /**
     * Initialise the input manager for managing mouse and keyboard input
     */
    static initialise(options) {
        if (InputManager.instance !== undefined) {
            throw new Error('Input manager already initialised');
        }
        InputManager.instance = new InputManager(options);
    }
    static getInstance() {
        if (InputManager.instance === undefined) {
            throw new Error('Input manager not properly initialised');
        }
        return InputManager.instance;
    }
    static initialKeyboardState() {
        return {};
    }
    static initialMouseState() {
        return {
            buttons: {
                [MouseButton.Left]: false,
                [MouseButton.Middle]: false,
                [MouseButton.Right]: false,
            },
            position: (0, vec_1.vec2)(),
            wheel: 0,
            hoveredElement: null,
        };
    }
    static copyKeyboardState(state) {
        return Object.assign({}, state);
    }
    static copyMouseState(state) {
        return {
            buttons: Object.assign({}, state.buttons),
            position: vec_1.vec2.cpy(state.position),
            wheel: state.wheel,
            hoveredElement: state.hoveredElement,
        };
    }
    /**
     * Update the state of the input devices
     */
    static update() {
        const instance = InputManager.getInstance();
        instance.previousKeyboardState = this.copyKeyboardState(instance.keyboardState);
        instance.previousMouseState = this.copyMouseState(instance.mouseState);
        instance.mouseState.wheel = 0;
    }
    /**
     * Check if a key is currently pressed down
     */
    static keyDown(code) {
        const instance = InputManager.getInstance();
        // Check if any key is down
        if (code === undefined) {
            for (const k in instance.keyboardState) {
                if (instance.keyboardState[k]) {
                    return true;
                }
            }
            return false;
        }
        return !!instance.keyboardState[code];
    }
    /**
     * Check if a key has been pressed since the last frame
     */
    static keyPressed(code) {
        const instance = InputManager.getInstance();
        // Check if any key was pressed
        if (code === undefined) {
            for (const k in instance.keyboardState) {
                if (instance.keyboardState[k] &&
                    (!(k in instance.previousKeyboardState) ||
                        !instance.previousKeyboardState[k])) {
                    return true;
                }
            }
            return false;
        }
        return (!!instance.keyboardState[code] && !instance.previousKeyboardState[code]);
    }
    /**
     * Check if a key has been released since the last frame
     */
    static keyReleased(code) {
        const instance = InputManager.getInstance();
        // Check if any key was released
        if (code === undefined) {
            for (const k in instance.keyboardState) {
                if (!instance.keyboardState[k] && !!instance.previousKeyboardState[k]) {
                    return true;
                }
            }
            return false;
        }
        return (!instance.keyboardState[code] && !!instance.previousKeyboardState[code]);
    }
    /**
     * Check if a mouse button is currently pressed down
     */
    static mouseDown(button) {
        const instance = InputManager.getInstance();
        // Check if any button is down
        if (button === undefined) {
            for (const b in instance.mouseState.buttons) {
                const currentButton = +b;
                if (instance.mouseState.buttons[currentButton]) {
                    return true;
                }
            }
            return false;
        }
        return !!instance.mouseState.buttons[button];
    }
    /**
     * Check if a mouse button has been pressed since the last frame
     */
    static mousePressed(button) {
        const instance = InputManager.getInstance();
        // Check if any button was pressed
        if (button === undefined) {
            for (const b in instance.mouseState.buttons) {
                const currentButton = +b;
                if (instance.mouseState.buttons[currentButton] &&
                    (!(b in instance.previousMouseState.buttons) ||
                        !instance.previousMouseState.buttons[currentButton])) {
                    return true;
                }
            }
            return false;
        }
        return (!!instance.mouseState.buttons[button] &&
            !instance.previousMouseState.buttons[button]);
    }
    /**
     * Check if a mouse button has been released since the last frame
     */
    static mouseReleased(button) {
        const instance = InputManager.getInstance();
        // Check if any button was released
        if (button === undefined) {
            for (const b in instance.mouseState.buttons) {
                const currentButton = +b;
                if (!instance.mouseState.buttons[currentButton] &&
                    !!instance.previousMouseState.buttons[currentButton]) {
                    return true;
                }
            }
            return false;
        }
        return (!instance.mouseState.buttons[button] &&
            !!instance.previousMouseState.buttons[button]);
    }
    /**
     * Check if the mousewheel is scrolling up
     */
    static mouseWheelUp() {
        const instance = InputManager.getInstance();
        return instance.mouseState.wheel > 0;
    }
    /**
     * Check if the mousewheel is scrolling down
     */
    static mouseWheelDown() {
        const instance = InputManager.getInstance();
        return instance.mouseState.wheel < 0;
    }
    /**
     * Get the current mouse position in screen-space
     */
    static get mousePosition() {
        const instance = InputManager.getInstance();
        return instance.mouseState.position;
    }
    /**
     * Get the currently hovered element
     */
    static get hoveredElement() {
        var _a;
        const instance = InputManager.getInstance();
        return (_a = instance.mouseState.hoveredElement) !== null && _a !== void 0 ? _a : null;
    }
}
exports["default"] = InputManager;
InputManager.DEFAULT_OPTIONS = {
    element: window,
    mouse: true,
    mouseWheel: true,
    keyboard: true,
    preventContextMenu: false,
};


//# sourceURL=webpack://@basementuniverse/input-manager/./index.ts?`);
                })
              )
              /******/
            };
            var __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
              var cachedModule = __webpack_module_cache__[moduleId];
              if (cachedModule !== void 0) {
                return cachedModule.exports;
              }
              var module2 = __webpack_module_cache__[moduleId] = {
                /******/
                // no module.id needed
                /******/
                // no module.loaded needed
                /******/
                exports: {}
                /******/
              };
              __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
              return module2.exports;
            }
            var __webpack_exports__ = __webpack_require__("./index.ts");
            return __webpack_exports__;
          })()
        );
      });
    }
  });

  // node_modules/@basementuniverse/vec/vec.js
  var require_vec = __commonJS({
    "node_modules/@basementuniverse/vec/vec.js"(exports2, module2) {
      var _vec_times = (f, n) => Array(n).fill(0).map((_, i) => f(i));
      var _vec_chunk = (a, n) => _vec_times((i) => a.slice(i * n, i * n + n), Math.ceil(a.length / n));
      var _vec_dot = (a, b) => a.reduce((n, v, i) => n + v * b[i], 0);
      var _vec_is_vec2 = (a) => typeof a === "object" && "x" in a && "y" in a;
      var _vec_is_vec3 = (a) => typeof a === "object" && "x" in a && "y" in a && "z" in a;
      function isVec2(value) {
        return value && typeof value === "object" && "x" in value && typeof value.x === "number" && "y" in value && typeof value.y === "number" && !("z" in value);
      }
      var vec210 = (x, y) => {
        if (!x && !y) {
          return { x: 0, y: 0 };
        }
        if (_vec_is_vec2(x)) {
          return { x: x.x || 0, y: x.y || 0 };
        }
        return { x, y: y ?? x };
      };
      vec210.components = (a) => [a.x, a.y];
      vec210.fromComponents = (components) => vec210(...components.slice(0, 2));
      vec210.ux = () => vec210(1, 0);
      vec210.uy = () => vec210(0, 1);
      vec210.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b) });
      vec210.addm = (...v) => v.reduce((a, b) => vec210.add(a, b), vec210());
      vec210.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b) });
      vec210.subm = (...v) => v.reduce((a, b) => vec210.sub(a, b));
      vec210.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b) });
      vec210.scale = (a, b) => vec210.mul(a, b);
      vec210.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b) });
      vec210.len = (a) => Math.sqrt(a.x * a.x + a.y * a.y);
      vec210.manhattan = (a) => Math.abs(a.x) + Math.abs(a.y);
      vec210.nor = (a) => {
        let len = vec210.len(a);
        return len ? { x: a.x / len, y: a.y / len } : vec210();
      };
      vec210.dot = (a, b) => a.x * b.x + a.y * b.y;
      vec210.rot = (a, r) => {
        let s = Math.sin(r), c = Math.cos(r);
        return { x: c * a.x - s * a.y, y: s * a.x + c * a.y };
      };
      vec210.rotf = (a, r) => {
        switch (r) {
          case 1:
            return vec210(a.y, -a.x);
          case -1:
            return vec210(-a.y, a.x);
          case 2:
          case -2:
            return vec210(-a.x, -a.y);
          default:
            return a;
        }
      };
      vec210.cross = (a, b) => {
        return a.x * b.y - a.y * b.x;
      };
      vec210.eq = (a, b) => a.x === b.x && a.y === b.y;
      vec210.rad = (a) => Math.atan2(a.y, a.x);
      vec210.cpy = (a) => vec210(a);
      vec210.map = (a, f) => ({ x: f(a.x, "x"), y: f(a.y, "y") });
      vec210.str = (a, s = ", ") => `${a.x}${s}${a.y}`;
      vec210.swiz = (a, s = "..") => {
        const result = [];
        s.split("").forEach((c, i) => {
          switch (c) {
            case "x":
            case "u":
              result.push(a.x);
              break;
            case "y":
            case "v":
              result.push(a.y);
              break;
            case "X":
            case "U":
              result.push(-a.x);
              break;
            case "Y":
            case "V":
              result.push(-a.y);
              break;
            case "0":
              result.push(0);
              break;
            case "1":
              result.push(1);
              break;
            case ".":
              result.push([a.x, a.y][i] ?? 0);
              break;
            default:
              result.push(0);
          }
        });
        return result;
      };
      vec210.polar = (a) => ({ r: vec210.len(a), theta: Math.atan2(a.y, a.x) });
      vec210.fromPolar = (r, theta) => vec210(r * Math.cos(theta), r * Math.sin(theta));
      function isVec3(value) {
        return value && typeof value === "object" && "x" in value && typeof value.x === "number" && "y" in value && typeof value.y === "number" && "z" in value && typeof value.z === "number";
      }
      var vec3 = (x, y, z) => {
        if (!x && !y && !z) {
          return { x: 0, y: 0, z: 0 };
        }
        if (_vec_is_vec3(x)) {
          return { x: x.x || 0, y: x.y || 0, z: x.z || 0 };
        }
        if (_vec_is_vec2(x)) {
          return { x: x.x || 0, y: x.y || 0, z: y || 0 };
        }
        return { x, y: y ?? x, z: z ?? x };
      };
      vec3.components = (a) => [a.x, a.y, a.z];
      vec3.fromComponents = (components) => vec3(...components.slice(0, 3));
      vec3.ux = () => vec3(1, 0, 0);
      vec3.uy = () => vec3(0, 1, 0);
      vec3.uz = () => vec3(0, 0, 1);
      vec3.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b), z: a.z + (b.z ?? b) });
      vec3.addm = (...v) => v.reduce((a, b) => vec3.add(a, b), vec3());
      vec3.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b), z: a.z - (b.z ?? b) });
      vec3.subm = (...v) => v.reduce((a, b) => vec3.sub(a, b));
      vec3.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b), z: a.z * (b.z ?? b) });
      vec3.scale = (a, b) => vec3.mul(a, b);
      vec3.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b), z: a.z / (b.z ?? b) });
      vec3.len = (a) => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
      vec3.manhattan = (a) => Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);
      vec3.nor = (a) => {
        let len = vec3.len(a);
        return len ? { x: a.x / len, y: a.y / len, z: a.z / len } : vec3();
      };
      vec3.dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
      vec3.rot = (a, m) => vec3(
        vec3.dot(vec3.fromComponents(mat.row(m, 1)), a),
        vec3.dot(vec3.fromComponents(mat.row(m, 2)), a),
        vec3.dot(vec3.fromComponents(mat.row(m, 3)), a)
      );
      vec3.rotx = (a, r) => vec3(
        a.x,
        a.y * Math.cos(r) - a.z * Math.sin(r),
        a.y * Math.sin(r) + a.z * Math.cos(r)
      );
      vec3.roty = (a, r) => vec3(
        a.x * Math.cos(r) + a.z * Math.sin(r),
        a.y,
        -a.x * Math.sin(r) + a.z * Math.cos(r)
      );
      vec3.rotz = (a, r) => vec3(
        a.x * Math.cos(r) - a.y * Math.sin(r),
        a.x * Math.sin(r) + a.y * Math.cos(r),
        a.z
      );
      vec3.rotq = (v, q) => {
        if (q.length !== 4) {
          return vec3();
        }
        const d = Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);
        if (d === 0) {
          return vec3();
        }
        const uq = [q[0] / d, q[1] / d, q[2] / d, q[3] / d];
        const u = vec3(...uq.slice(0, 3));
        const s = uq[3];
        return vec3.add(
          vec3.add(
            vec3.mul(u, 2 * vec3.dot(u, v)),
            vec3.mul(v, s * s - vec3.dot(u, u))
          ),
          vec3.mul(vec3.cross(u, v), 2 * s)
        );
      };
      vec3.rota = (a, e) => vec3.rotz(vec3.roty(vec3.rotx(a, e.x), e.y), e.z);
      vec3.cross = (a, b) => vec3(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
      );
      vec3.eq = (a, b) => a.x === b.x && a.y === b.y && a.z === b.z;
      vec3.radx = (a) => Math.atan2(a.z, a.y);
      vec3.rady = (a) => Math.atan2(a.x, a.y);
      vec3.radz = (a) => Math.atan2(a.y, a.z);
      vec3.cpy = (a) => vec3(a);
      vec3.map = (a, f) => ({ x: f(a.x, "x"), y: f(a.y, "y"), z: f(a.z, "z") });
      vec3.str = (a, s = ", ") => `${a.x}${s}${a.y}${s}${a.z}`;
      vec3.swiz = (a, s = "...") => {
        const result = [];
        s.split("").forEach((c, i) => {
          switch (c) {
            case "x":
            case "u":
            case "r":
              result.push(a.x);
              break;
            case "y":
            case "v":
            case "g":
              result.push(a.y);
              break;
            case "z":
            case "w":
            case "b":
              result.push(a.z);
              break;
            case "X":
            case "U":
            case "R":
              result.push(-a.x);
              break;
            case "Y":
            case "V":
            case "G":
              result.push(-a.y);
              break;
            case "Z":
            case "W":
            case "B":
              result.push(-a.z);
              break;
            case "0":
              result.push(0);
              break;
            case "1":
              result.push(1);
              break;
            case ".":
              result.push([a.x, a.y, a.z][i] ?? 0);
              break;
            default:
              result.push(0);
          }
        });
        return result;
      };
      vec3.polar = (a) => {
        let r = vec3.len(a), theta = Math.acos(a.y / r), phi = Math.atan2(a.z, a.x);
        return { r, theta, phi };
      };
      vec3.fromPolar = (r, theta, phi) => {
        const sinTheta = Math.sin(theta);
        return vec3(
          r * sinTheta * Math.cos(phi),
          r * Math.cos(theta),
          r * sinTheta * Math.sin(phi)
        );
      };
      function isMat(value) {
        return value && typeof value === "object" && "m" in value && typeof value.m === "number" && "n" in value && typeof value.n === "number" && "entries" in value && Array.isArray(value.entries);
      }
      var mat = (m = 4, n = 4, entries = []) => ({
        m,
        n,
        entries: entries.concat(Array(m * n).fill(0)).slice(0, m * n)
      });
      mat.identity = (n) => mat(n, n, Array(n * n).fill(0).map((v, i) => +(Math.floor(i / n) === i % n)));
      mat.get = (a, i, j) => a.entries[j - 1 + (i - 1) * a.n];
      mat.set = (a, i, j, v) => {
        a.entries[j - 1 + (i - 1) * a.n] = v;
      };
      mat.row = (a, m) => {
        const s = (m - 1) * a.n;
        return a.entries.slice(s, s + a.n);
      };
      mat.col = (a, n) => _vec_times((i) => mat.get(a, i + 1, n), a.m);
      mat.add = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v + b.entries[i]);
      mat.sub = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v - b.entries[i]);
      mat.mul = (a, b) => {
        if (a.n !== b.m) {
          return false;
        }
        const result = mat(a.m, b.n);
        for (let i = 1; i <= a.m; i++) {
          for (let j = 1; j <= b.n; j++) {
            mat.set(result, i, j, _vec_dot(mat.row(a, i), mat.col(b, j)));
          }
        }
        return result;
      };
      mat.mulv = (a, b) => {
        let n, bb, rt;
        if (_vec_is_vec3(b)) {
          bb = vec3.components(b);
          n = 3;
          rt = vec3.fromComponents;
        } else if (_vec_is_vec2(b)) {
          bb = vec210.components(b);
          n = 2;
          rt = vec210.fromComponents;
        } else {
          bb = b;
          n = b.length ?? 0;
          rt = (v) => v;
        }
        if (a.n !== n) {
          return false;
        }
        const result = [];
        for (let i = 1; i <= a.m; i++) {
          result.push(_vec_dot(mat.row(a, i), bb));
        }
        return rt(result);
      };
      mat.scale = (a, b) => mat.map(a, (v) => v * b);
      mat.trans = (a) => mat(a.n, a.m, _vec_times((i) => mat.col(a, i + 1), a.n).flat());
      mat.minor = (a, i, j) => {
        if (a.m !== a.n) {
          return false;
        }
        const entries = [];
        for (let ii = 1; ii <= a.m; ii++) {
          if (ii === i) {
            continue;
          }
          for (let jj = 1; jj <= a.n; jj++) {
            if (jj === j) {
              continue;
            }
            entries.push(mat.get(a, ii, jj));
          }
        }
        return mat(a.m - 1, a.n - 1, entries);
      };
      mat.det = (a) => {
        if (a.m !== a.n) {
          return false;
        }
        if (a.m === 1) {
          return a.entries[0];
        }
        if (a.m === 2) {
          return a.entries[0] * a.entries[3] - a.entries[1] * a.entries[2];
        }
        let total = 0, sign = 1;
        for (let j = 1; j <= a.n; j++) {
          total += sign * a.entries[j - 1] * mat.det(mat.minor(a, 1, j));
          sign *= -1;
        }
        return total;
      };
      mat.nor = (a) => {
        if (a.m !== a.n) {
          return false;
        }
        const d = mat.det(a);
        return mat.map(a, (i) => i * d);
      };
      mat.adj = (a) => {
        const minors = mat(a.m, a.n);
        for (let i = 1; i <= a.m; i++) {
          for (let j = 1; j <= a.n; j++) {
            mat.set(minors, i, j, mat.det(mat.minor(a, i, j)));
          }
        }
        const cofactors = mat.map(minors, (v, i) => v * (i % 2 ? -1 : 1));
        return mat.trans(cofactors);
      };
      mat.inv = (a) => {
        if (a.m !== a.n) {
          return false;
        }
        const d = mat.det(a);
        if (d === 0) {
          return false;
        }
        return mat.scale(mat.adj(a), 1 / d);
      };
      mat.eq = (a, b) => a.m === b.m && a.n === b.n && mat.str(a) === mat.str(b);
      mat.cpy = (a) => mat(a.m, a.n, [...a.entries]);
      mat.map = (a, f) => mat(a.m, a.n, a.entries.map(f));
      mat.str = (a, ms = ", ", ns = "\n") => _vec_chunk(a.entries, a.n).map((r) => r.join(ms)).join(ns);
      if (typeof module2 !== "undefined") {
        module2.exports = { vec2: vec210, vec3, mat, isVec2, isVec3, isMat };
      }
    }
  });

  // node_modules/@basementuniverse/view-port/build/index.js
  var require_build6 = __commonJS({
    "node_modules/@basementuniverse/view-port/build/index.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define([], factory);
        else {
          var a = factory();
          for (var i in a) (typeof exports === "object" ? exports : root)[i] = a[i];
        }
      })(self, () => {
        return (
          /******/
          (() => {
            var __webpack_modules__ = {
              /***/
              "./node_modules/@basementuniverse/vec/vec.js"(module) {
                eval("{/**\n * @overview A small vector and matrix library\n * @author Gordon Larrigan\n */\n\nconst _vec_times = (f, n) => Array(n).fill(0).map((_, i) => f(i));\nconst _vec_chunk = (a, n) => _vec_times(i => a.slice(i * n, i * n + n), Math.ceil(a.length / n));\nconst _vec_dot = (a, b) => a.reduce((n, v, i) => n + v * b[i], 0);\nconst _vec_is_vec2 = a => typeof a === 'object' && 'x' in a && 'y' in a;\nconst _vec_is_vec3 = a => typeof a === 'object' && 'x' in a && 'y' in a && 'z' in a;\n\n/**\n * A 2d vector\n * @typedef {Object} vec2\n * @property {number} x The x component of the vector\n * @property {number} y The y component of the vector\n */\n\n/**\n * Check if a value is a 2d vector\n * @param {*} value The value to check\n * @returns {boolean} True if value is a 2d vector, false otherwise\n */\nfunction isVec2(value) {\n  return (\n    value &&\n    typeof value === 'object' &&\n    'x' in value &&\n    typeof value.x === 'number' &&\n    'y' in value &&\n    typeof value.y === 'number' &&\n    !('z' in value)\n  );\n}\n\n/**\n * Create a new 2d vector\n * @param {number|vec2} [x] The x component of the vector, or a vector to copy\n * @param {number} [y] The y component of the vector\n * @return {vec2} A new 2d vector\n * @example <caption>various ways to initialise a vector</caption>\n * let a = vec2(3, 2); // (3, 2)\n * let b = vec2(4);    // (4, 4)\n * let c = vec2(a);    // (3, 2)\n * let d = vec2();     // (0, 0)\n */\nconst vec2 = (x, y) => {\n  if (!x && !y) {\n    return { x: 0, y: 0 };\n  }\n  if (_vec_is_vec2(x)) {\n    return { x: x.x || 0, y: x.y || 0 };\n  }\n  return { x: x, y: y ?? x };\n};\n\n/**\n * Get the components of a vector as an array\n * @param {vec2} a The vector to get components from\n * @return {Array<number>} The vector components as an array\n */\nvec2.components = a => [a.x, a.y];\n\n/**\n * Create a vector from an array of components\n * @param {Array<number>} components The components of the vector\n * @return {vec2} A new vector\n */\nvec2.fromComponents = components => vec2(...components.slice(0, 2));\n\n/**\n * Return a unit vector (1, 0)\n * @return {vec2} A unit vector (1, 0)\n */\nvec2.ux = () => vec2(1, 0);\n\n/**\n * Return a unit vector (0, 1)\n * @return {vec2} A unit vector (0, 1)\n */\nvec2.uy = () => vec2(0, 1);\n\n/**\n * Add vectors\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a + b\n */\nvec2.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b) });\n\n/**\n * Add multiple vectors\n * @param  {...any} v Vectors to add\n * @returns {vec2} The sum of the vectors\n */\nvec2.addm = (...v) => v.reduce((a, b) => vec2.add(a, b), vec2());\n\n/**\n * Subtract vectors\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a - b\n */\nvec2.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b) });\n\n/**\n * Subtract multiple vectors\n * @param  {...any} v Vectors to subtract\n * @returns {vec2} The result of subtracting the vectors\n */\nvec2.subm = (...v) => v.reduce((a, b) => vec2.sub(a, b));\n\n/**\n * Scale a vector\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a * b\n */\nvec2.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b) });\n\n/**\n * Scale a vector by a scalar, alias for vec2.mul\n * @param {vec2} a Vector a\n * @param {number} b Scalar b\n * @return {vec2} a * b\n */\nvec2.scale = (a, b) => vec2.mul(a, b);\n\n/**\n * Divide a vector\n * @param {vec2} a Vector a\n * @param {vec2|number} b Vector or scalar b\n * @return {vec2} a / b\n */\nvec2.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b) });\n\n/**\n * Get the length of a vector\n * @param {vec2} a Vector a\n * @return {number} |a|\n */\nvec2.len = a => Math.sqrt(a.x * a.x + a.y * a.y);\n\n/**\n * Get the length of a vector using taxicab geometry\n * @param {vec2} a Vector a\n * @return {number} |a|\n */\nvec2.manhattan = a => Math.abs(a.x) + Math.abs(a.y);\n\n/**\n * Normalise a vector\n * @param {vec2} a The vector to normalise\n * @return {vec2} ^a\n */\nvec2.nor = a => {\n  let len = vec2.len(a);\n  return len ? { x: a.x / len, y: a.y / len } : vec2();\n};\n\n/**\n * Get a dot product of vectors\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {number} a \u2219 b\n */\nvec2.dot = (a, b) => a.x * b.x + a.y * b.y;\n\n/**\n * Rotate a vector by r radians\n * @param {vec2} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec2} A rotated vector\n */\nvec2.rot = (a, r) => {\n  let s = Math.sin(r),\n    c = Math.cos(r);\n  return { x: c * a.x - s * a.y, y: s * a.x + c * a.y };\n};\n\n/**\n * Fast method to rotate a vector by -90, 90 or 180 degrees\n * @param {vec2} a The vector to rotate\n * @param {number} r 1 for 90 degrees (cw), -1 for -90 degrees (ccw), 2 or -2 for 180 degrees\n * @return {vec2} A rotated vector\n */\nvec2.rotf = (a, r) => {\n  switch (r) {\n    case 1: return vec2(a.y, -a.x);\n    case -1: return vec2(-a.y, a.x);\n    case 2: case -2: return vec2(-a.x, -a.y);\n    default: return a;\n  }\n};\n\n/**\n * Scalar cross product of two vectors\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {number} a \xD7 b\n */\nvec2.cross = (a, b) => {\n  return a.x * b.y - a.y * b.x;\n};\n\n/**\n * Check if two vectors are equal\n * @param {vec2} a Vector a\n * @param {vec2} b Vector b\n * @return {boolean} True if vectors a and b are equal, false otherwise\n */\nvec2.eq = (a, b) => a.x === b.x && a.y === b.y;\n\n/**\n * Get the angle of a vector\n * @param {vec2} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec2.rad = a => Math.atan2(a.y, a.x);\n\n/**\n * Copy a vector\n * @param {vec2} a The vector to copy\n * @return {vec2} A copy of vector a\n */\nvec2.cpy = a => vec2(a);\n\n/**\n * A function to call on each component of a 2d vector\n * @callback vec2MapCallback\n * @param {number} value The component value\n * @param {'x' | 'y'} label The component label (x or y)\n * @return {number} The mapped component\n */\n\n/**\n * Call a function on each component of a vector and build a new vector from the results\n * @param {vec2} a Vector a\n * @param {vec2MapCallback} f The function to call on each component of the vector\n * @return {vec2} Vector a mapped through f\n */\nvec2.map = (a, f) => ({ x: f(a.x, 'x'), y: f(a.y, 'y') });\n\n/**\n * Convert a vector into a string\n * @param {vec2} a The vector to convert\n * @param {string} [s=', '] The separator string\n * @return {string} A string representation of the vector\n */\nvec2.str = (a, s = ', ') => `${a.x}${s}${a.y}`;\n\n/**\n * Swizzle a vector with a string of component labels\n *\n * The string can contain:\n * - `x` or `y`\n * - `u` or `v` (aliases for `x` and `y`, respectively)\n * - `X`, `Y`, `U`, `V` (negated versions of the above)\n * - `0` or `1` (these will be passed through unchanged)\n * - `.` to return the component that would normally be at this position (or 0)\n *\n * Any other characters will default to 0\n * @param {vec2} a The vector to swizzle\n * @param {string} [s='..'] The swizzle string\n * @return {Array<number>} The swizzled components\n * @example <caption>swizzling a vector</caption>\n * let a = vec2(3, -2);\n * vec2.swiz(a, 'x');    // [3]\n * vec2.swiz(a, 'yx');   // [-2, 3]\n * vec2.swiz(a, 'xY');   // [3, 2]\n * vec2.swiz(a, 'Yy');   // [2, -2]\n * vec2.swiz(a, 'x.x');  // [3, -2, 3]\n * vec2.swiz(a, 'y01x'); // [-2, 0, 1, 3]\n */\nvec2.swiz = (a, s = '..') => {\n  const result = [];\n  s.split('').forEach((c, i) => {\n    switch (c) {\n      case 'x': case 'u': result.push(a.x); break;\n      case 'y': case 'v': result.push(a.y); break;\n      case 'X': case 'U': result.push(-a.x); break;\n      case 'Y': case 'V': result.push(-a.y); break;\n      case '0': result.push(0); break;\n      case '1': result.push(1); break;\n      case '.': result.push([a.x, a.y][i] ?? 0); break;\n      default: result.push(0);\n    }\n  });\n  return result;\n};\n\n/**\n * Polar coordinates for a 2d vector\n * @typedef {Object} polarCoordinates2d\n * @property {number} r The magnitude (radius) of the vector\n * @property {number} theta The angle of the vector\n */\n\n/**\n * Convert a vector into polar coordinates\n * @param {vec2} a The vector to convert\n * @return {polarCoordinates2d} The magnitude and angle of the vector\n */\nvec2.polar = a => ({ r: vec2.len(a), theta: Math.atan2(a.y, a.x) });\n\n/**\n * Convert polar coordinates into a vector\n * @param {number} r The magnitude (radius) of the vector\n * @param {number} theta The angle of the vector\n * @return {vec2} A vector with the given angle and magnitude\n */\nvec2.fromPolar = (r, theta) => vec2(r * Math.cos(theta), r * Math.sin(theta));\n\n/**\n * A 3d vector\n * @typedef {Object} vec3\n * @property {number} x The x component of the vector\n * @property {number} y The y component of the vector\n * @property {number} z The z component of the vector\n */\n\n/**\n * Check if a value is a 3d vector\n * @param {*} value The value to check\n * @returns {boolean} True if value is a 3d vector, false otherwise\n */\nfunction isVec3(value) {\n  return (\n    value &&\n    typeof value === 'object' &&\n    'x' in value &&\n    typeof value.x === 'number' &&\n    'y' in value &&\n    typeof value.y === 'number' &&\n    'z' in value &&\n    typeof value.z === 'number'\n  );\n}\n\n/**\n * Create a new 3d vector\n * @param {number|vec3|vec2} [x] The x component of the vector, or a vector to copy\n * @param {number} [y] The y component of the vector, or the z component if x is a vec2\n * @param {number} [z] The z component of the vector\n * @return {vec3} A new 3d vector\n * @example <caption>various ways to initialise a vector</caption>\n * let a = vec3(3, 2, 1);       // (3, 2, 1)\n * let b = vec3(4, 5);          // (4, 5, 0)\n * let c = vec3(6);             // (6, 6, 6)\n * let d = vec3(a);             // (3, 2, 1)\n * let e = vec3();              // (0, 0, 0)\n * let f = vec3(vec2(1, 2), 3); // (1, 2, 3)\n * let g = vec3(vec2(4, 5));    // (4, 5, 0)\n */\nconst vec3 = (x, y, z) => {\n  if (!x && !y && !z) {\n    return { x: 0, y: 0, z: 0 };\n  }\n  if (_vec_is_vec3(x)) {\n    return { x: x.x || 0, y: x.y || 0, z: x.z || 0 };\n  }\n  if (_vec_is_vec2(x)) {\n    return { x: x.x || 0, y: x.y || 0, z: y || 0 };\n  }\n  return { x: x, y: y ?? x, z: z ?? x };\n};\n\n/**\n * Get the components of a vector as an array\n * @param {vec3} a The vector to get components from\n * @return {Array<number>} The vector components as an array\n */\nvec3.components = a => [a.x, a.y, a.z];\n\n/**\n * Create a vector from an array of components\n * @param {Array<number>} components The components of the vector\n * @return {vec3} A new vector\n */\nvec3.fromComponents = components => vec3(...components.slice(0, 3));\n\n/**\n * Return a unit vector (1, 0, 0)\n * @return {vec3} A unit vector (1, 0, 0)\n */\nvec3.ux = () => vec3(1, 0, 0);\n\n/**\n * Return a unit vector (0, 1, 0)\n * @return {vec3} A unit vector (0, 1, 0)\n */\nvec3.uy = () => vec3(0, 1, 0);\n\n/**\n * Return a unit vector (0, 0, 1)\n * @return {vec3} A unit vector (0, 0, 1)\n */\nvec3.uz = () => vec3(0, 0, 1);\n\n/**\n * Add vectors\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a + b\n */\nvec3.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b), z: a.z + (b.z ?? b) });\n\n/**\n * Add multiple vectors\n * @param  {...any} v Vectors to add\n * @returns {vec3} The sum of the vectors\n */\nvec3.addm = (...v) => v.reduce((a, b) => vec3.add(a, b), vec3());\n\n/**\n * Subtract vectors\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a - b\n */\nvec3.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b), z: a.z - (b.z ?? b) });\n\n/**\n * Subtract multiple vectors\n * @param  {...any} v Vectors to subtract\n * @returns {vec3} The result of subtracting the vectors\n */\nvec3.subm = (...v) => v.reduce((a, b) => vec3.sub(a, b));\n\n/**\n * Scale a vector\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a * b\n */\nvec3.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b), z: a.z * (b.z ?? b) });\n\n/**\n * Scale a vector by a scalar, alias for vec3.mul\n * @param {vec3} a Vector a\n * @param {number} b Scalar b\n * @return {vec3} a * b\n */\nvec3.scale = (a, b) => vec3.mul(a, b);\n\n/**\n * Divide a vector\n * @param {vec3} a Vector a\n * @param {vec3|number} b Vector or scalar b\n * @return {vec3} a / b\n */\nvec3.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b), z: a.z / (b.z ?? b) });\n\n/**\n * Get the length of a vector\n * @param {vec3} a Vector a\n * @return {number} |a|\n */\nvec3.len = a => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);\n\n/**\n * Get the length of a vector using taxicab geometry\n * @param {vec3} a Vector a\n * @return {number} |a|\n */\nvec3.manhattan = a => Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);\n\n/**\n * Normalise a vector\n * @param {vec3} a The vector to normalise\n * @return {vec3} ^a\n */\nvec3.nor = a => {\n  let len = vec3.len(a);\n  return len ? { x: a.x / len, y: a.y / len, z: a.z / len } : vec3();\n};\n\n/**\n * Get a dot product of vectors\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {number} a \u2219 b\n */\nvec3.dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;\n\n/**\n * Rotate a vector using a rotation matrix\n * @param {vec3} a The vector to rotate\n * @param {mat} m The rotation matrix\n * @return {vec3} A rotated vector\n */\nvec3.rot = (a, m) => vec3(\n  vec3.dot(vec3.fromComponents(mat.row(m, 1)), a),\n  vec3.dot(vec3.fromComponents(mat.row(m, 2)), a),\n  vec3.dot(vec3.fromComponents(mat.row(m, 3)), a)\n);\n\n/**\n * Rotate a vector by r radians around the x axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.rotx = (a, r) => vec3(\n  a.x,\n  a.y * Math.cos(r) - a.z * Math.sin(r),\n  a.y * Math.sin(r) + a.z * Math.cos(r)\n);\n\n/**\n * Rotate a vector by r radians around the y axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.roty = (a, r) => vec3(\n  a.x * Math.cos(r) + a.z * Math.sin(r),\n  a.y,\n  -a.x * Math.sin(r) + a.z * Math.cos(r)\n);\n\n/**\n * Rotate a vector by r radians around the z axis\n * @param {vec3} a The vector to rotate\n * @param {number} r The angle to rotate by, measured in radians\n * @return {vec3} A rotated vector\n */\nvec3.rotz = (a, r) => vec3(\n  a.x * Math.cos(r) - a.y * Math.sin(r),\n  a.x * Math.sin(r) + a.y * Math.cos(r),\n  a.z\n);\n\n/**\n * Rotate a vector using a quaternion\n * @param {vec3} a The vector to rotate\n * @param {Array<number>} q The quaternion to rotate by\n * @return {vec3} A rotated vector\n */\nvec3.rotq = (v, q) => {\n  if (q.length !== 4) {\n    return vec3();\n  }\n\n  const d = Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);\n  if (d === 0) {\n    return vec3();\n  }\n\n  const uq = [q[0] / d, q[1] / d, q[2] / d, q[3] / d];\n  const u = vec3(...uq.slice(0, 3));\n  const s = uq[3];\n  return vec3.add(\n    vec3.add(\n      vec3.mul(u, 2 * vec3.dot(u, v)),\n      vec3.mul(v, s * s - vec3.dot(u, u))\n    ),\n    vec3.mul(vec3.cross(u, v), 2 * s)\n  );\n};\n\n/**\n * Rotate a vector using Euler angles\n * @param {vec3} a The vector to rotate\n * @param {vec3} e The Euler angles to rotate by\n * @return {vec3} A rotated vector\n */\nvec3.rota = (a, e) => vec3.rotz(vec3.roty(vec3.rotx(a, e.x), e.y), e.z);\n\n/**\n * Get the cross product of vectors\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {vec3} a \xD7 b\n */\nvec3.cross = (a, b) => vec3(\n  a.y * b.z - a.z * b.y,\n  a.z * b.x - a.x * b.z,\n  a.x * b.y - a.y * b.x\n);\n\n/**\n * Check if two vectors are equal\n * @param {vec3} a Vector a\n * @param {vec3} b Vector b\n * @return {boolean} True if vectors a and b are equal, false otherwise\n */\nvec3.eq = (a, b) => a.x === b.x && a.y === b.y && a.z === b.z;\n\n/**\n * Get the angle of a vector from the x axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.radx = a => Math.atan2(a.z, a.y);\n\n/**\n * Get the angle of a vector from the y axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.rady = a => Math.atan2(a.x, a.y);\n\n/**\n * Get the angle of a vector from the z axis\n * @param {vec3} a Vector a\n * @return {number} The angle of vector a in radians\n */\nvec3.radz = a => Math.atan2(a.y, a.z);\n\n/**\n * Copy a vector\n * @param {vec3} a The vector to copy\n * @return {vec3} A copy of vector a\n */\nvec3.cpy = a => vec3(a);\n\n/**\n * A function to call on each component of a 3d vector\n * @callback vec3MapCallback\n * @param {number} value The component value\n * @param {'x' | 'y' | 'z'} label The component label (x, y or z)\n * @return {number} The mapped component\n */\n\n/**\n * Call a function on each component of a vector and build a new vector from the results\n * @param {vec3} a Vector a\n * @param {vec3MapCallback} f The function to call on each component of the vector\n * @return {vec3} Vector a mapped through f\n */\nvec3.map = (a, f) => ({ x: f(a.x, 'x'), y: f(a.y, 'y'), z: f(a.z, 'z') });\n\n/**\n * Convert a vector into a string\n * @param {vec3} a The vector to convert\n * @param {string} [s=', '] The separator string\n * @return {string} A string representation of the vector\n */\nvec3.str = (a, s = ', ') => `${a.x}${s}${a.y}${s}${a.z}`;\n\n/**\n * Swizzle a vector with a string of component labels\n *\n * The string can contain:\n * - `x`, `y` or `z`\n * - `u`, `v` or `w` (aliases for `x`, `y` and `z`, respectively)\n * - `r`, `g` or `b` (aliases for `x`, `y` and `z`, respectively)\n * - `X`, `Y`, `Z`, `U`, `V`, `W`, `R`, `G`, `B` (negated versions of the above)\n * - `0` or `1` (these will be passed through unchanged)\n * - `.` to return the component that would normally be at this position (or 0)\n *\n * Any other characters will default to 0\n * @param {vec3} a The vector to swizzle\n * @param {string} [s='...'] The swizzle string\n * @return {Array<number>} The swizzled components\n * @example <caption>swizzling a vector</caption>\n * let a = vec3(3, -2, 1);\n * vec3.swiz(a, 'x');     // [3]\n * vec3.swiz(a, 'zyx');   // [1, -2, 3]\n * vec3.swiz(a, 'xYZ');   // [3, 2, -1]\n * vec3.swiz(a, 'Zzx');   // [-1, 1, 3]\n * vec3.swiz(a, 'x.x');   // [3, -2, 3]\n * vec3.swiz(a, 'y01zx'); // [-2, 0, 1, 1, 3]\n */\nvec3.swiz = (a, s = '...') => {\n  const result = [];\n  s.split('').forEach((c, i) => {\n    switch (c) {\n      case 'x': case 'u': case 'r': result.push(a.x); break;\n      case 'y': case 'v': case 'g': result.push(a.y); break;\n      case 'z': case 'w': case 'b': result.push(a.z); break;\n      case 'X': case 'U': case 'R': result.push(-a.x); break;\n      case 'Y': case 'V': case 'G': result.push(-a.y); break;\n      case 'Z': case 'W': case 'B': result.push(-a.z); break;\n      case '0': result.push(0); break;\n      case '1': result.push(1); break;\n      case '.': result.push([a.x, a.y, a.z][i] ?? 0); break;\n      default: result.push(0);\n    }\n  });\n  return result;\n};\n\n/**\n * Polar coordinates for a 3d vector\n * @typedef {Object} polarCoordinates3d\n * @property {number} r The magnitude (radius) of the vector\n * @property {number} theta The tilt angle of the vector\n * @property {number} phi The pan angle of the vector\n */\n\n/**\n * Convert a vector into polar coordinates\n * @param {vec3} a The vector to convert\n * @return {polarCoordinates3d} The magnitude, tilt and pan of the vector\n */\nvec3.polar = a => {\n  let r = vec3.len(a),\n    theta = Math.acos(a.y / r),\n    phi = Math.atan2(a.z, a.x);\n  return { r, theta, phi };\n};\n\n/**\n * Convert polar coordinates into a vector\n * @param {number} r The magnitude (radius) of the vector\n * @param {number} theta The tilt of the vector\n * @param {number} phi The pan of the vector\n * @return {vec3} A vector with the given angle and magnitude\n */\nvec3.fromPolar = (r, theta, phi) => {\n  const sinTheta = Math.sin(theta);\n  return vec3(\n    r * sinTheta * Math.cos(phi),\n    r * Math.cos(theta),\n    r * sinTheta * Math.sin(phi)\n  );\n};\n\n/**\n * A matrix\n * @typedef {Object} mat\n * @property {number} m The number of rows in the matrix\n * @property {number} n The number of columns in the matrix\n * @property {Array<number>} entries The matrix values\n */\n\n/**\n * Check if a value is a matrix\n * @param {*} value The value to check\n * @returns {boolean} True if value is a matrix, false otherwise\n */\nfunction isMat(value) {\n  return (\n    value &&\n    typeof value === 'object' &&\n    'm' in value &&\n    typeof value.m === 'number' &&\n    'n' in value &&\n    typeof value.n === 'number' &&\n    'entries' in value &&\n    Array.isArray(value.entries)\n  );\n}\n\n/**\n * Create a new matrix\n * @param {number} [m=4] The number of rows\n * @param {number} [n=4] The number of columns\n * @param {Array<number>} [entries=[]] Matrix values in reading order\n * @return {mat} A new matrix\n */\nconst mat = (m = 4, n = 4, entries = []) => ({\n  m, n,\n  entries: entries.concat(Array(m * n).fill(0)).slice(0, m * n)\n});\n\n/**\n * Get an identity matrix of size n\n * @param {number} n The size of the matrix\n * @return {mat} An identity matrix\n */\nmat.identity = n => mat(n, n, Array(n * n).fill(0).map((v, i) => +(Math.floor(i / n) === i % n)));\n\n/**\n * Get an entry from a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @return {number} The value at position (i, j) in matrix a\n */\nmat.get = (a, i, j) => a.entries[(j - 1) + (i - 1) * a.n];\n\n/**\n * Set an entry of a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @param {number} v The value to set in matrix a\n */\nmat.set = (a, i, j, v) => { a.entries[(j - 1) + (i - 1) * a.n] = v; };\n\n/**\n * Get a row from a matrix as an array\n * @param {mat} a Matrix a\n * @param {number} m The row offset\n * @return {Array<number>} Row m from matrix a\n */\nmat.row = (a, m) => {\n  const s = (m - 1) * a.n;\n  return a.entries.slice(s, s + a.n);\n};\n\n/**\n * Get a column from a matrix as an array\n * @param {mat} a Matrix a\n * @param {number} n The column offset\n * @return {Array<number>} Column n from matrix a\n */\nmat.col = (a, n) => _vec_times(i => mat.get(a, (i + 1), n), a.m);\n\n/**\n * Add matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat} a + b\n */\nmat.add = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v + b.entries[i]);\n\n/**\n * Subtract matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat} a - b\n */\nmat.sub = (a, b) => a.m === b.m && a.n === b.n && mat.map(a, (v, i) => v - b.entries[i]);\n\n/**\n * Multiply matrices\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {mat|false} ab or false if the matrices cannot be multiplied\n */\nmat.mul = (a, b) => {\n  if (a.n !== b.m) { return false; }\n  const result = mat(a.m, b.n);\n  for (let i = 1; i <= a.m; i++) {\n    for (let j = 1; j <= b.n; j++) {\n      mat.set(result, i, j, _vec_dot(mat.row(a, i), mat.col(b, j)));\n    }\n  }\n  return result;\n};\n\n/**\n * Multiply a matrix by a vector\n * @param {mat} a Matrix a\n * @param {vec2|vec3|number[]} b Vector b\n * @return {vec2|vec3|number[]|false} ab or false if the matrix and vector cannot be multiplied\n */\nmat.mulv = (a, b) => {\n  let n, bb, rt;\n  if (_vec_is_vec3(b)) {\n    bb = vec3.components(b);\n    n = 3;\n    rt = vec3.fromComponents;\n  } else if (_vec_is_vec2(b)) {\n    bb = vec2.components(b);\n    n = 2;\n    rt = vec2.fromComponents;\n  } else {\n    bb = b;\n    n = b.length ?? 0;\n    rt = v => v;\n  }\n  if (a.n !== n) { return false; }\n  const result = [];\n  for (let i = 1; i <= a.m; i++) {\n    result.push(_vec_dot(mat.row(a, i), bb));\n  }\n  return rt(result);\n}\n\n/**\n * Scale a matrix\n * @param {mat} a Matrix a\n * @param {number} b Scalar b\n * @return {mat} a * b\n */\nmat.scale = (a, b) => mat.map(a, v => v * b);\n\n/**\n * Transpose a matrix\n * @param {mat} a The matrix to transpose\n * @return {mat} A transposed matrix\n */\nmat.trans = a => mat(a.n, a.m, _vec_times(i => mat.col(a, (i + 1)), a.n).flat());\n\n/**\n * Get the minor of a matrix\n * @param {mat} a Matrix a\n * @param {number} i The row offset\n * @param {number} j The column offset\n * @return {mat|false} The (i, j) minor of matrix a or false if the matrix is not square\n */\nmat.minor = (a, i, j) => {\n  if (a.m !== a.n) { return false; }\n  const entries = [];\n  for (let ii = 1; ii <= a.m; ii++) {\n    if (ii === i) { continue; }\n    for (let jj = 1; jj <= a.n; jj++) {\n      if (jj === j) { continue; }\n      entries.push(mat.get(a, ii, jj));\n    }\n  }\n  return mat(a.m - 1, a.n - 1, entries);\n};\n\n/**\n * Get the determinant of a matrix\n * @param {mat} a Matrix a\n * @return {number|false} |a| or false if the matrix is not square\n */\nmat.det = a => {\n  if (a.m !== a.n) { return false; }\n  if (a.m === 1) {\n    return a.entries[0];\n  }\n  if (a.m === 2) {\n    return a.entries[0] * a.entries[3] - a.entries[1] * a.entries[2];\n  }\n  let total = 0, sign = 1;\n  for (let j = 1; j <= a.n; j++) {\n    total += sign * a.entries[j - 1] * mat.det(mat.minor(a, 1, j));\n    sign *= -1;\n  }\n  return total;\n};\n\n/**\n * Normalise a matrix\n * @param {mat} a The matrix to normalise\n * @return {mat|false} ^a or false if the matrix is not square\n */\nmat.nor = a => {\n  if (a.m !== a.n) { return false; }\n  const d = mat.det(a);\n  return mat.map(a, i => i * d);\n};\n\n/**\n * Get the adjugate of a matrix\n * @param {mat} a The matrix from which to get the adjugate\n * @return {mat} The adjugate of a\n */\nmat.adj = a => {\n  const minors = mat(a.m, a.n);\n  for (let i = 1; i <= a.m; i++) {\n    for (let j = 1; j <= a.n; j++) {\n      mat.set(minors, i, j, mat.det(mat.minor(a, i, j)));\n    }\n  }\n  const cofactors = mat.map(minors, (v, i) => v * (i % 2 ? -1 : 1));\n  return mat.trans(cofactors);\n};\n\n/**\n * Get the inverse of a matrix\n * @param {mat} a The matrix to invert\n * @return {mat|false} a^-1 or false if the matrix has no inverse\n */\nmat.inv = a => {\n  if (a.m !== a.n) { return false; }\n  const d = mat.det(a);\n  if (d === 0) { return false; }\n  return mat.scale(mat.adj(a), 1 / d);\n};\n\n/**\n * Check if two matrices are equal\n * @param {mat} a Matrix a\n * @param {mat} b Matrix b\n * @return {boolean} True if matrices a and b are identical, false otherwise\n */\nmat.eq = (a, b) => a.m === b.m && a.n === b.n && mat.str(a) === mat.str(b);\n\n/**\n * Copy a matrix\n * @param {mat} a The matrix to copy\n * @return {mat} A copy of matrix a\n */\nmat.cpy = a => mat(a.m, a.n, [...a.entries]);\n\n/**\n * A function to call on each entry of a matrix\n * @callback matrixMapCallback\n * @param {number} value The entry value\n * @param {number} index The entry index\n * @param {Array<number>} entries The array of matrix entries\n * @return {number} The mapped entry\n */\n\n/**\n * Call a function on each entry of a matrix and build a new matrix from the results\n * @param {mat} a Matrix a\n * @param {matrixMapCallback} f The function to call on each entry of the matrix\n * @return {mat} Matrix a mapped through f\n */\nmat.map = (a, f) => mat(a.m, a.n, a.entries.map(f));\n\n/**\n * Convert a matrix into a string\n * @param {mat} a The matrix to convert\n * @param {string} [ms=', '] The separator string for columns\n * @param {string} [ns='\\n'] The separator string for rows\n * @return {string} A string representation of the matrix\n */\nmat.str = (a, ms = ', ', ns = '\\n') => _vec_chunk(a.entries, a.n).map(r => r.join(ms)).join(ns);\n\nif (true) {\n  module.exports = { vec2, vec3, mat, isVec2, isVec3, isMat };\n}\n\n\n//# sourceURL=webpack://@basementuniverse/view-port/./node_modules/@basementuniverse/vec/vec.js?\n}");
              },
              /***/
              "./index.ts"(__unused_webpack_module, exports, __webpack_require__) {
                "use strict";
                eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ViewPort = void 0;\nconst vec_1 = __webpack_require__(/*! @basementuniverse/vec */ \"./node_modules/@basementuniverse/vec/vec.js\");\nfunction hashVec(v) {\n    return vec_1.vec2.str(v);\n}\nfunction drawLine(context, start, end, colour, lineWidth) {\n    context.save();\n    context.lineWidth = lineWidth;\n    context.strokeStyle = colour;\n    context.beginPath();\n    context.moveTo(start.x, start.y);\n    context.lineTo(end.x, end.y);\n    context.stroke();\n    context.restore();\n}\nfunction drawCross(context, position, colour, lineWidth, size) {\n    context.save();\n    context.lineWidth = lineWidth;\n    const halfSize = Math.ceil(size / 2);\n    context.strokeStyle = colour;\n    context.beginPath();\n    context.moveTo(position.x - halfSize, position.y - halfSize);\n    context.lineTo(position.x + halfSize, position.y + halfSize);\n    context.moveTo(position.x - halfSize, position.y + halfSize);\n    context.lineTo(position.x + halfSize, position.y - halfSize);\n    context.stroke();\n    context.restore();\n}\nfunction pointInRectangle(point, topLeft, bottomRight) {\n    return (point.x >= topLeft.x &&\n        point.y >= topLeft.y &&\n        point.x < bottomRight.x &&\n        point.y < bottomRight.y);\n}\nclass ViewPort {\n    constructor(options) {\n        const actualOptions = Object.assign({}, ViewPort.DEFAULT_OPTIONS, options !== null && options !== void 0 ? options : {});\n        if (!actualOptions.debug || actualOptions.debug === true) {\n            actualOptions.debug = {\n                showOrigin: !!actualOptions.debug,\n                showChunkBorders: !!actualOptions.debug,\n                showChunkLabels: !!actualOptions.debug,\n            };\n        }\n        this.options = actualOptions;\n        this.spatialHash = new SpatialHash(this.options.spatialHashMaxElements, this.options.spatialHashMaxElementsToRemove);\n    }\n    get countChunks() {\n        return this.spatialHash.count;\n    }\n    update(dt, screen, camera, ...args) {\n        const bounds = camera.bounds;\n        const topLeft = vec_1.vec2.sub(vec_1.vec2.map(vec_1.vec2.div((0, vec_1.vec2)(bounds.left, bounds.top), this.options.gridSize), Math.floor), this.options.border);\n        const bottomRight = vec_1.vec2.add(vec_1.vec2.map(vec_1.vec2.div((0, vec_1.vec2)(bounds.right, bounds.bottom), this.options.gridSize), Math.ceil), this.options.border);\n        const size = vec_1.vec2.sub(bottomRight, topLeft);\n        const perimeter = 2 * size.x + 2 * size.y;\n        const visibleGridCells = size.x * size.y + perimeter + this.options.bufferAmount;\n        if (this.spatialHash.maxElements < visibleGridCells) {\n            this.spatialHash.maxElements = visibleGridCells;\n        }\n        this.addChunks(topLeft, bottomRight);\n        this.spatialHash.fetch(topLeft, bottomRight).forEach(chunk => {\n            var _a;\n            (_a = chunk.update) === null || _a === void 0 ? void 0 : _a.call(chunk, dt, screen, camera, ...args);\n        });\n    }\n    addChunks(topLeft, bottomRight) {\n        let i = 0;\n        for (let x = topLeft.x; x < bottomRight.x; x++) {\n            for (let y = topLeft.y; y < bottomRight.y; y++) {\n                const v = (0, vec_1.vec2)(x, y);\n                if (!this.spatialHash.has(v)) {\n                    this.spatialHash.add(v, this.options.generator(v));\n                    if (i++ > this.options.maxElementsToGenerate) {\n                        return;\n                    }\n                }\n            }\n        }\n    }\n    getVisibleChunks(camera) {\n        const bounds = camera.bounds;\n        const topLeft = vec_1.vec2.sub(vec_1.vec2.map(vec_1.vec2.div((0, vec_1.vec2)(bounds.left, bounds.top), this.options.gridSize), Math.floor), this.options.border);\n        const bottomRight = vec_1.vec2.add(vec_1.vec2.map(vec_1.vec2.div((0, vec_1.vec2)(bounds.right, bounds.bottom), this.options.gridSize), Math.ceil), this.options.border);\n        return this.spatialHash.fetch(topLeft, bottomRight);\n    }\n    draw(context, screen, camera, ...args) {\n        const bounds = camera.bounds;\n        const topLeft = vec_1.vec2.sub(vec_1.vec2.map(vec_1.vec2.div((0, vec_1.vec2)(bounds.left, bounds.top), this.options.gridSize), Math.floor), this.options.border);\n        const bottomRight = vec_1.vec2.add(vec_1.vec2.map(vec_1.vec2.div((0, vec_1.vec2)(bounds.right, bounds.bottom), this.options.gridSize), Math.ceil), this.options.border);\n        this.spatialHash.fetch(topLeft, bottomRight).forEach(chunk => {\n            var _a;\n            (_a = chunk.draw) === null || _a === void 0 ? void 0 : _a.call(chunk, context, screen, camera, ...args);\n        });\n        // Render debug helpers\n        if (this.options.debug.showChunkBorders) {\n            for (let y = topLeft.y; y < bottomRight.y; y++) {\n                drawLine(context, (0, vec_1.vec2)(topLeft.x * this.options.gridSize.x, y * this.options.gridSize.y), (0, vec_1.vec2)(bottomRight.x * this.options.gridSize.x, y * this.options.gridSize.y), ViewPort.DEBUG_CHUNK_BORDER_COLOUR, ViewPort.DEBUG_CHUNK_BORDER_LINE_WIDTH);\n            }\n            for (let x = topLeft.x; x < bottomRight.x; x++) {\n                drawLine(context, (0, vec_1.vec2)(x * this.options.gridSize.x, topLeft.y * this.options.gridSize.y), (0, vec_1.vec2)(x * this.options.gridSize.x, bottomRight.y * this.options.gridSize.y), ViewPort.DEBUG_CHUNK_BORDER_COLOUR, ViewPort.DEBUG_CHUNK_BORDER_LINE_WIDTH);\n            }\n        }\n        if (this.options.debug.showChunkLabels) {\n            context.save();\n            context.fillStyle = ViewPort.DEBUG_CHUNK_LABEL_COLOUR;\n            context.font = ViewPort.DEBUG_CHUNK_LABEL_FONT;\n            context.textBaseline = 'middle';\n            context.textAlign = 'center';\n            for (let y = topLeft.y; y < bottomRight.y; y++) {\n                for (let x = topLeft.x; x < bottomRight.x; x++) {\n                    context.fillText(`${x}, ${y}`, x * this.options.gridSize.x + this.options.gridSize.x / 2, y * this.options.gridSize.y + this.options.gridSize.y / 2);\n                }\n            }\n            context.restore();\n        }\n        if (this.options.debug.showOrigin &&\n            pointInRectangle((0, vec_1.vec2)(0, 0), topLeft, bottomRight)) {\n            drawCross(context, (0, vec_1.vec2)(0, 0), ViewPort.DEBUG_ORIGIN_COLOUR, ViewPort.DEBUG_ORIGIN_LINE_WIDTH, ViewPort.DEBUG_ORIGIN_SIZE);\n        }\n    }\n}\nexports.ViewPort = ViewPort;\nViewPort.DEFAULT_OPTIONS = {\n    gridSize: (0, vec_1.vec2)(100, 100),\n    generator: () => ({}),\n    border: 1,\n    bufferAmount: 100,\n    maxElementsToGenerate: 10,\n    spatialHashMaxElements: 1000,\n    spatialHashMaxElementsToRemove: 100,\n};\nViewPort.DEBUG_ORIGIN_COLOUR = 'cyan';\nViewPort.DEBUG_ORIGIN_LINE_WIDTH = 2;\nViewPort.DEBUG_ORIGIN_SIZE = 10;\nViewPort.DEBUG_CHUNK_BORDER_COLOUR = 'yellow';\nViewPort.DEBUG_CHUNK_BORDER_LINE_WIDTH = 2;\nViewPort.DEBUG_CHUNK_LABEL_COLOUR = 'white';\nViewPort.DEBUG_CHUNK_LABEL_FONT = '12px monospace';\nclass SpatialHash {\n    constructor(maxElements, maxElementsToRemove) {\n        this.maxElements = maxElements;\n        this.maxElementsToRemove = maxElementsToRemove;\n        this.elements = [];\n        this.grid = new Map();\n    }\n    get count() {\n        return this.elements.length;\n    }\n    add(v, element) {\n        this.elements.push([v, element]);\n        this.grid.set(hashVec(v), element);\n        let i = 0;\n        while (this.elements.length > this.maxElements &&\n            i++ < this.maxElementsToRemove) {\n            const [oldV] = this.elements.shift();\n            this.grid.delete(hashVec(oldV));\n        }\n    }\n    remove(v) {\n        this.elements = this.elements.filter(([v2]) => !vec_1.vec2.eq(v, v2));\n        this.grid.delete(hashVec(v));\n    }\n    has(v) {\n        return this.grid.has(hashVec(v));\n    }\n    get(v) {\n        return this.grid.get(hashVec(v));\n    }\n    fetch(tl, br) {\n        if (tl === undefined && br === undefined) {\n            return this.elements.map(([_, element]) => element);\n        }\n        return this.elements\n            .filter(([v]) => {\n            if (tl && (v.x < tl.x || v.y < tl.y)) {\n                return false;\n            }\n            if (br && (v.x >= br.x || v.y >= br.y)) {\n                return false;\n            }\n            return true;\n        })\n            .map(([_, element]) => element);\n    }\n}\n\n\n//# sourceURL=webpack://@basementuniverse/view-port/./index.ts?\n}");
              }
              /******/
            };
            var __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
              var cachedModule = __webpack_module_cache__[moduleId];
              if (cachedModule !== void 0) {
                return cachedModule.exports;
              }
              var module2 = __webpack_module_cache__[moduleId] = {
                /******/
                // no module.id needed
                /******/
                // no module.loaded needed
                /******/
                exports: {}
                /******/
              };
              if (!(moduleId in __webpack_modules__)) {
                delete __webpack_module_cache__[moduleId];
                var e = new Error("Cannot find module '" + moduleId + "'");
                e.code = "MODULE_NOT_FOUND";
                throw e;
              }
              __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
              return module2.exports;
            }
            var __webpack_exports__ = __webpack_require__("./index.ts");
            return __webpack_exports__;
          })()
        );
      });
    }
  });

  // node_modules/@basementuniverse/utils/utils.js
  var require_utils = __commonJS({
    "node_modules/@basementuniverse/utils/utils.js"(exports2, module2) {
      var memoize = (f) => {
        var cache = {};
        return function(...args) {
          return cache[args] ?? (cache[args] = f.apply(this, args));
        };
      };
      var floatEquals = (a, b, p = Number.EPSILON) => Math.abs(a - b) < p;
      var clamp2 = (a, min = 0, max = 1) => a < min ? min : a > max ? max : a;
      var frac = (a) => a >= 0 ? a - Math.floor(a) : a - Math.ceil(a);
      var round = (n, d = 0) => {
        const p = Math.pow(10, d);
        return Math.round(n * p + Number.EPSILON) / p;
      };
      var lerp2 = (a, b, i) => a + (b - a) * i;
      var unlerp = (a, b, i) => (i - a) / (b - a);
      var blerp = (c00, c10, c01, c11, ix, iy) => lerp2(lerp2(c00, c10, ix), lerp2(c01, c11, ix), iy);
      var remap = (i, a1, a2, b1, b2) => b1 + (i - a1) * (b2 - b1) / (a2 - a1);
      var smoothstep = (a, b, i) => lerp2(a, b, 3 * Math.pow(i, 2) - 2 * Math.pow(i, 3));
      var radians = (degrees2) => Math.PI / 180 * degrees2;
      var degrees = (radians2) => 180 / Math.PI * radians2;
      var randomBetween = (min, max) => Math.random() * (max - min) + min;
      var randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      var cltRandom = (mu = 0.5, sigma = 0.5, samples = 2) => {
        let total = 0;
        for (let i = samples; i--; ) {
          total += Math.random();
        }
        return mu + (total - samples / 2) / (samples / 2) * sigma;
      };
      var cltRandomInt = (min, max) => Math.floor(min + cltRandom(0.5, 0.5, 2) * (max + 1 - min));
      var weightedRandom = (w) => {
        let total = w.reduce((a, i) => a + i, 0), n = 0;
        const r = Math.random() * total;
        while (total > r) {
          total -= w[n++];
        }
        return n - 1;
      };
      var lerpArray = (a, i, f = lerp2) => {
        const s = i * (a.length - 1);
        const p = clamp2(Math.trunc(s), 0, a.length - 1);
        return f(a[p] || 0, a[p + 1] || 0, frac(s));
      };
      var dot = (a, b) => a.reduce((n, v, i) => n + v * b[i], 0);
      var factorial = (a) => {
        let result = 1;
        for (let i = 2; i <= a; i++) {
          result *= i;
        }
        return result;
      };
      var npr = (n, r) => factorial(n) / factorial(n - r);
      var ncr = (n, r) => factorial(n) / (factorial(r) * factorial(n - r));
      var permutations = (a, r) => {
        if (r === 1) {
          return a.map((item) => [item]);
        }
        return a.reduce(
          (acc, item, i) => [
            ...acc,
            ...permutations(a.slice(0, i).concat(a.slice(i + 1)), r - 1).map((c) => [item, ...c])
          ],
          []
        );
      };
      var combinations = (a, r) => {
        if (r === 1) {
          return a.map((item) => [item]);
        }
        return a.reduce(
          (acc, item, i) => [
            ...acc,
            ...combinations(a.slice(i + 1), r - 1).map((c) => [item, ...c])
          ],
          []
        );
      };
      var cartesian = (...arr) => arr.reduce(
        (a, b) => a.flatMap((c) => b.map((d) => [...c, d])),
        [[]]
      );
      var times = (f, n) => Array(n).fill(0).map((_, i) => f(i));
      var range = (n) => times((i) => i, n);
      var zip = (...a) => times((i) => a.map((a2) => a2[i]), Math.max(...a.map((a2) => a2.length)));
      var at = (a, i) => a[i < 0 ? a.length - Math.abs(i + 1) % a.length - 1 : i % a.length];
      var peek = (a) => {
        if (!a.length) {
          return void 0;
        }
        return a[a.length - 1];
      };
      var ind = (x, y, w) => x + y * w;
      var pos = (i, w) => [i % w, Math.floor(i / w)];
      var chunk = (a, n) => times((i) => a.slice(i * n, i * n + n), Math.ceil(a.length / n));
      var shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
      var flat = (o, concatenator = ".") => {
        return Object.keys(o).reduce((acc, key) => {
          if (o[key] instanceof Date) {
            return {
              ...acc,
              [key]: o[key].toISOString()
            };
          }
          if (typeof o[key] !== "object" || !o[key]) {
            return {
              ...acc,
              [key]: o[key]
            };
          }
          const flattened = flat(o[key], concatenator);
          return {
            ...acc,
            ...Object.keys(flattened).reduce(
              (childAcc, childKey) => ({
                ...childAcc,
                [`${key}${concatenator}${childKey}`]: flattened[childKey]
              }),
              {}
            )
          };
        }, {});
      };
      var unflat = (o, concatenator = ".") => {
        let result = {}, temp, substrings, property, i;
        for (property in o) {
          substrings = property.split(concatenator);
          temp = result;
          for (i = 0; i < substrings.length - 1; i++) {
            if (!(substrings[i] in temp)) {
              if (isFinite(substrings[i + 1])) {
                temp[substrings[i]] = [];
              } else {
                temp[substrings[i]] = {};
              }
            }
            temp = temp[substrings[i]];
          }
          temp[substrings[substrings.length - 1]] = o[property];
        }
        return result;
      };
      var split = (array, predicate) => {
        const result = [];
        let current = [];
        for (const value of array) {
          if (predicate(value)) {
            if (current.length) {
              result.push(current);
            }
            current = [value];
          } else {
            current.push(value);
          }
        }
        result.push(current);
        return result;
      };
      var pluck = (o, ...keys) => {
        return keys.reduce(
          (result, key) => Object.assign(result, { [key]: o[key] }),
          {}
        );
      };
      var exclude = (o, ...keys) => {
        return Object.fromEntries(
          Object.entries(o).filter(([key]) => !keys.includes(key))
        );
      };
      var transform = (o, kf = void 0, vf = void 0) => {
        const innerTransform = (obj, currentPath) => {
          return Object.entries(obj).reduce((acc, [key, value]) => {
            let newKey = key;
            let newValue = value;
            const path = currentPath ? `${currentPath}.${key}` : key;
            if (typeof newValue === "object" && newValue !== null && !(newValue instanceof Date) && !Array.isArray(newValue)) {
              newValue = innerTransform(newValue, path);
            } else if (vf) {
              newValue = vf(obj, path, key, value);
            }
            if (kf) {
              newKey = kf(obj, path, key, newValue);
              if (newKey === null) {
                return acc;
              }
            }
            return {
              ...acc,
              [newKey]: newValue
            };
          }, {});
        };
        return innerTransform(o, "");
      };
      if (typeof module2 !== "undefined") {
        module2.exports = {
          memoize,
          floatEquals,
          clamp: clamp2,
          frac,
          round,
          lerp: lerp2,
          unlerp,
          blerp,
          remap,
          smoothstep,
          radians,
          degrees,
          randomBetween,
          randomIntBetween,
          cltRandom,
          cltRandomInt,
          weightedRandom,
          lerpArray,
          dot,
          factorial,
          npr,
          ncr,
          permutations,
          combinations,
          cartesian,
          times,
          range,
          zip,
          at,
          peek,
          ind,
          pos,
          chunk,
          shuffle,
          flat,
          unflat,
          split,
          pluck,
          exclude,
          transform
        };
      }
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    EventBus: () => EventBus,
    GraphBuilder: () => GraphBuilder,
    LayeredLayoutDirection: () => LayeredLayoutDirection,
    PortSide: () => PortSide,
    PortType: () => PortType,
    ToolMode: () => ToolMode,
    TraversalDirection: () => TraversalDirection,
    default: () => GraphBuilder
  });

  // src/enums/LayeredLayoutDirection.ts
  var LayeredLayoutDirection = /* @__PURE__ */ ((LayeredLayoutDirection2) => {
    LayeredLayoutDirection2["TopDown"] = "top-down";
    LayeredLayoutDirection2["BottomUp"] = "bottom-up";
    LayeredLayoutDirection2["LeftRight"] = "left-right";
    LayeredLayoutDirection2["RightLeft"] = "right-left";
    return LayeredLayoutDirection2;
  })(LayeredLayoutDirection || {});

  // src/enums/PortSide.ts
  var PortSide = /* @__PURE__ */ ((PortSide2) => {
    PortSide2["Top"] = "top";
    PortSide2["Right"] = "right";
    PortSide2["Bottom"] = "bottom";
    PortSide2["Left"] = "left";
    return PortSide2;
  })(PortSide || {});

  // src/enums/PortType.ts
  var PortType = /* @__PURE__ */ ((PortType2) => {
    PortType2["Input"] = "input";
    PortType2["Output"] = "output";
    return PortType2;
  })(PortType || {});

  // src/enums/ToolMode.ts
  var ToolMode = /* @__PURE__ */ ((ToolMode2) => {
    ToolMode2["Select"] = "select";
    ToolMode2["Pan"] = "pan";
    ToolMode2["CreateNode"] = "create-node";
    ToolMode2["ResizeNode"] = "resize-node";
    ToolMode2["CreateEdge"] = "create-edge";
    return ToolMode2;
  })(ToolMode || {});

  // src/enums/TraversalDirection.ts
  var TraversalDirection = /* @__PURE__ */ ((TraversalDirection2) => {
    TraversalDirection2["In"] = "in";
    TraversalDirection2["Out"] = "out";
    TraversalDirection2["Both"] = "both";
    return TraversalDirection2;
  })(TraversalDirection || {});

  // src/events/EventBus.ts
  var EventBus = class {
    constructor() {
      this.listeners = {};
    }
    on(event, handler) {
      const listeners = this.ensureListeners(event);
      listeners.add(handler);
      return () => this.off(event, handler);
    }
    off(event, handler) {
      const listeners = this.listeners[event];
      if (!listeners) {
        return;
      }
      listeners.delete(handler);
      if (listeners.size === 0) {
        delete this.listeners[event];
      }
    }
    once(event, handler) {
      const dispose = this.on(event, (payload) => {
        dispose();
        handler(payload);
      });
      return dispose;
    }
    emit(event, payload) {
      const listeners = this.listeners[event];
      if (!listeners || listeners.size === 0) {
        return;
      }
      for (const listener of [...listeners]) {
        listener(payload);
      }
    }
    emitCancellable(event, payload) {
      const listeners = this.listeners[event];
      if (!listeners || listeners.size === 0) {
        return { cancelled: false };
      }
      for (const listener of [...listeners]) {
        if (listener(payload) === false) {
          return { cancelled: true };
        }
      }
      return { cancelled: false };
    }
    clear() {
      this.listeners = {};
    }
    ensureListeners(event) {
      if (!this.listeners[event]) {
        this.listeners[event] = /* @__PURE__ */ new Set();
      }
      return this.listeners[event];
    }
  };

  // src/GraphBuilder.ts
  var import_animation = __toESM(require_build());
  var import_camera = __toESM(require_build2());
  var import_debug = __toESM(require_build3());
  var import_frame_timer = __toESM(require_build4());
  var import_input_manager = __toESM(require_build5());
  var import_vec9 = __toESM(require_vec());
  var import_view_port = __toESM(require_build6());

  // src/constants.ts
  var import_vec = __toESM(require_vec());
  var DEBUG = false;
  var FPS_MIN = 30;
  var GRID_SIZE = 32;
  var NODE_MIN_SIZE = 50;
  var NODE_MAX_SIZE = 400;
  var NODE_EASE_AMOUNT = 0.4;
  var CAMERA_KEYBOARD_PAN_SPEED = 600;
  var CAMERA_ZOOM_STEP = 0.1;
  var DEFAULT_NODE_SIZE = (0, import_vec.vec2)(200, 120);
  var PORT_HOVER_MARGIN = 8;
  var PORT_CONNECT_MARGIN = 16;
  var EDGE_CURVE_ENDPOINT_OFFSET = 8;
  var EDGE_CURVE_SAMPLE_DISTANCE = 30;
  var EDGE_HOVER_THRESHOLD = 24;
  var DELETE_BUTTON_SIZE = 20;
  var RESIZE_HANDLE_SIZE = 20;
  var GRAPH_SERIALIZATION_VERSION = 1;
  var DEFAULT_CAPABILITIES = {
    createNodes: true,
    createEdges: true,
    deleteNodes: true,
    deleteEdges: true,
    resizeNodes: true,
    moveNodes: true
  };
  var DEFAULT_THEME = {
    // Background
    backgroundColor: "#333",
    // Grid
    gridDotColor: "#fff1",
    gridDotLineWidth: 2,
    // Node frame
    nodeFillColor: "#fff2",
    nodeSelectedFillColor: "#fff5",
    nodeBorderColor: "#fff5",
    nodeHoveredBorderColor: "#fff8",
    nodeBorderWidth: 2,
    nodeBorderRadius: 10,
    nodePadding: 5,
    // Node label
    showNodeLabel: true,
    nodeLabelColor: "#fffb",
    nodeLabelFont: "bold 12px sans-serif",
    // Delete button
    deleteButtonColor: "#fff5",
    deleteButtonHoveredColor: "#fff8",
    deleteButtonLineWidth: 2,
    // Resize handle
    resizeHandleColor: "#fff2",
    resizeHandleHoveredColor: "#fff5",
    resizeHandleLineWidth: 2,
    // Port
    portRadius: 8,
    portCutoutRadius: 12,
    portFillColor: "#fff2",
    portHoveredFillColor: "#fff4",
    portInvalidFillColor: "#ff334433",
    portBorderColor: "#fff5",
    portHoveredBorderColor: "#fff8",
    portInvalidBorderColor: "#ff6677",
    portBorderWidth: 2,
    portHoverRingColor: "#fff2",
    portInvalidRingColor: "#ff445588",
    portHoverRingLineWidth: 6,
    portHoverRingRadius: 12,
    portArrowSize: 6,
    portArrowColor: "#fff5",
    portArrowOffset: 0.44,
    portPulseColor: "#66ccff",
    portPulseLineWidth: 2,
    portPulseFromRadius: 10,
    portPulseToRadius: 30,
    portPulseMaxOpacity: 0.8,
    // Port label
    showPortLabel: true,
    portLabelOffset: 8,
    portLabelColor: "#fffb",
    portLabelFont: "10px sans-serif",
    // Edge
    edgeColor: "#fff2",
    edgeHoveredColor: "#fff4",
    edgeLineWidth: 3,
    edgeHoverOutlineColor: "#fff2",
    edgeHoverOutlineLineWidth: 10,
    edgeArrowSize: 8,
    edgeArrowColor: "#fff5",
    edgeArrowOffset: 0.5,
    // Edge preview
    edgePreviewColor: "#fff6",
    edgePreviewLineWidth: 3,
    edgePreviewOutlineColor: "#fff3",
    edgePreviewOutlineLineWidth: 10,
    edgeDashColor: "#7dd3fc",
    edgeDashLineWidth: 3,
    edgeDotColor: "#fde047",
    edgeDotRadius: 4,
    edgeDotOpacity: 1
  };
  var DEFAULT_EFFECTS = {
    enabled: true,
    timeScale: 1,
    maxEdgeDotInstances: 200,
    maxPortPulseInstances: 400,
    edgeDash: {
      running: false,
      speed: 110,
      dashPattern: [10, 6],
      lineWidth: 3,
      color: "#7dd3fc",
      opacity: 0.9,
      blendMode: "source-over",
      phase: 0
    },
    edgeDot: {
      running: false,
      loop: false,
      speed: 220,
      duration: 0.5,
      spawnInterval: 0.2,
      radius: 4,
      color: "#fde047",
      opacity: 1,
      blendMode: "source-over",
      animation: {
        interpolationFunction: "linear"
      }
    },
    portPulse: {
      duration: 0.5,
      fromRadius: 10,
      toRadius: 30,
      lineWidth: 2,
      color: "#66ccff",
      maxOpacity: 0.8,
      blendMode: "source-over",
      animation: {
        interpolationFunction: "ease-out-cubic"
      }
    }
  };
  var DEFAULT_FORCE_DIRECTED_LAYOUT_OPTIONS = {
    iterations: 120,
    timeBudgetMs: void 0,
    repulsionStrength: 15e3,
    attractionStrength: 0.02,
    minNodeSpacing: 120,
    damping: 0.85,
    maxStep: 16
  };
  var DEFAULT_LAYERED_LAYOUT_OPTIONS = {
    direction: "top-down" /* TopDown */,
    layerSpacing: 220,
    nodeSpacing: 180
  };

  // src/EdgeTool.ts
  var import_vec2 = __toESM(require_vec());
  var EdgeTool = class _EdgeTool {
    constructor(a, theme) {
      this.a = a;
      this.pointerDirection = null;
      this.theme = theme;
      this.pointer = (0, import_vec2.vec2)(a.position);
      this.smoothedFinalDirection = import_vec2.vec2.mul(a.direction, -1);
    }
    static {
      this.FINAL_DIRECTION_EASE = 0.2;
    }
    update(pointer, pointerDirection = null) {
      this.pointer = (0, import_vec2.vec2)(pointer);
      this.pointerDirection = pointerDirection ? (0, import_vec2.vec2)(pointerDirection) : null;
      const quantizedDirection = this.quantizedDirectionFromPointer(this.pointer);
      const targetDirection = this.pointerDirection ? this.normalizedDirectionOrFallback(
        this.pointerDirection,
        quantizedDirection
      ) : quantizedDirection;
      this.smoothedFinalDirection = this.easeDirection(
        this.smoothedFinalDirection,
        targetDirection,
        _EdgeTool.FINAL_DIRECTION_EASE
      );
    }
    /**
     * Returns the geometry data needed to draw the in-progress edge preview.
     * `from` and `to` are already offset from the port/pointer centres by
     * `EDGE_CURVE_ENDPOINT_OFFSET`, matching the convention used for drawn edges.
     */
    getDrawData() {
      const from = import_vec2.vec2.add(
        this.a.position,
        import_vec2.vec2.mul(this.a.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      const toDirection = this.smoothedFinalDirection;
      const to = import_vec2.vec2.add(
        this.pointer,
        import_vec2.vec2.mul(toDirection, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      return { from, to, fromDirection: this.a.direction, toDirection };
    }
    normalizedDirectionOrFallback(direction, fallback) {
      const directionLength = import_vec2.vec2.len(direction);
      if (directionLength > 0) {
        return import_vec2.vec2.div(direction, directionLength);
      }
      const fallbackLength = import_vec2.vec2.len(fallback);
      if (fallbackLength > 0) {
        return import_vec2.vec2.div(fallback, fallbackLength);
      }
      return (0, import_vec2.vec2)(0, -1);
    }
    quantizedDirectionFromPointer(pointer) {
      const start = import_vec2.vec2.add(
        this.a.position,
        import_vec2.vec2.mul(this.a.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      const toPointer = import_vec2.vec2.sub(pointer, start);
      const xDominant = Math.abs(toPointer.x) >= Math.abs(toPointer.y);
      if (xDominant) {
        return toPointer.x >= 0 ? (0, import_vec2.vec2)(-1, 0) : (0, import_vec2.vec2)(1, 0);
      }
      return toPointer.y >= 0 ? (0, import_vec2.vec2)(0, -1) : (0, import_vec2.vec2)(0, 1);
    }
    easeDirection(from, to, amount) {
      const blended = import_vec2.vec2.add(import_vec2.vec2.mul(from, 1 - amount), import_vec2.vec2.mul(to, amount));
      return this.normalizedDirectionOrFallback(blended, to);
    }
  };

  // src/layout/ForceDirectedLayout.ts
  var import_vec3 = __toESM(require_vec());
  async function layoutForceDirected(graph, options = {}) {
    const settings = { ...DEFAULT_FORCE_DIRECTED_LAYOUT_OPTIONS, ...options };
    const startTime = Date.now();
    const positions = /* @__PURE__ */ new Map();
    const velocities = /* @__PURE__ */ new Map();
    for (const node of graph.nodes) {
      positions.set(node.id, (0, import_vec3.vec2)(node.position));
      velocities.set(node.id, (0, import_vec3.vec2)());
    }
    let converged = false;
    let iterationsCompleted = 0;
    for (let iteration = 0; iteration < settings.iterations; iteration++) {
      if (settings.timeBudgetMs !== void 0 && Date.now() - startTime >= settings.timeBudgetMs) {
        break;
      }
      const forces = /* @__PURE__ */ new Map();
      for (const node of graph.nodes) {
        forces.set(node.id, (0, import_vec3.vec2)());
      }
      for (let i = 0; i < graph.nodes.length; i++) {
        for (let j = i + 1; j < graph.nodes.length; j++) {
          const a = graph.nodes[i];
          const b = graph.nodes[j];
          const aPos = positions.get(a.id);
          const bPos = positions.get(b.id);
          let delta = import_vec3.vec2.sub(aPos, bPos);
          let distance = import_vec3.vec2.len(delta);
          if (distance < 1) {
            delta = (0, import_vec3.vec2)(Math.random() - 0.5, Math.random() - 0.5);
            distance = Math.max(1, import_vec3.vec2.len(delta));
          }
          const direction = import_vec3.vec2.div(delta, distance);
          const effectiveDistance = Math.max(
            1,
            distance - settings.minNodeSpacing
          );
          const repulsion = settings.repulsionStrength / (effectiveDistance * effectiveDistance);
          const repulsionVec = import_vec3.vec2.mul(direction, repulsion);
          forces.set(a.id, import_vec3.vec2.add(forces.get(a.id), repulsionVec));
          forces.set(b.id, import_vec3.vec2.sub(forces.get(b.id), repulsionVec));
        }
      }
      for (const edge of graph.edges) {
        const source = edge.a.nodeId;
        const target = edge.b.nodeId;
        if (!positions.has(source) || !positions.has(target)) {
          continue;
        }
        const sourcePos = positions.get(source);
        const targetPos = positions.get(target);
        const delta = import_vec3.vec2.sub(targetPos, sourcePos);
        const distance = Math.max(1, import_vec3.vec2.len(delta));
        const direction = import_vec3.vec2.div(delta, distance);
        const attraction = (distance - settings.minNodeSpacing) * settings.attractionStrength;
        const attractionVec = import_vec3.vec2.mul(direction, attraction);
        forces.set(source, import_vec3.vec2.add(forces.get(source), attractionVec));
        forces.set(target, import_vec3.vec2.sub(forces.get(target), attractionVec));
      }
      let totalStep = 0;
      for (const node of graph.nodes) {
        const force = forces.get(node.id);
        const oldVelocity = velocities.get(node.id);
        const dampedVelocity = import_vec3.vec2.mul(oldVelocity, settings.damping);
        let velocity = import_vec3.vec2.add(dampedVelocity, force);
        const speed = import_vec3.vec2.len(velocity);
        if (speed > settings.maxStep) {
          velocity = import_vec3.vec2.mul(import_vec3.vec2.div(velocity, speed), settings.maxStep);
        }
        velocities.set(node.id, velocity);
        positions.set(node.id, import_vec3.vec2.add(positions.get(node.id), velocity));
        totalStep += import_vec3.vec2.len(velocity);
      }
      iterationsCompleted = iteration + 1;
      if (totalStep / Math.max(1, graph.nodes.length) < 0.05) {
        converged = true;
        break;
      }
      if (iteration % 10 === 0) {
        await Promise.resolve();
      }
    }
    return {
      nodePositions: positions,
      converged,
      iterationsCompleted
    };
  }

  // src/utils/canvas.ts
  var import_vec4 = __toESM(require_vec());
  function cross(context, position, size) {
    const halfSize = size / 2;
    context.beginPath();
    context.moveTo(position.x - halfSize, position.y - halfSize);
    context.lineTo(position.x + halfSize, position.y + halfSize);
    context.moveTo(position.x + halfSize, position.y - halfSize);
    context.lineTo(position.x - halfSize, position.y + halfSize);
    context.stroke();
  }
  function plus(context, position, size) {
    const halfSize = size / 2;
    context.beginPath();
    context.moveTo(position.x - halfSize, position.y);
    context.lineTo(position.x + halfSize, position.y);
    context.moveTo(position.x, position.y - halfSize);
    context.lineTo(position.x, position.y + halfSize);
    context.stroke();
  }
  function line(context, a, b) {
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.stroke();
  }
  function triangle(context, position, direction, size) {
    context.save();
    context.translate(position.x, position.y);
    context.rotate(import_vec4.vec2.rad(direction));
    context.beginPath();
    context.moveTo(size / 2, 0);
    context.lineTo(-size / 2, size / 2);
    context.lineTo(-size / 2, -size / 2);
    context.closePath();
    context.fill();
    context.restore();
  }
  function roundedRect(context, position, size, borderRadius) {
    const x = position.x;
    const y = position.y;
    const width = size.x;
    const height = size.y;
    context.beginPath();
    context.moveTo(x + borderRadius, y);
    context.lineTo(x + width - borderRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
    context.lineTo(x + width, y + height - borderRadius);
    context.quadraticCurveTo(
      x + width,
      y + height,
      x + width - borderRadius,
      y + height
    );
    context.lineTo(x + borderRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
    context.lineTo(x, y + borderRadius);
    context.quadraticCurveTo(x, y, x + borderRadius, y);
    context.closePath();
  }

  // src/utils/curve.ts
  var import_utils = __toESM(require_utils());
  var import_vec5 = __toESM(require_vec());
  function curveFromTo(context, a, b, initialDirection, finalDirection, gridSize) {
    context.beginPath();
    const { cp1, cp2, join } = getCurveGeometry(
      a,
      b,
      initialDirection,
      finalDirection,
      gridSize
    );
    context.moveTo(a.x, a.y);
    context.quadraticCurveTo(cp1.x, cp1.y, join.x, join.y);
    context.quadraticCurveTo(cp2.x, cp2.y, b.x, b.y);
    context.stroke();
  }
  function getCurveGeometry(a, b, initialDirection, finalDirection, gridSize) {
    const distance = import_vec5.vec2.len(import_vec5.vec2.sub(a, b));
    const minDistance = gridSize * 4;
    let curveStrength = gridSize;
    if (distance < minDistance) {
      curveStrength = (0, import_utils.lerp)(0, gridSize, (0, import_utils.clamp)(distance / minDistance, 0, 1));
    }
    const cp1 = import_vec5.vec2.add(a, import_vec5.vec2.mul(initialDirection, curveStrength));
    const cp2 = import_vec5.vec2.add(b, import_vec5.vec2.mul(finalDirection, curveStrength));
    const join = import_vec5.vec2.div(import_vec5.vec2.add(cp1, cp2), 2);
    return { cp1, cp2, join };
  }
  function sampleBezierChain(a, cp1, join, cp2, b, t) {
    t = Math.max(0, Math.min(1, t));
    if (t <= 0.5) {
      const s = t * 2;
      return {
        position: sampleQuadratic(a, cp1, join, s),
        tangent: tangentQuadratic(a, cp1, join, s)
      };
    } else {
      const s = (t - 0.5) * 2;
      return {
        position: sampleQuadratic(join, cp2, b, s),
        tangent: tangentQuadratic(join, cp2, b, s)
      };
    }
  }
  function sampleQuadratic(a, cp, b, t) {
    const mt = 1 - t;
    return (0, import_vec5.vec2)(
      mt * mt * a.x + 2 * mt * t * cp.x + t * t * b.x,
      mt * mt * a.y + 2 * mt * t * cp.y + t * t * b.y
    );
  }
  function tangentQuadratic(a, cp, b, t) {
    const dx = 2 * (1 - t) * (cp.x - a.x) + 2 * t * (b.x - cp.x);
    const dy = 2 * (1 - t) * (cp.y - a.y) + 2 * t * (b.y - cp.y);
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) {
      return (0, import_vec5.vec2)(1, 0);
    }
    return (0, import_vec5.vec2)(dx / len, dy / len);
  }
  function pointToQuadraticBezierDistance(p, a, cp, b, t) {
    const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cp.x + t * t * b.x;
    const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cp.y + t * t * b.y;
    return import_vec5.vec2.len(import_vec5.vec2.sub(p, { x, y }));
  }

  // src/utils/layout.ts
  var import_vec6 = __toESM(require_vec());
  function toPosition(direction, layerIndex, nodeIndex, layerSpacing, nodeSpacing) {
    switch (direction) {
      case "bottom-up" /* BottomUp */:
        return (0, import_vec6.vec2)(nodeIndex * nodeSpacing, -layerIndex * layerSpacing);
      case "left-right" /* LeftRight */:
        return (0, import_vec6.vec2)(layerIndex * layerSpacing, nodeIndex * nodeSpacing);
      case "right-left" /* RightLeft */:
        return (0, import_vec6.vec2)(-layerIndex * layerSpacing, nodeIndex * nodeSpacing);
      case "top-down" /* TopDown */:
      default:
        return (0, import_vec6.vec2)(nodeIndex * nodeSpacing, layerIndex * layerSpacing);
    }
  }

  // src/utils/point.ts
  var import_vec7 = __toESM(require_vec());
  function pointInRectangle(point, rectangle) {
    return point.x >= rectangle.position.x && point.x <= rectangle.position.x + rectangle.size.x && point.y >= rectangle.position.y && point.y <= rectangle.position.y + rectangle.size.y;
  }
  function pointInCircle(point, circle) {
    return import_vec7.vec2.len(import_vec7.vec2.sub(point, circle.position)) <= circle.radius;
  }

  // src/utils/traversal.ts
  function resolveEdgeNodeIds(edge) {
    return {
      from: edge.a.nodeId,
      to: edge.b.nodeId
    };
  }
  function buildAdjacency(graph) {
    const outgoing = /* @__PURE__ */ new Map();
    const incoming = /* @__PURE__ */ new Map();
    for (const node of graph.nodes) {
      outgoing.set(node.id, /* @__PURE__ */ new Set());
      incoming.set(node.id, /* @__PURE__ */ new Set());
    }
    for (const edge of graph.edges) {
      const { from, to } = resolveEdgeNodeIds(edge);
      if (!outgoing.has(from)) {
        outgoing.set(from, /* @__PURE__ */ new Set());
      }
      if (!incoming.has(to)) {
        incoming.set(to, /* @__PURE__ */ new Set());
      }
      outgoing.get(from).add(to);
      incoming.get(to).add(from);
    }
    return { outgoing, incoming };
  }
  function getNeighborsFromAdjacency(adjacency, nodeId, direction) {
    const { outgoing, incoming } = adjacency;
    if (direction === "out" /* Out */) {
      return [...outgoing.get(nodeId) ?? /* @__PURE__ */ new Set()];
    }
    if (direction === "in" /* In */) {
      return [...incoming.get(nodeId) ?? /* @__PURE__ */ new Set()];
    }
    return [
      .../* @__PURE__ */ new Set([
        ...outgoing.get(nodeId) ?? /* @__PURE__ */ new Set(),
        ...incoming.get(nodeId) ?? /* @__PURE__ */ new Set()
      ])
    ];
  }
  function cloneEdge(edge) {
    return {
      ...edge,
      a: { ...edge.a },
      b: { ...edge.b }
    };
  }
  function cloneNode(node) {
    return {
      ...node,
      position: { ...node.position },
      size: { ...node.size },
      ports: node.ports.map((port) => ({ ...port }))
    };
  }
  function buildTraversalConnections(graph) {
    const byNodeId = /* @__PURE__ */ new Map();
    const byNodePortKey = /* @__PURE__ */ new Map();
    const ensureByNodeId = (nodeId) => {
      let connections = byNodeId.get(nodeId);
      if (!connections) {
        connections = [];
        byNodeId.set(nodeId, connections);
      }
      return connections;
    };
    const ensureByNodePortKey = (nodeId, portId) => {
      const key = `${nodeId}:${portId}`;
      let connections = byNodePortKey.get(key);
      if (!connections) {
        connections = [];
        byNodePortKey.set(key, connections);
      }
      return connections;
    };
    for (const node of graph.nodes) {
      ensureByNodeId(node.id);
      for (const port of node.ports) {
        ensureByNodePortKey(node.id, port.id);
      }
    }
    for (const edge of graph.edges) {
      const edgeFromA = {
        edge,
        portId: edge.a.portId,
        otherNodeId: edge.b.nodeId
      };
      ensureByNodeId(edge.a.nodeId).push(edgeFromA);
      ensureByNodePortKey(edge.a.nodeId, edge.a.portId).push(edgeFromA);
      const edgeFromB = {
        edge,
        portId: edge.b.portId,
        otherNodeId: edge.a.nodeId
      };
      ensureByNodeId(edge.b.nodeId).push(edgeFromB);
      ensureByNodePortKey(edge.b.nodeId, edge.b.portId).push(edgeFromB);
    }
    return {
      byNodeId,
      byNodePortKey
    };
  }
  function hydrateTraversalNode(nodeId, nodesById, connections) {
    const node = nodesById.get(nodeId);
    if (!node) {
      return null;
    }
    const nodeConnections = connections.byNodeId.get(nodeId) ?? [];
    const adjacentNodeIds = /* @__PURE__ */ new Set();
    const adjacentEdges = nodeConnections.flatMap((connection) => {
      const otherNode = nodesById.get(connection.otherNodeId);
      if (!otherNode) {
        return [];
      }
      adjacentNodeIds.add(otherNode.id);
      return [
        {
          ...cloneEdge(connection.edge),
          otherNode: cloneNode(otherNode)
        }
      ];
    });
    const adjacentNodes = [...adjacentNodeIds].map((id) => nodesById.get(id)).filter(
      (adjacent) => adjacent !== void 0
    ).map((adjacent) => cloneNode(adjacent));
    const ports = node.ports.map((port) => {
      const portConnections = connections.byNodePortKey.get(`${node.id}:${port.id}`) ?? [];
      const connectedEdges = portConnections.flatMap((connection) => {
        const otherNode = nodesById.get(connection.otherNodeId);
        if (!otherNode) {
          return [];
        }
        return [
          {
            ...cloneEdge(connection.edge),
            otherNode: cloneNode(otherNode)
          }
        ];
      });
      return {
        ...port,
        connectedEdge: connectedEdges[0] ?? null,
        connectedEdges
      };
    });
    return {
      ...cloneNode(node),
      ports,
      adjacentNodes,
      adjacentEdges
    };
  }
  function getNeighbors(graph, nodeId, direction = "both" /* Both */) {
    return getNeighborsFromAdjacency(buildAdjacency(graph), nodeId, direction);
  }
  function traverseBFS(graph, startNodeId, visitor, direction = "both" /* Both */) {
    const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
    if (!nodesById.has(startNodeId)) {
      return [];
    }
    const adjacency = buildAdjacency(graph);
    const traversalConnections = buildTraversalConnections(graph);
    const results = [];
    const visited = /* @__PURE__ */ new Set();
    const queue = [
      { nodeId: startNodeId, depth: 0 }
    ];
    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current.nodeId)) {
        continue;
      }
      visited.add(current.nodeId);
      const node = hydrateTraversalNode(
        current.nodeId,
        nodesById,
        traversalConnections
      );
      if (!node) {
        continue;
      }
      const response = visitor(node, current.depth);
      if (response !== void 0 && response !== null && typeof response === "object") {
        if ("stop" in response && response.stop) {
          return results;
        }
        if ("skip" in response && response.skip) {
          continue;
        }
      } else if (response !== void 0) {
        results.push(response);
      }
      for (const neighbor of getNeighborsFromAdjacency(
        adjacency,
        current.nodeId,
        direction
      )) {
        if (!visited.has(neighbor)) {
          queue.push({ nodeId: neighbor, depth: current.depth + 1 });
        }
      }
    }
    return results;
  }
  function traverseDFS(graph, startNodeId, visitor, direction = "both" /* Both */) {
    const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
    if (!nodesById.has(startNodeId)) {
      return [];
    }
    const adjacency = buildAdjacency(graph);
    const traversalConnections = buildTraversalConnections(graph);
    const results = [];
    const visited = /* @__PURE__ */ new Set();
    const walk = (nodeId, depth) => {
      if (visited.has(nodeId)) {
        return false;
      }
      visited.add(nodeId);
      const node = hydrateTraversalNode(nodeId, nodesById, traversalConnections);
      if (!node) {
        return false;
      }
      const response = visitor(node, depth);
      if (response !== void 0 && response !== null && typeof response === "object") {
        if ("stop" in response && response.stop) {
          return true;
        }
        if ("skip" in response && response.skip) {
          return false;
        }
      } else if (response !== void 0) {
        results.push(response);
      }
      for (const neighbor of getNeighborsFromAdjacency(
        adjacency,
        nodeId,
        direction
      )) {
        if (walk(neighbor, depth + 1)) {
          return true;
        }
      }
      return false;
    };
    walk(startNodeId, 0);
    return results;
  }
  function traverseTopological(graph, visitor) {
    const order = topologicalSort(graph);
    if (!order) {
      return null;
    }
    const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
    const adjacency = buildAdjacency(graph);
    const traversalConnections = buildTraversalConnections(graph);
    const depthByNodeId = /* @__PURE__ */ new Map();
    for (const nodeId of order) {
      const incoming = adjacency.incoming.get(nodeId) ?? /* @__PURE__ */ new Set();
      let depth = 0;
      for (const parentId of incoming) {
        depth = Math.max(depth, (depthByNodeId.get(parentId) ?? 0) + 1);
      }
      depthByNodeId.set(nodeId, depth);
    }
    const results = [];
    for (const nodeId of order) {
      const node = hydrateTraversalNode(nodeId, nodesById, traversalConnections);
      if (!node) {
        continue;
      }
      const response = visitor(node, depthByNodeId.get(nodeId) ?? 0);
      if (response !== void 0 && response !== null && typeof response === "object") {
        if ("stop" in response && response.stop) {
          return results;
        }
        if ("skip" in response && response.skip) {
          continue;
        }
      } else if (response !== void 0) {
        results.push(response);
      }
    }
    return results;
  }
  function topologicalSort(graph) {
    const { outgoing, incoming } = buildAdjacency(graph);
    const inDegree = /* @__PURE__ */ new Map();
    for (const node of graph.nodes) {
      inDegree.set(node.id, (incoming.get(node.id) ?? /* @__PURE__ */ new Set()).size);
    }
    const queue = [...inDegree.entries()].filter(([, degree]) => degree === 0).map(([nodeId]) => nodeId);
    const sorted = [];
    while (queue.length > 0) {
      const nodeId = queue.shift();
      sorted.push(nodeId);
      for (const neighbor of outgoing.get(nodeId) ?? /* @__PURE__ */ new Set()) {
        const nextDegree = (inDegree.get(neighbor) ?? 0) - 1;
        inDegree.set(neighbor, nextDegree);
        if (nextDegree === 0) {
          queue.push(neighbor);
        }
      }
    }
    return sorted.length === graph.nodes.length ? sorted : null;
  }
  function hasCycle(graph) {
    return topologicalSort(graph) === null;
  }

  // src/utils/vec.ts
  var import_vec8 = __toESM(require_vec());
  function clampVec(value, min, max) {
    return (0, import_vec8.vec2)(
      Math.min(Math.max(value.x, min.x), max.x),
      Math.min(Math.max(value.y, min.y), max.y)
    );
  }
  function roundVec(value, step) {
    return (0, import_vec8.vec2)(
      Math.round(value.x / step) * step,
      Math.round(value.y / step) * step
    );
  }

  // src/layout/LayeredLayout.ts
  async function layoutLayered(graph, options = {}) {
    const settings = { ...DEFAULT_LAYERED_LAYOUT_OPTIONS, ...options };
    const topo = topologicalSort(graph);
    if (!topo) {
      return null;
    }
    const incoming = /* @__PURE__ */ new Map();
    for (const node of graph.nodes) {
      incoming.set(node.id, /* @__PURE__ */ new Set());
    }
    for (const edge of graph.edges) {
      incoming.get(edge.b.nodeId)?.add(edge.a.nodeId);
    }
    const layerByNode = /* @__PURE__ */ new Map();
    for (const nodeId of topo) {
      const parents = [...incoming.get(nodeId) ?? /* @__PURE__ */ new Set()];
      if (parents.length === 0) {
        layerByNode.set(nodeId, 0);
        continue;
      }
      let layer = 0;
      for (const parent of parents) {
        layer = Math.max(layer, (layerByNode.get(parent) ?? 0) + 1);
      }
      layerByNode.set(nodeId, layer);
    }
    const layers = [];
    for (const nodeId of topo) {
      const layer = layerByNode.get(nodeId) ?? 0;
      if (!layers[layer]) {
        layers[layer] = [];
      }
      layers[layer].push(nodeId);
    }
    const nodePositions = /* @__PURE__ */ new Map();
    for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
      const layer = layers[layerIndex];
      for (let nodeIndex = 0; nodeIndex < layer.length; nodeIndex++) {
        const nodeId = layer[nodeIndex];
        nodePositions.set(
          nodeId,
          toPosition(
            settings.direction,
            layerIndex,
            nodeIndex,
            settings.layerSpacing,
            settings.nodeSpacing
          )
        );
      }
      await Promise.resolve();
    }
    return {
      nodePositions,
      layers,
      crossings: 0
    };
  }

  // src/GraphBuilder.ts
  var GRID_CHUNK_CELLS = 16;
  var GRID_DOT_SIZE = 8;
  var GRID_CHUNK_PADDING = GRID_DOT_SIZE;
  var GraphBuilder = class _GraphBuilder {
    constructor(canvas, options = {}) {
      this.frameHandle = 0;
      this.running = false;
      this.gridViewPort = null;
      this.gridRenderRevision = 0;
      this.gridRenderConfig = null;
      this.graph = {
        nodes: [],
        edges: []
      };
      this.nodeState = /* @__PURE__ */ new Map();
      this.edgeState = /* @__PURE__ */ new Map();
      this.portState = /* @__PURE__ */ new Map();
      this.edgeDashEffects = /* @__PURE__ */ new Map();
      this.edgeDotEffects = /* @__PURE__ */ new Map();
      this.portPulseEffects = /* @__PURE__ */ new Map();
      this.effectsPaused = false;
      this.eventBus = new EventBus();
      this.tool = "select" /* Select */;
      this.previousTool = null;
      this.createNodeTemplate = null;
      this.hoveredNodeId = null;
      this.hoveredEdgeId = null;
      this.hoveredPort = null;
      this.selectedNodeId = null;
      this.draggingNodeId = null;
      this.resizingNodeId = null;
      this.creatingEdge = null;
      this.panOffset = null;
      this.effects = {
        edgeDash: {
          get: (target, channel = "default") => this.getEdgeDashEffectConfig(target, channel),
          set: (target, patch, channel = "default") => this.setEdgeDashEffectConfig(target, patch, channel),
          start: (target, patch, channel = "default") => this.startEdgeDashEffect(target, patch, channel),
          stop: (target, channel = "default") => this.stopEdgeDashEffect(target, channel),
          clear: (target, channel = "default") => this.clearEdgeDashEffects(target, channel)
        },
        edgeDot: {
          get: (target, channel = "default") => this.getEdgeDotEffectConfig(target, channel),
          set: (target, patch, channel = "default") => this.setEdgeDotEffectConfig(target, patch, channel),
          trigger: (target, patch, channel = "default") => this.triggerEdgeDotEffect(target, patch, channel),
          start: (target, patch, channel = "default") => this.startEdgeDotEffect(target, patch, channel),
          stop: (target, channel = "default") => this.stopEdgeDotEffect(target, channel),
          clear: (target, channel = "default") => this.clearEdgeDotEffects(target, channel)
        },
        portPulse: {
          trigger: (target, patch, channel = "default") => this.triggerPortPulseEffect(target, patch, channel),
          clear: (target, channel = "default") => this.clearPortPulseEffects(target, channel)
        },
        global: {
          setEnabled: (enabled) => {
            this.options.effects.enabled = enabled;
          },
          setTimeScale: (timeScale) => {
            this.options.effects.timeScale = Math.max(0, timeScale);
          },
          pause: () => {
            this.effectsPaused = true;
          },
          resume: () => {
            this.effectsPaused = false;
          },
          clearAll: () => {
            this.clearAllEffects();
          }
        }
      };
      if (canvas === null) {
        throw new Error("Canvas element not found");
      }
      if (canvas.tagName.toLowerCase() !== "canvas") {
        throw new Error("Element is not a canvas");
      }
      this.canvas = canvas;
      const context = this.canvas.getContext("2d");
      if (context === null) {
        throw new Error("Could not get 2D context from canvas");
      }
      this.context = context;
      this.options = {
        gridSize: Math.max(1, options.gridSize ?? GRID_SIZE),
        snapToGrid: options.snapToGrid ?? false,
        showGrid: options.showGrid ?? true,
        showPortArrows: options.showPortArrows ?? false,
        showEdgeArrows: options.showEdgeArrows ?? false,
        autoStart: options.autoStart ?? true,
        allowSelfConnection: options.allowSelfConnection ?? false,
        canConnectPorts: options.canConnectPorts,
        resolveEdgeTheme: options.resolveEdgeTheme,
        camera: options.camera ?? {},
        theme: { ...DEFAULT_THEME, ...options.theme },
        effects: {
          ...DEFAULT_EFFECTS,
          ...options.effects,
          edgeDash: {
            ...DEFAULT_EFFECTS.edgeDash,
            ...options.effects?.edgeDash
          },
          edgeDot: {
            ...DEFAULT_EFFECTS.edgeDot,
            ...options.effects?.edgeDot,
            animation: {
              ...DEFAULT_EFFECTS.edgeDot.animation,
              ...options.effects?.edgeDot?.animation
            }
          },
          portPulse: {
            ...DEFAULT_EFFECTS.portPulse,
            ...options.effects?.portPulse,
            animation: {
              ...DEFAULT_EFFECTS.portPulse.animation,
              ...options.effects?.portPulse?.animation
            }
          }
        },
        callbacks: options.callbacks ?? {},
        capabilities: { ...DEFAULT_CAPABILITIES, ...options.capabilities }
      };
      this.canvas.style.backgroundColor = this.options.theme.backgroundColor;
      this.camera = new import_camera.default((0, import_vec9.vec2)(), {
        moveEaseAmount: 0.9,
        scaleEaseAmount: 0.9,
        minScale: 0.5,
        maxScale: 5,
        ...this.options.camera
      });
      this.frameTimer = new import_frame_timer.default({ minFPS: FPS_MIN });
      import_debug.default.initialise();
      if (!_GraphBuilder.inputInitialised) {
        import_input_manager.default.initialise({
          element: this.canvas,
          preventContextMenu: true
        });
        _GraphBuilder.inputInitialised = true;
      }
      window.addEventListener("resize", this.resize.bind(this), false);
      this.resize();
      if (this.options.autoStart) {
        this.start();
      }
    }
    static {
      this.screen = (0, import_vec9.vec2)();
    }
    static {
      this.inputInitialised = false;
    }
    on(event, handler) {
      return this.eventBus.on(event, handler);
    }
    off(event, handler) {
      this.eventBus.off(event, handler);
    }
    once(event, handler) {
      return this.eventBus.once(event, handler);
    }
    start() {
      if (this.running) {
        return;
      }
      this.running = true;
      this.loop();
    }
    stop() {
      this.running = false;
      if (this.frameHandle !== 0) {
        window.cancelAnimationFrame(this.frameHandle);
        this.frameHandle = 0;
      }
    }
    dispose() {
      this.stop();
      this.clearAllEffects();
      this.resetGridViewPort();
      this.graph.nodes = [];
      this.graph.edges = [];
      this.nodeState.clear();
      this.edgeState.clear();
      this.portState.clear();
      this.eventBus.emit("graphCleared", {});
    }
    resize() {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }
    getTool() {
      return this.tool;
    }
    setCapabilities(capabilities) {
      this.options.capabilities = {
        ...this.options.capabilities,
        ...capabilities
      };
    }
    setTool(tool, remember = false) {
      const previousTool = this.tool;
      if (remember) {
        this.previousTool = this.tool;
      }
      this.tool = tool;
      if (previousTool !== tool) {
        this.eventBus.emit("toolChanged", { from: previousTool, to: tool });
      }
    }
    resetTool() {
      if (this.previousTool !== null) {
        this.setTool(this.previousTool);
        this.previousTool = null;
      }
    }
    setCreateNodeTemplate(template) {
      this.createNodeTemplate = template;
    }
    setSnapToGrid(enabled) {
      this.options.snapToGrid = enabled;
    }
    setGridSize(size) {
      const next = Math.max(1, size);
      if (this.options.gridSize === next) {
        return;
      }
      this.options.gridSize = next;
      this.resetGridViewPort();
    }
    getCameraPosition() {
      return (0, import_vec9.vec2)(this.camera.position);
    }
    setCameraPosition(position) {
      this.camera.positionImmediate = (0, import_vec9.vec2)(position);
    }
    panCamera(offset) {
      this.camera.positionImmediate = import_vec9.vec2.add(this.camera.position, offset);
    }
    getCameraZoom() {
      return this.camera.scale;
    }
    setCameraZoom(zoom) {
      if (!Number.isFinite(zoom)) {
        throw new Error("Camera zoom must be a finite number");
      }
      this.camera.scale = zoom;
    }
    zoomCamera(delta) {
      if (!Number.isFinite(delta)) {
        throw new Error("Camera zoom delta must be a finite number");
      }
      this.camera.scale += delta;
    }
    getGraph() {
      return this.serialize();
    }
    serialize() {
      return {
        nodes: this.graph.nodes.map((node) => ({
          ...node,
          position: (0, import_vec9.vec2)(node.position),
          size: (0, import_vec9.vec2)(node.size),
          ports: node.ports.map((port) => ({ ...port }))
        })),
        edges: this.graph.edges.map((edge) => ({
          ...edge,
          a: { ...edge.a },
          b: { ...edge.b }
        }))
      };
    }
    serializeFull() {
      return {
        version: GRAPH_SERIALIZATION_VERSION,
        type: "graph-document",
        graph: this.serialize(),
        layout: {
          cameraPosition: (0, import_vec9.vec2)(this.camera.position),
          cameraScale: this.camera.scale,
          selectedNodeId: this.selectedNodeId
        }
      };
    }
    serializeRaw() {
      return {
        version: GRAPH_SERIALIZATION_VERSION,
        type: "graph-domain",
        nodes: this.graph.nodes.map((node) => ({
          id: node.id,
          data: node.data
        })),
        edges: this.graph.edges.map((edge) => ({
          a: { ...edge.a },
          b: { ...edge.b },
          data: edge.data
        }))
      };
    }
    load(graph) {
      this.clearAllEffects();
      this.graph = this.cloneGraph(graph);
      this.nodeState.clear();
      this.edgeState.clear();
      this.portState.clear();
      for (const node of this.graph.nodes) {
        this.ensureNodeState(node);
        for (const port of node.ports) {
          this.ensurePortState(node.id, port.id, port.side);
        }
      }
      for (const edge of this.graph.edges) {
        this.ensureEdgeState(edge);
      }
      this.hoveredNodeId = null;
      this.hoveredEdgeId = null;
      this.hoveredPort = null;
      this.draggingNodeId = null;
      this.resizingNodeId = null;
      this.creatingEdge = null;
      this.eventBus.emit("graphLoaded", {
        graph: this.serialize()
      });
    }
    loadFromDocument(document2) {
      if (document2.type !== "graph-document") {
        throw new Error("Invalid graph document type");
      }
      this.load(document2.graph);
      if (document2.layout) {
        this.camera.positionImmediate = (0, import_vec9.vec2)(document2.layout.cameraPosition);
        this.camera.scale = document2.layout.cameraScale;
        this.selectNode(document2.layout.selectedNodeId);
      }
    }
    loadFromDomain(domain, options = {}) {
      if (domain.type !== "graph-domain") {
        throw new Error("Invalid graph domain type");
      }
      const nodes = domain.nodes.map((domainNode) => {
        const resolved = options.resolveNode?.(domainNode);
        return {
          id: domainNode.id,
          data: domainNode.data,
          label: resolved?.label,
          position: (0, import_vec9.vec2)(),
          size: (0, import_vec9.vec2)(resolved?.size ?? DEFAULT_NODE_SIZE),
          ports: resolved?.ports?.map((port) => ({ ...port })) ?? [],
          resizable: resolved?.resizable ?? true,
          deletable: resolved?.deletable ?? true
        };
      });
      const edges = domain.edges.map((edge) => ({
        a: { ...edge.a },
        b: { ...edge.b },
        data: edge.data
      }));
      this.load({ nodes, edges });
    }
    createNode(position, template) {
      if (!this.options.capabilities.createNodes) {
        throw new Error("Node creation is disabled by capabilities");
      }
      const source = template ?? this.createNodeTemplate;
      if (!source) {
        throw new Error("No node template has been configured");
      }
      const nodeCreatingPayload = {
        position: (0, import_vec9.vec2)(position),
        template: {
          ...source,
          size: (0, import_vec9.vec2)(source.size),
          ports: source.ports.map((port) => ({ ...port }))
        }
      };
      const nodeCreating = this.eventBus.emitCancellable(
        "nodeCreating",
        nodeCreatingPayload
      );
      if (nodeCreating.cancelled) {
        throw new Error("Node creation was cancelled by an event handler");
      }
      const node = {
        id: this.createId("node"),
        position: (0, import_vec9.vec2)(position),
        size: (0, import_vec9.vec2)(source.size ?? DEFAULT_NODE_SIZE),
        label: source.label,
        ports: source.ports.map((port) => ({ ...port })),
        resizable: source.resizable ?? true,
        deletable: source.deletable ?? true,
        data: source.data,
        theme: source.theme
      };
      this.graph.nodes.push(node);
      this.ensureNodeState(node);
      for (const port of node.ports) {
        this.ensurePortState(node.id, port.id, port.side);
      }
      this.eventBus.emit("nodeCreated", { node: { ...node } });
      return node;
    }
    addNode(node) {
      if (this.graph.nodes.some((n) => n.id === node.id)) {
        return false;
      }
      const clonedNode = {
        ...node,
        position: (0, import_vec9.vec2)(node.position),
        size: (0, import_vec9.vec2)(node.size),
        ports: node.ports.map((port) => ({ ...port }))
      };
      this.graph.nodes.push(clonedNode);
      this.ensureNodeState(clonedNode);
      for (const port of clonedNode.ports) {
        this.ensurePortState(clonedNode.id, port.id, port.side);
      }
      this.eventBus.emit("nodeCreated", { node: { ...clonedNode } });
      return true;
    }
    removeNode(nodeId) {
      if (!this.options.capabilities.deleteNodes) {
        return false;
      }
      const node = this.graph.nodes.find((n) => n.id === nodeId);
      if (!node) {
        return false;
      }
      const nodeRemovingPayload = {
        nodeId,
        node: {
          ...node,
          position: (0, import_vec9.vec2)(node.position),
          size: (0, import_vec9.vec2)(node.size),
          ports: node.ports.map((port) => ({ ...port }))
        }
      };
      const nodeRemoving = this.eventBus.emitCancellable(
        "nodeRemoving",
        nodeRemovingPayload
      );
      if (nodeRemoving.cancelled) {
        return false;
      }
      this.clearEdgeEffectsForNode(nodeId);
      this.graph.edges = this.graph.edges.filter(
        (edge) => edge.a.nodeId !== nodeId && edge.b.nodeId !== nodeId
      );
      this.graph.nodes = this.graph.nodes.filter((n) => n.id !== nodeId);
      this.nodeState.delete(nodeId);
      for (const port of node.ports) {
        this.portState.delete(this.portKey(nodeId, port.id));
        this.clearPortPulseEffects({ nodeId, portId: port.id });
      }
      if (this.selectedNodeId === nodeId) {
        this.selectedNodeId = null;
      }
      if (this.hoveredNodeId === nodeId) {
        this.hoveredNodeId = null;
      }
      if (this.draggingNodeId === nodeId) {
        this.draggingNodeId = null;
      }
      if (this.resizingNodeId === nodeId) {
        this.resizingNodeId = null;
      }
      this.eventBus.emit("nodeRemoved", {
        nodeId,
        node: {
          ...node,
          position: (0, import_vec9.vec2)(node.position),
          size: (0, import_vec9.vec2)(node.size),
          ports: node.ports.map((port) => ({ ...port }))
        }
      });
      return true;
    }
    setNodeData(nodeId, data) {
      const node = this.graph.nodes.find((n) => n.id === nodeId);
      if (!node) {
        return false;
      }
      const from = node.data;
      node.data = data;
      this.eventBus.emit("nodeDataUpdated", {
        nodeId,
        from,
        to: node.data,
        node: {
          ...node,
          position: (0, import_vec9.vec2)(node.position),
          size: (0, import_vec9.vec2)(node.size),
          ports: node.ports.map((port) => ({ ...port }))
        }
      });
      return true;
    }
    updateNodeData(nodeId, updater) {
      const node = this.graph.nodes.find((n) => n.id === nodeId);
      if (!node) {
        return false;
      }
      const next = updater(node.data, {
        ...node,
        position: (0, import_vec9.vec2)(node.position),
        size: (0, import_vec9.vec2)(node.size),
        ports: node.ports.map((port) => ({ ...port }))
      });
      return this.setNodeData(nodeId, next);
    }
    setPortData(target, data) {
      const resolved = this.resolveNodeAndPort(target);
      if (!resolved) {
        return false;
      }
      const { node, port } = resolved;
      const from = port.data;
      port.data = data;
      this.eventBus.emit("portDataUpdated", {
        nodeId: node.id,
        portId: port.id,
        from,
        to: port.data,
        node: {
          ...node,
          position: (0, import_vec9.vec2)(node.position),
          size: (0, import_vec9.vec2)(node.size),
          ports: node.ports.map((existingPort) => ({ ...existingPort }))
        },
        port: { ...port }
      });
      return true;
    }
    updatePortData(target, updater) {
      const resolved = this.resolveNodeAndPort(target);
      if (!resolved) {
        return false;
      }
      const { node, port } = resolved;
      const next = updater(
        port.data,
        { ...port },
        {
          ...node,
          position: (0, import_vec9.vec2)(node.position),
          size: (0, import_vec9.vec2)(node.size),
          ports: node.ports.map((existingPort) => ({ ...existingPort }))
        }
      );
      return this.setPortData(target, next);
    }
    createEdge(a, b, data, options) {
      if (!this.options.capabilities.createEdges) {
        return false;
      }
      const aEndpoint = this.resolvePortEndpoint(a);
      const bEndpoint = this.resolvePortEndpoint(b);
      if (!aEndpoint || !bEndpoint) {
        return false;
      }
      const validation = this.validateConnection(aEndpoint, bEndpoint);
      if (!validation.allowed) {
        return false;
      }
      const normalized = this.normalizeEdgeEndpoints(a, b, data);
      if (!normalized) {
        return false;
      }
      const fromNodeAndPort = this.resolveNodeAndPort(normalized.a);
      const toNodeAndPort = this.resolveNodeAndPort(normalized.b);
      const resolvedTheme = {
        ...fromNodeAndPort?.port.edgeTheme ?? {},
        ...fromNodeAndPort && toNodeAndPort ? this.options.resolveEdgeTheme?.({
          fromNode: fromNodeAndPort.node,
          fromPort: fromNodeAndPort.port,
          toNode: toNodeAndPort.node,
          toPort: toNodeAndPort.port,
          data
        }) : void 0,
        ...options?.theme ?? {}
      };
      if (Object.keys(resolvedTheme).length > 0) {
        normalized.theme = resolvedTheme;
      }
      const edgeCreatingPayload = {
        edge: {
          ...normalized,
          a: { ...normalized.a },
          b: { ...normalized.b }
        }
      };
      const edgeCreating = this.eventBus.emitCancellable(
        "edgeCreating",
        edgeCreatingPayload
      );
      if (edgeCreating.cancelled) {
        return false;
      }
      if (this.edgeExists(normalized.a, normalized.b)) {
        return false;
      }
      this.graph.edges.push(normalized);
      this.ensureEdgeState(normalized);
      this.eventBus.emit("edgeCreated", {
        edge: {
          ...normalized,
          a: { ...normalized.a },
          b: { ...normalized.b }
        }
      });
      return true;
    }
    removeEdge(a, b) {
      if (!this.options.capabilities.deleteEdges) {
        return false;
      }
      const existing = this.findEdge(a, b);
      if (!existing) {
        return false;
      }
      const edgeRemovingPayload = {
        edge: {
          ...existing,
          a: { ...existing.a },
          b: { ...existing.b }
        }
      };
      const edgeRemoving = this.eventBus.emitCancellable(
        "edgeRemoving",
        edgeRemovingPayload
      );
      if (edgeRemoving.cancelled) {
        return false;
      }
      this.graph.edges = this.graph.edges.filter(
        (edge) => !(this.portRefEq(edge.a, existing.a) && this.portRefEq(edge.b, existing.b))
      );
      this.clearEdgeDashEffects({ a: existing.a, b: existing.b });
      this.clearEdgeDotEffects({ a: existing.a, b: existing.b });
      this.edgeState.delete(this.edgeKey(existing));
      this.eventBus.emit("edgeRemoved", {
        edge: {
          ...existing,
          a: { ...existing.a },
          b: { ...existing.b }
        }
      });
      return true;
    }
    setEdgeData(a, b, data) {
      const edge = this.findEdge(a, b);
      if (!edge) {
        return false;
      }
      const from = edge.data;
      edge.data = data;
      this.eventBus.emit("edgeDataUpdated", {
        from,
        to: edge.data,
        edge: {
          ...edge,
          a: { ...edge.a },
          b: { ...edge.b }
        }
      });
      return true;
    }
    updateEdgeData(a, b, updater) {
      const edge = this.findEdge(a, b);
      if (!edge) {
        return false;
      }
      const next = updater(edge.data, {
        ...edge,
        a: { ...edge.a },
        b: { ...edge.b }
      });
      return this.setEdgeData(a, b, next);
    }
    getNeighbors(nodeId, direction = "both" /* Both */) {
      return getNeighbors(this.graph, nodeId, direction);
    }
    traverseBFS(startNodeId, visitor, direction = "both" /* Both */) {
      return traverseBFS(this.graph, startNodeId, visitor, direction);
    }
    traverseDFS(startNodeId, visitor, direction = "both" /* Both */) {
      return traverseDFS(this.graph, startNodeId, visitor, direction);
    }
    traverseTopological(visitor) {
      return traverseTopological(this.graph, visitor);
    }
    topologicalSort() {
      return topologicalSort(this.graph);
    }
    hasCycle() {
      return hasCycle(this.graph);
    }
    snapAllToGrid(options = {}) {
      const snapPositions = options.snapPositions ?? true;
      const snapSizes = options.snapSizes ?? true;
      for (const node of this.graph.nodes) {
        if (snapPositions) {
          const from = (0, import_vec9.vec2)(node.position);
          node.position = roundVec(node.position, this.options.gridSize);
          this.eventBus.emit("nodeMoved", {
            nodeId: node.id,
            from,
            to: (0, import_vec9.vec2)(node.position)
          });
        }
        if (snapSizes) {
          const from = (0, import_vec9.vec2)(node.size);
          node.size = roundVec(node.size, this.options.gridSize);
          this.eventBus.emit("nodeResized", {
            nodeId: node.id,
            from,
            to: (0, import_vec9.vec2)(node.size)
          });
        }
      }
    }
    async arrangeForceDirected(options) {
      const result = await layoutForceDirected(this.graph, options);
      for (const [nodeId, position] of result.nodePositions.entries()) {
        const node = this.graph.nodes.find((n) => n.id === nodeId);
        if (!node) {
          continue;
        }
        node.position = (0, import_vec9.vec2)(position);
        this.ensureNodeState(node).actualPosition = (0, import_vec9.vec2)(position);
      }
      this.eventBus.emit("graphArranged", {
        strategy: "forceDirected"
      });
      return result;
    }
    async arrangeLayered(options) {
      const result = await layoutLayered(this.graph, options);
      if (!result) {
        this.eventBus.emit("graphArrangementFailed", {
          strategy: "layered",
          reason: "Graph contains cycles"
        });
        return null;
      }
      for (const [nodeId, position] of result.nodePositions.entries()) {
        const node = this.graph.nodes.find((n) => n.id === nodeId);
        if (!node) {
          continue;
        }
        node.position = (0, import_vec9.vec2)(position);
        this.ensureNodeState(node).actualPosition = (0, import_vec9.vec2)(position);
      }
      this.eventBus.emit("graphArranged", {
        strategy: "layered"
      });
      return result;
    }
    async arrangeGraph(strategy, options) {
      if (strategy === "layered") {
        return this.arrangeLayered(
          options
        );
      }
      return this.arrangeForceDirected(
        options
      );
    }
    draw() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.save();
      this.camera.setTransforms(this.context);
      if (this.options.showGrid) {
        this.drawGrid();
      }
      for (const node of this.graph.nodes) {
        this.drawNode(node);
      }
      for (const edge of this.graph.edges) {
        this.drawEdge(edge);
      }
      this.drawEffects();
      if (this.creatingEdge) {
        this.drawEdgePreviewPort();
        this.drawEdgePreview();
      }
      import_debug.default.draw(this.context);
      this.context.restore();
    }
    update(dt) {
      _GraphBuilder.screen = (0, import_vec9.vec2)(this.canvas.width, this.canvas.height);
      if (import_input_manager.default.keyDown("Space") && this.tool !== "pan" /* Pan */) {
        this.setTool("pan" /* Pan */, true);
      }
      if (import_input_manager.default.keyReleased("Space") && this.tool === "pan" /* Pan */) {
        this.resetTool();
      }
      this.updateCamera(dt);
      this.camera.update(_GraphBuilder.screen);
      const mouse = this.camera.screenToWorld(import_input_manager.default.mousePosition);
      this.updatePortStates(mouse);
      this.updateNodeStates(mouse);
      this.updateEdgeStates(mouse);
      this.handleInteractions(mouse);
      this.easeNodes();
      this.updateEffects(dt);
      import_input_manager.default.update();
    }
    loop() {
      this.frameTimer.update();
      this.update(this.frameTimer.elapsedTime);
      this.draw();
      if (DEBUG) {
        import_debug.default.value("FPS", this.frameTimer.frameRate, {
          align: "right"
        });
      }
      if (this.running) {
        this.frameHandle = window.requestAnimationFrame(this.loop.bind(this));
      }
    }
    updateCamera(dt) {
      if (this.tool === "pan" /* Pan */ && import_input_manager.default.mouseDown()) {
        const cameraPosition = this.camera.screenToWorld(
          import_input_manager.default.mousePosition
        );
        if (!this.panOffset) {
          this.panOffset = cameraPosition;
        }
        this.camera.positionImmediate = import_vec9.vec2.add(
          this.camera.position,
          import_vec9.vec2.sub(this.panOffset, cameraPosition)
        );
      }
      if (!import_input_manager.default.mouseDown()) {
        this.panOffset = null;
      }
      const pan = (0, import_vec9.vec2)(CAMERA_KEYBOARD_PAN_SPEED * dt, 0);
      if (import_input_manager.default.keyDown("KeyW") || import_input_manager.default.keyDown("ArrowUp")) {
        this.camera.positionImmediate = import_vec9.vec2.add(
          this.camera.position,
          import_vec9.vec2.rotf(pan, 1)
        );
      }
      if (import_input_manager.default.keyDown("KeyS") || import_input_manager.default.keyDown("ArrowDown")) {
        this.camera.positionImmediate = import_vec9.vec2.add(
          this.camera.position,
          import_vec9.vec2.rotf(pan, -1)
        );
      }
      if (import_input_manager.default.keyDown("KeyA") || import_input_manager.default.keyDown("ArrowLeft")) {
        this.camera.positionImmediate = import_vec9.vec2.add(
          this.camera.position,
          import_vec9.vec2.rotf(pan, 2)
        );
      }
      if (import_input_manager.default.keyDown("KeyD") || import_input_manager.default.keyDown("ArrowRight")) {
        this.camera.positionImmediate = import_vec9.vec2.add(
          this.camera.position,
          import_vec9.vec2.rotf(pan, 0)
        );
      }
      if (import_input_manager.default.mouseWheelUp()) {
        this.camera.scale -= CAMERA_ZOOM_STEP;
      }
      if (import_input_manager.default.mouseWheelDown()) {
        this.camera.scale += CAMERA_ZOOM_STEP;
      }
    }
    updatePortStates(mouse) {
      this.hoveredPort = null;
      for (const node of this.graph.nodes) {
        for (const port of node.ports) {
          const state = this.ensurePortState(node.id, port.id, port.side);
          state.position = this.resolvePortPosition(node, port);
          state.direction = this.directionFromSide(port.side);
          state.hovered = false;
          state.connectable = true;
          state.invalidReason = null;
        }
      }
      if (this.creatingEdge) {
        this.ensurePortState(
          this.creatingEdge.a.nodeId,
          this.creatingEdge.a.portId,
          this.creatingEdge.a.side
        ).hovered = true;
      }
      const isConnectMode = this.tool === "create-edge" /* CreateEdge */;
      const reversedNodes = [...this.graph.nodes].reverse();
      for (const node of reversedNodes) {
        for (const port of node.ports) {
          const state = this.ensurePortState(node.id, port.id, port.side);
          const effectiveRadius = this.effectivePortTheme(port).portRadius;
          const radius = effectiveRadius + (isConnectMode ? PORT_CONNECT_MARGIN : PORT_HOVER_MARGIN);
          const hovered = pointInCircle(mouse, {
            position: state.position,
            radius
          });
          if (!hovered) {
            continue;
          }
          if (this.tool === "create-edge" /* CreateEdge */ && this.creatingEdge) {
            const start = this.creatingEdge.a;
            const end = {
              nodeId: node.id,
              portId: port.id,
              type: port.type,
              side: port.side,
              position: state.position,
              direction: state.direction
            };
            const validation = this.validateConnection(start, end);
            if (!validation.allowed) {
              state.hovered = true;
              state.connectable = false;
              state.invalidReason = validation.reason ?? "Connection is not allowed";
              continue;
            }
          }
          this.hoveredPort = { nodeId: node.id, portId: port.id };
          state.hovered = true;
          return;
        }
      }
    }
    updateNodeStates(mouse) {
      this.hoveredNodeId = null;
      for (const node of this.graph.nodes) {
        const state = this.ensureNodeState(node);
        state.hovered = false;
        state.resizeHovered = false;
        state.deleteHovered = false;
      }
      const reversedNodes = [...this.graph.nodes].reverse();
      for (const node of reversedNodes) {
        const state = this.ensureNodeState(node);
        if (this.hoveredPort?.nodeId === node.id) {
          continue;
        }
        const hovered = ["select" /* Select */, "resize-node" /* ResizeNode */].includes(this.tool) && pointInRectangle(mouse, {
          position: node.position,
          size: node.size
        });
        if (!hovered) {
          continue;
        }
        state.hovered = true;
        this.hoveredNodeId = node.id;
        break;
      }
      for (const node of this.graph.nodes) {
        const state = this.ensureNodeState(node);
        if (!state.hovered) {
          continue;
        }
        const deleteHovered = this.options.capabilities.deleteNodes && (node.deletable ?? true) && this.tool === "select" /* Select */ && pointInRectangle(mouse, {
          position: import_vec9.vec2.add(
            node.position,
            (0, import_vec9.vec2)(node.size.x - DELETE_BUTTON_SIZE, 0)
          ),
          size: (0, import_vec9.vec2)(DELETE_BUTTON_SIZE)
        });
        state.deleteHovered = deleteHovered;
        const resizeHovered = this.options.capabilities.resizeNodes && (node.resizable ?? true) && ["select" /* Select */, "resize-node" /* ResizeNode */].includes(this.tool) && pointInRectangle(mouse, {
          position: import_vec9.vec2.add(
            node.position,
            import_vec9.vec2.sub(node.size, RESIZE_HANDLE_SIZE)
          ),
          size: (0, import_vec9.vec2)(RESIZE_HANDLE_SIZE)
        });
        state.resizeHovered = resizeHovered;
        if (resizeHovered && this.tool !== "resize-node" /* ResizeNode */) {
          this.setTool("resize-node" /* ResizeNode */, true);
        }
      }
      if (this.tool === "resize-node" /* ResizeNode */ && this.graph.nodes.every((node) => {
        const state = this.ensureNodeState(node);
        return !state.resizeHovered && !state.resizing;
      })) {
        this.resetTool();
        if (this.tool === "resize-node" /* ResizeNode */) {
          this.setTool("select" /* Select */);
        }
      }
    }
    updateEdgeStates(mouse) {
      this.hoveredEdgeId = null;
      for (const edge of this.graph.edges) {
        this.ensureEdgeState(edge).hovered = false;
      }
      if (["resize-node" /* ResizeNode */, "create-edge" /* CreateEdge */].includes(this.tool) || !!this.draggingNodeId) {
        return;
      }
      const reversedEdges = [...this.graph.edges].reverse();
      for (const edge of reversedEdges) {
        const hit = this.edgeHitTest(edge, mouse);
        if (!hit) {
          continue;
        }
        for (const endpoint of [edge.a, edge.b]) {
          const resolved = this.resolvePortEndpoint(endpoint);
          if (!resolved) {
            continue;
          }
          this.ensurePortState(
            resolved.nodeId,
            resolved.portId,
            resolved.side
          ).hovered = true;
        }
        const key = this.edgeKey(edge);
        this.edgeState.get(key).hovered = true;
        this.hoveredEdgeId = key;
        break;
      }
    }
    edgeHitTest(edge, mouse) {
      const aEndpoint = this.resolvePortEndpoint(edge.a);
      const bEndpoint = this.resolvePortEndpoint(edge.b);
      if (!aEndpoint || !bEndpoint) {
        return false;
      }
      const a = import_vec9.vec2.add(
        aEndpoint.position,
        import_vec9.vec2.mul(aEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      const b = import_vec9.vec2.add(
        bEndpoint.position,
        import_vec9.vec2.mul(bEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      const { cp1, cp2, join } = getCurveGeometry(
        a,
        b,
        aEndpoint.direction,
        bEndpoint.direction,
        this.options.gridSize
      );
      const samples = Math.ceil(import_vec9.vec2.len(import_vec9.vec2.sub(a, b)) / EDGE_CURVE_SAMPLE_DISTANCE) + 1;
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const d1 = pointToQuadraticBezierDistance(mouse, a, cp1, join, t);
        const d2 = pointToQuadraticBezierDistance(mouse, join, cp2, b, t);
        if (d1 < EDGE_HOVER_THRESHOLD || d2 < EDGE_HOVER_THRESHOLD) {
          return true;
        }
      }
      return false;
    }
    handleInteractions(mouse) {
      const hoveredNode = this.hoveredNodeId ? this.graph.nodes.find((node) => node.id === this.hoveredNodeId) ?? null : null;
      const hoveredNodeState = hoveredNode ? this.ensureNodeState(hoveredNode) : null;
      const hoveredPort = this.hoveredPort ? this.resolvePortEndpoint(this.hoveredPort) : null;
      if (this.tool === "select" /* Select */ && import_input_manager.default.mousePressed() && !hoveredNode && !hoveredPort) {
        this.selectNode(null);
      }
      if (hoveredNode && hoveredNodeState && hoveredNodeState.selected && import_input_manager.default.mousePressed() && import_input_manager.default.keyDown("ControlLeft")) {
        this.removeNode(hoveredNode.id);
        return;
      }
      if (hoveredNode && hoveredNodeState?.deleteHovered && import_input_manager.default.mouseDown()) {
        this.removeNode(hoveredNode.id);
        return;
      }
      if (this.options.capabilities.createNodes && this.tool === "create-node" /* CreateNode */ && this.createNodeTemplate && !hoveredNode && !hoveredPort && import_input_manager.default.mousePressed()) {
        this.createNode(mouse);
      }
      if (this.options.capabilities.createEdges && hoveredPort && import_input_manager.default.mousePressed()) {
        const incoming = this.findIncomingEdgeForPort({
          nodeId: hoveredPort.nodeId,
          portId: hoveredPort.portId
        });
        if (hoveredPort.type === "input" /* Input */ && incoming) {
          this.removeEdge(incoming.a, incoming.b);
          const source = this.resolvePortEndpoint(incoming.a);
          if (source) {
            this.startCreatingEdge(source);
          }
        } else {
          this.startCreatingEdge(hoveredPort);
        }
      }
      if (this.options.capabilities.moveNodes && this.tool === "select" /* Select */ && hoveredNode && hoveredNodeState && !hoveredPort && !this.draggingNodeId && import_input_manager.default.mouseDown()) {
        this.selectNode(hoveredNode.id);
        this.draggingNodeId = hoveredNode.id;
        hoveredNodeState.dragging = true;
        hoveredNodeState.dragOffset = import_vec9.vec2.sub(mouse, hoveredNode.position);
      }
      if (this.options.capabilities.resizeNodes && this.tool === "resize-node" /* ResizeNode */ && hoveredNode && hoveredNodeState && hoveredNodeState.resizeHovered && !this.resizingNodeId && import_input_manager.default.mouseDown()) {
        this.resizingNodeId = hoveredNode.id;
        hoveredNodeState.resizing = true;
        hoveredNodeState.resizeOffset = import_vec9.vec2.sub(
          mouse,
          import_vec9.vec2.add(hoveredNode.position, hoveredNode.size)
        );
      }
      if (this.draggingNodeId) {
        const node = this.graph.nodes.find((n) => n.id === this.draggingNodeId);
        const state = node ? this.ensureNodeState(node) : null;
        if (node && state) {
          const from = (0, import_vec9.vec2)(node.position);
          node.position = import_vec9.vec2.sub(mouse, state.dragOffset);
          if (this.options.snapToGrid) {
            node.position = roundVec(node.position, this.options.gridSize);
          }
          if (from.x !== node.position.x || from.y !== node.position.y) {
            this.eventBus.emit("nodeMoved", {
              nodeId: node.id,
              from,
              to: (0, import_vec9.vec2)(node.position)
            });
          }
        }
      }
      if (this.resizingNodeId) {
        const node = this.graph.nodes.find((n) => n.id === this.resizingNodeId);
        const state = node ? this.ensureNodeState(node) : null;
        if (node && state) {
          const from = (0, import_vec9.vec2)(node.size);
          node.size = clampVec(
            import_vec9.vec2.sub(import_vec9.vec2.sub(mouse, node.position), state.resizeOffset),
            (0, import_vec9.vec2)(NODE_MIN_SIZE),
            (0, import_vec9.vec2)(NODE_MAX_SIZE)
          );
          if (this.options.snapToGrid) {
            node.size = roundVec(node.size, this.options.gridSize);
          }
          if (from.x !== node.size.x || from.y !== node.size.y) {
            this.eventBus.emit("nodeResized", {
              nodeId: node.id,
              from,
              to: (0, import_vec9.vec2)(node.size)
            });
          }
        }
      }
      if (this.creatingEdge) {
        const hovered = this.hoveredPort ? this.resolvePortEndpoint(this.hoveredPort) : null;
        this.creatingEdge.update(
          hovered ? (0, import_vec9.vec2)(hovered.position) : (0, import_vec9.vec2)(mouse),
          hovered ? hovered.direction : null
        );
      }
      if (!import_input_manager.default.mouseDown()) {
        if (this.draggingNodeId) {
          const node = this.graph.nodes.find((n) => n.id === this.draggingNodeId);
          if (node) {
            this.ensureNodeState(node).dragging = false;
          }
        }
        this.draggingNodeId = null;
        if (this.resizingNodeId) {
          const node = this.graph.nodes.find((n) => n.id === this.resizingNodeId);
          if (node) {
            this.ensureNodeState(node).resizing = false;
          }
        }
        this.resizingNodeId = null;
        this.stopCreatingEdge();
      }
    }
    startCreatingEdge(endpoint) {
      this.setTool("create-edge" /* CreateEdge */, true);
      const sourceNode = this.graph.nodes.find((n) => n.id === endpoint.nodeId);
      const sourcePort = sourceNode?.ports.find((p) => p.id === endpoint.portId);
      this.creatingEdge = new EdgeTool(endpoint, sourcePort?.edgeTheme);
    }
    stopCreatingEdge() {
      if (!this.creatingEdge) {
        return;
      }
      const start = this.creatingEdge.a;
      const hovered = this.hoveredPort ? this.resolvePortEndpoint(this.hoveredPort) : null;
      if (hovered) {
        const validation = this.validateConnection(start, hovered);
        if (validation.allowed) {
          this.createEdge(
            { nodeId: start.nodeId, portId: start.portId },
            { nodeId: hovered.nodeId, portId: hovered.portId },
            void 0,
            this.creatingEdge.theme ? { theme: this.creatingEdge.theme } : void 0
          );
        } else {
          this.eventBus.emit("edgeConnectionRejected", {
            from: { nodeId: start.nodeId, portId: start.portId },
            to: { nodeId: hovered.nodeId, portId: hovered.portId },
            reason: validation.reason ?? "Connection is not allowed"
          });
        }
      }
      this.creatingEdge = null;
      this.resetTool();
      if (this.tool === "create-edge" /* CreateEdge */) {
        this.setTool("select" /* Select */);
      }
    }
    validateConnection(a, b) {
      if (!this.options.allowSelfConnection && a.nodeId === b.nodeId) {
        return {
          allowed: false,
          reason: "Cannot connect a node to itself"
        };
      }
      if (a.type === b.type) {
        return {
          allowed: false,
          reason: "Cannot connect input-to-input or output-to-output"
        };
      }
      const normalized = this.normalizeEdgeEndpoints(
        { nodeId: a.nodeId, portId: a.portId },
        { nodeId: b.nodeId, portId: b.portId }
      );
      if (!normalized) {
        return {
          allowed: false,
          reason: "Invalid edge endpoints"
        };
      }
      const incoming = this.findIncomingEdgeForPort(normalized.b);
      if (incoming) {
        return {
          allowed: false,
          reason: "Input port already has an incoming edge"
        };
      }
      if (this.edgeExists(normalized.a, normalized.b)) {
        return {
          allowed: false,
          reason: "Edge already exists"
        };
      }
      if (!this.options.canConnectPorts) {
        return { allowed: true };
      }
      const from = this.resolveNodeAndPort(normalized.a);
      const to = this.resolveNodeAndPort(normalized.b);
      if (!from || !to) {
        return {
          allowed: false,
          reason: "Could not resolve edge endpoints"
        };
      }
      return this.options.canConnectPorts({
        fromNode: from.node,
        fromPort: from.port,
        toNode: to.node,
        toPort: to.port,
        edge: normalized
      });
    }
    canConnectEndpoints(a, b) {
      return this.validateConnection(a, b).allowed;
    }
    easeNodes() {
      for (const node of this.graph.nodes) {
        const state = this.ensureNodeState(node);
        state.actualPosition = import_vec9.vec2.add(
          state.actualPosition,
          import_vec9.vec2.mul(
            import_vec9.vec2.sub(node.position, state.actualPosition),
            NODE_EASE_AMOUNT
          )
        );
        state.actualSize = import_vec9.vec2.add(
          state.actualSize,
          import_vec9.vec2.mul(import_vec9.vec2.sub(node.size, state.actualSize), NODE_EASE_AMOUNT)
        );
      }
    }
    drawGrid() {
      const { theme, callbacks } = this.options;
      const nextConfig = {
        gridSize: this.options.gridSize,
        gridDotLineWidth: theme.gridDotLineWidth,
        gridDotColor: theme.gridDotColor,
        drawGridDot: callbacks.drawGridDot,
        drawGridDotMode: this.callbackRenderMode("drawGridDot")
      };
      const previousConfig = this.gridRenderConfig;
      if (previousConfig && previousConfig.gridSize !== nextConfig.gridSize) {
        this.resetGridViewPort();
      }
      if (!previousConfig || previousConfig.gridDotLineWidth !== nextConfig.gridDotLineWidth || previousConfig.gridDotColor !== nextConfig.gridDotColor || previousConfig.drawGridDot !== nextConfig.drawGridDot || previousConfig.drawGridDotMode !== nextConfig.drawGridDotMode) {
        this.gridRenderRevision += 1;
      }
      this.gridRenderConfig = nextConfig;
      this.ensureGridViewPort();
      if (!this.gridViewPort) {
        return;
      }
      const screen = (0, import_vec9.vec2)(this.canvas.width, this.canvas.height);
      this.context.save();
      this.context.lineWidth = theme.gridDotLineWidth;
      this.context.strokeStyle = theme.gridDotColor;
      this.gridViewPort.update(0, screen, this.camera);
      this.gridViewPort.draw(this.context, screen, this.camera);
      this.context.restore();
    }
    ensureGridViewPort() {
      if (this.gridViewPort) {
        return;
      }
      const chunkSize = this.gridChunkWorldSize();
      this.gridViewPort = new import_view_port.ViewPort({
        gridSize: (0, import_vec9.vec2)(chunkSize, chunkSize),
        generator: (cell) => this.createGridChunk(cell, chunkSize),
        border: 1,
        bufferAmount: 32,
        maxElementsToGenerate: 64,
        spatialHashMaxElements: 2e3,
        spatialHashMaxElementsToRemove: 200
      });
    }
    resetGridViewPort() {
      this.gridViewPort = null;
      this.gridRenderRevision = 0;
      this.gridRenderConfig = null;
    }
    createGridChunk(cell, chunkSize) {
      const origin = (0, import_vec9.vec2)(cell.x * chunkSize, cell.y * chunkSize);
      const chunk = {
        cell: (0, import_vec9.vec2)(cell),
        origin,
        canvas: null,
        renderRevision: -1,
        draw: (context) => {
          this.drawGridChunk(context, chunk);
        }
      };
      return chunk;
    }
    drawGridChunk(context, chunk) {
      const drawGridDot = this.options.callbacks.drawGridDot;
      if (drawGridDot && this.callbackRenderMode("drawGridDot") === "replace") {
        this.drawGridChunkDynamic(context, chunk, drawGridDot);
        return;
      }
      this.drawGridChunkCached(context, chunk);
      if (drawGridDot && this.callbackRenderMode("drawGridDot") === "overlay") {
        this.drawGridChunkDynamic(context, chunk, drawGridDot);
      }
    }
    drawDefaultGridDot(context, position) {
      plus(context, position, GRID_DOT_SIZE);
    }
    drawGridChunkDynamic(context, chunk, drawGridDot) {
      const mode = this.callbackRenderMode("drawGridDot");
      const gridSize = this.options.gridSize;
      for (let y = 0; y < GRID_CHUNK_CELLS; y++) {
        for (let x = 0; x < GRID_CHUNK_CELLS; x++) {
          const position = (0, import_vec9.vec2)(
            chunk.origin.x + x * gridSize,
            chunk.origin.y + y * gridSize
          );
          if (mode === "overlay") {
            drawGridDot(
              context,
              {
                position,
                gridSize
              },
              () => {
              }
            );
            continue;
          }
          this.invokeDrawCallback(
            context,
            "drawGridDot",
            drawGridDot,
            {
              position,
              gridSize
            },
            () => {
              this.drawDefaultGridDot(context, position);
            }
          );
        }
      }
    }
    drawGridChunkCached(context, chunk) {
      const chunkCanvasSize = this.gridChunkWorldSize() + GRID_CHUNK_PADDING * 2;
      if (!chunk.canvas || chunk.canvas.width !== chunkCanvasSize || chunk.canvas.height !== chunkCanvasSize || chunk.renderRevision !== this.gridRenderRevision) {
        this.renderGridChunkToCanvas(chunk, chunkCanvasSize);
      }
      if (!chunk.canvas) {
        return;
      }
      context.drawImage(
        chunk.canvas,
        chunk.origin.x - GRID_CHUNK_PADDING,
        chunk.origin.y - GRID_CHUNK_PADDING
      );
    }
    renderGridChunkToCanvas(chunk, chunkCanvasSize) {
      const canvas = chunk.canvas ?? document.createElement("canvas");
      canvas.width = chunkCanvasSize;
      canvas.height = chunkCanvasSize;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = this.options.theme.gridDotLineWidth;
      context.strokeStyle = this.options.theme.gridDotColor;
      const gridSize = this.options.gridSize;
      for (let y = 0; y < GRID_CHUNK_CELLS; y++) {
        for (let x = 0; x < GRID_CHUNK_CELLS; x++) {
          plus(
            context,
            (0, import_vec9.vec2)(
              GRID_CHUNK_PADDING + x * gridSize,
              GRID_CHUNK_PADDING + y * gridSize
            ),
            GRID_DOT_SIZE
          );
        }
      }
      chunk.canvas = canvas;
      chunk.renderRevision = this.gridRenderRevision;
    }
    gridChunkWorldSize() {
      return this.options.gridSize * GRID_CHUNK_CELLS;
    }
    drawNode(node) {
      const state = this.ensureNodeState(node);
      const nodeTheme = this.effectiveNodeTheme(node);
      const { callbacks } = this.options;
      this.invokeDrawCallback(
        this.context,
        "drawNodeFrame",
        callbacks.drawNodeFrame,
        {
          node,
          position: (0, import_vec9.vec2)(state.actualPosition),
          size: (0, import_vec9.vec2)(state.actualSize),
          hovered: state.hovered,
          selected: state.selected
        },
        () => {
          this.context.save();
          this.context.strokeStyle = state.hovered ? nodeTheme.nodeHoveredBorderColor : nodeTheme.nodeBorderColor;
          this.context.fillStyle = state.selected ? nodeTheme.nodeSelectedFillColor : nodeTheme.nodeFillColor;
          this.context.lineWidth = nodeTheme.nodeBorderWidth;
          roundedRect(
            this.context,
            state.actualPosition,
            state.actualSize,
            nodeTheme.nodeBorderRadius
          );
          this.context.fill();
          roundedRect(
            this.context,
            import_vec9.vec2.add(state.actualPosition, 1),
            import_vec9.vec2.sub(state.actualSize, 2),
            nodeTheme.nodeBorderRadius
          );
          this.context.stroke();
          this.context.restore();
        }
      );
      if (node.deletable ?? true) {
        this.invokeDrawCallback(
          this.context,
          "drawDeleteButton",
          callbacks.drawDeleteButton,
          {
            node,
            position: (0, import_vec9.vec2)(state.actualPosition),
            size: (0, import_vec9.vec2)(state.actualSize),
            hovered: state.deleteHovered
          },
          () => {
            this.context.save();
            this.context.strokeStyle = state.deleteHovered ? nodeTheme.deleteButtonHoveredColor : nodeTheme.deleteButtonColor;
            this.context.lineWidth = nodeTheme.deleteButtonLineWidth / DELETE_BUTTON_SIZE;
            this.context.translate(
              state.actualPosition.x + state.actualSize.x - DELETE_BUTTON_SIZE / 2 - nodeTheme.nodePadding,
              state.actualPosition.y + DELETE_BUTTON_SIZE / 2 + nodeTheme.nodePadding
            );
            this.context.scale(DELETE_BUTTON_SIZE, DELETE_BUTTON_SIZE);
            cross(this.context, (0, import_vec9.vec2)(), 0.4);
            this.context.restore();
          }
        );
      }
      if (node.resizable ?? true) {
        this.invokeDrawCallback(
          this.context,
          "drawResizeHandle",
          callbacks.drawResizeHandle,
          {
            node,
            position: (0, import_vec9.vec2)(state.actualPosition),
            size: (0, import_vec9.vec2)(state.actualSize),
            hovered: state.resizeHovered
          },
          () => {
            this.context.save();
            this.context.strokeStyle = state.resizeHovered ? nodeTheme.resizeHandleHoveredColor : nodeTheme.resizeHandleColor;
            this.context.lineWidth = nodeTheme.resizeHandleLineWidth / RESIZE_HANDLE_SIZE;
            this.context.translate(
              state.actualPosition.x + state.actualSize.x - RESIZE_HANDLE_SIZE - nodeTheme.nodePadding,
              state.actualPosition.y + state.actualSize.y - RESIZE_HANDLE_SIZE - nodeTheme.nodePadding
            );
            this.context.scale(RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
            line(this.context, (0, import_vec9.vec2)(0, 0.8), (0, import_vec9.vec2)(0.8, 0));
            line(this.context, (0, import_vec9.vec2)(0.3, 0.8), (0, import_vec9.vec2)(0.8, 0.3));
            line(this.context, (0, import_vec9.vec2)(0.6, 0.8), (0, import_vec9.vec2)(0.8, 0.6));
            this.context.restore();
          }
        );
      }
      for (const port of node.ports) {
        const portState = this.ensurePortState(node.id, port.id, port.side);
        portState.position = this.resolvePortPosition(node, port);
        this.drawPort(node, port, portState);
      }
      this.invokeDrawCallback(
        this.context,
        "drawNodeContent",
        callbacks.drawNodeContent,
        {
          node,
          position: (0, import_vec9.vec2)(state.actualPosition),
          size: (0, import_vec9.vec2)(state.actualSize),
          hovered: state.hovered,
          selected: state.selected
        },
        () => {
          if (!nodeTheme.showNodeLabel || !node.label) {
            return;
          }
          this.context.save();
          this.context.fillStyle = nodeTheme.nodeLabelColor;
          this.context.font = nodeTheme.nodeLabelFont;
          this.context.textAlign = "left";
          this.context.textBaseline = "top";
          this.context.fillText(
            node.label,
            state.actualPosition.x + nodeTheme.nodePadding,
            state.actualPosition.y + nodeTheme.nodePadding
          );
          this.context.restore();
        }
      );
    }
    drawPort(node, port, stateOverride) {
      const state = stateOverride ?? (() => {
        if (!node || !port) {
          throw new Error(
            "Node and port are required when no state override is provided"
          );
        }
        return this.ensurePortState(node.id, port.id, port.side);
      })();
      const direction = port && node ? this.ensurePortState(node.id, port.id, port.side).direction : (0, import_vec9.vec2)(0, -1);
      const isPreview = stateOverride !== void 0 && node === null;
      const portTheme = this.effectivePortTheme(port);
      const { callbacks } = this.options;
      this.invokeDrawCallback(
        this.context,
        "drawPort",
        callbacks.drawPort,
        {
          node,
          port,
          position: (0, import_vec9.vec2)(state.position),
          direction,
          hovered: state.hovered,
          connectable: state.connectable,
          invalidReason: state.invalidReason,
          isPreview
        },
        () => {
          this.context.globalCompositeOperation = "source-over";
          this.context.save();
          this.context.globalCompositeOperation = "destination-out";
          this.context.fillStyle = "black";
          this.context.beginPath();
          this.context.arc(
            state.position.x,
            state.position.y,
            portTheme.portCutoutRadius,
            0,
            Math.PI * 2
          );
          this.context.fill();
          this.context.restore();
          const isInvalid = !state.connectable;
          this.context.save();
          this.context.strokeStyle = isInvalid ? portTheme.portInvalidBorderColor : state.hovered ? portTheme.portHoveredBorderColor : portTheme.portBorderColor;
          this.context.fillStyle = isInvalid ? portTheme.portInvalidFillColor : state.hovered ? portTheme.portHoveredFillColor : portTheme.portFillColor;
          this.context.lineWidth = portTheme.portBorderWidth;
          this.context.beginPath();
          this.context.arc(
            state.position.x,
            state.position.y,
            portTheme.portRadius,
            0,
            Math.PI * 2
          );
          this.context.fill();
          this.context.stroke();
          this.context.restore();
          if (state.hovered) {
            this.context.save();
            this.context.strokeStyle = isInvalid ? portTheme.portInvalidRingColor : portTheme.portHoverRingColor;
            this.context.lineWidth = portTheme.portHoverRingLineWidth;
            this.context.beginPath();
            this.context.arc(
              state.position.x,
              state.position.y,
              portTheme.portHoverRingRadius,
              0,
              Math.PI * 2
            );
            this.context.stroke();
            this.context.restore();
          }
          if (this.options.showPortArrows && port !== null && !isPreview) {
            const arrowDir = port.type === "output" /* Output */ ? direction : import_vec9.vec2.mul(direction, -1);
            const base = import_vec9.vec2.add(
              state.position,
              import_vec9.vec2.mul(arrowDir, portTheme.portArrowOffset)
            );
            this.context.save();
            this.context.fillStyle = portTheme.portArrowColor;
            triangle(this.context, base, arrowDir, portTheme.portArrowSize);
            this.context.fill();
            this.context.restore();
          }
          if (port !== null && !isPreview && portTheme.showPortLabel && typeof port.label === "string" && port.label.length > 0) {
            const horizontal = Math.abs(direction.x) > Math.abs(direction.y);
            const distance = portTheme.portRadius + portTheme.portLabelOffset;
            const labelPosition = (0, import_vec9.vec2)(state.position);
            this.context.save();
            this.context.fillStyle = portTheme.portLabelColor;
            this.context.font = portTheme.portLabelFont;
            if (horizontal) {
              if (direction.x < 0) {
                labelPosition.x += distance;
                this.context.textAlign = "left";
              } else {
                labelPosition.x -= distance;
                this.context.textAlign = "right";
              }
              this.context.textBaseline = "middle";
            } else {
              if (direction.y < 0) {
                labelPosition.y += distance;
                this.context.textBaseline = "top";
              } else {
                labelPosition.y -= distance;
                this.context.textBaseline = "bottom";
              }
              this.context.textAlign = "center";
            }
            this.context.fillText(port.label, labelPosition.x, labelPosition.y);
            this.context.restore();
          }
        }
      );
    }
    drawEdgePreviewPort() {
      if (!this.creatingEdge) {
        return;
      }
      this.drawPort(null, null, {
        position: (0, import_vec9.vec2)(this.creatingEdge.pointer),
        hovered: true,
        connectable: true,
        invalidReason: null
      });
    }
    drawEdgePreview() {
      if (!this.creatingEdge) {
        return;
      }
      const { from, to, fromDirection, toDirection } = this.creatingEdge.getDrawData();
      const sourceTheme = this.creatingEdge.theme ?? {};
      const previewTheme = {
        ...this.options.theme,
        ...sourceTheme,
        edgePreviewColor: sourceTheme.edgePreviewColor ?? sourceTheme.edgeColor ?? this.options.theme.edgePreviewColor,
        edgePreviewLineWidth: sourceTheme.edgePreviewLineWidth ?? sourceTheme.edgeLineWidth ?? this.options.theme.edgePreviewLineWidth,
        edgePreviewOutlineColor: sourceTheme.edgePreviewOutlineColor ?? sourceTheme.edgeHoverOutlineColor ?? this.options.theme.edgePreviewOutlineColor,
        edgePreviewOutlineLineWidth: sourceTheme.edgePreviewOutlineLineWidth ?? sourceTheme.edgeHoverOutlineLineWidth ?? this.options.theme.edgePreviewOutlineLineWidth
      };
      const { callbacks } = this.options;
      this.invokeDrawCallback(
        this.context,
        "drawEdgePreview",
        callbacks.drawEdgePreview,
        {
          from,
          to,
          fromDirection,
          toDirection
        },
        () => {
          this.context.save();
          this.context.strokeStyle = previewTheme.edgePreviewColor;
          this.context.lineWidth = previewTheme.edgePreviewLineWidth;
          curveFromTo(
            this.context,
            from,
            to,
            fromDirection,
            toDirection,
            this.options.gridSize
          );
          this.context.stroke();
          this.context.restore();
          this.context.save();
          this.context.strokeStyle = previewTheme.edgePreviewOutlineColor;
          this.context.lineWidth = previewTheme.edgePreviewOutlineLineWidth;
          curveFromTo(
            this.context,
            from,
            to,
            fromDirection,
            toDirection,
            this.options.gridSize
          );
          this.context.stroke();
          this.context.restore();
        }
      );
    }
    drawEdge(edge) {
      const aEndpoint = this.resolvePortEndpoint(edge.a);
      const bEndpoint = this.resolvePortEndpoint(edge.b);
      if (!aEndpoint || !bEndpoint) {
        return;
      }
      const a = import_vec9.vec2.add(
        aEndpoint.position,
        import_vec9.vec2.mul(aEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      const b = import_vec9.vec2.add(
        bEndpoint.position,
        import_vec9.vec2.mul(bEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      const hovered = this.ensureEdgeState(edge).hovered;
      const edgeTheme = this.effectiveEdgeTheme(edge);
      const { callbacks } = this.options;
      this.invokeDrawCallback(
        this.context,
        "drawEdge",
        callbacks.drawEdge,
        {
          edge,
          from: a,
          to: b,
          fromDirection: aEndpoint.direction,
          toDirection: bEndpoint.direction,
          hovered
        },
        () => {
          this.context.save();
          this.context.strokeStyle = hovered ? edgeTheme.edgeHoveredColor : edgeTheme.edgeColor;
          this.context.lineWidth = edgeTheme.edgeLineWidth;
          curveFromTo(
            this.context,
            a,
            b,
            aEndpoint.direction,
            bEndpoint.direction,
            this.options.gridSize
          );
          this.context.stroke();
          this.context.restore();
          if (hovered) {
            this.context.save();
            this.context.strokeStyle = edgeTheme.edgeHoverOutlineColor;
            this.context.lineWidth = edgeTheme.edgeHoverOutlineLineWidth;
            curveFromTo(
              this.context,
              a,
              b,
              aEndpoint.direction,
              bEndpoint.direction,
              this.options.gridSize
            );
            this.context.stroke();
            this.context.restore();
          }
          if (this.options.showEdgeArrows) {
            const { cp1, cp2, join } = getCurveGeometry(
              a,
              b,
              aEndpoint.direction,
              bEndpoint.direction,
              this.options.gridSize
            );
            const { position: arrowPos, tangent: arrowDir } = sampleBezierChain(
              a,
              cp1,
              join,
              cp2,
              b,
              edgeTheme.edgeArrowOffset
            );
            this.context.save();
            this.context.fillStyle = edgeTheme.edgeArrowColor;
            triangle(this.context, arrowPos, arrowDir, edgeTheme.edgeArrowSize);
            this.context.fill();
            this.context.restore();
          }
        }
      );
    }
    drawEffects() {
      for (const state of this.edgeDashEffects.values()) {
        if (!state.config.running) {
          continue;
        }
        const edge = this.findEdgeByKey(state.edgeKey);
        if (!edge) {
          continue;
        }
        this.drawEdgeDashEffect(edge, state);
      }
      for (const state of this.edgeDotEffects.values()) {
        const edge = this.findEdgeByKey(state.edgeKey);
        if (!edge) {
          continue;
        }
        this.drawEdgeDotEffect(edge, state);
      }
      for (const state of this.portPulseEffects.values()) {
        this.drawPortPulseEffect(state);
      }
    }
    updateEffects(dt) {
      if (!this.options.effects.enabled || this.effectsPaused) {
        return;
      }
      const scaledDt = dt * this.options.effects.timeScale;
      if (scaledDt <= 0) {
        return;
      }
      for (const state of this.edgeDashEffects.values()) {
        if (!state.config.running) {
          continue;
        }
        state.config.phase += state.config.speed * scaledDt;
      }
      for (const state of this.edgeDotEffects.values()) {
        if (state.config.running && state.config.loop) {
          state.spawnElapsed += scaledDt;
          const spawnInterval = Math.max(0.01, state.config.spawnInterval);
          while (state.spawnElapsed >= spawnInterval) {
            state.spawnElapsed -= spawnInterval;
            this.addEdgeDotInstance(state, state.config);
          }
        }
        for (const instance of state.instances) {
          instance.animation.update(scaledDt);
        }
        const completed = state.instances.filter(
          (instance) => instance.animation.finished
        );
        state.instances = state.instances.filter(
          (instance) => !instance.animation.finished
        );
        for (const instance of completed) {
          const edge = this.findEdgeByKey(state.edgeKey);
          if (!edge) {
            continue;
          }
          this.eventBus.emit("effectCompleted", {
            kind: "edgeDot",
            channel: state.channel,
            target: { a: { ...edge.a }, b: { ...edge.b } },
            id: instance.id
          });
        }
      }
      for (const state of this.portPulseEffects.values()) {
        for (const instance of state.instances) {
          instance.animation.update(scaledDt);
        }
        const completed = state.instances.filter(
          (instance) => instance.animation.finished
        );
        state.instances = state.instances.filter(
          (instance) => !instance.animation.finished
        );
        for (const instance of completed) {
          const portRef = this.portRefFromKey(state.portKey);
          if (!portRef) {
            continue;
          }
          this.eventBus.emit("effectCompleted", {
            kind: "portPulse",
            channel: state.channel,
            target: portRef,
            id: instance.id
          });
        }
      }
    }
    drawEdgeDashEffect(edge, state) {
      const geometry = this.resolveEdgeGeometry(edge);
      if (!geometry) {
        return;
      }
      const { callbacks } = this.options;
      this.invokeDrawCallback(
        this.context,
        "drawEdgeDashEffect",
        callbacks.drawEdgeDashEffect,
        {
          edge,
          channel: state.channel,
          from: (0, import_vec9.vec2)(geometry.from),
          to: (0, import_vec9.vec2)(geometry.to),
          fromDirection: (0, import_vec9.vec2)(geometry.fromDirection),
          toDirection: (0, import_vec9.vec2)(geometry.toDirection),
          phase: state.config.phase,
          config: { ...state.config }
        },
        () => {
          this.context.save();
          this.context.globalCompositeOperation = state.config.blendMode;
          this.context.globalAlpha = Math.max(
            0,
            Math.min(1, state.config.opacity)
          );
          this.context.strokeStyle = state.config.color;
          this.context.lineWidth = Math.max(0.1, state.config.lineWidth);
          this.context.setLineDash(state.config.dashPattern);
          this.context.lineDashOffset = -state.config.phase;
          curveFromTo(
            this.context,
            geometry.from,
            geometry.to,
            geometry.fromDirection,
            geometry.toDirection,
            this.options.gridSize
          );
          this.context.stroke();
          this.context.restore();
        }
      );
    }
    drawEdgeDotEffect(edge, state) {
      const geometry = this.resolveEdgeGeometry(edge);
      if (!geometry) {
        return;
      }
      const { callbacks } = this.options;
      const { cp1, cp2, join } = getCurveGeometry(
        geometry.from,
        geometry.to,
        geometry.fromDirection,
        geometry.toDirection,
        this.options.gridSize
      );
      for (const instance of state.instances) {
        const progress = instance.animation.current;
        const sample = sampleBezierChain(
          geometry.from,
          cp1,
          join,
          cp2,
          geometry.to,
          progress
        );
        this.invokeDrawCallback(
          this.context,
          "drawEdgeDotEffect",
          callbacks.drawEdgeDotEffect,
          {
            edge,
            channel: state.channel,
            id: instance.id,
            position: (0, import_vec9.vec2)(sample.position),
            direction: (0, import_vec9.vec2)(sample.tangent),
            progress,
            config: { ...state.config }
          },
          () => {
            this.context.save();
            this.context.globalCompositeOperation = state.config.blendMode;
            this.context.globalAlpha = Math.max(
              0,
              Math.min(1, state.config.opacity)
            );
            this.context.fillStyle = state.config.color;
            this.context.beginPath();
            this.context.arc(
              sample.position.x,
              sample.position.y,
              Math.max(0.1, state.config.radius),
              0,
              Math.PI * 2
            );
            this.context.fill();
            this.context.restore();
          }
        );
      }
    }
    drawPortPulseEffect(state) {
      const resolved = this.resolvePortFromKey(state.portKey);
      if (!resolved) {
        return;
      }
      const { node, port } = resolved;
      const portState = this.ensurePortState(node.id, port.id, port.side);
      const { callbacks } = this.options;
      for (const instance of state.instances) {
        const config = instance.config;
        const progress = instance.animation.current;
        const radius = this.lerp(config.fromRadius, config.toRadius, progress);
        const opacity = Math.max(0, 1 - progress) * config.maxOpacity;
        this.invokeDrawCallback(
          this.context,
          "drawPortPulseEffect",
          callbacks.drawPortPulseEffect,
          {
            node,
            port,
            channel: state.channel,
            id: instance.id,
            position: (0, import_vec9.vec2)(portState.position),
            progress,
            radius,
            opacity,
            config: { ...config }
          },
          () => {
            this.context.save();
            this.context.globalCompositeOperation = config.blendMode;
            this.context.globalAlpha = Math.max(0, Math.min(1, opacity));
            this.context.strokeStyle = config.color;
            this.context.lineWidth = Math.max(0.1, config.lineWidth);
            this.context.beginPath();
            this.context.arc(
              portState.position.x,
              portState.position.y,
              radius,
              0,
              Math.PI * 2
            );
            this.context.stroke();
            this.context.restore();
          }
        );
      }
    }
    callbackRenderMode(callbackName) {
      return this.options.callbacks.renderModes?.[callbackName] ?? "replace";
    }
    invokeDrawCallback(context, callbackName, callback, drawContext, drawDefault) {
      const mode = this.callbackRenderMode(callbackName);
      let defaultDrawn = false;
      const runDefault = () => {
        if (defaultDrawn) {
          return;
        }
        defaultDrawn = true;
        drawDefault();
      };
      if (mode === "overlay") {
        runDefault();
      }
      if (!callback) {
        runDefault();
        return;
      }
      const result = callback(context, drawContext, runDefault);
      if (mode === "replace" && result === false && !defaultDrawn) {
        runDefault();
      }
    }
    getEdgeDashEffectConfig(target, channel) {
      const resolved = this.resolveEdgeTarget(target);
      if (!resolved) {
        return null;
      }
      const key = this.effectKey(resolved.edgeKey, channel);
      const existing = this.edgeDashEffects.get(key);
      return existing ? { ...existing.config } : null;
    }
    setEdgeDashEffectConfig(target, patch, channel) {
      const resolved = this.resolveEdgeTarget(target);
      if (!resolved) {
        return false;
      }
      const edgeTheme = this.effectiveEdgeTheme(resolved.edge);
      const key = this.effectKey(resolved.edgeKey, channel);
      const existing = this.edgeDashEffects.get(key);
      const config = {
        ...this.options.effects.edgeDash,
        color: edgeTheme.edgeDashColor,
        lineWidth: edgeTheme.edgeDashLineWidth,
        ...existing?.config ?? {},
        ...patch
      };
      this.edgeDashEffects.set(key, {
        edgeKey: resolved.edgeKey,
        channel,
        config
      });
      return true;
    }
    startEdgeDashEffect(target, patch = {}, channel) {
      const updated = this.setEdgeDashEffectConfig(
        target,
        { ...patch, running: true },
        channel
      );
      if (!updated) {
        return false;
      }
      this.eventBus.emit("effectStarted", {
        kind: "edgeDash",
        channel,
        target
      });
      return true;
    }
    stopEdgeDashEffect(target, channel) {
      const resolved = this.resolveEdgeTarget(target);
      if (!resolved) {
        return false;
      }
      const key = this.effectKey(resolved.edgeKey, channel);
      const existing = this.edgeDashEffects.get(key);
      if (!existing) {
        return false;
      }
      existing.config.running = false;
      this.eventBus.emit("effectStopped", {
        kind: "edgeDash",
        channel,
        target: { a: { ...resolved.edge.a }, b: { ...resolved.edge.b } }
      });
      return true;
    }
    clearEdgeDashEffects(target, channel = "default") {
      if (!target) {
        for (const [key2, state] of this.edgeDashEffects.entries()) {
          if (channel !== "*" && state.channel !== channel) {
            continue;
          }
          const edge = this.findEdgeByKey(state.edgeKey);
          if (edge) {
            this.eventBus.emit("effectCleared", {
              kind: "edgeDash",
              channel: state.channel,
              target: { a: { ...edge.a }, b: { ...edge.b } }
            });
          }
          this.edgeDashEffects.delete(key2);
        }
        return;
      }
      const resolved = this.resolveEdgeTarget(target);
      if (!resolved) {
        return;
      }
      const key = this.effectKey(resolved.edgeKey, channel);
      if (this.edgeDashEffects.delete(key)) {
        this.eventBus.emit("effectCleared", {
          kind: "edgeDash",
          channel,
          target: { a: { ...resolved.edge.a }, b: { ...resolved.edge.b } }
        });
      }
    }
    getEdgeDotEffectConfig(target, channel) {
      const resolved = this.resolveEdgeTarget(target);
      if (!resolved) {
        return null;
      }
      const key = this.effectKey(resolved.edgeKey, channel);
      const existing = this.edgeDotEffects.get(key);
      return existing ? { ...existing.config } : null;
    }
    setEdgeDotEffectConfig(target, patch, channel) {
      const resolved = this.resolveEdgeTarget(target);
      if (!resolved) {
        return false;
      }
      const edgeTheme = this.effectiveEdgeTheme(resolved.edge);
      const key = this.effectKey(resolved.edgeKey, channel);
      const existing = this.edgeDotEffects.get(key);
      const config = {
        ...this.options.effects.edgeDot,
        color: edgeTheme.edgeDotColor,
        radius: edgeTheme.edgeDotRadius,
        opacity: edgeTheme.edgeDotOpacity,
        ...existing?.config ?? {},
        ...patch,
        animation: {
          ...this.options.effects.edgeDot.animation,
          ...existing?.config.animation ?? {},
          ...patch.animation ?? {}
        }
      };
      this.edgeDotEffects.set(key, {
        edgeKey: resolved.edgeKey,
        channel,
        config,
        spawnElapsed: existing?.spawnElapsed ?? 0,
        instances: existing?.instances ?? []
      });
      return true;
    }
    triggerEdgeDotEffect(target, patch = {}, channel) {
      const updated = this.setEdgeDotEffectConfig(target, patch, channel);
      if (!updated) {
        return null;
      }
      const resolved = this.resolveEdgeTarget(target);
      if (!resolved) {
        return null;
      }
      const key = this.effectKey(resolved.edgeKey, channel);
      const state = this.edgeDotEffects.get(key);
      if (!state) {
        return null;
      }
      const instance = this.addEdgeDotInstance(state, state.config);
      if (!instance) {
        return null;
      }
      this.eventBus.emit("effectStarted", {
        kind: "edgeDot",
        channel,
        target: { a: { ...resolved.edge.a }, b: { ...resolved.edge.b } },
        id: instance.id
      });
      return {
        id: instance.id,
        stop: () => this.stopEdgeDotInstance(key, instance.id)
      };
    }
    startEdgeDotEffect(target, patch = {}, channel) {
      const updated = this.setEdgeDotEffectConfig(
        target,
        { ...patch, running: true, loop: true },
        channel
      );
      if (!updated) {
        return false;
      }
      this.eventBus.emit("effectStarted", {
        kind: "edgeDot",
        channel,
        target
      });
      return true;
    }
    stopEdgeDotEffect(target, channel) {
      const resolved = this.resolveEdgeTarget(target);
      if (!resolved) {
        return false;
      }
      const key = this.effectKey(resolved.edgeKey, channel);
      const state = this.edgeDotEffects.get(key);
      if (!state) {
        return false;
      }
      state.config.running = false;
      state.config.loop = false;
      this.eventBus.emit("effectStopped", {
        kind: "edgeDot",
        channel,
        target: { a: { ...resolved.edge.a }, b: { ...resolved.edge.b } }
      });
      return true;
    }
    clearEdgeDotEffects(target, channel = "default") {
      if (!target) {
        for (const [key2, state] of this.edgeDotEffects.entries()) {
          if (channel !== "*" && state.channel !== channel) {
            continue;
          }
          const edge = this.findEdgeByKey(state.edgeKey);
          if (edge) {
            this.eventBus.emit("effectCleared", {
              kind: "edgeDot",
              channel: state.channel,
              target: { a: { ...edge.a }, b: { ...edge.b } }
            });
          }
          this.edgeDotEffects.delete(key2);
        }
        return;
      }
      const resolved = this.resolveEdgeTarget(target);
      if (!resolved) {
        return;
      }
      const key = this.effectKey(resolved.edgeKey, channel);
      if (this.edgeDotEffects.delete(key)) {
        this.eventBus.emit("effectCleared", {
          kind: "edgeDot",
          channel,
          target: { a: { ...resolved.edge.a }, b: { ...resolved.edge.b } }
        });
      }
    }
    triggerPortPulseEffect(target, patch = {}, channel) {
      const resolved = this.resolveNodeAndPort(target);
      if (!resolved) {
        return null;
      }
      const key = this.effectKey(
        this.portKey(target.nodeId, target.portId),
        channel
      );
      const config = {
        ...this.options.effects.portPulse,
        color: this.effectivePortTheme(resolved.port).portPulseColor,
        lineWidth: this.effectivePortTheme(resolved.port).portPulseLineWidth,
        fromRadius: this.effectivePortTheme(resolved.port).portPulseFromRadius,
        toRadius: this.effectivePortTheme(resolved.port).portPulseToRadius,
        maxOpacity: this.effectivePortTheme(resolved.port).portPulseMaxOpacity,
        ...patch,
        animation: {
          ...this.options.effects.portPulse.animation,
          ...patch.animation ?? {}
        }
      };
      const state = this.portPulseEffects.get(key) ?? {
        portKey: this.portKey(target.nodeId, target.portId),
        channel,
        instances: []
      };
      const id = this.createId("effect-port-pulse");
      const duration = Math.max(0.01, config.duration);
      const instance = {
        id,
        channel,
        animation: this.createUnitAnimation(duration, config.animation),
        config
      };
      instance.animation.start();
      if (state.instances.length >= this.options.effects.maxPortPulseInstances) {
        state.instances.shift();
      }
      state.instances.push(instance);
      this.portPulseEffects.set(key, state);
      this.eventBus.emit("effectStarted", {
        kind: "portPulse",
        channel,
        target,
        id
      });
      return {
        id,
        stop: () => this.stopPortPulseInstance(key, id)
      };
    }
    clearPortPulseEffects(target, channel = "default") {
      if (!target) {
        for (const [key2, state] of this.portPulseEffects.entries()) {
          if (channel !== "*" && state.channel !== channel) {
            continue;
          }
          const portRef = this.portRefFromKey(state.portKey);
          if (portRef) {
            this.eventBus.emit("effectCleared", {
              kind: "portPulse",
              channel: state.channel,
              target: portRef
            });
          }
          this.portPulseEffects.delete(key2);
        }
        return;
      }
      const key = this.effectKey(
        this.portKey(target.nodeId, target.portId),
        channel
      );
      if (this.portPulseEffects.delete(key)) {
        this.eventBus.emit("effectCleared", {
          kind: "portPulse",
          channel,
          target
        });
      }
    }
    clearAllEffects() {
      this.clearEdgeDashEffects(void 0, "*");
      this.clearEdgeDotEffects(void 0, "*");
      this.clearPortPulseEffects(void 0, "*");
    }
    clearEdgeEffectsForNode(nodeId) {
      for (const edge of this.graph.edges) {
        if (edge.a.nodeId !== nodeId && edge.b.nodeId !== nodeId) {
          continue;
        }
        this.clearEdgeDashEffects({ a: edge.a, b: edge.b });
        this.clearEdgeDotEffects({ a: edge.a, b: edge.b });
      }
    }
    addEdgeDotInstance(state, config) {
      if (state.instances.length >= this.options.effects.maxEdgeDotInstances) {
        state.instances.shift();
      }
      const id = this.createId("effect-edge-dot");
      const duration = Math.max(0.01, config.duration);
      const instance = {
        id,
        channel: state.channel,
        animation: this.createUnitAnimation(duration, config.animation)
      };
      instance.animation.start();
      state.instances.push(instance);
      return instance;
    }
    stopEdgeDotInstance(effectKey, id) {
      const state = this.edgeDotEffects.get(effectKey);
      if (!state) {
        return false;
      }
      const previousLength = state.instances.length;
      state.instances = state.instances.filter((instance) => instance.id !== id);
      if (state.instances.length === previousLength) {
        return false;
      }
      const edge = this.findEdgeByKey(state.edgeKey);
      if (edge) {
        this.eventBus.emit("effectStopped", {
          kind: "edgeDot",
          channel: state.channel,
          target: { a: { ...edge.a }, b: { ...edge.b } },
          id
        });
      }
      return true;
    }
    stopPortPulseInstance(effectKey, id) {
      const state = this.portPulseEffects.get(effectKey);
      if (!state) {
        return false;
      }
      const previousLength = state.instances.length;
      state.instances = state.instances.filter((instance) => instance.id !== id);
      if (state.instances.length === previousLength) {
        return false;
      }
      const target = this.portRefFromKey(state.portKey);
      if (target) {
        this.eventBus.emit("effectStopped", {
          kind: "portPulse",
          channel: state.channel,
          target,
          id
        });
      }
      return true;
    }
    resolveEdgeTarget(target) {
      const edge = this.findEdge(target.a, target.b);
      if (!edge) {
        return null;
      }
      return {
        edge,
        edgeKey: this.edgeKey(edge)
      };
    }
    resolveEdgeGeometry(edge) {
      const aEndpoint = this.resolvePortEndpoint(edge.a);
      const bEndpoint = this.resolvePortEndpoint(edge.b);
      if (!aEndpoint || !bEndpoint) {
        return null;
      }
      return {
        from: import_vec9.vec2.add(
          aEndpoint.position,
          import_vec9.vec2.mul(aEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
        ),
        to: import_vec9.vec2.add(
          bEndpoint.position,
          import_vec9.vec2.mul(bEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
        ),
        fromDirection: aEndpoint.direction,
        toDirection: bEndpoint.direction
      };
    }
    findEdgeByKey(edgeKey) {
      return this.graph.edges.find((edge) => this.edgeKey(edge) === edgeKey) ?? null;
    }
    resolvePortFromKey(portKey) {
      const target = this.portRefFromKey(portKey);
      if (!target) {
        return null;
      }
      const resolved = this.resolveNodeAndPort(target);
      if (!resolved) {
        return null;
      }
      return {
        ...resolved,
        target
      };
    }
    effectKey(baseKey, channel) {
      return `${baseKey}::${channel}`;
    }
    portRefFromKey(portKey) {
      const split = portKey.indexOf(":");
      if (split === -1) {
        return null;
      }
      return {
        nodeId: portKey.slice(0, split),
        portId: portKey.slice(split + 1)
      };
    }
    lerp(a, b, t) {
      return a + (b - a) * t;
    }
    createUnitAnimation(duration, options) {
      return new import_animation.Animation({
        initialValue: 0,
        targetValue: 1,
        mode: import_animation.AnimationMode.Trigger,
        repeat: import_animation.RepeatMode.Once,
        duration,
        ...options
      });
    }
    selectNode(nodeId) {
      this.selectedNodeId = nodeId;
      for (const node of this.graph.nodes) {
        const state = this.ensureNodeState(node);
        state.selected = node.id === nodeId;
      }
      if (nodeId !== null) {
        const index = this.graph.nodes.findIndex((node) => node.id === nodeId);
        if (index !== -1) {
          const node = this.graph.nodes[index];
          this.graph.nodes.splice(index, 1);
          this.graph.nodes.push(node);
        }
      }
      this.eventBus.emit("nodeSelected", { nodeId });
    }
    findIncomingEdgeForPort(portRef) {
      return this.graph.edges.find((edge) => this.portRefEq(edge.b, portRef)) ?? null;
    }
    findEdge(a, b) {
      return this.graph.edges.find(
        (edge) => this.portRefEq(edge.a, a) && this.portRefEq(edge.b, b) || this.portRefEq(edge.a, b) && this.portRefEq(edge.b, a)
      ) ?? null;
    }
    edgeExists(a, b) {
      return this.findEdge(a, b) !== null;
    }
    normalizeEdgeEndpoints(a, b, data) {
      const aEndpoint = this.resolvePortEndpoint(a);
      const bEndpoint = this.resolvePortEndpoint(b);
      if (!aEndpoint || !bEndpoint) {
        return null;
      }
      if (aEndpoint.type === bEndpoint.type) {
        return null;
      }
      if (aEndpoint.type === "output" /* Output */) {
        return { a: { ...a }, b: { ...b }, data };
      }
      return { a: { ...b }, b: { ...a }, data };
    }
    resolvePortEndpoint(portRef) {
      const node = this.graph.nodes.find((n) => n.id === portRef.nodeId);
      if (!node) {
        return null;
      }
      const port = node.ports.find((p) => p.id === portRef.portId);
      if (!port) {
        return null;
      }
      const state = this.ensurePortState(node.id, port.id, port.side);
      return {
        nodeId: node.id,
        portId: port.id,
        type: port.type,
        side: port.side,
        position: state.position,
        direction: state.direction
      };
    }
    resolveNodeAndPort(portRef) {
      const node = this.graph.nodes.find((n) => n.id === portRef.nodeId);
      if (!node) {
        return null;
      }
      const port = node.ports.find((p) => p.id === portRef.portId);
      if (!port) {
        return null;
      }
      return { node, port };
    }
    resolvePortPosition(node, port) {
      const nodePortsSameSide = node.ports.filter((p) => p.side === port.side);
      const index = nodePortsSameSide.findIndex((p) => p.id === port.id);
      const state = this.ensureNodeState(node);
      switch (port.side) {
        case "top" /* Top */:
          return import_vec9.vec2.add(
            state.actualPosition,
            (0, import_vec9.vec2)(
              (index + 1) / (nodePortsSameSide.length + 1) * state.actualSize.x,
              0
            )
          );
        case "right" /* Right */:
          return import_vec9.vec2.add(
            state.actualPosition,
            (0, import_vec9.vec2)(
              state.actualSize.x,
              (index + 1) / (nodePortsSameSide.length + 1) * state.actualSize.y
            )
          );
        case "bottom" /* Bottom */:
          return import_vec9.vec2.add(
            state.actualPosition,
            (0, import_vec9.vec2)(
              (index + 1) / (nodePortsSameSide.length + 1) * state.actualSize.x,
              state.actualSize.y
            )
          );
        case "left" /* Left */:
        default:
          return import_vec9.vec2.add(
            state.actualPosition,
            (0, import_vec9.vec2)(
              0,
              (index + 1) / (nodePortsSameSide.length + 1) * state.actualSize.y
            )
          );
      }
    }
    directionFromSide(side) {
      return {
        ["top" /* Top */]: (0, import_vec9.vec2)(0, -1),
        ["right" /* Right */]: (0, import_vec9.vec2)(1, 0),
        ["bottom" /* Bottom */]: (0, import_vec9.vec2)(0, 1),
        ["left" /* Left */]: (0, import_vec9.vec2)(-1, 0)
      }[side];
    }
    ensureNodeState(node) {
      const existing = this.nodeState.get(node.id);
      if (existing) {
        return existing;
      }
      const state = {
        hovered: false,
        selected: false,
        dragging: false,
        resizing: false,
        resizeHovered: false,
        deleteHovered: false,
        dragOffset: (0, import_vec9.vec2)(),
        resizeOffset: (0, import_vec9.vec2)(),
        actualPosition: (0, import_vec9.vec2)(node.position),
        actualSize: (0, import_vec9.vec2)(node.size)
      };
      this.nodeState.set(node.id, state);
      return state;
    }
    ensureEdgeState(edge) {
      const key = this.edgeKey(edge);
      const existing = this.edgeState.get(key);
      if (existing) {
        return existing;
      }
      const state = {
        hovered: false
      };
      this.edgeState.set(key, state);
      return state;
    }
    ensurePortState(nodeId, portId, side) {
      const key = this.portKey(nodeId, portId);
      const existing = this.portState.get(key);
      if (existing) {
        return existing;
      }
      const state = {
        position: (0, import_vec9.vec2)(),
        direction: this.directionFromSide(side),
        hovered: false,
        connectable: true,
        invalidReason: null
      };
      this.portState.set(key, state);
      return state;
    }
    cloneGraph(graph) {
      return {
        nodes: graph.nodes.map((node) => ({
          ...node,
          position: (0, import_vec9.vec2)(node.position),
          size: (0, import_vec9.vec2)(node.size),
          ports: node.ports.map((port) => ({ ...port }))
        })),
        edges: graph.edges.map((edge) => ({
          ...edge,
          a: { ...edge.a },
          b: { ...edge.b }
        }))
      };
    }
    portRefEq(a, b) {
      return a.nodeId === b.nodeId && a.portId === b.portId;
    }
    edgeKey(edge) {
      return `${edge.a.nodeId}:${edge.a.portId}->${edge.b.nodeId}:${edge.b.portId}`;
    }
    portKey(nodeId, portId) {
      return `${nodeId}:${portId}`;
    }
    effectiveNodeTheme(node) {
      return { ...this.options.theme, ...node.theme };
    }
    effectivePortTheme(port) {
      return { ...this.options.theme, ...port?.theme ?? {} };
    }
    effectiveEdgeTheme(edge) {
      return { ...this.options.theme, ...edge.theme };
    }
    createId(prefix) {
      if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.randomUUID) {
        return globalThis.crypto.randomUUID();
      }
      return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    }
  };
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=index.browser.js.map
