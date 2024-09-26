import os
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

index_name = "goal-tracker"

if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=1024, 
        metric="cosine", 
        spec=ServerlessSpec(
            cloud="gcp", 
            region="europe-west4"
        ) 
    ) 

def upsert_to_pinecone(index_name, data):
    index = pc.Index(index_name)
    index.upsert(data)

def query_pinecone(index_name, query):
    index = pc.Index(index_name)
    return index.query(query)

def create_embeddings(text):
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    return client.embeddings.create(input=text, model="text-embedding-ada-002").data[0].embedding
