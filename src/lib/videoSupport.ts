const VIDEO_EXTENSIONS = ['mpg', 'mp4', 'webm', 'ogv', 'mov', 'avi'];
const mimeToExtensionMap: Record<string, string> = {
  'video/mpeg': 'mpg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogv',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
};
export const getExtensionsFromBase64 = (base64: string) => {
  const fileHead = base64.split(',')[0];
  const extension = mimeToExtensionMap[fileHead.split(':')[1]?.split(';')[0].toLowerCase()];
  return extension
    ? extension
    : fileHead.toString().slice(fileHead.indexOf('/') + 1, fileHead.indexOf(';'));
};
export const getVideoSourceBase64 = (imagePreview: string) => {
  const fileHead = imagePreview.split(',')[0];
  const extension = getExtensionsFromBase64(fileHead.toLowerCase());
  if (extension === 'mov' || extension === 'mp4') {
    return { src: imagePreview, type: 'video/mp4' };
  } else if (extension === 'ogv') {
    return { src: imagePreview, type: 'video/ogg' };
  } else if (extension === 'avi') {
    return { src: imagePreview, type: 'video/avi' };
  } else {
    return { src: imagePreview };
  }
};
export const getVideoSource = (imagePreview: string, isThumbnail: boolean = false) => {
  const lower = imagePreview.toLowerCase();
  const t = isThumbnail ? '#t=0.1' : '';
  if (lower.endsWith('.mov') || lower.includes('.mp4')) {
    return { src: imagePreview + t, type: 'video/mp4' };
  } else if (lower.endsWith('.ogv')) {
    return { src: imagePreview + t, type: 'video/ogg' };
  } else if (lower.endsWith('.avi')) {
    return { src: imagePreview + t, type: 'video/avi' };
  } else {
    return { src: imagePreview + t };
  }
};
export const isVideoSupportedBase64 = (imagePreview: string) => {
  const head = imagePreview.split(',')[0];
  return head.includes('video');
};
export const isVideoSupported = (imagePreview: string) => {
  const lower = imagePreview.toLowerCase();
  return VIDEO_EXTENSIONS.some((extension) => lower.endsWith(`.${extension}`));
};
