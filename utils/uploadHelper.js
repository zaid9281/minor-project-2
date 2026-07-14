const path = require('path');
const multer = require('multer');
const supabase = require('../config/supabase');

const storage = multer.memoryStorage();

const pdfFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === 'application/pdf' && ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed.'), false);
  }
};

const uploadMaterial = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

const uploadPYQ = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

const uploadSyllabus = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

const uploadToSupabase = async (buffer, folder, filename) => {
  const key = `${folder}/${filename}`;

  const { error } = await supabase.storage
    .from('pdfs')
    .upload(key, buffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from('pdfs')
    .getPublicUrl(key);

  return urlData.publicUrl;
};

const deleteFromSupabase = async (fileUrl) => {
  try {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/pdfs/');
    if (pathParts.length > 1) {
      const key = pathParts[1];
      await supabase.storage.from('pdfs').remove([key]);
    }
  } catch (e) {
    console.log('Supabase delete error:', e.message);
  }
};

module.exports = {
  uploadMaterial,
  uploadPYQ,
  uploadSyllabus,
  uploadToSupabase,
  deleteFromSupabase
};