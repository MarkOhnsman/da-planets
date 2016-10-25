let dataAdapter = require('./data-adapter'),
  uuid = dataAdapter.uuid,
  schemator = dataAdapter.schemator,
  DS = dataAdapter.DS;
  formatQuery = dataAdapter.formatQuery;

let Star = DS.defineResource({
  name: 'star',
  endpoint: 'stars',
  filepath: __dirname + '/../data/stars.db',
  relations: {
    belongsTo: {
      galaxy: {
        localField: 'galaxy',
        localKey: 'galaxyId'
      }
    },
    hasMany: {
      planet: {
        localField: 'planets',
        foreignKey: 'starId'
      },
      moon: {
        localField: 'moons',
        foreignKey: 'planetId'
      },
      creature: [{
        localField: 'creatures',
        foreignKeys: 'planetIds'
      },
      {
        localField: 'knownCreatures',
        localKeys: 'creatureIds'
      }]
    }
  }
})

schemator.defineSchema('Star', {
  id: {
    type: 'string',
    nullable: false
  },
   galaxyId: {
    type: 'string',
    nullable: false
  },
  name: {
    type: 'string',
    nullable: false
  }
})

function create(star, cb) {
  // Use the Resource Model to create a new star
  let starObj = { id: uuid.v4(), name: star.name, galaxyId: star.galaxyId }
  let error = schemator.validateSync('Star', starObj)
   if(error){
    return cb(error);
  }
  Star.create(starObj).then(cb).catch(cb)
}


function getAll(query, cb) {
  //Use the Resource Model to get all Galaxies
  Star.findAll({}).then(cb).catch(cb)
}

function getById(id, query, cb) {
  // use the Resource Model to get a single star by its id
  Star.find(id, formatQuery(query)).then(cb).catch(cb)
}

module.exports = {
  create,
  getAll,
  getById
}

