import { createWriteStream } from 'fs';

/**
 * @description Write Quicktype-converted contracts to disk.
 */
export async function writeContractToDisk(contractFilePath: string, quicktypeSchema: any) {
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(contractFilePath);
    quicktypeSchema.lines.forEach((value: string) => writeStream.write(`${value}\n`));

    writeStream.on('finish', () => resolve('Done'));
    writeStream.on('error', () => reject());

    writeStream.end();
  });
}
