import React, {useEffect, useRef, useState} from 'react';
import './style.css';


// prevNode for first child - parent
// prevNode for other childs - are its prev sibling
export default function Render(props){
  let {node, onRenderClick} = props;
  const [childNodes, setChildNodes] = useState(null);

  function clickHandler(){
    setChildNodes(node.render());
    onRenderClick();
  }
  const childUI = childNodes ? childNodes.map((child)=>{
    const name = child.name;
    return <div className='render-node' key={name}> {name} </div>
  }): null;

  return (
  <div className='render-container'>
    <button onClick={clickHandler}>Render</button>
    <div className='render-child-container'>
      {childUI}
    </div>
  </div>
  )
}