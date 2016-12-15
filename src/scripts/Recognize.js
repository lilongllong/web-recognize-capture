import Capture from "../logic/Capture";
import PDollarRecognizer from "./PDollarRecognizer";
import Point from "./Point";
import PointCloud from "./PointCloud";
import Util from "./Util";

export default class Recognize
{
    constructor()
    {
        this._init();
        this.NumPointClouds = 4;
        this.NumPoints = 32;
        this.Origin = new Point(0,0,0);
        this.util = Util.getInstance();
        this.capture = new Capture();
    }

    _init()
    {
        this._$recognize = $(`<canvas id="myCanvas" class="web-recognize-Content">
                <span style="background-color:#ffff88;">The &lt;canvas&gt; element is not supported by this browser.</span>
            </canvas>`);
        this._canvas = this._$recognize[0];
        const waitListReady = setInterval(() => {
            if ($(".grid-container.row").length)
            {
                this.onLoadEvent();
                clearInterval(waitListReady);
            }
        }, 100);
        $(window).ready(this.onLoadEvent.bind(this));
        $(this._canvas).on("mouseup", (event) => { this.mouseUpEvent(event.offsetX, event.offsetY, event.button); });
        $(this._canvas).on("mousedown", (event) => { this.mouseDownEvent(event.offsetX, event.offsetY, event.button); });
        $(this._canvas).on("mousemove", (event) => { this.mouseMoveEvent(event.offsetX, event.offsetY, event.button); });
        $(this._canvas).on("contextmenu", () => false);
    }

    // canvasResize()
    // {
    //     this._canvas.width = window.innerWidth;
    //     this._canvas.height = window.innerHeight;
    //     this._rc = this.getCanvasRect(this._canvas);
    //     this._canvas.style.left = this._rc.x + "px";
    //     this._canvas.style.top = this._rc.y + "px";
    // }

    onLoadEvent()
    {
        $(".grid-container.row").append(this._$recognize[0]);
        this.capture.watchDOMBySelector("default");
        this._points = new Array(); // point array for current stroke
        this._strokeID = 0;
        this._r = new PDollarRecognizer();
        this._canvas.width = $(".grid-container.row").width();
        this._canvas.height = $(".grid-container.row").height();
        this._rc = this.getCanvasRect(this._canvas);

        // this.canvasResize();
        this._g = this._canvas.getContext('2d');
        this._g.lineWidth = 3;
        this._g.font = "16px Gentilis";
        this.drawText("please input: ", this._g);
        this._isDown = false;
    }

    getCanvasRect(canvas)
    {
        const w = canvas.width;
        const h = canvas.height;
        const cx = $(document).scrollLeft();
        const cy = $(document).scrollTop();
        return {x: cx, y: cy, width: w, height: h};
    }

    getScrollY()
    {
        let scrollY = 0;
        if (typeof(document.body.parentElement) != 'undefined')
        {
            scrollY = document.body.parentElement.scrollTop; // IE
        }
        else if (typeof(window.pageYOffset) != 'undefined')
        {
            scrollY = window.pageYOffset; // FF
        }
        return scrollY;
    }

    mouseDownEvent(x, y, button)
    {
        document.onselectstart = function() { return false; } // disable drag-select
        document.onmousedown = function() { return false; } // disable drag-select
        if (button <= 1)
        {
            this._isDown = true;
            // x -= this._rc.x;
            // y -= this._rc.y - this.getScrollY();
            if (this._strokeID == 0) // starting a new gesture
            {
                this._points.length = 0;
                this._g.clearRect(0, 0, this._rc.width, this._rc.height);
            }
            this._points[this._points.length] = new Point(x, y, ++this._strokeID);
            this.drawText("Recording stroke #" + this._strokeID + "...");
            const clr = "rgb(" + this.util.rand(0,200) + "," + this.util.rand(0,200) + "," + this.util.rand(0,200) + ")";
            this._g.strokeStyle = clr;
            this._g.fillStyle = clr;
            this._g.fillRect(x - 4, y - 3, 9, 9);
        }
        else if (button == 2)
        {
            this.drawText("Recognizing gesture...");
        }
    }

    mouseMoveEvent(x, y, button)
    {
        if (this._isDown)
        {
            // x -= this._rc.x;
            // y -= this._rc.y - this.getScrollY();
            this._points[this._points.length] = new Point(x, y, this._strokeID); // append
            this.drawConnectedPoint(this._points.length - 2, this._points.length - 1);
        }
    }

    mouseUpEvent(x, y, button)
    {
        document.onselectstart = function() { return true; } // enable drag-select
        document.onmousedown = function() { return true; } // enable drag-select
        if (button <= 1)
        {
            if (this._isDown)
            {
                this._isDown = false;
                this.drawText("Stroke #" + this._strokeID + " recorded.");
                // let result = this._r.Recognize(this._points);
                // console.log(result.Score, "正确率");
                // if (result.Score > 0.001)
                // {
                //     this.drawText("Result: " + result.Name + " (" + this.util.round(result.Score,3) + ").");
                // }
            }
        }
        else if (button == 2) // segmentation with right-click
        {
            if (this._points.length >= 10)
            {
                let results = this._r.Recognize(this._points);
                results.map(result => {
                    this.drawText("Result: " + result.Name + " (" + this.util.round(result.Score,2) + ").");
                    console.log("Result: " + result.Name + " (" + this.util.round(result.Score,2) + ").");
                    if (result.Score !== 0)
                    {
                        const centroid = new PointCloud({ name: "test", points: result.path }).Centroid();
                        const selectedDom = this.capture.getElementByCapture({ x: centroid.X, y: centroid.Y}, this.util.getRadius(result.path));
                        console.log(selectedDom);        
                    }
                });
                let gesObj = new Object();
                gesObj.action = "gesture";
                gesObj.points = this._points;
            }
            else
            {
                this.drawText("Too little input made. Please try again.");
            }
            this._strokeID = 0; // signal to begin new gesture on next mouse-down
        }
    }

    drawConnectedPoint(from, to)
    {
        this._g.beginPath();
        this._g.moveTo(this._points[from].X, this._points[from].Y);
        this._g.lineTo(this._points[to].X, this._points[to].Y);
        this._g.closePath();
        this._g.stroke();
    }

    drawText(str, $_g = this._g)
    {
        $_g.clearRect(0, 0, this._rc.width, 40);
        $_g.fillStyle = "rgb(255,255,136)";
        $_g.fillRect(0, 0, this._rc.width, 40);
        $_g.font = "40px Arial";
        $_g.fillStyle = "rgb(0,0,255)";
        $_g.fillText(str, 1, 35);
    }

    //
    // Multistroke Adding and Clearing
    //
    onClickAddExisting()
    {
        if (this._points.length >= 10)
        {
            var pointclouds = document.getElementById('pointclouds');
            var name = pointclouds[pointclouds.selectedIndex].value;
            var num = this._r.AddGesture(name, this._points);
            this.drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
            this._strokeID = 0; // signal to begin new gesture on next mouse-down
        }
    }

    onClickAddCustom()
    {
        var name = document.getElementById('custom').value;
        if (this._points.length >= 10 && name.length > 0)
        {
            var num = this._r.AddGesture(name, this._points);
            drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
            this._strokeID = 0; // signal to begin new gesture on next mouse-down
            var custgesObj = new Object();
            custgesObj.action = "custGesture";
            custgesObj.points = this._points;
            custgesObj.name = name;
            // ws.send(JSON.stringify(custgesObj));
        }
    }

    onClickCustom()
    {
        document.getElementById('custom').select();
    }
}
