# SWOT Analysis API Backend

This repository contains the backend API for the SWOT Analysis application, built with FastAPI and SQLModel.

## Overview

The SWOT Analysis API provides endpoints for:
- Generating SWOT analyses using AI (leveraging OpenAI's language models)
- Creating and storing projects with SWOT analyses
- Generating strategic recommendations based on SWOT analyses
- Retrieving saved projects and analyses

The application uses FastAPI for the web framework, SQLModel for database ORM, and LangChain for AI integrations.

## Prerequisites

- Python 3.10 or higher
- PostgreSQL database
- OpenAI API key

## Setup and Installation

### Environment Setup

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://username:password@localhost:5432/swot
```

Replace `your-openai-api-key` with your actual OpenAI API key, and adjust the database connection string as needed.

### Database Setup

1. Create a PostgreSQL database named `swot`:
   ```bash
   createdb swot
   ```
   
   Note: The application will automatically create the necessary tables on startup.

## Running the Application

### Development Mode

Run the application with the following command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at http://localhost:8000

### Using Docker

Build and run the Docker container:

```bash
docker build -t swot-backend .
docker run -p 8000:8000 --env-file .env swot-backend
```

## API Endpoints

### Root Endpoint
- `GET /`: Welcome message and API status

### SWOT Analysis
- `POST /api/swot/analyze`: Generate a SWOT analysis
- `POST /api/swot/strategies`: Generate strategies based on a SWOT analysis

### Projects
- `POST /api/projects`: Create a new project with analysis and strategies
- `GET /api/projects`: List all projects
- `GET /api/projects/{project_id}`: Get a specific project with its analysis and strategies

## Project Structure

```
backend/
├── app/
│   └── main.py        # FastAPI application with routes and models
├── main.py            # Application entry point
├── Dockerfile         # Docker configuration
├── requirements.txt   # Python dependencies
└── .env.example       # Example environment variables
```

## Models

### Project
Stores information about a project for SWOT analysis:
- Title
- Description
- Goals
- Industry
- Stage
- Decision type

### SWOTItem
Represents a single item in a SWOT analysis:
- Content (description)
- Impact (1-5 scale)
- Priority (high/medium/low)
- Category (strength/weakness/opportunity/threat)

### Strategy
Represents a strategic recommendation:
- Content (description)
- Type (so/wo/st/wt)

## Development

### Adding New Features

1. Define new models in `app/main.py` if needed
2. Add routes in `app/main.py`
3. Implement business logic
4. Run the application to test

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check that your PostgreSQL server is running
   - Verify your DATABASE_URL environment variable

2. **OpenAI API Errors**:
   - Check that your OPENAI_API_KEY is valid
   - Verify your internet connection

3. **Missing Dependencies**:
   - Run `pip install -r requirements.txt` to ensure all packages are installed