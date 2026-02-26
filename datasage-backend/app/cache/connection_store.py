# app/cache/connection_store.py
import json
from app.cache.redis_cache import get_redis_client

def get_conn_key(user_id: str) -> str:
    return f"user_conn:{user_id}"

def save_connection(user_id: str, db_id: str, schema_name: str, db_conn_string: str):
    client = get_redis_client()
    if not client:
        # Fallback to dict for local dev if Redis isn't running
        print("Warning: Redis disabled. State will not persist across workers.")
        return 
    
    data = {
        "db_id": db_id,
        "schema_name": schema_name,
        "db_conn_string": db_conn_string
    }
    
    # Save with an expiration time (e.g., 24 hours = 86400 seconds)
    client.setex(get_conn_key(user_id), 86400, json.dumps(data))

def get_connection(user_id: str):
    client = get_redis_client()
    if not client:
        return None
        
    val = client.get(get_conn_key(user_id))
    return json.loads(val) if val else None
