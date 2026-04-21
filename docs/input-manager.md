# INPUT-MANAGER API REFERENCE

## OVERVIEW
Singleton-based input manager for handling keyboard, mouse, and touch input in browser-based games/applications. Tracks current and previous frame state to detect presses, releases, and holds.

## TYPES

### InputOptions
```typescript
{
  element: Window | HTMLElement;       // Element to track mouse input on (default: window)
  mouse: boolean;                       // Enable mouse tracking (default: true)
  mouseWheel: boolean;                  // Enable wheel tracking (default: true)
  keyboard: boolean;                    // Enable keyboard tracking (default: true)
  preventContextMenu: boolean;          // Prevent right-click context menu (default: false)
}
```

### MouseButton (enum)
```typescript
enum MouseButton {
  Left = 0,
  Middle = 1,
  Right = 2
}
```

### MouseState
```typescript
{
  buttons: { [key in MouseButton]: boolean };
  position: vec2;                       // From @basementuniverse/vec
  wheel: number;                        // -1 (down), 0 (no scroll), 1 (up)
  hoveredElement?: HTMLElement | null;
}
```

### KeyboardState
```typescript
{ [key: string]: boolean }              // Keys are KeyboardEvent.code strings
```

## STATIC METHODS

### InputManager.initialise(options?: Partial<InputOptions>): void
Initialize singleton instance. Must be called before any other methods. Throws error if already initialized. Sets up event listeners for enabled input types.

### InputManager.update(): void
**CRITICAL: Call once per game loop frame.** Copies current state to previous state and resets transient values (mouseState.wheel = 0). Required for keyPressed(), keyReleased(), mousePressed(), mouseReleased() to function correctly.

### InputManager.keyDown(code?: string): boolean
- No args: Returns true if ANY key is currently down
- With code: Returns true if specific key is down
- code format: KeyboardEvent.code (e.g., "KeyW", "Space", "ArrowUp")

### InputManager.keyPressed(code?: string): boolean
- Detects key press THIS frame (down now, up previous frame)
- No args: Returns true if ANY key was pressed
- With code: Returns true if specific key was pressed

### InputManager.keyReleased(code?: string): boolean
- Detects key release THIS frame (up now, down previous frame)
- No args: Returns true if ANY key was released
- With code: Returns true if specific key was released

### InputManager.mouseDown(button?: MouseButton): boolean
- No args: Returns true if ANY button is currently down
- With button: Returns true if specific button is down
- Touch events treated as MouseButton.Left

### InputManager.mousePressed(button?: MouseButton): boolean
- Detects button press THIS frame (down now, up previous frame)
- No args: Returns true if ANY button was pressed
- With button: Returns true if specific button was pressed

### InputManager.mouseReleased(button?: MouseButton): boolean
- Detects button release THIS frame (up now, down previous frame)
- No args: Returns true if ANY button was released
- With button: Returns true if specific button was released

### InputManager.mouseWheelUp(): boolean
Returns true if mouse wheel scrolled up THIS frame. Automatically reset each frame by update().

### InputManager.mouseWheelDown(): boolean
Returns true if mouse wheel scrolled down THIS frame. Automatically reset each frame by update().

### InputManager.mousePosition (getter): vec2
Returns current mouse position in screen-space coordinates (offsetX, offsetY). For touch events, returns touch clientX/clientY.

### InputManager.hoveredElement (getter): HTMLElement | null
Returns currently hovered HTML element from mousemove event target, or null if none.

## USAGE PATTERN
```typescript
// 1. Initialize once at startup
InputManager.initialise({ element: canvas, preventContextMenu: true });

// 2. Call update() at start of each frame
function gameLoop() {
  InputManager.update();

  // 3. Query input state
  if (InputManager.keyDown("KeyW")) { /* move forward */ }
  if (InputManager.keyPressed("Space")) { /* jump */ }
  if (InputManager.mousePressed(MouseButton.Left)) { /* fire weapon */ }

  const mousePos = InputManager.mousePosition;
  if (InputManager.mouseWheelUp()) { /* zoom in */ }
}
```

## KEY CODES
Use standard KeyboardEvent.code values: "KeyA"-"KeyZ", "Digit0"-"Digit9", "Space", "Enter", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ControlLeft", etc.

## DEPENDENCIES
- @basementuniverse/vec (for vec2 type)
