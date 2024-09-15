import { TController, TOptions, TStream, TStreamFn, checkStream } from './types';

const fromEvent = (target: EventTarget, eventName: string): ReadableStream => {
  let _listener: EventListenerOrEventListenerObject;

  return new ReadableStream({
    start(controller) {
      _listener = (e) => controller.enqueue(e);
      target.addEventListener(eventName, _listener);
    },
    cancel() {
      target.removeEventListener(eventName, _listener);
    },
  });
};

const interval = (ms: number): ReadableStream => {
  let _intervalId: number;
  return new ReadableStream({
    start(controller) {
      _intervalId = setInterval(() => {
        controller.enqueue(Date.now());
      }, ms);
    },
    cancel() {
      clearInterval(_intervalId);
    },
  });
};

const map = (fn: Function): TransformStream => {
  return new TransformStream({
    // chunk is a part of data
    transform(chunk, controller) {
      controller.enqueue(fn.bind(fn)(chunk));
    },
  });
};

// TStream[] = array of events
const merge = (streams: TStream[]): ReadableStream => {
  return new ReadableStream({
    async start(controller) {
      for (const stream of streams) {
        // const checkStream = stream instanceof TransformStream ? stream.readable : stream;
        const reader = checkStream(stream);

        async function read(): Promise<void> {
          const { value, done } = await reader.read();
          if (done) return;
          // check if the stream has already ended
          if (!controller.desiredSize) return;

          controller.enqueue(value);

          return read();
        }

        read();
      }
    },
  });
};

const switchMap = (fn: TStreamFn, options: TOptions = { pairwise: true }): TransformStream => {
  return new TransformStream({
    transform(chunk, controller) {
      const stream = fn.bind(fn)(chunk);
      const reader = checkStream(stream);

      async function read(): Promise<void> {
        const { value, done } = await reader.read();
        if (done) return;

        const result = options.pairwise ? [chunk, value] : value;
        controller.enqueue(result);

        return read();
      }
      return read();
    },
  });
};

const takeUntil = (stream: TStream): TransformStream => {
  const readAndTerminate = async (stream: TStream, controller: TController) => {
    const reader = checkStream(stream);
    const { value } = await reader.read();

    controller.enqueue(value);
    controller.terminate();
  };

  return new TransformStream({
    start(controller) {
      readAndTerminate(stream, controller);
    },

    transform(chunk, controller) {
      controller.enqueue(chunk);
    },
  });
};

export { fromEvent, interval, map, merge, switchMap, takeUntil };
