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
  const [y, setY] = useState(NaN);
  const [x, setX] = useState(NaN);
  const elementRef =  useCallback(htmlElement => {
    var x = htmlElement ? htmlElement.offsetLeft : undefined;
    var y = htmlElement ? htmlElement.offsetTop :  undefined;
    if(x && y){
      for (var x=0, y=0, el=htmlElement; el != null; el = el.offsetParent) {
        x += el.offsetLeft;
        y += el.offsetTop;
      }
    }
    setY(y)
    setX(x)
  }, []);

  return {
    ref: elementRef,
    "x": x,
    "y": y
  };
}
export default function HierarchyTree(props){
  const {data} = props;
  const {ref:gChild1Ref, x: gChild1x, y: gChild1y} = useAbsolutePosition();
  const {ref:gChild2Ref, x: gChild2x, y: gChild2y} = useAbsolutePosition();


  return (
  <div className="tree">
    <SvgTree>
      <Connector start={{x:gChild1x, y: gChild1y}} end={{x:gChild2x, y: gChild2y}} color='red' tension={3}/>
    </SvgTree>
    <ul>
      <Node name="Parent">
        <Node name="Child 1" >
          <Node name="Grand Child 1"/>
        </Node>
        <Node name="Child 2" order={3}>
          <Node name="Grand Child 1" reff={gChild1Ref}/>
          <Node name="Grand Child 2" reff={gChild2Ref}/>
          <Node name="Grand Child 3" />
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
      <g transform="translate(0.5,0.5)">
        {props.children}
      </g>
    </svg>
  )
}

function endPoint(props){
  const {x, y, radius, color} = props;
  return (
  <circle cx={x}
          cy={y}
          r={radius}
          fill={color}/>
  )
}

function curvedLine(props) {
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
  const {start, end, color, tension} = props;
  let {x:x1, y: y1} = start;
  x1 += start.offsetWidth;
  y1 += (start.offsetHeight / 2);
  let {x:x2, y: y2} = end;
  y2 += (end.offsetHeight / 2);
  return(
    <>
      <endPoint x={x1} y={y1} radius={3} color={color}/>
      <endPoint x={x2} y={y2} radius={3} color={color}/>
      <curvedLine x1={x1} y1={y1} x2={x2} y2={y2} radius={3} color={color} tension={tension}/>
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





