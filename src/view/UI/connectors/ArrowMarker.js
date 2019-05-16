import React from 'react';

export default function ArrowMarker(props){
  return (
  <>
    <defs>
      <marker id="triangle" viewBox="0 0 10 10" refX="10" refY="5"
              markerUnits="strokeWidth" markerWidth="8"
              fillOpacity=".32"
              markerHeight="10" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z"></path>
      </marker>
    </defs>
  </>
  )
}