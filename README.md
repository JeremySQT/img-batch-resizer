# img-batch-resizer
A simple node.js script to resize an image collection using the sharp library

## Build Setup

```bash
# install dependencies
$ pnpm install

```

## Usage

```bash
# Launch the script
$ pnpm resize

```

**Input-folder**\
Folder where you want to put the images that you wish to resize

**Output-folder**\
Folder where all the resized images will be created

**Resume to a specific index**\
In the app.js script, the variable named "resumeAt" may help you restart the script at a specific index (in case of crash)
