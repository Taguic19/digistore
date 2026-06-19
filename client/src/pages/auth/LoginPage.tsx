import {useForm, type SubmitHandler} from 'react-hook-form'
import {Shopware} from '@thesvg/react'
import { Link } from 'react-router-dom'
import { loginSchema, type LoginData } from '../../types/auth-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
	const navigate = useNavigate();
	const {register, reset, formState: {errors}, handleSubmit} = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const loginUser: SubmitHandler<LoginData> = async (userData) => {
		try{
		const res = await fetch('/api/v1/auth/login',{
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(userData)
		});
		if(!res.ok) {
			throw new Error(res.status === 401 ? 'Email or Password is Invalid': 'Login Failed');
		}

		toast.success('Signed in Sucessfully', {
			style: {
				color: 'green'
			}
		});
		reset();
		navigate('/home');
		}
		catch(err){
			console.error(err);
				if(err instanceof Error) {
					toast.error(err.message, {
						style: {
							color: 'red'
						}
					});
				}
		}
	}

	return (
		
		<div className='flex-1 flex justify-center items-center bg-white'>
			<form onSubmit={handleSubmit(loginUser)}>
				<div className='flex gap-x-2 items-center mb-6 justify-center'>
					<Shopware width='40' fill='black' />
					<span>Signin and Start Shopping.</span>
				</div>
				<div className='auth-field-container'>
					<label htmlFor="email">Email</label>
					<input {...register('email')} type="email" placeholder='Enter valid email address:' id='email' className='auth-field' />
					{errors.email && <span className='field-error'>{errors.email.message}</span> }

				</div>
				
				<div className='auth-field-container'>
					<label htmlFor="password">Password</label>
					<input {...register('password')} type="password" placeholder='Enter password here:' id='password' className='auth-field' />
					{errors.password && <span className='field-error'>{errors.password.message}</span> }

				</div>
				
				<button type='submit' className='auth-button'>Signin</button>
				<p className='mt-2'>Don't have an account? <Link className='text-blue-700 font-semibold' to='/register'>Register</Link> </p>
			</form>
		</div>	
		
		
	)
}

export default LoginPage