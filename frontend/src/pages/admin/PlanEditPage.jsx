import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { adminService } from '../../services/adminService';
import api from '../../lib/api';

export default function PlanEditPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);

  useEffect(()=>{
    (async ()=>{
      try{
        const p = await adminService.getPlanById(id);
        setForm({ name: p.name || '', price: p.price || 0, description: p.description || '', images: p.images || [], id: p.id });
      }catch(err){ console.error(err); alert('Erro ao carregar plano'); }
      finally{ setLoading(false); }
    })();
  },[id]);

  if (loading) return <p>Carregando...</p>;
  if (!form) return <p>Plano não encontrado</p>;

  const handleChange = (e) => setForm(prev=>({...prev, [e.target.name]: e.target.value}));
  const handleImages = (uploaded) => { const arr = Array.isArray(uploaded) ? uploaded : [uploaded]; setForm(prev=>({...prev, images: prev.images.concat(arr)})); };
  const handleRemoveImage = (url) => setForm(prev=>({...prev, images: prev.images.filter(i=>i!==url)}));

  const handleDeleteImageRemote = async (url) => {
    try {
      const filename = url.split('/').pop();
      await api.delete(`/uploads/${filename}`);
      setForm(prev=>({...prev, images: prev.images.filter(i => i !== url)}));
    } catch (err) {
      console.error('Erro ao excluir arquivo', err?.response || err);
      alert('Erro ao excluir imagem no servidor');
    }
  };

  const moveImage = (index, dir) => {
    setForm(prev => {
      const imgs = [...(prev.images || [])];
      const to = index + dir;
      if (to < 0 || to >= imgs.length) return prev;
      const tmp = imgs[to]; imgs[to] = imgs[index]; imgs[index] = tmp;
      return {...prev, images: imgs};
    });
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      const payload = {...form, price: Number(form.price)};
      await adminService.updatePlan(form.id, payload);
      alert('Plano atualizado');
      navigate('/admin/plans');
    }catch(err){ console.error(err); alert('Erro ao atualizar plano'); }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Editar Plano</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nome do plano" value={form.name} onChange={handleChange} className="input" />
        <input name="price" type="number" step="0.01" placeholder="Preço" value={form.price} onChange={handleChange} className="input" />
        <textarea name="description" placeholder="Descrição" value={form.description} onChange={handleChange} className="textarea" />
        <div>
          <label className="block">Imagens</label>
          <ImageUploader onUploaded={handleImages} onRemove={handleRemoveImage} multiple={true} />
          <div className="mt-2 flex gap-2 flex-wrap">
            {form.images.map((i,idx)=> (
              <div key={idx} className="relative">
                <img src={i} alt={`img-${idx}`} className="w-24 h-24 object-cover rounded" />
                <div className="flex gap-1 mt-1">
                  <button type="button" onClick={() => moveImage(idx, -1)} className="btn">◀</button>
                  <button type="button" onClick={() => moveImage(idx, 1)} className="btn">▶</button>
                  <button type="button" onClick={() => handleDeleteImageRemote(i)} className="btn text-red-600">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <button className="btn-primary" type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
