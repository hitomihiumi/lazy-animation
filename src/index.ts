import { LazyCanvasPlugin } from "./Plugin";
import { Frame } from "./Frame";
import { splitGifToFrames } from "./utils";
import { LazyAnimationData, IFrame, RenderOutput, StringRenderOutput } from "./types";

import { LazyCanvas } from "@hitomihiumi/lazy-canvas";

export {
    LazyCanvasPlugin as LazyAnimation,
    Frame,
    LazyAnimationData,
    IFrame,
    RenderOutput,
    StringRenderOutput,
    splitGifToFrames
};

declare module "@hitomihiumi/lazy-canvas" {
    interface LazyCanvas {
        setFrameRate(frameRate: number): this;
        setLoop(loop: boolean): this;
        setTransparent(transparency: boolean): this;
        setRGBFormat(rgb: 'rgb565' | 'rgba4444' | 'rgba444'): this;
        setMaxColors(maxColors: number): this;
        addFrames(...frames: Frame[]): this;
        addFrame(frame: Frame): this;
        getFrames(): Frame[];
        getFrame(id: string | number): Frame | undefined ;
        removeFrame(id: string | number): this;
        clearFrames(): this;
        renderAnimation(output?: RenderOutput | StringRenderOutput): Promise<NodeJS.ArrayBufferView | undefined>;
    }
}
