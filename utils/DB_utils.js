import {mongoose} from "mongoose"
import {cancion} from "../models/cancionModel.js"
import {eliminarDeR2, subir} from "./R2_Utils.js"
import dotenv from "dotenv";
dotenv.config();

process.loadEnvFile()
const URL = `mongodb+srv://diego171101:${process.env.MONGODB_PASSWORD}@primeraprueba.kvvje.mongodb.net/mongodbVSCodePlaygroundDB`;

console.log(URL)

async function iniciar(){
    try{
        await mongoose.connect(URL)
    } catch (error){
        console.log(error)
    }
}

async function terminar(){
    try{
        mongoose.connection.close()
    } catch (error){
        console.log(error)
    }
}

async function listarTodos(){
    try{
        const resultSet = await cancion.find()
        return resultSet
    } catch(error){
        console.log(error)
        await terminar()
    }
    return null
}

async function eliminar(id){
    try{

        const song = await cancion.findById(id)
        if (!song){
            console.log("Cancion no encontrada en la BD")
            return null
        }

        if(song.linkKey){
            await eliminarDeR2(song.linkKey)
        }

        const result = await cancion.deleteOne({_id:id})
        console.log(`Eliminada de MongoDB: ${id}`)
        return result
    } catch (error){
        console.log("Error al eliminar: ", error)
        await terminar()
    }
    return null
}

async function insertar(_nombre, _album, _autor, _anho, _archivo, _habilitado){
    try{

		const key = await subir(_archivo);
        
        const nuevo = new cancion({
            nombre: _nombre,
            album: _album,
            autor: _autor,
            anho: _anho,
            linkKey: key,
            habilitado: _habilitado
        })
        const result = await nuevo.save()
        return result
    }catch (error){
        console.log(error)
        await terminar()
    }
    return null
}

async function listarPorCriterio(filtro){
    try{
        const resultSet = await cancion.find(filtro)
        return resultSet
    } catch (error){
        console.log(error)
        await terminar()
    }
    return null
}

async function actualizar(id, _nombre, _album, _autor, _anho, _habilitado) {
  try {
    const result = await cancion.updateOne(
      { _id: id }, 
      {
        nombre: _nombre,
        album: _album,
        autor: _autor,
        anho: _anho,
        habilitado: _habilitado,
      }
    );
    return result;
  } catch (error) {
    console.error("Error actualizando canción:", error.message);
    return null;
  }
}

export {iniciar, terminar, listarTodos, eliminar, insertar, actualizar, listarPorCriterio}
