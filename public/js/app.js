// Main Application Entry Point
// This file serves as the entry point and initialization for all modules

// Initialize the application when DOM is loaded
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
    
    // Update custom scopes based on checked checkboxes (including offline_access)
    updateCustomScopes();
    
    // Start token expiration timer if token exists
    if (document.getElementById('tokenExpiration')) {
        startTokenExpirationTimer();
    }
    
    // Initialize request body visibility based on default method
    toggleRequestBody();
    
    // Initialize query parameter detection
    detectQueryParameters();
    
    // Initialize API testing functionality
    initializeApiTesting();
    
    // Initialize scope selector
    initializeScopeSelector();
    
    // Check for original token response display
    checkForOriginalTokenResponse();
    
    // Add event listeners for URI changes to detect parameters
    const requestUriInput2 = document.getElementById('requestUri');
    if (requestUriInput2) {
        requestUriInput2.addEventListener('input', () => {
            detectUriParameters();
            detectQueryParameters();
        });
    }
    
    // Add event listener for HTTP method changes to toggle request body
    const httpMethodSelect = document.getElementById('httpMethod');
    if (httpMethodSelect) {
        httpMethodSelect.addEventListener('change', toggleRequestBody);
    }
    
    // Initialize configuration auto-save for scope changes
    const configFields = ['clientId', 'clientSecret', 'tenantId', 'redirectUri'];
    configFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', debounce(() => {
                if (typeof autoSaveConfiguration === 'function') {
                    autoSaveConfiguration();
                }
            }, 1000));
        }
    });
});

// Debounce function to prevent excessive auto-save calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}