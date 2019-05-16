const code = `function traverseAcrossFrames(root){
  let current = root;
  var id = requestIdleCallback((deadline)=>{
    while (deadline.timeRemaining() > 0)
      current = getNext(root,current);
      if(!current)cancelIdleCallback(id);
  })
}

function getNext(root, node){
  if (node === root) return;
  
  let firstChild  = getFirstChild(node);
  if (firstChild) 
      return firstChild;
  postOrder(node);
  if (node.sibling) 
      return node.sibling;
  
  return getParentSibling(root, node);
}

function linkChildren(parent, children) {
  function fn(sibling, child){
    return { instance:child, sibling, parent };
  }
  parent.firstChild = children.reduceRight(fn, null);
  return parent.firstChild;
}

function getFirstChild(node){
  const children = node.instance.render();
  if (children) 
      return linkChildren(node, children);
}
function getParentSibling (root,node){
  while (!node.sibling) {
    if (!node.parent || node.parent === root) 
      return;
    postOrder(node);
    node = parent;
  }
  return node.sibling;
}`;
const treeData = {
  app: {
    id:'app',
    name: 'App',
    html: 'div',
    children: ['list'],
  },
  list: {
    id:'list',
    name: 'List',
    html: 'ul',
    children: ['item1','item2', 'button']
  },
  item1: {
    id:'item1',
    name: 'Item',
    html: 'li',
    children: ['one', 'two']
  },
  item2: {
    id:'item2',
    name: 'Item',
    html: 'li',
    children: ['three']
  },
  button: {
    id:'button',
    name: 'Button',
    html: 'button',
    children: null
  },
  one: {
    id:'one',
    name: '1',
    html: '1',
    children: null
  },
  two: {
    id:'two',
    name: '2',
    html: '2',
    children: null
  },
  three: {
    id:'three',
    name: '3',
    html: '3',
    children: null
  }
};
const pathMap = {
  app: 'firstChild',
  list: 'firstChild',
  item1: 'firstChild',
  one: 'sibling',
  two: 'parentSibling',
  item2: 'firstChild',
  three: 'parentSibling',
  button: 'root'
};

const paths = {
  firstChild: [5,11,13,32,33,34,27,28,{line:34,step:'return'},13,14,15],
  sibling: [5,11,13,14,16,17,18],
  parentSibling: [5,11,13,14,16,17,20,37,40,41,43],
  root: [5,6]
};

function getPath(id){
  if(!id){
    return []
  }
  return paths[pathMap[id]];
}


function nextStep(lineObj){
  let line, step;
  if(lineObj){
    if(typeof lineObj === 'number'){
      line = lineObj,
      step = '';
    } else {
      line = lineObj.line;
      step = lineObj.step;
    }
  }

  if(line == 32 || line == 33 || line == 34 ){
    if(!step){
      return 'render';
    }
    return step;
  }
  if(line == 27 || line == 18 || line == 43){
    return 'change-node';
  } else if (line == 5){
    return 'change-path';
  } else if (line == 16  ){
    return 'complete-node';
  } else if (line == 40){
    return 'complete-parent-node';
  } else if (line == 6 || line == undefined){
    return 'done';
  }
}

export {
  treeData,
  code,
  getPath,
  nextStep
}