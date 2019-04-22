import FiberNode from './FiberNode';

function createNodeAndLink(parent, children) {
  //[c1, c2, c3] .... accessing array from right
  // c3 -> to react Fibre Node sibling null, return is parent return c3 fibre as previous
  //
  parent.firstChild = children.reduceRight((childAsFiberNode, child) => {
    const node = new FiberNode(child);
    node.parent = parent;
    node.sibling = childAsFiberNode;
    return node;
  }, null);

  return parent.firstChild;
}

function linkAndGetFirstChild(node, linkCallback){
  const elements = node.instance.render();
  const firstChild = elements ? createNodeAndLink(node, elements) : null;
  linkCallback && linkCallback(node);
  return firstChild;
}

function getParentSibling(root,currentNode, postOrderTraversal){
  while (!currentNode.sibling) {
    const {parent} = currentNode;
    if (!parent || parent === root) return;
    postOrderTraversal && postOrderTraversal(currentNode);
    currentNode = parent; // climbing back up (bubble Phase)
  }
  // parent sibling might set here (chithapa) (while loop helps us) or sibling itself
  postOrderTraversal && postOrderTraversal(currentNode);
  return currentNode.sibling;
}

function processNodeAndGetNext(root, currentNode, preOrderTraversal,postOrderTraversal){
  let firstChild  = linkAndGetFirstChild(currentNode, preOrderTraversal);

  if (firstChild) return firstChild; // dept first search, (child -> child -> null)
  if (currentNode === root) return; // traverse completed

  // bubbling phase, Back up (for no child and No sibling
  // loop to climb up till we find a parent with sibling (chithapa)
  if(currentNode.sibling){
    postOrderTraversal && postOrderTraversal(currentNode);
    return currentNode.sibling;
  }

  return getParentSibling(root, currentNode, postOrderTraversal);
}


export default class ChangesTree {
  constructor(instance, data){
    // attach render will return instance of the node
    const nodeNames = Object.keys(data);
    nodeNames.forEach((nodeName)=>{
      const node = data[nodeName];
      node.render = ()=>{ // attach render Method to instance
        if(!node.children){
          return null;
        }
        return node.children.map((child)=>{
          return data[child];
        })
      }
    });

    this.rootNode = new FiberNode(data[instance]);
  }
}

ChangesTree.prototype.traverse = function(preOrderTraversal, postOrderTraversal, callback){
  let {rootNode, currentNode} = this;
  currentNode = currentNode ? currentNode : rootNode;

  while (true) {
    currentNode = processNodeAndGetNext(rootNode,currentNode, preOrderTraversal, postOrderTraversal);
    if(!currentNode){
      callback && callback();
      return;
    }
  }
};

ChangesTree.prototype.traverseOneNode = function(){
  let {rootNode, currentNode} = this;
  currentNode = currentNode ? currentNode : rootNode;
  this.currentNode = processNodeAndGetNext(rootNode,currentNode); // end of traverse will return undef
  return this.currentNode;


};