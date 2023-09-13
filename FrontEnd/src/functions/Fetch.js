const backendURL = process.env.REACT_APP_BACKEND_URL;



export default async function Fetch(
  url,
  method='GET',
  body=undefined
) {
  try {
    const init = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    await new Promise(res => setTimeout(res, 1000));
    const req = await fetch(`${backendURL}/api${url}`, init);
    const res = await req.json();
    
    return {
      ok: req.ok,
      status: req.status,
      ...res
    };
  }
  catch (err) {
    console.log('Fetch error.', err);

    if (err?.message?.includes('NetworkError when attempting to fetch resource.')) return {
      ok: false,
      payload: null,
      message: 'Jaringan bermasalah.'
    }

    return {
      ok: false,
      payload: null,
      message: 'Terjadi kesalahan pada aplikasi.'
    };
  }
};
