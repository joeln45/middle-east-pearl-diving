/**
 * Interactive map of historic Gulf pearl-diving centres (History & Culture
 * page). Uses Leaflet (loaded from a CDN just before this script). The guard
 * means the rest of the site is unaffected if Leaflet or the map element is
 * missing.
 */
(function () {
  const el = document.getElementById("pearl-map");
  if (!el || typeof L === "undefined") return;

  const map = L.map(el, { scrollWheelZoom: false }).setView([26.0, 51.5], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const sites = [
    {
      name: "Bahrain",
      coords: [26.07, 50.55],
      note: "The historic heart of Gulf pearling.",
    },
    {
      name: "Qatar",
      coords: [25.29, 51.53],
      note: "Pearling sustained its economy before oil.",
    },
    {
      name: "United Arab Emirates",
      coords: [24.47, 54.37],
      note: "Home to some of the largest pearling fleets.",
    },
    {
      name: "Kuwait",
      coords: [29.38, 47.99],
      note: "Famed for its fleets of pearling dhows.",
    },
    {
      name: "Eastern Arabia (Saudi)",
      coords: [26.43, 50.1],
      note: "Pearl banks along the Gulf coast.",
    },
    {
      name: "Oman",
      coords: [23.61, 58.59],
      note: "Pearl diving along the northern coast.",
    },
  ];

  sites.forEach((site) => {
    L.marker(site.coords).addTo(map).bindPopup(`<strong>${site.name}</strong><br />${site.note}`);
  });
})();
