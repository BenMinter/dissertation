class Queue {


  constructor(){
    this.QUEUE = [];

  }


  addItem(data){
    this.QUEUE[data.id] = data;
  }

  removeItem(id){
    this.QUEUE.splice(id,1);
  }

  


}
