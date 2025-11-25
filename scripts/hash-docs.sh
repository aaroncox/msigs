#!/usr/bin/env bash
#
# Hash Documentation Files
#
# Calculates checksum256 (SHA-256) hashes of markdown documentation files.
# These hashes are used in on-chain multisig proposals to reference specific
# document versions, creating a permanent record of which document version
# was approved by Block Producers.
#
# Usage:
#   ./scripts/hash-docs.sh                      # Hash all markdown files in subfolders
#   ./scripts/hash-docs.sh documents/stage-1.md # Hash specific file
#   ./scripts/hash-docs.sh documents/*.md       # Hash multiple files
#
# Without arguments, hashes markdown files in subfolders only (excludes root-level .md files)
#

set -e

# Detect which SHA256 tool is available
if command -v shasum >/dev/null 2>&1; then
    SHA256_CMD="shasum -a 256"
elif command -v sha256sum >/dev/null 2>&1; then
    SHA256_CMD="sha256sum"
else
    echo "Error: No SHA256 tool found (tried shasum, sha256sum)" >&2
    exit 1
fi

# Calculate hash for a single file
hash_file() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        echo "Error: File not found: $file" >&2
        return 1
    fi
    
    # Calculate hash
    local hash_output
    hash_output=$($SHA256_CMD "$file")
    local hash=$(echo "$hash_output" | awk '{print $1}')
    
    # Output result
    echo "$file"
    echo "$hash"
    echo ""
}

# Main execution
main() {
    local files=()
    
    if [[ $# -gt 0 ]]; then
        # Use provided files
        files=("$@")
    else
        # Default: scan all markdown files in subfolders only (not root)
        echo "Scanning for markdown files..."
        echo ""
        
        # Find all markdown files in subfolders (excluding node_modules, .git, etc.)
        while IFS= read -r -d '' file; do
            files+=("$file")
        done < <(find . -mindepth 2 -type f -name "*.md" ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/build/*" -print0 2>/dev/null | sort -z)
    fi
    
    if [[ ${#files[@]} -eq 0 ]]; then
        echo "No markdown files found" >&2
        exit 1
    fi
    
    # Process each file
    for file in "${files[@]}"; do
        hash_file "$file" || true
    done
}

main "$@"
