// Mock data — swap with real API responses later.

export const venues = [
  {
    id: 1,
    name: "Kick-it AC Road",
    tag: "AC Turf · 60x40 · 5v5, 7v7, 11v11",
    rating: 4.6,
    reviews: 72,
    image: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=600&q=80",
    featured: true,
  },
  {
    id: 2,
    name: "Terra Arena",
    tag: "Full Ground · Astro Turf",
    rating: 4.8,
    reviews: 91,
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80",
    featured: true,
  },
  {
    id: 3,
    name: "Pickle And Play Sarjapur",
    tag: "Indoor Pickleball Courts",
    rating: 4.7,
    reviews: 68,
    image: "https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=600&q=80",
    featured: true,
  },
  {
    id: 4,
    name: "Nisha Millets Swimming",
    tag: "Sports Backwater Rd.",
    rating: 4.5,
    reviews: 85,
    image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80",
    featured: true,
  },
];

export const games = [
  {
    id: 1,
    sport: "Badminton",
    type: "Tournament",
    status: "1v1 Going",
    format: "Singles · Intermediate",
    time: "Fri, 16 Aug 2024, 07:30 PM - 09:00 PM",
    location: "Rudr Arena HSR Layout, Bengaluru",
    level: "badminton",
    slotsLabel: null,
  },
  {
    id: 2,
    sport: "Tennis",
    type: "Doubles · Regular",
    status: "5v5 Going",
    format: "Open Teams · 15/32 teams",
    time: "Fri, 16 Aug 2024, 05:30 PM - 06:30 PM",
    location: "Turf Park, Koramangala, Bengaluru",
    level: "TENNIS · ADVANCED",
    slotsLabel: "7450",
  },
  {
    id: 3,
    sport: "Football",
    type: "Doubles · Regular",
    status: "6v6 Going",
    format: "Paid · 8/16 Teams",
    time: "Fri, 16 Aug 2024, 06:00 PM - 07:30 PM",
    location: "Sky Sports Arena, Whitefield",
    level: "FOOTBALL · INTERMEDIATE",
    slotsLabel: "7350",
    booked: true,
  },
  {
    id: 4,
    sport: "Basketball",
    type: "Half Court · Regular",
    status: "5v3 Going",
    format: "Open · 6/12 Teams",
    time: "Fri, 16 Aug 2024, 06:00 PM - 09:00 PM",
    location: "Playo Arena, JP Nagar",
    level: "BASKETBALL",
    slotsLabel: null,
  },
];

export const popularSports = [
  { name: "Badminton", image: "https://images.unsplash.com/photo-1733141731875-8e33d5f2bd36?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Football", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80" },
  { name: "Cricket", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80" },
  { name: "Swimming", image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80" },
  { name: "Tennis", image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80" },
  { name: "Table Tennis", image: "https://images.unsplash.com/photo-1646978567314-32cfd5a8854e?q=80&w=955&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

export const spotlightCards = [
  {
    title: "Play. Refer. Earn. Repeat.",
    subtitle: "Invite friends, unlock rewards every time they play.",
    cta: "Refer Now",
    icon: "coins",
    accent: "from-blue-600 to-blue-800",
  },
  {
    title: "Find Your Coach. Crush Your Goals.",
    subtitle: "Certified trainers across every sport near you.",
    cta: "Train Smarter",
    icon: "whistle",
    accent: "from-indigo-600 to-indigo-900",
  },
  {
    title: "Got a Turf? Turn It Into a Hotspot?",
    subtitle: "List your venue and start getting bookings today.",
    cta: "List Your Venue",
    icon: "stadium",
    accent: "from-sky-600 to-blue-900",
  },
  {
    title: "Got Ideas? We're All Ears!",
    subtitle: "Tell us what you'd love to see on Playo next.",
    cta: "Tell Us",
    icon: "chat",
    accent: "from-blue-700 to-slate-900",
  },
];


export const blogs = [
  { id: 1, title: "Learn Volleyball in 5 Easy Steps", date: "September 10, 2024", author: "Playo", image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80" },
  { id: 2, title: "Names Celebrated by Cricket Fans", date: "March 3, 2024", author: "Arpith Thomas", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80" },
  { id: 3, title: "Easy-to-Learn Badminton Tips", date: "August 27, 2024", author: "Ramesh Patil", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80" },
  { id: 4, title: "A Spectator's Guide to Tournaments", date: "January 15, 2024", author: "Playo", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80" },
  { id: 5, title: "Take Football Skills to the Next Level", date: "April 5, 2024", author: "Ashwin", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80" },
];

export const faqs = [
  { q: "What is Playo and how does it work?", a: "Playo is a sports community platform to book venues, join games and find coaches near you." },
  { q: "How can I book sports venues online using Playo?", a: "Search a venue near you, pick a slot and confirm your booking in-app." },
  { q: "Which sports can I book on Playo?", a: "Badminton, football, cricket, swimming, tennis, table tennis and more." },
  { q: "Can I join sports games even if I don't have a team?", a: "Yes, join open games hosted by other players in your city." },
  { q: "How do I find sports venues near me?", a: "Use the venue search with your city and sport to see nearby options." },
  { q: "Can Playo help organize corporate sports events?", a: "Yes, Playo supports corporate bookings and events." },
  { q: "What are the best weekend sports activities available on Playo?", a: "Popular weekend picks include football, badminton and swimming sessions." },
  { q: "Can I host my own sports games on Playo?", a: "Yes, create a game, set the format and invite players." },
  { q: "Why should I use Playo to book sports venues?", a: "Verified venues, instant booking and a large player community." },
  { q: "Which cities does Playo operate in?", a: "Playo operates across major cities including Bangalore, Mumbai and Delhi NCR." },
];

export const cities = [
  "Bangalore", "Hyderabad", "Visakhapatnam", "Coimbatore", "Pune", "Mumbai", "Rohini NCR",
  "Dubai", "Sydney", "London", "Chennai", "Ahmedabad", "Guwahati", "Lucknow",
];




