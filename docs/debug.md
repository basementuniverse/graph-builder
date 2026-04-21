# Debug Component API Reference

TypeScript library for rendering debug information (values, charts, markers, borders) on HTML5 canvas. Designed for realtime applications with render loops (games, simulations).

## Core API

**Static class:** `Debug` (singleton pattern)

### Initialization

```typescript
Debug.initialise(options?: Partial<DebugOptions>): void
```
Must be called once before use. Throws error if already initialized.

### Rendering

```typescript
Debug.draw(context: CanvasRenderingContext2D, tags?: string[], clear?: boolean): void
```
- Renders all debug elements to canvas
- `tags`: Optional filter - only render elements with matching tags
- `clear`: Default `true` - auto-clears all elements after rendering (set `false` for multi-pass rendering)

### Clearing

```typescript
Debug.clear(clearCharts?: boolean): void
```
Manually clear values/markers/borders. Charts only cleared if `clearCharts=true`.

## Debug Elements

### Values (corner text)

```typescript
Debug.value(label: string, value: string | number, options?: Partial<DebugValue>): void
```
Displays labeled text value in screen corner (left/right aligned).

### Charts (bar charts)

```typescript
Debug.chart(label: string, value: number, options?: Partial<DebugChart>): void
Debug.removeChart(label: string): void
```
Displays small bar chart in screen corner. Values accumulate in buffer. Call `removeChart()` to delete.

### Markers (position indicators)

```typescript
Debug.marker(label: string, value: string | number, position: vec2, options?: Partial<DebugMarker>): void
```
Renders marker symbol (x/+/dot/image) at position with optional label/value text.

### Borders (bounds visualization)

```typescript
Debug.border(label: string, value: string | number, position: vec2, options?: Partial<DebugBorder>): void
```
Renders rectangle/circle border at position with optional label/value text.

## Type Definitions

### DebugOptions

```typescript
{
  margin: number;                    // Default: 10 - screen edge margin
  padding: number;                   // Default: 4 - text background padding
  font: string;                      // Default: '10pt Lucida Console, monospace'
  lineHeight: number;                // Default: 12
  lineMargin: number;                // Default: 0 - space between lines
  foregroundColour: string;          // Default: '#fff'
  backgroundColour: string;          // Default: '#333'
  defaultValue: DebugValue;          // Default options for values
  defaultChart: DebugChart;          // Default options for charts
  defaultMarker: DebugMarker;        // Default options for markers
  defaultBorder: DebugBorder;        // Default options for borders
}
```

### DebugValue

```typescript
{
  label?: string;
  value?: number | string;
  align: 'left' | 'right';           // Default: 'left' - screen corner
  showLabel: boolean;                // Default: true
  padding?: number;                  // Overrides global padding
  font?: string;                     // Overrides global font
  foregroundColour?: string;
  backgroundColour?: string;
  tags?: string[];                   // Filter tags
}
```

### DebugChart

```typescript
{
  label?: string;
  values: number[];                  // Auto-managed buffer
  valueBufferSize: number;           // Default: 60 - max values stored
  valueBufferStride: number;         // Default: 1 - averaging stride
  minValue: number;                  // Default: 0 - Y-axis min
  maxValue: number;                  // Default: 100 - Y-axis max
  barWidth: number;                  // Default: 2 - pixels per bar
  barColours?: {                     // Conditional bar colors
    offset: number;                  // Value threshold
    colour: string;
  }[];
  align: 'left' | 'right';           // Default: 'left'
  showLabel: boolean;                // Default: true
  padding?: number;
  font?: string;
  foregroundColour?: string;
  backgroundColour?: string;
  chartBackgroundColour?: string;    // Default: '#222' - chart area bg
  tags?: string[];
}
```

### DebugMarker

```typescript
{
  label?: string;
  value?: number | string;
  position?: vec2;                   // Required via parameter
  showLabel: boolean;                // Default: true
  showValue: boolean;                // Default: true
  showMarker: boolean;               // Default: true
  markerSize: number;                // Default: 6 - pixels
  markerLineWidth: number;           // Default: 2
  markerStyle: 'x' | '+' | '.';      // Default: 'x'
  markerColour: string;              // Default: '#ccc'
  markerImage?: HTMLImageElement | HTMLCanvasElement; // Custom marker
  space: 'world' | 'screen';         // Default: 'world'
  padding?: number;
  font?: string;
  labelOffset: vec2;                 // Default: vec2(10) - offset from position
  foregroundColour?: string;
  backgroundColour?: string;
  tags?: string[];
}
```

### DebugBorder

```typescript
{
  label?: string;
  value?: number | string;
  position?: vec2;                   // Required via parameter
  size?: vec2;                       // Required for 'rectangle' shape
  radius?: number;                   // Required for 'circle' shape
  showLabel: boolean;                // Default: true
  showValue: boolean;                // Default: true
  showBorder: boolean;               // Default: true
  borderWidth: number;               // Default: 1
  borderStyle: 'solid' | 'dashed' | 'dotted'; // Default: 'solid'
  borderShape: 'rectangle' | 'circle'; // Default: 'rectangle'
  borderColour: string;              // Default: '#ccc'
  borderDashSize: number;            // Default: 5 - for dashed style
  space: 'world' | 'screen';         // Default: 'world'
  padding?: number;
  font?: string;
  labelOffset: vec2;                 // Default: vec2(10)
  foregroundColour?: string;
  backgroundColour?: string;
  tags?: string[];
}
```

## Key Concepts

**World vs Screen Space:**
- `world`: Elements rendered in canvas transform space (affected by camera transforms)
- `screen`: Elements rendered in screen space (fixed position regardless of transforms)

**Tags:** Optional string arrays for filtering. Elements without tags render unconditionally. When `tags` passed to `draw()`, only elements with matching tag(s) render.

**Label System:** Elements use same `label` parameter as key. Repeated calls with same label update existing element. Charts accumulate values; others overwrite.

**Auto-clearing:** By default, `draw()` clears values/markers/borders after rendering (prevents accumulation). Charts persist until explicitly removed. Disable via `clear=false` parameter.

**vec2 Type:** From `@basementuniverse/vec` - 2D vector `{x: number, y: number}`. Use `vec2(x, y)` or `vec2(n)` (both x,y = n).

## Typical Usage Pattern

```typescript
// Setup (once)
Debug.initialise({ margin: 20, font: '12pt monospace' });

// Game loop
function update(dt: number) {
  // Update logic...
}

function render(context: CanvasRenderingContext2D) {
  // Clear canvas, draw game objects...

  // Add debug info
  Debug.value('FPS', Math.round(1000/dt));
  Debug.chart('Entities', entityCount);
  Debug.marker('Player', 'HP: 100', playerPos);
  Debug.border('Hitbox', '', enemyPos, { size: enemySize });

  // Render debug overlay (auto-clears for next frame)
  Debug.draw(context);
}
```

## Implementation Notes

- Singleton instance created on `initialise()`
- Internal storage: `Map<string, T>` for each element type
- Chart values auto-trimmed to `valueBufferSize`
- Border validation: rectangle requires `size`, circle requires `radius`
- Transforms: world-space elements rendered within save/restore, screen-space with identity transform
- Options merge hierarchy: defaults → instance defaults → existing element → call options → mandatory params
