export default class FiberNode {
  constructor(item, sibling, parent) {
    this.instance = item;
    this.firstChild = null;
    this.sibling = sibling;
    this.parent = parent;
    this.flag = false;
    this.updateQueue = [];
  }

}

FiberNode.prototype.reset = function(){
  this.firstChild = null;
  this.sibling = null;
  this.parent = null;
  this.flag = false;
  this.updateQueue = [];
}