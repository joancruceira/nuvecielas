# 🎨 Sprites del Lago — prompts listos para pegar

> Los sprites los generás vos en ChatGPT. Lo que sigue son los prompts, en orden
> de prioridad, y el comando que deja cada tanda lista para el juego.
> **El recorte y el fondo ya no los hacés a mano:** de eso se encarga
> `tools/sprites.py`.

---

## 1. Antes de empezar: el bloque de estilo

Los sprites del nivel 3 funcionan porque son coherentes entre sí. Para que los del
lago lo sean, **este bloque va al principio de CADA prompt**, sin cambiarle nada:

```
Pixel art de videojuego, estilo retro detallado de 16 bits.
Vista lateral de perfil, mirando hacia la DERECHA.
Contorno oscuro nítido, sombreado en bandas, colores saturados.
Criatura completa y centrada, sin recortes.
FONDO BLANCO LISO, sin sombra proyectada, sin textura, sin marco.
Una sola criatura, sin texto ni marca de agua.
Aproximadamente 900 px de alto.
```

Tres cosas de ese bloque que importan más de lo que parecen:

- **"FONDO BLANCO LISO"** — es lo que hace que la herramienta pueda borrarlo de una.
  Si sale con degradé o con sombra bajo el bicho, hay que subir `--tol` y se empieza
  a comer detalle.
- **"mirando hacia la DERECHA"** — el motor espeja el sprite solo (`facing`). Si la
  mitad mira a un lado y la otra mitad al otro, quedan bichos caminando de espaldas.
- **"900 px de alto"** — grande para que al bajarlo a 80-90 px quede nítido. Todo se
  reescala después; lo que importa es que todos vengan parecidos.

### La paleta del lago

Que se lea contra el agua es lo más importante. El fondo del nivel es azul profundo
(`#082f49` → `#0284c7`), así que **los bichos NO pueden ser azules**:

| | Colores | Por qué |
|---|---|---|
| 🦀 Cangrejo | naranja quemado, rojo coral, caparazón crema | Complementario del azul: se ve a la legua |
| 🪸 Corales | fucsia, magenta, naranja, violeta | Los corales reales son así, y contrastan |
| 🪼 Medusa | lila translúcido con borde cian brillante | Tiene que parecer que emite luz propia |
| 🐟 Peces | amarillo, turquesa, blanco plateado | Brillo metálico, destellan al girar |
| 🦈 Tiburón | gris azulado MUY oscuro, casi silueta | Que se confunda con el fondo hasta que ya está encima |

---

## 2. El flujo, de punta a punta

1. Generás los cuadros en ChatGPT (uno por mensaje, o una hoja en grilla).
2. Los bajás a una carpeta cualquiera, por ejemplo `img/crudo/`.
3. Corrés **un** comando por tanda.
4. Listo: quedan recortados, sin fondo, a la altura correcta y con el nombre que
   espera el motor.

```bash
python tools/sprites.py img/crudo/ --nombre cangrejo_walk --alto 90
```

Si ChatGPT te dio los cuatro cuadros en una sola imagen en fila:

```bash
python tools/sprites.py hoja.png --grilla 4x1 --nombre cangrejo_walk --alto 90
```

Para ver qué haría sin escribir nada, agregá `--previo`.

**Lo probé** contra los sprites que ya existen: les puse fondo blanco, los pasé por la
herramienta y comparé con el original. Con el default (`--tol 12`) se pierde **0,1 %**
de los píxeles y no queda halo sobre el azul del lago.

⚠️ **Dónde falla:** si el bicho tiene partes **blancas o muy claras pegadas al borde**
—humo, brillos, espuma—, la inundación puede llegar y comérselas. Si ves que pasó,
bajá a `--tol 6`. Con tolerancia 32 el ciempiés perdía el 2,9 %; con 12, el 0,1 %.

---

## 3. Los prompts, por prioridad

> Empezá por el cangrejo: es el enemigo que define el nivel. Mientras los generás,
> yo puedo ir armando la lógica — el motor dibuja formas de canvas cuando falta el
> sprite, así que el nivel se puede jugar antes de tener el arte.

### 🦀 Cangrejo Coral — 8 cuadros · `--alto 90`

Caparazón ancho y **blindado arriba** (tiene que *verse* que pisarlo es mala idea),
pinzas grandes, patas laterales.

| Tanda | Prompt (después del bloque de estilo) | Comando |
|---|---|---|
| Caminar (3) | `Un cangrejo de arrecife naranja quemado con caparazón crema muy duro y abovedado, ojos saltones sobre tallos, dos pinzas grandes. Caminando de costado. Tres cuadros de animación de caminata, uno por imagen.` | `--nombre cangrejo_walk --alto 90` |
| Atacar (2) | `El mismo cangrejo levantando las dos pinzas por encima del caparazón, amenazante, boca abierta.` | `--nombre cangrejo_attack --alto 90` |
| Daño (1) | `El mismo cangrejo golpeado, ojos apretados, destello rojo, patas dobladas.` | `--nombre cangrejo_damage --alto 90` |
| Muerte (2) | `El mismo cangrejo dado vuelta panza arriba, patas encogidas, ojos en espiral.` | `--nombre cangrejo_death --alto 90` |

### 🪼 Medusa — 6 cuadros · `--alto 100`

No se puede matar: tiene que dar sensación de **peligro sereno**, no de bicho furioso.

| Tanda | Prompt | Comando |
|---|---|---|
| Flotar (4) | `Una medusa lila translúcida con el borde de la campana cian brillante, como si emitiera luz propia, tentáculos largos y ondulantes. Cuatro cuadros: campana contraída, abriéndose, abierta, cerrándose.` | `--nombre medusa_float --alto 100` |
| Brillo (2) | `La misma medusa con un pulso de luz intenso recorriéndole la campana, tentáculos eléctricos.` | `--nombre medusa_glow --alto 100` |

### 🐟 Pez Aguja — 6 cuadros · `--alto 60`

Alargado y afilado. Tiene que **parecer una flecha** incluso quieto.

| Tanda | Prompt | Comando |
|---|---|---|
| Al acecho (2) | `Un pez alargado y afilado como una aguja, amarillo con vientre plateado, hocico largo y puntiagudo, quieto y en tensión.` | `--nombre aguja_idle --alto 60` |
| Embestida (2) | `El mismo pez aguja lanzado a toda velocidad en línea recta, aletas pegadas al cuerpo, estela de burbujas detrás.` | `--nombre aguja_dash --alto 60` |
| Muerte (2) | `El mismo pez aguja de costado, sin fuerza, ojo apagado.` | `--nombre aguja_death --alto 60` |

### 🦈 Tiburón de las Profundidades — 6 cuadros · `--alto 160`

El más grande del juego. Tiene que **imponer**.

| Tanda | Prompt | Comando |
|---|---|---|
| Nadar (3) | `Un tiburón enorme gris azulado muy oscuro, casi una silueta, con cicatrices viejas y un ojo blanco pálido. Nadando tranquilo, cola en tres posiciones.` | `--nombre tiburon_swim --alto 160` |
| Embestida (3) | `El mismo tiburón cargando con la boca completamente abierta mostrando los dientes, cuerpo estirado, estela de burbujas.` | `--nombre tiburon_charge --alto 160` |

### 🐠 Pececito del cardumen — 2 cuadros · `--alto 28`

Chiquito y simple: se van a dibujar cinco o siete juntos.

| Tanda | Prompt | Comando |
|---|---|---|
| Nadar (2) | `Un pez pequeño y redondeado turquesa con la panza amarilla, ojo grande y simpático, aleta de cola en dos posiciones.` | `--nombre pecesito_swim --alto 28` |

### 🪸 Corales y estructuras — ~10 cuadros

Acá conviene pedirle **varios en una imagen** y partirlos con `--grilla`.

| Tanda | Prompt | Comando |
|---|---|---|
| Corales estructurales (4) | `Cuatro formaciones de coral distintas en fila: una columna de coral cerebro, un abanico de coral, un coral ramificado tipo cuerno, un coral tubular. Fucsia, magenta y naranja. Separadas entre sí sobre el fondo blanco.` | `--grilla 4x1 --nombre coral --alto 96` |
| Coral punzante (2) | `Coral erizado de púas afiladas, rojo intenso con las puntas más claras, claramente peligroso al tacto.` | `--nombre coral_punzante --alto 96` |
| Almeja (2) | `Una almeja gigante de arrecife: un cuadro cerrada y otro abierta mostrando una perla brillante adentro. Valvas violetas acanaladas, interior nacarado.` | `--nombre almeja --alto 80` |
| Ruinas (2) | `Una columna de piedra antigua partida y cubierta de percebes y algas, hundida en el fondo del lago. Piedra clara desgastada.` | `--nombre ruina --alto 200` |
| **La estatua** (1) | `Una estatua de piedra antigua de una criatura con forma de nube con pelo largo ondulado, cubierta de musgo y percebes, con una grieta atravesándola, hundida en el fondo del lago. Melancólica.` | `--nombre estatua --alto 260` |
| Algas (3) | `Tres matas de algas marinas distintas en fila, verde esmeralda y verde azulado, altas y ondulantes.` | `--grilla 3x1 --nombre alga --alto 120` |

---

## 4. Lo que NO hace falta generar

Estas cosas quedan mejor dibujadas por código, y además animan bien sin cuadros:

- 🫧 **las burbujas** (ambiente, géiser y montables) — círculos con brillo, animados
- 🌊 **las partículas de corriente**
- ✨ **el resplandor de la medusa** y la luz que se filtra desde arriba
- 💨 **las estelas** del tiburón y del pez aguja

Son ~15 sprites que no hay que generar, y quedan mejor así.

---

## 5. Cuenta final

| | Sprites |
|---|---|
| Enemigos (cangrejo, medusa, aguja, tiburón, pececito) | 28 |
| Corales, almeja, ruinas, estatua, algas | 14 |
| **Total a generar** | **42** |
| Hechos por código | ~15 |

Si querés arrancar más chico, **con el cangrejo (8) y los corales (6) alcanza** para
que yo arme y balancee los dos primeros actos completos.

---

> **Recordá:** todavía quedaron tres decisiones del diseño sin confirmar
> (`docs/NIVEL_LAGO.md`, sección 8): el tiburón como escape en vez de boss, que no
> haya barra de oxígeno, y si van los cuatro actos. Este pack asume que sí a las tres
> — si alguna cambia, cambia parte de la lista.
