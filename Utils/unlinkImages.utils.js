import fs from "fs";

export const unlinkImages = (fileArray) => {
    fileArray.forEach(file => {
        fs.unlinkSync(file.path)
    })
}