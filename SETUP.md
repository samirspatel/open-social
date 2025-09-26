# GitSocial Setup Guide

This guide will walk you through setting up GitSocial with real GitHub integration.

## Prerequisites

- Node.js 18 or higher
- A GitHub account
- Git installed on your machine

## Quick Setup

### 1. GitHub OAuth Application Setup

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
2. Click **"New OAuth App"**
3. Fill in the application details:
   - **Application name**: `GitSocial` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**
5. Copy your **Client ID** and **Client Secret**

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your GitHub OAuth credentials:
   ```bash
   # GitHub OAuth Configuration
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   
   # NextAuth Configuration  
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
   
   # Application Environment
   NODE_ENV=development
   ```

### 3. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` and sign in with GitHub!

## What Happens When You Sign In

1. **Repository Creation**: GitSocial automatically creates a `social-data` repository in your GitHub account
2. **Data Structure**: Your posts, followers, and social connections are stored as JSON files
3. **User Registry**: You're added to the global user registry for discoverability
4. **Real-time Updates**: Your activity is tracked with full Git history

## Repository Structure

After signing in, you'll have a new repository: `your-username/social-data`

```
your-username/social-data/
├── .gitsocial/
│   ├── config.json          # App configuration
│   └── schema-version.json  # Data schema version
├── profile.json             # Your profile information
├── posts/                   # All your posts as JSON files
│   ├── 2024-01-15-1234567890.json
│   └── 2024-01-16-0987654321.json
├── social/
│   ├── following.json       # People you follow
│   ├── followers.json       # Your followers
│   └── likes.json          # Posts you've liked
└── media/                   # Uploaded images and files
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
- Ensure the repository name `social-data` is available in your account
- Verify your GitHub OAuth app has the correct callback URL

### "Authentication failed"
- Double-check your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `.env.local`
- Make sure the callback URL in your GitHub OAuth app matches exactly: `http://localhost:3000/api/auth/callback/github`
- Clear your browser cookies and try signing in again

### "Cannot read posts"
- The app expects a `social-data` repository to exist in your GitHub account
- If you deleted the repository, sign out and sign back in to recreate it
- Check that the repository is public (required for the current implementation)

## Production Deployment

For production deployment, you'll need to:

1. Update your GitHub OAuth app with production URLs
2. Set production environment variables
3. Configure a user registry repository for the community
4. Deploy using your preferred hosting platform

See the main README for detailed deployment instructions.

## Next Steps

Once you're up and running:

1. **Create Your First Post**: Use the post composer to create content
2. **Find Other Users**: Check out the user discovery features
3. **Follow People**: Build your social network
4. **Explore Your Data**: Browse your `social-data` repository to see how your data is stored

Welcome to the future of user-owned social media! 🎉
