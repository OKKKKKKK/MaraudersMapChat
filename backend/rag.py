from dotenv import load_dotenv
import os, glob

from openai import OpenAI
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from langchain.schema import SystemMessage, HumanMessage

load_dotenv()
client = OpenAI()

folder = "./data/*.txt"
files = glob.glob(folder)

docs_list = []

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        text = f.read()
        movie_name = os.path.basename(file)
        docs_list.append(Document(page_content=text, metadata={"source": movie_name}))

print("Loaded docs:", len(docs_list))

text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=300,
    chunk_overlap=40
)

doc_splits = text_splitter.split_documents(docs_list)
print("Total chunks:", len(doc_splits))

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = InMemoryVectorStore.from_documents(doc_splits, embeddings)

retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
# llm = ChatOpenAI(model="gpt-5", temperature=none)
llm = ChatOpenAI(model="gpt-4.1-mini")

print("✅ Multi-movie RAG setup complete")

def answer_query(query):
    docs = retriever.invoke(query)
    context = "\n\n".join([d.page_content for d in docs])
    
    response = llm.invoke([
        SystemMessage(content="You are a Harry Potter assistant." \
        "If context answers question, use it. " \
        "If context is weak, answer creatively but stay consistent with canon — " \
        "DO NOT hallucinate new facts. Say if info is unclear."),
        HumanMessage(content=f"Context:\n{context}\n\nQuestion: {query}")
    ])

    return response, docs