import { fireUIAnalytics, createAnalyticsEvent } from "@abc/analytics";
// @ui("clicked", "dropdownMenu", "addWorkflow")
const handleDropdownMenuOpen = useCallback(() => {
  fireUIAnalytics(
    createAnalyticsEvent({
      actionSubject: "dropdownMenu",
      action: "clicked",
      actionSubjectId: "addWorkflow",
    })
  );
  setIsDropdownMenuOpen(!isDropdownMenuOpen);
}, [createAnalyticsEvent, isDropdownMenuOpen]);