import pygame
import random
import time

eye_width = 120
eye_height = 220
eye_y = 50
eye_distance = 130  # Distance between the two eyes
eye_left_x = 60
eye_right_x = 300
eye_radius = 10
last_blink_time = 0
blink_interval = random.uniform(500, 2000)
current_height_scale = 1.0
blink_speed = 0.05
is_blinking = False
shrinking = True


pygame.init()

screen_width = 480
screen_height = 320
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Monkey Eyes")

clock = pygame.time.Clock()

def draw_eyes(eye_height):
    # Left eye
    pygame.draw.rect(screen, (0, 0, 0), 
                    (eye_left_x, eye_y, eye_width, eye_height),
                    border_radius=eye_radius)
    
    # Right eye
    pygame.draw.rect(screen, (0, 0, 0), 
                    (eye_right_x, eye_y, eye_width, eye_height),
                    border_radius=eye_radius)

def animate_blink():
    global current_height_scale, shrinking, is_blinking
    
    if shrinking:
        current_height_scale -= blink_speed
        if current_height_scale <= 0.1:  
            shrinking = False
    else:
        current_height_scale += blink_speed
        if current_height_scale >= 1.0:
            current_height_scale = 1.0
            is_blinking = False
    
    draw_eyes(eye_height * current_height_scale)

def main():
    global last_blink_time, blink_interval, is_blinking, shrinking
    
    running = True
    last_blink_time = time.time() * 1000  
    
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
        
        screen.fill((255, 255, 255))
        current_time = time.time() * 1000
        
        if (current_time - last_blink_time > blink_interval) and not is_blinking:
            last_blink_time = current_time
            blink_interval = random.uniform(500, 2000)
            is_blinking = True
            shrinking = True
        
        if is_blinking:
            animate_blink()
        else:
            draw_eyes(eye_height)
        
        pygame.display.flip()
        clock.tick(60)
    
    pygame.quit()

if __name__ == "__main__":
    main()