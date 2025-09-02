import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// In-memory storage for tokens and configuration
class Storage {
  constructor() {
    this.tokens = [];
    this.tokenUsage = [];
    
    // File paths
    this.configFile = path.join(dirname(__dirname), 'config.json');
    this.tokensFile = path.join(dirname(__dirname), 'tokens.json');
    this.usageFile = path.join(dirname(__dirname), 'usage.json');
    
    // Default configuration
    this.configuration = {
      clientId: '',
      clientSecret: '',
      tenantId: '',
      authority: '',
      redirectUri: '',
      scopes: ['https://graph.microsoft.com/.default']
    };
    
    // Load data from files
    this.loadConfiguration();
    this.loadTokens();
    this.loadUsage();
  }

  loadConfiguration() {
    try {
      if (fs.existsSync(this.configFile)) {
        const data = fs.readFileSync(this.configFile, 'utf8');
        const savedConfig = JSON.parse(data);
        
        // Handle migration from old defaultScopes string to scopes array
        let needsMigration = false;
        if (savedConfig.defaultScopes && !savedConfig.scopes) {
          savedConfig.scopes = [savedConfig.defaultScopes];
          delete savedConfig.defaultScopes;
          needsMigration = true;
          console.log('📦 Migrated defaultScopes to scopes array');
        }
        
        this.configuration = { ...this.configuration, ...savedConfig };
        console.log('✅ Configuration loaded from file');
        
        // Save the migrated configuration back to file
        if (needsMigration) {
          this.saveConfigurationToFile();
          console.log('✅ Configuration migration saved to file');
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not load configuration file:', error.message);
    }
  }

  saveConfigurationToFile() {
    try {
      const configData = JSON.stringify(this.configuration, null, 2);
      fs.writeFileSync(this.configFile, configData, 'utf8');
      console.log('✅ Configuration saved to file');
    } catch (error) {
      console.error('❌ Could not save configuration file:', error.message);
    }
  }

  loadTokens() {
    try {
      if (fs.existsSync(this.tokensFile)) {
        const data = fs.readFileSync(this.tokensFile, 'utf8');
        const savedData = JSON.parse(data);
        // Keep only the most recent token
        if (savedData.tokens && savedData.tokens.length > 0) {
          this.tokens = [savedData.tokens[savedData.tokens.length - 1]];
          this.tokens[0].id = 1; // Ensure ID is always 1
        } else {
          this.tokens = [];
        }
        console.log(`✅ Loaded ${this.tokens.length} token from file`);
      }
    } catch (error) {
      console.warn('⚠️ Could not load tokens file:', error.message);
    }
  }

  saveTokensToFile() {
    try {
      const tokensData = {
        tokens: this.tokens
      };
      fs.writeFileSync(this.tokensFile, JSON.stringify(tokensData, null, 2), 'utf8');
      console.log('✅ Tokens saved to file');
    } catch (error) {
      console.error('❌ Could not save tokens file:', error.message);
    }
  }

  loadUsage() {
    try {
      if (fs.existsSync(this.usageFile)) {
        const data = fs.readFileSync(this.usageFile, 'utf8');
        this.tokenUsage = JSON.parse(data);
        console.log(`✅ Loaded ${this.tokenUsage.length} usage records from file`);
      }
    } catch (error) {
      console.warn('⚠️ Could not load usage file:', error.message);
    }
  }

  saveUsageToFile() {
    try {
      fs.writeFileSync(this.usageFile, JSON.stringify(this.tokenUsage, null, 2), 'utf8');
      console.log('✅ Usage data saved to file');
    } catch (error) {
      console.error('❌ Could not save usage file:', error.message);
    }
  }

  // Configuration operations
  saveConfiguration(config) {
    console.log('💾 Saving configuration with data:', config);
    
    this.configuration = {
      clientId: config.clientId || '',
      clientSecret: config.clientSecret || '',
      tenantId: config.tenantId || '',
      authority: config.authority || (config.tenantId ? `https://login.microsoftonline.com/${config.tenantId}` : ''),
      redirectUri: config.redirectUri || '',
      scopes: config.scopes || ['https://graph.microsoft.com/.default']
    };
    
    console.log('💾 Final configuration to save:', this.configuration);
    
    // Save to file for persistence
    this.saveConfigurationToFile();
    
    return Promise.resolve({ success: true });
  }

  getConfiguration() {
    return Promise.resolve(this.configuration);
  }

  // Token operations
  saveToken(tokenData) {
    const token = {
      id: 1, // Always use ID 1 since we only keep one token
      client_id: tokenData.clientId,
      tenant_id: tokenData.tenantId,
      access_token: tokenData.accessToken,
      refresh_token: tokenData.refreshToken || null,
      token_type: tokenData.tokenType || 'Bearer',
      expires_at: tokenData.expiresAt,
      scopes: tokenData.scopes || [],
      flow_type: tokenData.flowType || 'client_credentials',
      user_id: tokenData.userId || null,
      created_at: new Date().toISOString(),
      last_used: null,
      status: 'active'
    };
    
    // Replace all tokens with the new one (keep only one token)
    this.tokens = [token];
    this.saveTokensToFile();
    return Promise.resolve({ id: token.id });
  }

  getActiveTokens() {
    const now = new Date();
    const activeTokens = this.tokens.filter(token => 
      token.status === 'active' && 
      new Date(token.expires_at) > now
    );
    return Promise.resolve(activeTokens);
  }

  getTokenById(id) {
    const token = this.tokens.find(t => t.id === parseInt(id));
    return Promise.resolve(token || null);
  }

  updateTokenStatus(id, status) {
    const token = this.tokens.find(t => t.id === parseInt(id));
    if (token) {
      token.status = status;
      this.saveTokensToFile();
      return Promise.resolve({ changes: 1 });
    }
    return Promise.resolve({ changes: 0 });
  }

  updateTokenLastUsed(id) {
    const token = this.tokens.find(t => t.id === parseInt(id));
    if (token) {
      token.last_used = new Date().toISOString();
      this.saveTokensToFile();
      return Promise.resolve({ changes: 1 });
    }
    return Promise.resolve({ changes: 0 });
  }

  updateToken(updatedToken) {
    const tokenIndex = this.tokens.findIndex(t => t.id === parseInt(updatedToken.id));
    if (tokenIndex !== -1) {
      // Update existing token
      this.tokens[tokenIndex] = { ...this.tokens[tokenIndex], ...updatedToken };
      this.saveTokensToFile();
      return Promise.resolve({ changes: 1 });
    }
    return Promise.resolve({ changes: 0 });
  }

  getToken(id) {
    const token = this.tokens.find(t => t.id === parseInt(id));
    return Promise.resolve(token || null);
  }

  // Token usage tracking
  logTokenUsage(usageData) {
    const usage = {
      id: this.tokenUsage.length + 1,
      token_id: usageData.tokenId,
      endpoint: usageData.endpoint,
      method: usageData.method,
      status_code: usageData.statusCode,
      response_time_ms: usageData.responseTime,
      error_message: usageData.errorMessage,
      created_at: new Date().toISOString()
    };
    
    this.tokenUsage.push(usage);
    this.saveUsageToFile();
    return Promise.resolve({ id: usage.id });
  }

  getTokenUsageHistory(tokenId) {
    const history = this.tokenUsage
      .filter(u => u.token_id === parseInt(tokenId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 100);
    return Promise.resolve(history);
  }

  // Statistics
  getTokenStatistics() {
    const now = new Date();
    const stats = {
      total_tokens: this.tokens.length,
      active_tokens: this.tokens.filter(t => t.status === 'active' && new Date(t.expires_at) > now).length,
      expired_tokens: this.tokens.filter(t => t.status === 'active' && new Date(t.expires_at) <= now).length,
      revoked_tokens: this.tokens.filter(t => t.status === 'revoked').length
    };
    return Promise.resolve(stats);
  }
}

export default Storage;