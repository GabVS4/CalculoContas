import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

type Conta = {
  nomeConta: string;
  valorTotal: number;
  pessoas: {
    nome: string;
    valor: number;
  }[];
};

export default function HistoricoContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const router = useRouter();

  useEffect(() => {
    const contasSalvasJSON = localStorage.getItem('contas') || '[]';
    const contasSalvas = JSON.parse(contasSalvasJSON);
    setContas(contasSalvas);
  }, []);

  const deletarConta = (nomeConta: string) => {
    const contasSalvasJSON = localStorage.getItem('contas') || '[]';
    const contasSalvas = JSON.parse(contasSalvasJSON);

    const contasAtualizadas = contasSalvas.filter((c: Conta) => c.nomeConta !== nomeConta);
    localStorage.setItem('contas', JSON.stringify(contasAtualizadas));
    setContas(contasAtualizadas);
  };

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={contas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.nomeConta}</Text>
            <Text>Valor Total: {item.valorTotal}</Text>
            <Button title="Ver Detalhes" onPress={() => router.push(`/contas/detalhes?id=${item.nomeConta}`)} />
            <Button title="Deletar" onPress={() => deletarConta(item.nomeConta)} color="red" />
          </View>
        )}
      />
    </View>
  );
}
