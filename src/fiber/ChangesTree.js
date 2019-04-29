import FiberNode from './FiberNode';

function linkElements(parent, children) {
  parent.firstChild = children.reduceRight((sibling, child) => {
    const node = new FiberNode(child, sibling, parent);
    return node;
  }, null);
  return parent.firstChild;
}

function render(node){
  return node.instance.render();
}

function getFirstChild(node, elements,preOrder){
  if(!elements){
    return null;
  }
  const firstChild = elements ? linkElements(node, elements) : null;
  preOrder && preOrder(node);
  return firstChild;
}

function getParentSibling(root, node, postOrder){
  while (!node.sibling) {
    const {parent} = node;
    if (!parent || parent === root) return;
    postOrder && postOrder(node);
    node = parent;
  }
  return getSibling(node, postOrder);
}

function getSibling(node, postOrder){
  node.sibling && postOrder && postOrder();
  return node.sibling;
}

function getNextNode(root, node, preOrder,postOrder){
  if (node === root) return; // traverse completed
  if (node === null) node = root;

  const elements = render(node);

  let firstChild  = getFirstChild(node,elements, preOrder);
  if (firstChild) return firstChild; // dept first search, (child -> child -> null)

  let sibling = getSibling(node, postOrder);
  if(sibling) return sibling;

  return getParentSibling(root, node.parent, postOrder);
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
    this.currentNode = null;
  }
}

ChangesTree.prototype.traverse = function(preOrder, postOrder, callback){
  let {rootNode, currentNode} = this;

  while (true) {
    currentNode = getNextNode(rootNode,currentNode, preOrder, postOrder);
    if(!currentNode){
      callback && callback();
      return;
    }
  }
};

ChangesTree.prototype.traverseOneNode = function(){
  let {rootNode, currentNode} = this;
  this.currentNode = getNextNode(rootNode,currentNode); // end of traverse will return undef
  return this.currentNode;
};



ChangesTree.prototype.traverseEachStep = function(node){
  let {rootNode} = this;
  let currentNode;

  const elements = render(node);

  currentNode  = getFirstChild(node, elements);
  if (currentNode) return currentNode;

  currentNode = getSibling(node);
  if (currentNode) return currentNode;

  currentNode = getParentSibling(rootNode, node);
  if (currentNode) return currentNode;
};

ChangesTree.prototype.traverseOneStep = function(node, step){
  let {rootNode} = this;
  let currentNode;

  if(step === 'render'){
    this.elements = render(node);
    return;
  }

  currentNode = getFirstChild(node, this.elements);
  if (currentNode) {
    this.elements = null;
    return {
      type: 'firstChild',
      node: currentNode
    };
  }

  currentNode = getSibling(node);
  if (currentNode) return {
    type: 'sibling',
    node: currentNode
  };

  currentNode = getParentSibling(rootNode, node);
  if (currentNode) return {
    type: 'parentSibling',
    node: currentNode
  };
};
