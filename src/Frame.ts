import { IFrame } from "./types";
import {LazyCanvasLayer, Path2DLayer, LazyError, LazyCanvas} from "@hitomihiumi/lazy-canvas";

export class Frame {
    public data: IFrame;

    constructor(data?: IFrame) {
        this.data = data || {} as IFrame;
        this.data.layers = this.data.layers || [];
    }

    public setWidth(width: number): Frame {
        this.data.width = width;
        return this;
    }

    public setHeight(height: number): Frame {
        this.data.height = height;
        return this;
    }

    public addLayers(...layers: Partial<LazyCanvasLayer | Path2DLayer>[]): Frame {
        for (const layer of layers) {
            this.data.layers.push(layer as LazyCanvasLayer);
        }
        return this;
    }

    public getLayer(id: number | string): LazyCanvasLayer | Path2DLayer | undefined {
        if (!id) throw new LazyError("No id provided");
        let layer;
        if (typeof id === "string") {
            layer = this.data.layers.find(l => l.toJSON().id === id);
            if (!layer) return undefined;
        } else {
            layer = this.data.layers[id];
        }
        return layer;
    }

    public removeLayer(id: number | string): Frame {
        if (!id) throw new LazyError("No id provided");
        let index;
        if (typeof id === "string") {
            index = this.data.layers.findIndex(l => l.toJSON().id === id);
            if (index === -1) return this;
        } else {
            index = id;
        }
        this.data.layers.splice(index, 1);
        return this;
    }

    public clearLayers(): Frame {
        this.data.layers = [];
        return this;
    }

    public setID(id: string | number): Frame {
        this.data.id = id;
        return this;
    }

    public toJSON(): IFrame {
        return this.data;
    }

    public static from(data: IFrame): Frame {
        return new Frame(data);
    }

    public async render(): Promise<NodeJS.ArrayBufferView | undefined> {
        return new Promise(async (resolve, reject) => {
            if (this.data.width === undefined || this.data.height === undefined) {
                throw new LazyError("Frame width or height is not defined");
            }
            if (this.data.layers.length === 0) {
                throw new LazyError("Frame layers are empty");
            }
            let lc = new LazyCanvas()
                .createNewCanvas(this.data.width, this.data.height)
                .addLayers(
                    ...this.data.layers
                )
            // @ts-ignore
            return await lc.renderImage();
        });
    }
}
