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


function completeUnitOfWork(node){
  console.log(node);
}

function getRenderSummary(instance){
  const children = instance.children;
  const total = children ? children.length : 0;
  const elements = total > 0 ? children.map((child)=>{
    return <li key={child}>{child}</li>
  }) : '';
  return (<span>Call <strong>Render</strong> on React-Instance[{instance.id}],<br/> which will return array of React-Elements. <ul>{elements}</ul> </span>)
}

function App(props){
  const [stage, setStage] = useState('');
  let showDOM = false;
  let shouldRender = false;
  let instance = activeNode ? activeNode.instance : null;
  let summary = '';
  let borderId = null;
  if(stage == 'render'){
    tree.traverseOneStep(activeNode, stage)
    shouldRender = true;
    summary = getRenderSummary(instance)
  } if(stage == 'change-node'){
    const {type, node} = tree.traverseOneStep(activeNode, stage,  completeUnitOfWork);
    activeNode = node;
    if(type === 'firstChild'){
      summary = "Create Sibling and Parent relation between rendered elements, and returns firstChild as next Item"
    } else if(type === 'sibling'){
      summary = <span>As there is no Child, <br/>Next item: Sibling</span>
    } else if(type === 'parentSibling'){
      summary = <span>As there is no child & Sibling<br/>Next item: Parent Sibling</span>
    }

  } else if(stage == 'change-path'){
    activeId  = instance.id;
    summary = "Check if there is some idle time ? if so next node, will be next unit of work"
  } else if(stage == 'complete-node'){
    borderId = instance.id;
    summary = `Complete unit of Work for: ${borderId}`
  } else if(stage == 'complete-parent-node'){
    const parentNode = activeNode.parent;
    borderId = parentNode.instance.id;
    summary = `Complete unit of Work for parent: ${borderId}`
  } else if(stage == 'done'){
    showDOM = true;
    activeNode = null;
    activeId = null;
    summary = "Commit created DOM tree by calling render of React instance in SINGLE FRAME"
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
            <HierarchyTree
              rootNode={rootNode}
              activeNode={activeNode}
              complete={borderId}
              highlight={activeId}/>
          </div>
        </div>
        <div className='DOM-container'>
          {summary ? <Description>{summary} </Description>: null}
          {showDOM ? (<DOMTree rootNode={rootNode}/>) : null}
        </div>
      </div>
  )
}

render(<App/>, document.getElementById('app'));