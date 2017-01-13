import fireapp from 'shared/fireapp.jsx';

// might as well cache this
let defaultUserId;

export const getUserIdByUrlId = (urlId) => {
  return new Promise(
    (resolve) => fireapp
      .database()
      .ref('profiles')
      .orderByChild('urlId')
      .equalTo(urlId)
      .once('value', (snapshot) => {
        if (!snapshot || !snapshot.val()) resolve(null);
        else snapshot.forEach((snapshot) => resolve(snapshot.key));
      })
  );
};

export const getDefaultUserId = () => (
  defaultUserId ?
    Promise.resolve(defaultUserId) :
    getUserIdByUrlId('default').then((userId) => {
      defaultUserId = userId;
      return userId;
    })
);