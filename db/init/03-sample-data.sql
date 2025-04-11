-- Sample data for development

-- Get root folder id
DO $$
DECLARE
  root_id UUID;
  images_id UUID;
  documents_id UUID;
  videos_id UUID;
  tag1_id UUID;
  tag2_id UUID;
  tag3_id UUID;
  tag4_id UUID;
  cat1_id UUID;
  cat2_id UUID;
BEGIN
  -- Get the root folder
  SELECT id INTO root_id FROM folders WHERE name = 'Root';
  
  -- Create sample folders
  INSERT INTO folders (name, parent_id, path) VALUES 
    ('Images', root_id, '/Images') RETURNING id INTO images_id;
  
  INSERT INTO folders (name, parent_id, path) VALUES 
    ('Documents', root_id, '/Documents') RETURNING id INTO documents_id;
  
  INSERT INTO folders (name, parent_id, path) VALUES 
    ('Videos', root_id, '/Videos') RETURNING id INTO videos_id;
  
  -- Create subfolders
  INSERT INTO folders (name, parent_id, path) VALUES 
    ('Photos', images_id, '/Images/Photos'),
    ('Graphics', images_id, '/Images/Graphics'),
    ('Marketing', documents_id, '/Documents/Marketing'),
    ('Tutorials', videos_id, '/Videos/Tutorials');
  
  -- Create sample tags
  INSERT INTO tags (name) VALUES 
    ('marketing') RETURNING id INTO tag1_id;
  
  INSERT INTO tags (name) VALUES 
    ('product') RETURNING id INTO tag2_id;
  
  INSERT INTO tags (name) VALUES 
    ('social media') RETURNING id INTO tag3_id;
  
  INSERT INTO tags (name) VALUES 
    ('tutorial') RETURNING id INTO tag4_id;
  
  -- Create sample filter categories
  INSERT INTO filter_categories (name) VALUES 
    ('Purpose') RETURNING id INTO cat1_id;
  
  INSERT INTO filter_categories (name) VALUES 
    ('Content Type') RETURNING id INTO cat2_id;
  
  -- Associate tags with categories
  INSERT INTO category_tags (category_id, tag_id) VALUES
    (cat1_id, tag1_id),
    (cat1_id, tag2_id),
    (cat2_id, tag3_id),
    (cat2_id, tag4_id);
  
  -- Create sample assets (without actual files)
  INSERT INTO assets (filename, folder_id, file_path, file_size, mime_type, extension, metadata) VALUES
    ('product_hero.jpg', images_id, '/uploads/images/product_hero.jpg', 2500000, 'image/jpeg', 'jpg', 
     '{"description": "Product hero image", "dimensions": "1920x1080", "photographer": "John Doe"}'::jsonb),
    
    ('marketing_plan_2023.pdf', documents_id, '/uploads/documents/marketing_plan_2023.pdf', 5000000, 'application/pdf', 'pdf',
     '{"description": "Marketing plan for 2023", "department": "Marketing", "author": "Jane Smith"}'::jsonb),
    
    ('product_demo.mp4', videos_id, '/uploads/videos/product_demo.mp4', 15000000, 'video/mp4', 'mp4',
     '{"description": "Product demonstration video", "duration": "00:03:45", "resolution": "1080p"}'::jsonb),
    
    ('social_banner.png', images_id, '/uploads/images/social_banner.png', 1200000, 'image/png', 'png',
     '{"description": "Social media banner", "dimensions": "1200x628", "designer": "Alex Johnson"}'::jsonb);
  
  -- Add tags to assets
  INSERT INTO asset_tags (asset_id, tag_id)
  SELECT a.id, tag2_id FROM assets a WHERE a.filename = 'product_hero.jpg'
  UNION
  SELECT a.id, tag1_id FROM assets a WHERE a.filename = 'marketing_plan_2023.pdf'
  UNION
  SELECT a.id, tag2_id FROM assets a WHERE a.filename = 'product_demo.mp4'
  UNION
  SELECT a.id, tag4_id FROM assets a WHERE a.filename = 'product_demo.mp4'
  UNION
  SELECT a.id, tag3_id FROM assets a WHERE a.filename = 'social_banner.png';
  
END $$;