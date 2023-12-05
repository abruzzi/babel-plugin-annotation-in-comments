import React from 'react';

const MenuItem = () => {
  // @operational("menu", "clicked", "menuItem")
  // @experiment("workflowTemplate")
  function handleClick(e) {
    console.log(e.target.value);
  }

  return <div>
    <button onClick={handleClick}>Click me</button>
  </div>
}

export default MenuItem;