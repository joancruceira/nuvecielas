# 🌅 Etapa 1 — "Manolandia Despierta"

> **El mundo vivo del launcher.** Primer documento de diseño concreto del ecosistema.
> **Principio rector:** el protagonista es **Manolandia** (el mundo), no un personaje. La magia es
> **ambiental, nunca un peaje**. Ver `DIRECCION_CREATIVA.md`.
> **Restricciones:** incremental y compatible con el hub actual (React + `theme.css`). No cambia el
> gameplay, no toca los mini-juegos, no agrega backend. **Sin código todavía** — esto es la guía de
> diseño/arte/comportamiento desde la que se implementará.

---

## 1. Qué construimos en esta etapa (y qué no)

**Construimos:** transformar la pantalla de inicio del hub, hoy un *menú decorado con fondo
estático*, en **un lugar vivo** — un cielo de Manolandia que respira, con vida ambiental, hora del
día, personajes que actúan, y una anfitriona que asoma a saludar — **sin que nada de eso demore el
"Jugar"**.

**Resultado emocional buscado:** que al abrir, la niña no sienta "se cargó la app", sino *"llegué a
Manolandia"*.

| ✅ Dentro de alcance | ❌ Fuera de alcance (etapas siguientes) |
|---|---|
| Mundo vivo de fondo (cielo, parallax, vida ambiental) | El Taller de Nuvecielas (crear personajes) |
| Sistema de hora del día | El Libro de las Nuvecielas (colección) |
| Personajes vivos (idle: parpadeo, respiración, juego) | Backend / persistencia de progreso |
| Anfitriona que asoma y saluda (no bloqueante) | Misiones, monedas, logros |
| Descubrimiento ambiental al tocar | Rediseño de los mini-juegos |
| Reduced-motion + presupuesto de performance | Unificación visual con el platformer |

> Disciplina de alcance: esta etapa hace **una cosa excepcionalmente bien** — la entrada al mundo.
> Todo lo demás cuelga de que esto se sienta mágico.

---

## 2. La anatomía del mundo vivo (escena por capas)

Manolandia es una **escena con profundidad**, no una imagen. Se compone de capas que se mueven a
distintas velocidades (parallax). De atrás hacia adelante:

```
┌─ CAPA 0 · CIELO ────────────────────────────────────────────┐  (color según hora del día)
│   gradiente que cambia: amanecer → día → atardecer → noche    │
│                                                               │
│   ✦ CAPA 1 · CELESTE LEJANO  (estrellas, luna/sol, nubes      │  parallax x0.1
│     lejanas, alguna estrella fugaz ocasional)                 │
│                                                               │
│      🏔 CAPA 2 · HORIZONTE DE MANOLANDIA  (colinas suaves,    │  parallax x0.3
│         siluetas de "casitas hechas a mano", un molino que    │
│         gira lento)                                           │
│                                                               │
│         🦋 CAPA 3 · VIDA AMBIENTAL  (mariposas, pajaritos     │  parallax x0.6
│            que cruzan, pétalos/chispas que flotan)            │
│                                                               │
│   ╭─────────────────────────────────────────────────────╮   │
│   │  CAPA 4 · ESCENARIO PRINCIPAL                         │   │  parallax x1.0
│   │  La pradera/nube donde VIVEN las Nuvecielas.          │   │
│   │  Acá están los personajes y la anfitriona.           │   │
│   ╰─────────────────────────────────────────────────────╯   │
│                                                               │
│   CAPA 5 · UI (título, botones)  ← flota POR ENCIMA, legible  │  fija
└───────────────────────────────────────────────────────────────┘
```

**Nota de arte clave (el sello):** Manolandia está *hecha a mano*. Las casitas, el molino y los
elementos del mundo deberían **verse manuales** — textura de papel, crayón, fieltro, recortes — no
vectores perfectos. Eso conecta visualmente con la verdad de la marca: *este mundo lo hicieron unas
nenas con sus manos*. Es dirección de arte, no decoración.

**Reutiliza lo que ya existe:** el hub ya tiene fondo nocturno + estrellas titilando + gradiente
arcoíris animado (`theme.css`). Esta etapa **no los tira** — los promueve de "fondo" a "Capa 0/1 de
un mundo con más capas encima".

---

## 3. La hora del día — "el mundo cambió desde ayer"

El mundo **no es siempre el mismo**. Refleja la **hora real** del dispositivo, así que abrir a la
mañana se siente distinto a abrir de noche. Es la forma más barata y potente de que el mundo se
sienta vivo **sin backend** (solo lee el reloj).

| Momento | Cielo | Astro | Vida ambiental | Sensación |
|---|---|---|---|---|
| 🌅 Amanecer (6–10) | rosa/durazno | sol bajo, tibio | pajaritos cantan | "el mundo despierta con vos" |
| ☀️ Día (10–18) | celeste luminoso | sol alto | mariposas, brisa | "energía, a jugar" |
| 🌆 Atardecer (18–21) | naranja/violeta | sol que baja | luciérnagas que empiezan | "calma dorada" |
| 🌙 Noche (21–6) | el nocturno actual | luna + estrellas | estrellas fugaces | "el mundo mágico de siempre" |

**Capa extra de "vivo" sin backend — variación diaria:** una pequeña sorpresa que depende del día
(semilla = fecha): hoy hay una estrella fugaz nueva, hoy Nuve está persiguiendo una mariposa, hoy
salió un globo. No requiere guardar nada: el mismo día se ve igual, mañana cambia. Así, *volver*
siempre tiene un detalle nuevo.

> Cuando exista la capa de persistencia (etapa posterior), esto se potencia: "hace 3 días que no
> venías" → el mundo lo nota. Pero **el efecto base funciona ya, solo con el reloj.**

---

## 4. La secuencia de despertar (los primeros segundos)

Acá resolvemos la tensión entre *"que sea mágico"* y *"que los chicos entren rápido"*. La solución:
**dos modos de entrada**.

### 4.1 Primera vez de la vida (una sola vez) — el hechizo completo
La única vez que vale la pena el reveal de 2 segundos es **la primera**. Es el momento "creí".
```
0.0s  Negro suave → el cielo de Manolandia aclara (fade del color de la hora)
0.4s  Aparecen las capas lejanas (estrellas/sol, horizonte, molino empieza a girar)
0.8s  Entra la vida ambiental (una mariposa cruza, un pajarito)
1.2s  Las Nuvecielas "aparecen" en el escenario (bounce-in suave, escalonado)
1.6s  Lunaria asoma de su casita, mira a la niña
2.0s  Saluda: "¡Hola! Bienvenida a Manolandia ✨"  + aparecen los botones
```
Esto se muestra **una vez** (luego queda marcado como visto). Es onboarding, no rutina.

### 4.2 Todas las demás veces — entrada instantánea con magia ambiental
```
0.0s  El mundo YA está vivo y a pleno (no hay "intro que arranca"). Botones presentes.
~0.3s Los botones terminan su fade-in (no se hacen esperar).
~0.8s Lunaria (o quien toque hoy) asoma y suelta un saludo corto EN PARALELO,
      en una burbuja que la niña puede ignorar por completo.
```
La niña puede tocar **"Jugar" en el segundo 0** y entrar. La magia ocurrió igual, de fondo.

> **Regla de oro, hecha contrato:** después de la primera vez, **nunca** hay una animación que la niña
> tenga que esperar o saltar. El mundo vivo es un lugar para quedarse, jamás un peaje para pasar.

---

## 5. Personajes vivos (sin IA — animación clásica)

Las Nuvecielas dejan de **posar** y empiezan a **vivir**. Todo con animación de sprite/CSS, cero IA.

### 5.1 Comportamientos en reposo (idle loop)
Cada personaje cicla micro-acciones cada pocos segundos, **desincronizadas** entre sí (que no
parezcan robots en fila):
- **Respiración** (escala 1.0↔1.03, ~3s) — la base, siempre activa.
- **Parpadeo** (cada 3–7s, aleatorio).
- **Mirar** — giran la cabeza/ojos hacia el cursor o el dedo (en táctil, hacia el último toque).
- **Micro-gestos ocasionales:** bostezar, estirarse, reírse, saludar con la mano, mirar al cielo.

### 5.2 Comportamientos de relación (lo que las vuelve "amigas")
Cada tanto, **dos personajes interactúan**: Ciela persigue una mariposa, Nuve le muestra algo a
Lunaria, una abraza un peluche, dos se ríen juntas. Estos "momentitos" son los que generan la
sensación de que **están vivas aunque la niña no haga nada**.

### 5.3 Reacción a la niña
- **Al pasar el cursor / tocar** una Nuveciela: reacciona (sonríe, salta, dice algo cortito con su
  voz). No abre una ficha de golpe — **primero reacciona como personaje**, y si insiste, ahí sí entra
  a conocerla.
- **Al ganar un mini-juego** (cuando se vuelve al launcher): las amigas **festejan**.

### 5.4 La anfitriona del día
Lunaria (inventora-soñadora) es la anfitriona natural, pero **puede rotar** (otro día te recibe Nuve,
otro Ciela) → otra razón para que "volver" se sienta distinto. La anfitriona:
- Asoma del mundo (sale de una casita / baja de una nube), **no aparece como un cartel**.
- Saluda corto y con personalidad. Si hay nombre guardado: *"¡Hola, Nina!"*. Si todavía no
  (esta etapa puede no tener persistencia): un saludo cálido genérico *"¡Hola! Te estábamos
  esperando ✨"*.
- A veces tira un gancho suave: *"¿Sabés qué? Anoche pasó algo…"* (semilla narrativa para futuras
  etapas — hoy puede ser solo color).

> Dependencia anotada (no bloqueante): el saludo **por nombre** necesita la capa de jugador (etapa
> de persistencia). Diseñamos el saludo para que **funcione hermoso con o sin nombre**, así esta
> etapa no depende del backend.

---

## 6. Descubrimiento ambiental (premiar la curiosidad)

Si la niña decide **quedarse mirando**, el mundo la recompensa con pequeños secretos — nunca
obligatorios:
- Tocar una **nube** → se deshace en chispas / llueve purpurina un segundo.
- Tocar el **molino** → gira más rápido y suena.
- Tocar una **estrella** del cielo → titila y suena una nota.
- Tocar una **mariposa** → se posa en el dedo un instante.
- Tocar repetido a una Nuveciela → revela un mini-gesto especial (huevo de pascua).

Esto convierte el launcher en un **lugar con cosas para encontrar**, no una pantalla de paso. Es la
semilla del asombro (pilar creativo) y da motivo para volver a mirar.

---

## 7. Lenguaje de cámara y movimiento

- **Parallax sutil** que sigue el cursor / la inclinación del dispositivo (giroscopio en móvil, con
  amplitud chica): al mover, las capas se desplazan a distinta velocidad → sensación de profundidad,
  de "ventana a un mundo 3D", sin ser 3D.
- **Respiración del mundo:** un vaivén lentísimo y global (las nubes derivan, la luz oscila apenas).
- **Nada brusco.** Todo es suave, orgánico, con easing tipo resorte. El mundo está *tranquilo y
  vivo*, no agitado.

---

## 8. Accesibilidad y `prefers-reduced-motion`

El mundo sigue vivo, pero **se calma** cuando el sistema lo pide (corrige el hallazgo AC-01 del
audit):
- Con `prefers-reduced-motion`: se **apagan** parallax, estrellas fugaces, vida ambiental rápida y
  micro-gestos frecuentes. Se **conservan** la respiración lentísima y el cambio de hora del día (no
  marean). El mundo se siente *en calma*, no *muerto*.
- **Contraste:** la UI (título, botones, burbuja de diálogo) siempre sobre una base que garantice
  legibilidad (objetivo 4.5:1) por encima del mundo vivo — el mundo nunca compite con el texto.
- **Sin sorpresas sonoras:** los sonidos ambientales respetan el mute global (que esta etapa puede
  introducir como parte de la regla de oro / control parental).

---

## 9. Presupuesto de performance (es un launcher, debe volar)

El mundo vivo **no puede** convertir la entrada en algo pesado (sería ironía cruel: matar el "entrar
rápido" con la magia que lo celebra). Reglas de diseño:
- **Técnica liviana:** capas con CSS transforms / sprites, no un motor de juego. Animar solo
  `transform`/`opacity`.
- **Pocos actores a la vez:** vida ambiental con 2–4 elementos en pantalla, no enjambres.
- **Pausar cuando no se ve:** si la app pierde foco/visibilidad, el mundo se "duerme" (ahorra batería).
- **Degradación elegante:** en dispositivos lentos, menos capas/actores; el mundo sigue siendo
  bonito, solo más quieto.
- **Objetivo:** 60fps en una tablet de gama media; "Jugar" interactivo desde el primer frame.

---

## 10. Estados del launcher (máquina de estados conceptual)

```
   [Cargando] ──► [Despertar*]* ──► [Mundo vivo / idle] ◄──┐
                   (*solo 1ª vez)         │                 │
                                          ├─► [Momento de personaje]  (saludo, gesto)
                                          ├─► [Descubrimiento]        (la niña toca algo)
                                          └─► [Festejo]               (volvió de ganar un juego)
   En cualquier estado: "Jugar" / navegación SIEMPRE disponibles.
```

El estado por defecto y permanente es **"Mundo vivo / idle"**: ahí es donde la niña *está* en
Manolandia. Los demás son momentos que entran y salen sin bloquear.

---

## 11. Cómo encaja con el código actual (compatibilidad, sin implementar)

> No se escribe código en este documento; solo se señala dónde aterrizaría, para confirmar que es
> **aditivo y no rompe nada**.

- Vive dentro de `HomeScreen` (hub), como **capas de fondo nuevas** detrás del contenido actual
  (título + tiles + botones siguen existiendo; los tiles pueden evolucionar a "personajes vivos").
- Reaprovecha tokens y animaciones de `theme.css` (estrellas, arcoíris, floats) como punto de partida.
- El resto del hub (nav, mini-juegos) **no se toca**.
- El saludo por nombre queda detrás de una interfaz simple ("dame el nombre") que, cuando exista la
  capa de jugador, se llena sola; mientras tanto, saludo genérico.
- Es **reversible**: si el mundo vivo se desactivara, el launcher vuelve a funcionar como hoy.

---

## 12. Lista de assets a producir (shopping list para arte)

> Para que el documento sea accionable por un ilustrador.

- **Cielos** por hora del día (4 gradientes/fondos: amanecer, día, atardecer, noche).
- **Astros:** sol (variantes alto/bajo) y luna. (Estrellas ya existen.)
- **Horizonte de Manolandia hecho a mano:** colinas, 3–5 casitas, 1 molino animable (aspas).
- **Vida ambiental:** mariposa, pajarito (ciclo de vuelo), pétalos/chispas, estrella fugaz, luciérnaga.
- **Personajes vivos:** para cada Nuveciela (Nuve, Ciela, Nuveciela, Lunaria), set mínimo de idle —
  pose base + parpadeo + 1–2 micro-gestos (saludo, risa). *(Se parte de los PNG actuales.)*
- **Anfitriona:** Lunaria con casita/punto de aparición + pose de saludo.
- **Burbuja de diálogo** con estilo de marca (hand-made).
- **FX de descubrimiento:** purpurina, destello, nota visual.

> Producción incremental posible: arrancar con **noche** (lo que ya existe) + **respiración/parpadeo**
> de los 4 personajes + **Lunaria saluda**. Eso ya cambia todo. El resto (horas del día, vida
> ambiental rica) se suma por capas.

---

## 13. Definición de "listo" — el test del sentir

Esta etapa está lograda cuando, mostrándosela a una niña sin explicar nada:
1. Al abrir, dice algo como *"¡mirá!"* en vez de quedarse esperando.
2. Señala un personaje y nota que **la está mirando / hace algo**.
3. Si la dejás sola 20 segundos, **se queda mirando** el mundo (no se aburre).
4. Pero si quiere jugar, **entra al instante** sin sentir que algo la frena.
5. Vuelve más tarde y nota que **algo está distinto** (la hora, un detalle).

Si esas cinco cosas pasan, Manolandia despertó.

---

## 14. Qué prepara esto para las próximas etapas
- El **mundo vivo** es el escenario donde después nacerán las Nuvecielas (Taller) con ceremonia.
- La **anfitriona con voz** es el canal natural para misiones, premios diarios y narrativa.
- La **hora del día / variación diaria** es el primer ladrillo del "mundo que te conoce" (que se
  completa con persistencia).
- El **descubrimiento ambiental** es la semilla del asombro y el coleccionismo (Libro de las
  Nuvecielas).

> Esta etapa no agrega un personaje: **prende la luz de Manolandia y la deja respirar.** Desde ese
> mundo vivo, todo lo demás del ecosistema tiene dónde nacer.
