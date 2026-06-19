import multer from 'multer';
import path from 'path';
import { BadRequestError } from '@/shared/app-error';
import { AuthRequest } from '@/middlewares/auth-middleware';


const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, path.join(process.cwd(),'uploads'));
	},
	filename(req, file, callback) {
		callback(null, `${Date.now()}-${file.originalname}`);
	},
})

const fileFilter = (req: AuthRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	const allowedTypes = /jpeg|png|webp|jpg/;
	const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

	if(isValid) {
		cb(null,true);
	}
	else {
		cb(new BadRequestError('Selected File Type is not supported'));
	}
}

export const upload = multer({
	fileFilter,
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024
	}
});




