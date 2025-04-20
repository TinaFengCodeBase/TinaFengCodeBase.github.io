import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileText, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AcronymTable from '../components/AcronymTable';
import AcronymForm from '../components/AcronymForm';

const Index = () => {
  const [acronyms, setAcronyms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAcronym, setEditingAcronym] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAcronyms();
  }, []);

  const loadAcronyms = async () => {
    try {
      const response = await fetch('/src/data/MasterAcronym.txt');
      const text = await response.text();
      const loadedAcronyms = text.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [acronym, description] = line.split('|');
          return { acronym, description };
        })
        .sort((a, b) => a.acronym.localeCompare(b.acronym));
      setAcronyms(loadedAcronyms);
    } catch (error) {
      console.error('Error loading acronyms:', error);
      toast({
        title: "Error",
        description: "Failed to load acronyms",
        variant: "destructive",
      });
    }
  };

  const saveAcronyms = async (updatedAcronyms) => {
    try {
      const content = updatedAcronyms
        .sort((a, b) => a.acronym.localeCompare(b.acronym))
        .map(item => `${item.acronym}|${item.description}`)
        .join('\n');

      const blob = new Blob([content], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', blob, 'MasterAcronym.txt');

      // In a real application, you would send this to a server
      // For now, we'll just update the state
      setAcronyms(updatedAcronyms);
      toast({
        title: "Success",
        description: "Acronyms updated successfully",
      });
    } catch (error) {
      console.error('Error saving acronyms:', error);
      toast({
        title: "Error",
        description: "Failed to save acronyms",
        variant: "destructive",
      });
    }
  };

  const handleAdd = (data) => {
    const newAcronyms = [...acronyms, data];
    saveAcronyms(newAcronyms);
  };

  const handleEdit = (acronym) => {
    setEditingAcronym(acronym);
    setIsFormOpen(true);
  };

  const handleUpdate = (data) => {
    const newAcronyms = acronyms.map(item =>
      item.acronym === editingAcronym.acronym ? data : item
    );
    saveAcronyms(newAcronyms);
    setEditingAcronym(null);
  };

  const handleDelete = (acronym) => {
    const newAcronyms = acronyms.filter(item => item.acronym !== acronym.acronym);
    saveAcronyms(newAcronyms);
  };

  const handleExport = () => {
    const content = acronyms
      .map(item => `${item.acronym}|${item.description}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MasterAcronym.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredAcronyms = acronyms.filter(item =>
    item.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Acronym Management System</h1>
      
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search acronyms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Acronym
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <FileText className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <AcronymTable
        acronyms={filteredAcronyms}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AcronymForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAcronym(null);
        }}
        onSubmit={editingAcronym ? handleUpdate : handleAdd}
        initialData={editingAcronym}
      />
    </div>
  );
};

export default Index;
