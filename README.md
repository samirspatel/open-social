# GitSocial User Data Registry

This branch contains only user data for the GitSocial distributed social network.

## Branch Purpose

- **Branch**: `user-data`
- **Purpose**: Store user registry and network data separate from application code
- **Updated**: Automatically when users sign up or make social connections
- **Access**: Read by the GitSocial application, written by user actions

## Structure

```
user-data branch/
├── README_DATA.md          # This file
├── users/                  # Individual user registry files
│   ├── index.json         # Quick user lookup index
│   ├── username1.json     # Individual user data
│   ├── username2.json     # Individual user data
│   └── ...                # More users
├── network/               # Network-wide data
│   ├── stats.json         # Network statistics
│   └── connections.json   # Global connection index
└── .gitsocial/            # Branch metadata
    ├── schema.json        # Data schema definitions
    └── config.json        # Branch configuration
```

## Data Types Stored Here

### ✅ User Registry Data
- User profiles and metadata
- Network discovery information
- Join dates and basic statistics
- User handles and repository links

### ✅ Network Connection Data  
- Social connection mappings
- Network-wide statistics
- Global user index

### ❌ NOT Stored Here
- User posts and content (stored in user's individual repos)
- Photos and media (stored in user's individual repos) 
- Comments and interactions (stored in user's individual repos)
- Private user data (stored in user's individual repos)

## How It Works

1. **User Signs Up**: Profile added to `users/username.json`
2. **User Connects**: Network connections updated across relevant files
3. **Discovery**: Other users can find and connect through this registry
4. **Data Separation**: Content stays in user repos, network data stays here

## Automatic Updates

This branch is automatically updated by the GitSocial application when:
- New users sign up via GitHub OAuth
- Users follow/unfollow each other
- Network statistics need refreshing
- Schema updates are deployed

## Data Ownership

- **Registry Data**: Managed by the GitSocial network
- **User Content**: Owned by individual users in their repos
- **Portability**: Users can export their connections and move between networks

---

**This branch enables distributed social networking while maintaining user data ownership**
