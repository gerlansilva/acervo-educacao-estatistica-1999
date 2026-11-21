#!/usr/bin/env bash
# Publicação manual (alternativa ao deploy automático via GitHub).
# Publica o acervo no Cloudflare Pages, projeto "ciee1999".
# Uso: ./deploy-cloudflare.sh
set -euo pipefail
cd "$(dirname "$0")"

stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT

rsync -a \
  --exclude '.git' \
  --exclude '.github' \
  --exclude '.DS_Store' \
  --exclude 'metadados' \
  --exclude 'documentos' \
  --exclude 'README.md' \
  --exclude 'COMO_ATUALIZAR.txt' \
  --exclude 'deploy-cloudflare.sh' \
  ./ "$stage"/

npx --yes wrangler@latest pages deploy "$stage" \
  --project-name ciee1999 \
  --branch main \
  --commit-dirty=true
