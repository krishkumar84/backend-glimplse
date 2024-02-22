import { Request, Response, NextFunction } from "express";

const postSheetProcess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // read uploaded file
        // save version 0 to DB
        // parse the file using csv2json
        // filter defective records
        // save version 1 and version 2 to DB
        // send processed files (xlsx or csv zip)
    } catch (err) {
        next(err);
    }
}

export {
    postSheetProcess
};
