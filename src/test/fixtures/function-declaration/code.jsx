import React from 'react';

const MenuItem = () => {
  // @operational("menuitem clicked")
  function handleClick(e) {
    console.log(e.target.value);
  }

  return <div>
    <button onClick={handleClick}>Click me</button>
  </div>
}

export default MenuItem;