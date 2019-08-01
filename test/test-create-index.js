var assert = require('assert')
let Research = require("../research")

const redisConnection = {
    host: "localhost",
    port: 63794
}

var researchjs  = new Research(redisConnection,{highlight: false})

describe('Indexing', function(){
    describe('#createIndexWithSchema( books, [{field: title, attributes: [ NUMERIC, SORTABLE ]},{field: year, attributes: [ TEXT, WEIGHT, 1.0 ]}] )', function() {
        it('it should return TRUE when index has created', async () => {
            try{
                var schemas = [{
                    field: "title",
                    attributes: ['TEXT','WEIGHT','1.0']
                },{
                    field: "year",
                    attributes: ['NUMERIC','SORTABLE']
                }]
                var creatingIndex =  await researchjs.createIndex('books', schemas)
                console.log("creatingIndex",creatingIndex)
                assert.equal(creatingIndex, true)
            }catch(err){
                console.log("ERR creatingIndex",err)
                assert.equal(false, true)
            }
        })
    })

    describe('#add()', function(){
        it('Should return same as payload when data has saved', async () => {
            try{
                var payload = [
                    'books',
                    1,
                    '1.0',
                    'FIELDS',
                    'title','Docker Tutorial',
                    'year',2016
                ]
                var newData = await researchjs.add(payload)
                assert.deepEqual(newData,payload)
            }catch(err){
                console.log("ERR",err)
                assert.equal(false, true)
            }
            
        })
    })

    describe('#search(books, (@title:Docker))', function(){
        it('should be exists data', async () => {
            try{
                var {totalRS, dataRS, errRS} = await researchjs.search('books',['(@title:Docker)'])
                console.log("RESP",dataRS[0].title)
                assert.equal(dataRS[0].title,'Docker Tutorial')
            }catch(err){
                console.log("ERR",err)
                assert.equal(false, true)
            }
            
        })
    })
})


