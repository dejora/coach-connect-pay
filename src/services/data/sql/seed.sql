-- Insert default admin user if not exists
INSERT INTO profiles (id, name, email, role)
SELECT 
    uuid_generate_v4(),
    'Admin User',
    'admin@example.com',
    'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE role = 'admin'
);

-- Insert default preferences if not exists
INSERT INTO preferences (key, value)
VALUES
    ('maintenance_mode', 'false'::jsonb),
    ('site_url', '"https://coachconnect.app"'::jsonb),
    ('default_language', '"fr"'::jsonb)
ON CONFLICT (key) DO NOTHING; 