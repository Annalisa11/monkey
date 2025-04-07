import pygame
import random
import time

class Eye:
    def __init__(self, x, y, width, height, radius=30, color=(0, 0, 0)):
        self.rect = pygame.Rect(x, y, width, height)
        self.original_rect = pygame.Rect(x, y, width, height)  
        self.radius = radius
        self.color = color
    
    def draw(self, screen):
        pygame.draw.rect(screen, self.color, self.rect, border_radius=self.radius)
    
    def grow(self, width, height):
        self.rect.inflate_ip(width, height)
    
    def move(self, x, y):
        self.rect.move_ip(x, y)
    
    def reset_position(self):
        self.rect.x = self.original_rect.x
        self.rect.y = self.original_rect.y
    
    def reset_size(self):
        self.rect.width = self.original_rect.width
        self.rect.height = self.original_rect.height
    
    def reset(self):
        self.reset_position()
        self.reset_size()
        
    def get_center(self):
        return (self.rect.x + self.rect.width // 2, self.rect.y + self.rect.height // 2)

    def draw_circular(self, screen, background_color, vertical_offset=0, overlay_circle_offset=40):
        center_x, center_y = self.get_center()
        center_y += vertical_offset
        radius = self.rect.height // 2
        
        pygame.draw.circle(screen, self.color, (center_x, center_y), radius)
        pygame.draw.circle(screen, background_color, (center_x, center_y + overlay_circle_offset), radius)


class EyePair:
    def __init__(self, left_x, right_x, y, width, height, distance, radius=30, color=(0, 0, 0)):
        self.left_eye = Eye(left_x, y, width, height, radius, color)
        self.right_eye = Eye(right_x, y, width, height, radius, color)
        self.distance = distance
        self.background_color = (255, 255, 255)
    
    def draw_normal(self, screen):
        self.left_eye.draw(screen)
        self.right_eye.draw(screen)
    
    def draw_laughing(self, screen, vertical_offset=0):
        self.left_eye.draw_circular(screen, self.background_color, vertical_offset)
        self.right_eye.draw_circular(screen, self.background_color, vertical_offset)
    
    def draw_smiling(self, screen):
        self.left_eye.draw_circular(screen, self.background_color, 10)
        self.right_eye.draw_circular(screen, self.background_color, 10)
    
    def reset(self):
        self.left_eye.reset()
        self.right_eye.reset()


class AnimationManager:
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
        
        # Movement 
        self.move_speed = 10
        self.max_move_distance = 200
        self.squinting_degree = 5
        self.is_moving = False
        self.last_look_time = 0
        self.look_interval = random.uniform(4000, 8000)
        self.looking_direction = 1
        self.moving_away = True

    def update(self, current_time):
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
        elif self.is_moving:
            self._animate_sideways_look(self.looking_direction)
        elif self.is_blinking:
            self._animate_blink()

    def check_is_idle_animation_required(self):
        return not self.is_laughing and not self.is_smiling and not self.is_moving and not self.is_blinking 
    
    def trigger_laugh(self):
        self.is_laughing = True
        self.is_blinking = False
        self.is_smiling = False
        self.laugh_up = True
        self.laugh_cycle_count = 0
        self.laugh_offset = 0
    
    def trigger_smile(self, current_time):
        self.is_smiling = True
        self.is_blinking = False
        self.is_laughing = False
        self.smile_start_time = current_time
    
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
                    self.is_laughing = False
                    self.laugh_cycle_count = 0
                    self.laugh_offset = 0
    
    def _check_smile_timeout(self, current_time):
        if current_time - self.smile_start_time > self.smile_duration:
            self.is_smiling = False
    
    def _animate_sideways_look(self, direction):
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
    def __init__(self):
        pygame.init()
        
        self.screen_width = 1280
        self.screen_height = 720
        self.screen = pygame.display.set_mode((self.screen_width, self.screen_height), pygame.FULLSCREEN)
        pygame.display.set_caption("Monkey Eyes")
        self.clock = pygame.time.Clock()
        self.background_color = (255, 255, 255)
        
        eye_width = 240
        eye_height = 240
        eye_y = 100
        eye_distance = 100
        eye_left_x = 380
        eye_right_x = 780
        eye_radius = 30
        eye_color = (0, 0, 0)
        
        self.eyes = EyePair(
            eye_left_x, eye_right_x, eye_y, 
            eye_width, eye_height, eye_distance, 
            eye_radius, eye_color
        )
        self.animation = AnimationManager(self.eyes)
    
    def handle_events(self):
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
        
        return True
    
    def update(self):
        current_time = time.time() * 1000
        self.animation.update(current_time)
    
    def render(self):
        self.screen.fill(self.background_color)
        
        if self.animation.is_laughing:
            self.eyes.draw_laughing(self.screen, self.animation.laugh_offset)
        elif self.animation.is_smiling:
            self.eyes.draw_smiling(self.screen)
        else:
            self.eyes.draw_normal(self.screen)
        
        pygame.display.flip()
    
    def run(self):
        running = True
        self.animation.last_blink_time = time.time() * 1000 
        while running:
            running = self.handle_events()
            self.update()
            self.render()
            self.clock.tick(60)
        
        pygame.quit()


if __name__ == "__main__":
    app = MonkeyEyeApp()
    app.run()