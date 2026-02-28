from pydantic import BaseModel, Field
from typing import Dict, List

class ForeignKeyRef(BaseModel):
    table: str
    column: str

class ForeignKey(BaseModel):
    column: str
    references: ForeignKeyRef

class TableSchema(BaseModel):
    columns: Dict[str, str]
    primary_key: List[str]
    foreign_keys: List[ForeignKey]

class SchemaResponse(BaseModel):
    version: str = "v1"
    tables: Dict[str, TableSchema]
    logical_to_physical: Dict[str, List[str]]




class SchemaRequest(BaseModel):
    user_id: str = Field(..., example="user_123")
    db_id: str = Field(..., example="tenant_analytics")
    schema_name: str = Field(default="public", example="public")
    db_conn_string: str = Field(..., example="postgresql://user:password@host:port/database")

class DisconnectRequest(BaseModel):
    user_id: str = Field(..., example="user_123")


class PrunedResponse(BaseModel):
    version: str = 'v2'
    tables: Dict[str, TableSchema]
    