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
                                    <button class="btn btn-sm btn-outline-primary me-1" onclick="copyFullResponse()">
                                        <i class="bi bi-clipboard"></i> Copy All JSON
                                    </button>
                                    <button class="btn btn-sm btn-outline-info" onclick="copyFormattedResponse()">
                                        <i class="bi bi-clipboard-data"></i> Copy Pretty JSON
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
    // Expand main response viewer
    $('#responseJsonViewer').find('.json-toggle').each(function() {
        if ($(this).hasClass('collapsed')) {
            $(this).click();
        }
    });
    
    // Expand simple response viewer
    $('#responseJsonViewerSimple').find('.json-toggle').each(function() {
        if ($(this).hasClass('collapsed')) {
            $(this).click();
        }
    });
}

function collapseAllJson() {
    // Collapse main response viewer
    $('#responseJsonViewer').find('.json-toggle').each(function() {
        if (!$(this).hasClass('collapsed')) {
            $(this).click();
        }
    });
    
    // Collapse simple response viewer
    $('#responseJsonViewerSimple').find('.json-toggle').each(function() {
        if (!$(this).hasClass('collapsed')) {
            $(this).click();
        }
    });
}

function copyFullResponse() {
    if (window.currentApiResponse) {
        const jsonStr = JSON.stringify(window.currentApiResponse);
        navigator.clipboard.writeText(jsonStr).then(() => {
            showToast('✅ Full response copied to clipboard (minified)', 'success');
        }).catch(err => {
            showToast('❌ Failed to copy response', 'danger');
        });
    }
}

function copyFormattedResponse() {
    if (window.currentApiResponse) {
        const jsonStr = JSON.stringify(window.currentApiResponse, null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {
            showToast('✅ Pretty JSON copied to clipboard (formatted)', 'success');
        }).catch(err => {
            showToast('❌ Failed to copy formatted response', 'danger');
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
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn-key p-0 ms-1" title="Copy key" style="font-size: 0.8rem; opacity: 0.7; color: #007bff; background: rgba(0,123,255,0.1); border-radius: 3px; padding: 1px 3px!important;">');
        $copyBtn.html('<i class="bi bi-clipboard"></i>');
        
        // Add hover effects
        $copyBtn.on('mouseenter', function() {
            $(this).css({
                'opacity': '1',
                'background': 'rgba(0,123,255,0.2)',
                'color': '#0056b3'
            });
        }).on('mouseleave', function() {
            $(this).css({
                'opacity': '0.7',
                'background': 'rgba(0,123,255,0.1)',
                'color': '#007bff'
            });
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
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn p-0 ms-1" title="Copy value" style="font-size: 0.8rem; opacity: 0.7; color: #28a745; background: rgba(40,167,69,0.1); border-radius: 3px; padding: 1px 3px!important;">');
        $copyBtn.html('<i class="bi bi-clipboard"></i>');
        
        // Add hover effects
        $copyBtn.on('mouseenter', function() {
            $(this).css({
                'opacity': '1',
                'background': 'rgba(40,167,69,0.2)',
                'color': '#1e7e34'
            });
        }).on('mouseleave', function() {
            $(this).css({
                'opacity': '0.7',
                'background': 'rgba(40,167,69,0.1)',
                'color': '#28a745'
            });
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

// Google OAuth Playground Interface Functions
function toggleStep(stepNumber) {
    const stepSection = document.querySelector(`#step${stepNumber}`);
    if (!stepSection) return;
    
    const stepHeader = stepSection.querySelector('.step-header');
    const stepContent = stepSection.querySelector('.step-content');
    const toggle = stepHeader.querySelector('.step-toggle');
    
    // Check if step is disabled
    if (stepHeader.classList.contains('disabled')) {
        return;
    }
    
    const isCurrentlyHidden = stepContent.style.display === 'none' || 
                              window.getComputedStyle(stepContent).display === 'none';
    
    // Close all other steps first (accordion behavior)
    const allSteps = document.querySelectorAll('.step-section');
    allSteps.forEach(step => {
        if (step.id !== `step${stepNumber}`) {
            const content = step.querySelector('.step-content');
            const stepToggle = step.querySelector('.step-toggle');
            if (content && stepToggle) {
                content.style.display = 'none';
                stepToggle.textContent = '▶';
            }
        }
    });
    
    // Toggle the clicked step
    if (isCurrentlyHidden) {
        stepContent.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        stepContent.style.display = 'none';
        toggle.textContent = '▶';
    }
}

function toggleScopeGroup(groupId) {
    const checkbox = document.getElementById(groupId);
    const scopeItems = checkbox.closest('.scope-group').querySelectorAll('.scope-checkbox');
    
    scopeItems.forEach(item => {
        item.checked = checkbox.checked;
    });
    
    updateCustomScopes();
}

function updateCustomScopes() {
    const selectedScopes = [];
    const scopeCheckboxes = document.querySelectorAll('.scope-checkbox:checked');
    
    scopeCheckboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling.textContent.trim();
        // Convert UI labels to actual Microsoft Graph scopes
        const scopeMap = {
            'User.Read': 'https://graph.microsoft.com/User.Read',
            'Calendars.Read': 'https://graph.microsoft.com/Calendars.Read',
            'Calendars.ReadWrite': 'https://graph.microsoft.com/Calendars.ReadWrite',
            'Chat.Read': 'https://graph.microsoft.com/Chat.Read',
            'Chat.ReadWrite': 'https://graph.microsoft.com/Chat.ReadWrite',
            'offline_access (Refresh Token)': 'offline_access'
        };
        
        if (scopeMap[label]) {
            selectedScopes.push(scopeMap[label]);
        }
    });
    
    // Update custom scopes input
    const customScopesInput = document.getElementById('customScopes');
    if (customScopesInput) {
        customScopesInput.value = selectedScopes.length > 0 ? selectedScopes.join(' ') : '';
    }
}

function authorizeAPIs() {
    const clientId = document.getElementById('clientId').value;
    const clientSecret = document.getElementById('clientSecret').value;
    const tenantId = document.getElementById('tenantId').value;
    const redirectUri = document.getElementById('redirectUri').value;
    const customScopes = document.getElementById('customScopes').value;
    
    if (!clientId || !clientSecret || !tenantId) {
        showToast('❌ Please fill in all required configuration fields first', 'danger');
        return;
    }
    
    if (!redirectUri) {
        showToast('❌ Please provide a redirect URI', 'danger');
        return;
    }
    
    // Save configuration with selected scopes (use default if empty)
    const scopeList = customScopes ? customScopes.split(' ').filter(s => s.trim()) : [];
    const scopes = scopeList.length > 0 ? scopeList : ['https://graph.microsoft.com/.default'];
    
    const configData = {
        clientId,
        clientSecret,
        tenantId,
        authority: '',
        redirectUri,
        scopes
    };
    
    // Show loading state
    const authorizeBtn = document.querySelector('.authorize-btn');
    const originalBtnText = authorizeBtn.innerHTML;
    authorizeBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Saving configuration...';
    authorizeBtn.disabled = true;
    
    // Save configuration to storage first
    axios.post('/api/config', configData)
        .then(response => {
            if (response.data.success) {
                console.log('✅ Configuration saved to storage:', configData);
                showToast(`✅ Configuration saved: Client ID, Tenant ID, Redirect URI, and ${scopes.length} scope(s)`, 'success');
                
                // Update button to show redirect state
                authorizeBtn.innerHTML = '<i class="bi bi-shield-check"></i> Redirecting to Azure AD...';
                
                // Small delay to show the success message, then redirect
                setTimeout(() => {
                    console.log('🔄 Redirecting to OAuth authorization flow...');
                    window.location.href = '/api/auth/login';
                }, 1500);
            } else {
                throw new Error(response.data.error || 'Failed to save configuration');
            }
        })
        .catch(error => {
            console.error('Configuration save error:', error);
            showToast('❌ Error saving configuration: ' + (error.response?.data?.error || error.message), 'danger');
            
            // Restore button state on error
            authorizeBtn.innerHTML = originalBtnText;
            authorizeBtn.disabled = false;
        });
}

function refreshToken(tokenId) {
    if (!confirm('Refresh token? This will generate a new access token.')) {
        return;
    }
    
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Refreshing...';
    btn.disabled = true;
    
    console.log('🔄 Refreshing token with ID:', tokenId);
    
    axios.post(`/api/token/${tokenId}/refresh`)
        .then(response => {
            console.log('✅ Refresh response:', response.data);
            if (response.data.success) {
                showToast('✅ Token refreshed successfully', 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                throw new Error(response.data.error || 'Unknown refresh error');
            }
        })
        .catch(error => {
            console.error('❌ Refresh error:', error);
            const errorMessage = error.response?.data?.error || error.message;
            showToast('❌ Refresh failed: ' + errorMessage, 'danger');
            
            // Restore button state on error
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
}

function revokeToken(tokenId) {
    if (!confirm('Revoke this token? This action cannot be undone.')) {
        return;
    }
    
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-x-circle"></i> Revoking...';
    btn.disabled = true;
    
    axios.post(`/api/token/${tokenId}/revoke`)
        .then(response => {
            if (response.data.success) {
                showToast('✅ Token revoked successfully', 'success');
                setTimeout(() => location.reload(), 1000);
            } else {
                showToast('❌ Failed to revoke: ' + response.data.error, 'danger');
            }
        })
        .catch(error => {
            showToast('❌ Revoke error: ' + error.message, 'danger');
        })
        .finally(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
}

function copyToken(token) {
    navigator.clipboard.writeText(token)
        .then(() => showToast('✅ Token copied to clipboard', 'success'))
        .catch(() => showToast('❌ Failed to copy token', 'danger'));
}

// URI Parameter Management Functions
function detectUriParameters() {
    const uriInput = document.getElementById('requestUri');
    const parametersSection = document.getElementById('uriParametersSection');
    const parametersList = document.getElementById('uriParametersList');
    
    if (!uriInput || !parametersSection || !parametersList) return;
    
    const uri = uriInput.value;
    
    // Find parameters in URI (pattern: {param-name})
    const parameterRegex = /\{([^}]+)\}/g;
    const parameters = [];
    let match;
    
    while ((match = parameterRegex.exec(uri)) !== null) {
        if (!parameters.includes(match[1])) {
            parameters.push(match[1]);
        }
    }
    
    // Clear existing parameters
    parametersList.innerHTML = '';
    
    if (parameters.length > 0) {
        // Show parameters section
        parametersSection.style.display = 'block';
        
        // Create input fields for each parameter
        parameters.forEach(param => {
            const paramField = document.createElement('div');
            paramField.className = 'uri-parameter-field';
            
            paramField.innerHTML = `
                <div class="uri-parameter-label">{${param}}</div>
                <input type="text" class="uri-parameter-input" 
                       data-param="${param}" 
                       placeholder="Enter ${param} value"
                       title="Value for ${param} parameter">
                <div class="uri-parameter-help">Replace {${param}} in URI</div>
            `;
            
            parametersList.appendChild(paramField);
        });
    } else {
        // Hide parameters section
        parametersSection.style.display = 'none';
    }
}

function applyUriParameters() {
    const uriInput = document.getElementById('requestUri');
    const parameterInputs = document.querySelectorAll('.uri-parameter-input');
    
    if (!uriInput) return;
    
    let uri = uriInput.value;
    let appliedCount = 0;
    
    parameterInputs.forEach(input => {
        const paramName = input.dataset.param;
        const paramValue = input.value.trim();
        
        if (paramValue) {
            // Replace {param-name} with the actual value
            const oldUri = uri;
            uri = uri.replace(`{${paramName}}`, encodeURIComponent(paramValue));
            if (oldUri !== uri) {
                appliedCount++;
            }
        }
    });
    
    // Update the URI input
    uriInput.value = uri;
    
    if (appliedCount > 0) {
        showToast(`✅ Applied ${appliedCount} parameter(s) to URI`, 'success');
    } else {
        showToast('⚠️ No parameters to apply or values are empty', 'warning');
    }
}

function toggleRequestBody() {
    const httpMethod = document.getElementById('httpMethod').value;
    const requestBodySection = document.getElementById('requestBodySection');
    
    if (!requestBodySection) return;
    
    // Show request body for methods that typically have a body
    const methodsWithBody = ['POST', 'PATCH', 'PUT'];
    
    if (methodsWithBody.includes(httpMethod)) {
        requestBodySection.style.display = 'block';
    } else {
        requestBodySection.style.display = 'none';
        // Clear the request body when hiding
        const requestBody = document.getElementById('requestBody');
        if (requestBody) {
            requestBody.value = '';
        }
    }
}

// Query Parameter Management Functions
function detectQueryParameters() {
    const uriInput = document.getElementById('requestUri');
    const queryParamBtn = document.getElementById('queryParamBtn');
    
    if (!uriInput || !queryParamBtn) return;
    
    const uri = uriInput.value;
    const hasQueryParams = uri.includes('?');
    
    // Show/hide the edit query parameters button
    if (hasQueryParams) {
        queryParamBtn.style.display = 'block';
    } else {
        queryParamBtn.style.display = 'none';
        // Hide query editor if no params
        const querySection = document.getElementById('queryParametersSection');
        if (querySection) {
            querySection.style.display = 'none';
        }
    }
}

function toggleQueryEditor() {
    const querySection = document.getElementById('queryParametersSection');
    const uriInput = document.getElementById('requestUri');
    
    if (!querySection || !uriInput) return;
    
    const isVisible = querySection.style.display === 'block';
    
    if (isVisible) {
        querySection.style.display = 'none';
    } else {
        querySection.style.display = 'block';
        parseQueryParametersFromUri();
    }
}

function parseQueryParametersFromUri() {
    const uriInput = document.getElementById('requestUri');
    const parametersList = document.getElementById('queryParametersList');
    
    if (!uriInput || !parametersList) return;
    
    const uri = uriInput.value;
    const queryStartIndex = uri.indexOf('?');
    
    if (queryStartIndex === -1) return;
    
    // Clear existing parameters
    parametersList.innerHTML = '';
    
    const queryString = uri.substring(queryStartIndex + 1);
    const params = new URLSearchParams(queryString);
    
    // Create input fields for existing parameters
    params.forEach((value, key) => {
        addQueryParameterField(key, value);
    });
    
    // Add empty field for new parameter
    if (params.size === 0) {
        addQueryParameterField('', '');
    }
}

function addQueryParameter() {
    addQueryParameterField('', '');
}

function addQueryParameterField(key = '', value = '') {
    const parametersList = document.getElementById('queryParametersList');
    if (!parametersList) return;
    
    const paramField = document.createElement('div');
    paramField.className = 'query-parameter-field';
    
    paramField.innerHTML = `
        <input type="text" class="query-param-key" 
               placeholder="Parameter name" 
               value="${key}"
               title="Parameter name (e.g., $top, $filter)">
        <span style="color: #6c757d; font-size: 12px;">=</span>
        <input type="text" class="query-param-value" 
               placeholder="Parameter value" 
               value="${value}"
               title="Parameter value">
        <button type="button" class="query-param-remove" onclick="removeQueryParameter(this)" title="Remove parameter">
            <i class="bi bi-x"></i>
        </button>
    `;
    
    parametersList.appendChild(paramField);
}

function removeQueryParameter(button) {
    const paramField = button.closest('.query-parameter-field');
    if (paramField) {
        paramField.remove();
    }
}

function applyQueryParameters() {
    const uriInput = document.getElementById('requestUri');
    const parametersList = document.getElementById('queryParametersList');
    
    if (!uriInput || !parametersList) return;
    
    let uri = uriInput.value;
    
    // Remove existing query parameters
    const queryStartIndex = uri.indexOf('?');
    if (queryStartIndex !== -1) {
        uri = uri.substring(0, queryStartIndex);
    }
    
    // Collect all parameter fields
    const paramFields = parametersList.querySelectorAll('.query-parameter-field');
    const params = new URLSearchParams();
    let validParamCount = 0;
    
    paramFields.forEach(field => {
        const keyInput = field.querySelector('.query-param-key');
        const valueInput = field.querySelector('.query-param-value');
        
        if (keyInput && valueInput) {
            const key = keyInput.value.trim();
            const value = valueInput.value.trim();
            
            if (key) {
                params.append(key, value);
                validParamCount++;
            }
        }
    });
    
    // Build final URI
    if (validParamCount > 0) {
        uri += '?' + params.toString();
    }
    
    uriInput.value = uri;
    
    // Update query button visibility
    detectQueryParameters();
    
    if (validParamCount > 0) {
        showToast(`✅ Applied ${validParamCount} query parameter(s) to URI`, 'success');
    } else {
        showToast('✅ Removed all query parameters from URI', 'info');
    }
}

function loadSelectedAPI() {
    const selector = document.getElementById('apiSelector');
    const selectedValue = selector.value;
    
    if (!selectedValue) return;
    
    // API configurations mapped to selector values
    const apiConfigs = {
        // Profile APIs
        'profile-me': {
            method: 'GET',
            uri: '/me',
            body: ''
        },
        'profile-photo': {
            method: 'GET', 
            uri: '/me/photo/$value',
            body: ''
        },
        'profile-update': {
            method: 'PATCH',
            uri: '/me',
            body: JSON.stringify({
                displayName: "Updated Name",
                jobTitle: "Software Developer"
            }, null, 2)
        },
        
        // Calendar APIs
        'calendar-main': {
            method: 'GET',
            uri: '/me/calendar',
            body: ''
        },
        'calendar-events': {
            method: 'GET',
            uri: '/me/events?$top=10&$orderby=start/dateTime',
            body: ''
        },
        'calendar-today': {
            method: 'GET',
            uri: `/me/calendarView?startDateTime=${new Date().toISOString().split('T')[0]}T00:00:00&endDateTime=${new Date(Date.now() + 86400000).toISOString().split('T')[0]}T00:00:00`,
            body: ''
        },
        'calendar-week': {
            method: 'GET',
            uri: '/me/events?$top=20&$orderby=start/dateTime',
            body: ''
        },
        'calendar-month': {
            method: 'GET',
            uri: '/me/events?$top=50&$orderby=start/dateTime',
            body: ''
        },
        'calendar-create': {
            method: 'POST',
            uri: '/me/events',
            body: JSON.stringify({
                subject: "Test Meeting",
                start: {
                    dateTime: new Date(Date.now() + 86400000).toISOString().split('.')[0],
                    timeZone: "UTC"
                },
                end: {
                    dateTime: new Date(Date.now() + 86400000 + 3600000).toISOString().split('.')[0],
                    timeZone: "UTC"
                },
                body: {
                    contentType: "HTML",
                    content: "Test meeting created via API"
                }
            }, null, 2)
        },
        
        // Teams APIs
        'teams-joined': {
            method: 'GET',
            uri: '/me/joinedTeams',
            body: ''
        },
        'teams-channels': {
            method: 'GET',
            uri: '/teams/{team-id}/channels',
            body: ''
        },
        'teams-messages': {
            method: 'GET',
            uri: '/teams/{team-id}/channels/{channel-id}/messages?$top=10',
            body: ''
        },
        
        // Chat APIs
        'chat-list': {
            method: 'GET',
            uri: '/me/chats?$top=20',
            body: ''
        },
        'chat-group': {
            method: 'GET',
            uri: '/me/chats?$filter=chatType eq \'group\'&$top=20',
            body: ''
        },
        'chat-oneone': {
            method: 'GET',
            uri: '/me/chats?$filter=chatType eq \'oneOnOne\'&$top=20',
            body: ''
        },
        'chat-messages': {
            method: 'GET',
            uri: '/me/chats/{chat-id}/messages?$top=10',
            body: ''
        },
        'chat-send': {
            method: 'POST',
            uri: '/me/chats/{chat-id}/messages',
            body: JSON.stringify({
                body: {
                    contentType: "text",
                    content: "Hello from Graph API!"
                }
            }, null, 2)
        }
    };
    
    const config = apiConfigs[selectedValue];
    if (config) {
        document.getElementById('httpMethod').value = config.method;
        document.getElementById('requestUri').value = config.uri;
        document.getElementById('requestBody').value = config.body;
        
        // Detect URI parameters after loading the API template
        detectUriParameters();
        
        // Detect query parameters after loading the API template
        detectQueryParameters();
        
        // Toggle request body visibility based on method
        toggleRequestBody();
        
        showToast('✅ API template loaded: ' + selector.options[selector.selectedIndex].text, 'success');
    }
}

function sendAPIRequest() {
    const httpMethod = document.getElementById('httpMethod').value;
    const requestUri = document.getElementById('requestUri').value;
    const requestBody = document.getElementById('requestBody').value;
    
    // Get access token from the page (single token support)
    const tokenInput = document.querySelector('input[readonly]');
    if (!tokenInput || !tokenInput.value) {
        showToast('❌ No access token available. Please authorize first.', 'danger');
        return;
    }
    
    const token = tokenInput.value.replace('...', '').trim();
    const fullUrl = 'https://graph.microsoft.com/v1.0' + requestUri;
    
    const requestData = {
        method: httpMethod,
        url: fullUrl,
        headers: {},
        token: token
    };
    
    if (['POST', 'PATCH', 'PUT'].includes(httpMethod) && requestBody) {
        try {
            requestData.body = JSON.parse(requestBody);
        } catch (e) {
            showToast('❌ Invalid JSON in request body', 'danger');
            return;
        }
    }
    
    // Update request/response panel
    const requestResponse = document.getElementById('requestResponse');
    requestResponse.innerHTML = '<div class="spinner-border text-primary" role="status"></div> Sending request...';
    
    axios.post('/api/test-request', requestData)
        .then(response => {
            if (response.data.success) {
                const apiResponse = response.data.response;
                displayApiResponse(httpMethod, fullUrl, apiResponse);
            }
        })
        .catch(error => {
            requestResponse.innerHTML = `
                <div class="alert alert-danger">
                    <h6>❌ Request Failed</h6>
                    <p>${error.response?.data?.error || error.message}</p>
                </div>
            `;
        });
}

function displayApiResponse(method, url, response) {
    const isError = response.error || response.status >= 400;
    const requestResponse = document.getElementById('requestResponse');
    
    const html = `
        <div class="api-response" style="width: 100%; max-width: 100%; margin: 0; box-sizing: border-box; overflow: hidden;">
            <div class="response-header" style="margin-bottom: 15px; width: 100%; overflow: hidden;">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                        <span class="api-method-badge api-method-${method.toLowerCase()}">${method}</span>
                        <span style="font-family: monospace; font-size: 13px; word-break: break-all; overflow: hidden; text-overflow: ellipsis;">${url}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                        <span class="response-status ${isError ? 'error' : 'success'}">
                            ${response.status} ${response.statusText}
                        </span>
                        <small class="text-muted">${response.responseTime}ms</small>
                    </div>
                </div>
            </div>
            <div class="mb-2">
                <button class="btn btn-sm btn-outline-secondary me-1" onclick="expandAllJson()">
                    <i class="bi bi-chevron-double-down"></i> Expand All
                </button>
                <button class="btn btn-sm btn-outline-secondary me-1" onclick="collapseAllJson()">
                    <i class="bi bi-chevron-double-up"></i> Collapse All
                </button>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="copyFullResponseSimple()">
                    <i class="bi bi-clipboard"></i> Copy All JSON
                </button>
                <button class="btn btn-sm btn-outline-info" onclick="copyFormattedResponseSimple()">
                    <i class="bi bi-clipboard-data"></i> Copy Pretty JSON
                </button>
            </div>
            <div class="bg-light p-2 response-body" style="max-height: 400px; overflow-y: auto;">
                <div id="responseJsonViewerSimple"></div>
            </div>
        </div>
    `;
    
    requestResponse.innerHTML = html;
    
    // Initialize JSON viewer after DOM is updated
    setTimeout(() => {
        window.currentSimpleApiResponse = response.data;
        $('#responseJsonViewerSimple').jsonViewer(response.data, {
            collapsed: false,
            rootCollapsable: false,
            withQuotes: true,
            withLinks: true
        });
        
        // Add copy buttons to each value
        addCopyButtonsToSimpleJsonViewer();
    }, 100);
}

// Simple JSON viewer functions for Step 3 response
function copyFullResponseSimple() {
    if (window.currentSimpleApiResponse) {
        const jsonStr = JSON.stringify(window.currentSimpleApiResponse);
        navigator.clipboard.writeText(jsonStr).then(() => {
            showToast('✅ Full response copied to clipboard (minified)', 'success');
        }).catch(err => {
            showToast('❌ Failed to copy response', 'danger');
        });
    }
}

function copyFormattedResponseSimple() {
    if (window.currentSimpleApiResponse) {
        const jsonStr = JSON.stringify(window.currentSimpleApiResponse, null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {
            showToast('✅ Pretty JSON copied to clipboard (formatted)', 'success');
        }).catch(err => {
            showToast('❌ Failed to copy formatted response', 'danger');
        });
    }
}

function addCopyButtonsToSimpleJsonViewer() {
    // Add copy buttons to keys in the simple JSON viewer
    $('#responseJsonViewerSimple').find('.json-key').each(function() {
        const $elem = $(this);
        
        // Skip if already has a copy button
        if ($elem.next('.copy-btn-key').length > 0) {
            return;
        }
        
        // Get key without quotes
        let key = $elem.text().replace(/^"|"$/g, '').replace(/:$/, '');
        
        // Create copy button for key
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn-key p-0 ms-1" title="Copy key" style="font-size: 0.8rem; opacity: 0.7; color: #007bff; background: rgba(0,123,255,0.1); border-radius: 3px; padding: 1px 3px!important;">');
        $copyBtn.html('<i class="bi bi-clipboard"></i>');
        
        // Add hover effects
        $copyBtn.on('mouseenter', function() {
            $(this).css({
                'opacity': '1',
                'background': 'rgba(0,123,255,0.2)',
                'color': '#0056b3'
            });
        }).on('mouseleave', function() {
            $(this).css({
                'opacity': '0.7',
                'background': 'rgba(0,123,255,0.1)',
                'color': '#007bff'
            });
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
    
    // Add copy buttons to primitive values in the simple JSON viewer
    $('#responseJsonViewerSimple').find('.json-string, .json-literal').each(function() {
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
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn p-0 ms-1" title="Copy value" style="font-size: 0.8rem; opacity: 0.7; color: #28a745; background: rgba(40,167,69,0.1); border-radius: 3px; padding: 1px 3px!important;">');
        $copyBtn.html('<i class="bi bi-clipboard"></i>');
        
        // Add hover effects
        $copyBtn.on('mouseenter', function() {
            $(this).css({
                'opacity': '1',
                'background': 'rgba(40,167,69,0.2)',
                'color': '#1e7e34'
            });
        }).on('mouseleave', function() {
            $(this).css({
                'opacity': '0.7',
                'background': 'rgba(40,167,69,0.1)',
                'color': '#28a745'
            });
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

// Load saved configuration and check appropriate scope checkboxes
function loadSavedConfiguration() {
    const customScopesInput = document.getElementById('customScopes');
    console.log('📋 Loading saved configuration...');
    console.log('Custom scopes input value:', customScopesInput ? customScopesInput.value : 'not found');
    
    if (customScopesInput && customScopesInput.value) {
        const savedScopes = customScopesInput.value.split(' ');
        console.log('🔍 Found saved scopes:', savedScopes);
        
        // Map of scopes to checkbox IDs
        const scopeToCheckboxMap = {
            'https://graph.microsoft.com/User.Read': 'user-read',
            'https://graph.microsoft.com/Calendars.Read': 'calendars-read',
            'https://graph.microsoft.com/Calendars.ReadWrite': 'calendars-readwrite',
            'https://graph.microsoft.com/Chat.Read': 'chat-read',
            'https://graph.microsoft.com/Chat.ReadWrite': 'chat-readwrite'
        };
        
        // Check the appropriate checkboxes
        savedScopes.forEach(scope => {
            const checkboxId = scopeToCheckboxMap[scope];
            if (checkboxId) {
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.checked = true;
                    
                    // Also check the parent group checkbox if all items in group are checked
                    const groupCheckbox = checkbox.closest('.scope-group').querySelector('.scope-group-checkbox');
                    if (groupCheckbox) {
                        const groupScopes = groupCheckbox.closest('.scope-group').querySelectorAll('.scope-checkbox');
                        const checkedScopes = groupCheckbox.closest('.scope-group').querySelectorAll('.scope-checkbox:checked');
                        if (groupScopes.length === checkedScopes.length) {
                            groupCheckbox.checked = true;
                        }
                    }
                }
            }
        });
    }
}

// Token expiration functions
function updateTokenExpiration() {
    const tokenExpirationEl = document.getElementById('tokenExpiration');
    const expirationTextEl = document.getElementById('expirationText');
    
    if (!tokenExpirationEl || !expirationTextEl) return;
    
    const expiresAt = tokenExpirationEl.getAttribute('data-expires');
    if (!expiresAt) return;
    
    const expirationTime = new Date(expiresAt);
    const now = new Date();
    const diffMs = expirationTime - now;
    
    if (diffMs <= 0) {
        expirationTextEl.textContent = 'Token expired';
        expirationTextEl.className = 'text-danger';
        return;
    }
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    
    let expirationText;
    if (diffHours > 0) {
        expirationText = `Expires in ${diffHours}h ${remainingMinutes}m`;
    } else if (diffMinutes > 0) {
        expirationText = `Expires in ${diffMinutes} minutes`;
    } else {
        const diffSeconds = Math.floor(diffMs / 1000);
        expirationText = `Expires in ${diffSeconds} seconds`;
    }
    
    // Color coding based on time remaining
    if (diffMinutes <= 5) {
        expirationTextEl.className = 'text-danger';
    } else if (diffMinutes <= 15) {
        expirationTextEl.className = 'text-warning';
    } else {
        expirationTextEl.className = 'text-success';
    }
    
    expirationTextEl.textContent = expirationText;
}

function startTokenExpirationTimer() {
    updateTokenExpiration();
    // Update every 30 seconds
    setInterval(updateTokenExpiration, 30000);
}

// Contact and Donate Functions
function contactDeveloper() {
    window.open('mailto:nurza.cool@gmail.com?subject=Azure OAuth2 Playground - Contact&body=Hello,%0D%0A%0D%0AI am contacting you regarding the Azure OAuth2 Playground application.%0D%0A%0D%0AMessage:%0D%0A', '_blank');
}

function donatePaypal() {
    // PayPal donation link - opens PayPal send money page
    window.open('https://paypal.me/nurzazin', '_blank');
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scope checkboxes
    const scopeCheckboxes = document.querySelectorAll('.scope-checkbox');
    scopeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCustomScopes);
    });
    
    // Initialize scope group checkboxes
    const groupCheckboxes = document.querySelectorAll('.scope-group-checkbox');
    groupCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => toggleScopeGroup(checkbox.id));
    });
    
    // Set default request URI
    const requestUriInput = document.getElementById('requestUri');
    if (requestUriInput && !requestUriInput.value) {
        requestUriInput.value = '/me';
    }
    
    // Load saved configuration and check appropriate scopes
    loadSavedConfiguration();
    
    // Start token expiration timer if token exists
    if (document.getElementById('tokenExpiration')) {
        startTokenExpirationTimer();
    }
    
    // Initialize request body visibility based on default method
    toggleRequestBody();
    
    // Initialize query parameter detection
    detectQueryParameters();
    
    // Check for original token response display
    checkForOriginalTokenResponse();
});

// Generic function to add copy buttons to any JSON viewer
function addJsonCopyButtons(containerId = '#jsonViewer') {
    // Add copy buttons to keys in the JSON viewer
    $(containerId).find('.json-key').each(function() {
        const $elem = $(this);
        
        // Skip if already has a copy button
        if ($elem.next('.copy-btn-key').length > 0) {
            return;
        }
        
        const keyText = $elem.text().replace(/['"]/g, '');
        
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn-key p-0 ms-1" title="Copy key" style="font-size: 0.8rem; opacity: 0.7; color: #007bff; background: rgba(0,123,255,0.1); border-radius: 3px; padding: 1px 3px!important;">');
        $copyBtn.html('<i class="bi bi-clipboard"></i>');
        
        $copyBtn.hover(
            function() {
                $(this).css({
                    'opacity': '1',
                    'background': 'rgba(0,123,255,0.2)',
                    'transform': 'scale(1.1)'
                });
            },
            function() {
                $(this).css({
                    'opacity': '0.7',
                    'background': 'rgba(0,123,255,0.1)',
                    'transform': 'scale(1.0)'
                });
            }
        );
        
        $copyBtn.on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            navigator.clipboard.writeText(keyText).then(() => {
                const $icon = $(this).find('i');
                const originalIcon = $icon.attr('class');
                $icon.attr('class', 'bi bi-check text-success');
                
                setTimeout(() => {
                    $icon.attr('class', originalIcon);
                }, 1000);
                
                showToast(`Key "${keyText}" copied to clipboard`, 'success');
            }).catch(err => {
                showToast('Failed to copy key', 'danger');
            });
        });
        
        $elem.after($copyBtn);
    });
    
    // Add copy buttons to values in the JSON viewer
    $(containerId).find('.json-string, .json-literal').each(function() {
        const $elem = $(this);
        
        // Skip if already has a copy button
        if ($elem.next('.copy-btn').length > 0) {
            return;
        }
        
        // Skip very long strings to avoid UI issues
        const valueText = $elem.text();
        if (valueText.length > 200) {
            return;
        }
        
        // Clean the value (remove quotes from strings)
        let cleanValue = valueText;
        if ($elem.hasClass('json-string')) {
            cleanValue = valueText.replace(/^"/, '').replace(/"$/, '');
        }
        
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn p-0 ms-1" title="Copy value" style="font-size: 0.8rem; opacity: 0.7; color: #28a745; background: rgba(40,167,69,0.1); border-radius: 3px; padding: 1px 3px!important;">');
        $copyBtn.html('<i class="bi bi-clipboard"></i>');
        
        $copyBtn.hover(
            function() {
                $(this).css({
                    'opacity': '1',
                    'background': 'rgba(40,167,69,0.2)',
                    'transform': 'scale(1.1)'
                });
            },
            function() {
                $(this).css({
                    'opacity': '0.7',
                    'background': 'rgba(40,167,69,0.1)',
                    'transform': 'scale(1.0)'
                });
            }
        );
        
        $copyBtn.on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            navigator.clipboard.writeText(cleanValue).then(() => {
                const $icon = $(this).find('i');
                const originalIcon = $icon.attr('class');
                $icon.attr('class', 'bi bi-check text-success');
                
                setTimeout(() => {
                    $icon.attr('class', originalIcon);
                }, 1000);
                
                showToast(`Value copied to clipboard`, 'success');
            }).catch(err => {
                showToast('Failed to copy value', 'danger');
            });
        });
        
        $elem.after($copyBtn);
    });
}

// Display original token response after authorization
function displayOriginalTokenResponse(response) {
    const requestResponseArea = document.getElementById('requestResponse');
    if (!requestResponseArea || !response) return;
    
    // Create response display HTML
    const responseHTML = `
        <div class="api-response">
            <div class="response-header">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0 text-success">
                        <i class="bi bi-check-circle-fill"></i> Authorization Success
                    </h6>
                    <div class="response-actions">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="copyFullResponse()">
                            <i class="bi bi-clipboard"></i> Copy All JSON
                        </button>
                        <button class="btn btn-sm btn-outline-success me-1" onclick="copyPrettyResponse()">
                            <i class="bi bi-clipboard-plus"></i> Copy Pretty JSON
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="toggleJsonExpansion()">
                            <i class="bi bi-arrows-expand" id="expandIcon"></i> <span id="expandText">Expand All</span>
                        </button>
                    </div>
                </div>
                <div class="response-metadata">
                    <span class="badge bg-success me-2">OAuth2 Token Response</span>
                    <span class="badge bg-info me-2">Authorization Code Flow</span>
                    <small class="text-muted">
                        <i class="bi bi-clock"></i> ${new Date().toLocaleString()}
                    </small>
                </div>
            </div>
            <div class="response-body">
                <div id="jsonViewer" class="json-response"></div>
            </div>
        </div>
    `;
    
    requestResponseArea.innerHTML = responseHTML;
    
    // Store response globally for copy functions
    window.currentApiResponse = response;
    
    // Initialize JSON viewer with copy buttons
    $('#jsonViewer').jsonViewer(response, {
        collapsed: false,
        rootCollapsible: false,
        withQuotes: true,
        withLinks: false
    });
    
    // Add copy buttons to JSON values
    setTimeout(() => {
        addJsonCopyButtons();
    }, 100);
    
    showToast('🎉 Authorization successful! Original token response displayed below.', 'success');
}

// Check for original token response on page load
function checkForOriginalTokenResponse() {
    // Check URL parameters for show_response flag
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('show_response') === 'true') {
        // The response should be available from the server-side template
        if (window.originalTokenResponse) {
            displayOriginalTokenResponse(window.originalTokenResponse);
            
            // Clean up URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}