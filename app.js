/* ═══════════════════════════════════════════
   AJOLOTES DE MATEO — JavaScript
   ═══════════════════════════════════════════ */

// ─── LIKES & VISITAS ────────────────────────

const COUNTER_NAMESPACE = 'ajolotes-mateo-web';

async function initCounters() {
    // --- VISITAS (1 por dispositivo) ---
    const yaVisitado = localStorage.getItem('ajolotes-visitado');
    if (!yaVisitado) {
        localStorage.setItem('ajolotes-visitado', '1');
        try {
            const res = await fetch(`https://counterapi.dev/api/${COUNTER_NAMESPACE}/views/up`, { method: 'GET' });
            const data = await res.json();
            document.getElementById('viewCount').textContent = data.count || 0;
        } catch (e) {
            document.getElementById('viewCount').textContent = '1';
        }
    } else {
        try {
            const res = await fetch(`https://counterapi.dev/api/${COUNTER_NAMESPACE}/views`);
            const data = await res.json();
            document.getElementById('viewCount').textContent = data.count || 0;
        } catch (e) {
            document.getElementById('viewCount').textContent = '-';
        }
    }

    // --- LIKES (1 por dispositivo) ---
    try {
        const res = await fetch(`https://counterapi.dev/api/${COUNTER_NAMESPACE}/likes`);
        const data = await res.json();
        document.getElementById('likeCount').textContent = data.count || 0;
    } catch (e) {
        document.getElementById('likeCount').textContent = '0';
    }

    if (localStorage.getItem('ajolotes-liked') === '1') {
        document.getElementById('likeBtn').classList.add('liked');
        document.getElementById('likeIcon').textContent = '❤️';
    }
}

async function toggleLike() {
    const btn = document.getElementById('likeBtn');
    const icon = document.getElementById('likeIcon');
    const countEl = document.getElementById('likeCount');
    const hasLiked = localStorage.getItem('ajolotes-liked') === '1';

    // Solo 1 like por dispositivo — si ya dio like, no hace nada
    if (hasLiked) return;

    localStorage.setItem('ajolotes-liked', '1');
    btn.classList.add('liked');
    icon.textContent = '❤️';
    try {
        const res = await fetch(`https://counterapi.dev/api/${COUNTER_NAMESPACE}/likes/up`, { method: 'GET' });
        const data = await res.json();
        countEl.textContent = data.count || 0;
    } catch (e) {
        const c = parseInt(countEl.textContent || '0') + 1;
        countEl.textContent = c;
    }
}

// ─── COMENTARIOS ────────────────────────────

function getComments() {
    return JSON.parse(localStorage.getItem('ajolotes-comments') || '[]');
}

function saveComments(comments) {
    localStorage.setItem('ajolotes-comments', JSON.stringify(comments));
}

function addComment() {
    const nameEl = document.getElementById('commentName');
    const textEl = document.getElementById('commentText');
    const avatarEl = document.getElementById('commentAvatar');

    const name = nameEl.value.trim();
    const text = textEl.value.trim();
    const avatar = avatarEl.value;

    if (!name) { nameEl.focus(); return; }
    if (!text) { textEl.focus(); return; }

    const comment = {
        id: Date.now(),
        name,
        text,
        avatar,
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const comments = getComments();
    comments.unshift(comment);
    saveComments(comments);

    nameEl.value = '';
    textEl.value = '';
    renderComments();
}

function deleteComment(id) {
    const comments = getComments().filter(c => c.id !== id);
    saveComments(comments);
    renderComments();
}

function renderComments() {
    const list = document.getElementById('commentsList');
    const comments = getComments();

    if (comments.length === 0) {
        list.innerHTML = `
            <div class="comments-empty">
                <div class="comments-empty-icon">💬</div>
                <p>¡Sé el primero en dejar un comentario!</p>
            </div>`;
        return;
    }

    list.innerHTML = comments.map(c => `
        <div class="comment-card">
            <div class="comment-header">
                <div class="comment-avatar">${c.avatar}</div>
                <div>
                    <div class="comment-author">${c.name}</div>
                    <div class="comment-date">${c.date}</div>
                </div>
            </div>
            <div class="comment-body">${c.text}</div>
            <button class="comment-delete" onclick="deleteComment(${c.id})" title="Borrar">✕</button>
        </div>
    `).join('');
}

// ─── AXOLOTL DATA ───────────────────────────

const axolotlTypes = {
    silvestre: {
        name: "Ajolote Silvestre",
        scientific: "Ambystoma mexicanum (tipo salvaje)",
        emoji: "🌿",
        color: "#4a7c59",
        gradient: "linear-gradient(135deg, #4a7c59, #6db380)",
        photos: [
            { url: "img/silvestre_1.jpg", caption: "Ajolote silvestre con su color marrón verdoso natural" },
            { url: "img/silvestre_2.jpg", caption: "Vista lateral mostrando las manchas oscuras características" }
        ],
        appearance: "Color marrón verdoso con manchas oscuras. Es el color original que tienen en la naturaleza, perfecto para camuflarse entre las plantas y el fondo del lago.",
        rarity: "Es el tipo más difícil de encontrar en cautividad, ya que los criadores prefieren los colores más llamativos. En la naturaleza, era el más común.",
        personality: "Son los más tímidos y reservados. Les encanta esconderse entre las plantas y rocas. Son más activos por la noche.",
        diet: "En la naturaleza comen pequeños peces, larvas de insectos, gusanos y crustáceos. En cautividad se les puede dar pellets especiales y lombrices.",
        size: "Entre 15 y 30 cm de largo. Los machos suelen ser más delgados y las hembras más rechonchas.",
        funFact: "¡El color silvestre les permite ser casi invisibles en el fondo del Lago de Xochimilco! Es su camuflaje natural."
    },
    leucistico: {
        name: "Ajolote Leucístico",
        scientific: "Ambystoma mexicanum (leucístico)",
        emoji: "🩷",
        color: "#f8a4c8",
        gradient: "linear-gradient(135deg, #f8a4c8, #fce4ec)",
        photos: [
            { url: "img/rosado_1.jpg", caption: "Ajolote leucístico rosado con sus branquias plumosas" },
            { url: "img/dorado_1.jpg", caption: "Pareja de leucísticos blancos en su acuario" }
        ],
        appearance: "Cuerpo blanco rosado con branquias de color rosa intenso. Sus ojos son oscuros (a diferencia de los albinos). Es el ajolote más reconocible y popular.",
        rarity: "Es el más común en cautividad y el favorito de los fans de ajolotes. Cuando piensas en un ajolote, ¡probablemente piensas en este!",
        personality: "Son bastante sociables y curiosos. Les gusta explorar su acuario y a menudo 'saludan' a sus dueños acercándose al cristal.",
        diet: "Comen lo mismo que los demás: gusanos, pellets de ajolote, pequeños trozos de pescado y camarones. ¡Les encantan las lombrices!",
        size: "Pueden llegar a medir hasta 30 cm. Son de tamaño medio-grande entre las variedades.",
        funFact: "Su color rosado viene de los vasos sanguíneos que se ven a través de su piel translúcida. ¡Literalmente puedes ver la sangre corriendo bajo su piel!"
    },
    albino: {
        name: "Ajolote Albino",
        scientific: "Ambystoma mexicanum (albino)",
        emoji: "⭐",
        color: "#ffd700",
        gradient: "linear-gradient(135deg, #ffd700, #fff8dc)",
        photos: [
            { url: "img/variedades.jpg", caption: "El albino blanco (tercero) se distingue por sus ojos rojos" },
            { url: "img/albino_2.jpg", caption: "Primer plano de ajolote albino con sus ojos claros característicos" }
        ],
        appearance: "Cuerpo blanco dorado con branquias rosadas o rojizas. Lo que les diferencia del leucístico son sus ojos: ¡son rojos o rosados! Esto es porque no tienen melanina.",
        rarity: "Relativamente común en cautividad. Son muy apreciados por su aspecto único y sus ojos especiales.",
        personality: "Son un poco más sensibles a la luz que otros ajolotes por sus ojos claros. Prefieren zonas con sombra en su acuario.",
        diet: "Igual que los demás, pero hay que tener cuidado de no alimentarlos con luz muy intensa, ya que sus ojos sensibles les pueden dificultar encontrar la comida.",
        size: "Tamaño similar al leucístico: entre 15 y 30 cm. Pueden ser ligeramente más pequeños.",
        funFact: "Sus ojos rojos no son un defecto: ¡es porque puedes ver directamente los vasos sanguíneos de sus retinas al no tener pigmento que los oculte!"
    },
    melanico: {
        name: "Ajolote Melánico",
        scientific: "Ambystoma mexicanum (melánico)",
        emoji: "🖤",
        color: "#2d2d44",
        gradient: "linear-gradient(135deg, #2d2d44, #4a4a6a)",
        photos: [
            { url: "img/melanico_1.jpg", caption: "Ajolote melánico completamente negro" },
            { url: "img/melanico_2.jpg", caption: "Melánico super negro: la variante más oscura" }
        ],
        appearance: "Completamente negro o gris muy oscuro, incluyendo las branquias, ojos y vientre. Son como el 'modo oscuro' de los ajolotes. ¡Elegantísimos!",
        rarity: "Menos común que los leucísticos y albinos. Son muy buscados por coleccionistas debido a su aspecto único y misterioso.",
        personality: "Son los más tranquilos y pacíficos. Les gusta reposar en el fondo y moverse lentamente. Son como los 'filósofos' del mundo ajolote.",
        diet: "La misma dieta que los demás. Su color oscuro les ayuda a cazar mejor por la noche, ya que se camuflan perfectamente en la oscuridad.",
        size: "Pueden ser los más grandes de todas las variedades, llegando a medir hasta 35 cm en algunos casos.",
        funFact: "¡Son tan oscuros que a veces parece que se 'desaparecen' cuando las luces están bajas! En la naturaleza serían depredadores nocturnos perfectos."
    },
    golden: {
        name: "Ajolote Golden (Dorado)",
        scientific: "Ambystoma mexicanum (golden albino)",
        emoji: "✨",
        color: "#e8a317",
        gradient: "linear-gradient(135deg, #e8a317, #f7d794)",
        photos: [
            { url: "img/albino_2.jpg", caption: "Ajolote golden albino con su tono amarillento y ojos claros" },
            { url: "img/tres_colores.jpg", caption: "El ajolote dorado (abajo) junto a leucísticos" }
        ],
        appearance: "Color dorado brillante, como si estuvieran hechos de oro líquido. Sus ojos son claros (dorados o rosados) y sus branquias tienen un tono anaranjado precioso.",
        rarity: "Bastante raro. Es una variación del albino con más pigmento amarillo. ¡Encontrar uno es como encontrar un tesoro!",
        personality: "Son activos y juguetones. Les gusta nadar por todo el acuario y son bastante curiosos con los objetos nuevos que se ponen en su entorno.",
        diet: "Comen lo mismo que los demás ajolotes. Les gustan especialmente los bloodworms (gusanos de sangre) que combinan con su color dorado.",
        size: "Tamaño estándar de 15-30 cm. Su color dorado los hace parecer más grandes de lo que son.",
        funFact: "En algunas culturas, tener un ajolote dorado se considera señal de buena suerte. ¡Como tener un pez dorado, pero mil veces más cool!"
    },
    copper: {
        name: "Ajolote Copper (Cobrizo)",
        scientific: "Ambystoma mexicanum (copper)",
        emoji: "🟤",
        color: "#b87333",
        gradient: "linear-gradient(135deg, #b87333, #d4a574)",
        photos: [
            { url: "img/cobre_1.jpg", caption: "Ajolote cobrizo con ojos ámbar y manchas amarillentas" },
            { url: "img/leopardo_1.jpg", caption: "Tonos cobrizos y dorados en un ajolote con manchas" }
        ],
        appearance: "Color cobrizo o marrón claro con reflejos metálicos. Sus ojos suelen ser de un tono ámbar o cobrizo. Las branquias son de un tono rosado-marrón.",
        rarity: "Relativamente raro. Es una variante genética que produce un pigmento cobrizo único. Cada uno tiene un tono ligeramente diferente.",
        personality: "Son moderadamente activos. Tienen un comportamiento intermedio entre los tímidos silvestres y los curiosos leucísticos.",
        diet: "Dieta estándar de ajolote. Son buenos comedores y no suelen ser exigentes con la comida.",
        size: "Tamaño medio de 20-28 cm. Son proporcionados y elegantes.",
        funFact: "Su color cobrizo puede cambiar ligeramente de intensidad dependiendo de la temperatura del agua y de su alimentación. ¡Es como un termómetro viviente!"
    },
    gfp: {
        name: "Ajolote GFP (Fluorescente)",
        scientific: "Ambystoma mexicanum (GFP - Green Fluorescent Protein)",
        emoji: "💚",
        color: "#39ff14",
        gradient: "linear-gradient(135deg, #39ff14, #7fff00)",
        photos: [
            { url: "img/albino_1.jpg", caption: "Un ajolote GFP con luz normal parece blanco o leucístico" },
            { url: "img/variedades.jpg", caption: "Cualquier variedad puede portar el gen GFP fluorescente" }
        ],
        appearance: "Pueden parecer normales con luz normal, pero bajo luz ultravioleta (luz negra) ¡BRILLAN DE COLOR VERDE NEÓN! Es como tener un alien en tu acuario.",
        rarity: "Muy raro y especial. Solo se encuentran en laboratorios y criadores especializados. Tienen una proteína fluorescente inyectada genéticamente.",
        personality: "Se comportan exactamente igual que cualquier otro ajolote. La proteína fluorescente no afecta su comportamiento ni su salud.",
        diet: "Comen lo mismo que cualquier ajolote. La fluorescencia no tiene nada que ver con su alimentación.",
        size: "Tamaño normal de 15-30 cm. No hay diferencia de tamaño con otros ajolotes.",
        funFact: "La proteína GFP fue descubierta originalmente en medusas. Los científicos la usan para rastrear células y estudiar la regeneración. ¡Ciencia que brilla!"
    },
    mosaico: {
        name: "Ajolote Mosaico",
        scientific: "Ambystoma mexicanum (mosaico/quimera)",
        emoji: "🎭",
        color: "#8b5cf6",
        gradient: "linear-gradient(135deg, #8b5cf6, #c4b5fd)",
        photos: [
            { url: "img/mosaico_1.png", caption: "Ajolote mosaico con su patrón único de colores" },
            { url: "img/leopardo_1.jpg", caption: "Ajolote con patrón mosaico de manchas doradas" }
        ],
        appearance: "¡Mitad y mitad! Tienen zonas de diferentes colores en su cuerpo, como si fueran dos ajolotes fusionados en uno. Pueden ser mitad negro mitad blanco, o cualquier combinación.",
        rarity: "Extremadamente raro. Ocurre cuando dos embriones se fusionan durante el desarrollo. Es casi imposible criarlos a propósito.",
        personality: "Cada mosaico es único, tanto en apariencia como en personalidad. Son como obras de arte vivientes.",
        diet: "La misma dieta que los demás. No tienen necesidades especiales por su coloración única.",
        size: "Tamaño normal, entre 15 y 30 cm. A veces las dos mitades crecen a ritmos ligeramente diferentes.",
        funFact: "¡No existen dos ajolotes mosaico iguales! Cada uno tiene un patrón de colores completamente único, como una huella dactilar. Son los más exclusivos del mundo ajolote."
    },
    piebald: {
        name: "Ajolote Piebald",
        scientific: "Ambystoma mexicanum (piebald)",
        emoji: "🐄",
        color: "#607d8b",
        gradient: "linear-gradient(135deg, #607d8b, #90a4ae)",
        photos: [
            { url: "img/piebald_1.jpg", caption: "Ajolote piebald con manchas oscuras sobre piel clara" },
            { url: "img/silvestre_1.jpg", caption: "Patrón moteado típico de las variedades con manchas" }
        ],
        appearance: "Tienen un patrón de manchas oscuras sobre un cuerpo claro, como una vaca en miniatura acuática. Las manchas pueden ser negras, grises o marrones sobre fondo blanco o rosado.",
        rarity: "Bastante raro. Se produce por una combinación genética especial que afecta a la distribución de los melanocitos (células de pigmento).",
        personality: "Son curiosos y activos. Les gusta explorar cada rincón de su acuario. Cada uno tiene un temperamento único, como su patrón de manchas.",
        diet: "La misma dieta que los demás ajolotes: gusanos, pellets especiales, pequeños camarones y larvas de insectos.",
        size: "Tamaño estándar de 15-30 cm. Su patrón de manchas se va definiendo más a medida que crecen.",
        funFact: "¡Las manchas de un piebald son como un código de barras! Cada uno tiene un patrón completamente diferente que se puede usar para identificarlos."
    },
    lavanda: {
        name: "Ajolote Lavanda",
        scientific: "Ambystoma mexicanum (lavender)",
        emoji: "💜",
        color: "#9575cd",
        gradient: "linear-gradient(135deg, #9575cd, #ce93d8)",
        photos: [
            { url: "img/lavanda_1.jpg", caption: "Ajolote lavanda con su característico tono púrpura grisáceo" },
            { url: "img/cobre_1.jpg", caption: "Tonos claros con reflejos lavanda en las branquias" }
        ],
        appearance: "Tienen un color púrpura grisáceo muy especial, como el color de la flor de lavanda. Sus ojos suelen ser oscuros y sus branquias tienen tonos rojizos o morados.",
        rarity: "Muy raro. Es una de las variedades más difíciles de conseguir. Su color lavanda es el resultado de una combinación genética muy específica.",
        personality: "Son tranquilos y elegantes. Se mueven con gracia por el acuario y les gusta descansar en lugares elevados donde puedan observar todo.",
        diet: "Comen lo mismo que los demás. No tienen requerimientos especiales por su coloración.",
        size: "Tamaño medio de 20-28 cm. Su color lavanda se intensifica con la edad.",
        funFact: "¡Su color puede cambiar ligeramente según la luz! Con luz natural se ven más grisáceos, pero con luz artificial pueden parecer casi violetas."
    },
    firefly: {
        name: "Ajolote Firefly",
        scientific: "Ambystoma mexicanum (firefly)",
        emoji: "🔥",
        color: "#ff5722",
        gradient: "linear-gradient(135deg, #ff5722, #ffab91)",
        photos: [
            { url: "img/melanico_1.jpg", caption: "Cuerpo oscuro del firefly: melánico arriba, claro abajo" },
            { url: "img/tres_colores.jpg", caption: "Diferentes combinaciones de color en ajolotes" }
        ],
        appearance: "Son una mezcla sorprendente: tienen el cuerpo oscuro de un melánico, pero la cola clara de un leucístico. ¡Es como si la cola estuviera encendida como una luciérnaga!",
        rarity: "Extremadamente raro. Solo se crean en laboratorios especializados mediante el trasplante de tejido embrionario. ¡No existen en la naturaleza!",
        personality: "Se comportan como cualquier otro ajolote, pero su apariencia única los hace especialmente llamativos. Son como estrellas de rock del mundo ajolote.",
        diet: "La misma dieta que cualquier ajolote: gusanos, pellets y pequeños invertebrados.",
        size: "Tamaño normal de 15-30 cm. El contraste entre cuerpo oscuro y cola clara se mantiene toda la vida.",
        funFact: "¡Los firefly se crean trasplantando células de la cola de un embrión leucístico a un embrión melánico! Son literalmente dos ajolotes en uno."
    },
    enigma: {
        name: "Ajolote Enigma",
        scientific: "Ambystoma mexicanum (enigma)",
        emoji: "🌌",
        color: "#1a237e",
        gradient: "linear-gradient(135deg, #1a237e, #3f51b5)",
        photos: [
            { url: "img/melanico_2.jpg", caption: "Ajolote oscuro con tonos enigmáticos" },
            { url: "img/leopardo_1.jpg", caption: "Manchas doradas brillantes sobre fondo oscuro" }
        ],
        appearance: "Tienen un color base oscuro con manchas doradas o verdosas brillantes por todo el cuerpo, como si tuvieran estrellas en la piel. Sus ojos suelen ser claros, de un tono ámbar misterioso.",
        rarity: "Rarísimo. Es una de las variedades más nuevas y buscadas. Su genética todavía se está estudiando y cada ejemplar es diferente.",
        personality: "Son misteriosos y fascinantes. Suelen ser nocturnos y les encanta esconderse durante el día. ¡De noche se activan como pequeños exploradores!",
        diet: "Comen lo mismo que los demás ajolotes. Prefieren cazar en la oscuridad, como buenos enigmas que son.",
        size: "Tamaño similar al silvestre: 20-30 cm. Sus manchas brillantes se desarrollan más con la edad.",
        funFact: "¡Nadie sabe exactamente qué combinación genética produce el patrón enigma! Los científicos siguen investigando este misterio. ¡Por eso se llaman enigma!"
    }
};

// ─── CATEGORY DETAIL RENDER ─────────────────

let currentSlide = 0;
let currentType = '';
let slideInterval = null;

function renderCategory(type) {
    const data = axolotlTypes[type];
    const detail = document.getElementById('categoryDetail');
    currentType = type;
    currentSlide = 0;

    // Stop any existing auto-play
    if (slideInterval) clearInterval(slideInterval);
    
    detail.innerHTML = `
        <div style="animation: fadeSlideUp 0.4s ease">
            <div class="detail-top">
                <!-- SLIDESHOW -->
                <div class="slideshow" id="slideshow">
                    <div class="slideshow-track">
                        ${data.photos.map((photo, i) => `
                            <div class="slide ${i === 0 ? 'active' : ''}" data-index="${i}">
                                <img src="${photo.url}" alt="${photo.caption}" loading="lazy"/>
                            </div>
                        `).join('')}
                    </div>
                    <button class="slide-btn slide-prev" onclick="changeSlide(-1)">❮</button>
                    <button class="slide-btn slide-next" onclick="changeSlide(1)">❯</button>
                    <div class="slide-caption" id="slideCaption">${data.photos[0].caption}</div>
                    <div class="slide-dots">
                        ${data.photos.map((_, i) => `
                            <span class="slide-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></span>
                        `).join('')}
                    </div>
                    <div class="slide-counter">
                        <span id="slideNum">1</span> / ${data.photos.length}
                    </div>
                </div>

                <!-- HEADER INFO -->
                <div class="detail-header-side">
                    <div class="detail-avatar" style="background: ${data.gradient}">
                        ${data.emoji}
                    </div>
                    <h3 style="color: ${data.color}">${data.name}</h3>
                    <span class="scientific">${data.scientific}</span>
                </div>
            </div>

            <div class="detail-body">
                <div class="detail-field" style="border-left-color: ${data.color}">
                    <h4>🎨 Apariencia</h4>
                    <p>${data.appearance}</p>
                </div>
                <div class="detail-field" style="border-left-color: ${data.color}">
                    <h4>💎 Rareza</h4>
                    <p>${data.rarity}</p>
                </div>
                <div class="detail-field" style="border-left-color: ${data.color}">
                    <h4>😊 Personalidad</h4>
                    <p>${data.personality}</p>
                </div>
                <div class="detail-field" style="border-left-color: ${data.color}">
                    <h4>🍽️ Alimentación</h4>
                    <p>${data.diet}</p>
                </div>
                <div class="detail-field" style="border-left-color: ${data.color}">
                    <h4>📏 Tamaño</h4>
                    <p>${data.size}</p>
                </div>
                <div class="detail-field" style="border-left-color: ${data.color}">
                    <h4>🌟 Dato Curioso</h4>
                    <p>${data.funFact}</p>
                </div>
            </div>
        </div>
    `;

    // Auto-play slideshow every 4 seconds
    slideInterval = setInterval(() => changeSlide(1), 4000);
}

function changeSlide(direction) {
    const data = axolotlTypes[currentType];
    const total = data.photos.length;
    currentSlide = (currentSlide + direction + total) % total;
    updateSlide(data);
}

function goToSlide(index) {
    const data = axolotlTypes[currentType];
    currentSlide = index;
    updateSlide(data);
    // Reset auto-play timer
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => changeSlide(1), 4000);
}

function updateSlide(data) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    const caption = document.getElementById('slideCaption');
    const counter = document.getElementById('slideNum');

    slides.forEach((s, i) => {
        s.classList.toggle('active', i === currentSlide);
    });
    dots.forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
    });
    if (caption) caption.textContent = data.photos[currentSlide].caption;
    if (counter) counter.textContent = currentSlide + 1;
}

// ─── CATEGORY BUTTONS ───────────────────────

document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCategory(btn.dataset.type);
    });
});

// Init first category
renderCategory('silvestre');

// ─── MAP ────────────────────────────────────

function initMap() {
    const map = L.map('map').setView([19.27, -99.1], 3);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18
    }).addTo(map);

    // Custom icons
    function makeIcon(color) {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background: ${color};
                width: 24px; height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex; align-items: center; justify-content: center;
                font-size: 12px;
            ">🦎</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    }

    const redIcon = makeIcon('#ff4757');
    const greenIcon = makeIcon('#2ed573');
    const blueIcon = makeIcon('#1e90ff');

    // Natural habitat markers
    const naturalLocations = [
        { lat: 19.2726, lng: -99.1024, name: "Lago de Xochimilco", desc: "🏠 Hogar natural del ajolote mexicano. Sistema de canales con chinampas, declarado Patrimonio de la Humanidad por la UNESCO." },
        { lat: 19.3133, lng: -99.0917, name: "Lago de Chalco (histórico)", desc: "🏛️ Antiguo lago donde habitaban ajolotes. Hoy casi completamente seco por la urbanización de la Ciudad de México." },
        { lat: 19.56, lng: -99.29, name: "Lago de Zumpango", desc: "💧 Otras especies de Ambystoma habitan en lagos cercanos al Valle de México." }
    ];

    naturalLocations.forEach(loc => {
        L.marker([loc.lat, loc.lng], { icon: redIcon })
            .addTo(map)
            .bindPopup(`<div style="font-family:Quicksand,sans-serif;max-width:250px">
                <strong style="font-size:1.1em;color:#ff4757">${loc.name}</strong>
                <p style="margin-top:8px;line-height:1.5">${loc.desc}</p>
            </div>`);
    });

    // Conservation centers
    const conservationLocations = [
        { lat: 19.3262, lng: -99.1761, name: "CIBAC - Xochimilco", desc: "🏗️ Centro de Investigaciones Biológicas y Acuícolas de Cuemanco. Principal centro de cría y conservación del ajolote." },
        { lat: 19.3244, lng: -99.1781, name: "UAM Xochimilco", desc: "🎓 Universidad Autónoma Metropolitana. Laboratorio de Restauración Ecológica dedicado al ajolote." },
        { lat: 51.4545, lng: -2.6221, name: "Bristol Zoo (UK)", desc: "🇬🇧 Programa de cría en cautividad de ajolotes como parte de la conservación internacional." },
        { lat: 52.2297, lng: 21.0122, name: "Zoo de Varsovia (Polonia)", desc: "🇵🇱 Programa europeo de conservación de ajolotes en cautividad." },
        { lat: 48.1813, lng: 16.3127, name: "Haus des Meeres (Viena)", desc: "🇦🇹 Acuario con programa de exhibición y educación sobre ajolotes." }
    ];

    conservationLocations.forEach(loc => {
        L.marker([loc.lat, loc.lng], { icon: greenIcon })
            .addTo(map)
            .bindPopup(`<div style="font-family:Quicksand,sans-serif;max-width:250px">
                <strong style="font-size:1.1em;color:#2ed573">${loc.name}</strong>
                <p style="margin-top:8px;line-height:1.5">${loc.desc}</p>
            </div>`);
    });

    // Research labs
    const labLocations = [
        { lat: 40.4530, lng: -3.7326, name: "CSIC Madrid (España)", desc: "🇪🇸 Centro Superior de Investigaciones Científicas. Estudian la regeneración del ajolote para aplicaciones médicas." },
        { lat: 51.0504, lng: 13.7373, name: "MPI-CBG Dresden (Alemania)", desc: "🇩🇪 Instituto Max Planck. Uno de los centros más importantes del mundo en investigación de regeneración de ajolotes." },
        { lat: 38.6488, lng: -90.3108, name: "Ambystoma Genetic Stock Center (EEUU)", desc: "🇺🇸 Universidad de Kentucky → Univ. de Missouri. El mayor centro genético de ajolotes del mundo con más de 1000 ejemplares." },
        { lat: 35.6762, lng: 139.6503, name: "RIKEN (Japón)", desc: "🇯🇵 Instituto de investigación que estudia los mecanismos moleculares de la regeneración en ajolotes." }
    ];

    labLocations.forEach(loc => {
        L.marker([loc.lat, loc.lng], { icon: blueIcon })
            .addTo(map)
            .bindPopup(`<div style="font-family:Quicksand,sans-serif;max-width:250px">
                <strong style="font-size:1.1em;color:#1e90ff">${loc.name}</strong>
                <p style="margin-top:8px;line-height:1.5">${loc.desc}</p>
            </div>`);
    });

    // Highlight Xochimilco area
    L.circle([19.27, -99.10], {
        color: '#ff4757',
        fillColor: '#ff4757',
        fillOpacity: 0.08,
        radius: 8000,
        weight: 2,
        dashArray: '8, 8'
    }).addTo(map).bindPopup('<strong>Zona de Xochimilco</strong><br>Área natural del ajolote mexicano');
}

// ─── STREET VIEW ────────────────────────────

function openStreetView(btn, id) {
    const container = document.getElementById('sv-' + id);
    if (!container) return;
    const isOpen = container.classList.contains('sv-open');
    document.querySelectorAll('.sv-iframe-container').forEach(c => c.classList.remove('sv-open'));
    if (!isOpen) {
        container.classList.add('sv-open');
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function closeStreetView(id) {
    const container = document.getElementById('sv-' + id);
    if (container) container.classList.remove('sv-open');
}

function filterStreetView(category) {
    document.querySelectorAll('.sv-cat-btn').forEach(b => {
        b.classList.toggle('sv-cat-active', b.dataset.svcat === category);
    });
    document.querySelectorAll('.sv-card').forEach(card => {
        if (card.dataset.svcat === category) {
            card.classList.remove('sv-card-hidden');
        } else {
            card.classList.add('sv-card-hidden');
            card.querySelector('.sv-iframe-container')?.classList.remove('sv-open');
        }
    });
}

// ─── QUIZ MEGA ──────────────────────────────

const quizPhases = {
    facil: {
        name: "Principiante", emoji: "🌱", color: "#22c55e",
        description: "Preguntas sencillas para empezar",
        questionsPerRound: 8, minToPass: 5
    },
    medio: {
        name: "Explorador", emoji: "🔍", color: "#3b82f6",
        description: "Ya sabes bastante, ¡a por más!",
        questionsPerRound: 8, minToPass: 6
    },
    dificil: {
        name: "Experto", emoji: "🧠", color: "#f97316",
        description: "Solo para auténticos fans del ajolote",
        questionsPerRound: 8, minToPass: 6
    },
    maestro: {
        name: "Maestro Ajolote", emoji: "👑", color: "#8b5cf6",
        description: "¡El desafío final! Minijuegos variados",
        questionsPerRound: 10, minToPass: 7
    }
};

// type: "abc" | "truefalse" | "photo" | "match" | "speed" | "complete"
const allQuestions = {
    facil: [
        { type:"abc", q:"🦎 ¿Qué es un ajolote?", o:["Un pez","Un anfibio","Un reptil","Un mamífero"], c:1 },
        { type:"abc", q:"🗺️ ¿De dónde son originarios?", o:["Japón","Australia","México","España"], c:2 },
        { type:"abc", q:"🩷 ¿Cuál es el ajolote más popular?", o:["Melánico","Leucístico","Silvestre","GFP"], c:1 },
        { type:"abc", q:"🌿 ¿De qué color es el silvestre?", o:["Rosa","Marrón verdoso","Azul","Rojo"], c:1 },
        { type:"abc", q:"🖤 ¿Cómo es el ajolote melánico?", o:["Blanco","Rosa","Negro","Dorado"], c:2 },
        { type:"abc", q:"💧 ¿Dónde viven los ajolotes?", o:["En la tierra","En el agua","En los árboles","En el aire"], c:1 },
        { type:"abc", q:"🍽️ ¿Qué comen los ajolotes?", o:["Plantas","Gusanos y pequeños animales","Pizza","Frutas"], c:1 },
        { type:"abc", q:"😊 ¿Qué forma tiene la boca del ajolote?", o:["Triste","Sonrisa","Recta","No tiene boca"], c:1 },
        { type:"abc", q:"🎮 ¿En qué videojuego salen ajolotes?", o:["Fortnite","Minecraft","Mario Bros","Roblox"], c:1 },
        { type:"abc", q:"⭐ ¿Cómo son los ojos del ajolote albino?", o:["Negros","Azules","Rojos o rosados","Verdes"], c:2 },
        { type:"abc", q:"🌡️ ¿Qué agua prefieren?", o:["Muy caliente","Fresquita (14-20°C)","Helada","Hirviendo"], c:1 },
        { type:"abc", q:"✨ ¿Qué color tiene el ajolote Golden?", o:["Plateado","Dorado","Gris","Negro"], c:1 },
        { type:"abc", q:"📏 ¿Cuánto puede medir un ajolote?", o:["5 cm","15-30 cm","1 metro","50 cm"], c:1 },
        { type:"abc", q:"🥚 ¿Los ajolotes nacen de…?", o:["Huevos","Son vivíparos","Esporas","Semillas"], c:0 },
        { type:"abc", q:"🌙 ¿Cuándo son más activos?", o:["De día","De noche","Al mediodía","Siempre igual"], c:1 },
        { type:"truefalse", q:"Los ajolotes pueden regenerar partes de su cuerpo.", c:true },
        { type:"truefalse", q:"El ajolote es un tipo de pez.", c:false },
        { type:"truefalse", q:"Los ajolotes viven en México.", c:true },
        { type:"truefalse", q:"El ajolote leucístico es de color negro.", c:false },
        { type:"truefalse", q:"Los ajolotes respiran solo por branquias.", c:false },
        { type:"truefalse", q:"La palabra ajolote significa 'monstruo de agua'.", c:true },
        { type:"truefalse", q:"Los ajolotes pueden vivir fuera del agua.", c:false },
        { type:"truefalse", q:"Los ajolotes aparecen en Minecraft.", c:true },
        { type:"truefalse", q:"El ajolote albino tiene ojos oscuros.", c:false },
        { type:"truefalse", q:"Los ajolotes son anfibios.", c:true },
        { type:"photo", q:"¿Qué tipo de ajolote ves en la foto?", img:"img/rosado_1.jpg", o:["Melánico","Leucístico","Silvestre","Albino"], c:1 },
        { type:"photo", q:"¿Qué variedad es esta?", img:"img/melanico_2.jpg", o:["Leucístico","Golden","Melánico","Copper"], c:2 },
        { type:"photo", q:"¿Reconoces este tipo de ajolote?", img:"img/silvestre_1.jpg", o:["Albino","Silvestre","Lavanda","Piebald"], c:1 },
        { type:"photo", q:"¿Qué ajolote aparece en la imagen?", img:"img/piebald_1.jpg", o:["Mosaico","Enigma","Piebald","GFP"], c:2 },
        { type:"photo", q:"¿Qué tipo de ajolote es?", img:"img/mosaico_1.png", o:["Piebald","Mosaico","Firefly","Silvestre"], c:1 },
    ],
    medio: [
        { type:"abc", q:"🤔 ¿Qué significa 'ajolote' en náhuatl?", o:["Pez bonito","Monstruo de agua","Flor del lago","Animal mágico"], c:1 },
        { type:"abc", q:"🫁 ¿De cuántas formas respira un ajolote?", o:["1 (branquias)","2 (branquias y pulmones)","3 (branquias, pulmones y piel)","4 formas"], c:2 },
        { type:"abc", q:"💚 ¿Qué hace especial al ajolote GFP?", o:["Es el más grande","Brilla con luz UV","Vive fuera del agua","Cambia de color"], c:1 },
        { type:"abc", q:"🏠 ¿En qué lago viven en estado salvaje?", o:["Titicaca","Xochimilco","Chapala","Pátzcuaro"], c:1 },
        { type:"abc", q:"👀 ¿Qué diferencia al albino del leucístico?", o:["El tamaño","El color de los ojos","La cola","Nada"], c:1 },
        { type:"abc", q:"💵 ¿En qué billete mexicano aparece?", o:["20 pesos","50 pesos","100 pesos","500 pesos"], c:1 },
        { type:"abc", q:"🐄 ¿A qué se parece el patrón piebald?", o:["Tigre","Cebra","Vaca (manchas)","Leopardo"], c:2 },
        { type:"abc", q:"💜 ¿De qué color es el ajolote lavanda?", o:["Verde lima","Púrpura grisáceo","Rojo intenso","Azul"], c:1 },
        { type:"abc", q:"🍽️ ¿Cómo comen los ajolotes?", o:["Masticando","Aspirando como aspiradora","Filtrando","Mordiendo trozos"], c:1 },
        { type:"abc", q:"🥚 ¿Cuántos huevos pone una hembra?", o:["1-10","10-50","100-1000","Más de 5000"], c:2 },
        { type:"abc", q:"⏳ ¿Cuántos años viven en cautividad?", o:["1-2","3-5","10-15","Más de 50"], c:2 },
        { type:"abc", q:"🟤 ¿De qué color son los ojos del copper?", o:["Negros","Azules","Ámbar o cobrizos","Verdes"], c:2 },
        { type:"abc", q:"⚠️ ¿Estado de conservación del ajolote?", o:["Abundante","Preocupación menor","En peligro crítico","Extinto"], c:2 },
        { type:"abc", q:"🏛️ ¿Qué dios azteca se transformó en ajolote?", o:["Quetzalcóatl","Tláloc","Xólotl","Huitzilopochtli"], c:2 },
        { type:"abc", q:"🧬 ¿Qué es la neotenia?", o:["Una enfermedad","Mantener forma de larva siempre","Cambiar de color","Respirar fuera del agua"], c:1 },
        { type:"truefalse", q:"El ajolote puede regenerar parte de su cerebro.", c:true },
        { type:"truefalse", q:"El ajolote Golden tiene ojos oscuros.", c:false },
        { type:"truefalse", q:"Los ajolotes mosaico se forman por fusión de dos embriones.", c:true },
        { type:"truefalse", q:"El billete de 50 pesos mexicanos tiene un ajolote.", c:true },
        { type:"truefalse", q:"Los ajolotes mastican su comida.", c:false },
        { type:"truefalse", q:"La proteína GFP viene de las medusas.", c:true },
        { type:"truefalse", q:"Xólotl es un dios azteca.", c:true },
        { type:"truefalse", q:"Los ajolotes piebald tienen rayas como las cebras.", c:false },
        { type:"truefalse", q:"El ajolote melánico es blanco.", c:false },
        { type:"truefalse", q:"Los ajolotes son nocturnos.", c:true },
        { type:"photo", q:"¿Qué variedad de ajolote ves aquí?", img:"img/lavanda_1.jpg", o:["Copper","Melánico","Lavanda","Albino"], c:2 },
        { type:"photo", q:"Identifica este ajolote:", img:"img/cobre_1.jpg", o:["Lavanda","Copper","Golden","Leucístico"], c:1 },
        { type:"photo", q:"¿Qué tipo de ajolote es?", img:"img/albino_2.jpg", o:["Leucístico","Albino / Golden","Silvestre","GFP"], c:1 },
        { type:"photo", q:"¿Qué muestra esta imagen?", img:"img/variedades.jpg", o:["Solo silvestres","Solo albinos","Varias variedades comparadas","Solo leucísticos"], c:2 },
        { type:"photo", q:"¿Qué tipo es este ajolote?", img:"img/leopardo_1.jpg", o:["Leucístico","Piebald","Silvestre/wild-type","Enigma"], c:2 },
        { type:"match", q:"🔗 Une cada ajolote con su color:", pairs:[
            {left:"Leucístico",right:"Blanco rosado"},
            {left:"Melánico",right:"Negro"},
            {left:"Golden",right:"Dorado"},
            {left:"Lavanda",right:"Púrpura grisáceo"}
        ]},
        { type:"match", q:"🔗 Une cada dato con su valor:", pairs:[
            {left:"Temperatura ideal",right:"14-20°C"},
            {left:"Esperanza de vida",right:"10-15 años"},
            {left:"Huevos por puesta",right:"100-1000"},
            {left:"Formas de respirar",right:"3"}
        ]},
    ],
    dificil: [
        { type:"abc", q:"🔥 ¿Cómo se crea un ajolote firefly?", o:["Nace naturalmente","Dieta especial","Trasplante de tejido embrionario","Luz UV"], c:2 },
        { type:"abc", q:"🌌 ¿Por qué se llama 'enigma'?", o:["Es muy grande","No se conocen sus genes","Vive en cuevas","Es invisible"], c:1 },
        { type:"abc", q:"🎭 ¿Cómo se forma un ajolote mosaico?", o:["Pintándolo","Fusión de embriones","Luz especial","Temperatura fría"], c:1 },
        { type:"abc", q:"🧬 ¿De dónde viene la proteína GFP?", o:["Plantas","Bacterias","Medusas","Hongos"], c:2 },
        { type:"abc", q:"🦴 ¿Qué puede regenerar un ajolote?", o:["Solo patas","Solo cola","Extremidades, corazón, cerebro y médula","Solo piel"], c:2 },
        { type:"abc", q:"🔬 ¿Qué nombre científico tiene?", o:["Axolotus vulgaris","Ambystoma mexicanum","Salamandra axolotl","Caudata mexicana"], c:1 },
        { type:"abc", q:"🏞️ ¿Qué son las chinampas de Xochimilco?", o:["Montañas","Islas flotantes para agricultura","Cuevas","Cascadas"], c:1 },
        { type:"abc", q:"🐟 ¿Qué especie invasora amenaza al ajolote?", o:["Pirañas","Tilapia y carpa","Salmón","Atún"], c:1 },
        { type:"abc", q:"🧪 ¿Para qué estudian los científicos al ajolote?", o:["Para hacer perfumes","Medicina regenerativa","Crear combustible","Fabricar ropa"], c:1 },
        { type:"abc", q:"🫧 ¿Qué son las branquias del ajolote?", o:["Orejas","Órganos para respirar bajo el agua","Cuernos","Antenas"], c:1 },
        { type:"abc", q:"🔴 ¿Qué categoría UICN tiene el ajolote?", o:["Vulnerable","En peligro","En peligro crítico","Extinto en libertad"], c:2 },
        { type:"abc", q:"🧬 ¿Qué tipo de células usan para regenerar?", o:["Neuronas","Células madre (blastema)","Glóbulos rojos","Células óseas"], c:1 },
        { type:"abc", q:"🌊 ¿Cuántos cromosomas tiene un ajolote?", o:["14","28","46","100"], c:1 },
        { type:"abc", q:"📚 ¿Qué familia taxonómica es?", o:["Ranidae","Ambystomatidae","Salamandridae","Bufonidae"], c:1 },
        { type:"abc", q:"🥶 ¿Qué pasa si el agua está muy caliente?", o:["Crecen más rápido","Se estresan y enferman","Cambian de color","Nada"], c:1 },
        { type:"truefalse", q:"El ajolote firefly existe en la naturaleza.", c:false },
        { type:"truefalse", q:"Los ajolotes tienen 28 pares de cromosomas.", c:false },
        { type:"truefalse", q:"Ambystoma mexicanum es el nombre científico.", c:true },
        { type:"truefalse", q:"Las chinampas son islas flotantes.", c:true },
        { type:"truefalse", q:"Los ajolotes pueden regenerar el corazón.", c:true },
        { type:"truefalse", q:"El ajolote copper tiene ojos azules.", c:false },
        { type:"truefalse", q:"La tilapia es una amenaza para el ajolote.", c:true },
        { type:"truefalse", q:"Los ajolotes pertenecen a la familia Ambystomatidae.", c:true },
        { type:"truefalse", q:"El blastema es un tipo de comida para ajolotes.", c:false },
        { type:"truefalse", q:"Dos ajolotes mosaico pueden ser idénticos.", c:false },
        { type:"match", q:"🔗 Une cada variedad con su rasgo único:", pairs:[
            {left:"Firefly",right:"Cuerpo oscuro, cola clara"},
            {left:"GFP",right:"Brilla con luz UV"},
            {left:"Piebald",right:"Manchas como vaca"},
            {left:"Enigma",right:"Genética misteriosa"}
        ]},
        { type:"match", q:"🔗 Une cada término con su significado:", pairs:[
            {left:"Neotenia",right:"Mantener forma larval"},
            {left:"Blastema",right:"Células madre para regenerar"},
            {left:"Melanocito",right:"Célula de pigmento oscuro"},
            {left:"Leucismo",right:"Reducción de pigmento"}
        ]},
        { type:"photo", q:"¿Sabrías decir qué tipo es?", img:"img/tres_colores.jpg", o:["Solo leucísticos","Leucísticos y golden","Solo albinos","Silvestres"], c:1 },
        { type:"photo", q:"¿Qué variedad se muestra?", img:"img/melanico_1.jpg", o:["Silvestre","Melánico","Copper","Lavanda"], c:1 },
        { type:"photo", q:"Identifica esta variedad:", img:"img/dorado_1.jpg", o:["Albino","Golden","Leucístico","Copper"], c:2 },
    ],
    maestro: [
        { type:"abc", q:"🧬 ¿Cuántos pares de cromosomas tiene el ajolote?", o:["14 pares (28 total)","23 pares (46 total)","32 pares (64 total)","10 pares (20 total)"], c:0 },
        { type:"abc", q:"🔬 ¿Qué tamaño tiene el genoma del ajolote?", o:["Igual que el humano","5 veces mayor que el humano","10 veces mayor que el humano","Más pequeño que el humano"], c:2 },
        { type:"abc", q:"📅 ¿En qué año se empezó a estudiar al ajolote en Europa?", o:["Siglo XVI (1500s)","Siglo XIX (1800s)","Siglo XX (1900s)","Siglo XXI (2000s)"], c:1 },
        { type:"abc", q:"🏥 ¿Qué puede regenerar que otros animales NO?", o:["Piel","Cola","Partes del cerebro y corazón","Uñas"], c:2 },
        { type:"abc", q:"🧪 ¿Qué hormona podría inducir la metamorfosis?", o:["Insulina","Hormona tiroidea","Adrenalina","Melatonina"], c:1 },
        { type:"abc", q:"🌡️ ¿Qué pH de agua es ideal?", o:["pH 4-5 (ácido)","pH 6.5-8 (neutro)","pH 10-12 (básico)","pH 1-2 (muy ácido)"], c:1 },
        { type:"abc", q:"🦠 ¿Qué enfermedad común afecta a los ajolotes?", o:["Gripe","Quitridiomicosis (hongo)","Varicela","Malaria"], c:1 },
        { type:"abc", q:"🔍 ¿Cuántas branquias externas tiene?", o:["2 (una a cada lado)","4 (dos a cada lado)","6 (tres a cada lado)","8 (cuatro a cada lado)"], c:2 },
        { type:"abc", q:"📐 ¿Qué genoma fue secuenciado en 2018?", o:["El del ajolote","El del delfín","El del cóndor","El del tiburón"], c:0 },
        { type:"abc", q:"🧠 ¿Cuánto tarda en regenerar una extremidad?", o:["1 día","1-2 semanas","1-3 meses","1 año"], c:2 },
        { type:"truefalse", q:"El genoma del ajolote es 10 veces mayor que el humano.", c:true },
        { type:"truefalse", q:"Los ajolotes pueden metamorfosear si se les inyecta hormona tiroidea.", c:true },
        { type:"truefalse", q:"Los ajolotes tienen 6 branquias externas (3 por lado).", c:true },
        { type:"truefalse", q:"El ajolote fue descrito científicamente por primera vez en el siglo XXI.", c:false },
        { type:"truefalse", q:"La quitridiomicosis es una enfermedad causada por un virus.", c:false },
        { type:"truefalse", q:"Los ajolotes pueden regenerar una extremidad en un solo día.", c:false },
        { type:"truefalse", q:"El ajolote tiene el genoma más grande de cualquier animal secuenciado.", c:false },
        { type:"truefalse", q:"Los ajolotes prefieren un pH neutro del agua (6.5-8).", c:true },
        { type:"match", q:"🔗 Une cada estructura con su función:", pairs:[
            {left:"Branquias externas",right:"Respirar bajo el agua"},
            {left:"Línea lateral",right:"Detectar vibraciones"},
            {left:"Blastema",right:"Regenerar tejido"},
            {left:"Cloaca",right:"Reproducción"}
        ]},
        { type:"match", q:"🔗 Une la amenaza con su tipo:", pairs:[
            {left:"Tilapia",right:"Especie invasora"},
            {left:"Urbanización",right:"Destrucción de hábitat"},
            {left:"Quitridiomicosis",right:"Enfermedad fúngica"},
            {left:"Contaminación",right:"Calidad del agua"}
        ]},
        { type:"speed", q:"⚡ ¡RÁPIDO! Nombra el tipo de ajolote:", items:[
            {img:"img/rosado_1.jpg", answer:"Leucístico"},
            {img:"img/melanico_2.jpg", answer:"Melánico"},
            {img:"img/silvestre_1.jpg", answer:"Silvestre"},
            {img:"img/piebald_1.jpg", answer:"Piebald"},
            {img:"img/lavanda_1.jpg", answer:"Lavanda"},
            {img:"img/mosaico_1.png", answer:"Mosaico"}
        ]},
        { type:"complete", q:"Completa la frase:", sentence:"El ajolote mantiene su forma de larva toda la vida, esto se llama ___.", options:["Metamorfosis","Neotenia","Hibernación","Muda"], c:1 },
        { type:"complete", q:"Completa la frase:", sentence:"Las ___ externas del ajolote parecen una corona de plumas.", options:["Aletas","Patas","Branquias","Escamas"], c:2 },
        { type:"complete", q:"Completa la frase:", sentence:"El ajolote pertenece a la familia ___.", options:["Ranidae","Salamandridae","Ambystomatidae","Bufonidae"], c:2 },
        { type:"complete", q:"Completa la frase:", sentence:"El dios azteca ___ se transformó en ajolote.", options:["Tláloc","Xólotl","Quetzalcóatl","Tonatiuh"], c:1 },
        { type:"complete", q:"Completa la frase:", sentence:"La proteína GFP proviene originalmente de las ___.", options:["Ranas","Medusas","Estrellas de mar","Esponjas"], c:1 },
        { type:"complete", q:"Completa la frase:", sentence:"Los ajolotes aspiran su comida creando un ___ con la boca.", options:["Sonido","Vacío","Remolino","Chirrido"], c:1 },
        { type:"photo", q:"¿Qué muestra esta imagen de variedades?", img:"img/variedades.jpg", o:["Silvestre, Leucístico, Albino blanco, Albino dorado","Solo silvestres en diferentes poses","Diferentes edades del mismo ajolote","Solo leucísticos"], c:0 },
    ]
};

// ─── QUIZ STATE ─────────────────────────────

let qzPhase = null;
let qzQuestions = [];
let qzCurrent = 0;
let qzScore = 0;
let qzTotal = 0;
let qzTimer = null;
let qzTimeLeft = 0;
let qzMatchState = {};

function shuffleArray(arr) {
    const s = [...arr];
    for (let i = s.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [s[i], s[j]] = [s[j], s[i]];
    }
    return s;
}

function renderQuiz() {
    const c = document.getElementById('quizContainer');
    qzPhase = null;
    c.innerHTML = `
        <div class="qz-phase-select">
            <h3 class="qz-phase-title">🎯 Elige tu nivel de desafío</h3>
            <div class="qz-phases-grid">
                ${Object.entries(quizPhases).map(([key, p]) => `
                    <button class="qz-phase-btn" onclick="startQuizPhase('${key}')" style="--phase-color:${p.color}">
                        <span class="qz-phase-emoji">${p.emoji}</span>
                        <span class="qz-phase-name">${p.name}</span>
                        <span class="qz-phase-desc">${p.description}</span>
                        <span class="qz-phase-info">${p.questionsPerRound} preguntas · Mínimo ${p.minToPass} para pasar</span>
                    </button>
                `).join('')}
            </div>
            <button class="qz-random-btn" onclick="startRandomMix()">🎲 ¡Mezcla sorpresa de todas las fases!</button>
        </div>
    `;
}

function startQuizPhase(phase) {
    qzPhase = phase;
    const cfg = quizPhases[phase];
    const pool = allQuestions[phase] || [];
    qzQuestions = shuffleArray(pool).slice(0, cfg.questionsPerRound);
    qzCurrent = 0;
    qzScore = 0;
    qzTotal = qzQuestions.length;
    renderQuestion();
}

function startRandomMix() {
    qzPhase = 'mix';
    const all = [];
    Object.values(allQuestions).forEach(qs => all.push(...qs));
    qzQuestions = shuffleArray(all).slice(0, 10);
    qzCurrent = 0;
    qzScore = 0;
    qzTotal = qzQuestions.length;
    renderQuestion();
}

function renderQuestion() {
    const c = document.getElementById('quizContainer');
    if (qzCurrent >= qzTotal) { showQuizResult(); return; }
    const q = qzQuestions[qzCurrent];
    const phaseCfg = qzPhase === 'mix' ? {name:'Mezcla',emoji:'🎲',color:'#8b5cf6'} : quizPhases[qzPhase];
    const progress = Math.round(((qzCurrent) / qzTotal) * 100);

    let questionHTML = '';
    switch(q.type) {
        case 'abc': questionHTML = renderABC(q); break;
        case 'truefalse': questionHTML = renderTrueFalse(q); break;
        case 'photo': questionHTML = renderPhoto(q); break;
        case 'match': questionHTML = renderMatch(q); break;
        case 'speed': questionHTML = renderSpeed(q); break;
        case 'complete': questionHTML = renderComplete(q); break;
        default: questionHTML = renderABC(q);
    }

    c.innerHTML = `
        <div class="qz-header">
            <div class="qz-header-info">
                <span class="qz-badge" style="background:${phaseCfg.color}">${phaseCfg.emoji} ${phaseCfg.name}</span>
                <span class="qz-counter">${qzCurrent + 1} / ${qzTotal}</span>
                <span class="qz-score-live">⭐ ${qzScore}</span>
            </div>
            <div class="qz-progress-bar"><div class="qz-progress-fill" style="width:${progress}%;background:${phaseCfg.color}"></div></div>
        </div>
        <div class="qz-question-card" id="qzQuestionCard">
            <div class="qz-type-badge">${getTypeBadge(q.type)}</div>
            ${questionHTML}
        </div>
    `;
}

function getTypeBadge(type) {
    const badges = {
        abc: '📝 Elige la correcta',
        truefalse: '✅❌ Verdadero o Falso',
        photo: '📸 Identifica la foto',
        match: '🔗 Une las parejas',
        speed: '⚡ ¡Juego rápido!',
        complete: '✏️ Completa la frase'
    };
    return badges[type] || '📝 Pregunta';
}

// ─── ABC ────────────────────────────────────

function renderABC(q) {
    return `
        <h3 class="qz-question-text">${q.q}</h3>
        <div class="qz-options">
            ${q.o.map((opt, i) => `
                <button class="qz-opt" onclick="answerABC(${i}, ${q.c})" id="qzOpt${i}">${opt}</button>
            `).join('')}
        </div>
    `;
}

function answerABC(picked, correct) {
    document.querySelectorAll('.qz-opt').forEach(b => b.classList.add('disabled'));
    if (picked === correct) {
        document.getElementById(`qzOpt${picked}`).classList.add('correct');
        qzScore++;
    } else {
        document.getElementById(`qzOpt${picked}`).classList.add('wrong');
        document.getElementById(`qzOpt${correct}`).classList.add('correct');
    }
    setTimeout(() => { qzCurrent++; renderQuestion(); }, 1200);
}

// ─── TRUE/FALSE ─────────────────────────────

function renderTrueFalse(q) {
    return `
        <h3 class="qz-question-text">${q.q}</h3>
        <div class="qz-tf-buttons">
            <button class="qz-tf-btn qz-tf-true" onclick="answerTF(true, ${q.c})" id="qzTFTrue">✅ Verdadero</button>
            <button class="qz-tf-btn qz-tf-false" onclick="answerTF(false, ${q.c})" id="qzTFFalse">❌ Falso</button>
        </div>
    `;
}

function answerTF(picked, correct) {
    document.querySelectorAll('.qz-tf-btn').forEach(b => b.classList.add('disabled'));
    const correctId = correct ? 'qzTFTrue' : 'qzTFFalse';
    const pickedId = picked ? 'qzTFTrue' : 'qzTFFalse';
    if (picked === correct) {
        document.getElementById(pickedId).classList.add('correct');
        qzScore++;
    } else {
        document.getElementById(pickedId).classList.add('wrong');
        document.getElementById(correctId).classList.add('correct');
    }
    setTimeout(() => { qzCurrent++; renderQuestion(); }, 1200);
}

// ─── PHOTO ──────────────────────────────────

function renderPhoto(q) {
    return `
        <h3 class="qz-question-text">${q.q}</h3>
        <div class="qz-photo-container">
            <img src="${q.img}" alt="¿Qué ajolote es?" class="qz-photo-img" />
        </div>
        <div class="qz-options">
            ${q.o.map((opt, i) => `
                <button class="qz-opt" onclick="answerABC(${i}, ${q.c})" id="qzOpt${i}">${opt}</button>
            `).join('')}
        </div>
    `;
}

// ─── MATCH ──────────────────────────────────

function renderMatch(q) {
    const shuffledRight = shuffleArray(q.pairs.map(p => p.right));
    qzMatchState = { pairs: q.pairs, matched: 0, total: q.pairs.length, selectedLeft: null, attempts: 0 };

    return `
        <h3 class="qz-question-text">${q.q}</h3>
        <div class="qz-match-container">
            <div class="qz-match-col">
                ${q.pairs.map((p, i) => `
                    <button class="qz-match-item qz-match-left" data-idx="${i}" data-val="${p.left}" onclick="selectMatchLeft(this)">${p.left}</button>
                `).join('')}
            </div>
            <div class="qz-match-col">
                ${shuffledRight.map((r, i) => `
                    <button class="qz-match-item qz-match-right" data-val="${r}" onclick="selectMatchRight(this)">${r}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function selectMatchLeft(el) {
    if (el.classList.contains('matched')) return;
    document.querySelectorAll('.qz-match-left').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    qzMatchState.selectedLeft = el;
}

function selectMatchRight(el) {
    if (el.classList.contains('matched') || !qzMatchState.selectedLeft) return;
    const leftVal = qzMatchState.selectedLeft.dataset.val;
    const rightVal = el.dataset.val;
    const pair = qzMatchState.pairs.find(p => p.left === leftVal);

    qzMatchState.attempts++;

    if (pair && pair.right === rightVal) {
        qzMatchState.selectedLeft.classList.add('matched');
        el.classList.add('matched');
        qzMatchState.selectedLeft.classList.remove('selected');
        qzMatchState.selectedLeft = null;
        qzMatchState.matched++;

        if (qzMatchState.matched === qzMatchState.total) {
            if (qzMatchState.attempts <= qzMatchState.total + 2) qzScore++;
            setTimeout(() => { qzCurrent++; renderQuestion(); }, 800);
        }
    } else {
        el.classList.add('wrong-flash');
        qzMatchState.selectedLeft.classList.add('wrong-flash');
        setTimeout(() => {
            el.classList.remove('wrong-flash');
            if(qzMatchState.selectedLeft) qzMatchState.selectedLeft.classList.remove('wrong-flash');
            qzMatchState.selectedLeft.classList.remove('selected');
            qzMatchState.selectedLeft = null;
        }, 600);
    }
}

// ─── SPEED ──────────────────────────────────

function renderSpeed(q) {
    const shuffledItems = shuffleArray(q.items);
    qzMatchState = { items: shuffledItems, currentIdx: 0, correct: 0, total: shuffledItems.length };
    qzTimeLeft = 20;

    setTimeout(() => startSpeedRound(), 100);

    return `
        <h3 class="qz-question-text">${q.q}</h3>
        <div class="qz-speed-container">
            <div class="qz-speed-timer" id="qzSpeedTimer">⏱️ ${qzTimeLeft}s</div>
            <div class="qz-speed-score" id="qzSpeedScore">✅ 0 / ${qzMatchState.total}</div>
            <div class="qz-speed-photo" id="qzSpeedPhoto">
                <img src="${shuffledItems[0].img}" alt="¿Qué tipo?" class="qz-photo-img"/>
            </div>
            <div class="qz-speed-options" id="qzSpeedOptions">
                ${generateSpeedOptions(shuffledItems[0])}
            </div>
        </div>
    `;
}

function generateSpeedOptions(item) {
    const types = ["Leucístico","Melánico","Silvestre","Golden","Piebald","Lavanda","Mosaico","Copper","Albino","GFP","Firefly","Enigma"];
    let opts = [item.answer];
    while (opts.length < 4) {
        const r = types[Math.floor(Math.random() * types.length)];
        if (!opts.includes(r)) opts.push(r);
    }
    opts = shuffleArray(opts);
    return opts.map(o => `<button class="qz-speed-btn" onclick="answerSpeed('${o}','${item.answer}')">${o}</button>`).join('');
}

function startSpeedRound() {
    if (qzTimer) clearInterval(qzTimer);
    qzTimer = setInterval(() => {
        qzTimeLeft--;
        const timerEl = document.getElementById('qzSpeedTimer');
        if (timerEl) timerEl.textContent = `⏱️ ${qzTimeLeft}s`;
        if (qzTimeLeft <= 0) {
            clearInterval(qzTimer);
            finishSpeed();
        }
    }, 1000);
}

function answerSpeed(picked, correct) {
    const st = qzMatchState;
    if (picked === correct) st.correct++;
    st.currentIdx++;
    document.getElementById('qzSpeedScore').textContent = `✅ ${st.correct} / ${st.total}`;

    if (st.currentIdx >= st.total) {
        clearInterval(qzTimer);
        finishSpeed();
        return;
    }

    const item = st.items[st.currentIdx];
    document.getElementById('qzSpeedPhoto').innerHTML = `<img src="${item.img}" alt="¿Qué tipo?" class="qz-photo-img"/>`;
    document.getElementById('qzSpeedOptions').innerHTML = generateSpeedOptions(item);
}

function finishSpeed() {
    const st = qzMatchState;
    if (st.correct >= Math.ceil(st.total * 0.6)) qzScore++;
    const card = document.getElementById('qzQuestionCard');
    if (card) {
        card.innerHTML += `<div class="qz-speed-result">⚡ ¡Acertaste ${st.correct} de ${st.total}! ${st.correct >= Math.ceil(st.total*0.6) ? '🎉 ¡Punto conseguido!' : '😅 Casi...'}</div>`;
    }
    setTimeout(() => { qzCurrent++; renderQuestion(); }, 1800);
}

// ─── COMPLETE ───────────────────────────────

function renderComplete(q) {
    return `
        <h3 class="qz-question-text">${q.q}</h3>
        <p class="qz-complete-sentence">${q.sentence}</p>
        <div class="qz-options">
            ${q.options.map((opt, i) => `
                <button class="qz-opt" onclick="answerABC(${i}, ${q.c})" id="qzOpt${i}">${opt}</button>
            `).join('')}
        </div>
    `;
}

// ─── RESULT & HALL OF FAME ──────────────────

function getHallOfFame() {
    try { return JSON.parse(localStorage.getItem('ajoloteHallOfFame') || '[]'); }
    catch(e) { return []; }
}

function saveToHallOfFame(entry) {
    const hall = getHallOfFame();
    hall.push(entry);
    hall.sort((a, b) => b.pct - a.pct || b.score - a.score);
    if (hall.length > 20) hall.length = 20;
    localStorage.setItem('ajoloteHallOfFame', JSON.stringify(hall));
    return hall;
}

function getMedal(idx) {
    if (idx === 0) return '🥇';
    if (idx === 1) return '🥈';
    if (idx === 2) return '🥉';
    return `${idx + 1}.`;
}

function getPhaseBadge(phase) {
    const p = quizPhases[phase];
    if (p) return `${p.emoji} ${p.name}`;
    return '🎲 Mezcla';
}

function renderHallOfFameTable(hall) {
    if (hall.length === 0) return '<p class="hof-empty">¡Todavía no hay registros! Sé el primero en entrar 🏆</p>';
    return `
        <table class="hof-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Jugador</th>
                    <th>Nivel</th>
                    <th>Puntos</th>
                    <th>%</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
                ${hall.map((e, i) => `
                    <tr class="${i < 3 ? 'hof-top3' : ''}${e.isNew ? ' hof-new' : ''}">
                        <td class="hof-medal">${getMedal(i)}</td>
                        <td class="hof-name">${e.name}</td>
                        <td class="hof-phase">${getPhaseBadge(e.phase)}</td>
                        <td class="hof-score">${e.score}/${e.total}</td>
                        <td class="hof-pct">${e.pct}%</td>
                        <td class="hof-date">${e.date}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showQuizResult() {
    const c = document.getElementById('quizContainer');
    const pct = Math.round((qzScore / qzTotal) * 100);
    const phaseCfg = qzPhase === 'mix' ? {name:'Mezcla',emoji:'🎲',color:'#8b5cf6',minToPass:6} : quizPhases[qzPhase];
    const passed = qzScore >= (phaseCfg.minToPass || 6);

    let msg, emoji;
    if (pct === 100) { msg = '¡INCREÍBLE! ¡Perfecto! 🏆'; emoji = '🌟'; }
    else if (pct >= 75) { msg = '¡Genial! ¡Eres un crack! 🎉'; emoji = '🥳'; }
    else if (pct >= 50) { msg = '¡Bien hecho! ¡Vas genial! 💪'; emoji = '😊'; }
    else { msg = '¡Sigue intentándolo! 📚'; emoji = '🤗'; }

    const stars = pct === 100 ? '⭐⭐⭐' : pct >= 75 ? '⭐⭐' : pct >= 50 ? '⭐' : '';
    const hall = getHallOfFame();

    c.innerHTML = `
        <div class="qz-result">
            <div class="qz-result-emoji">${emoji}</div>
            <div class="qz-result-stars">${stars}</div>
            <div class="qz-result-score">${qzScore} / ${qzTotal}</div>
            <div class="qz-result-pct">${pct}%</div>
            <p class="qz-result-msg">${msg}</p>
            ${passed ? `<p class="qz-result-pass">✅ ¡Nivel ${phaseCfg.name} superado!</p>` : `<p class="qz-result-fail">❌ Necesitas ${phaseCfg.minToPass} aciertos para superar este nivel</p>`}
            <div class="hof-register">
                <p class="hof-register-title">🏅 ¡Registra tu nombre en el Hall of Fame!</p>
                <div class="hof-register-form">
                    <input type="text" id="hofNameInput" class="hof-input" placeholder="Tu nombre..." maxlength="20" />
                    <button class="hof-save-btn" onclick="registerHallOfFame()">🏆 Guardar</button>
                </div>
            </div>
            <div class="qz-result-buttons">
                <button class="qz-retry-btn" onclick="startQuizPhase('${qzPhase === 'mix' ? 'facil' : qzPhase}')">🔄 Reintentar</button>
                <button class="qz-back-btn" onclick="renderQuiz()">🎯 Elegir otro nivel</button>
            </div>
        </div>
        <div class="hof-section" id="hofSection">
            <h3 class="hof-title">🏆 Hall of Fame</h3>
            <div id="hofTableContainer">${renderHallOfFameTable(hall)}</div>
            <button class="hof-clear-btn" onclick="clearHallOfFame()">🗑️ Borrar registros</button>
        </div>
    `;

    const input = document.getElementById('hofNameInput');
    if (input) input.focus();
}

function registerHallOfFame() {
    const input = document.getElementById('hofNameInput');
    const name = (input ? input.value.trim() : '') || 'Anónimo';
    const pct = Math.round((qzScore / qzTotal) * 100);
    const now = new Date();
    const date = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;

    const entry = {
        name: name,
        phase: qzPhase,
        score: qzScore,
        total: qzTotal,
        pct: pct,
        date: date,
        isNew: true
    };

    const hall = saveToHallOfFame(entry);

    // Mark only the new one
    hall.forEach(e => { if (e !== entry) e.isNew = false; });

    // Update UI
    const form = document.querySelector('.hof-register');
    if (form) form.innerHTML = `<p class="hof-registered">✅ ¡<strong>${name}</strong> registrado en el Hall of Fame!</p>`;

    const tableContainer = document.getElementById('hofTableContainer');
    if (tableContainer) tableContainer.innerHTML = renderHallOfFameTable(hall);

    // Remove isNew flags from storage
    hall.forEach(e => delete e.isNew);
    localStorage.setItem('ajoloteHallOfFame', JSON.stringify(hall));
}

function clearHallOfFame() {
    if (confirm('¿Seguro que quieres borrar todos los registros del Hall of Fame?')) {
        localStorage.removeItem('ajoloteHallOfFame');
        const tableContainer = document.getElementById('hofTableContainer');
        if (tableContainer) tableContainer.innerHTML = renderHallOfFameTable([]);
    }
}

// ─── DRAWING STUDIO + MUSEUM ────────────────

let drawCtx, isDrawing = false, drawColor = '#F8A4C8', brushSize = 4, isEraser = false;
let drawMode = 'normal';
let activeTool = 'brush';

function initDrawCanvas() {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas) return;
    drawCtx = canvas.getContext('2d');
    drawCtx.fillStyle = '#ffffff';
    drawCtx.fillRect(0, 0, canvas.width, canvas.height);
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); startDraw(getTouchPos(canvas, e)); });
    canvas.addEventListener('touchmove', e => { e.preventDefault(); draw(getTouchPos(canvas, e)); });
    canvas.addEventListener('touchend', stopDraw);

    loadSavedColors();
    loadMuseum();
}

function getTouchPos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top };
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return { r, g, b };
}

function pastelify(hex) {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${Math.round(r + (255 - r) * 0.55)}, ${Math.round(g + (255 - g) * 0.55)}, ${Math.round(b + (255 - b) * 0.55)})`;
}

function startDraw(e) {
    if (activeTool === 'fill') {
        floodFill(Math.round(e.offsetX), Math.round(e.offsetY), drawColor);
        return;
    }
    isDrawing = true;
    drawCtx.beginPath();
    drawCtx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
    if (!isDrawing) return;

    if (activeTool === 'blur') {
        applyBlurStroke(e.offsetX, e.offsetY);
        return;
    }

    if (isEraser) {
        drawCtx.globalAlpha = 1;
        drawCtx.shadowBlur = 0;
        drawCtx.shadowColor = 'transparent';
        drawCtx.globalCompositeOperation = 'source-over';
        drawCtx.strokeStyle = '#ffffff';
        drawCtx.lineWidth = brushSize * 3;
    } else {
        switch (drawMode) {
            case 'neon':
                drawCtx.globalAlpha = 1;
                drawCtx.globalCompositeOperation = 'source-over';
                drawCtx.shadowBlur = 18;
                drawCtx.shadowColor = drawColor;
                drawCtx.strokeStyle = drawColor;
                drawCtx.lineWidth = brushSize;
                break;
            case 'pastel':
                drawCtx.globalAlpha = 0.7;
                drawCtx.globalCompositeOperation = 'source-over';
                drawCtx.shadowBlur = 2;
                drawCtx.shadowColor = 'transparent';
                drawCtx.strokeStyle = pastelify(drawColor);
                drawCtx.lineWidth = brushSize * 1.5;
                break;
            case 'transparent':
                drawCtx.globalAlpha = 0.2;
                drawCtx.globalCompositeOperation = 'source-over';
                drawCtx.shadowBlur = 0;
                drawCtx.shadowColor = 'transparent';
                drawCtx.strokeStyle = drawColor;
                drawCtx.lineWidth = brushSize * 2;
                break;
            default:
                drawCtx.globalAlpha = 1;
                drawCtx.globalCompositeOperation = 'source-over';
                drawCtx.shadowBlur = 0;
                drawCtx.shadowColor = 'transparent';
                drawCtx.strokeStyle = drawColor;
                drawCtx.lineWidth = brushSize;
        }
    }

    drawCtx.lineTo(e.offsetX, e.offsetY);
    drawCtx.stroke();
}

function stopDraw() {
    isDrawing = false;
    drawCtx.globalAlpha = 1;
    drawCtx.shadowBlur = 0;
    drawCtx.shadowColor = 'transparent';
}

function applyBlurStroke(cx, cy) {
    const canvas = document.getElementById('drawCanvas');
    const radius = Math.max(brushSize * 2, 6);
    const x0 = Math.max(0, Math.floor(cx - radius));
    const y0 = Math.max(0, Math.floor(cy - radius));
    const x1 = Math.min(canvas.width, Math.ceil(cx + radius));
    const y1 = Math.min(canvas.height, Math.ceil(cy + radius));
    const w = x1 - x0;
    const h = y1 - y0;
    if (w <= 0 || h <= 0) return;

    const imageData = drawCtx.getImageData(x0, y0, w, h);
    const src = new Uint8ClampedArray(imageData.data);
    const dst = imageData.data;
    const kSize = 2;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const dx = (x0 + x) - cx;
            const dy = (y0 + y) - cy;
            if (dx * dx + dy * dy > radius * radius) continue;

            let r = 0, g = 0, b = 0, count = 0;
            for (let ky = -kSize; ky <= kSize; ky++) {
                for (let kx = -kSize; kx <= kSize; kx++) {
                    const sx = x + kx, sy = y + ky;
                    if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
                        const si = (sy * w + sx) * 4;
                        r += src[si];
                        g += src[si + 1];
                        b += src[si + 2];
                        count++;
                    }
                }
            }
            const di = (y * w + x) * 4;
            dst[di] = r / count;
            dst[di + 1] = g / count;
            dst[di + 2] = b / count;
        }
    }
    drawCtx.putImageData(imageData, x0, y0);
}

function setDrawColor(color) {
    drawColor = color;
    isEraser = false;
    activeTool = 'brush';
    updateToolButtons(null);
    document.querySelectorAll('.draw-color, .draw-saved-color').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.draw-color[data-color="${color}"]`) ||
                document.querySelector(`.draw-saved-color[data-color="${color}"]`);
    if (btn) btn.classList.add('active');
}

function setBrushSize(val) { brushSize = parseInt(val); }

function setEraser() {
    isEraser = true;
    activeTool = 'brush';
    document.querySelectorAll('.draw-color, .draw-saved-color').forEach(b => b.classList.remove('active'));
    updateToolButtons('eraser');
}

function setFillTool() {
    activeTool = 'fill';
    isEraser = false;
    updateToolButtons('fill');
}

function setBlurTool() {
    activeTool = 'blur';
    isEraser = false;
    updateToolButtons('blur');
}

function updateToolButtons(active) {
    document.querySelectorAll('.draw-tool-btn').forEach(b => b.classList.remove('draw-tool-active'));
    if (active === 'eraser') {
        document.querySelector('.draw-tool-btn[onclick="setEraser()"]')?.classList.add('draw-tool-active');
    } else if (active === 'fill') {
        document.querySelector('.draw-tool-btn[onclick="setFillTool()"]')?.classList.add('draw-tool-active');
    } else if (active === 'blur') {
        document.querySelector('.draw-tool-btn[onclick="setBlurTool()"]')?.classList.add('draw-tool-active');
    }
}

function floodFill(startX, startY, fillColor) {
    const canvas = document.getElementById('drawCanvas');
    const ctx = drawCtx;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const { r: fr, g: fg, b: fb } = hexToRgb(fillColor);

    const startIdx = (startY * width + startX) * 4;
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];

    if (targetR === fr && targetG === fg && targetB === fb) return;

    const tolerance = 30;
    function matchesTarget(i) {
        return Math.abs(data[i] - targetR) <= tolerance &&
               Math.abs(data[i + 1] - targetG) <= tolerance &&
               Math.abs(data[i + 2] - targetB) <= tolerance;
    }

    const stack = [[startX, startY]];
    const visited = new Uint8Array(width * height);

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        const pos = y * width + x;
        if (visited[pos]) continue;
        const idx = pos * 4;
        if (!matchesTarget(idx)) continue;

        visited[pos] = 1;
        data[idx] = fr;
        data[idx + 1] = fg;
        data[idx + 2] = fb;
        data[idx + 3] = 255;

        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
}

function setDrawMode(mode) {
    const wasNeon = drawMode === 'neon';
    drawMode = mode;
    document.querySelectorAll('.draw-mode-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.draw-mode-btn[data-mode="${mode}"]`);
    if (btn) btn.classList.add('active');
    const canvas = document.getElementById('drawCanvas');
    if (mode === 'neon') {
        canvas.classList.add('draw-canvas-neon');
        drawCtx.globalAlpha = 1;
        drawCtx.shadowBlur = 0;
        drawCtx.fillStyle = '#1a1a2e';
        drawCtx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        canvas.classList.remove('draw-canvas-neon');
        if (wasNeon) {
            drawCtx.globalAlpha = 1;
            drawCtx.shadowBlur = 0;
            drawCtx.fillStyle = '#ffffff';
            drawCtx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
}

function pickCustomColor(color) {
    setDrawColor(color);
}

function getSavedCustomColors() {
    try { return JSON.parse(localStorage.getItem('ajoloteCustomColors') || '[]'); }
    catch(e) { return []; }
}

function saveCustomColor() {
    const picker = document.getElementById('customColorPicker');
    const color = picker.value;
    const name = prompt('🎨 ¡Ponle nombre a tu color!', 'Mi color');
    if (name === null) return;

    const colors = getSavedCustomColors();
    if (colors.some(c => c.hex === color)) {
        alert('¡Ya tienes ese color guardado!');
        return;
    }
    colors.push({ hex: color, name: name || 'Sin nombre' });
    if (colors.length > 16) colors.shift();
    localStorage.setItem('ajoloteCustomColors', JSON.stringify(colors));
    loadSavedColors();
    setDrawColor(color);
}

function deleteSavedColor(idx) {
    const colors = getSavedCustomColors();
    colors.splice(idx, 1);
    localStorage.setItem('ajoloteCustomColors', JSON.stringify(colors));
    loadSavedColors();
}

function loadSavedColors() {
    const row = document.getElementById('savedColorsRow');
    if (!row) return;
    const colors = getSavedCustomColors();
    if (colors.length === 0) {
        row.innerHTML = '';
        row.style.display = 'none';
        return;
    }
    row.style.display = 'flex';
    row.innerHTML = '<span class="saved-colors-label">🎨 Mis colores:</span>' +
        colors.map((c, i) => `
            <div class="draw-saved-color-wrap">
                <button class="draw-saved-color" data-color="${c.hex}" style="background:${c.hex}" title="${c.name}" onclick="setDrawColor('${c.hex}')"></button>
                <button class="draw-saved-color-del" onclick="deleteSavedColor(${i})" title="Borrar">✕</button>
            </div>
        `).join('');
}

function clearCanvas() {
    const canvas = document.getElementById('drawCanvas');
    drawCtx.globalAlpha = 1;
    drawCtx.shadowBlur = 0;
    drawCtx.fillStyle = drawMode === 'neon' ? '#1a1a2e' : '#ffffff';
    drawCtx.fillRect(0, 0, canvas.width, canvas.height);
}

function getMuseumData() {
    try { return JSON.parse(localStorage.getItem('ajoloteMuseum') || '[]'); }
    catch(e) { return []; }
}

function saveToMuseum() {
    const canvas = document.getElementById('drawCanvas');
    const name = prompt('🏛️ ¡Ponle nombre a tu obra maestra!', 'Mi ajolote');
    if (name === null) return;

    const museum = getMuseumData();
    const now = new Date();
    museum.unshift({
        img: canvas.toDataURL('image/png'),
        name: name || 'Sin título',
        date: `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`
    });
    if (museum.length > 12) museum.length = 12;
    localStorage.setItem('ajoloteMuseum', JSON.stringify(museum));
    loadMuseum();
    clearCanvas();
}

function loadMuseum() {
    const grid = document.getElementById('museumGrid');
    if (!grid) return;
    const museum = getMuseumData();

    if (museum.length === 0) {
        grid.innerHTML = '<p class="museum-empty">¡Todavía no hay obras! Dibuja tu primer ajolote 🎨</p>';
        return;
    }

    grid.innerHTML = museum.map((item, i) => `
        <div class="museum-item">
            <img src="${item.img}" alt="${item.name}" class="museum-img" />
            <div class="museum-item-info">
                <span class="museum-item-name">${item.name}</span>
                <span class="museum-item-date">${item.date}</span>
            </div>
            <button class="museum-delete" onclick="deleteMuseumItem(${i})" title="Eliminar">✕</button>
        </div>
    `).join('');
}

function deleteMuseumItem(idx) {
    const museum = getMuseumData();
    museum.splice(idx, 1);
    localStorage.setItem('ajoloteMuseum', JSON.stringify(museum));
    loadMuseum();
}

// ─── JUNIOR QUIZ ────────────────────────────

const juniorQuestions = [
    { q: '😊 ¿Los ajolotes siempre parecen estar...?', opts: ['Enfadados 😠', 'Sonriendo 😊', 'Dormidos 😴'], c: 1 },
    { q: '🩷 ¿De qué color son los ajolotes más famosos?', opts: ['Azul 💙', 'Verde 💚', 'Rosa 🩷'], c: 2 },
    { q: '💧 ¿Dónde viven los ajolotes?', opts: ['En los árboles 🌳', 'En el agua 💧', 'En el desierto 🏜️'], c: 1 },
    { q: '🦸 ¿Qué superpoder tienen los ajolotes?', opts: ['Volar ✈️', 'Crecer patitas nuevas 🦵', 'Ser invisibles 👻'], c: 1 },
    { q: '🌿 ¿De qué país son los ajolotes?', opts: ['España 🇪🇸', 'México 🇲🇽', 'Japón 🇯🇵'], c: 1 },
    { q: '🍽️ ¿Qué comen los ajolotes?', opts: ['Hamburguesas 🍔', 'Gusanitos y bichitos 🪱', 'Helados 🍦'], c: 1 },
    { q: '🌙 ¿Cuándo les gusta más jugar a los ajolotes?', opts: ['Por la mañana ☀️', 'A mediodía 🌤️', 'Por la noche 🌙'], c: 2 },
    { q: '🐣 Los ajolotes se quedan como... ¿qué?', opts: ['Bebés para siempre 🐣', 'Gigantes 🦕', 'Mariposas 🦋'], c: 0 },
    { q: '🫁 ¿Cuántas formas tienen de respirar los ajolotes?', opts: ['Una', 'Tres 🫁', 'Diez'], c: 1 },
    { q: '🎮 ¿En qué videojuego famoso aparecen ajolotes?', opts: ['Mario 🍄', 'Minecraft ⛏️', 'Tetris'], c: 1 },
    { q: '🪸 ¿Qué tienen los ajolotes en la cabeza?', opts: ['Cuernos 🦌', 'Branquias como plumitas 🪸', 'Antenas 📡'], c: 1 },
    { q: '📏 ¿Cuánto miden los ajolotes más o menos?', opts: ['Como un lápiz ✏️', 'Como un coche 🚗', 'Como una casa 🏠'], c: 0 },
];

let jrQuestions = [], jrCurrent = 0, jrScore = 0, jrTotal = 5;

function startJuniorQuiz() {
    jrQuestions = shuffleArray([...juniorQuestions]).slice(0, jrTotal);
    jrCurrent = 0;
    jrScore = 0;
    showJuniorQuestion();
}

function showJuniorQuestion() {
    const c = document.getElementById('juniorQuizContainer');
    if (jrCurrent >= jrQuestions.length) {
        showJuniorResult();
        return;
    }
    const q = jrQuestions[jrCurrent];
    c.innerHTML = `
        <div class="jr-progress">Pregunta ${jrCurrent + 1} de ${jrTotal} · ⭐ ${jrScore} aciertos</div>
        <div class="jr-question-card">
            <h4 class="jr-question-text">${q.q}</h4>
            <div class="jr-options">
                ${q.opts.map((opt, i) => `
                    <button class="jr-opt" id="jrOpt${i}" onclick="answerJunior(${i})">${opt}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function answerJunior(idx) {
    const q = jrQuestions[jrCurrent];
    const btns = document.querySelectorAll('.jr-opt');
    btns.forEach(b => b.style.pointerEvents = 'none');

    if (idx === q.c) {
        document.getElementById(`jrOpt${idx}`).classList.add('jr-correct');
        jrScore++;
    } else {
        document.getElementById(`jrOpt${idx}`).classList.add('jr-wrong');
        document.getElementById(`jrOpt${q.c}`).classList.add('jr-correct');
    }

    jrCurrent++;
    setTimeout(showJuniorQuestion, 1200);
}

function showJuniorResult() {
    const c = document.getElementById('juniorQuizContainer');
    const pct = Math.round((jrScore / jrTotal) * 100);
    let msg, emoji;
    if (pct === 100) { msg = '¡PERFECTO! ¡Eres un súper experto junior! 🏆'; emoji = '🌟'; }
    else if (pct >= 60) { msg = '¡Muy bien! ¡Sabes mucho de ajolotes! 🎉'; emoji = '🥳'; }
    else { msg = '¡Buen intento! ¡Sigue aprendiendo! 💪'; emoji = '😊'; }

    c.innerHTML = `
        <div class="jr-result">
            <div class="jr-result-emoji">${emoji}</div>
            <div class="jr-result-score">${jrScore} / ${jrTotal}</div>
            <p class="jr-result-msg">${msg}</p>
            <button class="jr-play-btn" onclick="startJuniorQuiz()">🔄 ¡Otra vez!</button>
        </div>
    `;
}

function initJuniorQuiz() {
    const c = document.getElementById('juniorQuizContainer');
    if (!c) return;
    c.innerHTML = `
        <div class="jr-start">
            <div class="jr-start-emoji">🦎</div>
            <p>¡5 preguntas fáciles sobre ajolotes!</p>
            <button class="jr-play-btn" onclick="startJuniorQuiz()">🎮 ¡A jugar!</button>
        </div>
    `;
}

// ─── SCROLL NAV EFFECT ──────────────────────

window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 100) {
        nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
    } else {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
    }
});

// ─── INTERSECTION OBSERVER FOR ANIMATIONS ───

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply to cards
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.stat-card, .eco-card, .fact-card, .intro-card'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Init map
    initMap();
    
    // Init quiz
    renderQuiz();

    // Init drawing canvas
    initDrawCanvas();

    // Init junior quiz
    initJuniorQuiz();

    // Init street view filter (show habitat by default)
    filterStreetView('habitat');

    // Init likes & views counters
    initCounters();

    // Init comments
    renderComments();
});
