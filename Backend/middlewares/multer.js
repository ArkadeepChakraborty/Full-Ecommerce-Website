import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");

// Multiple file upload (minimum 4)
// export const multipleUpload = multer({ storage }).array("images", 10); // max 4 files
export const fieldUpload = multer({ storage }).fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);
