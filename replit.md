# BloodConnect - Emergency Blood Donor Network

## Overview

BloodConnect is a real-time blood donor matching platform designed to connect blood donors with those in urgent need. The application features an AI-powered emergency response system that instantly matches blood requests with nearby verified donors using GPS proximity, blood type compatibility, and availability status. Built as a full-stack web application, it addresses critical gaps in existing blood donation systems by providing real-time notifications, interactive mapping, and a seamless user experience optimized for emergency situations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component system for accessibility and consistency
- **Styling**: Tailwind CSS with custom design system featuring dark theme and blood donation-specific color palette
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Animations**: GSAP for complex animations and Framer Motion for React component transitions
- **Forms**: React Hook Form with Zod validation for robust form handling
- **Maps**: Leaflet integration for interactive donor location mapping

### Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless configuration
- **Data Storage**: In-memory storage implementation with interface for database migration
- **Schema Validation**: Zod schemas shared between frontend and backend
- **API Design**: RESTful endpoints for donors, blood requests, and donor responses

### Data Storage Solutions
- **Database**: PostgreSQL configured for production with Neon serverless
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe queries
- **Schema Management**: Centralized schema definitions in shared directory
- **Migration System**: Drizzle Kit for database schema migrations
- **Development Storage**: In-memory storage with sample data for rapid development

### Authentication and Authorization
- **Current State**: Basic implementation without authentication (development phase)
- **Architecture**: Prepared for session-based authentication with connect-pg-simple
- **Security**: Foundation laid for role-based access control (donor vs admin)

### External Dependencies
- **Maps Service**: OpenStreetMap with Leaflet for donor location visualization
- **Fonts**: Google Fonts (Poppins, Inter) for typography
- **Icons**: Font Awesome for comprehensive icon library
- **Animation Libraries**: GSAP and ScrollTrigger for advanced animations
- **Database Hosting**: Neon serverless PostgreSQL for scalable data storage
- **UI Framework**: Radix UI for accessible, unstyled components

The application follows a modular architecture with clear separation between client and server code, shared type definitions, and a component-based UI structure optimized for emergency use cases with emphasis on speed and accessibility.