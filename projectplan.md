# Roast My Landing Page - Implementation Plan

     Overview
     - This project is a web app where users upload a landing page screenshot, get a
     brutal funny roast, and an "AI Slop Score" (0-100).
     - The app will be hosted on Vercel.
     Tech Stack: Next.js 14 (App Router) + Tailwind CSS + Claude API     
     Design: Dark & edgy (black background, neon orange/pink accents)    

     ---
     ###Project Structure

     landing-page-roaster/
     ├── app/
     │   ├── layout.tsx           # Root layout with dark theme
     │   ├── page.tsx             # Homepage with upload + results UI    
     │   ├── globals.css          # Dark theme, neon effects
     │   └── api/roast/route.ts   # Claude API endpoint
     ├── components/
     │   ├── DropZone.tsx         # Drag-and-drop image upload
     │   ├── RoastDisplay.tsx     # Shows roast text
     │   ├── SlopScore.tsx        # Animated score meter (0-100)
     │   └── LoadingState.tsx     # Loading animation
     ├── lib/
     │   ├── prompts.ts           # Claude system/user prompts
     │   └── claude.ts            # Response parser
     ├── .env.local               # ANTHROPIC_API_KEY
     ├── tailwind.config.ts       # Custom neon colors
     └── package.json

     ---
     ###Dependencies

     npx create-next-app@latest . --typescript --tailwind --app
     --src-dir=false
     npm install @anthropic-ai/sdk react-dropzone framer-motion

     ---
     ###Implementation Steps

     Step 1: Project Setup

     - Initialize Next.js with TypeScript + Tailwind
     - Install dependencies: @anthropic-ai/sdk, react-dropzone,
     framer-motion
     - Create .env.local with ANTHROPIC_API_KEY=your_key_here
     - Configure Tailwind with neon colors (#ff6b35, #ff0080)

     Step 2: Layout & Styling

     - app/layout.tsx: Dark background (#0a0a0a), Inter font
     - app/globals.css: Neon glow effects, button styles

     Step 3: DropZone Component

     - Drag-and-drop or click to upload
     - Accept: PNG, JPG, WebP (max 5MB)
     - Convert image to base64 for API
     - Show image preview after upload
     - Neon border glow on hover/drag

     Step 4: API Route (/api/roast)

     - POST endpoint receiving { image: base64, mimeType: string }       
     - Call Claude with vision (claude-sonnet-4-20250514)
     - System prompt: Roast comedian persona, specific critique of       
     copy/design
     - Return: { roast: string, slopScore: number }
     - Parse JSON from Claude response with fallback handling

     Step 5: Claude Prompts

     System prompt key points:
     - Brutal but funny roast comedian personality
     - Focus on: copy, design, layout, AI slop indicators
     - Output strict JSON: { roast, slopScore, slopReasoning }
     - Score guidelines: 0-20 original, 41-60 template vibes, 81-100     
     maximum slop

     Step 6: Results Components

     - SlopScore.tsx: Circular meter, animated count-up, color-coded     
     (green→yellow→red)
     - RoastDisplay.tsx: Roast text with copy button, share on X
     button
     - LoadingState.tsx: Flame animation + rotating messages
     ("Measuring the cringe...")

     Step 7: Main Page State Flow

     Initial → Image Uploaded → Loading → Results
     - State: uploadedImage, roastResult, isLoading, error
     - "Get Roasted" button triggers API call
     - "Roast Again" resets to initial state

     Step 8: Polish

     - Mobile responsive (stack vertically on small screens)
     - Framer Motion animations for reveals
     - Error handling with friendly messages

     ---
     ### API Route Code Structure

     // app/api/roast/route.ts
     POST /api/roast
     Request:  { image: string, mimeType: string }
     Response: { roast: string, slopScore: number }

     // Uses Claude vision API with base64 image
     // Parses JSON response with regex fallback

     ---
     ### UI States

     1. Empty: DropZone with "Drag & drop your landing page"
     2. Uploaded: Image preview + "GET ROASTED" button
     3. Loading: Dimmed image + flame animation + funny loading text     
     4. Results: Score meter + roast text + share buttons + "Roast       
     Again"

     ---
     ### Before Starting

     User needs to:
     1. Get Claude API key from https://console.anthropic.com
     2. Have Node.js installed

     ---
     Critical Files

     | File                     | Purpose
                    |
     |--------------------------|------------------------------------    
     ---------------|
     | app/api/roast/route.ts   | Claude API integration, keeps API      
     key server-side |
     | lib/prompts.ts           | Prompt engineering for quality
     roasts             |
     | components/DropZone.tsx  | Image upload and base64 conversion     
                    |
     | app/page.tsx             | Main state management and UI flow      
                    |
     | components/SlopScore.tsx | Signature animated score feature       
                    |