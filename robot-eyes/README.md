# Monkey Eyes Animation Library Documentation

## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Core Classes](#core-classes)
4. [Configuration & Customization](#configuration--customization)
5. [Animation States](#animation-states)
6. [Usage Examples](#usage-examples)
7. [API Reference](#api-reference)

## Overview

The Monkey Eyes Animation Library is a Python-based system for creating animated eye expressions using Pygame.

## Installation & Setup

### Prerequisites

```bash
pip install pygame
```

### Basic Setup

1. Save the library code as `monkey_eyes_lib.py`
2. Import and use in your project:

```python
from monkey_eyes_lib import EyesController
import time

# Create controller instance
controller = EyesController()

# Start the eyes animation
controller.start_eyes()

# Your application code here...

# Stop when done
controller.stop_eyes()
```

## Core Classes

### Eye Class

Represents a single eye with position, size, and rendering capabilities.

**Key Properties:**

- `rect`: Current position and size (pygame.Rect)
- `original_rect`: Original position and size for reset operations
- `radius`: Border radius for rounded corners
- `color`: RGB color tuple

**Key Methods:**

- `draw()`: Renders normal rectangular eye
- `draw_circular()`: Renders circular/laughing eye
- `draw_star()`: Renders star-shaped eye
- `grow()`, `move()`: Transform eye size and position
- `reset()`: Return to original state

### EyePair Class

Manages both left and right eyes as a coordinated unit.

**Initialization Parameters:**

```python
EyePair(left_x, right_x, y, width, height, distance, radius=30, color=(0,0,0))
```

### AnimationManager Class

Controls all animation states and transitions.

**Key Features:**

- State machine for different expressions
- Timing management for animations
- Natural behavior triggers (blinking, looking)
- Smooth transitions between states

### EyesController Class

Your main interface for controlling the eyes from external applications.

**Key Methods:**

- `start_eyes()`: Initialize and start eye process
- `stop_eyes()`: Cleanly shutdown eye process
- `trigger_*()`: Various animation triggers

## Configuration & Customization

### Eye Appearance Configuration

The `MonkeyEyeApp` class contains several configuration variables you can modify:

#### Screen & Layout Settings

```python
# Screen dimensions
screen_width = 1280          # Window width in pixels
screen_height = 720          # Window height in pixels
background_color = (255, 255, 255)  # RGB background color

# Eye positioning and size
eye_width = 240              # Width of each eye in pixels
eye_height = 240             # Height of each eye in pixels
eye_distance = 100           # Distance between the two eyes
eye_radius = 30              # Corner radius for rounded rectangles
eye_color = (0, 0, 0)        # RGB eye color
eye_y_offset = 100           # distance between the middle line and the middle of the eyes (0 = eyes are vertically centered)
```

<div style="display: flex; justify-content: center;">
<img src="./docs/python-eyes-variables.drawio.png" width="70%" alt="Python Eyes Variables Documentation" >
</div>

#### Animation Timing Configuration

Located in the `AnimationManager.__init__()` method:

```python
# Blinking behavior
blink_speed = 15             # How fast eyes close/open (pixels per frame)
blink_interval = random.uniform(2000, 4000)  # Time between blinks (ms)

# Laughing animation
laugh_speed = 2              # Vertical movement speed
max_laugh_offset = 20        # Maximum vertical displacement
laugh_cycles = 4             # Number of up-down cycles

# Looking/Movement behavior
move_speed = 10              # Horizontal movement speed
max_move_distance = 200      # How far eyes move when looking
squinting_degree = 5         # Amount of height reduction when squinting
look_interval = random.uniform(10000, 20000)  # Time between random looks

# Star animation
star_speed = 0.05            # Growth/shrink rate for stars
star_color = (255, 255, 0)   # RGB color for stars (yellow)

# Default durations (milliseconds)
smile_duration = 2000        # Default smile length
star_duration = 3000         # Default star eyes length
concentrate_duration = 2000  # Default concentration length
```

### Customization Examples

#### Changing Eye Appearance

```python
# Create custom colored eyes
app.eye_color = (0, 100, 200)      # Blue eyes
app.background_color = (240, 240, 240)  # Light gray background
app.eye_radius = 50                 # More rounded corners
```

#### Adjusting Animation Speed

```python
# In AnimationManager.__init__()
self.blink_speed = 25              # Faster blinking
self.laugh_speed = 1               # Slower laughing
self.move_speed = 15               # Faster looking movements
```

## Animation States

### Available States

| State           | Description                                 | Trigger Method            | Duration     |
| --------------- | ------------------------------------------- | ------------------------- | ------------ |
| `IDLE`          | Default state with natural blinking/looking | Automatic                 | Continuous   |
| `BLINKING`      | Eye closing and opening animation           | `trigger_blinking()`      | ~200ms       |
| `LAUGHING`      | Up-down bouncing circular eyes              | `trigger_laugh()`         | ~2-3 seconds |
| `SMILING`       | Slight upward curved circular eyes          | `trigger_smile(duration)` | Configurable |
| `STAR`          | Star-shaped eyes that grow and shrink       | `trigger_star(duration)`  | Configurable |
| `MOVING`        | Horizontal eye movement with squinting      | `trigger_look()`          | ~3-4 seconds |
| `CONCENTRATING` | Narrowed/squinted eyes                      | `trigger_concentrate()`   | Configurable |

**Note**: Direct transitions between non-IDLE states automatically reset eye position/size before starting the new animation.

## Usage Examples

### Basic Usage

```python
from monkey_eyes_lib import EyesController
import time

controller = EyesController()

try:
    # Start the eyes
    controller.start_eyes()
    print("Eyes started - they'll blink and look around naturally")

    # Let them idle for a few seconds
    time.sleep(3)

    # Trigger a smile
    controller.trigger_smile()
    time.sleep(2)

    # Trigger laughter
    controller.trigger_laugh()
    time.sleep(3)

finally:
    controller.stop_eyes()
```

### Advanced Animation Sequence

```python
from monkey_eyes_lib import EyesController
import time

def demo_sequence():
    controller = EyesController()

    try:
        controller.start_eyes()

        # Happy sequence
        print("😊 Smiling for 3 seconds")
        controller.trigger_smile(3000)
        time.sleep(4)

        print("😂 Laughing")
        controller.trigger_laugh()
        time.sleep(3)

        # Amazed sequence
        print("🤩 Star eyes for 4 seconds")
        controller.trigger_star(4000)
        time.sleep(5)

        # Concentration sequence
        print("🤔 Concentrating indefinitely")
        controller.trigger_concentrate(indefinite=True)
        time.sleep(3)

        print("💡 Stopping concentration")
        controller.stop_concentrate()
        time.sleep(2)

        # Custom duration smile
        print("😊 Quick smile")
        controller.trigger_smile(1000)  # 1 second smile
        time.sleep(2)

        print("Returning to idle state")
        time.sleep(3)

    except KeyboardInterrupt:
        print("Demo interrupted")
    finally:
        controller.stop_eyes()

if __name__ == "__main__":
    demo_sequence()
```

## API Reference

### EyesController Methods

#### `start_eyes()`

Initializes and starts the eye animation process.

- **Returns**: None
- **Side effects**: Creates new process and command queue
- **Notes**: Safe to call multiple times (checks if already running)

#### `stop_eyes()`

Cleanly shuts down the eye animation process.

- **Returns**: None
- **Timeout**: 3 seconds for graceful shutdown, then force terminate
- **Notes**: Always call this when your application exits

#### `trigger_smile(duration_ms=None)`

Triggers a smiling expression.

- **Parameters**:
  - `duration_ms` (int, optional): Duration in milliseconds (default: 2000)
- **Example**: `controller.trigger_smile(1500)`

#### `trigger_laugh()`

Triggers a laughing animation (up-down bouncing).

- **Parameters**: None
- **Duration**: Fixed ~2-3 seconds (4 bounce cycles)
- **Example**: `controller.trigger_laugh()`

#### `trigger_star(duration_ms=None)`

Triggers star-shaped eyes animation.

- **Parameters**:
  - `duration_ms` (int, optional): Duration in milliseconds (default: 3000)
- **Example**: `controller.trigger_star(5000)`

#### `trigger_concentrate(duration_ms=None, indefinite=False)`

Triggers concentration/squinting animation.

- **Parameters**:
  - `duration_ms` (int, optional): Duration in milliseconds (default: 2000)
  - `indefinite` (bool): If True, continues until `stop_concentrate()` called
- **Examples**:
  - `controller.trigger_concentrate(4000)`
  - `controller.trigger_concentrate(indefinite=True)`

#### `stop_concentrate()`

Stops indefinite concentration animation.

- **Parameters**: None
- **Notes**: Only affects indefinite concentration; timed concentration ends automatically
- **Example**: `controller.stop_concentrate()`

### Configuration Variables

Located in `MonkeyEyeApp.__init__()`:

```python
# Screen settings
screen_width: int = 1280          # Window width
screen_height: int = 720          # Window height
background_color: tuple = (255, 255, 255)  # RGB background

# Eye appearance
eye_width: int = 240              # Eye width in pixels
eye_height: int = 240             # Eye height in pixels
eye_distance: int = 100           # Distance between eyes
eye_radius: int = 30              # Corner radius
eye_color: tuple = (0, 0, 0)      # RGB eye color
```

Located in `AnimationManager.__init__()`:

```python
# Animation speeds (pixels per frame at 60 FPS)
blink_speed: int = 15             # Blink animation speed
laugh_speed: int = 2              # Laugh bounce speed
move_speed: int = 10              # Sideways look speed
star_speed: float = 0.05          # Star grow/shrink speed

# Animation limits
max_laugh_offset: int = 20        # Max vertical laugh movement
max_move_distance: int = 200      # Max horizontal look movement
squinting_degree: int = 5         # Height reduction when squinting

# Timing intervals (milliseconds)
blink_interval: float = 2000-4000 # Random time between blinks
look_interval: float = 10000-20000 # Random time between looks

# Default durations (milliseconds)
smile_duration: int = 2000        # Default smile duration
star_duration: int = 3000         # Default star duration
concentrate_duration: int = 2000  # Default concentrate duration
```

### Animation States Enum

```python
class AnimationState:
    IDLE = "idle"                 # Default state
    BLINKING = "blinking"         # Eye blink animation
    LAUGHING = "laughing"         # Bouncing laugh animation
    SMILING = "smiling"           # Curved smile animation
    STAR = "star"                 # Star-shaped eyes
    MOVING = "moving"             # Sideways looking
    CONCENTRATING = "concentrating" # Squinted/focused eyes
```
