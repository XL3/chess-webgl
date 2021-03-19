# Build to dist folder
npm run build

# Add dist folder
git add --force dist

# Amend last commit
git commit -m "Deploy"

# Delete gh-pages
git push origin --delete gh-pages

# Push subtree
git subtree push --prefix dist origin gh-pages

# Revert back to head
git reset HEAD~1
