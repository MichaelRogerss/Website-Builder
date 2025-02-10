// AddSideFrame.js
import React from 'react';

const AddSideFrame = ({ addNewElementToIframe }) => {
  return (
    <div className="addSideFrame">
      <div className="addsideframetop">
        Add Element
        </div>
      <div className="addSideFrameInner">
      <div className="elementaddselect">
        <button>Elements</button>
        <button>Components</button>
      </div>
      <div className="elementsfinderframe">
        <div className="addElementsFrame">
          
          <button className="addElementFrame" onClick={() => addNewElementToIframe("text")}>
          <svg width="100%" height="auto" x="0" y="0" viewBox="0 0 512 512"><g><path d="M15 114.235c8.284 0 15-6.716 15-15V30h69.235c8.284 0 15-6.716 15-15s-6.716-15-15-15H15C6.716 0 0 6.716 0 15v84.235c0 8.285 6.716 15 15 15zM497 0h-84.235c-8.284 0-15 6.716-15 15s6.716 15 15 15H482v69.235c0 8.284 6.716 15 15 15s15-6.716 15-15V15c0-8.284-6.716-15-15-15zM497 397.765c-8.284 0-15 6.716-15 15V482h-69.235c-8.284 0-15 6.716-15 15s6.716 15 15 15H497c8.284 0 15-6.716 15-15v-84.235c0-8.285-6.716-15-15-15zM99.235 482H30v-69.235c0-8.284-6.716-15-15-15s-15 6.716-15 15V497c0 8.284 6.716 15 15 15h84.235c8.284 0 15-6.716 15-15s-6.715-15-15-15zM419.66 191.38V96.65c0-4.7-3.81-8.51-8.52-8.51H100.86c-4.71 0-8.52 3.81-8.52 8.51v94.73c0 4.71 3.81 8.52 8.52 8.52h45.24c4.7 0 8.51-3.81 8.51-8.52v-32.45a8.52 8.52 0 0 1 8.52-8.52h53.21c4.71 0 8.52 3.81 8.52 8.52v234.14c0 4.71-3.81 8.52-8.52 8.52h-23.27c-4.71 0-8.52 3.81-8.52 8.52v45.24c0 4.7 3.81 8.51 8.52 8.51h125.86c4.71 0 8.52-3.81 8.52-8.51v-45.24c0-4.71-3.81-8.52-8.52-8.52h-23.27c-4.71 0-8.52-3.81-8.52-8.52V158.93c0-4.71 3.81-8.52 8.52-8.52h53.21c4.7 0 8.52 3.81 8.52 8.52v32.45c0 4.71 3.81 8.52 8.51 8.52h45.24c4.71 0 8.52-3.81 8.52-8.52z" fill="#FFFFFF" opacity="1" data-original="#000000"></path></g></svg>
          Text
          </button>

          <button className="addElementFrame" onClick={() => addNewElementToIframe("button")}>
          <svg width="100%" height="auto" x="0" y="0" viewBox="0 0 16 16" ><g><path fill="#FFFFFF" d="m15.7 5.3-1-1c-.2-.2-.4-.3-.7-.3H1c-.6 0-1 .4-1 1v5c0 .3.1.6.3.7l1 1c.2.2.4.3.7.3h13c.6 0 1-.4 1-1V6c0-.3-.1-.5-.3-.7zM14 10H1V5h13v5z" opacity="1" data-original="#444444" class=""></path></g></svg>
          Button
          </button>
          
          <button className="addElementFrame" onClick={() => addNewElementToIframe("section")}>
          <svg width="100%" height="auto" x="0" y="0" viewBox="0 0 24 24" ><g><path d="M22.5 6h-21C.673 6 0 5.327 0 4.5v-3C0 .673.673 0 1.5 0h21c.827 0 1.5.673 1.5 1.5v3c0 .827-.673 1.5-1.5 1.5zm-21-5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h21a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM22.5 15h-21C.673 15 0 14.327 0 13.5v-3C0 9.673.673 9 1.5 9h21c.827 0 1.5.673 1.5 1.5v3c0 .827-.673 1.5-1.5 1.5zm-21-5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h21a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM22.5 24h-8c-.827 0-1.5-.673-1.5-1.5v-3c0-.827.673-1.5 1.5-1.5h8c.827 0 1.5.673 1.5 1.5v3c0 .827-.673 1.5-1.5 1.5zm-8-5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM9.5 24h-8C.673 24 0 23.327 0 22.5v-3c0-.827.673-1.5 1.5-1.5h8c.827 0 1.5.673 1.5 1.5v3c0 .827-.673 1.5-1.5 1.5zm-8-5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" fill="#FFFFFF" opacity="1" data-original="#000000"></path></g></svg>
          Section
          </button>
        
        </div>

        <div className="addElementsFrame">
          
          <button className="addElementFrame" onClick={() => addNewElementToIframe("divblock")}>
          <svg  width="100%" height="auto" x="0" y="0" viewBox="0 0 512 512"><g><path d="M432 0H80C35.888 0 0 35.888 0 80v352c0 44.112 35.888 80 80 80h352c44.112 0 80-35.888 80-80V80c0-44.112-35.888-80-80-80zm40 432c0 22.056-17.944 40-40 40H80c-22.056 0-40-17.944-40-40V80c0-22.056 17.944-40 40-40h352c22.056 0 40 17.944 40 40v352z" fill="#FFFFFF" opacity="1" data-original="#000000"></path></g></svg>
          Div-Block
          </button>

          <button className="addElementFrame" onClick={() => addNewElementToIframe("navbar")}>
          <svg width="100%" height="auto" x="0" y="0" viewBox="0 0 16 16" ><g><path fill="#FFFFFF" d="m15.7 5.3-1-1c-.2-.2-.4-.3-.7-.3H1c-.6 0-1 .4-1 1v5c0 .3.1.6.3.7l1 1c.2.2.4.3.7.3h13c.6 0 1-.4 1-1V6c0-.3-.1-.5-.3-.7zM14 10H1V5h13v5z" opacity="1" data-original="#444444" class=""></path></g></svg>
          Navbar
          </button>
          
          <button className="addElementFrame" onClick={() => addNewElementToIframe("featured")}>
          <svg width="100%" height="auto" x="0" y="0" viewBox="0 0 24 24" ><g><path d="M22.5 6h-21C.673 6 0 5.327 0 4.5v-3C0 .673.673 0 1.5 0h21c.827 0 1.5.673 1.5 1.5v3c0 .827-.673 1.5-1.5 1.5zm-21-5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h21a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM22.5 15h-21C.673 15 0 14.327 0 13.5v-3C0 9.673.673 9 1.5 9h21c.827 0 1.5.673 1.5 1.5v3c0 .827-.673 1.5-1.5 1.5zm-21-5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h21a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM22.5 24h-8c-.827 0-1.5-.673-1.5-1.5v-3c0-.827.673-1.5 1.5-1.5h8c.827 0 1.5.673 1.5 1.5v3c0 .827-.673 1.5-1.5 1.5zm-8-5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM9.5 24h-8C.673 24 0 23.327 0 22.5v-3c0-.827.673-1.5 1.5-1.5h8c.827 0 1.5.673 1.5 1.5v3c0 .827-.673 1.5-1.5 1.5zm-8-5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" fill="#FFFFFF" opacity="1" data-original="#000000"></path></g></svg>
          Featured
          </button>
        
        </div>

      </div></div>
    </div>
  );
};

export default AddSideFrame;
