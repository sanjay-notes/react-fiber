import React, {useEffect, useRef, useState} from 'react';
import {getBoundingRect} from './helper';


function getLink(start, end, type, key, order){
  if(order === undefined){
    return { start, end, type, key }
  } else {
    return { start, end, type, key, order }
  }
}

// prevNode for first child - parent
// prevNode for other childs - are its prev sibling
export default function DOMNode(props){
  let {node,createLink, parentPos, parentName} = props;

  const [nodePos, setPos] = useState({
    x: NaN,
    y: NaN,
    width:  NaN,
    height: NaN
  });

  const nodeRef =  useRef();
  // if pos value changes we have to update links, so we have to call componentDidMount - ComponentDidUpdate (useEffect)
  const newPos =  getBoundingRect(nodeRef.current);

  useEffect(()=>{
    if(nodeRef.current){
      const {x, y, width, height} = newPos;

      if(nodePos.x !== x || nodePos.y !== y || nodePos.width !== width || nodePos.height !== height){ // first round set state
        setPos(newPos);
      } else { //  // second round call props to update the state somewhere in parent
        if( !isNaN(parentPos.x) && !isNaN(parentPos.y) && !isNaN(nodePos.x) && !isNaN(nodePos.y)){
          const nodeId = node.instance.id;
          const returnLink = getLink(parentPos,nodePos, 'DOM', `${parentName}-${nodeId}`,); // return Link
          createLink(returnLink);
        }
      }
    }
  },[newPos.x,  newPos.y,  newPos.width,  newPos.height,
            nodePos.x, nodePos.y, nodePos.width, nodePos.height]);

  if(!node) return null;

  var {instance, firstChild, sibling} = node;

  const {id, html:htmlName }= instance;
  const className =  'DOM-node';
  return (
  <>
    <li key={id}>
      <span className={className} ref={nodeRef}> {htmlName} </span>

      {firstChild ? <ul><DOMNode node={firstChild}
                                   parentPos={nodePos}
                                   parentName={id}
                                   createLink={createLink}/></ul> : null}
    </li>
    {sibling ? <DOMNode node={sibling}
                          parentPos={parentPos}
                          parentName={parentName}
                          createLink={createLink}/> : null}
  </>
  )
}