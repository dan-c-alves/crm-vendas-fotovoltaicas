#!/bin/sh
# Start Next.js with Railway PORT variable
exec node_modules/.bin/next start -p ${PORT:-3000}
