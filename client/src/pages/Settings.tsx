import React, { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import api from '../services/api';

export default function Settings() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await api.get('/config');
      if (res.data.success) {
        setConfig(res.data.data);
      }
    } catch (err) {
      console.error('Error loading config', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (clave: string, valor: string) => {
    setSaving(true);
    try {
      await api.post('/config', { clave, valor });
      setConfig({ ...config, [clave]: valor });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving config', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (clave: string, value: string) => {
    setConfig({ ...config, [clave]: value });
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configuración de la Empresa</h1>
      
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Datos de la Empresa</h2>
        <p className="text-sm text-gray-500 mb-4">
          Estos datos aparecerán en las facturas y presupuestos generados.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre de la empresa"
            value={config['empresa_nombre'] || ''}
            onChange={(e) => handleChange('empresa_nombre', e.target.value)}
          />
          <Input
            label="NIF / CIF"
            value={config['empresa_nif'] || ''}
            onChange={(e) => handleChange('empresa_nif', e.target.value)}
          />
          <div className="md:col-span-2">
            <Input
              label="Dirección"
              value={config['empresa_direccion'] || ''}
              onChange={(e) => handleChange('empresa_direccion', e.target.value)}
            />
          </div>
          <Input
            label="Ciudad"
            value={config['empresa_ciudad'] || ''}
            onChange={(e) => handleChange('empresa_ciudad', e.target.value)}
          />
          <Input
            label="Código Postal"
            value={config['empresa_codigo_postal'] || ''}
            onChange={(e) => handleChange('empresa_codigo_postal', e.target.value)}
          />
          <Input
            label="Teléfono"
            value={config['empresa_telefono'] || ''}
            onChange={(e) => handleChange('empresa_telefono', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={config['empresa_email'] || ''}
            onChange={(e) => handleChange('empresa_email', e.target.value)}
          />
          <div className="md:col-span-2">
            <Input
              label="IBAN"
              value={config['empresa_iban'] || ''}
              onChange={(e) => handleChange('empresa_iban', e.target.value)}
              placeholder="ES00 0000 0000 0000 0000 0000"
            />
          </div>
          <Input
            label="Banco"
            value={config['empresa_banco'] || ''}
            onChange={(e) => handleChange('empresa_banco', e.target.value)}
          />
          <Input
            label="IVA predeterminado (%)"
            type="number"
            value={config['iva_predeterminado'] || '21'}
            onChange={(e) => handleChange('iva_predeterminado', e.target.value)}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        {saved && <span className="text-green-600 self-center">✓ Guardado</span>}
        <Button 
          onClick={() => Object.keys(config).forEach(k => handleSave(k, config[k]))} 
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar todo'}
        </Button>
      </div>
    </div>
  );
}
