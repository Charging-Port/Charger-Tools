---
title: "Building AR Glasses from Scratch"
date: "2026-03-15"
category: "Hardware"
excerpt: "A deep dive into designing custom augmented reality glasses — from collimating optics to chord-based input."
---

Building augmented reality glasses from scratch means solving problems that most consumer tech companies throw hundreds of engineers at. But that's what makes it interesting.

## The Optical Challenge

The core problem with any head-mounted display is getting light from a tiny screen into your eyes in a way that doesn't cause strain. Consumer AR glasses use waveguides — thin glass panels that bounce light through total internal reflection. These are expensive and nearly impossible to fabricate at home.

Instead, I went with collimating optics: a small lens assembly that takes the diverging light from a micro OLED and makes the rays parallel. This simulates an image at optical infinity, so your eyes can focus on it naturally without accommodating to a near distance.

The trade-off is a narrower field of view compared to waveguide designs. But for a text-based HUD — which is the primary use case — it works well.

## Chord-Based Input

A keyboard doesn't work when your hands need to be free. Voice input is unreliable and socially awkward. So I built a chord glove.

The concept borrows from stenography: instead of pressing one key at a time, you press combinations of fingers simultaneously. With five fingers, you get 31 possible chords (2^5 - 1), which is enough for the full alphabet plus modifiers.

The glove uses an ESP32 microcontroller reading capacitive touch sensors on each fingertip. When a chord is detected, it's sent over BLE to the iPhone companion app, which interprets it and forwards the character to whatever the glasses are displaying.

Learning the chord mappings takes practice — about a week to become functional, a month to become fast. But once it clicks, it's remarkably efficient.

## What's Next

The current prototype is functional but bulky. The next iteration focuses on miniaturization: a thinner frame, a smaller lens assembly, and moving from a dev-board ESP32 to a custom PCB. The goal is something you could actually wear in public without looking like a science experiment.
