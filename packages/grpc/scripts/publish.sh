#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${1}"
}

error() {
    echo -e "${RED}Error: ${1}${NC}"
}

success() {
    echo -e "${GREEN}${1}${NC}"
}

warning() {
    echo -e "${YELLOW}Warning: ${1}${NC}"
}

# Parse arguments
DRY_RUN=false
TAG="latest"

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --dry-run) DRY_RUN=true ;;
        --tag) TAG="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

log "Publishing @torq-system/grpc..."

# Get current version from package.json
VERSION=$(node -p "require('./package.json').version")
NAME=$(node -p "require('./package.json').name")
success "Package: ${NAME}@${VERSION}"

# Run checks
log "Running lint..."
npm run lint

log "Building package..."
npm run build

# Check if version exists
if [ "$DRY_RUN" = false ]; then
    if npm view "${NAME}@${VERSION}" version >/dev/null 2>&1; then
        PUBLISHED_VERSION=$(npm view "${NAME}@${VERSION}" version)
        if [ "$PUBLISHED_VERSION" == "$VERSION" ]; then
            error "Version ${VERSION} already exists on npm"
            exit 1
        fi
    fi
fi

# Publish
if [ "$DRY_RUN" = true ]; then
    warning "DRY RUN MODE - Not actually publishing"
    npm publish --dry-run
else
    log "Publishing to npm with tag: ${TAG}..."
    npm publish --tag "${TAG}" --access public
    success "Successfully published ${NAME}@${VERSION}"

    log "Creating git tag..."
    git tag "v${VERSION}"
    
    log "Pushing commit and tag..."
    git push origin "$(git branch --show-current)" --follow-tags
    success "Commit and tag pushed to remote"
fi
