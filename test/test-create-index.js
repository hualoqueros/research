let Research = require("./research")

const redisConnection = {
    host: "redisearch",
    port: 6379
}

var researchjs  = new Research(redisConnection,{highlight: false})


var createIndex = async (indexName) => {
    try{
        var schemas = [{
            field: "user_id",
            attributes: ['NUMERIC','SORTABLE']
        },{
            field: "message",
            attributes: ['TEXT','WEIGHT','1.0']
        }]
        var creatingIndex =  await researchjs.createIndex(indexName, schemas)
        console.log("creatingIndex",creatingIndex)
    }catch(err){
        console.log("ERR creatingIndex",err)
    }
}
createIndex("SAMUDRA")


