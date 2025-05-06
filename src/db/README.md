
# Database Setup Instructions

This project supports two data sources:

1. Mock data (default, requires no setup)
2. PostgreSQL via Supabase (requires configuration)

## Using Mock Data

The application uses mock data by default, which requires no setup. This is useful for development and testing purposes.

## Setting up PostgreSQL Database

To use a real PostgreSQL database:

1. Install PostgreSQL on your system
2. Create a new database for the application
3. Run the schema.sql script to create the necessary tables:

```bash
psql -U your_username -d your_database_name -f schema.sql
```

4. Configure Supabase (if using) or update the database connection settings in your environment

## Switching Between Data Sources

You can switch between mock data and PostgreSQL at runtime from the Settings page in the application.

## Schema Migration

If you modify the database schema, update the schema.sql file and run it on your PostgreSQL database.

For Supabase, you should create a new migration file in the supabase/migrations directory.

## Local Development with Supabase

For local development with Supabase:

1. Install the Supabase CLI
2. Run `supabase start`
3. The application will automatically connect to your local Supabase instance when you select "PostgreSQL (Supabase)" in the settings

## Production Deployment

In production, ensure your PostgreSQL database is properly secured and configured:

1. Enable SSL connections
2. Configure proper authentication
3. Set up backups
4. Apply all necessary migrations
