<a href="https://www.npmjs.com/package/@hitomihiumi/lazy-animation"><img src="https://img.shields.io/npm/v/@hitomihiumi/lazy-animation.svg?maxAge=3600" alt="npm version" /></a>
<a href="https://www.npmjs.com/package/@hitomihiumi/lazy-animation"><img src="https://img.shields.io/npm/dt/@hitomihiumi/lazy-animation.svg?maxAge=3600" alt="npm downloads" /></a>

# Introduction

This extension for `@hitomihiumi/lazy-canvas` made for create gif animations.

## Documentation

You can find the documentation [here](https://docs.hitomihiumi.xyz/)

## Get Started

1. Install the module by using `npm i @hitomihiumi/lazy-animation`
2. Enjoy!

## Example

```ts
import { LazyCanvas, Font, EllipseImageLayer, EllipseLayer, TextLayer, Outline, CircleLayer } from "@hitomihiumi/lazy-canvas";
import { LazyAnimation, splitGifToFrames, Frame } from "@hitomihiumi/lazy-animation";
import { writeFileSync } from "fs";

(async () => {
    let font = new Font()
        .setFamily("JoeKubert")
        .setWeight("regular")
        .setPath("./assets/fonts/v_CCJoeKubert-Doubled_v1.3.ttf")

    console.log(`[${String(new Date).split(" ", 5)[4]}]`, 'Started...')
    let date = new Date();

    let bgarr = await splitGifToFrames('./assets/1.gif')

    console.log(`[${String(new Date).split(" ", 5)[4]}]`, 'Loaded', bgarr.length, 'frames', 'in', new Date().getTime() - date.getTime(), 'ms')

    let arr = [];

    for (let i = 0; i < bgarr.length; i++) {
        let frame = new Frame()
            .addLayers(
                new EllipseImageLayer()
                    .setX(300)
                    .setY(100)
                    .setWidth(600)
                    .setHeight(200)
                    .setRadius(50)
                    // @ts-ignore
                    .setImage(bgarr[i]), //https://static.zerochan.net/Otosora.full.3420604.jpg
                new EllipseLayer()
                    .setX(300)
                    .setY(100)
                    .setWidth(598)
                    .setHeight(198)
                    .setRadius(50)
                    .setColor('#000')
                    .setAlpha(0.4)
                    .setOutline(
                        new Outline()
                            .setColor('#fff')
                            .setStroke(2)
                            .setType('inner')
                    ),
                new EllipseImageLayer()
                    .setX(100)
                    .setY(100)
                    .setWidth(150)
                    .setHeight(150)
                    .setRadius(50)
                    .setImage('./assets/f332192b2090f437ca9f49c1002287b6.jpg') //https://i.pinimg.com/1200x/f3/32/19/f332192b2090f437ca9f49c1002287b6.jpg
                    .setOutline(
                        new Outline()
                            .setColor('#fff')
                            .setStroke(2)
                            .setType('center')
                    ),
                new EllipseLayer()
                    .setX(372.5)
                    .setY(142.5)
                    .setWidth(365)
                    .setHeight(35)
                    .setRadius(17.5)
                    .setColor('#fff'),
                new EllipseLayer()
                    .setX(192.5)
                    .setY(127.5)
                    .setWidth((360 / 100) * (i + 51))
                    .setHeight(30)
                    .setRadius(15)
                    .setColor('#ff8a8a')
                    .setCentering('legacy'),
                new CircleLayer()
                    .setX(160)
                    .setY(160)
                    .setRadius(20)
                    .setColor('#ff8a8a')
                    .setOutline(
                        new Outline()
                            .setColor('#fff')
                            .setStroke(1.5)
                            .setType('center')
                    ),
                new TextLayer()
                    .setX(200)
                    .setY(120)
                    .setText('LazyCanvas')
                    .setFont("JoeKubert")
                    .setFontSize(25)
                    .setColor('#fff')
                    .setAlign('left'),
                new TextLayer()
                    .setX(550)
                    .setY(105)
                    .setText(`${i + 1 + 50}/100`)
                    .setFont("JoeKubert")
                    .setFontSize(20)
                    .setColor('#fff')
                    .setAlign('right'),
                new TextLayer()
                    .setX(159)
                    .setY(172)
                    .setText('1')
                    .setFont("JoeKubert")
                    .setFontSize(33)
                    .setColor('#fff')
                    .setAlign('center')
            ).setWidth(600).setHeight(200);

        arr.push(frame);
    }

    console.log(`[${String(new Date).split(" ", 5)[4]}]`, 'Created', arr.length, 'frames', 'in', new Date().getTime() - date.getTime(), 'ms')

    let lc = new LazyCanvas({ plugins: [new LazyAnimation()] }) as LazyCanvas;
    lc.loadFonts(font).addFrames(...arr).setFrameRate(15).setLoop(true).setRGBFormat('rgb565').setTransparent(true).setMaxColors(256);

    lc.renderAnimation().then((gif) => {
        console.log(gif)
        writeFileSync("test.gif", gif as Buffer);
        console.log(`[${String(new Date).split(" ", 5)[4]}]`, 'Finished in', new Date().getTime() - date.getTime(), 'ms')
    });
})();
```

# Testing

```
OS: Windows 11 x64
Node.js: v17.8.0
Terminal: Windows Terminal
CPU: AMD Ryzen 9 5900HX @ 3.30 GHz
Memory: 32688MiB
```

## Settings

- 27 frames
- 600x200
- 15 fps
- Loop - on

Background:
![](https://i.imgur.com/x6PYXjW.gif)

## Transparecy - on

### rgb565
```shell
npm run test          

> @hitomihiumi/lazy-animation@1.0.0 test
> tsc ./test/test.ts && node ./test/test.js

[12:05:42] Started...
[12:05:43] Loaded 27 frames in 675 ms
[12:05:43] Created 27 frames in 686 ms
[12:05:49] Finished in 6892 ms
```

![](https://raw.githubusercontent.com/hitomihiumi/docsholder/master/gifs/rgb565on.gif)

### rgba444

```shell
npm run test   

> @hitomihiumi/lazy-animation@1.0.0 test
> tsc ./test/test.ts && node ./test/test.js

[12:09:34] Started...
[12:09:34] Loaded 27 frames in 674 ms
[12:09:34] Created 27 frames in 684 ms
[12:09:40] Finished in 6776 ms
```

![](https://raw.githubusercontent.com/hitomihiumi/docsholder/master/gifs/rgba444on.gif)

### rgba4444

```shell
npm run test             

> @hitomihiumi/lazy-animation@1.0.0 test
> tsc ./test/test.ts && node ./test/test.js

[12:10:21] Started...
[12:10:22] Loaded 27 frames in 747 ms
[12:10:22] Created 27 frames in 764 ms
[12:10:27] Finished in 6281 ms
```

![](https://raw.githubusercontent.com/hitomihiumi/docsholder/master/gifs/rgba4444on.gif)

## Transparecy - off

### rgb565

```shell
npm run test             

> @hitomihiumi/lazy-animation@1.0.0 test
> tsc ./test/test.ts && node ./test/test.js

[12:07:13] Started...
[12:07:14] Loaded 27 frames in 654 ms
[12:07:14] Created 27 frames in 665 ms
[12:07:20] Finished in 6800 ms
```

![](https://raw.githubusercontent.com/hitomihiumi/docsholder/master/gifs/rgb565off.gif)

### rgba444

```shell
npm run test   

> @hitomihiumi/lazy-animation@1.0.0 test
> tsc ./test/test.ts && node ./test/test.js

[12:08:39] Started...
[12:08:40] Loaded 27 frames in 666 ms
[12:08:40] Created 27 frames in 676 ms
[12:08:46] Finished in 6775 ms
```

![](https://raw.githubusercontent.com/hitomihiumi/docsholder/master/gifs/rgba444off.gif)

### rgba4444

```shell
npm run test             

> @hitomihiumi/lazy-animation@1.0.0 test
> tsc ./test/test.ts && node ./test/test.js

[12:10:43] Started...
[12:10:44] Loaded 27 frames in 730 ms
[12:10:44] Created 27 frames in 743 ms
[12:10:50] Finished in 6310 ms
```

![](https://raw.githubusercontent.com/hitomihiumi/docsholder/master/gifs/rgba4444off.gif)
