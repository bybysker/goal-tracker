import os
import io
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import firebase_admin
from firebase_admin import credentials, firestore
from api.goal_to_tasks import GoalToTasks, Goal
from api.profiling import ProfileDefinition, RawProfile

# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app = FastAPI()

GCP_DEPLOYMENT = os.getenv('GCP_DEPLOYMENT', 'True') == 'True'

def initialize_firestore():
    """
    Initialize Firestore based on the platform.
    """
    if GCP_DEPLOYMENT:
        # Initialize Firestore for GCP
        firebase_admin.initialize_app()
    else:
        # Initialize Firestore for other platforms
        cred = credentials.Certificate("api/cred.json")
        firebase_admin.initialize_app(cred)
    
    return firestore.client()

db = initialize_firestore()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to the origins you want to allow
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class ProfileFormData(BaseModel):
    user_id: str
    profile_data: RawProfile

class PreGoal(BaseModel):
    what: str
    why: str
    when: str

class PreGoalFormData(BaseModel):
    user_id: str
    pre_goal_data: PreGoal


class ValidatedGoalFormData(BaseModel):
    user_id: str
    validated_goal: str

class MilestoneFormInfo(BaseModel):
    user_id: str
    guid: str
    muid: str

@app.get('/')
def root():
    return {"message": "Hello World"}

@app.post('/transcribe_voice')
def transcribe_voice(voice_memo: UploadFile = File(...)):
    """
    Endpoint to transcribe a voice memo for a given user.

    Args:
    - voice_memo (UploadFile): The uploaded voice memo file.

    Returns:
    - dict: A dictionary containing the transcription text.
    """

    prompt = ""
    try:
        # Open the audio file
        audio_file = voice_memo.file.read()
        buffer = io.BytesIO(audio_file)

        buffer.name = voice_memo.filename
        # Transcribe the audio file using OpenAI's Whisper model
        transcription = client.audio.transcriptions.create(
            model="whisper-1", 
            file=buffer,
            response_format="text"
        )
        
        # Return the transcription text
        return {"transcription": transcription}
    
    except Exception as e:
        # Handle exceptions and return an error message
        return {"error": str(e)}

@app.post('/profile_definition')
def profile_definition(profile_form_data: ProfileFormData):
    profile = ProfileDefinition(client, db, profile_form_data.user_id)
    refined_profile = profile.profile_definition(profile_form_data.profile_data)
    profile.save_profile(refined_profile)
    return refined_profile

@app.post('/smart_goal')
def smart_goal(pre_goal_form_data: PreGoalFormData):
    goal_to_tasks = GoalToTasks(db, client, pre_goal_form_data.user_id)
    goal = goal_to_tasks.smart_goal(pre_goal_form_data.pre_goal_data)
    return goal

@app.post('/generate_milestones_and_tasks')
def generate_milestones_and_tasks(validated_goal_form_data: ValidatedGoalFormData):
    goal_to_tasks = GoalToTasks(db, client, validated_goal_form_data.user_id)
    milestones_and_tasks = goal_to_tasks.generate_milestones_and_tasks(validated_goal_form_data.validated_goal)
    return milestones_and_tasks