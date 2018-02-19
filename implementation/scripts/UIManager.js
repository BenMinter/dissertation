/**
* Class which handles all JavaScript HTML updates.
*/

class UIManager{
  constructor(){

  }

  buildUIFromList(elId,list,cls,clsid,img){
    let html = "";
    //update Queue length on UI
    $("#queueTab").html("Queue ("+queueList.queue.length+")");
    for( let i = 0; i < list.queue.length; i++ )
      html += new ListItem(list.queue[i].id,list.queue[i].title).getHTML(cls,clsid,img);
    $("#" + elId).html(html);
  }

  updateUIforWidth(){
    if($(window).width() < 992 ){
      $("#searchTab").show();
      $("#recommendationsTab").show();
      $("#search").appendTo("#tabContents");
      $("#recommendations").appendTo("#tabContents");
    }else{
      $("#searchTab").hide();
      $("#recommendationsTab").hide();
      $("#search").appendTo("#right");
      $("#recommendations").appendTo("#left");
      $(".tab-pane").removeClass("active");
      $(".nav-link").removeClass("active");
      $("#queue").addClass("active");
      $("#queueTab").addClass("active");
    }
  }

  updateTabNums(id,list,){

  }

}
