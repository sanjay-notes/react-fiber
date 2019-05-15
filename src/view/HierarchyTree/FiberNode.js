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
export default function FiberNode(props){
  let {node, activeNode, highlight,complete,createLink, parentPos, parentName, prevNodePos, prevNodeName, isFirstChild, order} = props;

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
        const {x:prevNodeX, y:prevNodeY} = prevNodePos;
        if(!isNaN(prevNodeX) && !isNaN(prevNodeY) && !isNaN(nodePos.x) && !isNaN(nodePos.y)){
          const type = isFirstChild ? 'firstChild' : 'sibling';
          const nodeId = node.instance.id;
          const nextLink = getLink(prevNodePos, nodePos, type, `${prevNodeName}-${nodeId}`); // Next Link
          const returnLink = getLink(nodePos, parentPos, 'parent', `${nodeId}-${parentName}`, order); // return Link
          createLink(returnLink, nextLink);
        }
      }
    }
  },[newPos.x,  newPos.y,  newPos.width,  newPos.height,
            nodePos.x, nodePos.y, nodePos.width, nodePos.height]);

  if(!node) return null;

  var {instance, firstChild, sibling} = node;

  const {id, name}= instance;
  const highlightClass = (id === highlight) ? 'active' : '';
  const className = `node ${highlightClass}`;
  const style = (id === complete) ? {border: '2px solid orange', borderRadius: '0px'} : null;
  return (
  <>
    <li key={id}>
      <span className={className} ref={nodeRef} style={style}> {name} </span>
      {firstChild ? <ul><FiberNode node={firstChild}
                                   isFirstChild={true}
                                   complete={complete}
                                   highlight={highlight}
                                   order={1}
                                   parentPos={nodePos}
                                   parentName={id}
                                   prevNodePos={nodePos}
                                   prevNodeName={id}
                                   activeNode={activeNode}
                                   createLink={createLink}/></ul> : null}
    </li>
    {sibling ? <FiberNode node={sibling}
                          complete={complete}
                          highlight={highlight}
                          order={order + 1}
                          activeNode={activeNode}
                          parentPos={parentPos}
                          parentName={parentName}
                          prevNodePos={nodePos}
                          prevNodeName={id}
                          createLink={createLink}/> : null}
  </>
  )
}