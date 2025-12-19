-- SmartLink Database Initialization Script
-- This script runs automatically when PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE smartlink TO smartlink;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'SmartLink database initialized successfully!';
END $$;
