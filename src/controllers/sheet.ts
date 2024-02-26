import { Request, Response, NextFunction } from "express";
import csvtojson from "csvtojson";
import { readXLSX, writeXLSXWithSheets } from "./csv.controller";

interface CustomRecord {
    [key: string]: string; 
}

const postSheetProcess = async (
  req: Request,
  res: Response,
  next: NextFunction  ) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // read uploaded file
    const fileBuffer = req.file.buffer;

    if (!fileBuffer) {
      console.log("Invalid file buffer:", fileBuffer);
      return res.status(400).json({ error: "Invalid file buffer" });
    }

    // parse the file using csv2json or readXLSX based on file type
    let jsonArrays;

    if (
      req.file.mimetype === "text/csv" ||
      req.file.originalname.endsWith(".csv")
    ) {
      jsonArrays = await csvtojson({
        noheader: false,
        trim: true,
        output: "json",
      }).fromString(fileBuffer.toString("utf-8"));
    } else if (
      req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      req.file.originalname.endsWith(".xlsx")
    ) {
      jsonArrays = await readXLSX(fileBuffer);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    // filter defective records
    // Extract headers from the first row
    const headers = Object.keys(jsonArrays[0]);

    const requiredColumns = [
      "FIRST_NAME",
      "EMAIL",
      "STREET1",
      "STREET2",
      "CITY",
      "ZIP",
      "ORDER_NO",
      "COUNTRY",
    ];

    const columnIndices = requiredColumns.map((column) =>
      headers.indexOf(column)
    );

    const newData = jsonArrays.map((record) => {
      const extractedData: CustomRecord = {};
      columnIndices.forEach((index, i) => {
        const value = record[headers[index]];
        extractedData[requiredColumns[i]] =
          value !== undefined && value !== null ? value : "";
      });
      return extractedData;
    });

    // Validate the data
    const hasEmptyValue = (record: CustomRecord) => {
      return requiredColumns.some((column) => {
        const value = record[column];
        return (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "")
        );
      });
    };

    const faultyData = newData.filter((record) => hasEmptyValue(record));
    const validData = newData.filter((record) => !faultyData.includes(record));

    // send processed files (xlsx or csv)
    const xlsxFileName = "combined";
    await writeXLSXWithSheets(
      res,
      validData,
      faultyData,
      requiredColumns,
      xlsxFileName
    );
    console.log("Data saved to XLSX with sheets:", xlsxFileName);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export {
    postSheetProcess
};
