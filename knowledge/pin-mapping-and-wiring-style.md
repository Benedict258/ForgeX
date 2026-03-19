# Pin Mapping and Wiring Style

Every answer should keep the circuit description and code pin mapping synchronized.

Wiring style rules:
- Name Arduino pins explicitly, such as D8, D9, D10, A0.
- For each connection, include both endpoints.
- Use "via 220 ohm resistor" or similar phrasing when current limiting is required.
- Mention shared GND where needed.

Code style rules:
- Pin constants in code must match the circuit section exactly.
- Do not use a pin in code that is absent from the circuit design.
- Prefer one clear responsibility per pin.
- Keep constants at the top of the sketch.

Examples:
- Arduino D8 -> red LED anode via 220 ohm resistor
- red LED cathode -> GND
- Arduino A0 -> potentiometer wiper
- potentiometer outer pins -> 5V and GND

When generating steps:
- build from power and ground first
- then signal wiring
- then upload and test
