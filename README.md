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
This is the folder where you want to put all the images that you wish to resize

**Output-folder**\
This is the folder where you all the resized images will be created

**Resume to a specific index**\
The variable named "resumeAt" in the script may help you start the script at a specific index (in case of crash)