#!/usr/bin/env bash

KV=$(echo "https://express-auth-service-kv.vault.azure.net/" | sed -E 's|https://([^.]*)\.vault\.azure\.net/?|\1|')
ENV=".env.development"

set_env() {
  if grep -q "^$1=" "$ENV"; then
    sed -i.bak "s|^$1=.*|$1=$2|" "$ENV"
  else
    echo "$1=$2" >> "$ENV"
  fi
}

touch "$ENV"

echo "🔐 Fetching secrets from Azure Key Vault: $KV..."

set_env MONGO_URI "$(az keyvault secret show --vault-name "$KV" --name MONGO-URI --query value -o tsv)"
set_env JWT_SECRET "$(az keyvault secret show --vault-name "$KV" --name JWT-SECRET --query value -o tsv)"

echo "📄 Updated environment file: $ENV"
echo "🗂️ Backup created: $ENV.bak"
echo "✅ Secrets synced successfully"