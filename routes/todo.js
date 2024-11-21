const express = require('express');
const router = express.Router();

let todos = [
    {
        id: 1, nama: 'John Doe', jenisKelamin: 'Laki-laki', noTelepon: '08123456789', alamat: 'Jl. Raya No. 1', jabatan: 'Zookeeper'
    },
    {
        id: 2, nama: 'Jane Smith', jenisKelamin: 'Perempuan', noTelepon: '08234567890', alamat: 'Jl. Merdeka No. 2', jabatan: 'Veterinarian'
    },
    {
        id: 3, nama: 'Budi Santoso', jenisKelamin: 'Laki-laki', noTelepon: '08345678901', alamat: 'Jl. Pahlawan No. 3', jabatan: 'Curator'
    }
];

// Endpoint to get all todos (employees)
router.get('/', (req, res) => {
    res.json(todos);
});

// Endpoint to add a new todo (employee)
router.post('/add', (req, res) => {
    const { nama, jenisKelamin, noTelepon, alamat, jabatan } = req.body;

    // Input validation
    if (!nama || !jenisKelamin || !noTelepon || !alamat || !jabatan) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const newTodo = {
        id: todos.length + 1,
        nama, jenisKelamin, noTelepon, alamat, jabatan
    };

    todos.push(newTodo);
    res.status(201).json({ message: 'Data berhasil ditambahkan', todos });
});

// Endpoint to delete a todo (employee) by ID
router.delete('/delete/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    if (isNaN(todoId)) {
        return res.status(400).json({ message: 'Invalid todo ID.' });
    }

    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex === -1) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.status(200).json({ message: `Data '${deletedTodo.nama}' telah dihapus`, todos });
});

// Endpoint to update a todo (employee) by ID
router.put('/update/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const { nama, jenisKelamin, noTelepon, alamat, jabatan } = req.body;

    if (isNaN(todoId)) {
        return res.status(400).json({ message: 'Invalid todo ID.' });
    }

    const todo = todos.find(t => t.id === todoId);
    if (!todo) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    // Update fields if provided
    todo.nama = nama || todo.nama;
    todo.jenisKelamin = jenisKelamin || todo.jenisKelamin;
    todo.noTelepon = noTelepon || todo.noTelepon;
    todo.alamat = alamat || todo.alamat;
    todo.jabatan = jabatan || todo.jabatan;

    res.status(200).json({ message: `Tugas dengan ID: ${todo.id} telah diperbarui`, todos });
});

module.exports = router;