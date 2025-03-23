let fountUser;

function getPage($item) {
  return $item.parents('.page').data('data');
};

function getAllyabaseUser() {
};

function getSignedFount(item) {
};

function emit($item, item) {
  $item.empty();
  const page = getPage($item);

  let allyabaseUser;

  getAllyabaseUser()
    .then(_allyabaseUser => {
      allyabaseUser = _allyabaseUser;
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
