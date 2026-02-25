from fastapi import APIRouter, HTTPException 
from app.models.schema import DB_Request



router = APIRouter()

@router.post("/input_db_details")
def connect_db(req:DB_Request ):
    """
    Connect to DB with the given input
    """