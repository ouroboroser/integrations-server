const aws = require('aws-sdk');

const upload = (title, file) => {
  const spacesEndpoint = new aws.Endpoint('fra1.digitaloceanspaces.com');
  
  const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'EED5W5BHFXRTU2NP2YQD',
    secretAccessKey: 'dhQYBa23O6610RK27Q46Q+V/dEzCYJQMXnAkugG78Mo',
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