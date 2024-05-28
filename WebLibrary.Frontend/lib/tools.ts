export const cutIfLonger = (str: string, lengthBreakpoint: number) => {
  if (str.length > lengthBreakpoint) {
    return str.substring(0, lengthBreakpoint) + "...";
  }

  return str;
};


function removeEmpty(obj: any, condition: (obj:any, key: any) => boolean) {
  Object.keys(obj).forEach(function(key) {
    (obj[key] && typeof obj[key] === 'object') && removeEmpty(obj[key], condition) ||
    (condition(obj, key)) && delete obj[key]
  });
  return obj;
}

export function replaceEmptyStrings(obj: any) {
  removeEmpty(obj,(o,k) => {
    if(o[k] === '') {
      o[k] = null
    }
    return false
  })
}

export function removeEmptyFields(obj: any) {
  removeEmpty(obj,(o,k) => o[k] === '' || o[k] === null)
}