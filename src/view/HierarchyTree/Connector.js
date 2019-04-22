import React from 'react';

function EndPoint(props){
  const {x, y, radius, color} = props;
  return (<circle cx={x} cy={y} r={radius} fill={color}/>);
}

function CurvedLine(props) {
  let {x1, y1, x2, y2, color, tension, dotted ,isElbow} = props;
  let delta,hx2,hy2, hx1, hy1;

  if(tension === undefined)tension = 1;

  if (tension < 0) {
    delta = (y2-y1) * tension;
    hx2=x2;
    hy2=y2+delta;
  } else {
    delta = (x2-x1) / tension;
    hx2=x2-delta;
    hy2=y2;
    hx1=x1 + delta;
    hy1=y1;
  }

  const curveValues = isElbow ? (`L ${x2} ${y1} L ${x2} ${y2}`) : (`Q ${hx1} ${hy1} ${x2} ${y2}`);
  const path =  `M ${x1} ${y1} ${curveValues}`;

  if(dotted){
    return (<path d={path} fill="none" stroke={color} markerEnd="url(#triangle)" strokeDasharray="5,5"/>)
  } else {
    return (<path d={path} fill="none" stroke={color} markerEnd="url(#triangle)"/>)
  }

}


// rectangle center coordinates on length and Breadth, and corner co-ordinates
// 1 - left side center , 2 top side center, 3 - right side center, 4 - bottom side center
// 11 - left top corner , 22 right top corner, 33 right bottom corner, 44 - left bottom corner
function getCoordinatesBasedOnPos(pos, boundingRect){
  let {x, y, width, height} = boundingRect;
  if(pos === 1 || pos === 3){
    y += (height / 2);
    (pos === 3) && (x += width);
  }

  if(pos === 2 || pos === 4){
    x += (width / 2);
    (pos === 4) && (y += height);
  }

  if(pos === 33){
    x += width;
    y += height;
  }

  (pos === 22) && (x += width);
  (pos === 44) && (y += height);

  return {
    x, y
  }

}


export default function Connector(props){
  const {start, end, type, order } = props;
  let color, startPos, endPos, dotted, isElbow;
  if( type === 'parent'){
    color = 'green';
    startPos = 1;
    endPos = 33;
    dotted = true;
  } else if(type === 'sibling'){
    color = 'purple';
    startPos = 4;
    endPos = 2;
  } else if(type === 'firstChild'){
    color = 'red';
    startPos = 3;
    endPos = 2;
    isElbow = true;
  }

  const {x: x1, y: y1} = getCoordinatesBasedOnPos(startPos, start);
  const {x: x2, y: y2} = getCoordinatesBasedOnPos(endPos, end);

  return(
  <>
    <EndPoint x={x1} y={y1} radius={3} color={color}/>
    <CurvedLine x1={x1} y1={y1} x2={x2} y2={y2} radius={3} color={color}
                tension={order}
                dotted={dotted}
                isElbow={isElbow}/>
  </>
  )
}