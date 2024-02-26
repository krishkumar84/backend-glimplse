import * as XLSX from 'xlsx';
import { Response } from 'express';

const writeXLSXWithSheets = async (
  res: Response,
  validData: Array<Record<string, any>>,
  faultyData: Array<Record<string, any>>,
  headers: string[],
  fileName: string
) => {
  const wb = XLSX.utils.book_new();

  // Add a sheet for valid data
  const validWs = XLSX.utils.json_to_sheet(validData, { header: headers });
  XLSX.utils.book_append_sheet(wb, validWs, "ValidData");

  // Add a sheet for faulty data
  const faultyWs = XLSX.utils.json_to_sheet(faultyData, { header: headers });
  XLSX.utils.book_append_sheet(wb, faultyWs, "FaultyData");
  try {
    // Send the file as a download attachment
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    const fileBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: false,
      type: "buffer",
    });
    res.end(fileBuffer);
  } catch (error) {
    console.error("Error writing XLSX:", error);
    throw error;
  }
};

const readXLSX = async (fileBuffer: Buffer) => {
  try {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { header: 0 });
  } catch (error) {
    console.error('Error reading XLSX:', error);
    throw error;
  }
};

export {writeXLSXWithSheets, readXLSX};
