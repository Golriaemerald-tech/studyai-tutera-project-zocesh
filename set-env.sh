#!/bin/bash
if [ -z "$1" ]; then
  echo "Usage: ./set-env.sh YOUR_GEMINI_API_KEY"
  exit 1
fi
echo "VITE_GEMINI_API_KEY=$1" > ~/studyai/.env
echo "VITE_GEMINI_MODEL=gemini-3.5-flash-lite" >> ~/studyai/.env
echo ".env updated successfully!"
