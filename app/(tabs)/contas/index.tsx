import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

type Pessoa = {
  nome: string;
  valor: number;
  ajustado: boolean;
};

export default function CadastroConta() {
  const [nomeConta, setNomeConta] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [quantidadePessoas, setQuantidadePessoas] = useState('');
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const router = useRouter();

  const adicionarPessoas = () => {
    const listaPessoas = Array.from({ length: Number(quantidadePessoas) }, (_, i) => ({
      nome: `Pessoa ${i + 1}`,
      valor: Number(valorTotal) / Number(quantidadePessoas),
      ajustado: false,
    }));
    setPessoas(listaPessoas);
  };

  const atualizarPessoa = (index: number, nome: string, valor: string) => {
    const novasPessoas = [...pessoas];
    novasPessoas[index].nome = nome;
    novasPessoas[index].valor = Math.floor(Number(valor));
    novasPessoas[index].ajustado = true;

    const totalAjustado = novasPessoas.reduce(
      (acc, pessoa) => acc + (pessoa.ajustado ? pessoa.valor : 0),
      0
    );

    const pessoasNaoAjustadas = novasPessoas.filter(p => !p.ajustado);

    const valorRestante = Number(valorTotal) - totalAjustado;
    const valorPorPessoa = valorRestante / pessoasNaoAjustadas.length;

    const pessoasAtualizadas = novasPessoas.map(p =>
      p.ajustado ? p : { ...p, valor: valorPorPessoa }
    );

    setPessoas(pessoasAtualizadas);
  };

  const salvarConta = () => {
    const conta = {
      nomeConta,
      valorTotal: Number(valorTotal),
      pessoas,
    };

    let contasSalvas = [];
    const contasJSON = localStorage.getItem('contas') || '[]';
    contasSalvas = JSON.parse(contasJSON);

    contasSalvas.push(conta);
    localStorage.setItem('contas', JSON.stringify(contasSalvas));

    router.push('/contas/historico');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nome da Conta:</Text>
      <TextInput value={nomeConta} onChangeText={setNomeConta} style={{ borderWidth: 1, marginVertical: 5 }} />
      
      <Text>Valor Total da Conta:</Text>
      <TextInput value={valorTotal} onChangeText={setValorTotal} keyboardType="numeric" style={{ borderWidth: 1, marginVertical: 5 }} />
      
      <Text>Quantidade de Pessoas:</Text>
      <TextInput value={quantidadePessoas} onChangeText={setQuantidadePessoas} keyboardType="numeric" style={{ borderWidth: 1, marginVertical: 5 }} />

      <Button title="Adicionar Pessoas" onPress={adicionarPessoas} />

      <FlatList
        data={pessoas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View>
            <TextInput
              value={item.nome}
              onChangeText={(nome) => atualizarPessoa(index, nome, item.valor.toString())}
              style={{ borderWidth: 1, marginVertical: 5 }}
            />
            <TextInput
              value={item.valor.toString()}
              onChangeText={(valor) => atualizarPessoa(index, item.nome, valor)}
              keyboardType="numeric"
              style={{ borderWidth: 1, marginVertical: 5 }}
            />
          </View>
        )}
      />

      <Button title="Salvar Conta" onPress={salvarConta} />
      
      <Button title="Ver Histórico" onPress={() => router.push('/contas/historico')} />
    </View>
  );
}
