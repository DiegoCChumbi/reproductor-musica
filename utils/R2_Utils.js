import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  }
});

async function subir(archivo){

    const uniqueKey = `${Date.now()}-${archivo.nombre}`;
	try {
	    await s3.send(
	      new PutObjectCommand({
	        Bucket: "canciones",
	        Key: uniqueKey,
	        Body: archivo.buffer,
	        ContentType: archivo.mimetype
	      })
	    );
	    console.log(`Subido a R2: ${uniqueKey}`);
	    return uniqueKey;
	} catch (err) {
	    console.error("Error subiendo a R2:");
	      console.error("Mensaje:", err.message);
	      console.error("Código:", err.code);
	      console.error("Stack:", err.stack);
	    throw err;
	}
}

async function obtenerLink(key){
    const command = new GetObjectCommand({
        Bucket: "canciones",
        Key: key
    });
    
  	const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hora
    return url;
}

async function eliminarDeR2(key){
	try{
		await s3.send(new DeleteObjectCommand({
			Bucket: "canciones",
			Key: key
		}));
		console.log(`Eliminado de R2: ${key}`);
	}catch (err){
		console.log(`Error al eliminar de R2: `, err.message);
		throw err;
	}
}

export {subir, obtenerLink, eliminarDeR2}
