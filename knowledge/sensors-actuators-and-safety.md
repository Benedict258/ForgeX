# Sensors, Actuators, and Safety

Sensors convert physical conditions into electrical signals. Actuators convert electrical signals into physical action.

Common beginner-safe components:
- LEDs for status output
- Push buttons for user input
- Potentiometers for analog tuning
- Buzzers for alert output
- HC-SR04 for simple distance sensing
- Servo motors for controlled angular movement

Safety and design checks:
- Confirm voltage compatibility before wiring
- Do not drive motors directly from a microcontroller pin
- Use a transistor, driver, or relay when current demand exceeds GPIO capability
- Share ground between controller and external driver circuits
- Mention resistor needs, power needs, and polarity in build steps

For demonstrations, choose circuits that are easy to verify visually or audibly.
