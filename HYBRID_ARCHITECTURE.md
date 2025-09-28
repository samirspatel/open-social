# Hybrid Architecture: Minimal Auth Server + GitHub Pages

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│  GitHub Pages   │◄──►│  Minimal Auth    │◄──►│  GitHub API     │
│  (Static App)   │    │  Server          │    │  (Repository)   │
│                 │    │  (OAuth only)    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## How It Works

1. **Static App**: Main GitSocial app runs on GitHub Pages (zero cost)
2. **Minimal Auth Server**: Tiny serverless function ONLY for OAuth (minimal cost)
3. **Repository-Specific Access**: Users grant access to only the `open-social-data` repo

## Benefits

✅ **Repository-specific permissions** - Only access to target repo  
✅ **GitHub Pages compatible** - Main app stays static  
✅ **Professional OAuth flow** - Standard GitHub App authentication  
✅ **Minimal server costs** - Only auth endpoint, everything else is static  
✅ **Scalable** - Auth server handles thousands of users easily

## Implementation

### 1. Minimal Auth Server (Vercel Function)

```typescript
// api/auth/github.ts - Single serverless function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query
  
  // Exchange code for token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code as string,
    }),
  })
  
  const { access_token } = await tokenResponse.json()
  
  // Redirect back to GitHub Pages app with token
  res.redirect(`https://yourusername.github.io/open-social/auth/callback?token=${access_token}`)
}
```

### 2. GitHub Pages App

```typescript
// Client-side auth handler
class HybridAuth {
  async login() {
    // Redirect to auth server
    window.location.href = `https://your-auth-server.vercel.app/api/auth/github?state=${generateState()}`
  }
  
  handleCallback() {
    // Extract token from URL after OAuth redirect
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    
    if (token) {
      this.storeToken(token)
      window.location.href = '/dashboard'
    }
  }
}
```

### 3. Repository-Specific Permissions

Users install your GitHub App on ONLY the `open-social-data` repository:

```javascript
// During OAuth, request specific repository access
const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&repository=${REPO_NAME}`
```

## Costs

- **GitHub Pages**: Free
- **Auth Server**: ~$0-5/month (Vercel free tier)
- **Total**: Nearly free, scales to thousands of users

## Security

- ✅ Repository-specific access only
- ✅ No broad permissions to all repos  
- ✅ Professional OAuth standard
- ✅ Server only handles auth, not data
- ✅ Tokens stored client-side only

## Deployment Steps

1. **Deploy auth server** to Vercel/Netlify
2. **Configure GitHub App** with callback to auth server
3. **Deploy static app** to GitHub Pages  
4. **Users get secure, repository-specific authentication**

This gives you the security of proper OAuth with repository-specific permissions, while keeping 99% of your app on free GitHub Pages hosting.
