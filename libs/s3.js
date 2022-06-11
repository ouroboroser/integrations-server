const aws = require('aws-sdk');

const upload = (title, file) => {
  const spacesEndpoint = new aws.Endpoint(process.env.S3_END_POINT);
  
  const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  
  const options = {
    Bucket: 'rxhelper',
    ACL: 'public-read',
    Key: `diagramsJSON/${title}.json`,
    Body: file,
  };
  
  return new Promise((res, rej) => {
    s3.upload(options).send((e, data) => {
      if (e) console.log(e);
      res(data.Location);
    });
  });
};

module.exports = {
  upload,
};