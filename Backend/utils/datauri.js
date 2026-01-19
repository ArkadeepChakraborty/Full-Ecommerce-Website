import DataUriParser from "datauri/parser.js"

import path from "path";

const getDataUri = (file) => {
    const parser = new DataUriParser();
    return parser.format(path.extname(file.originalname), file.buffer);
}

export default getDataUri;

