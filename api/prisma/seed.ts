import { PrismaClient } from '../generated/prisma/client'
import {PrismaPg} from '@prisma/adapter-pg'


const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});


export const prisma = new PrismaClient({adapter});



async function main() {

	const categories = [
		{name: 'Hardware'},
		{name: 'Sofware'},
		{name: 'Courses'},
		{name: 'Accessories'},
		{name: 'Gaming'}
	]

	for(let i = 0; i < categories.length; i++){
		await prisma.category.upsert({
			where: {name: categories[i].name},
			create: categories[i],
			update: {}
		});
	}

	console.log('categories seeded');
}

main().catch(err => {
	process.exit(1);
}).finally
{ async () => {
	await prisma.$disconnect();
}
}


