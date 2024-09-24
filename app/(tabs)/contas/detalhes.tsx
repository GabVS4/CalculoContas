import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

type Pessoa = {
  nome: string;
  valor: number;
};

type Conta = {
  nomeConta: string;
  valorTotal: number;
  pessoas: Pessoa[];
};

export default function DetalhesConta() {
  const { id } = useLocalSearchParams();
  const [conta, setConta] = useState<Conta | null>(null);

  useEffect(() => {
    const contasSalvasJSON = localStorage.getItem('contas') || '[]';
    const contasSalvas = JSON.parse(contasSalvasJSON);

    const contaEncontrada = contasSalvas.find((c: Conta) => c.nomeConta === id);

    setConta(contaEncontrada);
  }, [id]);

  if (!conta) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Conta não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Nome da Conta: {conta.nomeConta}</Text>
      <Text>Valor Total: {conta.valorTotal}</Text>

      <FlatList
        data={conta.pessoas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.nome}</Text>
            <Text>Valor: {item.valor.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}
