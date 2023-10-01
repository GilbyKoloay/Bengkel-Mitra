import { notificationToast } from './';



const backendURL = process.env.REACT_APP_BACKEND_URL;



export default async function Fetch(
  url='',
  method='GET',
  body=null,
  showReq=false,
  showRes=false
) {
  const reqToast = (showReq) ? notificationToast(showReq?.title, showReq?.body, 'default', true) : null;
  
  try {
    const _token = JSON.parse(sessionStorage.getItem('_token'));

    const init = {
      method,
      headers: {
        'authorization' : `Bearer ${_token}`,
        'Content-Type': 'application/json'
      }
    };
    if (body) init.body = JSON.stringify(body);

    const req = await fetch(`${backendURL}/api${url}`, init);
    const res = await req.json();

    if (res && reqToast) {
      if (showRes) notificationToast(req.ok ? 'Sukses' : 'Gagal', res.message, req.ok ? 'success' : 'error', false, null, reqToast);
      else notificationToast(null, null, null, null, reqToast);
    }
    
    return {
      ok: req.ok,
      status: req.status,
      ...res
    };
  }
  catch (err) {
    console.log('Fetch error.', err);

    if (reqToast) {
      if (showRes) notificationToast('Gagal', 'Jaringan bermasalah.', 'error', false, null, reqToast);
      else notificationToast(null, null, null, null, reqToast);
    }

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
