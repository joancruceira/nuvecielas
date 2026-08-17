# 🌊 Atravesando el Lago — diseño del nivel

> **Repo:** `nuvecielasPlatformer` · nivel índice 4 (el último del juego)
> **Fecha:** 2026-08-17. **Construido:** 2026-08-18.

## Estado — qué de todo esto ya está en el juego

| Pieza | Dónde |
|---|---|
| Los cinco enemigos del lago | `js/enemies/enemies_level5.js` |
| Los 45 sprites | `img/level5/` + manifest `4:` en `asset_loader.js` |
| Burbujas (ambiente, géiser y montable) | `js/lago.js` |
| Corrientes | `js/lago.js` + `Level5.data.corrientes` |
| Almeja con perla | `js/lago.js` (la perla es una estrella común puesta en su boca) |
| Coral, algas, ruinas y la estatua | `js/lago.js`, se colocan como tiles 48-51 |
| Coral punzante en vez de pinchos | `renderer_tiles.js`, con el flag `lago: true` |

**Queda pendiente** una sola cosa de este documento: el **coral que respira** (el que
se abre y se cierra con ritmo fijo). La almeja terminó cubriendo ese rol —trampa de
timing que se puede leer y esperar— así que agregarlo sería repetir la lección.

Dos decisiones se resolvieron distinto de lo escrito abajo, y por buenos motivos:

- **El mapa quedó en 16 tiles de alto**, no más. La verticalidad la dan el géiser y
  las burbujas montables, que llevan de la fila 12 a la 3: se siente alto sin tocar
  la cámara.
- **El empuje del agua no toca `player.js`.** `lago.js` corre después de
  `Player.update()` y sólo modifica la VELOCIDAD; la posición y la colisión las
  sigue integrando el jugador. Era el único punto del plan sin precedente y terminó
  no necesitando ninguno.

---

---

## 1. Qué hay hoy, sin maquillar

Leí `js/level5.js` entero. Son 129 líneas y es un **placeholder honesto**:

| Lo que dice el código | Lo que es realmente |
|---|---|
| `// Voladores actúan como medusas/peces` | El enemigo genérico `flyer`, el mismo del bosque, 10 veces |
| `// Pinchos (corales y trampas)` | `TILE.SPIKES`, los mismos pinchos de todos los niveles |
| `// Plataformas flotantes (corales flotantes)` | `TILE.PLATFORM`, idéntica al resto |
| `// Estrellas burbujeantes` | Estrellas normales |
| Manifest de assets del nivel 4 | **No existe.** Cero arte propio |

Lo único genuinamente propio y genuinamente bueno es la física:

```js
physics: { swim: true, gravity: 320, maxFall: 250, hDrag: 0.65, strokeVy: -300 }
```

Eso ya está enganchado en `player.js:184-211` y funciona. **Es el cimiento y no se toca.**

El resto es un pasillo de 180×16 con techo. Nadar en un pasillo horizontal desaprovecha
exactamente lo único que el agua te regala: **poder ir para arriba.**

---

## 2. Los tres pilares del nivel

### 2.1 El agua es libertad, no un pasillo mojado
En tierra el jugador cae. Acá **flota**. El nivel tiene que leerse en vertical: rutas
altas y bajas, subir para esquivar, bajar para buscar. Si se puede jugar entero yendo
recto, no es un nivel de agua.

### 2.2 El agua te mueve a vos
En tierra vos movés al personaje. Bajo el agua, **el agua también te mueve**:
corrientes que empujan, géiseres que elevan, cardúmenes que te corren.
Ese es el verbo nuevo, y ningún otro nivel del juego lo tiene.

### 2.3 Es el final del juego
`map[12][172] = TILE.PORTAL; // Portal final del juego`. No es un nivel más: es **el
último**. Tiene que cerrar, y tiene que dar miedo un poquito antes de terminar.

---

## 3. Objetos nuevos

### 🫧 Burbujas — el objeto estrella del nivel

Tres usos distintos del mismo elemento, de menos a más:

1. **Géiser** — una grieta en el fondo escupe una columna de burbujas. Metés a la
   nena adentro y **sube rápido**. Es el ascensor del nivel: gratis, divertido, y se
   entiende sin explicación.
2. **Burbuja montable** — una burbuja grande sube despacio; te metés adentro y viajás.
   **Explota** si toca un coral punzante o el techo. Plataforma móvil, pero frágil.
3. **Burbujitas de ambiente** — no hacen nada. Suben, brillan, revientan. Son el 80 %
   de la sensación de "estoy bajo el agua" y cuestan casi nada (van por canvas, no por
   sprite).

> **Decisión de diseño: NO hay barra de oxígeno.** Es el reflejo obvio de un nivel
> subacuático y sería un error: mete un reloj de castigo justo en el nivel donde
> queremos que exploren. Las burbujas son un **regalo**, no una cuenta regresiva.

### 🌊 Corrientes
Franjas de agua que empujan, marcadas con partículas que se arrastran. Dos usos:
como **autopista** (te llevan rápido y es puro placer) y como **muro blando** (tenés
que nadar en contra, o encontrar la vuelta). Técnicamente es un rectángulo que suma
velocidad: barato y se siente enorme.

### 🪸 Corales — arquitectura, no pinchos con otro color
- **Coral estructural** — sólido. Con esto se construyen arcos, columnas y **túneles**.
  Es lo que le va a dar forma al nivel.
- **Coral punzante** — el peligro, pero que *pertenece* al lugar (chau `TILE.SPIKES`).
- **Coral que respira** — se abre y se cierra con un ritmo fijo. Trampa de timing,
  no de reflejos: se puede leer y esperar. Perfecto para chicos.

### 🦪 Almeja con perla
Se abre y se cierra. La perla adentro es una estrella. Convierte "tocar la estrella"
en un micro-desafío de timing. Y si te descuidás, te muerde.

### 🏛️ Ruinas hundidas — el gancho narrativo
Columnas rotas, un arco caído y **una estatua de una Nuveciela** en el fondo del lago.
Sin cinemática, sin texto: sólo está ahí. Un chico que la ve entiende que **algo de
Manolandia se hundió acá**, y eso vale más que cualquier cartel.

### 🌿 Algas y vida de fondo
Se mecen con la corriente. No hacen nada. Son exactamente la diferencia entre "un
nivel azul" y "el fondo de un lago".

---

## 4. Enemigos nuevos

Ninguno reusa nada. Y cada uno existe para **enseñar algo distinto**, no para llenar.

### 🦀 Cangrejo Coral — *"no todo se pisa"*
Camina por el fondo, de costado, no nada. **Tiene el caparazón blindado arriba**: si
saltás encima, rebotás y te lastima. Se lo vence por los lados o con proyectil.
Avisa antes de atacar levantando las pinzas.

> Es el enemigo más importante de los cinco, porque **rompe un reflejo aprendido** en
> cuatro niveles. La primera vez que lo intenten pisar se van a sorprender — y esa
> sorpresa es exactamente lo que hace que un nivel se recuerde.

### 🐠 Cardumen — *el mundo está vivo*
5–7 pececitos que se mueven como un solo cuerpo por un recorrido. **No hacen daño: te
empujan.** Se dispersan cuando te acercás y se vuelven a juntar atrás tuyo.
Es un obstáculo que te mueve, no que te castiga — y es lo más lindo de mirar del nivel.

### 🐟 Pez Aguja — *el castigo por no mirar*
Quieto, apuntando. Cuando cruzás su línea de vista, **se lanza recto** como una flecha
tras un instante de carga. Enseña a leer el espacio antes de entrar.

### 🪼 Medusa — *el peligro que no se resuelve, se rodea*
Sube y baja lento, brilla en la oscuridad, **no se puede matar**. Ocupa espacio y hay
que esquivarla. (Hoy este rol lo hace el `flyer` genérico; acá tiene cuerpo propio.)

### 🦈 Tiburón de las Profundidades — *el final*
No es un enemigo: es **una secuencia**. Aparece en el último tramo, en agua abierta.

- Patrulla lento mientras no lo molestes.
- Cuando entrás a su zona, **carga en línea recta**. No se puede matar. No se puede
  ganar. Sólo se puede **llegar al próximo refugio**.
- Los refugios son túneles de coral por donde él no entra.

El último tramo del último nivel del juego es: *nadá de escondite en escondite mientras
algo enorme te busca.* Eso es un final.

> **Decisión: el nivel no tiene boss con barra de vida.** Ya hay dos en el juego
> (Fantasma, Rey de Escarcha). Un tercero sería más de lo mismo. Un tiburón invencible
> del que hay que escapar da más miedo y se recuerda más que cualquier barra de HP.

---

## 5. Cómo se recorre — cuatro movimientos

Hoy son 180 tiles planos. La propuesta es **200 tiles en cuatro actos**, cada uno con
su enseñanza y su clima:

```
 ACTO 1 · LA BAJADA          ACTO 2 · EL JARDÍN DE CORAL
 0 ─────────── 45            45 ──────────── 105
 Agua clara, luz de arriba   Arquitectura densa, túneles
 Aprendés a nadar            🦀 cangrejos · 🦪 almejas · 🐟 pez aguja
 🫧 primer géiser            Se explora: hay rutas alta y baja
 🐠 cardumen (no hace daño)  ▸ enseña: mirar antes de entrar
 ▸ enseña: subir es gratis

 ACTO 3 · LA FOSA            ACTO 4 · EL TIBURÓN
 105 ────────── 150          150 ─────────── 200
 Oscuro, profundo, frío      Agua abierta. Sin techo. Sin adornos.
 🌊 corrientes fuertes       🦈 patrulla
 🪼 medusas que iluminan     Refugios de coral cada ~15 tiles
 🏛️ las ruinas hundidas       Carrera final → PORTAL
 ▸ enseña: el agua manda     ▸ el juego termina corriendo
```

**Ritmo:** claro → denso → oscuro → abierto. Y el volumen de peligro sube en cada acto
menos en el 3, que es el respiro de asombro justo antes del final. Un nivel que sólo
sube de intensidad cansa; hay que dejar un lugar para mirar.

---

## 6. Qué cuesta, en la arquitectura real

Buena noticia: **el motor ya tiene el molde para todo esto.** No hay que inventar
sistemas, hay que seguir los que ya existen.

| Pieza | Cómo se hace | Precedente en el código |
|---|---|---|
| Tiles nuevos (coral, géiser, corriente, almeja) | Bloque `TILE` 40-49 | Nivel 3 usa 20-23, nivel 4 usa 30-36 |
| Enemigos del lago | `js/enemies/enemies_level5.js` | `enemies_level4.js`, misma API |
| Registro de enemigos | `if (levelIdx === 4)` en `enemies.js:59` | Ya está para los índices 2 y 3 |
| Burbujas, corrientes, almejas | `js/lago.js`, sistema propio del nivel | `cueva.js` (nivel 2), `magicdoor.js` (nivel 1) |
| Sprites | Manifest `4:` en `asset_loader.js` | Hoy **no existe**: hay que crearlo |
| Empuje de corrientes | Sumar velocidad al jugador | `physics.swim` ya está en `player.js:184` |

Lo único que **no** tiene precedente es que algo externo mueva al jugador. Es un
agregado chico en `player.js`, pero hay que hacerlo con cuidado: es el archivo del que
depende todo el juego.

⚠️ **Una cosa a verificar antes de prometerla:** quiero que el mapa sea más alto que
16 tiles para que la verticalidad se sienta. Hay que confirmar que la cámara
(`engine_camera.js`) acompaña en vertical; si no, el acto 3 se diseña dentro de 16.

---

## 7. Los sprites — acá necesito que decidas vos

Miré el arte que ya existe (`img/level3/`): **pixel art detallado, ~140×90 px, RGBA,
con sets de animación completos** (idle / walk / attack / damage / death, 3-4 cuadros
cada uno). El murciélago y el ciempiés están muy bien y marcan la vara.

Contando lo que necesitaría este nivel para estar a esa altura:

| | Sprites |
|---|---|
| 🦀 Cangrejo | ~8 (caminar 3, atacar 2, daño 1, muerte 2) |
| 🪼 Medusa | ~6 |
| 🐟 Pez aguja | ~6 |
| 🦈 Tiburón | ~6 |
| 🐠 Pececito del cardumen | ~2 |
| 🪸 Corales (estructural + punzante + que respira) | ~8 |
| 🦪 Almeja, 🏛️ ruinas, 🌿 algas | ~10 |
| **Total** | **~45 imágenes** |

**Lo que iría por canvas y no necesita sprite** (y además queda mejor animado así):
las burbujitas de ambiente, las partículas de corriente, la columna del géiser, el
brillo de las medusas. Eso ya baja el pedido de arte bastante.

**Mi límite, dicho claro:** puedo generar sprites procedurales (formas, pixel art
simple) que funcionen, pero **no van a estar a la altura del murciélago del nivel 3**.
Ese arte no sale de un script. Así que antes de seguir necesito saber:

> **¿Con qué generaste los sprites de los niveles 2 y 3?**

Según la respuesta, el paso 2 cambia bastante:
- **Si tenés un generador de imágenes a mano** → yo te armo los prompts, uno por
  sprite, con el estilo y la paleta del lago fijados para que salgan coherentes entre
  sí, y vos los generás.
- **Si querés que empecemos igual** → armo el nivel entero con formas de canvas
  (jugable y completo, estética simple) y los sprites se cambian después sin tocar la
  lógica, porque el dibujado ya está separado (`drawImage` si hay sprite, forma si no).

---

## 8. Lo que necesito que me confirmes

1. **¿Va el enfoque del tiburón como secuencia de escape** en vez de boss con barra de
   vida? Es la decisión más grande del diseño.
2. **¿Sin barra de oxígeno?** Estoy convencido de que sí, pero es tu llamado.
3. **La pregunta de los sprites** (sección 7).
4. **¿Los cuatro actos, o preferís algo más corto?** 200 tiles es un nivel largo para
   el último del juego; también puede quedar en 3 actos.
