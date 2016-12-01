window.onresize = canvasResize;
$(window).scroll((event) => {
    canvasResize()
});
function canvasResize()
{
    const canvas = document.getElementById("myCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    _rc = getCanvasRect(canvas);
}

var _isDown, _points, _strokeID, _r, _g,  _rc; // global variables
const capture = new Capture();

$(document).ready(() => {
    $(".item-view").children().each((index, item)=> {
        capture.addWatchElements($(item));
    });
});

function onLoadEvent()
{
    _points = new Array(); // point array for current stroke
    _strokeID = 0;
    _r = new PDollarRecognizer();
    canvasResize();
    var canvas = document.getElementById('myCanvas');
    _g = canvas.getContext('2d');
    _g.lineWidth = 3;
    _g.font = "16px Gentilis";
    drawText("please input: ", _g);
    _isDown = false;
}
function getCanvasRect(canvas)
{
    var w = canvas.width;
    var h = canvas.height;
    var cx = $(document).scrollLeft();
    var cy = $(document).scrollTop();
    return {x: cx, y: cy, width: w, height: h};
}
function getScrollY()
{
    var scrollY = 0;
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
//
// Mouse Events
//
function mouseDownEvent(x, y, button)
{
    document.onselectstart = function() { return false; } // disable drag-select
    document.onmousedown = function() { return false; } // disable drag-select
    if (button <= 1)
    {
        _isDown = true;
        x -= _rc.x;
        y -= _rc.y - getScrollY();
        if (_strokeID == 0) // starting a new gesture
        {
            _points.length = 0;
            _g.clearRect(0, 0, _rc.width, _rc.height);
        }
        _points[_points.length] = new Point(x, y, ++_strokeID);
        drawText("Recording stroke #" + _strokeID + "...");
        var clr = "rgb(" + rand(0,200) + "," + rand(0,200) + "," + rand(0,200) + ")";
        _g.strokeStyle = clr;
        _g.fillStyle = clr;
        _g.fillRect(x - 4, y - 3, 9, 9);
    }
    else if (button == 2)
    {
        drawText("Recognizing gesture...");
    }
}
function mouseMoveEvent(x, y, button)
{
    if (_isDown)
    {
        x -= _rc.x;
        y -= _rc.y - getScrollY();
        _points[_points.length] = new Point(x, y, _strokeID); // append
        drawConnectedPoint(_points.length - 2, _points.length - 1);
    }
}
function mouseUpEvent(x, y, button)
{
    document.onselectstart = function() { return true; } // enable drag-select
    document.onmousedown = function() { return true; } // enable drag-select
    if (button <= 1)
    {
        if (_isDown)
        {
            _isDown = false;
            drawText("Stroke #" + _strokeID + " recorded.");
        }
    }
    else if (button == 2) // segmentation with right-click
    {
        if (_points.length >= 10)
        {
            var result = _r.Recognize(_points);
            drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
            const centroid = Centroid(_points);
            console.log(centroid);
            capture.getElementByCapture({ x: centroid.X, y: centroid.Y}, getRadius(_points));
            var gesObj = new Object();
            gesObj.action = "gesture";
            gesObj.points = _points;
            // ws.send(JSON.stringify(gesObj));
        }
        else
        {
            drawText("Too little input made. Please try again.");
        }
        _strokeID = 0; // signal to begin new gesture on next mouse-down
    }
}
function drawConnectedPoint(from, to)
{
    _g.beginPath();
    _g.moveTo(_points[from].X, _points[from].Y);
    _g.lineTo(_points[to].X, _points[to].Y);
    _g.closePath();
    _g.stroke();
}

function drawText(str, $_g = _g)
{
    $_g.clearRect(0, 0, _rc.width, 20);
    $_g.fillStyle = "rgb(255,255,136)";
    $_g.fillRect(0, 0, _rc.width, 20);
    $_g.fillStyle = "rgb(0,0,255)";
    $_g.fillText(str, 1, 14);
}



function rand(low, high)
{
    return Math.floor((high - low + 1) * Math.random()) + low;
}
function round(n, d) // round 'n' to 'd' decimals
{
    d = Math.pow(10, d);
    return Math.round(n * d) / d
}
//
// Multistroke Adding and Clearing
//
function onClickAddExisting()
{
    if (_points.length >= 10)
    {
        var pointclouds = document.getElementById('pointclouds');
        var name = pointclouds[pointclouds.selectedIndex].value;
        var num = _r.AddGesture(name, _points);
        drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
        _strokeID = 0; // signal to begin new gesture on next mouse-down
    }
}
function onClickAddCustom()
{
    var name = document.getElementById('custom').value;
    if (_points.length >= 10 && name.length > 0)
    {
        var num = _r.AddGesture(name, _points);
        drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
        _strokeID = 0; // signal to begin new gesture on next mouse-down
        var custgesObj = new Object();
        custgesObj.action = "custGesture";
        custgesObj.points = _points;
        custgesObj.name = name;
        // ws.send(JSON.stringify(custgesObj));
    }
}
function onClickCustom()
{
    document.getElementById('custom').select();
}
function onClickDelete()
{
    var num = _r.DeleteUserGestures(); // deletes any user-defined templates
    alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
    _strokeID = 0; // signal to begin new gesture on next mouse-down
}
function onClickClearStrokes()
{
    _points.length = 0;
    _strokeID = 0;
    _g.clearRect(0, 0, _rc.width, _rc.height);
    drawText("Canvas cleared.");
}

//
// Point class
//
function Point(x, y, id) // constructor
{
	this.X = x;
	this.Y = y;
	this.ID = id; // stroke ID to which this point belongs (1,2,...)
}
//
// PointCloud class: a point-cloud template
//
function PointCloud(name, points) // constructor
{
	this.Name = name;
    this.originPoints = points.slice(0);
	this.Points = Resample(points, NumPoints);
	this.Points = Scale(this.Points);
	this.Points = TranslateTo(this.Points, Origin);
}
//
// Result class
//
function Result(name, score) // constructor
{
	this.Name = name;
	this.Score = score;
}
//
// PDollarRecognizer class constants
//
var NumPointClouds = 4;
var NumPoints = 32;
var Origin = new Point(0,0,0);
//
// PDollarRecognizer class
//
function PDollarRecognizer() // constructor
{
	//
	// one predefined point-cloud for each gesture
	//
	this.PointClouds = new Array(NumPointClouds);
    this.PointClouds[0] = new PointCloud("X", new Array(
        new Point(0,0,1),new Point(100,100,1),
        new Point(200,200,1),new Point(200,0,2),
        new Point(100,100,2),new Point(0,200,2)
    ));
    const pai = 100 * Math.sqrt(2);
    this.PointClouds[1] = new PointCloud("circle", new Array(
        new Point(0,100,1),new Point(100 - pai, 100 + pai,1),
        new Point(100,200,1),new Point(100 + pai, 100 + pai, 1),
        new Point(200,100,1),new Point(100 + pai, 100 - pai,1),
        new Point(100,0,1),new Point(100 - pai, 100 - pai, 1)
    ));
    this.PointClouds[2] = new PointCloud(">", new Array(
        new Point(0,0,1),new Point(100,100,1),
        new Point(0,200,1)
    ));
    this.PointClouds[3] = new PointCloud(">", new Array(
        new Point(100,0,1),new Point(0,100,1),
        new Point(100,200,1)
    ));
	//
	// The $P Point-Cloud Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
	//
	this.Recognize = function(points)
	{
		points = Resample(points, NumPoints);
		points = Scale(points);
		points = TranslateTo(points, Origin);

		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
		{
			var d = GreedyCloudMatch(points, this.PointClouds[i]);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // point-cloud
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : Object.assign({path: this.PointClouds[u].originPoints}, new Result(this.PointClouds[u].Name, Math.max((b - 2.0) / -2.0, 0.0)));
	};
	this.AddGesture = function(name, points)
	{
		this.PointClouds[this.PointClouds.length] = new PointCloud(name, points);
		var num = 0;
		for (var i = 0; i < this.PointClouds.length; i++) {
			if (this.PointClouds[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.PointClouds.length = NumPointClouds; // clear any beyond the original set
		return NumPointClouds;
	}
}
//
// Private helper functions from this point down
//
function GreedyCloudMatch(points, P)
{
	var e = 0.50;
	var step = Math.floor(Math.pow(points.length, 1 - e));
	var min = +Infinity;
	for (var i = 0; i < points.length; i += step) {
		var d1 = CloudDistance(points, P.Points, i);
		var d2 = CloudDistance(P.Points, points, i);
		min = Math.min(min, Math.min(d1, d2)); // min3
	}
	return min;
}
function CloudDistance(pts1, pts2, start)
{
	var matched = new Array(pts1.length); // pts1.length == pts2.length
	for (var k = 0; k < pts1.length; k++)
		matched[k] = false;
	var sum = 0;
	var i = start;
	do
	{
		var index = -1;
		var min = +Infinity;
		for (var j = 0; j < matched.length; j++)
		{
			if (!matched[j]) {
				var d = Distance(pts1[i], pts2[j]);
				if (d < min) {
					min = d;
					index = j;
				}
			}
		}
		matched[index] = true;
		var weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
		sum += weight * min;
		i = (i + 1) % pts1.length;
	} while (i != start);
	return sum;
}
function Resample(points, n) //调整points的分布，尽量以相同间隔分布
{
	var I = PathLength(points) / (n - 1); // interval distance
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		if (points[i].ID == points[i-1].ID)
		{
			var d = Distance(points[i - 1], points[i]);
			if ((D + d) >= I)
			{
				var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
				var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
				var q = new Point(qx, qy, points[i].ID);
				newpoints[newpoints.length] = q; // append new point 'q'
				points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i insert q
				D = 0.0;
			}
			else D += d;
		}
	}
	if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
	return newpoints;
}
function Scale(points)  // 计算points scale 计算最大坐标差 压缩坐标值
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}

	var size = Math.max(maxX - minX, maxY - minY);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - minX) / size;
		var qy = (points[i].Y - minY) / size;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
}

function getRadius(points)
{
    var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}

	return Math.max(maxX - minX, maxY - minY) / 2;
}

function TranslateTo(points, pt) // translates points' centroid //去中心点 pt不知是啥
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
}
function Centroid(points) // 中心点 平均值
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y, 0);
}
function PathDistance(pts1, pts2) // average distance between corresponding points in two paths // 两个points平均偏移距离
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points) // length traversed by a point path //相同ID的前后两个点的距离和
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
	{
		if (points[i].ID == points[i-1].ID)
			d += Distance(points[i - 1], points[i]);
	}
	return d;
}
function Distance(p1, p2) // Euclidean distance between two points
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}

//
// Point class
//
function Point(x, y, id) // constructor
{
	this.X = x;
	this.Y = y;
	this.ID = id; // stroke ID to which this point belongs (1,2,...)
}
//
// PointCloud class: a point-cloud template
//
function PointCloud(name, points) // constructor
{
	this.Name = name;
    this.originPoints = points.slice(0);
	this.Points = Resample(points, NumPoints);
	this.Points = Scale(this.Points);
	this.Points = TranslateTo(this.Points, Origin);
}
//
// Result class
//
function Result(name, score) // constructor
{
	this.Name = name;
	this.Score = score;
}
//
// PDollarRecognizer class constants
//
var NumPointClouds = 4;
var NumPoints = 32;
var Origin = new Point(0,0,0);
//
// PDollarRecognizer class
//
function PDollarRecognizer() // constructor
{
	//
	// one predefined point-cloud for each gesture
	//
	this.PointClouds = new Array(NumPointClouds);
    this.PointClouds[0] = new PointCloud("X", new Array(
        new Point(0,0,1),new Point(100,100,1),
        new Point(200,200,1),new Point(200,0,2),
        new Point(100,100,2),new Point(0,200,2)
    ));
    const pai = 100 * Math.sqrt(2);
    this.PointClouds[1] = new PointCloud("circle", new Array(
        new Point(0,100,1),new Point(100 - pai, 100 + pai,1),
        new Point(100,200,1),new Point(100 + pai, 100 + pai, 1),
        new Point(200,100,1),new Point(100 + pai, 100 - pai,1),
        new Point(100,0,1),new Point(100 - pai, 100 - pai, 1)
    ));
    this.PointClouds[2] = new PointCloud(">", new Array(
        new Point(0,0,1),new Point(100,100,1),
        new Point(0,200,1)
    ));
    this.PointClouds[3] = new PointCloud(">", new Array(
        new Point(100,0,1),new Point(0,100,1),
        new Point(100,200,1)
    ));
	//
	// The $P Point-Cloud Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
	//
	this.Recognize = function(points)
	{
		points = Resample(points, NumPoints);
		points = Scale(points);
		points = TranslateTo(points, Origin);

		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
		{
			var d = GreedyCloudMatch(points, this.PointClouds[i]);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // point-cloud
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : Object.assign({path: this.PointClouds[u].originPoints}, new Result(this.PointClouds[u].Name, Math.max((b - 2.0) / -2.0, 0.0)));
	};
	this.AddGesture = function(name, points)
	{
		this.PointClouds[this.PointClouds.length] = new PointCloud(name, points);
		var num = 0;
		for (var i = 0; i < this.PointClouds.length; i++) {
			if (this.PointClouds[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.PointClouds.length = NumPointClouds; // clear any beyond the original set
		return NumPointClouds;
	}
}
//
// Private helper functions from this point down
//
function GreedyCloudMatch(points, P)
{
	var e = 0.50;
	var step = Math.floor(Math.pow(points.length, 1 - e));
	var min = +Infinity;
	for (var i = 0; i < points.length; i += step) {
		var d1 = CloudDistance(points, P.Points, i);
		var d2 = CloudDistance(P.Points, points, i);
		min = Math.min(min, Math.min(d1, d2)); // min3
	}
	return min;
}
function CloudDistance(pts1, pts2, start)
{
	var matched = new Array(pts1.length); // pts1.length == pts2.length
	for (var k = 0; k < pts1.length; k++)
		matched[k] = false;
	var sum = 0;
	var i = start;
	do
	{
		var index = -1;
		var min = +Infinity;
		for (var j = 0; j < matched.length; j++)
		{
			if (!matched[j]) {
				var d = Distance(pts1[i], pts2[j]);
				if (d < min) {
					min = d;
					index = j;
				}
			}
		}
		matched[index] = true;
		var weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
		sum += weight * min;
		i = (i + 1) % pts1.length;
	} while (i != start);
	return sum;
}
function Resample(points, n) //调整points的分布，尽量以相同间隔分布
{
	var I = PathLength(points) / (n - 1); // interval distance
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		if (points[i].ID == points[i-1].ID)
		{
			var d = Distance(points[i - 1], points[i]);
			if ((D + d) >= I)
			{
				var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
				var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
				var q = new Point(qx, qy, points[i].ID);
				newpoints[newpoints.length] = q; // append new point 'q'
				points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i insert q
				D = 0.0;
			}
			else D += d;
		}
	}
	if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
	return newpoints;
}
function Scale(points)  // 计算points scale 计算最大坐标差 压缩坐标值
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}

	var size = Math.max(maxX - minX, maxY - minY);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - minX) / size;
		var qy = (points[i].Y - minY) / size;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
}

function getRadius(points)
{
    var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}

	return Math.max(maxX - minX, maxY - minY) / 2;
}

function TranslateTo(points, pt) // translates points' centroid //去中心点 pt不知是啥
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
}
function Centroid(points) // 中心点 平均值
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y, 0);
}
function PathDistance(pts1, pts2) // average distance between corresponding points in two paths // 两个points平均偏移距离
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points) // length traversed by a point path //相同ID的前后两个点的距离和
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
	{
		if (points[i].ID == points[i-1].ID)
			d += Distance(points[i - 1], points[i]);
	}
	return d;
}
function Distance(p1, p2) // Euclidean distance between two points
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
