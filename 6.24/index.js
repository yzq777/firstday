
  var untilEvent = {
  addEvent:function(element,type,hander){
              if(element.addEventListener){
                element.addEventListener(type,hander,false);
              }else if(element.attachEvent){
                element.attachEvent('on'+type,hander);
              }else{
                element['on'+type] = hander;
              }
            },
  getEvent:function(event){
    return event?event:window.event;
  },
  getTarget:function(event){
    return event.target||event.srcElement;
  },
  getRelated:function(event){
    if(event.relatedTarget){
      //兼容DOM的浏览器将相关元素保持在relatedTarget属性中
      return event.relatedTarget;
    }else if(event.toElement){
      //在IE浏览器中mouseout事件的相关元素保存在toElement属性中
      return event.toElement;
    }else if(event.fromElement){
      //在IE浏览器中mouseover事件的相关元素保持在fromElement属性中
      return event.fromElement;
    }else{
      return null;
    }
  }

};
//下面这四个元素用于表示四个定时器的标识，最开始我只使用两个定时器，当快速移动时
//动画会乱。
var timeDec1,timeAdd1,timeAdd2,timeDec2;//定时器标识
function getOuter(){
  var outer = document.getElementById('outer');
  untilEvent.addEvent(outer,'mouseover',callBackOver);
  untilEvent.addEvent(outer,'mouseout',callBackOut);
}
//mouseout事件：当鼠标从一个元素移入另一个元素时在鼠标离开的那个元素
//上触发，获得鼠标的元素可能在失去鼠标元素的外部也可能在失去鼠标元素的
//内部.所以需要判断mouseout事件的相关元素是否为外部li（即id为outerList或id为outerList2）元素
//的子孙元素，如果是子孙元素，则内部无序列表无须收起。
function callBackOut(event){
  var event = untilEvent.getEvent(event);
  var relatedTarget = untilEvent.getRelated(event);
  var outerList1 = document.getElementById('outerList1');
  var inter1 = document.getElementById('inter1');
  var outerList2 = document.getElementById('outerList2');
  var inter2 = document.getElementById('inter2');
  var flag1 = false,flag2 = false;
  if(relatedTarget !== null){
    var parented = relatedTarget.parentNode;
    do{
      if(parented === outerList1 || relatedTarget === outerList1){
        flag1 = true;
        break;
      }else if(parented === outerList2 || relatedTarget === outerList2){
        flag2 = true;
        break;
      }else{
        parented = parented.parentNode;
      }
    }while(parented !== null);
  }
  if(!flag1){
    var str1 = 'flag1';
    changeHeightDec(inter1,timeAdd1,str1);
  }
  if(!flag2){
    var str2 = 'flag2';
    changeHeightDec(inter2,timeAdd2,str2);
  }
}
function changeHeightDec(element,timer,flag){
  var offHeight = 70;
  var inverTimer = 10;
  clearTimeout(timer);
  change();
  function change(){
    var height = parseInt(element.style.height);
    if(!height)height = 0;
    if(height > 0){
      if(height - offHeight > 0){
      element.style.height = height - offHeight +'px';
      }else{
        element.style.height = 0+'px';
      }
      if(flag === 'flag1'){
       timeDec1= setTimeout(change,inverTimer);
      }else{
        timeDec2 = setTimeout(change,inverTimer);
      }
    }
  }
}
function callBackOver(event){
  var event = untilEvent.getEvent(event);
  var target = untilEvent.getTarget(event);
  var inter1 = document.getElementById('inter1');
  var inter2 = document.getElementById('inter2');
  if(target.id == 'outerList1' || target.id == "link1"){
    var str1 = "flag1";
    changeHeight(inter1,timeDec1,str1);
  }
  if(target.id == 'outerList2' || target.id == 'link2'){
    var str2 = "flag2";
    changeHeight(inter2,timeDec2,str2);
  }
}
function changeHeight(element,timer,flag){
  var totalHeight = 160;
  var inverHeight = 10;
  var inverTimer = 10;
  clearTimeout(timer);
  //当鼠标移入时清除让内部ul长度减小的定时器，保证鼠标移入后
  //内部ul长度立即增加
  change();
  function change(){
    var height = parseInt(element.style.height);
    if(!height) height = 0;
    if(height < totalHeight){
      if(height + inverHeight > totalHeight){
        element.style.height = totalHeight + "px";
      }else{
        element.style.height = height + inverHeight +'px';
      }
      if(flag === 'flag1'){
        timeAdd1 = setTimeout(change,inverTimer);
        }else{
          timeAdd2 = setTimeout(change,inverTimer);
        }
    }
  }
}
untilEvent.addEvent(window,'load',getOuter);