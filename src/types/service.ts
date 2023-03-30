import type { FindOptions } from "sequelize"

export interface FindArgs extends FindOptions {
	id?: string
	pageIndex?: number
	pageSize?: number
	logging?: (sql: string, timing?: number) => void
}
export interface ModifyArgs<Data> {
	id: string
	values: Partial<Data>
	logging: (sql: string, timing?: number) => void
}
export interface RemoveArgs {
	id: string
	logging: (sql: string, timing?: number) => void
}
export interface CreateArgs<Data> {
	values: Partial<Data>
	logging: (sql: string, timing?: number) => void
}

export type FindResult<Data> = Data | null | (Data | null)[]
export type ModifyResult<Data> = Data | null
export type RemoveResult = boolean | void
export type CreateResult<Data> = Data

export type ServiceAPI<Args = unknown, Res = unknown> = (
	args: Args
) => Promise<Res>
