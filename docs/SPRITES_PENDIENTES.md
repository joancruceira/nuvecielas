# ⭐ Sprites pendientes — queda uno: el jefe Fantasma

> **Repo:** `nuvecielasPlatformer` · **Fecha:** 2026-08-18.
> Estrellaria ya está resuelta: su dibujo existía en el hub desde antes.
> El jefe funciona con el sprite viejo hasta que llegue el nuevo.

---

## 1. Estrellaria — RESUELTO ✅

**No hacía falta generar nada: ya estaba dibujada.** Vivía en el hub
(`src/assets/images/Estrellaria.png`, 408×612) desde antes, con ficha completa en
`src/data/characters.ts` — emoji 🌟, "¡La que encuentra lo que nadie ve!", color
`#F7A8C4` — y jugaba en Memoria Mágica. Lo único que le faltaba era estar en el
plataformer.

Se copió a `public/bosque/img/estrellaria.png` recortada y llevada a **248 px de
alto**, que es la altura exacta de sus cuatro hermanas. Su proporción original
(0,667) ya coincidía con la de Ciela, Lunaria y Nuve (0,665): está dibujada en la
misma tanda.

> **El color y el emoji salen del hub, no del plataformer.** Es el mismo
> personaje en las dos apps y no puede tener dos colores. Yo le había puesto un
> rosa distinto al inventarla en el juego; ahora usa el suyo.

---

## 2. El jefe Fantasma — el del Castillo

El sprite actual **no está mal dibujado, está mal escalado y es indistinguible**:
es el mismo fantasma blanco que los fantasmitas comunes del nivel, sólo que un
poco más grande. Un jefe tiene que leerse como jefe desde lejos.

Ya lo agrandé —la caja pasó de 72×80 a 96×108— y eso ayuda, pero no resuelve que
sea **el mismo bicho**. Lo que hace falta es un diseño propio.

### 👻 Los cuadros — 4, mismo formato que el actual

> Pixel art de videojuego, estilo retro detallado de 16 bits, calidad
> profesional. Vista lateral de perfil, **mirando hacia la DERECHA**.
> Contorno oscuro nítido, sombreado en bandas duras. FONDO BLANCO LISO.
> Sin sombra proyectada, sin piso, sin marco, sin texto.
> Los cuatro cuadros en UNA SOLA FILA, del mismo alto, con el fantasma del
> mismo tamaño en todos.
>
> El **Fantasma Malvado**, jefe de un castillo gótico en llamas: un espectro
> grande y señorial, mucho más imponente que un fantasma común. Cuerpo de niebla
> gris azulada que se deshilacha en jirones hacia abajo, **más ancho arriba que
> abajo**, como una capa. Le cuelgan **cadenas oxidadas rotas** de los hombros y
> lleva una **corona torcida de hierro negro**, medio caída — se robó el castillo
> y se coronó solo. Ojos rasgados de un **rojo carmesí que brilla**, sin pupila.
>
> Cuatro cuadros en fila:
> 1. **Quieto**, flotando, mirando de reojo con calma.
> 2. **Quieto**, con los jirones de abajo movidos apenas — sólo cambia la niebla.
> 3. **Atacando**: la boca abierta en un grito, los brazos de niebla extendidos
>    hacia adelante, la corona ladeada.
> 4. **Golpeado**: los ojos apretados, el cuerpo encogido y la corona saltando.
>
> Amenazante y solemne, no gracioso. Sin sangre.

```bash
python tools/sprites.py hoja.png --grilla 4x1 --nombre fantasma --estilo plano --alto 240
```

Los nombres de archivo que espera el juego son, en este orden:
`fantasma_idle0`, `fantasma_idle1`, `fantasma_attack`, `fantasma_hit` — el script
los saca como `fantasma0..3`, hay que renombrarlos (o pasámelos y lo hago yo).

> **La corona y las cadenas son lo importante.** Son lo que lo separa de un
> fantasma cualquiera de un vistazo, que es todo el problema que hay que
> resolver. Si el diseño se parece al fantasma chico, no sirve por más grande
> que sea.

---

## 3. Mientras tanto

Estrellaria ya juega con su dibujo de verdad, del mismo alto que sus hermanas. El
jefe sigue con el fantasma de antes, ahora bastante más grande. Se puede jugar
todo.
