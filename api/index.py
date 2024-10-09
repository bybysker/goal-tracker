import os
import io
from rich import print
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File
from openai import OpenAI
import firebase_admin
from firebase_admin import credentials, firestore
from goal_to_tasks import TasksGeneration, MilestonesGeneration


#from some_vector_db_library import VectorDBClient
embed_model = "text-embedding-ada-002"
# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app = FastAPI()

# Initialize Firestore
cred_path = os.path.join(os.path.dirname(__file__), "firebase_credentials.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
db = firestore.client()



@app.post('/define_tasks')
def define_tasks():
    pass

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

