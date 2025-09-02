# Azure OAuth2 Playground

🚀 Interactive web application for testing Microsoft Graph APIs with OAuth2 authentication.

## Quick Start

Run instantly with npx:

```bash
npx playground-azure
```

Open `http://localhost:3000` in your browser and start testing Microsoft Graph APIs!

## Features

✨ **Auto-Save Configuration** - Changes save automatically as you work  
🔐 **OAuth2 Flow** - Secure Microsoft Graph authentication  
💬 **Teams Chat APIs** - Send messages, read chats  
📅 **Calendar APIs** - Manage events and schedules  
🔄 **Token Management** - Auto-refresh, revoke, persistent storage  
📋 **JSON Viewer** - Copy API responses with one click  
⚡ **Instant Setup** - No installation required with npx  

## Usage

### 1. Start the Playground
```bash
# Default port 3000
npx playground-azure

# Custom port
npx playground-azure --port=8080

# Show help
npx playground-azure --help
```

### 2. Configure Azure AD
1. Open `http://localhost:3000` in your browser
2. Go to **Configuration** tab
3. Enter your Azure AD app credentials:
   - **Client ID** - From your Azure app registration
   - **Tenant ID** - Your organization's directory ID  
   - **Client Secret** - Generated secret value
4. Configuration saves automatically ✅

### 3. Select API Scopes
- Click quick-add buttons for common scopes
- Add custom Microsoft Graph scopes
- All changes auto-save instantly

### 4. Generate Access Token
1. Click **"Generate Access Token"**
2. Sign in with your Microsoft account
3. Token saves automatically for reuse

### 5. Test APIs
- Try pre-built Microsoft Graph endpoints
- View formatted JSON responses
- Copy specific values with built-in buttons
- Test Teams, Calendar, and Profile APIs

## Available APIs

### 👤 User Profile
- Get user information
- Read profile properties

### 💬 Microsoft Teams Chat
- List your chats
- Send chat messages
- Read chat history

### 📅 Calendar
- Get upcoming events
- Create new meetings
- Schedule with attendees

## Azure AD Setup

Need an Azure AD app? Here's the quick setup:

1. **Azure Portal** → Azure Active Directory → App registrations → New
2. **Authentication** → Add redirect URI: `http://localhost:3000/api/auth/callback`
3. **API Permissions** → Microsoft Graph → Add permissions you need
4. **Certificates & secrets** → New client secret → Copy the value

Common permissions to add:
- `User.Read` - Basic profile
- `Calendars.Read` - View calendar
- `Chat.Read` - Read Teams chats

## Command Options

```bash
# Run on default port 3000
npx playground-azure

# Run on custom port
npx playground-azure --port=8080

# Show help and features
npx playground-azure --help
```

## Why Use This?

🔥 **Instant Testing** - No setup, just run and test Microsoft Graph APIs  
🛡️ **Secure** - All data stays local, nothing sent to third parties  
💾 **Persistent** - Tokens and config survive restarts  
🎯 **Focused** - Built specifically for Microsoft Graph API testing  
📱 **Teams Ready** - Perfect for Teams app development  

## Requirements

- Node.js 18+ (automatically handled by npx)
- Azure AD application registration
- Microsoft Graph API permissions

---

Ready to test Microsoft Graph APIs? Just run:

```bash
npx playground-azure
```