// API Testing Module

// Initialize API testing functionality
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
    
    // Parse body for POST/PUT/PATCH requests
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(method) && bodyText) {
        try {
            body = JSON.parse(bodyText);
        } catch (e) {
            resultDiv.innerHTML = '<div class="alert alert-danger">Invalid JSON in body field.</div>';
            return;
        }
    }
    
    // Show loading state
    resultDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            <span>Sending ${method} request to ${url}...</span>
        </div>
    `;
    
    try {
        const response = await axios.post('/api/graph', {
            method,
            url,
            token,
            headers,
            body
        });
        
        if (response.data.success) {
            displayApiResponse(method, url, response.data.response);
        } else {
            throw new Error(response.data.error || 'Unknown error');
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <h6>❌ Request Failed</h6>
                <p><strong>Error:</strong> ${error.response?.data?.error || error.message}</p>
                ${error.response?.data?.details ? `<p><strong>Details:</strong> ${error.response.data.details}</p>` : ''}
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
    
    // Add copy buttons to string values
    $('#responseJsonViewer').find('.json-value').each(function() {
        const $elem = $(this);
        
        // Only add to string values and skip if already has copy button
        if (!$elem.hasClass('json-string') || $elem.next('.copy-btn-value').length > 0) {
            return;
        }
        
        // Get value without quotes
        let value = $elem.text().replace(/^"|"$/g, '');
        
        // Skip empty values or very short ones
        if (!value || value.length < 3) {
            return;
        }
        
        // Create copy button for value
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn-value p-0 ms-1" title="Copy value" style="font-size: 0.8rem; opacity: 0.5; color: #28a745; background: rgba(40,167,69,0.1); border-radius: 3px; padding: 1px 3px!important;">');
        $copyBtn.html('<i class="bi bi-copy"></i>');
        
        // Add hover effects
        $copyBtn.on('mouseenter', function() {
            $(this).css({
                'opacity': '1',
                'background': 'rgba(40,167,69,0.2)',
                'color': '#1e7e34'
            });
        }).on('mouseleave', function() {
            $(this).css({
                'opacity': '0.5',
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

// Load selected API functionality for Step 3
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
            uri: `/me/calendarView?startDateTime=${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01T00:00:00&endDateTime=${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getFullYear()}-${String(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getMonth() + 1).padStart(2, '0')}-${String(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()).padStart(2, '0')}T23:59:59`,
            body: ''
        },
        'calendar-create': {
            method: 'POST',
            uri: '/me/events',
            body: JSON.stringify({
                subject: "Test Meeting via API",
                start: {
                    dateTime: (() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(9, 0, 0, 0);
                        return tomorrow.toISOString().slice(0, -5);
                    })(),
                    timeZone: "Asia/Jakarta"
                },
                end: {
                    dateTime: (() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(10, 0, 0, 0);
                        return tomorrow.toISOString().slice(0, -5);
                    })(),
                    timeZone: "Asia/Jakarta"
                },
                body: {
                    contentType: "HTML",
                    content: "<p>Test meeting created via Microsoft Graph API</p>"
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
        
        // Chat APIs  
        'chats-list': {
            method: 'GET',
            uri: '/me/chats?$top=20',
            body: ''
        },
        'chats-messages': {
            method: 'GET',
            uri: '/me/chats/{chat-id}/messages?$top=10',
            body: ''
        }
    };
    
    const config = apiConfigs[selectedValue];
    if (config) {
        document.getElementById('httpMethod').value = config.method;
        document.getElementById('requestUri').value = config.uri;
        document.getElementById('requestBody').value = config.body;
        
        showToast(`✅ Loaded API configuration for ${selectedValue}`, 'info');
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
    
    // Add copy buttons to string values in simple viewer
    $('#responseJsonViewerSimple').find('.json-value').each(function() {
        const $elem = $(this);
        
        // Only add to string values and skip if already has copy button
        if (!$elem.hasClass('json-string') || $elem.next('.copy-btn-value').length > 0) {
            return;
        }
        
        // Get value without quotes
        let value = $elem.text().replace(/^"|"$/g, '');
        
        // Skip empty values or very short ones
        if (!value || value.length < 3) {
            return;
        }
        
        // Create copy button for value
        const $copyBtn = $('<button class="btn btn-link btn-sm copy-btn-value p-0 ms-1" title="Copy value" style="font-size: 0.8rem; opacity: 0.5; color: #28a745; background: rgba(40,167,69,0.1); border-radius: 3px; padding: 1px 3px!important;">');
        $copyBtn.html('<i class="bi bi-copy"></i>');
        
        // Add hover effects
        $copyBtn.on('mouseenter', function() {
            $(this).css({
                'opacity': '1',
                'background': 'rgba(40,167,69,0.2)',
                'color': '#1e7e34'
            });
        }).on('mouseleave', function() {
            $(this).css({
                'opacity': '0.5',
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