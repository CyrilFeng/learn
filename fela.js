Fela = {
		
	queryKeys: [],
	data: {},
	initTab: function() {
 
		$.ajaxSetup({
			"cache": false
		});
		var _this = this;
		this.data.start = this.start;
		this.data.limit = this.limit;
		$.ajax({
			type: "get",
			url: this.url,
			data: this.data,
			async: false,
			success: function(data) {
				_this.response = data;
			}
		});

		return this;
	},
	offsetTop:0,
	offsetLeft:0,
	url: "",
	interval: 10,
	cur: 1,
	start: 0,
	limit: 10,
	IDColName: "id",
	firstClass: "",
	headers: [],
	keys: [],
	response: {},
	showToolbar: true,
	showCheckbox: true,
	initModal: function() {
		$("body").append("<div id='modal' style='z-index:999;display:none;position:absolute;top:0px;left:0px;width:100%;height:100%;background-color:black;opacity:0.2;filter:alpha(opacity=20);'></div>");
	},
	closeWin:function(){
		$('#tmpwin').remove();
		$('#modal').hide();
	},
	createWin: function(w, h, name, src) {
		$("#modal").height($(document).height());
		$("#modal").show();

		$("body").append("<div id='tmpwin' style='z-index:999;position:absolute;top:200px;left:200px;width:" + w + "px;height:" + h + "px;background-color:white;border:solid 3px #F20C00'><div style='width:100%;height:25px;background-color:#F20C00;color:white;position:relative;'><div style='position:absolute;top:2px;right:7px;cursor:pointer;' onclick=\"$('#tmpwin').remove();$('#modal').hide();\">[关闭]</div><div style='position:absolute;top:2px;left:7px;'>" + name + "</div></div><iframe frameborder='none' style='border:0px;width:100%;height:" + (h - 27) + "px;' src='" + src + "'> </div>");
		$("#tmpwin").css("top", $(window).scrollTop() + ($(window).height() - $("#tmpwin").height()) / 2-this.offsetTop);
		$("#tmpwin").css("left", ($(window).width() - $("#tmpwin").width()) / 2-this.offsetLeft);
		window.onresize = function() {
			$("#tmpwin").css("top", $(window).scrollTop() + ($(window).height() - $("#tmpwin").height()) / 2-this.offsetTop);
			$("#tmpwin").css("left", ($(window).width() - $("#tmpwin").width()) / 2-this.offsetLeft);

		};
	},
	dynaPaging: function(c, id) {

		this.cur = c.text();
		this.start = (this.cur - 1) * this.limit;
		$("#" + id + " a").removeClass("curnum");
		$(c).addClass("curnum");
		this.data.start = this.start;
		this.data.limit = this.limit;
		var _this = this;
		$.ajax({
			type: "get",
			url: this.url,
			data: this.data,
			async: false,
			success: function(data) {
				_this.response = data;
			}
		});

		this.generateTable($("#" + id).prev("div").attr("id"));

	},
	tbar: function(parent4Append, o) {
		$(parent4Append).append('<div class="table_top clearfix"><div class="btn_group left"></div></div>');
		var count=0;
		for(var i in o){
			count++;
		}
		
		var c = 0;
		for (var i in o) {
			c++;
			if (c ==count) {
				var tmp = $("<a href='javascript:void(0)' class='last'>" + i + "</a>");
				tmp.bind("click", o[i]);
				$(parent4Append + " .btn_group.left").append(tmp);
			} else {
				var tmp = $("<a href='javascript:void(0)'>" + i + "</a>");
				tmp.bind("click", o[i]);
				$(parent4Append + " .btn_group.left").append(tmp);
			}
		}


	},
	nextPaging: function(id) {
		if (this.cur == this.totalPage()) return;
		this.cur++;
		this.start = (this.cur - 1) * this.limit;
		this.calcPaging(id);
		this.data.start = this.start;
		this.data.limit = this.limit;
		var _this = this;
		$.ajax({
			type: "get",
			url: this.url,
			data: this.data,
			async: false,
			success: function(data) {
				_this.response = data;
			}
		});

		this.generateTable($("#" + id).prev("div").attr("id"));
	},
	prevPaging: function(id) {
		if (this.cur == 1) return;
		this.cur--;
		this.start = (this.cur - 1) * this.limit;
		this.calcPaging(id);
		this.data.start = this.start;
		this.data.limit = this.limit;
		var _this = this;
		$.ajax({
			type: "get",
			url: this.url,
			data: this.data,
			async: false,
			success: function(data) {
				_this.response = data;
			}
		});

		this.generateTable($("#" + id).prev("div").attr("id"));
	},
	totalPage: function() {
		var pages = parseInt(this.response.total / this.limit) + 1;
		if (this.response.total % this.limit == 0) pages = this.response.total / this.limit;
		return pages;

	},
	totalPagingPage: function() {
		var pages = this.totalPage();
		var pagingpages = parseInt(pages / this.interval) + 1;
		if (pages % this.interval == 0) pagingpages = pages / this.interval;
		return pagingpages;

	},
	cp: function(id) {
		return this.calcPaging(id);
	},
	calcPaging: function(id) {
		var _this = this;
		$("#" + id).empty();
		var pages = this.totalPage();
		var lThreshold = parseInt((this.cur - 1) / this.interval) * this.interval + 1;
		var l = $('<a href="javascript:void(0)" class="prev">上一页</a>');
		l.bind("click", function() {
			_this.prevPaging(id);
		});
		$("#" + id).append(l);

		for (var i = lThreshold; i < lThreshold + Math.min(pages - lThreshold + 1, this.interval); i++) {

			if (this.cur == i) {
				var s = $('<a href="javascript:void(0)" class="num curnum">' + i + '</a>');
				s.bind("click", function() {
					_this.dynaPaging($(this), id);
				});
				$("#" + id).append(s);
			} else {
				var s = $('<a href="javascript:void(0)" class="num">' + i + '</a>');
				s.bind("click", function() {

					_this.dynaPaging($(this), id);
				});
				$("#" + id).append(s);
			}


		}
		var r = $('<a href="javascript:void(0)" class="next">下一页</a>');
		r.bind("click", function() {
			_this.nextPaging(id);
		});

		$("#" + id).append(r);
		return this;
	},
	gc: function(parent4Append, className, id) {
		return this.generateContainer(parent4Append, className, id);
	},
	gf: function() {
		return this.generateFix();
	},
	generateFix: function() {
		$("body").append('<div class="clearfix"></div><div class="h20"></div>');
		return this;

	},
	generateContainer: function(parent4Append, className, id) {

		$(parent4Append).append("<div class='" + className + "' id=" + id + "></div>");
		return this;
	},
	selectedRows:function(id){
	 	var arr=new Array();
   	 $("#"+id+" input[id]:checked").each(function(){
   		arr.push($(this).prop("id"));
   	 });
   	 return arr;
	},
	toggle: function(c, id) {
		if (c.checked) {
			$("#" + id + " input:checkbox").each(function() {
				$(this).prop("checked", true);
			});

		} else {
			$("#" + id + " input:checkbox").each(function() {
				$(this).prop("checked", false);
			});
		}
	},
	gt: function(id) {
		return this.generateTable(id);
	},
	replace: function(k, v) {
		return v;
	},
	generateTable: function(id) {
		var _this = this;
		var s = '<table width="100%" cellpadding="0" cellspacing="0"><tr>';
		var ins = this.instance;
		if (this.showCheckbox) s += '<th width="40px"><input type="checkbox" ></th>';
		for (var i = 0; i < this.headers.length; i++)
		s += ' <th><span>' + this.headers[i] + '</span><span class="sort"><a href="javascript:void(0)" class="arrow arrow_up"></a> <a href="javascript:void(0)" class="arrow arrow_down"></a> </span></th>';
		if (this.showToolbar) s += '<th>&nbsp;</th>';
		s += "</tr>";

		for (var i = 0; i < this.response.rows.length; i++) {
			s += '<tr>';
			if (this.showCheckbox) s += '<td><input  id=' + this.response.rows[i][this.IDColName] + ' type="checkbox" /></td>';
			s += '<td class=' + this.firstClass + '>' + this.replace(this.keys[0],this.response.rows[i][this.keys[0]]) + '</td>';
			for (var j = 1; j < this.keys.length; j++) {
				s += '<td>' + this.replace(this.keys[j], this.response.rows[i][this.keys[j]]) + '</td>';
			}
			if (this.showToolbar) s += '<td class="operate"><a href="javascript:void(0)"  class="write"></a><a href="javascript:void(0)" class="delete"  ></a></td>';
			s += '</tr>';

		}
		s += '</table>';
		$("#" + id).html(s);
		$("#" + id + " tr:gt(0)").click(

				function(e) {
            e.stopPropagation();
		 	_this.doRowClick($(this).children(":eq(0)").children("input").attr("id"));
 

				});
		if (this.showToolbar) {
			$("#" + id + " .write").click(

			function() {
				_this.doEdit($(this).parent().parent().children(":eq(0)").children("input").attr("id"));

			});
			$("#" + id + " .delete").click(

			function() {
				_this.doDelete($(this).parent().parent().children(":eq(0)").children("input").attr("id"));

			});

		}

		if (this.showCheckbox) {

			$("#" + id + " table tr:first>th:first>:checkbox").click(

			function() {
				_this.toggle(this, id);

			});

		}


		$("#" + id + " tr:even").addClass("even");

		$("#" + id + " tr:odd").addClass("odd");
		$("#" + id + " tr").mouseover(function() {
			$(this).removeClass("even odd");
			$(this).toggleClass("d");
		});
		$("#" + id + "  .arrow.arrow_up").click(function() {

			for (var i = 0; i < _this.headers.length; i++) {
				if (_this.headers[i] == $(this).parent().prev().text()) {
					_this.cur = 1;
					_this.start = 0;
					_this.data.start = _this.start;
					_this.data.limit = _this.limit;

					_this.data.sort = _this.keys[i];
					_this.data.dir = "ASC";

					$.ajax({
						type: "get",
						url: _this.url,
						data: _this.data,
						async: false,
						success: function(data) {
							_this.response = data;
						}
					});

					_this.generateTable(id);
					_this.calcPaging($("#" + id).next("div").attr("id"));
					break;
				}
			}

		});
		$("#" + id + "  .arrow.arrow_down").click(function() {

			for (var i = 0; i < _this.headers.length; i++) {
				if (_this.headers[i] == $(this).parent().prev().text()) {
					_this.cur = 1;
					_this.start = 0;
					_this.data.start = _this.start;
					_this.data.limit = _this.limit;

					_this.data.sort = _this.keys[i];
					_this.data.dir = "DESC";

					$.ajax({
						type: "get",
						url: _this.url,
						data: _this.data,
						async: false,
						success: function(data) {
							_this.response = data;
						}
					});

					_this.generateTable(id);
					_this.calcPaging($("#" + id).next("div").attr("id"));
					break;
				}
			}

		});
		$("#" + id + " tr").mouseout(function() {
			$(this).toggleClass("d");
			$("tr:even").addClass("even");;
			$("tr:odd").addClass("odd");
		});
		return this;
	},
	doRowClick:function(id){
 
	},
	doEdit: function(id) {

	},
	doDelete: function(id) {

	},
	clone: function() {
		var n = {};
		for (var o in this) n[o] = this[o];
		return n;
	},
	query: function(id) {
		this.preDeal();
		this.cur = 1;
		this.start = 0;
		this.data.start = this.start;
		this.data.limit = this.limit;
		for (var n in this.queryKeys)
		this.data[this.queryKeys[n]] = $("#" + this.queryKeys[n]).val();

		var _this = this;
		$.ajax({
			type: "get",
			url: this.url,
			data: this.data,
			async: false,
			success: function(data) {
				_this.response = data;
			}
		});

		this.generateTable(id);
		this.calcPaging($("#" + id).next("div").attr("id"));
		this.postDeal();
	},
	initParam: function() {

	},
	refresh:function(id){
	this.reset(id);
	},
	reset: function(id) {
		this.initParam();
		for (var i = 0; i < this.queryKeys.length; i++) {
			var type = $("#" + this.queryKeys[i]).attr("type");
			if (type == "text" || type == "hidden") {
				$("#" + this.queryKeys[i]).val("");
			}
			if (typeof type == "undefined") {
				$("#" + this.queryKeys[i]).children("option:first")[0].selected = true;
			}
		}

		delete this.data;
		this.data = {};
		this.cur = 1;
		this.start = 0;
		this.data.start = this.start;
		this.data.limit = this.limit;
		var _this = this;
		$.ajax({
			type: "get",
			url: this.url,
			data: this.data,
			async: false,
			success: function(data) {
				_this.response = data;
			}
		});

		this.generateTable(id);
		this.calcPaging($("#" + id).next("div").attr("id"));

	},
	preDeal:function(){
		
		
	},
	postDeal:function(){
		
	},
	initEnter:function(id){
		var _this = this;
		$(document).keydown(function(e) {
			if (e.keyCode == 13) {
				_this.query(id);
	 	}

		});
	},
	onceExe: function(id) {
		this.initModal();
		this.initEnter(id);
	 
		$(".term.clearfix .arrow.arrow_up").click(function() {

			if ($(this).hasClass("arrow_up")) {
				$(this).removeClass("arrow_up").addClass("arrow_down");
				$(".term.clearfix").css("height", "auto");

			} else {
				$(this).removeClass("arrow_down").addClass("arrow_up");
				$(".term.clearfix").css({
					"height": "32px",
					"padding-bottom": "10px"
				});

			}
		});

	}
};