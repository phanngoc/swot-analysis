from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import project
from regex import F
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import List, Optional, Dict, Any, Union
import os
from datetime import datetime
import uuid
from pydantic import BaseModel
from dotenv import load_dotenv
import json
from sqlalchemy import JSON, Column, desc, text, delete # Added delete
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://olympia:olympia123@localhost:5432/swot")
print(f"Connecting to database at {DATABASE_URL}")
engine = create_engine(DATABASE_URL)

# Models
class SWOTItemBase(SQLModel):
    content: str
    impact: int
    priority: str
    category: str

class SWOTItem(SWOTItemBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    project_id: str = Field(foreign_key="project.id")

class ProjectBase(SQLModel):
    title: str
    description: str
    goals: List[str] = Field(sa_column=Column(JSON))
    industry: str
    stage: str
    decision_type: str

class Project(ProjectBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class StrategyBase(SQLModel):
    content: str
    type: str  # "so", "wo", "st", "wt"

class Strategy(StrategyBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    project_id: str = Field(foreign_key="project.id")

# Request and Response models
class SWOTItemCreate(SWOTItemBase):
    pass

class SWOTItemRead(SWOTItemBase):
    id: str

class ProjectCreate(ProjectBase):
    pass

class ProjectRead(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime

class StrategyCreate(StrategyBase):
    pass

class StrategyRead(StrategyBase):
    id: str

class SWOTAnalysisRequest(BaseModel):
    project: ProjectCreate

class SWOTAnalysisResponse(BaseModel):
    strengths: List[Dict[str, Any]]
    weaknesses: List[Dict[str, Any]]
    opportunities: List[Dict[str, Any]]
    threats: List[Dict[str, Any]]
    project: ProjectRead

class SWOTStrategiesRequest(BaseModel):
    strengths: List[Dict[str, Any]]
    weaknesses: List[Dict[str, Any]]
    opportunities: List[Dict[str, Any]]
    threats: List[Dict[str, Any]]

class SWOTStrategiesResponse(BaseModel):
    so: List[str]
    wo: List[str]
    st: List[str]
    wt: List[str]

class ProjectStrategiesUpdateRequest(BaseModel):
    so: Union[List[str], Dict[str, str]]
    wo: Union[List[str], Dict[str, str]]
    st: Union[List[str], Dict[str, str]]
    wt: Union[List[str], Dict[str, str]]

class ProjectFullResponse(BaseModel):
    project: ProjectRead
    analysis: SWOTAnalysisResponse
    strategies: SWOTStrategiesResponse

# Create tables
SQLModel.metadata.create_all(engine)

# Dependency
def get_session():
    with Session(engine) as session:
        yield session

# Initialize FastAPI app
app = FastAPI(title="SWOT Analysis API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# AI Functions
def init_llm():
    """Initialize language model"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OpenAI API key not found in environment variables")

    return ChatOpenAI(model="gpt-4o", temperature=0.5)

def generate_swot_analysis(project_data: Dict[str, Any]) -> Union[Dict[str, List[Dict[str, Any]]], bool]:
    """Generate a SWOT analysis using LLM"""
    llm = init_llm()
    
    # Define the prompt template
    template = """
    Bạn là một chuyên gia phân tích kinh doanh, có chuyên môn sâu về phân tích SWOT. Dựa trên các thông tin được cung cấp bên dưới, hãy xây dựng bản phân tích SWOT đầy đủ, bao gồm 4 yếu tố chính: Điểm mạnh (Strengths), Điểm yếu (Weaknesses), Cơ hội (Opportunities), và Thách thức (Threats).

    **Thông tin dự án:**
    - Tên dự án: {title}
    - Mô tả: {description}
    - Mục tiêu: {goals}
    - Ngành nghề: {industry}
    - Giai đoạn phát triển: {stage}
    - Loại quyết định: {decision_type}

    Yêu cầu:
    - Với mỗi nhóm (Điểm mạnh, Điểm yếu, Cơ hội, Thách thức), hãy liệt kê từ 3 đến 5 mục.
    - Kết quả trả về cần được trình bày dưới dạng JSON với cấu trúc sau:

    {{
        "strengths": [
            {{"content": "mô tả điểm mạnh", "impact": (1-5), "priority": "cao/trung bình/thấp", "category": "strength"}}
        ],
        "weaknesses": [
            {{"content": "...", "impact": ..., "priority": "...", "category": "weakness"}}
        ],
        "opportunities": [...],
        "threats": [...]
    }}

    Lưu ý:
    - Tất cả các giá trị trong JSON phải đúng định dạng: chuỗi (string), số (number) hoặc mảng (array).
    - Hãy đảm bảo ngắn gọn, rõ ràng và có tính thực tiễn cao.
    """
    
    prompt = ChatPromptTemplate.from_template(template)
    
    # Create the chain
    chain = (
        {"title": lambda x: x["title"],
         "description": lambda x: x["description"],
         "goals": lambda x: ", ".join(x["goals"]) if x["goals"] else "",
         "industry": lambda x: x["industry"],
         "stage": lambda x: x["stage"],
         "decision_type": lambda x: x["decision_type"]}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    # Execute chain
    try:
        result = chain.invoke(project_data)
        result = result.strip()
        if result.startswith("```json"):
            result = result[len("```json"):].strip()
        if result.endswith("```"):
            result = result[:-3].strip()

        print('Result:generate_swot_analysis:', result)
        return json.loads(result)
    except Exception as e:
        print(f"Error generating SWOT analysis: {e}")
        print(e)
        # Fallback with dummy data
        return False

def generate_swot_strategies(analysis: Dict[str, List[Dict[str, Any]]]) -> Union[Dict[str, List[str]], bool]:
    """Generate SWOT strategies based on the analysis"""
    llm = init_llm()
    
    template = """
    You are an expert business strategist. Based on the SWOT analysis below, generate strategic recommendations
    in these four categories:
    
    1. SO (Strength-Opportunity) strategies: Using strengths to capitalize on opportunities
    2. WO (Weakness-Opportunity) strategies: Improving weaknesses to better capture opportunities
    3. ST (Strength-Threat) strategies: Using strengths to mitigate threats
    4. WT (Weakness-Threat) strategies: Addressing weaknesses to avoid threats
    
    SWOT Analysis:
    Strengths: {strengths}
    Weaknesses: {weaknesses}
    Opportunities: {opportunities}
    Threats: {threats}
    
    For each category (SO, WO, ST, WT), provide 2-3 specific, actionable strategies.
    Format your response as a JSON with this structure:
    {{
        "so": ["Strategy 1", "Strategy 2", "Strategy 3"],
        "wo": ["Strategy 1", "Strategy 2", "Strategy 3"],
        "st": ["Strategy 1", "Strategy 2", "Strategy 3"],
        "wt": ["Strategy 1", "Strategy 2", "Strategy 3"]
    }}
    
    Ensure all strategies are specific, actionable, and directly related to the SWOT elements.
    """
    
    prompt_template = ChatPromptTemplate.from_messages(
        [
            ("system", template),
            ("human", "Respond with vietnamese, do not use code block markers"),
        ]
    )
    
    chain = prompt_template | llm | StrOutputParser()

    # Extract the content from each category for better prompt formatting
    strengths = [item["content"] for item in analysis.get("strengths", [])]
    weaknesses = [item["content"] for item in analysis.get("weaknesses", [])]
    opportunities = [item["content"] for item in analysis.get("opportunities", [])]
    threats = [item["content"] for item in analysis.get("threats", [])]

    # Execute chain
    try:
        result = chain.invoke(
            {
                "strengths": strengths,
                "weaknesses": weaknesses,
                "opportunities": opportunities,
                "threats": threats
            }
        )
        # Remove any leading/trailing whitespace and trim code block markers if present
        result = result.strip()
        if result.startswith("```json"):
            result = result[len("```json"):].strip()
        if result.endswith("```"):
            result = result[:-3].strip()
        print('Result:generate_swot_strategies:', result)
        return json.loads(result)
    except Exception as e:
        print(f"Error generating SWOT strategies: {e}")
        # Fallback with dummy data
        return False

# API Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to SWOT Analysis API"}

@app.get("/api/health")
def health_check():
    """Health check endpoint for monitoring and Docker healthchecks"""
    try:
        # Check database connection
        with Session(engine) as session:
            session.exec("SELECT 1").first()
        
        return {
            "status": "healthy",
            "database": "connected",
            "api": "running",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }, 500

@app.post("/api/swot/analyze", response_model=SWOTAnalysisResponse)
def analyze_swot(request: SWOTAnalysisRequest):
    """Generate SWOT analysis based on project information"""
    project_dict = request.project.model_dump()
    # Save project information to the database
    project = Project(**project_dict)
    with Session(engine) as session:
        session.add(project)
        session.commit()
        session.refresh(project)
        # Use model_dump to get all fields, including created_at and updated_at
        project_full_dict = project.model_dump()
    print('project_dict:', project_full_dict)
    # Generate SWOT analysis, response thêm info project

    analysis = generate_swot_analysis(project_full_dict)
    print('analysis:', analysis)
    # Set project as a dict, not a list
    analysis['project'] = project_full_dict
    print('analysis:', analysis)
    return analysis

@app.post("/api/swot/strategies", response_model=SWOTStrategiesResponse)
def generate_strategies(request: SWOTStrategiesRequest):
    """Generate strategies based on SWOT analysis"""
    analysis_dict = request.model_dump()
    strategies = generate_swot_strategies(analysis_dict)
    return strategies

@app.post("/api/projects", response_model=Dict[str, str])
def create_project(
    project_data: Dict[str, Any],
    session: Session = Depends(get_session)
):
    """Save a complete project with analysis and strategies"""
    try:
        # Extract the components
        project_info = project_data.get("project", {})
        analysis = project_data.get("analysis", {})
        strategies = project_data.get("strategies", {})
        
        # Create project
        project = Project(**project_info)
        session.add(project)
        session.commit()
        session.refresh(project)
        
        # Save SWOT items
        for category in ["strengths", "weaknesses", "opportunities", "threats"]:
            for item_data in analysis.get(category, []):
                item = SWOTItem(project_id=project.id, **item_data)
                session.add(item)
        
        # Save strategies
        for strategy_type in ["so", "wo", "st", "wt"]:
            for content in strategies.get(strategy_type, []):
                strategy = Strategy(
                    project_id=project.id,
                    content=content,
                    type=strategy_type
                )
                session.add(strategy)
        
        session.commit()
        return {"id": project.id}
    
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating project: {str(e)}"
        )

@app.get("/api/projects/{project_id}", response_model=ProjectFullResponse)
def get_project(project_id: str, session: Session = Depends(get_session)):
    """Get a complete project with analysis and strategies"""
    try:
        # Get project
        project = session.exec(select(Project).where(Project.id == project_id)).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Get SWOT items
        swot_items = session.exec(select(SWOTItem).where(SWOTItem.project_id == project_id)).all()
        # Organize items by category
        analysis = {
            "strength": [],
            "weakness": [],
            "opportunity": [],
            "threat": []
        }
        
        for item in swot_items:
            item_dict = {
                "id": item.id,
                "content": item.content,
                "impact": item.impact,
                "priority": item.priority,
                "category": item.category
            }
            analysis[item.category].append(item_dict)
        print('analysis:', analysis)

        analysis = {
            "strengths": analysis.get("strength", []),
            "weaknesses": analysis.get("weakness", []),
            "opportunities": analysis.get("opportunity", []),
            "threats": analysis.get("threat", []),
            "project": project.model_dump()  # Add project details to analysis
        }
        # Get strategies
        strategies_items = session.exec(select(Strategy).where(Strategy.project_id == project_id)).all()
        
        # Organize strategies by type
        strategies = {
            "so": [],
            "wo": [],
            "st": [],
            "wt": []
        }
        
        for strategy in strategies_items:
            strategies[strategy.type].append(strategy.content)
        print('strategies:', strategies)
        return {
            "project": project,
            "analysis": analysis,
            "strategies": strategies
        }
        
    except HTTPException as http_exc:
        print(f"HTTPException:", http_exc)
        raise
    except Exception as e:
        print("Exception:", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving project: {str(e)}"
        )

@app.get("/api/projects", response_model=List[ProjectRead])
def list_projects(session: Session = Depends(get_session)):
    """List all projects"""
    projects = session.exec(select(Project).order_by(desc(text('created_at')))).all()
    return projects

@app.delete("/api/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str, session: Session = Depends(get_session)):
    """Delete a project and its associated SWOT items and strategies"""
    try:
        project = session.exec(select(Project).where(Project.id == project_id)).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        # Delete associated SWOT items
        swot_items_to_delete = session.exec(select(SWOTItem).where(SWOTItem.project_id == project_id)).all()
        for item in swot_items_to_delete:
            session.delete(item)

        # Delete associated strategies
        strategies_to_delete = session.exec(select(Strategy).where(Strategy.project_id == project_id)).all()
        for strategy_item in strategies_to_delete:
            session.delete(strategy_item)
        
        # Flush the session to ensure child deletions are processed before parent deletion
        session.flush()

        # Delete the project itself
        session.delete(project)
        
        session.commit()
        # FastAPI automatically handles 204 No Content for functions returning None or with no return statement
    
    except HTTPException as http_exc:
        print(f"HTTPException:", http_exc) # Keep or improve logging
        session.rollback()
        raise http_exc
    except Exception as e:
        session.rollback()
        print("Exception:", e) # Keep or improve logging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting project: {str(e)}"
        )

@app.put("/api/projects/{project_id}/strategies", response_model=SWOTStrategiesResponse)
def update_project_strategies(project_id: str, strategies: ProjectStrategiesUpdateRequest, session: Session = Depends(get_session)):
    """Update strategies for a specific project"""
    try:
        # Fetch the project
        project = session.get(Project, project_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

        # Delete existing strategies for the project
        strategies_to_delete = session.exec(select(Strategy).where(Strategy.project_id == project_id)).all()
        for strategy_item in strategies_to_delete:
            session.delete(strategy_item)
        strategy_data = strategies.model_dump()
        print("strategy_data:", strategy_data)
        # Normalize and add new strategies
        for strategy_type in ["so", "wo", "st", "wt"]:
            strategy_list = strategy_data.get(strategy_type, [])
            for content in strategy_list:
                if content.strip():  # Only add non-empty strategies
                    strategy = Strategy(content=content, type=strategy_type, project_id=project_id)
                    session.add(strategy)

        session.commit()

        # Return the normalized strategies
        return SWOTStrategiesResponse(
            so=strategy_data.get("so", []),
            wo=strategy_data.get("wo", []),
            st=strategy_data.get("st", []),
            wt=strategy_data.get("wt", [])
        )

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
