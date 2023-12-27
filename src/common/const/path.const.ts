import { join } from "path";

export const PROJECT_ROOT_PATH = process.cwd();

export const PUBLIC_FOLDER_NAME = 'public';

export const IMAGE_FOLDER_NAME = 'image';


export const PUBLIC_FOLDER_PATH = join(
    PROJECT_ROOT_PATH,
    PUBLIC_FOLDER_NAME,
)

export const IMAGE_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    IMAGE_FOLDER_NAME,
)


export const PUBLIC_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    IMAGE_FOLDER_NAME,
)