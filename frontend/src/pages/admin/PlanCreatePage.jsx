import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { adminService } from '../../services/adminService';

export default function PlanCreatePage(){
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', price:0, description:'', images:[] });

  const handleChange = (e) => setForm(prev=>({...prev, [e.target.name]: e.target.value}));
  const handleImages = (uploaded) => {
    const arr = Array.isArray(uploaded) ? uploaded : [uploaded];
    setForm(prev=>({...prev, images: prev.images.concat(arr)}));
  };

  const handleRemoveImage = (url) => setForm(prev=>({...prev, images: prev.images.filter(i=>i!==url)}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const payload = { ...form, price: Number(form.price) };
      await adminService.createPlan(payload);
      alert('Plano criado');
      navigate('/admin/plans');
    }catch(err){
      console.error(err);
      alert('Erro ao criar plano');
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Criar Plano</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nome do plano" value={form.name} onChange={handleChange} className="input" />
        <input name="price" type="number" step="0.01" placeholder="Preço" value={form.price} onChange={handleChange} className="input" />
        <textarea name="description" placeholder="Descrição" value={form.description} onChange={handleChange} className="textarea" />
        <div>
          <label className="block">Imagens</label>
          <ImageUploader onUploaded={handleImages} onRemove={handleRemoveImage} multiple={true} />
          <div className="mt-2 flex gap-2">
            {form.images.map((i, idx)=>(<img key={idx} src={i} className="w-24 h-24 object-cover rounded" alt={`img-${idx}`} />))}
          </div>
        </div>
        <div>
          <button className="btn-primary" type="submit">Criar</button>
        </div>
      </form>
    </div>
  );
}
