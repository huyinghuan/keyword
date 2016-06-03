var multipleIncludeJs = function(page, jsArray, done) {
    if (jsArray.length === 0) {
        done();
        return;
    }

    var url = jsArray.shift();
    page.includeJs(url, function(){
        multipleIncludeJs(page, jsArray, done);
    });
}

var searchEngine = 'https://baidu.com/'

var page = require('webpage').create();
//打开百度
page.open(searchEngine, function(status) {
  //注入zepto
  multipleIncludeJs(page, ['z.js', 'data.js'], function(){
    page.evaluate(function() {
      //页面执行 搜索操作， 然后点击搜索按钮
      console.log(window._m_keyword)
      $("#kw").val("雪中悍刀行");
      $("#su").click();
    });
  });
});

var _p_targetUrl = "www.23wx.com";


var findTarget = false;
//等待页面跳转
page.onUrlChanged = function(targetUrl) {
  if(isFirstPage(targetUrl)){return}
  if(!findTarget){
    //这个时候 执行无效
    multipleIncludeJs(page, ['z.js', 'data.js'], function(){
      page.evaluate(function() {
        var arr = $('a.c-showurl');
        for(var i = 0, len = arr.length; i < len; i++){
          var current = $(arr[i]);
          var currentLink = current.text();
          if(currentLink.indexOf("www.23wx.com") != -1){
            console.log('find_it')
            var url = current.parents('.c-container').find("h3 a").attr('href');
            console.log(url)
            if(window._cumulativeOffset){
              console.log(window._cumulativeOffset(current.parents('.c-container')[0]).top)
            }
            //console.log(current.parents('.c-container').find("h3 a")[0].innerHTML) //.click()
            return;
          }
        }
        //TODO next Page
      });
    });
  }
};
var isFirstPage = function(url){
  return url == 'https://www.baidu.com/'|| url == 'https://www.baidu.com'
}
page.onConsoleMessage = function(msg) {
  if(isFirstPage(page.url)){
    if(typeof(msg) == 'string'){console.log(msg)}
    return
  }
  console.log(msg)
  if(msg == 'find_it'){
    findTarget = true;
  }
  if(msg.indexOf("link?url=") != -1){
    console.log(msg)
    page.open(msg, function(status){
      console.log(status)
      page.render('img/hello'+Date.now()+'.png')
    });
  }
  
};
page.onPageCreated = function(newPage) {
  console.log('A new child page was created! Its requested URL is not yet available, though.');
  // Decorate
  newPage.onClosing = function(closingPage) {
    console.log('A child page is closing: ' + closingPage.url);
  };
};