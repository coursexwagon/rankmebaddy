---
Task ID: 1
Agent: main
Task: Fix credits system, redesign auth page, fix onboarding, redesign landing page, deploy to Vercel

Work Log:
- Fixed credits system: increased FREE_CREDITS_PER_RESET from 25 to 100 for beta mode, PRO from 100 to 500
- Added BETA_BONUS_CREDITS (50 extra) for new users signing up during beta
- Added beta fallback logic: in beta mode, allow requests through even if Supabase credit record creation fails
- Added NEXT_PUBLIC_APP_URL env var for server-side credit verification in the chat API
- Redesigned auth page: dark modal with tabs (Sign up/Sign in), Google & Apple social login buttons, glassmorphism effects, email input with icons, turquoise accent color, close button, terms links, animated background blobs
- Fixed onboarding: changed all green (#6EE7B7) colors to turquoise (#00D4AA) to match dashboard accent
- Added "Product or business name" field to onboarding Step 1
- Updated localStorage save to include product field
- Redesigned landing page hero: replaced orbit visualization with floating glassmorphism cards (Keywords, SEO Score, Today's Tasks, Integrations), updated color scheme to use turquoise accent, added subtle grid background, updated headline to "Think, plan, and rank everywhere", changed CTA button to turquoise
- Updated credits hook default maxCredits from 25 to 100
- Deployed to Vercel with all env vars including NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_BETA_MODE

Stage Summary:
- App deployed at https://my-project-brown-iota.vercel.app
- Beta users now get 150 credits on signup (100 base + 50 beta bonus) with hourly reset
- Auth page now has modern dark modal with social login, tabs, glassmorphism
- Onboarding now asks for product/business name and uses consistent turquoise accent
- Landing page now has floating glassmorphism cards similar to the reference design
- All env vars properly set in Vercel
