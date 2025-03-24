let fountUser;

function getPage($item) {
  return $item.parents('.page').data('data');
};

function getAllyabaseUser(item) {
  if(item.allyabaseUser) {
    return item.allyabaseUser;
  } else {
    return fetch('/plugin/ftt/user').then(res => res.json());
  }
};

function getBDOs($item, page) {
  let bdoPromises = [];
  if(page.transferees) {
    page.transferees.forEach(transferee => {
      if(!transferee.bdoPubKey) {
        return;
      }
      const transfereeDiv = document.createElement('div');
      transfereeDiv.innerHTML = '<p>Fetching transfer details for ${transferee.bdoUUID}</p>';
      $item.append(transfereeDiv);
      const bdoPromise = fetch(`/plugin/ftt/bdo?pubKey=${transferee.bdoPubKey}`)
        .then(bdo => {
          if(bdo.bdoUUID) {
            transfereeDiv.innerHTML = `<p>Transferee: ${bdo.bdoUUID} at ${bdo.host}</p>
              <button id="${transferee.bdoPubKey}">Advance</button>`;
          } else {
            transfereeDiv.innerHTML = '<p>No BDO uuid found for this transferee</p>';
          }
        });
      bdoPromises.push(bdoPromise);
    });

    return Promise.all(bdoPromises);
  } else {
    return $item.append(`<div><p>You have no transferees yet. Get on that marketing!</p></div>`);
  }
};

function getSignedFount(allyabaseUser, $item, item) { 
  if(item.signature) {
    const storyText = getPage($item).story.map($ => $.text).join('');
    const message = item.timestamp + item.host + allyabaseUser.fountUser.uuid + allyabaseUser.bdoUser.uuid + storyText;
    return fetch(`/plugin/ftt/verify?signature=${item.signature}&message=${message}`)
      .then(verified => {
        if(verified) {
          $item.append(`<div><p>This content is signed and verified!</p></div>`);
        } else {
          $item.append(`<div><p>This content is not signed yet. Hit the Sign button to sign it.</p></div>`);
        }
      })
      .catch(err => console.warn('got an error with signature'));
  }
};

function emit($item, item) {
  $item.empty(item);

  const gettingUserDiv = document.createElement('div');
  gettingUserDiv.innerHTML = '<p>Getting your allyabase user, and signatures...</p>';
  $item.append(gettingUserDiv);

  getAllyabaseUser(item)
    .then(allyabaseUser => {
console.log('allyabaseUser', allyabaseUser);
      item.allyabaseUser = allyabaseUser;
      gettingUserDiv.remove();
      gettingUserDiv.innerHTML = `<p>Welcome back ${allyabaseUser.fountUser.uuid} you have ${allyabaseUser.nineum.length} nineum</p>`;
      $item.append(gettingUserDiv);
      return getSignedFount(allyabaseUser, $item, item);
    })
    .then(getBDOs($item, page))
    .catch(err => console.warn('received an error emitting in ftt plugin', err));
};

function bind($item, item) {

};

if(window) {
  window.plugins['ftt'] = {emit, bind};
}

export const ftt = typeof window == 'undefined' ? { emit, bind } : undefined;
