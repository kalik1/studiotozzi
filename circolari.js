async function caricaCircolari() {
  const archivio = document.getElementById("archivio");
  try {
    const risposta = await fetch("circolari.json");
    if (!risposta.ok) throw new Error("Catalogo non disponibile");
    const circolari = await risposta.json();
    const gruppi = new Map();
    for (const { anno, titolo, url } of circolari) {
      if (!Number.isInteger(anno) || typeof titolo !== "string" || !titolo.trim() ||
          typeof url !== "string" || !url.trim()) throw new Error("Circolare incompleta");
      const destinazione = new URL(url, risposta.url);
      if (!["https:", "http:"].includes(destinazione.protocol)) throw new Error("URL non valido");
      if (!gruppi.has(anno)) gruppi.set(anno, []);
      gruppi.get(anno).push({ titolo, destinazione });
    }
    for (const anno of [...gruppi.keys()].sort((a, b) => b - a)) {
      const sezione = document.createElement("section");
      const intestazione = document.createElement("h2");
      intestazione.textContent = anno;
      const elenco = document.createElement("ul");
      for (const { titolo, destinazione } of gruppi.get(anno)) {
        const voce = document.createElement("li");
        const link = document.createElement("a");
        link.href = destinazione.href;
        link.textContent = titolo;
        voce.append(link);
        elenco.append(voce);
      }
      sezione.append(intestazione, elenco);
      archivio.append(sezione);
    }
    if (!circolari.length) archivio.textContent = "Nessuna circolare in archivio.";
  } catch {
    archivio.textContent = "Impossibile caricare le circolari. Ricarica la pagina per riprovare.";
  } finally {
    archivio.setAttribute("aria-busy", "false");
  }
}
caricaCircolari();
