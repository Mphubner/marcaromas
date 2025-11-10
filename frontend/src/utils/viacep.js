// src/utils/viacep.js
export async function buscarEnderecoPorCEP(cep) {
  const cleanCep = (cep || '').replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;
  const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.erro) return null;
  return {
    rua: data.logradouro || '',
    bairro: data.bairro || '',
    cidade: data.localidade || '',
    uf: data.uf || '',
    complemento: data.complemento || '',
  };
}
