import threading
from eyes import MonkeyEyeApp
import time
import uvicorn
from fastapi import FastAPI


app = FastAPI()
eye_app = None

def run_api_server():
    uvicorn.run(app, host="0.0.0.0", port=8000)

def run_pygame_eye_app():
    global eye_app
    eye_app = MonkeyEyeApp()
    eye_app.run()

@app.get("/smile")
def smile():
    current_time = time.time() * 1000
    eye_app.animation.trigger_smile(current_time)
    return {"status": "Smiling animation triggered"}

@app.post("/laugh")
def laugh():
    eye_app.animation.trigger_laugh()
    return {"status": "Laughing animation triggered"}


if __name__ == "__main__":
    api_thread = threading.Thread(target=run_api_server, daemon=True)
    pygame_thread = threading.Thread(target=run_pygame_eye_app)
    
    api_thread.start()
    pygame_thread.start()
    
    pygame_thread.join()
