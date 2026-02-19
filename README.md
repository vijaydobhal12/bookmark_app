# Bookmark App

A modern bookmark management application built with Next.js 16, Supabase, and Tailwind CSS. Save, organize, and manage your favorite links with a beautiful, responsive interface.

## Features

- 🔐 **Google Authentication** - Secure sign-in with Google OAuth
- 📚 **Bookmark Management** - Add, view, and delete bookmarks
- 💾 **Persistent Storage** - All data stored in Supabase database
- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🔍 **Search Functionality** - Find your bookmarks quickly
- ⭐ **Saved Bookmarks** - Access your saved favorites easily

## Tech Stack

- **Frontend**: Next.js 16 (React 19)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 4
- **Animations**: AOS (Animate On Scroll)
- **Icons**: Lucide React
- **Language**: TypeScript

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ installed
- A Supabase account (free tier works)
- Google Cloud Console project (for OAuth)

## Installation

1. **Clone the repository**
   
```
bash
   git clone <repository-url>
   cd bookmark-app
   
```

2. **Install dependencies**
   
```
bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   
```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   
```
env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
```

## Supabase Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project

2. **Create the bookmarks table**
   In Supabase SQL Editor, run:
   
```
sql
   CREATE TABLE bookmarks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID NOT NULL,
     url TEXT NOT NULL,
     title TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
```

3. **Set up Google OAuth**
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Enter your Google Cloud Console credentials:
     - Client ID
     - Client Secret
   - Add your app URL to "Redirect URLs"

4. **Get your credentials**
   - Go to Project Settings → API
   - Copy the "Project URL" and "anon public" key

## Available Scripts

```
bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run build
npm start

# Run linter
npm run lint
```

## Project Structure

```
bookmark-app/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   │   ├── callback/      # OAuth callback handler
│   │   └── login/         # Login page
│   ├── components/        # Reusable UI components
│   │   ├── AOSInit.tsx    # Animation initialization
│   │   ├── BookmarkForm.tsx
│   │   ├── BookmarkItem.tsx
│   │   ├── BookmarkList.tsx
│   │   ├── BottomTabs.tsx
│   │   └── Loader.tsx
│   ├── lib/               # Supabase client
│   ├── saved/             # Saved bookmarks page
│   ├── search/            # Search page
│   ├── services/          # API services
│   │   ├── auth.ts        # Authentication functions
│   │   └── bookmarks.ts   # Bookmark CRUD operations
│   ├── styles/            # Additional styles
│   ├── types/             # TypeScript types
│   │   └── bookmark.ts
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Additional utilities
│   └── supabase/          # Supabase configuration
├── public/                # Static assets
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home - View all bookmarks |
| `/saved` | View saved/bookmarked items |
| `/search` | Search through bookmarks |
| `/auth/login` | Login with Google |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [AOS Animation](https://michalsnik.github.io/aos/)
