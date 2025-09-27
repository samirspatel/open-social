# GitSocial Data Architecture

## Overview

GitSocial uses a **dual-branch architecture** to separate application code from user data, ensuring clean organization and optimal data management.

## Branch Structure

### 🚀 **Main Branch** (`main`)
**Purpose**: Application code and hosting

```
main/
├── src/                    # Application source code
├── .github/workflows/      # Deployment automation
├── package.json           # Dependencies and scripts
├── README.md              # Project documentation
└── ...                    # All application files
```

**Contains**:
- Next.js application code
- GitHub Pages deployment configuration
- Development tools and configuration
- Documentation and guides

### 📊 **User Data Branch** (`user-data`)
**Purpose**: User registry and network data only

```
user-data/
├── users/                  # Individual user registry files
│   ├── index.json         # Quick user lookup
│   ├── alice.json         # Individual user data
│   ├── bob.json           # Individual user data
│   └── ...                # More users
├── network/               # Network-wide data
│   ├── stats.json         # Network statistics
│   └── connections.json   # Global connection mappings
├── .gitsocial/           # Branch metadata
│   ├── config.json       # Branch configuration
│   └── schema.json       # Data schemas
└── README_DATA.md        # Data branch documentation
```

**Contains**:
- User profiles and metadata
- Network discovery information
- Connection statistics
- User registry and index files

## Data Storage Strategy

### 🏠 **Stored in `user-data` Branch**
- ✅ User profiles and basic metadata
- ✅ User discovery information (handles, join dates)
- ✅ Network-wide statistics
- ✅ Connection mappings and indices
- ✅ User registry for discovery

### 👤 **Stored in Individual User Repositories**
- ✅ User posts and content
- ✅ Photos and media files
- ✅ Comments and interactions
- ✅ Private user preferences
- ✅ Social connections (following/followers lists)

### ❌ **Never Stored**
- User's personal posts in the main registry
- Private user data in the network branch
- Application code in the data branch

## Automatic Updates

The `user-data` branch is automatically updated when:

1. **User Signs Up**
   - Creates `users/username.json` 
   - Updates `users/index.json`
   - Increments `network/stats.json`

2. **Users Connect**
   - Updates connection statistics
   - Records network relationships
   - Updates activity metrics

3. **Network Changes**
   - Refreshes network statistics
   - Updates user activity data
   - Maintains data consistency

## Benefits of This Architecture

### 🎯 **Clean Separation**
- Application code and data are completely separate
- Easy to backup, migrate, or analyze user data independently
- Clear boundaries between code deployment and data management

### 🔄 **Efficient Operations**
- Individual user files enable fast lookups
- Network data supports quick discovery and statistics
- Minimal data transfer for user operations

### 🛡️ **Data Integrity**
- User content remains in their own repositories (full ownership)
- Network data centralized for discovery but not content
- Clear schema definitions and validation

### 📈 **Scalability**
- Individual user files scale better than monolithic registry
- Network statistics can be computed incrementally
- Easy to implement caching and indexing

## Implementation Details

### Service Integration
```typescript
// UserRegistryService automatically targets user-data branch
class UserRegistryService {
  private readonly DATA_BRANCH = 'user-data'
  private readonly USERS_DIR = 'users'
  private readonly NETWORK_DIR = 'network'
  
  async registerUser(userInfo) {
    // Creates users/username.json in user-data branch
    // Updates users/index.json
    // Updates network/stats.json
  }
}
```

### Data Flow
1. **User Action** (signup, follow) occurs in application
2. **Service Layer** processes the action
3. **Data Branch** receives structured updates
4. **User Repository** receives content (posts, media)
5. **Network Statistics** updated automatically

## Migration and Backup

### Easy Data Export
```bash
# Clone just the user data
git clone -b user-data https://github.com/username/open-social.git user-data-backup

# Export specific user data
git show user-data:users/username.json > user-backup.json
```

### Network Analytics
```bash
# Get network statistics
git show user-data:network/stats.json

# Get connection data  
git show user-data:network/connections.json
```

## Security Considerations

- **Public Data Only**: user-data branch contains only public profile information
- **Private Data**: Sensitive content stays in individual user repositories
- **Access Control**: Users control access to their own repositories
- **Network Transparency**: All network data is openly auditable

---

**This architecture enables GitSocial to provide centralized discovery while maintaining distributed data ownership.**
