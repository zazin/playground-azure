# Changelog

All notable changes to the Azure OAuth2 Playground project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Modular JavaScript architecture with separated concerns
- Individual modules for API services, scope management, API testing, and utilities
- Enhanced maintainability and code organization

### Changed
- **BREAKING**: Refactored monolithic `app.js` (2567 lines) into focused modules:
  - `api-services.js`: Microsoft Graph API configurations and OAuth scopes
  - `scope-management.js`: OAuth scope selection and validation logic
  - `api-testing.js`: API testing functionality and response handling
  - `utils.js`: Common utilities, toast notifications, and helper functions
  - `app.js`: Main entry point and application initialization (90 lines)
- Updated `layout.ejs` to load JavaScript modules in proper dependency order

### Improved
- Code maintainability through separation of concerns
- Developer experience with focused, single-responsibility modules
- Performance through better code organization and potential caching

## [Previous Releases]

### Added
- Single token storage approach for simplified token management
- Step 2 display improvements for better user experience
- Refresh token support with `grant_type=refresh_token`
- Direct Azure AD API calls for obtaining refresh tokens
- Checkbox-based scope selection instead of manual input

### Changed
- Simplified token management by removing multiple token storage complexity
- Improved OAuth2 flow with better error handling and user feedback

### Removed
- Manual scope input field in favor of intuitive checkbox selection
- Unused configuration view file (`config.ejs`)
- Complex multi-token storage system

### Fixed
- Token refresh functionality with proper error handling
- OAuth2 authorization flow stability
- UI responsiveness and user experience improvements

---

## Release Notes

### Modular Architecture (Latest)
The latest update introduces a complete architectural overhaul, splitting the monolithic JavaScript file into focused, maintainable modules. This change significantly improves:

- **Developer Experience**: Each module has a clear, single responsibility
- **Maintainability**: Easier to debug, test, and extend individual features
- **Performance**: Better code organization enables optimizations
- **Collaboration**: Multiple developers can work on different modules simultaneously

### Token Management Improvements
Previous releases focused on simplifying the OAuth2 token management system:

- Streamlined from complex multi-token to single token approach
- Enhanced refresh token handling with proper Azure AD integration
- Improved user experience with better visual feedback

### Scope Management Evolution
The scope selection system has evolved from manual input to user-friendly checkboxes:

- Intuitive interface for selecting Microsoft Graph permissions
- Automatic scope validation and formatting
- Support for custom scopes when needed

---

## Migration Guide

### For Developers Working with the Codebase

If you're working with the codebase and have customizations:

1. **Function Locations**: Functions have been moved to appropriate modules:
   - API configurations → `api-services.js`
   - Scope handling → `scope-management.js`
   - Testing features → `api-testing.js`
   - Utilities → `utils.js`

2. **Dependencies**: Ensure all modules are loaded in the correct order (as defined in `layout.ejs`)

3. **Global Functions**: Most functions remain globally accessible, maintaining backward compatibility

### For End Users

No migration is required for end users. The application functionality remains the same with improved performance and reliability.

---

## Support

For questions, issues, or contributions:
- Email: nurza.cool@gmail.com
- Create issues for bug reports or feature requests
- Follow semantic versioning for any contributions