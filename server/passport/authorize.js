export default function authorize (request, throwError=new Error('Unauthorized')) {
  if(!request.user)
    throw throwError
}
