import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Storage from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize storage
const storage = new Storage();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'oauth2-playground-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', join(dirname(__dirname), 'views'));

// Simple layout support
app.use((req, res, next) => {
  const originalRender = res.render.bind(res);
  res.render = function(view, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};
    options.viewName = view;
    originalRender('layout', options, callback);
  };
  next();
});

// Static files
app.use(express.static(join(dirname(__dirname), 'public')));

// Routes
app.get('/', async (req, res) => {
  try {
    const allTokens = await storage.getActiveTokens();
    // Only use the first (most recent) token for single token mode
    const tokens = allTokens.length > 0 ? [allTokens[0]] : [];
    const stats = await storage.getTokenStatistics();
    const config = await storage.getConfiguration();
    
    // Get original token response from session if available
    const originalTokenResponse = req.session.originalTokenResponse || null;
    // Clear it from session after retrieving
    if (req.session.originalTokenResponse) {
      delete req.session.originalTokenResponse;
    }
    
    res.render('index', { tokens, stats, config, originalTokenResponse });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.render('index', { tokens: [], stats: {}, config: {}, error: error.message, originalTokenResponse: null });
  }
});

// Redirect config page to main page since we're now single-page
app.get('/config', (req, res) => {
  res.redirect('/');
});

app.post('/api/config', async (req, res) => {
  try {
    const { clientId, clientSecret, tenantId, authority, redirectUri, scopes } = req.body;
    
    await storage.saveConfiguration({
      clientId,
      clientSecret,
      tenantId,
      authority,
      redirectUri,
      scopes
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/config', async (req, res) => {
  try {
    const config = await storage.getConfiguration();
    res.json({ success: true, config });
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Authorization Code Flow (User authentication)
app.get('/api/auth/login', async (req, res) => {
  try {
    const config = await storage.getConfiguration();
    
    if (!config.clientId || !config.clientSecret || !config.tenantId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Configuration required. Please configure Azure AD credentials first.' 
      });
    }

    const { ConfidentialClientApplication } = await import('@azure/msal-node');
    
    const msalConfig = {
      auth: {
        clientId: config.clientId,
        authority: config.authority || `https://login.microsoftonline.com/${config.tenantId}`,
        clientSecret: config.clientSecret,
      }
    };

    const clientApp = new ConfidentialClientApplication(msalConfig);
    const redirectUri = config.redirectUri || `http://localhost:${PORT}/api/auth/callback`;
    
    // Use configured scopes plus essential identity scopes
    // Include offline_access to get refresh token
    const baseIdentityScopes = ['https://graph.microsoft.com/User.Read', 'openid', 'profile', 'email', 'offline_access'];
    const additionalScopes = config.scopes.filter(scope => 
        !baseIdentityScopes.includes(scope) && 
        scope !== 'https://graph.microsoft.com/.default' &&
        scope !== 'offline_access'
    );
    const userScopes = [...baseIdentityScopes, ...additionalScopes];
    
    const authUrl = await clientApp.getAuthCodeUrl({
      scopes: userScopes,
      redirectUri: redirectUri,
      responseMode: 'query'
    });

    console.log('🔐 Redirecting to Azure AD login...');
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).send('Authorization code not received');
    }

    const config = await storage.getConfiguration();
    const { ConfidentialClientApplication } = await import('@azure/msal-node');
    
    const msalConfig = {
      auth: {
        clientId: config.clientId,
        authority: config.authority || `https://login.microsoftonline.com/${config.tenantId}`,
        clientSecret: config.clientSecret,
      }
    };

    const clientApp = new ConfidentialClientApplication(msalConfig);
    const redirectUri = config.redirectUri || `http://localhost:${PORT}/api/auth/callback`;
    
    console.log('🔄 Exchanging authorization code for token...');
    // Use same scope logic as login endpoint (including offline_access for refresh token)
    const baseIdentityScopes = ['https://graph.microsoft.com/User.Read', 'openid', 'profile', 'email', 'offline_access'];
    const additionalScopes = config.scopes.filter(scope => 
        !baseIdentityScopes.includes(scope) && 
        scope !== 'https://graph.microsoft.com/.default' &&
        scope !== 'offline_access'
    );
    const userScopes = [...baseIdentityScopes, ...additionalScopes];
    
    const response = await clientApp.acquireTokenByCode({
      code: code,
      scopes: userScopes,
      redirectUri: redirectUri
    });

    if (response) {
      // Save user token to storage
      const tokenInfo = {
        clientId: config.clientId,
        tenantId: config.tenantId,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || null,
        tokenType: response.tokenType || 'Bearer',
        expiresAt: response.expiresOn.toISOString(),
        scopes: response.scopes,
        flowType: 'authorization_code',
        userId: response.account?.homeAccountId || 'unknown'
      };
      
      const dbResult = await storage.saveToken(tokenInfo);
      
      // Store the original response for display
      req.session.originalTokenResponse = {
        access_token: response.accessToken,
        refresh_token: response.refreshToken || null,
        token_type: response.tokenType || 'Bearer',
        expires_in: Math.floor((response.expiresOn.getTime() - Date.now()) / 1000),
        expires_on: response.expiresOn.toISOString(),
        scope: response.scopes.join(' '),
        account: {
          homeAccountId: response.account?.homeAccountId,
          environment: response.account?.environment,
          tenantId: response.account?.tenantId,
          username: response.account?.username,
          localAccountId: response.account?.localAccountId,
          name: response.account?.name
        },
        flow_type: 'authorization_code',
        grant_type: 'authorization_code',
        client_id: config.clientId
      };
      
      console.log('✅ Successfully obtained user access token');
      
      // Redirect to home page with success message
      res.redirect('/?auth=success&show_response=true');
    }
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.redirect('/?auth=error&message=' + encodeURIComponent(error.message));
  }
});

app.post('/api/token/:id/test', async (req, res) => {
  try {
    const token = await storage.getTokenById(req.params.id);
    if (!token) {
      return res.status(404).json({ success: false, error: 'Token not found' });
    }
    
    const startTime = Date.now();
    
    // Test token with Microsoft Graph /me endpoint
    const axios = (await import('axios')).default;
    try {
      await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      // Log usage
      await storage.logTokenUsage({
        tokenId: token.id,
        endpoint: 'https://graph.microsoft.com/v1.0/me',
        method: 'GET',
        statusCode: 200,
        responseTime,
        errorMessage: null
      });
      
      // Update last used
      await storage.updateTokenLastUsed(token.id);
      
      console.log('✅ Token validation successful');
      res.json({ success: true, valid: true, responseTime });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const isValid = error.response?.status === 403; // Token valid but lacks permissions
      
      await storage.logTokenUsage({
        tokenId: token.id,
        endpoint: 'https://graph.microsoft.com/v1.0/me',
        method: 'GET',
        statusCode: error.response?.status || 500,
        responseTime,
        errorMessage: isValid ? null : 'Token validation failed'
      });
      
      if (isValid) {
        console.log('⚠️ Token is valid but lacks required permissions');
        res.json({ success: true, valid: true, responseTime, note: 'Valid but lacks Graph permissions' });
      } else {
        console.error('❌ Token is invalid or expired');
        res.json({ success: true, valid: false, responseTime });
      }
    }
  } catch (error) {
    console.error('Error testing token:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/token/:id/revoke', async (req, res) => {
  try {
    const result = await storage.updateTokenStatus(req.params.id, 'revoked');
    res.json({ success: true, changes: result.changes });
  } catch (error) {
    console.error('Error revoking token:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/token/:id/refresh', async (req, res) => {
  try {
    // Get the existing token from storage
    const existingToken = await storage.getTokenById(req.params.id);
    if (!existingToken) {
      return res.status(404).json({ success: false, error: 'Token not found' });
    }

    console.log('🔄 Attempting to refresh token for ID:', req.params.id);

    // Get current configuration
    const config = await storage.getConfiguration();
    if (!config.clientId || !config.clientSecret || !config.tenantId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Configuration missing. Please reconfigure Azure AD credentials.' 
      });
    }

    // Check if we have a refresh token
    if (!existingToken.refresh_token) {
      return res.status(400).json({ 
        success: false, 
        error: 'No refresh token available. Please re-authenticate to get a new refresh token.' 
      });
    }

    try {
      const { ConfidentialClientApplication } = await import('@azure/msal-node');
      
      const msalConfig = {
        auth: {
          clientId: config.clientId,
          authority: config.authority || `https://login.microsoftonline.com/${config.tenantId}`,
          clientSecret: config.clientSecret,
        }
      };

      const clientApp = new ConfidentialClientApplication(msalConfig);
      
      // Use refresh token to get new access token
      const refreshTokenRequest = {
        refreshToken: existingToken.refresh_token,
        scopes: existingToken.scopes || ['https://graph.microsoft.com/User.Read', 'openid', 'profile', 'email', 'offline_access'],
      };

      console.log('🔄 Using refresh token to get new access token...');
      const response = await clientApp.acquireTokenByRefreshToken(refreshTokenRequest);
      
      if (response) {
        // Update the token in storage with new values
        const updatedTokenInfo = {
          clientId: config.clientId,
          tenantId: config.tenantId,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || existingToken.refresh_token, // Keep existing if not provided
          tokenType: response.tokenType || 'Bearer',
          expiresAt: response.expiresOn.toISOString(),
          scopes: response.scopes || existingToken.scopes,
          flowType: 'refresh_token',
          userId: existingToken.user_id || response.account?.homeAccountId || 'unknown'
        };

        // Save as new token and mark old one as refreshed
        await storage.updateTokenStatus(req.params.id, 'refreshed');
        const newToken = await storage.saveToken(updatedTokenInfo);
        
        console.log('✅ Token refreshed successfully');
        res.json({ 
          success: true, 
          message: 'Token refreshed successfully',
          expires_at: response.expiresOn.toISOString()
        });
      }
    } catch (msalError) {
      console.error('❌ MSAL refresh error:', msalError);
      res.status(400).json({ 
        success: false, 
        error: 'Failed to refresh token. Please re-authenticate manually.',
        details: msalError.message 
      });
    }
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/token/:id/usage', async (req, res) => {
  try {
    const usage = await storage.getTokenUsageHistory(req.params.id);
    res.json({ success: true, usage });
  } catch (error) {
    console.error('Error fetching usage history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await storage.getTokenStatistics();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/test-request', async (req, res) => {
  try {
    const { method, url, headers, body, token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    
    const axios = (await import('axios')).default;
    const startTime = Date.now();
    
    // Prepare request configuration
    const config = {
      method: method.toLowerCase(),
      url: url,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    // Add body for POST/PUT/PATCH requests
    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && body) {
      config.data = body;
    }
    
    try {
      console.log(`Making ${method} request to ${url}`);
      const response = await axios(config);
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ Request successful: ${response.status}`);
      
      res.json({
        success: true,
        response: {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          responseTime: responseTime
        }
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error.response) {
        // Server responded with error status
        console.log(`⚠️ Request failed with status: ${error.response.status}`);
        
        res.json({
          success: true, // Request was made successfully, just got error response
          response: {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            data: error.response.data,
            responseTime: responseTime,
            error: true
          }
        });
      } else {
        // Network or other error
        console.error(`❌ Request error: ${error.message}`);
        
        res.status(500).json({
          success: false,
          error: error.message,
          responseTime: responseTime
        });
      }
    }
  } catch (error) {
    console.error('Error processing API test request:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 OAuth2 Web App running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`⚙️  Configuration: http://localhost:${PORT}/config`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

export default app;