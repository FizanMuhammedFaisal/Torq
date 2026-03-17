import type { HandlerContext } from '@connectrpc/connect';
import type {
	GetTagByIdRequest,
	GetTagByIdResponse,
	GetTagsRequest,
	GetTagsResponse,
} from '@togatherlabs/shared-protos/experienceservice/tags/v1';

export interface ITagRPCController {
	getTagById(request: GetTagByIdRequest, context: HandlerContext): Promise<GetTagByIdResponse>;
	getTags(request: GetTagsRequest, context: HandlerContext): Promise<GetTagsResponse>;
}
