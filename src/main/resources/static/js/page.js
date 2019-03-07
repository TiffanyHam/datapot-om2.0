(function () {
    $.fn.CustomPage = function (config) {
        // 默认配置

        var defaults = {
            pageId:"page",
            pageSize: 10,
            more:false,
            count: 100,
            current: 1,
            prevDes: "<",
            nextDes: ">",
            firstPage:"<<",
            lastPage:">>",
            updateSelf: true,
            callback: null
        };
        
        this.oConfig = null;
        // 插件配置合并
        this.oConfig = $.extend(defaults, config);
      
        var self = this;
        
        // 初始化函数
        var init = function () {
            // 初始化数据
            updateConfig(self.oConfig);
            // 事件绑定
            bindEvent();
        };
        // 更新方法
        var updateConfig = function (config) {
            typeof config.count !== 'undefined' ? self.count = config.count : self.count = self.oConfig.count;
            typeof config.pageSize !== 'undefined' ? self.pageSize = config.pageSize : self.pageSize = self.oConfig.pageSize;
            typeof config.current !== 'undefined' ? self.current = config.current : self.current = self.oConfig.current;
            self.pageCount = Math.ceil(self.count / self.pageSize);
            format();
        };
        var format = function () {
            var current = self.current;
            var count = self.pageCount;
            if(count == 0){
            	$('#' + self.oConfig.pageId).css('display','none');
            }else{
            	$('#' + self.oConfig.pageId).css('display','block');
            }
            var html = '<div class="page-container"><ul>';
            if (current >= 1)
            	isClickNum == 1 ? html += '<li class="page-item page-first page-action-text co">'+ self.oConfig.firstPage + '</li>' : html += '<li class="page-item page-first page-action-text">'+ self.oConfig.firstPage + '</li>';
                isClickNum == 2 ? html += '<li class="page-item page-prev page-action-text co">'+ self.oConfig.prevDes + '</li>' : html += '<li class="page-item page-prev page-action-text">'+ self.oConfig.prevDes + '</li>';
                
            var start = 1;
            var end = count;
            if (count > 10) {
                if (current <= 8) {
                    start = 1;
                    end = 10;
                } else if (current >= count - 1) {
                    start = count - 9;
                    end = count;
                } else {
                    start = current - 8;
                    end = current + 1;
                }
            }
            for (var i = start; i <= end; i++) {
                html += getItem(i);
            }
            
            if (current <= count)
            	isClickNum == 3 ? html += '<li class="page-item page-next page-action-text co">'+ self.oConfig.nextDes + '</li>' : html += '<li class="page-item page-next page-action-text">'+ self.oConfig.nextDes + '</li>';
            	isClickNum == 4 ? html += '<li class="page-item page-last page-action-text co">'+ self.oConfig.lastPage + '</li>' : html += '<li class="page-item page-last page-action-text">'+ self.oConfig.lastPage + '</li>';
                //html += '<li class="page-item page-last page-action-text"><img src="/static/img/back_four.png"></li>';
                html += '</ul></div>';
                html += '<div class="records">共<span>'+self.count+'</span>条记录</div>';
                self.html(html);
                
        };
        var getItem = function (i) {
            var item = '';
            var current = (i == self.current);
            item += '<li class="page-item" data-page="' + i + '">';
            if (current) {
                item += '<span class="page-text-current">' + i + '</span></li>';
            } else {
                item += '<span class="page-text">' + i + '</span></li>';
            }
            return item;
        };
       //点击事件
        var isClickNum = 0;
        var bindEvent = function () {
            self.on('click', '.page-item', function () {
                var current;
                //var count = self.pageCount;
                /*翻页箭头*/
                if ($(this).hasClass('page-prev')) {
                    current = Math.max(1, self.current - 1);
                   // isClickNum = 2;
                    if (current == 1){
                    	isClickNum = 2;
                    } else {
                    	isClickNum = 0;
                    }
                } else if ($(this).hasClass('page-next')) {
                    current = Math.min(self.pageCount, parseInt(self.current) + 1);
                    if (self.pageCount == current){
                    	isClickNum = 3;
                    } else {
                    	isClickNum = 0;
                    }
                    
                } else {
                    current = parseInt($(this).data('page'));
                    isClickNum = 0;
                }


                  /*首页箭头*/
               if ($(this).hasClass('page-first')) {
                   current = Math.max(1, self.current - (self.current + 1));
                   isClickNum = 1;
                }
                /*尾页箭头*/
                if ($(this).hasClass('page-last')) {
                   current = Math.min(self.pageCount);
                   isClickNum = 4;
                } 
            
                if(self.oConfig.more){
                	self.oConfig.callback && self.oConfig.callback(current,self.oConfig.pageId);
                }else{
                	self.oConfig.callback && self.oConfig.callback(current);
                }
                
                if (self.oConfig.updateSelf) {
                    self.current = current;
                    format();
                }
 
            })
        };
        // 启动
        init();
        //对外提供更新方法
        this.update = function (config) {
            updateConfig(config);
        };
        // 链式调用
        return self;
    };
})(jQuery, window);
