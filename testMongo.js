import fs from "fs";
import path from "path";
import mime from "mime-types";

import dotenv from "dotenv";
dotenv.config();

import { iniciar, insertar, listarTodos, eliminar, terminar } from "./utils/DB_utils.js";
import { obtenerLink } from "./utils/R2_Utils.js"
function leerMP3(rutaArchivo){
	if (!fs.existsSync(rutaArchivo)) {
    	throw new Error(`Archivo no encontrado: ${rutaArchivo}`);
  	}

  	const _buffer = fs.readFileSync(rutaArchivo);
  	const _mimetype = mime.lookup(rutaArchivo) || "application/octet-stream";
  	const _nombre = path.basename(rutaArchivo);

  	const archivo={
  		buffer : _buffer,
  		mimetype : _mimetype,
  		nombre : _nombre
  	}

  	return archivo
}
/*
(async () => {
  await iniciar();

  const canciones = [
    ["Imagine", "Imagine", "John Lennon", 1971, leerMP3("./songs/imagine.mp3"), true],
    ["Bohemian Rhapsody", "A Night at the Opera", "Queen", 1975,leerMP3( "./songs/Bohemian_Rhapsody.mp3"), true],
    ["Smells Like Teen Spirit", "Nevermind", "Nirvana", 1991, leerMP3("./songs/Smells_Like_Teen_Spirit.mp3"), true],
    ["Billie Jean", "Thriller", "Michael Jackson", 1982, leerMP3("./songs/Billie_Jean.mp3"), false]
  ];

  for (let c of canciones) {
    const res = await insertar(...c);
    console.log("✅ Insertada:", res.nombre);
  }

  await terminar();
})();
*/

/*
(async () => {
  console.log("🔌 Probando conexión a MongoDB...");
  await iniciar();

  console.log("📀 Listando canciones...");
  const canciones = await listarTodos();
  console.log("✅ Canciones en la base de datos:", canciones);

  await terminar();
  console.log("✅ Conexión cerrada.");
})();
*/

/*
(async () => {
	await iniciar();
	const canciones = await listarTodos();
	for (let c of canciones){
		const res = await eliminar(c._id);
		console.log(`Cancion ${c._nombre} eliminada ->`,res);
	}
	await terminar();
})();
*/

(async () => {
	const link = await obtenerLink("1753420382048-imagine.mp3");
	console.log(link)
})();
