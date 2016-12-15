import Circle from"./Circle";
import Rectangle from "./Rectangle";
import Vector from "./Vector";
import config from "../config.json";

export default class Capture {
    constructor()
    {
        this.watchElements = new Array();
    }
// algnrith advance
    addWatchElements(rootElement, element)
    {
        this.watchElements.push({
            rootElement,
            element
        });
    }

    watchDOMBySelector(selectors = "")
    {
        selectors = ".grid-container > .grid-item";
        $(selectors).each((index, item) => {
            this.addWatchElements(item, $(item).find(".grid-panel > .img-box > .img-a")[0]);
            this.addWatchElements(item, $(item).find(".grid-panel > .info-cont > .title-row > .product-title")[0]);
        });
    }

    getElementByCapture(location, range)
    {
        const result = this.watchElements.filter(item => {
            const judge = this.filterJudgement(item.element, location, range);
            console.log("judge", judge);
            if (judge)
            {

                // $(item.rootElement).addClass("selected");
            }
            else
            {
                // $(item.rootElement).removeClass("selected");
            }
            return judge;
        });
        return result;
    }

    filterJudgement(element, location, range)
    {
        const rect = this.getPositionOfElement(element);
        const start = {
            x: rect.left,
            y: rect.top
        };
        const end = {
            x: rect.right,
            y: rect.bottom
        };

        return this.isJoined(start, end, location, range);
    }

    isJoined(rStart, rEnd, cLoc, cRadius)
    {
        // console.log(rStart, rEnd, cLoc, cRadius);
        const circle = new Circle();
        circle.centerLocation = cLoc;
        circle.radius = cRadius;
        const rect = new Rectangle();
        rect.startPoint = [ rStart.x, rStart.y ];
        rect.endPoint = [ rEnd.x, rEnd.y ];
        const vJoin = rect.getVectorFrom(cLoc).abs();
        const vNear = rect.getNearestDiagonalVector(cLoc).abs();
        const vResult = vJoin.minus(vNear);

        let u = 0;
        // circle cetroid in rect
        if (vResult.vector[0] < 0 && vResult.vector[1] < 0)
        {
            return true;
        }
        // 靠近 方框
        if (Math.abs(vResult.vector[0]) < cRadius && Math.abs(vResult.vector[1]) < cRadius)
        {
            u = Math.min(Math.max(vResult.vector[0], 0), Math.max(vResult.vector[1], 0));
            return u <= cRadius;
        }

        // 远离方框
        if (vResult.vector[0] > 0 || vResult.vector[1] > 0)
        {
            u = vResult.distance();
            return u <= cRadius;
        }
        return false;
    }

    getPositionOfElement(element)
    {
        let x = 0;
        let y = 0;
        const width = element.offsetWidth;
        const height = element.offsetHeight;

        while( element && !isNaN( element.offsetLeft ) && !isNaN( element.offsetTop ) ) {
            x += element.offsetLeft - element.scrollLeft;
            y += element.offsetTop - element.scrollTop;
            element = element.offsetParent;
        }
        return {
            left: x,
            right: x + width,
            top: y,
            bottom: y + height
        };
    }
}
