webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	__webpack_require__(28);
	__webpack_require__(32);
	__webpack_require__(33);
	__webpack_require__(34);
	__webpack_require__(35);
	__webpack_require__(36);
	__webpack_require__(37);
	__webpack_require__(38);
	__webpack_require__(39);
	module.exports = __webpack_require__(40);


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

	var _config = __webpack_require__(10);

	var _config2 = _interopRequireDefault(_config);

	var _ImageRecognize = __webpack_require__(11);

	var _ImageRecognize2 = _interopRequireDefault(_ImageRecognize);

	var _InterceptionWeb = __webpack_require__(19);

	var _InterceptionWeb2 = _interopRequireDefault(_InterceptionWeb);

	var _PDollarRecognizer = __webpack_require__(24);

	var _PDollarRecognizer2 = _interopRequireDefault(_PDollarRecognizer);

	var _Point = __webpack_require__(25);

	var _Point2 = _interopRequireDefault(_Point);

	var _PointCloud = __webpack_require__(26);

	var _PointCloud2 = _interopRequireDefault(_PointCloud);

	var _Util = __webpack_require__(27);

	var _Util2 = _interopRequireDefault(_Util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
	        this._history = new Array();
	        this.config = _config2.default.noteConfig;
	    }

	    _createClass(Recognize, [{
	        key: "_init",
	        value: function _init() {
	            var _this = this;

	            this._$recognize = $("<canvas id=\"myCanvas\" class=\"web-recognize-Content\">\n                <span style=\"background-color:#ffff88;\">The &lt;canvas&gt; element is not supported by this browser.</span>\n            </canvas>");
	            this._canvas = this._$recognize[0];
	            var waitListReady = setInterval(function () {
	                if ($(".grid-container.row").length) {
	                    _this.onLoadEvent();
	                    clearInterval(waitListReady);
	                }
	            }, 100);
	            $(window).ready(this.onLoadEvent.bind(this));
	            $(window).resize(function () {
	                _this.canvasResize();
	            });
	            $(this._canvas).on("mouseup", function (event) {
	                _this.mouseUpEvent(event.offsetX, event.offsetY, event.button);
	            });
	            $(this._canvas).on("mousedown", function (event) {
	                _this.mouseDownEvent(event.offsetX, event.offsetY, event.button);
	            });
	            $(this._canvas).on("mousemove", function (event) {
	                _this.mouseMoveEvent(event.offsetX, event.offsetY, event.button);
	            });
	            $(this._canvas).on("contextmenu", function () {
	                return false;
	            });
	        }
	    }, {
	        key: "canvasResize",
	        value: function canvasResize() {
	            var _this2 = this;

	            setTimeout(function () {
	                _this2._canvas.width = $(".grid-container.row").width();
	                _this2._canvas.height = $(".grid-container.row").height();
	                _this2._rc = _this2.getCanvasRect(_this2._canvas);
	                _this2._g = _this2._canvas.getContext('2d');
	                console.log("resize", $(".grid-container.row").width(), $(".grid-container.row").height());
	            }, 300);
	        }
	    }, {
	        key: "onLoadEvent",
	        value: function onLoadEvent() {
	            $(".grid-container.row").append(this._$recognize[0]);
	            this.capture.watchDOMBySelector("default");
	            this._points = new Array(); // point array for current stroke
	            this._strokeID = 0;
	            this._r = new _PDollarRecognizer2.default();
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
	                // x -= this._rc.x;
	                // y -= this._rc.y - this.getScrollY();
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
	                // x -= this._rc.x;
	                // y -= this._rc.y - this.getScrollY();
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
	                        this.analyzeAndCapture();
	                        var gesObj = new Object();
	                        gesObj.action = "gesture";
	                        gesObj.points = this._points;
	                    } else {
	                        this.drawText("Too little input made. Please try again.");
	                    }
	                    this._strokeID = 0;
	                    this._points = new Array();
	                    // signal to begin new gesture on next mouse-down
	                }
	        }
	    }, {
	        key: "analyzeAndCapture",
	        value: function analyzeAndCapture() {
	            var _this3 = this;

	            var results = this._r.Recognize(this._points);
	            var allSelectedDom = new Array();
	            results.map(function (result) {
	                _this3.drawText("Result: " + _this3.config.noteType[result.Name] + " (" + _this3.util.round(result.Score, 2) + ").");
	                console.log("Result: " + _this3.config.noteType[result.Name] + " (" + _this3.util.round(result.Score, 2) + ").");
	                if (result.type === "2" && result.Score > 0.01) {
	                    (function () {
	                        var range = _this3.util.getRange(result.path);
	                        var selectedDom = null;
	                        var radius = null;
	                        // not confirmed cross
	                        if (result.Name === "10" || result.Name === "20") {
	                            var type = parseInt(result.Name);
	                            if (range.outerRadius < _this3.config.diff.boundary) {
	                                result.Name = "" + (type + 1);
	                            } else {
	                                resutl.Name = "" + (type + 2);
	                            }
	                        }

	                        selectedDom = _this3.capture.getElementByCapture(range.outerCentroid, range.outerRadius).map(function (item) {
	                            return {
	                                "selectedDom": item,
	                                "range": {
	                                    "startX": range.startX,
	                                    "startY": range.startY,
	                                    "width": range.width,
	                                    "height": range.height
	                                }
	                            };
	                        });

	                        allSelectedDom.push.apply(allSelectedDom, _toConsumableArray(selectedDom));
	                        _this3._history.push({
	                            "points": result.path,
	                            "shape": result.Name,
	                            "Dom": selectedDom, // 之后替换成project's or commodity's ID
	                            "confidenceLevel": result.Score
	                        });
	                        console.log(_this3._history);
	                    })();
	                }
	            });
	            console.log(allSelectedDom, "allSelectedDom");
	            allSelectedDom.forEach(function (domItem) {
	                var item = domItem.selectedDom;
	                var range = domItem.range;
	                console.log("range", range);
	                $(item.element).addClass("test-selected");
	                if (item.label === "label") {
	                    _this3.labelExtract(item, range);
	                }
	            });
	        }
	    }, {
	        key: "labelExtract",
	        value: function labelExtract(item, range) {
	            var imageRecognize = new _ImageRecognize2.default();
	            var interceptionWeb = new _InterceptionWeb2.default();
	            interceptionWeb.domToImageLikePng(item.rootElement, range).then(function (img) {
	                console.log("dom-img", img);
	                imageRecognize.imageToText(item.rootElement).then(function (result) {
	                    alert("text", result);
	                });
	            });
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

	var _config = __webpack_require__(10);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Capture = function () {
	    function Capture() {
	        _classCallCheck(this, Capture);

	        this.watchElements = new Array();
	        this.config = _config2.default.webConfig;
	    }
	    // algnrith advance


	    _createClass(Capture, [{
	        key: "addWatchElements",
	        value: function addWatchElements(rootElement, element, label, domPath) {
	            this.watchElements.push({
	                rootElement: rootElement,
	                element: element,
	                label: label,
	                domPath: domPath
	            });
	        }
	    }, {
	        key: "watchDOMBySelector",
	        value: function watchDOMBySelector() {
	            var _this = this;

	            var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

	            selectors = this.config.itemSelectors;
	            selectors.forEach(function (selector) {
	                $(selector).each(function (index, item) {
	                    var img = $(item).find(_this.config.itemImgSelector)[0];
	                    var text = $(item).find(_this.config.itemTitleSelector)[0];
	                    if (img) {
	                        _this.addWatchElements(item, img, "img", _this.config.itemImgSelector);
	                    }
	                    if (text) {
	                        _this.addWatchElements(item, text, "label", _this.config.itemTitleSelector);
	                    }
	                });
	            });
	        }
	    }, {
	        key: "updateWatchDom",
	        value: function updateWatchDom() {
	            var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

	            this.watchElements = [];
	            this.watchDOMBySelector(selectors);
	        }
	    }, {
	        key: "getElementByCapture",
	        value: function getElementByCapture(location, range) {
	            var _this2 = this;

	            this.updateWatchDom();
	            var result = this.watchElements.filter(function (item) {
	                var judge = _this2.filterJudgement(item.element, location, range);
	                console.log("judge", judge);
	                if (!judge) {
	                    $(item.element).removeClass("test-selected");
	                }
	                return judge;
	            });
	            return result;
	        }
	    }, {
	        key: "filterJudgement",
	        value: function filterJudgement(element, location, range) {
	            var rect = this.getPositionOfElement(element);
	            var start = {
	                x: rect.left,
	                y: rect.top
	            };
	            var end = {
	                x: rect.right,
	                y: rect.bottom
	            };
	            console.log(start, end, location, range, "position");
	            return this.isJoined(start, end, location, range);
	        }
	    }, {
	        key: "isJoined",
	        value: function isJoined(rStart, rEnd, cLoc, cRadius) {
	            var circle = new _Circle2.default();
	            circle.centerLocation = cLoc;
	            circle.radius = cRadius;
	            var rect = new _Rectangle2.default();
	            rect.startPoint = [rStart.x, rStart.y];
	            rect.endPoint = [rEnd.x, rEnd.y];
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
	    }, {
	        key: "getPositionOfElement",
	        value: function getPositionOfElement(element) {
	            var x = 0;
	            var y = 0;
	            var width = element.offsetWidth;
	            var height = element.offsetHeight;

	            while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
	                try {
	                    if ($(element).hasClass(this.config.listDOMSelector.slice(1))) {
	                        break;
	                    }
	                } catch (e) {
	                    console.log("nothing");
	                }
	                x += element.offsetLeft;
	                y += element.offsetTop;
	                element = element.offsetParent;
	            }
	            return {
	                left: x,
	                right: x + width,
	                top: y,
	                bottom: y + height
	            };
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
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    "webConfig": {
	        "listDOMSelector": ".grid-container",
	        "itemSelectors": [".grid-container > .grid-item", ".grid-container .blank-row .grid-item"],
	        "itemImgSelector": ".grid-panel > .img-box > .img-a",
	        "itemTitleSelector": ".grid-panel > .info-cont > .title-row > .product-title"
	    },
	    "inputType": {
	        "0": "can't be matched",
	        "1": "item of next",
	        "2": "matched"
	    },
	    "noteConfig": {
	        "noteType": {
	            "01": "/",
	            "02": "\\",
	            "03": "1",
	            "10": "circle not confirmed",
	            "11": "small circle",
	            "12": "big circle",
	            "20": "cross not confirmed",
	            "21": "small cross",
	            "22": "big cross",
	            "31": "up",
	            "41": "down"
	        },
	        "diff": {
	            "minRadius": 36,
	            "maxRadius": 248,
	            "boundary": 70
	        }
	    }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _tesseract = __webpack_require__(12);

	var _tesseract2 = _interopRequireDefault(_tesseract);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ImageRecognize = function () {
	    function ImageRecognize() {
	        _classCallCheck(this, ImageRecognize);

	        this.tool = _tesseract2.default;
	    }

	    _createClass(ImageRecognize, [{
	        key: "imageToText",
	        value: function imageToText(imageLike) {
	            var _this = this;

	            console.log("imageToText", imageLike);
	            return new Promise(function (resolve, reject) {
	                _this.tool.recognize(imageLike, {
	                    lang: "chi_sim"
	                }).catch(function (error) {
	                    reject(error);
	                }).then(function (result) {
	                    resolve(result);
	                    console.log("result", result);
	                });
	            });
	        }
	    }, {
	        key: "textMactch",
	        value: function textMactch(targetText, baseText) {
	            var baseItem = baseText.split(" ");
	            var result = "";
	            var tempAccuracy = 0;
	            baseItem.forEach(function (item) {
	                if (targetText.includes(item)) {
	                    result.concat(item + " ");
	                }
	            });
	            if (result.length < 1) {
	                return null;
	            }
	            return result;
	        }
	    }]);

	    return ImageRecognize;
	}();

	exports.default = ImageRecognize;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	const adapter = __webpack_require__(13)
	const circularize = __webpack_require__(16)
	const TesseractJob = __webpack_require__(17);
	const objectAssign = __webpack_require__(18);
	const version = __webpack_require__(15).version;

	function create(workerOptions){
		workerOptions = workerOptions || {};
		var worker = new TesseractWorker(objectAssign({}, adapter.defaultOptions, workerOptions))
		worker.create = create;
		worker.version = version;
		return worker;
	}

	class TesseractWorker {
		constructor(workerOptions){
			this.worker = null;
			this.workerOptions = workerOptions;
			this._currentJob = null;
			this._queue = []
		}

		recognize(image, options){
			return this._delay(job => {
				if(typeof options === 'string'){
					options = { lang: options };
				}else{
					options = options || {}
					options.lang = options.lang || 'eng';	
				}
				
				job._send('recognize', { image: image, options: options, workerOptions: this.workerOptions })
			})
		}
		detect(image, options){
			options = options || {}
			return this._delay(job => {
				job._send('detect', { image: image, options: options, workerOptions: this.workerOptions })
			})
		}

		terminate(){ 
			if(this.worker) adapter.terminateWorker(this);
			this.worker = null;
		}

		_delay(fn){
			if(!this.worker) this.worker = adapter.spawnWorker(this, this.workerOptions);

			var job = new TesseractJob(this);
			this._queue.push(e => {
				this._queue.shift()
				this._currentJob = job;
				fn(job)
			})
			if(!this._currentJob) this._dequeue();
			return job
		}

		_dequeue(){
			this._currentJob = null;
			if(this._queue.length > 0){
				this._queue[0]()
			}
		}

		_recv(packet){

	        if(packet.status === 'resolve' && packet.action === 'recognize'){
	            packet.data = circularize(packet.data);
	        }

			if(this._currentJob.id === packet.jobId){
				this._currentJob._handle(packet)
			}else{
				console.warn('Job ID ' + packet.jobId + ' not known.')
			}
		}
	}

	var DefaultTesseract = create()

	module.exports = DefaultTesseract

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var defaultOptions = {
	    // workerPath: 'https://cdn.rawgit.com/naptha/tesseract.js/0.2.0/dist/worker.js',
	    corePath: 'https://cdn.rawgit.com/naptha/tesseract.js-core/0.1.0/index.js',    
	    langPath: 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
	}

	if (process.env.NODE_ENV === "development") {
	    console.debug('Using Development Configuration')
	    defaultOptions.workerPath = location.protocol + '//' + location.host + '/dist/worker.dev.js?nocache=' + Math.random().toString(36).slice(3)
	}else{
	    var version = __webpack_require__(15).version;
	    defaultOptions.workerPath = 'https://cdn.rawgit.com/naptha/tesseract.js/' + version + '/dist/worker.js'
	}

	exports.defaultOptions = defaultOptions;


	exports.spawnWorker = function spawnWorker(instance, workerOptions){
	    if(window.Blob && window.URL){
	        var blob = new Blob(['importScripts("' + workerOptions.workerPath + '");'])
	        var worker = new Worker(window.URL.createObjectURL(blob));
	    }else{
	        var worker = new Worker(workerOptions.workerPath)
	    }

	    worker.onmessage = function(e){
	        var packet = e.data;
	        instance._recv(packet)
	    }
	    return worker
	}

	exports.terminateWorker = function(instance){
	    instance.worker.terminate()
	}

	exports.sendPacket = function sendPacket(instance, packet){
	    loadImage(packet.payload.image, function(img){
	        packet.payload.image = img
	        instance.worker.postMessage(packet) 
	    })
	}


	function loadImage(image, cb){
	    if(typeof image === 'string'){
	        if(/^\#/.test(image)){
	            // element css selector
	            return loadImage(document.querySelector(image), cb)
	        }else if(/(blob|data)\:/.test(image)){
	            // data url
	            var im = new Image
	            im.src = image;
	            im.onload = e => loadImage(im, cb);
	            return
	        }else{
	            var xhr = new XMLHttpRequest();
	            xhr.open('GET', image, true)
	            xhr.responseType = "blob";
	            xhr.onload = e => loadImage(xhr.response, cb);
	            xhr.onerror = function(e){
	                if(/^https?:\/\//.test(image) && !/^https:\/\/crossorigin.me/.test(image)){
	                    console.debug('Attempting to load image with CORS proxy')
	                    loadImage('https://crossorigin.me/' + image, cb)
	                }
	            }
	            xhr.send(null)
	            return
	        }
	    }else if(image instanceof File){
	        // files
	        var fr = new FileReader()
	        fr.onload = e => loadImage(fr.result, cb);
	        fr.readAsDataURL(image)
	        return
	    }else if(image instanceof Blob){
	        return loadImage(URL.createObjectURL(image), cb)
	    }else if(image.getContext){
	        // canvas element
	        return loadImage(image.getContext('2d'), cb)
	    }else if(image.tagName == "IMG" || image.tagName == "VIDEO"){
	        // image element or video element
	        var c = document.createElement('canvas');
	        c.width  = image.naturalWidth  || image.videoWidth;
	        c.height = image.naturalHeight || image.videoHeight;
	        var ctx = c.getContext('2d');
	        ctx.drawImage(image, 0, 0);
	        return loadImage(ctx, cb)
	    }else if(image.getImageData){
	        // canvas context
	        var data = image.getImageData(0, 0, image.canvas.width, image.canvas.height);
	        return loadImage(data, cb)
	    }else{
	        return cb(image)
	    }
	    throw new Error('Missing return in loadImage cascade')

	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 14 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "package.json";

/***/ },
/* 16 */
/***/ function(module, exports) {

	// The result of dump.js is a big JSON tree
	// which can be easily serialized (for instance
	// to be sent from a webworker to the main app
	// or through Node's IPC), but we want
	// a (circular) DOM-like interface for walking
	// through the data. 

	module.exports = function circularize(page){
	    page.paragraphs = []
	    page.lines = []
	    page.words = []
	    page.symbols = []

	    page.blocks.forEach(function(block){
	        block.page = page;

	        block.lines = []
	        block.words = []
	        block.symbols = []

	        block.paragraphs.forEach(function(para){
	            para.block = block;
	            para.page = page;

	            para.words = []
	            para.symbols = []
	            
	            para.lines.forEach(function(line){
	                line.paragraph = para;
	                line.block = block;
	                line.page = page;

	                line.symbols = []

	                line.words.forEach(function(word){
	                    word.line = line;
	                    word.paragraph = para;
	                    word.block = block;
	                    word.page = page;
	                    word.symbols.forEach(function(sym){
	                        sym.word = word;
	                        sym.line = line;
	                        sym.paragraph = para;
	                        sym.block = block;
	                        sym.page = page;
	                        
	                        sym.line.symbols.push(sym)
	                        sym.paragraph.symbols.push(sym)
	                        sym.block.symbols.push(sym)
	                        sym.page.symbols.push(sym)
	                    })
	                    word.paragraph.words.push(word)
	                    word.block.words.push(word)
	                    word.page.words.push(word)
	                })
	                line.block.lines.push(line)
	                line.page.lines.push(line)
	            })
	            para.page.paragraphs.push(para)
	        })
	    })
	    return page
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	const adapter = __webpack_require__(13)

	let jobCounter = 0;

	module.exports = class TesseractJob {
	    constructor(instance){
	        this.id = 'Job-' + (++jobCounter) + '-' + Math.random().toString(16).slice(3, 8)

	        this._instance = instance;
	        this._resolve = []
	        this._reject = []
	        this._progress = []
	        this._finally = []
	    }

	    then(resolve, reject){
	        if(this._resolve.push){
	            this._resolve.push(resolve) 
	        }else{
	            resolve(this._resolve)
	        }

	        if(reject) this.catch(reject);
	        return this;
	    }
	    catch(reject){
	        if(this._reject.push){
	            this._reject.push(reject) 
	        }else{
	            reject(this._reject)
	        }
	        return this;
	    }
	    progress(fn){
	        this._progress.push(fn)
	        return this;
	    }
	    finally(fn) {
	        this._finally.push(fn)
	        return this;  
	    }
	    _send(action, payload){
	        adapter.sendPacket(this._instance, {
	            jobId: this.id,
	            action: action,
	            payload: payload
	        })
	    }

	    _handle(packet){
	        var data = packet.data;
	        let runFinallyCbs = false;

	        if(packet.status === 'resolve'){
	            if(this._resolve.length === 0) console.log(data);
	            this._resolve.forEach(fn => {
	                var ret = fn(data);
	                if(ret && typeof ret.then == 'function'){
	                    console.warn('TesseractJob instances do not chain like ES6 Promises. To convert it into a real promise, use Promise.resolve.')
	                }
	            })
	            this._resolve = data;
	            this._instance._dequeue()
	            runFinallyCbs = true;
	        }else if(packet.status === 'reject'){
	            if(this._reject.length === 0) console.error(data);
	            this._reject.forEach(fn => fn(data))
	            this._reject = data;
	            this._instance._dequeue()
	            runFinallyCbs = true;
	        }else if(packet.status === 'progress'){
	            this._progress.forEach(fn => fn(data))
	        }else{
	            console.warn('Message type unknown', packet.status)
	        }

	        if (runFinallyCbs) {
	            this._finally.forEach(fn => fn(data));
	        }
	    }
	}


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _domToImage = __webpack_require__(20);

	var _domToImage2 = _interopRequireDefault(_domToImage);

	var _fileSaver = __webpack_require__(21);

	var _fileSaver2 = _interopRequireDefault(_fileSaver);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var InterceptionWeb = function () {
	    function InterceptionWeb() {
	        _classCallCheck(this, InterceptionWeb);

	        console.log("alloyimage", AlloyImage);
	        this.domToImage = _domToImage2.default;
	    }

	    _createClass(InterceptionWeb, [{
	        key: "domToImageLikePng",
	        value: function domToImageLikePng(dom, range) {
	            var _this = this;

	            return new Promise(function (resolve, reject) {

	                _this.domToImage.toPng(dom).then(function (dataUrl) {
	                    var img = new Image();
	                    // const img = $(`<img src=${dataUrl}/>`)
	                    img.src = dataUrl;
	                    document.body.appendChild(img);
	                    resolve(_this.clip(img, range));
	                }).catch(function (error) {
	                    reject(error);
	                });
	            });
	        }
	    }, {
	        key: "domToImageLikeJpeg",
	        value: function domToImageLikeJpeg(dom, range) {
	            var _this2 = this;

	            return new Promise(function (resolve, reject) {
	                _this2.domToImage.toJpeg(dom, { quality: 0.95 }).then(function (dataUrl) {
	                    var img = new Image();
	                    img.src = dataUrl;
	                    resolve(img);
	                }).catch(function (error) {
	                    reject(error);
	                });
	            });
	        }
	    }, {
	        key: "domToImageLikeSvg",
	        value: function domToImageLikeSvg(dom, range) {
	            var _this3 = this;

	            return new Promise(function (resolve, reject) {
	                _this3.domToImage.toSvg(dom).then(function (dataUrl) {
	                    var img = new Image();
	                    img.src = dataUrl;

	                    resolve(img);
	                }).catch(function (error) {
	                    reject(error);
	                });
	            });
	        }
	    }, {
	        key: "clip",
	        value: function clip(dom, range) {
	            if (!range || !range.startX || !range.startY || !range.width || !range.height) {
	                console.log("clip range params exists error");
	            }
	            var base64 = AlloyImage(dom).clip(parseInt(range.startX), parseInt(range.startY), parseInt(range.width), parseInt(range.height)).replace(dom).save("result.png", 0.9);
	            return base64;
	        }
	    }]);

	    return InterceptionWeb;
	}();

	exports.default = InterceptionWeb;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	(function (global) {
	    'use strict';

	    var util = newUtil();
	    var inliner = newInliner();
	    var fontFaces = newFontFaces();
	    var images = newImages();

	    var domtoimage = {
	        toSvg: toSvg,
	        toPng: toPng,
	        toJpeg: toJpeg,
	        toBlob: toBlob,
	        toPixelData: toPixelData,
	        impl: {
	            fontFaces: fontFaces,
	            images: images,
	            util: util,
	            inliner: inliner
	        }
	    };

	    if (true)
	        module.exports = domtoimage;
	    else
	        global.domtoimage = domtoimage;


	    /**
	     * @param {Node} node - The DOM Node object to render
	     * @param {Object} options - Rendering options
	     * @param {Function} options.filter - Should return true if passed node should be included in the output
	     *          (excluding node means excluding it's children as well). Not called on the root node.
	     * @param {String} options.bgcolor - color for the background, any valid CSS color value.
	     * @param {Number} options.width - width to be applied to node before rendering.
	     * @param {Number} options.height - height to be applied to node before rendering.
	     * @param {Object} options.style - an object whose properties to be copied to node's style before rendering.
	     * @param {Number} options.quality - a Number between 0 and 1 indicating image quality (applicable to JPEG only),
	                defaults to 1.0.
	     * @return {Promise} - A promise that is fulfilled with a SVG image data URL
	     * */
	    function toSvg(node, options) {
	        options = options || {};
	        return Promise.resolve(node)
	            .then(function (node) {
	                return cloneNode(node, options.filter, true);
	            })
	            .then(embedFonts)
	            .then(inlineImages)
	            .then(applyOptions)
	            .then(function (clone) {
	                return makeSvgDataUri(clone,
	                    options.width || util.width(node),
	                    options.height || util.height(node)
	                );
	            });

	        function applyOptions(clone) {
	            if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;

	            if (options.width) clone.style.width = options.width + 'px';
	            if (options.height) clone.style.height = options.height + 'px';

	            if (options.style)
	                Object.keys(options.style).forEach(function (property) {
	                    clone.style[property] = options.style[property];
	                });

	            return clone;
	        }
	    }

	    /**
	     * @param {Node} node - The DOM Node object to render
	     * @param {Object} options - Rendering options, @see {@link toSvg}
	     * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.
	     * */
	    function toPixelData(node, options) {
	        return draw(node, options || {})
	            .then(function (canvas) {
	                return canvas.getContext('2d').getImageData(
	                    0,
	                    0,
	                    util.width(node),
	                    util.height(node)
	                ).data;
	            });
	    }

	    /**
	     * @param {Node} node - The DOM Node object to render
	     * @param {Object} options - Rendering options, @see {@link toSvg}
	     * @return {Promise} - A promise that is fulfilled with a PNG image data URL
	     * */
	    function toPng(node, options) {
	        return draw(node, options || {})
	            .then(function (canvas) {
	                return canvas.toDataURL();
	            });
	    }

	    /**
	     * @param {Node} node - The DOM Node object to render
	     * @param {Object} options - Rendering options, @see {@link toSvg}
	     * @return {Promise} - A promise that is fulfilled with a JPEG image data URL
	     * */
	    function toJpeg(node, options) {
	        options = options || {};
	        return draw(node, options)
	            .then(function (canvas) {
	                return canvas.toDataURL('image/jpeg', options.quality || 1.0);
	            });
	    }

	    /**
	     * @param {Node} node - The DOM Node object to render
	     * @param {Object} options - Rendering options, @see {@link toSvg}
	     * @return {Promise} - A promise that is fulfilled with a PNG image blob
	     * */
	    function toBlob(node, options) {
	        return draw(node, options || {})
	            .then(util.canvasToBlob);
	    }

	    function draw(domNode, options) {
	        return toSvg(domNode, options)
	            .then(util.makeImage)
	            .then(util.delay(100))
	            .then(function (image) {
	                var canvas = newCanvas(domNode);
	                canvas.getContext('2d').drawImage(image, 0, 0);
	                return canvas;
	            });

	        function newCanvas(domNode) {
	            var canvas = document.createElement('canvas');
	            canvas.width = options.width || util.width(domNode);
	            canvas.height = options.height || util.height(domNode);

	            if (options.bgcolor) {
	                var ctx = canvas.getContext('2d');
	                ctx.fillStyle = options.bgcolor;
	                ctx.fillRect(0, 0, canvas.width, canvas.height);
	            }

	            return canvas;
	        }
	    }

	    function cloneNode(node, filter, root) {
	        if (!root && filter && !filter(node)) return Promise.resolve();

	        return Promise.resolve(node)
	            .then(makeNodeCopy)
	            .then(function (clone) {
	                return cloneChildren(node, clone, filter);
	            })
	            .then(function (clone) {
	                return processClone(node, clone);
	            });

	        function makeNodeCopy(node) {
	            if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());
	            return node.cloneNode(false);
	        }

	        function cloneChildren(original, clone, filter) {
	            var children = original.childNodes;
	            if (children.length === 0) return Promise.resolve(clone);

	            return cloneChildrenInOrder(clone, util.asArray(children), filter)
	                .then(function () {
	                    return clone;
	                });

	            function cloneChildrenInOrder(parent, children, filter) {
	                var done = Promise.resolve();
	                children.forEach(function (child) {
	                    done = done
	                        .then(function () {
	                            return cloneNode(child, filter);
	                        })
	                        .then(function (childClone) {
	                            if (childClone) parent.appendChild(childClone);
	                        });
	                });
	                return done;
	            }
	        }

	        function processClone(original, clone) {
	            if (!(clone instanceof Element)) return clone;

	            return Promise.resolve()
	                .then(cloneStyle)
	                .then(clonePseudoElements)
	                .then(copyUserInput)
	                .then(fixSvg)
	                .then(function () {
	                    return clone;
	                });

	            function cloneStyle() {
	                copyStyle(window.getComputedStyle(original), clone.style);

	                function copyStyle(source, target) {
	                    if (source.cssText) target.cssText = source.cssText;
	                    else copyProperties(source, target);

	                    function copyProperties(source, target) {
	                        util.asArray(source).forEach(function (name) {
	                            target.setProperty(
	                                name,
	                                source.getPropertyValue(name),
	                                source.getPropertyPriority(name)
	                            );
	                        });
	                    }
	                }
	            }

	            function clonePseudoElements() {
	                [':before', ':after'].forEach(function (element) {
	                    clonePseudoElement(element);
	                });

	                function clonePseudoElement(element) {
	                    var style = window.getComputedStyle(original, element);
	                    var content = style.getPropertyValue('content');

	                    if (content === '' || content === 'none') return;

	                    var className = util.uid();
	                    clone.className = clone.className + ' ' + className;
	                    var styleElement = document.createElement('style');
	                    styleElement.appendChild(formatPseudoElementStyle(className, element, style));
	                    clone.appendChild(styleElement);

	                    function formatPseudoElementStyle(className, element, style) {
	                        var selector = '.' + className + ':' + element;
	                        var cssText = style.cssText ? formatCssText(style) : formatCssProperties(style);
	                        return document.createTextNode(selector + '{' + cssText + '}');

	                        function formatCssText(style) {
	                            var content = style.getPropertyValue('content');
	                            return style.cssText + ' content: ' + content + ';';
	                        }

	                        function formatCssProperties(style) {

	                            return util.asArray(style)
	                                .map(formatProperty)
	                                .join('; ') + ';';

	                            function formatProperty(name) {
	                                return name + ': ' +
	                                    style.getPropertyValue(name) +
	                                    (style.getPropertyPriority(name) ? ' !important' : '');
	                            }
	                        }
	                    }
	                }
	            }

	            function copyUserInput() {
	                if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;
	                if (original instanceof HTMLInputElement) clone.setAttribute("value", original.value);
	            }

	            function fixSvg() {
	                if (!(clone instanceof SVGElement)) return;
	                clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

	                if (!(clone instanceof SVGRectElement)) return;
	                ['width', 'height'].forEach(function (attribute) {
	                    var value = clone.getAttribute(attribute);
	                    if (!value) return;

	                    clone.style.setProperty(attribute, value);
	                });
	            }
	        }
	    }

	    function embedFonts(node) {
	        return fontFaces.resolveAll()
	            .then(function (cssText) {
	                var styleNode = document.createElement('style');
	                node.appendChild(styleNode);
	                styleNode.appendChild(document.createTextNode(cssText));
	                return node;
	            });
	    }

	    function inlineImages(node) {
	        return images.inlineAll(node)
	            .then(function () {
	                return node;
	            });
	    }

	    function makeSvgDataUri(node, width, height) {
	        return Promise.resolve(node)
	            .then(function (node) {
	                node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
	                return new XMLSerializer().serializeToString(node);
	            })
	            .then(util.escapeXhtml)
	            .then(function (xhtml) {
	                return '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + '</foreignObject>';
	            })
	            .then(function (foreignObject) {
	                return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
	                    foreignObject + '</svg>';
	            })
	            .then(function (svg) {
	                return 'data:image/svg+xml;charset=utf-8,' + svg;
	            });
	    }

	    function newUtil() {
	        return {
	            escape: escape,
	            parseExtension: parseExtension,
	            mimeType: mimeType,
	            dataAsUrl: dataAsUrl,
	            isDataUrl: isDataUrl,
	            canvasToBlob: canvasToBlob,
	            resolveUrl: resolveUrl,
	            getAndEncode: getAndEncode,
	            uid: uid(),
	            delay: delay,
	            asArray: asArray,
	            escapeXhtml: escapeXhtml,
	            makeImage: makeImage,
	            width: width,
	            height: height
	        };

	        function mimes() {
	            /*
	             * Only WOFF and EOT mime types for fonts are 'real'
	             * see http://www.iana.org/assignments/media-types/media-types.xhtml
	             */
	            var WOFF = 'application/font-woff';
	            var JPEG = 'image/jpeg';

	            return {
	                'woff': WOFF,
	                'woff2': WOFF,
	                'ttf': 'application/font-truetype',
	                'eot': 'application/vnd.ms-fontobject',
	                'png': 'image/png',
	                'jpg': JPEG,
	                'jpeg': JPEG,
	                'gif': 'image/gif',
	                'tiff': 'image/tiff',
	                'svg': 'image/svg+xml'
	            };
	        }

	        function parseExtension(url) {
	            var match = /\.([^\.\/]*?)$/g.exec(url);
	            if (match) return match[1];
	            else return '';
	        }

	        function mimeType(url) {
	            var extension = parseExtension(url).toLowerCase();
	            return mimes()[extension] || '';
	        }

	        function isDataUrl(url) {
	            return url.search(/^(data:)/) !== -1;
	        }

	        function toBlob(canvas) {
	            return new Promise(function (resolve) {
	                var binaryString = window.atob(canvas.toDataURL().split(',')[1]);
	                var length = binaryString.length;
	                var binaryArray = new Uint8Array(length);

	                for (var i = 0; i < length; i++)
	                    binaryArray[i] = binaryString.charCodeAt(i);

	                resolve(new Blob([binaryArray], {
	                    type: 'image/png'
	                }));
	            });
	        }

	        function canvasToBlob(canvas) {
	            if (canvas.toBlob)
	                return new Promise(function (resolve) {
	                    canvas.toBlob(resolve);
	                });

	            return toBlob(canvas);
	        }

	        function resolveUrl(url, baseUrl) {
	            var doc = document.implementation.createHTMLDocument();
	            var base = doc.createElement('base');
	            doc.head.appendChild(base);
	            var a = doc.createElement('a');
	            doc.body.appendChild(a);
	            base.href = baseUrl;
	            a.href = url;
	            return a.href;
	        }

	        function uid() {
	            var index = 0;

	            return function () {
	                return 'u' + fourRandomChars() + index++;

	                function fourRandomChars() {
	                    /* see http://stackoverflow.com/a/6248722/2519373 */
	                    return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
	                }
	            };
	        }

	        function makeImage(uri) {
	            return new Promise(function (resolve, reject) {
	                var image = new Image();
	                image.onload = function () {
	                    resolve(image);
	                };
	                image.onerror = reject;
	                image.src = uri;
	            });
	        }

	        function getAndEncode(url) {
	            var TIMEOUT = 30000;

	            return new Promise(function (resolve) {
	                var request = new XMLHttpRequest();

	                request.onreadystatechange = done;
	                request.ontimeout = timeout;
	                request.responseType = 'blob';
	                request.timeout = TIMEOUT;
	                request.open('GET', url, true);
	                request.send();

	                function done() {
	                    if (request.readyState !== 4) return;

	                    if (request.status !== 200) {
	                        fail('cannot fetch resource: ' + url + ', status: ' + request.status);
	                        return;
	                    }

	                    var encoder = new FileReader();
	                    encoder.onloadend = function () {
	                        var content = encoder.result.split(/,/)[1];
	                        resolve(content);
	                    };
	                    encoder.readAsDataURL(request.response);
	                }

	                function timeout() {
	                    fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + url);
	                }

	                function fail(message) {
	                    console.error(message);
	                    resolve('');
	                }
	            });
	        }

	        function dataAsUrl(content, type) {
	            return 'data:' + type + ';base64,' + content;
	        }

	        function escape(string) {
	            return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
	        }

	        function delay(ms) {
	            return function (arg) {
	                return new Promise(function (resolve) {
	                    setTimeout(function () {
	                        resolve(arg);
	                    }, ms);
	                });
	            };
	        }

	        function asArray(arrayLike) {
	            var array = [];
	            var length = arrayLike.length;
	            for (var i = 0; i < length; i++) array.push(arrayLike[i]);
	            return array;
	        }

	        function escapeXhtml(string) {
	            return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
	        }

	        function width(node) {
	            var leftBorder = px(node, 'border-left-width');
	            var rightBorder = px(node, 'border-right-width');
	            return node.scrollWidth + leftBorder + rightBorder;
	        }

	        function height(node) {
	            var topBorder = px(node, 'border-top-width');
	            var bottomBorder = px(node, 'border-bottom-width');
	            return node.scrollHeight + topBorder + bottomBorder;
	        }

	        function px(node, styleProperty) {
	            var value = window.getComputedStyle(node).getPropertyValue(styleProperty);
	            return parseFloat(value.replace('px', ''));
	        }
	    }

	    function newInliner() {
	        var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;

	        return {
	            inlineAll: inlineAll,
	            shouldProcess: shouldProcess,
	            impl: {
	                readUrls: readUrls,
	                inline: inline
	            }
	        };

	        function shouldProcess(string) {
	            return string.search(URL_REGEX) !== -1;
	        }

	        function readUrls(string) {
	            var result = [];
	            var match;
	            while ((match = URL_REGEX.exec(string)) !== null) {
	                result.push(match[1]);
	            }
	            return result.filter(function (url) {
	                return !util.isDataUrl(url);
	            });
	        }

	        function inline(string, url, baseUrl, get) {
	            return Promise.resolve(url)
	                .then(function (url) {
	                    return baseUrl ? util.resolveUrl(url, baseUrl) : url;
	                })
	                .then(get || util.getAndEncode)
	                .then(function (data) {
	                    return util.dataAsUrl(data, util.mimeType(url));
	                })
	                .then(function (dataUrl) {
	                    return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3');
	                });

	            function urlAsRegex(url) {
	                return new RegExp('(url\\([\'"]?)(' + util.escape(url) + ')([\'"]?\\))', 'g');
	            }
	        }

	        function inlineAll(string, baseUrl, get) {
	            if (nothingToInline()) return Promise.resolve(string);

	            return Promise.resolve(string)
	                .then(readUrls)
	                .then(function (urls) {
	                    var done = Promise.resolve(string);
	                    urls.forEach(function (url) {
	                        done = done.then(function (string) {
	                            return inline(string, url, baseUrl, get);
	                        });
	                    });
	                    return done;
	                });

	            function nothingToInline() {
	                return !shouldProcess(string);
	            }
	        }
	    }

	    function newFontFaces() {
	        return {
	            resolveAll: resolveAll,
	            impl: {
	                readAll: readAll
	            }
	        };

	        function resolveAll() {
	            return readAll(document)
	                .then(function (webFonts) {
	                    return Promise.all(
	                        webFonts.map(function (webFont) {
	                            return webFont.resolve();
	                        })
	                    );
	                })
	                .then(function (cssStrings) {
	                    return cssStrings.join('\n');
	                });
	        }

	        function readAll() {
	            return Promise.resolve(util.asArray(document.styleSheets))
	                .then(getCssRules)
	                .then(selectWebFontRules)
	                .then(function (rules) {
	                    return rules.map(newWebFont);
	                });

	            function selectWebFontRules(cssRules) {
	                return cssRules
	                    .filter(function (rule) {
	                        return rule.type === CSSRule.FONT_FACE_RULE;
	                    })
	                    .filter(function (rule) {
	                        return inliner.shouldProcess(rule.style.getPropertyValue('src'));
	                    });
	            }

	            function getCssRules(styleSheets) {
	                var cssRules = [];
	                styleSheets.forEach(function (sheet) {
	                    try {
	                        util.asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));
	                    } catch (e) {
	                        console.log('Error while reading CSS rules from ' + sheet.href, e.toString());
	                    }
	                });
	                return cssRules;
	            }

	            function newWebFont(webFontRule) {
	                return {
	                    resolve: function resolve() {
	                        var baseUrl = (webFontRule.parentStyleSheet || {}).href;
	                        return inliner.inlineAll(webFontRule.cssText, baseUrl);
	                    },
	                    src: function () {
	                        return webFontRule.style.getPropertyValue('src');
	                    }
	                };
	            }
	        }
	    }

	    function newImages() {
	        return {
	            inlineAll: inlineAll,
	            impl: {
	                newImage: newImage
	            }
	        };

	        function newImage(element) {
	            return {
	                inline: inline
	            };

	            function inline(get) {
	                if (util.isDataUrl(element.src)) return Promise.resolve();

	                return Promise.resolve(element.src)
	                    .then(get || util.getAndEncode)
	                    .then(function (data) {
	                        return util.dataAsUrl(data, util.mimeType(element.src));
	                    })
	                    .then(function (dataUrl) {
	                        return new Promise(function (resolve, reject) {
	                            element.onload = resolve;
	                            element.onerror = reject;
	                            element.src = dataUrl;
	                        });
	                    });
	            }
	        }

	        function inlineAll(node) {
	            if (!(node instanceof Element)) return Promise.resolve(node);

	            return inlineBackground(node)
	                .then(function () {
	                    if (node instanceof HTMLImageElement)
	                        return newImage(node).inline();
	                    else
	                        return Promise.all(
	                            util.asArray(node.childNodes).map(function (child) {
	                                return inlineAll(child);
	                            })
	                        );
	                });

	            function inlineBackground(node) {
	                var background = node.style.getPropertyValue('background');

	                if (!background) return Promise.resolve(node);

	                return inliner.inlineAll(background)
	                    .then(function (inlined) {
	                        node.style.setProperty(
	                            'background',
	                            inlined,
	                            node.style.getPropertyPriority('background')
	                        );
	                    })
	                    .then(function () {
	                        return node;
	                    });
	            }
	        }
	    }
	})(this);


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
	 * A saveAs() FileSaver implementation.
	 * 1.3.2
	 * 2016-06-16 18:25:19
	 *
	 * By Eli Grey, http://eligrey.com
	 * License: MIT
	 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
	 */

	/*global self */
	/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

	/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

	var saveAs = saveAs || (function(view) {
		"use strict";
		// IE <10 is explicitly unsupported
		if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
			return;
		}
		var
			  doc = view.document
			  // only get URL when necessary in case Blob.js hasn't overridden it yet
			, get_URL = function() {
				return view.URL || view.webkitURL || view;
			}
			, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
			, can_use_save_link = "download" in save_link
			, click = function(node) {
				var event = new MouseEvent("click");
				node.dispatchEvent(event);
			}
			, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
			, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
			, throw_outside = function(ex) {
				(view.setImmediate || view.setTimeout)(function() {
					throw ex;
				}, 0);
			}
			, force_saveable_type = "application/octet-stream"
			// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
			, arbitrary_revoke_timeout = 1000 * 40 // in ms
			, revoke = function(file) {
				var revoker = function() {
					if (typeof file === "string") { // file is an object URL
						get_URL().revokeObjectURL(file);
					} else { // file is a File
						file.remove();
					}
				};
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
			, dispatch = function(filesaver, event_types, event) {
				event_types = [].concat(event_types);
				var i = event_types.length;
				while (i--) {
					var listener = filesaver["on" + event_types[i]];
					if (typeof listener === "function") {
						try {
							listener.call(filesaver, event || filesaver);
						} catch (ex) {
							throw_outside(ex);
						}
					}
				}
			}
			, auto_bom = function(blob) {
				// prepend BOM for UTF-8 XML and text/* types (including HTML)
				// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
				if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
					return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
				}
				return blob;
			}
			, FileSaver = function(blob, name, no_auto_bom) {
				if (!no_auto_bom) {
					blob = auto_bom(blob);
				}
				// First try a.download, then web filesystem, then object URLs
				var
					  filesaver = this
					, type = blob.type
					, force = type === force_saveable_type
					, object_url
					, dispatch_all = function() {
						dispatch(filesaver, "writestart progress write writeend".split(" "));
					}
					// on any filesys errors revert to saving with object URLs
					, fs_error = function() {
						if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
							// Safari doesn't allow downloading of blob urls
							var reader = new FileReader();
							reader.onloadend = function() {
								var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
								var popup = view.open(url, '_blank');
								if(!popup) view.location.href = url;
								url=undefined; // release reference before dispatching
								filesaver.readyState = filesaver.DONE;
								dispatch_all();
							};
							reader.readAsDataURL(blob);
							filesaver.readyState = filesaver.INIT;
							return;
						}
						// don't create more object URLs than needed
						if (!object_url) {
							object_url = get_URL().createObjectURL(blob);
						}
						if (force) {
							view.location.href = object_url;
						} else {
							var opened = view.open(object_url, "_blank");
							if (!opened) {
								// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
								view.location.href = object_url;
							}
						}
						filesaver.readyState = filesaver.DONE;
						dispatch_all();
						revoke(object_url);
					}
				;
				filesaver.readyState = filesaver.INIT;

				if (can_use_save_link) {
					object_url = get_URL().createObjectURL(blob);
					setTimeout(function() {
						save_link.href = object_url;
						save_link.download = name;
						click(save_link);
						dispatch_all();
						revoke(object_url);
						filesaver.readyState = filesaver.DONE;
					});
					return;
				}

				fs_error();
			}
			, FS_proto = FileSaver.prototype
			, saveAs = function(blob, name, no_auto_bom) {
				return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
			}
		;
		// IE 10+ (native saveAs)
		if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
			return function(blob, name, no_auto_bom) {
				name = name || blob.name || "download";

				if (!no_auto_bom) {
					blob = auto_bom(blob);
				}
				return navigator.msSaveOrOpenBlob(blob, name);
			};
		}

		FS_proto.abort = function(){};
		FS_proto.readyState = FS_proto.INIT = 0;
		FS_proto.WRITING = 1;
		FS_proto.DONE = 2;

		FS_proto.error =
		FS_proto.onwritestart =
		FS_proto.onprogress =
		FS_proto.onwrite =
		FS_proto.onabort =
		FS_proto.onerror =
		FS_proto.onwriteend =
			null;

		return saveAs;
	}(
		   typeof self !== "undefined" && self
		|| typeof window !== "undefined" && window
		|| this.content
	));
	// `self` is undefined in Firefox for Android content script context
	// while `this` is nsIContentFrameMessageManager
	// with an attribute `content` that corresponds to the window

	if (typeof module !== "undefined" && module.exports) {
	  module.exports.saveAs = saveAs;
	} else if (("function" !== "undefined" && __webpack_require__(22) !== null) && (__webpack_require__(23) !== null)) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    return saveAs;
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 23 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _config = __webpack_require__(10);

	var _config2 = _interopRequireDefault(_config);

	var _Point = __webpack_require__(25);

	var _Point2 = _interopRequireDefault(_Point);

	var _PointCloud = __webpack_require__(26);

	var _PointCloud2 = _interopRequireDefault(_PointCloud);

	var _Util = __webpack_require__(27);

	var _Util2 = _interopRequireDefault(_Util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PDollarRecognizer = function () {
	    function PDollarRecognizer() {
	        _classCallCheck(this, PDollarRecognizer);

	        this.config = _config2.default.inputType;
	        var NumPointClouds = 4;
	        this.PointClouds = new Array(NumPointClouds);
	        this.subPoints = new Array(4);
	        this.PointClouds[0] = new _PointCloud2.default({ name: "31", points: new Array(new _Point2.default(100, 0, 1), new _Point2.default(0, 100, 1), new _Point2.default(100, 0, 2), new _Point2.default(200, 100, 2), new _Point2.default(100, 0, 3), new _Point2.default(0, 300, 3)) });
	        this.PointClouds[1] = new _PointCloud2.default({ name: "41", points: new Array(new _Point2.default(100, 0, 1), new _Point2.default(0, 300, 1), new _Point2.default(0, 200, 2), new _Point2.default(100, 300, 2), new _Point2.default(200, 200, 2)) });
	        this.PointClouds[2] = new _PointCloud2.default({ name: "20", points: new Array(new _Point2.default(0, 0, 1), new _Point2.default(100, 100, 1), new _Point2.default(200, 200, 1), new _Point2.default(200, 0, 2), new _Point2.default(100, 100, 2), new _Point2.default(0, 200, 2)) });
	        var pai = 100 * Math.sqrt(2);
	        this.PointClouds[3] = new _PointCloud2.default({ name: "10", points: new Array(new _Point2.default(0, 100, 1), new _Point2.default(100 - pai, 100 + pai, 1), new _Point2.default(100, 200, 1), new _Point2.default(100 + pai, 100 + pai, 1), new _Point2.default(200, 100, 1), new _Point2.default(100 + pai, 100 - pai, 1), new _Point2.default(100, 0, 1), new _Point2.default(100 - pai, 100 - pai, 1)) });

	        this.subPoints[0] = new _PointCloud2.default({ name: "01", points: new Array(new _Point2.default(100, 0, 1), new _Point2.default(0, 100, 1)) });
	        this.subPoints[1] = new _PointCloud2.default({ name: "02", points: new Array(new _Point2.default(0, 0, 1), new _Point2.default(100, 100, 1)) });
	        this.subPoints[2] = new _PointCloud2.default({ name: "03", points: new Array(new _Point2.default(0, 0, 1), new _Point2.default(0, 100, 1)) });
	        this.subPoints[3] = new _PointCloud2.default({ name: "circle", points: new Array(new _Point2.default(0, 100, 1), new _Point2.default(100 - pai, 100 + pai, 1), new _Point2.default(100, 200, 1), new _Point2.default(100 + pai, 100 + pai, 1), new _Point2.default(200, 100, 1), new _Point2.default(100 + pai, 100 - pai, 1), new _Point2.default(100, 0, 1), new _Point2.default(100 - pai, 100 - pai, 1)) });
	    }

	    _createClass(PDollarRecognizer, [{
	        key: "Recognize",
	        value: function Recognize(points) {
	            var _this = this;

	            var filteredPoints = this.filterSignleEdge(points);
	            var clouds = this.splitCloudBySpaceRange(filteredPoints);
	            var results = new Array();
	            clouds.forEach(function (cloud) {
	                var result = "";

	                if (cloud.length < 2) {
	                    result = {
	                        Score: 0,
	                        Name: "无效序列",
	                        type: "0",
	                        path: cloud,
	                        domPath: "",
	                        label: ""
	                    };
	                } else {
	                    result = _this.recognizeSingle(cloud);
	                }

	                results.push(result);
	            });
	            return results;
	        }
	    }, {
	        key: "recognizeSingle",
	        value: function recognizeSingle(points) {
	            var pointCloud = new _PointCloud2.default({ name: "未知", points: points }).points;
	            var b = +Infinity;
	            var u = -1;
	            for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
	            {
	                var d = _Util2.default.getInstance().GreedyCloudMatch(pointCloud, this.PointClouds[i]);
	                if (d < b) {
	                    b = d; // best (least) distance
	                    u = i; // point-cloud
	                }
	            }
	            var result = u === -1 ? { Name: "No match.", Score: 0, type: "0" } : Object.assign({ path: points, type: "2" }, { Name: this.PointClouds[u].name, Score: Math.max((2.5 - b) / 2.5, 0) });
	            return result;
	        }
	    }, {
	        key: "recognizeSingleEdge",
	        value: function recognizeSingleEdge(points) {
	            var pointCloud = new _PointCloud2.default({ name: "未知", points: points }).points;
	            var b = +Infinity;
	            var u = -1;
	            for (var i = 0; i < this.subPoints.length; i++) // for each point-cloud template
	            {
	                var d = _Util2.default.getInstance().GreedyCloudMatch(pointCloud, this.subPoints[i]);
	                if (d < b) {
	                    b = d; // best (least) distance
	                    u = i; // point-cloud
	                }
	            }
	            var result = u == -1 ? { Name: "No match.", Score: 0 } : Object.assign({ path: this.subPoints[u].originPoints }, { Name: this.subPoints[u].name, Score: Math.max((2.5 - b) / 2.5, 0.0) });
	            return result;
	        }
	    }, {
	        key: "filterSignleEdge",
	        value: function filterSignleEdge(points) {
	            var _this2 = this;

	            var edges = this.splitByEdge(points);
	            var results = edges.filter(function (item) {
	                var result = _this2.recognizeSingleEdge(item);
	                if (result.Score > 0.001) {
	                    return true;
	                }
	                return false;
	            });
	            return this.mergeEdgesToCLouds(results);
	        }
	    }, {
	        key: "mergeEdgesToCLouds",
	        value: function mergeEdgesToCLouds(cloudsByEdge) {
	            var clouds = cloudsByEdge.reduce(function (prev, curr) {
	                return prev.concat(curr);
	            }, []);
	            return clouds;
	        }
	    }, {
	        key: "splitCloudBySpaceRange",
	        value: function splitCloudBySpaceRange(points) {
	            var _this3 = this;

	            var edges = this.splitByEdge(points);

	            var clouds = new Array();
	            var index = 0;
	            edges.reduce(function (prev, curr) {
	                if (!prev) {
	                    clouds[index] = new Array();
	                    clouds[index].push(curr);
	                    return curr;
	                }
	                var canMerged = false;
	                clouds[index].forEach(function (item) {
	                    if (_Util2.default.getInstance().isConnected(item, curr)) {
	                        canMerged = true;
	                    }
	                });

	                if (canMerged) {
	                    clouds[index].push(curr);
	                } else {
	                    index++;
	                    clouds[index] = new Array();
	                    clouds[index].push(curr);
	                }
	                return curr;
	            }, null);
	            var result = clouds.map(function (item) {
	                return _this3.mergeEdgesToCLouds(item);
	            });
	            return result;
	        }
	    }, {
	        key: "splitByEdge",
	        value: function splitByEdge(points) {
	            var edges = new Array();
	            var index = 0;
	            points.reduce(function (prev, next) {
	                if (!prev) {
	                    edges[index] = new Array();
	                    edges[index].push(next);
	                    return next;
	                }

	                if (prev.ID === next.ID) {
	                    edges[index].push(next);
	                } else {
	                    index++;
	                    edges[index] = new Array();
	                    edges[index].push(next);
	                }
	                return next;
	            }, null);
	            return edges;
	        }
	    }]);

	    return PDollarRecognizer;
	}();

	exports.default = PDollarRecognizer;

/***/ },
/* 25 */
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Point = __webpack_require__(25);

	var _Point2 = _interopRequireDefault(_Point);

	var _Util = __webpack_require__(27);

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
/* 27 */
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
	        key: "isConnected",
	        value: function isConnected(points1, points2) {
	            var rule = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

	            var radius1 = this.getRange(points1).outerRadius;
	            var radius2 = this.getRange(points2).outerRadius;
	            var minDis = this.cloudMinDistance(points1, points2);
	            var minRadius = Math.min(radius1, radius2);

	            if (minRadius * rule > minDis) {
	                return true;
	            }
	            return false;
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
	        key: "cloudMinDistance",
	        value: function cloudMinDistance(points1, points2) {
	            var _this = this;

	            var minDis = +Infinity;
	            points1.forEach(function (preItem) {
	                points2.forEach(function (backItem) {
	                    if (_this.Distance(preItem, backItem) < minDis) {
	                        minDis = _this.Distance(preItem, backItem);
	                    }
	                });
	            });
	            return minDis;
	        }
	    }, {
	        key: "getRange",
	        value: function getRange(points) {
	            var maxDistance = 0;
	            var minDistance = +Infinity;
	            var maxDisPointPair = null;
	            var minDisPointPair = null;
	            var length = points.length;

	            for (var index = 0; index < length - 1; index++) {
	                for (var next = index + 1; next < length; next++) {
	                    var curDistance = this.Distance(points[index], points[next]);
	                    if (curDistance > maxDistance) {
	                        maxDistance = curDistance;
	                        maxDisPointPair = [points[index], points[next]];
	                    }
	                    if (curDistance < minDistance) {
	                        minDistance = curDistance;
	                        minDisPointPair = [points[index], points[next]];
	                    }
	                }
	            }

	            if (!maxDisPointPair && !minDisPointPair) {
	                return null;
	            } else {
	                return {
	                    "outerRadius": maxDistance / 2,
	                    "innerRadius": minDistance / 2,
	                    "innerCentroid": this.centroidOfTwoPoint(minDisPointPair[0], minDisPointPair[1]),
	                    "outerCentroid": this.centroidOfTwoPoint(maxDisPointPair[0], maxDisPointPair[1]),
	                    "startX": Math.min(maxDisPointPair[0].X, maxDisPointPair[1].X),
	                    "startY": Math.min(maxDisPointPair[0].Y, maxDisPointPair[1].Y),
	                    "width": Math.abs(maxDisPointPair[0].X - minDisPointPair[1].X),
	                    "height": Math.abs(maxDisPointPair[0].Y - minDisPointPair[1].Y)
	                };
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
	        key: "centroidOfTwoPoint",
	        value: function centroidOfTwoPoint(p1, p2) {
	            var dx = (p2.X + p1.X) / 2;
	            var dy = (p2.Y + p1.Y) / 2;
	            return { "x": dx, "y": dy };
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
/* 28 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "background.html";

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "popup.html";

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvMTI4LnBuZyI7"

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvMTYucG5nIjs="

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvMzIucG5nIjs="

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvNjQucG5nIjs="

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = "data:image/jpeg;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvYmFja2dyb3VuZC5qcGciOw=="

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvaXRlbS5wbmciOw=="

/***/ }
]);