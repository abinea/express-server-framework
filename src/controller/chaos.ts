import type { Handler } from "../types/controller"
import { Router } from "express"
import cc from "../utils/cc"
const ASYNC_MS = 800

class ChaosController {
	async init() {
		const router = Router()
		router.get("/sync-error-handle", this.getSyncErrorHandle)
		router.get("/sync-error-throw", this.getSyncErrorThrow)
		router.get("/thunk-error-handle", this.getThunkErrorHandle)
		router.get("/thunk-error-throw", this.getThunkErrorThrow)
		router.get("/promise-error-handle", this.getPromiseErrorHandle)
		router.get("/promise-error-throw", this.getPromiseErrorThrow)
		router.get(
			"/promise-error-throw-with-catch",
			this.getPromiseErrorThrowWithCatch
		)
		return router
	}

	getSyncErrorHandle: Handler = (req, res, next) => {
		// 异常被捕获并处理
		next(new Error("Chaos test - sync error handle"))
	}
	getSyncErrorThrow = () => {
		// 异常被捕获并处理
		throw new Error("Chaos test - sync error throw")
	}
	getThunkErrorHandle: Handler = (req, res, next) => {
		setTimeout(() => {
			// 异常被捕获并处理
			next(new Error("Chaos test - thunk error handle"))
		}, ASYNC_MS)
	}
	getThunkErrorThrow = () => {
		setTimeout(() => {
			// 引起进程异常关闭
			throw new Error("Chaos test - thunk error throw")
		}, ASYNC_MS)
	}
	getPromiseErrorHandle: Handler = async (req, res, next) => {
		await new Promise((resolve) => {
			setTimeout(resolve, ASYNC_MS)
		})
		// 异常被捕获并处理
		next(new Error("Chaos test - promise error handle"))
	}
	getPromiseErrorThrow = async () => {
		await new Promise((resolve) => {
			setTimeout(resolve, ASYNC_MS)
		})
		// 引起进程警告并关闭
		throw new Error("Chaos test - promise error throw")
	}
	getPromiseErrorThrowWithCatch = cc(async () => {
		await new Promise((resolve) => {
			setTimeout(resolve, ASYNC_MS)
		})
		// 引起进程警告并关闭
		throw new Error("Chaos test - promise error throw with catch")
	})
}

export default async () => {
	const c = new ChaosController()
	return await c.init()
}
