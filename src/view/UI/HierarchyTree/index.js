import React, {useReducer, useRef} from 'react';

import FiberNode from './FiberNode';
import Connectors from '../connectors';
import './style.css';
import {getBoundingRect} from "./helper";

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
  const {rootNode, activeNode, highlight, complete} = props;
  const [linksState, dispatch] = useReducer(reducer, initialState);
  const {returnLinks, nextLinks} = linksState;
  const links = {...returnLinks , ...nextLinks};

  const treeRef =  useRef();
  // if pos value changes we have to update links, so we have to call componentDidMount - ComponentDidUpdate (useEffect)
  const treeBoundingClient =  getBoundingRect(treeRef.current);
  const {width:treeWidth, height:treeHeight} = treeBoundingClient;

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

  return (
  <div className="tree" ref={treeRef}>
    <ul>
      {rootNode ? <FiberNode node={rootNode}
                             complete={complete}
                             highlight={highlight}
                             activeNode={activeNode}
                             createLink={createLink}
                             order={1}
                             prevNodePos={{x:NaN, y:NaN, width:NaN, height:NaN}}/> : null}
    </ul>
    <Connectors width={treeWidth} height={treeHeight} links={links}/>
  </div>);

}









