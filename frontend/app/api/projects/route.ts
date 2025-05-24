import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { validateProjectSaveData } from '@/lib/validations';

// Get the Python backend URL from environment variables or use a default
const PYTHON_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Define a type for our error handling
interface ApiError {
  code?: string;
  response?: {
    status: number;
    data?: {
      detail?: string;
      error?: string;
      [key: string]: any;
    };
  };
  message?: string;
}

// Define a type for the project data
interface Project {
  id: string;
  title: string;
  description: string;
  industry: string;
  goals?: string[];
  stage: string;
  decisionType: string;
}

/**
 * GET handler for retrieving all projects
 */
export async function GET() {
  try {
    // Forward the request to the Python backend to get all projects
    const response = await axios.get(`${PYTHON_API_URL}/api/projects`, {
      timeout: 10000 // 10 second timeout
    });
    
    // Return the Python server's response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error getting projects from Python server:', error);
    
    const err = error as ApiError;
    
    // Error handling based on error type
    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
      return NextResponse.json({
        error: 'Không thể kết nối với máy chủ backend. Vui lòng kiểm tra xem máy chủ có đang chạy không.',
        technical_details: err.message || ''
      }, { status: 503 });
    }
    
    // Handle specific error responses from backend
    if (err.response) {
      const status = err.response.status || 500;
      const message = err.response.data?.error || 'Lỗi khi lấy danh sách dự án';
      
      return NextResponse.json({
        error: message,
        technical_details: err.message || ''
      }, { status });
    }
    
    // Generic error response
    return NextResponse.json({
      error: 'Không thể lấy danh sách dự án từ máy chủ. Vui lòng thử lại sau.',
      technical_details: err.message || 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST handler for saving a project
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const requestBody = await request.json();
    
    // Add specific validation for decision type
    if (!requestBody.project?.decision_type) {
      return NextResponse.json({
        error: 'Loại quyết định là bắt buộc'
      }, { status: 400 });
    }

    // Validate project data before saving
    const validationResult = validateProjectSaveData(requestBody);
    if (!validationResult.valid) {
      return NextResponse.json({
        error: validationResult.error || 'Dữ liệu dự án không hợp lệ'
      }, { status: 400 });
    }
    
    // Forward the request to the Python backend
    const response = await axios.post(
      `${PYTHON_API_URL}/api/projects`, 
      requestBody,
      {
        timeout: 10000 // 10 second timeout
      }
    );
    
    // Return the Python server's response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error saving project to Python server:', error);
    
    const err = error as ApiError;
    
    // Error handling based on error type
    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
      return NextResponse.json({
        error: 'Không thể kết nối với máy chủ backend. Vui lòng kiểm tra xem máy chủ có đang chạy không.',
        technical_details: err.message || ''
      }, { status: 503 });
    }
    
    // Handle specific error responses from backend
    if (err.response) {
      const status = err.response.status || 500;
      const detail = err.response.data?.detail || err.response.data?.error || '';
      
      return NextResponse.json({
        error: detail || 'Lỗi khi lưu dự án',
        technical_details: err.message || ''
      }, { status });
    }
    
    // Generic error response
    return NextResponse.json({
      error: 'Đã xảy ra lỗi khi lưu dự án. Vui lòng thử lại sau.',
      technical_details: err.message || 'Unknown error'
    }, { status: 500 });
  }
}

