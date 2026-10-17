# Afya360 Store

Afya360 is a Laravel and React storefront for beauty, personal care, and wellness products. The application uses Inertia.js to render the storefront and product detail pages, with product and category data stored in Laravel's database.

## Requirements

- PHP 8.3 or newer
- Composer
- Node.js and npm
- SQLite (the default local database) or another database supported by Laravel

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

The default `.env.example` configures SQLite. Create the database file if it does not exist, then migrate and seed:

```bash
touch database/database.sqlite
php artisan migrate --seed
```

Install frontend dependencies and build the assets:

```bash
npm install
npm run build
```

## Development

Start Laravel, the queue worker, logs, and Vite together:

```bash
composer run dev
```

The Laravel server is normally available at [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Checks and tests

```bash
npm run types:check
npm run check
php artisan test
```

## Product data

The storefront reads active, visible products from the database. Category and sample product seeders are included. Imported source files, when present under `storage/app/imports`, are local input data and are not required for the application to run.
