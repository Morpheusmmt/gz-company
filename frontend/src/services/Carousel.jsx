import React, { useState } from "react";
import "./Carousel.css";

export default function Carousel({ items }) {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const leftIndex = (index - 1 + items.length) % items.length;
  const rightIndex = (index + 1) % items.length;

  return (
    <div className="carousel-wrapper">

      <button className="arrow left" onClick={prev}>❮</button>

      <div className="carousel">

        <div className="side">
          <img src={items[leftIndex].img} alt="" />
        </div>
       
        <div className="center">
          <img src={items[index].img} alt="" />
          <p>{items[index].title}</p>
        </div>

        <div className="side">
          <img src={items[rightIndex].img} alt="" />
        </div>
      </div>

      <button className="arrow right" onClick={next}>❯</button>
    </div>
  );
}