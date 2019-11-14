const nodemailer = require("nodemailer");
const formidable = require("formidable");
var http = require("http");
var fs = require("fs");
require("dotenv").config();
console.log(process.env.EMAIL);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

function sendMail(from, to, subject, text, attachments, path) {
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    attachments: attachments,
    path: path
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("sent");
      plsdelete(path);
    }
  });
}

function plsdelete(path) {
  fs.unlink(path, function(err) {
    if (err) throw err;
    console.log("deleted again");
  });
}

http
  .createServer(function(req, res) {
    if (req.url == "/fileupload") {
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = __dirname + "/" + files.filetoupload.name;
        const attachments = [
          {
            filename: files.filetoupload.name,
            path: __dirname + "/" + files.filetoupload.name
          }
        ];
        fs.copyFile(oldpath, newpath, function(err) {
          if (err) throw err;
          fs.unlink(oldpath, function(err) {
            if (err) throw err;
            console.log("deleteds");
          });
          res.write("uploaded and moved");
          sendMail(
            "j0hngr33n1201@gmail.com",
            "cian.laguesma@obf.ateneo.edu",
            "test",
            "working",
            attachments,
            newpath
          );

          res.end();
        });
      });
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        '<form action="fileupload" method="post" enctype="multipart/form-data">'
      );
      res.write('<input type="file" name="filetoupload"><br>');
      res.write('<input type="submit">');
      res.write("</form>");
      return res.end();
    }
  })
  .listen(8001);
