#!/bin/bash

# Check if two commit hashes are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <commit1> <commit2>"
    echo "Example: $0 460108930315dd8e0870a1946f2e7c7debcd12a3 4179c3f9ae8df647995d8a5d6925e1ddbac07146"
    exit 1
fi

# Assign commit hashes from arguments
COMMIT1="$1"
COMMIT2="$2"

# GitHub repo details
REPO="rjvim/saas-foundations"
PATCH_URL="https://github.com/$REPO/compare/$COMMIT1..$COMMIT2.patch"

# Download the raw patch
echo "Fetching patch from $PATCH_URL..."
curl -o raw.patch "$PATCH_URL" || {
    echo "Error: Failed to download patch. Check if the repo is public and commits are valid."
    exit 1
}

# Filter out unwanted files (.png, .jpg, .lock, pnpm-lock.yaml, and binary diffs like .ttf)
echo "Filtering patch to exclude .png, .jpg, .lock, pnpm-lock.yaml, and binary diffs..."
awk '
BEGIN { exclude = 0 }
/^diff --git/ { 
    # Check file extensions and binary indicator
    exclude = ($3 ~ /\.(png|jpg|lock|ttf)$/ || $4 ~ /\.(png|jpg|lock|ttf)$/ || $3 ~ /pnpm-lock\.yaml$/ || $4 ~ /pnpm-lock\.yaml$/);
}
/GIT binary patch/ { exclude = 1 }  # Mark section as excluded if it’s a binary patch
/^diff --git/ && !exclude { print }
/^diff --git/ { next }
!exclude { print }
' raw.patch > filtered.patch

# Check if filtered.patch was created successfully
if [ -s filtered.patch ]; then
    echo "Success: filtered.patch generated."
else
    echo "Warning: filtered.patch is empty or wasn’t created. Check raw.patch for content."
fi

# Clean up (optional: remove raw.patch)
# rm raw.patch
echo "Done. Check filtered.patch for the result."