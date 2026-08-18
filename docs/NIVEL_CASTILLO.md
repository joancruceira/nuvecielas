# 🏰 Castillo de Nuveciela — ambientación del nivel 2

> **Repo:** `nuvecielasPlatformer` · nivel índice 1
> **Fecha:** 2026-08-18. Mismo alcance que `NIVEL_LAGO.md` y `NIVEL_BOSQUE.md`.

---

## 1. El diagnóstico — acá el problema NO es el del bosque

Lo puse en pantalla antes de proponer nada, y conviene decirlo claro: **el nivel 2
sí tiene tiles dibujados**. Hay sprites de piso (`piso0`, `piso1`,
`piso_banderin`, `piso_ventanas`) y de pinchos. No es el caso del bosque, donde
todo lo que se pisaba era un rectángulo de color.

El problema es otro y es de **paleta**:

| El fondo | Lo que se pisa |
|---|---|
| Ruina gótica en llamas: carbón, carmesí, brasas | Piedra **lila azulada**, pareja y plana |
| Braseros, arañas de velas, ventanales rojos | Plataformas: barritas gris azuladas |
| Escombros por todos lados | Props del nivel: **ninguno** |
| Fuego como única luz | Ni una sola fuente de luz en la capa jugable |

El piso no está sin dibujar: está dibujado **en otra paleta**, y parece pegado de
otro juego. Eso es lo primero a corregir.

---

## 2. Lo que entra

### 🔥 El piso que se derrumba — la mecánica propia

Baldosas que se agrietan al pisarlas y se caen medio segundo después. Vuelven
solas unos segundos más tarde.

Es la única pieza que hace que **la ruina misma sea la mecánica**, y enseña lo
contrario que los otros dos niveles:

```
   el lago    dice   →  explorá, subí, mirá
   el bosque  dice   →  rebotá, llegá más alto
   el castillo dice  →  NO TE PARES
```

Ningún otro nivel del juego tiene un verbo así. Y no necesita explicación: la
primera baldosa que se agrieta bajo los pies lo dice todo.

> **Aviso antes del castigo:** la baldosa se agrieta *y hace ruido* medio segundo
> antes de caer. Nunca se cae sin avisar. Es el segundo nivel del juego.

### 🕯️ Antorchas, braseros y arañas de velas — la luz

El fondo está iluminado por fuego y la capa jugable **no tiene una sola fuente de
luz**. Antorchas en las columnas que tiran un charco de luz cálida y parpadeante
sobre el piso, y arañas de velas colgando del techo que se mecen apenas.

Es lo que más va a unir las dos capas, exactamente como los rayos de sol en el
bosque — y por la misma razón: la luz es de lo que está hecho el fondo.

### 🪨 Escombros, columnas rotas y banderas rasgadas

Los props del piso. El fondo está lleno de ruina y el suelo está pelado.

### 🎨 El piso al carbón, y rejillas con llamaradas

La piedra pasa de lila a **piedra oscura con brasas entre las juntas**. Y aparecen
**rejillas de fuego**: escupen una llamarada con ritmo fijo, se apagan, vuelven.
Es el espejo del géiser del lago, pero que quema en vez de levantarte.

> Mientras no existan los sprites nuevos del piso, el juego **tiñe los que ya hay**
> hacia carbón y brasa. Se ve bien desde el primer día y el tinte se saca solo
> cuando llegan los definitivos.

### 🖼️ Los retratos — el gancho narrativo

El lago tiene la Nuveciela de piedra hundida entre las ruinas. El bosque tiene el
árbol con las manos. Acá el castillo **es de Nuveciela**, y se lo tomó el
Fantasma.

Van **retratos de las cuatro hermanas colgados en las paredes**: alguno quemado,
alguno rasgado, uno todavía intacto y derecho. Sin cartel, sin cinemática.

Una nena que los ve entiende sola quién vivía acá y qué pasó.

### Lo que NO entra

**Candelabros para columpiarse.** Física de cuerda otra vez, y el nivel ya tiene
las arañas que bajan del techo para la verticalidad.

---

## 3. Los sprites — 7 hojas

### 3.1 Las reglas de siempre

1. **Una hoja por grupo**, todos los elementos en una fila.
2. **Nada de efectos dentro del sprite**: sin destellos, sin chispas sueltas, sin
   humo. Eso lo agrega el juego por código y pegado adentro rompe la proporción.
3. **Sin texto, sin títulos, sin números, sin carteles, sin marcos.**
4. **Sin sombra proyectada y sin piso debajo.**
5. Vista lateral plana, de frente, sin perspectiva.

### 3.2 El bloque de estilo (va al principio de CADA prompt)

```
Pixel art de videojuego, estilo retro detallado de 16 bits, calidad profesional.
Vista lateral plana, de frente, sin perspectiva.
Contorno oscuro nítido, sombreado en bandas duras (sin degradés suaves),
paleta acotada.
FONDO BLANCO LISO. Sin sombra proyectada, sin piso, sin marco, sin texto.
Todos los elementos en UNA SOLA FILA horizontal, sin separadores ni numeración.
```

### 3.3 La paleta del nivel (repetila en cada prompt)

> Interior de un castillo gótico en ruinas y en llamas. **Piedra gris muy oscura
> y carbón**, casi negra, con musgo seco. La única luz es **FUEGO: naranja,
> carmesí y brasas** en las grietas. Toques de dorado viejo y sucio en los metales.
> Algún destello **celeste fantasmal** muy puntual. Nada de lila, nada de violeta
> claro, nada de azul frío en la piedra.

---

## 4. Las siete hojas

### 🧱 1. `piso_ruina` — 5 celdas · **cuadradas, se repiten en fila**

> [estilo] + [paleta]
> Cinco celdas cuadradas de piso de castillo en ruinas, para repetir en fila. Las
> tres primeras son la SUPERFICIE: losas de piedra oscura gastada, con grietas
> finas por las que se ve brasa naranja, alguna baldosa partida y musgo seco en
> las juntas; una de ellas con una raja más grande. Las dos últimas son el RELLENO
> de abajo: piedra maciza oscura sin grietas de brasa, más pareja. **Las cinco
> tienen que poder ir pegadas una al lado de la otra sin que se note el corte.**

```bash
python tools/sprites.py hoja.png --grilla 5x1 --nombre piso_ruina --estilo plano --alto 96
```

### 🩹 2. `piso_fragil` — 3 cuadros · **cuadrados**

> [estilo] + [paleta]
> Una baldosa de piedra a punto de ceder, en tres cuadros del mismo tamaño. El
> primero: entera, apenas más clara y con el borde despegado del resto del piso.
> El segundo: **agrietada**, con una fisura en cruz atravesándola y polvillo
> saliendo por las grietas. El tercero: **partida en pedazos**, los fragmentos
> todavía en su lugar pero separados y a punto de caer. Cuadrada en los tres.

```bash
python tools/sprites.py hoja.png --grilla 3x1 --nombre piso_fragil --estilo plano --alto 96
```

> Los tres cuadros son el aviso. Que la diferencia entre el primero y el segundo
> se note **de lejos**: es lo único que separa un desafío de una injusticia.

### 🕯️ 3. `antorcha` — 4 cuadros · proporción **0,45 : 1** (alta y angosta)

> [estilo] + [paleta]
> Una antorcha de pared de castillo: soporte de hierro negro forjado y retorcido,
> empotrado en la piedra, con una llama naranja y carmesí encima. Cuatro cuadros
> del **ciclo de la llama**: la llama se agita, se estira, se encoge y vuelve. El
> soporte de hierro queda EXACTAMENTE igual y en la misma posición en los cuatro:
> lo único que se mueve es el fuego. Sin chispas sueltas ni humo.

```bash
python tools/sprites.py hoja.png --grilla 4x1 --nombre antorcha --estilo plano --alto 140
```

### 🔯 4. `candelabro` — 3 cuadros · proporción **1,3 : 1** (ancho)

> [estilo] + [paleta]
> Una araña de velas de castillo colgando de una cadena: aro de hierro negro con
> velas de cera derretida y llamitas encima. Tres cuadros del ciclo de las
> llamitas. La cadena entra por arriba del cuadro. El aro y las velas quedan
> igual en los tres: sólo cambian las llamas.

```bash
python tools/sprites.py hoja.png --grilla 3x1 --nombre candelabro --estilo plano --alto 130
```

### 🔥 5. `llamarada` — 1 rejilla + 4 cuadros de fuego

> [estilo] + [paleta]
> Seis elementos en fila. El primero: una **rejilla de hierro** empotrada en el
> piso, redonda y oxidada, apagada. El segundo: la misma rejilla **al rojo vivo**,
> a punto de escupir. Y después cuatro cuadros de una **columna de fuego** que
> sale hacia arriba, cada vez más alta: apenas asomando, a media altura, alta del
> todo, y bajando. Las cuatro columnas del mismo ancho y arrancando desde la misma
> base.

```bash
python tools/sprites.py hoja.png --auto --esperados 6 --nombre llamarada --estilo plano --alto 160
```

### 🪨 6. `escombro` — 5 props · alto **110 px**

> [estilo] + [paleta]
> Cinco props de suelo de castillo en ruinas, en fila: un montón de escombros y
> piedras partidas; el tramo caído de una columna de piedra, tumbado; una bandera
> vieja rasgada y chamuscada, caída sobre unos escombros; un brasero de hierro
> volcado con las brasas desparramadas; y un montón de cadenas oxidadas
> enredadas. Todos apoyados sobre su propia base.

```bash
python tools/sprites.py hoja.png --auto --esperados 5 --nombre escombro --estilo plano --alto 110
```

### 🖼️ 7. `retrato` — 4 cuadros · proporción **0,75 : 1**

Éste es el gancho. Va con cuidado.

> [estilo] + [paleta]
> Cuatro retratos antiguos colgados en la pared de un castillo, con marco dorado
> viejo y despintado. **Lo retratado es una criatura con forma de MANO ABIERTA de
> pie sobre sus dedos, como si los dedos fueran piernas. Sobre el dorso de la mano
> tiene una cara sencilla y dulce —dos ojos redondos y una sonrisa chiquita— y de
> arriba le cae una melena larga y ondulada.** Cada retrato muestra una de ellas,
> con el pelo de distinto color.
>
> Los cuatro están en distinto estado: el primero **intacto y derecho**, todavía
> orgulloso; el segundo **torcido y con el vidrio rajado**; el tercero
> **chamuscado**, con la mitad de abajo quemada y el marco negro de hollín; el
> cuarto **rasgado**, con la tela colgando en tiras.
>
> Melancólicos, no siniestros: son el recuerdo de quien vivía acá.

```bash
python tools/sprites.py hoja.png --grilla 4x1 --nombre retrato --estilo plano --alto 150
```

> Para que ChatGPT sepa qué es una Nuveciela hay que describírsela, no la conoce.
> Es la misma descripción que se usó para la estatua hundida del lago.

---

## 5. Mientras tanto

**El nivel ya está construido y andando**: el piso se derrumba, las antorchas
alumbran, las llamaradas suben, hay escombros y retratos, y la piedra ya está
teñida hacia carbón y brasa. Se puede jugar.

Cuando lleguen los sprites entran solos y el tinte del piso se retira: el dibujado
ya está separado (`drawImage` si hay sprite, forma de canvas si no), igual que en
el lago y el bosque.

---

## 6. Lo que llegó, y en qué se diferencia de lo pedido

Llegaron **9 hojas y 47 sprites**. La lista se ajustó a lo que vino:

| Pieza | Pedido | Llegó |
|---|---|---|
| `piso_ruina` | 5 celdas | **5** ✅ (una de ellas es una rejilla, no se usa: hay hoja propia) |
| `piso_fragil` | 3 cuadros | **5** — deterioro completo, se usan 3 |
| `llamarada` | rejilla + 4 de fuego | **5 cuadros con la rejilla YA INCLUIDA** |
| `antorcha` | 4 cuadros de una llama | **5 antorchas DISTINTAS** |
| `candelabro` | 3 cuadros | **5 candelabros distintos, con su cadena** |
| `escombro` | 5 props | **18** |
| `retrato` | 4 | **4** ✅ |

**Los retratos salieron exactos.** Las cuatro hermanas son manos con cara y
melena, en marcos dorados, con tela quemada colgando y hasta una calavera en el
cuarto. Es el gancho y no hay que tocarle nada.

### Los tres ajustes que hubo que hacer

**Las antorchas y los candelabros NO son animaciones.** Pedí cuadros de una misma
llama y llegaron cinco modelos distintos: uno con estandarte, uno con cadenas,
uno con musgo. Ciclarlos habría hecho que el soporte mutara solo. Se usan como
**variantes fijas por columna** —el castillo gana variedad— y el parpadeo lo pone
el charco de luz, que ya se dibujaba por código.

**La llamarada trae la rejilla adentro.** Estaba preparado para dibujar rejilla y
fuego por separado; los cinco cuadros vienen con la rejilla incluida y todos
alineados a la misma base. Se dibuja uno solo y se elige por altura de la llama.

**Los cuadros con base común no se recortan a su caja.** Las hojas de losas, de
agrietado y de fuego tienen todos los cuadros alineados abajo. Recortando cada
uno a su propia caja se pierde esa alineación y la rejilla bailaría al crecer la
llama; se cortan por columnas de igual ancho conservando el alto entero.

### Y una cosa que los sprites no resolvían

La baldosa frágil ENTERA se parece demasiado al piso normal: las dos son losas de
piedra agrietada. Y de nada sirve avisar cuando ya la pisaste. Se le agregó por
código un **latido de brasa** que la separa del resto *antes* de tocarla.
