const fs = require('fs');
const path = require('path');
const https = require('https');

// Create demo directory if it doesn't exist
const demoDir = path.join(process.cwd(), 'public', 'demo');
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir, { recursive: true });
}

// Sample image URLs (Moroccan-themed images)
const images = [
  {
    url: 'https://images.unsplash.com/photo-1548018560-c7196548e84d',
    filename: 'fes-medina.jpg',
    description: 'Médina de Fès'
  },
  {
    url: 'https://images.unsplash.com/photo-1577147443647-81856d5151af',
    filename: 'essaouira-beach.jpg',
    description: 'Plage d\'Essaouira'
  },
  {
    url: 'https://images.unsplash.com/photo-1528657249085-c569d3c869e4',
    filename: 'atlas-mountains.jpg',
    description: 'Montagnes de l\'Atlas'
  }
];

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(demoDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  try {
    for (const image of images) {
      await downloadImage(image.url, image.filename);
    }
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

downloadAllImages(); 