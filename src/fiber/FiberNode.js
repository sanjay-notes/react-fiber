export default class FiberNode {
  constructor(item) {
    this.instance = item;
    this.firstChild = null;
    this.sibling = null;
    this.parent = null;
    this.flag = false;
    this.updateQueue = [];
  }
}