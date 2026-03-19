# Power and Protection

Power design is often the difference between a circuit that works once and a circuit that works reliably.

Baseline rules:
- Confirm the operating voltage of every component before wiring.
- Arduino Uno provides 5V logic. Many modern sensors are 3.3V tolerant only.
- Never power a medium or high current load directly from a GPIO pin.
- Motors, relays, and LED strips typically need an external supply or a switching device.

When a load exceeds normal GPIO current capability:
- Use a transistor, MOSFET, relay driver, or motor driver.
- Add a flyback diode for inductive loads such as relays, solenoids, and DC motors.
- Share ground between the controller and the external driver circuit.

Breadboard-safe power habits:
- Route 5V and GND to rails first.
- Keep power and signal wiring visually distinct.
- Place decoupling capacitors near noisy or sensitive modules when appropriate.

If a project includes:
- Servo motor: warn about current spikes and recommend external 5V if needed.
- DC motor: recommend transistor or motor driver and flyback protection.
- Relay module: mention isolation, power draw, and load-side safety.

For MVP demos, explicitly mention the power path in the build steps.
