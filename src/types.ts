import { LazyCanvasLayer, Path2DLayer, Font } from "@hitomihiumi/lazy-canvas";
import { Frame } from "./Frame";

export interface IFrame {
    width: number;
    height: number;
    id: string | number;
    layers: Array<LazyCanvasLayer | Path2DLayer>;
}

export interface LazyAnimationData {
    frames: Frame[];
    frameRate: number;
    loop: boolean;
    transparency: boolean;
    maxColors: number;
    rgb: 'rgb565' | 'rgba4444' | 'rgba444';
}

export enum RenderOutput {
    GIF = "gif",
    WEBP = "webp",
    FRAME = "frame"
}

export type StringRenderOutput = "gif" | "webp" | "frame";
