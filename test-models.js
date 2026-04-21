const apiKey = 'AIzaSyBbJVhwct_UchdPNEbBS0jG9roAwHK22e8';

async function listModels() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    console.log(data.models.map(m => m.name).filter(n => n.includes('flash')));
  } catch (err) {
    console.error(err);
  }
}
listModels();
