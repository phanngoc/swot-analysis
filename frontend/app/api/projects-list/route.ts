import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Get the Python backend URL from environment variables or use a default
const PYTHON_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    // Forward the request to the Python backend to get all projects
    const response = await axios.get(`${PYTHON_API_URL}/api/projects`);
    
    // Return the Python server's response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error retrieving projects from Python server:', error);
    
    // Return a proper error response
    return NextResponse.json(
      { error: 'Failed to retrieve projects from Python backend' },
      { status: error.response?.status || 500 }
    );
  }
}
