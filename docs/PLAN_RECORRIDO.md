# 🧵 Plan por fases — Un solo recorrido entre los tres juegos

> **Estado:** propuesta para aprobar. **Nada implementado.**
> **Alcance:** tres repos (`nuvecielas`, `nuvecielasPlatformer`, `nuvegame`).
> **Fecha:** 2026-08-17.

---

## 1. Lo que encontré en el código (y que cambia la prioridad)

Ahora que los tres juegos comparten origen pude leerlos de verdad. Tres hallazgos:

### 1.1 🔴 Los dos juegos guardan el progreso SIN saber de quién es

| Clave | Quién la escribe | Problema |
|---|---|---|
| `nuve_best` | `estrellas/game.js:328` | **Un solo récord para toda la familia** |
| `nuvecielas_unlocked` | `bosque/js/Levelmap.js:89` | **Un solo avance de niveles para todos** |
| `nuvecielas_stars_N` | `bosque/js/Levelmap.js:101` | Ídem, estrellas por nivel |
| `nuve_cin_*` | `bosque/js/Levelmap.js:214` | Cinemáticas "ya vistas" por todos |

**Esto no lo rompió la mudanza a un solo dominio**: en el navegador de casa, el
platformer en su subdominio ya tenía un único progreso compartido por quien lo
usara. Lo que cambió es **la expectativa**: ahora la app pregunta quién sos y te
saluda por tu nombre, así que la primera vez que Jazmín entre y vea el récord de
Natan, o que el mapa esté desbloqueado hasta un nivel que ella nunca jugó, se va
a sentir **un bug** — porque emocionalmente lo es.

> **Conclusión:** separar el progreso por jugador no es una mejora opcional del
> plan. Es la **deuda que dejó abierta** la unificación de rutas, y tiene que ir
> primero.

### 1.2 🟢 Un regalo que ya está funcionando

Los dos juegos usan la misma clave `nuve_muted` (`estrellas/game.js:71`,
`bosque/js/audio.js:112`). Desde que comparten origen, **silenciar en un juego
silencia el otro**, sin que nadie lo programara. Es la prueba de que el contrato
compartido funciona, y el precedente de lo que propongo abajo.

### 1.3 🟢 Las costuras son pocas y están localizadas

- **Atrapa las Estrellas** — un solo archivo IIFE. Tres puntos:
  `validateStart()` (301), `startGame()` (534), `saveBest()` (324) + `renderBest()` (1874).
- **Bosque Mágico** — 40+ scripts, pero todo el estado pasa por **cuatro funciones**
  en `Levelmap.js` (`_getUnlocked`/`_setUnlocked`/`_getStars`/`_setStars`, líneas 84–101).
  Y `index.html` los carga en orden, así que meter un script antes es trivial.

Traducción: el trabajo es de **diseño y de contrato**, no de cirugía. Eso baja
mucho el riesgo.

---

## 2. El recorrido que propongo

Hoy el universo tiene un solo hilo que viaja: el dominio. Propongo que viajen
**cuatro cosas**, en este orden de importancia:

```
   QUIÉN SOS  →  LO QUE HICISTE  →  LO QUE ENCONTRASTE  →  EL MUNDO CAMBIA
      (1)             (2)                  (3)                   (4)
```

### Cómo se siente, en una sesión real

1. **Entra a Manolandia.** Lunaria la saluda por su nombre. *(ya funciona)*
2. **El mundo le cuenta algo desde la última vez:** *"Ayer atrapaste 14 estrellas"*,
   *"Te falta poquito para el Castillo de la Ciela"*. Manolandia deja de ser
   una foto y pasa a ser alguien que estuvo esperando.
3. **Toca "Bosque Mágico" y no le vuelven a preguntar quién es.** El mapa está
   donde ella lo dejó. Su hermano no le movió nada.
4. **Gana un nivel.** Vuelve al hub y el mundo **se enteró**: alguien lo comenta,
   queda anotado.
5. **En Atrapa las Estrellas encuentra una estrella con nombre.** No es un punto
   más: es un objeto que **se queda con ella**.
6. **En Pinta, esa estrella está disponible como sello.**
7. **A la noche, el cielo del Home tiene la constelación que armó.**

El paso 3 es el que pidieron las mellis. Los pasos 4–7 son los que convierten
tres juegos en un universo.

### El principio que gobierna todo

> **Nada se pierde y nada se gasta.** Lo que junta es un objeto con historia,
> nunca una moneda. Sin tienda, sin energía, sin racha que se rompa. Volver
> tiene que ser un gusto, nunca una obligación.

---

## 3. La arquitectura: un contrato, tres consumidores

El problema técnico real: **tres bases de código independientes tienen que
ponerse de acuerdo en los nombres y las formas exactas de los datos.** Si una se
desincroniza, se pierde el progreso de una nena — que es el peor bug posible acá.

**Propuesta:** un único archivo `public/nuve-world.js`, JS plano sin build, que
expone `window.NuveWorld`.

```
  public/nuve-world.js        ← LA fuente de verdad del esquema
        ↑              ↑              ↑
   <script> en     <script> en    src/world/bridge.ts
    estrellas       bosque        (tipos + hooks de React)
```

- Los dos juegos lo cargan con `<script src="/nuve-world.js">` **antes** de sus
  propios scripts. Cero build, cero bundler, cero dependencias.
- El hub lo carga en `index.html` y `src/world/` pasa a ser una capa tipada
  encima. Los hooks de React (`useProfile`, `useGameStats`, …) no cambian de
  forma: cambia de dónde leen.

**Por qué un archivo compartido y no "documentamos el esquema y lo implementamos
tres veces":** el esquema es chico pero los errores son irreversibles. Una sola
implementación de `read/write/migrar` es la diferencia entre un bug de UI y
perder el álbum de alguien.

**Qué NO va en `nuve-world.js`:** nada de React, nada de UI, nada de IndexedDB
(la galería de dibujos se queda donde está). Sólo perfil, colección y diario.

---

## 4. Las fases

### Fase 0 — El contrato *(fundación, invisible)*

Crear `nuve-world.js` con perfil, colección y diario, claves `nuve_v1_*`,
lecturas tolerantes y **migración de lo viejo**. Hub delegando a él.

**Lo delicado — qué pasa con el progreso que ya existe.** Hay un `nuve_best` y un
`nuvecielas_unlocked` que hoy son de "quien haya jugado". Mi propuesta: **no
borrar nada nunca**; al primer perfil que abra cada juego se le *ofrece adoptar*
ese progreso huérfano ("¿Esto lo hiciste vos?"), y si dice que no, queda guardado
por si lo reclama otro. Cero resets sorpresa.

| | |
|---|---|
| **Toca** | los 3 repos |
| **Se ve** | nada |
| **Riesgo** | medio (es el cimiento de todo) |
| **Depende de** | — |

---

### Fase 1 — El nombre viaja *(lo que pidieron las mellis)*

- **Estrellas:** si ya hay perfil, **no pide el nombre**. El HUD lo muestra y
  queda un "no soy yo" chiquito para cambiar. Si no hay perfil, sigue como hoy
  (y lo que escriba ahí **crea** el perfil, que es lo que pidieron: cualquier
  chico puede entrar escribiendo su nombre desde cualquier puerta).
- **Bosque:** saluda por nombre en el menú (`menu-hint`, `index.html:36`).
- **Los dos:** récord y avance **por jugador**. Acá se salda 1.1.

| | |
|---|---|
| **Toca** | los 3 repos (poco en cada uno) |
| **Se ve** | mucho, y arregla el problema de los hermanos pisándose |
| **Riesgo** | bajo |
| **Depende de** | Fase 0 |

---

### Fase 2 — Lo que hacés vuelve a casa *(el diario)*

Cada juego anota lo que pasa (`nivel superado`, `récord nuevo`, `partida
jugada`). El hub lo lee y **el mundo reacciona**:

- En "Juegos": *"Tu récord: 480"*, *"Vas por el Sendero Nocturno"*.
- En el Home: Lunaria comenta lo último que hiciste.
- Botón **"Seguí donde dejaste"**.

| | |
|---|---|
| **Toca** | los 3 repos |
| **Se ve** | es el primer momento en que el universo se siente uno |
| **Riesgo** | bajo |
| **Depende de** | Fases 0 y 1 |

---

### Fase 3 — Lo que encontrás viaja *(la colección)*

Estrellas raras y con nombre en "Atrapa las Estrellas" → entran a la colección →
**aparecen como sellos en Pinta** y **como constelaciones en el cielo del Home**.

Es el único punto donde hay que meterse con el *gameplay* de un juego (el
spawner de estrellas), no sólo con su borde.

| | |
|---|---|
| **Toca** | `nuvegame` (gameplay) + hub |
| **Se ve** | es **el** momento mágico: algo que ganaste en un juego aparece solo en otro |
| **Riesgo** | medio |
| **Depende de** | Fases 0–2 |

---

### Fase 4 — El Libro de las Nuvecielas

Una sola pantalla donde vive todo: quién sos, qué encontraste, qué lograste en
cada juego, qué dibujaste. No un inventario: **un álbum de familia del mundo.**

| | |
|---|---|
| **Toca** | sólo el hub |
| **Se ve** | le da casa a todo lo anterior |
| **Riesgo** | bajo |
| **Depende de** | Fases 0–3 |

---

### Fase 5 — Continuidad de mundo

Que entrar y salir de un juego no sea un corte: transición común, el mute ya
compartido hecho explícito, música que acompaña, y el Home volviéndose mapa.

| | |
|---|---|
| **Toca** | los 3 repos |
| **Se ve** | deja de sentirse "cambio de canal" |
| **Riesgo** | medio (es lo más de diseño) |
| **Depende de** | todo lo anterior |

---

## 5. Riesgos, sin maquillar

1. **Perder progreso de alguien.** Es el riesgo grave. Mitigación: no borrar
   nunca, sólo agregar; claves nuevas versionadas; lo viejo se lee pero no se
   pisa; probar con datos reales antes de publicar.
2. **Tres repos que se despliegan por separado.** Si el hub sale con el contrato
   nuevo y los juegos todavía no, tiene que **seguir funcionando igual**. Todo
   lo nuevo se diseña como opcional: si `NuveWorld` no existe, cada juego se
   comporta exactamente como hoy.
3. **Actualizar submódulos es de a dos pasos.** Cada cambio en un juego son dos
   commits (el del juego, y el del puntero acá). Es fricción real y constante.
4. **No hay tests en ninguno de los tres.** Todo se verifica a mano en el
   navegador. Se puede vivir con eso en esta escala, pero conviene decirlo.
5. **El platformer son ~16.000 líneas que no escribimos nosotros hoy.** Toco lo
   mínimo: un `<script>` y cuatro funciones de `Levelmap.js`.

---

## 6. Lo que necesito decidido antes de empezar

1. **¿Arrancamos por Fase 0 + 1 juntas?** Solas no se ven; juntas resuelven el
   pedido de las mellis y saldan la deuda del progreso compartido. Es mi
   recomendación.
2. **El progreso huérfano que ya existe** (`nuve_best`, `nuvecielas_unlocked`):
   ¿te parece bien lo de "ofrecer adoptarlo" en vez de repartirlo o borrarlo?
3. **¿Hasta dónde llegamos ahora?** Fases 0–2 ya dan la sensación de universo
   unido. Las 3–5 son otro proyecto, más creativo que técnico.
