import { createClient } from '@supabase/supabase-js';
import type { Property, Project } from '../types';

// =================================================================================
// Supabase Configuration
// =================================================================================
// The credentials below have been configured with the values you provided.
//
// IMPORTANT: For a real-world application, use environment variables to store these
// credentials securely, rather than hardcoding them in your source code.
// =================================================================================

const supabaseUrl = 'https://dbqoqgzrpxyavhzcpchc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicW9xZ3pycHh5YXZoemNwY2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTAzMjEsImV4cCI6MjA3MzE4NjMyMX0.xuZsqEAmtLePFcXRs1ORaf6_1ylvQz_78jvt3rlwV8E';

if (!supabaseUrl || !supabaseAnonKey) {
  // Friendly error for the developer if credentials are missing.
  const errorMessage = "Supabase URL or API key is missing. Please check your configuration in `services/supabase.ts`.";
  
  // Display a helpful message in the UI if the root element exists
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: sans-serif; color: #333;">
        <h1 style="color: #dc2626;">Configuration Error</h1>
        <p style="font-size: 1.1rem; line-height: 1.6;">${errorMessage}</p>
        <p>Please check the browser console for more details.</p>
      </div>
    `;
  }
  
  throw new Error(errorMessage);
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type mapping for Supabase tables
export type TypedSupabaseClient = typeof supabase;
export type ProjectRow = Project;
export type PropertyRow = Property;