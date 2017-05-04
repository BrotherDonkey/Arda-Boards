'use strict'

var txtBox = $('.Custom-Text-Area');
txtBox.keydown(function(e){
    var that = this;
    setTimeout(function(){
        $("p.msg").html(that.value.replace(/\n/g,"<br />"));
    }, 10);
});