/**
 * jquery-pinterestV3.2
 * 可传默认参数:
 * liCount:20,
 * width:200,  如果不传宽度,则默认三列,宽度自适应
 * column:3,	 
 * borderRadius:4
 * borderColor:'deepskyblue',
 * borderWidth:2,
 * borderStyle:'solid',
 * images:[],  可传图片路径数组  或者只传一个路径,所有图片名称格式需要一致(名称+索引值+拓展名)
 * imagesNumber,  图片数量
 * loop=true, 图片是否无限添加
 */
//用执行函数传出jQuery参数,防止$符号与其他插件冲突
//自执行函数前后加;号,防止与其他插件产生语法冲突
;(function($){ 
	$.fn.extend({
		pinterest : function(options){
			var colsArr = lis = [],
			wh = num = imgNum = cols = liWidth= spanNum = 0,
			gap = 5,
			pinterest = $(this),
			spanTimer = null,
			scrollBol = true,
			reg1 = /\d+\.(jpg|png|jpeg|bmp|gif)/,
			reg2 = /\.(jpg|png|jpeg|bmp|gif)/;
			var loading = $('<div class="loading">Loading<span>.</span><span>.</span><span>.</span><span>.</span></div>');
			var defaults = {
				liCount:10,
				width:200,
				column:3,
				borderRadius:0,
				borderColor:'deepskyblue',
				borderWidth:0,
				borderStyle:'solid',
				imagesNumber:1,
				loop:true
			}
			var _defaults = $.extend({},defaults,options);
			if(options.images){
				var src = _defaults.images
				var a = src.slice(0,reg1.exec(_defaults.images).index);
				var b = reg2.exec(_defaults.images)[0];
			}
			pinterest.css('width',document.documentElement.clientWidth);
			getColumns();
			_run(_defaults.liCount);
			$(window).scroll(function(){
				if(!scrollBol)return false;
				var st = document.body.scrollTop;
				var sh = document.body.scrollHeight;
				var ch = document.documentElement.clientHeight || document.body.clientHeight;
				if(st>=sh-ch)_run(_defaults.liCount);
			})
			$(window).resize(function(){
				pinterest.css('width',document.documentElement.clientWidth);
				changeColumns();
				if(options.width){
					getColumns();
				}else{
					pinterest.find('li').css('transitionDuration','0s');
					liWidth = pinterest.innerWidth()/cols;
					pinterest.find('img').width(liWidth-gap);
					for(var i=0;i<cols;i++){
						colsArr[i] = 0;
					}
				}
				for(var i=0;i<lis.length;i++){
					lis[i].height(lis[i].find('img').height());
					setPosition(lis[i]);
				}
			})
			function rand(min,max){
				return parseInt(Math.random()*(max-min))+min;
			}
			function createLi(){
				var img = $('<img/>');
				if(options.images){
					if(options.imagesNumber){
						imgNum++;
						img.attr('src',a+imgNum+b);
						if(imgNum>=options.imagesNumber){
							if(_defaults.loop){
								imgNum=0;
							}else{
								$('.loading').hide();
								clearInterval(spanTimer);
								scrollBol=false;
							}
						}
					}else if(options.images instanceof Array){
						var n = rand(0,_defaults.images.length);
						img.attr('src',_defaults.images[n]);
					}else{
						img.attr('src',_defaults.images);
					}
				}
				img.width(liWidth-10);
				var li = $('<li/>').css({
					borderRadius:_defaults.borderRadius,
					borderColor:_defaults.borderColor,
					borderWidth:_defaults.borderWidth,
					borderStyle:_defaults.borderStyle
				});
				lis.push(li);
				li.append(img).appendTo(pinterest);
				img[0].onload = function(){
					$(this).parent().height($(this).height());
					num++;
					if(num%_defaults.liCount==0){
						$('.loading').hide();
						clearInterval(spanTimer);
						for(var i=0;i<_defaults.liCount;i++){
							setPosition(lis[num-_defaults.liCount+i]);
						}
					}
				}
			}
			function changeColumns(){
				if(pinterest.outerWidth()<=500){
					cols = _defaults.column/2;
					pinterest.css('borderWidth',10);
					gap = 5;
				}else{
					cols = _defaults.column;
					pinterest.css('borderWidth',20);
					gap = 10;
				}
			}
			function getColumns(){
				colsArr = [];
				if(options.width){
					cols = parseInt(pinterest.innerWidth()/_defaults.width);
				}else{
					changeColumns();
				}
				for(var i=0;i<cols;i++){
					colsArr[i] = 0;
				}
			}
			function setPosition(ele){
				var minIndex = 0;
				var minHeight = colsArr[minIndex];
				for(var i=0;i<colsArr.length;i++){
					if(minHeight>colsArr[i]){
						minHeight = colsArr[i];
						minIndex = i;
					}
				}
				ele.css({
					top:colsArr[minIndex],
					left:minIndex*(ele.width()+cols*gap/(cols-1))
				})
				colsArr[minIndex] += ele.height()+cols*gap/(cols-1);
				pinterest.css('height',Math.max.apply(Math,colsArr)+document.documentElement.clientHeight/3);
			}
			function _run(val){
				val = val?val:30;
				loading.appendTo(pinterest).show()
				.css({
					top:Math.max.apply(Math,colsArr)+50
				})
				spanTimer = setInterval(function(){
					$('.loading>span').css('color','black')
					$('.loading>span').eq(spanNum).css('color','#DADF00')
					spanNum++;
					if(spanNum>$('.loading>span').length)spanNum=0;
				},200)
				liWidth = pinterest.innerWidth()/cols;
				for(var i=0;i<val;i++){
					if(imgNum>=options.imagesNumber)break;
					createLi();
				}
			}
		}
	})
}(jQuery));