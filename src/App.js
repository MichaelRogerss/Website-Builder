// App.js
import React,{useState} from 'react';
import {BrowserRouter, Router,Routes, Route, useParams } from 'react-router-dom';
import './App.css'; // Import the CSS Module

import Home from './pages/home'
import Editor from './pages/editor'
function App() {
  
  return (
    <>  
      
      <Editor/>
      
    </>
  );
}

export default App;
