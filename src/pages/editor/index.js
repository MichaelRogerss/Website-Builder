import React, { useEffect, useState, useRef } from "react";
import "./editor.css";
import { Link, useParams } from "react-router-dom";
import AddSideFrame from "../../utils/addSideFrame";

import ShowTreeStack from "../../utils/showTreestack";
import { ChromePicker } from "react-color";
import showTreestack from "../../utils/showTreestack";
const Css = require("json-to-css");
// Function to generate a random string of letters

const ColorPicker = ({ color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const colorPickerRef = useRef(null);

  const handleColorChange = (newColor) => {
    onChange(newColor.hex);
  };

  const handleButtonClick = () => {
    setShowPicker(!showPicker);
  };

  const handleOutsideClick = (event) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target)
    ) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    if (showPicker) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showPicker]);

  return (
    <div style={{ position: "relative" }}>
      <div className="ColorPicker">
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          style={{ backgroundColor: color, border: "none" }}
          onClick={handleButtonClick}
        >
          +
        </button>
      </div>

      {showPicker && (
        <div
          ref={colorPickerRef}
          style={{ position: "absolute", top: "-245px", left: "-159px" }}
        >
          {/* Adjust top and left values based on your layout */}
          <ChromePicker color={color} onChangeComplete={handleColorChange} />
        </div>
      )}
    </div>
  );
};

const generateRandomString = (length) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
};

const Editor = () => {
  const [selectedSize, setSelectedSize] = useState("desktop");
  const [showAddFrame, setShowAddFrame] = useState(false);
  const [showTreeStack, setShowTreeStack] = useState(false);
  const [selectedElement, setSelectedElement] = useState("");
  const [stylesheet, setStylesheet] = useState({});
  const [stylesheet2, setStylesheet2] = useState({
    "@imports": [
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
    ],
    body: {
      "font-family": "Poppins, sans-serif",
    },
    "*": {
      "box-sizing": "border-box",
    },
    ".h1": {
      "font-size": "19vw",
    },
    section: {
      height: "min-content",
    },
  });

  useEffect(() => {
    console.log("rendered");
    // Add logic here to update iframe size based on selectedSize
    updateIframeSize();

    // Add event listener to the iframe content document
    const iframe = document.getElementById("previewIframe");

    //When any key is pressed on element in iframe
    const handleKeyPress = (event) => {
      if (event.keyCode === 8) {
        try {
          if (selectedElement.tagName !== "BODY") {
            const className = selectedElement.className
              .replace("edselector", "")
              .trim();
            const elementsToRemove = iframe.contentDocument.querySelectorAll(
              `.${className}.edselector`
            );

            elementsToRemove.forEach((element) => {
              element.remove();
            });
          }
        } catch (err) {
          console.log(err);
        }
      }

      //when user presses ctrl+a it will highlight only the selected elements text
      if ((event.ctrlKey || event.metaKey) && event.key === "a") {
        console.log("ctrla");
        if (
          selectedElement &&
          selectedElement instanceof Node &&
          selectedElement.tagName !== "BODY"
        ) {
          event.preventDefault();

          // Get the selection object
          var selection = iframe.contentWindow.getSelection();

          // Get the range of the contenteditable element
          var range = iframe.contentDocument.createRange();
          range.selectNodeContents(selectedElement); // Use selectNodeContents instead of selectAllChildren

          // Remove any existing selections
          selection.removeAllRanges();

          // Add the new range to the selection
          selection.addRange(range);
        }
      }
    };

    const handleMouseOver = (event) => {
      event.target.classList.add("edselectordotted");
    };

    const handleMouseOut = (event) => {
      event.target.classList.remove("edselectordotted");
    };

    if (iframe) {
      iframe.contentWindow.designMode = "on";
      iframe.contentDocument.body.className = "body";
      iframe.contentWindow.addEventListener("mouseover", handleMouseOver);
      iframe.contentWindow.addEventListener("mouseout", handleMouseOut);
      iframe.contentWindow.addEventListener("keydown", handleKeyPress);

      const loadstyles = () => {
        let style =
          iframe.contentDocument.head.querySelector("#customStyle") ||
          document.createElement("style");

        if (!style.id) {
          style.id = "customStyle";
          iframe.contentDocument.head.appendChild(style);
        }

        const newStylesheet = stylesheet2;
        // Update the state with the modified stylesheet
        setStylesheet2(newStylesheet);
        // Update the style.textContent if needed
        const css = Css.of(newStylesheet);
        style.textContent = css;
      };

      loadstyles();
    }
    //adds settings css such as if element is selected then
    //it shows the border around the selected element etc
    let style = iframe.contentDocument.head.querySelector("#settings");

    if (!style) {
      style = document.createElement("style");
      style.id = "settings";
      iframe.contentDocument.head.appendChild(style);
    }

    // Add or update the style rules with the random class
    style.textContent = `
    .edselector { box-sizing: border-box;outline:2px solid blue!important; }
    .edselectordotted { box-sizing: border-box;outline:2px dotted blue!important; };
    `;

    const removeSelectedAtts = (target) => {
      // gets all elements
      const allelements = iframe.contentDocument.querySelectorAll("*");

      // Loop through each element to remove editable attributes
      allelements.forEach((element) => {
        // Checks to see if the selected element is the same target element
        if (target != element) {
          element.removeAttribute("contentEditable");
        }

        // Remove the "edselector" class
        element.classList.remove("edselector");
      });
    };

    //global select element function
    const selectElement = (classname) => {
      const target =
        iframe.contentDocument.getElementsByClassName(classname)[0];
      if (target) {
        setSelectedElement(target);
        removeSelectedAtts(target);
        target.classList.add("edselector");
      }
    };

    //listen for when element is clicked
    const handleElementClick = (event) => {
      const target = event.target;
      const className = target.className
        .replace("edselector", "")
        .trim()
        .replace("dotted", "")
        .trim()
        .replace(" edselector", "")
        .trim();

      //assigning a classname to element if doesnt exist
      if (
        !className ||
        className.trim() === "" ||
        className.trim() == "edselector" ||
        className.trim() == "edselectordotted"
      ) {
        // If no class is assigned, generate a random class
        const randomClass = generateRandomString(5);

        // Assign the random class to the element
        if (target.tagName == "BODY") {
          target.className = "body";
        } else {
          target.className = randomClass;
        }

        // Update or create the style tag
        let style =
          iframe.contentDocument.head.querySelector("#customStyle") ||
          document.createElement("style");
        if (!style.id) {
          style.id = "customStyle";
          iframe.contentDocument.head.appendChild(style);
        }

        // Add or update the style rules with the random class
        style.textContent += `.${randomClass} { /* your default styles here */ }`;

        //assigning the class
      }

      // Get styles from the custom style tag
      const styleTag =
        iframe.contentDocument.head.querySelector("#customStyle");
      const styles = styleTag ? getStylesForClass(styleTag, className) : {};

      if (className) {
        if (stylesheet2) {
          const element = stylesheet2["." + className];

          if(element){
            //setting side menu values
            setSelectedBackgroundC(element["background-color"] || "");
            setTextColor(element["color"] || "");
            setFontWeight(element["font-weight"] || "");
            setTextSize(element["font-size"] || "");
            setPaddingSize(element["padding"] || "");
            setMarginSize(element["margin"] || "");
            setFlexDirection(element["flex-direction"] || "");
            setFlexValue(element["flex"] || "");
            setGapValue(element["gap"] || "");
            setAlignItems(element["align-items"] || "");
            setJustifyContent(element["justify-content"] || "");
            setPositionValue(element["position"] || "");
            setDisplayValue(element["display"] || "");
            setBorderValue(element["border"] || "");
            setBorderRadius(element["border-radius"] || "");
            setTextAlign(element["text-align"] || "");
            setWidth(element["width"] || "");
            setHeight(element["height"] || "");
            setMinHeight(element["min-height"] || "");
            setMaxHeight(element["max-height"] || "");
            setMinWidth(element["min-width"] || "");
            setMaxWidth(element["max-width"] || "");
          }else{
            //reset side menu values
            setSelectedBackgroundC("");
            setTextColor("");
            setFontWeight("");
            setTextSize("");
            setPaddingSize("");
            setMarginSize("");
            setFlexDirection("");
            setFlexValue("");
            setGapValue("");
            setAlignItems("");
            setJustifyContent("");
            setPositionValue("");
            setDisplayValue("");
            setBorderValue("");
            setBorderRadius("");
            setTextAlign("");
            setWidth("");
            setHeight("");
            setMinHeight("");
            setMaxHeight("");
            setMinWidth("");
            setMaxWidth("");
          }
        }
      }

      selectElement(className);

      //remove contextmenu
      var customContextMenu = document.getElementById("customContextMenu");
      customContextMenu.style.display = "none";
    };

    iframe.contentDocument.addEventListener("click", handleElementClick);

    // Define the double click handler function
    const handleDoubleClick = (event) => {
      const iframeDocument = iframeRef.current.contentDocument;

      // Checks if element is selected and if it is then remove and select new
      const edSelectors = iframe.contentDocument.querySelectorAll("*");

      // Loop through each element with the class "edselector"
      edSelectors.forEach((edselector) => {
        // Check if the element has contentEditable set to true
        if (edselector.contentEditable === "true") {
          // Remove contentEditable attribute
          edselector.removeAttribute("contentEditable");
          // Remove the "edselector" class
          edselector.classList.remove("edselector");
        }
      });
      const target = event.target;
      target.contentEditable = true;
      target.focus();
    };

    iframe.contentDocument.addEventListener("dblclick", handleDoubleClick);

    const handleContextMenu = () => {
      event.preventDefault();
      console.log("showing context");

      var customContextMenu = document.getElementById("customContextMenu");
      customContextMenu.style.left = event.pageX + "px";
      customContextMenu.style.top = event.pageY + "px";
      customContextMenu.style.display = "block";
    };
    iframe.contentDocument.addEventListener("contextmenu", handleContextMenu);

    return () => {
      // Clean up the event listener when the component unmounts
      iframe.contentDocument.removeEventListener("click", handleElementClick);
      iframe.contentDocument.removeEventListener(
        "contextmenu",
        handleContextMenu
      );
      iframe.contentDocument.removeEventListener("dblclick", handleContextMenu);
    };
    updateIframeSize();
  }, [selectedSize, selectedElement, stylesheet, stylesheet2]);

  useEffect(() => {
    const iframe = document.getElementById("previewIframe");

    //loads iframe content from storage
    if (localStorage.getItem("editordata")) {
      console.log("found daata");
      const data = JSON.parse(localStorage.getItem("editordata"))["pages"][0];
      iframe.contentDocument.body.innerHTML = data["document"];
      console.log(iframe.contentDocument.body.innerHTML);
      setStylesheet2(data["styles"]);
    }
  }, []);

  const getStylesForClass = (styleTag, className) => {
    const styleSheet = styleTag.sheet;
    const styles = {};

    for (const rule of styleSheet.cssRules) {
      if (rule.selectorText === `.${className}`) {
        for (const prop of rule.style) {
          styles[prop] = rule.style[prop];
        }
      }
    }

    return styles;
  };

  const toggleShowAddFrame = () => {
    if (showAddFrame == false) {
      setShowAddFrame(true);
    } else {
      setShowAddFrame(false);
    }
  };

  const toggleShowTreeStack = () => {
    if (showTreeStack == false) {
      setShowTreeStack(true);
    } else {
      setShowTreeStack(false);
    }
  };

  const [iframesize, setiframesize] = useState("300px");

  const updateIframeSize = () => {
    const iframe = document.getElementById("previewIframe");
    const previewContainer = document.querySelector(".preview");
    const availableWidth = previewContainer.offsetWidth;

    if (selectedSize === "desktop") {
      iframe.style.transform = "scale(1)";
      iframe.style.width = "100%"; // Adjust as needed
      iframe.style.height = "100%"; // Adjust as needed
    } else {
      const phoneSize = { width: 375, height: 667 };
      const scaleFactor = Math.min(1, availableWidth / phoneSize.width);
      const scaledWidth = phoneSize.width * scaleFactor;
      const scaledHeight = phoneSize.height * scaleFactor;

      iframe.style.transform = `scale(${scaleFactor})`;
      iframe.style.width = `${scaledWidth}px`;
      iframe.style.height = `100%`;
    }

    setiframesize(`${iframe.clientWidth}px`);
  };

  const iframe = document.getElementById("previewIframe");

  const removeSelectedAtts = (target) => {
    // gets all elements
    const allelements = iframe.contentDocument.querySelectorAll("*");

    // Loop through each element to remove editable attributes
    allelements.forEach((element) => {
      // Checks to see if the selected element is the same target element
      if (target != element) {
        element.removeAttribute("contentEditable");
      }

      // Remove the "edselector" class
      element.classList.remove("edselector");
    });
  };

  //global select element function
  const selectElement = (classname) => {
    console.log("selecting element");
    const target = iframe.contentDocument.getElementsByClassName(classname)[0];
    if (target) {
      setSelectedElement(target);
      removeSelectedAtts(target);
      target.classList.add("edselector");

      //updating side menu
      const element = stylesheet2["." + classname];

      if(element){
      //setting side menu values
      setSelectedBackgroundC(element["background-color"] || "");
      setTextColor(element["color"] || "");
      setFontWeight(element["font-weight"] || "");
      setTextSize(element["font-size"] || "");
      setPaddingSize(element["padding"] || "");
      setMarginSize(element["margin"] || "");
      setFlexDirection(element["flex-direction"] || "");
      setFlexValue(element["flex"] || "");
      setGapValue(element["gap"] || "");
      setAlignItems(element["align-items"] || "");
      setJustifyContent(element["justify-content"] || "");
      setPositionValue(element["position"] || "");
      setDisplayValue(element["display"] || "");
      setBorderValue(element["border"] || "");
      setBorderRadius(element["border-radius"] || "");

      setTextAlign(element["text-align"] || "");
      setWidth(element["width"] || "");
      setHeight(element["height"] || "");
      setMinHeight(element["min-height"] || "");
      setMaxHeight(element["max-height"] || "");
      setMinWidth(element["min-width"] || "");
      setMaxWidth(element["max-width"] || "");
    }else{
        //reset side menu values
        setSelectedBackgroundC("");
        setTextColor("");
        setFontWeight("");
        setTextSize("");
        setPaddingSize("");
        setMarginSize("");
        setFlexDirection("");
        setFlexValue("");
        setGapValue("");
        setAlignItems("");
        setJustifyContent("");
        setPositionValue("");
        setDisplayValue("");
        setBorderValue("");
        setBorderRadius("");
        setTextAlign("");
        setWidth("");
        setHeight("");
        setMinHeight("");
        setMaxHeight("");
        setMinWidth("");
        setMaxWidth("");
      }
    }
  };
  const addNewElementToIframe = (type) => {
    const iframe = document.getElementById("previewIframe");

    // Generate a random 5-letter string for the class
    const randomClass = generateRandomString(5);

    // Check if the style tag already exists
    let style = iframe.contentDocument.head.querySelector("#customStyle");

    if (!style) {
      // If the style tag doesn't exist, create a new one
      style = document.createElement("style");
      style.id = "customStyle";
      style.type = "text/css";

      iframe.contentDocument.head.appendChild(style);
    }

    // Assuming stylesheet["customStyle"] is a JSON string
    var cssString = JSON.stringify(stylesheet["customStyle"]);
    try {
      cssString = cssString.replace(/^"|"$/g, "");
    } catch (e) {
      console.log(e);
    }

    console.log(cssString);

    //component library
    if (type == "text") {
      const newElement = document.createElement("div");
      newElement.textContent = "Your Text Here";
      newElement.className = "text-" + randomClass;
      const selement = selectedElement.className;
      console.log(iframe.contentWindow.document);

      iframe.contentWindow.document
        .getElementsByClassName(selement)[0]
        .appendChild(newElement);

      setStylesheet2((prevStylesheet) => {
        const classSelector = `.text-${randomClass}`;

        const newStylesheet = {
          ...prevStylesheet,
          [classSelector]: {},
        };

        setStylesheet2(newStylesheet);
        const css = Css.of(newStylesheet);
        style.textContent = css;
      });
    } else if (type == "section") {
      const newElement = document.createElement("section");
      newElement.className = "section-" + randomClass;
      const selement = selectedElement.className;
      console.log(iframe.contentWindow.document);

      iframe.contentWindow.document
        .getElementsByClassName(selement)[0]
        .appendChild(newElement);

      setStylesheet2((prevStylesheet) => {
        const classSelector = `.section-${randomClass}`;

        const newStylesheet = {
          ...prevStylesheet,
          [classSelector]: {
            height: "100px",
            width: "100%",
          },
        };

        setStylesheet2(newStylesheet);
        const css = Css.of(newStylesheet);
        style.textContent = css;
      });
    } else if (type == "button") {
      const newElement = document.createElement("button");
      newElement.className = "button-" + randomClass;
      newElement.textContent = "Button";
      const selement = selectedElement.className;
      console.log(iframe.contentWindow.document);

      iframe.contentWindow.document
        .getElementsByClassName(selement)[0]
        .appendChild(newElement);

      setStylesheet2((prevStylesheet) => {
        const classSelector = `.button-${randomClass}`;

        const newStylesheet = {
          ...prevStylesheet,
          [classSelector]: {
            "border-radius": "5px",
            padding: "0.5rem 1.3rem",
            border: "none",
            "background-color": "white",
          },
        };

        setStylesheet2(newStylesheet);
        const css = Css.of(newStylesheet);
        style.textContent = css;
      });
    } else if (type == "divblock") {
      const newElement = document.createElement("div");
      newElement.className = "div-" + randomClass;
      const selement = selectedElement.className;
      console.log(iframe.contentWindow.document);

      iframe.contentWindow.document
        .getElementsByClassName(selement)[0]
        .appendChild(newElement);

      setStylesheet2((prevStylesheet) => {
        const classSelector = `.div-${randomClass}`;

        const newStylesheet = {
          ...prevStylesheet,
          [classSelector]: {
            height: "100px",
            width: "100%",
          },
        };

        setStylesheet2(newStylesheet);
        const css = Css.of(newStylesheet);
        style.textContent = css;
      });
    } else if (type == "navbar") {
      const iframedoc = iframe.contentWindow.document;
      const newElement = document.createElement("div");
      newElement.className = "nav-" + randomClass;
      const selement = selectedElement.className;
      console.log(iframe.contentWindow.document);

      iframedoc.getElementsByClassName(selement)[0].appendChild(newElement);

      //addnavbrand
      const navbrand = document.createElement("a");
      navbrand.className = "navbrand-" + randomClass;
      navbrand.innerHTML = "Brand";
      newElement.appendChild(navbrand);

      //add navright
      const navright = document.createElement("div");
      navright.className = "navright-" + randomClass;
      newElement.appendChild(navright);

      //add navgroup
      const navgroup = document.createElement("div");
      navgroup.className = "navgroup-" + randomClass;
      navright.appendChild(navgroup);

      //add navbar link
      const navlink = document.createElement("a");
      navlink.className = "navlink-" + randomClass;
      navlink.innerHTML = "Link";
      navgroup.appendChild(navlink);

      //add navbar link
      const navlink2 = document.createElement("a");
      navlink2.className = "navlink2-" + randomClass;
      navlink2.innerHTML = "Link";
      navgroup.appendChild(navlink2);

      //add navbar button
      const navbutton2 = document.createElement("button");
      navbutton2.className = "navbutton-" + randomClass;
      navbutton2.innerHTML = "Button";
      navright.appendChild(navbutton2);

      setStylesheet2((prevStylesheet) => {
        const classSelector = `.nav-${randomClass}`;

        const newStylesheet = {
          ...prevStylesheet,
          [`.nav-${randomClass}`]: {
            width: "100%",
            display: "flex",
            "justify-content": "space-between",
            "background-color": "white",
            "align-items": "center",
            "box-sizing": "border-box",
            padding: "1rem",
          },
          [`.navright-${randomClass}`]: {
            display: "flex",
            "justify-content": "space-between",
            gap: "1rem",
            "align-items": "center",
          },
          [`.navbrand-${randomClass}`]: {
            color: "black",
            "font-weight": "800",
            "font-size": "1rem",
          },
          [`.navlink-${randomClass}`]: {
            color: "#3a3939",
            "font-weight": "800",
          },
          [`.navlink2-${randomClass}`]: {
            color: "#3a3939",
            "font-weight": "800",
          },
          [`.navgroup-${randomClass}`]: {
            display: "flex",
            "justify-content": "space-between",
            gap: "0.3rem",
            "align-items": "center",
          },
          [`.navbutton-${randomClass}`]: {
            padding: "0.5rem 1rem",
            "border-radius": "5px",
            border: "none",
            "background-color": "#FF4564",
            color: "white",
            "font-weight": "800",
            "font-size": "1rem",
          },
        };

        setStylesheet2(newStylesheet);
        const css = Css.of(newStylesheet);
        style.textContent = css;
      });
    } else if (type == "featured") {
      const newElement = document.createElement("div");
      const featuredclass = generateRandomString(5);
      newElement.className = "featured-" + featuredclass;
      const selement = selectedElement.className;
      console.log(iframe.contentWindow.document);

      iframe.contentWindow.document
        .getElementsByClassName(selement)[0]
        .appendChild(newElement);

      
      //h4
      const navbrand = document.createElement("h4");
      const h4class = generateRandomString(5);
      navbrand.className = "h4-" + h4class;
      navbrand.innerHTML = "Header 4";
      newElement.appendChild(navbrand);

      //h2
      const h2el = document.createElement("h2");
      const h2class = generateRandomString(5);
      h2el.className = "h2-" + h2class;
      h2el.innerHTML = "Your featured Title Here";

      newElement.appendChild(h2el);



      //p
      const pElement = document.createElement("p");
      const pclass = generateRandomString(5);
      pElement.className = "p-" + pclass;
      pElement.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

      newElement.appendChild(pElement);

      //button
      const buttonElement = document.createElement("button");
      const buttonclass = generateRandomString(5);
      buttonElement.className = "button-" + buttonclass;
      buttonElement.innerHTML = "Button"
      newElement.appendChild(buttonElement);


      setStylesheet2((prevStylesheet) => {
        
        const newStylesheet = {
          ...prevStylesheet,
          [`.featured-${featuredclass}`]: {
            width: "100%",
            padding:"2rem",
            display:"flex",
            "flex-direction":"column",
            gap:"0.3rem"
          },
          [`.h4-${h4class}`]: {
            color:"#FF4564",
            "font-weight":700,
            margin:0
            
          },
          [`.h2-${h2class}`]: {
            color:"black",
            "font-size":"2.5rem",
            margin:0,
            "font-weight":"600"
            
          },
          [`.p-${pclass}`]: {
            "font-size":"1.2rem",
            margin:0,
            "font-weight":"300",
            "max-width":"500px"
            
          },
          [`.button-${buttonclass}`]: {
            "border-radius": "5px",
            padding: "0.5rem 1.3rem",
            border: "none",
            "background-color": "#FF4564",
            color: "white",
            "font-weight": 700,
            width: "min-content",
            "font-size":"1.1rem"
            
          },
        };

        setStylesheet2(newStylesheet);
        const css = Css.of(newStylesheet);
        style.textContent = css;
      });
      



    }else if (type == "example placholder") {
      const newElement = document.createElement("div");
      const featuredclass = generateRandomString(5);
      newElement.className = "featured-" + featuredclass;
      const selement = selectedElement.className;
      console.log(iframe.contentWindow.document);

      iframe.contentWindow.document
        .getElementsByClassName(selement)[0]
        .appendChild(newElement);

      
      //h4
      const navbrand = document.createElement("h4");
      const h4class = generateRandomString(5);
      navbrand.className = "h4-" + h4class;
      navbrand.innerHTML = "Header 4";
      newElement.appendChild(navbrand);

      //h2
      const h2el = document.createElement("h2");
      const h2class = generateRandomString(5);
      h2el.className = "h2-" + h2class;
      h2el.innerHTML = "Your featured Title Here";

      newElement.appendChild(h2el);

      
      


      setStylesheet2((prevStylesheet) => {
        
        const newStylesheet = {
          ...prevStylesheet,
          [`.featured-${featuredclass}`]: {
            height: "100px",
            width: "100%",
            padding:"2rem",
            display:"flex",
            "flex-direction":"column",
            gap:"0.3rem"
          },
          [`.h4-${h4class}`]: {
            color:"#FF4564",
            "font-weight":700,
            margin:0
            
          },
          [`.h2-${h2class}`]: {
            color:"black",
            "font-size":"2.5rem",
            margin:0,
            "font-weight":"700"
            
          }
        };

        setStylesheet2(newStylesheet);
        const css = Css.of(newStylesheet);
        style.textContent = css;
      });
      



    }

    setShowAddFrame(false);
  };

  const handleSizeButtonClick = (size) => {
    setSelectedSize(size);
  };

  //beginning of side editor values
  const [selectedBackgroundC, setSelectedBackgroundC] = useState("");
  //update the selected elements background color
  const handleBackgroundCChange = (e) => {
    // Update the state with the new input value
    setSelectedBackgroundC(e);

    if (selectedElement) {
      // Update the text size of the selected element in the iframe
      const iframe = document.getElementById("previewIframe");
      const className = selectedElement.className.replace("edselector", "");

      let style = iframe.contentDocument.head.querySelector("#customStyle");

      const classSelector = `.${selectedElement.className
        .replace("edselector", "")
        .trim()}`;

      // Clone the previous stylesheet to avoid directly modifying it
      const newStylesheet = stylesheet2;

      // Update the font-size property for the selected class
      if (newStylesheet[classSelector]) {
        newStylesheet[classSelector] = {
          ...newStylesheet[classSelector],
          "background-color": e,
        };
      } else {
        newStylesheet[classSelector] = {
          "background-color": e,
        };
      }

      // Update the state with the modified stylesheet
      setStylesheet2(newStylesheet);

      // Update the style.textContent if needed
      const css = Css.of(newStylesheet);
      style.textContent = css;
    }
  };

  const [fontWeight, setFontWeight] = useState("");

  const [textColor, setTextColor] = useState("");
  //update the selected elements background color
  const handleTextColorChange = (e) => {
    // Update the state with the new input value
    setTextColor(e);

    if (selectedElement) {
      // Update the text size of the selected element in the iframe
      const iframe = document.getElementById("previewIframe");
      const className = selectedElement.className.replace("edselector", "");

      let style = iframe.contentDocument.head.querySelector("#customStyle");

      const classSelector = `.${selectedElement.className
        .replace("edselector", "")
        .trim()}`;

      // Clone the previous stylesheet to avoid directly modifying it
      const newStylesheet = stylesheet2;

      // Update the font-size property for the selected class
      if (newStylesheet[classSelector]) {
        newStylesheet[classSelector] = {
          ...newStylesheet[classSelector],
          color: e,
        };
      } else {
        newStylesheet[classSelector] = {
          color: e,
        };
      }

      // Update the state with the modified stylesheet
      setStylesheet2(newStylesheet);

      // Update the style.textContent if needed
      const css = Css.of(newStylesheet);
      style.textContent = css;
    }
  };

  const handleStyleChange = (property, value) => {
    if (selectedElement) {
      const iframe = document.getElementById("previewIframe");
      const className = selectedElement.className
        .replace("edselector", "")
        .trim();

      let style = iframe.contentDocument.head.querySelector("#customStyle");

      setStylesheet2((prevStylesheet) => {
        const classSelector = `.${className}`;
        const newStylesheet = { ...prevStylesheet };

        if (newStylesheet[classSelector]) {
          newStylesheet[classSelector] = {
            ...newStylesheet[classSelector],
            [property]: value,
          };
        } else {
          newStylesheet[classSelector] = {
            [property]: value,
          };
        }

        setStylesheet2(newStylesheet);

        const css = Css.of(newStylesheet);
        style.textContent = css;
      });
    }
  };

  const [textSize, setTextSize] = useState("");
  const [borderRadius, setBorderRadius] = useState("");
  const [borderValue, setBorderValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [paddingSize, setPaddingSize] = useState("");
  const [marginSize, setMarginSize] = useState("");
  const [flexDirection, setFlexDirection] = useState("");
  const [flexValue, setFlexValue] = useState("");
  const [gapValue, setGapValue] = useState("");
  const [alignItems, setAlignItems] = useState("");
  const [justifyContent, setJustifyContent] = useState("");
  const [positionValue, setPositionValue] = useState("");
  const [textAlign, setTextAlign] = useState("");
  const [widthValue, setWidth] = useState("");
  const [heightValue, setHeight] = useState("");
  const [minHeightValue, setMinHeight] = useState("");
  const [maxHeightValue, setMaxHeight] = useState("");
  const [minWidthValue, setMinWidth] = useState("");
  const [maxWidthValue, setMaxWidth] = useState("");

  //new
  const [marginTop, setMarginTop] = useState("");
  const [marginBottom, setMarginBottom] = useState("");
  const [marginRight, setMarginRight] = useState("");
  const [marginLeft, setMarginLeft] = useState("");
  const [paddingTop, setPaddingTop] = useState("");
  const [paddingBottom, setPaddingBottom] = useState("");
  const [paddingRight, setPaddingRight] = useState("");
  const [paddingLeft, setPaddingLeft] = useState("");
  const handleDisplayValueChange = (e) => {
    setDisplayValue(e.target.value);
    handleStyleChange("display", e.target.value);
  };
  const handlePositionValueChange = (e) => {
    setPositionValue(e.target.value);
    handleStyleChange("position", e.target.value);
  };

  const savePage = () => {
    const iframe =
      document.getElementById("previewIframe").contentDocument.body;

    // Extract the HTML content from the iframe body
    const iframeHTML = iframe.innerHTML;

    // Create a JSON object with the extracted HTML content
    const jsonData = {
      pages: [
        {
          name: "test",
          document: iframeHTML,
          styles: stylesheet2,
        },
      ],
    };

    // Store the JSON object in local storage
    localStorage.setItem("editordata", JSON.stringify(jsonData));
  };

  const iframeRef = useRef(null);

  return (
    <div className="editor">
      <ul id="customContextMenu">
        <li>Cut</li>
        <li>Copy</li>
        <li>Duplicate</li>
        <li>Delete</li>
        <li>Show HTML/CSS</li>
        
      </ul>
      <div className="sidebar">
        WB
        <button onClick={toggleShowAddFrame}>+</button>
        <button onClick={toggleShowTreeStack}>
          <svg
            className="stacksvg"
            color="white"
            viewBox="0 0 24 24"
            role="presentation"
          >
            <path d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z"></path>
          </svg>
        </button>
      </div>
      <div className="inner">
        <div className="navbar">
          <button>/Home</button>
          <div className="sizeSelectors">
            <button
              id="selectDesktopSize"
              onClick={() => handleSizeButtonClick("desktop")}
            >
              <svg width="20" height="20" x="0" y="0" viewBox="0 0 24 24">
                <g>
                  <path
                    fill="#FFFFFF"
                    fill-rule="evenodd"
                    d="M1.25 6A2.75 2.75 0 0 1 4 3.25h16A2.75 2.75 0 0 1 22.75 6v10A2.75 2.75 0 0 1 20 18.75h-5.787l.75 1.5H17a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1 0-1.5h2.036l.75-1.5H4A2.75 2.75 0 0 1 1.25 16zM20 17.25H4c-.69 0-1.25-.56-1.25-1.25V6c0-.69.56-1.25 1.25-1.25h16c.69 0 1.25.56 1.25 1.25v10c0 .69-.56 1.25-1.25 1.25z"
                    clip-rule="evenodd"
                    opacity="1"
                    data-original="#000000"
                    class=""
                  ></path>
                </g>
              </svg>
            </button>
            <button
              id="selectPhoneSize"
              onClick={() => handleSizeButtonClick("phone")}
            >
              <svg width="20" height="20" x="0" y="0" viewBox="0 0 35 35">
                <g>
                  <path
                    d="M25.302 0H9.698a2.37 2.37 0 0 0-2.364 2.364v30.271A2.371 2.371 0 0 0 9.698 35h15.604a2.37 2.37 0 0 0 2.364-2.364V2.364A2.37 2.37 0 0 0 25.302 0zM15.004 1.704h4.992a.286.286 0 0 1 0 .573h-4.992a.286.286 0 1 1 0-.573zM17.5 33.818a1.182 1.182 0 1 1 0-2.364 1.182 1.182 0 0 1 0 2.364zm8.521-3.193H8.979V3.749h17.042v26.876z"
                    fill="#FFFFFF"
                    opacity="1"
                    data-original="#000000"
                  ></path>
                </g>
              </svg>
            </button>
            <p>{iframesize} X 300px</p>
          </div>

          <button className="saveBTN" onClick={savePage}>
            <svg width="20" height="20" x="0" y="0" viewBox="0 0 32 32">
              <g>
                <path
                  d="m30.71 7.29-6-6A1 1 0 0 0 24 1h-2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V1H4a3 3 0 0 0-3 3v24a3 3 0 0 0 3 3h2v-9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v9h2a3 3 0 0 0 3-3V8a1 1 0 0 0-.29-.71z"
                  fill="#FFFFFF"
                  opacity="1"
                  data-original="#000000"
                  class="hovered-path"
                ></path>
                <path
                  d="M12 1h8v8h-8zM23 21H9a1 1 0 0 0-1 1v9h16v-9a1 1 0 0 0-1-1z"
                  fill="#FFFFFF"
                  opacity="1"
                  data-original="#000000"
                  class="hovered-path"
                ></path>
              </g>
            </svg>
          </button>
        </div>
        <div className="innermost">
          {showTreeStack && <ShowTreeStack selectElement={selectElement} />}
          {showAddFrame && (
            <AddSideFrame addNewElementToIframe={addNewElementToIframe} />
          )}
          {/* ... */}
          <div className="preview">
            <iframe
              id="previewIframe"
              title="Preview Iframe"
              ref={iframeRef}
            ></iframe>
          </div>
          <div className="editsidebar">
            <div className="editinnersidebar">
              <p>Element Configuration</p>
              <div>
                Selector:
                {selectedElement.className &&
                  selectedElement.className
                    .replace("edselector", "")
                    .replace("dotted", "")}
              </div>

              <button>
                Spacing
                <svg
                  width="12"
                  height="12"
                  x="0"
                  y="0"
                  viewBox="0 0 451.847 451.847"
                >
                  <g>
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      fill="#FFFFFF"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </button>

              <div className="textframe">
                <div class="holder">
                  <div class="paddingselector">
                    <span>Margin</span>
                    <div class="pselector">
                      <input
                        class="pselectorinput"
                        type="number"
                        placeholder="0"
                        id="marginleft"
                        value={marginLeft}
                        onChange={(e) => {
                          setMarginLeft(e.target.value);
                          handleStyleChange("margin-left", e.target.value);
                        }}
                      />
                    </div>
                    <div class="pselectormiddle">
                      <div class="mselector">
                        <input
                          class="pselectorinput"
                          type="number"
                          placeholder="0"
                          id="margintop"
                          value={marginTop}
                          onChange={(e) => {
                            setMarginTop(e.target.value);
                            handleStyleChange("margin-top", e.target.value);
                          }}
                        />
                      </div>
                      <div class="mmiddle">
                        <span>Padding</span>
                        <div class="oselector">
                          <input
                            class="pselectorinput"
                            type="number"
                            placeholder="0"
                            id="paddingtop"
                            value={paddingTop}
                            onChange={(e) => {
                              setPaddingTop(e.target.value);
                              handleStyleChange("padding-top", e.target.value);
                            }}
                          />
                        </div>
                        <div class="mmmiddle">
                          <div class="oselector">
                            <input
                              class="pselectorinput"
                              type="number"
                              placeholder="0"
                              id="paddingleft"
                              value={paddingLeft}
                              onChange={(e) => {
                                setPaddingLeft(e.target.value);
                                handleStyleChange(
                                  "padding-left",
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                          Sizing
                          <div class="oselector">
                            <input
                              class="pselectorinput"
                              type="number"
                              placeholder="0"
                              id="paddingright"
                              value={paddingRight}
                              onChange={(e) => {
                                setPaddingRight(e.target.value);
                                handleStyleChange(
                                  "padding-right",
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </div>
                        <div class="oselector">
                          <input
                            class="pselectorinput"
                            placeholder="0"
                            id="paddingbottom"
                            value={paddingBottom}
                            onChange={(e) => {
                              setPaddingBottom(e.target.value);
                              handleStyleChange(
                                "padding-bottom",
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div class="mselector">
                        <input
                          class="pselectorinput"
                          type="number"
                          placeholder="0"
                          id="marginbottom"
                          value={marginBottom}
                          onChange={(e) => {
                            setMarginBottom(e.target.value);
                            handleStyleChange("margin-bottom", e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div class="pselector">
                      <input
                        class="pselectorinput"
                        type="number"
                        placeholder="0"
                        id="marginright"
                        value={marginRight}
                        onChange={(e) => {
                          setMarginRight(e.target.value);
                          handleStyleChange("margin-right", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="textinnerframe">
                  Padding
                  <input
                    value={paddingSize}
                    onChange={(e) => {
                      setPaddingSize(e.target.value);
                      handleStyleChange("padding", e.target.value);
                    }}
                  ></input>
                </div>

                <div className="textinnerframe">
                  Margin
                  <input
                    value={marginSize}
                    onChange={(e) => {
                      setMarginSize(e.target.value);
                      handleStyleChange("margin", e.target.value);
                    }}
                  ></input>
                </div>
              </div>

              <button>
                Size
                <svg
                  width="12"
                  height="12"
                  x="0"
                  y="0"
                  viewBox="0 0 451.847 451.847"
                >
                  <g>
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      fill="#FFFFFF"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </button>
              <div className="sizingframe">
                <div>
                  <div className="sizingInput">
                    W
                    <input
                      value={widthValue}
                      onChange={(e) => {
                        setWidth(e.target.value);
                        handleStyleChange("width", e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="sizingInput">
                    H
                    <input
                      value={heightValue}
                      onChange={(e) => {
                        setHeight(e.target.value);
                        handleStyleChange("height", e.target.value);
                      }}
                    ></input>
                  </div>
                </div>

                <div>
                  <div className="sizingInput">
                    Min-W
                    <input
                      value={minWidthValue}
                      onChange={(e) => {
                        setMinWidth(e.target.value);
                        handleStyleChange("min-width", e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="sizingInput">
                    Min-H
                    <input
                      value={minHeightValue}
                      onChange={(e) => {
                        setMinHeight(e.target.value);
                        handleStyleChange("min-height", e.target.value);
                      }}
                    ></input>
                  </div>
                </div>

                <div>
                  <div className="sizingInput">
                    Max-W
                    <input
                      value={maxWidthValue}
                      onChange={(e) => {
                        setMaxWidth(e.target.value);
                        handleStyleChange("max-width", e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="sizingInput">
                    Max-H
                    <input
                      value={maxHeightValue}
                      onChange={(e) => {
                        setMaxHeight(e.target.value);
                        handleStyleChange("max-height", e.target.value);
                      }}
                    ></input>
                  </div>
                </div>
              </div>

              <button>
                Text
                <svg
                  width="12"
                  height="12"
                  x="0"
                  y="0"
                  viewBox="0 0 451.847 451.847"
                >
                  <g>
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      fill="#FFFFFF"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </button>

              <div className="textframe">
                <div className="textinnerframe">
                  Size
                  <input
                    value={textSize}
                    onChange={(e) => {
                      setTextSize(e.target.value);
                      handleStyleChange("font-size", e.target.value);
                    }}
                  ></input>
                  Weight
                  <input
                    value={fontWeight}
                    onChange={(e) => {
                      setFontWeight(e.target.value);
                      handleStyleChange("font-weight", e.target.value);
                    }}
                  ></input>
                </div>
                <div className="textinnerframe">
                  Align
                  <input
                    value={textAlign}
                    onChange={(e) => {
                      setTextAlign(e.target.value);
                      handleStyleChange("text-align", e.target.value);
                    }}
                  ></input>
                </div>
                <div className="textinnerframe">
                  Color
                  <ColorPicker
                    color={textColor}
                    onChange={handleTextColorChange}
                  />
                </div>
              </div>

              <button>
                Background
                <svg
                  width="12"
                  height="12"
                  x="0"
                  y="0"
                  viewBox="0 0 451.847 451.847"
                >
                  <g>
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      fill="#FFFFFF"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </button>
              <div className="backgroundframe">
                Color
                <ColorPicker
                  color={selectedBackgroundC}
                  onChange={handleBackgroundCChange}
                />
              </div>

              <button>
                Borders
                <svg
                  width="12"
                  height="12"
                  x="0"
                  y="0"
                  viewBox="0 0 451.847 451.847"
                >
                  <g>
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      fill="#FFFFFF"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </button>
              <div className="textframe">
                <div className="textinnerframe">
                  Radius
                  <input
                    value={borderRadius}
                    onChange={(e) => {
                      setBorderRadius(e.target.value);
                      handleStyleChange("border-radius", e.target.value);
                    }}
                  ></input>
                </div>
                <div className="textinnerframe">
                  Border
                  <input
                    value={borderValue}
                    onChange={(e) => {
                      setBorderValue(e.target.value);
                      handleStyleChange("border", e.target.value);
                    }}
                  ></input>
                </div>
              </div>

              <button>
                Position
                <svg
                  width="12"
                  height="12"
                  x="0"
                  y="0"
                  viewBox="0 0 451.847 451.847"
                >
                  <g>
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      fill="#FFFFFF"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </button>
              <div className="textframe">
                <div className="textinnerframe">
                  Position
                  <select
                    id="displays"
                    name="Display"
                    value={positionValue}
                    onChange={handlePositionValueChange}
                  >
                    <option value="static">Static</option>
                    <option value="fixed">Fixed</option>
                    <option value="absolute">Absolute</option>
                    <option value="relative">Relative</option>
                    <option value="sticky">Sticky</option>
                  </select>
                </div>
              </div>

              <button>
                Display
                <svg
                  width="12"
                  height="12"
                  x="0"
                  y="0"
                  viewBox="0 0 451.847 451.847"
                >
                  <g>
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      fill="#FFFFFF"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </button>
              <div className="textframe">
                <div className="textinnerframe">
                  Display
                  <select
                    id="displays"
                    name="Display"
                    value={displayValue}
                    onChange={handleDisplayValueChange}
                  >
                    <option value="block">Block</option>
                    <option value="flex">Flex</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div className="textinnerframe">
                  Flex-Direction
                  <input
                    value={flexDirection}
                    onChange={(e) => {
                      setFlexDirection(e.target.value);
                      handleStyleChange("flex-direction", e.target.value);
                    }}
                  ></input>
                </div>

                <div className="textinnerframe">
                  Flex
                  <input
                    value={flexValue}
                    onChange={(e) => {
                      setFlexValue(e.target.value);
                      handleStyleChange("flex", e.target.value);
                    }}
                  ></input>
                </div>

                <div className="textinnerframe">
                  Gap
                  <input
                    value={gapValue}
                    onChange={(e) => {
                      setGapValue(e.target.value);
                      handleStyleChange("gap", e.target.value);
                    }}
                  ></input>
                </div>

                <div className="textinnerframe">
                  Align Items
                  <input
                    value={alignItems}
                    onChange={(e) => {
                      setAlignItems(e.target.value);
                      handleStyleChange("align-items", e.target.value);
                    }}
                  ></input>
                </div>

                <div className="textinnerframe">
                  Justify Content
                  <select
                    id="displays"
                    name="Display"
                    value={justifyContent}
                    onChange={(e) => {
                      setJustifyContent(e.target.value);
                      handleStyleChange("justify-content", e.target.value);
                    }}
                  >
                    <option value="center">Center</option>
                    <option value="start">Start</option>
                    <option value="end">End</option>

                    <option value="space-around">Around</option>
                    <option value="space-between">Between</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
