import React from 'react';

const MenuItem = () => {
  // @operational("menuitem clicked")
  // @experiment("workflow.template")
  function handleClick(e) {
    console.log(e.target.value);
  }

  return <div>
    <button onClick={handleClick}>Click me</button>
  </div>
}

export default MenuItem;