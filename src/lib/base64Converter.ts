function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function base64sConverter(files: FileList): Promise<string[]> {
  const filePathsPromises: Promise<string>[] = [];
  Array.from(files).forEach((file) => {
    filePathsPromises.push(toBase64(file));
  });
  const filePaths = await Promise.all<string>(filePathsPromises);
  return filePaths;
}

export async function convertSingleFileToBase64(file: File): Promise<string> {
  const base64String = await toBase64(file);
  return base64String;
}
