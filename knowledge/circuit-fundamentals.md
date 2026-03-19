# Circuit Fundamentals

Series circuits place components in a single current path. Parallel circuits create multiple current paths and are common when separate loads must receive the same supply voltage.

Ohm's law is V = I x R. Use it to size current-limiting resistors for LEDs and to estimate expected current draw.

For a standard LED on a 5V Arduino pin, a 220 ohm to 330 ohm resistor is a common safe starting point. Each LED should have its own resistor.

Always define:
- Supply voltage
- Ground reference
- Signal path
- Component polarity

Common breadboard practice:
- Keep power rails consistent
- Use color conventions where possible
- Verify shared ground across sensors, actuators, and controller

When explaining a circuit, state each connection explicitly in the form:
- source pin -> component input
- component output -> ground or return node

If a user request is underspecified, prefer a breadboard-friendly prototype with the minimum safe component set.
