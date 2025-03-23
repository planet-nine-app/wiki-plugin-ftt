(function() {
var fount = require('fount-js');
var sessionless = require('sessionless-node');
var fs = require('fs');

const HASH = 'forward-transfer-token';

let fountUser;

async function startServer(params) {
  const app = params.app;
  const argv = params.argv;

  let allyabaseUser;
  
  const allyabaseKeys = {
    privateKey: argv.private_key,
    pubKey: argv.pub_key
  };

  const saveKeys = () => {};
  const getKeys = () => allyabaseKeys;

  await sessionless.generateKeys(saveKeys, getKeys);

  app.get('/plugin/ftt/owner', async function(req, res) {
console.log('calling owner');
    const idFile = argv.id;
console.log('idFile', idFile);
    fs.readFile(idFile, (err, data) => {
      if(err) {
console.log('err', err);
        res.status(404);
        return res.send(err);
      }
      const owner = JSON.parse(data);
      res.send(owner);
    });
  });

  app.get('/plugin/ftt/user', async function(req, res) {
console.log('getting called here');
    let fountUser;
    let bdoUUID;

    if(!allyabaseUser || !fountUser) {
      fountUser = await fount.getUserByPublicKey(fountKeys.pubKey);
      if(!fountUser || !fountUser.uuid) {
        fountUser = await fount.createUser(saveKeys, getKeys);   
      }
    }

    if(!allyabaseUser || !bdoUser) {
      bdoUUID = await bdo.createUser(HASH, {}, saveKeys, getKeys);
    }
console.log('user is: ', user);
    
    allyabase.bdoUser = {uuid: bdoUUID, bdo: {}};
    allyabase.fountUser = fountUser;
    allyabaseUser.nineum = await fount.getNineum(user.uuid);

    let galacticNineum = allyabaseUser.nineum.filter(nineum => nineum.slice(14, 16) === 'ff');
    if(!galacticNineum) {
      fountUser = await fount.grantGalacticNineum(savedUser.fountUUID, '28880014');
    } 

    res.send(allyabaseUser);
  });

  app.post('/plugin/ftt/resolve', async function(req, res) {
    const payload = req.body;
    const message = JSON.stringify({
      timestamp: payload.timestamp,
      spell: payload.spell,
      casterUUID: payload.casterUUID,
      totalCost: payload.totalCost,
      mp: payload.mp,
      ordinal: payload.ordinal,
    });

    payload.casterSignature = await sessionless.sign(message);

    const resolution = await fount.resolve(payload);
    if(resolution.success) {
      const updatedUser = await fount.getUserByUUID(payload.casterUUID);
      return res.send(updatedUser);
    }
    res.send(resolution);
  });

  app.get('/plugin/ftt/user/:pubKey', async function(req, res) {
    fountUser = await fount.getUserByPublicKey(req.params.pubKey);
console.log('getting the user on the server, it looks like: ', fountUser);
    fountUser.nineum = await fount.getNineum(fountUser.uuid);
    res.send(fountUser);
  });

  app.put('/plugin/ftt/bdo', async function(req, res) {
    try {
      allyabaseUser.bdoUser = await bdo.updateBDO(allyabaseUser.bdoUser.uuid, HASH, req.body.bdo);
      res.send({success: true});
    } catch(err) {
      res.status(404);
      res.send(err);
    }
  });

  app.post('/pugin/ftt/grant-nineum', async function(req, res) {
    const toUUID = req.body.toUUID;
    const flavor = req.body.flavor;

    const grantee = await fount.grantNineum(allyabaseUser.fountUser.uuid, toUUID, flavor);
    res.send(grantee);
  });

  app.post('/pugin/ftt/grant-admin-nineum', async function(req, res) {
    const toUUID = req.body.toUUID;

    const grantee = await fount.grantAdminNineum(allyabaseUser.fountUser.uuid, toUUID);
    res.send(grantee);
  });

  app.post('/plugin/ftt/transfer', async function(req, res) {
    const uuid = req.body.uuid;
    const toUUID = req.body.toUUID;
    const nineum = req.body.nineum;
    const transferNineum = await fount.transferNineum(uuid, toUUID, nineum, 0, 'usd'); // priced transfers not supported yet
console.log('response on server for transfer', transferNineum);
    fountUser = await fount.getUserByPublicKey(req.params.pubKey);
console.log('getting the user on the server, it looks like: ', fountUser);
    fountUser.nineum = await fount.getNineum(fountUser.uuid);
    res.send(fountUser);
  });
}

module.exports = {startServer};
}).call(this);
