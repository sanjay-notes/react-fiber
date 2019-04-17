import React, {useState, useEffect} from 'react';
import {render} from 'react-dom';

import ChangesTree from './fiber/ChangesTree';
import D3Graph from './view/D3Graph';
import HierarchyTree from './view/HierarchyTree';

const treeData = {
  a1: {
    name: 'a1',
    children: ['b1', 'b2', 'b3'],
  },
  b1: {
    name: 'b1',
    children: null
  },
  b2: {
    name: 'b2',
    children: ['c1']
  },
  b3: {
    name: 'b3',
    children: ['c2']
  },
  c1: {
    name: 'c1',
    children: ['d1', 'd2']
  },
  c2: {
    name: 'c2',
    children: null
  },
  d1: {
    name: 'd1',
    children: null
  },
  d2: {
    name: 'd2',
    children: null
  }
};

const tree = new ChangesTree('a1', treeData);

function App(props){
  const [graphData, setGraphData] = useState({nodes: [],links:[]});

  function buildGraph(fiberNode){
    if(fiberNode){
      const {instance, parent, firstChild, sibling} = fiberNode;
      let {nodes, links} = graphData;
      nodes = nodes.slice();
      links = links.slice();
      const id = instance.name;
      parent && links.push({source: id, target: parent.instance.name, color:'#d3d3d3'});
      firstChild && links.push({source: id, target: firstChild.instance.name, color:'#00ff00'});
      sibling && links.push({source: id, target: sibling.instance.name, color:'#ff00ff'});
      nodes.push({id});
      setGraphData({
        nodes,
        links
      })
    }
  }

  function onNextHandler(){
    buildGraph(tree.traverseOneNode())
  }




  return (
  <div>
    <HierarchyTree/>
    <D3Graph data={graphData} onNext={onNextHandler}/>
  </div>
  )
}




render(<App/>, document.getElementById('app'))