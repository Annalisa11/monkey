import time

from monkey_eyes_lib import EyesController

if __name__ == "__main__":
    controller = EyesController()
    try:
        controller.start_eyes()
        time.sleep(2)

        print("Smiling for 2s")
        controller.trigger_smile(2000)
        time.sleep(3)

        print("Laughing")
        controller.trigger_laugh()
        time.sleep(3)

        print("Star eyes for 3s")
        controller.trigger_star(3000)
        time.sleep(4)

        print("Concentrating indefinitely")
        controller.trigger_concentrate(indefinite=True)
        time.sleep(4)
        print("Stopping concentration")
        controller.stop_concentrate()
        time.sleep(2)

        print("Idling for one minute")
        time.sleep(60)

    except KeyboardInterrupt:
        print("Interrupted by user.")
    finally:
        print("Stopping eyes.")
        controller.stop_eyes()
        print("Demo finished.")