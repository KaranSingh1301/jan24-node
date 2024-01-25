const http = require("http");
const fs = require("fs");
const formidable = require("formidable");

const server = http.createServer();

// server.on("request", (req, res) => {
//   console.log(req.url, " ", req.method);
//   const data = "This is jan 2024 file system class";

//   if (req.method === "GET" && req.url === "/") {
//     return res.end("Server is up and running");
//   }
//   //write
//   else if (req.method === "GET" && req.url === "/writefile") {
//     fs.writeFile("demo.txt", data, (err) => {
//       if (err) throw err;
//       return res.end("write successfull");
//     });
//     return;
//   }
//   //append
//   else if (req.method === "GET" && req.url === "/appendfile") {
//     fs.appendFile("demo.txt", data, (err) => {
//       if (err) throw err;
//       return res.end("append successfull");
//     });
//     return;
//   }
//   //read
//   else if (req.method === "GET" && req.url === "/readfile") {
//     fs.readFile("demo.txt", (err, data) => {
//       console.log(data);
//       if (err) throw err;
//       return res.end(data);
//     });
//     return;
//   }
//   //delete
//   else if (req.method === "GET" && req.url === "/deletefile") {
//     fs.unlink("demo.txt", (err) => {
//       if (err) throw err;
//       return res.end("delete successfull");
//     });
//     return;
//   }
//   //rename
//   else if (req.method === "GET" && req.url === "/renamefile") {
//     fs.rename("demo.txt", "newDemo.txt", (err) => {
//       if (err) throw err;
//       return res.end("Rename successfull");
//     });
//     return;
//   }

//   //stream read
//   else if (req.method === "GET" && req.url === "/streamfile") {
//     const rStream = fs.createReadStream("demo.txt");

//     rStream.on("data", (char) => {
//       console.log(char);
//       res.write(char);
//     });

//     rStream.on("end", () => {
//       return res.end();
//     });
//   }
// });

server.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/fileupload") {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, feilds, files) => {
      if (err) throw err;
      console.log(__dirname);
      const oldPath = files.fileToUpload[0].filepath;
      const newPath =
        __dirname + "/uploads/" + files.fileToUpload[0].originalFilename;

      console.log(oldPath, " ", newPath);

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        return res.end("File uploaded successfilly");
      });
    });
  } else {
    fs.readFile("form.html", (err, data) => {
      return res.end(data);
    });
  }
});

server.listen(8000, () => {
  console.log("HTTP server is running on PORT:8000");
});
