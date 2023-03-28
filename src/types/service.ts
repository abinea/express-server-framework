export type FindArgs = {
	id?: string
	pageIndex?: number
	pageSize?: number
}
export interface ModifyArgs<Data> {
	id: string
	values: Partial<Data>
}
export interface RemoveArgs {
	id: string
}
export interface CreateArgs<Data> {
	values: Data
}

export type FindResult<Data> = Array<Data>
export type ModifyResult<Data> = Data | null
export type RemoveResult = boolean
export type CreateResult<Data> = {
	id: string
} & Data

export type ServiceAPI<Args = unknown, Res = unknown> = (
	args: Args
) => Promise<Res>
