import { DeleteResult, getRepository, Repository } from "typeorm";

import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";

import { CarImage } from "../entities/CarImage";

class CarsImagesRepository implements ICarsImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const carImage = this.repository.create({ car_id, image_name });

    return this.repository.save(carImage);
  }

  findById(id: string): Promise<CarImage> {
    return this.repository.findOne(id);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}

export { CarsImagesRepository };
