from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Tech Intelligence Platform API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.tech_intel_db

# Collections
emergent_points_collection = db.emergent_points
tech_radar_collection = db.tech_radar
architectures_collection = db.architectures
risk_maps_collection = db.risk_maps
roadmaps_collection = db.roadmaps

# LLM Integration
from emergentintegrations.llm.chat import LlmChat, UserMessage

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")

# ==================== PYDANTIC MODELS ====================

class EmergentPointInput(BaseModel):
    title: str
    description: str
    source: Optional[str] = None
    tags: Optional[List[str]] = []

class BulkEmergentPointsInput(BaseModel):
    points: List[EmergentPointInput]

class EmergentPoint(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    source: Optional[str] = None
    tags: List[str] = []
    domain: Optional[str] = None  # cloud, data, AI, security, integration, ops
    maturity: Optional[str] = None  # emerging, scaling, mainstream
    impact_score: Optional[int] = None  # 1-10
    confidence: Optional[float] = None  # 0-1
    analysis: Optional[str] = None
    related_architectures: List[str] = []
    risks: List[str] = []
    opportunities: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TechRadarItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    quadrant: str  # techniques, tools, platforms, languages-frameworks
    ring: str  # adopt, trial, assess, hold
    domain: str
    description: str
    source_points: List[str] = []  # IDs of emergent points
    moved: Optional[int] = 0  # -1 down, 0 same, 1 up
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ArchitecturePattern(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str  # microservices, event-driven, data-mesh, etc.
    description: str
    components: List[Dict[str, Any]] = []
    connections: List[Dict[str, Any]] = []
    use_cases: List[str] = []
    benefits: List[str] = []
    challenges: List[str] = []
    related_points: List[str] = []
    maturity: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RiskMapItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str  # technical, security, operational, strategic
    severity: str  # critical, high, medium, low
    probability: str  # high, medium, low
    description: str
    impact: str
    mitigation: str
    dependencies: List[str] = []
    affected_domains: List[str] = []
    source_points: List[str] = []
    status: str = "identified"  # identified, mitigating, resolved, accepted
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OpportunityItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    potential: str  # high, medium, low
    description: str
    benefits: List[str] = []
    requirements: List[str] = []
    timeline: str
    source_points: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RoadmapItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    phase: str  # now, next, later, future
    quarter: str  # Q1 2025, Q2 2025, etc.
    domain: str
    description: str
    milestones: List[Dict[str, Any]] = []
    dependencies: List[str] = []
    effort: str  # small, medium, large, xlarge
    priority: str  # critical, high, medium, low
    status: str = "planned"  # planned, in-progress, completed, blocked
    source_points: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ==================== AI CLASSIFICATION ====================

async def classify_emergent_point(point: EmergentPointInput) -> Dict[str, Any]:
    """Use AI to classify and analyze an emergent point"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"classify-{uuid.uuid4()}",
            system_message="""You are a senior technology analyst and solution architect. 
            Analyze technology signals and classify them accurately.
            Always respond with valid JSON only, no markdown formatting."""
        ).with_model("openai", "gpt-4.1")
        
        prompt = f"""Analyze this technology signal and provide classification:

Title: {point.title}
Description: {point.description}
Source: {point.source or 'Not specified'}
Tags: {', '.join(point.tags) if point.tags else 'None'}

Provide your analysis as a JSON object with these exact keys:
{{
    "domain": "one of: cloud, data, AI, security, integration, ops, devops, infrastructure",
    "maturity": "one of: emerging, scaling, mainstream",
    "impact_score": "integer 1-10 representing potential impact",
    "confidence": "float 0-1 representing classification confidence",
    "analysis": "2-3 sentence analysis of this signal",
    "related_architectures": ["list of relevant architecture patterns"],
    "risks": ["list of potential risks"],
    "opportunities": ["list of opportunities this enables"]
}}

Respond ONLY with the JSON object, no other text."""

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        import json
        # Clean response if needed
        response_text = response.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        response_text = response_text.strip()
        
        classification = json.loads(response_text)
        return classification
    except Exception as e:
        print(f"AI Classification error: {e}")
        # Fallback classification
        return {
            "domain": "AI" if "ai" in point.title.lower() or "ml" in point.title.lower() else "cloud",
            "maturity": "emerging",
            "impact_score": 5,
            "confidence": 0.5,
            "analysis": f"Analysis pending for: {point.title}",
            "related_architectures": [],
            "risks": ["Requires further analysis"],
            "opportunities": ["Potential identified"]
        }

async def generate_tech_radar(points: List[dict]) -> List[Dict[str, Any]]:
    """Generate tech radar items from classified points"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"radar-{uuid.uuid4()}",
            system_message="""You are a technology radar analyst. 
            Generate technology radar entries from technology signals.
            Always respond with valid JSON only."""
        ).with_model("openai", "gpt-4.1")
        
        points_summary = "\n".join([f"- {p['title']}: {p['description'][:100]}... (Domain: {p.get('domain', 'unknown')}, Maturity: {p.get('maturity', 'unknown')})" for p in points[:20]])
        
        prompt = f"""Based on these technology signals, generate tech radar items:

{points_summary}

Generate a JSON array of tech radar items. Each item should have:
{{
    "name": "technology name",
    "quadrant": "one of: techniques, tools, platforms, languages-frameworks",
    "ring": "one of: adopt, trial, assess, hold",
    "domain": "primary domain",
    "description": "brief description of why it's on the radar",
    "moved": 0
}}

Generate 5-10 radar items based on the signals. Respond ONLY with the JSON array."""

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        import json
        response_text = response.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        response_text = response_text.strip()
        
        return json.loads(response_text)
    except Exception as e:
        print(f"Tech Radar generation error: {e}")
        return []

async def generate_architectures(points: List[dict]) -> List[Dict[str, Any]]:
    """Generate reference architecture patterns from signals"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"arch-{uuid.uuid4()}",
            system_message="""You are a senior solution architect.
            Generate reference architecture patterns from technology signals.
            Always respond with valid JSON only."""
        ).with_model("openai", "gpt-4.1")
        
        points_summary = "\n".join([f"- {p['title']}: {p.get('analysis', p['description'][:100])}" for p in points[:15]])
        
        prompt = f"""Based on these technology signals, generate reference architecture patterns:

{points_summary}

Generate a JSON array of architecture patterns. Each pattern should have:
{{
    "name": "pattern name",
    "category": "one of: microservices, event-driven, data-mesh, serverless, edge-computing, ai-ml-ops, security-zero-trust, platform-engineering",
    "description": "detailed description of the pattern",
    "components": [
        {{"name": "component name", "type": "service|database|queue|gateway|etc", "description": "what it does"}}
    ],
    "connections": [
        {{"from": "component1", "to": "component2", "type": "sync|async|event", "description": "connection purpose"}}
    ],
    "use_cases": ["when to use this pattern"],
    "benefits": ["advantages"],
    "challenges": ["potential challenges"],
    "maturity": "emerging|scaling|mainstream"
}}

Generate 3-5 architecture patterns. Respond ONLY with the JSON array."""

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        import json
        response_text = response.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        response_text = response_text.strip()
        
        return json.loads(response_text)
    except Exception as e:
        print(f"Architecture generation error: {e}")
        return []

async def generate_risk_map(points: List[dict]) -> Dict[str, List[Dict[str, Any]]]:
    """Generate risk and opportunity maps from signals"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"risk-{uuid.uuid4()}",
            system_message="""You are a technology risk analyst.
            Identify risks and opportunities from technology signals.
            Always respond with valid JSON only."""
        ).with_model("openai", "gpt-4.1")
        
        points_summary = "\n".join([f"- {p['title']}: {p.get('analysis', p['description'][:100])} (Risks: {p.get('risks', [])})" for p in points[:15]])
        
        prompt = f"""Analyze these technology signals for risks and opportunities:

{points_summary}

Generate a JSON object with risks and opportunities:
{{
    "risks": [
        {{
            "title": "risk title",
            "category": "one of: technical, security, operational, strategic, compliance",
            "severity": "one of: critical, high, medium, low",
            "probability": "one of: high, medium, low",
            "description": "detailed risk description",
            "impact": "what happens if this risk materializes",
            "mitigation": "how to mitigate this risk",
            "dependencies": ["related risks or factors"],
            "affected_domains": ["domains affected"]
        }}
    ],
    "opportunities": [
        {{
            "title": "opportunity title",
            "category": "one of: cost-reduction, innovation, competitive-advantage, efficiency, growth",
            "potential": "one of: high, medium, low",
            "description": "opportunity description",
            "benefits": ["list of benefits"],
            "requirements": ["what's needed to capture this"],
            "timeline": "when this can be realized"
        }}
    ]
}}

Generate 4-6 risks and 4-6 opportunities. Respond ONLY with the JSON object."""

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        import json
        response_text = response.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        response_text = response_text.strip()
        
        return json.loads(response_text)
    except Exception as e:
        print(f"Risk map generation error: {e}")
        return {"risks": [], "opportunities": []}

async def generate_roadmap(points: List[dict]) -> List[Dict[str, Any]]:
    """Generate adoption roadmap from signals"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"roadmap-{uuid.uuid4()}",
            system_message="""You are a technology strategist.
            Create adoption roadmaps from technology signals.
            Always respond with valid JSON only."""
        ).with_model("openai", "gpt-4.1")
        
        points_summary = "\n".join([f"- {p['title']}: {p.get('analysis', p['description'][:100])} (Maturity: {p.get('maturity', 'unknown')})" for p in points[:15]])
        
        prompt = f"""Create an adoption roadmap based on these technology signals:

{points_summary}

Generate a JSON array of roadmap items:
{{
    "title": "initiative title",
    "phase": "one of: now, next, later, future",
    "quarter": "Q3 2025, Q4 2025, Q1 2026, etc.",
    "domain": "primary domain",
    "description": "what this initiative involves",
    "milestones": [
        {{"name": "milestone name", "target_date": "date", "status": "planned"}}
    ],
    "dependencies": ["what needs to happen first"],
    "effort": "one of: small, medium, large, xlarge",
    "priority": "one of: critical, high, medium, low"
}}

Generate 6-10 roadmap items across different phases. Respond ONLY with the JSON array."""

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        import json
        response_text = response.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        response_text = response_text.strip()
        
        return json.loads(response_text)
    except Exception as e:
        print(f"Roadmap generation error: {e}")
        return []

# ==================== API ENDPOINTS ====================

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Emergent Points CRUD
@app.post("/api/points/bulk")
async def create_bulk_points(data: BulkEmergentPointsInput):
    """Create multiple emergent points with AI classification"""
    created_points = []
    
    for point_input in data.points:
        # AI Classification
        classification = await classify_emergent_point(point_input)
        
        point = EmergentPoint(
            title=point_input.title,
            description=point_input.description,
            source=point_input.source,
            tags=point_input.tags or [],
            domain=classification.get("domain"),
            maturity=classification.get("maturity"),
            impact_score=classification.get("impact_score"),
            confidence=classification.get("confidence"),
            analysis=classification.get("analysis"),
            related_architectures=classification.get("related_architectures", []),
            risks=classification.get("risks", []),
            opportunities=classification.get("opportunities", [])
        )
        
        point_dict = point.model_dump()
        point_dict["created_at"] = point.created_at
        point_dict["updated_at"] = point.updated_at
        
        await emergent_points_collection.insert_one(point_dict)
        created_points.append(point_dict)
    
    return {"created": len(created_points), "points": created_points}

@app.post("/api/points")
async def create_single_point(point_input: EmergentPointInput):
    """Create a single emergent point with AI classification"""
    classification = await classify_emergent_point(point_input)
    
    point = EmergentPoint(
        title=point_input.title,
        description=point_input.description,
        source=point_input.source,
        tags=point_input.tags or [],
        domain=classification.get("domain"),
        maturity=classification.get("maturity"),
        impact_score=classification.get("impact_score"),
        confidence=classification.get("confidence"),
        analysis=classification.get("analysis"),
        related_architectures=classification.get("related_architectures", []),
        risks=classification.get("risks", []),
        opportunities=classification.get("opportunities", [])
    )
    
    point_dict = point.model_dump()
    point_dict["created_at"] = point.created_at
    point_dict["updated_at"] = point.updated_at
    
    await emergent_points_collection.insert_one(point_dict)
    return point_dict

@app.get("/api/points")
async def get_all_points(domain: Optional[str] = None, maturity: Optional[str] = None):
    """Get all emergent points with optional filtering"""
    query = {}
    if domain:
        query["domain"] = domain
    if maturity:
        query["maturity"] = maturity
    
    points = []
    async for point in emergent_points_collection.find(query).sort("created_at", -1):
        point["_id"] = str(point["_id"])
        points.append(point)
    return points

@app.get("/api/points/{point_id}")
async def get_point(point_id: str):
    """Get a single emergent point by ID"""
    point = await emergent_points_collection.find_one({"id": point_id})
    if not point:
        raise HTTPException(status_code=404, detail="Point not found")
    point["_id"] = str(point["_id"])
    return point

@app.delete("/api/points/{point_id}")
async def delete_point(point_id: str):
    """Delete an emergent point"""
    result = await emergent_points_collection.delete_one({"id": point_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Point not found")
    return {"deleted": True}

@app.delete("/api/points")
async def delete_all_points():
    """Delete all emergent points"""
    result = await emergent_points_collection.delete_many({})
    return {"deleted": result.deleted_count}

# Tech Radar
@app.post("/api/radar/generate")
async def generate_radar():
    """Generate tech radar from all emergent points"""
    points = []
    async for point in emergent_points_collection.find().sort("created_at", -1).limit(20):
        point["_id"] = str(point["_id"])
        points.append(point)
    
    if not points:
        return {"items": [], "message": "No points to analyze"}
    
    radar_items = await generate_tech_radar(points)
    
    # Store generated items
    await tech_radar_collection.delete_many({})  # Clear old radar
    
    stored_items = []
    for item in radar_items:
        radar_item = TechRadarItem(
            name=item.get("name", "Unknown"),
            quadrant=item.get("quadrant", "tools"),
            ring=item.get("ring", "assess"),
            domain=item.get("domain", "general"),
            description=item.get("description", ""),
            source_points=[p["id"] for p in points[:5]],
            moved=item.get("moved", 0)
        )
        item_dict = radar_item.model_dump()
        item_dict["created_at"] = radar_item.created_at
        await tech_radar_collection.insert_one(item_dict)
        stored_items.append(item_dict)
    
    return {"items": stored_items}

@app.get("/api/radar")
async def get_radar():
    """Get current tech radar items"""
    items = []
    async for item in tech_radar_collection.find().sort("created_at", -1):
        item["_id"] = str(item["_id"])
        items.append(item)
    return items

# Reference Architectures
@app.post("/api/architectures/generate")
async def generate_arch():
    """Generate reference architectures from emergent points"""
    points = []
    async for point in emergent_points_collection.find().sort("created_at", -1).limit(15):
        point["_id"] = str(point["_id"])
        points.append(point)
    
    if not points:
        return {"architectures": [], "message": "No points to analyze"}
    
    architectures = await generate_architectures(points)
    
    # Store generated architectures
    await architectures_collection.delete_many({})  # Clear old
    
    stored_archs = []
    for arch in architectures:
        arch_item = ArchitecturePattern(
            name=arch.get("name", "Unknown Pattern"),
            category=arch.get("category", "general"),
            description=arch.get("description", ""),
            components=arch.get("components", []),
            connections=arch.get("connections", []),
            use_cases=arch.get("use_cases", []),
            benefits=arch.get("benefits", []),
            challenges=arch.get("challenges", []),
            related_points=[p["id"] for p in points[:5]],
            maturity=arch.get("maturity", "emerging")
        )
        arch_dict = arch_item.model_dump()
        arch_dict["created_at"] = arch_item.created_at
        await architectures_collection.insert_one(arch_dict)
        stored_archs.append(arch_dict)
    
    return {"architectures": stored_archs}

@app.get("/api/architectures")
async def get_architectures():
    """Get all reference architectures"""
    archs = []
    async for arch in architectures_collection.find().sort("created_at", -1):
        arch["_id"] = str(arch["_id"])
        archs.append(arch)
    return archs

# Risk & Opportunity Maps
@app.post("/api/risks/generate")
async def generate_risks():
    """Generate risk and opportunity maps from emergent points"""
    points = []
    async for point in emergent_points_collection.find().sort("created_at", -1).limit(15):
        point["_id"] = str(point["_id"])
        points.append(point)
    
    if not points:
        return {"risks": [], "opportunities": [], "message": "No points to analyze"}
    
    risk_data = await generate_risk_map(points)
    
    # Store risks
    await risk_maps_collection.delete_many({})  # Clear old
    
    stored_risks = []
    for risk in risk_data.get("risks", []):
        risk_item = RiskMapItem(
            title=risk.get("title", "Unknown Risk"),
            category=risk.get("category", "technical"),
            severity=risk.get("severity", "medium"),
            probability=risk.get("probability", "medium"),
            description=risk.get("description", ""),
            impact=risk.get("impact", ""),
            mitigation=risk.get("mitigation", ""),
            dependencies=risk.get("dependencies", []),
            affected_domains=risk.get("affected_domains", []),
            source_points=[p["id"] for p in points[:3]]
        )
        risk_dict = risk_item.model_dump()
        risk_dict["created_at"] = risk_item.created_at
        await risk_maps_collection.insert_one(risk_dict)
        stored_risks.append(risk_dict)
    
    stored_opps = []
    for opp in risk_data.get("opportunities", []):
        opp_item = OpportunityItem(
            title=opp.get("title", "Unknown Opportunity"),
            category=opp.get("category", "innovation"),
            potential=opp.get("potential", "medium"),
            description=opp.get("description", ""),
            benefits=opp.get("benefits", []),
            requirements=opp.get("requirements", []),
            timeline=opp.get("timeline", "TBD"),
            source_points=[p["id"] for p in points[:3]]
        )
        opp_dict = opp_item.model_dump()
        await risk_maps_collection.insert_one({**opp_dict, "type": "opportunity"})
        stored_opps.append(opp_dict)
    
    return {"risks": stored_risks, "opportunities": stored_opps}

@app.get("/api/risks")
async def get_risks():
    """Get all risks and opportunities"""
    items = []
    async for item in risk_maps_collection.find().sort("created_at", -1):
        item["_id"] = str(item["_id"])
        items.append(item)
    
    risks = [i for i in items if i.get("type") != "opportunity"]
    opportunities = [i for i in items if i.get("type") == "opportunity"]
    
    return {"risks": risks, "opportunities": opportunities}

# Roadmaps
@app.post("/api/roadmap/generate")
async def generate_roadmap_api():
    """Generate adoption roadmap from emergent points"""
    points = []
    async for point in emergent_points_collection.find().sort("created_at", -1).limit(15):
        point["_id"] = str(point["_id"])
        points.append(point)
    
    if not points:
        return {"roadmap": [], "message": "No points to analyze"}
    
    roadmap_items = await generate_roadmap(points)
    
    # Store roadmap
    await roadmaps_collection.delete_many({})  # Clear old
    
    stored_roadmap = []
    for item in roadmap_items:
        roadmap_item = RoadmapItem(
            title=item.get("title", "Unknown Initiative"),
            phase=item.get("phase", "later"),
            quarter=item.get("quarter", "TBD"),
            domain=item.get("domain", "general"),
            description=item.get("description", ""),
            milestones=item.get("milestones", []),
            dependencies=item.get("dependencies", []),
            effort=item.get("effort", "medium"),
            priority=item.get("priority", "medium"),
            source_points=[p["id"] for p in points[:3]]
        )
        item_dict = roadmap_item.model_dump()
        item_dict["created_at"] = roadmap_item.created_at
        await roadmaps_collection.insert_one(item_dict)
        stored_roadmap.append(item_dict)
    
    return {"roadmap": stored_roadmap}

@app.get("/api/roadmap")
async def get_roadmap():
    """Get current roadmap"""
    items = []
    async for item in roadmaps_collection.find().sort("created_at", -1):
        item["_id"] = str(item["_id"])
        items.append(item)
    return items

# Dashboard Stats
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    points_count = await emergent_points_collection.count_documents({})
    radar_count = await tech_radar_collection.count_documents({})
    arch_count = await architectures_collection.count_documents({})
    risks_count = await risk_maps_collection.count_documents({"type": {"$ne": "opportunity"}})
    opps_count = await risk_maps_collection.count_documents({"type": "opportunity"})
    roadmap_count = await roadmaps_collection.count_documents({})
    
    # Domain distribution
    domains = {}
    async for point in emergent_points_collection.find():
        domain = point.get("domain", "unknown")
        domains[domain] = domains.get(domain, 0) + 1
    
    # Maturity distribution
    maturities = {}
    async for point in emergent_points_collection.find():
        maturity = point.get("maturity", "unknown")
        maturities[maturity] = maturities.get(maturity, 0) + 1
    
    return {
        "total_points": points_count,
        "radar_items": radar_count,
        "architectures": arch_count,
        "risks": risks_count,
        "opportunities": opps_count,
        "roadmap_items": roadmap_count,
        "domain_distribution": domains,
        "maturity_distribution": maturities
    }

# Generate all outputs at once
@app.post("/api/generate-all")
async def generate_all_outputs():
    """Generate all outputs (radar, architectures, risks, roadmap) from current points"""
    points = []
    async for point in emergent_points_collection.find().sort("created_at", -1).limit(20):
        point["_id"] = str(point["_id"])
        points.append(point)
    
    if not points:
        return {"error": "No emergent points found. Please add some points first."}
    
    # Generate all in parallel
    radar_task = generate_tech_radar(points)
    arch_task = generate_architectures(points)
    risk_task = generate_risk_map(points)
    roadmap_task = generate_roadmap(points)
    
    radar_items, architectures, risk_data, roadmap_items = await asyncio.gather(
        radar_task, arch_task, risk_task, roadmap_task
    )
    
    # Store all results
    await tech_radar_collection.delete_many({})
    await architectures_collection.delete_many({})
    await risk_maps_collection.delete_many({})
    await roadmaps_collection.delete_many({})
    
    # Store radar
    stored_radar = []
    for item in radar_items:
        radar_item = TechRadarItem(
            name=item.get("name", "Unknown"),
            quadrant=item.get("quadrant", "tools"),
            ring=item.get("ring", "assess"),
            domain=item.get("domain", "general"),
            description=item.get("description", ""),
            moved=item.get("moved", 0)
        )
        item_dict = radar_item.model_dump()
        item_dict["created_at"] = radar_item.created_at.isoformat()
        await tech_radar_collection.insert_one(item_dict)
        stored_radar.append(len(stored_radar))
    
    # Store architectures
    for arch in architectures:
        arch_item = ArchitecturePattern(
            name=arch.get("name", "Unknown"),
            category=arch.get("category", "general"),
            description=arch.get("description", ""),
            components=arch.get("components", []),
            connections=arch.get("connections", []),
            use_cases=arch.get("use_cases", []),
            benefits=arch.get("benefits", []),
            challenges=arch.get("challenges", []),
            maturity=arch.get("maturity", "emerging")
        )
        await architectures_collection.insert_one(arch_item.model_dump())
    
    # Store risks and opportunities
    for risk in risk_data.get("risks", []):
        risk_item = RiskMapItem(
            title=risk.get("title", "Unknown"),
            category=risk.get("category", "technical"),
            severity=risk.get("severity", "medium"),
            probability=risk.get("probability", "medium"),
            description=risk.get("description", ""),
            impact=risk.get("impact", ""),
            mitigation=risk.get("mitigation", ""),
            dependencies=risk.get("dependencies", []),
            affected_domains=risk.get("affected_domains", [])
        )
        await risk_maps_collection.insert_one(risk_item.model_dump())
    
    for opp in risk_data.get("opportunities", []):
        opp_item = OpportunityItem(
            title=opp.get("title", "Unknown"),
            category=opp.get("category", "innovation"),
            potential=opp.get("potential", "medium"),
            description=opp.get("description", ""),
            benefits=opp.get("benefits", []),
            requirements=opp.get("requirements", []),
            timeline=opp.get("timeline", "TBD")
        )
        await risk_maps_collection.insert_one({**opp_item.model_dump(), "type": "opportunity"})
    
    # Store roadmap
    for item in roadmap_items:
        roadmap_item = RoadmapItem(
            title=item.get("title", "Unknown"),
            phase=item.get("phase", "later"),
            quarter=item.get("quarter", "TBD"),
            domain=item.get("domain", "general"),
            description=item.get("description", ""),
            milestones=item.get("milestones", []),
            dependencies=item.get("dependencies", []),
            effort=item.get("effort", "medium"),
            priority=item.get("priority", "medium")
        )
        await roadmaps_collection.insert_one(roadmap_item.model_dump())
    
    return {
        "success": True,
        "generated": {
            "radar_items": len(radar_items),
            "architectures": len(architectures),
            "risks": len(risk_data.get("risks", [])),
            "opportunities": len(risk_data.get("opportunities", [])),
            "roadmap_items": len(roadmap_items)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
