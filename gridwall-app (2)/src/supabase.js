import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fohgnryqccvpzjbdcxuo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaGducnlxY2N2cHpqYmRjeHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjkzMzMsImV4cCI6MjA5ODMwNTMzM30.xGCBOqgNAN25_y5pO_B-6qca6cGS7YO2-FaHOP9SDkU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
