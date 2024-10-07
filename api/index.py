import os
import io
from dotenv import load_dotenv
from datetime import date
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File
from openai import OpenAI
import firebase_admin
from firebase_admin import credentials, firestore
from prompts import task_generation_prompt


#from some_vector_db_library import VectorDBClient
embed_model = "text-embedding-ada-002"
# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app = FastAPI()

# Initialize Firestore
cred = credentials.Certificate("api/firebase_credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
#doc_ref = db.collection("users").document("aturing")

class Tasks(BaseModel):
    id: str
    title: str
    completed: bool
#    date: date
    goal_id: str

def generate_tasks(user_id: str, goal_id: str, augmented_context: str = "None"):

    # Get user profile
    user_profile_docs = db.collection("users").document(user_id).collection("userProfile").stream()
    user_profile_doc = next(user_profile_docs, None)  # Get the first document

    user_profile_data = user_profile_doc.to_dict()

    # Get the goal 
    goal_doc = db.collection("users", user_id, "goals").document(goal_id).get()
    #user_ids = [user.id for user in users.stream()]
    goal_data = goal_doc.to_dict()

    tasks_prompt = task_generation_prompt(user_profile_data, goal_data)

    # Logic to generate tasks based on a prompt and augmented context
    completion = client.beta.chat.completions.parse(
        model='gpt-4o-2024-08-06',
        messages=[{"role": "user", "content": tasks_prompt}],
        response_format=Tasks
    )
    
    tasks = completion.choices[0].message.parsed
    return tasks

@app.post('/define_tasks')
def define_tasks(user_id: int, prompt: str):
    # Logic to define tasks based on a prompt and augmented context from a vector database in Firestore

    # Initialize Vector Database Client
    #vector_db_client = VectorDBClient(api_key="your_vector_db_api_key")

    # Fetch user history from Firestore
    user_history_ref = db.collection('user_histories').document(str(user_id))
    user_history = user_history_ref.get().to_dict()

    # Augment context using vector database
    augmented_context = vector_db_client.get_augmented_context(user_history)

    # Define tasks based on prompt and augmented context
    tasks = generate_tasks(prompt, augmented_context)  # Replace with actual task generation logic

    return {"tasks": tasks}

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

print(generate_tasks("oQP2oJzlrtR84IjAlQYizLSFywT2", "XJoJ8iTirGwydAQ5pm5J"))


