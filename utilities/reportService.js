const { Parser } = require("json2csv");
const fs = require("fs");

const generateCSV = (data, fields, filename = "report.csv") => {
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);
  fs.writeFileSync(filename, csv);
  return filename;
};

module.exports = { generateCSV };
