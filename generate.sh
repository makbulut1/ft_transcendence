#!/bin/bash
# This script generates .env files with given input.

reverse_string() {
    local input="$1"
    local output=""
    local len=${#input}
    for (( i = len - 1; i >= 0; i-- )); do
        output="${output}${input:i:1}"
    done
    echo "$output"
}

echo -n "PostgreSQL Username: "
read PG_USER

echo -n "PostgreSQL Password: "
read PG_PASS

echo -n "PostgreSQL Host: "
read PG_HOST

DATABASE_URL="postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}:5432/postgres"

echo -n "Intra UID: "
read INTRA_UID

echo -n "Intra Secret: "
read INTRA_SECRET

echo -n "Intra Redirect: "
read INTRA_REDIRECT

echo -n "JWT Secret: "
read JWT_SECRET
INVITE_JWT_SECRET=$(reverse_string $JWT_SECRET)


echo -n "API port: "
read API_PORT
VITE_API_PORT=$API_PORT

echo -n "API host: "
read API_HOST
VITE_API_HOST=$API_HOST

echo -n "Socket port: "
read SOCKET_PORT
VITE_SOCKET_PORT=$SOCKET_PORT

echo -n "Host: "
read VITE_HOST

echo -n "Host port: "
read VITE_HOST_PORT


cat << EOF > app/.env
VITE_HOST_PORT=$VITE_HOST_PORT

# Environment
API_PORT=$API_PORT
SOCKET_PORT=$SOCKET_PORT
API_HOST=$API_HOST

# PostgreSQL credentials
PG_USER=$PG_USER
PG_PASS=$PG_PASS
PG_HOST=$PG_HOST # laststand-db
DATABASE_URL="$DATABASE_URL"

# Intra API credentials
INTRA_UID=$INTRA_UID
INTRA_SECRET=$INTRA_SECRET
INTRA_REDIRECT=$INTRA_REDIRECT

# API credentials
JWT_SECRET=$JWT_SECRET
INVITE_JWT_SECRET=$INVITE_JWT_SECRET
EOF
echo ".env created for backend and docker-compose"

cat << EOF > app/laststand/.env
VITE_API_PORT=$VITE_API_PORT
VITE_HOST_PORT=$VITE_HOST_PORT
VITE_SOCKET_PORT=$VITE_SOCKET_PORT
VITE_API_HOST=$VITE_API_HOST
VITE_HOST=$VITE_HOST
VITE_INTRA_UID=$INTRA_UID
EOF

echo ".env created for frontend"
