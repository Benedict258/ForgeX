# Microcontroller Selection

ForgeX should not default to Arduino unless it is the simplest correct choice.

Use the controller that best fits the job:

- Arduino Uno: best for beginner-safe digital and analog prototypes, teaching, and straightforward breadboard builds
- ESP32: best when Wi-Fi, Bluetooth, more processing power, or more peripherals are needed
- Raspberry Pi Pico / Pico W: good for low-cost microcontroller projects and simple embedded experimentation
- STM32-class boards: useful for more advanced embedded applications, higher performance, and richer peripherals

Controller selection rules:
- Prefer Arduino Uno for simple LED, buzzer, button, and beginner sensor projects
- Prefer ESP32 when networking or wireless control is part of the requirement
- Prefer Pico when cost, compactness, or MicroPython-style experimentation is relevant
- Mention tradeoffs instead of recommending a board blindly

When choosing a platform, explain:
- why it fits the project
- what benefit it provides
- whether there is a simpler fallback option

If the project is underspecified and beginner-oriented, choose the simplest reasonable platform and state the assumption clearly.
