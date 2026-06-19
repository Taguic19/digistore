import {type ReactNode} from 'react';


type Props = {
	children: ReactNode
}

const RouteGuard = ({children}: Props) => {

	return (
		<div>Route Guard</div>
	)

}

export default RouteGuard;