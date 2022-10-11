const btn = document.getElementById("btnUpload");
const result = document.getElementById("resultText");
const pdfContainer = document.getElementById("pdfContainer");
btn.addEventListener("click", upload);

async function upload() {
  const file = document.getElementById("inpFile");
  var formData = new FormData();
  formData.append("file", file.files[0]);
  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      return res.text();
    })
    .then((extractedText) => {
      const parsedText = JSON.parse(extractedText);
      const prettyParsedText = JSON.stringify(parsedText, undefined, 2);
      result.value = prettyParsedText;
    });
}
