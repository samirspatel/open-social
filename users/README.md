# GitSocial Users Registry

This directory contains individual JSON files for each GitSocial user. Each file represents a registered user in the GitSocial network.

## Structure

```
users/
├── README.md           # This file
├── index.json          # Quick index of all users
├── username1.json      # Individual user data
├── username2.json      # Individual user data
└── ...                 # More user files
```

## User File Format

Each user file contains:

```json
{
  "githubId": "12345",
  "username": "exampleuser",
  "name": "Example User", 
  "email": "user@example.com",
  "avatar": "https://github.com/exampleuser.png",
  "handle": "@exampleuser.github.io",
  "repository": "exampleuser/social-data",
  "joinedAt": "2024-01-15T10:30:00.000Z",
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "version": "1.0"
}
```

## How It Works

1. **User Signs Up**: When someone signs in with GitHub OAuth
2. **Repository Created**: A `social-data` repository is created in their GitHub account
3. **User Registered**: Their information is stored as `username.json` in this directory
4. **Index Updated**: The `index.json` file is updated for quick user discovery
5. **Network Growth**: Other users can discover and follow them

## User Data Storage

- **Profile & Metadata**: Stored in the open-social repo (this repository)
- **Posts & Content**: Stored in the user's individual `social-data` repository
- **Social Connections**: Stored in both users' `social-data` repositories (bidirectional)

This approach ensures:
- **Decentralized Content**: Users own their posts and data
- **Centralized Discovery**: Easy to find and connect with other users
- **Data Portability**: Users can migrate their data between GitSocial instances
- **GitHub Native**: Everything uses standard Git workflows and GitHub features

## Contributing

This directory is automatically managed by the GitSocial application. User files are created and updated when users sign in and update their profiles.
