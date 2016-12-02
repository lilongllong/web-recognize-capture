webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	module.exports = __webpack_require__(14);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	var _Recognize = __webpack_require__(4);

	var _Recognize2 = _interopRequireDefault(_Recognize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	$(function () {
	    new _Recognize2.default();
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Capture = __webpack_require__(5);

	var _Capture2 = _interopRequireDefault(_Capture);

	var _PDollarRecognizer = __webpack_require__(10);

	var _PDollarRecognizer2 = _interopRequireDefault(_PDollarRecognizer);

	var _Point = __webpack_require__(11);

	var _Point2 = _interopRequireDefault(_Point);

	var _PointCloud = __webpack_require__(12);

	var _PointCloud2 = _interopRequireDefault(_PointCloud);

	var _Util = __webpack_require__(13);

	var _Util2 = _interopRequireDefault(_Util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Recognize = function () {
	    function Recognize() {
	        _classCallCheck(this, Recognize);

	        this._init();
	        this.NumPointClouds = 4;
	        this.NumPoints = 32;
	        this.Origin = new _Point2.default(0, 0, 0);
	        this.util = _Util2.default.getInstance();
	        this.capture = new _Capture2.default();
	    }

	    _createClass(Recognize, [{
	        key: "_init",
	        value: function _init() {
	            var _this = this;

	            this._$recognize = $("<canvas id=\"myCanvas\" class=\"web-recognize-Content\">\n                <span style=\"background-color:#ffff88;\">The &lt;canvas&gt; element is not supported by this browser.</span>\n            </canvas>");
	            this._canvas = this._$recognize[0];
	            $("body:eq(0)").append(this._$recognize[0]);
	            window.onresize = this.canvasResize;
	            $(window).scroll(function (event) {
	                _this.canvasResize();
	            });
	            $(window).ready(this.onLoadEvent.bind(this));
	            $(this._canvas).on("mouseup", function (event) {
	                _this.mouseUpEvent(event.clientX, event.clientY, event.button);
	            });
	            $(this._canvas).on("mousedown", function (event) {
	                _this.mouseDownEvent(event.clientX, event.clientY, event.button);
	            });
	            $(this._canvas).on("mousemove", function (event) {
	                _this.mouseMoveEvent(event.clientX, event.clientY, event.button);
	            });
	            $(this._canvas).on("contextmenu", function () {
	                return false;
	            });
	            $(document).ready(function () {
	                $(".item-view").children().each(function (index, item) {
	                    _this.capture.addWatchElements($(item));
	                });
	            });
	        }
	    }, {
	        key: "canvasResize",
	        value: function canvasResize() {
	            this._canvas.width = window.innerWidth;
	            this._canvas.height = window.innerHeight;
	            this._rc = this.getCanvasRect(this._canvas);
	            this._canvas.style.left = this._rc.x + "px";
	            this._canvas.style.top = this._rc.y + "px";
	            console.log(this._canvas, this._rc.y);
	        }
	    }, {
	        key: "onLoadEvent",
	        value: function onLoadEvent() {
	            this._points = new Array(); // point array for current stroke
	            this._strokeID = 0;
	            this._r = new _PDollarRecognizer2.default();
	            this.canvasResize();
	            this._g = this._canvas.getContext('2d');
	            this._g.lineWidth = 3;
	            this._g.font = "16px Gentilis";
	            this.drawText("please input: ", this._g);
	            this._isDown = false;
	        }
	    }, {
	        key: "getCanvasRect",
	        value: function getCanvasRect(canvas) {
	            var w = canvas.width;
	            var h = canvas.height;
	            var cx = $(document).scrollLeft();
	            var cy = $(document).scrollTop();
	            return { x: cx, y: cy, width: w, height: h };
	        }
	    }, {
	        key: "getScrollY",
	        value: function getScrollY() {
	            var scrollY = 0;
	            if (typeof document.body.parentElement != 'undefined') {
	                scrollY = document.body.parentElement.scrollTop; // IE
	            } else if (typeof window.pageYOffset != 'undefined') {
	                scrollY = window.pageYOffset; // FF
	            }
	            return scrollY;
	        }
	    }, {
	        key: "mouseDownEvent",
	        value: function mouseDownEvent(x, y, button) {
	            document.onselectstart = function () {
	                return false;
	            }; // disable drag-select
	            document.onmousedown = function () {
	                return false;
	            }; // disable drag-select
	            if (button <= 1) {
	                this._isDown = true;
	                x -= this._rc.x;
	                y -= this._rc.y - this.getScrollY();
	                if (this._strokeID == 0) // starting a new gesture
	                    {
	                        this._points.length = 0;
	                        this._g.clearRect(0, 0, this._rc.width, this._rc.height);
	                    }
	                this._points[this._points.length] = new _Point2.default(x, y, ++this._strokeID);
	                this.drawText("Recording stroke #" + this._strokeID + "...");
	                var clr = "rgb(" + this.util.rand(0, 200) + "," + this.util.rand(0, 200) + "," + this.util.rand(0, 200) + ")";
	                this._g.strokeStyle = clr;
	                this._g.fillStyle = clr;
	                this._g.fillRect(x - 4, y - 3, 9, 9);
	            } else if (button == 2) {
	                this.drawText("Recognizing gesture...");
	            }
	        }
	    }, {
	        key: "mouseMoveEvent",
	        value: function mouseMoveEvent(x, y, button) {
	            if (this._isDown) {
	                x -= this._rc.x;
	                y -= this._rc.y - this.getScrollY();
	                this._points[this._points.length] = new _Point2.default(x, y, this._strokeID); // append
	                this.drawConnectedPoint(this._points.length - 2, this._points.length - 1);
	            }
	        }
	    }, {
	        key: "mouseUpEvent",
	        value: function mouseUpEvent(x, y, button) {
	            document.onselectstart = function () {
	                return true;
	            }; // enable drag-select
	            document.onmousedown = function () {
	                return true;
	            }; // enable drag-select
	            if (button <= 1) {
	                if (this._isDown) {
	                    this._isDown = false;
	                    this.drawText("Stroke #" + this._strokeID + " recorded.");
	                }
	            } else if (button == 2) // segmentation with right-click
	                {
	                    if (this._points.length >= 10) {
	                        var result = this._r.Recognize(this._points);
	                        this.drawText("Result: " + result.Name + " (" + this.util.round(result.Score, 2) + ").");
	                        var centroid = new _PointCloud2.default({ name: "test", points: this._points }).Centroid();
	                        this.capture.getElementByCapture({ x: centroid.X, y: centroid.Y }, this.util.getRadius(this._points));
	                        var gesObj = new Object();
	                        gesObj.action = "gesture";
	                        gesObj.points = this._points;
	                    } else {
	                        this.drawText("Too little input made. Please try again.");
	                    }
	                    this._strokeID = 0; // signal to begin new gesture on next mouse-down
	                }
	        }
	    }, {
	        key: "drawConnectedPoint",
	        value: function drawConnectedPoint(from, to) {
	            this._g.beginPath();
	            this._g.moveTo(this._points[from].X, this._points[from].Y);
	            this._g.lineTo(this._points[to].X, this._points[to].Y);
	            this._g.closePath();
	            this._g.stroke();
	        }
	    }, {
	        key: "drawText",
	        value: function drawText(str) {
	            var $_g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._g;

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

	    }, {
	        key: "onClickAddExisting",
	        value: function onClickAddExisting() {
	            if (this._points.length >= 10) {
	                var pointclouds = document.getElementById('pointclouds');
	                var name = pointclouds[pointclouds.selectedIndex].value;
	                var num = this._r.AddGesture(name, this._points);
	                this.drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
	                this._strokeID = 0; // signal to begin new gesture on next mouse-down
	            }
	        }
	    }, {
	        key: "onClickAddCustom",
	        value: function onClickAddCustom() {
	            var name = document.getElementById('custom').value;
	            if (this._points.length >= 10 && name.length > 0) {
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
	    }, {
	        key: "onClickCustom",
	        value: function onClickCustom() {
	            document.getElementById('custom').select();
	        }
	    }]);

	    return Recognize;
	}();

	exports.default = Recognize;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Circle = __webpack_require__(6);

	var _Circle2 = _interopRequireDefault(_Circle);

	var _Rectangle = __webpack_require__(8);

	var _Rectangle2 = _interopRequireDefault(_Rectangle);

	var _Vector = __webpack_require__(9);

	var _Vector2 = _interopRequireDefault(_Vector);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Capture = function () {
	    function Capture() {
	        _classCallCheck(this, Capture);

	        this.watchElements = new Array();
	    }

	    _createClass(Capture, [{
	        key: "addWatchElements",
	        value: function addWatchElements(element) {
	            this.watchElements.push(element);
	        }
	    }, {
	        key: "getElementByCapture",
	        value: function getElementByCapture(location, range) {
	            var _this = this;

	            var result = this.watchElements.filter(function (item) {
	                var judge = _this.filterJudgement(item, location, range);
	                if (judge) {
	                    item.addClass("selected");
	                } else {
	                    item.removeClass("selected");
	                }
	                return judge;
	            });
	            return result;
	        }
	    }, {
	        key: "filterJudgement",
	        value: function filterJudgement(element, location, range) {
	            console.log($(element));
	            var y = $(element).offset().top;
	            var x = $(element).offset().left;
	            var width = $(element).width();
	            var height = $(element).height();
	            console.log(y, x, width, height);
	            var end = {
	                x: x + width,
	                y: y + height
	            };

	            return this.isJoined({ x: x, y: y }, end, location, range);
	        }
	    }, {
	        key: "isJoined",
	        value: function isJoined(rStart, rEnd, cLoc, cRadius) {
	            var circle = new _Circle2.default();
	            circle.centerLocation = cLoc;
	            circle.radius = cRadius;
	            console.log(rStart, rEnd);
	            var rect = new _Rectangle2.default();
	            rect.startPoint = [rStart.x, rStart.y];
	            rect.endPoint = [rEnd.x, rEnd.y];
	            console.log(cLoc, "center");
	            var vJoin = rect.getVectorFrom(cLoc).abs();
	            var vNear = rect.getNearestDiagonalVector(cLoc).abs();
	            var vResult = vJoin.minus(vNear);

	            var u = 0;
	            // circle cetroid in rect
	            if (vResult.vector[0] < 0 && vResult.vector[1] < 0) {
	                return true;
	            }
	            // 靠近 方框
	            if (Math.abs(vResult.vector[0]) < cRadius && Math.abs(vResult.vector[1]) < cRadius) {
	                u = Math.min(Math.max(vResult.vector[0], 0), Math.max(vResult.vector[1], 0));
	                return u <= cRadius;
	            }

	            // 远离方框
	            if (vResult.vector[0] > 0 || vResult.vector[1] > 0) {
	                u = vResult.distance();
	                return u <= cRadius;
	            }
	            return false;
	        }
	    }]);

	    return Capture;
	}();

	exports.default = Capture;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Shape2 = __webpack_require__(7);

	var _Shape3 = _interopRequireDefault(_Shape2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Circle = function (_Shape) {
	    _inherits(Circle, _Shape);

	    function Circle(args) {
	        _classCallCheck(this, Circle);

	        var _this = _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, args));

	        _this._type = "Circle";
	        _this._radius = null;
	        return _this;
	    }

	    _createClass(Circle, [{
	        key: "centerLocation",
	        set: function set(value) {
	            if (Array.isArray(value) && value.length >= 2) {
	                this._centerLocation = {
	                    x: value[0],
	                    y: value[1]
	                };
	                return true;
	            } else {
	                return false;
	            }
	        }
	    }, {
	        key: "radius",
	        set: function set(value) {
	            if (typeof value === 'number') {
	                this._radius = value;
	                return true;
	            } else {
	                return false;
	            }
	        },
	        get: function get() {
	            return this._radius ? this.radius : false;
	        }
	    }]);

	    return Circle;
	}(_Shape3.default);

	exports.default = Circle;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Shape = function () {
	    function Shape(args) {
	        _classCallCheck(this, Shape);

	        if (args) {
	            this._type = args.type || "";
	            this._centerLocation = args.centerLocation;
	        } else {
	            this._type = null;
	            this._centerLocation = null;
	        }
	    }

	    _createClass(Shape, [{
	        key: "type",
	        get: function get() {
	            return this._type;
	        }
	    }, {
	        key: "centerLocation",
	        get: function get() {
	            return this._centerLocation;
	        }
	    }]);

	    return Shape;
	}();

	exports.default = Shape;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Shape2 = __webpack_require__(7);

	var _Shape3 = _interopRequireDefault(_Shape2);

	var _Vector = __webpack_require__(9);

	var _Vector2 = _interopRequireDefault(_Vector);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Rectangle = function (_Shape) {
	    _inherits(Rectangle, _Shape);

	    function Rectangle(args) {
	        _classCallCheck(this, Rectangle);

	        var _this = _possibleConstructorReturn(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this, args));

	        _this._type = "Rectangle";
	        _this._startPoint = null;
	        _this._endPoint = null;
	        _this._diagnalVector = null;
	        return _this;
	    }

	    _createClass(Rectangle, [{
	        key: "_updateCenterLocation",
	        value: function _updateCenterLocation() {
	            if (this._startPoint && this._endPoint) {
	                this._centerLocation = {
	                    x: (this._startPoint.x + this._endPoint.x) / 2,
	                    y: (this._startPoint.y + this._endPoint.y) / 2
	                };
	                this._diagnalVector = [];
	                this._diagnalVector.push(new _Vector2.default((this._endPoint.x - this._startPoint.x) / 2, (this._endPoint.y - this._startPoint.y) / 2));
	                this._diagnalVector.push(new _Vector2.default((this._endPoint.x - this._startPoint.x) / 2, -(this._endPoint.y - this._startPoint.y) / 2));
	                this._diagnalVector.push(new _Vector2.default(-(this._endPoint.x - this._startPoint.x) / 2, -(this._endPoint.y - this._startPoint.y) / 2));
	                this._diagnalVector.push(new _Vector2.default(-(this._endPoint.x - this._startPoint.x) / 2, (this._endPoint.y - this._startPoint.y) / 2));
	            } else {
	                this._centerLocation = null;
	                this._diagnalVector = null;
	            }
	        }
	    }, {
	        key: "getVectorFrom",
	        value: function getVectorFrom(location) {
	            if (!this._centerLocation) return false;
	            if (Array.isArray(location) && location.length >= 2) {
	                return new _Vector2.default(location[0] - this._centerLocation.x, location[1] - this._centerLocation.y);
	            } else if ((typeof location === "undefined" ? "undefined" : _typeof(location)) === "object" && location.x && location.y) {
	                return new _Vector2.default(location.x - this._centerLocation.x, location.y - this._centerLocation.y);
	            } else {
	                return false;
	            }
	        }
	    }, {
	        key: "getNearestDiagonalVector",
	        value: function getNearestDiagonalVector(location) {
	            var _this2 = this;

	            var curVector = this.getVectorFrom(location);
	            if (curVector && this._centerLocation) {
	                var _ret = function () {
	                    var resultIndex = 0;
	                    var cos = curVector.angleCos(_this2._diagnalVector[0]);
	                    _this2._diagnalVector.forEach(function (item, index) {
	                        if (index !== 0) {
	                            var curCos = curVector.angleCos(item);
	                            if (curCos > cos) {
	                                cos = curCos;
	                                resultIndex = index;
	                            }
	                        }
	                    });
	                    return {
	                        v: _this2._diagnalVector[resultIndex]
	                    };
	                }();

	                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
	            } else {
	                return false;
	            }
	        }
	    }, {
	        key: "startPoint",
	        set: function set(value) {
	            if (Array.isArray(value) && value.length >= 2) {
	                this._startPoint = {
	                    x: value[0],
	                    y: value[1]
	                };
	                this._updateCenterLocation();
	                return true;
	            } else {
	                return false;
	            }
	        },
	        get: function get() {
	            return this._startPoint ? [this._startPoint.x, this._startPoint.y] : null;
	        }
	    }, {
	        key: "endPoint",
	        set: function set(value) {
	            if (Array.isArray(value) && value.length >= 2) {
	                this._endPoint = {
	                    x: value[0],
	                    y: value[1]
	                };
	                this._updateCenterLocation();
	                return true;
	            } else {
	                return false;
	            }
	        },
	        get: function get() {
	            return this._endPoint ? [this._endPoint.x, this.endPoint.y] : null;
	        }
	    }]);

	    return Rectangle;
	}(_Shape3.default);

	exports.default = Rectangle;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Vector = function () {
	    function Vector() {
	        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	        _classCallCheck(this, Vector);

	        this._startPoint = null;
	        this._endPoint = null;
	        this._vector = null;
	        if (x !== null && y !== null) {
	            this._startPoint = {
	                x: 0,
	                y: 0
	            };
	            this._endPoint = {
	                x: x,
	                y: y
	            };
	            this._vector = {
	                x: x,
	                y: y
	            };
	        }
	    }

	    _createClass(Vector, [{
	        key: "_updateVector",
	        value: function _updateVector() {
	            if (this._endPoint && this._startPoint) {
	                this._vector = {
	                    x: this._endPoint.x - this._startPoint.x,
	                    y: this._endPoint.y - this._startPoint.y
	                };
	            } else {
	                this._vector = null;
	            }
	        }
	    }, {
	        key: "plus",
	        value: function plus(vector) {
	            if (vector instanceof Vector) {
	                return new Vector(this._vector.x + vector.vector[0], this._vector.y + vector.vector[1]);
	            } else {
	                throw new Error("input must be a Vector object.");
	            }
	        }
	    }, {
	        key: "minus",
	        value: function minus(vector) {
	            if (vector instanceof Vector) {
	                return new Vector(this._vector.x - vector.vector[0], this._vector.y - vector.vector[1]);
	            } else {
	                throw new Error("input must be a Vector object.");
	            }
	        }
	    }, {
	        key: "distance",
	        value: function distance() {
	            var vector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

	            if (vector === null) {
	                // calculate it's distance
	                return Math.sqrt(Math.pow(this._vector.x, 2) + Math.pow(this._vector.y, 2));
	            } else {
	                // calculate vector's distance
	                return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
	            }
	        }
	    }, {
	        key: "angleCos",
	        value: function angleCos(vector) {
	            if (vector) {
	                var a = this.distance();
	                var b = this.distance(vector);
	                var ab = this._vector.x * vector.x + this._vector.y * vector.y;
	                return a * b !== 0 ? ab / (a * b) : 1; // assum 1
	            } else {
	                return false;
	            }
	        }
	    }, {
	        key: "abs",
	        value: function abs(vector) {
	            if (vector) {
	                return new Vector(Math.abs(vector.x), Math.abs(vector.y));
	            } else {
	                return new Vector(Math.abs(this._vector.x), Math.abs(this._vector.y));
	            }
	        }
	    }, {
	        key: "startPoint",
	        set: function set(value) {
	            if (Array.isArray(value) && value.length >= 2) {
	                this._startPoint = {
	                    x: value[0],
	                    y: value[1]
	                };
	                this._updateVector();
	                return true;
	            } else {
	                return false;
	            }
	        },
	        get: function get() {
	            return this._startPoint ? [this._startPoint.x, this._startPoint.y] : null;
	        }
	    }, {
	        key: "endPoint",
	        set: function set(value) {
	            if (Array.isArray(value) && value.length >= 2) {
	                this._endPoint = {
	                    x: value[0],
	                    y: value[1]
	                };
	                this._updateVector();
	                return true;
	            } else {
	                return false;
	            }
	        },
	        get: function get() {
	            return this._endPoint ? [this._endPoint.x, this._endPoint.y] : null;
	        }
	    }, {
	        key: "vector",
	        get: function get() {
	            return this._vector ? [this._vector.x, this._vector.y] : null;
	        }
	    }]);

	    return Vector;
	}();

	exports.default = Vector;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Point = __webpack_require__(11);

	var _Point2 = _interopRequireDefault(_Point);

	var _PointCloud = __webpack_require__(12);

	var _PointCloud2 = _interopRequireDefault(_PointCloud);

	var _Util = __webpack_require__(13);

	var _Util2 = _interopRequireDefault(_Util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PDollarRecognizer = function () {
	    function PDollarRecognizer() {
	        _classCallCheck(this, PDollarRecognizer);

	        var NumPointClouds = 4;
	        this.PointClouds = new Array(NumPointClouds);
	        this.PointClouds[0] = new _PointCloud2.default({ name: "X", points: new Array(new _Point2.default(0, 0, 1), new _Point2.default(100, 100, 1), new _Point2.default(200, 200, 1), new _Point2.default(200, 0, 2), new _Point2.default(100, 100, 2), new _Point2.default(0, 200, 2)) });
	        var pai = 100 * Math.sqrt(2);
	        this.PointClouds[1] = new _PointCloud2.default({ name: "circle", points: new Array(new _Point2.default(0, 100, 1), new _Point2.default(100 - pai, 100 + pai, 1), new _Point2.default(100, 200, 1), new _Point2.default(100 + pai, 100 + pai, 1), new _Point2.default(200, 100, 1), new _Point2.default(100 + pai, 100 - pai, 1), new _Point2.default(100, 0, 1), new _Point2.default(100 - pai, 100 - pai, 1)) });
	        this.PointClouds[2] = new _PointCloud2.default({ name: ">", points: new Array(new _Point2.default(0, 0, 1), new _Point2.default(100, 100, 1), new _Point2.default(0, 200, 1)) });
	        this.PointClouds[3] = new _PointCloud2.default({ name: ">", points: new Array(new _Point2.default(100, 0, 1), new _Point2.default(0, 100, 1), new _Point2.default(100, 200, 1)) });
	    }

	    _createClass(PDollarRecognizer, [{
	        key: "Recognize",
	        value: function Recognize(points) {
	            points = new _PointCloud2.default({ name: "未知", points: points }).points;
	            var b = +Infinity;
	            var u = -1;
	            for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
	            {
	                console.log(this.PointClouds);
	                var d = _Util2.default.getInstance().GreedyCloudMatch(points, this.PointClouds[i]);
	                if (d < b) {
	                    b = d; // best (least) distance
	                    u = i; // point-cloud
	                }
	            }
	            return u == -1 ? { Name: "No match.", Score: 0.0 } : Object.assign({ path: this.PointClouds[u].originPoints }, { Name: this.PointClouds[u].name, Score: Math.max((b - 2.0) / -2.0, 0.0) });
	        }
	    }]);

	    return PDollarRecognizer;
	}();

	exports.default = PDollarRecognizer;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Point = function Point(x, y, id) {
	    _classCallCheck(this, Point);

	    this.X = x;
	    this.Y = y;
	    this.ID = id;
	};

	exports.default = Point;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Point = __webpack_require__(11);

	var _Point2 = _interopRequireDefault(_Point);

	var _Util = __webpack_require__(13);

	var _Util2 = _interopRequireDefault(_Util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PointCloud = function () {
	    function PointCloud(args) {
	        _classCallCheck(this, PointCloud);

	        this.name = args.name;
	        this.originPoints = args.points;
	        this.points = null;
	        this.NumPoints = 32;
	        this.originPoint = new _Point2.default(0, 0, 0);
	        this.util = _Util2.default.getInstance();
	        this._dealPoints();
	    }

	    _createClass(PointCloud, [{
	        key: "_dealPoints",
	        value: function _dealPoints() {
	            var points = null;
	            if (this.originPoints) {
	                points = this.Resample(this.originPoints, this.NumPoints);
	                points = this.Scale(points);
	                points = this.TranslateTo(points, this.originPoint);
	                this.points = points;
	            }
	        }
	    }, {
	        key: "Centroid",
	        value: function Centroid(points) // 中心点 平均值
	        {
	            if (!points) {
	                points = this.originPoints;
	            }
	            var x = 0.0;
	            var y = 0.0;
	            for (var i = 0; i < points.length; i++) {
	                x += points[i].X;
	                y += points[i].Y;
	            }
	            x /= points.length;
	            y /= points.length;
	            return new _Point2.default(x, y, 0);
	        }
	    }, {
	        key: "Resample",
	        value: function Resample(points, n) //调整points的分布，尽量以相同间隔分布
	        {
	            var I = this.util.PathLength(points) / (n - 1); // interval distance
	            var D = 0.0;
	            var newpoints = new Array(points[0]);
	            for (var i = 1; i < points.length; i++) {
	                if (points[i].ID == points[i - 1].ID) {
	                    var d = this.util.Distance(points[i - 1], points[i]);
	                    if (D + d >= I) {
	                        var qx = points[i - 1].X + (I - D) / d * (points[i].X - points[i - 1].X);
	                        var qy = points[i - 1].Y + (I - D) / d * (points[i].Y - points[i - 1].Y);
	                        var q = new _Point2.default(qx, qy, points[i].ID);
	                        newpoints[newpoints.length] = q; // append new point 'q'
	                        points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i insert q
	                        D = 0.0;
	                    } else D += d;
	                }
	            }
	            if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
	                newpoints[newpoints.length] = new _Point2.default(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
	            return newpoints;
	        }
	    }, {
	        key: "Scale",
	        value: function Scale(points) // 计算points scale 计算最大坐标差 压缩坐标值
	        {
	            var minX = +Infinity,
	                maxX = -Infinity,
	                minY = +Infinity,
	                maxY = -Infinity;
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
	                newpoints[newpoints.length] = new _Point2.default(qx, qy, points[i].ID);
	            }
	            return newpoints;
	        }
	    }, {
	        key: "TranslateTo",
	        value: function TranslateTo(points, pt) // translates points' centroid //去中心点 pt不知是啥
	        {
	            var c = this.Centroid(points);
	            var newpoints = new Array();
	            for (var i = 0; i < points.length; i++) {
	                var qx = points[i].X + pt.X - c.X;
	                var qy = points[i].Y + pt.Y - c.Y;
	                newpoints[newpoints.length] = new _Point2.default(qx, qy, points[i].ID);
	            }
	            return newpoints;
	        }
	    }]);

	    return PointCloud;
	}();

	exports.default = PointCloud;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Util = function () {
	    function Util() {
	        _classCallCheck(this, Util);
	    }

	    _createClass(Util, [{
	        key: "GreedyCloudMatch",
	        value: function GreedyCloudMatch(points, P) {
	            var e = 0.50;
	            console.log("数组长度", points.length, P.points.length);
	            var step = Math.floor(Math.pow(points.length, 1 - e));
	            var min = +Infinity;
	            for (var i = 0; i < points.length; i += step) {
	                var d1 = this.CloudDistance(points, P.points, i);
	                var d2 = this.CloudDistance(P.points, points, i);
	                min = Math.min(min, Math.min(d1, d2)); // min3
	            }
	            return min;
	        }
	    }, {
	        key: "CloudDistance",
	        value: function CloudDistance(pts1, pts2, start) {
	            var matched = new Array(pts1.length); // pts1.length == pts2.length
	            for (var k = 0; k < pts1.length; k++) {
	                matched[k] = false;
	            }var sum = 0;
	            var i = start;
	            do {
	                var index = -1;
	                var min = +Infinity;
	                for (var j = 0; j < matched.length; j++) {
	                    if (!matched[j]) {
	                        var d = this.Distance(pts1[i], pts2[j]);
	                        if (d < min) {
	                            min = d;
	                            index = j;
	                        }
	                    }
	                }
	                matched[index] = true;
	                var weight = 1 - (i - start + pts1.length) % pts1.length / pts1.length;
	                sum += weight * min;
	                i = (i + 1) % pts1.length;
	            } while (i != start);
	            return sum;
	        }
	    }, {
	        key: "getRadius",
	        value: function getRadius(points) {
	            var minX = +Infinity,
	                maxX = -Infinity,
	                minY = +Infinity,
	                maxY = -Infinity;
	            for (var i = 0; i < points.length; i++) {
	                minX = Math.min(minX, points[i].X);
	                minY = Math.min(minY, points[i].Y);
	                maxX = Math.max(maxX, points[i].X);
	                maxY = Math.max(maxY, points[i].Y);
	            }

	            return Math.max(maxX - minX, maxY - minY) / 2;
	        }
	    }, {
	        key: "PathDistance",
	        value: function PathDistance(pts1, pts2) // average distance between corresponding points in two paths // 两个points平均偏移距离
	        {
	            var d = 0.0;
	            for (var i = 0; i < pts1.length; i++) {
	                // assumes pts1.length == pts2.length
	                d += this.Distance(pts1[i], pts2[i]);
	            }return d / pts1.length;
	        }
	    }, {
	        key: "PathLength",
	        value: function PathLength(points) // length traversed by a point path //相同ID的前后两个点的距离和
	        {
	            var d = 0.0;
	            for (var i = 1; i < points.length; i++) {
	                if (points[i].ID == points[i - 1].ID) d += this.Distance(points[i - 1], points[i]);
	            }
	            return d;
	        }
	    }, {
	        key: "Distance",
	        value: function Distance(p1, p2) // Euclidean distance between two points
	        {
	            var dx = p2.X - p1.X;
	            var dy = p2.Y - p1.Y;
	            return Math.sqrt(dx * dx + dy * dy);
	        }
	    }, {
	        key: "rand",
	        value: function rand(low, high) {
	            return Math.floor((high - low + 1) * Math.random()) + low;
	        }
	    }, {
	        key: "round",
	        value: function round(n, d) {
	            d = Math.pow(10, d);
	            return Math.round(n * d) / d;
	        }
	    }], [{
	        key: "getInstance",
	        value: function getInstance() {
	            if (!Util._instance) {
	                Util._instance = new Util();
	            }
	            return Util._instance;
	        }
	    }]);

	    return Util;
	}();

	Util._instance = null;
	exports.default = Util;

/***/ },
/* 14 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);