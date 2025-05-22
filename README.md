# SWOT Analysis Tool

An interactive web application for SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis powered by AI. This tool helps businesses, entrepreneurs, and project managers analyze their strategic position and make informed decisions.

![SWOT Matrix](https://i.imgur.com/XqwdTK7.png)

## Features

- 📝 **User-friendly Input Form**: Collect project/business details including description, goals, industry, stage, and decision type
- 🤖 **AI-powered Analysis**: Automatically generate SWOT suggestions based on your input using OpenAI
- 📊 **Interactive SWOT Matrix**: Easy-to-use drag-and-drop interface with customizable priorities and impact ratings
- 🔄 **Strategy Recommendations**: Generate strategic plans based on SO, WO, ST, and WT combinations
- 💾 **Save and Share**: Export your analysis as PDF or share with team members

## Quickstart

The fastest way to get started is using Docker:

```bash
# Clone the repository
git clone https://github.com/yourusername/swot-analyzer.git
cd swot-analyzer

# Run setup script to configure environment
chmod +x setup.sh
./setup.sh

# Follow the prompts to add your OpenAI API key
```

Visit http://localhost:3000 in your browser to use the application!

## Tech Stack

### Frontend
- ReactJS + TypeScript
- TailwindCSS for styling
- Zustand for state management
- shadcn/ui for UI components
- react-beautiful-dnd for drag-and-drop functionality

### Backend
- FastAPI (Python)
- SQLModel for database ORM
- PostgreSQL database
- OpenAI integration via LangChain for AI analysis

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (3.10+)
- PostgreSQL
- Docker and Docker Compose (optional)

### Setup

#### Using Docker (recommended)

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/swot-analyzer.git
   cd swot-analyzer
   ```

2. Create a `.env` file in the root directory with your OpenAI API key
   ```
   OPENAI_API_KEY=your-openai-api-key
   ```

3. Start the application using Docker Compose
   ```bash
   docker-compose up
   ```

4. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

#### Manual Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/swot-analyzer.git
   cd swot-analyzer
   ```

2. Set up the frontend
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Set up the backend
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your OpenAI API key and database URL
   python main.py
   ```

4. Set up the PostgreSQL database
   - Create a database named `swot`
   - Update the connection string in `.env` if needed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for the AI capabilities
- All the open source libraries that made this project possible
