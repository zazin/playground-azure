# NPM Publishing Setup

This document explains how to set up automated NPM publishing for the playground-azure package.

## Prerequisites

1. **NPM Account**: You need an NPM account at [npmjs.com](https://npmjs.com)
2. **Package Name**: Verify `playground-azure` is available on NPM
3. **GitHub Repository**: This repository should be public or have appropriate permissions

## Setup Steps

### 1. Create NPM Access Token

1. Login to [npmjs.com](https://npmjs.com)
2. Go to **Settings** → **Access Tokens**
3. Click **Generate New Token**
4. Choose **Automation** token type
5. Copy the token (starts with `npm_...`)

### 2. Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your NPM access token
6. Click **Add secret**

### 3. Verify Package Name

Check if `playground-azure` is available:

```bash
npm view playground-azure
```

If the package exists, you may need to:
- Choose a different name in `package.json`
- Request access if you own it
- Use scoped package like `@yourusername/playground-azure`

## Publishing Workflows

### Automatic Publishing (Recommended)

**Trigger**: Creating a GitHub release or pushing a version tag

1. Create a release on GitHub:
   - Go to **Releases** → **Create a new release**
   - Tag version: `v1.0.0` (or your version)
   - Release title: `Release v1.0.0`
   - Describe changes
   - Click **Publish release**

2. Or push a tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

### Manual Release Workflow

Use the **Release** workflow with manual trigger:

1. Go to **Actions** → **Release**
2. Click **Run workflow**
3. Choose version bump type: patch/minor/major
4. Optionally mark as pre-release
5. Click **Run workflow**

This will:
- Bump version in package.json
- Create git tag and commit
- Create GitHub release
- Trigger NPM publishing

## Workflow Features

### CI Workflow (`ci.yml`)
- Runs on every push/PR
- Tests on Node.js 18, 20, 21
- Validates CLI functionality
- Checks package structure
- Runs security audit

### Publish Workflow (`publish.yml`)
- Triggered by releases/tags
- Publishes to NPM with provenance
- Tests installation after publishing
- Verifies CLI works globally

### Release Workflow (`release.yml`)
- Manual workflow for version management
- Generates changelog from git history
- Creates GitHub release
- Triggers publishing pipeline

## Troubleshooting

### Publishing Fails

1. **NPM_TOKEN Invalid**: Regenerate token and update GitHub secret
2. **Package Name Taken**: Choose different name or use scoped package
3. **Permissions**: Ensure token has publish permissions

### CI Fails

1. **CLI Test**: Check `bin/cli.js` has execute permissions
2. **Dependencies**: Ensure all dependencies are in `package.json`
3. **Node Version**: Workflows test on 18, 20, 21

### First Time Publishing

For first publication, you might need to:

```bash
# Test locally first
npm pack --dry-run
npm publish --dry-run

# If everything looks good
npm publish --access public
```

## Security Notes

- Never commit NPM tokens to git
- Use automation tokens for CI/CD
- Regularly rotate access tokens
- Monitor package for unauthorized changes
- Enable 2FA on your NPM account

## Post-Publishing

After successful publish:

1. **Test Installation**: `npx playground-azure@latest`
2. **Update Documentation**: If version has breaking changes
3. **Monitor Downloads**: Check NPM analytics
4. **Community**: Respond to issues and PRs

## Package Info

- **Name**: `playground-azure`
- **Registry**: Public NPM registry
- **Install**: `npx playground-azure`
- **Repository**: GitHub.com/zazin/playground-azure