import React, { useEffect, useState } from 'react';

const Accordion = ({ element, selectElement}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [arrowDirection, setArrowDirection] = useState('right'); // Initial direction

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    setArrowDirection(isOpen ? 'right' : 'down');
    console.log(element["className"])
    selectElement(element["className"])
  };

  return (
    <div >
      <div className="treeAccordion" onClick={toggleAccordion} style={{ cursor: 'pointer' }}>
        {element.children.length > 0 && (
          <span style={{ marginLeft: '5px', opacity: 1, transition: 'opacity 0.3s' }}>
            {arrowDirection === 'right' ? '→' : '↓'}
          </span>
        )}
        {!element.children.length && (
          <span style={{ marginLeft: '5px', opacity: 0, transition: 'opacity 0.3s' }}>→</span>
        )}
        <span>{element.tagName}</span>
        <span>{element.className}</span>
      </div>
      {isOpen && element.children.length > 0 && (
        <ul>
          {element.children.map((child, index) => (
            <Accordion selectElement={selectElement} key={index} element={child} />
          ))}
        </ul>
      )}
    </div>
  );
};

const ShowTreeStack = ({ selectElement }) => {
  const [nestedElementsArray, setNestedElementsArray] = useState([]);

  useEffect(() => {
    const createNestedElementsArray = (parentElement) =>
      Array.from(parentElement.children).map((childElement) => ({
        tagName: childElement.tagName,
        className: childElement.className,
        text: childElement.text,
        children: createNestedElementsArray(childElement),
      }));

    const iframeBody = document.getElementById('previewIframe').contentDocument.body;
    const newNestedElementsArray = createNestedElementsArray(iframeBody);
    setNestedElementsArray(newNestedElementsArray);

    console.log(JSON.stringify(newNestedElementsArray, null, 2));
  }, []);

  return (
    <div className="treeStackFrame" >
      <Accordion selectElement={selectElement} element={{ tagName: 'body', className: 'body', children: nestedElementsArray }} />
    </div>
  );
};

export default ShowTreeStack;
