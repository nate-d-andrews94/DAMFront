-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to assets table
CREATE TRIGGER update_assets_modified
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Apply trigger to folders table
CREATE TRIGGER update_folders_modified
    BEFORE UPDATE ON folders
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Function to get full folder path recursively
CREATE OR REPLACE FUNCTION get_folder_path(folder_id UUID)
RETURNS TEXT AS $$
DECLARE
    result TEXT;
    current_folder RECORD;
BEGIN
    SELECT INTO current_folder * FROM folders WHERE id = folder_id;
    IF current_folder.parent_id IS NULL THEN
        RETURN current_folder.name;
    ELSE
        SELECT INTO result get_folder_path(current_folder.parent_id) || '/' || current_folder.name;
        RETURN result;
    END IF;
END;
$$ LANGUAGE plpgsql;
