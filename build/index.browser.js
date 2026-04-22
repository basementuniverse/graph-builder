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

  // node_modules/@basementuniverse/camera/build/index.js
  var require_build = __commonJS({
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

  // node_modules/@basementuniverse/frame-timer/build/index.js
  var require_build2 = __commonJS({
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
  var require_build3 = __commonJS({
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
      var vec29 = (x, y) => {
        if (!x && !y) {
          return { x: 0, y: 0 };
        }
        if (_vec_is_vec2(x)) {
          return { x: x.x || 0, y: x.y || 0 };
        }
        return { x, y: y ?? x };
      };
      vec29.components = (a) => [a.x, a.y];
      vec29.fromComponents = (components) => vec29(...components.slice(0, 2));
      vec29.ux = () => vec29(1, 0);
      vec29.uy = () => vec29(0, 1);
      vec29.add = (a, b) => ({ x: a.x + (b.x ?? b), y: a.y + (b.y ?? b) });
      vec29.addm = (...v) => v.reduce((a, b) => vec29.add(a, b), vec29());
      vec29.sub = (a, b) => ({ x: a.x - (b.x ?? b), y: a.y - (b.y ?? b) });
      vec29.subm = (...v) => v.reduce((a, b) => vec29.sub(a, b));
      vec29.mul = (a, b) => ({ x: a.x * (b.x ?? b), y: a.y * (b.y ?? b) });
      vec29.scale = (a, b) => vec29.mul(a, b);
      vec29.div = (a, b) => ({ x: a.x / (b.x ?? b), y: a.y / (b.y ?? b) });
      vec29.len = (a) => Math.sqrt(a.x * a.x + a.y * a.y);
      vec29.manhattan = (a) => Math.abs(a.x) + Math.abs(a.y);
      vec29.nor = (a) => {
        let len = vec29.len(a);
        return len ? { x: a.x / len, y: a.y / len } : vec29();
      };
      vec29.dot = (a, b) => a.x * b.x + a.y * b.y;
      vec29.rot = (a, r) => {
        let s = Math.sin(r), c = Math.cos(r);
        return { x: c * a.x - s * a.y, y: s * a.x + c * a.y };
      };
      vec29.rotf = (a, r) => {
        switch (r) {
          case 1:
            return vec29(a.y, -a.x);
          case -1:
            return vec29(-a.y, a.x);
          case 2:
          case -2:
            return vec29(-a.x, -a.y);
          default:
            return a;
        }
      };
      vec29.cross = (a, b) => {
        return a.x * b.y - a.y * b.x;
      };
      vec29.eq = (a, b) => a.x === b.x && a.y === b.y;
      vec29.rad = (a) => Math.atan2(a.y, a.x);
      vec29.cpy = (a) => vec29(a);
      vec29.map = (a, f) => ({ x: f(a.x, "x"), y: f(a.y, "y") });
      vec29.str = (a, s = ", ") => `${a.x}${s}${a.y}`;
      vec29.swiz = (a, s = "..") => {
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
      vec29.polar = (a) => ({ r: vec29.len(a), theta: Math.atan2(a.y, a.x) });
      vec29.fromPolar = (r, theta) => vec29(r * Math.cos(theta), r * Math.sin(theta));
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
          bb = vec29.components(b);
          n = 2;
          rt = vec29.fromComponents;
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
        module2.exports = { vec2: vec29, vec3, mat, isVec2, isVec3, isMat };
      }
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
  var import_camera = __toESM(require_build());
  var import_frame_timer = __toESM(require_build2());
  var import_input_manager = __toESM(require_build3());
  var import_vec8 = __toESM(require_vec());

  // src/constants.ts
  var import_vec = __toESM(require_vec());
  var FPS_MIN = 30;
  var GRID_SIZE = 32;
  var NODE_MIN_SIZE = 50;
  var NODE_MAX_SIZE = 400;
  var NODE_EASE_AMOUNT = 0.4;
  var CAMERA_KEYBOARD_PAN_SPEED = 600;
  var CAMERA_ZOOM_STEP = 0.1;
  var DEFAULT_NODE_SIZE = (0, import_vec.vec2)(200, 120);
  var PORT_HOVER_DISTANCE = 16;
  var PORT_CONNECT_DISTANCE = 24;
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
    // Node label
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
    // Edge
    edgeColor: "#fff2",
    edgeHoveredColor: "#fff4",
    edgeLineWidth: 3,
    edgeHoverOutlineColor: "#fff2",
    edgeHoverOutlineLineWidth: 10,
    // Edge preview
    edgePreviewColor: "#fff6",
    edgePreviewLineWidth: 3,
    edgePreviewOutlineColor: "#fff3",
    edgePreviewOutlineLineWidth: 10
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
    constructor(a) {
      this.a = a;
      this.pointerDirection = null;
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
  var import_vec4 = __toESM(require_vec());
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
    const distance = import_vec4.vec2.len(import_vec4.vec2.sub(a, b));
    const minDistance = gridSize * 4;
    let curveStrength = gridSize;
    if (distance < minDistance) {
      curveStrength = (0, import_utils.lerp)(0, gridSize, (0, import_utils.clamp)(distance / minDistance, 0, 1));
    }
    const cp1 = import_vec4.vec2.add(a, import_vec4.vec2.mul(initialDirection, curveStrength));
    const cp2 = import_vec4.vec2.add(b, import_vec4.vec2.mul(finalDirection, curveStrength));
    const join = import_vec4.vec2.div(import_vec4.vec2.add(cp1, cp2), 2);
    return { cp1, cp2, join };
  }
  function pointToQuadraticBezierDistance(p, a, cp, b, t) {
    const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cp.x + t * t * b.x;
    const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cp.y + t * t * b.y;
    return import_vec4.vec2.len(import_vec4.vec2.sub(p, { x, y }));
  }

  // src/utils/layout.ts
  var import_vec5 = __toESM(require_vec());
  function toPosition(direction, layerIndex, nodeIndex, layerSpacing, nodeSpacing) {
    switch (direction) {
      case "bottom-up" /* BottomUp */:
        return (0, import_vec5.vec2)(nodeIndex * nodeSpacing, -layerIndex * layerSpacing);
      case "left-right" /* LeftRight */:
        return (0, import_vec5.vec2)(layerIndex * layerSpacing, nodeIndex * nodeSpacing);
      case "right-left" /* RightLeft */:
        return (0, import_vec5.vec2)(-layerIndex * layerSpacing, nodeIndex * nodeSpacing);
      case "top-down" /* TopDown */:
      default:
        return (0, import_vec5.vec2)(nodeIndex * nodeSpacing, layerIndex * layerSpacing);
    }
  }

  // src/utils/point.ts
  var import_vec6 = __toESM(require_vec());
  function pointInRectangle(point, rectangle) {
    return point.x >= rectangle.position.x && point.x <= rectangle.position.x + rectangle.size.x && point.y >= rectangle.position.y && point.y <= rectangle.position.y + rectangle.size.y;
  }
  function pointInCircle(point, circle) {
    return import_vec6.vec2.len(import_vec6.vec2.sub(point, circle.position)) <= circle.radius;
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
  function getNeighbors(graph, nodeId, direction = "both" /* Both */) {
    const { outgoing, incoming } = buildAdjacency(graph);
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
  function traverseBFS(graph, startNodeId, visitor, direction = "both" /* Both */) {
    const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
    if (!nodesById.has(startNodeId)) {
      return [];
    }
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
      const node = nodesById.get(current.nodeId);
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
      for (const neighbor of getNeighbors(graph, current.nodeId, direction)) {
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
    const results = [];
    const visited = /* @__PURE__ */ new Set();
    const walk = (nodeId, depth) => {
      if (visited.has(nodeId)) {
        return false;
      }
      visited.add(nodeId);
      const node = nodesById.get(nodeId);
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
      for (const neighbor of getNeighbors(graph, nodeId, direction)) {
        if (walk(neighbor, depth + 1)) {
          return true;
        }
      }
      return false;
    };
    walk(startNodeId, 0);
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
  var import_vec7 = __toESM(require_vec());
  function clampVec(value, min, max) {
    return (0, import_vec7.vec2)(
      Math.min(Math.max(value.x, min.x), max.x),
      Math.min(Math.max(value.y, min.y), max.y)
    );
  }
  function roundVec(value, step) {
    return (0, import_vec7.vec2)(
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
  var GraphBuilder = class _GraphBuilder {
    constructor(canvas, options = {}) {
      this.frameHandle = 0;
      this.running = false;
      this.graph = {
        nodes: [],
        edges: []
      };
      this.nodeState = /* @__PURE__ */ new Map();
      this.edgeState = /* @__PURE__ */ new Map();
      this.portState = /* @__PURE__ */ new Map();
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
        autoStart: options.autoStart ?? true,
        canConnectPorts: options.canConnectPorts,
        camera: options.camera ?? {},
        theme: { ...DEFAULT_THEME, ...options.theme },
        callbacks: options.callbacks ?? {},
        capabilities: { ...DEFAULT_CAPABILITIES, ...options.capabilities }
      };
      this.canvas.style.backgroundColor = this.options.theme.backgroundColor;
      this.camera = new import_camera.default((0, import_vec8.vec2)(), {
        moveEaseAmount: 0.9,
        scaleEaseAmount: 0.9,
        minScale: 0.5,
        maxScale: 5,
        ...this.options.camera
      });
      this.frameTimer = new import_frame_timer.default({ minFPS: FPS_MIN });
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
      this.screen = (0, import_vec8.vec2)();
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
      this.options.gridSize = Math.max(1, size);
    }
    getGraph() {
      return this.serialize();
    }
    serialize() {
      return {
        nodes: this.graph.nodes.map((node) => ({
          ...node,
          position: (0, import_vec8.vec2)(node.position),
          size: (0, import_vec8.vec2)(node.size),
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
          cameraPosition: (0, import_vec8.vec2)(this.camera.position),
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
    loadFromDocument(document) {
      if (document.type !== "graph-document") {
        throw new Error("Invalid graph document type");
      }
      this.load(document.graph);
      if (document.layout) {
        this.camera.positionImmediate = (0, import_vec8.vec2)(document.layout.cameraPosition);
        this.camera.scale = document.layout.cameraScale;
        this.selectNode(document.layout.selectedNodeId);
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
          position: (0, import_vec8.vec2)(),
          size: (0, import_vec8.vec2)(resolved?.size ?? DEFAULT_NODE_SIZE),
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
        position: (0, import_vec8.vec2)(position),
        template: {
          ...source,
          size: (0, import_vec8.vec2)(source.size),
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
        position: (0, import_vec8.vec2)(position),
        size: (0, import_vec8.vec2)(source.size ?? DEFAULT_NODE_SIZE),
        label: source.label,
        ports: source.ports.map((port) => ({ ...port })),
        resizable: source.resizable ?? true,
        deletable: source.deletable ?? true,
        data: source.data
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
        position: (0, import_vec8.vec2)(node.position),
        size: (0, import_vec8.vec2)(node.size),
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
          position: (0, import_vec8.vec2)(node.position),
          size: (0, import_vec8.vec2)(node.size),
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
      this.graph.edges = this.graph.edges.filter(
        (edge) => edge.a.nodeId !== nodeId && edge.b.nodeId !== nodeId
      );
      this.graph.nodes = this.graph.nodes.filter((n) => n.id !== nodeId);
      this.nodeState.delete(nodeId);
      for (const port of node.ports) {
        this.portState.delete(this.portKey(nodeId, port.id));
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
          position: (0, import_vec8.vec2)(node.position),
          size: (0, import_vec8.vec2)(node.size),
          ports: node.ports.map((port) => ({ ...port }))
        }
      });
      return true;
    }
    createEdge(a, b, data) {
      if (!this.options.capabilities.createEdges) {
        return false;
      }
      const normalized = this.normalizeEdgeEndpoints(a, b, data);
      if (!normalized) {
        return false;
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
    getNeighbors(nodeId, direction = "both" /* Both */) {
      return getNeighbors(this.graph, nodeId, direction);
    }
    traverseBFS(startNodeId, visitor, direction = "both" /* Both */) {
      return traverseBFS(this.graph, startNodeId, visitor, direction);
    }
    traverseDFS(startNodeId, visitor, direction = "both" /* Both */) {
      return traverseDFS(this.graph, startNodeId, visitor, direction);
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
          const from = (0, import_vec8.vec2)(node.position);
          node.position = roundVec(node.position, this.options.gridSize);
          this.eventBus.emit("nodeMoved", {
            nodeId: node.id,
            from,
            to: (0, import_vec8.vec2)(node.position)
          });
        }
        if (snapSizes) {
          const from = (0, import_vec8.vec2)(node.size);
          node.size = roundVec(node.size, this.options.gridSize);
          this.eventBus.emit("nodeResized", {
            nodeId: node.id,
            from,
            to: (0, import_vec8.vec2)(node.size)
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
        node.position = (0, import_vec8.vec2)(position);
        this.ensureNodeState(node).actualPosition = (0, import_vec8.vec2)(position);
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
        node.position = (0, import_vec8.vec2)(position);
        this.ensureNodeState(node).actualPosition = (0, import_vec8.vec2)(position);
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
      if (this.creatingEdge) {
        this.drawEdgePreviewPort();
        this.drawEdgePreview();
      }
      this.context.restore();
    }
    update(dt) {
      _GraphBuilder.screen = (0, import_vec8.vec2)(this.canvas.width, this.canvas.height);
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
      import_input_manager.default.update();
    }
    loop() {
      this.frameTimer.update();
      this.update(this.frameTimer.elapsedTime);
      this.draw();
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
        this.camera.positionImmediate = import_vec8.vec2.add(
          this.camera.position,
          import_vec8.vec2.sub(this.panOffset, cameraPosition)
        );
      }
      if (!import_input_manager.default.mouseDown()) {
        this.panOffset = null;
      }
      const pan = (0, import_vec8.vec2)(CAMERA_KEYBOARD_PAN_SPEED * dt, 0);
      if (import_input_manager.default.keyDown("KeyW") || import_input_manager.default.keyDown("ArrowUp")) {
        this.camera.positionImmediate = import_vec8.vec2.add(
          this.camera.position,
          import_vec8.vec2.rotf(pan, 1)
        );
      }
      if (import_input_manager.default.keyDown("KeyS") || import_input_manager.default.keyDown("ArrowDown")) {
        this.camera.positionImmediate = import_vec8.vec2.add(
          this.camera.position,
          import_vec8.vec2.rotf(pan, -1)
        );
      }
      if (import_input_manager.default.keyDown("KeyA") || import_input_manager.default.keyDown("ArrowLeft")) {
        this.camera.positionImmediate = import_vec8.vec2.add(
          this.camera.position,
          import_vec8.vec2.rotf(pan, 2)
        );
      }
      if (import_input_manager.default.keyDown("KeyD") || import_input_manager.default.keyDown("ArrowRight")) {
        this.camera.positionImmediate = import_vec8.vec2.add(
          this.camera.position,
          import_vec8.vec2.rotf(pan, 0)
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
      const radius = this.tool === "create-edge" /* CreateEdge */ ? PORT_CONNECT_DISTANCE : PORT_HOVER_DISTANCE;
      const reversedNodes = [...this.graph.nodes].reverse();
      for (const node of reversedNodes) {
        for (const port of node.ports) {
          const state = this.ensurePortState(node.id, port.id, port.side);
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
          position: import_vec8.vec2.add(
            node.position,
            (0, import_vec8.vec2)(node.size.x - DELETE_BUTTON_SIZE, 0)
          ),
          size: (0, import_vec8.vec2)(DELETE_BUTTON_SIZE)
        });
        state.deleteHovered = deleteHovered;
        const resizeHovered = this.options.capabilities.resizeNodes && (node.resizable ?? true) && ["select" /* Select */, "resize-node" /* ResizeNode */].includes(this.tool) && pointInRectangle(mouse, {
          position: import_vec8.vec2.add(
            node.position,
            import_vec8.vec2.sub(node.size, RESIZE_HANDLE_SIZE)
          ),
          size: (0, import_vec8.vec2)(RESIZE_HANDLE_SIZE)
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
      const a = import_vec8.vec2.add(
        aEndpoint.position,
        import_vec8.vec2.mul(aEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      const b = import_vec8.vec2.add(
        bEndpoint.position,
        import_vec8.vec2.mul(bEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      const { cp1, cp2, join } = getCurveGeometry(
        a,
        b,
        aEndpoint.direction,
        bEndpoint.direction,
        this.options.gridSize
      );
      const samples = Math.ceil(import_vec8.vec2.len(import_vec8.vec2.sub(a, b)) / EDGE_CURVE_SAMPLE_DISTANCE) + 1;
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
        hoveredNodeState.dragOffset = import_vec8.vec2.sub(mouse, hoveredNode.position);
      }
      if (this.options.capabilities.resizeNodes && this.tool === "resize-node" /* ResizeNode */ && hoveredNode && hoveredNodeState && hoveredNodeState.resizeHovered && !this.resizingNodeId && import_input_manager.default.mouseDown()) {
        this.resizingNodeId = hoveredNode.id;
        hoveredNodeState.resizing = true;
        hoveredNodeState.resizeOffset = import_vec8.vec2.sub(
          mouse,
          import_vec8.vec2.add(hoveredNode.position, hoveredNode.size)
        );
      }
      if (this.draggingNodeId) {
        const node = this.graph.nodes.find((n) => n.id === this.draggingNodeId);
        const state = node ? this.ensureNodeState(node) : null;
        if (node && state) {
          const from = (0, import_vec8.vec2)(node.position);
          node.position = import_vec8.vec2.sub(mouse, state.dragOffset);
          if (this.options.snapToGrid) {
            node.position = roundVec(node.position, this.options.gridSize);
          }
          if (from.x !== node.position.x || from.y !== node.position.y) {
            this.eventBus.emit("nodeMoved", {
              nodeId: node.id,
              from,
              to: (0, import_vec8.vec2)(node.position)
            });
          }
        }
      }
      if (this.resizingNodeId) {
        const node = this.graph.nodes.find((n) => n.id === this.resizingNodeId);
        const state = node ? this.ensureNodeState(node) : null;
        if (node && state) {
          const from = (0, import_vec8.vec2)(node.size);
          node.size = clampVec(
            import_vec8.vec2.sub(import_vec8.vec2.sub(mouse, node.position), state.resizeOffset),
            (0, import_vec8.vec2)(NODE_MIN_SIZE),
            (0, import_vec8.vec2)(NODE_MAX_SIZE)
          );
          if (this.options.snapToGrid) {
            node.size = roundVec(node.size, this.options.gridSize);
          }
          if (from.x !== node.size.x || from.y !== node.size.y) {
            this.eventBus.emit("nodeResized", {
              nodeId: node.id,
              from,
              to: (0, import_vec8.vec2)(node.size)
            });
          }
        }
      }
      if (this.creatingEdge) {
        const hovered = this.hoveredPort ? this.resolvePortEndpoint(this.hoveredPort) : null;
        this.creatingEdge.update(
          hovered ? (0, import_vec8.vec2)(hovered.position) : (0, import_vec8.vec2)(mouse),
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
      this.creatingEdge = new EdgeTool(endpoint);
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
            { nodeId: hovered.nodeId, portId: hovered.portId }
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
      if (a.nodeId === b.nodeId) {
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
        state.actualPosition = import_vec8.vec2.add(
          state.actualPosition,
          import_vec8.vec2.mul(
            import_vec8.vec2.sub(node.position, state.actualPosition),
            NODE_EASE_AMOUNT
          )
        );
        state.actualSize = import_vec8.vec2.add(
          state.actualSize,
          import_vec8.vec2.mul(import_vec8.vec2.sub(node.size, state.actualSize), NODE_EASE_AMOUNT)
        );
      }
    }
    drawGrid() {
      const bounds = this.camera.bounds;
      let { left: l, top: t, right: r, bottom: b } = bounds;
      [l, t, r, b] = [l, t, r, b].map(
        (v) => Math.floor(v / this.options.gridSize) * this.options.gridSize
      );
      const { theme, callbacks } = this.options;
      this.context.save();
      this.context.lineWidth = theme.gridDotLineWidth;
      this.context.strokeStyle = theme.gridDotColor;
      for (let y = t - this.options.gridSize; y < b + this.options.gridSize; y += this.options.gridSize) {
        for (let x = l - this.options.gridSize; x < r + this.options.gridSize; x += this.options.gridSize) {
          const position = (0, import_vec8.vec2)(x, y);
          if (callbacks.drawGridDot) {
            callbacks.drawGridDot(this.context, {
              position,
              gridSize: this.options.gridSize
            });
          } else {
            plus(this.context, position, 8);
          }
        }
      }
      this.context.restore();
    }
    drawNode(node) {
      const state = this.ensureNodeState(node);
      const { theme, callbacks } = this.options;
      if (callbacks.drawNodeFrame) {
        callbacks.drawNodeFrame(this.context, {
          node,
          position: (0, import_vec8.vec2)(state.actualPosition),
          size: (0, import_vec8.vec2)(state.actualSize),
          hovered: state.hovered,
          selected: state.selected
        });
      } else {
        this.context.save();
        this.context.strokeStyle = state.hovered ? theme.nodeHoveredBorderColor : theme.nodeBorderColor;
        this.context.fillStyle = state.selected ? theme.nodeSelectedFillColor : theme.nodeFillColor;
        this.context.lineWidth = theme.nodeBorderWidth;
        roundedRect(
          this.context,
          state.actualPosition,
          state.actualSize,
          theme.nodeBorderRadius
        );
        this.context.fill();
        roundedRect(
          this.context,
          import_vec8.vec2.add(state.actualPosition, 1),
          import_vec8.vec2.sub(state.actualSize, 2),
          theme.nodeBorderRadius
        );
        this.context.stroke();
        this.context.restore();
      }
      if (node.deletable ?? true) {
        if (callbacks.drawDeleteButton) {
          callbacks.drawDeleteButton(this.context, {
            node,
            position: (0, import_vec8.vec2)(state.actualPosition),
            size: (0, import_vec8.vec2)(state.actualSize),
            hovered: state.deleteHovered
          });
        } else {
          this.context.save();
          this.context.strokeStyle = state.deleteHovered ? theme.deleteButtonHoveredColor : theme.deleteButtonColor;
          this.context.lineWidth = theme.deleteButtonLineWidth / DELETE_BUTTON_SIZE;
          this.context.translate(
            state.actualPosition.x + state.actualSize.x - DELETE_BUTTON_SIZE / 2,
            state.actualPosition.y + DELETE_BUTTON_SIZE / 2
          );
          this.context.scale(DELETE_BUTTON_SIZE, DELETE_BUTTON_SIZE);
          cross(this.context, (0, import_vec8.vec2)(), 0.4);
          this.context.restore();
        }
      }
      if (node.resizable ?? true) {
        if (callbacks.drawResizeHandle) {
          callbacks.drawResizeHandle(this.context, {
            node,
            position: (0, import_vec8.vec2)(state.actualPosition),
            size: (0, import_vec8.vec2)(state.actualSize),
            hovered: state.resizeHovered
          });
        } else {
          this.context.save();
          this.context.strokeStyle = state.resizeHovered ? theme.resizeHandleHoveredColor : theme.resizeHandleColor;
          this.context.lineWidth = theme.resizeHandleLineWidth / RESIZE_HANDLE_SIZE;
          this.context.translate(
            state.actualPosition.x + state.actualSize.x - RESIZE_HANDLE_SIZE,
            state.actualPosition.y + state.actualSize.y - RESIZE_HANDLE_SIZE
          );
          this.context.scale(RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
          line(this.context, (0, import_vec8.vec2)(0, 0.8), (0, import_vec8.vec2)(0.8, 0));
          line(this.context, (0, import_vec8.vec2)(0.3, 0.8), (0, import_vec8.vec2)(0.8, 0.3));
          line(this.context, (0, import_vec8.vec2)(0.6, 0.8), (0, import_vec8.vec2)(0.8, 0.6));
          this.context.restore();
        }
      }
      for (const port of node.ports) {
        const portState = this.ensurePortState(node.id, port.id, port.side);
        portState.position = this.resolvePortPosition(node, port);
        this.drawPort(node, port, portState);
      }
      if (callbacks.drawNodeContent) {
        callbacks.drawNodeContent(this.context, {
          node,
          position: (0, import_vec8.vec2)(state.actualPosition),
          size: (0, import_vec8.vec2)(state.actualSize),
          hovered: state.hovered,
          selected: state.selected
        });
      } else if (node.label) {
        this.context.save();
        this.context.fillStyle = theme.nodeLabelColor;
        this.context.font = theme.nodeLabelFont;
        this.context.textAlign = "left";
        this.context.textBaseline = "top";
        this.context.fillText(
          node.label,
          state.actualPosition.x + 5,
          state.actualPosition.y + 5
        );
        this.context.restore();
      }
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
      const direction = port && node ? this.ensurePortState(node.id, port.id, port.side).direction : (0, import_vec8.vec2)(0, -1);
      const isPreview = stateOverride !== void 0 && node === null;
      const { theme, callbacks } = this.options;
      if (callbacks.drawPort) {
        callbacks.drawPort(this.context, {
          node,
          port,
          position: (0, import_vec8.vec2)(state.position),
          direction,
          hovered: state.hovered,
          connectable: state.connectable,
          invalidReason: state.invalidReason,
          isPreview
        });
        return;
      }
      this.context.globalCompositeOperation = "source-over";
      this.context.save();
      this.context.globalCompositeOperation = "destination-out";
      this.context.fillStyle = "black";
      this.context.beginPath();
      this.context.arc(
        state.position.x,
        state.position.y,
        theme.portCutoutRadius,
        0,
        Math.PI * 2
      );
      this.context.fill();
      this.context.restore();
      const isInvalid = !state.connectable;
      this.context.save();
      this.context.strokeStyle = isInvalid ? theme.portInvalidBorderColor : state.hovered ? theme.portHoveredBorderColor : theme.portBorderColor;
      this.context.fillStyle = isInvalid ? theme.portInvalidFillColor : state.hovered ? theme.portHoveredFillColor : theme.portFillColor;
      this.context.lineWidth = theme.portBorderWidth;
      this.context.beginPath();
      this.context.arc(
        state.position.x,
        state.position.y,
        theme.portRadius,
        0,
        Math.PI * 2
      );
      this.context.fill();
      this.context.stroke();
      this.context.restore();
      if (state.hovered) {
        this.context.save();
        this.context.strokeStyle = isInvalid ? theme.portInvalidRingColor : theme.portHoverRingColor;
        this.context.lineWidth = theme.portHoverRingLineWidth;
        this.context.beginPath();
        this.context.arc(
          state.position.x,
          state.position.y,
          theme.portHoverRingRadius,
          0,
          Math.PI * 2
        );
        this.context.stroke();
        this.context.restore();
      }
    }
    drawEdgePreviewPort() {
      if (!this.creatingEdge) {
        return;
      }
      this.drawPort(null, null, {
        position: (0, import_vec8.vec2)(this.creatingEdge.pointer),
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
      const { theme, callbacks } = this.options;
      if (callbacks.drawEdgePreview) {
        callbacks.drawEdgePreview(this.context, {
          from,
          to,
          fromDirection,
          toDirection
        });
        return;
      }
      this.context.save();
      this.context.strokeStyle = theme.edgePreviewColor;
      this.context.lineWidth = theme.edgePreviewLineWidth;
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
      this.context.strokeStyle = theme.edgePreviewOutlineColor;
      this.context.lineWidth = theme.edgePreviewOutlineLineWidth;
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
    drawEdge(edge) {
      const aEndpoint = this.resolvePortEndpoint(edge.a);
      const bEndpoint = this.resolvePortEndpoint(edge.b);
      if (!aEndpoint || !bEndpoint) {
        return;
      }
      const a = import_vec8.vec2.add(
        aEndpoint.position,
        import_vec8.vec2.mul(aEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      const b = import_vec8.vec2.add(
        bEndpoint.position,
        import_vec8.vec2.mul(bEndpoint.direction, EDGE_CURVE_ENDPOINT_OFFSET)
      );
      const hovered = this.ensureEdgeState(edge).hovered;
      const { theme, callbacks } = this.options;
      if (callbacks.drawEdge) {
        callbacks.drawEdge(this.context, {
          edge,
          from: a,
          to: b,
          fromDirection: aEndpoint.direction,
          toDirection: bEndpoint.direction,
          hovered
        });
        return;
      }
      this.context.save();
      this.context.strokeStyle = hovered ? theme.edgeHoveredColor : theme.edgeColor;
      this.context.lineWidth = theme.edgeLineWidth;
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
        this.context.strokeStyle = theme.edgeHoverOutlineColor;
        this.context.lineWidth = theme.edgeHoverOutlineLineWidth;
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
          return import_vec8.vec2.add(
            state.actualPosition,
            (0, import_vec8.vec2)(
              (index + 1) / (nodePortsSameSide.length + 1) * state.actualSize.x,
              0
            )
          );
        case "right" /* Right */:
          return import_vec8.vec2.add(
            state.actualPosition,
            (0, import_vec8.vec2)(
              state.actualSize.x,
              (index + 1) / (nodePortsSameSide.length + 1) * state.actualSize.y
            )
          );
        case "bottom" /* Bottom */:
          return import_vec8.vec2.add(
            state.actualPosition,
            (0, import_vec8.vec2)(
              (index + 1) / (nodePortsSameSide.length + 1) * state.actualSize.x,
              state.actualSize.y
            )
          );
        case "left" /* Left */:
        default:
          return import_vec8.vec2.add(
            state.actualPosition,
            (0, import_vec8.vec2)(
              0,
              (index + 1) / (nodePortsSameSide.length + 1) * state.actualSize.y
            )
          );
      }
    }
    directionFromSide(side) {
      return {
        ["top" /* Top */]: (0, import_vec8.vec2)(0, -1),
        ["right" /* Right */]: (0, import_vec8.vec2)(1, 0),
        ["bottom" /* Bottom */]: (0, import_vec8.vec2)(0, 1),
        ["left" /* Left */]: (0, import_vec8.vec2)(-1, 0)
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
        dragOffset: (0, import_vec8.vec2)(),
        resizeOffset: (0, import_vec8.vec2)(),
        actualPosition: (0, import_vec8.vec2)(node.position),
        actualSize: (0, import_vec8.vec2)(node.size)
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
        position: (0, import_vec8.vec2)(),
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
          position: (0, import_vec8.vec2)(node.position),
          size: (0, import_vec8.vec2)(node.size),
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
