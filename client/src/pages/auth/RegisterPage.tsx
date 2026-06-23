import {useForm, type SubmitHandler} from 'react-hook-form'
import {Shopware} from '@thesvg/react'
import { Link } from 'react-router-dom'
import {type RegisterData, registerSchema } from '../../types/auth-types'
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';

const RegisterPage = () => {


	const {register, reset, formState: {errors}, handleSubmit} = useForm<RegisterData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			name: '',
			password: '',
			confirmPassword: '',
			role: 'CUSTOMER'
		}
	});


	const registerUser: SubmitHandler<RegisterData> = async (userData) => {
			const {confirmPassword, ...payload} = userData;
			try{
			const res = await fetch('/api/v1/users',{
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if(!res.ok) {
					throw new Error(res.status === 409 ? 'Email is already taken': 'Failed to register user');
				}
			toast.success('Registered Successfully', {
				style: {
					color: 'green'
				}
			});
			reset();
			}
			catch(err) {
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
			<form onSubmit={handleSubmit(registerUser)}>
				<div className='flex gap-x-2 items-center mb-6 justify-center '>
					<Shopware width='40' fill='black' />
					<span>Signup and Start Shopping.</span>
				</div>
				<div className='auth-field-container'>
					<label htmlFor="name">Name</label>
					<input type="text" {...register('name')}  placeholder='Enter Full Name:' id='name' className='auth-field' />
					{errors.name && <span className='field-error'>{errors.name.message}</span> }
				</div>
				<div className='auth-field-container'>
					<label htmlFor="email">Email</label>
					<input type="email" {...register('email')} placeholder='Enter valid email:' id='email' className='auth-field' />
					{errors.email && <span className='field-error'>{errors.email.message}</span> }

				</div>
				<div className='auth-field-container'>
					<label htmlFor="password">Password</label>
					<input type="password" {...register('password')} placeholder='Enter password here:' id='password' className='auth-field' />
					{errors.password && <span className='field-error'>{errors.password.message}</span> }

				</div>
				<div className='auth-field-container'>
					<label htmlFor="confirm-password">Confirm Password</label>
					<input type="password" {...register('confirmPassword')} placeholder='Enter password here:' id='confirm-password' className='auth-field' />
					{errors.confirmPassword && <span className='field-error'>{errors.confirmPassword.message}</span> }

				</div>
				<div className='auth-field-container'>
					<label htmlFor="role">Choose what you want to be</label>
					<select {...register('role')} className='auth-field'>
						<option value="CUSTOMER">Customer</option>
						<option value="SELLER">Seller</option>
					</select>
				</div>
				<button type='submit' className='auth-button'>Signup</button>
				<p className='mt-2'>Already have an account? <Link className='text-blue-700 font-semibold' to='/'>Signin</Link> </p>

			</form>
		</div>	
		
	)
}

export default RegisterPage