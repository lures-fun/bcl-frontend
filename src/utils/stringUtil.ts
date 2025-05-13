export const omitString = (text: string, len: number): string => {
  if (text.length > len) {
    text = `${text.substring(0, len)}...`;
  }
  return text;
};

export const replaceWithMention = (text: string): string => {
  const regex = /@([A-Za-z0-9_-]+)(?![A-Za-z0-9._-]*[A-Za-z0-9])/g;
  return text.replace(regex, (match, p1) => `@[${p1}]`);
};
