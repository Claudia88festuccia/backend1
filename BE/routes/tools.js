import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import e from "express";
dotenv.config();

export const createAccessToken=(payload)=>
    new Promise((resolve,reject)=>
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"},
        (err,token)=>{
            if(err){
                reject(err);
            }else{
                resolve(token);
            }
        }
    ));
    


    export const verifyAccessToken=(token)=>
    new Promise((resolve,reject)=>
        jwt.verify(token, process.env.JWT_SECRET, (err,payload)=>{
            if(err){
                reject(err);
            }else{
                resolve(payload);
            }
        })
    );

