import React from 'react';

const MenuItem = (id) => {
  // @operational("menu", "clicked", "menuItem")
  function handleClick(e) {
    dispatch({type: "ADD_ITEM"})
  }

  return <div>
    <button onClick={() => handleClick(id)}>Add to bucket</button>
  </div>
}

export default MenuItem;