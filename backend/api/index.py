import os
import io
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File, HTTPException
from openai import OpenAI
import firebase_admin
from firebase_admin import credentials, firestore
from api.goal_to_tasks import TasksGeneration, MilestonesGeneration, Goal

#from some_vector_db_library import VectorDBClient
embed_model = "text-embedding-ada-002"
# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app = FastAPI()

# Initialize Firestore
firebase_admin.initialize_app()
db = firestore.client()

class GoalFormData(BaseModel):
    user_id: str
    goal_data: Goal

class MilestoneFormInfo(BaseModel):
    user_id: str
    guid: str
    muid: str

@app.post('/generate_milestones')
def generate_milestones(goal_form_data: GoalFormData):
    """
    Endpoint to generate milestones for a given user and goal.

    Args:
    - user_id (str): The ID of the user.
    - goal_data (Goal): The ID of the goal.

    Returns:
    - dict: A dictionary containing the generated milestones.
    """
    user_id = goal_form_data.user_id
    goal_data = goal_form_data.goal_data
    try:
        milestone_generator = MilestonesGeneration(db, client, user_id, goal_data)
        milestones = milestone_generator.generate_milestones()
        return {"milestones": milestones}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post('/generate_tasks')
def generate_tasks(milestone_form_info: MilestoneFormInfo):
    """
    Endpoint to generate tasks for a given user, goal, and milestone.

    Args:
    - user_id (str): The ID of the user.
    - guid (str): The ID of the goal.
    - muid (str): The ID of the milestone.

    Returns:
    - dict: A dictionary containing the generated tasks.
    """
    user_id = milestone_form_info.user_id
    guid = milestone_form_info.guid
    muid = milestone_form_info.muid

    try:
        task_generator = TasksGeneration(db, client, user_id, guid, muid)
        tasks = task_generator.generate_tasks()
        return {"tasks": tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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

#goal_doc = db.collection("users", "oQP2oJzlrtR84IjAlQYizLSFywT2", "goals").document("XJoJ8iTirGwydAQ5pm5J").get()
    #user_ids = [user.id for user in users.stream()]
#goal_data = goal_doc.to_dict()

#print(TasksGeneration("saIj3tndzESNUy2jO5iU5SMKFU73", "qXJvA5OU0nHcSj9f0gsj").generate_tasks())
#print(TasksGeneration("saIj3tndzESNUy2jO5iU5SMKFU73", "qXJvA5OU0nHcSj9f0gsj").formulate_goal())
#print(TasksGeneration("saIj3tndzESNUy2jO5iU5SMKFU73", "qXJvA5OU0nHcSj9f0gsj").user_profile_data)
#print(TasksGeneration("saIj3tndzESNUy2jO5iU5SMKFU73", "qXJvA5OU0nHcSj9f0gsj").goal_data)

