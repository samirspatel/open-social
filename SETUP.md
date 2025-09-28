# GitSocial Setup Guide

This guide will walk you through setting up GitSocial with real GitHub integration.

## Prerequisites

- Node.js 18 or higher
- A GitHub account
- Git installed on your machine

## Quick Setup

### 1. No OAuth Setup Required!

GitSocial uses **Personal Access Tokens** instead of OAuth, making it perfect for GitHub Pages deployment:

✅ **No GitHub OAuth App needed**  
✅ **No environment variables required**  
✅ **No server-side authentication**  
✅ **Works entirely client-side**

### 2. Personal Access Token (Set up when first using the app)

When you click "Connect to GitHub" in GitSocial, you'll be guided to:

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens/new)
2. Create a token with these scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:user` (Read user profile data)  
   - ✅ `user:email` (Access user email addresses)
3. The app will validate and store your token locally

**Security**: Your token stays in your browser and never goes to any server.

### 3. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` and sign in with GitHub!

## What Happens When You Sign In

1. **Repository Creation**: GitSocial automatically creates a `open-social-data` repository in your GitHub account
2. **Data Structure**: Your posts, followers, and social connections are stored as JSON files
3. **User Registry**: You're added to the global user registry for discoverability
4. **Real-time Updates**: Your activity is tracked with full Git history

## Repository Structure

After signing in, you'll have a new repository: `your-username/open-social-data`

```
your-username/open-social-data/
 .gitsocial/
�    config.json          # App configuration
�    schema-version.json  # Data schema version
 profile.json             # Your profile information
 posts/                   # All your posts as JSON files
�    2024-01-15-1234567890.json
�    2024-01-16-0987654321.json
 social/
�    following.json       # People you follow
�    followers.json       # Your followers
�    likes.json          # Posts you've liked
 media/                   # Uploaded images and files
```

## Features

### Real Data Ownership
- All your data lives in YOUR GitHub repository
- Complete control over your social media presence
- Export/import data anytime
- No vendor lock-in

### GitHub Integration
- **Authentication**: GitHub OAuth for secure login
- **Repository Management**: Automatic repository creation and management  
- **Version Control**: Full Git history of all your social activity
- **File Storage**: JSON-based data storage with schema validation

### Social Features
- **Post Creation**: Create posts stored in your repository
- **Following System**: Bidirectional relationships stored in both users' repos
- **Feed Aggregation**: Real-time feed from people you follow
- **User Discovery**: Find other GitSocial users through the registry

## Development Commands

Use the included development script for all common tasks:

```bash
# Setup & Installation
./dev.sh install     # Install dependencies
./dev.sh check       # Check system requirements

# Development  
./dev.sh dev         # Start dev server (http://localhost:3000)
./dev.sh lint        # Run code linting

# Production
./dev.sh build       # Build for production
./dev.sh serve       # Serve production build
./dev.sh deploy      # Test deployment build

# Utilities
./dev.sh clean       # Clean build artifacts
./dev.sh info        # Show project information
./dev.sh status      # Show git status
./dev.sh help        # Show all commands
```

## Troubleshooting

### "Failed to create repository"
- Check that your GitHub token has `repo` scope permissions
- Ensure the repository name `open-social-data` is available in your account
- Verify your Personal Access Token has the required scopes

### "Authentication failed" or redirects to /api/auth/error
- **Clear your browser cache** - You might have an old OAuth version cached
- Make sure your Personal Access Token has the correct scopes (`repo`, `read:user`, `user:email`)
- Try using an incognito/private browser window
- Ensure you're accessing the correct GitHub Pages URL

### "Cannot read posts"
- The app expects a `open-social-data` repository to exist in your GitHub account
- If you deleted the repository, sign out and sign back in to recreate it
- Check that the repository is public (required for the current implementation)

## GitHub Pages Deployment (Zero Configuration!)

GitSocial is perfect for GitHub Pages deployment:

1. **Fork or clone** this repository
2. **Enable GitHub Pages** in repository settings  
3. **Deploy automatically** - No configuration needed!
4. **Users authenticate** with their own Personal Access Tokens

Your app will be available at: `https://username.github.io/repository-name`

**Benefits:**
- ✅ Zero server costs
- ✅ No environment variables needed
- ✅ Automatic SSL/HTTPS
- ✅ Global CDN distribution
- ✅ Perfect uptime

## Next Steps

Once you're up and running:

1. **Create Your First Post**: Use the post composer to create content
2. **Find Other Users**: Check out the user discovery features
3. **Follow People**: Build your social network
4. **Explore Your Data**: Browse your `open-social-data` repository to see how your data is stored

Welcome to the future of user-owned social media! 
