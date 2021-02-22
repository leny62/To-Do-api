import server from './app';

const PORT = process.env.PORT || 5000;
// eslint-disable-next-line no-console
server.listen(PORT, () => console.log(`App listening on port ${PORT}`));
// eslint-disable-next-line no-console
