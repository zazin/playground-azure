# Azure OAuth2 Playground

🚀 Interactive web application for testing Microsoft Graph APIs with OAuth2 authentication.

## Features

- **OAuth2 Authorization Code Flow** - Secure authentication with Microsoft Graph
- **Auto-Save Scope Management** - Automatically saves configuration changes
- **Microsoft Teams Integration** - Chat and Calendar API testing
- **Token Management** - Refresh, revoke, and manage access tokens
- **Interactive JSON Viewer** - Copy keys and values with one click
- **Persistent Storage** - Tokens and configuration survive server restarts
- **Real-time Development** - Auto-reload during development

## Quick Start

### Run with npx (Recommended)

```bash
npx playground-azure
```

### Custom Port

```bash
npx playground-azure --port=8080
```

### Help

```bash
npx playground-azure --help
```

## Usage

1. **Start the playground**
   ```bash
   npx playground-azure
   ```

2. **Open your browser** to `http://localhost:3000`

3. **Configure Azure AD App**
   - Enter your Client ID, Client Secret, and Tenant ID
   - Set redirect URI (default: `http://localhost:3000/api/auth/callback`)

4. **Add Scopes**
   - Use quick-add buttons for common Microsoft Graph scopes
   - Add custom scopes as needed
   - Configuration auto-saves when scopes are modified

5. **Generate Tokens**
   - Click "Generate Access Token" to start OAuth flow
   - Tokens are automatically saved and persist across restarts

6. **Test APIs**
   - Use pre-configured Microsoft Graph API endpoints
   - Test Teams Chat, Calendar, and other Graph APIs
   - Copy response data with built-in JSON viewer

## Supported APIs

### Microsoft Teams
- Get my chats
- Send chat messages
- Get chat messages

### Calendar
- Get my events
- Create calendar events
- Get events for current week

### User Profile
- Get user profile information
- Read user properties

## Development

### Local Development

```bash
git clone <repository-url>
cd playground-azure
npm install
npm run dev
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Development with auto-reload
- `npm run dev:nodemon` - Development with nodemon

## Configuration

The application stores configuration in local JSON files:

- `config.json` - Azure AD application settings and scopes
- `tokens.json` - Access tokens and metadata
- `usage.json` - Token usage history

## Requirements

- Node.js 18+ (for ES modules support)
- Azure AD application registration
- Microsoft Graph API permissions

## Azure AD Setup

1. **Register Application** in Azure Portal
   - Go to Azure Active Directory > App registrations
   - Create new registration

2. **Configure Authentication**
   - Add redirect URI: `http://localhost:3000/api/auth/callback`
   - Enable "Access tokens" and "ID tokens"

3. **API Permissions**
   - Add Microsoft Graph permissions based on your needs
   - Common scopes: `User.Read`, `Calendars.Read`, `Chat.Read`

4. **Client Secret**
   - Generate client secret in "Certificates & secrets"
   - Copy the secret value (not the ID)

## Security Notes

- All credentials are stored locally in your browser/filesystem
- No data is sent to external servers except Microsoft Graph
- Use HTTPS in production environments
- Regularly rotate client secrets

## License

MIT

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## Support

- Create issues on GitHub for bugs
- Check Microsoft Graph documentation for API details
- Review Azure AD documentation for authentication setup