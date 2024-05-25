export const cutIfLonger = (str: string, lengthBreakpoint: number) => {
  if (str.length > lengthBreakpoint) {
    return str.substring(0, str.lastIndexOf(" ")) + "...";
  }

  return str;
};
