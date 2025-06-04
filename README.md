# FlexPay SaaS - Multi-Tenant Invoice Management

A modern, multi-tenant SaaS platform for managing invoices, clients, and payments. Built with Next.js, Supabase, and Tailwind CSS.

---

## Features
- **Multi-tenant**: Each business has its own clients, invoices, and settings
- **Google Authentication**: Secure login with Google OAuth
- **Admin Onboarding**: System admins can onboard new businesses and assign admin users
- **Business Settings**: Businesses can view and edit their profile and preferences
- **Client Management**: Add, edit, and manage clients per business
- **Invoice Management**: Create, edit, and track invoices
- **Payments (coming soon)**: Manage and track payments
- **Dashboard**: Real-time stats and recent activity for each business
- **Responsive UI**: Built with Tailwind CSS and shadcn/ui

---

## Tech Stack
- [Next.js](https://nextjs.org/) (App Router)
- [Supabase](https://supabase.com/) (Database & Auth)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/) (Deployment)

---

## Getting Started

### 1. Clone the repository
```sh
git clone <YOUR_GIT_URL>
cd flex-pay-tracker-saas
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
- Get your Supabase URL and anon key from your Supabase project settings.
- For production, set `NEXT_PUBLIC_SITE_URL` to your deployed URL.

### 4. Run the development server
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment
- Deploy easily to [Vercel](https://vercel.com/)
- Set the same environment variables in your Vercel project settings
- Add your Vercel URL to Supabase Auth redirect URLs

---

## Database Schema (Supabase)
- `businesses`: Stores business info (name, email, etc.)
- `profiles`: Stores user info
- `business_users`: Links users to businesses with roles
- `clients`: Stores client info per business
- `invoices`: Stores invoices per business
- `payments`: (coming soon)

---

## Contributing
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License
MIT
