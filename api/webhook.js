import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDm80NbEwqVyF5WratOIi-ENe35ykzJ-_Q",
  authDomain: "albumcopa2026-59c00.firebaseapp.com",
  projectId: "albumcopa2026-59c00",
  storageBucket: "albumcopa2026-59c00.firebasestorage.app",
  messagingSenderId: "839897438384",
  appId: "1:839897438384:web:b70a235d7f777c34080375"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Use POST');

  const paymentId = req.query['data.id'] || req.body?.data?.id;
  if (!paymentId) return res.status(200).send('No ID');

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
    });
    const payment = await response.json();

    if (payment.status === 'approved' && payment.external_reference) {
      const userId = payment.external_reference;
      const userRef = doc(db, 'family_albums', userId);
      await updateDoc(userRef, { isPro: true });
    }
    return res.status(200).send('OK');
  } catch (error) {
    return res.status(500).send('Error');
  }
}
