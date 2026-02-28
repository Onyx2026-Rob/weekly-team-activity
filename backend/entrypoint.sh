#!/bin/sh
set -e

echo "Running database migrations..."
npx ts-node -r tsconfig-paths/register ./node_modules/.bin/typeorm migration:run -d src/database/data-source.ts

echo "Running database seed..."
npx ts-node -r tsconfig-paths/register src/database/seeds/run-seed.ts

echo "Starting application..."
exec node dist/main
