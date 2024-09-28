import { LazyCanvasPlugin as Plugin, LazyCanvas, LazyError, LazyLog, Font, LazyCanvasFont } from "@hitomihiumi/lazy-canvas";
// @ts-ignore
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { IFrame, LazyAnimationData, RenderOutput, StringRenderOutput } from "./types";
import { Frame } from "./Frame";

export class LazyCanvasPlugin extends Plugin {
    private lazyCanvas: LazyCanvas | null;
    public data: LazyAnimationData;

    constructor() {
        super();
        this.data = {} as LazyAnimationData;
        this.lazyCanvas = null;
        this.data.frames = [];
    }

    public onload(lazyCanvas: LazyCanvas): void {
        this.lazyCanvas = lazyCanvas;
        Object.assign(lazyCanvas, {
            setFrameRate: this.setFrameRate.bind(this),
            setLoop: this.setLoop.bind(this),
            setTransparent: this.setTransparent.bind(this),
            setRGBFormat: this.setRGBFormat.bind(this),
            setMaxColors: this.setMaxColors.bind(this),
            addFrames: this.addFrames.bind(this),
            addFrame: this.addFrame.bind(this),
            getFrames: this.getFrames.bind(this),
            getFrame: this.getFrame.bind(this),
            removeFrame: this.removeFrame.bind(this),
            clearFrames: this.clearFrames.bind(this),
            renderAnimation: this.renderAnimation.bind(this),
        });
    }

    public unload(): void {
        this.lazyCanvas = null;

        console.log("Plugin unloaded!");
    }

    public setFrameRate(frameRate: number): any {
        this.data.frameRate = frameRate;
        return this;
    }

    public setLoop(loop: boolean): any {
        this.data.loop = loop;
        return this;
    }

    public setTransparent(transparency: boolean): any {
        this.data.transparency = transparency;
        return this;
    }

    public setRGBFormat(rgb: 'rgb565' | 'rgba4444' | 'rgba444'): any {
        this.data.rgb = rgb;
        return this;
    }

    public setMaxColors(maxColors: number): any {
        this.data.maxColors = maxColors;
        return this;
    }

    public addFrames(...frames: Frame[]): any {
        if (this.lazyCanvas === null) {
            return;
        }
        for (const frame of frames) {
            if (frame.data.id === undefined) {
                frame.data.id = `Frame-${Math.random().toString(36).substring(2, 15)}`
            }
            this.data.frames.push(frame);
        }
        return this;
    }

    public addFrame(frame: Frame): any {
        if (this.lazyCanvas === null) {
            return;
        }
        if (frame.data.id === undefined) {
            frame.data.id = `Frame-${Math.random().toString(36).substring(2, 15)}`
        }
        this.data.frames.push(frame);
        return this;
    }

    public getFrames(): Frame[] {
        return this.data.frames;
    }

    public getFrame(id: string | number): Frame | undefined {
        if (!id) throw new LazyError("No id provided");
        let frame;
        if (typeof id === "string") {
            frame = this.data.frames.find(f => f.data.id === id);
            if (!frame) return undefined;
        } else {
            frame = this.data.frames[id];
        }
        return frame;
    }

    public removeFrame(id: string | number): any {
        if (!id) throw new LazyError("No id provided");
        let index;
        if (typeof id === "string") {
            index = this.data.frames.findIndex(f => f.data.id === id);
            if (index === -1) return this;
        } else {
            index = id;
        }
        this.data.frames.splice(index, 1);
        return this;
    }

    public clearFrames(): any {
        this.data.frames = [];
        return this;
    }

    public toJSON(): LazyAnimationData {
        return this.data;
    }

    public static from(data: LazyAnimationData): LazyCanvasPlugin {
        const plugin = new LazyCanvasPlugin();
        plugin.data = data;
        return plugin;
    }

    public static fromJSON(data: LazyAnimationData): LazyCanvasPlugin {
        return LazyCanvasPlugin.from(data);
    }

    public async renderAnimation(output?: RenderOutput | StringRenderOutput): Promise<NodeJS.ArrayBufferView | undefined> {
        if (this.data.frames.length === 0) {
            throw new LazyError("No frames added to the animation");
        }
        const encoder = new GIFEncoder();
        for (const frame of this.data.frames) {
            if (frame.data.width === undefined || frame.data.height === undefined) {
                throw new LazyError("Frame width or height is not defined");
            }
            if (frame.data.layers.length === 0) {
                throw new LazyError("Frame layers are empty");
            }
            let lc = new LazyCanvas()
            if (this.lazyCanvas?.data.fonts && this.lazyCanvas?.data.fonts.length > 0) {
                lc.loadFonts(...this.lazyCanvas?.data.fonts.map((font: LazyCanvasFont) => (new Font().data = font) as unknown as Font))
            }
            lc.createNewCanvas(frame.data.width, frame.data.height).addLayers(
                ...frame.data.layers
            );
            const canvas = await lc.renderImage('ctx');
            //@ts-ignore
            const {data, width, height} = canvas.getImageData(0, 0, frame.data.width, frame.data.height);
            const palette = quantize(data, this.data.maxColors, {format: this.data.rgb});
            const index = applyPalette(data, palette, this.data.rgb);
            encoder.writeFrame(index, width, height, {
                palette,
                transparent: this.data.transparency,
                delay: 1000 / this.data.frameRate,
                loop: this.data.loop
            });
        }
        encoder.finish();
        return encoder.bytesView();
    }

}
