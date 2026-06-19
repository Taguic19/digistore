import {useForm} from 'react-hook-form'
import {Shopware} from '@thesvg/react'
import { Outlet } from 'react-router-dom'
const Auth = () => {





	return (
		<div className="bg-stone-100 min-h-screen flex space-between">
		<div className=' flex-1 flex flex-col justify-center items-center'>
			<Shopware width='100' fill='black' />
			<h3 className='mt-2 text-3xl'>Your digital store, redefined.</h3>
		</div>
		<Outlet />
		</div>
	)
}

export default Auth