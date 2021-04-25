import { convertToQuicktype } from './convertToQuicktype';
import { writeContractToDisk } from './writeContractToDisk';

/**
 * @description Do Quicktype conversion and write the file to disk.
 */
export async function createContractFile(contract: any, fullFilePath: string): Promise<void> {
  try {
    const quicktypeSchema: any = await convertToQuicktype(JSON.stringify(contract));
    await writeContractToDisk(fullFilePath, quicktypeSchema);
  } catch (error) {
    console.error(error);
  }
}
