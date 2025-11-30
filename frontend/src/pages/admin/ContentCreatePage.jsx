import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { Button } from '@/components/ui/button';

export default function ContentCreatePage(){
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: '', type: 'article', content: '', is_published: false });
  const createMutation = useMutation({ mutationFn: adminService.createContent, onSuccess: () => queryClient.invalidateQueries(['admin-content']) });

  const submit = async (e) => {
    e.preventDefault();
    try{
      await createMutation.mutateAsync(form);
      navigate('/admin/content');
    }catch(err){ console.error(err); alert('Erro ao criar conteúdo'); }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Novo Conteúdo</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" name="title" placeholder="Título" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
        <select className="input" value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})}>
          <option value="article">Artigo</option>
          <option value="video">Vídeo</option>
          <option value="playlist">Playlist</option>
        </select>
        <textarea className="textarea" value={form.content} onChange={(e)=>setForm({...form, content: e.target.value})} placeholder="Conteúdo (Markdown ou URL)" />
        <label className="inline-flex items-center"><input type="checkbox" checked={form.is_published} onChange={(e)=>setForm({...form, is_published: e.target.checked})} /> <span className="ml-2">Publicado</span></label>
        <div>
          <Button type="submit">Criar</Button>
          <Button variant="ghost" onClick={()=>navigate('/admin/content')} className="ml-2">Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
