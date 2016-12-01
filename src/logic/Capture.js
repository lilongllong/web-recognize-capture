import Circle from"./Circle";
import Rectangle from "./Rectangle";
import Vector from "./Vector";

export default class Capture {
    constructor()
    {
        this.watchElements = new Array();
    }

    addWatchElements(element)
    {
        this.watchElements.push(element);
    }

    getElementByCapture(location, range)
    {
        const result = this.watchElements.filter(item => {
            const judge = this.filterJudgement(item, location, range);
            if (judge)
            {
                item.addClass("selected");
            }
            else
            {
                item.removeClass("selected");
            }
            return judge;
        });
        return result;
    }

    filterJudgement(element, location, range)
    {
        console.log($(element));
        const y = $(element).offset().top;
        const x = $(element).offset().left;
        const width = $(element).width();
        const height = $(element).height();
        console.log(y,x,width,height);
        const end = {
            x: x + width,
            y: y + height,
        };

        return this.isJoined({x, y}, end, location, range);
    }

    isJoined(rStart, rEnd, cLoc, cRadius)
    {
        const circle = new Circle();
        circle.centerLocation = cLoc;
        circle.radius = cRadius;
        console.log(rStart, rEnd);
        const rect = new Rectangle();
        rect.startPoint = [ rStart.x, rStart.y ];
        rect.endPoint = [ rEnd.x, rEnd.y ];
        console.log(cLoc, "center");
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
}
