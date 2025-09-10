// Utility Functions Module

// Toast notification system
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

// Token management functions
function copyToken(token) {
    navigator.clipboard.writeText(token).then(() => {
        showToast('✅ Token copied to clipboard', 'success');
    }).catch(err => {
        showToast('❌ Failed to copy token', 'danger');
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
                <label class="uri-parameter-label">
                    <strong>{${param}}</strong>
                </label>
                <input type="text" class="uri-parameter-input" 
                       data-param="${param}" 
                       placeholder="Enter ${param} value"
                       title="Parameter for ${param}">
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
    
    // Apply parameters to URI
    if (validParamCount > 0) {
        uri += '?' + params.toString();
        showToast(`✅ Applied ${validParamCount} query parameter(s)`, 'success');
    } else {
        showToast('⚠️ No valid query parameters to apply', 'warning');
    }
    
    // Update the URI input
    uriInput.value = uri;
}

// Configuration management
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
            'https://graph.microsoft.com/Contacts.Read': 'contacts-read',
            'https://graph.microsoft.com/People.Read': 'people-read',
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
                        const allItemsInGroup = groupCheckbox.closest('.scope-group').querySelectorAll('.scope-checkbox');
                        const checkedItemsInGroup = groupCheckbox.closest('.scope-group').querySelectorAll('.scope-checkbox:checked');
                        
                        if (allItemsInGroup.length === checkedItemsInGroup.length) {
                            groupCheckbox.checked = true;
                        }
                    }
                }
            } else if (scope === 'offline_access') {
                // Check offline_access checkbox
                const offlineAccessCheckbox = document.getElementById('offline-access');
                if (offlineAccessCheckbox) {
                    offlineAccessCheckbox.checked = true;
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
    
    expirationTextEl.textContent = expirationText;
    expirationTextEl.className = diffMinutes < 5 ? 'text-warning' : 'text-success';
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

// JSON Viewer utilities
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
            navigator.clipboard.writeText(keyText).then(() => {
                showToast(`✅ Copied key: ${keyText}`, 'success');
            }).catch(err => {
                showToast('❌ Failed to copy key', 'danger');
            });
        });
        
        $elem.after($copyBtn);
    });
    
    // Add copy buttons to string values
    $(containerId).find('.json-value').each(function() {
        const $elem = $(this);
        
        if (!$elem.hasClass('json-string') || $elem.next('.copy-btn-value').length > 0) {
            return;
        }
        
        const valueText = $elem.text().replace(/['"]/g, '');
        
        // Skip empty or very short values
        if (!valueText || valueText.length < 3) {
            return;
        }
        
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn-value p-0 ms-1" title="Copy value" style="font-size: 0.8rem; opacity: 0.5; color: #28a745; background: rgba(40,167,69,0.1); border-radius: 3px; padding: 1px 3px!important;">');
        $copyBtn.html('<i class="bi bi-copy"></i>');
        
        $copyBtn.hover(
            function() {
                $(this).css({
                    'opacity': '1',
                    'background': 'rgba(40,167,69,0.2)',
                    'color': '#1e7e34'
                });
            },
            function() {
                $(this).css({
                    'opacity': '0.5',
                    'background': 'rgba(40,167,69,0.1)',
                    'color': '#28a745'
                });
            }
        );
        
        $copyBtn.on('click', function(e) {
            e.stopPropagation();
            navigator.clipboard.writeText(valueText).then(() => {
                showToast(`✅ Copied: ${valueText.length > 30 ? valueText.substring(0, 30) + '...' : valueText}`, 'success');
            }).catch(err => {
                showToast('❌ Failed to copy value', 'danger');
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