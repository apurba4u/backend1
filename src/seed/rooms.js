module.exports = [
  // ── Small Pods (1-2 capacity) ──────────────────────────────────
  {
    name: "The Quiet Corner",
    description:
      "A cozy single-person pod tucked away from the main floor. Perfect for deep focus sessions with minimal distractions, featuring sound-dampening walls and adjustable task lighting.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
    floor: 1,
    capacity: 1,
    pricePerHour: 8,
    amenities: ["WiFi", "Power Outlets", "Air Conditioning"],
  },
  {
    name: "Focus Pod Alpha",
    description:
      "A modern phone-booth-style pod designed for solo study or focused video calls. Equipped with a small desk, monitor mount, and excellent ventilation for long work sessions.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    floor: 2,
    capacity: 1,
    pricePerHour: 10,
    amenities: ["WiFi", "Power Outlets", "Air Conditioning", "Natural Light"],
  },
  {
    name: "The Think Tank",
    description:
      "A compact two-person pod ideal for paired study sessions or tutoring. The glass walls keep the space feeling open while maintaining acoustic privacy from the hallway.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
    floor: 1,
    capacity: 2,
    pricePerHour: 12,
    amenities: ["WiFi", "Power Outlets", "Whiteboard", "Natural Light"],
  },
  {
    name: "Scholar's Nook",
    description:
      "A warm and inviting two-seat alcove with built-in bookshelves and a shared desk. The ambient lighting and wooden accents create a calm, library-like atmosphere for productive study.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    floor: 3,
    capacity: 2,
    pricePerHour: 11,
    amenities: ["WiFi", "Power Outlets", "Natural Light", "Coffee Machine"],
  },

  // ── Medium Rooms (3-6 capacity) ────────────────────────────────
  {
    name: "Scholar's Haven",
    description:
      "A mid-sized study room with a large central table and ergonomic seating for up to four. Abundant natural light pours in through floor-to-ceiling windows overlooking the courtyard.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    floor: 2,
    capacity: 4,
    pricePerHour: 18,
    amenities: [
      "WiFi",
      "Power Outlets",
      "Whiteboard",
      "Natural Light",
      "Air Conditioning",
    ],
  },
  {
    name: "The Brainstorm Lab",
    description:
      "A creative workspace built for group projects and idea generation. Every wall is a writable surface, and the room includes a 55-inch display for screen sharing and presentations.",
    image:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop",
    floor: 3,
    capacity: 5,
    pricePerHour: 22,
    amenities: [
      "WiFi",
      "Whiteboard",
      "Projector",
      "Power Outlets",
      "Air Conditioning",
    ],
  },
  {
    name: "The Study Loft",
    description:
      "A stylish mezzanine-level room with exposed brick and warm pendant lighting. The open layout comfortably seats four and includes a small coffee station for those long study marathons.",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
    floor: 4,
    capacity: 4,
    pricePerHour: 20,
    amenities: [
      "WiFi",
      "Power Outlets",
      "Natural Light",
      "Coffee Machine",
      "Air Conditioning",
    ],
  },
  {
    name: "Innovation Hub",
    description:
      "A tech-forward collaboration room equipped with dual monitors at every seat and a central presentation display. Designed for hackathons, coding sessions, and group problem-solving.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    floor: 2,
    capacity: 6,
    pricePerHour: 25,
    amenities: [
      "WiFi",
      "Projector",
      "Meeting Display",
      "Power Outlets",
      "Air Conditioning",
      "Printer",
    ],
  },
  {
    name: "The Seminar Room",
    description:
      "A professional-grade seminar room with a horseshoe table layout and integrated AV system. Ideal for study groups that need to present work, hold mock interviews, or run practice lectures.",
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&h=600&fit=crop",
    floor: 3,
    capacity: 6,
    pricePerHour: 24,
    amenities: [
      "WiFi",
      "Projector",
      "Sound System",
      "Whiteboard",
      "Power Outlets",
      "Air Conditioning",
    ],
  },
  {
    name: "The Focus Suite",
    description:
      "A quiet, carpeted suite designed for concentrated small-group study. Soundproofed walls and warm lighting eliminate distractions, while a shared whiteboard keeps everyone aligned.",
    image:
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&h=600&fit=crop",
    floor: 1,
    capacity: 3,
    pricePerHour: 14,
    amenities: [
      "WiFi",
      "Power Outlets",
      "Whiteboard",
      "Air Conditioning",
    ],
  },
  {
    name: "The Reading Room",
    description:
      "A serene, library-inspired room with soft lighting and comfortable seating for four. Stocked with reference materials and equipped with individual reading lamps at every seat.",
    image:
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&h=600&fit=crop",
    floor: 5,
    capacity: 4,
    pricePerHour: 16,
    amenities: ["WiFi", "Power Outlets", "Natural Light", "Air Conditioning"],
  },
  {
    name: "The Workshop Space",
    description:
      "A versatile room with modular furniture that can be rearranged for any group activity. Includes a large dry-erase wall, printer access, and a coffee maker to keep energy levels up.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop",
    floor: 2,
    capacity: 5,
    pricePerHour: 21,
    amenities: [
      "WiFi",
      "Whiteboard",
      "Printer",
      "Coffee Machine",
      "Power Outlets",
      "Air Conditioning",
    ],
  },

  // ── Large Rooms (7-9 capacity) ─────────────────────────────────
  {
    name: "The Collaboration Center",
    description:
      "A spacious open-plan room with a long communal table and standing-desk options along the perimeter. Perfect for team projects, with multiple power strips and a large-format display for presentations.",
    image:
      "https://images.unsplash.com/photo-1497366676254-6a68a5645e04?w=800&h=600&fit=crop",
    floor: 3,
    capacity: 8,
    pricePerHour: 30,
    amenities: [
      "WiFi",
      "Meeting Display",
      "Whiteboard",
      "Power Outlets",
      "Air Conditioning",
      "Printer",
    ],
  },
  {
    name: "Project Room Delta",
    description:
      "A well-equipped project room with a U-shaped table arrangement that encourages discussion and collaboration. Features include a 65-inch smart TV and a full wall of whiteboards.",
    image:
      "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800&h=600&fit=crop",
    floor: 4,
    capacity: 8,
    pricePerHour: 32,
    amenities: [
      "WiFi",
      "Projector",
      "Whiteboard",
      "Sound System",
      "Power Outlets",
      "Air Conditioning",
    ],
  },
  {
    name: "The Exchange",
    description:
      "A bright, airy room with skylights and a central island table. Designed for study groups that thrive on energy and interaction, with plenty of room to spread out books and materials.",
    image:
      "https://images.unsplash.com/photo-1517048676734-d65bc937f952?w=800&h=600&fit=crop",
    floor: 1,
    capacity: 7,
    pricePerHour: 28,
    amenities: [
      "WiFi",
      "Natural Light",
      "Whiteboard",
      "Power Outlets",
      "Coffee Machine",
      "Air Conditioning",
    ],
  },
  {
    name: "Team Zone Bravo",
    description:
      "A dedicated team workspace with four interconnected desks and a shared screen at the head of the table. Includes lockers for storing materials between sessions and a small break area.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
    floor: 2,
    capacity: 9,
    pricePerHour: 35,
    amenities: [
      "WiFi",
      "Meeting Display",
      "Whiteboard",
      "Power Outlets",
      "Air Conditioning",
      "Printer",
      "Coffee Machine",
    ],
  },
  {
    name: "The Agora",
    description:
      "Named after the ancient Greek gathering place, this room is built for debate, discussion, and collaborative learning. A circular table ensures everyone has an equal seat, and the acoustics are superb.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    floor: 5,
    capacity: 8,
    pricePerHour: 30,
    amenities: [
      "WiFi",
      "Sound System",
      "Whiteboard",
      "Power Outlets",
      "Air Conditioning",
      "Natural Light",
    ],
  },

  // ── Conference / Event Rooms (10-12 capacity) ──────────────────
  {
    name: "The Grand Study Hall",
    description:
      "Our flagship study space, seating up to twelve around a polished oak conference table. Full AV capabilities, soundproofed walls, and a private coffee bar make this the ultimate setting for intensive group study.",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
    floor: 5,
    capacity: 12,
    pricePerHour: 50,
    amenities: [
      "WiFi",
      "Projector",
      "Meeting Display",
      "Sound System",
      "Whiteboard",
      "Power Outlets",
      "Air Conditioning",
      "Coffee Machine",
      "Printer",
      "Natural Light",
    ],
  },
  {
    name: "Conference Room Orion",
    description:
      "A premium conference room with a 75-inch display, Polycom conference phone, and tiered seating for presentations. Ideal for large study groups preparing for exams or working on capstone projects.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
    floor: 4,
    capacity: 10,
    pricePerHour: 42,
    amenities: [
      "WiFi",
      "Projector",
      "Meeting Display",
      "Sound System",
      "Whiteboard",
      "Power Outlets",
      "Air Conditioning",
      "Printer",
    ],
  },
  {
    name: "The Forum",
    description:
      "A versatile event-style room with movable chairs and a stage area at the front. Perfect for mock presentations, exam review sessions, or any large-group activity that needs flexible seating.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    floor: 3,
    capacity: 12,
    pricePerHour: 45,
    amenities: [
      "WiFi",
      "Projector",
      "Sound System",
      "Whiteboard",
      "Power Outlets",
      "Air Conditioning",
      "Natural Light",
    ],
  },
  {
    name: "The Summit Room",
    description:
      "A top-floor conference room with panoramic city views and premium furnishings. The long walnut table seats ten, and the room includes a dedicated prep area with a mini-fridge and coffee station.",
    image:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop",
    floor: 5,
    capacity: 10,
    pricePerHour: 48,
    amenities: [
      "WiFi",
      "Meeting Display",
      "Sound System",
      "Whiteboard",
      "Power Outlets",
      "Air Conditioning",
      "Coffee Machine",
      "Natural Light",
    ],
  },
  {
    name: "Synergy Space",
    description:
      "A large, open collaboration room designed for cross-team projects and workshops. Modular furniture allows for multiple configurations, from classroom-style to roundtable discussions.",
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&h=600&fit=crop",
    floor: 4,
    capacity: 11,
    pricePerHour: 40,
    amenities: [
      "WiFi",
      "Projector",
      "Whiteboard",
      "Power Outlets",
      "Air Conditioning",
      "Printer",
      "Coffee Machine",
    ],
  },
  {
    name: "The Nexus",
    description:
      "Our newest addition, a high-tech collaboration room with wireless screen sharing at every seat and a massive interactive whiteboard. Built for teams that want to blend digital and analog workflows.",
    image:
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&h=600&fit=crop",
    floor: 4,
    capacity: 10,
    pricePerHour: 44,
    amenities: [
      "WiFi",
      "Projector",
      "Meeting Display",
      "Whiteboard",
      "Power Outlets",
      "Air Conditioning",
      "Printer",
      "Natural Light",
    ],
  },

  // ── Specialty / Quiet Zones ────────────────────────────────────
  {
    name: "The Silence Pod",
    description:
      "A strict no-talking zone for individual deep work. Triple-pane glass and acoustic ceiling tiles block all outside noise, and the room is furnished with a single standing desk and a meditation cushion.",
    image:
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&h=600&fit=crop",
    floor: 1,
    capacity: 1,
    pricePerHour: 6,
    amenities: ["WiFi", "Power Outlets", "Air Conditioning"],
  },
  {
    name: "Zen Study Room",
    description:
      "A tranquil study space with bamboo accents, a small indoor fountain, and natural wood finishes. The calming environment is perfect for exam prep or meditation breaks between study sessions.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop",
    floor: 5,
    capacity: 3,
    pricePerHour: 15,
    amenities: ["WiFi", "Power Outlets", "Natural Light", "Air Conditioning"],
  },
  {
    name: "The Late-Night Lab",
    description:
      "Available for extended hours, this room is designed for night owls and deadline warriors. Blackout curtains, adjustable color-temperature lighting, and an espresso machine keep you going until dawn.",
    image:
      "https://images.unsplash.com/photo-1517048676734-d65bc937f952?w=800&h=600&fit=crop",
    floor: 1,
    capacity: 4,
    pricePerHour: 19,
    amenities: [
      "WiFi",
      "Power Outlets",
      "Air Conditioning",
      "Coffee Machine",
      "Whiteboard",
    ],
  },
  {
    name: "The Terrace Room",
    description:
      "A sun-drenched room with access to a private outdoor terrace. When the weather is nice, the glass walls fold open to blend indoor and outdoor study space. A favorite during spring and fall semesters.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    floor: 3,
    capacity: 5,
    pricePerHour: 23,
    amenities: [
      "WiFi",
      "Natural Light",
      "Power Outlets",
      "Air Conditioning",
      "Coffee Machine",
      "Whiteboard",
    ],
  },
];
