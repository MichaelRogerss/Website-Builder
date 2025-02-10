// AddSideFrame.js
import React, { useEffect, useState } from 'react';

const Accordion = ({ element }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={toggleAccordion} style={{ cursor: 'pointer' }}>
        <strong>TagName:</strong> {element.tagName}, <strong>ClassName:</strong> {element.className}
      </div>
      {isOpen && element.children.length > 0 && (
        <ul>
          {element.children.map((child, index) => (
            <Accordion key={index} element={child} />
          ))}
        </ul>
      )}
    </div>
  );
};

const AddSideFrame = ({ addNewElementToIframe }) => {
  const [nestedElementsArray, setNestedElementsArray] = useState([]);

  useEffect(() => {
    const createNestedElementsArray = (parentElement) =>
      Array.from(parentElement.children).map((childElement) => ({
        tagName: childElement.tagName,
        className: childElement.className,
        children: createNestedElementsArray(childElement),
      }));

    const iframeBody = document.getElementById('previewIframe').contentDocument.body;
    const newNestedElementsArray = createNestedElementsArray(iframeBody);
    setNestedElementsArray(newNestedElementsArray);

    console.log(JSON.stringify(newNestedElementsArray, null, 2));
  }, []);

  return (
    <div className="addSideFrame">
      <h2>Elements in addSideFrame:</h2>
      {nestedElementsArray.map((element, index) => (
        <Accordion key={index} element={element} />
      ))}
    </div>
  );
};

export default AddSideFrame;
