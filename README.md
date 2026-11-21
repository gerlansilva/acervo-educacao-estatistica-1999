# Acervo digital — Conferência Internacional de Ensino de Estatística, Florianópolis (1999)

Site estático pronto para publicação no GitHub Pages.

## Fonte principal

O acervo reúne recursos recuperados do antigo site `http://www.inf.ufsc.br/cee/`, que hospedava as atas eletrônicas da Conferência Internacional **“Experiências e Expectativas do Ensino de Estatística — Desafios para o Século XXI”**.

Os índices originais preservados registram:

- 21 artigos selecionados;
- 26 comunicações;
- 14 pôsteres;
- total: 61 trabalhos.

O inventário do Wayback usado na recuperação contém 344 recursos com resposta arquivada bem-sucedida: 246 HTML, 73 JPEG, 23 GIF e 2 PowerPoints.

A pasta `acervo-original/` contém esses recursos e quatro cópias adicionais com nomes normalizados (`ñ`, `ç`, `ô` e `á`) criadas apenas para reparar links afetados pela codificação antiga. O inventário técnico e o registro da recuperação ficam separados em `metadados/`.

## Nota sobre as datas

Há uma divergência documental que deve ser preservada: as páginas das atas eletrônicas registram **20 a 23 de setembro de 1999**, enquanto o IASE/ISI Newsletter v. 23, n. 2 (1999) anunciava **20–22 September 1999**.

## Correção importante

O artigo de Cazorla, Silva, Vendramini e Brito, **“Adaptação e Validação de uma Escala de Atitudes em Relação à Estatística”**, está no arquivo `acervo-original/pasta1/art5.html`. Algumas referências secundárias posteriores apontam para `art3.html`, mas a fonte primária recuperada mostra que `art3.html` corresponde ao trabalho **“O ensino da estocástica: uma linha emergente de pesquisa do grupo PRAPEM”**.

## Publicação

O site é estático e não exige compilação. Ele está publicado em três endereços:

- **GitHub Pages** — <https://gerlansilva.github.io/acervo-educacao-estatistica-1999/> (publica automaticamente a cada `push` na branch `main`, a partir da raiz do repositório);
- **Cloudflare Pages** — <https://cieee-6xv.pages.dev/> (publicação manual com `./deploy-cloudflare.sh`);
- **Netlify** — <https://cieee-acervo.netlify.app/> (endereço anterior).

Para publicar no Cloudflare Pages:

```bash
npx wrangler login   # apenas na primeira vez
./deploy-cloudflare.sh
```

O script monta uma pasta temporária apenas com o que o site usa, envia para o projeto `cieee` e publica na branch `main`.

## Curadoria

Gerlan Silva da Silva.

Os direitos autorais dos documentos históricos permanecem com seus autores e/ou instituições. Esta organização não atribui nova licença aos materiais recuperados.
