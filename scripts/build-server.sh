#!/bin/bash

echo "Building Python server..."

# Activate conda environment
source ~/anaconda3/etc/profile.d/conda.sh
conda activate face

# Create dist directory if it doesn't exist
mkdir -p dist/server

# Build server using PyInstaller
cd src/server
pyinstaller server.spec --distpath ../../dist --workpath ../../build --clean -y

echo "Python server built successfully!"
echo "Output: dist/server"
