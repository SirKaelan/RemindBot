import fs from "fs";

class JSONFile {
  private fileName: string;
  constructor(fileName: string) {
    this.fileName = fileName;
  }

  write(content: JSONTokenFormat) {
    fs.writeFileSync(`${this.fileName}.json`, JSON.stringify(content));
    console.log("Log: Successfully WROTE token data to JSON file.");
  }

  read(): JSONTokenFormat {
    const jsonContents = fs.readFileSync(`${this.fileName}.json`, "utf-8");
    console.log("Log: Successfully READ token data from JSON file.");
    const tokenData = JSON.parse(jsonContents) as JSONTokenFormat;
    return tokenData;
  }

  fileExists(): boolean {
    return fs.existsSync(`${this.fileName}.json`);
  }
}

// Does this badly tightly couple the class to a purpose
type JSONTokenFormat = {
  access_token: string;
  expiration_date: number;
  refresh_token: string;
};

export { JSONFile, JSONTokenFormat };
