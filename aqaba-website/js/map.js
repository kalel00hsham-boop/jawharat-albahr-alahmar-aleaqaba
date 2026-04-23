const aqabaLocations = [
    {
        id: 1,
        title: "قلعة العقبة",
        category: "تاريخي",
        lat: 29.5218,
        lng: 35.0016,
        description: "قلعة تاريخية تعود للقرن السادس عشر ميلادي، لعبت دوراً مهماً في الثورة العربية الكبرى.",
        icon: "fa-landmark",
        image: "images/castle.webp"
    },
    {
        id: 2,
        title: "الشاطئ الجنوبي",
        category: "شواطئ",
        lat: 29.4180,
        lng: 34.9754,
        description: "أفضل وجهة للغوص والسباحة، يتميز بالشعاب المرجانية الساحرة والمياه الكريستالية.",
        icon: "fa-umbrella-beach",
        image: "images/beach.jpeg"
    },
    {
        id: 3,
        title: "سارية ساحة الثورة العربية",
        category: "معلم سياحي",
        lat: 29.5211,
        lng: 35.0011,
        description: "إحدى أطول سواري الأعلام في العالم، تحمل علم الثورة العربية الكبرى وتطل على خليج العقبة.",
        icon: "fa-flag",
        image: "images/flagpole.jpg"
    },
    {
        id: 4,
        title: "مشروع واحة أيلة",
        category: "ترفيه وتسوق",
        lat: 29.5392,
        lng: 34.9961,
        description: "مشروع عمراني متكامل يضم ملاعب جولف، مطاعم راقية، وشواطئ اصطناعية فاخرة.",
        icon: "fa-water",
        image: "images/marina.webp"
    },
    {
        id: 5,
        title: "مركز الزوار",
        category: "خدمات سياحية",
        lat: 29.5265,
        lng: 35.0018,
        description: "مركز يوفر جميع المعلومات السياحية والخرائط والنصائح لزوار المدينة.",
        icon: "fa-info-circle",
        image: "images/city-view.jpg"
    },
    {
        id: 6,
        title: "متحف آثار العقبة",
        category: "تاريخي",
        lat: 29.5222,
        lng: 35.0019,
        description: "متحف بجوار القلعة يضم قطعاً أثرية تستعرض تاريخ المدينة القديمة (أيلة).",
        icon: "fa-museum",
        image: "images/fortress.jpg"
    }
];

// Initialize Leaflet Map
// Center on Jordan initially, slightly zoomed out to see the whole country
let map;
let markers = [];
const locationsListEl = document.getElementById('locationsList');
const searchInput = document.getElementById('mapSearchInput');

function initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    // Center coordinates for Jordan
    map = L.map('map', {
        center: [31.2407, 36.5115], // Jordan center
        zoom: 7, // Zoom out to show country
        zoomControl: false
    });

    // Add Tile Layer (Google Maps style)
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
    }).addTo(map);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Render list and markers
    renderList(aqabaLocations);
    renderMarkers(aqabaLocations);

    // Optional: Draw a bounds rectangle or highlight Jordan 
    // but standard tiles will suffice to show the geography.

    // Search event
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = aqabaLocations.filter(loc => 
                loc.title.toLowerCase().includes(query) || 
                loc.description.toLowerCase().includes(query) ||
                loc.category.toLowerCase().includes(query)
            );
            renderList(filtered);
            renderMarkers(filtered);
        });
    }
}

function renderList(locations) {
    if (!locationsListEl) return;
    
    locationsListEl.innerHTML = '';
    
    if (locations.length === 0) {
        locationsListEl.innerHTML = `
            <div style="padding: 20px; text-align: center; color: var(--gray);">
                لا يوجد نتائج مطابقة للبحث
            </div>
        `;
        return;
    }
    
    locations.forEach(loc => {
        const item = document.createElement('div');
        item.className = 'location-item';
        item.innerHTML = `
            <div class="location-icon">
                <i class="fas ${loc.icon}"></i>
            </div>
            <div class="location-info">
                <h4>${loc.title}</h4>
                <div style="font-size:0.75rem; color:var(--primary); margin-bottom:5px;">${loc.category}</div>
                <p>${loc.description.substring(0, 50)}...</p>
            </div>
        `;
        item.addEventListener('click', () => {
            // Highlight list item
            document.querySelectorAll('.location-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            
            // Fly to location (zoom into Aqaba specific point)
            map.flyTo([loc.lat, loc.lng], 15, { duration: 1.5 });
            
            // Open popup
            const marker = markers.find(m => m.options.locId === loc.id);
            if (marker) {
                setTimeout(() => marker.openPopup(), 1500); // give time to fly before opening
            }
            
            // If on mobile, scroll to map
            if (window.innerWidth <= 768) {
                document.querySelector('#map').scrollIntoView({ behavior: 'smooth' });
            }
        });
        locationsListEl.appendChild(item);
    });
}

function renderMarkers(locations) {
    // Clear existing markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    
    locations.forEach(loc => {
        const popupContent = `
            <div style="text-align: right; direction: rtl; font-family: 'Tajawal', sans-serif; max-width: 220px;">
                <img src="${loc.image}" alt="${loc.title}" style="width: 100%; border-radius: 8px; margin-bottom: 8px; height: 130px; object-fit: cover;" />
                <h4 style="margin: 0 0 5px; color: #0077b6;">${loc.title}</h4>
                <p style="margin: 0; font-size: 0.9em; color: #666; line-height: 1.4;">${loc.description}</p>
            </div>
        `;
        
        const marker = L.marker([loc.lat, loc.lng], { locId: loc.id })
            .addTo(map)
            .bindPopup(popupContent);
            
        markers.push(marker);
    });
}

// Call initMap when DOM is ready
document.addEventListener('DOMContentLoaded', initMap);
