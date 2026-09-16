@echo off
cd /d "%~dp0"

echo Installing Composer dependencies...
composer install

if not exist .env (
    echo Copying environment file...
    copy .env.example .env
)

echo Generating application key...
php artisan key:generate

echo Running database migrations and seeders...
php artisan migrate --seed

echo Installing Node dependencies...
npm install --legacy-peer-deps

echo Building frontend assets...
npm run build

echo Setup complete.
echo Run the app with: php artisan serve
echo Open: http://localhost:8000
pause
