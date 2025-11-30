import sharp from 'sharp';
import fs from 'fs';

async function main(){
  const buffer = await sharp({ create: { width: 200, height: 200, channels: 3, background: { r: 200, g:150, b:100 }}})
    .jpeg()
    .toBuffer();
  fs.writeFileSync('D:/marcaromas/backend/tmp_test_image.jpg', buffer);
  console.log('Wrote tmp_test_image.jpg');
}

main().catch(e=>{ console.error(e); process.exit(1); });
