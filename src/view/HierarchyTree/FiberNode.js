import React, {useEffect, useRef, useState} from 'react';


function getBoundingRect(htmlElement){
  return {
    x: htmlElement ? htmlElement.offsetLeft : NaN,
    y: htmlElement ? htmlElement.offsetTop :  NaN,
    width:htmlElement ? htmlElement.offsetWidth :  NaN,
    height:htmlElement ? htmlElement.offsetHeight :  NaN
  };
}

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
  let {node, activeNode, createLink, parentPos, parentName, prevNodePos, prevNodeName, isFirstChild, order} = props;

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
          const nodeName = node.instance.name;
          const nextLink = getLink(prevNodePos, nodePos, type, `${prevNodeName}-${nodeName}`); // Next Link
          const returnLink = getLink(nodePos, parentPos, 'parent', `${nodeName}-${parentName}`, order); // return Link
          createLink(returnLink, nextLink);
        }
      }
    }
  },[newPos.x,  newPos.y,  newPos.width,  newPos.height,
            nodePos.x, nodePos.y, nodePos.width, nodePos.height]);

  if(!node) return null;

  var {instance, firstChild, sibling} = node;

  const name = instance.name;
  const isActive = (name === activeNode.instance.name);
  const className = isActive ? `node active` : 'node';
  return (
  <>
    <li key={name}>
      <span className={className} ref={nodeRef}> {name} </span>
      {firstChild ? <ul><FiberNode node={firstChild}
                                   isFirstChild={true}
                                   order={1}
                                   parentPos={nodePos}
                                   parentName={name}
                                   prevNodePos={nodePos}
                                   prevNodeName={name}
                                   activeNode={activeNode}
                                   createLink={createLink}/></ul> : null}
    </li>
    {sibling ? <FiberNode node={sibling}
                          order={order + 1}
                          activeNode={activeNode}
                          parentPos={parentPos}
                          parentName={parentName}
                          prevNodePos={nodePos}
                          prevNodeName={name}
                          createLink={createLink}/> : null}
  </>
  )
}