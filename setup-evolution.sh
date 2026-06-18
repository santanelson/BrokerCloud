#!/bin/bash
set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}   Instalador Santanelson da Evolution API  ${NC}"
echo -e "${GREEN}===========================================${NC}\n"

# Função para checar portas
check_port() {
    local port=$1
    if command -v ss > /dev/null 2>&1; then
        if ss -tuln | grep -q ":$port "; then return 1; else return 0; fi
    elif command -v netstat > /dev/null 2>&1; then
        if netstat -tuln | grep -q ":$port "; then return 1; else return 0; fi
    else
        # Fallback usando timeout e bash tcp
        (timeout 1 bash -c "</dev/tcp/127.0.0.1/$port" >/dev/null 2>&1) && return 1 || return 0
    fi
}

# Gerar string aleatória
generate_secret() {
    head -c 24 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c $1
}

# Prompt com default
ask() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    echo -n -e "${YELLOW}${prompt} [${default}]: ${NC}"
    read input
    if [ -z "$input" ]; then
        eval $var_name="'$default'"
    else
        eval $var_name="'$input'"
    fi
}

# Prompt sim/não
confirm() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    local suffix="[y/N]"
    if [[ "$default" =~ ^[Yy]$ ]]; then suffix="[Y/n]"; fi
    
    echo -n -e "${YELLOW}${prompt} ${suffix}: ${NC}"
    read input
    if [ -z "$input" ]; then
        eval $var_name="'$default'"
    else
        if [[ "$input" =~ ^[Yy]$ ]] || [[ "$input" =~ ^[Yy][Ee][Ss]$ ]]; then
            eval $var_name="'y'"
        else
            eval $var_name="'n'"
        fi
    fi
}

# Validando dependências
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Erro: docker não está instalado.${NC}"
    exit 1
fi

COMPOSE_CMD=""
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif docker-compose version &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}Erro: docker-compose não está instalado.${NC}"
    exit 1
fi

echo -e "\n${GREEN}--- Configuração do Ambiente ---${NC}"

ask "URL pública da Evolution (ex: https://zap.seudominio.com.br)" "http://localhost:8080" EVOLUTION_PUBLIC_URL
ask "Porta externa da Evolution (EVOLUTION_PORT)" "8080" EVOLUTION_PORT

echo -n "Checando porta $EVOLUTION_PORT para a Evolution... "
if ! check_port $EVOLUTION_PORT; then
    echo -e "${RED}OCUPADA! Escolha outra porta ou pare o serviço atual.${NC}"
    exit 1
fi
echo -e "${GREEN}LIVRE${NC}"

ask "Porta local do Postgres da Evolution (EVOLUTION_DB_PORT)" "55433" EVOLUTION_DB_PORT
echo -n "Checando porta $EVOLUTION_DB_PORT para o Postgres... "
if ! check_port $EVOLUTION_DB_PORT; then
    echo -e "${RED}OCUPADA! Escolha outra porta ou pare o serviço atual.${NC}"
    exit 1
fi
echo -e "${GREEN}LIVRE${NC}"

ask "EVOLUTION_DB_USER" "postgres" EVOLUTION_DB_USER

DB_PASS_DEFAULT=$(generate_secret 24)
ask "EVOLUTION_DB_PASSWORD" "$DB_PASS_DEFAULT" EVOLUTION_DB_PASSWORD

ask "EVOLUTION_AUTH_DB" "evogo_auth" EVOLUTION_AUTH_DB
ask "EVOLUTION_USERS_DB" "evogo_users" EVOLUTION_USERS_DB
ask "EVOLUTION_CLIENT_NAME" "evolution" EVOLUTION_CLIENT_NAME

API_KEY_DEFAULT=$(generate_secret 32)
ask "EVOLUTION_GLOBAL_API_KEY" "$API_KEY_DEFAULT" EVOLUTION_GLOBAL_API_KEY

echo -e "\n${GREEN}--- Proxy Reverso e Acesso Externo ---${NC}"
DOMAIN=$(echo "$EVOLUTION_PUBLIC_URL" | sed -E 's|^https?://([^/:]+).*|\1|')
echo "1) Manual / Nenhum (Apenas expõe as portas)"
echo "2) Nginx Automático + Certbot SSL (Instala Nginx no host, requer sudo)"
echo "3) Traefik (Injeta labels dinâmicas no Docker Compose para usar o seu Traefik já existente)"
ask "Escolha a configuração de rede" "1" PROXY_TYPE

if [ "$PROXY_TYPE" = "3" ]; then
    echo -e "\n${YELLOW}*Configurando para Traefik*${NC}"
    ask "Nome da rede Docker externa do Traefik" "web" TRAEFIK_NETWORK
    ask "Entrypoint HTTPS do Traefik (ex: websecure)" "websecure" TRAEFIK_ENTRYPOINT
    ask "Nome do resolver de certificado Let's Encrypt do Traefik (ex: letsencrypt)" "letsencrypt" TRAEFIK_RESOLVER
fi


echo -e "\n${GREEN}Gerando arquivo .env ...${NC}"
cat << EOF > .env
# Evolution Go
EVOLUTION_PORT=$EVOLUTION_PORT
EVOLUTION_PUBLIC_URL=$EVOLUTION_PUBLIC_URL
EVOLUTION_CLIENT_NAME=$EVOLUTION_CLIENT_NAME
EVOLUTION_GLOBAL_API_KEY=$EVOLUTION_GLOBAL_API_KEY

# Postgres exclusivo da Evolution Go
EVOLUTION_DB_PORT=$EVOLUTION_DB_PORT
EVOLUTION_DB_USER=$EVOLUTION_DB_USER
EVOLUTION_DB_PASSWORD=$EVOLUTION_DB_PASSWORD
EVOLUTION_AUTH_DB=$EVOLUTION_AUTH_DB
EVOLUTION_USERS_DB=$EVOLUTION_USERS_DB

# Runtime
DATABASE_SAVE_MESSAGES=false
CONNECT_ON_STARTUP=true
WEBHOOKFILES=true
WADEBUG=INFO
LOGTYPE=console
EOF

echo -e "${GREEN}Gerando docker-compose.yml ...${NC}"
# Base do compose (comum a todos)
cat << 'EOF' > docker-compose.yml
services:
  postgres:
    image: postgres:15-alpine
    container_name: evolution_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${EVOLUTION_DB_USER:-postgres}
      POSTGRES_PASSWORD: ${EVOLUTION_DB_PASSWORD:?Defina EVOLUTION_DB_PASSWORD no .env}
    volumes:
      - evolution_postgres_data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:${EVOLUTION_DB_PORT:-55433}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${EVOLUTION_DB_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  evolution-go:
    image: evoapicloud/evolution-go:latest
    container_name: evolution_go_api
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SERVER_PORT: 8080
      CLIENT_NAME: ${EVOLUTION_CLIENT_NAME:-evolution}
      GLOBAL_API_KEY: ${EVOLUTION_GLOBAL_API_KEY:?Defina EVOLUTION_GLOBAL_API_KEY no .env}
      POSTGRES_AUTH_DB: postgresql://${EVOLUTION_DB_USER:-postgres}:${EVOLUTION_DB_PASSWORD}@postgres:5432/${EVOLUTION_AUTH_DB:-evogo_auth}?sslmode=disable
      POSTGRES_USERS_DB: postgresql://${EVOLUTION_DB_USER:-postgres}:${EVOLUTION_DB_PASSWORD}@postgres:5432/${EVOLUTION_USERS_DB:-evogo_users}?sslmode=disable
      DATABASE_SAVE_MESSAGES: ${DATABASE_SAVE_MESSAGES:-false}
      CONNECT_ON_STARTUP: ${CONNECT_ON_STARTUP:-true}
      WEBHOOKFILES: ${WEBHOOKFILES:-true}
      WADEBUG: ${WADEBUG:-INFO}
      LOGTYPE: ${LOGTYPE:-console}
    ports:
      - "127.0.0.1:${EVOLUTION_PORT:-8080}:8080"
EOF

# Bloco do Traefik (Se escolhido)
if [ "$PROXY_TYPE" = "3" ]; then
cat << EOF >> docker-compose.yml
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.evolution.rule=Host(\`${DOMAIN}\`)"
      - "traefik.http.routers.evolution.entrypoints=${TRAEFIK_ENTRYPOINT}"
      - "traefik.http.routers.evolution.tls.certresolver=${TRAEFIK_RESOLVER}"
      - "traefik.http.services.evolution.loadbalancer.server.port=8080"
    networks:
      - ${TRAEFIK_NETWORK}
      - default

networks:
  ${TRAEFIK_NETWORK}:
    external: true
EOF
fi

# Footer do docker-compose
cat << 'EOF' >> docker-compose.yml
volumes:
  evolution_postgres_data:
EOF

echo -e "\n${GREEN}Iniciando containers com $COMPOSE_CMD ...${NC}"
$COMPOSE_CMD up -d

# Bloco do Nginx (Se escolhido)
if [ "$PROXY_TYPE" = "2" ]; then
    echo -e "\n${GREEN}--- Configuração de Proxy Reverso (Nginx + SSL) ---${NC}"
    if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "localhost" ] || [[ "$DOMAIN" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo -e "${RED}A URL pública não parece ser um domínio válido para SSL (encontrado: $DOMAIN). Pulando configuração do Nginx.${NC}"
    else
        echo -e "Domínio detectado: ${YELLOW}$DOMAIN${NC}"
        echo -e "Instalando Nginx e Certbot (pode solicitar sua senha sudo)..."
        sudo apt-get update && sudo apt-get install -y nginx certbot python3-certbot-nginx
        
        NGINX_CONF="/etc/nginx/sites-available/evolution"
        echo -e "Gerando configuração do Nginx em $NGINX_CONF..."
        sudo tee $NGINX_CONF > /dev/null <<EOF_NGINX
server {
    listen 80;
    server_name $DOMAIN;

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:$EVOLUTION_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header Real-IP \$remote_addr;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
EOF_NGINX

        echo -e "Habilitando site..."
        sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
        sudo nginx -t
        sudo systemctl reload nginx
        
        echo -e "Solicitando certificado SSL via Certbot para $DOMAIN..."
        if sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email; then
            echo -e "${GREEN}Nginx e SSL configurados com sucesso!${NC}"
        else
            echo -e "${RED}Aviso: Falha ao solicitar SSL. Verifique se o domínio aponta para o IP do servidor e tente rodar o certbot manualmente.${NC}"
        fi
    fi
fi

echo -e "\n${GREEN}===========================================${NC}"
echo -e "${GREEN}Instalação concluída com sucesso!${NC}"
echo -e "Os arquivos foram gerados no diretório: ${YELLOW}$(pwd)${NC}"
echo -e "A Evolution API está rodando internamente na porta: ${YELLOW}${EVOLUTION_PORT}${NC}"
echo -e "Sua Global API Key é: ${YELLOW}${EVOLUTION_GLOBAL_API_KEY}${NC}"
echo -e "Para ver os logs rode: ${YELLOW}$COMPOSE_CMD logs -f${NC}"
echo -e "${GREEN}===========================================${NC}\n"
