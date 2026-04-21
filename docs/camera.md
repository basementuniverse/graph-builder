# Camera Component API Reference (AI Documentation)

Package: `@basementuniverse/camera`
Type: 2D Camera for browser-based games with canvas rendering

## Class: Camera

Default export. Constructor signature:
```typescript
constructor(position: vec2, options?: Partial<CameraOptions>)
```
- `position`: Initial camera position (vec2 from @basementuniverse/vec)
- `options`: Optional configuration object

## CameraOptions Type

```typescript
type CameraOptions = {
  bounds?: CameraBounds;        // Optional movement restriction
  allowScale: boolean;           // Enable/disable zoom (default: true)
  minScale: number;              // Minimum zoom level (default: 0.5)
  maxScale: number;              // Maximum zoom level (default: 4)
  moveEaseAmount: number;        // Position easing 0-1, 0=instant (default: 0.1)
  scaleEaseAmount: number;       // Zoom easing 0-1, 0=instant (default: 0.1)
}
```

## CameraBounds Type

```typescript
type CameraBounds = {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
```

## Properties

### position: vec2
- Getter: Returns target position (easing destination)
- Setter: Sets target position with easing

### positionImmediate: vec2
- Setter only: Instantly sets position, no easing

### actualPosition: vec2
- Getter only: Current interpolated position after easing

### scale: number
- Getter: Returns target scale (zoom level)
- Setter: Sets target scale with easing, clamped to minScale/maxScale

### scaleImmediate: number
- Setter only: Instantly sets scale, no easing, clamped to minScale/maxScale

### actualScale: number
- Getter only: Current interpolated scale after easing

### bounds: CameraBounds
- Getter only: Current world-space viewport bounds based on actualPosition and actualScale
- Returns: `{ top: number, bottom: number, left: number, right: number }`

## Methods

### update(screen: vec2): void
- REQUIRED: Call every frame before rendering
- `screen`: Canvas dimensions { x: width, y: height }
- Updates internal state: applies easing, clamps to bounds if configured
- Must be called before `setTransforms()`

### setTransforms(context: CanvasRenderingContext2D): void
- Applies camera transformation to canvas context
- Call after `update()`, before rendering game objects
- Translates and scales context to camera view
- Use with context.save()/restore() pattern

### screenToWorld(position: vec2): vec2
- Converts screen/canvas coordinates to world coordinates
- `position`: Canvas pixel position
- Returns: World-space position

### worldToScreen(position: vec2): vec2
- Converts world coordinates to screen/canvas coordinates
- `position`: World-space position
- Returns: Canvas pixel position

### draw(context: CanvasRenderingContext2D, screen: vec2): void
- DEPRECATED: Combines `update()` and `setTransforms()`
- Provided for backwards compatibility only
- Prefer calling `update()` and `setTransforms()` separately

## Typical Usage Pattern

```typescript
import Camera from '@basementuniverse/camera';

// Initialize
const camera = new Camera({ x: 0, y: 0 }, {
  minScale: 0.5,
  maxScale: 4,
  moveEaseAmount: 0.1,
  scaleEaseAmount: 0.1,
  bounds: { top: -100, left: -100, bottom: 100, right: 100 }
});

// Every frame in update loop
camera.update({ x: canvas.width, y: canvas.height });

// Every frame in render loop
context.save();
camera.setTransforms(context);
// ... render game objects in world space ...
context.restore();

// Movement (with easing)
camera.position = { x: 100, y: 50 };

// Instant movement (no easing)
camera.positionImmediate = { x: 100, y: 50 };

// Zoom (with easing)
camera.scale = 2.0;

// Instant zoom (no easing)
camera.scaleImmediate = 2.0;

// Read current position/scale (after easing)
const currentPos = camera.actualPosition;
const currentZoom = camera.actualScale;

// Coordinate conversion
const worldPos = camera.screenToWorld({ x: mouseX, y: mouseY });
const screenPos = camera.worldToScreen({ x: entityX, y: entityY });

// Get visible area
const visible = camera.bounds; // { top, bottom, left, right } in world space
```

## Key Behaviors

1. Easing is applied to both position and scale changes unless using `*Immediate` setters
2. Scale is always clamped between minScale and maxScale
3. If bounds are configured, position is clamped to keep viewport within bounds
4. Bounds automatically expand if viewport (after scaling) exceeds configured bounds size
5. `update()` must be called every frame before `setTransforms()`
6. Camera centers on `actualPosition` after applying `actualScale`
7. All position/bounds use vec2 type from @basementuniverse/vec package
