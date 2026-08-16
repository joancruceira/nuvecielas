# 🌌 Nuvecielas — Brainstorming: ¿en qué puede convertirse este universo?

> **Estado:** documento de exploración. **Nada implementado.**
> **Método:** inspección del código real de los 3 orígenes + la web pública, no de los docs previos.
> **Fecha:** 2026-08-16.

---

## ⚠️ Tres correcciones al brief, antes de empezar

Pediste que no asumiera que los nombres del brief coinciden con la implementación. Correcto:

1. **"Bosque de palabras" no existe.** No hay ningún juego de palabras en ninguno de los tres
   orígenes (`grep` sobre hub + platformer: cero resultados). Lo más parecido es **"Bosque Mágico"**
   (el platformer, que no tiene nada de palabras) y **"Quiz Estelar"** (trivia de lore, no de
   lenguaje). Lo trato en la sección **E** como **diseño desde cero**, no como evolución — y esa es
   una buena noticia: podemos diseñarlo bien de entrada en vez de arrastrar decisiones viejas.

2. **"Atrapa las Estrellas" es, por lejos, el juego más evolucionado del ecosistema** — más que
   cualquier mini-juego nativo del hub. Tiene 5 niveles, 4 personajes con poderes asimétricos,
   4 tipos de power-up, clima, música, récord persistente. El brief lo trata como un juego simple;
   no lo es. Eso cambia la prioridad: no hay que "subirlo de nivel", hay que **conectarlo**.

3. **Hay un personaje escondido en el código.** `Estrellaria.png` existe, se usa como carta en
   Memoria Mágica… y **no está en `CHARACTERS`**. Es un personaje sin ficha, sin lore y sin lugar.
   Es una oportunidad regalada (sección H).

---

# A. ESTADO ACTUAL — qué tenemos realmente

## A.1 La topografía real: tres aplicaciones, tres orígenes

| # | Qué es | Tecnología | Dónde vive | Persistencia |
|---|---|---|---|---|
| 1 | **Hub / Manolandia** | React 19 + Vite + TS, CSS Modules | `www.nuvecielas.com.ar` | ❌ **cero** |
| 2 | **Bosque Mágico** (platformer) | Vanilla JS IIFE, ~15.800 líneas, sin build | `nuvebosque.nuvecielas.com.ar` | ✅ `nuvecielas_unlocked`, `nuvecielas_stars_N`, `nuve_cin_*` |
| 3 | **Atrapa las Estrellas** | Vanilla JS IIFE, 1 archivo de ~54 KB | `stars.nuvecielas.com.ar` | ✅ `nuve_best`, `nuve_muted` |

El hub embebe (2) por link externo y (3) por `<iframe>` (`GameFrameScreen`). **Los tres orígenes
tienen `localStorage` aislado por política del navegador**: el hub literalmente no puede leer que la
nena terminó el nivel 3 ni que hizo 480 puntos. Esto no es un detalle técnico — es el motivo por el
que hoy no existe universo, sino tres apps con la misma paleta.

## A.2 Inventario del hub (lo que la nena ve)

**8 pantallas**, navegadas por `useState` en `App.tsx` (no hay router, no hay URL, el "atrás" del
navegador sale del sitio).

| Pantalla | Qué hace realmente |
|---|---|
| **Home / Manolandia** | `LivingWorld` (cielo por hora del día, parallax, nubes, pajarito, mariposa, estrella fugaz) + 4 `LivingCharacter` animados con personalidad propia + 2 botones |
| **Conocé al grupo** | 4 fichas de personaje (poder, rasgos, favorito) + 3 "creadoras" (Nina, Jazmín, Natan) |
| **Juegos** | Card destacada del platformer + grilla de 5 mini-juegos |
| **Memoria Mágica** | 8 pares fijos = 16 cartas. Rating ⭐⭐⭐ por movimientos. Sin niveles |
| **Quiz Estelar** | **7 preguntas totales**, elige 5 al azar. 4 rangos de resultado |
| **Pinta con Lunaria** | **1 sola lámina** (el Duomo de Milán). Balde (flood fill), pincel, brillos, deshacer (8 pasos), limpiar, guardar-a-PNG |
| **Reto Nuveciela** | Puzzle 3×3 por swap, sobre la foto de un personaje. Contador de movimientos |
| **Atrapa las Estrellas** | `<iframe>` a otro origen |

## A.3 Anatomía de "Atrapa las Estrellas" (el que subestimamos)

Leído de `game.js` en producción:

- **Bucle:** 60 s, canvas 900×520, atrapás estrellas ⭐ y esquivás nubes ☁️, 3 vidas.
- **5 niveles por tiempo** (`LEVEL_STEP = 12s`), cada uno con su fondo pintado:
  amanecer → pradera → montaña → mar → noche, con transición cruzada entre escenas.
- **4 personajes con poder propio**, que se carga atrapando estrellas:
  🌈 Escudo Arcoíris (Nuveciela) · 🧲 Imán Estelar (Ciela) · ☀️ Rayo de Sol (Lunaria) · ❄️ Hielo Mágico (Nuve).
- **4 power-ups** que caen: imán, tiempo, bloqueo, arcoíris. Además copos de nieve, relámpagos,
  fondo arcoíris animado, partículas, textos flotantes, shake de cámara.
- **Dificultad escalada** por nivel (`settingsForLevel`): frecuencia y velocidad de spawn.
- **Nombre de jugadora** pedido al inicio… y usado solo en el HUD de esa partida.
- Música de fondo + pool de SFX pre-instanciado (bien resuelto para móvil).

Esto es un arcade completo y con buen *game feel*. Su problema no es de diseño de juego: es que
**es un satélite**. Pide un nombre, no lo recuerda. Da un récord, que nadie más ve.

## A.4 Anatomía del platformer

5 niveles + 1 subnivel especial, con **mapa de niveles ya construido** (`Levelmap.js`, nodos sobre
un camino SVG sinuoso, estrellas por nivel, desbloqueo progresivo), cinemáticas con flag de
"ya vista", 14 archivos de audio reales (`.m4a`), sistema de enemigos por nivel, jefes, cajas
regalo, puertas mágicas. El nodo `sub` es **"¡Misión urgente! — ¡Han atrapado a Pablo!"**.

Es la pieza con más mundo del ecosistema, y la única que ya resolvió progresión + mapa + música.

---

# B. LO MEJOR QUE YA TENEMOS — proteger y amplificar

1. **La premisa.** Personajes hechos a mano por dos nenas reales, que viven en Manolandia, mientras
   sus creadoras atienden urgencias en la Tierra. Es un activo que ningún estudio puede copiar. No
   se toca: se pone en el centro.
2. **`LivingWorld` + `LivingCharacter`.** El launcher ya respira: cielo que cambia con la hora real,
   parallax suave, personalidades expresadas solo con parámetros de movimiento
   (`breatheDur`, `bobDist`, `swayDeg`, `emote`), `prefers-reduced-motion` respetado, capa
   `aria-hidden` y no bloqueante. Es la mejor pieza de código del hub y el mejor pedazo de dirección
   creativa ejecutada. **Es el cimiento de todo lo demás.**
3. **El motor de "Atrapa las Estrellas".** Poderes asimétricos por personaje, escenas por nivel,
   power-ups, clima. Es un motor de arcade reutilizable, no un juguete.
4. **El `Levelmap` del platformer.** Ya existe un mapa navegable con desbloqueo y estrellas. No hay
   que inventar el paradigma de mapa: hay que decidir si el mapa del universo lo *envuelve*.
5. **La biblia de personajes.** `characters.ts` tiene poder, rasgos, favorito, color primario,
   gradiente y color de texto por personaje. Es *design tokens de personaje*, y ya está siendo
   consumido por 3 pantallas distintas. Muy bien pensado.
6. **El motor de pintura.** `PaintScreen` tiene flood-fill real sobre máscara de líneas horneada
   (luminancia < 110 = pared), 3 capas de canvas (relleno / líneas / FX) y composición `multiply`
   al exportar. Está resuelto de verdad; solo tiene **una lámina**.
7. **El sonido procedural del hub** (`audio.ts`): tap, éxito, error, victoria con Web Audio, sin
   assets. Barato y consistente.

---

# C. PROBLEMAS Y OPORTUNIDADES — qué limita hoy la experiencia

Ordenados por cuánto frenan el crecimiento del universo.

### C.1 🔴 Tres orígenes = tres memorias aisladas *(bloqueante estructural)*
Nada de lo que la nena hace en un lugar existe en otro. Sin esto resuelto, **cualquier idea de
colección, desbloqueo o progreso compartido es imposible**, por más que la diseñemos bien.

### C.2 🔴 El hub no recuerda absolutamente nada
Cero `localStorage` en todo `src/`. No sabe cómo se llama la nena, si ya jugó, qué ganó, qué pintó.
Cada visita es la primera visita. Es la causa raíz de que no haya apego.

### C.3 🔴 Los dibujos se van a la carpeta Descargas
`PaintScreen.save()` dispara un `<a download>`. Para una nena de 8 años, eso es **perder el dibujo**:
no hay galería, no hay "mis creaciones", no lo puede mostrar dentro del mundo. Lo más creativo de
todo el proyecto termina fuera del proyecto.

### C.4 🟠 Una sola lámina, y ni siquiera es de Nuvecielas
El único dibujo para pintar es el **Duomo de Milán**. El código ya soporta N láminas (el selector se
oculta solo si `LAMINAS.length <= 1`). Falta contenido, no código. Es la mayor desproporción
esfuerzo/impacto de todo el proyecto.

### C.5 🟠 El contenido se agota en dos partidas
Quiz: 7 preguntas para tiradas de 5 → la segunda partida ya repite casi todo.
Memoria: siempre las mismas 8 caras, siempre 4×4.
Puzzle: siempre 3×3, 4 imágenes.
No hay dificultad, ni variedad, ni motivo para volver.

### C.6 🟠 El mundo enmudece justo cuando entrás a jugar
El launcher tiene atmósfera pero **el hub no tiene música**, solo bips. Y en el momento de mayor
emoción —ganar— la respuesta es un texto y un emoji. El platformer y stars *sí* tienen música. El
"mundo" es la única parte silenciosa del mundo.

### C.7 🟠 Nadie habla
Lunaria es la anfitriona (`hostess: true`) y tiene 4 frases definidas en `config.ts`. Es todo el
diálogo del universo. Los personajes tienen personalidad en los datos y en el movimiento, pero
**voz cero**. Un mini-juego que se gana sin que nadie se alegre no se siente parte de un mundo.

### C.8 🟡 Navegación sin URL
`App.tsx` navega con `useState`. Consecuencias reales: el botón "atrás" del teléfono **sale del
sitio** (frustrante y frecuente en chicos), no se puede compartir un link a un juego, no se puede
recargar sin volver al inicio. Es barato de arreglar y se nota mucho.

### C.9 🟡 "Reto Nuveciela" tiene una fricción de diseño
El puzzle se resuelve por *swap de dos toques* sin arrastre, y muestra la imagen de referencia al
lado. Funciona, pero un 3×3 sobre una foto es trivial para una nena de 10 y confuso para una de 5:
está en la tierra de nadie de la dificultad.

### C.10 🟡 Los juegos son islas visuales
Cada pantalla tiene su propio header, su propio botón "← Volver", su propia celebración. No hay un
lenguaje común de entrada/salida/victoria. Entrar a un juego se siente como cambiar de canal.

### 🟢 Oportunidades que están servidas
- La lámina del Duomo prueba que **las láminas pueden venir de fotos reales de las nenas**.
- Los PNG de personajes ya sirven como **sellos/stickers** sin producir nada nuevo.
- `Estrellaria` existe como imagen y no tiene ficha: es un personaje esperando nacer.
- El platformer ya tiene **mapa, música y cinemáticas**: el hub puede tomarle prestado el lenguaje.

---

# D. ATRAPA LAS ESTRELLAS — ideas de evolución

**Gameplay actual:** arcade de 60 segundos. Movés a tu Nuveciela en horizontal (flechas o arrastre),
atrapás estrellas, esquivás nubes, tenés 3 vidas. Cada estrella carga tu poder; el poder se dispara
con un botón. Cada 12 s subís de nivel y cambia la escena y la dificultad.

**Qué funciona:** el *feel* es bueno (partículas, shake, textos flotantes, glow). Los poderes por
personaje son una decisión de diseño excelente. Las 5 escenas pintadas dan sensación de viaje. Los
60 segundos son la duración correcta para una nena.

**Qué lo hace aburrido a la 5ª partida:** las tres cosas que definen una partida —duración, orden de
niveles y objetivo— **son siempre idénticas**. El único objetivo es "más puntos que la vez pasada", y
ese objetivo solo le habla a quien ya juega bien. No hay nada que *conseguir*, solo un número que
subir. Y nada de lo que pasa ahí adentro existe fuera del iframe.

| # | Idea | Por qué | Niño | Diver | Creat | Técn | Reutil |
|---|---|---|---|:--:|:--:|:--:|:--:|:--:|
| **D1** | **Constelaciones** — cada partida tenés una constelación que completar (ej. "atrapá 3 estrellas rosas"). Al completarla se **dibuja en el cielo del hub**, para siempre | Convierte "hacer puntos" en **conseguir algo que se ve en otro lado**. Es el enganche jugar→coleccionar más barato que existe | 10 | 9 | 6 | 5 | 9 |
| **D2** | **Estrellas con nombre** — 1 de cada ~30 es una estrella rara y nombrada ("Estrella de Nina", "Estrella del Primer Día") que entra al Libro | Coleccionable con carga emocional, no numérico. Reusa el spawner tal cual | 10 | 8 | 5 | 3 | 8 |
| **D3** | **Asimetría real de personaje** — hoy solo cambia el poder. Que cambien también velocidad y ancho de recogida (Nuve lenta y ancha, Ciela rápida y angosta) | Da un motivo *jugable* para probar las 4, x4 rejugabilidad por ~20 líneas | 8 | 9 | 4 | 2 | 6 |
| **D4** | **Modo Noches (historia corta)** — 5 noches en vez de 5 niveles por reloj; entre noche y noche, una línea de un personaje | Le da forma de historia con final, no de bucle infinito. Da un "lo terminé" | 9 | 8 | 6 | 5 | 7 |
| **D5** | **Nube de lluvia amistosa** — hoy toda nube castiga. Una nube buena que deja **semillas** utilizables en otro juego | Rompe la lectura binaria "nube = mala" y teje el universo | 7 | 7 | 6 | 4 | 7 |
| **D6** | **Turnos de a dos (hermanas)** — partida de 2 rondas en el mismo dispositivo, con marcador comparado y sin perdedor explícito | Nina y Jazmín juegan juntas de verdad. Cero infra | 9 | 9 | 3 | 3 | 8 |
| **D7** | **Desafío del día** — semilla fija por fecha: misma lluvia de estrellas para todos ese día | Ritual de regreso barato… **pero** sin perfil compartido no se puede comparar con nadie. Depende de I | 6 | 6 | 3 | 4 | 6 |
| **D8** | **Editor de niveles / estrellas custom** | ❌ **Descartado.** Sobrecarga un arcade cuyo valor es entrar y jugar en 2 segundos | 3 | 4 | 7 | 9 | 2 |

**Recomendación:** **D2 → D3 → D1 → D6**. D2 y D3 son casi gratis y ya se sienten. D1 es la que
convierte el juego en parte del universo, pero **exige haber resuelto el origen único** (sección I).

---

# E. BOSQUE DE PALABRAS — diseño desde cero

No existe. Lo diseño entero, porque queda claro que lo querés — y porque es el único lugar donde
Nuvecielas puede tener valor educativo sin traicionarse.

**El riesgo a evitar:** el reflejo natural es hacer "un juego de formar palabras con puntaje". Eso es
una actividad escolar con skin de nube. Los chicos lo detectan en 30 segundos.

**La idea central propuesta:**

> ## 🌳 El Bosque que Escucha
> Un bosque medio dormido donde **lo que escribís, aparece**.
> Escribís `FLOR` → crece una flor. Escribís `LUNA` → sale la luna. Escribís `PUENTE` → aparece un
> puente y Nuve puede cruzar.

Por qué esta idea y no otra: la marca entera se trata de **crear con las manos**. Escribir una
palabra y ver que el mundo la obedece es *exactamente la misma emoción* que inventar una Nuveciela.
No es "acertar", es **conjurar**. Y no hay respuesta incorrecta: si escribís algo que el bosque no
conoce, una luciérnaga se lo lleva y vuelve con una pista. Cero castigo, cero examen.

**Estructura:**
- **Las luciérnagas** son las letras. Flotan; las tocás en orden para formar la palabra.
- **Tu bosque crece.** Cada palabra descubierta queda **plantada en tu claro del bosque**. A los
  10 días de juego el bosque de la nena es visiblemente distinto al de su hermana. El progreso **es**
  el paisaje, no una barra.
- **Zonas por dificultad, no por nivel:** el Claro (3 letras) → la Ribera (4–5) → la Espesura
  (palabras compuestas) → el Corazón del Bosque (palabras mágicas). Se desbloquean plantando, no
  aprobando.
- **Alguien siempre necesita algo.** "Ciela quiere cruzar el río." "Lunaria perdió la palabra para
  *lluvia*." Es el motor narrativo y el tutorial invisible a la vez.
- **Palabras mágicas** (secretos): escribir el nombre de una Nuveciela hace que aparezca.
  Escribir `NINA` o `JAZMIN` provoca algo especial. Ese es el guiño que se cuenta en el recreo.

| # | Idea | Niño | Diver | Creat | Técn | Reutil |
|---|---|:--:|:--:|:--:|:--:|:--:|
| **E1** | Mecánica base: escribir → aparece en el mundo | 10 | 9 | 9 | 6 | 7 |
| **E2** | El bosque persistente que crece con tus palabras | 10 | 8 | 9 | 5 | 6 |
| **E3** | Personajes que piden ayuda (misiones-palabra) | 9 | 9 | 7 | 4 | 8 |
| **E4** | Palabras mágicas / secretos (nombres propios) | 9 | 9 | 6 | 2 | 5 |
| **E5** | Zonas del bosque por longitud de palabra | 7 | 6 | 5 | 4 | 5 |
| **E6** | Modo "dictado" o cronómetro | ❌ **Descartado.** Es exactamente el olor a escuela que hay que evitar | 2 | 2 | 1 | 3 | 1 |
| **E7** | Reconocimiento de voz | ❌ **Descartado por ahora.** Permisos, privacidad de menores, acentos, ruido. Alto costo, alto riesgo | 7 | 7 | 6 | 9 | 2 |

**Advertencia honesta:** este es el proyecto **más caro** de todo el documento. Necesita arte por
palabra (aunque sea simple), un diccionario curado en español rioplatense, y diseño de la
progresión. No es un quick win. Si se hace, se hace bien y como Fase 2 — y si hay que recortar,
se recorta el catálogo de palabras (empezar con 40), nunca la magia de que la palabra aparezca.

---

# F. APP DE DIBUJO — ideas de evolución

**Lo que hay:** motor sólido (flood fill sobre máscara, 3 capas, export compuesto), 14 colores,
3 herramientas, deshacer de 8 pasos… y **una sola lámina, que es una foto del Duomo de Milán**.

**El diagnóstico en una línea:** tenemos un buen taller sin materiales, y todo lo que se produce ahí
se tira a la carpeta Descargas.

Pediste evaluación crítica, así que voy a ser duro con las ideas del brief: "dibujar y animar",
"crear historias" y "misiones creativas" son buenas ideas **con el tamaño equivocado**. Un editor de
animación o un editor de cómics son productos enteros. Abajo propongo la versión del tamaño correcto.

| # | Idea | Evaluación crítica | Niño | Diver | Creat | Técn | Reutil |
|---|---|---|:--:|:--:|:--:|:--:|:--:|
| **F1** | **Láminas de personajes y mundos** (10–15: Nuve, Ciela, Lunaria, Nuveciela, el bosque, el castillo, el mar, la noche) | **Máxima prioridad de todo el documento.** El código ya lo soporta; solo faltan PNG de line art. Multiplica por 12 el contenido del juego más creativo | 10 | 9 | 9 | 1 | 5 |
| **F2** | **Galería local — "Manolandia guarda tu dibujo"** | Arregla C.3, que es una pérdida real. Que Lunaria diga "lo guardo en el mundo" y el dibujo aparezca colgado en la galería. IndexedDB o `localStorage` con dataURL comprimido | 10 | 8 | 8 | 4 | 8 |
| **F3** | **Sellos / stickers del universo** | Reusa los PNG que **ya existen**. Un botón, un array, un `drawImage`. Los chicos los aman y no requiere producir arte nuevo | 9 | 9 | 8 | 3 | 7 |
| **F4** | **Lienzo libre + fondos** | Hoy solo se puede *rellenar* dibujos ajenos. Una hoja en blanco (o un fondo de cielo/bosque) + sellos + pincel es donde una nena **crea** en vez de completar | 9 | 8 | 10 | 3 | 6 |
| **F5** | **🏆 Taller de Nuvecielas** — dibujás tu propia Nuveciela sobre una silueta base, le ponés nombre, y **nace**: ceremonia, las demás la reciben, entra al Libro, y después **aparece en Memoria, en el Puzzle y asomándose en el launcher** | **La joya.** Es el alma de la marca vuelta mecánica: la nena pasa de visitante a creadora, igual que Nina y Jazmín. Y es el conector más fuerte entre juegos que tenemos. Es también la idea más ambiciosa: requiere F2 + persistencia + tocar 3 pantallas | 10 | 9 | 10 | 7 | 9 |
| **F6** | **Animación de 2 cuadros** — dibujás cuadro A y cuadro B, y se alterna en loop | La versión honesta de "que el dibujo cobre vida". Un editor de animación real sería sobreingeniería; **dos cuadros que parpadean ya producen el "¡ESTÁ VIVO!"**. Y encaja con `LivingCharacter` | 9 | 9 | 9 | 5 | 6 |
| **F7** | **Misiones creativas** — "Dibujá la casa de Lunaria", "Creá un planeta para Nuve" | Barato (es texto + una lámina), pero **sin galería no sirve de nada**: sin F2 la misión no tiene dónde terminar. Hacer después de F2 | 8 | 7 | 9 | 2 | 5 |
| **F8** | **Historias / cómic** — varias viñetas, texto, orden | ⚠️ **Reducir alcance.** Un editor de cómic es un producto. La versión buena: **una escena + una frase que dice tu personaje** = una postal de Manolandia que se puede guardar y mostrar. El 80 % de la emoción, el 15 % del trabajo | 7 | 7 | 9 | 6 | 5 |
| **F9** | **Que los elementos dibujados "cobren vida" e interactúen** (física, IA) | ❌ **Descartado.** Es un motor entero, con resultados impredecibles y frustrantes para un chico. F6 entrega la misma promesa emocional | 6 | 6 | 8 | 10 | 2 |

**Recomendación:** **F1 → F3 → F2 → F4 → F6 → F5**. F1 y F3 se pueden hacer casi de inmediato y ya
transforman la pantalla. F5 es el destino, no el punto de partida.

---

# G. NUEVAS EXPERIENCIAS

Regla que me impuse: **ninguna idea entra si no aprovecha algo que ya existe.** Nada de juegos
genéricos con skin de nube.

| # | Experiencia | Categoría | Qué reusa | Niño | Diver | Creat | Técn | Reutil |
|---|---|---|---|:--:|:--:|:--:|:--:|:--:|
| **G1** | **El Libro de las Nuvecielas** — el censo vivo del mundo: quién vive en Manolandia, quién la creó, qué día nació, qué constelaciones tenés, qué dibujaste | Colección | `characters.ts`, todo lo demás | 10 | 7 | 8 | 5 | 10 |
| **G2** | **Orquesta de Nuvecielas** — cada personaje es un instrumento; tocás tocándolos; se puede grabar un loop de 8 pasos | Música | `audio.ts` (Web Audio ya está), PNG existentes | 9 | 9 | 10 | 5 | 7 |
| **G3** | **Manolandia navegable** — el `LivingWorld` deja de ser fondo y se vuelve el mapa: tocás una zona del cielo y entrás a un juego | Exploración | `LivingWorld`, `useParallax`, `useTimeOfDay` | 10 | 8 | 6 | 6 | 9 |
| **G4** | **Una noche en Manolandia** — historia interactiva corta (5 min) con 2–3 decisiones, ilustrada con los PNG existentes | Historia | Personajes, `LivingWorld` | 9 | 8 | 5 | 4 | 8 |
| **G5** | **Urgencias en la Tierra** — el formato del subnivel de Pablo, sacado de su escondite y vuelto **serie**: mini-aventuras cortas donde mandan Nina, Jazmín y Natan | Miniaventura | Corazón narrativo del proyecto + assets del platformer | 10 | 9 | 6 | 7 | 8 |
| **G6** | **Vestidor / Tu Nuveciela** — elegís colores, accesorios y nombre; te acompaña en el resto del mundo | Personalización | PNG + capas de color | 9 | 8 | 8 | 5 | 8 |
| **G7** | **¿Quién es? (sombras)** — adivinás el personaje por su silueta, con dificultad creciente | Lógica | PNG, filtro CSS | 7 | 7 | 3 | 2 | 5 |
| **G8** | **Jardín de semillas** — plantás lo que ganás en otros juegos y crece con el tiempo real | Exploración | Persistencia + reloj | 8 | 6 | 7 | 5 | 6 |
| **G9** | **Cooperativo en red** (jugar con una amiga a distancia) | Cooperativo | — | 7 | 8 | 5 | **10** | 3 |

**Sobre G9, honestamente:** multijugador online implica servidor, salas, moderación y datos de
menores. Es desproporcionado hoy. **Lo cooperativo que sí tiene sentido ahora es el mismo
dispositivo** (D6): dos hermanas, un teléfono, por turnos. Es más real para esta familia y cuesta
casi nada.

**Recomendación:** **G1** primero (es infraestructura emocional: sin el Libro, ningún coleccionable
tiene casa), después **G2** (música es la categoría totalmente ausente y `audio.ts` ya está),
después **G5** (es el corazón del proyecto y hoy está enterrado).

---

# H. UNIVERSO NUVECIELAS — cómo conectar todo

## H.1 ¿Tiene sentido un mapa del universo? Sí — pero con una condición

**El mapa no debe ser una pantalla nueva. Debe ser el Home.** Ya tenemos `LivingWorld`: un cielo
vivo que cambia con la hora. Agregar un "mapa" aparte sería crear un segundo Home compitiendo con el
primero, y el platformer **ya tiene su propio mapa de niveles** — tendríamos tres paradigmas de
navegación. Eso es exactamente la sobrecarga que pediste evitar.

**La arquitectura que propongo** (dos mundos, que es la narrativa real del proyecto):

```
                    ☁️  M A N O L A N D I A  ☁️
    (el cielo del Home — ya existe, se vuelve navegable)

      ⭐ El Cielo de las Estrellas ......... Atrapa las Estrellas
      🌳 El Bosque Mágico ................. platformer + Bosque que Escucha
      🎨 El Taller ........................ Pintar · Sellos · Taller de Nuvecielas
      📖 El Libro de las Nuvecielas ....... quiénes viven acá · colección · galería
      🌙 La Casa de Lunaria ............... historias · memoria · quiz

  ─────────────── la puerta entre mundos ───────────────

                    🏠  L A   T I E R R A  🏠
      🐱 Urgencias ........................ Pablo · Cleopatra · Nina, Jazmín, Natan
```

Tres reglas para que esto no se vuelva un laberinto:
1. **El mapa nunca bloquea.** Si la nena quiere entrar directo a un juego, hay atajo. (Es la regla de
   oro del launcher que ya definiste, extendida al mapa.)
2. **Se ve todo desde el principio**, aunque haya cosas dormidas. Un mundo con zonas visibles y
   apagadas invita; un mundo que revela pantallas de a poco confunde.
3. **Bottom-nav no se elimina.** Es la red de seguridad para el adulto y para la nena chica.

## H.2 El bucle JUGAR → DESCUBRIR → DESBLOQUEAR → CREAR → VOLVER

Este bucle **sí se puede construir sin volverlo adictivo ni monetizable**, con una regla de diseño
explícita:

> **Todo lo que se gana es un objeto con historia, nunca una moneda.**
> No hay tienda, no hay energía, no hay racha que se rompa, no hay nada que se pierda por no volver.

Cómo se cierra el círculo con lo que ya existe:

```
  ATRAPA LAS ESTRELLAS ──── ganás ────▶ una estrella con nombre
            ▲                                    │
            │                                    ▼
     volvés a jugar                    entra al LIBRO DE LAS NUVECIELAS
     (para buscar                                │
      la que falta)                              ├──▶ se puede usar como SELLO al pintar
            │                                    ├──▶ ilumina una zona del mapa de noche
            │                                    └──▶ aparece de fondo en el launcher
            │                                             │
            └──────── el mundo cambió ◀───────────────────┘
```

Y el circuito de creación, que es el que hace única a esta marca:

```
  TALLER ──▶ dibujás una Nuveciela ──▶ NACE (ceremonia, las demás la reciben)
                                          │
                                          ├──▶ entra al Libro con su fecha de nacimiento
                                          ├──▶ aparece como carta en MEMORIA MÁGICA
                                          ├──▶ se puede armar en el PUZZLE
                                          └──▶ asoma en el launcher a saludar
```

Esa última flecha —**que un dibujo hecho por la nena aparezca solo, después, en otro juego**— es la
cosa más mágica que este proyecto puede hacer. Y no requiere ninguna tecnología nueva.

## H.3 Estrellaria

Hay una imagen de un personaje que juega en Memoria pero no existe en `characters.ts`. Propuesta:
**Estrellaria es la primera Nuveciela que la nena "descubre"**, no una que viene de fábrica. Aparece
al completar la primera constelación (D1) y su nacimiento es el tutorial emocional del Libro. Coste:
una ficha de datos. Impacto: el primer momento de asombro del universo.

---

# I. ARQUITECTURA TÉCNICA

## I.1 El desbloqueo que ordena todo: **un solo origen**

Sin esto no hay universo conectado, punto. Opciones evaluadas:

| Opción | Cómo | Veredicto |
|---|---|---|
| **A. Un solo dominio, tres carpetas** — mover platformer y stars a `public/bosque/` y `public/estrellas/` del hub | Ambos son **vanilla JS sin build**: Vite los copia tal cual. Quedan en `nuvecielas.com.ar/bosque` y `/estrellas` → **mismo origen, mismo `localStorage`** | ✅ **Recomendada.** Es la de mejor relación desbloqueo/esfuerzo del proyecto entero. Los subdominios pueden quedar redirigiendo |
| B. Puente `postMessage` entre iframes | Handshake, serialización, sincronización, race conditions | ❌ Complejidad permanente para evitar un cambio de rutas de una vez |
| C. Backend con cuentas | Servidor, auth, datos de menores, GDPR/LGPD | ❌ Sobreingeniería enorme para este proyecto hoy |

## I.2 Qué conservar tal cual

- `LivingWorld` / `LivingCharacter` / `useParallax` / `useTimeOfDay` — la mejor pieza del hub.
- El motor de `PaintScreen` (flood fill + 3 capas).
- `characters.ts` como fuente única de verdad de personaje.
- El bucle de `game.js` de stars y el `Levelmap.js` del platformer: funcionan y son data-driven.
- CSS Modules + `theme.css`. No hay ninguna razón para migrar a otra cosa.

## I.3 Qué refactorizar (poco, y solo esto)

1. **Navegación con URL.** Reemplazar el `useState<ScreenId>` de `App.tsx` por hash routing mínimo
   (~30 líneas, sin dependencias). Arregla el botón atrás, permite links y recargar. Beneficio alto,
   riesgo casi nulo.
2. **`FULLSCREEN` y `ScreenId` son listas manuales** que hay que tocar en 4 archivos por cada juego
   nuevo. Mover esa metadata a `games.ts` para que agregar un juego sea **una entrada de datos**.
3. **Un solo componente de header de juego.** Hoy cada pantalla reimplementa su header y su
   "← Volver". Un `<GameShell>` compartido resuelve C.10 y hace que los juegos se sientan del mismo
   mundo.
4. Duplicado menor: `src/types/index.ts` y `src/types/types-index.ts` conviven; conviene borrar uno.

## I.4 "Nuvecielas Experience System" — sí, pero de 5 piezas

Pediste explícitamente no convertir esto en arquitectura empresarial. Mi filtro: **una pieza entra
solo cuando ya la necesitan dos juegos** (regla del dos). Con eso, el kit mínimo real es:

```
src/world/
  profile.ts      ← nombre de la nena, fecha de primera visita, última visita
  collection.ts   ← qué tiene: estrellas, constelaciones, dibujos, Nuvecielas nacidas
  voice.ts        ← qué dice cada personaje al ganar/perder/saludar (datos, no lógica)
  celebrate.ts    ← UNA celebración de victoria compartida por los 5 juegos
  storage.ts      ← el único lugar que toca localStorage, versionado
```

Cinco archivos, cero dependencias nuevas, cero abstracción especulativa.

**Lo que NO hay que construir:** un sistema de escenas, un ECS, un gestor de assets, un motor de
partículas genérico, un sistema de diálogos con árbol, un bus de eventos. Cada uno de esos sería
resolver un problema que este proyecto no tiene. `celebrate.ts` con una animación buena vale más
que un motor de partículas configurable.

## I.5 Sobre riesgo y privacidad

- Todo local (`localStorage`/IndexedDB), nada sale del dispositivo. Es lo correcto para menores y
  además simplifica todo.
- El nombre de la nena se guarda **solo local**. Nunca en una URL, nunca en un servidor.
- Antes de tocar persistencia, definir la clave de versión (`nuve_v1`) para poder migrar sin perder
  los dibujos de nadie. Perder un dibujo hecho a mano sería el peor bug posible de este proyecto.

---

# J. ROADMAP

### ⚡ QUICK WINS — días, no semanas

| | Qué | Por qué ahora |
|---|---|---|
| 1 | **10–15 láminas nuevas para pintar** (personajes + mundos) | Cero código. Multiplica el juego más creativo |
| 2 | **Sellos/stickers con los PNG existentes** | Un array y un `drawImage` |
| 3 | **Ficha de Estrellaria** en `characters.ts` | Un objeto. Repara una incoherencia y suma personaje |
| 4 | **+20 preguntas al Quiz** | Hoy se agota en 2 partidas |
| 5 | **Navegación con URL (hash)** | El botón atrás deja de expulsar del sitio |
| 6 | **Asimetría de personaje en stars** (D3) | ~20 líneas, x4 rejugabilidad |
| 7 | **Música ambiente en el hub** | El mundo deja de ser la parte silenciosa del mundo |

### 🔧 FASE 1 — Fundaciones (lo que desbloquea todo lo demás)

1. **Un solo origen** (I.1, opción A) — mover platformer y stars a rutas del hub.
2. **`src/world/`** con `storage`, `profile` y `collection` (I.4).
3. **Galería de dibujos (F2)** — que Manolandia guarde lo que la nena crea.
4. **`<GameShell>` + `celebrate.ts`** — que los 5 juegos se sientan del mismo mundo.
5. **Voz de los personajes (`voice.ts`)** — que alguien se alegre cuando ella gana.

> Al final de la Fase 1, el mundo **recuerda** y **habla**. Eso solo ya cambia la experiencia entera.

### 🎨 FASE 2 — Nuevas experiencias

1. **El Libro de las Nuvecielas (G1)** — la casa de todo lo que se colecciona.
2. **Constelaciones + estrellas con nombre (D1, D2)** — el primer bucle jugar→coleccionar cerrado.
3. **Lienzo libre + animación de 2 cuadros (F4, F6)**.
4. **El Bosque que Escucha (E1–E4)** — el proyecto grande de esta fase.
5. **Orquesta de Nuvecielas (G2)** — cubre la categoría musical, que hoy no existe.

### 🌍 FASE 3 — El universo

1. **🏆 Taller de Nuvecielas (F5)** — nacimiento con ceremonia, y la Nuveciela creada apareciendo
   sola en Memoria, en el Puzzle y en el launcher.
2. **Manolandia navegable (G3)** — el Home se vuelve mapa, con la Tierra abajo.
3. **Urgencias en la Tierra (G5)** — el corazón del proyecto, fuera de su escondite y hecho serie.
4. **Modo dos hermanas (D6)** en los juegos que lo aguanten.

---

# 13. Priorización global

Puntaje = `(Niño + Diversión + Creatividad + Reutilización) − Complejidad`. Es una brújula, no una
sentencia.

| # | Idea | Niño | Div | Cre | Cpx | Reu | **Score** |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|
| F1 | Láminas de personajes y mundos | 10 | 9 | 9 | 1 | 5 | **32** |
| F3 | Sellos del universo | 9 | 9 | 8 | 3 | 7 | **30** |
| G1 | El Libro de las Nuvecielas | 10 | 7 | 8 | 5 | 10 | **30** |
| F2 | Galería local de dibujos | 10 | 8 | 8 | 4 | 8 | **30** |
| F5 | 🏆 Taller de Nuvecielas | 10 | 9 | 10 | 7 | 9 | **31** |
| D2 | Estrellas con nombre | 10 | 8 | 5 | 3 | 8 | **28** |
| F4 | Lienzo libre + fondos | 9 | 8 | 10 | 3 | 6 | **30** |
| G3 | Manolandia navegable | 10 | 8 | 6 | 6 | 9 | **27** |
| G2 | Orquesta de Nuvecielas | 9 | 9 | 10 | 5 | 7 | **30** |
| F6 | Animación de 2 cuadros | 9 | 9 | 9 | 5 | 6 | **28** |
| D1 | Constelaciones | 10 | 9 | 6 | 5 | 9 | **29** |
| D3 | Asimetría de personaje | 8 | 9 | 4 | 2 | 6 | **25** |
| G5 | Urgencias en la Tierra | 10 | 9 | 6 | 7 | 8 | **26** |
| E1–E4 | El Bosque que Escucha | 10 | 9 | 9 | 6 | 7 | **29** |
| D6 | Turnos de a dos | 9 | 9 | 3 | 3 | 8 | **26** |
| G4 | Historia interactiva corta | 9 | 8 | 5 | 4 | 8 | **26** |
| G6 | Vestidor | 9 | 8 | 8 | 5 | 8 | **28** |
| G8 | Jardín de semillas | 8 | 6 | 7 | 5 | 6 | **22** |
| G7 | ¿Quién es? (sombras) | 7 | 7 | 3 | 2 | 5 | **20** |
| G9 | Cooperativo online | 7 | 8 | 5 | 10 | 3 | **13** |
| F9 | Dibujos con vida propia | 6 | 6 | 8 | 10 | 2 | **12** |

**Orden que recomiendo, en una línea:**
`Láminas + Sellos` → `Un solo origen` → `Galería` → `El Libro` → `Constelaciones` →
`Bosque que Escucha` → `Taller de Nuvecielas` → `Manolandia navegable`.

---

# La síntesis, en tres frases

1. **Manolandia ya está construida y ya respira** — el trabajo no es construir un mundo, es hacer
   que **recuerde** a quien entra.
2. **El techo actual no es creativo, es estructural**: tres orígenes aislados y cero persistencia.
   Resolver eso desbloquea, de una sola vez, todas las ideas de colección, progreso y conexión.
3. **El destino no son más juegos: es que un dibujo hecho por Nina un martes aparezca solo, un
   viernes, saludando en el cielo** — porque eso es exactamente lo que Nuvecielas es.
