import FiberNode from "./FiberNode";

function linkElements(parent, children) {
  parent.firstChild = children.reduceRight((sibling, child) => {
    const node = new FiberNode(child, sibling, parent);
    return node;
  }, null);
  return parent.firstChild;
}

export function render(node){
  return node.instance.render();
}

export function getFirstChild(node, elements,preOrder){
  if(!elements){
    return null;
  }
  const firstChild = elements ? linkElements(node, elements) : null;
  preOrder && preOrder(node);
  return firstChild;
}

export function getParentSibling(root, node, postOrder){
  while (!node.sibling) {
    const {parent} = node;
    if (!parent || parent === root) return;
    node = parent;
  }
  return getSibling(node, postOrder);
}

export function getSibling(node, postOrder){
  node.sibling && postOrder && postOrder(node);
  return node.sibling;
}

export function getNextNode(root, node, preOrder,postOrder){
  if (node === root) return; // traverse completed
  if (node === null) node = root;

  const elements = render(node);

  let firstChild  = getFirstChild(node, elements, preOrder);
  if (firstChild) return firstChild; // dept first search, (child -> child -> null)

  let sibling = getSibling(node, postOrder);
  if(sibling) return sibling;

  return getParentSibling(root, node.parent, postOrder);
}