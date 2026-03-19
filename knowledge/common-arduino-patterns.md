# Common Arduino Project Patterns

Use simple patterns that map clearly from intent to wiring and code.

Traffic light controller:
- Three digital outputs
- One resistor per LED
- Sequential timing in loop or a simple state machine

Adjustable LED blinker:
- One digital output for LED
- One analog input for potentiometer
- Map analog value to delay interval

Ultrasonic parking sensor:
- HC-SR04 trigger and echo pins
- One buzzer or LED alert output
- Optional multiple thresholds for slow and fast beep rates

Servo gate or door system:
- One PWM-capable control pin to servo signal
- Shared ground is mandatory
- External 5V may be required if servo causes reset or jitter

Temperature alert:
- Temperature sensor input
- LED or buzzer output
- Threshold comparison in loop

Push-button control:
- Use pull-up or pull-down strategy explicitly
- Prefer `INPUT_PULLUP` for simple Arduino builds
- Account for inverted button logic if using pull-up mode

For beginner demos, prefer:
- One controller
- One sensor class
- One clear actuator
- Obvious visual or audible feedback
