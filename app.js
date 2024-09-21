/*
    This script resize all the images from the input folder to the output one.
    For this specific scenario, the images are sorted regarding their orientation and sizes to ensure the conservation of the image ratio.
    The images are not resize if their dimensions are already below the targeted maximum dimensions.
*/
const fs = require('fs');
const sharp = require('sharp');

// The path for the input Folder
const inputFolderPath = "./file-input"

// The path for the ouput Folder
const ouputFolderPath = "./file-output"

// Maximum dimension allowed
const maxWidthOutput = 1920;
const maxHeightOutput = 1920;

// To keep track of the number of image to resize
let itemCount = 0

// If the script crash during long batch, set this variable to the value you want the script to restart on (order in the folder)
let resumeAt = 0

// Explore the entire input folder and create a list of all the file in it
async function readFolderData(){
    const list = {}
    fs.readdirSync(inputFolderPath).forEach((file, index) => {
        list[index] = {}
        list[index].filename = file
        list[index].name = file.split('.')[0];
        itemCount++
    })

    return list;
}

// Loop through the list and for each images, read their metadata and store the necessary informations in the list (width, height, ratio...)
async function retrieveDimensions(list){
    for (const index in list) {
        try {
            // Retrieve each image metadata
            const metadata = await sharp(inputFolderPath +'/'+ list[index].filename).metadata();

            // Add the desired metadata properties to the image entry
            list[index].width = metadata.width
            list[index].height = metadata.height

            // Define image orientation
            if (list[index].width > list[index].height){
                list[index].orientation = "landscape"
            } else if (list[index].width == list[index].height) {
                list[index].orientation = "squared"
            } else {
                list[index].orientation = "portrait"
            }
            
            // Define image base ratio
            list[index].ratio = (list[index].width/list[index].height).toFixed(2)
        } catch (error) {
            console.log(`An error occurred during the retrieval of image metadata, processing: ${error}`);
        }
    }

    return list;
}

// Loop through the list and define the targeted size for the output image based on the orientation and ratio of the original
async function defineOutputSize(list){
    
    for (const index in list) {
        if (list[index].orientation === "landscape" && list[index].width > maxWidthOutput){
            list[index].widthOutput = maxWidthOutput
            list[index].heightOutput = Math.round(maxWidthOutput / list[index].ratio)
        } else if (list[index].orientation === "landscape" && list[index].width < maxWidthOutput) {
            list[index].widthOutput = list[index].width
            list[index].heightOutput = Math.round(list[index].width / list[index].ratio)
        } else if (list[index].orientation === "portrait" && list[index].height > maxHeightOutput){
            list[index].widthOutput = Math.round(maxHeightOutput*list[index].ratio)
            list[index].heightOutput = maxHeightOutput
        } else if (list[index].orientation === "portrait" && list[index].height < maxHeightOutput) {
            list[index].widthOutput = Math.round(list[index].height*list[index].ratio)
            list[index].heightOutput = list[index].height
        } else if (list[index].orientation === "squared" && list[index].width > maxWidthOutput) {
            list[index].widthOutput = maxWidthOutput
            list[index].heightOutput = maxWidthOutput
        } else {
            list[index].widthOutput = list[index].width
            list[index].heightOutput = list[index].width
        }
    }

    return list;
}

// Finally compress and export in JPG all the images
async function exportImages(list){
    let creationCount = resumeAt;

    for (const index in list) {

        if (index >= resumeAt){
            try {
                await sharp(inputFolderPath +'/'+ list[index].filename)
                    .resize({
                        width: list[index].widthOutput,
                        height: list[index].heightOutput
                    })
                    .toFile(ouputFolderPath +'/'+ list[index].name + ".jpg");
    
                    creationCount++
                    console.log("Resizing image: %d/" + itemCount, creationCount)
    
            } catch (error) {
                console.log(`An error occurred during the retrieval of image metadata, exporting: ${error}`);
            }
        }
    }
}

readFolderData()
    .then(list => retrieveDimensions(list))
    .then(listWithDim => defineOutputSize(listWithDim))
    .then(targetList => exportImages(targetList));