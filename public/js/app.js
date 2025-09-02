// Microsoft Graph API services for user authentication (Authorization Code flow)
const API_SERVICES = [
    // User Profile Endpoints
    {
        name: 'Get My Profile',
        category: 'Profile',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me',
        headers: {},
        body: null,
        description: 'Get your profile information (name, email, etc.)'
    },
    {
        name: 'Get My Photo',
        category: 'Profile',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/photo/$value',
        headers: {},
        body: null,
        description: 'Get your profile photo'
    },
    {
        name: 'Update My Profile',
        category: 'Profile',
        method: 'PATCH',
        url: 'https://graph.microsoft.com/v1.0/me',
        headers: {},
        body: {
            displayName: "Updated Name",
            jobTitle: "Software Developer"
        },
        description: 'Update your profile information'
    },
    
    // Calendar Endpoints
    {
        name: 'Get My Calendar',
        category: 'Calendar',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/calendar',
        headers: {},
        body: null,
        description: 'Get your primary calendar information'
    },
    {
        name: 'Get My Events',
        category: 'Calendar',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/events?$top=10&$orderby=start/dateTime',
        headers: {},
        body: null,
        description: 'Get your next 10 calendar events'
    },
    {
        name: 'Get Events This Week',
        category: 'Calendar',
        method: 'GET',
        url: (() => {
            const startOfWeek = new Date();
            const endOfWeek = new Date();
            const day = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - day;
            startOfWeek.setDate(diff);
            startOfWeek.setHours(0, 0, 0, 0);
            endOfWeek.setDate(diff + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            return `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${startOfWeek.toISOString()}&endDateTime=${endOfWeek.toISOString()}`;
        })(),
        headers: {},
        body: null,
        description: 'Get all events for this week (Sunday to Saturday)'
    },
    {
        name: 'Get Events Today',
        category: 'Calendar',
        method: 'GET',
        url: (() => {
            const today = new Date();
            const tomorrow = new Date();
            today.setHours(0, 0, 0, 0);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            return `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${today.toISOString()}&endDateTime=${tomorrow.toISOString()}`;
        })(),
        headers: {},
        body: null,
        description: 'Get all events for today'
    },
    {
        name: 'Get Events Next 7 Days',
        category: 'Calendar',
        method: 'GET',
        url: (() => {
            const now = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            return `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${now.toISOString()}&endDateTime=${nextWeek.toISOString()}&$orderby=start/dateTime`;
        })(),
        headers: {},
        body: null,
        description: 'Get events for the next 7 days from now'
    },
    {
        name: 'Get Events This Month',
        category: 'Calendar',
        method: 'GET',
        url: (() => {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            return `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${firstDay.toISOString()}&endDateTime=${lastDay.toISOString()}&$orderby=start/dateTime`;
        })(),
        headers: {},
        body: null,
        description: 'Get all events for the current month'
    },
    {
        name: 'Get Upcoming Events (Next 30 Days)',
        category: 'Calendar',
        method: 'GET',
        url: (() => {
            const now = new Date();
            const thirtyDaysLater = new Date();
            thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
            return `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${now.toISOString()}&endDateTime=${thirtyDaysLater.toISOString()}&$orderby=start/dateTime&$top=50`;
        })(),
        headers: {},
        body: null,
        description: 'Get events for the next 30 days (max 50)'
    },
    {
        name: 'Get Events with Specific Subject',
        category: 'Calendar',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/events?$filter=contains(subject, \'meeting\')&$orderby=start/dateTime&$top=20',
        headers: {},
        body: null,
        description: 'Get events with "meeting" in the subject'
    },
    {
        name: 'Get All Day Events',
        category: 'Calendar',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/events?$filter=isAllDay eq true&$orderby=start/dateTime&$top=20',
        headers: {},
        body: null,
        description: 'Get all-day events only'
    },
    {
        name: 'Get Events with Attendees',
        category: 'Calendar',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/events?$select=subject,start,end,attendees,organizer&$orderby=start/dateTime&$top=10',
        headers: {},
        body: null,
        description: 'Get events with attendee information'
    },
    {
        name: 'Create Calendar Event',
        category: 'Calendar',
        method: 'POST',
        url: 'https://graph.microsoft.com/v1.0/me/events',
        headers: {},
        body: {
            subject: "Test Online Meeting - Teams",
            start: {
                dateTime: (() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(9, 0, 0, 0); // 9:00 AM
                    // Format as YYYY-MM-DDTHH:mm:ss without timezone suffix
                    return tomorrow.getFullYear() + '-' + 
                           String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(tomorrow.getDate()).padStart(2, '0') + 'T' +
                           String(tomorrow.getHours()).padStart(2, '0') + ':' +
                           String(tomorrow.getMinutes()).padStart(2, '0') + ':' +
                           String(tomorrow.getSeconds()).padStart(2, '0');
                })(),
                timeZone: "Asia/Jakarta"
            },
            end: {
                dateTime: (() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(10, 0, 0, 0); // 10:00 AM (1 hour after start)
                    // Format as YYYY-MM-DDTHH:mm:ss without timezone suffix
                    return tomorrow.getFullYear() + '-' + 
                           String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(tomorrow.getDate()).padStart(2, '0') + 'T' +
                           String(tomorrow.getHours()).padStart(2, '0') + ':' +
                           String(tomorrow.getMinutes()).padStart(2, '0') + ':' +
                           String(tomorrow.getSeconds()).padStart(2, '0');
                })(),
                timeZone: "Asia/Jakarta"
            },
            body: {
                contentType: "HTML",
                content: "<p>This is a test meeting created via Microsoft Graph API</p>"
            },
            location: {
                displayName: "Microsoft Teams Meeting"
            },
            isOnlineMeeting: true,
            onlineMeetingProvider: "teamsForBusiness",
            attendees: [
                {
                    emailAddress: {
                        address: "Yuki.Fachriansyah@salt.co.id",
                        name: "Yuki Fachriansyah"
                    },
                    type: "required"
                },
                {
                    emailAddress: {
                        address: "arfan.azhari@salt.co.id",
                        name: "Arfan Azhari"
                    },
                    type: "optional"
                }
            ]
        },
        description: 'Create a Teams online meeting (tomorrow 9-10 AM Jakarta time)'
    },
    
    // Microsoft Teams Endpoints
    {
        name: 'Get My Teams',
        category: 'Teams',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/joinedTeams',
        headers: {},
        body: null,
        description: 'Get teams you are a member of'
    },
    {
        name: 'Get Team Details',
        category: 'Teams',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/teams/{team-id}',
        headers: {},
        body: null,
        description: 'Get details of a specific team (replace {team-id})'
    },
    {
        name: 'Get Team Channels',
        category: 'Teams',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/teams/{team-id}/channels',
        headers: {},
        body: null,
        description: 'Get channels in a team (replace {team-id})'
    },
    {
        name: 'Get Channel Messages',
        category: 'Teams',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/teams/{team-id}/channels/{channel-id}/messages?$top=10',
        headers: {},
        body: null,
        description: 'Get messages from a team channel'
    },
    {
        name: 'Send Channel Message',
        category: 'Teams',
        method: 'POST',
        url: 'https://graph.microsoft.com/v1.0/teams/{team-id}/channels/{channel-id}/messages',
        headers: {},
        body: {
            body: {
                contentType: "text",
                content: "Hello from Microsoft Graph API!"
            }
        },
        description: 'Send a message to a team channel'
    },
    
    // Chat Endpoints
    {
        name: 'Get My Chats',
        category: 'Chat',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/chats?$top=20&$expand=members',
        headers: {},
        body: null,
        description: 'Get your recent chats with members expanded'
    },
    {
        name: 'Get My Chats (Basic)',
        category: 'Chat',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/chats?$top=50&$select=id,topic,chatType,createdDateTime,lastUpdatedDateTime',
        headers: {},
        body: null,
        description: 'Get chats with basic info only (faster)'
    },
    {
        name: 'Get Group Chats Only',
        category: 'Chat',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/chats?$filter=chatType eq \'group\'&$top=20',
        headers: {},
        body: null,
        description: 'Get only group chats (excludes 1-on-1 chats)'
    },
    {
        name: 'Get OneOnOne Chats Only',
        category: 'Chat',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/chats?$filter=chatType eq \'oneOnOne\'&$top=20',
        headers: {},
        body: null,
        description: 'Get only 1-on-1 chats (excludes group chats)'
    },
    {
        name: 'Get Recent Active Chats',
        category: 'Chat',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/chats?$top=20',
        headers: {},
        body: null,
        description: 'Get your recent chats (limited to 20)'
    },
    {
        name: 'Get Chat Messages',
        category: 'Chat',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/chats/{chat-id}/messages?$top=10',
        headers: {},
        body: null,
        description: 'Get messages from a specific chat'
    },
    {
        name: 'Send Chat Message',
        category: 'Chat',
        method: 'POST',
        url: 'https://graph.microsoft.com/v1.0/me/chats/{chat-id}/messages',
        headers: {},
        body: {
            body: {
                contentType: "text",
                content: "Hello from Graph API!"
            }
        },
        description: 'Send a message to a chat'
    }
];

// Common Microsoft Graph scopes for Client Credentials Flow
const COMMON_SCOPES = [
    // Microsoft Graph - Basic (Application Permissions)
    { value: 'https://graph.microsoft.com/.default', label: 'Microsoft Graph Default - All configured permissions', category: 'Basic' },
    
    // Note: For client credentials flow, we typically use .default scope
    // Individual scopes are configured in Azure AD portal under "API Permissions"
    // The .default scope grants all permissions that have been consented for the application
];

let selectedScopes = [];

// Scope management functions
function initializeScopeSelector() {
    const scopeDropdown = document.querySelector('.scope-dropdown');
    const scopesSearch = document.getElementById('scopesSearch');
    
    if (!scopeDropdown || !scopesSearch) return;
    
    // Load default scope for client credentials
    selectedScopes = ['https://graph.microsoft.com/.default'];
    updateSelectedScopesDisplay();
    
    // Populate dropdown
    populateScopeDropdown();
    
    // Search functionality
    scopesSearch.addEventListener('input', filterScopes);
    
    // Keep dropdown open when clicking inside
    scopeDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function populateScopeDropdown() {
    const dropdown = document.querySelector('.scope-dropdown');
    if (!dropdown) return;
    
    // Group scopes by category
    const categories = {};
    COMMON_SCOPES.forEach(scope => {
        if (!categories[scope.category]) {
            categories[scope.category] = [];
        }
        categories[scope.category].push(scope);
    });
    
    let html = '';
    Object.keys(categories).forEach(category => {
        html += `<li><h6 class="dropdown-header">${category}</h6></li>`;
        categories[category].forEach(scope => {
            const isSelected = selectedScopes.includes(scope.value);
            html += `
                <li>
                    <div class="dropdown-item-text">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="${scope.value}" 
                                   id="scope-${scope.value.replace(/[^a-zA-Z0-9]/g, '')}"
                                   ${isSelected ? 'checked' : ''}
                                   onchange="toggleScope('${scope.value}')">
                            <label class="form-check-label" for="scope-${scope.value.replace(/[^a-zA-Z0-9]/g, '')}">
                                <small><strong>${scope.label.split(' - ')[0]}</strong></small><br>
                                <small class="text-muted">${scope.label.split(' - ')[1] || ''}</small>
                            </label>
                        </div>
                    </div>
                </li>
            `;
        });
        html += '<li><hr class="dropdown-divider"></li>';
    });
    
    // Add custom scope option
    html += `
        <li><h6 class="dropdown-header">Custom</h6></li>
        <li>
            <div class="dropdown-item-text">
                <div class="input-group input-group-sm">
                    <input type="text" class="form-control" id="customScope" placeholder="Enter custom scope">
                    <button class="btn btn-outline-primary" type="button" onclick="addCustomScope()">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
            </div>
        </li>
    `;
    
    dropdown.innerHTML = html;
}

function filterScopes() {
    const search = document.getElementById('scopesSearch').value.toLowerCase();
    const dropdown = document.querySelector('.scope-dropdown');
    const items = dropdown.querySelectorAll('li');
    
    items.forEach(item => {
        const label = item.querySelector('.form-check-label');
        if (label) {
            const text = label.textContent.toLowerCase();
            item.style.display = text.includes(search) ? 'block' : 'none';
        }
    });
}

function toggleScope(scopeValue) {
    const index = selectedScopes.indexOf(scopeValue);
    if (index > -1) {
        selectedScopes.splice(index, 1);
    } else {
        selectedScopes.push(scopeValue);
    }
    updateSelectedScopesDisplay();
}

function addCustomScope() {
    const input = document.getElementById('customScope');
    const scope = input.value.trim();
    
    if (scope && !selectedScopes.includes(scope)) {
        selectedScopes.push(scope);
        updateSelectedScopesDisplay();
        input.value = '';
        
        // Add to dropdown
        populateScopeDropdown();
    }
}

function removeScope(scopeValue) {
    const index = selectedScopes.indexOf(scopeValue);
    if (index > -1) {
        selectedScopes.splice(index, 1);
        updateSelectedScopesDisplay();
        
        // Update checkbox
        const checkbox = document.querySelector(`input[value="${scopeValue}"]`);
        if (checkbox) checkbox.checked = false;
    }
}

function updateSelectedScopesDisplay() {
    const container = document.getElementById('selectedScopes');
    if (!container) return;
    
    if (selectedScopes.length === 0) {
        container.innerHTML = '<small class="text-muted">No scopes selected</small>';
        return;
    }
    
    const scopeTagsHtml = selectedScopes.map(scope => `
        <span class="badge bg-primary me-1 mb-1">
            ${scope}
            <button type="button" class="btn-close btn-close-white" 
                    style="font-size: 0.7em;" onclick="removeScope('${scope}')"></button>
        </span>
    `).join('');
    
    container.innerHTML = scopeTagsHtml;
}

// Token Management Functions

async function testToken(tokenId) {
    try {
        const response = await axios.post(`/api/token/${tokenId}/test`);
        
        if (response.data.success) {
            const alertClass = response.data.valid ? 'success' : 'warning';
            let message = response.data.valid 
                ? `✅ Token is valid (${response.data.responseTime}ms)` 
                : '⚠️ Token is invalid or expired';
            
            if (response.data.note) {
                message += ` - ${response.data.note}`;
            }
            
            showToast(message, alertClass);
        }
    } catch (error) {
        showToast('❌ Error testing token: ' + error.message, 'danger');
    }
}

async function revokeToken(tokenId) {
    if (!confirm('Are you sure you want to revoke this token?')) {
        return;
    }
    
    // Show loading state
    const revokeBtn = event.target.closest('button');
    const originalText = revokeBtn.innerHTML;
    revokeBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Revoking...';
    revokeBtn.disabled = true;
    
    try {
        const response = await axios.post(`/api/token/${tokenId}/revoke`);
        console.log('Revoke response:', response.data);
        
        if (response.data.success) {
            showToast('✅ Token revoked successfully', 'success');
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast('❌ Failed to revoke token: ' + (response.data.error || 'Unknown error'), 'danger');
            revokeBtn.innerHTML = originalText;
            revokeBtn.disabled = false;
        }
    } catch (error) {
        console.error('Revoke token error:', error);
        showToast('❌ Error revoking token: ' + (error.response?.data?.error || error.message), 'danger');
        revokeBtn.innerHTML = originalText;
        revokeBtn.disabled = false;
    }
}

async function refreshToken(tokenId) {
    if (!confirm('Are you sure you want to refresh this token? This will generate a new access token.')) {
        return;
    }
    
    // Show loading state
    const refreshBtn = event.target.closest('button');
    const originalText = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Refreshing...';
    refreshBtn.disabled = true;
    
    try {
        const response = await axios.post(`/api/token/${tokenId}/refresh`);
        
        if (response.data.success) {
            showToast('✅ Token refreshed successfully', 'success');
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast('❌ Failed to refresh token: ' + (response.data.error || 'Unknown error'), 'danger');
        }
    } catch (error) {
        showToast('❌ Error refreshing token: ' + error.message, 'danger');
    } finally {
        // Restore button state
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
    }
}

async function viewUsage(tokenId) {
    const modal = new bootstrap.Modal(document.getElementById('usageModal'));
    const modalBody = document.getElementById('usageModalBody');
    
    modalBody.innerHTML = '<div class="spinner-border text-primary" role="status"></div> Loading...';
    modal.show();
    
    try {
        const response = await axios.get(`/api/token/${tokenId}/usage`);
        
        if (response.data.success && response.data.usage.length > 0) {
            const tableHtml = `
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Endpoint</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Response Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${response.data.usage.map(u => `
                            <tr>
                                <td>${new Date(u.created_at).toLocaleString()}</td>
                                <td>${u.endpoint}</td>
                                <td>${u.method}</td>
                                <td>
                                    <span class="badge bg-${u.status_code === 200 ? 'success' : 'danger'}">
                                        ${u.status_code}
                                    </span>
                                </td>
                                <td>${u.response_time_ms}ms</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            modalBody.innerHTML = tableHtml;
        } else {
            modalBody.innerHTML = '<p class="text-muted">No usage history available for this token.</p>';
        }
    } catch (error) {
        modalBody.innerHTML = `<div class="alert alert-danger">Error loading usage: ${error.message}</div>`;
    }
}

function copyToken(token) {
    navigator.clipboard.writeText(token).then(() => {
        showToast('✅ Token copied to clipboard', 'success');
    }).catch(err => {
        showToast('❌ Failed to copy token', 'danger');
    });
}

// Scopes Management Functions
let currentScopes = [];

function loadScopes(scopes) {
    console.log('📦 loadScopes called with:', scopes);
    currentScopes = scopes || ['https://graph.microsoft.com/.default'];
    console.log('📦 currentScopes set to:', currentScopes);
    renderScopes();
}

function renderScopes() {
    console.log('🎨 renderScopes called, currentScopes:', currentScopes);
    const scopesList = document.getElementById('scopesList');
    console.log('🎨 scopesList element:', scopesList);
    if (!scopesList) return;
    
    if (currentScopes.length === 0) {
        scopesList.innerHTML = '<p class="text-muted">No scopes configured. Add at least one scope.</p>';
        return;
    }
    
    const scopesHtml = currentScopes.map((scope, index) => `
        <div class="d-flex align-items-center mb-2">
            <span class="badge bg-primary me-2 flex-grow-1" style="text-align: left;">
                ${scope}
            </span>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeScope(${index})">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `).join('');
    
    scopesList.innerHTML = scopesHtml;
}

async function addScope() {
    const input = document.getElementById('newScopeInput');
    const scope = input.value.trim();
    
    if (!scope) {
        showToast('❌ Please enter a scope', 'danger');
        return;
    }
    
    if (currentScopes.includes(scope)) {
        showToast('⚠️ Scope already exists', 'warning');
        return;
    }
    
    currentScopes.push(scope);
    input.value = '';
    renderScopes();
    
    // Auto-save configuration
    const saveSuccess = await autoSaveConfiguration();
    if (saveSuccess) {
        showToast('✅ Scope added and auto-saved', 'success');
    } else {
        showToast('✅ Scope added (auto-save failed)', 'warning');
    }
}

async function addQuickScope(scope) {
    if (currentScopes.includes(scope)) {
        showToast('⚠️ Scope already exists', 'warning');
        return;
    }
    
    currentScopes.push(scope);
    renderScopes();
    
    // Auto-save configuration
    const saveSuccess = await autoSaveConfiguration();
    if (saveSuccess) {
        showToast('✅ Scope added and auto-saved', 'success');
    } else {
        showToast('✅ Scope added (auto-save failed)', 'warning');
    }
}

async function removeScope(index) {
    if (index >= 0 && index < currentScopes.length) {
        const removedScope = currentScopes.splice(index, 1)[0];
        renderScopes();
        
        // Auto-save configuration
        const saveSuccess = await autoSaveConfiguration();
        if (saveSuccess) {
            showToast(`✅ Removed scope: ${removedScope} (auto-saved)`, 'success');
        } else {
            showToast(`✅ Removed scope: ${removedScope} (auto-save failed)`, 'warning');
        }
    }
}

async function loadConfigurationScopes() {
    try {
        console.log('🔄 Loading configuration scopes...');
        const response = await axios.get('/api/config');
        console.log('📡 API response:', response.data);
        if (response.data.success && response.data.config) {
            console.log('📝 Loading scopes:', response.data.config.scopes);
            loadScopes(response.data.config.scopes);
        }
    } catch (error) {
        console.warn('Could not load configuration scopes:', error.message);
        loadScopes(); // Load default scopes
    }
}

// Auto-save helper function for scope changes
async function autoSaveConfiguration() {
    console.log('🔄 Auto-saving configuration with scopes:', currentScopes);
    
    // Ensure we have at least one scope
    const scopesToSave = currentScopes.length > 0 ? currentScopes : ['https://graph.microsoft.com/.default'];
    
    const form = document.getElementById('configForm');
    const data = {
        clientId: form.clientId.value,
        clientSecret: form.clientSecret.value,
        tenantId: form.tenantId.value,
        authority: form.authority.value,
        redirectUri: form.redirectUri.value,
        scopes: scopesToSave
    };
    
    try {
        const response = await axios.post('/api/config', data);
        
        if (response.data.success) {
            console.log('✅ Configuration auto-saved successfully');
            return true;
        }
    } catch (error) {
        console.error('❌ Error auto-saving configuration:', error.message);
        showToast('⚠️ Auto-save failed: ' + error.message, 'warning');
        return false;
    }
}

// Configuration Management Functions
async function saveConfiguration(event) {
    event.preventDefault();
    
    console.log('💾 Frontend save - currentScopes:', currentScopes);
    
    // Ensure we have at least one scope
    const scopesToSave = currentScopes.length > 0 ? currentScopes : ['https://graph.microsoft.com/.default'];
    console.log('💾 Frontend save - scopesToSave:', scopesToSave);
    
    const form = document.getElementById('configForm');
    const data = {
        clientId: form.clientId.value,
        clientSecret: form.clientSecret.value,
        tenantId: form.tenantId.value,
        authority: form.authority.value,
        redirectUri: form.redirectUri.value,
        scopes: scopesToSave
    };
    
    console.log('💾 Frontend save - sending data:', data);
    
    try {
        const response = await axios.post('/api/config', data);
        
        if (response.data.success) {
            showToast('✅ Configuration saved successfully', 'success');
            setTimeout(() => location.reload(), 1000);
        }
    } catch (error) {
        showToast('❌ Error saving configuration: ' + error.message, 'danger');
    }
}

async function testConfiguration() {
    const form = document.getElementById('configForm');
    const resultDiv = document.getElementById('configResult');
    
    if (!form.clientId.value || !form.clientSecret.value || !form.tenantId.value) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please fill in all required fields before testing.</div>';
        return;
    }
    
    // Ensure we have at least one scope for testing
    const scopesToSave = currentScopes.length > 0 ? currentScopes : ['https://graph.microsoft.com/.default'];
    
    resultDiv.innerHTML = '<div class="spinner-border text-primary" role="status"></div> Testing configuration...';
    
    try {
        // Save config first
        await axios.post('/api/config', {
            clientId: form.clientId.value,
            clientSecret: form.clientSecret.value,
            tenantId: form.tenantId.value,
            authority: form.authority.value,
            scopes: scopesToSave
        });
        
        // Test by getting a token
        const response = await axios.post('/api/auth/token', {
            scopes: 'https://graph.microsoft.com/.default'
        });
        
        if (response.data.success) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <h6>✅ Configuration test successful!</h6>
                    <p>Successfully obtained access token with your credentials.</p>
                </div>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <h6>❌ Configuration test failed</h6>
                <p>${error.response?.data?.error || error.message}</p>
            </div>
        `;
    }
}

// Utility Functions
function showToast(message, type = 'info') {
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
    }
    
    container.insertAdjacentHTML('beforeend', toastHtml);
    const toast = new bootstrap.Toast(container.lastElementChild);
    toast.show();
    
    setTimeout(() => {
        container.lastElementChild.remove();
    }, 5000);
}

// API Testing Functions
function initializeApiTesting() {
    const apiServiceSelect = document.getElementById('apiService');
    if (!apiServiceSelect) return;
    
    // Group APIs by category
    const categories = {};
    API_SERVICES.forEach(service => {
        if (!categories[service.category]) {
            categories[service.category] = [];
        }
        categories[service.category].push(service);
    });
    
    // Populate dropdown
    let html = '<option value="">Select a predefined API...</option>';
    Object.keys(categories).forEach(category => {
        html += `<optgroup label="${category}">`;
        categories[category].forEach((service, index) => {
            const serviceIndex = API_SERVICES.indexOf(service);
            html += `<option value="${serviceIndex}">${service.name}</option>`;
        });
        html += '</optgroup>';
    });
    
    apiServiceSelect.innerHTML = html;
}

function loadApiService() {
    const select = document.getElementById('apiService');
    const serviceIndex = parseInt(select.value);
    
    if (isNaN(serviceIndex) || serviceIndex < 0 || serviceIndex >= API_SERVICES.length) {
        return;
    }
    
    const service = API_SERVICES[serviceIndex];
    
    // Fill form fields
    document.getElementById('apiMethod').value = service.method;
    document.getElementById('apiUrl').value = service.url;
    
    // Fill headers (excluding Authorization and Content-Type which are handled automatically)
    const additionalHeaders = { ...service.headers };
    delete additionalHeaders['Authorization'];
    delete additionalHeaders['Content-Type'];
    
    document.getElementById('apiHeaders').value = Object.keys(additionalHeaders).length > 0 
        ? JSON.stringify(additionalHeaders, null, 2) 
        : '';
    
    // Fill body
    document.getElementById('apiBody').value = service.body 
        ? (typeof service.body === 'string' ? service.body : JSON.stringify(service.body, null, 2))
        : '';
    
    // Check for URL parameters and create input fields
    createParameterInputs(service.url);
    
    showToast(`✅ Loaded: ${service.name}`, 'info');
}

// Parameter management functions
function createParameterInputs(url) {
    const parametersSection = document.getElementById('urlParametersSection');
    const parametersList = document.getElementById('parametersList');
    
    // Find parameters in URL (pattern: {param-name})
    const parameterRegex = /\{([^}]+)\}/g;
    const parameters = [];
    let match;
    
    while ((match = parameterRegex.exec(url)) !== null) {
        parameters.push(match[1]);
    }
    
    // Clear existing parameters
    parametersList.innerHTML = '';
    
    if (parameters.length > 0) {
        // Show parameters section
        parametersSection.style.display = 'block';
        
        // Create input fields for each parameter
        parameters.forEach(param => {
            const paramHtml = `
                <div class="mb-2">
                    <label class="form-label text-primary">
                        <strong>{${param}}</strong>
                    </label>
                    <input type="text" class="form-control parameter-input" 
                           data-param="${param}" 
                           placeholder="Enter ${param} value"
                           title="Parameter for ${param}">
                    <div class="form-text">
                        Replace <code>{${param}}</code> in the URL with this value
                    </div>
                </div>
            `;
            parametersList.insertAdjacentHTML('beforeend', paramHtml);
        });
    } else {
        // Hide parameters section
        parametersSection.style.display = 'none';
    }
}

function applyParameters() {
    const urlInput = document.getElementById('apiUrl');
    const parameterInputs = document.querySelectorAll('.parameter-input');
    let url = urlInput.value;
    
    parameterInputs.forEach(input => {
        const paramName = input.dataset.param;
        const paramValue = input.value.trim();
        
        if (paramValue) {
            // Replace {param-name} with the actual value
            url = url.replace(`{${paramName}}`, encodeURIComponent(paramValue));
        }
    });
    
    // Update the URL input
    urlInput.value = url;
    
    showToast('✅ Parameters applied to URL', 'success');
}

async function sendApiRequest(event) {
    event.preventDefault();
    
    const form = document.getElementById('apiTestForm');
    const resultDiv = document.getElementById('apiResult');
    
    // Get form values
    const method = form.apiMethod.value;
    const url = form.apiUrl.value;
    const token = form.apiToken.value;
    const headersText = form.apiHeaders.value.trim();
    const bodyText = form.apiBody.value.trim();
    
    if (!token) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please select a token.</div>';
        return;
    }
    
    if (!url) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please enter an API URL.</div>';
        return;
    }
    
    // Parse headers
    let headers = {};
    if (headersText) {
        try {
            headers = JSON.parse(headersText);
        } catch (e) {
            resultDiv.innerHTML = '<div class="alert alert-danger">Invalid JSON in headers field.</div>';
            return;
        }
    }
    
    // Parse body
    let body = null;
    if (bodyText && ['POST', 'PUT', 'PATCH'].includes(method)) {
        if (bodyText.startsWith('{') || bodyText.startsWith('[')) {
            try {
                body = JSON.parse(bodyText);
            } catch (e) {
                resultDiv.innerHTML = '<div class="alert alert-danger">Invalid JSON in request body.</div>';
                return;
            }
        } else {
            body = bodyText; // Plain text body
        }
    }
    
    resultDiv.innerHTML = '<div class="spinner-border text-primary" role="status"></div> Sending request...';
    
    try {
        const response = await axios.post('/api/test-request', {
            method,
            url,
            headers,
            body,
            token
        });
        
        if (response.data.success) {
            const apiResponse = response.data.response;
            const isError = apiResponse.error || apiResponse.status >= 400;
            
            resultDiv.innerHTML = `
                <div class="card">
                    <div class="card-header bg-${isError ? 'danger' : 'success'} text-white">
                        <h6 class="mb-0">
                            <i class="bi bi-${isError ? 'x-circle' : 'check-circle'}"></i>
                            ${method} ${url} - ${apiResponse.status} ${apiResponse.statusText}
                            <span class="badge bg-light text-dark ms-2">${apiResponse.responseTime}ms</span>
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Response Headers</h6>
                                <pre class="bg-light p-2 small"><code>${JSON.stringify(apiResponse.headers, null, 2)}</code></pre>
                            </div>
                            <div class="col-md-6">
                                <h6>Response Body</h6>
                                <div class="mb-2">
                                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="expandAllJson()">
                                        <i class="bi bi-chevron-double-down"></i> Expand All
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="collapseAllJson()">
                                        <i class="bi bi-chevron-double-up"></i> Collapse All
                                    </button>
                                    <button class="btn btn-sm btn-outline-primary" onclick="copyFullResponse()">
                                        <i class="bi bi-clipboard"></i> Copy Full Response
                                    </button>
                                </div>
                                <div class="bg-light p-2 response-body" style="max-height: 400px; overflow-y: auto;">
                                    <div id="responseJsonViewer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Initialize JSON viewer after DOM is updated
            setTimeout(() => {
                window.currentApiResponse = apiResponse.data;
                $('#responseJsonViewer').jsonViewer(apiResponse.data, {
                    collapsed: false,
                    rootCollapsable: false,
                    withQuotes: true,
                    withLinks: true
                });
                
                // Add copy buttons to each value
                addCopyButtonsToJsonViewer();
            }, 100);
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <h6>❌ Request Failed</h6>
                <p>${error.response?.data?.error || error.message}</p>
            </div>
        `;
    }
}

function clearApiForm() {
    document.getElementById('apiService').value = '';
    document.getElementById('apiMethod').value = 'GET';
    document.getElementById('apiUrl').value = '';
    document.getElementById('apiHeaders').value = '';
    document.getElementById('apiBody').value = '';
    document.getElementById('apiResult').innerHTML = '';
}

function copyResponse(encodedData) {
    try {
        const data = decodeURIComponent(encodedData);
        navigator.clipboard.writeText(data).then(() => {
            showToast('✅ Response copied to clipboard', 'success');
        }).catch(err => {
            showToast('❌ Failed to copy response', 'danger');
        });
    } catch (e) {
        showToast('❌ Failed to copy response', 'danger');
    }
}

// JSON Viewer helper functions
function expandAllJson() {
    $('#responseJsonViewer').find('.json-toggle').each(function() {
        if ($(this).hasClass('collapsed')) {
            $(this).click();
        }
    });
}

function collapseAllJson() {
    $('#responseJsonViewer').find('.json-toggle').each(function() {
        if (!$(this).hasClass('collapsed')) {
            $(this).click();
        }
    });
}

function copyFullResponse() {
    if (window.currentApiResponse) {
        const jsonStr = JSON.stringify(window.currentApiResponse, null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {
            showToast('✅ Full response copied to clipboard', 'success');
        }).catch(err => {
            showToast('❌ Failed to copy response', 'danger');
        });
    }
}

function copyPropertyValue(value) {
    // Convert value to string if it's not already
    const textValue = typeof value === 'string' ? value : String(value);
    
    navigator.clipboard.writeText(textValue).then(() => {
        showToast(`✅ Copied: ${textValue.length > 30 ? textValue.substring(0, 30) + '...' : textValue}`, 'success');
    }).catch(err => {
        showToast('❌ Failed to copy value', 'danger');
        console.error('Copy failed:', err);
    });
}

function addCopyButtonsToJsonViewer() {
    // Add copy buttons to keys in the JSON viewer
    $('#responseJsonViewer').find('.json-key').each(function() {
        const $elem = $(this);
        
        // Skip if already has a copy button
        if ($elem.next('.copy-btn-key').length > 0) {
            return;
        }
        
        // Get key without quotes
        let key = $elem.text().replace(/^"|"$/g, '').replace(/:$/, '');
        
        // Create copy button for key
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn-key p-0 ms-1" title="Copy key" style="font-size: 0.7rem; opacity: 0.6; color: #6c757d;">');
        $copyBtn.html('<i class="bi bi-clipboard"></i>');
        
        // Add hover effects
        $copyBtn.on('mouseenter', function() {
            $(this).css('opacity', '1');
        }).on('mouseleave', function() {
            $(this).css('opacity', '0.6');
        });
        
        $copyBtn.on('click', function(e) {
            e.stopPropagation();
            navigator.clipboard.writeText(key).then(() => {
                showToast(`✅ Copied key: ${key}`, 'success');
            }).catch(err => {
                showToast('❌ Failed to copy key', 'danger');
            });
            
            // Visual feedback
            const $icon = $(this).find('i');
            const originalIcon = $icon.attr('class');
            $icon.attr('class', 'bi bi-check text-success');
            
            setTimeout(() => {
                $icon.attr('class', originalIcon);
            }, 1000);
        });
        
        // Insert button after the key
        $elem.after($copyBtn);
    });
    
    // Add copy buttons to primitive values in the JSON viewer
    $('#responseJsonViewer').find('.json-string, .json-literal').each(function() {
        const $elem = $(this);
        
        // Skip if already has a copy button
        if ($elem.next('.copy-btn').length > 0) {
            return;
        }
        
        let value = $elem.text();
        
        // Handle different value types
        if ($elem.hasClass('json-string')) {
            // Remove surrounding quotes from strings
            value = value.replace(/^"|"$/g, '');
        }
        
        // Create copy button with better styling
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn p-0 ms-1" title="Copy value" style="font-size: 0.7rem; opacity: 0.6; color: #6c757d;">');
        $copyBtn.html('<i class="bi bi-clipboard"></i>');
        
        // Add hover effects
        $copyBtn.on('mouseenter', function() {
            $(this).css('opacity', '1');
        }).on('mouseleave', function() {
            $(this).css('opacity', '0.6');
        });
        
        $copyBtn.on('click', function(e) {
            e.stopPropagation();
            copyPropertyValue(value);
            
            // Visual feedback
            const $icon = $(this).find('i');
            const originalIcon = $icon.attr('class');
            $icon.attr('class', 'bi bi-check text-success');
            
            setTimeout(() => {
                $icon.attr('class', originalIcon);
            }, 1000);
        });
        
        // Insert button after the value
        $elem.after($copyBtn);
    });
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    
    const configForm = document.getElementById('configForm');
    if (configForm) {
        configForm.addEventListener('submit', saveConfiguration);
        loadConfigurationScopes();
        
        // Handle Enter key in new scope input
        const newScopeInput = document.getElementById('newScopeInput');
        if (newScopeInput) {
            newScopeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addScope();
                }
            });
        }
    }
    
    const apiTestForm = document.getElementById('apiTestForm');
    if (apiTestForm) {
        apiTestForm.addEventListener('submit', sendApiRequest);
        initializeApiTesting();
    }
});