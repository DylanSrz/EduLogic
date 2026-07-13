from fastapi import FastAPI

app = FastAPI(title="EduLogic API")

@app.get("/health")
def health():
    return {"estado": "ok"}