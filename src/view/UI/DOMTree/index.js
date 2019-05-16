import React, {useReducer, useRef} from 'react';

import DOMNode from './DOMNode';
import Connectors from '../connectors';
import './style.css';
import {getBoundingRect} from "./helper";

const initialState = {};

const reducer = (state, action) => {
  const {type, data} = action;
  const key = data.key;
  switch (type) {
    case 'return': {
      state[key] = data;
      return { ...state};
    }
    default: {
      return state;
    }
  }
};

export default function DOMTree(props){
  const {rootNode} = props;
  const [links, dispatch] = useReducer(reducer, initialState);

  const treeRef =  useRef();
  // if pos value changes we have to update links, so we have to call componentDidMount - ComponentDidUpdate (useEffect)
  const treeBoundingClient =  getBoundingRect(treeRef.current);
  const {width:treeWidth, height:treeHeight} = treeBoundingClient;

  function createLink(returnLink){
    dispatch({
      type: 'return',
      data: returnLink
    });
  }

  return (
  <div className="DOM-tree" ref={treeRef}>
    <Connectors width={treeWidth} height={treeHeight} links={links}/>
    <ul>
      {rootNode ? <DOMNode node={rootNode} createLink={createLink} parentPos={{
        x: NaN,
        y: NaN,
        width:  NaN,
        height: NaN
      }} /> : null}
    </ul>
  </div>);

}










