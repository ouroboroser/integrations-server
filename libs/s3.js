const aws = require('aws-sdk');

const upload = (title, file) => {
  console.log('work 1');

  const spacesEndpoint = new aws.Endpoint('fra1.digitaloceanspaces.com');
  
  const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'EED5W5BHFXRTU2NP2YQD',
    secretAccessKey: 'dhQYBa23O6610RK27Q46Q+V/dEzCYJQMXnAkugG78Mo',
  });

  console.log('work 2');
  
  const options = {
    Bucket: 'rxhelper',
    ACL: 'public-read',
    Key: `diagramsJSON/${title}.json`,
    Body: file,
  };

  console.log('work 3');
  
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