# Debugging and Demo Readiness

A strong demo circuit is easy to explain, easy to verify, and easy to recover if something goes wrong.

Debugging order:
1. Confirm board power
2. Confirm ground continuity
3. Confirm pin mapping matches the code
4. Test one output first
5. Add sensor input after output behavior is known good

Useful debug practices:
- Add Serial prints for measured values and state transitions
- Use a single status LED for quick health checks
- Keep thresholds and timings as named constants
- Test every subsystem independently before combining them

Demo readiness rules:
- Prefer fixed thresholds over adaptive logic unless adaptation is central to the demo
- Prefer visible LEDs, audible buzzers, or obvious movement
- Keep wiring short and readable
- Avoid fragile or ambiguous breadboard layouts
- Use component names and pin numbers consistently across explanation, circuit section, and code

If the model is uncertain:
- choose the simpler architecture
- state the assumption clearly
- keep the build safe and debuggable
