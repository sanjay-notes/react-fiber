import React from 'react';
import {Graph} from 'react-d3-graph';
import PrintPath from './PrintPath'

const graphConfig = {
  directed: true,
  nodeHighlightBehavior: true,
  node: {
    color: 'lightgreen',
    size: 360,
    highlightStrokeColor: 'blue'
  },
  link: {
    highlightColor: 'black',
    type:['CURVE_SMOOTH']
  }
};


export default function D3Graph(props){
  const {onNext, data} = props;

  return (
  <>
   {/* {data.nodes.length > 0 ? <Graph id='app' data={data} config={graphConfig}/> : null}*/}
    <PrintPath nodes={data.nodes}/>
    <div><button onClick={onNext}>Next</button></div>
  </>
  )
}

