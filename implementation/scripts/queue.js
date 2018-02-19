/**
* Class to manage the multiple queues and lists in this project.
* @param queue - Takes an optional initialisation queue.
*/

class Queue{

  constructor(queue = []){ this.queue = queue; }
  addItem(id,title){ this.queue.push({id:id,title:title}); }

  //Safe removal function
  removeItem(id = 0){
    if(id != 0)
      for(let item in this.queue)
        if(this.queue[item].id==id)
          id = item;
    this.queue.splice(id,1);
  }

  //Check if an item exists within the queue
  exists(id){
    for(let item in this.queue)
      if(this.queue[item].id == id)
        return true;
    return false;
  }

  getData(){return this.queue;}
  getHead(){return (this.queue.length>=1) ? this.queue[0] : null}
}
