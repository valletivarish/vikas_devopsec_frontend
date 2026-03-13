# Serverless Polling and Survey Platform - Frontend

## Overview

React 18 single-page application for the Serverless Polling and Survey Platform. Provides a responsive interface for creating surveys, managing questions, viewing responses, generating reports, and visualizing response rate forecasts.

## Tech Stack

- React 18 with Vite
- Tailwind CSS for styling
- React Router DOM for routing
- Axios with JWT interceptor for API calls
- Recharts for data visualization (bar charts, pie charts, line charts)
- React Hook Form with Yup for form validation
- React Toastify for notifications
- React Icons for iconography

## Prerequisites

- Node.js 18+
- npm 9+

## Getting Started

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The application starts on http://localhost:3000 and proxies API requests to http://localhost:8080.

## Building for Production

```bash
npm run build
```

The build output is in the `dist/` directory, ready for deployment to S3 static hosting.

## Linting

```bash
npm run lint
```

Uses ESLint with React and React Hooks plugins for code quality enforcement.

## Pages

- /login - User login form
- /register - User registration form
- /dashboard - Overview with summary cards and charts
- /surveys - Survey list with CRUD actions
- /surveys/new - Create new survey with dynamic questions
- /surveys/:id - Survey detail view
- /surveys/:id/edit - Edit existing survey
- /surveys/:id/responses - View and analyze survey responses
- /reports - Generate and manage result reports
- /forecast - ML-based response rate forecast visualization
- /survey/:shareLink - Public survey access via share link

## Project Structure

```
src/
    components/
        Auth/           LoginForm, RegisterForm, ProtectedRoute
        Layout/         Navbar, Sidebar, MainLayout
        Dashboard/      Dashboard page with summary cards and charts
        Surveys/        SurveyList, SurveyForm, SurveyDetail, PublicSurvey
        Responses/      ResponseList with answer distribution charts
        Reports/        ReportList with generation and deletion
        Forecast/       ForecastPage with trend visualization
        common/         LoadingSpinner, ErrorMessage, ConfirmDialog
    context/            AuthContext (JWT state management)
    services/           api.js, surveyService.js, responseService.js, etc.
    utils/              validators.js, dateUtils.js
```

## Environment Variables

Create a `.env` file for production deployment:

```
VITE_API_URL=http://your-backend-url:8080
```

## CI/CD

GitHub Actions pipeline in `.github/workflows/ci-cd.yml` handles:
- CI: Install, lint, build, security audit
- CD: Deploy dist to AWS S3 static hosting

## Infrastructure

Terraform configuration in `terraform/` provisions:
- AWS S3 bucket with static website hosting
- AWS CloudFront distribution (optional)
- VPC and networking resources
