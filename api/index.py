import os
from dotenv import load_dotenv
from fastapi import FastAPI
from openai import OpenAI
import firebase_admin
from firebase_admin import credentials, firestore

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
doc_ref = db.collection("users").document("aturing")

def generate_tasks(prompt: str, augmented_context: str):
    # Logic to generate tasks based on a prompt and augmented context
    # This is a placeholder and should be replaced with actual task generation logic
    return [{"task": "Task 1"}, {"task": "Task 2"}]

@app.post('/define_tasks')
def define_tasks(user_id: int, prompt: str):
    # Logic to define tasks based on a prompt and augmented context from a vector database in Firestore

    # Initialize Vector Database Client
    vector_db_client = VectorDBClient(api_key="your_vector_db_api_key")

    # Fetch user history from Firestore
    user_history_ref = db.collection('user_histories').document(str(user_id))
    user_history = user_history_ref.get().to_dict()

    # Augment context using vector database
    augmented_context = vector_db_client.get_augmented_context(user_history)

    # Define tasks based on prompt and augmented context
    tasks = generate_tasks(prompt, augmented_context)  # Replace with actual task generation logic

    return {"tasks": tasks}

@app.post('/transcribe_voice')
def transcribe_voice(voice_memo_path: str,user_id: int = 0):
    """
    Endpoint to transcribe a voice memo for a given user.

    Args:
    - user_id (int): The ID of the user.
    - voice_memo_path (str): The file path to the voice memo.

    Returns:
    - dict: A dictionary containing the transcription text.
    """
    try:
        # Open the audio file
        with open(voice_memo_path, "rb") as audio_file:
            # Transcribe the audio file using OpenAI's Whisper model
            transcription = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file,
                response_format="text"
            )
        
        # Return the transcription text
        return {"transcription": transcription}
    
    except Exception as e:
        # Handle exceptions and return an error message
        return {"error": str(e)}
