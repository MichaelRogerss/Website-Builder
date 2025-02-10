import React, { useEffect } from 'react';
import './home.css';
import { Link, useParams } from 'react-router-dom';
import dragula from 'dragula';

const Card = (props) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Example Card</h3>
      </div>
      <div className="card-body">
        <p>{props.body}</p>
      </div>
    </div>
  );
};

const Home = () => {
  useEffect(() => {
    let left = document.getElementById('left');
    let right = document.getElementById('right');
    dragula([left, right]);
  }, []); // empty dependency array ensures useEffect runs once after initial render

  return (
    <div className="container">
      <div id="left" className="container">
        <Card body="Card 3" />
        <Card body="Card 4" />
      </div>
      <div id="right" className="container">
        <Card body="Card 1" />
        <Card body="Card 2" />
      </div>
    </div>
  );
};

export default Home;
