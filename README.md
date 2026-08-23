# Invitación de Boda — Laura & Kevin 💍

Página web que reproduce **pixel a pixel** el diseño de la invitación original en PDF
(`assets/img/Laura y Kevin Ou.pdf`). Todo el contenido visual (texto, fotos, iconos, colores)
son las imágenes exportadas de ese PDF; el HTML/CSS/JS solo agrega los botones funcionales
encima: reproductor de música, "agregar al calendario", "ver ubicación" (mapas) y
"confirmar aquí" (RSVP). La única pieza que no viene del PDF es la cuenta regresiva
(agregada aparte, con estilo similar al de referencia que compartiste).

## Estructura del proyecto

```
index.html            -> La página: una imagen por sección + botones superpuestos
css/styles.css         -> Solo estilos de los botones, el modal RSVP y la cuenta regresiva
js/main.js             -> Música, reproductor, countdown, agregar-al-calendario y RSVP
assets/img/design/     -> Las 11 imágenes (recortes del PDF) que arman la página, en orden
assets/audio/          -> Aquí va tu canción (musica.mp3)
assets/Links/          -> Ramitas acuarela usadas en la cuenta regresiva
assets/Fonts/          -> Arial Narrow (para el countdown, a juego con el resto del diseño)
```

> Importante: como el texto y las fotos ahora son parte de las imágenes de `assets/img/design/`,
> **no se pueden editar como texto normal**. Para cambiar una fecha, dirección, foto o nombre,
> hay que editar el diseño original en Illustrator/Canva y volver a exportar esa sección como
> imagen (mismo ancho de 1080px), reemplazando el archivo correspondiente en `assets/img/design/`.

## 1. Botones ya programados (funcionan de una vez)

- **Reproductor "Nuestra canción"**: play/pausa, reiniciar, adelantar 10s y barra de progreso.
  Solo falta que agregues tu canción (paso 2).
- **Agregar al calendario**: descarga un archivo `.ics` con fecha, hora y ubicación del PDF.
- **Ver ubicación** (x2): abren Google Maps de la iglesia y del salón (ya configurados).
- **Confirmar aquí**: abre el formulario de RSVP (buscar invitado + confirmar asistencia).

Si cambias la fecha/hora de la boda, actualiza en `js/main.js`:

```js
const weddingDate = new Date('2026-10-18T15:00:00'); // cuenta regresiva
// y el bloque del "agregar al calendario" un poco más abajo (DTSTART/DTEND/LOCATION)
```

## 2. Agregar tu música

1. Copia tu canción a `assets/audio/musica.mp3`.
2. Listo — el reproductor de la sección "Nuestra canción" la usará automáticamente.

## 3. Configurar la lista de invitados y sus cupos

Cada invitación tiene un número distinto de cupos (lugares) reservados. Esto se maneja
en `js/main.js`, en la lista `GUEST_LIST`. Edítala con tus invitados reales:

```js
const GUEST_LIST = [
  { nombre: 'Gerardo', cupos: 2, alias: [] },
  { nombre: 'Maria', cupos: 3, alias: ['María'] },
];
```

- `nombre`: cómo se le saludará ("¡Hola, Gerardo!").
- `cupos`: cuántas personas puede confirmar esa invitación (incluyéndolo a él/ella).
- `alias`: (opcional) otras formas en que podrían escribir el nombre (apodos, con o sin
  acentos, apellido, etc.) para que la búsqueda los encuentre igual.

Cuando alguien entra a "Confirmar Asistencia", se abre un popup donde escribe su nombre;
si lo encuentra en la lista, le muestra cuántos lugares tiene y le permite indicar cuántos
de esos asistirán y sus nombres. Si no lo encuentra, le pide que verifique cómo lo escribió.

> Nota: como esta lista vive en el código de la página (no hay base de datos), cualquier
> persona que revise el código fuente podría verla. Para una boda es un riesgo mínimo,
> pero evita poner datos sensibles (teléfonos, direcciones) ahí.

## 3.1 Evitar confirmaciones duplicadas y permitir editarlas (Supabase)

Para que cada invitado solo pueda tener **una** confirmación (y pueda editarla si ya
la había llenado), la página guarda las respuestas en una base de datos gratuita de
Supabase:

1. Crea una cuenta en https://supabase.com y un proyecto nuevo.
2. En el "SQL Editor" del proyecto, corre este código para crear la tabla:
   ```sql
   create table rsvps (
     id uuid primary key default gen_random_uuid(),
     guest_key text unique not null,
     guest_nombre text not null,
     asistencia text,
     cupos_asisten int,
     nombres_acompanantes text,
     cancion text,
     mensaje text,
     updated_at timestamptz default now()
   );

   alter table rsvps enable row level security;

   create policy "Public can read" on rsvps for select using (true);
   create policy "Public can insert" on rsvps for insert with check (true);
   create policy "Public can update" on rsvps for update using (true);
   ```
3. Ve a Project Settings → API y copia el "Project URL" y la clave "anon public".
4. En `js/main.js`, reemplaza:
   ```js
   const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
   const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI';
   ```
   con tus valores reales.

Con esto, cada vez que alguien confirma, se guarda (o actualiza, si ya existía) su fila
en la tabla `rsvps` usando su nombre normalizado como identificador único. Si vuelve a
buscar su invitación, el formulario le aparece con lo que puso la última vez, listo para
editar y reenviar. El botón cambia a "Actualizar confirmación" cuando detecta una
confirmación previa.

Puedes ver todas las respuestas en cualquier momento entrando a Supabase → Table Editor
→ tabla `rsvps`.

> Nota de privacidad: la clave "anon public" queda visible en el código de la página
> (es normal e inevitable en un sitio estático como este). Con las políticas de arriba,
> cualquier persona que inspeccione el código técnicamente podría leer la tabla completa
> de confirmaciones. Para una boda es un riesgo bajo, pero evita pedir datos sensibles
> (números de tarjeta, contraseñas, etc.) en el formulario.

## 4. Activar el formulario de "Confirmar Asistencia" (RSVP)

Como esta página es estática (sin servidor propio), usamos un servicio gratuito para
recibir las respuestas por correo:

1. Ve a https://formspree.io y crea una cuenta gratis.
2. Crea un nuevo formulario y copia el "endpoint" que te dan (algo como
   `https://formspree.io/f/abcdwxyz`).
3. En `js/main.js`, reemplaza:
   ```js
   const RSVP_ENDPOINT = 'https://formspree.io/f/TU_ID_AQUI';
   ```
   con tu endpoint real.
4. ¡Listo! Cada vez que alguien confirme, te llegará un correo.

(Alternativas similares: Getform.io, Web3Forms — el proceso es parecido.)

## 5. Probar la página en tu computadora

Puedes simplemente abrir `index.html` haciendo doble clic, o para una vista más real
(recomendado, por temas de rutas/audio) usa la extensión **Live Server** en VS Code:

1. Instala la extensión "Live Server" (Ritwick Dey) desde el ícono de Extensiones.
2. Clic derecho sobre `index.html` → "Open with Live Server".

## 6. Comprar el dominio y publicar la página

### Opción recomendada (gratis y fácil): Netlify
1. Ve a https://app.netlify.com y crea una cuenta gratis.
2. Arrastra la carpeta completa del proyecto a la sección "Deploys" (Netlify Drop:
   https://app.netlify.com/drop). Tu página quedará publicada al instante con una URL tipo
   `algo-random.netlify.app`.
3. Compra tu dominio (ej. `lauraykevin.com`) en un registrador como Namecheap, GoDaddy o
   Google Domains.
4. En Netlify: "Domain settings" → "Add a domain" → sigue las instrucciones para apuntar
   los DNS de tu dominio hacia Netlify. Netlify además te da certificado HTTPS gratis.

### Otras opciones
- **Vercel** (similar a Netlify, también gratis).
- **GitHub Pages** (gratis, requiere subir el proyecto a un repositorio de GitHub).
- **Hosting compartido tradicional** (Hostinger, GoDaddy, etc.): compras dominio + hosting
  juntos y subes estos archivos por FTP o el "Administrador de archivos" del panel.

Cualquiera de estas opciones funciona bien porque la página es 100% HTML/CSS/JS, sin
necesidad de bases de datos ni servidores especiales.

## Notas de diseño

- Paleta: arena (`#ede4d3`) y verde oliva (`#6b7a4f`), tipografía elegante
  (Cormorant Garamond + Great Vibes para los nombres).
- Animaciones de aparición al hacer scroll con la librería AOS (vía CDN).
- Botón flotante para pausar/reanudar la música en cualquier momento.
- Totalmente responsiva (se ve bien en celular, tablet y escritorio).
