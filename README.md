# LaborConnect - AI-Powered Labor Marketplace

A comprehensive web application connecting temporary local laborers with employers, featuring AI voice assistance, multilingual support, and location-based matching.

## 🚀 Features

### Core Functionality
- **Dual User Roles**: Separate interfaces for laborers and employers
- **AI Voice Assistant**: Voice-guided profile creation and navigation
- **Multilingual Support**: Real-time translation with Google Translate API
- **Location-Based Matching**: GPS-enabled job search and matching
- **Real-time Communication**: In-app messaging with voice support
- **Smart Job Search**: AI-powered job recommendations
- **Interactive Maps**: Google Maps integration for job locations and directions
- **Secure Authentication**: Phone/email-based registration with verification
- **Rating System**: Two-way rating system for trust and quality
- **Payment Integration**: Secure payment processing (ready for Stripe/PayPal)

### Technical Features
- **Progressive Web App (PWA)**: Offline functionality and mobile optimization
- **Real-time Database**: Supabase integration with Row Level Security
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Voice Recognition**: Speech-to-text capabilities for profile creation
- **Geolocation Services**: Accurate location tracking and distance calculations
- **Modern UI/UX**: Smooth animations with Framer Motion

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons

### Backend & Database
- **Supabase** for database and authentication
- **PostgreSQL** with Row Level Security
- **Real-time subscriptions** for live updates

### APIs & Services
- **Google Maps API** for location services and mapping
- **Google Translate API** for multilingual support
- **Web Speech API** for voice recognition
- **Geolocation API** for location tracking

## 📋 Prerequisites

Before running the application, you'll need:

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Google Cloud Account**: Enable Maps and Translate APIs
3. **Node.js**: Version 16 or higher

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd labor-connect
npm install
```

### 2. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `database-setup.sql`
4. This will create all necessary tables, indexes, and security policies

### 3. Environment Configuration
1. Copy `.env.example` to `.env`
2. Update with your actual API keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google APIs
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 4. Google APIs Setup

#### Google Maps API:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API, Places API, and Geocoding API
3. Create an API key and add it to your `.env` file

#### Google Translate API:
1. Enable Cloud Translation API in Google Cloud Console
2. Create credentials and add the API key to your `.env` file

### 5. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage Guide

### For Laborers:
1. **Register**: Choose "I'm a Worker" during registration
2. **Profile Creation**: Use voice commands or forms to create your profile
3. **Job Search**: Browse jobs by location, category, or keywords
4. **Apply**: Apply to jobs with one click
5. **Communication**: Chat with employers through the messaging system
6. **Navigation**: Get directions to job locations

### For Employers:
1. **Register**: Choose "I'm an Employer" during registration
2. **Post Jobs**: Create detailed job postings with location and requirements
3. **Review Applications**: View and manage job applications
4. **Communication**: Message potential workers
5. **Hire**: Select and hire the best candidates

## 🌐 Multilingual Support

The application supports multiple languages:
- English (default)
- Hindi (हिन्दी)
- Spanish (Español)
- French (Français)
- German (Deutsch)
- Portuguese (Português)
- Arabic (العربية)
- Chinese (中文)
- Japanese (日本語)
- Korean (한국어)

Language can be changed using the language selector in the header.

## 🗺 Location Features

### GPS Integration:
- Automatic location detection
- Distance calculations between users and jobs
- Location-based job filtering

### Google Maps Integration:
- Interactive job maps
- Turn-by-turn directions
- Real-time location sharing

## 🎤 Voice Features

### Voice Profile Creation:
- Step-by-step voice-guided setup
- Speech-to-text conversion
- Multi-language voice support

### Voice Communication:
- Voice messages in chat
- Voice job search
- Audio transcription

## 🔒 Security Features

### Authentication:
- Email/phone-based registration
- OTP verification
- Secure session management

### Database Security:
- Row Level Security (RLS) policies
- Encrypted data transmission
- User data privacy protection

## 📊 Database Schema

The application uses the following main tables:
- `users`: User profiles and authentication
- `laborer_profiles`: Extended laborer information
- `jobs`: Job postings and details
- `job_applications`: Application tracking
- `messages`: Communication system
- `ratings`: User rating system

## 🚀 Deployment

### Vercel Deployment:
```bash
npm run build
# Deploy to Vercel
```

### Netlify Deployment:
```bash
npm run build
# Deploy dist folder to Netlify
```

### Environment Variables:
Make sure to set all environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the database setup guide

## 🔮 Future Enhancements

- Push notifications
- Advanced AI matching algorithms
- Payment processing integration
- Mobile app (React Native)
- Advanced analytics dashboard
- Video calling integration
- Background check integration
- Multi-currency support

---

