const activeDateSpanRoutes = (db) => {
    const getActiveDateSpansById = (req, res) => {
        const { id } = req.params;
        const sql = `SELECT * FROM active_date_spans WHERE id = ?`;

        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(400).send(err.message);
            }
            if (!row) {
                return res.status(404).send('Nie znaleziono aktywnego zakresu dat.');
            }
            res.status(200).json(row);
        });
    };

    const getActiveDateSpans = (req, res) => {
        const sql = `SELECT * FROM active_date_spans`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(200).json(rows);
        });
    };

    const newActiveDateSpans = (req, res) => {
        const { start_date, end_date } = req.body;

        if (!start_date || !end_date) {
            return res.status(400).send('Start_date i end_date są wymagane.');
        }

        const sql = `INSERT INTO active_date_spans (start_date, end_date) VALUES (?, ?)`;

        db.run(sql, [start_date, end_date], function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(201).json({ id: this.lastID, start_date, end_date });
        });
    };

     const updateActiveDateSpan = (req, res) => {
        const { id } = req.params;
        const { start_date, end_date } = req.body;

        if (!start_date || !end_date) {
            return res.status(400).send('Start_date i end_date są wymagane.');
        }

        const sql = `UPDATE active_date_spans SET start_date = ?, end_date = ? WHERE id = ?`;

        db.run(sql, [start_date, end_date, id], function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            if (this.changes === 0) {
                return res.status(404).send('Nie znaleziono aktywnego zakresu dat do zaktualizowania.');
            }
            res.status(200).json({ id, start_date, end_date });
        });
    };

    const patchActiveDateSpan = (req, res) => {
        const { id } = req.params;
        const { start_date, end_date } = req.body;

        const fields = [];
        const values = [];

        if (start_date) {
            fields.push('start_date = ?');
            values.push(start_date);
        }
        if (end_date) {
            fields.push('end_date = ?');
            values.push(end_date);
        }

        if (fields.length === 0) {
            return res.status(400).send('Brak pól do zaktualizowania.');
        }

        const sql = `UPDATE active_date_spans SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        db.run(sql, values, function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            if (this.changes === 0) {
                return res.status(404).send('Nie znaleziono zakresu dat do zaktualizowania.');
            }
            res.status(200).send('Zaktualizowano zakres dat.');
        });
    };

    const deleteActiveDateSpan = (req, res) => {
        const { id } = req.params;
        const sql = `DELETE FROM active_date_spans WHERE id = ?`;

        db.run(sql, [id], function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            if (this.changes === 0) {
                return res.status(404).send('Nie znaleziono aktywnego zakresu dat do usunięcia.');
            }
            res.status(204).send();
        });
    };

    return { getActiveDateSpansById, getActiveDateSpans, newActiveDateSpans, updateActiveDateSpan, patchActiveDateSpan, deleteActiveDateSpan };
};

module.exports = { activeDateSpanRoutes };