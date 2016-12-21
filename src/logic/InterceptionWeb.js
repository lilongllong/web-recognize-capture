import domToImage from "dom-to-image";
import fileSaver from "file-saver";


export default class InterceptionWeb {
    constructor()
    {
        console.log("alloyimage", AlloyImage);
        this.domToImage = domToImage;
    }

    domToImageLikePng(dom, range)
    {
        return new Promise((resolve, reject) => {

            this.domToImage.toPng(dom).then((dataUrl) => {
                const img = new Image();
                // const img = $(`<img src=${dataUrl}/>`)
                img.src = dataUrl;
                document.body.appendChild(img);
                resolve(this.clip(img, range));
            }).catch((error) => {
                reject(error);
            });
        });
    }

    domToImageLikeJpeg(dom, range)
    {
        return new Promise((resolve, reject) => {
            this.domToImage.toJpeg(dom, { quality: 0.95 }).then((dataUrl) => {
                const img = new Image();
                img.src = dataUrl;
                resolve(img);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    domToImageLikeSvg(dom, range)
    {
        return new Promise((resolve, reject) => {
            this.domToImage.toSvg(dom).then((dataUrl) => {
                const img = new Image();
                img.src = dataUrl;

                resolve(img);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    clip(dom, range)
    {
        if (!range || !range.startX || !range.startY || ! range.width || !range.height)
        {
            console.log("clip range params exists error");
        }
        const base64 = AlloyImage(dom).clip(parseInt(range.startX), parseInt(range.startY), parseInt(range.width), parseInt(range.height)).replace(dom).save("result.png", 0.9);
        return base64;
    }
}
