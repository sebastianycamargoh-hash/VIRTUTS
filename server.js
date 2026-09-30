const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pueawawnxvcnxvhepnsh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_PfFF9627-kngHpVC2DhOlQ_aTjYn81w';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Obtener todos los espacios
app.get('/api/espacios', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('espacios')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error("Error de Supabase (GET):", error);
            return res.status(500).json({ error: error.message });
        }
        res.json(data);
    } catch (error) {
        console.error("Error del servidor (GET):", error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Registrar un nuevo espacio
app.post('/api/espacios', async (req, res) => {
    try {
        console.log("Datos recibidos para guardar:", req.body);
        const { titulo, programa, autor, email, url } = req.body;
        
        const { data, error } = await supabase
            .from('espacios')
            .insert([{ titulo, programa, autor, email, url }])
            .select();

        if (error) {
            console.error("Error de Supabase al insertar (POST):", error);
            return res.status(500).json({ error: error.message });
        }
        
        res.json({ message: 'Registrado con éxito', data });
    } catch (error) {
        console.error("Error del servidor (POST):", error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Eliminar un espacio
app.delete('/api/espacios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('espacios')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});