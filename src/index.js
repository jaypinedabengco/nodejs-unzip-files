const http = require("http");
const AdmZip = require("adm-zip");

/////

const BASE_DIR = __dirname;

/////

//create a server object:
http
  .createServer(async function(req, res) {
    await logic(req, res);
    setTimeout(() => {
      res.end(); //end the response
    }, 1000);
  })
  .listen(8080); //the server object listens on port 8080

/**
 *
 */
async function logic(req, res) {
  try {
    const result = await _unZipFile("compressed_file.xzip");
    res.write(_cleanJSON({ ...result, timestamp: Date.now() }));
  } catch (err) {
    // res.status(500);
    console.error(err);
    res.write("error");
  }
}

/**
 *
 */
async function _unZipFile(
  filename,
  {
    file_location = `${BASE_DIR}/file`,
    unzip_location = `${BASE_DIR}/file`,
    unzip_directory_name = `extracted`
  } = {}
) {
  const file_to_unzip = `${file_location}/${filename}`;
  const unzip_files_location = `${unzip_location}/${unzip_directory_name}`;
  try {
    const zip = new AdmZip(file_to_unzip);

    // delete directory first

    // extract
    zip.extractAllTo(/*target path*/ unzip_files_location, /*overwrite*/ true);

    return {
      filename,
      file_location,
      unzip_location,
      unzip_directory_name,
      file_to_unzip,
      unzip_files_location
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function _cleanJSON(json) {
  return JSON.stringify(json, null, 2);
}
