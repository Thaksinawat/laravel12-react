# Department Management System

Laravel 12 + React + Inertia + Tailwind CSS + Laravel Breeze

## Overview
This project is a department management system for managing departments, positions, and employees in an organization. It includes:

- Authentication with Laravel Breeze
- React + Inertia frontend
- Tailwind CSS styling
- CRUD for departments, positions, and employees
- Dashboard summary and organization overview
- SQLite database setup for easy local development

## Requirements

- PHP 8.3+
- Composer
- Node.js 18+
- npm

## Quick Start on a New Machine

### 1) Install PHP and Composer
Make sure PHP and Composer are installed and available in PATH.

### 2) Install dependencies
```bash
composer install
npm install --legacy-peer-deps
```

### 3) Copy environment file
```bash
copy .env.example .env
```

### 4) Generate app key and database
```bash
php artisan key:generate
php artisan migrate --seed
```

### 5) Build frontend assets
```bash
npm run build
```

### 6) Run the app
```bash
php artisan serve
```

Open http://localhost:8000

## Windows PowerShell Helper
You can run this in PowerShell on Windows:

```powershell
composer install
npm install --legacy-peer-deps
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
php artisan key:generate
php artisan migrate --seed
npm run build
php artisan serve
```

## Project Features

- Department management CRUD
- Position management CRUD
- Employee management CRUD
- Dashboard statistics
- Search and filtering in list pages
- Responsive Tailwind UI

## Testing
```bash
php artisan test --filter=DepartmentManagementTest
```

## Default Login
Seeded admin user:

- Email: admin@example.com
- Password: password

## Notes
This project is intended for student use and is suitable for assignment/demo work. The database is configured for SQLite by default to make local setup easier.
