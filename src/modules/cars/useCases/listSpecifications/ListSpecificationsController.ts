import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListSpecificationsUseCase } from "./ListSpecificationsUseCase";

class ListSpecificationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listSpecificationsUseCase = container.resolve(
      ListSpecificationsUseCase
    );
    const specifications = await listSpecificationsUseCase.execute();
    return response.json(specifications);
  }
}

export { ListSpecificationsController };
