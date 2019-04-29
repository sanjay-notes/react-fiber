import React, {useState} from 'react';
import {render} from 'react-dom';

import ChangesTree from './fiber/ChangesTree';
import HierarchyTree from './view/HierarchyTree';
import DOMTree from './view/DOMTree';
import Render from './view/Render';
import Code from './view/Code';
import Description from './view/description';
import {code, treeData, getPath, nextStep} from './data';
import './style.css';

const tree = new ChangesTree('app', treeData);

let rootNode = tree.rootNode;
let activeNode = rootNode;
let activeId = rootNode.instance.id;

function App(props){
  const [stage, setStage] = useState('');
  let showDOM = false;
  let shouldRender = false;
  let instance = activeNode ? activeNode.instance : null;
  let summary = '';
  if(stage == 'render'){
    tree.traverseOneStep(activeNode, stage)
    shouldRender = true;
    summary = "Render called on React Instance, which returns array of React Elements."
  } if(stage == 'change-node'){
    const {type, node} = tree.traverseOneStep(activeNode);
    activeNode = node;
    if(type === 'firstChild'){
      summary = "Create sibling and parent relation between rendered elements, and returns firstChild as next Item"
    } else if(type === 'sibling'){
      summary = "As there is no child, next item: Sibling "
    } else if(type === 'parentSibling'){
      summary = "As there is no child and Sibling, next item: Parent Sibling "
    }

  } else if(stage == 'change-path'){
    activeId  = instance.id;
    summary = "Check if there is some idle time, if so next node, will be next unit of work"
  } else if(stage == 'done'){
    showDOM = true;
    activeNode = null;
    activeId = null;
  }

  let path = getPath(activeId);

  function _nextStep(line){
    const nextStage = nextStep(line);
    setStage(nextStage);
  }

  return (
      <div className="app-container">
        <div className="code-container container">
          <Code data={code} lines={43} path={path} onCurrentLine={_nextStep }/>
        </div>
        <div className="fiber-container">
          <Render instance={instance} shouldRender={shouldRender}/>
          <div className='container'>
            <HierarchyTree rootNode={rootNode} activeNode={activeNode} highlight={activeId}/>
          </div>
        </div>
        <div className='DOM-container'>
          {summary ? <Description text={summary}/> : null}
          {showDOM ? (<DOMTree rootNode={rootNode}/>) : null}
        </div>
      </div>
  )
}

render(<App/>, document.getElementById('app'));