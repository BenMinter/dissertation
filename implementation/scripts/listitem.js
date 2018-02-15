/**
  Creates UI component based on information given to it, to display a media list item.
  @param id - An id related to the object used as id for HTML component.
  @param title - A title used in the HTML (displayed to the user)
*/

class ListItem {
  constructor(id,title){
    this.title = title;
    this.id = id;
  }

  /**
  * @param cls - the class to give the list item.
  * @param clsid - clsid used to specify onclick function.
  * @param img - optional image src, obtained from YouTube API. Could be refactored to be more general.
  */

  getHTML(cls, clsid, img){
    let click = (clsid == "queue") ? `onclick="playSong(\'`+this.id+`\')"`:``;
    return `<div class='` + cls + `'>
        <a href='#' id='`+this.id+`' class='list-group-item list-group-item-action `+clsid+`' ` + click + ` style='display:inline-block;white-space:nowrap;max-height:128px;'>`
        + (img ? `<div class='img' style='display:inline-block'>
            <img class='thumbnail' src='https://img.youtube.com/vi/` + this.id + `/0.jpg' />
          </div>` : ``) +
          ` <div id='item-title'>` + this.title + `</div>
        </a>
      </div>`;
  }
}
