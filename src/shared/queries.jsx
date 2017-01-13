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
      .once('value', (snapshot) => resolve(
        snapshot && snapshot.val() ? snapshot.val().userId : null
      ))
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