// @ui("clicked", "dropdownMenu", "addWorkflow")
const handleDropdownMenuOpen = useCallback(() => {
  setIsDropdownMenuOpen(!isDropdownMenuOpen);
}, [isDropdownMenuOpen]);