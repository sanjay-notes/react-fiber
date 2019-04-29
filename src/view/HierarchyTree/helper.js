export function getBoundingRect(htmlElement){
  return {
    x: htmlElement ? htmlElement.offsetLeft : NaN,
    y: htmlElement ? htmlElement.offsetTop :  NaN,
    width:htmlElement ? htmlElement.offsetWidth :  NaN,
    height:htmlElement ? htmlElement.offsetHeight :  NaN
  };
}