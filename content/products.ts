import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "ar-glasses",
    name: "AR/Computer Glasses",
    slug: "ar-glasses",
    shortDescription:
      "Wearable AR system with chord-based glove input, collimating optics, and real-time AI processing.",
    description: `A fully custom augmented reality system built from the ground up. The AR/Computer Glasses combine a lightweight wearable display with chord-based glove input, allowing hands-free interaction through finger combinations mapped to a full character set.

The optical system uses collimating lenses to focus a micro OLED display at optical infinity, creating a heads-up overlay that doesn't strain the eyes. The glasses connect via Bluetooth Low Energy to an iPhone, which handles the heavy compute — running AI models, processing camera input, and managing the glove's chord interpreter.

Key innovations include a colorblindness correction mode that applies real-time color filters through the display pipeline, and an AI assistant layer that can process what the wearer sees and respond through the HUD.

The glove input system uses an ESP32 microcontroller with capacitive touch sensors on each finger. Chord combinations (multiple fingers pressed simultaneously) map to characters, numbers, and commands — similar to a stenotype but designed for wearable use.`,
    images: [],
    techStack: [
      "Swift",
      "CoreBluetooth",
      "ESP32",
      "Arduino",
      "OLED",
      "Collimating Optics",
      "Python",
      "OpenCV",
      "Anthropic API",
    ],
    status: "prototype",
    links: {},
    features: [
      "Chord-based glove input with full character mapping",
      "Collimating optics for eye-safe HUD display",
      "Real-time AI processing via iPhone companion app",
      "Colorblindness correction filters",
      "Bluetooth Low Energy connectivity",
      "Custom ESP32 firmware for glove sensors",
      "Camera passthrough with computer vision",
    ],
    dateCreated: "2025-09-01",
    order: 1,
    gradient: "from-violet-600/20 via-blue-600/20 to-cyan-500/20",
  },
  {
    id: "charger-agent",
    name: "ChargerAgent",
    slug: "charger-agent",
    shortDescription:
      "macOS menu bar AI assistant with terminal access, file management, and streaming responses.",
    description: `ChargerAgent is a native macOS application built in SwiftUI that lives in the menu bar, providing instant access to a powerful AI assistant. It connects to Anthropic's Claude API and extends the model with real tools — terminal command execution, file system access, and more.

The app uses Server-Sent Events (SSE) for real-time streaming of AI responses, so you see the assistant thinking and responding character by character. The tool system is built on Claude's native tool use protocol, with each tool defined as a Swift struct conforming to a common protocol.

The terminal tool can execute arbitrary shell commands and return the output to the AI, enabling workflows like "check my git status and summarize what I've been working on" or "find all TODO comments in my project." The file tool provides read/write access for tasks like editing configs or generating boilerplate.

Designed as a lightweight alternative to heavier AI coding tools — always one click away, no browser needed.`,
    images: [],
    techStack: [
      "SwiftUI",
      "AppKit",
      "Anthropic API",
      "Server-Sent Events",
      "Swift Concurrency",
      "macOS Menu Bar API",
    ],
    status: "in-development",
    links: {},
    features: [
      "Native macOS menu bar application",
      "Real-time SSE streaming responses",
      "Terminal command execution tool",
      "File system read/write tool",
      "Claude tool use protocol integration",
      "Lightweight, always-accessible design",
      "Conversation history with local persistence",
    ],
    dateCreated: "2025-12-01",
    order: 2,
    gradient: "from-amber-600/20 via-orange-600/20 to-red-500/20",
  },
  {
    id: "charger-mail",
    name: "Charger Mail",
    slug: "charger-mail",
    shortDescription:
      "Native macOS email client with unified inbox, Gmail OAuth2, and local AI powered by Ollama.",
    description: `Charger Mail is a native macOS email client built to replace the need for multiple email apps. It features a unified inbox that aggregates accounts through Gmail OAuth2, presented in a fast, keyboard-driven interface inspired by Superhuman.

What sets it apart is the local AI integration. Instead of sending your emails to a cloud service, Charger Mail connects to Ollama running locally on your machine. This means AI-powered features like email summarization, smart reply drafting, and priority sorting all happen on-device with zero data leaving your computer.

The interface is built entirely in SwiftUI with a focus on speed — instant search, keyboard shortcuts for every action, and a minimal design that stays out of the way. The goal is an email experience that's fast, private, and intelligent.`,
    images: [],
    techStack: [
      "SwiftUI",
      "AppKit",
      "Gmail API",
      "OAuth2",
      "Ollama",
      "Local LLM",
      "KeyboardShortcuts",
      "Core Data",
    ],
    status: "in-development",
    links: {},
    features: [
      "Unified inbox across multiple Gmail accounts",
      "Gmail OAuth2 authentication",
      "Local AI via Ollama (no cloud dependency)",
      "AI email summarization and smart replies",
      "Keyboard-driven Superhuman-style interface",
      "Instant full-text search",
      "Privacy-first architecture",
    ],
    dateCreated: "2026-01-15",
    order: 3,
    gradient: "from-emerald-600/20 via-teal-600/20 to-cyan-500/20",
  },
];
