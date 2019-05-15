import FiberNode from './FiberNode';
import {render, getFirstChild, getSibling, getParentSibling, getNextNode} from './helper';


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

// used for Demo
ChangesTree.prototype.traverseOneStep = function(node, step, completeUnitOfWork){
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
  if (currentNode) {
    completeUnitOfWork && completeUnitOfWork(node);
    return {
      type: 'sibling',
      node: currentNode
    };
  }

  if(step === 'complete'){
    completeUnitOfWork && completeUnitOfWork(node);
    return;
  }

  currentNode = getParentSibling(rootNode, node, completeUnitOfWork);
  if (currentNode) return {
    type: 'parentSibling',
    node: currentNode
  };
};
