# GitSocial - Distributed Social Media App Architecture

## Vision
Build a distributed social media application where users' data lives in their own GitHub repositories, implementing the "open social" concept described by Dan Abramov. Each user owns their data, can migrate between hosting providers, and apps aggregate data without locking users in.

## Core Concepts

### Data Ownership
- Each user has a dedicated GitHub repository (e.g., `username/social-data`)
- All social media entities (posts, likes, follows, profile) stored as JSON files
- Users maintain full ownership and portability of their data
- No vendor lock-in - data exists independently of any particular app

### Repository Structure
```
username/social-data/
├── profile.json              # User profile information
├── posts/                    # All user posts
│   ├── 2024-01-15-hello.json
│   └── 2024-01-16-update.json
├── social/                   # Social connections
│   ├── following.json        # Users this person follows  
│   ├── followers.json        # Followers (updated by app)
│   └── likes.json           # Posts this user has liked
├── media/                    # Images, videos, attachments
│   └── uploads/
└── .gitsocial/              # App metadata
    └── config.json
```

### Data Schemas

#### Profile Schema
```json
{
  "version": "1.0",
  "handle": "@username",
  "displayName": "Display Name",
  "bio": "User bio text",
  "avatar": "media/avatar.jpg",
  "website": "https://example.com",
  "location": "City, Country", 
  "joinedAt": "2024-01-01T00:00:00Z",
  "publicKey": "...", // For cryptographic verification
  "verified": true
}
```

#### Post Schema
```json
{
  "id": "post-2024-01-15-001",
  "type": "post", // post, reply, repost
  "content": "Hello, decentralized world!",
  "createdAt": "2024-01-15T10:30:00Z",
  "author": "github:username",
  "media": ["media/uploads/image1.jpg"],
  "replyTo": null, // For replies: "github:otheruser/post-id"
  "mentions": ["@otheruser"],
  "hashtags": ["#opensocial"],
  "signature": "..." // Cryptographic signature
}
```

#### Social Connections Schema
```json
{
  "following": [
    {
      "handle": "@otheruser",
      "repository": "otheruser/social-data",
      "followedAt": "2024-01-10T00:00:00Z"
    }
  ],
  "likes": [
    {
      "postId": "github:otheruser/post-2024-01-14-002",
      "likedAt": "2024-01-14T15:30:00Z"
    }
  ]
}
```

## Technical Architecture

### Core Components

1. **GitHub Integration Layer**
   - GitHub API client for repository operations
   - OAuth authentication flow
   - Repository initialization and management
   - File operations (CRUD) with proper Git commits

2. **Data Access Layer** 
   - Abstract interface for social data operations
   - Repository pattern for different entity types
   - Validation against JSON schemas
   - Cryptographic signing/verification

3. **Aggregation Engine**
   - Feed generation from multiple repositories
   - Real-time updates via GitHub webhooks
   - Caching layer for performance
   - Content indexing and search

4. **Web Application**
   - Modern React/Next.js frontend
   - GitHub OAuth integration
   - Real-time UI updates
   - Mobile-responsive design

5. **API Server**
   - RESTful API for frontend
   - GraphQL endpoint for efficient queries
   - Webhook handlers for real-time updates
   - Rate limiting and caching

### Technology Stack

**Frontend:**
- Next.js 14 with App Router
- React 18 with modern hooks
- Tailwind CSS for styling
- SWR for data fetching
- Socket.io for real-time updates

**Backend:**
- Node.js with Express
- TypeScript for type safety
- Prisma for local caching database
- Redis for session/cache management
- Socket.io for real-time features

**External Services:**
- GitHub API for repository operations
- GitHub Webhooks for real-time updates
- GitHub OAuth for authentication

**Database (Local Cache Only):**
- PostgreSQL for aggregated feeds
- Redis for real-time data
- Full-text search with extensions

## User Experience Flow

### Onboarding
1. User authenticates with GitHub OAuth
2. App creates `username/social-data` repository (if not exists)
3. Initialize repository with basic structure and schemas
4. User completes profile setup
5. App commits initial profile.json

### Core Features

**Posting:**
1. User creates post through web interface
2. App validates content and generates post JSON
3. Commits new post file to user's repository
4. Triggers webhook to update feeds for followers

**Following:**
1. User discovers and follows another user
2. App updates following.json in user's repository
3. Begins tracking followed user's repository for updates
4. Updates follower's followers.json (if they use the app)

**Feed Generation:**
1. App monitors repositories of followed users
2. Aggregates recent posts into chronological feed
3. Caches feed data locally for performance
4. Updates feed in real-time via webhooks

### Privacy and Security

**Cryptographic Signatures:**
- All posts signed with user's private key
- Public key stored in profile for verification
- Prevents tampering and impersonation

**Privacy Controls:**
- Repository visibility controls content privacy
- Private repositories = private posts
- Granular privacy settings per post type

**Data Portability:**
- Users can export entire repository anytime
- Standard JSON formats enable cross-platform compatibility
- App provides migration tools for switching providers

## Development Phases

### Phase 1: MVP (Core Infrastructure)
- [ ] GitHub OAuth integration
- [ ] Repository initialization and basic operations
- [ ] Simple posting and profile management
- [ ] Basic web interface

### Phase 2: Social Features
- [ ] Following/followers system
- [ ] Basic feed aggregation
- [ ] Like and reply functionality
- [ ] Real-time updates via webhooks

### Phase 3: Advanced Features
- [ ] Full-text search across network
- [ ] Media upload and management
- [ ] Advanced privacy controls
- [ ] Mobile app (React Native)

### Phase 4: Network Effects
- [ ] Cross-platform data import/export
- [ ] Third-party app API
- [ ] Algorithmic feed options
- [ ] Community moderation tools

## Benefits of This Architecture

**For Users:**
- Complete data ownership and portability
- No vendor lock-in or platform dependency
- Familiar GitHub-based workflow for developers
- Built-in version control for all social data

**For Developers:**
- Open protocol enables innovation
- Easy to build competing clients
- Standard APIs reduce integration complexity
- Community can contribute improvements

**For Ecosystem:**
- Network effects benefit all participants
- Shared infrastructure reduces costs
- Open source nature enables rapid iteration
- Resistance to platform manipulation

## Getting Started

The implementation will begin with setting up the basic project structure, GitHub integration, and core data models. Each phase builds incrementally toward a fully functional distributed social media platform.

This architecture provides a solid foundation for building the "open social" future described in the blog post, where users control their data and apps compete on features rather than lock-in.
