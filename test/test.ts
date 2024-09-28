import { LazyCanvas, Font, EllipseImageLayer, EllipseLayer, TextLayer, Outline, CircleLayer} from "@hitomihiumi/lazy-canvas";
import { LazyAnimation, splitGifToFrames, Frame } from "../dist";
import {writeFileSync} from "fs";

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
    lc.loadFonts(font).addFrames(...arr).setFrameRate(15).setLoop(true).setRGBFormat('rgba4444').setTransparent(false).setMaxColors(256);

    lc.renderAnimation().then((gif) => {
        //console.log(gif)
        writeFileSync("test.gif", gif as Buffer);
        console.log(`[${String(new Date).split(" ", 5)[4]}]`, 'Finished in', new Date().getTime() - date.getTime(), 'ms')
    });
})();
