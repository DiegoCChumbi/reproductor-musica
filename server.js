import express from "express"
import dotenv from "dotenv"
import multer from "multer"
import { iniciar, terminar, listarTodos, insertar, eliminar, listarPorCriterio } from "./utils/DB_utils.js"
import { obtenerLink } from "./utils/R2_Utils.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

await iniciar();

app.get("/", (req,res) => {
    res.send("API del reproductor musical funcionando")
})

app.get("/canciones", async (req,res) =>{
    try{
        const songs = await listarTodos()
        res.json(songs)
    }catch(err){
        console.log("Error listando las canciones: ",err.message)
        res.status(500).json({error: "Error obteniendo canciones"})
    }
})

app.get("/canciones/:key/stream",async (req,res) => {
    try{
        const link = await obtenerLink(req.params.key)

        res.json({streamUrl: link})
    } catch(err){
        console.error("No se pudo generar el link:",err.message)
        res.status(500).json({error:"No se pudo obtener el link"})
    }
})

app.get("/canciones/buscar", async (req, res) => {
  try {
    const { nombre, autor, album, anho, habilitado } = req.query;
    let filtro = {};

    if (nombre) filtro.nombre = nombre;
    if (autor) filtro.autor = autor;
    if (album) filtro.album = album;
    if (anho) filtro.anho = anho;
    if (habilitado) filtro.habilitado = habilitado;

    const songs = await listarPorCriterio(filtro);
    res.json(songs);

  } catch (err) {
    console.error("Error filtrando canciones:", err.message);
    res.status(500).json({ error: "Error obteniendo canciones" });
  }
});

const upload = multer ( {storage: multer.memoryStorage() } ) 

app.post("/canciones", upload.single("archivo"), async(req, res) => {
    try{
        const {nombre, album, autor, anho, habilitado} = req.body
        const archivo = {
            buffer: req.file.buffer,
            mimetype: req.file.mimetype,
            nombre: req.file.originalname
        }
        
        const isEnabled = (habilitado?.toLowerCase() === "true");
        const song = await insertar(nombre, album, autor, parseInt(anho), archivo, isEnabled)
        res.json({message: "Cancion subida", song})
    } catch(err){
        console.error("Error subiendo cancion:",err.message)
        res.status(500).json({error: "No se pudo subir la cancion"});
    }
})

app.put("/canciones/:id", async (req, res) => {
  try {
    const { nombre, album, autor, anho, habilitado } = req.body;

    const result = await actualizar(
      req.params.id,
      nombre,
      album,
      autor,
      parseInt(anho),
      habilitado?.toLowerCase() === "true"
    );

    if (!result || result.modifiedCount === 0) {
      return res.status(404).json({ error: "Canción no encontrada o sin cambios" });
    }

    res.json({ message: "Canción actualizada correctamente" });

  } catch (err) {
    console.error("Error actualizando canción:", err.message);
    res.status(500).json({ error: "No se pudo actualizar" });
  }
});

app.delete("/canciones/:id",async(req,res) =>{
    try{
        const result = await eliminar(req.params.id)
        if (result === 0) return res.status(404).json({error: "Cancion no encontrada"})

        res.json({message: "Cancion eliminada"})
    }catch (err){
        console.error("Error eliminando cancion:",err.message)
        res.status(500).json({error:"No se pudo eliminar"})
    }
})

const server = app.listen(PORT, () => {
    console.log(`API funcionando en http://localhost:${PORT}`)
})

const gracefulShutdown = async () => {
  console.log("\n Cerrando servidor y conexión a MongoDB...");
  await terminar();         // Cierra MongoDB
  server.close(() => {      // Detiene Express
    console.log("Servidor detenido.");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);  // Ctrl+C
process.on("SIGTERM", gracefulShutdown); // Señal de apagado en producción