require('dotenv').config();
const cloudinary = require('../config/cloudinary');

async function makeAllPublic() {
  const folders = [
    'soet-portal/materials',
    'soet-portal/pyqs',
    'soet-portal/syllabus'
  ];

  for (const folder of folders) {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'raw',
        prefix: folder,
        max_results: 500
      });

      console.log(`Found ${result.resources.length} files in ${folder}`);

      for (const resource of result.resources) {
        await cloudinary.uploader.explicit(resource.public_id, {
          type: 'upload',
          resource_type: 'raw',
          access_mode: 'public'
        });
        console.log(`Made public: ${resource.public_id}`);
      }
    } catch (err) {
      console.log(`Error in ${folder}:`, err.message);
    }
  }

  console.log('Done — all files are now public');
}

makeAllPublic();