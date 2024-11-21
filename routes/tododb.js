const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Import database connection

// Endpoint to get all employees
router.get('/', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint to get an employee by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM employees WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Employee not found');
        res.json(results[0]);
    });
});

// Endpoint to add a new employee
router.post('/', (req, res) => {
    const { nama, jenisKelamin, noTelepon, alamat, jabatan } = req.body;

    // Validation for required fields
    if (!nama || !jenisKelamin || !noTelepon || !alamat || !jabatan) {
        return res.status(400).send('All fields are required');
    }

    db.query('INSERT INTO employees (nama, jenisKelamin, noTelepon, alamat, jabatan) VALUES (?, ?, ?, ?, ?)', 
        [nama.trim(), jenisKelamin.trim(), noTelepon.trim(), alamat.trim(), jabatan.trim()],
        (err, results) => {
            if (err) return res.status(500).send('Internal Server Error');
            const newEmployee = { 
                id: results.insertId, 
                nama, 
                jenisKelamin, 
                noTelepon, 
                alamat, 
                jabatan 
            };
            res.status(201).json(newEmployee);
        }
    );
});

// Endpoint to update an employee's information
router.put('/:id', (req, res) => {
    const { nama, jenisKelamin, noTelepon, alamat, jabatan } = req.body;

    // Validation for required fields
    if (!nama || !jenisKelamin || !noTelepon || !alamat || !jabatan) {
        return res.status(400).send('All fields are required');
    }

    db.query('UPDATE employees SET nama = ?, jenisKelamin = ?, noTelepon = ?, alamat = ?, jabatan = ? WHERE id = ?', 
        [nama.trim(), jenisKelamin.trim(), noTelepon.trim(), alamat.trim(), jabatan.trim(), req.params.id], 
        (err, results) => {
            if (err) return res.status(500).send('Internal Server Error');
            if (results.affectedRows === 0) return res.status(404).send('Employee not found');
            res.json({ id: req.params.id, nama, jenisKelamin, noTelepon, alamat, jabatan });
        }
    );
});

// Endpoint to delete an employee
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM employees WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Employee not found');
        res.status(204).send();
    });
});

module.exports = router;