import admin, { ServiceAccount } from 'firebase-admin';
import { Bookstore } from './interfaces/bookstore';

export let firestore: FirebaseFirestore.Firestore;

export const connect = (url: string, serviceAccount: ServiceAccount) => {
  return new Promise<FirebaseFirestore.Firestore>((resolve, reject) => {
    // check db connected status
    if (firestore) {
      reject('DB is already connected.');
    } else {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: url,
      });
      console.log('test');
      resolve(admin.firestore());
    }
  })
    .then((connection: FirebaseFirestore.Firestore) => {
      // update db client
      firestore = connection;
    })
    .catch(error => {
      if (error) {
        console.error(error);
      }
    });
};

export const getBookstores = async (id?: string) => {
  const bookstores: Bookstore[] = [];
  let bookstoreRef: FirebaseFirestore.QuerySnapshot;
  if (id)
    bookstoreRef = await firestore
      .collection('bookstores')
      .where('id', '==', id)
      .get();
  else bookstoreRef = await firestore.collection('bookstores').get();

  for (const bookstore of bookstoreRef.docs) {
    const bookstoreData = bookstore.data();
    bookstores.push({
      id: bookstoreData.id,
      displayName: bookstoreData.displayName,
      website: bookstoreData.website,
      isOkay: bookstoreData.isOkay,
      status: bookstoreData.status,
    });
  }
  return bookstores;
};
