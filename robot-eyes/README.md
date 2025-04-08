# 🐵 Monkey Eyes Animation + API

## A Pygame-based animation system for robot eyes

## 🕹️ Controls (Keyboard)

| Key   | Action           |
| ----- | ---------------- |
| `L`   | Trigger laughing |
| `S`   | Trigger smiling  |
| `ESC` | Exit application |

_Blinking and looking happen automatically when idle._

## 🌐 API Documentation

You can now trigger animations over HTTP using a built-in FastAPI server.

Start the app (see below), then access:

- **GET** `/smile`  
  → Triggers a smiling animation

- **POST** `/laugh`  
  → Triggers a laughing animation

## 🔮 Setting Up a Virtual Environment

check out more info on virtual environments in python [here](https://fastapi.tiangolo.com/virtual-environments/#create-a-virtual-environment)

```bash
# Create a virtual environment
python -m venv venv

# Activate it
source venv/bin/activate

# On windows Powershell
# You might need to activate scripts before:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
# Activate
.\venv\Scripts\Activate.ps1

# Install project dependencies inside the venv (see below)

# Deactivate
deactivate
```

Your terminal will show something like this when activated:

```
(venv) pi@raspberrypi:~/monkey-eyes $
```

Then start your app as usual (within the venv):

```bash
python main.py
```

## ▶️ Running the App

### Step 1: Find your Pi's local IP

```bash
hostname -I
```

example output: `192.168.1.42`

### Step 2: Run the App

To launch both the **animation window** and the **API server**, run:

```bash
python main.py
```

This starts:

- The animation app (MonkeyEyeApp via Pygame)
- A FastAPI server in a separate thread (localhost:8000)

### Step 3: Call the Endpoints from another Device on the same Network

Try it out with `curl`:

```bash
curl http://192.168.1.42:8000/smile
curl -X POST http://192.168.1.42:8000/laugh
```

Or open the interactive docs at:  
📘 http://192.168.1.42:8000/docs

## 🛠️ Requirements

- Python 3.7+
- Pygame
- FastAPI
- Uvicorn

Install dependencies:

```bash
pip install pygame fastapi[standard]
```

## 🧪 Features & Animations

- **Blinking**: Eyes shrink and restore naturally.
- **Laughing**: Eyes bounce up and down in 4 cycles.
- **Smiling**: Circular eyes with lifted top arc.
- **Look Sideways**: Eyes move left/right with directional stretch.
- **API Control**: Trigger animations remotely via HTTP endpoints.

## 🖼️ Screenshots
