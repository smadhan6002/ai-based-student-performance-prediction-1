from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from schemas import StudentPredictionRequest, StudentPredictionResponse
from services.prediction_service import load_model, get_model, predict_student
from services.supabase_service import upsert_student, save_prediction

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load the machine learning model
    logger.info("Starting up FastAPI server...")
    success = load_model()
    if not success:
        logger.error("WARNING: Failed to load the ML model on startup.")
    yield
    # Shutdown
    logger.info("Shutting down FastAPI server...")


app = FastAPI(
    title="AI-Based Student Performance Prediction API",
    description="API for serving the trained Random Forest model for student performance prediction.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for local React frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "ok",
        "model_loaded": get_model() is not None,
    }


@app.post("/predict", response_model=StudentPredictionResponse)
def predict(request: StudentPredictionRequest):
    """
    Predict student performance using the trained Random Forest model.

    Flow:
      1. Validate that the ML model is loaded.
      2. Run the ML model on the 8 academic input features.
      3. Upsert the student record in Supabase (insert or update on student_id).
      4. Insert a new prediction row in Supabase.
      5. Return the ML result to the React frontend (unchanged format).

    If the ML prediction succeeds but Supabase save fails:
      - The ML result is still returned (db_saved=False).
      - The error is logged on the backend.
      - No credentials or stack traces are exposed to the frontend.
    """
    if get_model() is None:
        raise HTTPException(
            status_code=503,
            detail="Machine learning model is currently unavailable.",
        )

    # ---- Step 1: Run ML prediction ----------------------------------------
    # Extract only the 8 academic fields for the model — identity fields excluded.
    ml_input = {
        "attendance":               request.attendance,
        "internal_marks":           request.internal_marks,
        "assignment_average":       request.assignment_average,
        "previous_semester_marks":  request.previous_semester_marks,
        "study_hours":              request.study_hours,
        "assignment_completion":    request.assignment_completion,
        "class_participation":      request.class_participation,
        "failed_subjects":          request.failed_subjects,
    }

    try:
        ml_result = predict_student(ml_input)
    except Exception as exc:
        logger.error(f"ML prediction error: {exc}")
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred during prediction.",
        )

    prediction_label: str = ml_result["prediction"]
    probabilities: dict = ml_result["probabilities"]

    # ---- Step 2: Persist to Supabase ----------------------------------------
    db_saved = False
    try:
        # 2a. Upsert student — returns the full row including students.id (UUID)
        student_row = upsert_student(
            student_id=request.student_id,
            student_name=request.student_name,
            department=request.department,
            year=request.year,
            semester=request.semester,
        )

        # 2b. Insert prediction — linked via students.id UUID (FK), not the text student_id
        student_db_uuid: str = student_row["id"]
        save_prediction(
            student_db_uuid=student_db_uuid,
            attendance=request.attendance,
            internal_marks=request.internal_marks,
            assignment_average=request.assignment_average,
            previous_semester_marks=request.previous_semester_marks,
            study_hours=request.study_hours,
            assignment_completion=request.assignment_completion,
            class_participation=request.class_participation,
            failed_subjects=request.failed_subjects,
            prediction=prediction_label,
            probabilities=probabilities,
        )

        db_saved = True
        logger.info(
            f"Prediction persisted — student_id={request.student_id}, "
            f"db_uuid={student_db_uuid}, result={prediction_label}"
        )

    except Exception as exc:
        # ML succeeded — still return the result but flag the DB failure.
        # Do NOT expose the actual exception message (may contain DB details).
        logger.error(
            f"Supabase persistence failed for student_id={request.student_id}: {exc}"
        )
        db_saved = False


    # ---- Step 3: Return response (same format as before + db_saved flag) ----
    return {
        "prediction": prediction_label,
        "probabilities": probabilities,
        "db_saved": db_saved,
    }


@app.get("/students")
def get_all_students_endpoint():
    """
    Get all students and their predictions.
    """
    from services.supabase_service import get_all_students
    return get_all_students()

@app.get("/students/{student_uuid}")
def get_student(student_uuid: str):
    """
    Get student details and their prediction history by UUID.
    """
    from services.supabase_service import get_student_with_predictions
    student = get_student_with_predictions(student_uuid)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
