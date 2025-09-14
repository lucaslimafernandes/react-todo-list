import os
from typing import List, Optional
from uuid import uuid4

from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Session, create_engine, select

DB_URL = os.getenv("DB_URL")
engine = create_engine(DB_URL, echo=False)

class ListModel(SQLModel, table=True):
    id: str = Field(primary_key=True, index=True)

class Item(SQLModel, table=True):
    id: str = Field(default_factory=lambda: uuid4().hex, primary_key=True, index=True)
    list_id: str = Field(index=True, foreign_key="listmodel.id")
    text: str
    done: bool = False



class ItemCreate(BaseModel):
    text: str

class ItemUpdate(BaseModel):
    text: Optional[str]  = None
    done: Optional[bool] = None

class ListOut(BaseModel):
    id: str
    items: List[Item]

def get_session():
    with Session(engine) as session:
        yield session


def ensure_list(session: Session, list_id: str) -> List:
    lst = session.get(List, list_id)

    if not lst:
        lst = ListModel(id=list_id)
        session.add(lst)
        session.commit()
        session.refresh()

    return lst


