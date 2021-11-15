import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefresTokenUseCase } from "./RefreshTokenUseCase";

class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const token =
      request.headers["x-access-token"] ||
      request.body.token ||
      request.query.token;

    const refreshTokenUseCase = container.resolve(RefresTokenUseCase);

    const refreshToken = await refreshTokenUseCase.execute(token);

    return response.json(refreshToken);
  }
}

export { RefreshTokenController };
