const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (lee las variables de entorno de Render o del archivo .env local)
const supabaseUrl = process.env.SUPABASE_URL || 'https://pueawawnxvcnxvhepnsh.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_PfFF9627-kngHpVC2DhOlQ_aTjYn81w';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar JSON y servir archivos estáticos desde la carpeta 'public'
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta explícita para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas explícitas para el panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API: Obtener todos los espacios desde Supabase
app.get('/api/espacios', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('espacios')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            throw error;
        }

        res.json(data || []);
    } catch (error) {
        console.error("Error al obtener espacios:", error);
        res.status(500).json({ error: 'Error al leer los datos de la base de datos.' });
    }
});

// API: Registrar un nuevo espacio en Supabase
app.post('/api/espacios', async (req, res) => {
    try {
        const { titulo, programa, autor, email, url } = req.body;

        const { data, error } = await supabase
            .from('espacios')
            .insert([{ titulo, programa, autor, email, url }])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json({ mensaje: 'Espacio registrado con éxito', espacio: data[0] });
    } catch (error) {
        console.error("Error al guardar espacio:", error);
        res.status(500).json({ error: 'Error al guardar el registro en la base de datos.' });
    }
});

// API: Eliminar un espacio por ID en Supabase
app.delete('/api/espacios/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { error } = await supabase
            .from('espacios')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        res.json({ mensaje: 'Registro eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar espacio:", error);
        res.status(500).json({ error: 'Error al eliminar el registro de la base de datos.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
