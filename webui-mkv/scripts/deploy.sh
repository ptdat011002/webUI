#!/bin/bash


set -e

yarn build:packages
# build app
yarn build:local-website

# mkdir if not exists
mkdir -p ./build
# remove the existing zipfile
rm -rf ./build/*
# Create a zipfile

source_dir="./sites/local-website/dist/"

# Define the zipfile name
zipfile="./build/app.zip"

# Change to the source directory
cd "$source_dir" || exit

# Zip all files and directories in the source directory while preserving directory structure
zip -r "../../../build/app.zip" .

cd - || exit

# Transfer the zipfile to the remote server via SCP
scp ./build/app.zip root@193.169.0.99:/sdcard/www/

# Clean up the local zipfile after transfer (optional)
rm ./build/app.zip