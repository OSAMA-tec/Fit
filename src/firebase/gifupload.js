const bucket = require('./bucket');
const sharp = require('sharp');
const GIFEncoder = require('gifencoder');
const axios = require('axios');
const stream = require('stream');
const { createCanvas, loadImage } = require('canvas');

async function createAndUploadGif(imageUrls, exerciseName) {
  try {
    const width = 512;
    const height = 512;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    const encoder = new GIFEncoder(width, height);
    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(1000);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.

    for (let url of imageUrls) {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const img = await loadImage(Buffer.from(response.data));
      
      ctx.fillStyle = '#FFFFFF';  // Set background to white
      ctx.fillRect(0, 0, width, height);
      
      // Draw image centered on canvas
      const scale = Math.min(width / img.width, height / img.height);
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      encoder.addFrame(ctx);
    }

    encoder.finish();

    const fileName = `${exerciseName.replace(/\s+/g, '_')}.gif`;
    const file = bucket.file(fileName);

    return new Promise((resolve, reject) => {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(encoder.out.getData());

      bufferStream.pipe(file.createWriteStream({
        metadata: {
          contentType: 'image/gif',
        },
        public: true,
      }))
      .on('error', (error) => {
        console.error('Error uploading to Firebase:', error);
        reject(error);
      })
      .on('finish', async () => {
        await file.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        console.log('File uploaded to', publicUrl);
        resolve(publicUrl);
      });
    });
  } catch (error) {
    console.error('Error in createAndUploadGif:', error);
    throw error;
  }
}

module.exports = { createAndUploadGif };
