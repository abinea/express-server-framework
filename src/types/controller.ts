import type { NextFunction, Request, Response } from "express"

export type ControllerAPI<Params = {}, Body = {}, Query = {}, Res = any> = (
	req: Request<Params, {}, Body, Query>,
	res: Res & Omit<Response, "body">
) => Promise<void>

export type Handler = (req: Request, res: Response, next: NextFunction) => void
