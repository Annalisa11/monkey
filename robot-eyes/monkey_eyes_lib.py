import math
import multiprocessing
import queue
import random

import pygame

"""
Monkey Eyes Animation System - Library Version

Classes:
- Eye: Represents a single eye with drawing and transformation methods.
- EyePair: Manages and draws a pair of eyes.
- AnimationState: Enumeration of possible animation states.
- AnimationManager: Controls different animation states and transitions.
- MonkeyEyeApp: Main application class (runs in a separate process).
- EyesController: Interface for controlling the MonkeyEyeApp externally.
"""

class Eye:
    """
    Represents a single eye with position, size, and rendering logic.

    Args:
        x (int): X (left) position of the eye.
        y (int): Y (top) position of the eye.
        width (int): Width of the eye.
        height (int): Height of the eye.
        radius (int): Border radius for rounded corners.
        color (tuple): RGB color of the eye.
    """
    def __init__(self, x, y, width, height, radius=30, color=(0, 0, 0)):
        self.rect = pygame.Rect(x, y, width, height)
        self.original_rect = pygame.Rect(x, y, width, height)
        self.radius = radius
        self.color = color

    def draw(self, screen):
        """Draws the eye as a rounded rectangle."""
        pygame.draw.rect(screen, self.color, self.rect, border_radius=self.radius)

    def grow(self, width, height):
        """Inflates (or shrinks) the eye by width and height."""
        self.rect.inflate_ip(width, height)

    def move(self, x, y):
        """Moves the eye position by the given x and y offsets."""
        self.rect.move_ip(x, y)

    def reset_position(self):
        """Resets the eye to its original position."""
        self.rect.x = self.original_rect.x
        self.rect.y = self.original_rect.y

    def reset_size(self):
        """Resets the eye to its original width and height."""
        self.rect.width = self.original_rect.width
        self.rect.height = self.original_rect.height

    def reset(self):
        """Resets both position and size of the eye."""
        self.reset_position()
        self.reset_size()

    def get_center(self):
        """Returns the (x, y) center of the eye."""
        return (self.rect.x + self.rect.width // 2, self.rect.y + self.rect.height // 2)

    def draw_circular(self, screen, background_color, vertical_offset=0, overlay_circle_offset=150):
        """
        Draws the eye as a circular laughing/smiling representation.
        """
        center_x, center_y = self.get_center()
        center_y += vertical_offset
        radius = self.rect.height // 2
        
        pygame.draw.circle(screen, self.color, (center_x, center_y), radius)
        pygame.draw.circle(screen, background_color, (center_x, center_y + overlay_circle_offset), radius + 60)

    def draw_star(self, screen, color=(255, 255, 0), scale=1.0):
        """
        Draws a star shape within the eye area.
        """
        cx, cy = self.get_center()
        radius = min(self.rect.width, self.rect.height) // 2 * scale
        inner_radius = radius * 0.4
        
        points = []
        for i in range(10):
            angle = math.pi * 2 * i / 10 - math.pi / 2
            current_radius = radius if i % 2 == 0 else inner_radius
            x = cx + current_radius * math.cos(angle)
            y = cy + current_radius * math.sin(angle)
            points.append((x, y))
        
        if len(points) > 2:
            pygame.draw.polygon(screen, color, points)


class EyePair:
    """
    Manages a pair of eyes and their expressions.
    """
    def __init__(self, left_x, right_x, y, width, height, distance, radius=30, color=(0, 0, 0)):
        self.left_eye = Eye(left_x, y, width, height, radius, color)
        self.right_eye = Eye(right_x, y, width, height, radius, color)
        self.distance = distance
        self.background_color = (255, 255, 255) 
        self.star_color = (255, 255, 0)

    def draw_normal(self, screen):
        self.left_eye.draw(screen)
        self.right_eye.draw(screen)

    def draw_laughing(self, screen, vertical_offset=0):
        self.left_eye.draw_circular(screen, self.background_color, vertical_offset)
        self.right_eye.draw_circular(screen, self.background_color, vertical_offset)
    
    def draw_smiling(self, screen):
        self.left_eye.draw_circular(screen, self.background_color, 10) 
        self.right_eye.draw_circular(screen, self.background_color, 10)

    def draw_stars(self, screen, scale=1.0):
        self.left_eye.draw_star(screen, self.star_color, scale)
        self.right_eye.draw_star(screen, self.star_color, scale)
    
    def reset(self):
        self.left_eye.reset()
        self.right_eye.reset()


class AnimationState:
    IDLE = "idle"
    BLINKING = "blinking"
    LAUGHING = "laughing"
    SMILING = "smiling"
    STAR = "star"
    MOVING = "moving"
    CONCENTRATING = "concentrating"


class AnimationManager:
    def __init__(self, eye_pair):
        self.eye_pair = eye_pair
        self.current_state = AnimationState.IDLE
        self.previous_state = AnimationState.IDLE
        
        self.current_time = 0 
        self.animation_start_time = 0
        
        # Blinking 
        self.shrinking = True
        self.blink_speed = 15
        self.last_blink_time = 0 
        self.blink_interval = random.uniform(2000, 4000)
        
        # Laughing 
        self.laugh_up = True
        self.laugh_speed = 2
        self.laugh_offset = 0
        self.max_laugh_offset = 20
        self.laugh_cycle_count = 0
        
        # Smiling 
        self.smile_start_time = 0
        self.smile_duration = 2000 
        
        # Star 
        self.star_start_time = 0
        self.star_duration = 3000 
        self.star_growing = True
        self.star_scale = 0.0
        self.star_speed = 0.05
        
        # Movement 
        self.move_speed = 10
        self.max_move_distance = 200
        self.squinting_degree = 5
        self.last_look_time = 0 
        self.look_interval = random.uniform(10000, 20000)
        self.looking_direction = 1
        self.moving_away = True
        self.look_paused = False
        self.look_pause_start_time = 0

        # Concentrate
        self.concentrate_duration = 2000 
        self.concentrate_start_time = 0
        self.concentrate_indefinite = False

    def update(self, current_time_ticks):
        self.current_time = current_time_ticks
        
        if self.current_state == AnimationState.IDLE:
            if self.current_time - self.last_blink_time > self.blink_interval:
                self.trigger_blinking()
            # elif self.current_time - self.last_look_time > self.look_interval:
                # self.trigger_look()
        
        if self.current_state == AnimationState.LAUGHING:
            self._animate_laugh()
        elif self.current_state == AnimationState.SMILING:
            if self._check_timed_animation_completed(self.smile_start_time, self.smile_duration):
                self.set_state(AnimationState.IDLE)
        elif self.current_state == AnimationState.STAR:
            self._animate_star()
        elif self.current_state == AnimationState.MOVING:
            self._animate_sideways_look(self.looking_direction)
        elif self.current_state == AnimationState.CONCENTRATING:
            self._animate_concentrate()
        elif self.current_state == AnimationState.BLINKING:
            self._animate_blink()
    
    def set_state(self, new_state):
        if new_state != self.current_state:
            self.previous_state = self.current_state
            self.current_state = new_state
            self.animation_start_time = self.current_time
            
            if self.previous_state != AnimationState.IDLE and new_state == AnimationState.IDLE:
                 # Reset only when transitioning to IDLE from a non-IDLE state,
                 # and not from another active animation to IDLE (which might manage its own reset)
                self.eye_pair.reset()
            elif self.previous_state != AnimationState.IDLE and self.previous_state != new_state:
                 # Reset if switching between two different active animations
                self.eye_pair.reset()

    
    def _check_timed_animation_completed(self, start_time, duration):
        if self.current_state == AnimationState.CONCENTRATING and self.concentrate_indefinite:
            return False
        return self.current_time - start_time > duration
    
    def trigger_laugh(self):
        self.set_state(AnimationState.LAUGHING)
        self.laugh_up = True
        self.laugh_cycle_count = 0
        self.laugh_offset = 0
    
    def trigger_smile(self, duration=None):
        self.set_state(AnimationState.SMILING)
        self.smile_start_time = self.current_time
        self.smile_duration = duration if duration is not None else 2000

    def trigger_concentrate(self, duration=None, indefinite=False):
        self.set_state(AnimationState.CONCENTRATING)
        self.concentrate_start_time = self.current_time
        self.concentrate_indefinite = indefinite
        self.shrinking = True 
        self.concentrate_duration = duration if duration is not None and not indefinite else 2000
    
    def stop_concentrate(self):
        if self.current_state == AnimationState.CONCENTRATING: 
            if self.concentrate_indefinite:
                self.concentrate_indefinite = False
                # Force completion by setting start time such that duration is exceeded
                self.concentrate_start_time = self.current_time - (self.concentrate_duration + 1)
            else: 
                self.concentrate_start_time = self.current_time - (self.concentrate_duration + 1)

    def trigger_star(self, duration=None):
        self.set_state(AnimationState.STAR)
        self.star_start_time = self.current_time
        self.star_growing = True
        self.star_scale = 0.0
        self.star_duration = duration if duration is not None else 3000
    
    def trigger_blinking(self):
        if self.current_state == AnimationState.IDLE:
            self.set_state(AnimationState.BLINKING)
            self.shrinking = True
            self.last_blink_time = self.current_time 
            self.blink_interval = random.uniform(2000, 4000)


    def trigger_look(self):
        if self.current_state == AnimationState.IDLE:
            self.set_state(AnimationState.MOVING)
            self.moving_away = True
            self.looking_direction = random.choice([1, -1])
            self.look_paused = False
            self.last_look_time = self.current_time 
            self.look_interval = random.uniform(10000, 20000)

    def _animate_blink(self):
        if self.shrinking:
            self.eye_pair.left_eye.grow(0, -self.blink_speed)
            self.eye_pair.right_eye.grow(0, -self.blink_speed)
            if self.eye_pair.left_eye.rect.height <= 10:
                self.shrinking = False
        else:
            self.eye_pair.left_eye.grow(0, self.blink_speed)
            self.eye_pair.right_eye.grow(0, self.blink_speed)
            if self.eye_pair.left_eye.rect.height >= self.eye_pair.left_eye.original_rect.height:
                self.eye_pair.reset() 
                self.set_state(AnimationState.IDLE)
    
    def _animate_concentrate(self):
        if self.shrinking:
            self.eye_pair.left_eye.grow(0, -self.blink_speed) 
            self.eye_pair.right_eye.grow(0, -self.blink_speed)
            if self.eye_pair.left_eye.rect.height <= 60: 
                self.shrinking = False 
        else: # Not shrinking: either holding or expanding
            is_timed_out = self._check_timed_animation_completed(self.concentrate_start_time, self.concentrate_duration)
            
            if not self.concentrate_indefinite and is_timed_out:
                # Time to expand and finish
                self.eye_pair.left_eye.grow(0, self.blink_speed)
                self.eye_pair.right_eye.grow(0, self.blink_speed)
                if self.eye_pair.left_eye.rect.height >= self.eye_pair.left_eye.original_rect.height:
                    self.eye_pair.reset()
                    self.set_state(AnimationState.IDLE)
            elif self.concentrate_indefinite:
                # Holding indefinitely, do nothing until stop_concentrate is called
                pass
            # Else, it's timed but not yet timed out, so still holding.

    def _animate_laugh(self):
        if self.laugh_up:
            self.laugh_offset += self.laugh_speed
            if self.laugh_offset >= self.max_laugh_offset:
                self.laugh_up = False
        else:
            self.laugh_offset -= self.laugh_speed
            if self.laugh_offset <= 0:
                self.laugh_up = True
                self.laugh_cycle_count += 1
                if self.laugh_cycle_count >= 4: 
                    self.set_state(AnimationState.IDLE)
    
    def _animate_star(self):
        time_elapsed = self.current_time - self.star_start_time
        
        if self.star_growing and time_elapsed > self.star_duration / 2.0 :
            self.star_growing = False 

        if self.star_growing:
            self.star_scale += self.star_speed
            if self.star_scale >= 1.0:
                self.star_scale = 1.0
        else: 
            self.star_scale -= self.star_speed
            if self.star_scale <= 0.0:
                self.star_scale = 0.0
                self.set_state(AnimationState.IDLE) 
    
    def _animate_sideways_look(self, direction):
        left_eye = self.eye_pair.left_eye
        right_eye = self.eye_pair.right_eye
        original_left_x = left_eye.original_rect.x
        original_height = left_eye.original_rect.height
        
        if self.look_paused:
            if self.current_time - self.look_pause_start_time > 1000:
                self.look_paused = False
            return 

        if self.moving_away:
            left_eye.move(self.move_speed * direction, 0)
            right_eye.move(self.move_speed * direction, 0)
            
            current_distance = abs(left_eye.rect.x - original_left_x)
            if current_distance < 100:
                if left_eye.rect.height > original_height - 40:
                    left_eye.grow(0, -self.squinting_degree)
                    right_eye.grow(0, -self.squinting_degree)
            else:
                if left_eye.rect.height < original_height:
                    left_eye.grow(0, self.squinting_degree)
                    right_eye.grow(0, self.squinting_degree)
                if direction > 0: right_eye.grow(4, 4)
                else: left_eye.grow(4, 4)
            
            if current_distance >= self.max_move_distance: 
                self.moving_away = False
                self.look_pause_start_time = self.current_time
                self.look_paused = True
        else: 
            move_back_direction = -1 if left_eye.rect.x > original_left_x else 1
            
            dist_to_origin = abs(left_eye.rect.x - original_left_x)
            if dist_to_origin < self.move_speed:
                 left_eye.rect.x = original_left_x
                 right_eye.rect.x = right_eye.original_rect.x 
            else:
                left_eye.move(self.move_speed * move_back_direction, 0)
                right_eye.move(self.move_speed * move_back_direction, 0)
            
            if left_eye.rect.height < original_height: left_eye.grow(0, self.squinting_degree)
            if right_eye.rect.height < original_height: right_eye.grow(0, self.squinting_degree)
            
            if direction > 0 and right_eye.rect.width > right_eye.original_rect.width: right_eye.grow(-2, -2)
            elif direction < 0 and left_eye.rect.width > left_eye.original_rect.width: left_eye.grow(-2, -2)
            
            if abs(left_eye.rect.x - original_left_x) < self.move_speed : 
                self.eye_pair.reset()
                self.set_state(AnimationState.IDLE)


class MonkeyEyeApp:
    def __init__(self, command_queue):
        self.command_queue = command_queue
        self.screen = None
        self.clock = None
        self.background_color = (255, 255, 255)
        self.eyes = None
        self.animation = None
        
        self.screen_width = 1280
        self.screen_height = 720
        self.eye_width = 240
        self.eye_height = 240
        self.eye_distance = 200
        self.eye_radius = 30
        self.eye_color = (0, 0, 0)

        self.eye_y_offset = 100

    def _initialize_pygame_and_eyes(self):
        pygame.init()
        self.screen = pygame.display.set_mode((self.screen_width, self.screen_height))
        pygame.display.set_caption("Monkey Eyes Animation")
        self.clock = pygame.time.Clock()
        
        center_x = self.screen_width // 2
        eye_y = self.screen_height // 2 - self.eye_height // 2 - self.eye_y_offset
        eye_left_x = center_x - self.eye_width - (self.eye_distance // 2)
        eye_right_x = center_x + (self.eye_distance // 2)
        
        self.eyes = EyePair(
            eye_left_x, eye_right_x, eye_y, 
            self.eye_width, self.eye_height, self.eye_distance, 
            self.eye_radius, self.eye_color
        )
        self.animation = AnimationManager(self.eyes)
        
        current_ticks = pygame.time.get_ticks()
        self.animation.last_blink_time = current_ticks
        self.animation.last_look_time = current_ticks

    def _process_command(self, command_str):
        parts = command_str.split(':')
        cmd = parts[0]
        args = parts[1:]

        if cmd == "laugh": self.animation.trigger_laugh()
        elif cmd == "smile":
            duration = int(args[0]) if args and args[0].isdigit() else None
            self.animation.trigger_smile(duration=duration)
        elif cmd == "star":
            duration = int(args[0]) if args and args[0].isdigit() else None
            self.animation.trigger_star(duration=duration)
        elif cmd == "concentrate":
            if args and args[0] == "indefinite":
                self.animation.trigger_concentrate(indefinite=True)
            else:
                duration = int(args[0]) if args and args[0].isdigit() else None
                self.animation.trigger_concentrate(duration=duration, indefinite=False)
        elif cmd == "stop_concentrate": self.animation.stop_concentrate()
        else: print(f"EyeApp: Unknown command: {command_str}")

    def run_app_loop(self):
        self._initialize_pygame_and_eyes()
        running = True
        while running:
            current_ticks = pygame.time.get_ticks()
            try:
                while not self.command_queue.empty():
                    command_str = self.command_queue.get_nowait()
                    if command_str == "quit": running = False; break
                    self._process_command(command_str)
            except queue.Empty: pass
            if not running: break

            for event in pygame.event.get():
                if event.type == pygame.QUIT: running = False
                elif event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE: running = False
            if not running: break

            self.animation.update(current_ticks)
            
            self.screen.fill(self.background_color)
            current_state = self.animation.current_state
            if current_state == AnimationState.LAUGHING:
                self.eyes.draw_laughing(self.screen, self.animation.laugh_offset)
            elif current_state == AnimationState.SMILING:
                self.eyes.draw_smiling(self.screen)
            elif current_state == AnimationState.STAR:
                self.eyes.draw_stars(self.screen, self.animation.star_scale)
            else: 
                self.eyes.draw_normal(self.screen)
            
            pygame.display.flip()
            self.clock.tick(60)
        pygame.quit()

class EyesController:
    """
    Manages and controls the Monkey Eyes animation program, which runs in a
    separate process.

    This controller provides a simple interface to start, stop, and trigger
    various emotional animations (like laughing, smiling, concentrating, etc.)
    for a pair of "monkey eyes" displayed in a dedicated Pygame window.

    Example:
        >>> controller = EyesController()
        >>> controller.start_eyes()
        >>> # Eyes window appears
        >>> controller.trigger_smile(duration_ms=3000)
        >>> # Eyes smile for 3 seconds
        >>> controller.stop_eyes()
        >>> # Eyes window closes
    """
    def __init__(self):
        self.command_queue = None
        self.eye_process = None

    def start_eyes(self):
        """
        Starts the Monkey Eyes animation program in a separate process.

        A new window will be created to display the eye animations. If the
        eye animation program is already running, this method will print a
        message and do nothing.

        The eye process is started as a daemon, meaning it will automatically
        terminate if the main program exits.
        """
        if self.eye_process and self.eye_process.is_alive():
            print("EyesController: Eyes are already running.")
            return
        self.command_queue = multiprocessing.Queue()
        app_instance = MonkeyEyeApp(self.command_queue)
        self.eye_process = multiprocessing.Process(target=app_instance.run_app_loop)
        self.eye_process.daemon = True 
        self.eye_process.start()
        print("EyesController: Monkey Eyes program started.")

    def stop_eyes(self):
        """
        Stops the Monkey Eyes animation program and closes its window.

        This method sends a 'quit' command to the eye animation process
        and waits for it to terminate. If the process does not stop
        gracefully within a short timeout, it will be forcibly terminated.

        If the eye program is not running, this method will print a message
        and do nothing.
        """
        if not self.eye_process or not self.eye_process.is_alive():
            print("EyesController: Eyes are not running or already stopped.")
            return
        if self.command_queue:
            try: self.command_queue.put("quit")
            except Exception as e: print(f"EyesController: Error sending quit command: {e}")
        if self.eye_process:
            self.eye_process.join(timeout=3) 
            if self.eye_process.is_alive():
                print("EyesController: Eye process did not terminate gracefully, attempting to terminate.")
                self.eye_process.terminate()
                self.eye_process.join(timeout=1) 
        self.eye_process = None
        self.command_queue = None
        print("EyesController: Monkey Eyes program stopped.")

    def _send_command(self, command_str):
        if not self.command_queue or (self.eye_process and not self.eye_process.is_alive()):
            print(f"EyesController: Cannot send '{command_str}'. Eyes not running or queue unavailable.")
            return
        try: self.command_queue.put(command_str)
        except Exception as e: print(f"EyesController: Error sending '{command_str}': {e}")

    def trigger_laugh(self):
        """
        Triggers the laughing animation.

        The eyes will laugh for a predefined number of cycles.
        """ 
        self._send_command("laugh")
    def trigger_smile(self, duration_ms=None):
        """
        Triggers the smiling animation.

        The animation lasts for a specified duration, after which the eyes
        return to their idle state.

        Args:
            duration_ms (int, optional): The duration of the smile animation
                in milliseconds. If None, a default duration (e.g., 2000ms)
                defined within the animation logic will be used.
        """
        cmd = f"smile:{duration_ms}" if duration_ms is not None else "smile"
        self._send_command(cmd)
    def trigger_star(self, duration_ms=None):
        """
        Triggers the star-eyes animation in the Monkey Eyes program.

        The entire animation (grow and shrink) lasts for the specified duration.

        Args:
            duration_ms (int, optional): The total duration of the star
                animation in milliseconds. If None, a default duration
                (e.g., 3000ms) defined within the animation logic will be used.
        """
        cmd = f"star:{duration_ms}" if duration_ms is not None else "star"
        self._send_command(cmd)
    def trigger_concentrate(self, duration_ms=None, indefinite=False):
        """
        Triggers the concentrating (squinting) animation in the Monkey Eyes program.

        The animation can be set for a specific duration or indefinitely until stopped.

        Args:
            duration_ms (int, optional): The duration of the concentrate
                animation in milliseconds. This parameter is ignored if
                `indefinite` is True. If None and `indefinite` is False,
                a default duration (e.g., 2000ms) will be used.
            indefinite (bool, optional): If True, the eyes will remain in the
                concentrated state until `stop_concentrate()` is called.
                Defaults to False.
        """
        if indefinite: cmd = "concentrate:indefinite"
        elif duration_ms is not None: cmd = f"concentrate:{duration_ms}"
        else: cmd = "concentrate"
        self._send_command(cmd)
    def stop_concentrate(self): 
        """
        Stops an ongoing 'concentrate' animation.

        If the concentration animation was triggered with `indefinite=True`,
        this method will cause the eyes to return to their normal idle state.
        If it was a timed concentration, this will end it prematurely.
        """
        self._send_command("stop_concentrate")
