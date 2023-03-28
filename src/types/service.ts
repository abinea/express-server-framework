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
	values: Partial<Data>
}

export type FindResult<Data> = Array<Data | null>
export type ModifyResult<Data> = Data | null
export type RemoveResult = boolean | void
export type CreateResult<Data> = Data

export type ServiceAPI<Args = unknown, Res = unknown> = (
	args: Args
) => Promise<Res>
