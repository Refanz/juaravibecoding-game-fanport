// ==========================================
// Level Maps & Quiz Data
// ==========================================

// Tile legend: 0=floor, 1=wall, 2=desk, 3=serverRack, 4=plant, 5=carpet, 6=chair
const TILE_TYPES = {
    FLOOR: 0, WALL: 1, DESK: 2, RACK: 3, PLANT: 4, CARPET: 5, CHAIR: 6
};

const SOLID_TILES = [1, 2, 3, 4];

// Level 1: The Power Issue - Small office
const MAP_1 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,5,5,5,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,5,5,5,0,2,0,1,0,2,0,0,2,0,0,1],
    [1,5,5,5,0,6,0,0,0,6,0,0,6,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,4,0,0,0,4,0,0,0,2,0,1],
    [1,0,6,0,0,0,0,0,0,0,0,0,0,6,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,6,0,0,0,0,0,0,0,0,0,6,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Level 2: The Router Down - Server room
const MAP_2 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,3,0,0,0,1,0,0,3,0,0,0,0,0,1],
    [1,0,0,0,3,0,0,0,1,0,0,3,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,1],
    [1,3,3,0,0,0,3,3,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,1],
    [1,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,3,3,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,3,3,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Level 3: The Virus Outbreak - Open office
const MAP_3 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,5,5,0,0,0,0,0,0,0,0,0,0,0,5,5,5,1],
    [1,5,5,0,2,0,0,2,0,0,2,0,0,0,5,5,5,1],
    [1,0,0,0,6,0,0,6,0,0,6,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,1],
    [1,0,2,0,0,4,0,0,0,4,0,0,2,0,0,2,0,1],
    [1,0,6,0,0,0,0,0,0,0,0,0,6,0,0,6,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,0,2,0,0,2,0,0,0,0,2,0,0,1],
    [1,0,6,0,0,0,6,0,0,6,0,0,0,0,6,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const LEVELS = [
    {
        name: "The Power Issue",
        icon: "💻",
        description: "Cari komputer yang mati dan nyalakan!",
        map: MAP_1,
        playerStart: { x: 2, y: 2 },
        objects: [
            { x: 12, y: 8, type: "computer", emoji: "💻", label: "PC Mati" }
        ],
        quizzes: [
            {
                icon: "💻",
                title: "Komputer Mati!",
                question: "Layar komputer ini blank dan tidak menyala sama sekali. Apa yang harus dicek pertama kali?",
                options: [
                    "A. Cek kabel power & pastikan terhubung",
                    "B. Langsung beli komputer baru",
                    "C. Restart Windows",
                    "D. Update driver grafis"
                ],
                correct: 0,
                successMsg: "Benar! Cek kabel power adalah langkah pertama yang paling dasar! ✅",
                failMsg: "Kurang tepat! Langkah pertama adalah cek kabel power. 🔌"
            }
        ],
        timer: 0,
        objective: "🔎 Cari komputer yang mati!"
    },
    {
        name: "The Router Down",
        icon: "📡",
        description: "Cari router rusak di ruang server!",
        map: MAP_2,
        playerStart: { x: 1, y: 1 },
        objects: [
            { x: 15, y: 9, type: "router", emoji: "📡", label: "Router Error" }
        ],
        quizzes: [
            {
                icon: "📡",
                title: "Router Error!",
                question: "Internet kantor mati total. Router menunjukkan lampu merah berkedip. Apa langkah pertama yang harus dilakukan?",
                options: [
                    "A. Format ulang server",
                    "B. Restart router (cabut power, tunggu 30 detik, colok lagi)",
                    "C. Langsung hubungi ISP",
                    "D. Ganti semua kabel LAN"
                ],
                correct: 1,
                successMsg: "Benar! Restart router adalah troubleshooting paling dasar! 📡✅",
                failMsg: "Kurang tepat! Restart router dulu sebelum langkah lain. 🔄"
            }
        ],
        timer: 0,
        objective: "🔎 Cari router yang rusak di ruang server!"
    },
    {
        name: "The Virus Outbreak",
        icon: "🦠",
        description: "Karantina 3 PC terinfeksi sebelum waktu habis!",
        map: MAP_3,
        playerStart: { x: 1, y: 1 },
        objects: [
            { x: 4, y: 2, type: "virus", emoji: "🦠", label: "PC Infected" },
            { x: 10, y: 5, type: "virus", emoji: "🦠", label: "PC Infected" },
            { x: 14, y: 8, type: "virus", emoji: "🦠", label: "PC Infected" }
        ],
        quizzes: [
            {
                icon: "🦠",
                title: "Virus Terdeteksi!",
                question: "PC ini menampilkan pop-up aneh terus-menerus dan sangat lambat. Apa yang harus dilakukan?",
                options: [
                    "A. Scan dengan antivirus & hapus malware",
                    "B. Matikan monitor saja",
                    "C. Biarkan, nanti juga hilang",
                    "D. Install lebih banyak RAM"
                ],
                correct: 0,
                successMsg: "Benar! Scan antivirus adalah langkah utama! 🛡️",
                failMsg: "Salah! Harus scan antivirus dulu. 🛡️"
            },
            {
                icon: "🔒",
                title: "Ransomware Alert!",
                question: "File-file penting di PC ini terenkripsi ransomware! Apa langkah darurat pertama?",
                options: [
                    "A. Bayar tebusan ke hacker",
                    "B. Format seluruh hard drive",
                    "C. Isolasi PC dari jaringan segera",
                    "D. Matikan seluruh listrik kantor"
                ],
                correct: 2,
                successMsg: "Benar! Isolasi dari jaringan mencegah penyebaran! 🔒✅",
                failMsg: "Kurang tepat! Isolasi jaringan dulu agar tidak menyebar! 🌐"
            },
            {
                icon: "🌐",
                title: "Browser Hijacked!",
                question: "Browser PC ini membuka website aneh secara otomatis. Solusinya?",
                options: [
                    "A. Ganti browser saja",
                    "B. Hapus ekstensi mencurigakan & scan malware",
                    "C. Reset password email",
                    "D. Install ulang Windows"
                ],
                correct: 1,
                successMsg: "Benar! Hapus ekstensi berbahaya & scan malware! 🧹✅",
                failMsg: "Kurang tepat! Cek ekstensi browser & scan malware dulu. 🧹"
            }
        ],
        timer: 90,
        objective: "🦠 Karantina 3 PC terinfeksi! (Batas waktu!)"
    }
];
