import React, {useReducer, useState} from 'react';

import FiberNode from './FiberNode';
import Connector from './Connector';
import './style.css';

const initialState = {
  returnLinks:{},
  nextLinks: {}
};

const reducer = (state, action) => {
  const {type, data} = action;
  const key = data.key;
  switch (type) {
    case 'return': {
      const returnLinks = state['returnLinks'];
      returnLinks[key] = data;
      return { ...state};
    }
    case 'next': {
      const nextLinks = state['nextLinks'];
      nextLinks[key] = data;
      return { ...state};
    }
    default: {
      return state;
    }
  }
};

export default function HierarchyTree(props){
  const {rootNode, activeNode} = props;
  const [linksState, dispatch] = useReducer(reducer, initialState);
  const {returnLinks, nextLinks} = linksState;
  const links = {...returnLinks , ...nextLinks};

  function createLink(returnLink, nextLink){
    dispatch({
      type: 'return',
      data: returnLink
    });
    dispatch({
      type: 'next',
      data: nextLink
    });
  }

  const keys = Object.keys(links);
  const linksUI = keys.map((key)=>{
    const link = links[key]
    return <Connector {...link} />
  });
  return (
  <div className="tree">
    <SvgTree>
      <ArrowMarker/>
      {linksUI}
    </SvgTree>
    <ul>
      {rootNode ? <FiberNode node={rootNode}
                             activeNode={activeNode}
                             createLink={createLink}
                             order={1}
                             prevNodePos={{x:NaN, y:NaN, width:NaN, height:NaN}}/> : null}
    </ul>
  </div>);

}


function SvgTree(props){
  return (
  <svg style={{position:'absolute',left:'0px',top:'0px'}}
       width="800" height="600">
    {props.children}
  </svg>
  )
}


function ArrowMarker(props){
  return (
  <>
    <defs>
      <marker id="triangle" viewBox="0 0 10 10" refX="10" refY="5"
              markerUnits="strokeWidth" markerWidth="8"
              markerHeight="10" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z"></path>
      </marker>
    </defs>
  </>
  )
}






