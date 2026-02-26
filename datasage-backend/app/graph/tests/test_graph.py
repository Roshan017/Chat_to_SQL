from app.graph.graph import build_DataSage_graph

def test_langgraph():
    graph = build_DataSage_graph()

    state = {
        "user_query": "load schema",
        "db_id": "tenant_analytics",
        "schema_name": "public",
    }

    result = graph.invoke(state)

    print("✅ Graph executed")
    print("Keys:", result.keys())
    print("Tables:", list(result["schema"]["tables"].keys())[:5])

if __name__ == "__main__":
    test_langgraph()
