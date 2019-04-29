import React, {useState, useEffect} from 'react';
import './style.css';
import Highlight from "react-highlight.js";

export default function Code(props){
  let {data, lines, onCurrentLine, path} = props;
  let [pivot, setPathPivot] = useState(0);

  useEffect(() => {
    reset();
  }, [path])

  const linesUI = [];
  const highlightLine = path[pivot]

  for (var line = 1; line <= lines; line++){
    let lineUI;
    if(highlightLine === line){
      lineUI = (<span key={line}>{line}<div className='line-highlighter'/></span>)
    } else {
      lineUI = (<span key={line}>{line}</span>)
    }
    linesUI.push(lineUI);
  }

  function reset(){
    setPathPivot(0);
    onCurrentLine(path[0])
  }

  function onNextLineClick(){
    if(pivot === (path.length -1)) {
      reset()
    } else {
      pivot = pivot + 1;
      setPathPivot(pivot);
      onCurrentLine(path[pivot])
    }
  }

  let buttonUI;
  if(path.length === 0 ){
    buttonUI = (<button disabled={true}>Next Line</button>)
  } else {
    buttonUI = (<button onClick={onNextLineClick}>Next Line</button>);
  }

  return (
  <>
    <div className='code-button'>{buttonUI}</div>
    <div className='code-highlighter'>
      <pre className='code-line-container'>
        {linesUI}
      </pre>
      <Highlight language='javascript'>
        {data}
      </Highlight>

    </div>
  </>
  )
}