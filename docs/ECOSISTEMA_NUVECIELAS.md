# 🌙 Nuvecielas — Diseño de Ecosistema Premium

> Documento de diseño UX / Producto. **No incluye implementación.** Todas las propuestas son
> incrementales y compatibles con el código actual. No se cambia el gameplay principal ni se
> eliminan funcionalidades. Donde hay un problema técnico, se documenta — no se "arregla" aquí.

**Autor del análisis:** Lead Game UX / Product / Child Experience Design
**Estado del proyecto auditado:** hub React 19 + Vite + TypeScript (CSS Modules), 100% client-side, sin backend ni persistencia.
**Público objetivo:** niñas de 8–12 (con dos jugadoras reales: las mellizas, ~10 años).

---

## 0.0 🌍 La narrativa (la columna vertebral de TODO)

> Esta es la intención de diseño del autor. No está escrita en el código, pero **es la base sobre la
> que se debe construir el ecosistema entero.** Todo lo que sigue (progresión, álbum, recompensas,
> apego) debe servir a esta historia.

**"Nuvecielas"** es la **marca original** y el **nombre genérico** de un grupo de personajes hechos
*con las manos*: **Nuve** ⭐, **Ciela** 💧, **Nuveciela** 🌙 y **Lunaria** ✨. *(Ojo con el nombre:
"Nuvecielas" es el colectivo/la marca; "Nuveciela" es uno de los personajes.)* **Manolandia** es el
mundo fantástico donde viven; los niveles principales del platformer (Bosque Mágico, los castillos)
ocurren ahí.

El roster **es abierto**: las niñas **siguen creando Nuvecielas nuevas** con el tiempo. Esto no es un
dato menor — es a la vez una restricción de diseño (el sistema debe soportar agregar personajes sin
fricción, cosa que el platformer ya hace bien y data-driven) y **la semilla de la feature estrella
del ecosistema** (ver "★ El Taller de Nuvecielas", al final del documento).

**Las creadoras son humanas y reales:** **Nina** (☀️ amarilla) y **Jazmín** (🩵 celeste), las
mellizas, son las **creadoras** de las Nuvecielas. Su hermanito menor **Natan** es **SuperNatan**.

**Los subniveles son "urgencias" en la Tierra** — emergencias del mundo real que las Nuvecielas no
pueden atender, así que toman el mando **los humanos**:
- **Urgencia 1** (subnivel nivel 2 — *Rescate de Pablo*): el gatito **Pablo** se escapa a la calle y
  lo rapta el **Inspector de la perrera**. **Nina y Jazmín** bajan a la Tierra a rescatarlo.
- **Urgencia 2** (subnivel nivel 3 — *SuperNatan*): **Natan** debe llevar a **Cleopatra** (otra
  gatita de la familia) al **veterinario**.

**La meta-narrativa** (y el corazón emocional): *los personajes hechos a mano viven en Manolandia;
sus creadores —los chicos reales— viven en la Tierra y resuelven las urgencias de verdad.* Es un
juego que un papá hizo poniendo a sus hijas como las autoras-heroínas de su propio universo.

**Consecuencias de diseño** (que recorren todo este documento):
- El ecosistema debe **dramatizar este doble mundo**: Manolandia (fantasía) ↔ Tierra (urgencias).
- Nina, Jazmín y Natan no son "personajes próximamente": son **las protagonistas reales**. El hub
  debe tratarlas como tales (perfil, álbum, presencia destacada), no como contenido bloqueado.
- Las "urgencias" son el formato natural para **misiones y eventos** (Parte I §11/§12): nuevas
  urgencias = nuevo contenido con sentido narrativo, no relleno.
- Los gatitos (Pablo, Cleopatra) y la familia son **coleccionables y recuerdos** con carga afectiva
  real, no genéricos.

---

## 0. Qué es Nuvecielas hoy (mapa mental del producto)

Nuvecielas **no es** el platformer. Es un **hub/portal mágico** (una "consola de bolsillo" con marco
de tablet en desktop) que reúne:

| Pieza | Tipo | Dónde vive |
|---|---|---|
| **Bosque Mágico** | Platformer 2D (el "juego principal") | Externo → abre en pestaña nueva (`nuvebosque.nuvecielas.com.ar`) |
| **Atrapa las Estrellas** | Juego canvas | Embebido en `<iframe>` (`stars.nuvecielas.com.ar`) |
| **Memoria Mágica** | Mini-juego nativo (React) | Pantalla interna |
| **Quiz Estelar** | Mini-juego nativo (React) | Pantalla interna |
| **Pinta con Lunaria** | Herramienta de pintar (canvas + flood-fill) | Pantalla interna |
| **Reto Nuveciela** | Puzzle 3×3 de personajes | Pantalla interna |
| **Conocé al grupo** | Galería de personajes | Pantalla interna |

**Personajes existentes** (ya con lore rico): Nuveciela 🌙, Nuve ⭐, Lunaria ✨, Ciela 💧.
**Próximamente** (ya declarados): Nina ☀️, Jazmin 🩵, Super Natan 🟦. Más una mascota/estrella: **Estrellaria** (aparece solo en el mazo de Memoria).

Identidad visual: cielo nocturno (`#0d0d1f`), gradiente arcoíris animado, tipografías *Bubblegum Sans* (display) + *Nunito* (texto), acentos por personaje. Muy sólida. **Es el mayor activo del producto y hay que protegerla.**

---

# 1. Auditoría UX completa

Para cada área: **✅ Qué funciona · ⚠️ Qué no · ❌ Qué falta · 💎 Nivel premium**.

### 1.1 Pantalla inicial (HomeScreen)
- ✅ Título héroe "✨ Nuve World", grid de 4 personajes flotando con animaciones escalonadas (`nw-float-0..3`), CTA primario al Bosque Mágico y secundario a Mini-juegos. Limpia y encantadora.
- ⚠️ Es **idéntica en cada visita**: no saluda al jugador, no recuerda nada, no hay sensación de "esto es mío".
- ❌ Falta: nombre/avatar del jugador, "continuar donde dejaste", premio diario, novedades ("¡Nuevo personaje!"), indicación de progreso.
- 💎 Premium: cabecera personalizada ("¡Hola, Nina! 🌙"), una **fila de regreso** ("Sigue jugando", "Premio del día", "Racha: 🔥3"), y un mundo vivo (parallax suave, estrella fugaz ocasional).

### 1.2 Menús / Navegación
- ✅ `BottomNav` con 3 destinos (Inicio / Amigas / Juegos), `aria-current`, labels accesibles. Patrón mobile correcto.
- ⚠️ La nav **desaparece** en todas las pantallas "fullscreen" (memory, stars, colors, quiz, puzzle): el único regreso es un botón "← Volver" propio de cada pantalla, con estilos y posiciones ligeramente distintos.
- ⚠️ No hay router: navegación por `useState` en `App.tsx`. Sin URL por pantalla → no se puede compartir un link directo, el botón "atrás" del navegador sale de la app, y no hay deep-linking.
- ❌ Falta: un 4º (y 5º) destino para el nuevo ecosistema (p. ej. **Perfil/Mundo** y **Colección/Álbum**).
- 💎 Premium: barra de navegación consistente, transición entre pantallas con fundido/slide, breadcrumb suave en mini-juegos. Considerar `react-router` con rutas hash (compatible con GitHub Pages) **solo si** se quiere compartir links — documentado como opcional.

### 1.3 HUD (durante mini-juegos)
- ✅ Memory y Puzzle muestran "Movimientos"; Quiz muestra barra de progreso "Pregunta X de 5". Claro.
- ⚠️ Inconsistencia: cada juego dibuja su propio header/stats bar con CSS distinto. No hay un componente HUD compartido.
- ❌ Falta: temporizador opcional, contador de estrellas/monedas ganadas en vivo, récord personal visible ("Tu mejor: 11 movimientos").
- 💎 Premium: HUD unificado con "moneda" y "mejor marca" persistentes; microcelebración cuando se rompe un récord.

### 1.4 Controles
- ✅ Todo es tap/click; Memory y Puzzle bien para dedos infantiles. Pintar usa Pointer Events (funciona con dedo y mouse).
- ⚠️ Áreas táctiles de algunas piezas del puzzle y swatches de color podrían ser chicas en teléfonos pequeños.
- ❌ Falta: feedback háptico (vibración) en dispositivos que lo soportan; estados `:active` más marcados en piezas de juego.
- 💎 Premium: vibración corta en acierto/error, "press state" generoso, y opción de tamaño de botones grande (accesibilidad).

### 1.5 Tutoriales
- ⚠️/❌ **No existen.** Quiz y Puzzle traen un subtítulo de instrucción (1 línea), Memory y Pintar no explican nada.
- 💎 Premium: un **onboarding de 1 sola vez** por mini-juego (overlay de 1–2 pasos, "¡Encontrá las parejas!"), guardado como "visto". Un personaje guía (Lunaria, la "inventora") da los tips en su voz. Skippable siempre.

### 1.6 Flujo del jugador
- ✅ Flujo simple y predecible: Home → Juegos → mini-juego → Volver.
- ⚠️ Es **plano**: no hay objetivos que enlacen las pantallas, ni razón para volver. Cada sesión empieza y termina igual.
- 💎 Premium: un **bucle de progresión** que cruza pantallas — jugar mini-juegos da estrellas/monedas → desbloquea cromos, stickers y personajes → que aparecen en el Álbum y el Perfil → que motivan a volver mañana por el premio diario.

### 1.7 Curva de aprendizaje
- ✅ Dificultad baja y amable, apropiada para la edad.
- ⚠️ Sin niveles de dificultad: Memory siempre 4×4 (8 pares), Puzzle siempre 3×3, Quiz siempre 5 preguntas. Para una niña de 10 puede quedar fácil rápido → se aburre.
- 💎 Premium: dificultad opcional ("Fácil/Normal/Experta"), con recompensa mayor en niveles altos. Memory 4×4 → 5×4 → 6×4. Puzzle 3×3 → 4×4.

### 1.8 Feedback visual
- ✅ Estados claros en Quiz (verde correcto / rojo incorrecto / dimmed), `tileSelected` en puzzle, flip en memory, overlays de victoria con 🏆.
- ⚠️ Las victorias son estáticas (un trofeo + texto). Falta el "momento de fiesta".
- ❌ Falta: confeti/partículas, animación de estrellas que "vuelan" al contador, reacción del personaje.
- 💎 Premium: capa de partículas (confeti/estrellas) reutilizable, "count-up" animado de la recompensa, personaje que salta de alegría.

### 1.9 Feedback sonoro
- ✅ Sorprendentemente bueno: `utils/audio.ts` genera tap/success/error/win con Web Audio (sin assets, sin descargas). Arpegios alegres.
- ⚠️ No hay música de fondo, ni silenciado, ni control de volumen. El `AudioContext` puede quedar suspendido hasta el primer tap (correcto por política del navegador, pero sin "tap para empezar" explícito).
- ❌ Falta: música ambiente suave (loop), toggle de sonido (¡esencial para padres!), voz/jingle de marca.
- 💎 Premium: música de fondo por zona, control 🔊/🔇 persistente, "stinger" de marca al abrir la app, sonidos por personaje.

### 1.10 Animaciones de interfaz
- ✅ Catálogo decente ya definido en `theme.css`: `nw-float-*`, `nw-slide-up`, `nw-bounce-in`, `nw-pulse`, rainbow hue-rotate, twinkle de estrellas.
- ⚠️ Subutilizadas: las transiciones **entre pantallas** son cortes secos. Los overlays de victoria aparecen sin entrada.
- 💎 Premium: usar `nw-bounce-in` en los overlays, `nw-slide-up` al montar listas, transición de página estandarizada.

### 1.11 Microinteracciones
- ✅ `nw-btn:hover/active` (scale), `playTap()` global, cards de personaje expandibles.
- ❌ Falta: "juice" en colecciones (cromo que brilla al ganarlo), badges con pulso, swatch de color que rebota al seleccionarse.
- 💎 Premium: cada acción importante tiene una micro-recompensa (sonido + escala + destello). Es lo que separa "funcional" de "premium".

### 1.12 Estados de victoria
- ✅ Memory, Quiz, Puzzle tienen overlay de victoria con CTA "jugar de nuevo" y, en Quiz, un **ranking con título** ("👑 Guardiana Suprema") — excelente gancho emocional ya presente.
- ⚠️ La victoria **no deja huella**: no se guarda, no suma a nada, no desbloquea nada. El esfuerzo se evapora al salir.
- 💎 Premium: la victoria otorga recompensa persistente (monedas/estrellas/cromo), muestra "¡Nuevo récord!" cuando aplica, y ofrece "Reclamar" con animación.

### 1.13 Estados de derrota
- ✅/❌ Diseño amable: en la práctica **no hay derrota** (no se puede "perder" en memory/puzzle; quiz siempre termina). Apropiado para la edad — mantenerlo.
- 💎 Premium: nunca castigar; convertir el "bajo desempeño" en aliento ("¡Casi! Probá de nuevo, te falta poquito 💪") y siempre dar una recompensa mínima por participar.

### 1.14 Checkpoints
- ❌ No aplica a los mini-juegos (son cortos) y **no existen** en el hub. El Bosque Mágico (externo) gestiona los suyos por separado.
- 💎 Premium (a nivel ecosistema): "checkpoint" = autoguardado del progreso global (monedas, cromos, día de racha) tras cada acción relevante.

### 1.15 Transiciones
- ⚠️ Cortes secos entre pantallas (cambio de `screen` sin animación). En una app tan visual, se nota.
- 💎 Premium: transición compartida (fade + slide 200–300ms), respetando `prefers-reduced-motion`.

### 1.16 Legibilidad
- ✅ Buen contraste general (texto blanco sobre fondos oscuros), tipografías grandes y redondeadas.
- ⚠️ Algunos textos sobre gradientes de personaje (`textColor` claro sobre gradiente claro) pueden bajar de contraste. El `power` usa overlay negro (bien).
- 💎 Premium: auditar contraste AA en todos los pares texto/fondo; tamaño mínimo de fuente 16px en cuerpo.

### 1.17 Accesibilidad
- ✅ Buen uso de `aria-label`, `role`, `aria-live="polite"` en overlays, `aria-current` en nav. Mejor que el promedio.
- ⚠️ `CharacterCard` es un `<article role="button">` con toda la card clickeable y solo maneja `Enter` (no `Space`). Foco/teclado parcial. Sin `:focus-visible` evidente.
- ❌ Falta: respeto a `prefers-reduced-motion` (hay muchas animaciones infinitas), toggle de sonido, modo alto contraste, tamaños de fuente.
- 💎 Premium: panel de **Accesibilidad** (sonido, movimiento reducido, contraste, texto grande, daltonismo) persistente — pedido explícito del brief.

### 1.18 Consistencia visual
- ✅ `theme.css` con design tokens (colores, radios, sombras, fuentes) bien hecho.
- ⚠️ Cada pantalla redefine su header/back/stats en su propio `.module.css` → divergencia sutil (tamaños de "← Volver", paddings). No hay componentes UI compartidos (Button, Header, Overlay, Stat).
- 💎 Premium: librería de componentes interna (ScreenHeader, BackButton, StatPill, RewardOverlay, Modal) — reduce inconsistencia y acelera las nuevas pantallas.

### 1.19 Arquitectura de UX
- ✅ Modelo mental claro: hub con destinos. Datos de personajes/juegos centralizados en `src/data`.
- ⚠️ Estado de navegación local en `App.tsx`; estado de cada juego aislado en su pantalla. No hay "estado del jugador" global → es exactamente la pieza que falta para el ecosistema.
- 💎 Premium: un **store de jugador** (Context + reducer) como única fuente de verdad, con capa de persistencia detrás (local primero, nube opcional).

---

# 2. Problemas encontrados (técnicos — solo documentados)

> Por las restricciones del brief, **no se corrigen aquí**; se listan con severidad e impacto.

| # | Severidad | Hallazgo | Detalle | Recomendación |
|---|---|---|---|---|
| P1 | 🟠 Media | **CSS de plantilla huérfano** | `src/index.css` aún trae el CSS del template de Vite (`#root { width:1126px }`, dark-mode `prefers-color-scheme`, estilos `#social`). Choca con `theme.css`, que lo neutraliza con `!important`. | Limpiar `index.css` a lo mínimo. Quita reglas muertas y la "guerra de `!important`". |
| P2 | 🟠 Media | **Archivo de tipos duplicado** | Existen `src/types/index.ts` y `src/types/types-index.ts`. El segundo tiene un `ScreenId` desactualizado (sin `quiz`/`puzzle`). Riesgo de import equivocado. | Borrar `types-index.ts`; dejar `types/index.ts` como única fuente. |
| P3 | 🟡 Baja | **Sin persistencia** | Cero `localStorage`/`IndexedDB`/red. Todo el progreso es efímero. | Es *la* oportunidad central de este documento (§7). |
| P4 | 🟡 Baja | **Sin router / sin URLs** | Navegación por `useState`. El "atrás" del navegador abandona la app. | Opcional: router con hash routes (compatible GitHub Pages). |
| P5 | 🟡 Baja | **Mutación de estado en Puzzle** | `handleTileClick` hace `const newPieces=[...pieces]` pero luego muta `newPieces[i].shuffledIdx` (los objetos internos son la misma referencia). Funciona hoy por suerte del re-render. | Clonar a nivel objeto al actualizar. |
| P6 | 🟡 Baja | **A11y parcial en CharacterCard** | `role="button"` solo escucha `Enter`, no `Space`; toda la card es clickeable (área grande, ok) pero sin `:focus-visible`. | Añadir `Space`, foco visible. |
| P7 | 🟢 Info | **Estrellaria sin ficha** | Aparece como carta en Memory pero no tiene entrada en `characters.ts`. | Convertirla en mascota/coleccionable del ecosistema (gancho narrativo). |
| P8 | 🟢 Info | **`og:image` apunta a `portada.jpg`** | Referenciada en `index.html` pero no veo el asset versionado. Verificar que exista en deploy. | Confirmar asset social. |
| P9 | 🟢 Info | **Sin control de sonido** | `playTap` global sin mute. Padres no pueden silenciar. | Toggle de sonido (parte de Ajustes). |

---

# 3. Oportunidades de mejora (priorizadas por palanca emocional)

1. **Identidad del jugador** — pasar de "una web de juegos" a "**mi** mundo Nuvecielas". Nombre + avatar + personaje favorito. (Apego nº1 en esta edad.)
2. **Memoria que persiste** — que el esfuerzo *quede*. Récords, monedas, cromos guardados.
3. **Coleccionismo** — el motor de rejugabilidad más potente para 8–12 (Pokémon/cromos). Álbum de cromos de las amigas.
4. **Premio diario + racha** — razón concreta para volver mañana.
5. **Desbloqueo de contenido** — los "Próximamente" (Nina, Jazmin, Natan, Estrellaria) se **ganan**, no aparecen gratis.
6. **Celebración (juice)** — confeti, count-up, vibración: la diferencia "premium".
7. **Mundo del jugador** — una "habitación"/perfil donde ver trofeos, decorar, presumir.
8. **Misiones suaves** — micro-objetivos ("ganá Memoria en <15 movimientos") que guían sin presionar.

---

# 4. Roadmap priorizado (incremental, sin romper nada)

> Cada fase es deployable por sí sola. Nada cambia el gameplay ni borra features.

### Fase 0 — Higiene (0.5 día) · *fundación*
- Limpiar `index.css` (P1), borrar `types-index.ts` (P2), fix mutación Puzzle (P5).
- **Sin cambios visibles** para el jugador. Reduce deuda antes de construir encima.

### Fase 1 — Capa de Jugador local (2–3 días) · *desbloquea todo*
- `PlayerProvider` (Context + reducer) + `usePersistence` con `localStorage` (esquema versionado, autosave).
- Perfil mínimo: nombre + avatar (elegir entre los personajes) + personaje favorito.
- "Cartera": monedas ⭐ globales. Récords por mini-juego.
- **Onboarding de bienvenida** (1 vez): "¿Cómo te llamás?" + elegí avatar.
- Conectar mini-juegos existentes para que **otorguen** monedas/récords al ganar (cambios mínimos, no tocan su lógica de juego).

### Fase 2 — Recompensa & Celebración (2 días) · *sensación premium*
- Componente `RewardOverlay` + capa de partículas (confeti/estrellas) reutilizable.
- Count-up de monedas, "¡Nuevo récord!", vibración opcional.
- HUD unificado (`StatPill` de monedas + mejor marca).

### Fase 3 — Colección & Álbum (3–4 días) · *rejugabilidad*
- Sistema de **cromos** (uno por personaje, en rarezas), Álbum, sobres que se compran con monedas.
- Pantalla **Colección/Álbum** (nuevo destino en nav).
- Estrellaria como cromo legendario.

### Fase 4 — Progresión & Hábito (2–3 días) · *retención*
- **Premio diario** + racha 🔥.
- **Misiones** (diarias/semanales) y **Logros/Medallas**.
- Desbloqueo de personajes "Próximamente" vía logros/monedas.

### Fase 5 — Mundo del Jugador & Ajustes (3 días) · *apego + accesibilidad*
- Pantalla **Perfil/Mundo** (trofeos, stats, vitrina, personalización ligera).
- Panel **Ajustes/Accesibilidad** (sonido, movimiento reducido, contraste, texto grande).

### Fase 6 (opcional) — Nube & Multi-perfil (4–6 días) · *2 hermanas, 2 dispositivos*
- Backend de sincronización (§7), perfiles por hermana, sync entre tablet y compu.
- Solo si se valida la necesidad real (hoy local-first alcanza para un dispositivo).

---

# 5. Wireframes conceptuales (descriptivos)

> ASCII de baja fidelidad. Respetan el ancho de "tablet" (`--app-width: 430px`) y el estilo nocturno.

### 5.1 Home (rediseño aditivo)
```
┌───────────────────────────────┐
│  🌙 ¡Hola, Nina!     ⭐ 1.240  │  ← saludo + cartera (NUEVO)
│  Racha 🔥 3 días               │  ← racha (NUEVO)
├───────────────────────────────┤
│  ▶ SIGUE JUGANDO               │  ← "continuar" contextual (NUEVO)
│  [ Memoria Mágica · récord 12 ]│
├───────────────────────────────┤
│  🎁 Premio del día  [Reclamar] │  ← daily reward (NUEVO)
├───────────────────────────────┤
│   ✨ Nuve World                │  ← (lo actual, intacto)
│   [Nuveciela][Nuve][Lunaria][Ciela]  (flotando)
│                               │
│   🎮 ¡Jugar al Bosque Mágico! │
│   🃏 Mini-juegos              │
└───────────────────────────────┘
   🏠Inicio ✨Amigas 🎮Juegos 📔Álbum 👤Yo   ← nav ampliada (NUEVO)
```

### 5.2 Perfil / Mundo del Jugador (NUEVO)
```
┌───────────────────────────────┐
│  ← Volver        👤 Mi Mundo   │
│      ╭─────╮                   │
│      │avatar│  Nina            │  ← avatar = personaje elegido
│      ╰─────╯  Favorita: Lunaria│
│  ⭐1.240  🏆7 logros  📔12/20 │  ← stats resumen
├───────────────────────────────┤
│  VITRINA DE TROFEOS            │
│  [🥇][🥈][🃏][⭐][🔒][🔒]      │  ← medallas (algunas bloqueadas)
├───────────────────────────────┤
│  MIS RÉCORDS                   │
│  Memoria  12 mov.  ⭐⭐⭐      │
│  Quiz     5/5      👑          │
│  Puzzle   18 mov.  ⭐⭐        │
├───────────────────────────────┤
│  [ Personalizar ]  [ Ajustes ] │
└───────────────────────────────┘
```

### 5.3 Álbum / Colección (NUEVO)
```
┌───────────────────────────────┐
│  ← Volver       📔 Mi Álbum    │
│  Cromos: 12 / 20   ⭐ 1.240    │
├───────────────────────────────┤
│  AMIGAS                        │
│  [Nuveciela★][Nuve★][Lunaria ]│  ← brillante=obtenido, gris=falta
│  [Ciela★][Nina🔒][Jazmin🔒]   │
│  [Natan🔒][Estrellaria✦LEG]   │
├───────────────────────────────┤
│  RECUERDOS / FOTOS             │
│  [📷 1ª victoria][📷 racha 7]  │
├───────────────────────────────┤
│   🎁 ABRIR SOBRE  (150 ⭐)     │  ← gasta monedas → animación
└───────────────────────────────┘
```

### 5.4 Overlay de recompensa (reemplaza victorias planas)
```
        ✨ confeti ✨
   ┌─────────────────────┐
   │      🏆              │  ← bounce-in
   │   ¡GANASTE!         │
   │   +50 ⭐  (count-up) │
   │   ¡NUEVO RÉCORD! 🎉 │  ← solo si aplica
   │   Cromo nuevo: Ciela │  ← solo si dropea
   │  [Reclamar] [Otra vez]
   └─────────────────────┘
```

### 5.5 Ajustes / Accesibilidad (NUEVO)
```
┌───────────────────────────────┐
│  ← Volver        ⚙️ Ajustes    │
│  Sonido        🔊 [====O ]     │
│  Música        🎵 [==O    ]    │
│  Vibración        [ ON  ]      │
│  Menos animación  [ OFF ]      │  ← prefers-reduced-motion
│  Texto grande     [ OFF ]      │
│  Alto contraste   [ OFF ]      │
│  ───────────────────────────  │
│  Cambiar nombre / avatar       │
│  Borrar mi progreso (con PIN)  │  ← control parental
└───────────────────────────────┘
```

---

# 6. Arquitectura funcional del ecosistema

```
                 ┌──────────────────────────────────────────┐
                 │              PlayerProvider               │
                 │   (Context + reducer = fuente de verdad)  │
                 │  profile · wallet · records · collection  │
                 │  achievements · missions · daily · prefs  │
                 └───────┬───────────────────────┬───────────┘
        lee/despacha     │                       │   persiste (debounced)
   ┌──────────────┐      │                       │      ┌──────────────────┐
   │  Pantallas    │◄────┘                       └─────►│  PersistencePort  │
   │ (Home, juegos,│                                    │  (interfaz)       │
   │ Álbum, Perfil)│   eventos de juego                 └───────┬──────────┘
   └──────┬────────┘   (gameWon, etc.)                          │
          │                                          ┌──────────┴──────────┐
          ▼                                          │ LocalAdapter (hoy)   │
   ┌──────────────┐   reglas puras                   │ localStorage         │
   │  GameRules    │  (recompensas, drops, rachas,    ├──────────────────────┤
   │  (motor)      │   logros) — SIN React            │ CloudAdapter (futuro)│
   └──────────────┘                                   │ REST + token         │
                                                      └──────────────────────┘
```

**Principios:**
- **Local-first.** El adaptador por defecto es `localStorage`. La nube es un adaptador intercambiable detrás de la misma interfaz `PersistencePort` → migrar a backend no toca ni pantallas ni reglas.
- **Reglas puras y testeables.** El "motor" (cuántas monedas da una victoria, qué cromo dropea, cómo avanza la racha) es funciones puras, sin React, fáciles de ajustar y testear.
- **Eventos, no acoplamiento.** Los mini-juegos solo emiten `gameCompleted({game, score, moves, timeMs})`. El motor decide recompensas. Así los juegos actuales casi no cambian.
- **Aditivo.** Si la capa de jugador no carga, los juegos siguen funcionando como hoy (degradación elegante).

---

# 7. Diseño del backend de persistencia

## 7.1 Estrategia en dos etapas

| Etapa | Almacén | Cuándo | Por qué |
|---|---|---|---|
| **A. Local-first** (recomendado para empezar) | `localStorage` (clave `nw:player:v1`) | Fase 1 | 1 dispositivo, 0 costo, 0 backend, privacidad total. Cubre el 90% del valor. |
| **B. Nube opcional** | API REST + DB | Fase 6 | Solo si: 2 hermanas en 2 dispositivos, o querés que no se pierda al limpiar el navegador. |

> **Recomendación honesta:** para dos niñas jugando en casa, **empezá con local-first**. Diseñá el backend (abajo) pero implementalo solo cuando exista la necesidad real de sync. Evitás operar un servidor, manejar datos de menores y complejidad innecesaria.

## 7.2 Modelo de datos (entidades y relaciones)

```
Player (1) ──< Record (N)          un récord por (mini-juego, dificultad)
Player (1) ──< CollectibleOwned (N)  cromos/objetos que tiene
Player (1) ──< AchievementUnlocked (N)
Player (1) ──< MissionProgress (N)
Player (1) ──1 Wallet                monedas/estrellas
Player (1) ──1 Settings              accesibilidad + sonido
Player (1) ──1 Streak                racha + último día reclamado
Player (1) ──< SaveSlot (N)          versionado/snapshots de partida

Catálogos (estáticos, en el front, no en DB):
Collectible (id, nombre, personaje, rareza)
Achievement (id, nombre, condición, icono)
Mission     (id, tipo, objetivo, recompensa)
```

**Relaciones clave:**
- Un **Player** posee 0..N **CollectibleOwned** (FK → catálogo `Collectible`).
- Un **Player** desbloquea 0..N **Achievement** (tabla puente con timestamp).
- **Record** es único por `(player_id, game_id, difficulty)` → guardamos solo la mejor marca.
- **SaveSlot** permite multi-perfil (las dos hermanas) y snapshots para "versionado de partidas".

## 7.3 Tablas (etapa B — SQL conceptual)

```sql
players(
  id            UUID PK,
  display_name  TEXT,
  avatar_id     TEXT,            -- 'lunaria' | 'ciela' | ...
  favorite_char TEXT,
  created_at    TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ,
  schema_version INT             -- versionado de migraciones
)

wallets(
  player_id UUID PK FK→players,
  stars     INT DEFAULT 0,       -- moneda principal ⭐
  gems      INT DEFAULT 0        -- moneda premium opcional (futura)
)

records(
  player_id  UUID FK,
  game_id    TEXT,               -- 'memory'|'quiz'|'puzzle'
  difficulty TEXT,               -- 'easy'|'normal'|'hard'
  best_score INT,                -- p.ej. menos movimientos / más aciertos
  best_time_ms INT,
  stars      INT,                -- 1..3
  plays      INT,                -- veces jugadas (estadística)
  updated_at TIMESTAMPTZ,
  PRIMARY KEY (player_id, game_id, difficulty)
)

collectibles_owned(
  player_id    UUID FK,
  collectible_id TEXT,           -- FK lógica → catálogo en front
  count        INT DEFAULT 1,    -- duplicados → se convierten en ⭐
  first_owned_at TIMESTAMPTZ,
  PRIMARY KEY (player_id, collectible_id)
)

achievements_unlocked(
  player_id UUID FK,
  achievement_id TEXT,
  unlocked_at TIMESTAMPTZ,
  PRIMARY KEY (player_id, achievement_id)
)

missions_progress(
  player_id UUID FK,
  mission_id TEXT,
  progress INT,
  target INT,
  completed BOOL,
  period_key TEXT,               -- '2026-06-30' diaria / '2026-W27' semanal
  PRIMARY KEY (player_id, mission_id, period_key)
)

streaks(
  player_id UUID PK FK,
  current INT, best INT,
  last_claim_date DATE
)

settings(
  player_id UUID PK FK,
  sound BOOL, music BOOL, haptics BOOL,
  reduced_motion BOOL, high_contrast BOOL, large_text BOOL,
  parent_pin_hash TEXT
)

save_slots(
  id UUID PK,
  player_id UUID FK,
  snapshot JSONB,                -- estado completo serializado
  schema_version INT,
  created_at TIMESTAMPTZ
)
```

## 7.4 Endpoints REST (etapa B)

```
Auth (mínima, sin datos sensibles de menores)
  POST /v1/auth/device         → crea/asocia dispositivo, devuelve token (anónimo)
  POST /v1/auth/refresh

Perfil
  GET    /v1/players/me
  PATCH  /v1/players/me         { display_name, avatar_id, favorite_char }
  GET    /v1/players/me/state   → estado agregado (wallet+records+collection+...)
  PUT    /v1/players/me/state   → guardado completo (autosave) con If-Match (ETag)

Guardado/sync granular (opcional, menos tráfico)
  POST   /v1/players/me/events  → [{type:'gameCompleted', ...}] (el server aplica reglas)
  GET    /v1/players/me/records
  GET    /v1/players/me/collection
  POST   /v1/players/me/packs/open      → abre sobre, devuelve drop
  POST   /v1/players/me/daily/claim     → reclama premio diario
  GET    /v1/players/me/achievements
  GET    /v1/players/me/missions

Versionado de partidas
  GET    /v1/players/me/slots
  POST   /v1/players/me/slots   → snapshot
  POST   /v1/players/me/slots/{id}/restore
```

## 7.5 Autenticación (apropiada para menores)
- **Sin email/contraseña de la niña.** Modelo recomendado: **token de dispositivo anónimo** (UUID firmado) + un **PIN parental** opcional para acciones sensibles (borrar progreso, vincular dispositivos).
- Cumplir con privacidad de menores (no recolectar PII; `display_name` puede ser un apodo).
- Si se hace multi-dispositivo: vincular con un **código corto** ("código familia 4 letras") generado en el dispositivo origen, en vez de cuentas.

## 7.6 Sistema de guardado / autosave / sync
- **Autosave** debounced (≈500ms) tras cada mutación del store → escribe en el adaptador activo.
- **Local:** JSON serializado bajo `nw:player:v1`. Tamaño trivial (<20KB).
- **Sync (nube):** estrategia *last-write-wins* con `updated_at`/ETag por defecto (suficiente). Para conflictos reales (jugó en dos lados offline), merge por campos: monedas = max acumulado por eventos, records = mejor marca, colección = unión. Esto se logra fácil si se sincronizan **eventos** en vez de estado.
- **Offline-first:** la app siempre funciona contra el almacén local; el sync es oportunista cuando hay red.

## 7.7 Versionado de partidas (schema migrations)
- Cada save lleva `schema_version`. Al cargar, una cadena de **migradores** (`v1→v2→v3`) transforma el JSON viejo al actual. Nunca se rompe un guardado existente.
- `SaveSlot` snapshots permiten "deshacer" o tener perfil por hermana.

---

# 8. Modelo de datos del front (TypeScript conceptual)

> Tipos propuestos para `src/types` (a sumar, sin tocar los actuales). **Diseño, no código a integrar aún.**

```ts
type GameId = 'memory' | 'quiz' | 'puzzle' | 'stars';
type Difficulty = 'easy' | 'normal' | 'hard';
type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface PlayerProfile {
  displayName: string;
  avatarId: string;          // reutiliza CHARACTERS[].id
  favoriteChar: string;
  createdAt: string;
}

interface Wallet { stars: number; }

interface GameRecord {
  gameId: GameId; difficulty: Difficulty;
  bestScore: number; bestTimeMs?: number; stars: 1|2|3; plays: number;
}

interface Collectible {              // catálogo estático
  id: string; name: string; charId: string;
  rarity: Rarity; image: string; description: string;
}
interface CollectibleOwned { id: string; count: number; firstOwnedAt: string; }

interface Achievement {              // catálogo estático
  id: string; name: string; description: string; icon: string;
  // condición evaluada por el motor (ej: { type:'recordUnder', game:'memory', value:12 })
}

interface Mission {                  // catálogo estático
  id: string; period: 'daily'|'weekly';
  text: string; target: number; reward: number;
}
interface MissionProgress { missionId: string; progress: number; completed: boolean; periodKey: string; }

interface Streak { current: number; best: number; lastClaimDate: string|null; }

interface Settings {
  sound: boolean; music: boolean; haptics: boolean;
  reducedMotion: boolean; highContrast: boolean; largeText: boolean;
}

interface PlayerState {
  schemaVersion: number;
  profile: PlayerProfile;
  wallet: Wallet;
  records: Record<string, GameRecord>;      // key = `${gameId}:${difficulty}`
  collection: Record<string, CollectibleOwned>;
  achievements: string[];                    // ids desbloqueados
  missions: MissionProgress[];
  streak: Streak;
  settings: Settings;
}
```

---

# 9. Flujos de usuario (principales)

### 9.1 Primer arranque (onboarding)
```
Abre app → ¿hay PlayerState? ── no ──► "¡Hola! ¿Cómo te llamás?" (input)
                                       → "Elegí tu avatar" (4 personajes)
                                       → "¡Bienvenida, Nina! 🌙" (confeti)
                                       → Home personalizada
                              ── sí ──► Home con saludo + chequeo premio diario
```

### 9.2 Jugar un mini-juego y ganar recompensa
```
Home → Juegos → Memoria → juega → GANA
  → motor: calcula ⭐ (base + bonus dificultad + bonus récord)
  → ¿nuevo récord? → flag "¡NUEVO RÉCORD!"
  → ¿dropea cromo? (probabilidad por rareza) → flag cromo
  → RewardOverlay (confeti, count-up ⭐, cromo) → [Reclamar]
  → autosave → vuelve a Juegos (HUD ⭐ actualizado)
```

### 9.3 Premio diario + racha
```
Primer ingreso del día → "🎁 Premio del día" en Home
  → [Reclamar] → +⭐ (escala según racha) → racha++ (o reset si faltó un día)
  → animación cofre → guarda lastClaimDate
```

### 9.4 Abrir sobre / coleccionar
```
Álbum → "Abrir sobre (150⭐)" → ¿alcanza? 
  → sí → anima sobre → revela cromo (rareza con efecto)
       → ¿duplicado? → se convierte en +⭐ ("¡Ya lo tenías! +20⭐")
       → ¿completaste un set? → desbloquea personaje "Próximamente"
  → no → "Te faltan 30⭐, ¡jugá un poco más! 💪"
```

### 9.5 Desbloquear personaje "Próximamente"
```
Logro/condición cumplida (ej: set de cromos completo, o 500⭐)
  → "¡Nina ☀️ se unió al grupo!" (celebración full screen)
  → Nina deja de estar 🔒 en Amigas y aparece jugable en juegos que la usan
```

---

# 10. Lista de nuevas pantallas

| Pantalla | Nav | Propósito | Reusa |
|---|---|---|---|
| **Onboarding** | — (modal 1ª vez) | Nombre + avatar | personajes |
| **Perfil / Mi Mundo** | 👤 nuevo destino | Trofeos, stats, vitrina, personalización | records, achievements |
| **Álbum / Colección** | 📔 nuevo destino | Cromos, recuerdos, sobres | collectibles |
| **Logros** | sub de Perfil | Medallas y progreso | achievements |
| **Ajustes / Accesibilidad** | sub de Perfil | Sonido, movimiento, contraste, control parental | settings |
| **Misiones / Retos** | tarjeta en Home + sub | Diarias/semanales | missions |
| **Estadísticas** | sub de Perfil | Tiempo por juego, partidas, mejores marcas | records |
| **Créditos** | sub de Ajustes | "Hecho con 💜 para Nina y Jazmin" | — |
| **Mapa** (opcional) | en Juegos | Mapa visual del mundo en vez de grid | games |

> Las 2 imprescindibles para el salto premium: **Perfil/Mi Mundo** y **Álbum**. El resto cuelga de ahí.

---

# 11. Sistemas de progresión

- **Moneda única ⭐ (estrellas).** Simple para la edad. Se gana jugando, con récords, premio diario, misiones. Se gasta en sobres y personalización. (Evitar dos monedas al principio.)
- **Récords con estrellas (1–3).** Ya existe en Memory (`getStarRating`) — generalizar a Quiz y Puzzle y **persistir** la mejor marca.
- **Niveles de dificultad** opcionales que multiplican recompensa.
- **Desbloqueos:** personajes "Próximamente" (Nina, Jazmin, Natan) + Estrellaria, ganados por logros/colección/⭐. Convierte el "Próximamente" actual en una meta.
- **Misiones suaves:** diarias ("jugá 1 partida", "ganá Memoria") y semanales ("completá el álbum de Lunaria"). Nunca penalizan; solo premian.
- **Objetivos secundarios** dentro de cada juego: "ganá sin errores", "bajo X movimientos", "serie de 3 aciertos".

## Economía sugerida (balance inicial, ajustable)
| Acción | ⭐ |
|---|---|
| Completar mini-juego | 20 |
| Bonus 3 estrellas | +20 |
| Romper récord personal | +30 |
| Premio diario (racha 1→7) | 10 → 70 |
| Misión diaria | 25 |
| Misión semanal | 100 |
| **Sobre de cromos** | **−150** |
| Cromo duplicado → reembolso | +20 (común) … +100 (legendario) |

---

# 12. Sistema de recompensas

- **Inmediata** (cada partida): ⭐ + sonido + confeti + count-up. *Dopamina de bucle corto.*
- **De sesión** (volver hoy): premio diario, misiones diarias. *Razón para abrir la app.*
- **De colección** (largo plazo): cromos, sets, personajes. *Razón para volver semanas.*
- **Sorpresa** (variable ratio): drop aleatorio de cromo al ganar (probabilístico) — el motor de enganche más fuerte, usado con cuidado y siempre generoso (nunca "0 recompensas").
- **Social/afectiva:** "recuerdos" (fotos del progreso: "tu 1ª victoria", "racha de 7") que se guardan en el Álbum como recuerdo emocional.

**Regla de oro infantil:** *nunca* castigar, *siempre* dar algo. Una derrota da ⭐ de consuelo + aliento.

---

# 13. Sistema de logros (catálogo inicial)

| Logro | Icono | Condición |
|---|---|---|
| Primer Vuelo | 🪶 | Completar el onboarding |
| Memoria de Estrella | 🃏 | Ganar Memoria en ≤12 movimientos |
| Sabia del Cielo | 👑 | 5/5 en Quiz |
| Maestra del Puzzle | 👾 | Armar puzzle en ≤10 movimientos |
| Coleccionista | 📔 | 5 cromos distintos |
| Álbum Completo | 🌈 | Todos los cromos |
| Constante | 🔥 | Racha de 7 días |
| Madrugadora | ☀️ | Jugar 3 días seguidos |
| Artista | 🎨 | Guardar 3 dibujos en Pintar |
| Mejor Amiga | 💜 | Desbloquear un personaje nuevo |
| Estrellaria | ✦ | Conseguir el cromo legendario |

Cada logro otorga ⭐ y aparece en la **Vitrina** del Perfil. Los bloqueados se ven en gris (incentivo de "completismo").

---

# 14. Ideas para aumentar el apego emocional (niñas ~10)

1. **Personalización con su nombre real** en toda la app ("Mundo de Nina"). El nombre propio es el gancho nº1.
2. **Avatar = personaje favorito** visible en Home y Perfil → "ese personaje soy yo".
3. **Dos perfiles** (Nina y Jazmin) con código de color y mascota propia → evita peleas, fomenta "lo mío vs lo tuyo" sano. (Estrellaria podría ser la mascota compartida.)
4. **Recuerdos/fotos** del progreso: capturas emotivas ("¡Tu primera victoria!", "Racha de 7 🔥") guardadas como álbum de recuerdos — nostalgia incluso a los 10.
5. **Personajes que les hablan**: micro-mensajes en su voz ("¡Lo lograste! — Lunaria ✨"), cumpleaños ("¡Hoy Ciela cumple años!").
6. **Coleccionismo de cromos** de las amigas: el comportamiento Pokémon/Pokétat. Sets, rarezas, "me falta el de Ciela".
7. **Decorar "su mundo"** con lo que ganan (fondos, marcos de avatar, stickers) → expresión personal.
8. **Eventos suaves** ligados a fechas reales (cumpleaños de las niñas, fin de semana, vacaciones) → "el juego sabe que hoy es especial".
9. **Sorpresas creadas por papá**: el sistema de cromos/recuerdos permite que vos sumes cromos o mensajes secretos dedicados ("Para mis mellizas 💜") — apego intergeneracional único de un juego hecho en casa.
10. **Celebrar el esfuerzo, no solo el resultado** ("¡Lo intentaste 5 veces, sos perseverante!").

---

# 15. Priorización Impacto vs. Esfuerzo

```
ALTO IMPACTO
   │  ⭐ Capa de Jugador local (F1)      ⭐ Premio diario + racha (F4)
   │  ⭐ Recompensa/confeti (F2)          ⭐ Colección/Álbum (F3)
   │  ⭐ Perfil + nombre/avatar (F1/F5)
   │
   │  · HUD unificado (F2)                · Misiones (F4)
   │  · Ajustes/A11y (F5)                 · Desbloqueo personajes (F4)
   │
   │  · Transiciones de pantalla          · Multi-perfil local (F5/6)
   │  · Tutoriales 1-vez                   · Música de fondo
   │
   │  · Router/URLs (P4)                   ○ Backend nube (F6)
   │  · Limpieza técnica F0                ○ Mapa visual de mundo
BAJO IMPACTO
   └──────────────────────────────────────────────────────────►
     BAJO ESFUERZO                              ALTO ESFUERZO
```

**Quick wins (hacer primero):** F0 higiene · saludo con nombre · persistir récords · confeti en victorias.
**Grandes apuestas (planificar):** Colección/Álbum · Perfil/Mundo · backend nube (solo si se valida).
**Evitar por ahora:** segunda moneda, economía compleja, social online, leaderboards públicos (privacidad de menores).

---

# 16. Cómo lograr que se perciba "indie premium" sin perder su esencia

1. **Coherencia obsesiva.** Una librería de UI compartida (Header, BackButton, Overlay, StatPill) elimina las micro-inconsistencias que delatan "proyecto casero". Mismos radios, sombras, timing de animación en todos lados.
2. **Juice everywhere.** Premium = feedback. Cada tap responde (escala+sonido), cada victoria celebra (confeti+count-up+vibración). Ya tenés el motor de audio; falta el visual.
3. **Transiciones suaves.** Nada de cortes secos. Fade/slide 200–300ms entre pantallas, overlays con `bounce-in`. Respetar `prefers-reduced-motion`.
4. **Un mundo vivo, no una web.** Parallax sutil en el fondo estrellado, estrella fugaz ocasional, personajes que parpadean/respiran. El cielo nocturno actual es perfecto para esto.
5. **Onboarding con alma.** Los primeros 30 segundos definen la percepción: nombre + avatar + bienvenida celebrada = "esto es un producto de verdad".
6. **Detalle narrativo.** Los personajes ya tienen lore excelente (poderes, gustos, frases). Hacerlos *hablar* en la UI conecta todo en un universo, no una colección de pantallas.
7. **Sonido con identidad.** Un jingle de marca de 1s al abrir, música ambiente opcional. Diferencia inmediata.
8. **Pulido del vacío.** Estados vacíos hermosos ("Tu álbum está esperando su primer cromo ✨"), loaders temáticos (ya hay spinner en GameFrame — tematizarlo), errores amables.
9. **Accesibilidad como sello de calidad.** Toggle de sonido, movimiento reducido y texto grande dicen "esto está hecho con cuidado" — y son imprescindibles para padres.
10. **Menos es más.** No agregar features hasta que cada una brille. Un Álbum impecable vale más que cinco sistemas a medias. La esencia (dulce, mágico, simple, para dos hermanas) se protege manteniendo el alcance pequeño y la ejecución alta.

---

## Anexo · Resumen de "no tocar" (esencia a preservar)
- El cielo nocturno + arcoíris animado + tipografías actuales.
- El audio procedural (genial, sin assets).
- La simplicidad de tap. Sin derrota dura. Sin presión.
- Los mini-juegos tal como juegan hoy (solo *emiten* eventos de recompensa).
- El Bosque Mágico y Atrapa las Estrellas como piezas externas/embebidas.
- El tono dulce y el lore de los personajes.

## Anexo · Próximo paso recomendado
Si querés avanzar, el primer incremento seguro y de alto impacto es **Fase 1 (Capa de Jugador local)**:
crear `PlayerProvider` + persistencia `localStorage` + saludo con nombre + persistir récords,
sin tocar la lógica de ningún juego. Avísame y lo diseñamos a nivel de archivos/PR.

---
---

# 🌳 PARTE II — El Platformer (Bosque Mágico) y la unión del ecosistema

> Esta parte amplía el análisis con el **juego principal**, que vive en un repo aparte
> (`nuvecielas-platformer`, vanilla JS) y se publica en `nuvebosque.nuvecielas.com.ar`.
> **Corrige y completa** el diseño de persistencia de la Parte I, porque cambia un supuesto clave.

## II.0 Qué es el Platformer (arquitectura real)

No es React: es **JavaScript vanilla puro** (patrón módulo IIFE, sin build, sin dependencias),
~14.000 líneas muy bien organizadas, cargado por `<script>` en orden estricto en `index.html`.

```
nuvecielas-platformer/
  index.html        ← 5 pantallas (Menú, Selección, Cómo jugar, Juego, Overlay) + orden de carga
  styles.css        ← 30KB, glassmorphism, HUD, controles móviles
  audio/            ← 13 mp3 (música por nivel + sfx)
  img/              ← 357 imágenes (sprites, fondos, tiles)
  js/
    main.js                  ← entry point, conecta Engine+UI+canvas
    levels_const.js          ← TILE enum, TILE_SIZE=48, MapBuilder helpers
    level1..5.js + levels.js ← 5 niveles como tilemaps
    asset_loader.js          ← carga por nivel + preload del siguiente
    loading_screen.js        ← pantalla de carga con progreso
    engine/
      engine.js        ← game loop (RAF), física, cámara, colisiones, checkpoints, portales
      engine_input.js  ← teclado + táctil
      engine_render.js ← orquesta el frame
    renderer/          ← core, bg (parallax), tiles, entities, fx, coordinador
    player_characters.js ← 4 personajes data-driven (stats + projectileDef)
    player.js          ← física, salto/doble salto, deslizar, flotar, volar, proyectiles
    enemies/           ← walker, serpiente, boss, fantasma, oruga, arbusto, murciélago,
                         ciempiés, gárgolas/caballeros/rey de escarcha (nivel 4)
    submision/         ← 2 mini-niveles especiales: "Pablo" (rescate gatito) y "SuperNatan"
    giftbox.js · magicdoor.js · cueva.js ← mecánicas especiales
    audio.js           ← música+sfx con mute, fade, desbloqueo móvil
    cinematica.js      ← cinemáticas (se ven 1 vez, flag en localStorage)
    levelmap.js        ← overworld: mapa de nodos con progresión persistida
    ui.js              ← pantallas, HUD, overlays (pausa/gameover/win)
```

**Calidad técnica: alta.** Diseño data-driven ejemplar — agregar un personaje es solo tocar
`player_characters.js` (stats + `projectileDef`), sin `if/else` por personaje en el motor. Agregar
un nivel es 3 pasos documentados. Enemigos modularizados. Es un proyecto serio, no un prototipo.

## II.1 Lo que YA tiene el platformer (y el hub no)

Esto es importante: **el platformer ya implementó varias cosas que en la Parte I propuse como "faltantes".** El ecosistema debe *unificar*, no duplicar.

| Capacidad | Platformer | Hub (Parte I) |
|---|---|---|
| **Persistencia (localStorage)** | ✅ niveles desbloqueados, mejores estrellas por nivel, cinemáticas vistas | ❌ ninguna |
| **Overworld / mapa de progresión** | ✅ `levelmap.js` (nodos, path SVG, candados, estrellas por nodo) | ❌ |
| **Música + SFX + mute** | ✅ `audio.js` completo (mp3, fade, mute, desbloqueo móvil) | ⚠️ solo sfx procedural, sin mute |
| **Háptica (vibración)** | ✅ `navigator.vibrate` en subnivel Natan | ❌ |
| **Cinemáticas narrativas** | ✅ `cinematica.js`, una vez por nivel | ❌ |
| **Selección de personaje** | ✅ con habilidades | ⚠️ solo galería informativa |
| **Checkpoints** | ✅ banderas en nivel | ❌ N/A |
| **Pantalla "Cómo jugar"** | ✅ teclas + habilidades + niveles | ❌ |
| **Vidas / daño / game over** | ✅ 5 corazones, retry | ❌ N/A |
| **Controles móviles** | ✅ d-pad táctil | N/A |

**Implicación:** el patrón de persistencia del hub (Parte I) debería **adoptar las claves y convenciones que el platformer ya usa**, no inventar otras. Hoy el platformer guarda en claves sueltas (`nuvecielas_unlocked`, `nuvecielas_stars_N`, `nuve_cin_*`); el ecosistema unificado las migra a un único `PlayerState` versionado (ver II.5).

## II.2 Auditoría UX del Platformer

### Pantallas y flujo
- ✅ Flujo completo y pulido: **Menú → Cómo jugar → Selección de personaje → Mapa (overworld) → Juego → Overlay (pausa/gameover/win)**. Mejor estructurado que el hub.
- ✅ Overworld con candados y estrellas por nodo = progresión visible y motivante (justo lo que el hub no tiene).
- ⚠️ Al ganar/perder, los overlays son funcionales pero planos (emoji + texto + botones), sin la "fiesta" premium (confeti, count-up). Mismo gap que el hub.
- ⚠️ El botón "🎉 Ver logros" en `onLevelClear` **no lleva a ninguna pantalla de logros** (no existe) — promesa incumplida.

### HUD
- ✅ Muy bueno: corazones individuales con animación `critical-hp`/`low-hp`, estrellas con bounce al recoger, nombre de nivel y personaje, botón de pausa y de audio. Glassmorphism coherente.
- ⚠️ El contador de estrellas es el **total de estrellas-tile recogidas** (puede ser >3), pero el mapa lo muestra **capado a ⭐⭐⭐**. Dos semánticas de "estrella" mezcladas (ver problema P-PF4).

### Controles
- ✅ Teclado (← → ↑/Z/Espacio, ↓ deslizar, doble-tap disparar) + d-pad táctil + háptica. Rico y bien explicado en "Cómo jugar".
- ⚠️ Las habilidades por doble-tap (← ← dispara) pueden ser difíciles para una niña de 8; no hay botón dedicado de "poder" en desktop más allá del fuego móvil.

### Feedback visual/sonoro
- ✅ Partículas, flashes, textos flotantes ("❄️ Congelado!", "¡JEFE DERROTADO!"), parallax de fondo, música por nivel, sfx por evento. **Muy por encima del hub.**
- ⚠️ Música solo en niveles 0,1,2 (faltan 3,4,5). Y hay un bug de mayúsculas que rompe la del nivel 1 en producción (P-PF1).

### Accesibilidad
- ✅ Mute de música persistente en sesión, controles táctiles grandes, háptica.
- ⚠️ El mute **no se persiste** entre sesiones (no hay `localStorage` de settings). `prefers-reduced-motion` no respetado. Sin opciones de dificultad/asistencia.

### Curva / dificultad
- ✅ Checkpoints, árboles de inmunidad (5s), cajas sorpresa, vidas generosas (5).
- ⚠️ Sin selector de dificultad. El nivel 4 (castillo de hielo, 1296 líneas de enemigos) es notablemente más difícil que el 1 — buen diseño, pero sin rampa de asistencia para la hermana más chica.

## II.3 Consistencia entre Hub y Platformer (hallazgos cruzados)

Este es el análisis que **solo aparece al mirar las dos apps juntas**:

| Tema | Hub dice… | Platformer dice… | Problema |
|---|---|---|---|
| **Nº de niveles** | "4 niveles" (GamesScreen) | 5 niveles en código (`LEVELS`) + 2 submisiones | Hub desactualizado |
| **Nodos del mapa** | — | `levelmap.js` muestra **4 nodos** + 1 especial, pero hay **5 niveles** (Level5 "Lago" sin nodo) | Nivel 5 inalcanzable desde el mapa |
| **Nombres de nivel** | — | `index.html` ("Sendero Nocturno") ≠ `levelmap.js` ("Castillo de Ciela") ≠ `levelN.data.name` | 3 fuentes de nombres divergentes |
| **Personajes "próximamente"** | Nina ☀️, Jazmin 🩵, Super Natan | **Nina y Jazmín YA son jugables** (heroínas del subnivel "Rescate de Pablo", nivel 2); SuperNatan jugable en su subnivel (nivel 3); Pablo = gatito a rescatar | El hub los marca "próximamente" pero en el platformer **ya existen y se juegan** → hay que sincronizar el roster |
| **Poderes** | descripciones en `characters.ts` | flags reales en `player_characters.js` | ✅ **coinciden** (el Quiz del hub acierta) — mantener así |
| **Semántica de ⭐** | rating 1-3 por movimientos (Memory) | contador de coleccionables (puede ser 10+) | Dos monedas distintas con el mismo ícono |
| **Identidad del jugador** | ninguna | anónima (localStorage por nivel) | Ninguna app sabe quién juega |

## II.4 🔑 El hallazgo crítico: localStorage NO se comparte entre subdominios

> **Esto cambia el diseño de persistencia de la Parte I.**

- El hub vive en `www.nuvecielas.com.ar`.
- El platformer vive en `nuvebosque.nuvecielas.com.ar`.
- `localStorage` está **aislado por origen** (subdominio incluido). **El hub NO puede leer las estrellas/progreso que el platformer guardó, ni viceversa.**
- Además, "Atrapa las Estrellas" está en un **tercer** origen (`stars.nuvecielas.com.ar`), embebido por iframe.

Resultado: hoy hay **tres islas de datos** que nunca se ven entre sí. Un "ecosistema con progresión unificada" (monedas que se ganan en cualquier juego, perfil único, álbum global) **no es posible solo con localStorage** mientras vivan en subdominios distintos. Hay que elegir una estrategia de unificación.

### Opciones de unificación (con recomendación)

| Opción | Cómo | Pro | Contra |
|---|---|---|---|
| **A. Un solo origen** ⭐ *recomendada para empezar* | Servir hub y platformer bajo el **mismo dominio** y rutas (`nuvecielas.com.ar/` y `/bosque/`), no subdominios | localStorage **se comparte** → cero backend, perfil único gratis | Requiere reconfigurar deploy/routing (no toca gameplay) |
| **B. postMessage por iframe** | Embeber el platformer en el hub (como ya se hace con "stars") y sincronizar estado por `window.postMessage` | No mueve dominios; el hub queda como "consola" central | El platformer abre en pestaña nueva hoy (no iframe); fricción móvil; sync más frágil |
| **C. Backend compartido** | API REST (Parte I §7) como fuente de verdad para los 3 orígenes | Multi-dispositivo real, robusto | Operar servidor + datos de menores; mayor esfuerzo |

**Recomendación:** **Opción A** como primer paso (consolidar a un dominio → un `PlayerState` compartido en localStorage), y dejar la **Opción C** (backend) para cuando se necesite sync entre la tablet de una hermana y la compu de la otra. La Opción B solo si querés mantener el platformer como sub-app embebida dentro del hub.

> Nota de producto: si unificás el dominio, el hub puede dejar de "abrir el Bosque Mágico en pestaña nueva" y pasar a una transición interna — el ecosistema se siente **una sola app**, no tres sitios.

## II.5 Persistencia unificada (revisión del modelo de la Parte I)

El `PlayerState` de la Parte I (§8) sigue siendo válido, pero se **extiende** para absorber lo que el platformer ya guarda, y se define una **migración** desde las claves sueltas actuales:

```ts
interface PlatformerProgress {
  unlockedLevel: number;                 // ← migra de 'nuvecielas_unlocked'
  starsByLevel: Record<number, number>;  // ← migra de 'nuvecielas_stars_N' (mejor por nivel)
  cinematicsSeen: string[];              // ← migra de 'nuve_cin_*'
  lastCharacter: string;                 // último personaje jugado
}

interface PlayerState {
  schemaVersion: number;
  profile: PlayerProfile;
  wallet: Wallet;                  // ⭐ globales: del hub Y del platformer
  records: Record<string, GameRecord>;   // mini-juegos del hub
  platformer: PlatformerProgress;        // ← NUEVO: progreso del Bosque Mágico
  collection: Record<string, CollectibleOwned>;
  achievements: string[];
  missions: MissionProgress[];
  streak: Streak;
  settings: Settings;              // ← incluye mute de música (que el platformer hoy no persiste)
}
```

**Migrador `v0 → v1`** (al primer arranque del sistema unificado): leer las claves sueltas del
platformer si existen, copiarlas a `platformer.*`, y conservarlas (no borrar) por compatibilidad.
Así **ningún progreso existente de las niñas se pierde**.

**Economía unificada:** las "estrellas-tile" del platformer y las "estrellas de rating" del hub son
cosas distintas. Propuesta: las **estrellas del platformer suman monedas ⭐ al wallet global**
(p. ej. cada estrella recogida = 1 ⭐), y el rating de mini-juegos sigue siendo 1-3 ⭐ visual de
desempeño. Una sola moneda en la cartera; dos formas de ganarla.

## II.6 Problemas técnicos del Platformer (solo documentados)

| # | Sev. | Hallazgo | Detalle | Recomendación |
|---|---|---|---|---|
| P-PF1 | 🔴 Alta | **Música nivel 1 rota en prod** | `audio.js` usa `'audio/CANCION_NUVE.mp3'` pero el archivo es `cancion_nuve.mp3`. GitHub Pages (Linux) es **case-sensitive** → 404, sin música. | Igualar mayúsculas/minúsculas exactas. |
| P-PF2 | 🟠 Media | **Niveles 3-5 sin música** | `TRACKS` solo define 0,1,2. Niveles 4 y 5 (los más largos) quedan en silencio. | Agregar tracks o reusar uno existente. |
| P-PF3 | 🟠 Media | **Nivel 5 inalcanzable desde el mapa** | `LEVELS` tiene 5 niveles; `levelmap.js NODES` solo 4 numéricos. El Lago (Level5) no tiene nodo. | Agregar nodo idx:4 al overworld. |
| P-PF4 | 🟡 Baja | **Doble semántica de ⭐** | HUD cuenta coleccionables (>3 posible); el mapa muestra capado a 3. Confuso para el jugador y para la economía del ecosistema. | Separar "estrellas recogidas" de "rating de nivel". |
| P-PF5 | 🟡 Baja | **Settings no persisten** | El mute de música se reinicia cada sesión (no hay localStorage de settings). | Persistir en el `Settings` unificado. |
| P-PF6 | 🟡 Baja | **Nombres de nivel divergentes** | 3 fuentes (`index.html`, `levelmap.js`, `levelN.data.name`) con nombres distintos. | Una sola fuente de verdad. |
| P-PF7 | 🟢 Info | **"Ver logros" sin destino** | `onLevelClear` ofrece "🎉 Ver logros" pero no hay pantalla de logros. | Conectar a la pantalla de Logros del ecosistema (§10). |
| P-PF8 | 🟢 Info | **Hub dice "4 niveles"** | Desactualizado vs. 5 niveles + 2 submisiones reales. | Actualizar copy del hub. |

> Ninguno de estos toca el gameplay. P-PF1 es un **quick win de alto impacto** (una línea, devuelve la música).

## II.7 Cómo el Platformer enriquece el ecosistema (oportunidades nuevas)

> 💜 **Activo emocional clave (descubierto en código):** el subnivel **"Rescate de Pablo"** (puerta
> mágica del nivel 2) es un mini-nivel completo (~200 tiles) donde **las protagonistas jugables son
> Nina y Jazmín**, las mellizas reales (Nina = amarilla, Jazmín = celeste). Eligen N o J, rescatan al
> gatito Pablo de su jaula, juntan gatitos, una gema y vencen a un jefe (ladrón/perrero). Esto —que un
> papá haya puesto a sus hijas como heroínas de una misión de rescate— es **el corazón emocional del
> juego** y debería ser el centro del ecosistema, no un detalle escondido: destacarlo en el hub,
> darle su propia entrada en el álbum y celebrarlo. Ver Parte I §14 (apego emocional).

El platformer aporta **material narrativo y de recompensa** que el hub puede explotar:

1. **Cromos de enemigos/jefes.** Ya hay ~12 enemigos con sprites (fantasma, serpiente, ciempiés boss, Rey de Escarcha, gárgolas…). Cada uno puede ser un **cromo** que se desbloquea al derrotarlo por primera vez → bestiario coleccionable que cruza ambas apps.
2. **Cromos de personajes secretos.** Pablo (el gatito 🐱), SuperNatan y **Nina + Jazmín** ya existen en las submisiones (Nina y Jazmín son las heroínas jugables del rescate de Pablo). Convertirlos en desbloqueables del álbum del hub conecta las dos apps narrativamente — y como el hub ya los lista "próximamente", el desbloqueo cierra el círculo.
3. **Recuerdos de hito.** "Derrotaste a la Sombra de las Nuvecielas", "Rescataste a Pablo", "Completaste el Bosque Mágico con todas las estrellas" → fotos/recuerdos en el álbum (apego emocional, Parte I §14).
4. **Misiones cruzadas.** "Recogé 20 estrellas en el Bosque" o "Ganá Memoria Y completá el nivel 1" → misiones que empujan a usar todo el ecosistema.
5. **El overworld como mapa maestro.** El `levelmap.js` del platformer es un patrón excelente; el hub podría adoptar el mismo lenguaje visual de "mapa con nodos" para sus mini-juegos (Parte I, pantalla "Mapa" opcional) → coherencia total.
6. **Cinemáticas como gancho.** El sistema de cinemáticas ya existe; sumar una de bienvenida al ecosistema o de presentación de Nina/Jazmin refuerza el universo.

## II.8 Roadmap ampliado (integración de las dos apps)

Se suma a las fases de la Parte I:

- **Fase 0+ (Higiene platformer):** P-PF1 (música), P-PF3 (nodo nivel 5), P-PF6 (nombres). Quick wins, sin tocar gameplay.
- **Fase 1+ (Decisión de unificación):** elegir Opción A/B/C de II.4. **Es la decisión bloqueante** para todo perfil/wallet/álbum compartido. Recomendado: empezar por consolidar dominio (A).
- **Fase 3+ (Bestiario):** cromos de enemigos/jefes del platformer en el álbum del hub.
- **Fase 4+ (Misiones cruzadas):** objetivos que abarcan hub + platformer.
- **Fase 5+ (Settings unificados):** mute de música del platformer + accesibilidad del hub en un solo panel persistente.

## II.9 Decisión que necesito de vos (para seguir)

La única bifurcación real es **cómo unificar los datos de las dos apps** (II.4). Todo lo demás se deriva de esa elección. Mi recomendación: **Opción A (un solo dominio)** para arrancar simple, y backend (C) solo cuando haga falta multi-dispositivo. Si confirmás esa dirección, el siguiente entregable es el diseño a nivel de archivos de la **Capa de Jugador unificada** (el `PlayerState` + migrador desde las claves del platformer), sin tocar el gameplay de ninguna de las dos apps.

---

# ★ FEATURE ESTRELLA — El Taller de Nuvecielas (crear personajes)

> Surge directamente de la narrativa (§0.0): *las niñas son las creadoras de las Nuvecielas y siguen
> creando nuevas.* Convertir eso en una **mecánica jugable dentro del juego** es la idea más
> potente y más on-brand de todo el ecosistema. No es una feature más: es **la materialización del
> corazón del proyecto**. La jugadora deja de "elegir personajes" y pasa a **ser la creadora**, igual
> que Nina y Jazmín en la vida real.

## La idea
Una pantalla **"Taller de Nuvecielas"** (o "Fábrica de Manos") donde la jugadora **crea su propia
Nuveciela**: le pone nombre, elige forma/color/accesorios, define su poder y su personalidad, y la
guarda en su colección. La nueva Nuveciela aparece en el álbum, en la galería de personajes, y
—idealmente— **se puede jugar**.

## Niveles de ambición (incremental — elegí hasta dónde llegar)

| Nivel | Qué permite crear | Esfuerzo | Jugable en platformer |
|---|---|---|---|
| **N1 · Ficha** ⭐ *empezar acá* | Nombre + color + emoji + elegir poder de una lista + escribir tagline/gustos (como la data de `characters.ts`) | Bajo | No (solo coleccionable/ficha) |
| **N2 · Avatar por piezas** | Lo anterior + armar el aspecto con **partes pre-dibujadas** (cuerpo, ojos, pelo, accesorios, alas) estilo "constructor" | Medio | Como skin de un personaje base |
| **N3 · Foto a personaje** | Subir/sacar una **foto de un dibujo hecho a mano** y recortarla como sprite (encaja perfecto con "hechas con las manos") | Medio-alto | Como sprite estático |
| **N4 · Jugable real** | La creación hereda los **stats + `projectileDef`** de un arquetipo y se vuelve **personaje jugable** en el Bosque Mágico | Alto | Sí |

**Recomendación:** **N1 + N3** es el punto dulce. N1 da el sistema de datos y la sensación de
autoría; N3 ("tu dibujo de verdad se vuelve un personaje") es **emocionalmente imbatible** para una
niña de 10 y se alinea literalmente con "Nuvecielas hechas a mano". N4 (jugable) se puede sumar
después porque el platformer **ya es data-driven**: una Nuveciela creada solo necesita elegir un
arquetipo (`nuveciela`/`ciela`/`lunaria`/`nuve`) del que hereda físicas y proyectil — el motor no
necesita cambios estructurales.

## Por qué encaja sin romper nada
- El platformer ya separa **datos de personaje** (`player_characters.js`) del **motor** → una
  Nuveciela creada es solo una entrada de datos más (con un `archetype` que define stats/proyectil).
- El hub ya tiene la estructura `Character` en `characters.ts` y un `NewCharacter` para "próximamente"
  → una creación es un `Character` generado por la jugadora, guardado en el `PlayerState` (§II.5).
- Conecta con todos los sistemas ya diseñados: la creación es un **coleccionable**, da un **logro**
  ("¡Creaste tu primera Nuveciela!"), puede costar/dar **⭐**, y es contenido que **motiva volver**.

## Flujo de usuario
```
Taller → [Nueva Nuveciela]
  → Nombre  ("¿Cómo se llama?")
  → Aspecto (color + piezas  /  o subir foto de tu dibujo)
  → Personalidad (tagline, gustos, 3 rasgos)  ← reusa el formato de characters.ts
  → Poder (elegí un arquetipo: 🔥 fuego / ❄️ hielo / ☀️ rayo / 🎨 colores)
  → Vista previa + "✨ ¡Darle vida!" (confeti, se une al grupo)
  → Aparece en Amigas + Álbum (+ jugable si N4)
```

## Consideraciones (anotadas, no bloqueantes)
- **Privacidad de menores:** si se permite subir fotos, deben quedar **solo locales** (nunca subir a
  un servidor sin consentimiento parental explícito). Local-first lo resuelve gratis.
- **Moderación de nombres:** texto libre escrito por niñas → mantenerlo offline/privado evita
  cualquier problema. No compartir creaciones públicamente (al menos no sin control parental).
- **Roadmap:** encaja como **Fase 3.5** (después de Colección/Álbum, que aporta el marco donde viven
  las creaciones). Es alto impacto / esfuerzo medio si se queda en N1+N3.

---

## Anexo II · "No tocar" del Platformer (esencia a preservar)
- El motor data-driven (agregar personaje = solo `player_characters.js`).
- La física y las habilidades por personaje (ya coinciden con el lore del hub).
- El overworld con nodos, los checkpoints, las cinemáticas, los submisiones (Pablo, Natan).
- La música por nivel y los sfx (solo arreglar el bug de mayúsculas, no rehacer).
- La estructura de carga por `<script>` en orden — funciona y es simple; no migrar a build salvo necesidad real.
