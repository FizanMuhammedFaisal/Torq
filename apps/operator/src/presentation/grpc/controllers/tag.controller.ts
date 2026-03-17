import type { IGetTagByIdUseCase } from '@application/ports/usecases/tags/IGetTagById.usecase';
import type { IGetTagsUseCase } from '@application/ports/usecases/tags/IGetTags.usecase';
import { create } from '@bufbuild/protobuf';
import { TYPES } from '@config/types';
import type { HandlerContext } from '@connectrpc/connect';
import { GetTagByIdInputDtoSchema } from '@dtos/tags/getTagById.dto';
import { GetTagsQuerySchema } from '@dtos/tags/getTags.dto';
import type {
	GetTagByIdRequest,
	GetTagByIdResponse,
	GetTagsRequest,
	GetTagsResponse,
} from '@togatherlabs/shared-protos/experienceservice/tags/v1';
import {
	GetTagByIdResponseSchema,
	GetTagsResponseSchema,
	PaginationSchema,
} from '@togatherlabs/shared-protos/experienceservice/tags/v1';
import { inject, injectable } from 'inversify';
import { validate } from '../dtos/validator';
import type { ITagRPCController } from '../interfaces/controller.interface';
import type { ITagRPCMapper } from '../interfaces/tagMapper.interface';
import { extractAccountContextOptional } from '../utils/context.utils';

@injectable()
export class TagRPCController implements ITagRPCController {
	constructor(
		@inject(TYPES.GetTagByIdUseCase) private readonly _getTagByIdUseCase: IGetTagByIdUseCase,
		@inject(TYPES.GetTagsUseCase) private readonly _getTagsUseCase: IGetTagsUseCase,
		@inject(TYPES.TagRPCMapper) private readonly _tagRPCMapper: ITagRPCMapper,
	) {}

	async getTagById(
		request: GetTagByIdRequest,
		_context: HandlerContext,
	): Promise<GetTagByIdResponse> {
		const mapped = this._tagRPCMapper.fromProtoGetTagByIdRequest(request);
		const { id } = validate(GetTagByIdInputDtoSchema, mapped);

		const tag = await this._getTagByIdUseCase.execute({ id });

		return create(GetTagByIdResponseSchema, {
			tag: this._tagRPCMapper.toProtoTagInfo(tag),
		});
	}

	async getTags(request: GetTagsRequest, context: HandlerContext): Promise<GetTagsResponse> {
		const account = extractAccountContextOptional(context);
		const mapped = this._tagRPCMapper.fromProtoGetTagsRequest(request);
		const validated = validate(GetTagsQuerySchema, mapped);
		const result = await this._getTagsUseCase.execute({
			...validated,
			account,
		});
		return create(GetTagsResponseSchema, {
			tags: result.data.map((tag) => this._tagRPCMapper.toProtoTagInfo(tag)),
			pagination: create(PaginationSchema, result.pagination),
		});
	}
}
