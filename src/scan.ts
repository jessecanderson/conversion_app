import { UploadedFile } from "express-fileupload";

const handleScan = (file: UploadedFile) => {
  const PDFParser = require("pdf2json");
  const pdfParser = new PDFParser();

  return new Promise((resolve, reject) => {
    const results: any = [];

    pdfParser.on("pdfParser_dataError", (errData: { parserError: any }) =>
      reject(errData.parserError)
    );

    // pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
    //   const rawText = pdfParser.getRawTextContent();
    //   // loop through parsedPdf value and process the data types
    //   // console.log("Raw Text Output: ", rawText);
    //   // const conversionData = parseFieldData(parsedPdf);
    //   // results.push(conversionData);
    //   // resolve(results);
    // });

    pdfParser.on("data", (page: any) => {
      // console.log(page ? "One page paged" : "All pages parsed", page);

      if (page !== null) {
        // for (const text in page.Texts) {
        //   console.log(text);
        //   console.log(Object.entries(text));
        // }
        const conversionData = parseFieldData(page.Fields);
        results.push(conversionData);
      } else {
        console.log("Completed parsing");
        resolve(results);
      }
    });

    pdfParser.parseBuffer(file.data);
  });
};

const constructSchemaJSON = (fields: any[], boxSets: any[]) => {
  console.log("Putting it all together");
  const jsonStr = `{"uiSchema": [], "schema":{ "type": "object", "required": [], "properties": {}}, "constants": []}`;

  const jsonObj = JSON.parse(jsonStr);
  jsonObj.constants.push(fields);
  jsonObj.constants.push(boxSets);
};

const parseSectionHeaders = (sections: string[]) => {
  // console.log(sections);
  // for (const section of sections) {
  //   if (section.)
  // }
};

const parseFieldData = (fields: any[]) => {
  if (fields.length === 0) {
    console.log("No fields found on page");
    return "No fileds found on page";
  }

  const buildConstants = [];
  for (const field of fields) {
    if (field.T.Name === "link") {
      buildConstants.push("Link found");
    } else if (field.PL !== undefined) {
      console.log("Dropdown?");
      buildConstants.push("Dropdown found");
    } else if (field.T.Name === "alpha") {
      buildConstants.push(`text_field: input`);
    } else {
      buildConstants.push(`field_${field.TU}: "${field.TU}",`);
    }
  }
  return buildConstants;
};

export default handleScan;
