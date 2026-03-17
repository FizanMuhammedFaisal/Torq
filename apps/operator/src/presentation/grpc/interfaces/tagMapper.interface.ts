import type {
	TagInfo,
	GetTagByIdRequest,
	GetTagsRequest,
} from '@togatherlabs/shared-protos/experienceservice/tags/v1';
import type { GetTagByIdInputDto } from '@dtos/tags/getTagById.dto';
import type { GetTagsQueryDto } from '@dtos/tags/getTags.dto';

export interface TagAppData {
	id: string;
	name: string;
	icon: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface ITagRPCMapper {
	/**
	 * Maps a GetTagByIdRequest proto to application DTO
	 */
	fromProtoGetTagByIdRequest(request: GetTagByIdRequest): GetTagByIdInputDto;

	/**
	 * Maps a GetTagsRequest proto to application DTO
	 */
	fromProtoGetTagsRequest(request: GetTagsRequest): Partial<GetTagsQueryDto>;

	/**
	 * Maps application tag data to TagInfo proto message
	 */
	toProtoTagInfo(tag: TagAppData): TagInfo;
}
