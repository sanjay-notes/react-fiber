import React, {useEffect, useRef, useCallback, useState} from 'react';

import './style2.css';


function FiberTree(props){
  const {data} = props;

  return (
  <div className="tree">
    <ul>
      <TreeNode name="Parent">
        <TreeNode name="Child 1" isFirstChild={true} hasSibling={true} order={1}>
          <TreeNode name="Grand Child 1" isFirstChild={true} order={1}/>
        </TreeNode>
        <TreeNode name="Child 2" order={3}>
          <TreeNode name="Grand Child 1" isFirstChild={true} hasSibling={true} order={1}/>
          <TreeNode name="Grand Child 2" hasSibling={true} order={2}/>
          <TreeNode name="Grand Child 3" order={3}/>
        </TreeNode>
      </TreeNode>
    </ul>
  </div>
  )
}

function TreeNode(props){
  const {name, children, isFirstChild, hasSibling, order} = props;
  const style = {
    height: `${(order * 100)}%`,
    top: `-${(order * 100)}%`,
    right: `-${(order * 10)}px`,
  }
  return (
  <li>
    <span className='nodeContainer'>
      {/*{isFirstChild ? <div className='connectors hor'/> : null}*/}
      {isFirstChild ? <div className='connectors firstChild'/> : null}
      {hasSibling ? <div className='connectors sibling'/> : null}
      <div className='connectors parent' style={style}/>
      <span className="node"> <a href="#">{name}</a> </span>
      {children ? <ul>{children}</ul> : null}
    </span>
  </li>
  )
}

function useAbsolutePosition(){
  const [pos, setPos] = useState(NaN);
  const elementRef =  useCallback(htmlElement => {
    var x = htmlElement ? htmlElement.offsetLeft : undefined;
    var y = htmlElement ? htmlElement.offsetTop :  undefined;
    var width = htmlElement ? htmlElement.offsetWidth :  undefined;
    var height = htmlElement ? htmlElement.offsetHeight :  undefined;
    if(x && y){
      for (var x=0, y=0, el=htmlElement; el != null; el = el.offsetParent) {
        x += el.offsetLeft;
        y += el.offsetTop;
      }
    }
    setPos({
      x,
      y,
      width,
      height
    })
  }, []);

  return {
    ref: elementRef,
    ...pos
  };
}
export default function HierarchyTree(props){
  const {data} = props;
  const {ref:child1Ref, ...child1Pos} = useAbsolutePosition();
  const {ref:child2Ref, ...child2Pos} = useAbsolutePosition();
  const {ref:gChild11Ref, ...gChild11Pos} = useAbsolutePosition();
  const {ref:gChild21Ref, ...gChild21Pos} = useAbsolutePosition();
  const {ref:gChild22Ref, ...gChild22Pos} = useAbsolutePosition();
  const {ref:gChild23Ref, ...gChild23Pos} = useAbsolutePosition();


  return (
  <div className="tree">
    <SvgTree>
      <Connector start={gChild21Pos} end={gChild22Pos} color='red' tension={1} startPos={1} endPos={1}/>
      <Connector start={gChild22Pos} end={gChild23Pos} color='red' tension={1} startPos={1} endPos={1}/>
      <Connector start={child1Pos} end={child2Pos} color='red' tension={1} startPos={1} endPos={1}/>
      <Connector start={gChild21Pos} end={child2Pos} color='green' tension={1} startPos={3} endPos={3}/>
      <Connector start={gChild22Pos} end={child2Pos} color='green' tension={1} startPos={3} endPos={3}/>
      <Connector start={gChild23Pos} end={child2Pos} color='green' tension={1} startPos={3} endPos={3}/>
      <Connector start={gChild11Pos} end={child1Pos} color='green' tension={1} startPos={3} endPos={3}/>
    </SvgTree>
    <ul>
      <Node name="Parent">
        <Node name="Child 1" reff={child1Ref}>
          <Node name="Grand Child 1" reff={gChild11Ref}/>
        </Node>
        <Node name="Child 2" reff={child2Ref}>
          <Node name="Grand Child 1" reff={gChild21Ref}/>
          <Node name="Grand Child 2" reff={gChild22Ref}/>
          <Node name="Grand Child 3" reff={gChild23Ref}/>
        </Node>
      </Node>
    </ul>
  </div>
  )
}

function Node(props){
  const {name, reff, children} = props;
  return (
  <li>
    <span className="node" ref={reff}> <a href="#">{name}</a> </span>
    {children ? <ul>{children}</ul> : null}
  </li>
  )
}


function SvgTree(props){
  return (
    <svg style={{position:'absolute',left:'0px',top:'0px'}}
         width="800" height="600">
      {props.children}
    </svg>
  )
}

function EndPoint(props){
  const {x, y, radius, color} = props;
  return (
  <circle cx={x}
          cy={y}
          r={radius}
          fill={color}/>
  )
}

function CurvedLine(props) {
  const {x1, y1, x2, y2, color, tension} = props;
  var delta = (x2-x1)*tension;
  var hx1=x1+delta;
  var hy1=y1;
  var hx2=x2-delta;
  var hy2=y2;
  var path = "M "  + x1 + " " + y1 +
  " C " + hx1 + " " + hy1
  + " "  + hx2 + " " + hy2
  + " " + x2 + " " + y2;
  return (<path d={path} fill="none" stroke={color}/>)
}

function Connector(props){
  const {start, end, color, tension, startPos, endPos} = props;
  let {x:x1, y: y1} = start;

  if(startPos === 1 || startPos === 3){
    y1 += (start.height / 2);
    (startPos === 3) && (x1 += start.width);
  }

  if(startPos === 2 || startPos === 4){
    x1 += (start.width / 2);
    (startPos === 4) && (y1 += start.height);
  }

  let {x:x2, y: y2} = end;

  if(endPos === 1 || endPos === 3){
    y2 += (end.height / 2);
    (endPos === 3) && (x2 += end.width);
  }

  if(endPos === 2 || endPos === 4){
    x2 += (end.width / 2);
    (endPos === 4) && (y2 += end.height);
  }


  return(
    <>
      <EndPoint x={x1} y={y1} radius={3} color={color}/>
      <EndPoint x={x2} y={y2} radius={3} color={color}/>
      <CurvedLine x1={x1} y1={y1} x2={x2} y2={y2} radius={3} color={color} tension={tension}/>
    </>
  )
}

function findAbsolutePosition(htmlElement) {
  var x = htmlElement ? htmlElement.offsetLeft : undefined;
  var y = htmlElement ? htmlElement.offsetTop :  undefined;
  if(x && y){
    for (var x=0, y=0, el=htmlElement; el != null; el = el.offsetParent) {
      x += el.offsetLeft;
      y += el.offsetTop;
    }
  }
  return {
    "x": x,
    "y": y
  };
}





