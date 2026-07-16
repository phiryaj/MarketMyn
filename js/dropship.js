
// Mock AliExpress Data for Simulation
const MOCK_TOYS = [
    { title: "RC Stunt Car 4WD Gesture Control", image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400", cost: 250, cat: "RC" },
    { title: "Montessori Wooden Math Board", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400", cost: 120, cat: "Education" },
    { title: "Building Blocks Castle Set (1000pcs)", image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400", cost: 450, cat: "Blocks" },
    { title: "Inflatable Swimming Pool for Kids", image: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400", cost: 300, cat: "Outdoor" },
    { title: "Action Figure Superhero Collectible", image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400", cost: 180, cat: "Figures" },
    { title: "Magic Card Deck Professional", image: "https://images.unsplash.com/photo-1502930263641-527fb9ce4b21?w=400", cost: 50, cat: "Hobby" }
];

// 1. Handle Import Fetch
const importBtn = document.getElementById('fetchBtn');
const urlInput = document.getElementById('aliUrl');
const previewSection = document.getElementById('previewSection');
const loader = document.getElementById('loader');

if (importBtn) {
    importBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (!url) { alert('Please enter a URL'); return; }

        // UI Loading State
        importBtn.disabled = true;
        importBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';

        // Simulate Network Delay (1.5s)
        setTimeout(() => {
            // Pick Random Mock Product
            const mock = MOCK_TOYS[Math.floor(Math.random() * MOCK_TOYS.length)];

            // Populate Form
            document.getElementById('pTitle').value = mock.title;
            document.getElementById('pCost').value = mock.cost;
            document.getElementById('pPrice').value = Math.round(mock.cost * 1.8); // 80% Markup default
            document.getElementById('pCategory').value = mock.cat;
            document.getElementById('previewImg').src = mock.image;
            document.getElementById('pImg').value = mock.image; // Hidden field

            // Show UI
            previewSection.style.display = 'flex';
            importBtn.disabled = false;
            importBtn.innerHTML = 'Fetch Product';

            // Scroll to preview
            previewSection.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    });
}

// 2. Handle "Push to Store"
const pushBtn = document.getElementById('pushBtn');
if (pushBtn) {
    pushBtn.addEventListener('click', () => {
        const product = {
            id: 'IMP-' + Date.now(), // Unique ID
            title: document.getElementById('pTitle').value,
            price: Number(document.getElementById('pPrice').value),
            originalPrice: Number(document.getElementById('pPrice').value) * 1.3, // Mock fake recommended retail
            cost: Number(document.getElementById('pCost').value),
            category: document.getElementById('pCategory').value,
            image: document.getElementById('pImg').value,
            rating: 5,
            reviews: 0,
            isImported: true,
            dateAdded: new Date().toISOString()
        };

        // Save to LocalStorage
        const PRODUCTS_KEY = 'makertmyn_products';
        let products = [];
        try {
            products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
        } catch (e) { }

        products.unshift(product); // Add to top
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

        // Show Success Feedback
        alert('Product Imported Successfully!\nIt will now appear on your Homepage.');

        // Reset
        previewSection.style.display = 'none';
        urlInput.value = '';
        renderRecentImports();
    });
}

// 3. Render Recents Table
function renderRecentImports() {
    const tableBody = document.getElementById('importsTableBody');
    if (!tableBody) return;

    let products = [];
    try {
        products = JSON.parse(localStorage.getItem('makertmyn_products')) || [];
    } catch (e) { }

    // Filter only imported ones? or all? Let's show all latest.
    const recents = products.slice(0, 5);

    if (recents.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No imports yet. Paste a URL above to start!</td></tr>`;
        return;
    }

    tableBody.innerHTML = recents.map(p => `
        <tr>
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${p.image}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
                    <span style="font-weight:600; font-size:13px;">${p.title.substring(0, 30)}...</span>
                </div>
            </td>
            <td>R${p.price}</td>
            <td>R${p.cost || '-'}</td>
            <td>R${(p.price - (p.cost || 0))}</td>
            <td><span class="status-badge published">Published</span></td>
        </tr>
    `).join('');
}

// Init
document.addEventListener('DOMContentLoaded', renderRecentImports);
