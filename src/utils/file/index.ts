export function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function getFilename(file: File) {
  const type = [...file.type.split('/')][1] || '';
  return file.name + '.' + type;
}
