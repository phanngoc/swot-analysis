from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import List, Optional, Dict, Any
import os
from datetime import datetime
import uuid
from pydantic import BaseModel
from dotenv import load_dotenv
import json
from sqlalchemy import JSON, Column
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

def generate_swot_analysis(project_data: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
    """Generate a SWOT analysis using LLM"""
    llm = init_llm()
    
    # Define the prompt template
    template = """
    You are an expert business analyst specializing in SWOT analysis. Based on the information below, 
    generate a comprehensive SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis.

    Project Title: {title}
    Description: {description}
    Goals: {goals}
    Industry: {industry}
    Stage: {stage}
    Decision Type: {decision_type}

    For each category (Strengths, Weaknesses, Opportunities, Threats), provide 3-5 items.
    Format your response as a JSON with this structure:
    {{
        "strengths": [
            {{"content": "strength description", "impact": (1-5), "priority": "high/medium/low", "category": "strength"}}
        ],
        "weaknesses": [...],
        "opportunities": [...],
        "threats": [...]
    }}
    
    Ensure all JSON values are proper strings, numbers, or array entries.
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
        return {
            "strength": [
                {"content": "Strong management team", "impact": 4, "priority": "high", "category": "strength"},
                {"content": "Innovative product", "impact": 5, "priority": "high", "category": "strength"},
                {"content": "Cost-effective operations", "impact": 3, "priority": "medium", "category": "strength"}
            ],
            "weaknesses": [
                {"content": "Limited market reach", "impact": 4, "priority": "high", "category": "weakness"},
                {"content": "Funding constraints", "impact": 3, "priority": "medium", "category": "weakness"},
                {"content": "Lack of experienced staff", "impact": 2, "priority": "low", "category": "weakness"}
            ],
            "opportunities": [
                {"content": "Emerging market demand", "impact": 5, "priority": "high", "category": "opportunity"},
                {"content": "Strategic partnerships", "impact": 4, "priority": "high", "category": "opportunity"},
                {"content": "New technology adoption", "impact": 3, "priority": "medium", "category": "opportunity"}
            ],
            "threats": [
                {"content": "Intense competition", "impact": 4, "priority": "high", "category": "threat"},
                {"content": "Changing regulations", "impact": 3, "priority": "medium", "category": "threat"},
                {"content": "Economic slowdown", "impact": 3, "priority": "medium", "category": "threat"}
            ]
        }

def generate_swot_strategies(analysis: Dict[str, List[Dict[str, Any]]]) -> Dict[str, List[str]]:
    """Generate SWOT strategies based on the analysis"""
    llm = init_llm()
    
    # Define the prompt template
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
    
    prompt = ChatPromptTemplate.from_template(template)
    
    # Extract the content from each category for better prompt formatting
    strengths = [item["content"] for item in analysis.get("strengths", [])]
    weaknesses = [item["content"] for item in analysis.get("weaknesses", [])]
    opportunities = [item["content"] for item in analysis.get("opportunities", [])]
    threats = [item["content"] for item in analysis.get("threats", [])]
    
    # Create the chain
    chain = (
        {"strengths": lambda x: ", ".join(x),
         "weaknesses": lambda x: ", ".join(x),
         "opportunities": lambda x: ", ".join(x),
         "threats": lambda x: ", ".join(x)}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    # Execute chain
    try:
        result = chain.invoke({
            "strengths": strengths,
            "weaknesses": weaknesses,
            "opportunities": opportunities,
            "threats": threats
        })
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
        return {
            "so": [
                "Leverage our strong management team to capitalize on emerging market demand",
                "Use our innovative product to establish strategic partnerships",
                "Utilize cost-effective operations to accelerate new technology adoption"
            ],
            "wo": [
                "Expand market reach by forming strategic partnerships",
                "Seek investment to overcome funding constraints and address emerging market demand",
                "Hire or train staff to take advantage of new technology opportunities"
            ],
            "st": [
                "Use our innovative product features to differentiate from competitors",
                "Leverage management expertise to navigate changing regulations",
                "Apply cost-effective operations to weather economic slowdowns"
            ],
            "wt": [
                "Increase market diversification to reduce competitive pressure",
                "Implement compliance programs to address regulatory changes",
                "Develop contingency plans for economic uncertainties"
            ]
        }

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
    analysis = generate_swot_analysis(project_dict)


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
            "strengths": analysis["strength"],
            "weaknesses": analysis["weakness"],
            "opportunities": analysis["opportunity"],
            "threats": analysis["threat"]
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
    projects = session.exec(select(Project).order_by(Project.created_at.desc())).all()
    return projects
