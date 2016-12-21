var GRID_STYLE = "GRID";
var LIST_STYLE = "LIST";
var PAGE_NO = 1;
var product_list = "";

// 存储过往操作的黑白名单，在填补空白时对product_list中的商品进行过滤
var WHITE_LIST = [];
var BLACK_LIST = [];

// 不同的笔迹类型
var SIGN_WHITE = "SIGN_WHITE";	// 大圈
var SIGN_BLACK = "SIGN_BLACK";	// 大叉

//根据插件页面发出的消息进行回应
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// 根据黑白名单对页面dom元素进行重排序，并利用API返回的商品列表进行页面空白补全
    if (request.command == "filter") {
    	//filterDom(request);
    	//getProductListAndFilter(request);

    	sendResponse({result: "filtering done"});
    }
    // 获取异步API调用的返回值：商品列表
    if (request.command == "product_list") {
    	product_list = $.parseJSON(request.list).tbk_item_get_response.results.n_tbk_item;
    }
});

/*
 * 供识别模块进行调用
 * 根据识别出的大圈大叉的dom元素对页面进行过滤
 * 若无用于填补空白的商品列表，则调用API获取
 */
function filter(containerDivList, imgDivList, typeList) {
	if (product_list == "") {
		console.debug("calling API to get product list ...");

		// 获得当前页面商品排序方式
		//var sorts = $('li.sort');

		requestForProductList();

		// 等待异步API调用的返回结果
		setTimeout(function() {
			console.debug(product_list);

			filterDom(containerDivList, imgDivList, typeList);
		}, 1000);
	}
	else {
		// 已获取商品列表，直接过滤
		filterDom(containerDivList, imgDivList, typeList);
	}
}

/*
 * 对当前页面直接执行重排序操作
 */
function filterDom(containerDivList, imgDivList, typeList) {
	// var white_id_list = request.white;
	// var black_id_list = request.black;
	
	// console.debug(white_id_list);
	// console.debug(black_id_list);

	var page_style = getPageStyle();

	for (var i = 0; i < containerDivList.length; i++) {
		var cur_item = containerDivList[i];
		var cur_img = imgDivList[i];
		var cur_type = typeList[i];

		var cur_id = getProductIdFromImg(cur_img);
		if (cur_id == "")
			continue;

		// 大叉，黑名单，直接删除商品，并填补造成的页面空缺
		if (cur_type == SIGN_BLACK) {
			updateItem(cur_item, cur_id);

			if ($('#' + cur_id).length > 0) {
				$('#' + cur_id).remove();
				BLACK_LIST.push(cur_id);

				fillInBlank(page_style);
			}
		}
		// 将白名单内商品排列到最前
		else if (cur_type == SIGN_WHITE) {
			// 当前商品列表第一个元素，将白名单商品添加在其前即可
			var first_product = getFirstProduct(page_style);

			updateItem(cur_item, cur_id);

			if ($('#' + cur_id).length > 0) {
				$('#' + cur_id).insertBefore(first_product);
				WHITE_LIST.push(cur_id);

				// 新开标签页，显示该商品的商品详情
				createTab(cur_img.parentNode.href);
			}
		}
	}

	//////////////////////////////////////////

	// 将黑名单内商品直接删除，并填补造成的页面空缺
	// for (var i = 0; i < black_id_list.length; i++) {
	// 	var cur_id = black_id_list[i];

	// 	if (cur_id == "")
	// 		continue;

	// 	var item = updateItemByProductId(cur_id, page_style);

	// 	if ($('#' + cur_id).length > 0) {
	// 		$('#' + cur_id).remove();
	// 		BLACK_LIST.push(cur_id);

	// 		fillInBlank(page_style);
	// 	}
	// }

	// 当前商品列表第一个元素，将白名单商品添加在其前即可
	//var first_product = getFirstProduct(page_style);

	// 将白名单内商品按序排列到最前
	// for (var i = 0; i < white_id_list.length; i++) {
	// 	var cur_id = white_id_list[i];

	// 	if (cur_id == "")
	// 		continue;

	// 	// 更新该商品id对应的dom元素
	// 	var item = updateItemByProductId(cur_id, page_style);

	// 	if ($('#' + cur_id).length > 0) {
	// 		$('#' + cur_id).insertBefore(first_product);
	// 		WHITE_LIST.push(cur_id);

	// 		// 新开标签页，显示该商品的商品详情
	// 		var target_url = getTargetURL(cur_id, page_style);
	// 		createTab(target_url);
	// 	}
	// }

	// console.debug(WHITE_LIST);
	// console.debug(BLACK_LIST);
}

/*
 * 根据图片dom元素获取商品id
 */
function getProductIdFromImg(imgDom) {
	var href = imgDom.parentNode.href;
	if (href == undefined || href == null) {
		return "";
	}

	var id = href.match(/id=([^&]*)&/);
	if (id == null) {
		return "";
	}

	return id[1];
}

/*
 * 根据商品id更新该商品所在dom元素
   增加id属性；增加背景色样式
 */
function updateItem(item, p_id) {
	item.id = p_id;
	item.style.backgroundColor = "#FFCCCC";
}

/*
 * 填补页面空缺
 */
function fillInBlank(page_style) {
	// 当前商品列表最后一个元素，将新商品添加在其后即可
	var lastProduct = getLastProduct(page_style);
	console.debug(lastProduct);

	var newProduct = getNewProduct();

	// 替换商品信息
	var item = lastProduct.clone();
	if (page_style == GRID_STYLE) {
		var pic_inner_box = item.children().eq(0).children().children();
		var icon_msg = item.children().eq(1).children();

		// 删除“找同款”  “找相似”
		pic_inner_box.eq(2).remove();
		pic_inner_box.eq(1).remove();

		// 替换商品图片和链接
		var a = pic_inner_box.children().eq(0);
		a[0].href = newProduct.item_url;
		a[0].id = "J_Itemlist_PLink_" + newProduct.num_iid;
		a[0].search = "?id=" + newProduct.num_iid;
		
		var img = a.children().eq(0);
		img[0].id = "J_Itemlist_Pic_" + newProduct.num_iid;
		img[0].src = newProduct.pict_url;
		img[0].currentSrc = newProduct.pict_url;
		img[0].alt = newProduct.title;

		// 删除天猫，保险理赔，旺旺等信息
		icon_msg.eq(3).remove();

		// 替换价格信息
		var price = icon_msg.eq(0).children().eq(0).children().eq(1);
		price[0].textContent = newProduct.zk_final_price;

		// 替换销量信息
		var volume = icon_msg.eq(0).children().eq(1);
		volume[0].textContent = newProduct.volume + "人付款";

		// 替换标题信息
		var title = icon_msg.eq(1).children();
		title[0].search = "?id=" + newProduct.num_iid;
		title[0].id = "J_Itemlist_TLink_" + newProduct.num_iid;
		title[0].href = newProduct.item_url;
		title[0].textContent = newProduct.title;

		// 替换店铺信息
		var shop = icon_msg.eq(2).children().eq(0).children();
		shop[0].search = "?user_number_id=" + newProduct.seller_id;
		shop[0].href = "https://store.taobao.com/shop/view_shop.htm?user_number_id=" + newProduct.seller_id;
		var shop_name = shop.children().eq(1);
		shop_name[0].textContent = newProduct.nick;
		shop.bind("mouseover",function(e){   
        	return false;   
    	});

		// 替换地址信息
		var location = icon_msg.eq(2).children().eq(1);
		location[0].textContent = newProduct.provcity;

		lastProduct.after(item);
	}
	else {
		var pic_box = item.children().eq(0).children().children();

		// 删除“找同款”  “找相似”
		pic_box.children().eq(2).remove();
		pic_box.children().eq(1).remove();

		// 替换商品图片和链接
		var a = pic_box.children().children().eq(0);
		a[0].href = newProduct.item_url;
		a[0].id = "J_Itemlist_PLink_" + newProduct.num_iid;
		a[0].search = "?id=" + newProduct.num_iid;
		
		var img = a.children().eq(0);
		img[0].id = "J_Itemlist_Pic_" + newProduct.num_iid;
		img[0].src = newProduct.pict_url;
		img[0].currentSrc = newProduct.pict_url;
		img[0].alt = newProduct.title;
		img.bind("mouseover",function(e){   
        	return false;   
    	});

		item.children().eq(2).children().eq(1).remove();

		// 替换价格信息
		var price = item.children().eq(2).children().eq(0);
		// 删除包邮信息
		price.children().eq(1).remove();
		price.children().eq(0).children()[1].textContent = newProduct.zk_final_price;

		// 删除评论数信息
		item.children().eq(3).children().eq(1).remove();

		// 替换销量信息
		var volume = item.children().eq(3).children();
		volume[0].textContent = newProduct.volume + "人付款";

		var icon_msg = item.children().eq(1).children();

		// 替换标题信息
		var title = icon_msg.eq(0).children();
		title[0].search = "?id=" + newProduct.num_iid;
		title[0].id = "J_Itemlist_TLink_" + newProduct.num_iid;
		title[0].href = newProduct.item_url;
		title[0].textContent = newProduct.title;

		// 替换店铺信息
		var shop = icon_msg.eq(2).children().eq(0).children();
		shop[0].search = "?user_number_id=" + newProduct.seller_id;
		shop[0].href = "https://store.taobao.com/shop/view_shop.htm?user_number_id=" + newProduct.seller_id;
		var shop_name = shop.children().eq(1);
		shop_name[0].textContent = newProduct.nick;
		shop.bind("mouseover",function(e){   
        	return false;   
    	});

		// 替换地址信息
		var location = icon_msg.eq(2).children().eq(2);
		location[0].textContent = newProduct.provcity;

		// 删除运费险等信息
		item.children().eq(4).remove();
		icon_msg.eq(1).children().remove();
		icon_msg.eq(2).children().eq(1).children().remove();

		lastProduct.after(item);
	}
}

/*
 * 从商品列表中获取填充的下一个商品
 */
function getNewProduct() {
	while (true) {
		var product = product_list.shift();
		console.debug(product);
		var test = false;

		// 商品列表为空，调用API取下一页商品
		if (product == undefined) {
			PAGE_NO++;
			requestForProductList();

			// 等待异步API调用的返回结果
			setTimeout(function() {
				console.debug(product_list);
				product = product_list.shift();

				if (checkProduct(product)) {
					return product;
				}
			}, 1000);
		}
		else {
			if (checkProduct(product)) {
				return product;
			}
		}
	}
}

/*
 * 检测商品是否可填充：不与页面已有商品重复；不是黑白名单商品
 */
function checkProduct(product) {
	var numiid = product.num_iid;

	// 是否是黑白名单商品
	if ($.inArray(numiid, WHITE_LIST) != -1 || $.inArray(numiid, BLACK_LIST) != -1) {
		return false;
	}

	// 是否与页面其他商品重复
	var item;

	if (getPageStyle() == GRID_STYLE) {
		var a_id = "J_Itemlist_PLink_" + numiid;
		item = $('#' + a_id);
	}
	else {
		item = $('a[data-nid="' + numiid +'"]').eq(0);
	}

	if (item.length > 0) {
		return false;
	}

	return true;
}

/*
 * 获取当前页面显示方式：网格 OR 列表
 */
function getPageStyle() {
	var grid_class = $('div.styles ul li')[0].childNodes[1].classList;
	
	var cur_style;
	if ($.inArray("active", grid_class) != -1) {
		cur_style = GRID_STYLE;
	}
	else {
		cur_style = LIST_STYLE;
	}

	console.debug("current page style: " + cur_style);
	return cur_style;
}

/*
 * 返回当前页面列表中第一个商品dom元素
 */
function getFirstProduct(page_style) {
	if (page_style == GRID_STYLE) {
		return $('div.item.J_MouserOnverReq').eq(0);
	}
	else {
		return $('div.item.g-clearfix').eq(0);
	}
}

/*
 * 返回当前页面列表中最后一个商品dom元素
 */
function getLastProduct(page_style) {
	var container;
	if (page_style == GRID_STYLE) {
		container = $('div.item.J_MouserOnverReq');
	}
	else {
		container = $('div.item.g-clearfix');
	}

	return container.eq(container.length - 1);
}

/*
 * 根据商品id更新该商品所在dom元素
   增加id属性；增加边框样式
 */
// function updateItemByProductId(id, page_style) {
// 	var item;

// 	if (page_style == GRID_STYLE) {
// 		var a_id = "J_Itemlist_PLink_" + id;
// 		item = $('#' + a_id).parent().parent().parent().parent();
// 	}
// 	else {
// 		var a = $('a[data-nid="' + id +'"]').eq(0);
// 		item = a.parent().parent().parent().parent().parent();
// 	}
	

// 	item.attr("id",id);
// 	item.css("background-color", "#FFCCCC");	
// 	return item;
// }

/*
 * 根据商品id获取其详情页面URL
 */
// function getTargetURL(id, page_style) {
// 	var item;

// 	if (page_style == GRID_STYLE) {
// 		var a_id = "J_Itemlist_PLink_" + id;
// 		item = $('#' + a_id);
// 	}
// 	else {
// 		item = $('a[data-nid="' + id +'"]').eq(0);
// 	}
	
	
// 	return item[0].href;
// }

/*
 * 与popup页面通信，以实现新开标签页
 */
function createTab(url) {
	chrome.runtime.sendMessage({command: "createTab", target: url}, function(response) {
		console.log(response.result);
	});
}

/*
 * 与background页面通信，发送请求以根据当前页面URL获取完整商品列表
 */
function requestForProductList() {
	// 获得当前页面URL
	var page_url = $(document)[0].URL;
	console.debug(page_url);

	chrome.runtime.sendMessage({command: "getProductList", url: page_url, page_no: PAGE_NO}, function(response) {
		
	});
}