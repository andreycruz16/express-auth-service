#!/usr/bin/env bash

# =========================
# CONFIG
# =========================
KEYVAULT_URL="https://express-auth-service-kv.vault.azure.net/"
ENV=".env.development"

SECRETS=(
  "MONGO_URI=MONGO-URI"
  "JWT_SECRET=JWT-SECRET"
)

# =========================
# SETUP
# =========================
KV=$(echo "$KEYVAULT_URL" | sed -E 's|https://([^.]*)\.vault\.azure\.net/?|\1|')

set_env() {
  local key="$1"
  local value="$2"

  if grep -q "^${key}=" "$ENV"; then
    sed -i '' "s|^${key}=.*|${key}=${value}|" "$ENV"
  else
    echo "${key}=${value}" >> "$ENV"
  fi
}

touch "$ENV"

# =========================
# AZ LOGIN CHECK
# =========================
if ! az account show >/dev/null 2>&1; then
  echo "❌ Not logged in to Azure. Run: az login"
  exit 1
fi

echo "🔐 Fetching secrets from Azure Key Vault: $KV..."

ALL_SUCCESS=true

# =========================
# MAIN LOOP
# =========================
for item in "${SECRETS[@]}"; do
  IFS='=' read -r ENV_KEY SECRET_NAME <<< "$item"

  VALUE=$(az keyvault secret show \
    --vault-name "$KV" \
    --name "$SECRET_NAME" \
    --query value -o tsv 2>/dev/null)

  if [[ -z "$VALUE" ]]; then
    echo "❌ $ENV_KEY"
    ALL_SUCCESS=false
    continue
  fi

  set_env "$ENV_KEY" "$VALUE"

  printf "✅ %-28s\n" "$ENV_KEY"
done

# =========================
# FINAL STATUS
# =========================
if [[ "$ALL_SUCCESS" = true ]]; then
  echo "✅ All secrets fetched successfully"
fi