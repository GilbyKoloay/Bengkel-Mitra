export default function Res(
  res,
  statusCode=200,
  payload=null,
  message=null
) {
  return res.status(statusCode).json({payload, message});
};
