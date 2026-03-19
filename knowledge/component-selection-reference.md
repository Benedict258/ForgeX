# Component Selection Reference

Select components based on the project function and the required interfaces.

Good default boards:
- Arduino Uno for teaching and breadboard demos
- Arduino Nano when space matters but complexity should stay low

Typical parts by function:
- Status output: LED plus 220 ohm resistor
- Audible alert: active buzzer for simple on/off signaling
- Variable input: 10k potentiometer
- Distance sensing: HC-SR04 ultrasonic sensor
- Motion output: SG90 micro servo
- High-current switching: logic-level MOSFET or transistor stage

When listing components:
- Include quantity
- Include purpose
- Avoid unnecessary parts
- Do not list a resistor as "not needed"

If a design uses:
- LEDs: one resistor per LED
- Button: specify whether external resistor is needed or internal pull-up is used
- Servo: mention external power considerations
- Sensor modules: mention VCC, GND, and signal pins by name

The component list should be minimal, buildable, and aligned with the described circuit.
