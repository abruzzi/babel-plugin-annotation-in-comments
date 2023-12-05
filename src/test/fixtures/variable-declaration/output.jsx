import { fireOperationalAnalytics, createAnalyticsEvent } from "@abc/analytics";
import React from "react";
const MenuItem = () => {
  // @operational("clicked", "menuitem", "")
  const handleClick = (e) => {
    fireOperationalAnalytics(
      createAnalyticsEvent({
        actionSubject: "clicked",
        action: "menuitem",
        actionSubjectId: "",
      })
    );
    console.log(e.target.value);
  };
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};
export default MenuItem;