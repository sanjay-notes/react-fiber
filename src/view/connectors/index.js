import React from 'react';
import ArrowMarker from './ArrowMarker';
import Connector from "./Connector";

export default function Connectors(props){
  const {width, height, links} = props;
  if(isNaN(width) || isNaN(height)){
    return null;
  }

  const keys = Object.keys(links);
  const linksUI = keys.map((key)=>{
    const link = links[key]
    return <Connector {...link} />
  });

  return (
  <svg style={{position:'absolute',left:'0px',top:'0px'}}
       width={width} height={height}>
    <ArrowMarker/>
    {linksUI}
  </svg>
  )
}