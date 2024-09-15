export type TStream = ReadableStream | TransformStream;
export type TStreamFn = (e: any) => ReadableStream | TransformStream;
export type TOptions = { pairwise: boolean };
export type TController = TransformStreamDefaultController<any>;

export interface IPosition {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export interface IStore {
  db: IPosition[];
  get: () => IPosition[];
  set: (item: IPosition) => void;
  clear: () => void;
}

export const checkStream = (stream: TStream) => {
  const check = stream instanceof TransformStream ? stream.readable : stream;
  return check.getReader();
};
