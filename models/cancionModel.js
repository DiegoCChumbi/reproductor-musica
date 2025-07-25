import express from 'express';
import mongoose from "mongoose"

const cancionSchema = new mongoose.Schema({
    nombre: String,
    album: String,
    autor: String,
    anho: Number,
    linkKey: String,
    habilitado: Boolean
})

const cancion = mongoose.model("Song", cancionSchema)

export {cancion}
