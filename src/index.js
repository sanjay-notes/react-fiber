import React, {useState} from 'react';
import {render} from 'react-dom';

import ChangesTree from './fiber/ChangesTree';
import HierarchyTree from './view/HierarchyTree';
import Render from './view/Render';
import './style.css';

const treeData = {
  a1: {
    name: 'a1',
    children: ['b1', 'b2', 'b3'],
  },
  b1: {
    name: 'b1',
    children: null
  },
  b2: {
    name: 'b2',
    children: ['c1']
  },
  b3: {
    name: 'b3',
    children: ['c2']
  },
  c1: {
    name: 'c1',
    children: ['d1', 'd2']
  },
  c2: {
    name: 'c2',
    children: null
  },
  d1: {
    name: 'd1',
    children: null
  },
  d2: {
    name: 'd2',
    children: null
  }
};
const tree = new ChangesTree('a1', treeData);

function App(props){
  const rootNode = tree.rootNode;
  const [activeNode, setActiveNode] = useState(rootNode);
  const [nextDisable, setNextDisable] = useState(true);

  function showNext(){
    setNextDisable(false);
  }
  function onNextHandler(){
    const nextNode = tree.traverseOneNode();
    if(nextNode) {
      setActiveNode(nextNode)
    }
    setNextDisable(true);
  }

  let buttonUI = null;
  if (nextDisable){
    buttonUI = <button disabled={true}> Next </button>
  } else {
    buttonUI = <button onClick={onNextHandler}> Next </button>
  }

  return (
    <div>

      <div>Call render of <strong>{activeNode.instance.name}</strong></div>
      <div className="container">
      <Render node={activeNode.instance} onRenderClick={showNext}/>
      <div className="fiber-container">
        {buttonUI}
        <HierarchyTree rootNode={rootNode} activeNode={activeNode} />
      </div>
      </div>
    </div>
  )
}


render(<App/>, document.getElementById('app'));