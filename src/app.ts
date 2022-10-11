import express from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import handleScan from "./scan";

const app = express();

app.use("/", express.static("public"));

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.post("/upload", async (req, res) => {
  try {
    if (!req.files) {
      res.send({ status: false, message: "No file uploaded" });
    } else {
      const results = await handleScan(req.files.file as UploadedFile);

      res.send({
        status: true,
        data: results,
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => console.log("Conversion app listening on port 3000!"));
