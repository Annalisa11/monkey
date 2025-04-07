import pygame
import random
import time

eye_width = 120
eye_height = 120
eye_y = 50
eye_distance = 80  # Distance between the two eyes
eye_left_x = 80
eye_right_x = 280
eye_radius = 10
last_blink_time = 0
blink_interval = random.uniform(500, 2000)
current_height_scale = 1.0
blink_speed = 15
move_speed = 2
is_blinking = False
shrinking = True

EYE_COLOR = (0,0,0)
BACKGROUND_COLOR = (255,255,255)

eye_offset = 0
laugh_speed = 2
is_laughing = True
laugh_up = True
max_laugh_offset = 20
laugh_cycle_count = 0

pygame.init()

screen_width = 480
screen_height = 320
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Monkey Eyes")

clock = pygame.time.Clock()

left_eye = pygame.Rect(eye_left_x, eye_y, eye_width, eye_height)
right_eye = pygame.Rect(eye_right_x, eye_y, eye_width, eye_height)

def calculate_right_eye_x(left_x):
    return left_x + eye_width + eye_distance

def draw_eyes():
    pygame.draw.rect(screen, EYE_COLOR, left_eye, border_radius=eye_radius)
    pygame.draw.rect(screen, EYE_COLOR, right_eye, border_radius=eye_radius)

def draw_laughing_eyes():
    eye_middle_y = (screen_height // 2) + eye_offset
    print(f"eye y: {eye_middle_y}, {screen_height // 2}, {eye_offset}")
    for eye_middle_x in [eye_left_x + eye_width // 2, eye_right_x + eye_width // 2]:
        pygame.draw.circle(screen, EYE_COLOR, (eye_middle_x, eye_middle_y), eye_height // 2)
        pygame.draw.circle(screen, BACKGROUND_COLOR, (eye_middle_x, eye_middle_y  + 40), eye_height // 2)

def animate_laugh():
    global laugh_up, is_laughing, eye_offset, laugh_cycle_count

    if laugh_up:
        print("UP")
        eye_offset += laugh_speed
        if eye_offset >= max_laugh_offset:
            laugh_up = False
    else:
        print("DOWN")
        eye_offset -= laugh_speed
        if eye_offset <= 0:
            laugh_up = True
            laugh_cycle_count += 1
            
            if laugh_cycle_count >= 4:
                is_laughing = False
                eye_offset = 0


def animate_blink():
    global shrinking, is_blinking
    
    if shrinking:
        left_eye.inflate_ip(0, -blink_speed)
        right_eye.inflate_ip(0, -blink_speed)
        
        if left_eye.height <= 10: 
            shrinking = False
    else:
        left_eye.inflate_ip(0, blink_speed)
        right_eye.inflate_ip(0, blink_speed)
        
        if left_eye.height >= eye_height:  
            left_eye.height = eye_height
            right_eye.height = eye_height
            is_blinking = False

def move_sideways(right=True):
    global shrinking, is_blinking

    if shrinking:
        left_eye.move_ip(move_speed, 0)
        right_eye.move_ip(move_speed, 0)
        
        if left_eye.x >= 150: 
            shrinking = False
    else:
        left_eye.move_ip(-move_speed, 0)
        right_eye.move_ip(-move_speed, 0)
        
        if left_eye.x <= 80:  
            left_eye.x = eye_left_x
            right_eye.x = eye_right_x
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
            blink_interval = random.uniform(2000, 4000)  
            is_blinking = True
            shrinking = True
        
        if is_blinking:
            return
            # animate_blink()
            # move_sideways()
        
        # draw_eyes() 
        if is_laughing:
            animate_laugh()
            draw_laughing_eyes()
        pygame.display.flip()  
        clock.tick(60) 
    
    pygame.quit()

if __name__ == "__main__":
    main()
