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

________________________________________
## **🧑‍💻Module Descriptions**

1. Register for Employee (Laborer Registration):
2. 🎯 Purpose:
This module allows labourers (employees) to create an account on the platform with voice-first, multilingual support so even uneducated workers can register without typing.
🔄 Workflow
1.	Worker opens the app → selects “Register as Employee”.
2.	Voice assistant greets and asks for details (name, skills, location).
3.	Worker responds by speaking (e.g., “My name is Raju, I am a mason with 5 years experience”).
4.	Speech-to-text (Whisper API) converts it into structured text.
5.	Profile data is auto-translated into supported languages.
6.	OTP verification via phone/email finalizes registration.
7.	For verifying the profile govt id of the employee will be taken.
✨ Features
•	Voice-driven data entry.
•	OTP verification (SMS/email). 
•	Skills & experience recording.
•	Multilingual audio prompts (Hindi, Telugu, English, etc.).
•	Profile stored securely in database (Supabase/Firebase).
⚙️ Technical Implementation
•	UI: Simple form with mic button (fallback text fields).
•	APIs: Firebase Auth (OTP), Google Translate API.
•	DB: laborer_profiles table/collection for storing skills, location, availability.
•	Voice: OpenAI Whisper for speech-to-text.
2. Register for Job Provider (Employer Registration):
🎯 Purpose:
This module lets employers register and create company/personal profiles to post jobs. It also supports voice-assisted registration for accessibility.
🔄 Workflow
1.	Employer selects “Register as Job Provider”.
2.	Voice assistant asks for:
o	Company/individual name
o	Contact number/email
o	Job categories offered (construction, farming, etc.)
o	Location
3.	Employer confirms details.
4.	OTP verification secures account.
✨ Features
•	Voice/text registration support.
•	Company details setup.
•	OTP-based verification.
•	Role-based account flag (“job_provider”).
⚙️ Technical Implementation
•	UI: Registration screen with voice prompt.
•	APIs: Firebase/Supabase Auth for signup.
•	DB: employer_profiles for employer details.
•	Voice: Text-to-speech (prompts) + speech-to-text (inputs).
3. Login for Employee:
🎯 Purpose:
Provides secure login for laborers with voice-based OTP/password support.
🔄 Workflow
1.	Employee clicks “Login as Employee”.
2.	Voice assistant asks: “Say your phone number or email.”
3.	Employee speaks input.
4.	OTP sent → employee enters/speaks it.
5.	On success, laborer is redirected to job search dashboard.
✨ Features
•	Voice login (phone/email + OTP).
•	Role-based redirection (employee dashboard).
•	Session persistence with JWT tokens.
•	Multilingual audio prompts.
⚙️ Technical Implementation
•	UI: Minimal fields with mic option.
•	Auth: Firebase Auth / Supabase Auth.
•	Security: JWT stored in encrypted storage (Android Keystore).
4. Login for Job Provider:
🎯 Purpose:
Allows job providers to securely log in with OTP/password, accessible via voice.
🔄 Workflow
1.	Employer selects “Login as Job Provider”.
2.	Speaks phone/email.
3.	OTP sent → entered/speech input.
4.	On success, redirected to job posting dashboard.
✨ Features
•	Voice OTP login.
•	Secure session management.
•	Role-specific dashboard access.
⚙️ Technical Implementation
•	UI: Login page with mic button.
•	Auth: Firebase OTP login.
•	DB: Check if role = employer before redirect.
5. Home Page with Search Bar + AI Voice Chatbot:
🎯 Purpose:
Acts as the main entry screen, where users interact with an AI-powered voice assistant to search jobs/candidates, navigate, or perform actions.
🔄 Workflow
1.	User logs in → lands on Home Page.
2.	Home shows:
o	Voice-enabled search bar.
o	AI chatbot (microphone button).
o	Role-based options:
	Employee → Job Search
	Employer → Employee Search / Post Job
3.	User can speak:
o	“Find jobs near me” → job search opens.
o	“Show my profile” → profile page opens.
o	“Post a job for tomorrow” → employer job form opens.
✨ Features
•	AI chatbot for navigation & help.
•	Multilingual text-to-speech responses.
•	Voice-enabled search bar.
•	Context-aware actions.
⚙️ Technical Implementation
•	AI: GPT-4o + Whisper (voice input + smart replies).
•	UI: SearchView with mic, chatbot popup.
•	DB Queries: Job/employee search APIs.
6. Job Searching Page for Employee:
🎯 Purpose:
Enables employees to search and apply for jobs using voice-first, GPS-based matching.
🔄 Workflow
1.	Employee opens Job Search Page.
2.	Speaks query: “Find farming jobs within 5 km.”
3.	System fetches nearby jobs from database.
4.	Results displayed with pay rate, location, employer rating.
5.	Employee can say: “Apply for the second job.” → Auto-application triggered.
✨ Features
•	Voice job search.
•	GPS-enabled location filtering.
•	Auto-read job details aloud in local language.
•	One-tap voice-based job application.
⚙️ Technical Implementation
•	Location: Google Maps API for job distance.
•	DB: jobs collection with geo-coordinates.
•	UI: RecyclerView/List with mic button.
•	AI: Text-to-speech reads jobs aloud.
7. Employees Available Page for Job Provider:
🎯 Purpose:
Allows employers to browse available workers by skills, rating, and proximity.
🔄 Workflow
1.	Employer opens Employees Available Page.
2.	Speaks query: “Find carpenters near Vijayawada.”
3.	App fetches matching laborers from DB.
4.	Profiles shown with skill, rating, distance.
5.	Employer can say: “Hire the first worker.” → Worker receives job request notification.
✨ Features
•	Voice search for employees.
•	Geo-location filtering.
•	Voice-based hiring action.
•	Ratings & reviews shown in search results.
⚙️ Technical Implementation
•	Location: Google Maps API for filtering workers.
•	DB: laborer_profiles with skills & geo-coordinates.
•	UI: RecyclerView/List with profile cards.
•	AI: Text-to-speech to read worker profiles aloud.

________________________________________
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

**Note**: This application is designed with accessibility and low-literacy users in mind, featuring voice-first interactions and intuitive visual design.
