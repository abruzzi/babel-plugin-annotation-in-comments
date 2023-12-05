import { fireOperationalAnalytics, createAnalyticsEvent } from "@abc/analytics";
import React from "react";
const MenuItem = () => {
  // @operational("menu", "clicked", "menuItem")
  // @experiment("workflowTemplate")
  function handleClick(e) {
    fireOperationalAnalytics(
      createAnalyticsEvent({
        actionSubject: "menu",
        action: "clicked",
        actionSubjectId: "menuItem",
      })
    );
    console.log(e.target.value);
  }
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};
export default MenuItem;