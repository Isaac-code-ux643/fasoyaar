#!/usr/bin/env bash
#
# Installation de FASOYAAR sur un VPS Ubuntu/Debian (exécuter en root).
# Usage :
#   sudo bash deploy.sh
#   sudo DOMAIN=fasoyaar.example.com bash deploy.sh   # + HTTPS via Let's Encrypt
#
set -euo pipefail

APP_NAME="fasoyaar"
APP_DIR="/opt/$APP_NAME"
APP_USER="$APP_NAME"
REPO_URL="https://github.com/Isaac-code-ux643/fasoyaar.git"
DOMAIN="${DOMAIN:-}"

log() { echo -e "\033[1;32m==>\033[0m $*"; }
die() { echo -e "\033[1;31mERREUR:\033[0m $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Exécute ce script en root : sudo bash deploy.sh"

log "Mise à jour du système et installation des paquets de base"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git nginx ca-certificates

log "Installation de Node.js 22 LTS (NodeSource)"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node -v

log "Création de l'utilisateur applicatif $APP_USER"
if ! id -u "$APP_USER" >/dev/null 2>&1; then
  useradd --system --create-home --shell /usr/sbin/nologin "$APP_USER"
fi

log "Récupération du code dans $APP_DIR"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
else
  git -C "$APP_DIR" fetch origin && git -C "$APP_DIR" reset --hard origin/master
fi
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

log "Configuration de l'environnement"
if [ ! -f "$APP_DIR/.env" ]; then
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  chown "$APP_USER:$APP_USER" "$APP_DIR/.env"
  echo
  echo "  >>> Fichier $APP_DIR/.env créé avec des valeurs par défaut. <<<"
  echo "  >>> Édite-le et change ADMIN_CODE et SESSION_SECRET, puis relance : <<<"
  echo "      sudo bash /opt/fasoyaar/deploy/deploy.sh"
  echo
  exit 1
fi
chmod 600 "$APP_DIR/.env"

log "Installation des dépendances, base de données et build (en tant que $APP_USER)"
cd "$APP_DIR"
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" npx prisma db push --skip-generate
sudo -u "$APP_USER" npm run build

log "Installation du service systemd"
cat > /etc/systemd/system/$APP_NAME.service <<EOF
[Unit]
Description=FASOYAAR — Comparateur de prix & localisateur de marchés
After=network.target

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
Environment=NODE_ENV=production
ExecStart=/usr/bin/node node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3000
Restart=always
RestartSec=5
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now "$APP_NAME"
systemctl --no-pager --lines=20 status "$APP_NAME"

log "Configuration Nginx (reverse proxy)"
cat > /etc/nginx/sites-available/$APP_NAME.conf <<'EOF'
server {
    listen 80;
    server_name _;

    client_max_body_size 4m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
ln -sf /etc/nginx/sites-available/$APP_NAME.conf /etc/nginx/sites-enabled/$APP_NAME.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable --now nginx
systemctl reload nginx

if [ -n "$DOMAIN" ]; then
  log "Configuration HTTPS via Let's Encrypt pour $DOMAIN"
  apt-get install -y python3-certbot-nginx
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --redirect
else
  echo
  echo "  ATTENTION : pas de domaine fourni → pas de HTTPS."
  echo "  Le cookie de session admin est Secure en production :"
  echo "  sans HTTPS, la connexion admin ne fonctionnera pas."
  echo "  Une fois un domaine pointé vers ce serveur, lance :"
  echo "      sudo DOMAIN=ton-domaine.example bash /opt/fasoyaar/deploy/deploy.sh"
  echo
fi

log "Vérification finale"
sleep 2
curl -fsS -o /dev/null -w "Réponse HTTP du serveur : %{http_code}\n" http://127.0.0.1:3000/ || true

echo
echo "  Terminé ! $APP_NAME est en ligne."
[ -n "$DOMAIN" ] && echo "  URL : https://$DOMAIN/" || echo "  URL : http://$(hostname -I | awk '{print $1}')/"
echo "  Logs : journalctl -u $APP_NAME -f"
