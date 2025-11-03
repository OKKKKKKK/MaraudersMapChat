from fastapi import FastAPI
from pydantic import BaseModel
from rag import answer_query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Q(BaseModel):
    query: str

@app.get("/")
def root():
    return {"message": "Backend Running ✅"}

@app.post("/ask")
async def ask(q: Q):
    answer = answer_query(q.query)
    return {"answer": answer}

@app.get("/test")
def test():
    return {"status": "ok"}
