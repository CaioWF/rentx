import { inject, injectable } from "tsyringe";
import { DeleteResult } from "typeorm";

import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { AppError } from "@shared/errors/AppError";
import { deleteFile } from "@utils/file";

interface IRequest {
  id: string;
}

@injectable()
class DeleteCarImageUseCase {
  constructor(
    @inject("CarsImagesRepository")
    private carsImagesRepository: ICarsImagesRepository
  ) {}

  async execute({ id }: IRequest): Promise<void> {
    const imageCar = await this.carsImagesRepository.findById(id);

    if (!imageCar) throw new AppError("Imagem não encontrada");

    await this.carsImagesRepository.delete(id);

    await deleteFile(`./tmp/cars/${imageCar.image_name}`);
  }
}

export { DeleteCarImageUseCase };
