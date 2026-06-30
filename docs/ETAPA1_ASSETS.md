# 🎨 Etapa 1 — Assets faltantes y prompts

> Acompaña a `ETAPA1_MANOLANDIA_DESPIERTA.md` y al vertical slice ya implementado.
> Regla respetada: **se reutilizaron los assets existentes** (los 4 retratos PNG) y **no se dibujaron
> placeholders feos**. Lo que falta se lista acá con specs; el arte nuevo va como **prompts de Canva**
> (no se generan imágenes durante la implementación).

---

## 1. Qué ya funciona con assets existentes (sin pedir nada)

- **Mundo vivo** (cielo por hora del día, astro sol/luna, estrellas, nubes, estrella fugaz,
  mariposa y pajarito) → resuelto con CSS/SVG, 0 assets nuevos.
- **Personajes vivos** (respiración, bob, balanceo, microgestos, personalidad) → animando los PNG
  existentes `nuveciela.png` / `nuve.png` / `ciela.png` / `lunaria.png` con `transform`.
- **Anfitriona** (Lunaria con burbujas de saludo) → con su PNG existente.

> Es decir: la sensación de "entré a un mundo vivo" **ya está**, sin assets nuevos. Lo de abajo es
> para subir el techo de calidad (parpadeo real, microgestos por frames, horizonte hecho a mano).

---

## 2. Sprite sheets — están dibujados, faltan como ARCHIVOS

Los sheets que compartiste (IDLE, PARPADEO, etc.) **no están en el repo**; existen como imágenes.
Para que el launcher (y luego el platformer) los usen, hay que **exportarlos como archivos** con
specs consistentes. El `LivingCharacter` ya está preparado para subir de "animación por transform" a
"animación por frames" cambiando solo el contenido interno — sin reescribir la lógica.

### 2.1 Spec de exportación (igual para las 4 Nuvecielas)
- **Formato:** PNG con transparencia (alpha real, sin fondo negro).
- **Frame canvas uniforme:** **512 × 512 px** por frame (cuadrado, personaje centrado, mismos pies
  a la misma altura en todos los frames → evita "saltos").
- **Layout:** un **sheet por animación** (tira horizontal), o un sheet maestro con una fila por
  animación. Frames equiespaciados.
- **Nomenclatura:** `nuveciela_idle.png`, `nuveciela_blink.png`, `nuveciela_wave.png`, … (mismo
  patrón por personaje). Ubicación sugerida: `src/assets/characters/<id>/`.
- **Densidad:** exportar @1x (512) y, si se puede, @2x para pantallas retina.

### 2.2 Animaciones y prioridad
| Animación | Frames (según tus sheets) | ¿Para qué? | Prioridad |
|---|:---:|---|:---:|
| IDLE | 6 | base viva del launcher | 🟠 Media |
| PARPADEO | 4 | parpadeo real (hoy se simula con respiración) | 🟢 Alta-launcher |
| INTERACCIÓN / SALUDO | 4 | saludo de la anfitriona | 🟢 Alta-launcher |
| CORAZÓN / ALEGRÍA | 4 | festejo al ganar (futuro) | 🟡 Media |
| SORPRESA | 3 | reacción a toques/eventos | 🟡 Baja |
| ENOJO | 3 | variedad expresiva | 🟢 Baja |
| CORRER | 6 | **platformer** | 🔵 Platformer |
| SALTAR | 4 | **platformer** | 🔵 Platformer |
| CAÍDA | 4 | **platformer** | 🔵 Platformer |
| ATERRIZAR | 3 | **platformer** | 🔵 Platformer |

> **Mínimo para elevar el launcher:** IDLE + PARPADEO + SALUDO + ALEGRÍA de las 4 Nuvecielas. Con eso,
> los personajes parpadean y saludan "de verdad", no solo con transform.

---

## 3. Assets de mundo que faltan (para el horizonte hecho a mano)

No los dibujé para no romper la regla de "nada de placeholders feos". El sistema ya tiene su capa de
horizonte lista para recibirlos.

| Asset | Tamaño recomendado | Formato | Frames | Prioridad |
|---|---|---|:---:|:---:|
| Casita de Manolandia (×3 variantes) | ~300×300 px c/u | PNG transparente | 1 | 🟠 Media |
| Molino | ~360×480 px (aspas en capa aparte para girar) | PNG transparente (2 piezas: torre + aspas) | 1+1 | 🟠 Media |
| Colina / pradera (tira de horizonte) | 1600×400 px, repetible al ancho | PNG transparente | 1 | 🟡 Media |
| Mariposa (arte hecho a mano) | 128×128 px | PNG transparente | 2–4 (aleteo) | 🟢 Baja (hay versión SVG) |
| Pajarito (arte hecho a mano) | 96×96 px | PNG transparente | 2–4 (aleteo) | 🟢 Baja (hay versión SVG) |
| Nube hecha a mano (×2) | ~400×200 px | PNG transparente | 1 | 🟢 Baja (hay versión CSS) |

> Mariposa, pajarito y nubes ya tienen una versión decente (SVG/CSS) en el slice. El arte hecho a
> mano es un *upgrade* opcional, no un bloqueante.

---

## 4. Prompts de Canva AI (para el arte nuevo del mundo)

> **No generar durante la implementación — solo cuando se decida producir arte.** Todos comparten
> estilo para que el mundo se vea cohesivo con los personajes (plush/fieltro hecho a mano, suave,
> tierno, iluminación cálida).

### Estilo base común (incluir en TODOS los prompts)
> *"Soft handmade plush / felt craft style, like a cozy children's toy made by hand. Rounded, chunky,
> tactile shapes with subtle fabric and clay texture. Soft warm lighting, gentle ambient occlusion,
> dreamy storybook mood. Kawaii, wholesome, premium indie game art. Flat-ish but with soft volume.
> Transparent background (PNG). No text, no watermark, no harsh outlines, no realistic photo."*

### 4.1 Casita de Manolandia
> *(estilo base) + A tiny whimsical handmade house in Manolandia, a magical sky world. Made of felt
> and soft clay, rounded crooked walls, a curvy chimney with a little puff of cotton smoke, round
> window glowing softly warm. Pastel palette: peach, soft pink, mint, cream. Cute, cozy, fairy-tale.
> Single object, centered, transparent background. Make 3 gentle variations (different roof colors
> and shapes).*

### 4.2 Molino
> *(estilo base) + A small handmade windmill for a magical sky village, felt-and-clay craft style.
> Rounded tower in cream and soft wood tones, four chunky fabric sails. IMPORTANT: deliver the tower
> and the sails as SEPARATE pieces (sails on their own transparent layer, centered on their pivot) so
> the blades can rotate in-engine. Soft warm light, pastel palette, transparent background.*

### 4.3 Colina / pradera (horizonte)
> *(estilo base) + A long gentle rolling hill strip for the foreground of a magical sky world, felt
> and plush craft texture, soft rounded mounds of mint-green and pastel grass with tiny handmade
> flowers and soft tufts. Designed to tile horizontally (seamless left/right edges). Wide panoramic
> strip, transparent background above the hill line.*

### 4.4 Mariposa (upgrade opcional)
> *(estilo base) + A tiny adorable handmade butterfly, felt wings in soft pastel pink, lemon and
> lavender, gentle symmetric shape, cute and dreamy. Tiny, centered, transparent background. Provide
> 2 wing positions (open and half-folded) for a flutter animation.*

### 4.5 Pajarito (upgrade opcional)
> *(estilo base) + A tiny cute handmade bird, round felt body in soft pastel blue with a little tuft,
> simple sweet face, small wings. Side view, gentle and minimal so it reads at small size and from a
> distance. Provide 2 wing positions (up and down) for a flap animation. Transparent background.*

### 4.6 Nube hecha a mano (upgrade opcional)
> *(estilo base) + A soft fluffy handmade cloud, cotton/felt texture, rounded plump bumps, very soft
> edges, slightly translucent, dreamy. Pure white with a faint warm underside. Single object,
> transparent background. Provide 2 shape variations.*

> Consistencia obligatoria entre todos: **misma textura (fieltro/plush hecho a mano), misma
> iluminación cálida suave, misma paleta pastel, mismo nivel de detalle, fondo transparente.**

---

## 5. Cómo se conecta esto con lo implementado
- Los **sprite sheets** entran sin reescribir nada: `LivingCharacter` ya tiene la estructura para
  cambiar el `<img>` estático por una capa con animación por frames (`steps()`), manteniendo la misma
  personalidad (respiración/bob/balanceo) por encima.
- Las **casitas + molino + colina** entran en una nueva capa de horizonte de `LivingWorld` (entre el
  cielo y los personajes), con su propio factor de parallax — el andamiaje de capas ya existe.
- Mientras tanto, el slice **funciona y se ve premium** sin ninguno de estos assets.
