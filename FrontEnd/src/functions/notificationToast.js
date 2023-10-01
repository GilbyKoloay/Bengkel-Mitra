import { toast } from 'react-toastify';



export default function notificationToast(
  title='',
  body='',
  theme='default',
  usePromise=false,
  dismissToast=null,
  updateToast=null
) {
  const content = (
    <div className='text-neutral-900' style={{fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"}}>
      <div className='font-bold'>{title}</div>
      {body && <div className='mt-2'>{body}</div>}
    </div>
  );



  if (usePromise) return toast.loading(content);
  if (dismissToast) return toast.dismiss(dismissToast);
  if (updateToast) return toast.update(updateToast, {
    render: content,
    type: theme,
    isLoading: false,
    autoClose: 2500
  });
  if (theme !== 'default') return toast[theme](content);
  return toast(content);
};
