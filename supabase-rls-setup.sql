-- =============================================
-- Enable RLS on bookmarks table
-- =============================================

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Create RLS Policies
-- =============================================

-- Policy 1: Users can SELECT their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can INSERT their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can DELETE their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- Optional: Create index for better performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
