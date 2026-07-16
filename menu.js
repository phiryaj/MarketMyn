document.addEventListener('DOMContentLoaded', () => {
  const amazonMenu = document.getElementById('amazonMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const allButton = document.getElementById('allButton');

  // Data Structure for Menu
  const menuData = [
    {
      id: "appliances",
      icon: "fas fa-blender",
      label: "Home Appliances",
      subcategories: [
        {
          title: "Kitchen Large Appliances",
          links: ["Built-In Ovens", "Electric Fryers", "Extractor Fans", "Freezers", "Fridges", "Grills & Roasters", "Hobs", "Ice Makers", "Microwaves & Convection Ovens", "Slow Cookers, Steamers & Food Warmers", "Stand Alone Stoves"]
        },
        {
          title: "Kitchen Small Appliances",
          links: ["Ice Makers", "Irons & Accessories", "Kettles & Coffee Machines", "Kitchen Appliance Starter Packs", "Mixers, Blenders & Juicers", "Toasters & Snack Makers"]
        },
        {
          title: "Dishwashers",
          links: ["Dishwasher Accessories", "Dishwashers"]
        },
        {
          title: "Washers & Dryers",
          links: ["Tumble Dryers", "Washing Machines"]
        },
        {
          title: "Sewing",
          links: ["Overlockers", "Sewing Machines"]
        },
        {
          title: "Floor Care",
          links: ["Floor Care Accessories", "Steam Cleaners", "Vacuum Cleaners"]
        },
        {
          title: "Heating, Cooling & Air Care",
          links: ["Air Conditioners & Air Coolers", "Electric Blankets", "Fans", "Heaters", "Humidifiers & Air Purifiers"]
        },
        {
          title: "Water Purification",
          links: ["Carbonating Machines & Water Filters", "Water dispenser"]
        }
      ]
    },
    {
      id: "electronics",
      icon: "fas fa-tv",
      label: "Electronics & Entertainment",
      subcategories: [
        {
          title: "Television",
          links: ["TVs", "TV Accessories", "Decoders and Satellite", "Projectors", "Batteries", "Media Players", "DVD & Blu-Ray Players"]
        },
        {
          title: "Audio Systems & Home Theatre",
          links: ["Car Audio", "DVD & Blu-Ray Players", "Hi-Fi Systems", "Home Audio Accessories", "Home Theatre Systems", "Portable Clock Radios", "Projectors", "Soundbars & Speakers", "Wireless Speakers"]
        },
        {
          title: "Laptops, Tablets & Computers",
          links: ["Accessories", "Computer Bags & Accessories", "Computer Cables & Adapters", "Keyboard, Mouse & Speakers", "Laptops & Notebooks", "Monitors", "Power Banks", "Projectors", "Software & Antivirus", "Tablets", "UPSs & Power Supplies", "Wifi Modems & Routers"]
        },
        {
          title: "Printing & Storage",
          links: ["Printer Cartridges", "Printers", "Printer Papers", "External Hard Drives", "Memory Cards", "USB Flash Drives"]
        },
        {
          title: "Gaming",
          links: ["Consoles", "Games", "Gaming Accessories"]
        },
        {
          title: "Cellular",
          links: ["Accessories", "Smartphones & Feature Phones", "Power Banks"]
        },
        {
          title: "Headphones",
          links: ["In-Ear Earphones & Earbuds", "On-Ear Headphones", "Wireless Headphones"]
        },
        {
          title: "Photography & Drones",
          links: ["Binoculars", "Batteries", "Camera Accessories", "Drones, Videos & Action Cameras", "DSLR & Bridge Cameras", "Instant Cameras", "Power Banks"]
        },
        {
          title: "Wearable Tech",
          links: ["Smart Watches & Activity Trackers"]
        },
        {
          title: "Auto Electronics",
          links: ["Car Radios", "Car Speakers", "Navigation Devices"]
        }
      ]
    },
    {
      id: "cellphones",
      icon: "fas fa-mobile-alt",
      label: "Cellphones",
      subcategories: [
        {
          title: "Mobile Devices",
          links: ["Smartphones & Feature Phones"]
        },
        {
          title: "Cellphone Accessories",
          links: ["Accessories", "Power Banks"]
        },
        {
          title: "Wearable Technology",
          links: ["Smart Watches & Activity Trackers"]
        }
      ]
    },
    {
      id: "furniture",
      icon: "fas fa-couch",
      label: "Home & Furniture",
      subcategories: [
        {
          title: "Furniture",
          links: ["Bedroom Furniture", "Kitchen & Bar Furniture", "Living Room Furniture", "Nursery Furniture", "Office Furniture", "Patio Furniture"]
        },
        {
          title: "Home Furnishings & Bedding",
          links: ["Electric Blankets", "Flooring", "Home Linens", "Humidifiers & Air Purifiers", "Rugs & Mats", "Throws & Blankets"]
        },
        {
          title: "Home Decor",
          links: ["Candles & Holders", "Clocks", "Christmas Decors", "Curtains", "Cushions", "Frames & Wall Decor", "Lamps & Shades", "Mirrors", "Portable Clock Radios", "Shelves & Shelving Units"]
        },
        {
          title: "Christmas",
          links: ["Christmas Decors", "Christmas Supplies", "Envelopes and Postage"]
        },
        {
          title: "Bathroom",
          links: ["Bath & Shower Fittings", "Bathroom Scales", "Bath Mats & Mat Sets", "Bathroom Wall Cabinets & Mirrors", "Dustbins", "Hooks & Organisers", "Toilet Seats", "Towels"]
        },
        {
          title: "Kitchen & Dining",
          links: ["Bakeware", "Baking & Wax Paper", "Batteries", "Bread Bins & Food Savers", "Candles", "Canisters & Dispensers", "Crockery", "Cutlery", "Dish & Tray Racks", "Disposable Tabletop", "Drinkware", "Dustbins", "Foils & Wraps", "Food Storage Bags", "Flasks & Bottles", "Humidifiers & Air Purifiers", "Kitchen Utensils", "Napkins & Tablecloths", "Overware & Roasters", "Paper Cups, Plates & Towels", "Plasticware", "Pots & Pans", "Small Kitchen Gadgets", "Water Purification"]
        }
      ]
    },
    {
      id: "baby",
      icon: "fas fa-baby-carriage",
      label: "Baby, Toddlers & Kids",
      subcategories: [
        {
          title: "Baby Essentials",
          links: ["Baby Toiletries", "Nappies & Wipes"]
        },
        {
          title: "Baby Food",
          links: ["Baby Cereals", "Baby Food", "Baby Formula", "Baby Juices"]
        },
        {
          title: "Feeding & Nursing",
          links: ["Baby Cereals", "Baby Food", "Baby Formula", "Baby Juices"]
        },
        {
          title: "Bathing & Changing",
          links: ["Baby Bathing", "Baby Changing", "Baby Toiletries", "Nappies & Wipes"]
        },
        {
          title: "Baby Health & Safety",
          links: ["Baby Gates & Locks", "Baby Nail Care Kits", "Mom & Baby Healthcare"]
        },
        {
          title: "Baby Travel",
          links: ["Baby Carriers", "Buggies & Strollers", "Car Seats & Booster Seats", "Nappy Bags"]
        },
        {
          title: "Indoor Toys",
          links: ["Arts & Crafts", "Baby Toys", "Building Toys", "Children's Books", "Collectables", "Dress Up & Pretend Play", "Dolls & Accessories", "Electronic & Educational Toys", "Puzzles & Games", "Soft Toys & Teddy Bears", "Toy Cars & Vehicles", "Toy Playsets"]
        },
        {
          title: "Outdoor Toys",
          links: ["Kids Bicycles", "Outdoor Toys & Play Structures", "Pool Toys & Inflatables", "Roller Skates", "Scooters", "Skateboards"]
        },
        {
          title: "Nursery & Activity",
          links: ["Cots", "Infant Bedding", "Mattresses & Support Cushions", "Activity Chairs & Bouncers", "High & Feeding Chairs", "Walking Rings"]
        }
      ]
    },
    {
      id: "sports",
      icon: "fas fa-running",
      label: "Sports, Outdoors & Healthy Living",
      subcategories: [
        {
          title: "Wheel Sports",
          links: ["Adult Bicycles", "Kids Bicycles", "Bicycle Accessories", "Scooters", "Skateboards", "Roller Skates"]
        },
        {
          title: "Fitness Equipment & Nutrition",
          links: ["Sports Nutrition", "Exercise Cycles & Treadmills", "Home Gym & Benches", "Weight Training", "Small Exercise Equipment", "Rowers & Steppers", "Fitness Accessories"]
        },
        {
          title: "Sports",
          links: ["Boxing & Karate", "Trampolines", "Rugby & Soccer", "Cricket & Hockey", "Racquet Sports", "Netball, Volleyball & Basketball", "Weight Training", "Snooker & Pool", "Darts & Table Tennis", "Indoor Table Games", "Swimming & Diving", "Golf", "Sports Clothing & Shoes"]
        },
        {
          title: "Camping & Braai",
          links: ["Air Mattresses & Sleeping Bags", "Binoculars & Telescopes", "Camping Accessories", "Camping Furniture", "Camping Kitchenware", "Charcoal & Firelighters", "Cooler Bags & Boxes", "Gas Canisters", "Gas Cooking & Accessories", "Gas Cylinders", "Tents & Gazebos", "Torches & Lanterns", "Trailers", "Umbrellas"]
        },
        {
          title: "Luggage",
          links: ["Backpacks & Trolleys", "Computer Bags & Cases", "Duffle & Sports Bags", "Luggage Accessories", "Suitcases", "Vanity Cases", "Wallets"]
        }
      ]
    },
    {
      id: "garden",
      icon: "fas fa-seedling",
      label: "Garden, Patio & Pool",
      subcategories: [
        {
          title: "Garden Tools & Machinery",
          links: ["Chainsaw & Blowers", "Garden Tools", "High Pressure Cleaners", "Lawnmowers", "Trimmers"]
        },
        {
          title: "Garden Care",
          links: ["Garden Gloves", "Hose Pipes & Connectors", "Insecticides", "Seeds & Fertilizers", "Water Harvesting"]
        },
        {
          title: "Braai & Patio",
          links: ["Braais", "Braai Grids & Utensils", "Charcoal & Firelighters", "Gas Canisters", "Gas Cooking & Accessories", "Gas Cylinders", "Patio Furniture", "Trampolines", "Umbrellas & Gazebos"]
        },
        {
          title: "Pool",
          links: ["Automatic Pool Cleaners", "Free Standing Pools", "Pool Accessories", "Pool Chemicals", "Pool Toys & Inflatables"]
        }
      ]
    },
    {
      id: "household",
      icon: "fas fa-broom",
      label: "Household Essentials",
      subcategories: [
        {
          title: "Laundry",
          links: ["Buckets & Tubs", "Brushware & Cleaning", "Clothes Drying", "Ironing Boards", "Linen Bins & Baskets", "Laundry Detergent"]
        },
        {
          title: "Cleaning Supplies",
          links: ["Brushware & Cleaning", "Floor Cleaners & Polish", "Furniture & Metal Cleaner", "Household Cleaners & Disinfectants", "Insecticides", "Laundry Detergent", "Toilet & Air-Freshener", "Toilet & Tissue Paper", "Serviettes"]
        },
        {
          title: "Kitchen & Dining",
          links: ["Bakeware", "Baking & Wax Paper", "Batteries", "Bread Bins & Food Savers", "Candles", "Canisters & Dispensers", "Crockery", "Cutlery", "Dish & Tray Racks", "Disposable Tabletop", "Drinkware", "Dustbins", "Foils & Wraps", "Food Storage Bags", "Flasks & Bottles", "Humidifiers & Air Purifiers", "Kitchen Utensils", "Napkins & Tablecloths", "Overware & Roasters", "Paper Cups, Plates & Towels", "Plasticware", "Pots & Pans", "Small Kitchen Gadgets", "Water Purification"]
        }
      ]
    },
    {
      id: "office",
      icon: "fas fa-book",
      label: "Office, Stationery & Books",
      subcategories: [
        {
          title: "Office Supplies",
          links: ["Dustbins", "Envelopes and Postage", "Files, Fasteners & Perforators", "Handheld Payment Devices", "Markers", "Notebooks & Pads", "Printer Papers", "Projectors", "Safety Signage", "Stationery Sets & Measuring Instruments", "WiFi Modem, Router & Range Extenders", "Writing & Drawing Instruments / Pens"]
        },
        {
          title: "Books",
          links: ["Various Genres"]
        },
        {
          title: "Printing",
          links: ["Printer Cartridges", "Printers", "Printer Papers"]
        },
        {
          title: "School Supplies",
          links: ["Adhesives", "Art and Craft Supplies", "Book Covering", "Calculators", "Files, Fasteners & Perforators", "Learning Charts", "Markers", "Notebooks & Pads", "Pencil Cases", "Pens", "Printer Papers", "Stationery Sets & Measuring Instruments"]
        },
        {
          title: "Arts, Crafts & Sewing",
          links: ["Overlockers", "Sewing Machines"]
        },
        {
          title: "Heating, Cooling & Air Care",
          links: ["Air Conditioners & Air Coolers", "Electric Blankets", "Fans", "Heaters", "Humidifiers & Air Purifiers"]
        },
        {
          title: "Christmas",
          links: ["Christmas Decors", "Christmas Supplies", "Envelopes and Postage"]
        }
      ]
    },
    {
      id: "diy",
      icon: "fas fa-tools",
      label: "DIY",
      subcategories: [
        {
          title: "Hardware",
          links: ["Awnings", "Clothes Lines", "Fasteners & Accessories", "Folding Doors", "Glues & Adhesives", "High Pressure Cleaners", "Trolleys & Ladders"]
        },
        {
          title: "Tools & Machinery",
          links: ["DIY Power Tools", "Hand Tools", "Power Tool Accessories", "Power Tool Combination Sets", "Workshop Machinery & Accessories"]
        },
        {
          title: "Electrical",
          links: ["Batteries", "Cover Plates & Switch Sockets", "Electrical Accessories", "Extension Cords & Cables", "Generators & Inverters", "Multi-plugs & Adaptors", "Solar Power"]
        },
        {
          title: "Lighting",
          links: ["Globes & Light Bulbs", "Indoor Light Fittings", "Load Shedding", "Outdoor Light Fittings", "Torches & Emergency Lights"]
        },
        {
          title: "Load Shedding",
          links: ["Emergency Lights", "Generators & Inverters", "Solar Power"]
        },
        {
          title: "Paint",
          links: ["Cleaning Products", "Enamels", "Paint Brushes & Accessories", "Preparation Products", "PVA Paints", "Roof Paints", "Speciality Paints", "Spray Paints", "Water Proofing", "Wood Stain & Varnish"]
        },
        {
          title: "Home Security",
          links: ["Intercoms & Alarms", "Locks & Chains", "Safes", "Security Gates"]
        }
      ]
    },
    {
      id: "automotive",
      icon: "fas fa-car",
      label: "Automotive",
      subcategories: [
        {
          title: "Vehicle Maintenance",
          links: ["Cleaning & Suncare", "High Pressure Cleaners", "Motor Oils & Fluids"]
        },
        {
          title: "Vehicle Security",
          links: ["Security & Safety Accessories"]
        },
        {
          title: "Accessories",
          links: ["Battery Accessories", "Jacks & Wheel Care", "Seat Covers & Mats"]
        },
        {
          title: "In-Car Entertainment",
          links: ["Car Audio Components", "Car Speakers"]
        },
        {
          title: "Baby Travel",
          links: ["Baby Carriers", "Buggies & Strollers", "Car Seats & Booster Seats", "Nappy Bags"]
        }
      ]
    },
    {
      id: "health",
      icon: "fas fa-spa",
      label: "Health, Beauty & Personal Care",
      subcategories: [
        {
          title: "Personal Care",
          links: ["Adult Nappies", "Anti-Perspirants & Deodorants", "Electric Shavers & Barber Kits", "Feminine Care", "Foot Spas & Massagers"]
        },
        {
          title: "Hair Care",
          links: ["Hair Dryer", "Hot Iron, Curlers & Brushes", "Haircare Products", "Hair Colourants", "Hair Styling Products", "Shampoos & Conditioners"]
        },
        {
          title: "Men's Grooming",
          links: ["Aftershaves & Colognes", "Electric Shavers & Barber Kits", "Hair Removal Cream", "Hair Dryer", "Mens Anti-Perspirant & Deodorants", "Razors & Blades", "Shaving Foam & Gels"]
        },
        {
          title: "Nail Care",
          links: ["Nail Care", "Shoe Care"]
        },
        {
          title: "Skin Care",
          links: ["Skin Care", "Hand & Body Lotions", "Hand & Nail Care", "Lip Care", "Moisturisers & Face Creams", "Petroleum Jelly & Glycerine", "Sunscreen"]
        },
        {
          title: "Bath & Shower",
          links: ["Bath Foam & Oils", "Body Sponges & Exfoliators", "Hand Wash & Sanitizers", "Shower Gels", "Soap Bars"]
        },
        {
          title: "Dental Care",
          links: ["Mouthwash", "Toothbrush", "Toothpaste"]
        },
        {
          title: "Feminine Care",
          links: ["Ladies Anti-Perspirants & Deodorants", "Panty Liners", "Sanitary Pads", "Tampons"]
        },
        {
          title: "Healthcare & Vitamins",
          links: ["Anti-Acid Remedies", "Antiseptic Liquids", "Cold & Cough Remedies", "Condoms", "Cotton Buds & Cotton Wool", "Energy Tonics & Vitamins", "Hot Water Bottles", "Humidifiers & Air Purifiers", "Pain Remedies & Anti Inflammatory", "Plaster & Bandages", "Sports Nutrition"]
        },
        {
          title: "Baby Care",
          links: ["Baby Toiletries", "Diapers & Wipes"]
        }
      ]
    },
    {
      id: "pets",
      icon: "fas fa-paw",
      label: "Pets",
      subcategories: [
        {
          title: "Pet Food",
          links: ["Bird & Fish Food", "Cat Food & Treats", "Dog Food & Treats"]
        },
        {
          title: "Pet Care",
          links: ["Deworming", "Pet Grooming & Conditioning"]
        },
        {
          title: "Pet Accessories",
          links: ["Cat Litter & Trays", "Deworming", "Pet Beds & Kennels", "Pet Bowls & Accessories", "Pet Collars & Leashes", "Pet Grooming & Conditioning", "Pet Toys"]
        }
      ]
    },
    {
      id: "party",
      icon: "fas fa-gift",
      label: "Party & Occasions",
      subcategories: [
        {
          title: "Party Supplies",
          links: ["Balloons & Banners", "Disposable Tabletop", "Napkins & Tablecloths", "Paper Cups", "Paper Plates", "Party Candles & Hats", "Party Lights", "Ribbons & Tags", "Serviettes"]
        },
        {
          title: "Gift Wrap",
          links: ["Gift Wraps & Bags", "Greeting Cards"]
        },
        {
          title: "Christmas",
          links: ["Christmas Decors", "Christmas Supplies", "Envelopes and Postage"]
        }
      ]
    }
  ];

  // INJECT HTML
  if (amazonMenu && !document.getElementById('injectedMenuContent')) {
    // Sidebar Content
    let sidebarHTML = `
            <div style="background: #ff6b00; padding: 15px 20px; color: white; font-weight: 700; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-user-circle" style="font-size: 24px;"></i> Hello, Sign in
                <button class="menu-close-btn" style="color: white; margin-left: auto; background:none; border:none; font-size:24px; cursor:pointer;" onclick="closeMenu()">×</button>
            </div>
            <div style="padding: 10px 0;" id="injectedMenuContent">
                <div style="padding: 10px 20px; font-weight: 700; font-size: 16px; color: #111;">Shop By Category</div>`;

    menuData.forEach(item => {
      sidebarHTML += `
            <div class="menu-category" data-submenu="submenu-${item.id}">
                <i class="${item.icon}"></i>
                <span>${item.label}</span>
                <i class="fas fa-chevron-right arrow"></i>
            </div>`;
    });

    sidebarHTML += `
            <div style="padding: 10px 20px; border-top: 1px solid #ddd; margin-top: 10px; font-weight: 700; font-size: 16px; color: #111;">Programs & Features</div>
            <div class="menu-category" onclick="location.href='sell-on-makertmyn.html'">
                <i class="fas fa-store"></i> <span>Sell on MakertMyn</span>
            </div>
            <div class="menu-category" onclick="location.href='help.html'">
                <i class="fas fa-question-circle"></i> <span>Customer Service</span>
            </div>
        </div>`;

    amazonMenu.innerHTML = sidebarHTML;

    // Submenus Content
    // We need to inject these into the body or a specific container, but currently they are expected to be siblings of the menu or at body level
    // Let's create a container for them if they don't exist, or append to body.
    const existingSubmenus = document.querySelectorAll('.submenu-panel');
    existingSubmenus.forEach(el => el.remove()); // Remove old hardcoded ones

    menuData.forEach(item => {
      const subDiv = document.createElement('div');
      subDiv.className = 'submenu-panel';
      subDiv.id = `submenu-${item.id}`;

      let colsHTML = '';
      item.subcategories.forEach(sub => {
        colsHTML += `
                <div class="submenu-column">
                    <h4>${sub.title}</h4>
                    <ul>
                        ${sub.links.map(link => `<li><a href="category.html?category=${encodeURIComponent(item.label)}&q=${encodeURIComponent(link)}">${link}</a></li>`).join('')}
                    </ul>
                </div>`;
      });

      subDiv.innerHTML = `
                <div class="mobile-back-btn" onclick="closeSubmenus()"><i class="fas fa-arrow-left"></i> Main Menu</div>
                <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">${item.label}</h3>
                <div class="submenu-grid">${colsHTML}</div>
            `;
      document.body.appendChild(subDiv);
    });

    // RE-ATTACH LISTENERS after injection
    attachMenuListeners();
  }

  function attachMenuListeners() {
    // Re-query elements
    const menuCategories = document.querySelectorAll('.menu-category');
    const submenuPanels = document.querySelectorAll('.submenu-panel');

    menuCategories.forEach(category => {
      category.addEventListener('mouseenter', function () {
        if (window.innerWidth > 768) {
          const targetId = this.getAttribute('data-submenu');
          if (targetId) {
            window.closeSubmenus();
            const targetSubmenu = document.getElementById(targetId);
            if (targetSubmenu) targetSubmenu.classList.add('active');
          }
        }
      });

      category.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          const targetId = this.getAttribute('data-submenu');
          if (targetId) {
            const targetSubmenu = document.getElementById(targetId);
            if (targetSubmenu) targetSubmenu.classList.add('active');
          }
        }
      });
    });
  }

  // Original Open/Close Logic
  if (allButton) {
    allButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMenu();
    });
  }

  function openMenu() {
    amazonMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.closeMenu = function () {
    amazonMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    window.closeSubmenus();
  };

  window.closeSubmenus = function () {
    document.querySelectorAll('.submenu-panel').forEach(panel => {
      panel.classList.remove('active');
    });
  };

  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (amazonMenu.classList.contains('active')) {
      if (!amazonMenu.contains(e.target) && !allButton.contains(e.target) && !e.target.closest('.submenu-panel')) {
        closeMenu();
      }
    }
  });

});
