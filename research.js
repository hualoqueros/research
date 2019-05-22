let redis = require("redis")

'use strict'

class Researchjs {
    /**
     * 
     * @param {Object} rediConnection {host, port}
     * @param {Boolean} withScores 
     */
    constructor(rediConnection, withScores = true) {
        this.db = redis.createClient(rediConnection)
        this.withScores = withScores
    }

    /**
     * Search into Redisearch
     * @param {String} key 
     * @param {Array} query
     * @return {Promise} 
     */
    search( key, query ) {
        var total, data, err = null
        return new Promise( (resolve, reject) => {
            try {
                console.log("======= SEARCHING DOCUMENT=======")
                console.log(`QUERY : ${query}`)
                var q = [key]
                for (var i in query){
                    q.push(query[i])
                }
                
                if (this.withScores) q.push('WITHSCORES')
                
                console.time("EXECUTION TIME")
                this.db.send_command('FT.SEARCH',q, (err, reply) => {
                    
                    if (err){
                        return reject(err)
                    }
                    // Keep total record into new variable
                    total = reply[0]
                    
                    reply.shift() 
        
                    // We need chunk an array, so this will readable for user
                    let chuckSize = this.withScores ? 3 : 2
                    var dataDetail = this.chunk(reply, chuckSize)
                    data = this.parseData(dataDetail)
                    console.timeEnd("EXECUTION TIME")
                    return resolve({total, data, err})

                })
            }catch(err){
                resolve({total, data, err})
            }
            
        })
    }
    
    /**
     * Chunk the array become a couple array
     * @param {*} array 
     * @param {*} chunkSize 
     */
    chunk(array,chunkSize) {
        return [].concat.apply([],
            array.map(function(elem,i) {
                return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
            })
        );
    }

    /**
     * Parse Data from redisearch 
     * so it will readable
     * @param {Array} array 
     * @return {Array}
     */
    parseData(array) {
        return [].concat.apply([],
            array.map(function(elem,i) {
                var dt = elem[2]
                // console.log("SPESIFIC DATA",dt)
                var newArray = new Array()
                var newRecord = {}
                newRecord["id"] = elem[0]
                newRecord["score"] = elem[1]
                for (i in dt){
                    if (i%2===0) {
                        var k = dt[i]
                        // console.log("POINTER ID",i)
                        // console.log("POINTER",k)
                        // console.log("GET POINTER",parseInt(i)+1)
                        // console.log("VALUE POINTER",dt[ parseInt(i) + 1 ])
                        newRecord[ k ] = dt[ parseInt(i) + 1 ]
                        newArray = newRecord
                        
                    }
                }
                // console.log("newArray",newArray)
                return [ newArray ]
                
            })
        );
    }
}

module.exports = Researchjs