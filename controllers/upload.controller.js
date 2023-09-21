const multiparty = require("multiparty");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const fs = require("fs");
const mime = require("mime-types");

const bucketName = "reviews-site";

exports.uploadImage = async (req, res) => {
  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) throw err;

    const client = new S3Client({
      region: "eu-north-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    const file = files.file[0];

    const ext = file.originalFilename.split(".").pop();
    const newFileName = Date.now() + "." + ext;

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFileName,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );

    const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;

    res.json({ link });
  });
};
