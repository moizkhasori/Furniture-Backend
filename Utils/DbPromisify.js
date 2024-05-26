import {db} from "../Config/mysqldb.js"


export const QueryFromDb = (query, params = []) => {

    return new Promise((resolve,reject) => {
        db.query(query, params, (error,result) => {
            if(error){
                reject(error)
            }else{
                resolve(result)
            }
        })
    })

}