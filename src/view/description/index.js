import React from 'react';
import './style.css';


// prevNode for first child - parent
// prevNode for other childs - are its prev sibling
export default function Description(props){
  let {children} = props;
  return (
    <div className='container' style={{padding:'16px'}}>
      {children}
    </div>
  )
}