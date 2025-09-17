import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.docstore.document import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import AzureChatOpenAI
from langchain.chains import RetrievalQA
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import os

load_dotenv()


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

# ========== STEP 1: Initialize Components ==========
def initialize_components():
    # Qdrant Connection
    client = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )

    # Embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Vector Stores
    data_store = QdrantVectorStore(
        client=client,
        embedding=embeddings,
        collection_name="my_json_collection"
    )

    context_store = QdrantVectorStore(
        client=client,
        embedding=embeddings,
        collection_name="context_collection"
    )

    # LLM
    llm = AzureChatOpenAI(
        azure_deployment=os.getenv("AZURE_DEPLOYMENT"),
        api_key=os.getenv("AZURE_API_KEY"),
        azure_endpoint=os.getenv("AZURE_ENDPOINT"),
        api_version=os.getenv("AZURE_API_VERSION"),
        temperature=0,
    )

    # Prompts
    data_prompt = PromptTemplate(
        template="""You are a helpful assistant.
Use the retrieved documents to provide a clear, detailed, and descriptive answer to the query. 
Add relevant explanations, context, and background so the user fully understands.

Question: {question}
Context: {context}
Answer:""",
        input_variables=["question", "context"],
    )

    context_prompt = PromptTemplate(
        template="""You are a precise assistant for generating charts using charts/diagram/code snippets.  
Follow these rules strictly:
- Provide the code/output ONLY, without explanations unless explicitly asked.  
- If the query is about mermaid, write pure mermaid syntax without any () brackets or markdown formatting.  
- If the query is about Chart or graph or plot, return valid JSON config code for Chart.js.  
- If the query is about other libraries, follow their raw syntax exactly.  
- Do not wrap output in markdown ``` blocks unless explicitly requested.

Question: {question}
Context: {context}
Answer:""",
        input_variables=["question", "context"],
    )

    # QA Chains
    data_qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=data_store.as_retriever(search_kwargs={"k": 5}),
        return_source_documents=True,
        chain_type_kwargs={"prompt": data_prompt},
    )

    context_qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=context_store.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True,
        chain_type_kwargs={"prompt": context_prompt},
    )

    return data_store, data_qa, context_qa, llm

# Initialize components
data_store, data_qa, context_qa, llm = initialize_components()

# ========== STEP 2: Response Formatting Function ==========
def format_response_with_ai(raw_message, chart_code, original_query, llm, metadata):
    """
    Use Azure OpenAI to format the response into frontend-friendly format
    """
    
    # Create formatting prompt
    formatting_prompt = f"""
You are a response formatter. Your task is to convert detailed RAG responses into clean, frontend-friendly formats.

Original Query: {original_query}
Raw Response: {raw_message}

Format the response according to these rules:
1. Keep it concise (6-7 lines maximum)
2. Use bullet points or short paragraphs for better readability
3. Remove unnecessary technical details
4. Make it conversational and easy to understand
5. Focus on key insights and main points

Provide ONLY the formatted message content, no additional text or explanations.
"""

    try:
        formatted_response = llm.invoke(formatting_prompt)
        formatted_message = formatted_response.content.strip()
    except Exception as e:
        # Fallback formatting if AI fails
        formatted_message = format_message_fallback(raw_message)
    
    # Determine if query needs chart/mermaid
    chart_keywords = ['chart', 'graph', 'plot', 'visualization', 'diagram']
    mermaid_keywords = ['hierarchy', 'flowchart', 'structure', 'organization', 'flow', 'process']
    
    response = [{"message": formatted_message}]
    
    # Add chart/mermaid if requested and available
    if chart_code and chart_code.strip():
        query_lower = original_query.lower()
        
        if any(keyword in query_lower for keyword in mermaid_keywords):
            # Clean mermaid code
            clean_code = clean_mermaid_code(chart_code)
            response.append({"mermaid": clean_code})
        elif any(keyword in query_lower for keyword in chart_keywords):
            # Clean chart.js code
            clean_code = clean_chart_code(chart_code)
            response.append({"chart": clean_code})
    
    # Add metadata
    response.append({"metadata": metadata})
    
    return response

def format_message_fallback(raw_message):
    """
    Fallback formatting function if AI formatting fails
    """
    # Split into sentences and take key points
    sentences = raw_message.split('.')
    key_sentences = [s.strip() for s in sentences[:4] if s.strip()]
    
    # Format as bullet points if multiple sentences
    if len(key_sentences) > 1:
        formatted = "• " + "\n• ".join(key_sentences)
    else:
        formatted = raw_message[:300] + "..." if len(raw_message) > 300 else raw_message
    
    return formatted

def clean_chart_code(code):
    """Clean and extract Chart.js configuration"""
    if not code:
        return ""
    
    # Extract const config = {...} part
    config_match = re.search(r'const\s+config\s*=\s*\{.*?\};', code, re.DOTALL)
    if config_match:
        return config_match.group(0)
    
    # If no const config found, return the code as is (might already be clean)
    return code.strip()

def clean_mermaid_code(code):
    """Clean and extract Mermaid diagram code"""
    if not code:
        return ""
    
    # Remove markdown code blocks if present
    code = re.sub(r'```mermaid\n?', '', code)
    code = re.sub(r'```\n?', '', code)
    
    # Remove any extra whitespace
    code = code.strip()
    
    return code

# ========== STEP 3: Flask API Endpoint ==========
@app.route('/query', methods=['POST'])
def process_query():
    try:
        # Get query from request
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({"error": "Query parameter is required"}), 400
        
        query = data['query']
        
        # Stage 1: Query data collection
        results = data_store.similarity_search_with_score(query, k=3)
        if not results or max(score for _, score in results) < 0.37:
            return jsonify({
                "response": [{"message": "I don't have enough information to answer this query based on the stored documents."}]
            }), 200

        # Get stage 1 response (detailed answer)
        stage1 = data_qa({"query": query})
        stage1_answer = stage1["result"]
        
        # Extract metadata from stage1 source documents
        metadata = {
            "source_documents": [
                {
                    "title": doc.metadata.get("title", "Unknown"),
                    "source": doc.metadata.get("source", "Unknown"),
                    "pages": doc.metadata.get("pages", [])
                }
                for doc in stage1["source_documents"]
            ],
            "total_sources": len(stage1["source_documents"])
        }


        # Stage 2: Get chart/mermaid context
        stage2 = context_qa({"query": stage1_answer})
        chart_code = stage2["result"]

        # Format response using Azure OpenAI
        formatted_response = format_response_with_ai(
            raw_message=stage1_answer,
            chart_code=chart_code,
            original_query=query,
            llm=llm,
            metadata=metadata
        )

        return jsonify({"response": formatted_response}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "RAG API is running"}), 200

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "RAG Query API",
        "endpoints": {
            "/query": "POST - Send a query to get formatted response",
            "/health": "GET - Health check"
        }
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)