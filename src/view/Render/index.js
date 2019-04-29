import React, {useEffect, useRef, useState} from 'react';
import './style.css';


// prevNode for first child - parent
// prevNode for other childs - are its prev sibling
export default function Render(props){
  let {instance, shouldRender} = props;
  let childNodes;
  if(shouldRender){
    childNodes = instance.render()
  }

  const childUI = childNodes ? childNodes.map((child)=>{
    const {name, id} = child;
    return <div className='render-node' key={id}> {name} </div>
  }): null;

  return (
    <div className='container render-child-container '>
      <span className='container-title'>render()</span>
      {childUI}
    </div>
  )
}