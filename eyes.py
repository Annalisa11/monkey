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

EYE_COLOR = (0,0,0)
BACKGROUND_COLOR = (255,255,255)

pygame.init()

screen_width = 480
screen_height = 320
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Monkey Eyes")

clock = pygame.time.Clock()

left_eye = pygame.Rect(eye_left_x, eye_y, eye_width, eye_height)
right_eye = pygame.Rect(eye_right_x, eye_y, eye_width, eye_height)

def draw_eyes():
    # Left eye
    pygame.draw.rect(screen, EYE_COLOR, left_eye, border_radius=eye_radius)
    
    # Right eye
    pygame.draw.rect(screen, EYE_COLOR, right_eye, border_radius=eye_radius)

def animate_blink():
    global shrinking, is_blinking
    
    if shrinking:
        left_eye.inflate_ip(0, -10)
        right_eye.inflate_ip(0, -10)
        
        if left_eye.height <= 10: 
            shrinking = False
    else:
        left_eye.inflate_ip(0, 10)
        right_eye.inflate_ip(0, 10)
        
        if left_eye.height >= eye_height:  
            left_eye.height = eye_height
            right_eye.height = eye_height
            is_blinking = False

def main():
    global last_blink_time, blink_interval, is_blinking, shrinking
    
    running = True
    last_blink_time = time.time() * 1000  # current time in milliseconds
    
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
        
        screen.fill(BACKGROUND_COLOR)  
        current_time = time.time() * 1000  
        
        if (current_time - last_blink_time > blink_interval) and not is_blinking:
            last_blink_time = current_time
            blink_interval = random.uniform(500, 2000)  
            is_blinking = True
            shrinking = True
        
        if is_blinking:
            animate_blink()  
        
        draw_eyes() 
        pygame.display.flip()  
        clock.tick(60) 
    
    pygame.quit()

if __name__ == "__main__":
    main()
