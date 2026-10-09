from pydantic import BaseModel, Field
from typing import Optional

class StudentPredictionRequest(BaseModel):
    # --- Student identity (stored in Supabase, NOT sent to ML model) ---
    student_name: str = Field(..., min_length=1, description="Student's full name")
    student_id: str = Field(..., min_length=1, description="Unique student identifier")
    department: str = Field(..., min_length=1)
    year: str = Field(..., min_length=1)
    semester: str = Field(..., min_length=1)

    # --- Academic inputs (sent to ML model AND stored in Supabase) ---
    attendance: float = Field(..., ge=0, le=100)
    internal_marks: float = Field(..., ge=0, le=100)
    assignment_average: float = Field(..., ge=0, le=100)
    previous_semester_marks: float = Field(..., ge=0, le=100)
    study_hours: float = Field(..., ge=0, le=12)
    assignment_completion: float = Field(..., ge=0, le=100)
    class_participation: float = Field(..., ge=0, le=100)
    failed_subjects: int = Field(..., ge=0, le=10)


class PredictionProbabilities(BaseModel):
    Excellent: float = Field(default=0.0)
    Good: float = Field(default=0.0)
    Average: float = Field(default=0.0)
    At_Risk: float = Field(default=0.0, alias="At Risk")

    class Config:
        populate_by_name = True


class StudentPredictionResponse(BaseModel):
    prediction: str
    probabilities: PredictionProbabilities
    # Optional flag: True = saved to Supabase, False = prediction succeeded but DB save failed
    db_saved: Optional[bool] = None

