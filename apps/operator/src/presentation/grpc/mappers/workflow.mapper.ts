// import { injectable } from 'inversify';
// import { create } from '@bufbuild/protobuf';
// import {
// 	SortBy,
// 	SortOrder,
// 	TagInfoSchema,
// 	type TagInfo,
// } from '@togatherlabs/shared-protos/experienceservice/tags/v1';
// import type {
// 	GetTagsRequest,
// 	GetTagByIdRequest,
// } from '@togatherlabs/shared-protos/experienceservice/tags/v1';
// import type { TagSortableField, GetTagsQueryDto } from '@dtos/tags/getTags.dto';
// import type { GetTagByIdInputDto } from '@dtos/tags/getTagById.dto';
// import type { ITagRPCMapper, TagAppData } from '../interfaces/tagMapper.interface';

import type {
    TriggerRunInput,
    TriggerType as DomainTriggerType,
} from '@/application/dto/triggerRun';
import { TriggerType, type TriggerWorkflowRunRequest } from '@torq-system/grpc';
import type { IWorkflowRPCMapper } from '../interfaces/mappers/workflow.interface';

// function mapSortBy(sortBy: SortBy | undefined): TagSortableField | undefined {
// 	switch (sortBy) {
// 		case SortBy.NAME:
// 			return 'name';
// 		case SortBy.CREATED_AT:
// 			return 'createdAt';
// 		case SortBy.UPDATED_AT:
// 			return 'updatedAt';
// 		case SortBy.UNSPECIFIED:
// 		default:
// 			return undefined;
// 	}
// }

// function mapSortOrder(sortOrder: SortOrder | undefined): 'asc' | 'desc' | undefined {
// 	switch (sortOrder) {
// 		case SortOrder.ASC:
// 			return 'asc';
// 		case SortOrder.DESC:
// 			return 'desc';
// 		case SortOrder.UNSPECIFIED:
// 		default:
// 			return undefined;
// 	}
// }

// @injectable()
// export class TagRPCMapper implements ITagRPCMapper {
// 	fromProtoGetTagByIdRequest(request: GetTagByIdRequest): GetTagByIdInputDto {
// 		return {
// 			id: request.id,
// 		};
// 	}

// 	fromProtoGetTagsRequest(request: GetTagsRequest): Partial<GetTagsQueryDto> {
// 		return {
// 			page: request.page,
// 			limit: request.limit,
// 			search: request.search,
// 			name: request.name,
// 			sortBy: mapSortBy(request.sortBy),
// 			sortOrder: mapSortOrder(request.sortOrder),
// 			includeDeleted: request.includeDeleted,
// 		};
// 	}

// 	toProtoTagInfo(tag: TagAppData): TagInfo {
// 		return create(TagInfoSchema, {
// 			id: tag.id,
// 			name: tag.name,
// 			icon: tag.icon,
// 			deletedAt: tag.deletedAt?.toISOString(),
// 			createdAt: tag.createdAt.toISOString(),
// 			updatedAt: tag.updatedAt.toISOString(),
// 		});
// 	}
// }

export class WorkflowMapper implements IWorkflowRPCMapper {
    fromProtoGetTriggerWorkflowRunRequest(request: TriggerWorkflowRunRequest): TriggerRunInput {
        return {
            workflowId: request.workflowId,
            versionId: request.versionId,
            torqVersion: request.torqVersion,
            triggerType: this.mapTriggerType(request.triggerType),
        };
    }

    private mapTriggerType(triggerType: TriggerType): DomainTriggerType {
        switch (triggerType) {
            case TriggerType.MANUAL:
                return 'MANUAL';
            case TriggerType.WEBHOOK:
                return 'WEBHOOK';
            case TriggerType.SCHEDULE:
                return 'SCHEDULE';
            default:
                return "MANUAL"
        }
    }
}
