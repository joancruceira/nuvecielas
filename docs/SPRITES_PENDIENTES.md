# ⭐ Dos sprites pendientes — Estrellaria y el jefe Fantasma

> **Repo:** `nuvecielasPlatformer` · **Fecha:** 2026-08-18.
> Los dos están **ya funcionando en el juego** con dibujo provisorio. Cuando
> lleguen los sprites entran solos, sin tocar la lógica.

---

## 1. Estrellaria — la quinta Nuveciela

Ya se puede elegir y jugar. Hoy se ve como **un rectángulo rosa con una E**,
porque es lo único que hay hasta que exista `img/estrellaria.png`.

**Su identidad es el disparo, no el movimiento.** Las otras cuatro se eligen por
cómo se mueven —doble salto, deslizarse, flotar, volar—; ésta se elige por cómo
ataca: es la que tira más rápido del juego (una estrella cada 0,32 s, contra 0,45
de la más rápida anterior) y cada tiro sale de un color distinto, rotando siete.

### 🎨 El sprite

Mismo formato que las otras cuatro: **un solo cuadro, de cuerpo entero, mirando
de frente**, sobre fondo blanco. Miralas en `img/nuveciela.png`, `img/ciela.png`,
`img/lunaria.png` y `img/nuve.png` para copiar el estilo — es importante que las
cinco parezcan hermanas.

> Pixel art de videojuego, estilo retro detallado de 16 bits, calidad
> profesional. FONDO BLANCO LISO. Sin sombra proyectada, sin piso, sin marco,
> sin texto. Un solo personaje, de cuerpo entero, de frente.
>
> Una **Nuveciela**: una criatura con forma de MANO ABIERTA de pie sobre sus
> dedos, como si los dedos fueran piernas. Sobre el dorso de la mano tiene una
> cara sencilla y dulce —dos ojos redondos grandes y una sonrisa chiquita— y de
> la parte de arriba le cae una melena larga y ondulada que le cubre los
> costados. Sin brazos.
>
> Ésta se llama **Estrellaria**. Su melena es **rosa fuerte con mechones
> turquesa, amarillo y violeta**, como si tuviera un cielo estrellado en el
> pelo. Le brillan **estrellitas de colores entre el pelo**, chiquitas y
> repartidas. La piel de la mano, del mismo tono cálido que sus hermanas.
>
> Alegre y despierta, no traviesa ni burlona.

```bash
python tools/sprites.py hoja.png --auto --esperados 1 --nombre estrellaria --estilo unico --alto 320
```

Va en `img/estrellaria.png`, en la raíz de `img/` como las otras cuatro.

> Ojo con una: **sin estrellas sueltas volando alrededor**. El juego dibuja las
> estrellas del disparo por código; si vienen pegadas al sprite, el personaje se
> ve más ancho de lo que es y queda descentrado sobre su hitbox.

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

Los dos andan. Estrellaria es un rectángulo rosa con una E —del color que le
corresponde, no violeta— y el jefe es el fantasma de antes, ahora bastante más
grande. Se puede jugar todo.
