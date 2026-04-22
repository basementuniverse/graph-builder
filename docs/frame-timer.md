# Game Component: Frame Timer

Calculate FPS and elapsed time for browser games.

```ts
import FrameTimer from '@basementuniverse/frame-timer';

const timer = new FrameTimer({
  minFPS: 30, // optional, defaults to 30 FPS
});

function gameLoop() {
  timer.update();
  console.log(`Elapsed time: ${timer.elapsedTime}s, FPS: ${timer.frameRate}`);
  requestAnimationFrame(gameLoop);
}

gameLoop();
```
