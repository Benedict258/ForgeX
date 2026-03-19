# Arduino GPIO and Code

Arduino Uno uses 5V logic and is appropriate for beginner prototypes.

Useful conventions:
- Digital outputs drive LEDs, relays, and buzzers
- Digital inputs read buttons and simple digital sensors
- Analog inputs read variable voltage sources such as potentiometers

Common patterns:
- Blink: digitalWrite and delay
- Sequencing: ordered activation of outputs with delays
- Sensor threshold: read input, compare to limit, trigger output
- State machine: use named states for multi-step control logic

Code quality rules:
- Declare pins as constants
- Configure pinMode in setup
- Use descriptive comments
- Keep loop logic readable
- Use Serial output for debugging when useful

When generating code, ensure it is directly runnable and matches the exact pin mapping described in the circuit section.
