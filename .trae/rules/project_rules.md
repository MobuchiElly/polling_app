# Polling App with QR Code Sharing

## Project Overview  
This project is a Polling Application that allows registered users to create polls, share them via unique links and QR codes, and view results.  
Voters (registered or anonymous) can access polls through links or QR codes and cast votes.  
The app demonstrates AI-assisted development by integrating AI tools in planning, coding, debugging, testing, and deployment.  

## Technology Stack 
- Framework: Next.js (App Router)  
- Database & Auth: Supabase (Postgres + Supabase Auth)  
- UI Library: shadcn/ui components  
- Forms & Validation: react-hook-form + zod  
- QR Code: qrcode library (or similar) for poll sharing  
- Deployment: Vercel  

## 1. Folder Structure  
- Pages go in /app/... (App Router).  
- API routes go in /app/api/.../route.ts.  
- UI components go in /components/....  
- Supabase client config lives in /lib/supabaseClient.ts.  

## 2. Forms  
- Always use react-hook-form + zod for form validation.  
- Use shadcn/ui components (Form, Input, Button, Label).  
- Forms must include:  
  - Validation schema  
  - Disabled state while submitting  
  - Error messages for invalid inputs  

## 3. Supabase Usage  
- Use /lib/supabaseClient.ts for browser-side Supabase calls.  
- Use @supabase/auth-helpers-nextjs for server-side session handling.    
- Each poll row includes: id, question, options[], created_by.
- Votes are tied to poll_id and voter session (if logged in).  

## 4. Polls & QR Codes  
- Poll schema:
  {
    id: string;
    question: string;
    options: string[];
    created_by: string;
    created_at: Date;
  }