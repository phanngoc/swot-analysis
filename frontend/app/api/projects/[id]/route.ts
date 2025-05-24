import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Get the Python backend URL from environment variables or use a default
const PYTHON_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get project ID from the URL params
    const id = params.id;
    
    // Forward the request to the Python backend
    const response = await axios.get(`${PYTHON_API_URL}/api/projects/${id}`);
    
    // Return the Python server's response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error forwarding request to Python server:', error);
    
    // Return a proper error response
    return NextResponse.json(
      { error: 'Failed to communicate with Python backend' },
      { status: 500 }
    );
  }
}
