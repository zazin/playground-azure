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
    },
    
    // OneDrive/Files Endpoints
    {
        name: 'Get My Drive',
        category: 'OneDrive',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/drive',
        headers: {},
        body: null,
        description: 'Get information about your OneDrive'
    },
    {
        name: 'Get Root Folder Items',
        category: 'OneDrive',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/drive/root/children',
        headers: {},
        body: null,
        description: 'Get files and folders in your OneDrive root'
    },
    {
        name: 'Get Recent Files',
        category: 'OneDrive',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/drive/recent',
        headers: {},
        body: null,
        description: 'Get recently accessed files from OneDrive'
    },
    {
        name: 'Search Files',
        category: 'OneDrive',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/drive/root/search(q=\'document\')',
        headers: {},
        body: null,
        description: 'Search for files containing "document" in OneDrive'
    },
    {
        name: 'Get File by ID',
        category: 'OneDrive',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/drive/items/{file-id}',
        headers: {},
        body: null,
        description: 'Get specific file metadata (replace {file-id})'
    },
    {
        name: 'Get Folder Contents',
        category: 'OneDrive',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/drive/items/{folder-id}/children',
        headers: {},
        body: null,
        description: 'Get contents of a specific folder (replace {folder-id})'
    },
    {
        name: 'Download File Content',
        category: 'OneDrive',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/drive/items/{file-id}/content',
        headers: {},
        body: null,
        description: 'Download file content (replace {file-id})'
    },
    {
        name: 'Get File Thumbnail',
        category: 'OneDrive',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/drive/items/{file-id}/thumbnails/0/medium',
        headers: {},
        body: null,
        description: 'Get medium-sized thumbnail of a file (replace {file-id})'
    },
    {
        name: 'Create Folder',
        category: 'OneDrive',
        method: 'POST',
        url: 'https://graph.microsoft.com/v1.0/me/drive/root/children',
        headers: {},
        body: {
            name: "New Folder from API",
            folder: {},
            "@microsoft.graph.conflictBehavior": "rename"
        },
        description: 'Create a new folder in OneDrive root'
    },
    {
        name: 'Upload Small File',
        category: 'OneDrive',
        method: 'PUT',
        url: 'https://graph.microsoft.com/v1.0/me/drive/root:/test-file.txt:/content',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: "Hello from Microsoft Graph API! This is test content.",
        description: 'Upload a small text file to OneDrive root'
    },
    {
        name: 'Get Shared Files',
        category: 'OneDrive',
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/drive/sharedWithMe',
        headers: {},
        body: null,
        description: 'Get files shared with you'
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