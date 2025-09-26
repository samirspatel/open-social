# GitSocial - Distributed Social Media Platform

> What open source did for code, open social does for data.

GitSocial is a distributed social media application where users' data lives in their own GitHub repositories, implementing true data ownership and portability.

## 🚀 Quick Start Development Plan

### Phase 1: Foundation (Weeks 1-3)
**Goal**: Basic GitHub integration and simple posting
- GitHub OAuth authentication
- Repository management for user data
- Basic post creation and profile setup
- Simple web interface

### Phase 2: Social Features (Weeks 4-6)  
**Goal**: Core social media functionality
- Follow/unfollow system
- Feed aggregation from multiple repos
- Real-time updates via webhooks
- Like, reply, and repost features

### Phase 3: Advanced Features (Weeks 7-9)
**Goal**: Rich content and discoverability  
- Media upload and rich content
- Search and discovery features
- Mobile PWA experience
- Performance optimization

### Phase 4: Network Effects (Weeks 10-12)
**Goal**: Ecosystem and portability
- Data import/export tools
- Third-party API for other clients
- Advanced feed algorithms
- Production deployment

## 🏗️ Architecture Overview

### Data Ownership Model
Each user has a GitHub repository (`username/social-data`) containing:
```
├── profile.json          # User profile
├── posts/                # All posts as JSON files  
├── social/               # Following, followers, likes
└── media/                # User's media files
```

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Prisma, PostgreSQL (cache only)
- **Real-time**: Socket.io, GitHub Webhooks
- **External**: GitHub API, GitHub OAuth

### Key Benefits
- ✅ **Complete data ownership** - Your data lives in YOUR GitHub repo
- ✅ **Full portability** - Switch apps without losing data or connections  
- ✅ **No vendor lock-in** - Data exists independently of any app
- ✅ **Built-in version control** - Git history for all social activity
- ✅ **Cryptographic integrity** - All posts cryptographically signed

## 📋 Development Status

Current phase: **Phase 1 - Foundation**

See [`.cursorrules`](.cursorrules) for the complete detailed development plan with milestones, technical specifications, and implementation guidelines.

## 🔧 Getting Started

### Quick Start (Recommended)
```bash
# Use the development script for everything
./dev.sh install && ./dev.sh dev
```

### Manual Setup
```bash
# Clone the repository
git clone https://github.com/username/open-social.git
cd open-social

# Install dependencies
npm install

# Set up environment variables (optional for demo)
cp .env.example .env.local
# Edit .env.local with your GitHub OAuth credentials

# Run development server
npm run dev
```

### Development Script Commands

The `dev.sh` script provides all commands needed for development:

```bash
# Setup & Installation
./dev.sh install     # Install dependencies
./dev.sh check       # Check system requirements

# Development
./dev.sh dev         # Start dev server (http://localhost:3000)
./dev.sh lint        # Run code linting

# Production
./dev.sh build       # Build for production
./dev.sh serve       # Serve production build (http://localhost:3001)

# Utilities
./dev.sh clean       # Clean build artifacts
./dev.sh info        # Show project information  
./dev.sh help        # Show all commands
```

## 🌐 Vision

GitSocial implements the "open social" concept where:
- Users own their data completely
- Apps compete on features, not lock-in
- Social graphs are portable between platforms
- The network becomes more valuable as more apps participate

This is social media designed for users, not shareholders.

## 📚 Documentation

- [Architecture Document](ARCHITECTURE.md) - High-level system design
- [Development Plan](.cursorrules) - Detailed implementation roadmap
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute (coming soon)

## 🤝 Contributing

GitSocial is an open source project. We welcome contributions from developers who share the vision of user-owned social data.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

*"For a long time, open social will rely on a community of stubborn enthusiasts who see the promise of the approach. That's the history of every big community-driven change."* - Dan Abramov
