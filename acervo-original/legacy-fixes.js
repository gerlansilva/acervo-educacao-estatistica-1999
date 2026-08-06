(() => {
  const style = document.createElement("style");
  style.textContent = `
    .archive-missing-figure {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: .35rem;
      width: min(100%, 720px);
      min-height: 130px;
      margin: 1rem auto;
      padding: 1rem 1.25rem;
      border: 1px dashed #8ea19b;
      background: #f4f7f6;
      color: #31443e;
      font: 15px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      text-align: center;
    }
    .archive-missing-figure strong { font-size: 15px; }
    .archive-missing-figure small { color: #65746f; font-size: 12px; }
    .archive-nav-fallback {
      display: inline-block;
      padding: 3px 5px;
      color: #174f91;
      font: 12px/1.2 Arial, sans-serif;
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);

  const contentImage = /(?:^|\/)(?:Image\d+\.(?:gif|jpe?g)|img\d+\.(?:gif|jpe?g))$/i;

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      const src = img.getAttribute("src") || "imagem sem endereço registrado";

      if (contentImage.test(src)) {
        const placeholder = document.createElement("span");
        placeholder.className = "archive-missing-figure";
        placeholder.setAttribute("role", "note");

        const message = document.createElement("strong");
        message.textContent = "Imagem não preservada no acervo recuperado";
        const reference = document.createElement("small");
        reference.textContent = `Referência original: ${src}`;
        placeholder.append(message, reference);
        img.replaceWith(placeholder);
        return;
      }

      const link = img.closest("a[href]");
      const alt = (img.getAttribute("alt") || "").trim();
      if (link && alt && !/\.(?:gif|jpe?g|png)/i.test(alt)) {
        const fallback = document.createElement("span");
        fallback.className = "archive-nav-fallback";
        fallback.textContent = alt;
        img.replaceWith(fallback);
      } else {
        img.remove();
      }
    }, { once: true });
  });
})();
