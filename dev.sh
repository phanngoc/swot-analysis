#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env file exists, if not create one
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating .env file...${NC}"
  cat > .env << EOF
# Backend environment variables
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/swot
OPENAI_API_KEY=your_openai_api_key

# Frontend environment variables
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
  echo -e "${GREEN}Created .env file. Please edit it to add your OpenAI API key.${NC}"
else
  echo -e "${BLUE}Found existing .env file.${NC}"
fi

# Function to display usage information
show_usage() {
  echo -e "${GREEN}SWOT Analysis Tool - Development Script${NC}"
  echo ""
  echo "Usage: ./dev.sh [command]"
  echo ""
  echo "Commands:"
  echo "  start       Start all containers (default if no command provided)"
  echo "  stop        Stop all containers"
  echo "  restart     Restart all containers"
  echo "  frontend    Start only the frontend container"
  echo "  backend     Start only the backend container"
  echo "  db          Start only the database container"
  echo "  logs        Show logs from all containers"
  echo "  build       Rebuild all containers"
  echo "  clean       Remove all containers and volumes (WARNING: deletes data)"
  echo ""
}

# Process command line arguments
case "$1" in
  start|"")
    echo -e "${GREEN}Starting all containers...${NC}"
    docker-compose up -d
    echo -e "${GREEN}All containers started. Frontend available at http://localhost:3000${NC}"
    ;;
  stop)
    echo -e "${YELLOW}Stopping all containers...${NC}"
    docker-compose stop
    echo -e "${GREEN}All containers stopped.${NC}"
    ;;
  restart)
    echo -e "${YELLOW}Restarting all containers...${NC}"
    docker-compose restart
    echo -e "${GREEN}All containers restarted.${NC}"
    ;;
  frontend)
    echo -e "${GREEN}Starting frontend container...${NC}"
    docker-compose up -d frontend
    echo -e "${GREEN}Frontend container started at http://localhost:3000${NC}"
    ;;
  backend)
    echo -e "${GREEN}Starting backend container...${NC}"
    docker-compose up -d backend
    echo -e "${GREEN}Backend container started at http://localhost:8000${NC}"
    ;;
  db)
    echo -e "${GREEN}Starting database container...${NC}"
    docker-compose up -d db
    echo -e "${GREEN}Database container started at localhost:5432${NC}"
    ;;
  logs)
    echo -e "${BLUE}Showing container logs (press Ctrl+C to exit)...${NC}"
    docker-compose logs -f
    ;;
  build)
    echo -e "${YELLOW}Rebuilding all containers...${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}Rebuild complete. Use './dev.sh start' to start the containers.${NC}"
    ;;
  clean)
    echo -e "${RED}WARNING: This will remove all containers and volumes, including the database data.${NC}"
    read -p "Are you sure you want to continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
      echo -e "${RED}Removing all containers and volumes...${NC}"
      docker-compose down -v
      echo -e "${GREEN}Cleanup complete.${NC}"
    else
      echo -e "${BLUE}Operation cancelled.${NC}"
    fi
    ;;
  *)
    show_usage
    ;;
esac
