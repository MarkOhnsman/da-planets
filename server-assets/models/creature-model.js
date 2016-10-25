let dataAdapter = require('./data-adapter'),
  uuid = dataAdapter.uuid,
  schemator = dataAdapter.schemator,
  DS = dataAdapter.DS,
  formatQuery = dataAdapter.formatQuery;

let Creature = DS.defineResource({
  name: 'creature',
  endpoint: 'creatures',
  filepath: __dirname + '/../data/creatures.db',
  relations: {
    hasMany: {
      galaxy: [{
        localField: 'galaxies',
        localKeys: 'galaxyIds'
      },{
        localField: 'knownGalaxies',
        foreignKeys: 'creatureIds'
      }],
      planet: [{
        localField: 'planets',
        localKeys: 'planetIds'
      },{
        localField: 'knownPlanets',
        foreignKeys: 'creatureIds'
      }],
      moon: [{
        localField: 'moons',
        localKeys: 'moonIds'
      },{
        localField: 'knownMoons',
        foreignKeys: 'creatureIds'
      }]
    }
  }
})

function create(creature, cb) {
  // Use the Resource Model to create a new galaxy

  let creatureObj = {
    id: uuid.v4(),
    name: creature.name,
    galaxyIds: {
    }
  }

  Creature.create(creatureObj).then(cb).catch(cb)
}


function inhabitLocation(creatureId, type, typeId, cb){
  DS.find(type, typeId).then(function(item){
    Creature.find(creatureId).then(function(creature){

      creature[`${type}Ids`] = creature[`${type}Ids`] || {}
      creature[`${type}Ids`][typeId] = typeId;
      item.creatureIds = item.creatureIds || {}
      item.creatureIds[creature.id] = creature.id;
      if(type != "galaxy"){
        updateGalaxy(item, creature)
      }

      Creature.update(creature.id, creature).then(function(){
        DS.update(type, item.id, item)
          .then(cb)
          .catch(cb)
      }).catch(cb)
    }).catch(cb)
  }).catch(cb)
}

function updateGalaxy(item, creature){
  DS.find('galaxy', item.galaxyId).then(function(galaxy){
    galaxy.creatureIds = galaxy.creatureIds || {}
    galaxy.creatureIds[creature.id] = creature.id;
    creature.galaxyIds = creature.galaxyIds || {}
    creature.galaxyIds[galaxy.id] = galaxy.id;
    DS.update('galaxy', galaxy.id, galaxy)
    DS.update('creature', creature.id, creature)
  })
}



function getAll(query, cb) {
  //Use the Resource Model to get all Galaxies
  Creature.findAll({}).then(cb).catch(cb)
}

function getById(id, query, cb) {
  // use the Resource Model to get a single galaxy by its id
  Creature.find(id, formatQuery(query)).then(cb).catch(cb)
}

module.exports = {
  create,
  getAll,
  inhabitLocation,
  getById
}
