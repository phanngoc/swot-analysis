#!/bin/bash

# SWOT Analyzer Setup Script
# This script helps set up your SWOT Analyzer development environment

echo "🚀 Setting up SWOT Analyzer development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and Docker Compose first."
    echo "   Visit https://docs.docker.com/get-docker/ for installation instructions."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit https://docs.docker.com/compose/install/ for installation instructions."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    echo "OPENAI_API_KEY=" > .env
    echo "⚠️ Please add your OpenAI API key to the .env file."
else
    echo "✅ .env file already exists."
fi

# Create backend/.env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo "⚠️ Please check backend/.env file and update as needed."
else
    echo "✅ backend/.env file already exists."
fi

# Ask user if they want to build and start containers
read -p "Do you want to build and start the application now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Building and starting containers..."
    docker-compose up --build
else
    echo "📝 To start the application, run: docker-compose up"
fi

echo "
🎉 Setup complete! 

To start the application:
- Make sure Docker is running
- Run 'docker-compose up'
- Access the frontend at http://localhost:3000
- Access the backend API at http://localhost:8000
- API documentation is available at http://localhost:8000/docs

Happy analyzing! 📊
"
