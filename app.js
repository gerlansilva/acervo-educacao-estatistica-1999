const sourceBase = "acervo-original/";

const categorySources = [
  {
    type: "artigo",
    label: "Artigo",
    file: "tema.htm",
    prefix: "pasta",
    groups: [5, 5, 3, 4, 4],
    themes: [
      "Pesquisa em Educação Estatística",
      "Ensino de Estatística na formação de profissionais",
      "Ensino de Estatística no 1º e 2º graus",
      "Formação permanente em Estatística",
      "Pesquisa e planejamento curricular para a Educação em Estatística",
    ],
  },
  {
    type: "comunicacao",
    label: "Comunicação",
    file: "temacomunic.htm",
    prefix: "comunica/",
    groups: [6, 6, 3, 11],
    themes: [
      "Ensino de Estatística na formação de profissionais",
      "Ensino de Estatística no 1º e 2º graus",
      "Formação de estatísticos para pesquisa e ensino da pesquisa aplicada",
      "Pesquisa e planejamento curricular para a Educação em Estatística",
    ],
  },
  {
    type: "poster",
    label: "Pôster",
    file: "temaposter.htm",
    prefix: "posters/",
    groups: [1, 3, 2, 2, 6],
    themes: [
      "Pesquisa em Educação Estatística",
      "Ensino de Estatística na formação de profissionais",
      "Ensino de Estatística no 1º e 2º graus",
      "Formação de estatísticos para pesquisa e ensino da pesquisa aplicada",
      "Pesquisa e planejamento curricular para a Educação em Estatística",
    ],
  },
];

const authorFiles = ["tituloautor.htm", "tituloautor_Comunica.htm", "tituloautor_Pôster.htm"];

const authorFallbacks = {
  "comunica/RESUMO.html": ["Margarida César"],
  "comunica/terebra.html": ["Teresita E. Terán"],
  "comunica/RESUMO_(.html": ["Carolina Carvalho", "Margarida César"],
  "posters/tema1art1.html": ["Mariela B. Cravero", "Pamela L. Martínez Fernández", "Roberto Meyer", "María Inés Rodríguez"],
};

const missingIndexWorks = {
  artigo: [{
    rawPath: "pasta4/art3p4.html",
    title: "Experiências Metodológicas no Ensino de Análise Exploratória de Dados na América Latina",
    insertAfter: "pasta4/art2p4.html",
  }],
};

let allWorks = [];
let activeType = "todos";

function normalizePath(path) {
  const decoded = path.replaceAll("%20", " ");
  if (decoded === "pasta4/art3p4.doc") return "pasta4/art3p4.html";
  return decoded;
}

async function readText(path) {
  const response = await fetch(sourceBase + path);
  if (!response.ok) throw new Error(`Não foi possível carregar ${path}`);
  const buffer = await response.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("windows-1252").decode(buffer);
  }
}

async function parseDocument(path) {
  return new DOMParser().parseFromString(await readText(path), "text/html");
}

function cleanText(value) {
  return value.replace(/\s+/g, " ").replace(/\([a-z]\)$/i, "").trim();
}

async function loadAuthors() {
  const map = new Map();
  const docs = await Promise.all(authorFiles.map(parseDocument));
  docs.forEach((doc) => {
    doc.querySelectorAll("a[href]").forEach((anchor) => {
      const href = normalizePath(anchor.getAttribute("href"));
      const name = cleanText(anchor.textContent || "");
      if (!name || !href) return;
      if (!map.has(href)) map.set(href, []);
      if (!map.get(href).includes(name)) map.get(href).push(name);
    });
  });
  Object.entries(authorFallbacks).forEach(([path, names]) => {
    const existing = map.get(path) || [];
    names.forEach((name) => { if (!existing.includes(name)) existing.push(name); });
    map.set(path, existing);
  });
  return map;
}

function assignThemes(items, source) {
  let start = 0;
  return source.groups.flatMap((count, groupIndex) => {
    const slice = items.slice(start, start + count).map((item) => ({
      ...item,
      theme: source.themes[groupIndex],
    }));
    start += count;
    return slice;
  });
}

async function loadCategory(source, authorMap) {
  const doc = await parseDocument(source.file);
  let items = [...doc.querySelectorAll("a[href]")]
    .map((anchor) => ({
      rawPath: anchor.getAttribute("href") || "",
      title: cleanText(anchor.textContent || ""),
    }))
    .filter((item) => item.title && item.rawPath.startsWith(source.prefix));

  (missingIndexWorks[source.type] || []).forEach((missing) => {
    const after = items.findIndex((item) => normalizePath(item.rawPath) === missing.insertAfter);
    items.splice(after >= 0 ? after + 1 : items.length, 0, missing);
  });

  items = items
    .map((item) => {
      const path = normalizePath(item.rawPath);
      return {
        type: source.type,
        label: source.label,
        title: item.title,
        path,
        authors: authorMap.get(path) || authorFallbacks[path] || [],
      };
    });
  return assignThemes(items, source);
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function render() {
  const query = document.querySelector("#search").value.trim().toLocaleLowerCase("pt-BR");
  const filtered = allWorks.filter((work) => {
    if (activeType !== "todos" && work.type !== activeType) return false;
    const haystack = [work.title, work.theme, ...work.authors].join(" ").toLocaleLowerCase("pt-BR");
    return !query || haystack.includes(query);
  });

  document.querySelector("#catalogStatus").textContent = `${filtered.length} de ${allWorks.length} trabalhos`;
  const container = document.querySelector("#works");
  if (!filtered.length) {
    container.innerHTML = '<p class="empty">Nenhum trabalho encontrado com esses filtros.</p>';
    return;
  }

  container.innerHTML = filtered.map((work) => {
    const authors = work.authors.length ? work.authors.join(" · ") : "Autoria disponível no documento original";
    const href = sourceBase + work.path.split("/").map((part) => encodeURIComponent(part)).join("/");
    return `
      <a class="work" href="${href}">
        <div class="work-top"><span>${escapeHTML(work.label)}</span><span>${escapeHTML(work.theme)}</span></div>
        <h3>${escapeHTML(work.title)}</h3>
        <p class="authors">${escapeHTML(authors)}</p>
      </a>`;
  }).join("");
}

async function init() {
  try {
    const authorMap = await loadAuthors();
    const categories = await Promise.all(categorySources.map((source) => loadCategory(source, authorMap)));
    allWorks = categories.flat();
    if (allWorks.length !== 61) {
      throw new Error(`Os índices retornaram ${allWorks.length} trabalhos; eram esperados 61.`);
    }
    render();
  } catch (error) {
    console.error(error);
    document.querySelector("#catalogStatus").textContent = "Falha ao carregar o catálogo";
    document.querySelector("#works").innerHTML = '<p class="empty">Os índices originais não puderam ser carregados. Use os links da seção “Fonte primária” acima.</p>';
  }
}

document.querySelector("#search").addEventListener("input", render);
document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeType = button.dataset.type;
    render();
  });
});

init();
