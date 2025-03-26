#!/bin/bash

# Array of paths to filter (customize these as needed)
PATHS_TO_INCLUDE=(
    "workspace/content/blog"
    "apps/blog/content"
)

# File extensions to include (customize as needed)
EXTENSIONS_TO_INCLUDE=("md" "mdx" "txt")

# Repository (customize if needed)
REPO="rjvim/saas-foundations"

# Check for correct number of arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <commit1> <commit2>"
    echo "Example: $0 460108930315dd8e0870a1946f2e7c7debcd12a3 4179c3f9ae8df647995d8a5d6925e1ddbac07146"
    exit 1
fi

COMMIT1="$1"
COMMIT2="$2"
PATCH_URL="https://github.com/$REPO/compare/$COMMIT1..$COMMIT2.patch"

echo "Fetching patch from $PATCH_URL..."
curl -o raw.patch "$PATCH_URL" || {
    echo "Error: Failed to download patch."
    exit 1
}

# Build the regex pattern for paths and extensions dynamically
PATH_PATTERN=$(IFS="|"; echo "${PATHS_TO_INCLUDE[*]}")
EXT_PATTERN=$(IFS="|"; echo "${EXTENSIONS_TO_INCLUDE[*]}")
FILE_PATTERN="(${PATH_PATTERN})\/.*\.(${EXT_PATTERN})$"

echo "Filtering patch to include only files matching: $FILE_PATTERN"
echo "Skipping pure renames..."

awk -v pattern="$FILE_PATTERN" '
BEGIN { include = 0; content_changed = 0; in_diff = 0 }
/^diff --git/ { 
    in_diff = 1;
    # Check if both old and new paths match our pattern
    include = ($3 ~ pattern && $4 ~ pattern);
    content_changed = 0;  # Reset for this diff
}
/similarity index 100%/ { 
    if (in_diff && include) content_changed = 0;  # Pure rename, no content change yet
}
/^[-+]/ { 
    if (in_diff && include) content_changed = 1;  # Content changed
}
/^diff --git/ && include && content_changed { print }
/^diff --git/ { next }
include && content_changed { print }
' raw.patch > filtered.patch

if [ -s filtered.patch ]; then
    echo "Success: filtered.patch generated with Git diff format."
else
    echo "Warning: filtered.patch is empty or wasn’t created. Check raw.patch for content."
fi

# Uncomment to clean up
# rm raw.patch

echo "Done. Check filtered.patch for AI input."