export default class FiberNode {
  constructor(item, sibling, parent) {
    this.instance = item;
    this.firstChild = null;
    this.sibling = sibling;
    this.parent = parent;
  }
}
