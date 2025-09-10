// Scope Management Module
let selectedScopes = [];
let currentScopes = [];

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
                            <input class="form-check-input" type="checkbox" 
                                   value="${scope.value}" 
                                   onchange="toggleScope('${scope.value}')"
                                   ${isSelected ? 'checked' : ''}>
                            <label class="form-check-label">
                                <strong>${scope.value}</strong><br>
                                <small class="text-muted">${scope.label}</small>
                            </label>
                        </div>
                    </div>
                </li>
            `;
        });
    });
    
    // Add custom scope section
    html += `
        <li><hr class="dropdown-divider"></li>
        <li>
            <div class="dropdown-item-text">
                <div class="input-group">
                    <input type="text" class="form-control form-control-sm" 
                           id="customScope" placeholder="Custom scope URL">
                    <button class="btn btn-primary btn-sm" onclick="addCustomScope()">Add</button>
                </div>
                <small class="text-muted">Enter full scope URL (e.g., https://graph.microsoft.com/User.Read)</small>
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

// Scopes Management Functions
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
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeScopeByIndex(${index})">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `).join('');
    
    // Add manual scope input section
    const addScopeHtml = `
        <div class="input-group mt-3">
            <input type="text" class="form-control" id="newScopeInput" 
                   placeholder="Add scope (e.g., https://graph.microsoft.com/User.Read)">
            <button class="btn btn-primary" type="button" onclick="addNewScope()">
                <i class="bi bi-plus"></i> Add
            </button>
        </div>
        <small class="text-muted">Common: User.Read, Calendars.Read, offline_access</small>
    `;
    
    const dropdown = document.getElementById('scopeDropdownMenu');
    if (dropdown) {
        dropdown.innerHTML = `
            <div class="px-3 py-2">
                <h6 class="mb-2">Common Scopes</h6>
                <div class="d-grid gap-1">
                    <button class="btn btn-sm btn-outline-primary text-start" onclick="addPredefinedScope('https://graph.microsoft.com/User.Read')">
                        <small>User.Read - Basic profile access</small>
                    </button>
                    <button class="btn btn-sm btn-outline-primary text-start" onclick="addPredefinedScope('https://graph.microsoft.com/Calendars.Read')">
                        <small>Calendars.Read - Read calendars</small>
                    </button>
                    <button class="btn btn-sm btn-outline-primary text-start" onclick="addPredefinedScope('https://graph.microsoft.com/Calendars.ReadWrite')">
                        <small>Calendars.ReadWrite - Full calendar access</small>
                    </button>
                    <button class="btn btn-sm btn-outline-primary text-start" onclick="addPredefinedScope('https://graph.microsoft.com/Chat.Read')">
                        <small>Chat.Read - Read Teams chats</small>
                    </button>
                    <button class="btn btn-sm btn-outline-primary text-start" onclick="addPredefinedScope('https://graph.microsoft.com/Chat.ReadWrite')">
                        <small>Chat.ReadWrite - Teams chat access</small>
                    </button>
                    <button class="btn btn-sm btn-outline-primary text-start" onclick="addPredefinedScope('offline_access')">
                        <small>offline_access - Refresh tokens</small>
                    </button>
                </div>
            </div>
        `;
    }
    
    scopesList.innerHTML = scopesHtml + addScopeHtml;
}

// Helper functions for renderScopes
function removeScopeByIndex(index) {
    if (currentScopes.length <= 1) {
        showToast('❌ Cannot remove the last scope', 'warning');
        return;
    }
    
    currentScopes.splice(index, 1);
    renderScopes();
    
    // Auto-save the changes
    autoSaveConfiguration();
}

function addNewScope() {
    const input = document.getElementById('newScopeInput');
    const scope = input.value.trim();
    
    if (!scope) {
        showToast('❌ Please enter a scope', 'warning');
        return;
    }
    
    if (currentScopes.includes(scope)) {
        showToast('❌ Scope already exists', 'warning');
        input.value = '';
        return;
    }
    
    currentScopes.push(scope);
    input.value = '';
    renderScopes();
    
    // Auto-save the changes
    autoSaveConfiguration();
    
    showToast('✅ Scope added: ' + scope, 'success');
}

function addPredefinedScope(scope) {
    if (currentScopes.includes(scope)) {
        showToast('❌ Scope already exists', 'warning');
        return;
    }
    
    currentScopes.push(scope);
    renderScopes();
    
    // Auto-save the changes
    autoSaveConfiguration();
    
    showToast('✅ Scope added: ' + scope, 'success');
}

// Google OAuth Playground Interface Functions
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
            'Contacts.Read': 'https://graph.microsoft.com/Contacts.Read',
            'People.Read': 'https://graph.microsoft.com/People.Read',
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

// Authorization function
window.authorizeAPIs = function() {
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

// Auto-save helper function for scope changes
function autoSaveConfiguration() {
    const clientId = document.getElementById('clientId')?.value;
    const clientSecret = document.getElementById('clientSecret')?.value;
    const tenantId = document.getElementById('tenantId')?.value;
    const redirectUri = document.getElementById('redirectUri')?.value;
    
    // Only auto-save if we have the basic config
    if (clientId && clientSecret && tenantId && redirectUri) {
        const configData = {
            clientId,
            clientSecret,
            tenantId,
            authority: '',
            redirectUri,
            scopes: currentScopes
        };
        
        axios.post('/api/config', configData)
            .then(response => {
                if (response.data.success) {
                    console.log('🔄 Auto-saved scope configuration');
                }
            })
            .catch(error => {
                console.error('Auto-save failed:', error);
            });
    }
}