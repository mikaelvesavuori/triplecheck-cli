/**
 * @description Load data from a local file.
 */
export async function loadDataLocal(filePath: string) {
  const path = `${process.cwd()}/${filePath}`;
  console.log(`Loading file from ${path}...`);
  const file = await import(path);
  const data = file.default || file;
  if (!data) throw new Error('No data loaded!');
  return data;
}
