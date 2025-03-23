export const extractFilename = (url) => {
  if (!url) return "Tên CV không xác định";
  const parts = url.split("/");
  const encodedFilename = parts[parts.length - 1];
  try {
    const name = decodeURIComponent(encodedFilename);
    return name.substring(37)
  } catch (e) {
    return encodedFilename;
  }
};