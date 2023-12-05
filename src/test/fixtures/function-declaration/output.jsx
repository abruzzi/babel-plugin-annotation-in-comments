import { fireOperationalAnalytics, createAnalyticsEvent } from "@abc/analytics";
import React from "react";
const MenuItem = (id) => {
  // @operational("menu", "clicked", "menuItem")
  function handleClick(e) {
    fireOperationalAnalytics(
      createAnalyticsEvent({
        actionSubject: "menu",
        action: "clicked",
        actionSubjectId: "menuItem",
      })
    );
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