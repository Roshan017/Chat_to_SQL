from fastapi import APIRouter, HTTPException
from app.graph.graph import build_DataSage_graph
from app.models.schema import SchemaResponse, SchemaRequest, PrunedResponse
from app.graph.nodes.schema_loader import schema_loader_node
from app.graph.state import DataSageState
from app.cache.connection_store import save_connection


router = APIRouter()

graph = build_DataSage_graph()


@router.post("/load_schema", response_model=SchemaResponse)
def load_schema(req: SchemaRequest):
    """Load and return the schema of the DataSage graph database."""
    save_connection(req.user_id, req.db_id, req.schema_name, req.db_conn_string)
    try:
        result = schema_loader_node({
            "db_id": req.db_id,
            "schema_name": req.schema_name,
            "db_conn_string": req.db_conn_string
            
        })

        

    except Exception as e:
        raise HTTPException(status_code=500, detail= str(e))
    
    return{
        "version": "v1",
        "tables": result["schema"]["tables"],
        "logical_to_physical": result["schema"]["logical_to_physical"]
    }