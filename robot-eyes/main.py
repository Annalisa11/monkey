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

def get_current_time():
    return time.time() * 1000

@app.get("/smile")
def smile():
    eye_app.animation.trigger_smile(get_current_time())
    return {"status": "Smiling animation triggered"}

@app.get("/laugh")
def laugh():
    eye_app.animation.trigger_laugh()
    return {"status": "Laughing animation triggered"}

@app.get("/star")
def star():
    eye_app.animation.trigger_star(get_current_time())
    return {"status": "Star eyes animation triggered"}

@app.get("/concentrate")
def concentrate():
    eye_app.animation.trigger_concentrate(get_current_time())
    return {"status": "Concentrating eyes animation triggered"}


if __name__ == "__main__":
    api_thread = threading.Thread(target=run_api_server, daemon=True)
    pygame_thread = threading.Thread(target=run_pygame_eye_app)
    
    api_thread.start()
    pygame_thread.start()
    
    pygame_thread.join()
