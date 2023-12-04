import { fireUIEvent } from "@abc/analytics";
import React from "react";
const MenuItem = () => {
  // @operational("menuitem clicked")
  const handleClick = (e) => {
    fireUIEvent("menuitem clicked");
    console.log(e.target.value);
  };
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};
export default MenuItem;