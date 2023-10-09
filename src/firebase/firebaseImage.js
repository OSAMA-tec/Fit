const bucket = require('./bucket');

function uploadImageToFirebase(name, base64Image) {
  return new Promise((resolve, reject) => {
    const file = bucket.file(name);
    
    const buffer = Buffer.from(base64Image, 'base64');

    const blobStream = file.createWriteStream({
      metadata: {
        contentType: 'image/jpeg',
      },
    });

    blobStream.on('error', (error) => {
      reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(file.name)}?alt=media`;

      resolve(url);
    });

    blobStream.end(buffer);
  });
}

module.exports = uploadImageToFirebase;
