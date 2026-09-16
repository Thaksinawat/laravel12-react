# Deploy Laravel project from Windows to remote DigitalOcean droplet
# Usage: run this in PowerShell from the laravel12-react project folder.

$projectDir = "C:\Users\Admin\laravel12-react"
$remoteUser = "root"
$remoteHost = "146.190.110.12"
$remoteAlt = "myserver"
$remoteDir = "/var/www/thaksinawat.csbootstrap.com"

Set-Location $projectDir

Write-Host "Creating remote directory $remoteDir..."
ssh $remoteAlt "mkdir -p '$remoteDir'"

Write-Host "Copying project files to remote server..."
scp -r . "${remoteUser}@${remoteHost}:${remoteDir}"

$remoteCommands = @'
set -e

REMOTE_DIR=/var/www/thaksinawat.csbootstrap.com
mkdir -p "$REMOTE_DIR/storage"
mkdir -p "$REMOTE_DIR/bootstrap/cache"
chown -R www-data:www-data "$REMOTE_DIR/storage" "$REMOTE_DIR/bootstrap/cache" || true
chmod -R 775 "$REMOTE_DIR/storage" "$REMOTE_DIR/bootstrap/cache"

if [ ! -f "$REMOTE_DIR/.env" ]; then
  cp "$REMOTE_DIR/.env.example" "$REMOTE_DIR/.env"
fi

if ! grep -q '^APP_KEY=' "$REMOTE_DIR/.env" || grep -q '^APP_KEY=$' "$REMOTE_DIR/.env"; then
  php "$REMOTE_DIR/artisan" key:generate --force
fi

cd "$REMOTE_DIR"
if command -v composer >/dev/null 2>&1; then
  composer install --no-dev --optimize-autoloader
fi
if command -v npm >/dev/null 2>&1; then
  npm install
  npm run build
fi

PHP_FPM_SOCK=$(ls /run/php/php*-fpm.sock 2>/dev/null | head -n 1)
if [ -z "$PHP_FPM_SOCK" ]; then
  echo "Could not find PHP-FPM socket in /run/php/. Please install PHP-FPM or adjust the nginx config."
  exit 1
fi

cat > /etc/nginx/sites-available/thaksinawat.csbootstrap.com <<'NGINX'
server {
    listen 80;
    server_name thaksinawat.csbootstrap.com;

    root /var/www/thaksinawat.csbootstrap.com/public;
    index index.php index.html index.htm;

    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:$PHP_FPM_SOCK;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/thaksinawat.csbootstrap.com /etc/nginx/sites-enabled/thaksinawat.csbootstrap.com
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
'@

Write-Host "Running remote deployment commands..."
ssh $remoteAlt $remoteCommands

Write-Host "Deployment complete. Check http://thaksinawat.csbootstrap.com"
