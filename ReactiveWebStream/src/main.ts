import { fromEvent, map, merge, switchMap, takeUntil } from './operators';
import { IPosition, IStore } from './types';
import './style.css';

const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;

const mouseEvents = {
  down: 'mousedown',
  move: 'mousemove',
  up: 'mouseup',
  leave: 'mouseleave',

  touchstart: 'touchstart',
  touchmove: 'touchmove',
  touchend: 'touchend',

  click: 'click',
};

const getMousePosition = (canvasDom: HTMLCanvasElement, eventValue: MouseEvent) => {
  const rect = canvasDom.getBoundingClientRect();
  return {
    x: eventValue.clientX - rect.left,
    y: eventValue.clientY - rect.top,
  };
};

const resetCanvas = (width?: number, height?: number) => {
  const parent = canvasEl.parentElement as HTMLElement;
  canvasEl.width = width || parent.clientWidth * 0.9;
  canvasEl.height = height || parent.clientHeight * 1.5;

  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 4;
};

resetCanvas();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const store: IStore = {
  db: [],
  get() {
    return this.db;
  },
  set(item: IPosition) {
    this.db.unshift(item);
  },
  clear() {
    this.db.length = 0;
  },
};

const touchToMouse = (touchEvent: TouchEvent, mouseEvent: string) => {
  const [touch] = touchEvent.touches.length ? touchEvent.touches : touchEvent.changedTouches;
  // draw in screen
  return new MouseEvent(mouseEvent, {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
};

merge([
  fromEvent(canvasEl, mouseEvents.down),
  fromEvent(canvasEl, mouseEvents.touchstart).pipeThrough(
    map((e: TouchEvent) => touchToMouse(e, mouseEvents.touchstart)),
  ),
])
  .pipeThrough(
    switchMap(() => {
      // debugger
      return merge([
        fromEvent(canvasEl, mouseEvents.move),
        fromEvent(canvasEl, mouseEvents.touchmove).pipeThrough(
          map((e: TouchEvent) => touchToMouse(e, mouseEvents.touchstart)),
        ),
      ]).pipeThrough(
        takeUntil(
          merge([
            fromEvent(canvasEl, mouseEvents.up),
            fromEvent(canvasEl, mouseEvents.leave),
            fromEvent(canvasEl, mouseEvents.touchend).pipeThrough(
              map((e: TouchEvent) => touchToMouse(e, mouseEvents.up)),
            ),
          ]),
        ),
      );
    }),
    //
  )
  .pipeThrough(
    map(function ([mouseDown, mouseMove]: Array<MouseEvent>) {
      // @ts-ignore
      this._lastPosition = this._lastPosition ?? mouseDown;
      // @ts-ignore
      const [from, to] = [this._lastPosition, mouseMove].map((item) =>
        getMousePosition(canvasEl, item),
      );
      // @ts-ignore
      this._lastPosition = mouseMove.type === mouseEvents.up ? null : mouseMove;

      return { from, to };
    }),
  )
  .pipeTo(
    new WritableStream({
      write({ from, to }: IPosition) {
        debugger;
        store.set({ from, to });
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      },
    }),
  );

// CLEAR
fromEvent(clearBtn, mouseEvents.click).pipeTo(
  new WritableStream({
    async write() {
      ctx.beginPath();
      ctx.strokeStyle = 'white';

      for (const { from, to } of store.get()) {
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        await sleep(5);
      }

      resetCanvas(canvasEl.width, canvasEl.height);
      store.clear();
    },
  }),
);
