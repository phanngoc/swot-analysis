import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { validateProjectData } from '@/lib/validations';

// Get the Python backend URL from environment variables or use a default
const PYTHON_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * API route handler for generating SWOT analysis
 * Forwards request to Python backend after validation
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const requestBody = await request.json();
    
    if (!requestBody.project) {
      return NextResponse.json(
        { error: 'Missing required project data' },
        { status: 400 }
      );
    }

    // Validate project data
    const { project } = requestBody;
    const validationResult = validateProjectData(project);
    
    // Return validation errors if any
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }
    
    // Forward the request to the Python backend with timeout
    const response = await axios.post(
      `${PYTHON_API_URL}/api/swot/analyze`, 
      {
        project: {
          title: project.title || '',
          description: project.description || '',
          goals: project.goals || [],
          industry: project.industry || '',
          stage: project.stage || '',
          decision_type: project.decisionType || '',
        }
      },
      {
        timeout: 30000, // 30 second timeout for long-running AI operations
      }
    );
    
    // Return the Python server's response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error forwarding request to Python server:', error);
    
    // Detailed error handling based on error type
    if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
      return NextResponse.json(
        { 
          error: 'Không thể kết nối với máy chủ backend. Vui lòng kiểm tra xem máy chủ có đang chạy không.',
          technical_details: error.message
        },
        { status: 503 }
      );
    }

    // Handle timeout errors
    if (error.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { 
          error: 'Máy chủ mất quá nhiều thời gian để phản hồi. Vui lòng thử lại sau.',
          technical_details: 'Request timeout'
        },
        { status: 504 }
      );
    }
    
    // Check if we have a response from the Python backend
    if (error.response) {
      const status = error.response.status || 500;
      const detail = error.response.data?.detail || error.response.data?.error;
      let message = 'Lỗi từ máy chủ backend';
      
      // Map status codes to more descriptive error messages
      switch (status) {
        case 400:
          message = detail || 'Dữ liệu không hợp lệ được gửi đến máy chủ';
          break;
        case 401:
          message = 'Cần xác thực để thực hiện thao tác này';
          break;
        case 403:
          message = 'Bạn không có quyền thực hiện thao tác này';
          break;
        case 404:
          message = 'Không tìm thấy tài nguyên được yêu cầu';
          break;
        case 429:
          message = 'Quá nhiều yêu cầu. Vui lòng thử lại sau';
          break;
        case 500:
          message = detail || 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau';
          break;
        default:
          message = detail || `Lỗi từ máy chủ backend (${status})`;
      }
      
      return NextResponse.json({ 
        error: message, 
        technical_details: detail || error.message,
        status_code: status
      } as const, { status });
    }
    
    // Handle any other errors
    return NextResponse.json(
      { 
        error: 'Đã xảy ra lỗi khi tạo phân tích SWOT. Vui lòng thử lại sau.',
        technical_details: error.message || 'Unknown error'
      } as const,
      { status: 500 }
    );
  }
}
