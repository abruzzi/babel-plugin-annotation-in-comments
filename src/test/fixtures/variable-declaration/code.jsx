import React from 'react';

const MenuItem = () => {
  // @operational("clicked", "menuitem", "")
  const handleClick = (e) => {
    console.log(e.target.value);
  }

  return <div>
    <button onClick={handleClick}>Click me</button>
  </div>
}

export default MenuItem;