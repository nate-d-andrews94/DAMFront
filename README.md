# DAM Frontend

Digital Asset Management (DAM) frontend application built with React, TypeScript, and Vite.

## Features

- File uploading with drag and drop support
- Metadata editing for uploaded files
- Folder organization
- Tag management for assets
- Filtering and searching capabilities
- Thumbnail generation

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Styled Components
- **State Management**: Zustand
- **API Communication**: TanStack Query (React Query)
- **Routing**: React Router
- **Database**: PostgreSQL
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the PostgreSQL database:
   ```
   npm run db:up
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Database Setup

The application uses PostgreSQL for storing asset metadata, folder structure, tags, and more. The database is automatically initialized with the required schema when you run `npm run db:up`.

To reset the database:
```
npm run db:reset
```

## Project Structure

```
├── db                    # Database related files
│   ├── init              # Database initialization scripts
│   └── migrations        # Database migrations
├── public                # Static assets
├── src                   # Application source
│   ├── components        # Reusable components
│   │   ├── assets        # Asset-related components
│   │   └── ui            # Generic UI components
│   ├── hooks             # Custom React hooks
│   ├── pages             # Application pages
│   │   ├── admin         # Admin section pages
│   │   └── browse        # Asset browsing pages
│   ├── services          # API services
│   │   └── db            # Database access layer
│   ├── stores            # State management stores
│   └── utils             # Utility functions
└── scripts               # Helper scripts
```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run db:up` - Start the database
- `npm run db:down` - Stop the database
- `npm run db:reset` - Reset the database

## Database Schema

The application uses the following database schema:

- **assets** - Stores metadata for uploaded files
- **folders** - Manages the folder structure
- **tags** - Stores tags for assets
- **asset_tags** - Junction table for assets and tags
- **filter_categories** - Organizes tags into categories
- **category_tags** - Junction table for tags and categories
- **asset_thumbnails** - Stores thumbnails for assets

## License

MIT