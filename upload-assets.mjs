import { storagePut } from './server/storage.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function uploadAssets() {
  try {
    console.log('Starting asset upload...');
    
    // Upload hero video
    const videoPath = path.join(__dirname, 'client/public/assets/hero-video.mp4');
    if (fs.existsSync(videoPath)) {
      console.log('Uploading hero video...');
      const videoBuffer = fs.readFileSync(videoPath);
      const videoResult = await storagePut('assets/hero-video.mp4', videoBuffer, 'video/mp4');
      console.log('✓ Video uploaded:', videoResult.url);
    } else {
      console.log('⚠ Hero video not found at:', videoPath);
    }
    
    // Upload package images
    const images = ['package-premium.jpg', 'vip-gold.jpg'];
    for (const img of images) {
      const imgPath = path.join(__dirname, 'client/public/assets', img);
      if (fs.existsSync(imgPath)) {
        console.log(`Uploading ${img}...`);
        const imgBuffer = fs.readFileSync(imgPath);
        const imgResult = await storagePut(`assets/${img}`, imgBuffer, 'image/jpeg');
        console.log(`✓ Image uploaded:`, imgResult.url);
      } else {
        console.log(`⚠ Image not found:`, imgPath);
      }
    }
    
    console.log('\n✓ Asset upload completed!');
  } catch (error) {
    console.error('✗ Error uploading assets:', error);
    process.exit(1);
  }
}

uploadAssets();
