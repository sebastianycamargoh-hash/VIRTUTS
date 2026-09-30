const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'espacios.json');

// Middleware para procesar JSON y servir archivos estáticos desde la carpeta 'public'
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta explícita para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas explícitas para el panel de administración (soporta /admin y /admin.html)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API: Obtener todos los espacios registrados
app.get('/api/espacios', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) {
        return res.json([]);
    }
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos.' });
    }
});

// API: Registrar un nuevo espacio
app.post('/api/espacios', (req, res) => {
    let espacios = [];
    if (fs.existsSync(DATA_FILE)) {
        try {
            espacios = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        } catch (e) {
            espacios = [];
        }
    }

    const nuevoEspacio = {
        id: Date.now(),
        titulo: req.body.titulo,
        programa: req.body.programa,
        autor: req.body.autor,
        email: req.body.email,
        url: req.body.url
    };

    espacios.push(nuevoEspacio);

    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(espacios, null, 2), 'utf8');
        res.status(201).json({ mensaje: 'Espacio registrado con éxito', espacio: nuevoEspacio });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el archivo.' });
    }
});

// API: Eliminar un espacio por ID (para el administrador)
app.delete('/api/espacios/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!fs.existsSync(DATA_FILE)) {
        return res.status(404).json({ error: 'No hay registros.' });
    }

    try {
        let espacios = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const filtrados = espacios.filter(e => e.id !== id);
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(filtrados, null, 2), 'utf8');
        res.json({ mensaje: 'Registro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el registro.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
