import math
import random
import time

import pygame

"""
Monkey Eyes Animation System

Classes:
- Eye: Represents a single eye with drawing and transformation methods.
- EyePair: Manages and draws a pair of eyes.
- AnimationManager: Controls different animation states and transitions.
- MonkeyEyeApp: Main application class that initializes and runs the Pygame loop.
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

        Args:
            screen: Pygame display surface.
            background_color (tuple): RGB of the second circle that cuts out the first to make it a crescent moon
            vertical_offset (int): vertical shift of the eye
            overlay_circle_offset (int): Distance between top and bottom arcs.
        """
        center_x, center_y = self.get_center()
        center_y += vertical_offset
        radius = self.rect.height // 2
        
        pygame.draw.circle(screen, self.color, (center_x, center_y), radius)
        pygame.draw.circle(screen, background_color, (center_x, center_y + overlay_circle_offset), radius + 60)

    def draw_star(self, screen, color=None, scale=1.0):
        """
        Draws the eye as a star shape.
        
        Args:
            screen: Pygame display surface.
            outer_radius (int): Radius for outer points of star. Defaults to half of eye height.
            inner_radius (int): Radius for inner points of star. Defaults to half of outer_radius.
            color (tuple): RGB color for the star. Defaults to yellow.
        """
        center_x, center_y = self.get_center()
        
        outer_radius = self.rect.height // 2
        inner_radius = outer_radius // 2

        if color is None:
            color = (255, 255, 0)  
            
        points = []
        for i in range(10):
            angle = math.pi / 2 + (2 * math.pi * i / 10)
            radius = outer_radius if i % 2 == 0 else inner_radius
            x = center_x + radius * math.cos(angle) * scale
            y = center_y - radius * math.sin(angle) * scale
            points.append((x, y))
        pygame.draw.polygon(screen, color, points)

class EyePair:
    """
    Manages a pair of eyes and their expressions.

    Args:
        left_x (int): X position of the left eye.
        right_x (int): X position of the right eye.
        y (int): Y position of both eyes.
        width (int): Width of each eye.
        height (int): Height of each eye.
        distance (int): Horizontal space between the eyes.
        radius (int): Border radius.
        color (tuple): Eye color.
    """
    def __init__(self, left_x, right_x, y, width, height, distance, radius=30, color=(0, 0, 0)):
        print(f"eye pair coordinates: {left_x}, {right_x}, {y}")
        
        self.left_eye = Eye(left_x, y, width, height, radius, color)
        self.right_eye = Eye(right_x, y, width, height, radius, color)
        self.distance = distance
        self.background_color = (255, 255, 255)
        self.star_color = (255, 255, 0)  # Yellow color for stars
    
    def draw_normal(self, screen):
        """Draws both eyes normally (rectangular)."""
        self.left_eye.draw(screen)
        self.right_eye.draw(screen)
    
    def draw_laughing(self, screen, vertical_offset=0):
        """Draws both eyes in laughing state using circles."""
        self.left_eye.draw_circular(screen, self.background_color, vertical_offset)
        self.right_eye.draw_circular(screen, self.background_color, vertical_offset)
    
    def draw_smiling(self, screen):
        """Draws both eyes in smiling state using circles."""
        self.left_eye.draw_circular(screen, self.background_color, 10)
        self.right_eye.draw_circular(screen, self.background_color, 10)

    def draw_stars(self, screen, scale=1.0):
        """
        Draws both eyes as stars.
        
        Args:
            screen: Pygame display surface.
            scale (float): Scale factor for the star size (1.0 = full size).
        """
        self.left_eye.draw_star(screen, self.star_color, scale)
        self.right_eye.draw_star(screen, self.star_color, scale)
    
    def reset(self):
        """Resets both eyes to original size and position."""
        self.left_eye.reset()
        self.right_eye.reset()


class AnimationManager:
    """
    Controls animation states: blinking, laughing, smiling, and looking.

    Args:
        eye_pair (EyePair): The pair of eyes to animate.
    """
    def __init__(self, eye_pair):
        self.eye_pair = eye_pair
        
        # Blinking 
        self.is_blinking = False
        self.shrinking = True
        self.blink_speed = 15
        self.last_blink_time = 0
        self.blink_interval = random.uniform(2000, 4000)
        
        # Laughing 
        self.is_laughing = False
        self.laugh_up = True
        self.laugh_speed = 2
        self.laugh_offset = 0
        self.max_laugh_offset = 20
        self.laugh_cycle_count = 0
        
        # Smiling 
        self.is_smiling = False
        self.smile_start_time = 0
        self.smile_duration = 2000
        
        # Star 
        self.is_star = False
        self.star_start_time = 0
        self.star_duration = 3000
        self.star_growing = True
        self.star_scale = 0.0
        self.star_speed = 0.05
        
        # Movement 
        self.move_speed = 10
        self.max_move_distance = 200
        self.squinting_degree = 5
        self.is_moving = False
        self.last_look_time = 0
        self.look_interval = random.uniform(4000, 8000)
        self.looking_direction = 1
        self.moving_away = True

        # Concnetrate
        self.is_concentrating = False
        self.concentrate_duration = 2000
        self.concentrate_start_time = 0

    def update(self, current_time):
        """Updates all active animations based on current time."""
        if self.check_is_idle_animation_required():
            if current_time - self.last_blink_time > self.blink_interval:
                self.trigger_blinking()
                self.last_blink_time = current_time
                self.blink_interval = random.uniform(2000, 4000)
            elif current_time - self.last_look_time > self.look_interval:
                self.trigger_look()
                self.last_look_time = current_time
                self.look_interval = random.uniform(10000, 20000)
        
        if self.is_laughing:
            self._animate_laugh()
        elif self.is_smiling:
            self._check_smile_timeout(current_time)
        elif self.is_star:
            self._animate_star(current_time)
        elif self.is_moving:
            self._animate_sideways_look(self.looking_direction)
        elif self.is_concentrating:
            self._animate_concentrate(current_time)
        elif self.is_blinking:
            self._animate_blink()

    def check_is_idle_animation_required(self):
        """Returns True if no animation is currently active."""
        return not self.is_laughing and not self.is_smiling and not self.is_moving and not self.is_blinking and not self.is_star and not self.is_concentrating
    
    def trigger_laugh(self):
        self.is_laughing = True
        self.is_blinking = False
        self.is_smiling = False
        self.is_star = False
        self.laugh_up = True
        self.is_concentrating = True
        self.laugh_cycle_count = 0
        self.laugh_offset = 0
    
    def trigger_smile(self, current_time):
        self.is_smiling = True
        self.is_blinking = False
        self.is_laughing = False
        self.is_star = False
        self.is_concentrating = True
        self.smile_start_time = current_time

    def trigger_concentrate(self, current_time):
        self.is_concentrating = True
        self.is_blinking = False
        self.is_blinking = False
        self.is_laughing = False
        self.is_star = False
        self.shrinking = True
        self.concentrate_start_time = current_time
    
    def trigger_star(self, current_time):
        """Triggers the star eyes animation."""
        self.is_star = True
        self.is_blinking = False
        self.is_laughing = False
        self.is_smiling = False
        self.is_concentrating = True
        self.star_start_time = current_time
        self.star_growing = True
        self.star_scale = 0.0
    
    def _start_blinking(self, current_time):
        self.last_blink_time = current_time
        self.blink_interval = random.uniform(2000, 4000)
        
    def trigger_blinking(self):
        self.is_blinking = True
        self.shrinking = True

    def trigger_look(self):
        self.is_moving = True
        self.moving_away = True
        self.looking_direction = random.choice([1, -1])
    
    def _animate_blink(self):
        """Internal: Handles blink shrinking and expanding logic."""
        if self.shrinking:
            self.eye_pair.left_eye.grow(0, -self.blink_speed)
            self.eye_pair.right_eye.grow(0, -self.blink_speed)
            
            if self.eye_pair.left_eye.rect.height <= 10:
                self.shrinking = False
        else:
            self.eye_pair.left_eye.grow(0, self.blink_speed)
            self.eye_pair.right_eye.grow(0, self.blink_speed)
            
            if self.eye_pair.left_eye.rect.height >= self.eye_pair.left_eye.original_rect.height:
                self.eye_pair.left_eye.reset_size()
                self.eye_pair.right_eye.reset_size()
                self.is_blinking = False
    
    def _animate_concentrate(self, current_time):
        """Internal: Handles concentrating shrinking and expanding logic."""
        if self.shrinking:
            self.eye_pair.left_eye.grow(0, -self.blink_speed)
            self.eye_pair.right_eye.grow(0, -self.blink_speed)

            if self.eye_pair.left_eye.rect.height <= 60:
                self.shrinking = False
        elif not self.shrinking and not self._check_concentrate_timeout(current_time): 
            return
        else:
            self.eye_pair.left_eye.grow(0, self.blink_speed)
            self.eye_pair.right_eye.grow(0, self.blink_speed)
            
            if self.eye_pair.left_eye.rect.height >= self.eye_pair.left_eye.original_rect.height:
                self.eye_pair.left_eye.reset_size()
                self.eye_pair.right_eye.reset_size()
                self.is_concentrating = False



    def _animate_laugh(self):
        """Internal: Moves eyes up/down to simulate laughing."""
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
                    self.is_laughing = False
                    self.laugh_cycle_count = 0
                    self.laugh_offset = 0
    
    def _check_smile_timeout(self, current_time):
        """Internal: Ends smile after duration passes."""
        if current_time - self.smile_start_time > self.smile_duration:
            self.is_smiling = False

    def _check_concentrate_timeout(self, current_time):
        """Internal: returns if it's time to end the animation"""
        return current_time - self.concentrate_start_time > self.concentrate_duration
            
    
    def _animate_star(self, current_time):
        """Internal: Handles star animation with growing and shrinking animation"""
        if current_time - self.star_start_time > self.star_duration:
            self.star_growing = False
        
        if self.star_growing:
            self.star_scale += self.star_speed
            if self.star_scale >= 1.0:
                self.star_scale = 1.0
        else:
            self.star_scale -= self.star_speed
            if self.star_scale <= 0.0:
                self.star_scale = 0.0
                self.is_star = False
                self.eye_pair.reset()
    
    def _animate_sideways_look(self, direction):
        """
        Internal: Moves eyes sideways, simulating looking left/right.

        Args:
            direction (int): Direction to look (1 for right, -1 for left).
        """
        left_eye = self.eye_pair.left_eye
        right_eye = self.eye_pair.right_eye
        original_left_x = left_eye.original_rect.x
        original_height = left_eye.original_rect.height
        
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
                
                if direction > 0: 
                    right_eye.grow(4, 4)
                else:  
                    left_eye.grow(4, 4)
            
            if current_distance > self.max_move_distance:
                self.moving_away = False
                pygame.time.delay(1000)  
        else:
            move_direction = -1 if left_eye.rect.x > original_left_x else 1
            left_eye.move(self.move_speed * move_direction, 0)
            right_eye.move(self.move_speed * move_direction, 0)
            
            if left_eye.rect.height < original_height:
                left_eye.grow(0, self.squinting_degree)
            if right_eye.rect.height < original_height:
                right_eye.grow(0, self.squinting_degree)
            
            if direction > 0 and right_eye.rect.width > right_eye.original_rect.width:
                right_eye.grow(-2, -2)
            elif direction < 0 and left_eye.rect.width > left_eye.original_rect.width:
                left_eye.grow(-2, -2)
            
            if abs(left_eye.rect.x - original_left_x) < 10:
                self.eye_pair.reset()
                self.is_moving = False


class MonkeyEyeApp:
    """
    The main Pygame application runner for Monkey Eyes.
    Initializes eyes, manages events, updates, and renders animations.
    """
    def __init__(self):
        pygame.init()
        
        self.screen_width = 1280
        self.screen_height = 720
        self.screen = pygame.display.set_mode((self.screen_width, self.screen_height))
        pygame.display.set_caption("Monkey Eyes")
        self.clock = pygame.time.Clock()
        self.background_color = (255, 255, 255)
        
        eye_width = 240
        eye_height = 240
        eye_distance = 100
        eye_radius = 30
        eye_color = (0, 0, 0)

        center_x = self.screen_width // 2
        eye_y = self.screen_height // 2 - eye_height // 2
        eye_left_x = center_x - eye_width - (eye_distance // 2)
        eye_right_x = center_x + (eye_distance // 2)
        
        self.eyes = EyePair(
            eye_left_x, eye_right_x, eye_y, 
            eye_width, eye_height, eye_distance, 
            eye_radius, eye_color
        )
        self.animation = AnimationManager(self.eyes)
    
    def handle_events(self):
        """Handles Pygame events and triggers animations based on keypresses."""
        current_time = time.time() * 1000
        
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    return False
                elif event.key == pygame.K_l:
                    self.animation.trigger_laugh()
                elif event.key == pygame.K_s:
                    self.animation.trigger_smile(current_time)
                elif event.key == pygame.K_t:  
                    self.animation.trigger_star(current_time)
                elif event.key == pygame.K_c:  
                    self.animation.trigger_concentrate(current_time)
        
        return True
    
    def update(self):
        """Calls the AnimationManager to update animations."""
        current_time = time.time() * 1000
        self.animation.update(current_time)
    
    def render(self):
        """Renders the current visual state of the eyes to the screen."""
        self.screen.fill(self.background_color)
        
        if self.animation.is_laughing:
            self.eyes.draw_laughing(self.screen, self.animation.laugh_offset)
        elif self.animation.is_smiling:
            self.eyes.draw_smiling(self.screen)
        elif self.animation.is_star:
            self.eyes.draw_stars(self.screen, self.animation.star_scale)
        else:
            self.eyes.draw_normal(self.screen)
        
        pygame.display.flip()
    
    def run(self):
        """Starts the Pygame main loop."""
        running = True
        self.animation.last_blink_time = time.time() * 1000 
        while running:
            running = self.handle_events()
            self.update()
            self.render()
            self.clock.tick(60)
        
        pygame.quit()
        
    def quit(self):
        pygame.quit()


if __name__ == "__main__":
    app = MonkeyEyeApp()
    app.run()