# Song Archive Explorer

A modern web application for managing and playing your music collection. Built with React, TypeScript, and Supabase.

## Features

- Upload and manage audio files
- Create and organize playlists
- Rate and categorize songs
- Search and filter your music library
- Modern, responsive UI with dark mode support

## Tech Stack

- React 18
- TypeScript
- Vite
- Supabase (Authentication, Database, Storage)
- Tailwind CSS
- Shadcn/ui Components
- React Query
- React Router
- React Hook Form
- Zod Validation

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dbms_proj.git
cd dbms_proj
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # React components
├── context/       # React context providers
├── integrations/  # Third-party integrations
├── lib/          # Utility functions
├── pages/        # Page components
└── types/        # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
