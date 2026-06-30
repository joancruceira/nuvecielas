# 🔍 Nuvecielas — Auditoría de Frontend (UX / UI / Game Feel)

> **Tipo:** Auditoría profesional de experiencia. **Solo diagnóstico.** No contiene diseño nuevo,
> código, refactors, backend, persistencia ni mecánicas. Es la foto objetiva del estado actual antes
> de seguir con el ecosistema.
> **Método:** evaluación heurística (Nielsen + game UX) anclada en la base de conocimiento
> **UI/UX Pro Max** (estándares de accesibilidad WCAG, touch targets, animación, navegación) y en
> lectura directa del código de las dos aplicaciones.
> **Fecha:** 2026-06-30 · **Versión auditada:** `main` (hub) + `main` (platformer).

---

## 1. Alcance auditado

| Superficie | Stack | Estado | Cobertura |
|---|---|---|---|
| **Launcher / Hub** (`nuvecielas`) | React 19 + Vite + CSS Modules | Auditado por código (8 pantallas, componentes, theme) | ✅ Completa |
| **Mini-juegos del hub** | React | Memoria, Quiz, Pinta con Lunaria, Puzzle | ✅ Completa |
| **Platformer "Bosque Mágico"** (`nuvecielas-platformer`) | Vanilla JS (canvas) | Menú, selección, mapa, juego, HUD, overlays, 2 subniveles | ✅ Completa |
| **"Atrapa las Estrellas"** | Desconocido (3er origen) | Embebido por `<iframe>` desde otro dominio | ⚠️ **No auditable** (caja negra; ver hallazgo X-05) |

> Nota de método: la auditoría es **estática** (lectura de código + heurística). No reemplaza un
> test de usabilidad con niñas reales ni mediciones de performance en dispositivo, que se recomiendan
> como paso complementario (ver §9).

---

## 2. Resumen ejecutivo

Nuvecielas tiene una **base creativa sólida y una identidad con alma** (cielo nocturno, arcoíris,
personajes con carisma, audio procedural ingenioso en el hub, "juice" real en el platformer). El
problema central **no es la falta de calidad, sino la falta de cohesión**: son **dos productos
distintos** que comparten nombre pero no sistema de diseño. El platformer se siente premium; el hub
se siente plano por comparación. Y ambos arrastran deudas transversales de accesibilidad
(movimiento, foco, contraste) y un uso intensivo de **emoji como iconografía estructural** que baja
la percepción de calidad.

**Diagnóstico en una frase:** *dos buenos juegos que todavía no parecen el mismo juego.*

### Scorecard heurístico (0–5)

| Dimensión | Hub | Platformer | Conjunto | Comentario |
|---|:---:|:---:|:---:|---|
| Arquitectura de frontend | 3.5 | 4.0 | 3.0 | Cada uno sano; juntos, sin sistema común |
| Consistencia visual | 3.5 | 3.5 | **2.0** | Coherente intra-app, divergente entre apps |
| Identidad de marca | 3.5 | 3.5 | **2.5** | Misma marca, dos lenguajes visuales |
| Navegación | 2.5 | 3.5 | 2.5 | Hub sin router/back; platformer mejor |
| Flujo entre pantallas | 3.0 | 4.0 | 3.0 | Cortes secos en hub; platformer fluido |
| Onboarding | **1.5** | 3.5 | 2.0 | Hub casi sin tutoriales; platformer sí |
| HUD | 3.0 | 4.0 | 3.0 | HUD del platformer es ejemplar |
| Menús | 3.5 | 4.0 | 3.5 | Ambos correctos |
| Feedback visual | 2.5 | 4.0 | 3.0 | Hub: victorias planas; platformer: con juice |
| Feedback sonoro | 2.5 | 3.5 | 2.5 | Hub sin mute/música; platformer completo pero con bug |
| Animación / microinteracción | 3.0 | 3.5 | 3.0 | Tokens definidos, subutilizados en hub |
| Accesibilidad | **2.0** | **2.0** | **2.0** | Sin reduced-motion, foco parcial, contraste a verificar |
| Tipografía | 3.5 | 3.5 | **2.5** | Buenas fuentes, pero distintas entre apps |
| Color | 4.0 | 3.5 | 3.0 | Hub muy bueno; paletas no unificadas |
| Iconografía | **2.0** | **2.0** | **2.0** | Emoji como iconos estructurales (anti-patrón) |
| Uso del espacio | 3.5 | 3.5 | 3.5 | Correcto en ambos |
| Jerarquía visual | 3.5 | 3.5 | 3.5 | Clara |
| Responsive | 3.0 | 3.5 | 3.0 | Hub fija 430px; platformer fluido |
| Game feel | 2.5 | 4.0 | 3.0 | Brecha notoria entre las dos apps |
| **Promedio** | **2.9** | **3.5** | **2.8** | |

**Lectura:** el platformer (3.5) está claramente por encima del hub (2.9). La nota de **conjunto
(2.8)** cae por debajo de ambos: es la penalización de la incoherencia. La palanca de mayor retorno
es **unificar el lenguaje de diseño** y subir el hub al nivel del platformer.

### Escalas usadas en los hallazgos
- **Gravedad:** 🔴 Crítica · 🟠 Alta · 🟡 Media · 🟢 Baja
- **Impacto en experiencia:** Alto · Medio · Bajo
- **Prioridad:** P0 (ya) · P1 (pronto) · P2 (planificar) · P3 (cuando se pueda)
- **Dificultad:** ▪ S (horas) · ▪▪ M (1–3 días) · ▪▪▪ L (semana+)

---

## 3. Hallazgos por área

### 3.1 Arquitectura del frontend
**Qué funciona:** Hub con separación limpia (`data/`, `components/`, `screens/`, `hooks/`, `types/`,
`utils/`). Platformer vanilla pero **muy bien modularizado y data-driven** (agregar personaje/nivel =
tocar un archivo). Orden de carga explícito y documentado.
**Qué no:** No existe **ningún sistema compartido** entre las dos apps (ni tokens, ni componentes, ni
fuentes). Conviven dos paradigmas (React vs vanilla) sin capa común. En el hub hay **deuda de
plantilla** y duplicación de tipos.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| A-01 | `src/index.css` (hub) es CSS de plantilla Vite que choca con `theme.css` y se neutraliza con `!important` | 🟡 | Bajo | P2 | ▪ S |
| A-02 | Tipos duplicados: `types/index.ts` y `types/types-index.ts` (este último desactualizado, sin `quiz`/`puzzle`) | 🟡 | Bajo | P2 | ▪ S |
| A-03 | No hay design system compartido (tokens/fuentes/componentes) entre hub y platformer | 🟠 | Alto | P1 | ▪▪▪ L |
| A-04 | Mutación de estado en Puzzle (`handleTileClick` clona el array pero muta objetos compartidos) | 🟡 | Bajo | P2 | ▪ S |

### 3.2 Consistencia visual
**Qué funciona:** Dentro de cada app hay coherencia (el hub con su glass oscuro + acentos por
personaje; el platformer con su glassmorphism de bosque). `theme.css` define tokens reutilizables.
**Qué no:** **Entre apps, los lenguajes no coinciden** — paleta base, fuentes, tratamiento de
botones, estilo de overlays y "voz" visual son distintos. Cada pantalla del hub redefine su propio
header/back en su `.module.css` → micro-divergencias (tamaños de "← Volver", paddings).

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| V-01 | Lenguaje visual divergente hub ↔ platformer (rompe la sensación de "un solo producto") | 🟠 | Alto | P1 | ▪▪▪ L |
| V-02 | Cada pantalla del hub reimplementa header/back/stats → inconsistencias sutiles | 🟡 | Medio | P2 | ▪▪ M |
| V-03 | Sin librería de componentes UI compartida (Button, Header, Overlay, StatPill) | 🟠 | Medio | P1 | ▪▪ M |

### 3.3 Identidad de marca
**Qué funciona:** Marca con personalidad clara (Nuvecielas, mundo mágico, personajes hand-made,
cielo estrellado). El hub la expresa muy bien en Home.
**Qué no:** La marca **no se aplica de forma sistemática**: el platformer usa otra tipografía
(Fredoka) y otra ambientación (bosque), y no hay un logotipo/marca consistente entre las dos puertas
de entrada. No hay un "sello" reconocible compartido (logo, color primario único, jingle).

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| B-01 | Sin tipografía de marca única (Bubblegum Sans en hub vs Fredoka en platformer) | 🟠 | Alto | P1 | ▪ S |
| B-02 | Sin logotipo/lockup de marca consistente entre las dos apps | 🟡 | Medio | P2 | ▪▪ M |
| B-03 | Sin "sello" sonoro de marca (jingle al abrir) — refuerzo de identidad ausente | 🟢 | Bajo | P3 | ▪ S |

### 3.4 Navegación
**Qué funciona:** Hub con `BottomNav` (3 destinos, `aria-current`, labels). Platformer con flujo de
pantallas claro (Menú → Selección → Mapa → Juego → Overlay) y un **overworld** con nodos/candados.
**Qué no:** El hub **no tiene router**: navega por `useState`, así que **el botón "atrás" del
navegador abandona la app** (anti-patrón High según WCAG/UX) y **ninguna pantalla es enlazable**
(sin deep-link). La bottom-nav **desaparece** en pantallas fullscreen; el regreso depende de botones
"← Volver" propios y heterogéneos.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| N-01 | Hub sin router: el "atrás" del navegador sale de la app; sin deep-linking | 🟠 | Alto | P1 | ▪▪ M |
| N-02 | Botones "← Volver" inconsistentes entre pantallas (posición/estilo) | 🟡 | Medio | P2 | ▪ S |
| N-03 | Bottom-nav oculta en fullscreen sin reemplazo uniforme de navegación | 🟡 | Medio | P2 | ▪ S |
| N-04 | Platformer: "Ver logros" (overlay de fin de nivel) no lleva a ningún destino | 🟡 | Medio | P2 | ▪ S |

### 3.5 Flujo entre pantallas
**Qué funciona:** Flujos cortos y predecibles en ambos. El platformer encadena con sentido
(selección → mapa → nivel → recompensa → mapa).
**Qué no:** En el hub, las transiciones son **cortes secos** (cambia `screen` sin animación), pese a
que `theme.css` ya define `nw-slide-up`/`nw-bounce-in`. Los overlays de victoria aparecen sin
entrada. Falta continuidad espacial (dirección de entrada/salida).

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| F-01 | Transiciones de pantalla en hub son cortes secos (animaciones ya existen sin usar) | 🟡 | Medio | P1 | ▪▪ M |
| F-02 | Overlays (victoria/derrota) aparecen sin animación de entrada en ambos | 🟡 | Medio | P2 | ▪ S |

### 3.6 Onboarding
**Qué funciona:** El platformer tiene pantalla **"Cómo jugar"** (teclas, habilidades, niveles) y
cinemáticas que se ven una sola vez — buen onboarding contextual.
**Qué no:** El **hub casi no tiene onboarding**: Quiz y Puzzle traen una línea de instrucción;
**Memoria y Pintar no explican nada**. No hay bienvenida, ni guía de primera vez, ni explicación de
herramientas (los iconos de Pintar son solo emoji con `title`).

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| O-01 | Hub sin onboarding de primera vez (Memoria/Pintar sin instrucciones) | 🟠 | Alto | P1 | ▪▪ M |
| O-02 | Pintar: herramientas solo identificadas por emoji + `title` (no descubrible en táctil) | 🟡 | Medio | P2 | ▪ S |

### 3.7 HUD de cada juego
**Qué funciona:** **El HUD del platformer es ejemplar**: corazones individuales con heartbeat en HP
bajo, contador de estrellas con bounce al recoger, nombre de nivel y personaje, botón de pausa y de
audio, glassmorphism coherente. Los HUD del hub (Memoria: movimientos; Quiz: barra de progreso;
Puzzle: movimientos + guía) son claros.
**Qué no:** Cada HUD del hub está **dibujado a mano en su CSS** (sin componente común) → divergencia.
Falta marca persistente ("tu récord"). En el platformer, el contador de estrellas tiene **doble
semántica** (cuenta coleccionables, pero el mapa lo capa a 3).

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| H-01 | HUD del hub sin componente compartido (cada juego reimplementa stats) | 🟡 | Medio | P2 | ▪▪ M |
| H-02 | Platformer: "estrellas" significan cosas distintas en HUD (conteo) vs mapa (rating ≤3) | 🟡 | Medio | P2 | ▪ S |

### 3.8 Menús
**Qué funciona:** Menú principal del platformer (Jugar / Cómo jugar / audio) limpio y temático.
Selección de personaje con habilidades. Grilla de juegos del hub clara con tarjetas.
**Qué no:** Detalles menores: en el hub, la pantalla "Juegos" mezcla un destacado (Bosque Mágico,
link externo) con la grilla de mini-juegos sin una jerarquía de "primario vs secundario" del todo
resuelta.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| M-01 | Hub "Juegos": destacado externo y grilla interna sin jerarquía clara de acción primaria | 🟢 | Bajo | P3 | ▪ S |

### 3.9 Feedback visual
**Qué funciona:** Platformer con **juice real**: partículas, flashes de pantalla, textos flotantes
("❄️ Congelado!", "¡JEFE DERROTADO!"), parallax, cámara con lerp. Quiz del hub con estados
verde/rojo/dimmed claros. Memoria con flip.
**Qué no:** Las **victorias del hub son estáticas** (trofeo + texto), sin confeti, sin "count-up" de
recompensa, sin reacción de personaje. Hay una **brecha de game feel** marcada: el platformer
celebra, el hub informa.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| FV-01 | Victorias del hub sin celebración (sin partículas/confeti/count-up) | 🟠 | Alto | P1 | ▪▪ M |
| FV-02 | Sin feedback de "presión" (`:active`/scale) marcado en piezas de juego del hub | 🟡 | Medio | P2 | ▪ S |
| FV-03 | Brecha de game feel hub ↔ platformer (uno celebra, otro informa) | 🟠 | Alto | P1 | ▪▪ M |

### 3.10 Feedback sonoro
**Qué funciona:** Hub con **audio procedural** ingenioso (tap/success/error/win con Web Audio, sin
assets). Platformer con **música por nivel + sfx por evento + mute + desbloqueo móvil + fade**.
**Qué no:** El hub **no tiene mute ni música de fondo** (problema para padres). El platformer **no
persiste** el mute entre sesiones. Y arrastra un **bug que rompe la música del nivel 1 en
producción** (mayúsculas del nombre de archivo). Niveles 3–5 del platformer sin música.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| FS-01 | Platformer: música nivel 1 rota en prod (`CANCION_NUVE.mp3` vs `cancion_nuve.mp3`, server case-sensitive) | 🔴 | Alto | P0 | ▪ S |
| FS-02 | Hub sin control de sonido (mute) — esencial para uso infantil/parental | 🟠 | Alto | P1 | ▪ S |
| FS-03 | Hub sin música de fondo | 🟡 | Medio | P2 | ▪▪ M |
| FS-04 | Platformer: mute no persiste entre sesiones | 🟡 | Medio | P2 | ▪ S |
| FS-05 | Platformer: niveles 3–5 sin música asignada | 🟡 | Medio | P2 | ▪ S |

### 3.11 Animaciones y microinteracciones
**Qué funciona:** `theme.css` del hub define un catálogo (float, slide-up, bounce-in, pulse, rainbow,
twinkle). `playTap()` global. Platformer con animaciones de sprites, cámara y partículas.
**Qué no:** El catálogo del hub está **subutilizado** (transiciones secas, overlays sin entrada).
Faltan microinteracciones de "premio" (cromo que brilla, badge con pulso). **Ninguna de las dos apps
respeta `prefers-reduced-motion`** y ambas tienen animaciones infinitas (rainbow hue-rotate, twinkle,
floats) → riesgo de accesibilidad (severidad alta).

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| AN-01 | Catálogo de animaciones del hub definido pero subutilizado en transiciones/overlays | 🟡 | Medio | P1 | ▪ S |
| AN-02 | Microinteracciones de recompensa ausentes (no hay "juice" de premio en el hub) | 🟡 | Medio | P2 | ▪▪ M |

### 3.12 Accesibilidad
**Qué funciona:** Hub con buen uso de `aria-label`, `role`, `aria-live="polite"` en overlays,
`aria-current`. Platformer con controles táctiles grandes y háptica en un subnivel.
**Qué no:** **`prefers-reduced-motion` no se respeta en ninguna app** (anti-patrón High). Foco de
teclado parcial (`CharacterCard` solo escucha `Enter`, no `Space`; sin `:focus-visible` evidente).
Contraste a verificar en textos sobre gradientes claros de personaje. Sin opciones de accesibilidad
(texto grande, alto contraste, movimiento reducido). Emoji con significado a veces sin texto
alternativo equivalente.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| AC-01 | `prefers-reduced-motion` ignorado en ambas apps (animaciones infinitas) | 🟠 | Alto | P1 | ▪ S |
| AC-02 | Foco de teclado parcial en hub (Space no maneja; `:focus-visible` ausente) | 🟠 | Medio | P1 | ▪ S |
| AC-03 | Contraste a verificar: texto claro sobre gradientes claros de personaje (objetivo 4.5:1) | 🟠 | Alto | P1 | ▪▪ M |
| AC-04 | Sin panel/preferencias de accesibilidad (texto, contraste, motion, sonido) | 🟡 | Medio | P2 | ▪▪ M |
| AC-05 | Touch targets a verificar en piezas de puzzle y swatches de Pintar (objetivo 44×44) | 🟡 | Medio | P2 | ▪ S |

### 3.13 Tipografía
**Qué funciona:** Ambas usan parejas adecuadas para público infantil (display redondeado + Nunito
para cuerpo). Tamaños generalmente legibles.
**Qué no:** **La display difiere entre apps** (Bubblegum Sans vs Fredoka) → la marca "habla con dos
voces". No hay escala tipográfica documentada compartida. (Referencia UI/UX Pro Max para kids:
Baloo 2 + Comic Neue — no es obligatorio adoptarla, pero sí **elegir una sola** familia de marca.)

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| T-01 | Display de marca distinta entre hub y platformer | 🟠 | Alto | P1 | ▪ S |
| T-02 | Sin escala tipográfica compartida documentada | 🟡 | Bajo | P2 | ▪ S |

### 3.14 Colores
**Qué funciona:** Hub con sistema de color **muy bueno**: tokens semánticos en `theme.css`, acentos
por personaje, gradiente arcoíris de marca, fondo nocturno coherente. Platformer con paletas por
nivel/ambiente bien resueltas.
**Qué no:** Las paletas **no están unificadas** entre apps (no hay un primario de marca único ni
tokens compartidos). Riesgo de contraste en algunos pares texto/gradiente (ver AC-03).

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| C-01 | Paletas no unificadas (sin color primario de marca ni tokens compartidos) | 🟡 | Medio | P1 | ▪▪ M |

### 3.15 Iconografía
**Qué funciona:** Los emoji aportan calidez y son universalmente entendibles por niñas.
**Qué no:** **Uso de emoji como iconografía estructural** en navegación, botones, herramientas y HUD
(anti-patrón explícito de UI/UX Pro Max: dependientes de fuente del sistema, inconsistentes entre
plataformas/SO, no theme-ables, no escalan como vector controlado). Es el factor que más baja la
percepción "indie premium" de forma transversal. No hay un set de iconos vectoriales propio.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| I-01 | Emoji como iconos estructurales (nav, botones, tools, HUD) en ambas apps | 🟠 | Alto | P1 | ▪▪▪ L |
| I-02 | Sin set de iconos vectoriales de marca (consistencia de trazo/tamaño) | 🟡 | Medio | P2 | ▪▪ M |

### 3.16 Uso del espacio
**Qué funciona:** Ambas apps usan el espacio con holgura, sin saturar; ritmo de padding razonable;
"marco de tablet" del hub en desktop es un recurso elegante.
**Qué no:** Menores: en pantallas con scroll del hub, reservar bien el espacio del bottom-nav fijo;
verificar que en teléfonos chicos nada quede cramped.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| U-01 | Verificar densidad/espaciado en teléfonos pequeños (≤360px) | 🟢 | Bajo | P3 | ▪ S |

### 3.17 Jerarquía visual
**Qué funciona:** Títulos display claros, CTAs diferenciados (primario/secundario), tarjetas con foco.
Jerarquía generalmente legible.
**Qué no:** Puntual: en "Juegos" del hub conviven dos acciones fuertes sin un primario inequívoco
(ver M-01). En overlays, el orden de acciones podría jerarquizarse mejor.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| J-01 | Acción primaria no siempre única por pantalla (regla "un CTA primario") | 🟢 | Bajo | P3 | ▪ S |

### 3.18 Responsive
**Qué funciona:** Platformer fluido (canvas que se ajusta al viewport, controles móviles, safe-area
meta). Hub con "marco de tablet" en desktop y ancho fijo 430px en móvil.
**Qué no:** El hub está **anclado a 430px**: en móviles más anchos no aprovecha el ancho, y conviene
verificar comportamiento en landscape y en pantallas muy chicas. No es "mobile-first escalable" sino
"un tamaño con marco".

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| R-01 | Hub anclado a 430px (no escala a anchos mayores; verificar landscape) | 🟡 | Medio | P2 | ▪▪ M |

### 3.19 Consistencia launcher ↔ juegos
**Qué funciona:** Conceptualmente, el hub es la puerta y los juegos cuelgan de él.
**Qué no:** Es **el eje más débil del conjunto**. Diferencias acumuladas: fuentes distintas (T-01),
estilo visual distinto (V-01), audio distinto (procedural vs mp3), patrones de "volver" distintos
(N-02), persistencia distinta (none vs localStorage), HUD distinto, y semánticas de "estrella"
distintas (H-02). Además "Atrapa las Estrellas" es una **caja negra** embebida de otro origen, de
estilo desconocido. El usuario percibe **tres mundos**, no uno.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| X-01 | Discontinuidad global de marca/estilo entre launcher y juegos | 🟠 | Alto | P1 | ▪▪▪ L |
| X-05 | "Atrapa las Estrellas" embebido (3er origen) sin auditar — estilo/idioma desconocidos | 🟡 | Medio | P2 | ▪▪ M |

### 3.20 Game feel (sensación general de calidad)
**Qué funciona:** El platformer **tiene game feel premium**: respuesta, partículas, cámara, sonido,
háptica. Es lo mejor del ecosistema.
**Qué no:** El hub **se siente más "web de actividades" que "juego"**: faltan la respuesta táctil
(scale/active), la celebración y la continuidad que sí tiene el platformer. La inconsistencia entre
ambos rompe la inmersión del conjunto.

| ID | Hallazgo | Gravedad | Impacto | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|:---:|
| G-01 | Hub sin game feel (respuesta/celebración/continuidad) al nivel del platformer | 🟠 | Alto | P1 | ▪▪ M |

---

## 4. Bugs funcionales detectados (no son UX, pero degradan la experiencia)

> Documentados, no corregidos (según consigna). Detalle ampliado en `ECOSISTEMA_NUVECIELAS.md` §II.6.

| ID | Bug | Gravedad | Prioridad | Dificultad |
|---|---|:---:|:---:|:---:|
| FS-01 | Música nivel 1 rota en prod (case del nombre de archivo) | 🔴 | P0 | ▪ S |
| BUG-02 | Nivel 5 ("Lago") inalcanzable: existe en `LEVELS` pero no tiene nodo en el mapa | 🟠 | P1 | ▪ S |
| BUG-03 | Nombres de nivel divergentes entre `index.html`, `levelmap.js` y `levelN.data.name` | 🟡 | P2 | ▪ S |
| BUG-04 | Hub declara "4 niveles"; hay 5 + 2 subniveles | 🟢 | P2 | ▪ S |

---

## 5. Mapa de calor (gravedad × cantidad)

```
🔴 Crítica (1):  FS-01
🟠 Alta (12):    A-03 V-01 V-03 N-01 O-01 FV-01 FV-03 FS-02 AC-01 AC-02 AC-03 T-01 I-01 X-01 G-01  (alto impacto, el grueso del trabajo)
🟡 Media (22):   A-01 A-02 A-04 V-02 B-02 N-02 N-03 N-04 F-01 F-02 O-02 H-01 H-02 FS-03 FS-04 FS-05 AN-01 AN-02 AC-04 AC-05 C-01 I-02 R-01 X-05 ...
🟢 Baja (5):     B-03 M-01 U-01 J-01 BUG-04
```

**Concentración del problema:** accesibilidad (5 hallazgos), consistencia entre apps (X-01, V-01,
T-01, B-01, C-01), iconografía (I-01/I-02) y game feel del hub (FV-01, FV-03, G-01). Son **cuatro
frentes** que, atacados, suben la nota de conjunto de 2.8 a un rango premium.

---

## 6. Roadmap priorizado de mejoras de frontend

> Clasificado por esfuerzo/impacto. **Solo frontend**, sin backend/persistencia/mecánicas (eso queda
> para la fase de ecosistema, ya documentada aparte).

### ⚡ Quick Wins — alto impacto, bajo esfuerzo (P0–P1, dificultad S)
1. **FS-01** — Arreglar el case del nombre de archivo de música (devuelve la música del nivel 1). *Una línea, impacto inmediato.*
2. **FS-02** — Botón de mute en el hub (silenciar `playTap`/sfx). *Imprescindible para padres.*
3. **AC-01** — Envolver animaciones infinitas en `@media (prefers-reduced-motion: reduce)`. *Accesibilidad alta a costo bajo.*
4. **AC-02** — Foco de teclado: manejar `Space` + `:focus-visible` en `CharacterCard` y botones.
5. **B-01 / T-01** — Unificar la tipografía display de marca (elegir una y aplicarla en ambas apps).
6. **AN-01 / F-01** — Activar las transiciones/overlay-entradas ya definidas en `theme.css` (cero CSS nuevo, solo usarlas).
7. **A-01 / A-02 / A-04** — Higiene de código: limpiar `index.css`, borrar tipo duplicado, fijar mutación de Puzzle.
8. **N-04 / BUG-02 / BUG-03 / BUG-04** — Coherencia del platformer: quitar/derivar "Ver logros", agregar nodo del nivel 5, unificar nombres, corregir copy del hub.

### 🔧 Mejoras medianas — impacto medio/alto, esfuerzo M (P1–P2)
9. **FV-01 / FV-03 / G-01** — Capa de celebración para el hub (confeti/partículas + count-up + `:active`) → cierra la brecha de game feel.
10. **V-02 / V-03 / H-01** — Librería de componentes UI compartida del hub (ScreenHeader, BackButton, Overlay, StatPill) → mata las micro-inconsistencias.
11. **O-01 / O-02** — Onboarding de primera vez para mini-juegos del hub (overlay 1–2 pasos, skippable) + etiquetas de herramientas en Pintar.
12. **N-01** — Router con hash-routes en el hub (arregla "atrás" y habilita deep-links) — compatible con GitHub Pages.
13. **AC-03 / AC-05 / C-01** — Auditoría de contraste (4.5:1) y touch targets (44×44); definir color primario de marca.
14. **FS-03 / FS-04 / FS-05** — Música de fondo en el hub; persistir mute; asignar música a niveles 3–5.

### 🏗️ Mejoras estructurales — esfuerzo L, base del ecosistema (P1)
15. **A-03 / V-01 / X-01** — **Design system compartido** (tokens, fuentes, componentes) aplicado a las dos apps → "un solo producto". *La palanca de mayor retorno del documento.*
16. **I-01 / I-02** — Migrar iconografía estructural de emoji → set vectorial de marca (mantener emoji solo donde sea decorativo/expresivo).
17. **AC-04** — Panel de preferencias de accesibilidad (texto grande, alto contraste, movimiento reducido, sonido) compartido.
18. **R-01** — Estrategia responsive del hub (escalar más allá de 430px; verificar landscape y ≤360px).

### 🌟 Mejoras aspiracionales — premium / largo plazo (P2–P3)
19. **B-02 / B-03** — Lockup de marca consistente + sello sonoro (jingle) compartido.
20. **X-05** — Auditar y alinear "Atrapa las Estrellas" (3er origen) al sistema de diseño, o reabsorberlo.
21. **Mundo vivo** — parallax sutil, estrella fugaz ocasional, personajes que "respiran" (game feel ambiental) — respetando reduced-motion.
22. **Test de usabilidad con niñas reales** — validar las hipótesis de esta auditoría con las jugadoras objetivo (ver §9).

---

## 7. Secuencia recomendada (sin comprometer alcance)

```
Sprint 0 (días):    Quick Wins 1–8  → arreglos y coherencia inmediata, riesgo ~0
Sprint 1 (1-2 sem): Estructural 15 (design system)  → desbloquea todo lo demás
Sprint 2 (1-2 sem): Medianas 9,10,11  → game feel + componentes + onboarding
Sprint 3 (1 sem):   Medianas 12,13,14 + Estructural 16 (iconos)
Sprint 4+:          Estructurales 17,18 + Aspiracionales
```

El **design system compartido (15)** es la pieza que conviene hacer temprano: casi todas las
mejoras medianas y estructurales se apoyan en él. Hacerlo después obliga a retrabajo.

---

## 8. Lo que NO hay que tocar (preservar)
- El **audio procedural** del hub (ingenioso, sin assets).
- El **game feel y la arquitectura data-driven** del platformer.
- El **sistema de color y los tokens** del hub (`theme.css`) — son una buena base del design system.
- El **overworld, checkpoints, cinemáticas y subniveles** del platformer.
- El tono dulce, el lore y los personajes — la identidad emocional ya es un activo.

## 9. Recomendaciones de validación (complemento a esta auditoría)
- **Test con usuarias reales** (las mellizas + 2-3 niñas de 8-12): 5 tareas guiadas, observación.
- **Medición en dispositivo**: performance del platformer en tablet/celular gama media (FPS, carga).
- **Pase de contraste automatizado** (axe/Lighthouse) en el hub.
- **Re-test tras Sprint 1** para confirmar que el design system subió la nota de conjunto.

---

### Apéndice · Índice de hallazgos por gravedad
- 🔴 **Crítica:** FS-01
- 🟠 **Alta:** A-03, V-01, V-03, N-01, O-01, FV-01, FV-03, FS-02, AC-01, AC-02, AC-03, T-01, I-01, X-01, G-01, B-01, BUG-02
- 🟡 **Media:** A-01, A-02, A-04, V-02, B-02, N-02, N-03, N-04, F-01, F-02, O-02, H-01, H-02, FS-03, FS-04, FS-05, AN-01, AN-02, AC-04, AC-05, C-01, I-02, R-01, X-05, BUG-03
- 🟢 **Baja:** B-03, M-01, U-01, J-01, BUG-04

*Fin de la auditoría. Próximo paso sugerido: validar este documento y, una vez aprobado, continuar
con el diseño del ecosistema, el Taller de Nuvecielas y el backend de persistencia.*
