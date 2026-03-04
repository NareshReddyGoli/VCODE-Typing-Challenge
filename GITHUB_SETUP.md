# 🚀 GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click "New repository"
3. Repository name: `vcodetyping1`
4. Description: `VCODE Typing Challenge - Modern typing speed contest application`
5. Make it **Public** (required for Netlify free tier)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Local Repo to GitHub

After creating the repository, GitHub will show you commands. Run these commands in your terminal:

```bash
# Navigate to your project directory
cd typing-contest-stable

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/vcodetyping1.git

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Push

After pushing, you should see:
- All your files on GitHub
- Commit message: "Initial commit: VCODE Typing Challenge with React 19 + TypeScript"
- 27 files changed, 5134 insertions(+)

## Step 4: Connect to Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Git"
3. Connect to GitHub
4. Select the `vcodetyping1` repository
5. Build settings should be auto-detected:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

## 🎉 Result

Your site will be live at: `https://vcodetyping1.netlify.app`

## Troubleshooting

If you get authentication errors:
- Make sure you're logged into GitHub CLI: `gh auth login`
- Or use Personal Access Token for HTTPS

If push fails:
- Make sure repository name matches exactly
- Check that you have write permissions to the repo
