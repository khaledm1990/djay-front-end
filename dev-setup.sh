#!/usr/bin/env sh
set -eu

if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' "Error: node is not installed. Install Node.js 20+ then re-run."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  printf '%s\n' "Error: npm is not installed. Install npm then re-run."
  exit 1
fi

npm install
npm run dev
