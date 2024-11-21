const busEndpoints = (db) => {
    const getBusById = (req, res) => {
        const { id } = req.params;
        const sql = `SELECT * FROM buses WHERE id = ?`;

        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(400).send(err.message);
            }
            if (!row) {
                return res.status(404).send('Nie znaleziono autobusu.');
            }
            res.status(200).json(row);
        });
    };

    const getBuses = (req, res) => {
        const sql = `SELECT * FROM buses`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(200).json(rows);
        });
    };

    const newBus = (req, res) => {
        const { bus_number, capacity, model } = req.body;

        if (!bus_number || !capacity || !model) {
            return res.status(400).send('Bus number, capacity i model są wymagane.');
        }

        const sql = `INSERT INTO buses (bus_number, capacity, model) VALUES (?, ?, ?)`;

        db.run(sql, [bus_number, capacity, model], function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(201).json({ id: this.lastID, bus_number, capacity, model });
        });
    };

    const updateBus = (req, res) => {
        const { id } = req.params;
        const { bus_number, capacity, model } = req.body;

        if (!bus_number || !capacity || !model) {
            return res.status(400).send('Bus number, capacity i model są wymagane.');
        }

        const sql = `UPDATE buses SET bus_number = ?, capacity = ?, model = ? WHERE id = ?`;

        db.run(sql, [bus_number, capacity, model, id], function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            if (this.changes === 0) {
                return res.status(404).send('Nie znaleziono autobusu do zaktualizowania.');
            }
            res.status(200).json({ id, bus_number, capacity, model });
        });
    };

    const patchBus = (req, res) => {
        const { id } = req.params;
        const { bus_number, capacity, model } = req.body;

        const fields = [];
        const values = [];

        if (bus_number) {
            fields.push('bus_number = ?');
            values.push(bus_number);
        }
        if (capacity) {
            fields.push('capacity = ?');
            values.push(capacity);
        }
        if (model) {
            fields.push('model = ?');
            values.push(model);
        }

        if (fields.length === 0) {
            return res.status(400).send('Brak pól do zaktualizowania.');
        }

        const sql = `UPDATE buses SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        db.run(sql, values, function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            if (this.changes === 0) {
                return res.status(404).send('Nie znaleziono autobusu do zaktualizowania.');
            }
            res.status(200).send('Zaktualizowano autobus.');
        });
    };

    const deleteBus = (req, res) => {
        const { id } = req.params;
        const sql = `DELETE FROM buses WHERE id = ?`;

        db.run(sql, [id], function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            if (this.changes === 0) {
                return res.status(404).send('Nie znaleziono autobusu do usunięcia.');
            }
            res.status(204).send();
        });
    };

    return { getBusById, getBuses, newBus, updateBus, patchBus, deleteBus };
};

module.exports = { busEndpoints };
