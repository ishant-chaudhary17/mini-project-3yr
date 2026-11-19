import { User, Edge, PostPreset } from '../types/graph';


export const postPresets: PostPreset[] = [
  {
    id: 'p1',
    title: '🚀 Architecture Launch',
    text: 'Just deployed our new real-time BFS notification fan-out engine! Write amplification test in progress. 🔥',
    category: 'tech',
    tags: ['#DistributedSystems', '#BFS', '#Tech']
  },
  {
    id: 'p2',
    title: '🏆 Mini Project Showcase',
    text: 'Excited to demonstrate the Social Graph Fan-Out Visualizer for our 3rd Year evaluation! Proud of our work! 🎉',
    category: 'milestone',
    tags: ['#MiniProject', '#GraphTheory', '#Viva']
  },
  {
    id: 'p3',
    title: '🤔 Push vs Pull Fan-out',
    text: 'At 50M followers, fan-out on write causes huge write spikes. Hybrid push-pull is the only way to survive. Thoughts?',
    category: 'tech',
    tags: ['#SystemDesign', '#Scalability', '#Architecture']
  },
  {
    id: 'p4',
    title: '📸 Hackathon Campus Team',
    text: 'Great brainstorming session with the graph algorithms research team today! ☕📚',
    category: 'general',
    tags: ['#CampusLife', '#Colleagues']
  },
  {
    id: 'p5',
    title: '⚡ Redis Cluster Alert',
    text: 'Scheduled message queue maintenance tonight at 02:00 UTC. Expect zero notification lag across all nodes.',
    category: 'announcement',
    tags: ['#Infra', '#DevOps', '#Alert']
  }
];

export const users: User[] = [
  {
    "id": "u00",
    "name": "Alex Morgan",
    "username": "@alexmorgan",
    "avatar": "AM",
    "followersCount": 8,
    "followingCount": 8,
    "isVerified": false,
    "role": "Influencer",
    "department": "Computer Science",
    "bio": "Building large-scale graph notification engines \ud83c\udf10",
    "avatarColor": "from-amber-500 to-orange-600"
  },
  {
    "id": "u01",
    "name": "Sarah Wilson",
    "username": "@sarahw",
    "avatar": "SW",
    "followersCount": 9,
    "followingCount": 9,
    "isVerified": true,
    "role": "Influencer",
    "department": "AI Research Lab",
    "bio": "Distributed systems, Kafka & Redis fan-out fanatic \u26a1",
    "avatarColor": "from-cyan-500 to-blue-600"
  },
  {
    "id": "u02",
    "name": "John Carter",
    "username": "@johnc",
    "avatar": "JC",
    "followersCount": 10,
    "followingCount": 10,
    "isVerified": true,
    "role": "Influencer",
    "department": "Design Studio",
    "bio": "Visual systems & SVG interactive animation specialist \u2728",
    "avatarColor": "from-emerald-500 to-teal-600"
  },
  {
    "id": "u03",
    "name": "Emma Davis",
    "username": "@emmad",
    "avatar": "ED",
    "followersCount": 10,
    "followingCount": 10,
    "isVerified": true,
    "role": "Influencer",
    "department": "Cloud & Systems",
    "bio": "Graph Neural Networks & community detection \ud83e\udde0",
    "avatarColor": "from-purple-500 to-indigo-600"
  },
  {
    "id": "u04",
    "name": "Melissa Ramirez",
    "username": "@melissaramirez79",
    "avatar": "MR",
    "followersCount": 9,
    "followingCount": 9,
    "isVerified": true,
    "role": "Influencer",
    "department": "Campus Community",
    "bio": "3rd Year CS Undergrad | Full-stack & algorithms lead \ud83d\ude80",
    "avatarColor": "from-pink-500 to-rose-600"
  },
  {
    "id": "u05",
    "name": "Ryan Lopez",
    "username": "@ryanlopez15",
    "avatar": "RL",
    "followersCount": 11,
    "followingCount": 11,
    "isVerified": true,
    "role": "Influencer",
    "department": "Computer Science",
    "bio": "Cloud infrastructure, Kubernetes & resilience \ud83d\udee0\ufe0f",
    "avatarColor": "from-violet-500 to-purple-600"
  },
  {
    "id": "u06",
    "name": "Jessica Baker",
    "username": "@jessicabaker11",
    "avatar": "JB",
    "followersCount": 7,
    "followingCount": 7,
    "isVerified": false,
    "role": "Member",
    "department": "AI Research Lab",
    "bio": "Data structures, BFS traversal & graph optimization \ud83d\udcca",
    "avatarColor": "from-blue-500 to-cyan-600"
  },
  {
    "id": "u07",
    "name": "Thomas Davis",
    "username": "@thomasdavis22",
    "avatar": "TD",
    "followersCount": 4,
    "followingCount": 4,
    "isVerified": false,
    "role": "Influencer",
    "department": "Design Studio",
    "bio": "UI/UX design enthusiast & frontend developer \ud83c\udfa8",
    "avatarColor": "from-amber-500 to-orange-600"
  },
  {
    "id": "u08",
    "name": "Charles Flores",
    "username": "@charlesflores96",
    "avatar": "CF",
    "followersCount": 6,
    "followingCount": 6,
    "isVerified": false,
    "role": "Tech Lead",
    "department": "Cloud & Systems",
    "bio": "Researching social network propagation dynamics \ud83d\udd2c",
    "avatarColor": "from-cyan-500 to-blue-600"
  },
  {
    "id": "u09",
    "name": "Lauren Martinez",
    "username": "@laurenmartinez17",
    "avatar": "LM",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Designer",
    "department": "Campus Community",
    "bio": "Open source contributor & backend engineer \ud83d\udcbb",
    "avatarColor": "from-emerald-500 to-teal-600"
  },
  {
    "id": "u10",
    "name": "Margaret Miller",
    "username": "@margaretmiller33",
    "avatar": "MM",
    "followersCount": 4,
    "followingCount": 4,
    "isVerified": false,
    "role": "Student",
    "department": "Computer Science",
    "bio": "Building large-scale graph notification engines \ud83c\udf10",
    "avatarColor": "from-purple-500 to-indigo-600"
  },
  {
    "id": "u11",
    "name": "Karen Jackson",
    "username": "@karenjackson80",
    "avatar": "KJ",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Researcher",
    "department": "AI Research Lab",
    "bio": "Distributed systems, Kafka & Redis fan-out fanatic \u26a1",
    "avatarColor": "from-pink-500 to-rose-600"
  },
  {
    "id": "u12",
    "name": "Ashley Scott",
    "username": "@ashleyscott37",
    "avatar": "AS",
    "followersCount": 5,
    "followingCount": 5,
    "isVerified": false,
    "role": "DevOps Eng",
    "department": "Design Studio",
    "bio": "Visual systems & SVG interactive animation specialist \u2728",
    "avatarColor": "from-violet-500 to-purple-600"
  },
  {
    "id": "u13",
    "name": "Kimberly Green",
    "username": "@kimberlygreen65",
    "avatar": "KG",
    "followersCount": 2,
    "followingCount": 2,
    "isVerified": false,
    "role": "Member",
    "department": "Cloud & Systems",
    "bio": "Graph Neural Networks & community detection \ud83e\udde0",
    "avatarColor": "from-blue-500 to-cyan-600"
  },
  {
    "id": "u14",
    "name": "Maria Thompson",
    "username": "@mariathompson66",
    "avatar": "MT",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Influencer",
    "department": "Campus Community",
    "bio": "3rd Year CS Undergrad | Full-stack & algorithms lead \ud83d\ude80",
    "avatarColor": "from-amber-500 to-orange-600"
  },
  {
    "id": "u15",
    "name": "Justin Nelson",
    "username": "@justinnelson39",
    "avatar": "JN",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Tech Lead",
    "department": "Computer Science",
    "bio": "Cloud infrastructure, Kubernetes & resilience \ud83d\udee0\ufe0f",
    "avatarColor": "from-cyan-500 to-blue-600"
  },
  {
    "id": "u16",
    "name": "Nancy Davis",
    "username": "@nancydavis94",
    "avatar": "ND",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Designer",
    "department": "AI Research Lab",
    "bio": "Data structures, BFS traversal & graph optimization \ud83d\udcca",
    "avatarColor": "from-emerald-500 to-teal-600"
  },
  {
    "id": "u17",
    "name": "Jennifer Hall",
    "username": "@jenniferhall62",
    "avatar": "JH",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Student",
    "department": "Design Studio",
    "bio": "UI/UX design enthusiast & frontend developer \ud83c\udfa8",
    "avatarColor": "from-purple-500 to-indigo-600"
  },
  {
    "id": "u18",
    "name": "Lauren Green",
    "username": "@laurengreen78",
    "avatar": "LG",
    "followersCount": 2,
    "followingCount": 2,
    "isVerified": false,
    "role": "Researcher",
    "department": "Cloud & Systems",
    "bio": "Researching social network propagation dynamics \ud83d\udd2c",
    "avatarColor": "from-pink-500 to-rose-600"
  },
  {
    "id": "u19",
    "name": "Robert Brown",
    "username": "@robertbrown5",
    "avatar": "RB",
    "followersCount": 2,
    "followingCount": 2,
    "isVerified": false,
    "role": "DevOps Eng",
    "department": "Campus Community",
    "bio": "Open source contributor & backend engineer \ud83d\udcbb",
    "avatarColor": "from-violet-500 to-purple-600"
  },
  {
    "id": "u20",
    "name": "John Hall",
    "username": "@johnhall22",
    "avatar": "JH",
    "followersCount": 2,
    "followingCount": 2,
    "isVerified": false,
    "role": "Member",
    "department": "Computer Science",
    "bio": "Building large-scale graph notification engines \ud83c\udf10",
    "avatarColor": "from-blue-500 to-cyan-600"
  },
  {
    "id": "u21",
    "name": "Dorothy Lee",
    "username": "@dorothylee29",
    "avatar": "DL",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Influencer",
    "department": "AI Research Lab",
    "bio": "Distributed systems, Kafka & Redis fan-out fanatic \u26a1",
    "avatarColor": "from-amber-500 to-orange-600"
  },
  {
    "id": "u22",
    "name": "Robert Thompson",
    "username": "@robertthompson65",
    "avatar": "RT",
    "followersCount": 2,
    "followingCount": 2,
    "isVerified": false,
    "role": "Tech Lead",
    "department": "Design Studio",
    "bio": "Visual systems & SVG interactive animation specialist \u2728",
    "avatarColor": "from-cyan-500 to-blue-600"
  },
  {
    "id": "u23",
    "name": "Jessica Sanchez",
    "username": "@jessicasanchez61",
    "avatar": "JS",
    "followersCount": 5,
    "followingCount": 5,
    "isVerified": false,
    "role": "Designer",
    "department": "Cloud & Systems",
    "bio": "Graph Neural Networks & community detection \ud83e\udde0",
    "avatarColor": "from-emerald-500 to-teal-600"
  },
  {
    "id": "u24",
    "name": "Amanda Taylor",
    "username": "@amandataylor15",
    "avatar": "AT",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Student",
    "department": "Campus Community",
    "bio": "3rd Year CS Undergrad | Full-stack & algorithms lead \ud83d\ude80",
    "avatarColor": "from-purple-500 to-indigo-600"
  },
  {
    "id": "u25",
    "name": "Nancy Lopez",
    "username": "@nancylopez73",
    "avatar": "NL",
    "followersCount": 2,
    "followingCount": 2,
    "isVerified": false,
    "role": "Researcher",
    "department": "Computer Science",
    "bio": "Cloud infrastructure, Kubernetes & resilience \ud83d\udee0\ufe0f",
    "avatarColor": "from-pink-500 to-rose-600"
  },
  {
    "id": "u26",
    "name": "Sarah Nelson",
    "username": "@sarahnelson28",
    "avatar": "SN",
    "followersCount": 6,
    "followingCount": 6,
    "isVerified": false,
    "role": "DevOps Eng",
    "department": "AI Research Lab",
    "bio": "Data structures, BFS traversal & graph optimization \ud83d\udcca",
    "avatarColor": "from-violet-500 to-purple-600"
  },
  {
    "id": "u27",
    "name": "Jessica Rodriguez",
    "username": "@jessicarodriguez48",
    "avatar": "JR",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Member",
    "department": "Design Studio",
    "bio": "UI/UX design enthusiast & frontend developer \ud83c\udfa8",
    "avatarColor": "from-blue-500 to-cyan-600"
  },
  {
    "id": "u28",
    "name": "Ryan Walker",
    "username": "@ryanwalker40",
    "avatar": "RW",
    "followersCount": 4,
    "followingCount": 4,
    "isVerified": false,
    "role": "Influencer",
    "department": "Cloud & Systems",
    "bio": "Researching social network propagation dynamics \ud83d\udd2c",
    "avatarColor": "from-amber-500 to-orange-600"
  },
  {
    "id": "u29",
    "name": "David Williams",
    "username": "@davidwilliams61",
    "avatar": "DW",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Tech Lead",
    "department": "Campus Community",
    "bio": "Open source contributor & backend engineer \ud83d\udcbb",
    "avatarColor": "from-cyan-500 to-blue-600"
  },
  {
    "id": "u30",
    "name": "Angela Taylor",
    "username": "@angelataylor83",
    "avatar": "AT",
    "followersCount": 4,
    "followingCount": 4,
    "isVerified": false,
    "role": "Designer",
    "department": "Computer Science",
    "bio": "Building large-scale graph notification engines \ud83c\udf10",
    "avatarColor": "from-emerald-500 to-teal-600"
  },
  {
    "id": "u31",
    "name": "Jessica Robinson",
    "username": "@jessicarobinson67",
    "avatar": "JR",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Student",
    "department": "AI Research Lab",
    "bio": "Distributed systems, Kafka & Redis fan-out fanatic \u26a1",
    "avatarColor": "from-purple-500 to-indigo-600"
  },
  {
    "id": "u32",
    "name": "Kevin Moore",
    "username": "@kevinmoore81",
    "avatar": "KM",
    "followersCount": 5,
    "followingCount": 5,
    "isVerified": false,
    "role": "Researcher",
    "department": "Design Studio",
    "bio": "Visual systems & SVG interactive animation specialist \u2728",
    "avatarColor": "from-pink-500 to-rose-600"
  },
  {
    "id": "u33",
    "name": "Joseph Miller",
    "username": "@josephmiller49",
    "avatar": "JM",
    "followersCount": 4,
    "followingCount": 4,
    "isVerified": false,
    "role": "DevOps Eng",
    "department": "Cloud & Systems",
    "bio": "Graph Neural Networks & community detection \ud83e\udde0",
    "avatarColor": "from-violet-500 to-purple-600"
  },
  {
    "id": "u34",
    "name": "Helen Adams",
    "username": "@helenadams81",
    "avatar": "HA",
    "followersCount": 1,
    "followingCount": 1,
    "isVerified": false,
    "role": "Member",
    "department": "Campus Community",
    "bio": "3rd Year CS Undergrad | Full-stack & algorithms lead \ud83d\ude80",
    "avatarColor": "from-blue-500 to-cyan-600"
  },
  {
    "id": "u35",
    "name": "Chris Nelson",
    "username": "@chrisnelson74",
    "avatar": "CN",
    "followersCount": 1,
    "followingCount": 1,
    "isVerified": false,
    "role": "Influencer",
    "department": "Computer Science",
    "bio": "Cloud infrastructure, Kubernetes & resilience \ud83d\udee0\ufe0f",
    "avatarColor": "from-amber-500 to-orange-600"
  },
  {
    "id": "u36",
    "name": "Emily Lee",
    "username": "@emilylee72",
    "avatar": "EL",
    "followersCount": 0,
    "followingCount": 0,
    "isVerified": false,
    "role": "Tech Lead",
    "department": "AI Research Lab",
    "bio": "Data structures, BFS traversal & graph optimization \ud83d\udcca",
    "avatarColor": "from-cyan-500 to-blue-600"
  },
  {
    "id": "u37",
    "name": "Nancy Smith",
    "username": "@nancysmith71",
    "avatar": "NS",
    "followersCount": 1,
    "followingCount": 1,
    "isVerified": false,
    "role": "Designer",
    "department": "Design Studio",
    "bio": "UI/UX design enthusiast & frontend developer \ud83c\udfa8",
    "avatarColor": "from-emerald-500 to-teal-600"
  },
  {
    "id": "u38",
    "name": "Deborah Garcia",
    "username": "@deborahgarcia70",
    "avatar": "DG",
    "followersCount": 1,
    "followingCount": 1,
    "isVerified": false,
    "role": "Student",
    "department": "Cloud & Systems",
    "bio": "Researching social network propagation dynamics \ud83d\udd2c",
    "avatarColor": "from-purple-500 to-indigo-600"
  },
  {
    "id": "u39",
    "name": "Thomas Anderson",
    "username": "@thomasanderson35",
    "avatar": "TA",
    "followersCount": 2,
    "followingCount": 2,
    "isVerified": false,
    "role": "Researcher",
    "department": "Campus Community",
    "bio": "Open source contributor & backend engineer \ud83d\udcbb",
    "avatarColor": "from-pink-500 to-rose-600"
  },
  {
    "id": "u40",
    "name": "Alex Hernandez",
    "username": "@alexhernandez96",
    "avatar": "AH",
    "followersCount": 2,
    "followingCount": 2,
    "isVerified": false,
    "role": "DevOps Eng",
    "department": "Computer Science",
    "bio": "Building large-scale graph notification engines \ud83c\udf10",
    "avatarColor": "from-violet-500 to-purple-600"
  },
  {
    "id": "u41",
    "name": "Kimberly Thomas",
    "username": "@kimberlythomas23",
    "avatar": "KT",
    "followersCount": 0,
    "followingCount": 0,
    "isVerified": false,
    "role": "Member",
    "department": "AI Research Lab",
    "bio": "Distributed systems, Kafka & Redis fan-out fanatic \u26a1",
    "avatarColor": "from-blue-500 to-cyan-600"
  },
  {
    "id": "u42",
    "name": "Thomas Brown",
    "username": "@thomasbrown27",
    "avatar": "TB",
    "followersCount": 3,
    "followingCount": 3,
    "isVerified": false,
    "role": "Influencer",
    "department": "Design Studio",
    "bio": "Visual systems & SVG interactive animation specialist \u2728",
    "avatarColor": "from-amber-500 to-orange-600"
  },
  {
    "id": "u43",
    "name": "Susan Jones",
    "username": "@susanjones68",
    "avatar": "SJ",
    "followersCount": 1,
    "followingCount": 1,
    "isVerified": false,
    "role": "Tech Lead",
    "department": "Cloud & Systems",
    "bio": "Graph Neural Networks & community detection \ud83e\udde0",
    "avatarColor": "from-cyan-500 to-blue-600"
  },
  {
    "id": "u44",
    "name": "Sarah King",
    "username": "@sarahking15",
    "avatar": "SK",
    "followersCount": 1,
    "followingCount": 1,
    "isVerified": false,
    "role": "Designer",
    "department": "Campus Community",
    "bio": "3rd Year CS Undergrad | Full-stack & algorithms lead \ud83d\ude80",
    "avatarColor": "from-emerald-500 to-teal-600"
  },
  {
    "id": "u45",
    "name": "Susan Hall",
    "username": "@susanhall22",
    "avatar": "SH",
    "followersCount": 1,
    "followingCount": 1,
    "isVerified": false,
    "role": "Student",
    "department": "Computer Science",
    "bio": "Cloud infrastructure, Kubernetes & resilience \ud83d\udee0\ufe0f",
    "avatarColor": "from-purple-500 to-indigo-600"
  },
  {
    "id": "u46",
    "name": "Matt Thompson",
    "username": "@mattthompson40",
    "avatar": "MT",
    "followersCount": 0,
    "followingCount": 0,
    "isVerified": false,
    "role": "Researcher",
    "department": "AI Research Lab",
    "bio": "Data structures, BFS traversal & graph optimization \ud83d\udcca",
    "avatarColor": "from-pink-500 to-rose-600"
  },
  {
    "id": "u47",
    "name": "Joseph Wright",
    "username": "@josephwright13",
    "avatar": "JW",
    "followersCount": 1,
    "followingCount": 1,
    "isVerified": false,
    "role": "DevOps Eng",
    "department": "Design Studio",
    "bio": "UI/UX design enthusiast & frontend developer \ud83c\udfa8",
    "avatarColor": "from-violet-500 to-purple-600"
  },
  {
    "id": "u48",
    "name": "Chris Johnson",
    "username": "@chrisjohnson85",
    "avatar": "CJ",
    "followersCount": 1,
    "followingCount": 1,
    "isVerified": false,
    "role": "Member",
    "department": "Cloud & Systems",
    "bio": "Researching social network propagation dynamics \ud83d\udd2c",
    "avatarColor": "from-blue-500 to-cyan-600"
  },
  {
    "id": "u49",
    "name": "Daniel Brown",
    "username": "@danielbrown33",
    "avatar": "DB",
    "followersCount": 0,
    "followingCount": 0,
    "isVerified": false,
    "role": "Influencer",
    "department": "Campus Community",
    "bio": "Open source contributor & backend engineer \ud83d\udcbb",
    "avatarColor": "from-amber-500 to-orange-600"
  }
];

export const edges: Edge[] = [
  {
    "id": "e000",
    "source": "u00",
    "target": "u01",
    "type": "connection"
  },
  {
    "id": "e001",
    "source": "u00",
    "target": "u03",
    "type": "connection"
  },
  {
    "id": "e002",
    "source": "u00",
    "target": "u04",
    "type": "connection"
  },
  {
    "id": "e003",
    "source": "u00",
    "target": "u05",
    "type": "connection"
  },
  {
    "id": "e004",
    "source": "u01",
    "target": "u02",
    "type": "connection"
  },
  {
    "id": "e005",
    "source": "u01",
    "target": "u05",
    "type": "connection"
  },
  {
    "id": "e006",
    "source": "u01",
    "target": "u06",
    "type": "connection"
  },
  {
    "id": "e007",
    "source": "u02",
    "target": "u03",
    "type": "connection"
  },
  {
    "id": "e008",
    "source": "u02",
    "target": "u04",
    "type": "connection"
  },
  {
    "id": "e009",
    "source": "u02",
    "target": "u05",
    "type": "connection"
  },
  {
    "id": "e010",
    "source": "u02",
    "target": "u06",
    "type": "connection"
  },
  {
    "id": "e011",
    "source": "u03",
    "target": "u04",
    "type": "connection"
  },
  {
    "id": "e012",
    "source": "u03",
    "target": "u05",
    "type": "connection"
  },
  {
    "id": "e013",
    "source": "u04",
    "target": "u05",
    "type": "connection"
  },
  {
    "id": "e014",
    "source": "u06",
    "target": "u07",
    "type": "connection"
  },
  {
    "id": "e015",
    "source": "u02",
    "target": "u07",
    "type": "connection"
  },
  {
    "id": "e016",
    "source": "u07",
    "target": "u37",
    "type": "connection"
  },
  {
    "id": "e017",
    "source": "u06",
    "target": "u08",
    "type": "connection"
  },
  {
    "id": "e018",
    "source": "u04",
    "target": "u08",
    "type": "connection"
  },
  {
    "id": "e019",
    "source": "u08",
    "target": "u44",
    "type": "connection"
  },
  {
    "id": "e020",
    "source": "u03",
    "target": "u09",
    "type": "connection"
  },
  {
    "id": "e021",
    "source": "u04",
    "target": "u09",
    "type": "connection"
  },
  {
    "id": "e022",
    "source": "u09",
    "target": "u23",
    "type": "connection"
  },
  {
    "id": "e023",
    "source": "u03",
    "target": "u10",
    "type": "connection"
  },
  {
    "id": "e024",
    "source": "u01",
    "target": "u10",
    "type": "connection"
  },
  {
    "id": "e025",
    "source": "u10",
    "target": "u40",
    "type": "connection"
  },
  {
    "id": "e026",
    "source": "u08",
    "target": "u10",
    "type": "connection"
  },
  {
    "id": "e027",
    "source": "u02",
    "target": "u11",
    "type": "connection"
  },
  {
    "id": "e028",
    "source": "u11",
    "target": "u17",
    "type": "connection"
  },
  {
    "id": "e029",
    "source": "u11",
    "target": "u43",
    "type": "connection"
  },
  {
    "id": "e030",
    "source": "u02",
    "target": "u12",
    "type": "connection"
  },
  {
    "id": "e031",
    "source": "u00",
    "target": "u12",
    "type": "connection"
  },
  {
    "id": "e032",
    "source": "u12",
    "target": "u32",
    "type": "connection"
  },
  {
    "id": "e033",
    "source": "u12",
    "target": "u42",
    "type": "connection"
  },
  {
    "id": "e034",
    "source": "u05",
    "target": "u13",
    "type": "connection"
  },
  {
    "id": "e035",
    "source": "u13",
    "target": "u42",
    "type": "connection"
  },
  {
    "id": "e036",
    "source": "u02",
    "target": "u14",
    "type": "connection"
  },
  {
    "id": "e037",
    "source": "u14",
    "target": "u29",
    "type": "connection"
  },
  {
    "id": "e038",
    "source": "u14",
    "target": "u28",
    "type": "connection"
  },
  {
    "id": "e039",
    "source": "u06",
    "target": "u15",
    "type": "connection"
  },
  {
    "id": "e040",
    "source": "u15",
    "target": "u28",
    "type": "connection"
  },
  {
    "id": "e041",
    "source": "u06",
    "target": "u16",
    "type": "connection"
  },
  {
    "id": "e042",
    "source": "u16",
    "target": "u42",
    "type": "connection"
  },
  {
    "id": "e043",
    "source": "u04",
    "target": "u17",
    "type": "connection"
  },
  {
    "id": "e044",
    "source": "u17",
    "target": "u26",
    "type": "connection"
  },
  {
    "id": "e045",
    "source": "u04",
    "target": "u18",
    "type": "connection"
  },
  {
    "id": "e046",
    "source": "u18",
    "target": "u23",
    "type": "connection"
  },
  {
    "id": "e047",
    "source": "u00",
    "target": "u19",
    "type": "connection"
  },
  {
    "id": "e048",
    "source": "u19",
    "target": "u21",
    "type": "connection"
  },
  {
    "id": "e049",
    "source": "u05",
    "target": "u20",
    "type": "connection"
  },
  {
    "id": "e050",
    "source": "u15",
    "target": "u20",
    "type": "connection"
  },
  {
    "id": "e051",
    "source": "u01",
    "target": "u21",
    "type": "connection"
  },
  {
    "id": "e052",
    "source": "u08",
    "target": "u21",
    "type": "connection"
  },
  {
    "id": "e053",
    "source": "u05",
    "target": "u22",
    "type": "connection"
  },
  {
    "id": "e054",
    "source": "u12",
    "target": "u22",
    "type": "connection"
  },
  {
    "id": "e055",
    "source": "u03",
    "target": "u23",
    "type": "connection"
  },
  {
    "id": "e056",
    "source": "u23",
    "target": "u26",
    "type": "connection"
  },
  {
    "id": "e057",
    "source": "u00",
    "target": "u24",
    "type": "connection"
  },
  {
    "id": "e058",
    "source": "u24",
    "target": "u48",
    "type": "connection"
  },
  {
    "id": "e059",
    "source": "u24",
    "target": "u38",
    "type": "connection"
  },
  {
    "id": "e060",
    "source": "u04",
    "target": "u25",
    "type": "connection"
  },
  {
    "id": "e061",
    "source": "u25",
    "target": "u39",
    "type": "connection"
  },
  {
    "id": "e062",
    "source": "u05",
    "target": "u26",
    "type": "connection"
  },
  {
    "id": "e063",
    "source": "u01",
    "target": "u26",
    "type": "connection"
  },
  {
    "id": "e064",
    "source": "u16",
    "target": "u26",
    "type": "connection"
  },
  {
    "id": "e065",
    "source": "u26",
    "target": "u30",
    "type": "connection"
  },
  {
    "id": "e066",
    "source": "u02",
    "target": "u27",
    "type": "connection"
  },
  {
    "id": "e067",
    "source": "u07",
    "target": "u27",
    "type": "connection"
  },
  {
    "id": "e068",
    "source": "u27",
    "target": "u33",
    "type": "connection"
  },
  {
    "id": "e069",
    "source": "u05",
    "target": "u28",
    "type": "connection"
  },
  {
    "id": "e070",
    "source": "u28",
    "target": "u45",
    "type": "connection"
  },
  {
    "id": "e071",
    "source": "u06",
    "target": "u29",
    "type": "connection"
  },
  {
    "id": "e072",
    "source": "u29",
    "target": "u33",
    "type": "connection"
  },
  {
    "id": "e073",
    "source": "u03",
    "target": "u30",
    "type": "connection"
  },
  {
    "id": "e074",
    "source": "u08",
    "target": "u30",
    "type": "connection"
  },
  {
    "id": "e075",
    "source": "u30",
    "target": "u47",
    "type": "connection"
  },
  {
    "id": "e076",
    "source": "u03",
    "target": "u31",
    "type": "connection"
  },
  {
    "id": "e077",
    "source": "u01",
    "target": "u31",
    "type": "connection"
  },
  {
    "id": "e078",
    "source": "u23",
    "target": "u31",
    "type": "connection"
  },
  {
    "id": "e079",
    "source": "u05",
    "target": "u32",
    "type": "connection"
  },
  {
    "id": "e080",
    "source": "u00",
    "target": "u32",
    "type": "connection"
  },
  {
    "id": "e081",
    "source": "u32",
    "target": "u39",
    "type": "connection"
  },
  {
    "id": "e082",
    "source": "u32",
    "target": "u35",
    "type": "connection"
  },
  {
    "id": "e083",
    "source": "u01",
    "target": "u33",
    "type": "connection"
  },
  {
    "id": "e084",
    "source": "u33",
    "target": "u40",
    "type": "connection"
  },
  {
    "id": "e085",
    "source": "u03",
    "target": "u34",
    "type": "connection"
  }
];
