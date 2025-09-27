# Security Policy

## 🔒 Security Overview

GitSocial implements comprehensive security measures to protect both the application and user data:

### **Application Security**
- **Repository Access Control**: Only authorized collaborators can modify the main GitSocial repository
- **Branch Protection**: Main branch requires review and status checks
- **Secure OAuth Scopes**: Minimal required permissions for user repository access
- **Webhook Verification**: All webhooks verified with cryptographic signatures

### **User Data Protection**
- **Repository Ownership**: Users maintain full ownership of their social-data repositories
- **Access Control**: Only the user and GitSocial app can write to user repositories
- **Encrypted Communication**: All API communications use HTTPS
- **Token Security**: Access tokens handled securely with proper scoping

## 🚨 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🛡️ Security Features

### **OAuth Security**
- **Minimal Scopes**: Only requests necessary permissions
  - `read:user` - Read user profile
  - `user:email` - Read user email
  - `public_repo` - Create and manage public repositories
  - `repo:status` - Read repository status
  - `read:org` - Read organization membership

### **Repository Security**
- **Branch Protection**: Prevents unauthorized direct pushes
- **Access Verification**: Validates user permissions before operations
- **Repository Validation**: Ensures users can only modify their own repositories
- **Rate Limiting**: Prevents abuse with configurable limits

### **Webhook Security**
- **Signature Verification**: All webhooks verified with HMAC-SHA256
- **Event Filtering**: Only processes authorized webhook events
- **Secure Endpoints**: Webhook endpoints protected against replay attacks

## 🔐 Access Control

### **Main Repository (`open-social`)**
**Who can modify:**
- Repository collaborators only
- Verified through GitHub API before any admin operations

**Protection measures:**
- Branch protection rules on main branch
- Required status checks
- Admin enforcement disabled for emergency access
- All changes logged and monitored

### **User Repositories (`username/social-data`)**
**Who can modify:**
- Repository owner (the user)
- GitSocial application (with user's explicit OAuth consent)

**Protection measures:**
- Branch protection with bypass allowances for repo owner
- Repository settings configured for security
- All modifications logged via webhooks

## 🚨 Reporting a Vulnerability

### **Reporting Process**

1. **Email**: Send details to [security@gitsocial.dev] (if available) or create a private GitHub issue
2. **Include**: 
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if available)

### **Response Timeline**

- **Initial Response**: Within 24 hours
- **Assessment**: Within 72 hours
- **Fix Development**: 1-7 days depending on severity
- **Public Disclosure**: After fix is deployed

### **Severity Levels**

**Critical**: Immediate action required
- Authentication bypass
- Arbitrary code execution
- Data breach potential

**High**: Fix within 24-48 hours  
- Unauthorized data access
- Privilege escalation
- Cross-site scripting (XSS)

**Medium**: Fix within 1 week
- Information disclosure
- Denial of service
- Input validation issues

**Low**: Fix in next release
- Minor configuration issues
- Non-security bugs with security implications

## 🛠️ Security Best Practices

### **For Users**
- **Review Permissions**: Understand what access GitSocial requests
- **Monitor Repositories**: Check your social-data repository for unexpected changes
- **Secure Authentication**: Use strong passwords and 2FA on GitHub
- **Regular Backups**: Keep backups of your social data

### **For Developers**
- **Code Review**: All changes require review from authorized collaborators
- **Dependency Updates**: Keep dependencies updated with security patches
- **Secure Coding**: Follow OWASP guidelines and security best practices
- **Testing**: Include security testing in development workflow

### **For Administrators**
- **Access Monitoring**: Regular review of repository collaborators
- **Webhook Management**: Secure webhook endpoints with proper authentication
- **Token Rotation**: Regular rotation of GitHub OAuth application credentials
- **Audit Logs**: Monitor all administrative actions

## 📋 Security Checklist

### **OAuth Application**
- [x] Minimal required scopes configured
- [x] Secure client secret storage
- [x] Token scope verification implemented
- [x] Rate limiting in place

### **Repository Security**
- [x] Branch protection rules configured
- [x] User repository access verification
- [x] Automated security checks
- [x] Webhook signature verification

### **API Security**
- [x] Authentication required for all operations
- [x] Authorization checks before data access
- [x] Input validation and sanitization
- [x] Secure error handling

### **Infrastructure Security**
- [x] HTTPS enforcement
- [x] Secure headers configuration
- [x] Dependency vulnerability scanning
- [x] Regular security updates

## 🔍 Security Monitoring

**Automated Monitoring:**
- GitHub Security Advisories
- Dependabot security updates  
- CodeQL security scanning
- Webhook event logging

**Manual Reviews:**
- Quarterly security assessments
- Collaborator access reviews
- OAuth scope audits
- Incident response testing

---

**For questions about this security policy, please contact the GitSocial maintainers.**
