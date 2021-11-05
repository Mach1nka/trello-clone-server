import app from './app/app';

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}!`);
});
