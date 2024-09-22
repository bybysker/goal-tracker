from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()

@app.get("/api/python", response_class=HTMLResponse)
def hello_world():
    return "<p>Hello, World!</p>"