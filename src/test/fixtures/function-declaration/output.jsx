import { fireUIEvent } from "@abc/analytics";
import React from "react";
const MenuItem = (id) => {
  // @operational("menu clicked")
  function handleClick(e) {
    fireUIEvent("menu clicked");
    dispatch({
      type: "ADD_ITEM",
    });
  }
  return (
    <div>
      <button onClick={() => handleClick(id)}>Add to bucket</button>
    </div>
  );
};
export default MenuItem;