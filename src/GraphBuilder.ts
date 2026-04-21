import FrameTimer from '@basementuniverse/frame-timer';
import { vec2 } from '@basementuniverse/vec';

export default class GraphBuilder {
  public static screen: vec2;
  // public static ui: UI;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private frameTimer: FrameTimer;

  public constructor(canvas: HTMLElement | null) {
    if (canvas === null) {
      throw new Error('Canvas element not found');
    }
    if (canvas.tagName.toLowerCase() !== 'canvas') {
      throw new Error('Element is not a canvas');
    }
    this.canvas = canvas as HTMLCanvasElement;

    const context = this.canvas.getContext('2d');
    if (context === null) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.context = context;

    this.canvas.addEventListener('resize', this.resize.bind(this));
    this.resize();

    this.frameTimer = new FrameTimer();
  }

  private resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }
}
