import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// "JSON" dos itens
const ITEMS_DATA = [
  {
    name: 'Cadeira Executiva Premium',
    category: 'Cadeiras',
    location: 'Sala 101',
    available: true,
    imageUrl: 'https://example.com/cadeira-executiva-premium.png',
  },
  {
    name: 'Mesa de Reunião Grande',
    category: 'Mesas',
    location: 'Sala 201',
    available: true,
    imageUrl: 'https://example.com/mesa-reuniao-grande.png',
  },
  {
    name: 'Armário Pequeno',
    category: 'Armários',
    location: 'Corredor B',
    available: false,
    imageUrl: 'https://example.com/armario-pequeno.png',
  },
];

export default function SeedItemsScreen() {
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const colRef = collection(db, 'items');

        // Para evitar duplicar, você pode rodar apenas uma vez
        for (const item of ITEMS_DATA) {
          await addDoc(colRef, item);
        }

        setStatus('done');
      } catch (err: any) {
        console.error(err);
        setErrorMsg(String(err));
        setStatus('error');
      }
    })();
  }, []);

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={styles.text}>Inserindo itens na coleção &quot;items&quot;...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Erro ao inserir itens:</Text>
        <Text style={styles.text}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Itens inseridos com sucesso na coleção &quot;items&quot;!</Text>
      <Text style={styles.text}>Você já pode apagar esta tela (seedItems.tsx).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  text: { textAlign: 'center', marginTop: 12 },
});
