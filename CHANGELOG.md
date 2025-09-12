# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-01-12

### Added
- Enhanced scope selection UI with categorized groups:
  - User Profile & Identity
  - Calendar & Scheduling  
  - Files & SharePoint
  - Microsoft Teams & Chat
  - Authentication & Authorization
- Selected scopes display with bullet list format
- Custom scope input functionality with Enter key support
- Individual scope removal with × buttons
- Files.Read.All and Sites.Read.All scopes support

### Enhanced
- Automatic scope persistence - saves on check/uncheck
- Real-time scope updates in selected scopes list
- Comprehensive debugging for scope loading
- Improved scope management with auto-save triggers
- Better error handling and user feedback

### Fixed
- Scope persistence across page refreshes
- Checkbox state restoration from saved configuration
- Group checkbox synchronization
- Auto-save functionality for all scope changes

## [1.1.0] - 2025-01-10

### Added
- OneDrive Files.Read scope support in step 1
- 12 OneDrive API endpoints for file and folder operations
- OneDrive API examples in step 3 selector
- Read-only file operations: browse, search, download, thumbnails

### Fixed
- Missing toggleStep function causing JavaScript errors
- UI accordion behavior for step navigation

## [1.0.1] - 2025-01-10 - Previous

### Changed
- Split large `app.js` file (2567 lines) into smaller modules:
  - `api-services.js` - API configurations and scopes
  - `scope-management.js` - OAuth scope handling
  - `api-testing.js` - API testing features
  - `utils.js` - Common utilities
  - `app.js` - Main initialization (90 lines)
- Updated layout to load modules in correct order

### Improved
- Code organization and maintainability
- Easier to debug and modify individual features

## [Previous Changes]

### Added
- Single token storage for simplified management
- Refresh token support
- Checkbox-based scope selection
- Direct Azure AD API integration

### Fixed
- Token refresh functionality
- OAuth2 authorization flow
- UI responsiveness

### Removed
- Manual scope input field
- Complex multi-token storage
- Unused configuration files

---

## Notes

**For Developers**: Functions moved to appropriate modules but remain globally accessible.

**For Users**: No changes needed - all functionality preserved.