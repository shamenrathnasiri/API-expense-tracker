const express = require('express');
const core = require(cors);
require(dotenv).config();

const app = express();
app.use(express.json());
app.use(core());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
