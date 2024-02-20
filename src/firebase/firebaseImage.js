const bucket = require('./bucket');

function uploadMediaToFirebase(name, base64Media, mimeType) {
  return new Promise((resolve, reject) => {
    const file = bucket.file(name);
    
    const buffer = Buffer.from(base64Media, 'base64');
    const contentType = mimeType; // Use the mimeType passed to the function

    const blobStream = file.createWriteStream({
      metadata: {
        contentType: contentType,
      },
    });

    blobStream.on('error', (error) => {
      reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
      // Construct the public URL for the file
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
      resolve(url);
    });

    blobStream.end(buffer);
  });
}

module.exports = uploadMediaToFirebase;
