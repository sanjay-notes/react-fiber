import React from 'react';
import './style.css';


// prevNode for first child - parent
// prevNode for other childs - are its prev sibling
export default function Description(props){
  let {text} = props;
  return (
    <div className='container' style={{padding:'16px'}}>
      {text}
    </div>
  )
}