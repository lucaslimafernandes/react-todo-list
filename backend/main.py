import os
from typing import List, Optional
from contextlib import asynccontextmanager
from uuid import uuid4

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select

from models import engine, ListOut, get_session, ensure_list, Item, ItemCreate

@asynccontextmanager
async def lifespan(app: FastAPI):

    SQLModel.metadata.create_all(engine)

    try:
        yield
    finally:
        engine.dispose()



origins = os.getenv("ORIGINS", "http://localhost:5173").split(",")

app = FastAPI(title="todo list react - API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods="*",
    allow_headers="*",
)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/lists/{list_id}", response_model=ListOut)
def get_list(list_id: str, session: Session=Depends(get_session)):

    ensure_list(session, list_id)
    items = session.exec(
        select(Item).
        where(Item.list_id == list_id).
        order_by(Item.id.desc())
    ).all()

    return {"id": list_id, "items": items}

@app.post("/lists/{list_id}/items", response_model=Item, status_code=201)
def add_item(list_id: str, payload: ItemCreate, session: Session = Depends(get_session)):

    ensure_list(session, list_id)
    item = Item(list_id=list_id, text=payload.text, done=False)
    session.add(item)
    session.commit()
    session.refresh()

    return item


