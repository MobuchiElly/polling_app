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

## 5. Landing Page Implementation Rules
1. Design System & Styling:
- Components: All UI components for the landing page MUST utilize shadcn/ui components where applicable to maintain a consistent and modern aesthetic.
- Styling: All styling MUST be implemented using Tailwind CSS. Avoid inline styles or custom CSS files unless absolutely necessary for highly specific, non-reusable styles.
- Responsiveness: The landing page MUST be fully responsive and adapt gracefully to all screen sizes (mobile, tablet, desktop). Prioritize a mobile-first design approach.

2. Imagery & Visuals:   
- Image Quality: All images used MUST be high-resolution, visually appealing, and relevant to the content.
- Image Optimization: All images MUST be optimized for web performance using the next/image component. This includes automatic lazy loading, responsive sizing, and modern format delivery (e.g., WebP).
- Background Images: When using background images, ensure they are high-quality, appropriately sized, and do not negatively impact text readability. Implement parallax effects or subtle animations for background images where appropriate to enhance visual appeal.
- Vector Graphics: Prefer SVG for icons, logos, and simple illustrations to ensure crispness and scalability across all devices.

3. Animations & Interactivity:
- Purposeful Animations: Animations MUST be subtle, sleek, and serve a clear purpose (e.g., guiding user attention, indicating interaction, enhancing visual flow). Avoid excessive or distracting animations.
- Performance: All animations MUST be performant and not cause jank or slow down the page. Utilize CSS transforms and opacity for smooth animations where possible.
- Libraries: Consider using lightweight animation libraries (e.g., Framer Motion, React Spring) for complex interactions, but ensure they are integrated efficiently.

4. Content & User Experience (UX):
- Clear Messaging: All text content MUST be concise, clear, and directly communicate the value proposition of the polling app.
- Call to Actions (CTAs): Primary and secondary CTAs MUST be prominent, clearly worded, and guide the user towards desired actions (e.g., "Create Your First Poll," "Sign Up").
- Accessibility: The landing page MUST adhere to WCAG guidelines for  accessibility. This includes proper semantic HTML, ARIA attributes where needed, sufficient color contrast, and keyboard navigation support.
- Loading States: Implement skeleton loaders or subtle loading indicators for any dynamic content to improve perceived performance.

5. Performance & SEO:
Next.js Features: Leverage Next.js features like Static Site Generation (SSG) for optimal loading speed.
- Metadata: Ensure proper SEO metadata (title, description, open graph tags) is configured for the landing page to improve search engine visibility and social sharing.
- Core Web Vitals: Strive to achieve excellent scores for Core Web Vitals (LCP, FID, CLS) to ensure a fast and smooth user experience.