# Event Ticket Management System - Implementation Notes

## Core Features
- Event creation and management
- Ticket generation with QR codes
- Check-in/Check-out functionality
- Email notifications
- User role-based access control

## Data Models

### Event
- `id`: Unique identifier
- `name`: Event name
- `description`: Event description
- `startTime`: Event start time
- `location`: Event location
- `duration`: Event duration
- `organizerId`: ID of organizing entity
- `createdAt`: Creation timestamp
- `createdBy`: Username of creator
- `bannerImage`: Path to event banner image
- `status`: Event status (DRAFT, PUBLISHED, CANCELLED, COMPLETED)
- `isDeleted`: Soft delete flag
- `deletedAt`: Deletion timestamp
- `qr`: Path to event QR code

### Ticket
- `id`: Unique identifier
- `eventId`: Associated event ID
- `area`: Seating/area information
- `seat`: Seat number/identifier
- `email`: Ticket holder's email
- `status`: Current status (Active, CheckedIn, Used, Expired)
- `checkInTime`: Timestamp of check-in
- `checkOutTime`: Timestamp of check-out
- `qr`: Path to QR code image
- `createdAt`: Creation timestamp

### User
- `id`: Unique identifier (UUID)
- `username`: User's username
- `password`: Hashed password
- `firstName`: User's first name
- `lastName`: User's last name
- `role`: User role (ADMIN, ORGANIZER_ADMIN, SCANNER)
- `organizerId`: Associated organization ID for ORGANIZER_ADMIN and SCANNER roles

### Organizer
- Organization entity that can manage events
- Has associated admin users

## Key Components

### Authentication & Authorization
- Session-based authentication
- Return URL support for redirects
- Friendly login prompts
- Protected route middleware
- Role-based access control
- Organization-level permissions
- Automatic redirection to login

### Security Features
- Protected routes with auth guards
- Secure session handling
- Return URL validation
- Access control by organization
- Role hierarchy enforcement
- Middleware-based protection
- User-friendly auth messages

### QR Code System
- Generates unique QR codes for tickets
- QR codes link to ticket verification endpoint
- Supports check-in/check-out workflow

### Email Service
- Sends ticket confirmation emails
- Supports event reminders
- Includes QR codes in emails

### File Management
- Handles event banner uploads
- Stores QR code images
- Organized by event ID
- Supports multiple image types
- Automatic directory creation
- Unique filename generation

### Event Management
- Soft delete support
- Status transitions
- Banner image management
- QR code generation
- Organizer association
- Event validation

### User Management
- Role-based access control
- Organization-based user management
- User CRUD operations by ADMIN and ORGANIZER_ADMIN
- Hierarchical permissions system
- Automatic organization assignment
- Profile management

### Access Control
- ADMIN: Full system access
- ORGANIZER_ADMIN: Organization-specific management
- SCANNER: Check-in/out functionality
- Organization-scoped operations
- Role-based UI adaptation

## API Endpoints

### Events
- `GET /events`: List upcoming events
- `POST /events/new`: Create new event
- `GET /events/:eventId`: View event details
- `POST /events/:eventId/edit`: Update event
- `POST /events/:eventId/upload-banner`: Upload event banner

### Tickets
- `POST /tickets/new`: Generate new ticket
- `GET /tickets/:id`: View ticket details
- `GET /tickets/:id/on-scan`: Process ticket scan
- `POST /tickets/:id/edit`: Update ticket details

### Users
- `GET /login`: Login page
- `POST /login`: Process login
- `GET /my-profile`: View user profile
- `POST /my-profile`: Update user profile

## Security Considerations
- Session-based authentication
- Role-based access control
- Secure password storage
- QR code validation

## User Interface
- Responsive design
- Role-based menu visibility
- Bootstrap-based components
- Unified form templates
- Mobile-friendly tables
- Action-based permissions

## User Experience
- Intuitive auth flow
- Clear feedback messages
- Seamless redirects
- Preserved user intent
- Context-aware prompts
- Mobile-responsive design
- Consistent UI patterns
