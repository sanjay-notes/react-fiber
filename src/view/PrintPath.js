import React from 'react';

export default function PrintPath(props){
  const {nodes} = props;
  const ui = nodes ? nodes.map((node)=>{
    const {id} = node;
    return <span key={id}>{id}</span>
  }) : null
  return <>{ui}</>
}